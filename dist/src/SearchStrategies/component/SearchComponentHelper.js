import { Grid } from '../../Grid.js';
export class SearchComponentHelper {
    nodes;
    constructor(nodes) {
        this.nodes = nodes;
    }
    filterAdjacentNodes(nodes) {
        return nodes.filter((node) => !!node);
    }
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
        return node.isEmpty() || node.isEnd();
    }
}
