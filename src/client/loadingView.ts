import {HTMLView} from './view'
import { Network } from './network';
import { ViewManager } from './viewManager';
import {Constants} from './constants'

export class LoadingView extends HTMLView {
    
    public constructor() {
        super(document.getElementById('loading-screen'));
    }

    public didEnter() : void {
        super.didEnter();

        Network.getInstance().findGame();
        ViewManager.getInstance().sendMessage(2, Constants.LOAD_SCENE_MESSAGE);
    }

    public didReceiveMessage(message: string) : void {
        super.didReceiveMessage(message);
        if(message == Constants.SCENE_LOADED_MESSAGE) {
            ViewManager.getInstance().transition(2, true);
        }
    }
}