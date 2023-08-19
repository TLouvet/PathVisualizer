import { GraphNode } from '../GraphNode/GraphNode';
import { PathEndState } from '../GraphNode/State/PathEndState';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState';
import { PathOption } from '../PathOption.enum';
import { AbstractSearchStrategy } from './AbstractSearchStrategy';

export class DFSStrategy extends AbstractSearchStrategy {
  solve(start: GraphNode | null, end: GraphNode | null) {
    // Lot of duplication here
    this.performanceMonitorComponent.start();

    if (!start || !end) {
      return;
    }

    // TODO -- render on screen the message
    if (!this.dfs(start, end)) {
      console.log('No Valid Path found');
    }

    this.performanceMonitorComponent.display();
  }

  private dfs(start: GraphNode, end: GraphNode) {
    if (start.node.id === end.node.id) {
      this.path.display();
      end.changeState(new PathEndState());
      return true;
    }

    const adjacentNodes = this.searchComponent.getAdjacentNodes(start);
    adjacentNodes.sort((a, b) => this.getEuclidianDistance(a, end) - this.getEuclidianDistance(b, end));

    for (const node of adjacentNodes) {
      node.changeState(new PathVisitedState());
      this.path.push(node);
      if (this.dfs(node, end)) {
        return true;
      }
      this.path.pop();
    }

    return false;
  }

  private getManhattanDistance(currentNode: GraphNode, endNode: GraphNode): number {
    const [currentX, currentY] = currentNode.node.id.substring(1).split('-').map(Number);
    const [endX, endY] = endNode.node.id.substring(1).split('-').map(Number);
    return Math.abs(currentX - endX) + Math.abs(currentY - endY);
  }

  private getEuclidianDistance(currentNode: GraphNode, endNode: GraphNode): number {
    const [currentX, currentY] = currentNode.node.id.substring(1).split('-').map(Number);
    const [endX, endY] = endNode.node.id.substring(1).split('-').map(Number);
    return Math.sqrt(Math.pow(currentX - endX, 2) + Math.pow(currentY - endY, 2));
  }
}
