import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { config } from '../../config';
import { BIDFAX_URL } from '../../constants';
import { NoContentError } from '../../errors';
import { PagingLotQueryParams } from '../../interfaces';

puppeteer.use(StealthPlugin());

@Injectable()
export class BidfaxApiService implements OnApplicationBootstrap , OnModuleDestroy {
  private readonly logger = new Logger(BidfaxApiService.name);

  private browser!: Browser;

  public async onApplicationBootstrap() {
    const proxyArg = config.proxyUri ? `--proxy-server=${config.proxyUri}` : '';
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', proxyArg],
    });
  }

  public async onModuleDestroy() {
    await this.browser.close();
  }

  private async fetch(url: string): Promise<string | undefined> {
    this.logger.log(`Requested ${url}`);
    const page = await this.browser.newPage();
    const response = await page.goto(url);
    const content = await response?.text();
    await page.close();
    return content;
  }

  public async fetchLots(params: PagingLotQueryParams): Promise<string> {
    const { manufacturer, modelName, sinceYear, tillYear, page } = params;
    const html = await this.fetch(
      `${BIDFAX_URL}/${manufacturer}/${modelName}/f/from-year=${sinceYear}/to-year=${tillYear}/page/${page}/`,
    );
    if (!html) {
      throw new NoContentError();
    }
    return html;
  }

  public async fetchMainPage(): Promise<string> {
    const html = await this.fetch(BIDFAX_URL);
    if (!html) {
      throw new NoContentError();
    }
    return html;
  }

  public async fetchLotsByManufacturer(manufacturer: string): Promise<string> {
    const html = await this.fetch(`${BIDFAX_URL}/${manufacturer}/`);
    if (!html) {
      throw new NoContentError();
    }
    return html;
  }
}
