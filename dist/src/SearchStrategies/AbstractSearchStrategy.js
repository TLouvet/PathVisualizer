import { PerformanceComponent } from '../Performance/PerformanceComponent.js';
import { Path } from './Path.js';
import { SearchComponentFactory } from './component/SearchComponentFactory.js';
export class AbstractSearchStrategy {
    path;
    performanceMonitorComponent;
    searchComponent;
    searchComponentFactory;
    constructor(nodes) {
        this.path = new Path();
        this.performanceMonitorComponent = new PerformanceComponent();
        this.searchComponentFactory = new SearchComponentFactory();
        this.searchComponent = this.searchComponentFactory.createSearchComponent(nodes);
    }
    changeSearchComponent(nodes) {
        this.searchComponent = this.searchComponentFactory.createSearchComponent(nodes);
    }
}
