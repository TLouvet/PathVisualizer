import { GraphNode } from '../../GraphNode/GraphNode';
import { ISearchComponent } from '../interface/ISearchComponent.interface';
import { SearchComponentHelper } from './SearchComponentHelper';

export class Search4DirectionComponent implements ISearchComponent {
  constructor(nodes: GraphNode[], private searchHelper: SearchComponentHelper = new SearchComponentHelper(nodes)) {}

  getAdjacentNodes(currentNode: GraphNode) {
    const [row, col] = currentNode.node.id.substring(1).split('-').map(Number);
    const { GRID_HEIGHT, GRID_WIDTH } = this.searchHelper.getGridSize();

    const leftNode = this.searchHelper.getNode(col > 0, col - 1, row);
    const rightNode = this.searchHelper.getNode(col < GRID_WIDTH - 1, col + 1, row);
    const topNode = this.searchHelper.getNode(row > 0, col, row - 1);
    const bottomNode = this.searchHelper.getNode(row < GRID_HEIGHT - 1, col, row + 1);

    return this.searchHelper.filterAdjacentNodes([leftNode, rightNode, topNode, bottomNode]);
  }
}
