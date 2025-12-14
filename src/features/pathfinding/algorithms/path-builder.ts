import type { GridNodeData } from '@/types/grid-node';

/**
 * Utility class for building solution paths by traversing parent references
 */
export class PathBuilder {
  /**
   * Constructs a path from start to end by following parent references backwards
   * @param endNode The goal node with parent chain leading back to start
   * @returns Array of nodes forming the path from start to end
   */
  static buildPath(endNode: GridNodeData): GridNodeData[] {
    const path: GridNodeData[] = [];
    let node: GridNodeData | null = endNode;

    while (node) {
      path.unshift(node);
      node = node.parent;
    }

    return path;
  }
}
