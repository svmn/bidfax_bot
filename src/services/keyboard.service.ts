import { I18n } from '@edjopato/telegraf-i18n';

import { Inject, Injectable } from '@nestjs/common';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { I18N_TOKEN } from '../tokens';

export interface CreateInlineKeyboardOptions {
  items: InlineKeyboardButton[];
  pageCallbackData: (page: number) => string;
  page: number;

  rows: number;
  columns: number;
  locale: string;
}

interface PaginationOptions {
  pageCallbackData: (page: number) => string;
  page: number;
  total: number;
  perPage: number;
  locale: string;
}

@Injectable()
export class KeyboardService {
  constructor(@Inject(I18N_TOKEN) private readonly i18n: I18n) {}

  public createInlineKeyboard(options: CreateInlineKeyboardOptions): InlineKeyboardButton[][] {
    const { items, rows, columns, page } = options;
    const perPage = rows * columns;
    const offset = page * perPage;

    const displayItems = items.slice(offset, offset + perPage);

    const keyboard: InlineKeyboardButton[][] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const item = displayItems[index];
        if (item) {
          keyboard[row] = keyboard[row] || [];
          keyboard[row][col] = item;
        }
      }
    }

    const total = items.length;

    if (total > perPage) {
      const pagination = this.getPaginationRow({ ...options, total, perPage });
      keyboard.push(pagination);
    }

    return keyboard;
  }

  private getPaginationRow(options: PaginationOptions): InlineKeyboardButton[] {
    const { page, total, perPage } = options;
    const lastPage = Math.floor(total / perPage);

    if (page === 0) {
      return [this.getNextPageButton({ ...options, page: 1 })];
    } else if (page > 0 && page < lastPage) {
      return [
        this.getPrevPageButton({ ...options, page: page - 1 }),
        this.getNextPageButton({ ...options, page: page + 1 }),
      ];
    } else if (page === lastPage) {
      return [this.getPrevPageButton({ ...options, page: page - 1 })];
    } else {
      throw new Error('Page is out of range');
    }
  }

  private getNextPageButton(options: PaginationOptions): InlineKeyboardButton {
    const { locale } = options;
    return this.getPageButton(this.i18n.t(locale, 'next'), options);
  }

  private getPrevPageButton(options: PaginationOptions): InlineKeyboardButton {
    const { locale } = options;
    return this.getPageButton(this.i18n.t(locale, 'prev'), options);
  }

  private getPageButton(text: string, options: PaginationOptions): InlineKeyboardButton {
    const { page, pageCallbackData } = options;
    const callbackData = pageCallbackData(page);
    return { text, callback_data: callbackData };
  }
}
