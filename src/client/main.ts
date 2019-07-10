import { Network } from './network';
import { ViewManager } from './ui/viewManager';
import { MenuView } from './ui/menuView';
import { LoadingView } from './ui/loadingView';
import { GameView } from './ui/gameView';
import { SettingsView } from './ui/settingsView';
import { Constants } from './constants';
import * as Input from './modules/input';

/*** GLOBALS ***/
let network: Network;

let viewManager: ViewManager;

function main(): void {
    Input.initialize();

    viewManager = ViewManager.getInstance();
    viewManager.addView(new MenuView(), true);
    viewManager.addView(new LoadingView());
    viewManager.addView(new GameView());

    viewManager.start();
}

main();
