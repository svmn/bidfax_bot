import { Injectable } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { SubscribeWizardContext } from '../interfaces';
import { SUBSCRIBE_WIZARD } from '../tokens';
import { SubscribeWizardManufacturerStep } from './subscribe-wizard/manufacturer.step';

@Injectable()
export class SubscribeWizard {
  constructor(private readonly manufacturer: SubscribeWizardManufacturerStep) {}

  public getScene() {
    return new Scenes.WizardScene(SUBSCRIBE_WIZARD, this.manufacturerStep);
  }

  private manufacturerStep = async (ctx: SubscribeWizardContext) => {
    console.log(1);
    await ctx.reply('select manufacturer', {
      reply_markup: await this.manufacturer.getKeyboard(0, ctx),
    });
    return ctx.wizard.next();
  };
}
