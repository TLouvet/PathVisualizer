import { GraphNode } from './GraphNode/GraphNode';
import { PathNoneState } from './GraphNode/State/PathNoneState';
import { Grid } from './Grid';
import { PathOption } from './PathOption.enum';
import { PathSelectorSingleton } from './PathSelectorSingleton';
import { Solver } from './Solver';

type UniquePathOption = PathOption.START | PathOption.END;

export class GridController {
  constructor(private solver: Solver) {}

  generateListeners(nodes: GraphNode[]) {
    nodes.forEach((node) => {
      node.node.addEventListener('click', () => {
        const isUpdatingStartOrEnd = this.isUpdatingStartOrEnd();

        if (isUpdatingStartOrEnd) {
          this.removeUniqueInstance(nodes, PathOption.START);
          this.removeUniqueInstance(nodes, PathOption.END);
        }

        node.updatePathState();
        this.recalculateSolution(nodes);
      });

      // TODO Initiate elsewhere
      document.getElementById('grid')?.addEventListener('mousedown', () => {
        Grid.IS_CLICKING = true;
      });

      document.getElementById('grid')?.addEventListener('mouseleave', () => {
        if (Grid.IS_CLICKING) {
          this.recalculateSolution(nodes);
          Grid.IS_CLICKING = false;
        }
      });

      document.getElementById('grid')?.addEventListener('dragend', () => {
        console.log('dragend');
        Grid.IS_CLICKING = false;
      });

      document.getElementById('grid')?.addEventListener('mouseup', () => {
        if (Grid.IS_CLICKING) {
          this.recalculateSolution(nodes);
          Grid.IS_CLICKING = false;
        }
      });

      node.node.addEventListener('mousemove', () => {
        if ((this.isAddingWall() || this.isRemoving()) && Grid.IS_CLICKING) {
          node.updatePathState();
        }
      });
    });
  }

  private isUpdatingStartOrEnd() {
    return (
      PathSelectorSingleton.currentPath === PathOption.START || PathSelectorSingleton.currentPath === PathOption.END
    );
  }

  private isAddingWall() {
    return PathSelectorSingleton.currentPath === PathOption.WALL;
  }

  private isRemoving() {
    return PathSelectorSingleton.currentPath === PathOption.NONE;
  }

  private removeUniqueInstance(nodes: GraphNode[], uniquePathOption: UniquePathOption) {
    if (PathSelectorSingleton.currentPath !== uniquePathOption) {
      return;
    }

    const currentEnd = nodes.find((node) => node.getCurrentPath() === uniquePathOption);
    if (currentEnd) {
      currentEnd.changeState(new PathNoneState());
    }
  }

  recalculateSolution(nodes: GraphNode[]) {
    for (const node of nodes) {
      if (node.isSolution() || node.isVisited()) {
        node.reinitialize();
      }
    }

    this.solver.clear();
    this.solver.solve();
  }

  reinitializeAll(nodes: GraphNode[]) {
    this.solver.clear();
    nodes.forEach((node) => node.reinitialize());
  }
}
