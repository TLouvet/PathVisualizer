export class MinBinaryHeap {
    key;
    heap = [];
    constructor(key) {
        this.key = key;
        this.heap = [];
        this.key = key;
    }
    clear() {
        this.heap = [];
    }
    isEmpty() {
        return this.heap.length === 0;
    }
    insertMany(values) {
        values.forEach((value) => this.insert(value));
    }
    insert(value) {
        this.heap.push(value);
        this.bubbleUp();
    }
    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            const element = this.heap[index][this.key];
            const parent = this.heap[parentIndex][this.key];
            if (element >= parent)
                break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }
    swap(index1, index2) {
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
    sinkDown() {
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
                if ((swapIndex === null && this.heap[rightChildIndex][this.key] < this.heap[index][this.key]) ||
                    (swapIndex !== null && this.heap[rightChildIndex][this.key] < this.heap[leftChildIndex][this.key])) {
                    swapIndex = rightChildIndex;
                }
            }
            if (swapIndex === null)
                break;
            this.swap(index, swapIndex);
            index = swapIndex;
        }
    }
}
