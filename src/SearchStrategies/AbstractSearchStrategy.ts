import { GraphNode } from '../GraphNode/GraphNode';
import { PerformanceComponent } from '../PerformanceComponent';
import { Path } from './Path';
import { Search4DirectionComponent } from './component/Search4DirectionComponent';
import { Search8DirectionsComponent } from './component/Search8DirectionComponent';
import { ISearchComponent } from './interface/ISearchComponent.interface';
import { SearchStrategy } from './interface/SearchStrategy.interface';

export abstract class AbstractSearchStrategy implements SearchStrategy {
  protected path: Path;
  protected performanceMonitorComponent: PerformanceComponent;

  constructor(protected nodes: GraphNode[], protected searchComponent: ISearchComponent) {
    this.path = new Path();
    this.performanceMonitorComponent = new PerformanceComponent();
  }

  clear() {
    this.nodes.forEach((node) => {
      node.parent = null;
      node.localValue = Infinity;
      node.globalValue = Infinity;
    });
    this.path.clear();
  }

  changeSearchComponent(searchComponentType: '4D' | '8D') {
    if (searchComponentType === '4D') {
      this.searchComponent = new Search4DirectionComponent(this.nodes);
    } else {
      this.searchComponent = new Search8DirectionsComponent(this.nodes);
    }
  }

  abstract solve(): void;
}
