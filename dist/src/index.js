import { Grid } from './Grid.js';
import { GridSizeSingleton } from './GridSizeSingleton.js';
import { PathSelectorSingleton } from './PathSelectorSingleton.js';
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
// Fill wall et fill void
// Pour la partie explication, implémenter un système de tabs
// jump point search ?
