import { GraphNode } from '../GraphNode/GraphNode';

export class DijkstraMinBinaryHeap {
  heap: GraphNode[] = [];

  constructor() {
    this.heap = [];
  }

  clear() {
    this.heap = [];
  }

  public isEmpty() {
    return this.heap.length === 0;
  }

  public insertMany(values: GraphNode[]) {
    values.forEach((value) => this.insert(value));
  }

  public insert(value: GraphNode) {
    this.heap.push(value);
    this.bubbleUp();
  }

  private bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      const element = this.heap[index];
      const parent = this.heap[parentIndex];
      if (element.localValue >= parent.localValue) break;

      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private swap(index1: number, index2: number) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  extractMin() {
    const min = this.heap[0];
    const end = this.heap.pop();

    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.sinkDown();
    }

    return min;
  }

  private sinkDown() {
    // start at the top
    let index = 0;
    // compare the top with its children
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex = null;

      if (leftChildIndex < this.heap.length) {
        if (this.heap[leftChildIndex].localValue < this.heap[index].localValue) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < this.heap.length) {
        if (
          (swapIndex === null && this.heap[rightChildIndex].localValue < this.heap[index].localValue) ||
          (swapIndex !== null && this.heap[rightChildIndex].localValue < this.heap[leftChildIndex].localValue)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;

      this.swap(index, swapIndex);
      index = swapIndex;
    }
  }
}