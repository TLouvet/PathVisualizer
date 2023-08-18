import { GraphNode } from './GraphNode/GraphNode';
import { GridGenerator } from './GridGenerator';
import { GridController } from './GridController';
import { BFSStrategy } from './SearchStrategies/BFSStrategy';
import { DFSStrategy } from './SearchStrategies/DFSStrategy';
import { ESearchStrategy } from './SearchStrategies/enum/SearchStrategy.enum';
import { SearchStrategy } from './SearchStrategies/interface/SearchStrategy.interface';
import { Solver } from './Solver';
import { PathOption } from './PathOption.enum';
import { DijkstraStrategy } from './SearchStrategies/DijkstraStrategy';
import { AStarStrategy } from './SearchStrategies/AStarStrategy';
import { ESearchDirection, SearchDirectionSingleton } from './SearchDirectionSingleton';

export class Grid {
  static IS_CLICKING = false;
  static showVisitedNodes = false;

  private gridHTMLGenerator: GridGenerator;
  public nodes: GraphNode[];
  private solver: Solver;
  private strategies: SearchStrategy[];
  private gridController: GridController;

  // TODO: refactor this because wow i cant evn read my own code
  constructor() {
    this.gridHTMLGenerator = new GridGenerator();
    this.nodes = [];
    this.initListeners('btn-algo-dfs', ESearchStrategy.DFS);
    this.initListeners('btn-algo-bfs', ESearchStrategy.BFS);
    this.initListeners('btn-algo-dijkstra', ESearchStrategy.DIJKSTRA);
    this.initListeners('btn-algo-astar', ESearchStrategy.ASTAR);

    // Weird that i still have to redeclare it in the generate mthod...
    this.strategies = [
      new DFSStrategy(this.nodes),
      new BFSStrategy(this.nodes),
      new DijkstraStrategy(this.nodes),
      new AStarStrategy(this.nodes),
    ];
    this.solver = new Solver(this.strategies[0]);
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
      switch (type) {
        case ESearchStrategy.DFS:
          this.changeSolverStrategy(new DFSStrategy(this.nodes));
          break;
        case ESearchStrategy.BFS:
          this.changeSolverStrategy(new BFSStrategy(this.nodes));
          break;
        case ESearchStrategy.DIJKSTRA:
          this.changeSolverStrategy(new DijkstraStrategy(this.nodes));
          break;
        case ESearchStrategy.ASTAR:
          this.changeSolverStrategy(new AStarStrategy(this.nodes));
          break;
        default:
          break;
      }
      this.gridController.recalculateSolution(this.nodes);
    });
  }

  changeSolverStrategy(strategy: SearchStrategy) {
    this.solver.changeStrategy(strategy);
  }

  generate() {
    this.nodes = this.gridHTMLGenerator.injectIntoBody();
    this.gridController.generateListeners(this.nodes);
    // Weird that i still have to redeclare it in the generate mthod...
    this.strategies = [
      new DFSStrategy(this.nodes),
      new BFSStrategy(this.nodes),
      new DijkstraStrategy(this.nodes),
      new AStarStrategy(this.nodes),
    ];
    this.solver.changeStrategy(this.strategies[0]);
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
