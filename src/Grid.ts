import { GraphNode } from './GraphNode/GraphNode';
import { GridGenerator } from './GridGenerator';
import { ESearchStrategy } from './SearchStrategies/enum/SearchStrategy.enum';
import { SolverContext } from './Solver';
import { PathOption } from './GraphNode/State/PathStateOption.enum';
import { CreateSearchStrategyFactory } from './SearchStrategies/CreateSearchStrategyFactory';
import { PathSelectorSingleton } from './PathSelectorSingleton';
import { PathNoneState } from './GraphNode/State/PathNoneState';
import { GridSearchDirectionSelector } from './Grid/GridSearchDirectionSelector';

type UniquePathOption = PathOption.START | PathOption.END;

export class Grid {
  static showVisitedNodes = false;

  private directionSelector: GridSearchDirectionSelector;
  private solver: SolverContext;
  private strategyFactory: CreateSearchStrategyFactory;
  private strategyType: ESearchStrategy = ESearchStrategy.DFS;
  private gridHTMLGenerator: GridGenerator;
  private nodes: GraphNode[];
  private startNode: GraphNode | null = null;
  private endNode: GraphNode | null = null;
  private isClicking = false;

  // TODO: refactor this because wow i cant evn read my own code
  constructor() {
    this.directionSelector = new GridSearchDirectionSelector();
    this.gridHTMLGenerator = new GridGenerator();
    this.nodes = [];
    this.initListeners('btn-algo-dfs', ESearchStrategy.DFS);
    this.initListeners('btn-algo-bfs', ESearchStrategy.BFS);
    this.initListeners('btn-algo-dijkstra', ESearchStrategy.DIJKSTRA);
    this.initListeners('btn-algo-astar', ESearchStrategy.ASTAR);

    this.solver = new SolverContext();
    this.strategyFactory = new CreateSearchStrategyFactory();

    // finalement ça ne touche que le pathstate visited
    document.getElementById('btn-show-visited')?.addEventListener('click', () => {
      Grid.showVisitedNodes = !Grid.showVisitedNodes;
      this.render();
    });

    document.getElementById('btn-path-reinitialize')?.addEventListener('click', () => this.reinitialize());
  }

  // Not clean at all
  initListeners(id: string, type: ESearchStrategy) {
    // On peut supposer que mon client c'est la grid. Donc je peux injecter à partir de la grid la strategy;
    // Comment je change la strategy dans le code ? Je dois avoir un objet qui me permet de changer la strategy
    document.getElementById(id)?.addEventListener('click', () => {
      document.querySelectorAll('.algo-selected').forEach((btn) => btn.classList.remove('algo-selected'));
      document.getElementById(id)?.classList.add('algo-selected');

      this.strategyType = type;
      this.recalculateSolution();
    });
  }

  generate() {
    this.directionSelector.initListeners(this);
    this.nodes = this.gridHTMLGenerator.injectIntoBody();
    this.generateListeners(this.nodes);
  }

  reinitialize() {
    this.reinitializeAll();
  }

  render() {
    this.nodes.forEach((node) => {
      if (node.getCurrentPath() === PathOption.VISITED) {
        node.render();
      }
    });
  }

  /////
  generateListeners(nodes: GraphNode[]) {
    nodes.forEach((node) => {
      node.node.addEventListener('click', () => {
        const isUpdatingStartOrEnd = this.isUpdatingStartOrEnd();

        // could be made better
        if (isUpdatingStartOrEnd) {
          this.removeUniqueInstance(nodes, PathOption.START);
          this.removeUniqueInstance(nodes, PathOption.END);
        }

        if (PathSelectorSingleton.currentPath === PathOption.START) {
          this.startNode = node;
        } else if (PathSelectorSingleton.currentPath === PathOption.END) {
          this.endNode = node;
        }

        node.updatePathState();
        this.recalculateSolution();
      });

      // TODO Initiate elsewhere
      document.getElementById('grid')?.addEventListener('mousedown', () => {
        this.isClicking = true;
      });

      document.getElementById('grid')?.addEventListener('mouseleave', () => {
        if (this.isClicking) {
          this.recalculateSolution();
          this.isClicking = false;
        }
      });

      document.getElementById('grid')?.addEventListener('dragend', () => {
        if (this.isClicking) {
          this.isClicking = false;
          this.recalculateSolution();
        }
      });

      document.getElementById('grid')?.addEventListener('mouseup', () => {
        if (this.isClicking) {
          this.recalculateSolution();
          this.isClicking = false;
        }
      });

      node.node.addEventListener('mousemove', () => {
        if ((this.isAddingWall() || this.isRemoving()) && this.isClicking) {
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

  recalculateSolution() {
    for (const node of this.nodes) {
      node.reinitialize();
      if (node.isSolution() || node.isVisited()) {
        node.setNoneState();
      }
    }

    const strategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
    this.solver.executeSearchStrategy(strategy, this.startNode, this.endNode);
  }

  reinitializeAll() {
    this.nodes.forEach((node) => {
      node.reinitialize();
      node.setNoneState();
    });
  }
}
