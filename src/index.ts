import { Grid } from './Grid';
import { PathSelectorSingleton } from './PathSelectorSingleton';

function bootstrap() {
  PathSelectorSingleton.initListeners();
  const grid = new Grid();
  grid.generate();
}

bootstrap();

// State pour discovered ?

// refactor les algo

// Refactor la classe grid

// Distance classes à implémenter et intégrer dans les algo
