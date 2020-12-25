import { match } from '@edjopato/telegraf-i18n';

import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

import { BOT_TOKEN, SUBSCRIBE_WIZARD } from '../tokens';
import { Bot, Context } from '../interfaces';
import { SubscribeWizard } from './subscribe.wizard';
import { Scenes } from 'telegraf';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BotService.name);

  constructor(@Inject(BOT_TOKEN) private readonly bot: Bot, private readonly subscribeWizard: SubscribeWizard) {}

  public async onApplicationBootstrap() {
    this.bot.start(ctx => this.start(ctx));
    this.bot.hears(match('subscribe'), ctx => this.enterSubscribe(ctx as any));
    this.bot.catch((err: any, ctx: Context) => {
      this.logger.error(`Encountered an error for ${ctx.updateType}`, err);
    });
    await this.bot.launch();
  }

  private async start(ctx: Context) {
    await ctx.reply(ctx.i18n.t('intro'), {
      reply_markup: {
        keyboard: [[{ text: ctx.i18n.t('subscribe') }, { text: ctx.i18n.t('mySubscriptions') }]],
        resize_keyboard: true,
      },
    });
  }

  private async enterSubscribe(ctx: Scenes.SceneContext) {
    await ctx.scene.enter(SUBSCRIBE_WIZARD);
  }
}
