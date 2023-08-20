import { ESearchDirection, SearchDirectionSingleton } from './SearchDirectionSingleton.js.js.js.js';
export class GridSearchDirectionSelector {
    relatedCssClass = 'direction-selected';
    initListeners(grid) {
        document.getElementById('btn-directional-4d')?.addEventListener('click', (e) => {
            SearchDirectionSingleton.searchDirection = ESearchDirection['4D'];
            this.transferCssClasses(e.target);
            grid.recalculateSolution();
        });
        document.getElementById('btn-directional-8d')?.addEventListener('click', (e) => {
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
