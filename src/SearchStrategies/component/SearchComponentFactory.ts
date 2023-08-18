import { GraphNode } from '../../GraphNode/GraphNode';
import { ESearchDirection, SearchDirectionSingleton } from '../../SearchDirectionSingleton';
import { ISearchComponent } from '../interface/ISearchComponent.interface';
import { Search4DirectionComponent } from './Search4DirectionComponent';
import { Search8DirectionComponent } from './Search8DirectionComponent';

export class SearchComponentFactory {
  private constructor() {}

  static createSearchComponent(nodes: GraphNode[]): ISearchComponent {
    if (SearchDirectionSingleton.searchDirection === ESearchDirection['4D']) {
      return new Search4DirectionComponent(nodes);
    } else {
      return new Search8DirectionComponent(nodes);
    }
  }
}
