import { ESearchDirection, SearchDirectionSingleton } from '../SearchDirectionSingleton.js';
export class GridSearchDirectionSelector {
    relatedCssClass = 'direction-selected';
    fourDirectionButton = 'btn-directional-4d';
    eightDirectionButton = 'btn-directional-8d';
    // TODO create the related HTML
    initListeners(grid) {
        document.getElementById(this.fourDirectionButton)?.addEventListener('click', (e) => {
            SearchDirectionSingleton.searchDirection = ESearchDirection['4D'];
            this.transferCssClasses(e.target);
            grid.recalculateSolution();
        });
        document.getElementById(this.eightDirectionButton)?.addEventListener('click', (e) => {
            SearchDirectionSingleton.searchDirection = ESearchDirection['8D'];
            this.transferCssClasses(e.target);
            grid.recalculateSolution();
        });
    }
    /**
     * As their is only one button selected at a time, we remove the class from the previous one and add it to the new one
     */
    transferCssClasses(to) {
        document.querySelector(`.${this.relatedCssClass}`)?.classList.remove(this.relatedCssClass);
        to.classList.add(this.relatedCssClass);
    }
}
