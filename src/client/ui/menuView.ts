import { HTMLView } from './view';
import { ViewManager } from './viewManager';

export class MenuView extends HTMLView {
    public constructor() {
        super(document.getElementById('menu'));

        const findSessionButton = document.getElementById('findSession');
        findSessionButton.addEventListener('click', (): void => {
            console.log('Clicked find session button!');
            ViewManager.getInstance().transition(1, true);
            // fade(document.getElementById('menu'));
            // enterLoadingScreen();
        });
    }
}
