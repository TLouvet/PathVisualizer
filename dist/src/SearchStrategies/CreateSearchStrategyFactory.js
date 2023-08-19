import { Grid } from '../Grid.js';
import { AStarStrategy } from './AStarStrategy.js';
import { BFSStrategy } from './BFSStrategy.js';
import { DFSStrategy } from './DFSStrategy.js';
import { DijkstraStrategy } from './DijkstraStrategy.js';
import { ESearchStrategy } from './enum/SearchStrategy.enum.js';
export class CreateSearchStrategyFactory {
    getStrategy(nodes) {
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
