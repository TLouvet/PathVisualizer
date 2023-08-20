import { CreateSearchStrategyFactory } from '../SearchStrategies/CreateSearchStrategyFactory.js';
import { ESearchStrategy } from '../SearchStrategies/enum/SearchStrategy.enum.js';
export class GridSearchStrategySelector {
    relatedCssClass = 'algo-selected';
    dfsButton = 'btn-algo-dfs';
    bfsButton = 'btn-algo-bfs';
    dijkstraButton = 'btn-algo-dijkstra';
    aStarButton = 'btn-algo-astar';
    strategyType;
    strategyFactory;
    constructor() {
        this.strategyType = ESearchStrategy.DFS;
        this.strategyFactory = new CreateSearchStrategyFactory();
    }
    getStrategy(nodes) {
        return this.strategyFactory.getStrategy(this.strategyType, nodes);
    }
    initListeners(grid) {
        this.initListener(this.dfsButton, ESearchStrategy.DFS, grid);
        this.initListener(this.bfsButton, ESearchStrategy.BFS, grid);
        this.initListener(this.dijkstraButton, ESearchStrategy.DIJKSTRA, grid);
        this.initListener(this.aStarButton, ESearchStrategy.ASTAR, grid);
    }
    initListener(id, type, grid) {
        document.getElementById(id)?.addEventListener('click', (e) => {
            this.transferCssClasses(e.target);
            this.strategyType = type;
            grid.recalculateSolution();
        });
    }
    transferCssClasses(to) {
        document.querySelector(`.${this.relatedCssClass}`)?.classList.remove(this.relatedCssClass);
        to.classList.add(this.relatedCssClass);
    }
}
