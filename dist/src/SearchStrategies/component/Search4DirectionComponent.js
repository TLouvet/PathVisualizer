import { ManhattanDistance } from '../../Distance/ManhattanDistance.js';
import { SearchComponentHelper } from './SearchComponentHelper.js';
export class Search4DirectionComponent {
    searchHelper;
    distanceComponent;
    constructor(nodes) {
        this.searchHelper = new SearchComponentHelper(nodes);
        this.distanceComponent = new ManhattanDistance();
    }
    getAdjacentNodes(currentNode) {
        const { row, col } = currentNode;
        const { GRID_HEIGHT, GRID_WIDTH } = this.searchHelper.getGridSize();
        const leftNode = this.searchHelper.getNode(col > 0, col - 1, row);
        const rightNode = this.searchHelper.getNode(col < GRID_WIDTH - 1, col + 1, row);
        const topNode = this.searchHelper.getNode(row > 0, col, row - 1);
        const bottomNode = this.searchHelper.getNode(row < GRID_HEIGHT - 1, col, row + 1);
        return this.searchHelper.filterAdjacentNodes([leftNode, rightNode, topNode, bottomNode]);
    }
    getDistance(currentNode, endNode) {
        return this.distanceComponent.calculate(currentNode, endNode);
    }
}
