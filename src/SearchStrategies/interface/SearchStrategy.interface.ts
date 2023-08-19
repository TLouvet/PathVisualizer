import { GraphNode } from '../../GraphNode/GraphNode';

export interface SearchStrategy {
  solve(start: GraphNode | null, end: GraphNode | null): void;
  clear(): void;
  changeSearchComponent(): void;
}
