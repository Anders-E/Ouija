import { HTMLView } from './view';

export class SettingsView extends HTMLView {
    public constructor() {
        super(document.getElementById('settings'));
    }
}
