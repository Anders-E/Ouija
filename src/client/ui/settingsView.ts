import {HTMLView} from './view';
import {Settings} from '../settings';

export class SettingsView extends HTMLView{

    public constructor() {
        super(document.getElementById("settings"));
    }
}