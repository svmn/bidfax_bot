import { InlineKeyboardMarkup, InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { Injectable } from '@nestjs/common';

import { Context } from '../../interfaces';
import { BidfaxService } from '../bidfax';
import { KeyboardService } from '../keyboard.service';

@Injectable()
export class SubscribeWizardManufacturerStep {
  constructor(private readonly bidfax: BidfaxService, private readonly keyboard: KeyboardService) {}

  public async getKeyboard(page: number, ctx: Context): Promise<InlineKeyboardMarkup> {
    const manufacturers = await this.bidfax.getManufacturers();

    const buttons: InlineKeyboardButton[] = manufacturers.map(x => {
      const callbackDataObject = {
        step: 1,
        value: x.id,
      };

      return {
        text: x.title,
        callback_data: JSON.stringify(callbackDataObject),
      };
    });

    const keyboard = this.keyboard.createInlineKeyboard({
      items: buttons,
      page,
      pageCallbackData: page => JSON.stringify({ page, step: 1 }),
      rows: 4,
      columns: 3,
      locale: ctx.i18n.locale(),
    });

    return {
      inline_keyboard: keyboard,
    };
  }
}
