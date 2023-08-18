import { GraphNode } from './GraphNode/GraphNode';
import { Grid } from './Grid';

export class GridGenerator {
  injectIntoBody() {
    const grid: GraphNode[] = [];
    // remove old before reinjecting
    document.getElementById('grid')?.remove();
    const container = document.getElementById('grid-container');
    container?.appendChild(this.createGrid(grid));
    return grid;
  }

  createGrid(grid: GraphNode[]) {
    const gridHTML: HTMLDivElement = document.createElement('div');
    gridHTML.setAttribute('id', 'grid');
    for (let i = 0; i < Grid.GRID_HEIGHT; i++) {
      gridHTML.appendChild(this.createRow(i, grid));
    }
    return gridHTML;
  }

  private createRow(rowIndex: number, grid: GraphNode[]): HTMLDivElement {
    const rowHTML = document.createElement('div');
    rowHTML.setAttribute('id', `r${rowIndex}`);
    rowHTML.setAttribute('class', 'row');
    for (let i = 0; i < Grid.GRID_WIDTH; i++) {
      const graphNode = this.createSquare(`s${rowIndex}-${i}`);
      grid.push(graphNode);
      rowHTML.appendChild(graphNode.node);
    }
    return rowHTML;
  }

  private createSquare(id: string): GraphNode {
    const squareHTML = document.createElement('div');
    const graphNode = new GraphNode(squareHTML);
    squareHTML.setAttribute('id', id);
    squareHTML.setAttribute('class', 'square path-none');
    squareHTML.style.width = 100 / Grid.GRID_WIDTH - 0.5 + 'vw';
    squareHTML.style.height = 100 / Grid.GRID_HEIGHT - 0.5 + 'vw';
    return graphNode;
  }
}
