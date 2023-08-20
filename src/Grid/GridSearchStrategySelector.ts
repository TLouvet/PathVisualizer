import { GraphNode } from '../GraphNode/GraphNode';
import { Grid } from '../Grid';
import { CreateSearchStrategyFactory } from '../SearchStrategies/CreateSearchStrategyFactory';
import { ESearchStrategy } from '../SearchStrategies/enum/SearchStrategy.enum';
import { SearchStrategy } from '../SearchStrategies/interface/SearchStrategy.interface';

export class GridSearchStrategySelector {
  private relatedCssClass: string = 'algo-selected';
  private dfsButton: string = 'btn-algo-dfs';
  private bfsButton: string = 'btn-algo-bfs';
  private dijkstraButton: string = 'btn-algo-dijkstra';
  private aStarButton: string = 'btn-algo-astar';

  private strategyType: ESearchStrategy;
  private strategyFactory: CreateSearchStrategyFactory;

  constructor() {
    this.strategyType = ESearchStrategy.DFS;
    this.strategyFactory = new CreateSearchStrategyFactory();
  }

  getStrategy(nodes: GraphNode[]): SearchStrategy {
    return this.strategyFactory.getStrategy(this.strategyType, nodes);
  }

  initListeners(grid: Grid) {
    this.initListener(this.dfsButton, ESearchStrategy.DFS, grid);
    this.initListener(this.bfsButton, ESearchStrategy.BFS, grid);
    this.initListener(this.dijkstraButton, ESearchStrategy.DIJKSTRA, grid);
    this.initListener(this.aStarButton, ESearchStrategy.ASTAR, grid);
  }

  initListener(id: string, type: ESearchStrategy, grid: Grid) {
    document.getElementById(id)?.addEventListener('click', (e) => {
      this.transferCssClasses(e.target as HTMLElement);
      this.strategyType = type;
      grid.recalculateSolution();
    });
  }

  private transferCssClasses(to: HTMLElement) {
    document.querySelector(`.${this.relatedCssClass}`)?.classList.remove(this.relatedCssClass);
    to.classList.add(this.relatedCssClass);
  }
}
