import { Network } from './network';
import { ViewManager } from './viewManager';
import { MenuView } from './menuView';
import { LoadingView } from './loadingView';
import { GameView } from './gameView';
import { Settings } from './settings';
import {Constants} from './constants';
import * as Input from './modules/input'


/*** GLOBALS ***/
let network: Network;

let viewManager: ViewManager;

function main(): void {
    Input.initialize();
    
    viewManager = ViewManager.getInstance();
    viewManager.addView(new MenuView(), true);
    viewManager.addView(new LoadingView());
    viewManager.addView(new GameView());
    // viewManager.addView(new Settings());

    viewManager.start();
}

main();
