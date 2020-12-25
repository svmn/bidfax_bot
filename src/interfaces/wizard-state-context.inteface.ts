import { Scenes } from 'telegraf';
import { SceneContextScene, WizardSession, WizardSessionData } from 'telegraf/typings/scenes';
import { SessionContext } from 'telegraf/typings/session';

export interface WizardContextWizardWithState<
  C extends SessionContext<WizardSession> & {
    scene: SceneContextScene<C, WizardSessionData>;
  },
  S extends object
> extends Scenes.WizardContextWizard<C> {
  state: S;
}
