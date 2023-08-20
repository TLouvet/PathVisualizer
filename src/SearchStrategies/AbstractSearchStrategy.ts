import { GraphNode } from '../GraphNode/GraphNode';
import { PerformanceComponent } from '../Performance/PerformanceComponent';
import { Path } from './Path';
import { SearchComponentFactory } from './component/SearchComponentFactory';
import { ISearchComponent } from './interface/ISearchComponent.interface';
import { SearchStrategy } from './interface/SearchStrategy.interface';

export abstract class AbstractSearchStrategy implements SearchStrategy {
  protected path: Path;
  protected performanceMonitorComponent: PerformanceComponent;
  protected searchComponent: ISearchComponent;
  protected searchComponentFactory: SearchComponentFactory;

  constructor(nodes: GraphNode[]) {
    this.path = new Path();
    this.performanceMonitorComponent = new PerformanceComponent();
    this.searchComponentFactory = new SearchComponentFactory();
    this.searchComponent = this.searchComponentFactory.createSearchComponent(nodes);
  }

  changeSearchComponent(nodes: GraphNode[]) {
    this.searchComponent = this.searchComponentFactory.createSearchComponent(nodes);
  }

  abstract solve(start: GraphNode | null, end: GraphNode | null): void;
}
