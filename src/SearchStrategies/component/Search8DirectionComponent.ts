import { Distance2D } from '../../Distance/Distance.interface';
import { EuclidianDistance } from '../../Distance/EuclidianDistance';
import { GraphNode } from '../../GraphNode/GraphNode';
import { Point2D } from '../../Point2D/Point2D.interface';
import { ISearchComponent } from '../interface/ISearchComponent.interface';
import { SearchComponentHelper } from './SearchComponentHelper';

export class Search8DirectionComponent implements ISearchComponent {
  private searchHelper: SearchComponentHelper;
  private distanceComponent: Distance2D;

  constructor(nodes: GraphNode[]) {
    this.searchHelper = new SearchComponentHelper(nodes);
    this.distanceComponent = new EuclidianDistance();
  }

  getAdjacentNodes(currentNode: Point2D) {
    const { row, col } = currentNode;
    const { GRID_HEIGHT, GRID_WIDTH } = this.searchHelper.getGridSize();

    const leftNode = this.searchHelper.getNode(col > 0, col - 1, row);
    const rightNode = this.searchHelper.getNode(col < GRID_WIDTH - 1, col + 1, row);
    const topNode = this.searchHelper.getNode(row > 0, col, row - 1);
    const bottomNode = this.searchHelper.getNode(row < GRID_HEIGHT - 1, col, row + 1);

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

  getDistance(currentNode: Point2D, endNode: Point2D): number {
    return this.distanceComponent.calculate(currentNode, endNode);
  }
}
