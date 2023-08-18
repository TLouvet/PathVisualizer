import { PerformanceComponent } from '../PerformanceComponent.js';
import { Path } from './Path.js';
import { Search4DirectionComponent } from './component/Search4DirectionComponent.js';
import { Search8DirectionsComponent } from './component/Search8DirectionComponent.js';
export class AbstractSearchStrategy {
    nodes;
    searchComponent;
    path;
    performanceMonitorComponent;
    constructor(nodes, searchComponent) {
        this.nodes = nodes;
        this.searchComponent = searchComponent;
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
    changeSearchComponent(searchComponentType) {
        if (searchComponentType === '4D') {
            this.searchComponent = new Search4DirectionComponent(this.nodes);
        }
        else {
            this.searchComponent = new Search8DirectionsComponent(this.nodes);
        }
    }
}
