import { ESearchDirection, SearchDirectionSingleton } from '../SearchDirectionSingleton.js';
export class GridSearchDirectionSelector {
    relatedCssClass = 'direction-selected';
    fourDirectionButton = 'btn-directional-4d';
    eightDirectionButton = 'btn-directional-8d';
    // TODO create the related HTML
    initListeners(grid) {
        this.initListener(this.fourDirectionButton, ESearchDirection['4D'], grid);
        this.initListener(this.eightDirectionButton, ESearchDirection['8D'], grid);
    }
    initListener(id, direction, grid) {
        document.getElementById(id)?.addEventListener('click', (e) => {
            SearchDirectionSingleton.searchDirection = direction;
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
