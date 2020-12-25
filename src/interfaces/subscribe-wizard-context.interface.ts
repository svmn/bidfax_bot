import { Scenes } from 'telegraf';
import { Context } from './context.interface';
import { WizardContextWizardWithState } from './wizard-state-context.inteface';

interface SubscribeWizardState {
  manufacturer?: string;
  modelName?: string;
  sinceYear?: number;
  tillYear?: number;
}

export interface SubscribeWizardContext extends Context {
  scene: Scenes.SceneContextScene<SubscribeWizardContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: WizardContextWizardWithState<SubscribeWizardContext, SubscribeWizardState>;
}

// export interface SubscribeWizardContext extends TelegrafContext {
//   scene: Scenes.SceneContextScene<SubscribeWizardContext, SubscribeWizardSession>;
//   wizard: Scenes.WizardContextWizard<SubscribeWizardContext>;
// }
