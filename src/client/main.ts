import { Network } from './network';
import { ViewManager } from './viewManager';
import { MenuView } from './menuView';
import { LoadingView } from './loadingView';
import { GameView } from './gameView';
import { Settings } from './settings';
import {Constants} from './constants';


/*** GLOBALS ***/
let network: Network;

let viewManager: ViewManager;

function main(): void {
    viewManager = ViewManager.getInstance();
    viewManager.addView(new MenuView(), true);
    viewManager.addView(new LoadingView());
    viewManager.addView(new GameView());
    // viewManager.addView(new Settings());

    viewManager.start();
}

main();
