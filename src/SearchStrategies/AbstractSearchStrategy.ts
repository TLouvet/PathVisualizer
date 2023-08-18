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

  constructor(protected nodes: GraphNode[]) {
    this.path = new Path();
    this.performanceMonitorComponent = new PerformanceComponent();
    this.searchComponent = SearchComponentFactory.createSearchComponent(nodes);
  }

  clear() {
    this.nodes.forEach((node) => {
      node.parent = null;
      node.localValue = Infinity;
      node.globalValue = Infinity;
    });
    this.path.clear();
  }

  changeSearchComponent() {
    this.searchComponent = SearchComponentFactory.createSearchComponent(this.nodes);
  }

  abstract solve(): void;
}
