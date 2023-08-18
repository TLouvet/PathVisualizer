import { GraphNode } from '../GraphNode/GraphNode';
import { Distance } from './Distance.interface';

export class EuclidianDistance implements Distance {
  calculate(node1: GraphNode, node2: GraphNode): number {
    const [row1, col1] = node1.node.id.substring(1).split('-').map(Number);
    const [row2, col2] = node2.node.id.substring(1).split('-').map(Number);

    return Math.sqrt(Math.pow(row2 - row1, 2) + Math.pow(col2 - col1, 2));
  }
}
