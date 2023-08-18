import { GraphNode } from '../../GraphNode/GraphNode';
import { Grid } from '../../Grid';
import { ISearchComponent } from '../interface/ISearchComponent.interface';
import { SearchComponentHelper } from './SearchComponentHelper';

export class Search8DirectionsComponent implements ISearchComponent {
  constructor(nodes: GraphNode[], private searchHelper: SearchComponentHelper = new SearchComponentHelper(nodes)) {}

  getAdjacentNodes(currentNode: GraphNode) {
    const [row, col] = currentNode.node.id.substring(1).split('-').map(Number);

    const leftNode = this.searchHelper.getNode(col > 0, col - 1, row);
    const rightNode = this.searchHelper.getNode(col < Grid.GRID_WIDTH - 1, col + 1, row);
    const topNode = this.searchHelper.getNode(row > 0, col, row - 1);
    const bottomNode = this.searchHelper.getNode(row < Grid.GRID_HEIGHT - 1, col, row + 1);

    const topLeftNode = this.searchHelper.getNode(!!leftNode && !!topNode, col - 1, row - 1);
    const topRightNode = this.searchHelper.getNode(!!rightNode && !!topNode, col + 1, row - 1);
    const bottomLeftNode = this.searchHelper.getNode(!!leftNode && !!bottomNode, col - 1, row + 1);
    const bottomRightNode = this.searchHelper.getNode(!!rightNode && !!bottomNode, col + 1, row + 1);

    return this.searchHelper.filterAdjacentNodes([
      leftNode,
      rightNode,
      topNode,
      bottomNode,
      topLeftNode,
      topRightNode,
      bottomLeftNode,
      bottomRightNode,
    ]);
  }
}
