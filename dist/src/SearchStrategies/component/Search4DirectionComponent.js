import { Grid } from '../../Grid.js';
import { SearchComponentHelper } from './SearchComponentHelper.js';
export class Search4DirectionComponent {
    searchHelper;
    constructor(nodes, searchHelper = new SearchComponentHelper(nodes)) {
        this.searchHelper = searchHelper;
    }
    getAdjacentNodes(currentNode) {
        const [row, col] = currentNode.node.id.substring(1).split('-').map(Number);
        const leftNode = this.searchHelper.getNode(col > 0, col - 1, row);
        const rightNode = this.searchHelper.getNode(col < Grid.GRID_WIDTH - 1, col + 1, row);
        const topNode = this.searchHelper.getNode(row > 0, col, row - 1);
        const bottomNode = this.searchHelper.getNode(row < Grid.GRID_HEIGHT - 1, col, row + 1);
        return this.searchHelper.filterAdjacentNodes([leftNode, rightNode, topNode, bottomNode]);
    }
}
