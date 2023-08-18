import { GridGenerator } from './GridGenerator.js';
import { GridController } from './GridController.js';
import { BFSStrategy } from './SearchStrategies/BFSStrategy.js';
import { DFSStrategy } from './SearchStrategies/DFSStrategy.js';
import { ESearchStrategy } from './SearchStrategies/enum/SearchStrategy.enum.js';
import { Solver } from './Solver.js';
import { PathOption } from './PathOption.enum.js';
import { DijkstraStrategy } from './SearchStrategies/DijkstraStrategy.js';
import { AStarStrategy } from './SearchStrategies/AStarStrategy.js';
import { Search8DirectionsComponent } from './SearchStrategies/component/Search8DirectionComponent.js';
import { Search4DirectionComponent } from './SearchStrategies/component/Search4DirectionComponent.js';
export class Grid {
    static GRID_WIDTH = 20;
    static GRID_HEIGHT = 20;
    static IS_CLICKING = false;
    static CHOSEN_DIRECTION = '8D';
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
            new DFSStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            new BFSStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            new DijkstraStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            new AStarStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
        ];
        this.solver = new Solver(this.strategies[0]);
        this.gridController = new GridController(this.solver);
        // finalement ça ne touche que le pathstate visited
        document.getElementById('btn-show-visited')?.addEventListener('click', () => {
            Grid.showVisitedNodes = !Grid.showVisitedNodes;
            this.render();
        });
        document.getElementById('grid-size-slider-height')?.addEventListener('input', (e) => {
            Grid.GRID_HEIGHT = Number(e.target.value);
            this.generate();
            document.getElementById('grid-size-height-value').innerHTML = Grid.GRID_HEIGHT.toString();
        });
        document.getElementById('grid-size-slider-width')?.addEventListener('input', (e) => {
            Grid.GRID_WIDTH = Number(e.target.value);
            this.generate();
            document.getElementById('grid-size-width-value').innerHTML = Grid.GRID_WIDTH.toString();
        });
        // Direction change
        document.getElementById('btn-directional-4d')?.addEventListener('click', (e) => {
            Grid.CHOSEN_DIRECTION = '4D';
            document.querySelectorAll('.direction-selected')?.forEach((el) => el.classList.remove('direction-selected'));
            e.target.classList.add('direction-selected');
            this.strategies = [
                new DFSStrategy(this.nodes, new Search4DirectionComponent(this.nodes)),
                new BFSStrategy(this.nodes, new Search4DirectionComponent(this.nodes)),
                new DijkstraStrategy(this.nodes, new Search4DirectionComponent(this.nodes)),
                new AStarStrategy(this.nodes, new Search4DirectionComponent(this.nodes)),
            ];
            this.solver.changeSearchComponent('4D');
            this.gridController.recalculateSolution(this.nodes);
        });
        document.getElementById('btn-directional-8d')?.addEventListener('click', (e) => {
            Grid.CHOSEN_DIRECTION = '8D';
            document.querySelectorAll('.direction-selected')?.forEach((el) => el.classList.remove('direction-selected'));
            e.target.classList.add('direction-selected');
            this.strategies = [
                new DFSStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
                new BFSStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
                new DijkstraStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
                new AStarStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            ];
            this.solver.changeSearchComponent('8D');
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
            new DFSStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            new BFSStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            new DijkstraStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
            new AStarStrategy(this.nodes, new Search8DirectionsComponent(this.nodes)),
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
