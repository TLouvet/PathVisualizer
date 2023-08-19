import { GraphNode } from '../GraphNode/GraphNode';
import { Grid } from '../Grid';
import { AStarStrategy } from './AStarStrategy';
import { BFSStrategy } from './BFSStrategy';
import { DFSStrategy } from './DFSStrategy';
import { DijkstraStrategy } from './DijkstraStrategy';
import { ESearchStrategy } from './enum/SearchStrategy.enum';
import { SearchStrategy } from './interface/SearchStrategy.interface';

export class CreateSearchStrategyFactory {
  getStrategy(nodes: GraphNode[]): SearchStrategy {
    switch (Grid.CURRENT_SEARCH_STRATEGY) {
      case ESearchStrategy.DFS:
        return new DFSStrategy(nodes);
      case ESearchStrategy.BFS:
        return new BFSStrategy(nodes);
      case ESearchStrategy.DIJKSTRA:
        return new DijkstraStrategy(nodes);
      case ESearchStrategy.ASTAR:
        return new AStarStrategy(nodes);
      default:
        return new DFSStrategy(nodes);
    }
  }
}
