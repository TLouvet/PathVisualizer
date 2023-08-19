import { Grid } from './Grid';
import { GridSizeSingleton } from './GridSizeSingleton';
import { PathSelectorSingleton } from './PathSelectorSingleton';

function bootstrap() {
  PathSelectorSingleton.initListeners();
  const grid = new Grid();
  grid.generate();

  GridSizeSingleton.initListeners(grid);
}

bootstrap();

// State pour discovered ?

// refactor les algo

// Refactor la classe grid

// Distance classes à implémenter et intégrer dans les algo

// Fill wall et fill void

// Pour la partie explication, implémenter un système de tabs

// jump point search ?
