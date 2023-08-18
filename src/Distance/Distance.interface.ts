import { GraphNode } from '../GraphNode/GraphNode';

export interface Distance {
  calculate(node1: GraphNode, node2: GraphNode): number;
}
