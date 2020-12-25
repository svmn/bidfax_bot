import { getYear } from 'date-fns';
import NodeCache from 'node-cache';
import { from, range } from 'rxjs';
import { concatMap, delay, scan, takeWhile, tap } from 'rxjs/operators';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { config } from '../../config';
import { MIN_YEAR } from '../../constants';
import {
  BaseLotQueryParams,
  Lot,
  Manufacturer,
  ModelName,
  PagingLotQueryParams,
  SinceLotQueryParams,
} from '../../interfaces';
import { CACHE_TOKEN } from '../../tokens';
import { BidfaxApiService } from './bidfax-api.service';
import { BidfaxParserService } from './bidfax-parser.service';

@Injectable()
export class BidfaxService {
  private readonly logger = new Logger(BidfaxService.name);
  constructor(
    private readonly api: BidfaxApiService,
    private readonly parser: BidfaxParserService,
    @Inject(CACHE_TOKEN) private readonly cache: NodeCache,
  ) {}

  public async getLots(params: PagingLotQueryParams): Promise<Lot[]> {
    const html = await this.api.fetchLots(params);
    return this.parser.parseLotsPage(html);
  }

  public async getLotsSinceId(params: SinceLotQueryParams): Promise<Lot[]> {
    const { sinceLotId, ...inquiryParams } = params;

    const lots = await range(1, config.maxLotPagesToScan)
      .pipe(
        concatMap(page => from(this.getLots({ ...inquiryParams, page })).pipe(delay(config.requestDelayMs))),
        scan((acc, lots) => [...acc, ...lots], [] as Lot[]),
        takeWhile(lots => !lots.some(x => x.id === sinceLotId), true),
      )
      .toPromise();

    const lastSeenLotIndex = lots.findIndex(x => x.id === sinceLotId);

    return lastSeenLotIndex > -1 ? lots.slice(0, lastSeenLotIndex) : [];
  }

  public async getMostRecentLot(params: BaseLotQueryParams): Promise<Lot | undefined> {
    const [lot] = await this.getLots({ ...params, page: 0 });
    return lot;
  }

  public async getManufacturers(): Promise<Manufacturer[]> {
    const cacheKey = 'MANUFACTURERS';
    let manufacturers = this.cache.get<Manufacturer[]>(cacheKey);
    if (!manufacturers) {
      const html = await this.api.fetchMainPage();
      manufacturers = await this.parser.parseManufacturers(html);
      this.cache.set(cacheKey, manufacturers);
    }
    return manufacturers;
  }

  public async getModelNames(manufacturer: string): Promise<ModelName[]> {
    const cacheKey = `MODELS:${manufacturer}`;
    let modelNames = this.cache.get<ModelName[]>(cacheKey);
    if (!modelNames) {
      const html = await this.api.fetchLotsByManufacturer(manufacturer);
      modelNames = await this.parser.parseModelNames(html);
      this.cache.set(cacheKey, modelNames);
    }
    return modelNames;
  }

  public async getMinYear(): Promise<number> {
    return MIN_YEAR;
  }

  public async getMaxYear(): Promise<number> {
    return getYear(new Date());
  }
}
