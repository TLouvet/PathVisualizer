import { GraphNode } from '../../GraphNode/GraphNode';
import { Grid } from '../../Grid';

export class SearchComponentHelper {
  constructor(private nodes: GraphNode[]) {}

  public filterAdjacentNodes(nodes: (GraphNode | undefined)[]): GraphNode[] {
    return nodes.filter((node) => !!node) as GraphNode[];
  }

  public getNode(condition: boolean, col: number, row: number) {
    if (!condition) {
      return;
    }

    const node = this.getAdjacentNodeOrUndefined(col, row);
    return node;
  }

  private getAdjacentNodeOrUndefined(col: number, row: number) {
    const index = row * Grid.GRID_WIDTH + col;
    if (index >= this.nodes.length) {
      return undefined;
    }
    const node = this.nodes[index];
    const isAdjacent = this.isValidAdjacentNodePath(node);
    return isAdjacent ? node : undefined;
  }

  private isValidAdjacentNodePath(node: GraphNode) {
    return node.isEmpty() || node.isEnd();
  }
}
