export class EuclidianDistance {
    calculate(node1, node2) {
        const [row1, col1] = node1.node.id.substring(1).split('-').map(Number);
        const [row2, col2] = node2.node.id.substring(1).split('-').map(Number);
        return Math.sqrt(Math.pow(row2 - row1, 2) + Math.pow(col2 - col1, 2));
    }
}
