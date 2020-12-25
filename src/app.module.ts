import { Module } from '@nestjs/common';
import { botProvider, i18nProvider } from './providers';
import { cacheProvider } from './providers/cache.provider';
import {
  BidfaxApiService,
  BidfaxParserService,
  BidfaxService,
  BotService,
  KeyboardService,
  SubscribeWizard,
} from './services';
import { SubscribeWizardManufacturerStep } from './services/subscribe-wizard/manufacturer.step';

@Module({
  imports: [],
  controllers: [],
  providers: [
    BotService,
    BidfaxService,
    BidfaxApiService,
    BidfaxParserService,
    KeyboardService,
    cacheProvider,
    i18nProvider,
    botProvider,
    SubscribeWizard,
    SubscribeWizardManufacturerStep,
  ],
})
export class AppModule {}
