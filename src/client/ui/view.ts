import {Network} from '../network';
import $ from 'jquery';

export class HTMLView {

    private enabled: boolean; 
    protected rootElement:HTMLElement;
    protected network: Network;

    constructor(rootElement: HTMLElement) {
        this.enabled = false;
        this.network = Network.getInstance();
        this.rootElement = rootElement;
        this.rootElement.classList.add("hidden");
    }

    public setEnabled(transition: boolean = false) : void {
        if(this.enabled) {
            return;
        }
        this.enabled = true;

        if(transition) {
            this.rootElement.classList.replace("hidden", "visible");
        } 
        else {
            //TODO: Instantaneous transition
        }
    }

    public setDisabled(transition: boolean = false) : void {
        if(!this.enabled) {
            return;
        }
        this.enabled = false;

        if(transition) {
            this.rootElement.classList.replace("visible", "hidden");
        }
        else {
            //TODO: Instantaneous transition
        }
    }

    public didEnter() : void {
        //Override in subclass
    }

    public didExit() : void {
        //Override in subclass
    }

    public didReceiveMessage(message: string) : void {
        //Overide in subclass
    }

    public isEnabled() : boolean {
        return this.enabled
    }
}