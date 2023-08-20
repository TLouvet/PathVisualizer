export class MinBinaryHeap<T extends { [key: string]: any }> {
  heap: T[] = [];

  constructor(private key: keyof T) {
    this.heap = [];
    this.key = key;
  }

  clear() {
    this.heap = [];
  }

  public isEmpty() {
    return this.heap.length === 0;
  }

  public insertMany(values: T[]) {
    values.forEach((value) => this.insert(value));
  }

  public insert(value: T) {
    this.heap.push(value);
    this.bubbleUp();
  }

  private bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);

      const element = this.heap[index][this.key];
      const parent = this.heap[parentIndex][this.key];
      if (element >= parent) break;

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
        if (this.heap[leftChildIndex][this.key] < this.heap[index][this.key]) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < this.heap.length) {
        if (
          (swapIndex === null && this.heap[rightChildIndex][this.key] < this.heap[index][this.key]) ||
          (swapIndex !== null && this.heap[rightChildIndex][this.key] < this.heap[leftChildIndex][this.key])
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
