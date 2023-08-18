import { SearchComponentHelper } from './SearchComponentHelper.js';
export class Search8DirectionComponent {
    searchHelper;
    constructor(nodes, searchHelper = new SearchComponentHelper(nodes)) {
        this.searchHelper = searchHelper;
    }
    getAdjacentNodes(currentNode) {
        const [row, col] = currentNode.node.id.substring(1).split('-').map(Number);
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
}
