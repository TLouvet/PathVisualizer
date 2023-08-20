import { GraphNode } from '../../GraphNode/GraphNode';

export interface SearchStrategy {
  solve(start: GraphNode | null, end: GraphNode | null): void;
  changeSearchComponent(nodes: GraphNode[]): void;
}
