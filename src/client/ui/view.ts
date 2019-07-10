import { Network } from '../network';

export class HTMLView {
    private enabled: boolean;
    private isViewVisible: boolean = false;
    protected rootElement: HTMLElement;
    protected network: Network;

    public constructor(rootElement: HTMLElement) {
        this.enabled = false;
        this.network = Network.getInstance();
        this.rootElement = rootElement;
        this.rootElement.classList.add('hidden');
    }

    public show(): void {
        // if(!this.enabled) {
        //     return;
        // }
        this.isViewVisible = true;
        this.rootElement.classList.replace('hidden', 'visible');
    }

    public hide(): void {
        // if(!this.enabled) {
        //     return;
        // }
        this.rootElement.classList.replace('visible', 'hidden');
        this.isViewVisible = false;
    }

    public isVisible(): boolean {
        return this.isViewVisible;
    }

    public setEnabled(transition: boolean = false): void {
        this.enabled = true;

        if (transition) {
            this.show();
        } else {
            //TODO: Instantaneous transition
        }
    }

    public setDisabled(transition: boolean = false): void {
        if (!this.enabled) {
            return;
        }

        if (transition) {
            this.hide();
        } else {
            //TODO: Instantaneous transition
        }
        this.enabled = false;
    }

    public didEnter(): void {
        //Override in subclass
    }

    public didExit(): void {
        //Override in subclass
    }

    public didReceiveMessage(message: string): void {
        //Overide in subclass
    }

    public isEnabled(): boolean {
        return this.enabled;
    }
}
