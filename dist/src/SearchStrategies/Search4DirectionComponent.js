import { Grid } from '../Grid.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js';
export class Search4DirectionComponent {
    nodes;
    constructor(nodes) {
        this.nodes = nodes;
    }
    getAdjacentNodes(currentNode) {
        const [row, col] = currentNode.node.id.substring(1).split('-').map(Number);
        const leftNode = this.getNode(col > 0, col - 1, row);
        const rightNode = this.getNode(col < Grid.GRID_WIDTH - 1, col + 1, row);
        const topNode = this.getNode(row > 0, col, row - 1);
        const bottomNode = this.getNode(row < Grid.GRID_HEIGHT - 1, col, row + 1);
        return this.filterAdjacentNodes([leftNode, rightNode, topNode, bottomNode]);
    }
    // ALL OF THE FOLLOWING IS DUPLICATED FROM Search8DirectionsComponent.ts
    filterAdjacentNodes(nodes) {
        return nodes.filter((node) => !!node);
    }
    // Signature might be a bit complex to understand and to apply
    getNode(condition, col, row) {
        if (!condition) {
            return;
        }
        const node = this.getAdjacentNodeOrUndefined(col, row);
        return node;
    }
    getAdjacentNodeOrUndefined(col, row) {
        const index = row * Grid.GRID_WIDTH + col;
        if (index >= this.nodes.length) {
            return undefined;
        }
        const node = this.nodes[index];
        const isAdjacent = this.isValidAdjacentNodePath(node);
        return isAdjacent ? node : undefined;
    }
    isValidAdjacentNodePath(node) {
        return node.isEmpty() || node.isEnd(); // this may be restricting forcing us to go always from start
    }
}
