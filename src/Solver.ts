import { GraphNode } from './GraphNode/GraphNode';
import { SearchStrategy } from './SearchStrategies/interface/SearchStrategy.interface';

export class SolverContext {
  executeSearchStrategy(strategy: SearchStrategy, start: GraphNode | null, end: GraphNode | null) {
    return strategy.solve(start, end);
  }
}
