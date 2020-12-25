import { Provider } from '@nestjs/common';
import { Telegraf, session, Scenes } from 'telegraf';
import { config } from '../config';
import { SubscribeWizardContext, Context } from '../interfaces';
import { BOT_TOKEN, I18N_TOKEN } from '../tokens';
import { I18n } from '@edjopato/telegraf-i18n';
import { SubscribeWizard } from '../services';

export const botProvider: Provider = {
  provide: BOT_TOKEN,
  useFactory: async (i18n: I18n, subscribeWizard: SubscribeWizard) => {
    const bot = new Telegraf<any>(config.telegramToken);
    bot.use(i18n.middleware());
    bot.use(session());
    const stage = new Scenes.Stage([subscribeWizard.getScene()]);
    bot.use(stage.middleware());
    return bot;
  },
  inject: [I18N_TOKEN, SubscribeWizard],
};
