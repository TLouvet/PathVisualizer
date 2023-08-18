import { Grid } from './Grid';

export class GridSizeSingleton {
  static GRID_WIDTH = 20;
  static GRID_HEIGHT = 20;

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