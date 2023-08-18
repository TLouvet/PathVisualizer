import { MinBinaryHeap } from '../DataStructure/MinHeap';
import { GraphNode } from '../GraphNode/GraphNode';
import { PathStartState } from '../GraphNode/State/PathStartState';
import { PathVisitedState } from '../GraphNode/State/PathVisitedState';
import { AbstractSearchStrategy } from './AbstractSearchStrategy';

// TODO I think this is not a real A* algorithm

export class AStarStrategy extends AbstractSearchStrategy {
  private heap: MinBinaryHeap = new MinBinaryHeap();

  clear(): void {
    super.clear();
    this.heap.clear();
  }

  solve(): void {
    this.performanceMonitorComponent.start();

    const start = this.nodes.find((node) => node.isStart());
    const end = this.nodes.find((node) => node.isEnd());
    if (!start || !end) return;

    this.astar(start, end);
    this.performanceMonitorComponent.display();
  }

  private astar(start: GraphNode, end: GraphNode): boolean {
    start.localValue = 0;
    start.globalValue = this.getEuclidianDistance(start, end);
    this.heap.insert(start);

    let sum = 0;

    while (!this.heap.isEmpty()) {
      const currentNode = this.heap.extractMin();
      // If we find the end node we return true -- this breaks the a* algorithm ad we don't get the shortest path
      if (currentNode.isEnd()) {
        // Here we should just have a continue statement
        let node = currentNode;
        while (node?.parent) {
          this.path.push(node);
          node = node.parent;
        }
        this.path.push(node);
        this.path.display();
        start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
        console.log(`A* updatinglocale took ${sum} milliseconds`);
        return true;
      }

      // We get the adjacent nodes
      const adjacentNodes = this.searchComponent.getAdjacentNodes(currentNode);
      // we update the local value of the adjacent nodes
      const updateStart = performance.now();

      for (const node of adjacentNodes) {
        const manhattanDistance = this.getEuclidianDistance(currentNode, node); // Ca c'est ce qui ralentit le plus dans cette boucle, mais c'est aussi ce qu'on peut précalculer

        if (node.localValue > currentNode.localValue + manhattanDistance) {
          node.localValue = currentNode.localValue + manhattanDistance;
          node.parent = currentNode;
          node.globalValue = node.localValue + this.getEuclidianDistance(node, end);
          this.heap.insert(node);
        }
      }
      sum += performance.now() - updateStart;

      currentNode.changeState(new PathVisitedState());
    }

    start.changeState(new PathStartState()); // We have overidden this state on the first pass, but as we do not want to check for this all turns, we put back the original state
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
