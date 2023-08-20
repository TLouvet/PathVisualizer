import { GraphNode } from '../GraphNode/GraphNode';
import { PathSolutionState } from '../GraphNode/State/PathSolutionState';

export class Path {
  public nodes: GraphNode[];

  constructor() {
    this.nodes = [];
  }

  pop() {
    this.nodes.pop();
  }

  push(node: GraphNode) {
    this.nodes.push(node);
  }

  display() {
    this.nodes.forEach((node) => {
      if (!this.isStartOrEnd(node)) {
        node.changeState(new PathSolutionState());
      }
    });
  }

  private isStartOrEnd(node: GraphNode) {
    return node.isStart() || node.isEnd();
  }
}
