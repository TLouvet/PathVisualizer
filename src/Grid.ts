import { GraphNode } from './GraphNode/GraphNode';
import { GridGenerator } from './GridGenerator';
import { GridController } from './GridController';
import { ESearchStrategy } from './SearchStrategies/enum/SearchStrategy.enum';
import { Solver } from './Solver';
import { PathOption } from './PathOption.enum';
import { ESearchDirection, SearchDirectionSingleton } from './SearchDirectionSingleton';

export class Grid {
  static IS_CLICKING = false;
  static showVisitedNodes = false;
  static CURRENT_SEARCH_STRATEGY: ESearchStrategy = ESearchStrategy.DFS;
  static START_NODE: GraphNode | null = null;
  static END_NODE: GraphNode | null = null;

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
      this.solver.changeSearchComponent();
      this.gridController.recalculateSolution(this.nodes);
    });

    document.getElementById('btn-directional-8d')?.addEventListener('click', (e) => {
      SearchDirectionSingleton.searchDirection = ESearchDirection['8D'];
      document.querySelectorAll('.direction-selected')?.forEach((el) => el.classList.remove('direction-selected'));
      (e.target as HTMLButtonElement).classList.add('direction-selected');
      this.solver.changeSearchComponent();
      this.gridController.recalculateSolution(this.nodes);
    });

    document.getElementById('btn-path-reinitialize')?.addEventListener('click', () => this.reinitialize());
  }

  // Not clean at all
  initListeners(id: string, type: ESearchStrategy) {
    document.getElementById(id)?.addEventListener('click', () => {
      document.querySelectorAll('.algo-selected').forEach((btn) => btn.classList.remove('algo-selected'));
      document.getElementById(id)?.classList.add('algo-selected');

      Grid.CURRENT_SEARCH_STRATEGY = type;
      this.changeSolverStrategy();
      this.gridController.recalculateSolution(this.nodes);
    });
  }

  changeSolverStrategy() {
    this.solver.changeStrategy(this.nodes);
  }

  generate() {
    this.nodes = this.gridHTMLGenerator.injectIntoBody();
    this.gridController.generateListeners(this.nodes);
    this.solver.changeStrategy(this.nodes);
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
}
