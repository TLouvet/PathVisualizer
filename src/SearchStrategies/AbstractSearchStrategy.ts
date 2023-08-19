import { GraphNode } from '../GraphNode/GraphNode';
import { PerformanceComponent } from '../PerformanceComponent';
import { Path } from './Path';
import { SearchComponentFactory } from './component/SearchComponentFactory';
import { ISearchComponent } from './interface/ISearchComponent.interface';
import { SearchStrategy } from './interface/SearchStrategy.interface';

export abstract class AbstractSearchStrategy implements SearchStrategy {
  protected path: Path;
  protected performanceMonitorComponent: PerformanceComponent;
  protected searchComponent: ISearchComponent;
  protected searchComponentFactory: SearchComponentFactory;

  constructor(protected nodes: GraphNode[]) {
    this.path = new Path();
    this.performanceMonitorComponent = new PerformanceComponent();
    this.searchComponentFactory = new SearchComponentFactory();
    this.searchComponent = this.searchComponentFactory.createSearchComponent(nodes);
  }

  clear() {
    this.path.clear();
  }

  changeSearchComponent() {
    this.searchComponent = this.searchComponentFactory.createSearchComponent(this.nodes);
  }

  abstract solve(start: GraphNode | null, end: GraphNode | null): void;
}
