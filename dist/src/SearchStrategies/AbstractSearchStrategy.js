import { PerformanceComponent } from '../PerformanceComponent.js';
import { Path } from './Path.js';
import { SearchComponentFactory } from './component/SearchComponentFactory.js';
export class AbstractSearchStrategy {
    nodes;
    path;
    performanceMonitorComponent;
    searchComponent;
    searchComponentFactory;
    constructor(nodes) {
        this.nodes = nodes;
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
}
