import { PerformanceComponent } from '../PerformanceComponent.js';
import { Path } from './Path.js';
import { SearchComponentFactory } from './component/SearchComponentFactory.js';
export class AbstractSearchStrategy {
    nodes;
    path;
    performanceMonitorComponent;
    searchComponent;
    constructor(nodes) {
        this.nodes = nodes;
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
}
