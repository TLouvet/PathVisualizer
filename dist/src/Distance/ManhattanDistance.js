export class ManhattanDistance {
    calculate(startNode, endNode) {
        const { row: row1, col: col1 } = startNode;
        const { row: row2, col: col2 } = endNode;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2);
    }
}
