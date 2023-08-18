import { GridGenerator } from './GridGenerator.js';
import { GridController } from './GridController.js';
import { BFSStrategy } from './SearchStrategies/BFSStrategy.js';
import { DFSStrategy } from './SearchStrategies/DFSStrategy.js';
import { ESearchStrategy } from './SearchStrategies/enum/SearchStrategy.enum.js';
import { Solver } from './Solver.js';
import { PathOption } from './PathOption.enum.js';
import { DijkstraStrategy } from './SearchStrategies/DijkstraStrategy.js';
import { AStarStrategy } from './SearchStrategies/AStarStrategy.js';
import { ESearchDirection, SearchDirectionSingleton } from './SearchDirectionSingleton.js';
export class Grid {
    static IS_CLICKING = false;
    static showVisitedNodes = false;
    gridHTMLGenerator;
    nodes;
    solver;
    strategies;
    gridController;
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
            e.target.classList.add('direction-selected');
            this.solver.changeSearchComponent();
            this.gridController.recalculateSolution(this.nodes);
        });
        document.getElementById('btn-directional-8d')?.addEventListener('click', (e) => {
            SearchDirectionSingleton.searchDirection = ESearchDirection['8D'];
            document.querySelectorAll('.direction-selected')?.forEach((el) => el.classList.remove('direction-selected'));
            e.target.classList.add('direction-selected');
            this.solver.changeSearchComponent();
            this.gridController.recalculateSolution(this.nodes);
        });
        document.getElementById('btn-path-reinitialize')?.addEventListener('click', () => this.reinitialize());
    }
    // Not clean at all
    initListeners(id, type) {
        document.getElementById(id)?.addEventListener('click', () => {
            document.querySelectorAll('.algo-selected').forEach((btn) => btn.classList.remove('algo-selected'));
            document.getElementById(id)?.classList.add('algo-selected');
            switch (type) {
                case ESearchStrategy.DFS:
                    this.changeSolverStrategy(this.strategies[0]);
                    break;
                case ESearchStrategy.BFS:
                    this.changeSolverStrategy(this.strategies[1]);
                    break;
                case ESearchStrategy.DIJKSTRA:
                    this.changeSolverStrategy(this.strategies[2]);
                    break;
                case ESearchStrategy.ASTAR:
                    this.changeSolverStrategy(this.strategies[3]);
                    break;
                default:
                    break;
            }
            this.gridController.recalculateSolution(this.nodes);
        });
    }
    changeSolverStrategy(strategy) {
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
