export class EuclidianDistance {
    calculate(startNode, endNode) {
        const { row: row1, col: col1 } = startNode;
        const { row: row2, col: col2 } = endNode;
        return Math.sqrt(Math.pow(row2 - row1, 2) + Math.pow(col2 - col1, 2));
    }
}
