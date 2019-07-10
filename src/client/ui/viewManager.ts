import { HTMLView } from './view';
import { SettingsView } from './settingsView';

export class ViewManager {
    private static instance: ViewManager;

    private views: HTMLView[] = [];
    private activeView: HTMLView;

    private settingsView: SettingsView;

    public constructor() {
        this.settingsView = new SettingsView();
    }

    public static getInstance(): ViewManager {
        if (this.instance == null) {
            this.instance = new ViewManager();
        }

        return this.instance;
    }

    public start(): void {
        if (this.activeView == null) {
            return;
        }
        this.views.forEach((view: HTMLView): void => {
            if (view == this.activeView) {
                view.setEnabled(true);
            } else {
                view.setDisabled();
            }
        });
    }

    public getViews(): HTMLView[] {
        return this.views;
    }

    public addView(view: HTMLView, setActive: boolean = false): void {
        this.views.push(view);
        if (setActive) {
            this.activeView = view;
        }
    }

    public transition(targetViewIndex: number, withTransition: boolean = false): void {
        if (targetViewIndex < 0 || targetViewIndex >= this.views.length) {
            //TODO: Handle arrayIndexException ?
        }

        const fromView = this.activeView;
        const toView = this.views[targetViewIndex];

        fromView.didExit();
        fromView.setDisabled(withTransition);

        toView.setEnabled(withTransition);
        toView.didEnter();

        this.activeView = toView;
    }

    public sendMessage(targetViewIndex: number, message: string): void {
        if (targetViewIndex < 0 || targetViewIndex >= this.views.length) {
            //TODO: Handle arrayIndexException ?
        }

        const toView = this.views[targetViewIndex];
        toView.didReceiveMessage(message);
    }

    public showSettings(): void {
        this.settingsView.show();
    }

    public hideSettings(): void {
        this.settingsView.hide();
    }
}
