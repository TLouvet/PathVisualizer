import { GraphNode } from './GraphNode/GraphNode';
import { PathNoneState } from './GraphNode/State/PathNoneState';
import { Grid } from './Grid';
import { PathOption } from './PathOption.enum';
import { PathSelectorSingleton } from './PathSelectorSingleton';
import { CreateSearchStrategyFactory } from './SearchStrategies/CreateSearchStrategyFactory';
import { SearchStrategy } from './SearchStrategies/interface/SearchStrategy.interface';
import { Solver } from './Solver';

type UniquePathOption = PathOption.START | PathOption.END;

export class GridController {
  constructor(private solver: Solver) {}

  recalculateSolution(strategy: SearchStrategy, nodes: GraphNode[]) {
    for (const node of nodes) {
      node.reinitialize();
      if (node.isSolution() || node.isVisited()) {
        node.setNoneState();
      }
    }

    this.solver.executeStrategy(strategy, Grid.START_NODE, Grid.END_NODE);
  }

  reinitializeAll(nodes: GraphNode[]) {
    nodes.forEach((node) => {
      node.reinitialize();
      node.setNoneState();
    });
  }
}
