import { GraphNode } from './GraphNode/GraphNode';
import { GridGenerator } from './GridGenerator';
import { GridController } from './GridController';
import { ESearchStrategy } from './SearchStrategies/enum/SearchStrategy.enum';
import { Solver } from './Solver';
import { PathOption } from './PathOption.enum';
import { ESearchDirection, SearchDirectionSingleton } from './SearchDirectionSingleton';
import { CreateSearchStrategyFactory } from './SearchStrategies/CreateSearchStrategyFactory';
import { PathSelectorSingleton } from './PathSelectorSingleton';
import { PathNoneState } from './GraphNode/State/PathNoneState';

type UniquePathOption = PathOption.START | PathOption.END;

export class Grid {
  static IS_CLICKING = false;
  static showVisitedNodes = false;
  static START_NODE: GraphNode | null = null;
  static END_NODE: GraphNode | null = null;

  private strategyFactory: CreateSearchStrategyFactory;
  private strategyType: ESearchStrategy = ESearchStrategy.DFS;
  private gridHTMLGenerator: GridGenerator;
  public nodes: GraphNode[];
  private solver: Solver;
  private gridController: GridController;

  // TODO: refactor this because wow i cant evn read my own code
  constructor() {
    this.gridHTMLGenerator = new GridGenerator();
    this.nodes = [];
    this.initListeners('btn-algo-dfs', ESearchStrategy.DFS);
    this.initListeners('btn-algo-bfs', ESearchStrategy.BFS);
    this.initListeners('btn-algo-dijkstra', ESearchStrategy.DIJKSTRA);
    this.initListeners('btn-algo-astar', ESearchStrategy.ASTAR);

    this.solver = new Solver(this.nodes);
    this.gridController = new GridController(this.solver);
    this.strategyFactory = new CreateSearchStrategyFactory();
    // finalement ça ne touche que le pathstate visited
    document.getElementById('btn-show-visited')?.addEventListener('click', () => {
      Grid.showVisitedNodes = !Grid.showVisitedNodes;
      this.render();
    });

    // Direction change
    document.getElementById('btn-directional-4d')?.addEventListener('click', (e) => {
      SearchDirectionSingleton.searchDirection = ESearchDirection['4D'];
      document.querySelectorAll('.direction-selected')?.forEach((el) => el.classList.remove('direction-selected'));
      (e.target as HTMLButtonElement).classList.add('direction-selected');
      const searchStrategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
      this.gridController.recalculateSolution(searchStrategy, this.nodes);
    });

    document.getElementById('btn-directional-8d')?.addEventListener('click', (e) => {
      SearchDirectionSingleton.searchDirection = ESearchDirection['8D'];
      document.querySelectorAll('.direction-selected')?.forEach((el) => el.classList.remove('direction-selected'));
      (e.target as HTMLButtonElement).classList.add('direction-selected');
      const searchStrategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
      this.gridController.recalculateSolution(searchStrategy, this.nodes);
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
      const searchStrategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
      this.gridController.recalculateSolution(searchStrategy, this.nodes);
    });
  }

  generate() {
    this.nodes = this.gridHTMLGenerator.injectIntoBody();
    this.generateListeners(this.nodes);
  }

  reinitialize() {
    this.gridController.reinitializeAll(this.nodes);
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

        if (isUpdatingStartOrEnd) {
          this.removeUniqueInstance(nodes, PathOption.START);
          this.removeUniqueInstance(nodes, PathOption.END);
        }

        node.updatePathState();
        const strategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
        this.gridController.recalculateSolution(strategy, nodes);
      });

      // TODO Initiate elsewhere
      document.getElementById('grid')?.addEventListener('mousedown', () => {
        Grid.IS_CLICKING = true;
      });

      document.getElementById('grid')?.addEventListener('mouseleave', () => {
        if (Grid.IS_CLICKING) {
          const strategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
          this.gridController.recalculateSolution(strategy, nodes);
          Grid.IS_CLICKING = false;
        }
      });

      document.getElementById('grid')?.addEventListener('dragend', () => {
        if (Grid.IS_CLICKING) {
          Grid.IS_CLICKING = false;
          const strategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
          this.gridController.recalculateSolution(strategy, nodes);
        }
      });

      document.getElementById('grid')?.addEventListener('mouseup', () => {
        if (Grid.IS_CLICKING) {
          const strategy = this.strategyFactory.getStrategy(this.strategyType, this.nodes);
          this.gridController.recalculateSolution(strategy, nodes);
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
}
