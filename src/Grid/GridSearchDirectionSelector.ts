import { Grid } from '../Grid';
import { ESearchDirection, SearchDirectionSingleton } from '../SearchDirectionSingleton';

export class GridSearchDirectionSelector {
  private readonly relatedCssClass = 'direction-selected';
  private readonly fourDirectionButton = 'btn-directional-4d';
  private readonly eightDirectionButton = 'btn-directional-8d';

  // TODO create the related HTML

  initListeners(grid: Grid) {
    this.initListener(this.fourDirectionButton, ESearchDirection['4D'], grid);
    this.initListener(this.eightDirectionButton, ESearchDirection['8D'], grid);
  }

  private initListener(id: string, direction: ESearchDirection, grid: Grid) {
    document.getElementById(id)?.addEventListener('click', (e) => {
      SearchDirectionSingleton.searchDirection = direction;
      this.transferCssClasses(e.target as HTMLElement);
      grid.recalculateSolution();
    });
  }

  /**
   * As their is only one button selected at a time, we remove the class from the previous one and add it to the new one
   */
  private transferCssClasses(to: HTMLElement) {
    document.querySelector(`.${this.relatedCssClass}`)?.classList.remove(this.relatedCssClass);
    to.classList.add(this.relatedCssClass);
  }
}
