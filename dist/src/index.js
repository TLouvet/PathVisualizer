import { Grid } from './Grid.js';
import { PathSelectorSingleton } from './PathSelectorSingleton.js';
function bootstrap() {
    PathSelectorSingleton.initListeners();
    const grid = new Grid();
    grid.generate();
}
bootstrap();
// State pour discovered ?
// permettre à l'utilisateur de switch entre 4 et 8 directions
// refactor les algo
// Refactor la classe grid
// Distance classes à implémenter et intégrer dans les algo