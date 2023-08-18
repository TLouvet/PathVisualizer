import { GraphNode } from './GraphNode/GraphNode.js';
import { GridSizeSingleton } from './GridSizeSingleton.js';
export class GridGenerator {
    injectIntoBody() {
        const grid = [];
        // remove old before reinjecting
        document.getElementById('grid')?.remove();
        const container = document.getElementById('grid-container');
        container?.appendChild(this.createGrid(grid));
        return grid;
    }
    createGrid(grid) {
        const gridHTML = document.createElement('div');
        gridHTML.setAttribute('id', 'grid');
        for (let i = 0; i < GridSizeSingleton.GRID_HEIGHT; i++) {
            gridHTML.appendChild(this.createRow(i, grid));
        }
        return gridHTML;
    }
    createRow(rowIndex, grid) {
        const rowHTML = document.createElement('div');
        rowHTML.setAttribute('id', `r${rowIndex}`);
        rowHTML.setAttribute('class', 'row');
        for (let i = 0; i < GridSizeSingleton.GRID_WIDTH; i++) {
            const graphNode = this.createSquare(`s${rowIndex}-${i}`);
            grid.push(graphNode);
            rowHTML.appendChild(graphNode.node);
        }
        return rowHTML;
    }
    createSquare(id) {
        const squareHTML = document.createElement('div');
        const graphNode = new GraphNode(squareHTML);
        squareHTML.setAttribute('id', id);
        squareHTML.setAttribute('class', 'square path-none');
        squareHTML.style.width = 100 / GridSizeSingleton.GRID_WIDTH - 0.5 + 'vw';
        squareHTML.style.height = 100 / GridSizeSingleton.GRID_HEIGHT - 0.5 + 'vw';
        return graphNode;
    }
}
