import path from 'path';
import { I18n } from '@edjopato/telegraf-i18n';

import { Provider } from '@nestjs/common';

import { I18N_TOKEN } from '../tokens';

export const i18nProvider: Provider = {
  provide: I18N_TOKEN,
  useFactory: () =>
    new I18n({
      directory: path.resolve(__dirname, '../locales'),
      allowMissing: true,
      defaultLanguageOnMissing: true,
      defaultLanguage: 'en',
    }),
};
