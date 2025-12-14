/**
 * A queue data structure (FIFO - First In, First Out).
 *
 * Uses a circular buffer approach for O(1) enqueue and dequeue operations,
 * avoiding the O(n) cost of Array.shift().
 */
export class Queue<T> {
  private items: T[] = [];
  private head = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the item at the front of the queue
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.items[this.head];
    this.head++;

    // Reset array when we've processed half to avoid memory waste
    if (this.head > this.items.length / 2) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  /**
   * Returns the item at the front without removing it
   */
  peek(): T | undefined {
    return this.items[this.head];
  }

  /**
   * Checks if the queue is empty
   */
  isEmpty(): boolean {
    return this.head >= this.items.length;
  }

  /**
   * Returns the number of items in the queue
   */
  size(): number {
    return this.items.length - this.head;
  }

  /**
   * Removes all items from the queue
   */
  clear(): void {
    this.items = [];
    this.head = 0;
  }
}
