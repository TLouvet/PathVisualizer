import { GraphNode } from '../../GraphNode/GraphNode';

export interface ISearchComponent {
  getAdjacentNodes(currentNode: GraphNode): GraphNode[];
}
