import { Grid } from './Grid';

export class GridSizeSingleton {
  //TODO REFLECT INTIAL VALUES IN THE UI
  static GRID_WIDTH = 35;
  static GRID_HEIGHT = 35;

  private constructor() {}

  static initListeners(grid: Grid) {
    document.getElementById('grid-size-slider-height')?.addEventListener('input', (e) => {
      GridSizeSingleton.GRID_HEIGHT = Number((e.target as HTMLInputElement).value);
      grid.generate();
      document.getElementById('grid-size-height-value')!.innerHTML = GridSizeSingleton.GRID_HEIGHT.toString();
    });

    document.getElementById('grid-size-slider-width')?.addEventListener('input', (e) => {
      GridSizeSingleton.GRID_WIDTH = Number((e.target as HTMLInputElement).value);
      grid.generate();
      document.getElementById('grid-size-width-value')!.innerHTML = GridSizeSingleton.GRID_WIDTH.toString();
    });
  }
}

// The thing is that in order to be complete, it should also make the rendering of the buttons, thus the package would be reusable in other projects
