import { GraphNode } from '../GraphNode/GraphNode';
import { PathSolutionState } from '../GraphNode/State/PathSolutionState';

export class Path {
  public isValid: boolean;
  public nodes: GraphNode[];

  constructor() {
    this.nodes = [];
    this.isValid = false;
  }

  pop() {
    this.nodes.pop();
  }

  push(node: GraphNode) {
    this.nodes.push(node);
  }

  display() {
    this.isValid = true;
    this.nodes.forEach((node) => {
      if (this.isStartOrEnd(node)) {
        return;
      }
      node.changeState(new PathSolutionState());
    });
  }

  private isStartOrEnd(node: GraphNode) {
    return node.isStart() || node.isEnd();
  }

  clear() {
    this.isValid = false;
    this.nodes = [];
  }
}
