import { ESearchDirection, SearchDirectionSingleton } from '../../SearchDirectionSingleton.js';
import { Search4DirectionComponent } from './Search4DirectionComponent.js';
import { Search8DirectionComponent } from './Search8DirectionComponent.js';
export class SearchComponentFactory {
    constructor() { }
    static createSearchComponent(nodes) {
        if (SearchDirectionSingleton.searchDirection === ESearchDirection['4D']) {
            return new Search4DirectionComponent(nodes);
        }
        else {
            return new Search8DirectionComponent(nodes);
        }
    }
}
