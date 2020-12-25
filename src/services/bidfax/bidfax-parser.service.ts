import cheerio from 'cheerio';

import { Injectable } from '@nestjs/common';

import { Lot, Manufacturer, ModelName } from '../../interfaces';

@Injectable()
export class BidfaxParserService {
  public async parseLotsPage(html: string): Promise<Lot[]> {
    const $page = cheerio.load(html);

    return $page('.grid .offer:has(.caption)')
      .map((index, element) => {
        const $element = cheerio(element);
        const url = $element.find('.caption > a').attr('href');
        const [, id] = url?.match(/.+\/([\w-]+)\.html$/i) || [];
        const rawTitle = $element.find('.caption h2').text();
        const [, title = rawTitle, vin] = rawTitle?.match(/(.+?)\s*\d?\s*vin: (.+)/i) || [];
        const price = $element.find('.prices').text();
        const imageUrl = $element.find('.img-wrapper img').attr('src');
        const rawAuction = $element.find('p:eq(0)').text();
        const [, auction = rawAuction] = rawAuction.match(/Auction:\s*(\w+)/i) || [];
        const lotNumber = $element.find('p:eq(1) span').text();
        const condition = $element.find('p:eq(2) span').text();
        const damage = $element.find('p:eq(3) span').text();
        const mileage = $element.find('p:eq(4) span').text();
        const dateOfSale = $element.find('p:eq(5) span').text();
        return {
          id,
          title,
          vin,
          url,
          price,
          imageUrl,
          auction,
          lotNumber,
          condition,
          damage,
          mileage,
          dateOfSale,
        };
      })
      .get();
  }

  public async parseManufacturers(html: string): Promise<Manufacturer[]> {
    const $page = cheerio.load(html);
    const options = $page('.drop-menu-main-sub').eq(0).find('a');
    return options
      .map((index, element) => {
        const $element = cheerio(element);

        const url = $element.attr('href');
        const title = $element.text();
        const [, id] = url?.match(/.+\/([\w-]+)\/$/i) || [];
        return {
          id,
          title,
        };
      })
      .get();
  }

  public async parseModelNames(html: string): Promise<ModelName[]> {
    const $page = cheerio.load(html);
    const options = $page('.drop-menu-main-sub').eq(1).find('a');
    return options
      .map((index, element) => {
        const $element = cheerio(element);

        const url = $element.attr('href');
        const title = $element.text();
        const [, id] = url?.match(/.+\/([\w-]+)\/$/i) || [];
        return {
          id,
          title,
        };
      })
      .get();
  }
}
