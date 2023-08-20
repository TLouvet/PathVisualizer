import { MinBinaryHeap } from '../DataStructure/MinHeap';
import { GraphNode } from '../GraphNode/GraphNode';
import { PathEndState } from '../GraphNode/State/PathEndState';
import { PathStartState } from '../GraphNode/State/PathStartState';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState';
import { PathOption } from '../GraphNode/State/PathStateOption.enum';
import { AbstractSearchStrategy } from './AbstractSearchStrategy';

export class DijkstraStrategy extends AbstractSearchStrategy {
  private heap: MinBinaryHeap<GraphNode> = new MinBinaryHeap('localValue');

  solve(start: GraphNode | null, end: GraphNode | null): void {
    this.performanceMonitorComponent.start();
    if (!start || !end) return;

    if (!this.dijkstra(start, end)) {
      console.log('No path found using Dijkstra');
    }

    this.performanceMonitorComponent.display();
  }

  private dijkstra(start: GraphNode, end: GraphNode) {
    start.localValue = 0;
    this.heap.insert(start);
    while (!this.heap.isEmpty()) {
      const currentNode = this.heap.extractMin();

      // if this node is the end node then we can stop the algorithm
      if (currentNode.getCurrentPath() === PathOption.END) {
        let node = currentNode;
        while (node?.parent) {
          this.path.push(node);
          node = node.parent;
        }
        this.path.push(node);
        this.path.display();
        start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state

        return true;
      }

      const adjacentNodes = this.searchComponent.getAdjacentNodes(currentNode);

      for (const adjacentNode of adjacentNodes) {
        const distance = this.searchComponent.getDistance(currentNode, adjacentNode);

        if (adjacentNode.localValue > currentNode.localValue + distance) {
          adjacentNode.localValue = currentNode.localValue + distance;
          adjacentNode.parent = currentNode;
          this.heap.insert(adjacentNode);
        }
      }

      currentNode.changeState(new PathVisitedState());
    }

    start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
    return false;
  }
}
