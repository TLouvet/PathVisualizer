import { PathOption, type GridNodeData } from '../../types/grid-node';

// Color palette
const COLORS = {
  background: '#0a0a0f',
  empty: 'rgba(20, 20, 30, 0.4)',
  emptyBorder: 'rgba(255, 255, 255, 0.06)',
  start: '#10b981',
  startGlow: 'rgba(16, 185, 129, 0.5)',
  end: '#a855f7',
  endGlow: 'rgba(168, 85, 247, 0.5)',
  wall: '#000000',
  wallBorder: '#323232',
  visited: '#ef4444',
  visitedGlow: 'rgba(239, 68, 68, 0.15)',
  solution: '#f59e0b',
  solutionGlow: 'rgba(245, 158, 11, 0.3)',
  hover: 'rgba(255, 255, 255, 0.4)',
  hoverGlow: 'rgba(255, 255, 255, 0.1)',
};

interface NodeAnimationState {
  animationStartTime: number;
}

export class CanvasGridManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grid: GridNodeData[][] = [];
  private width: number;
  private height: number;
  private cellWidth: number = 25;
  private cellHeight: number = 25;
  private animationFrame: number | null = null;
  private nodeAnimations = new Map<string, NodeAnimationState>();
  private hoveredCell: { row: number; col: number } | null = null;

  // Node references
  public startNode: GridNodeData | null = null;
  public endNode: GridNodeData | null = null;

  // Viewport culling
  private renderRadius: number | null = null; // null = render all, number = render within radius
  private focalPoint: { row: number; col: number } | null = null;

  // Render control
  private isPaused: boolean = false;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.initializeGrid();
    this.setupCanvas();
    this.startRenderLoop();
  }

  private initializeGrid() {
    this.grid = [];
    for (let row = 0; row < this.height; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.width; col++) {
        this.grid[row][col] = {
          row,
          col,
          state: PathOption.NONE,
          parent: null,
          costFromStart: Infinity,
          heuristicToEnd: 0,
          totalCost: Infinity,
        };
      }
    }
  }

  private setupCanvas() {
    // Calculate cell size to fit container
    const containerWidth = this.canvas.parentElement?.clientWidth || 800;
    const containerHeight = this.canvas.parentElement?.clientHeight || 600;

    const cellWidth = Math.floor(containerWidth / this.width);
    const cellHeight = Math.floor(containerHeight / this.height);

    const size = Math.min(cellWidth, cellHeight, 60);
    this.cellWidth = Math.max(size, 20);
    this.cellHeight = Math.max(size, 20);

    const canvasWidth = this.width * this.cellWidth;
    const canvasHeight = this.height * this.cellHeight;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = canvasWidth * dpr;
    this.canvas.height = canvasHeight * dpr;
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;

    this.ctx.scale(dpr, dpr);
  }

  // public resize(width: number, height: number) {
  //   this.width = width;
  //   this.height = height;
  //   this.initializeGrid();
  //   this.setupCanvas();
  //   this.nodeAnimations.clear();
  //   this.startNode = null;
  //   this.endNode = null;
  // }

  public getGridCopy(): GridNodeData[][] {
    return this.grid.map((row) => row.map((node) => ({ ...node })));
  }

  public getNode(row: number, col: number): GridNodeData | null {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this.grid[row][col];
    }
    return null;
  }

  public updateNodeState(row: number, col: number, state: PathOption) {
    const node = this.getNode(row, col);
    if (!node) return;

    const key = `${row},${col}`;
    const oldState = node.state;

    node.state = state;

    // Record animation start time if state changed
    if (oldState !== state) {
      this.nodeAnimations.set(key, {
        animationStartTime: performance.now(),
      });
    }
  }

  public placeNode(row: number, col: number, state: PathOption) {
    const node = this.getNode(row, col);
    if (!node) return;

    // Handle start/end placement
    if (state === PathOption.START) {
      // Remove previous start
      if (this.startNode) {
        this.startNode.state = PathOption.NONE;
      }
      node.state = state;
      this.startNode = node;
    } else if (state === PathOption.END) {
      // Remove previous end
      if (this.endNode) {
        this.endNode.state = PathOption.NONE;
      }
      node.state = state;
      this.endNode = node;
    } else if (state === PathOption.NONE) {
      if (this.startNode === node) {
        this.startNode = null;
      }
      if (this.endNode === node) {
        this.endNode = null;
      }
      node.state = state;
    } else {
      node.state = state;
    }

    const key = `${row},${col}`;
    this.nodeAnimations.set(key, {
      animationStartTime: performance.now(),
    });
  }

  public clearPathVisualization() {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const node = this.grid[row][col];
        if (node.state === PathOption.VISITED || node.state === PathOption.SOLUTION) {
          node.state = PathOption.NONE;
          node.costFromStart = Infinity;
          node.heuristicToEnd = 0;
          node.totalCost = Infinity;
          node.parent = null;
        } else {
          node.costFromStart = Infinity;
          node.heuristicToEnd = 0;
          node.totalCost = Infinity;
          node.parent = null;
        }
      }
    }
  }

  public resetGrid() {
    this.initializeGrid();
    this.nodeAnimations.clear();
    this.startNode = null;
    this.endNode = null;
  }

  public gridToScreenCoords(row: number, col: number): { x: number; y: number } {
    return {
      x: col * this.cellWidth,
      y: row * this.cellHeight,
    };
  }

  public screenToGridCoords(x: number, y: number): { row: number; col: number } | null {
    const col = Math.floor(x / this.cellWidth);
    const row = Math.floor(y / this.cellHeight);

    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return { row, col };
    }
    return null;
  }

  public setHoveredCell(row: number | null, col: number | null) {
    if (row === null || col === null) {
      this.hoveredCell = null;
    } else {
      this.hoveredCell = { row, col };
    }
  }

  /**
   * Enable viewport culling to only render cells within a radius of a focal point
   * @param radius - Number of cells to render around the focal point (null = render all)
   * @param focalPoint - Center point for rendering (defaults to grid center if not set)
   */
  public setRenderRadius(radius: number | null, focalPoint?: { row: number; col: number }) {
    this.renderRadius = radius;
    if (focalPoint) {
      this.focalPoint = focalPoint;
    } else if (radius !== null) {
      // Default to center of grid
      this.focalPoint = {
        row: Math.floor(this.height / 2),
        col: Math.floor(this.width / 2),
      };
    }
  }

  /**
   * Update the focal point for viewport culling (e.g., follow player position)
   */
  public setFocalPoint(row: number, col: number) {
    this.focalPoint = { row, col };
  }

  /**
   * Pause the render loop (e.g., when canvas is hidden)
   */
  public pause() {
    this.isPaused = true;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Resume the render loop
   */
  public resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.startRenderLoop();
  }

  private drawCell(node: GridNodeData, timestamp: number) {
    const x = node.col * this.cellWidth;
    const y = node.row * this.cellHeight;
    const key = `${node.row},${node.col}`;

    const animState = this.nodeAnimations.get(key);
    const elapsed = animState ? timestamp - animState.animationStartTime : 0;

    // Clear cell
    this.ctx.clearRect(x, y, this.cellWidth, this.cellHeight);

    switch (node.state) {
      case PathOption.NONE: {
        this.ctx.fillStyle = COLORS.empty;
        this.ctx.fillRect(x + 1, y + 1, this.cellWidth - 2, this.cellHeight - 2);
        this.ctx.strokeStyle = COLORS.emptyBorder;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth - 1, this.cellHeight - 1);
        break;
      }

      case PathOption.START: {
        const pulseProgress = (Math.sin(timestamp * 0.003) + 1) / 2;
        const scale = 1 + pulseProgress * 0.15;
        const glowSize = 12 * pulseProgress;

        const gradient = this.ctx.createRadialGradient(
          x + this.cellWidth / 2,
          y + this.cellHeight / 2,
          0,
          x + this.cellWidth / 2,
          y + this.cellHeight / 2,
          this.cellWidth / 2 + glowSize
        );
        gradient.addColorStop(0, COLORS.startGlow);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - glowSize, y - glowSize, this.cellWidth + glowSize * 2, this.cellHeight + glowSize * 2);

        const scaledWidth = this.cellWidth * scale;
        const scaledHeight = this.cellHeight * scale;
        const offsetX = (this.cellWidth - scaledWidth) / 2;
        const offsetY = (this.cellHeight - scaledHeight) / 2;

        this.ctx.fillStyle = COLORS.start;
        this.ctx.fillRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        break;
      }

      case PathOption.END: {
        const pulseProgress = (Math.sin(timestamp * 0.003) + 1) / 2;
        const scale = 1 + pulseProgress * 0.15;
        const glowSize = 12 * pulseProgress;

        const gradient = this.ctx.createRadialGradient(
          x + this.cellWidth / 2,
          y + this.cellHeight / 2,
          0,
          x + this.cellWidth / 2,
          y + this.cellHeight / 2,
          this.cellWidth / 2 + glowSize
        );
        gradient.addColorStop(0, COLORS.endGlow);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - glowSize, y - glowSize, this.cellWidth + glowSize * 2, this.cellHeight + glowSize * 2);

        const scaledWidth = this.cellWidth * scale;
        const scaledHeight = this.cellHeight * scale;
        const offsetX = (this.cellWidth - scaledWidth) / 2;
        const offsetY = (this.cellHeight - scaledHeight) / 2;

        this.ctx.fillStyle = COLORS.end;
        this.ctx.fillRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        break;
      }

      case PathOption.WALL: {
        const progress = Math.min(elapsed / 300, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const scale = 0.3 + easeOut * 0.7;

        const scaledWidth = this.cellWidth * scale;
        const scaledHeight = this.cellHeight * scale;
        const offsetX = (this.cellWidth - scaledWidth) / 2;
        const offsetY = (this.cellHeight - scaledHeight) / 2;

        this.ctx.fillStyle = COLORS.wall;
        this.ctx.fillRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        this.ctx.strokeStyle = COLORS.wallBorder;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        break;
      }

      case PathOption.VISITED: {
        const progress = Math.min(elapsed / 300, 1);
        const easeOut = 1 - Math.pow(1 - progress, 2);

        if (progress < 1 && progress > 0) {
          const rippleRadius = Math.max((this.cellWidth / 2) * progress, 0.1);
          const gradient = this.ctx.createRadialGradient(
            x + this.cellWidth / 2,
            y + this.cellHeight / 2,
            0,
            x + this.cellWidth / 2,
            y + this.cellHeight / 2,
            rippleRadius
          );
          gradient.addColorStop(0, COLORS.visitedGlow);
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
          this.ctx.fillStyle = gradient;
          this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
        }

        const alpha = 0.15 + easeOut * 0.25;
        this.ctx.fillStyle = COLORS.visited;
        this.ctx.globalAlpha = alpha;
        this.ctx.fillRect(x + 1, y + 1, this.cellWidth - 2, this.cellHeight - 2);
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth - 1, this.cellHeight - 1);
        break;
      }

      case PathOption.SOLUTION: {
        const progress = Math.min(elapsed / 400, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const scale = 0.8 + easeOut * 0.4;
        const glowIntensity = easeOut;

        const glowSize = 10 * glowIntensity;
        const gradient = this.ctx.createRadialGradient(
          x + this.cellWidth / 2,
          y + this.cellHeight / 2,
          0,
          x + this.cellWidth / 2,
          y + this.cellHeight / 2,
          this.cellWidth / 2 + glowSize
        );
        gradient.addColorStop(0, COLORS.solutionGlow);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - glowSize, y - glowSize, this.cellWidth + glowSize * 2, this.cellHeight + glowSize * 2);

        const scaledWidth = this.cellWidth * scale;
        const scaledHeight = this.cellHeight * scale;
        const offsetX = (this.cellWidth - scaledWidth) / 2;
        const offsetY = (this.cellHeight - scaledHeight) / 2;

        this.ctx.fillStyle = COLORS.solution;
        this.ctx.fillRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        break;
      }
    }
  }

  private drawHoverEffect(row: number, col: number, timestamp: number) {
    const x = col * this.cellWidth;
    const y = row * this.cellHeight;

    // Animated pulsing border
    const pulseProgress = (Math.sin(timestamp * 0.005) + 1) / 2;
    const borderWidth = 2 + pulseProgress * 1;
    const glowAlpha = 0.3 + pulseProgress * 0.3;

    // Outer glow
    this.ctx.strokeStyle = COLORS.hoverGlow;
    this.ctx.lineWidth = borderWidth + 4;
    this.ctx.globalAlpha = glowAlpha;
    this.ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth - 1, this.cellHeight - 1);

    // Inner border
    this.ctx.strokeStyle = COLORS.hover;
    this.ctx.lineWidth = borderWidth;
    this.ctx.globalAlpha = 0.6 + pulseProgress * 0.4;
    this.ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth - 1, this.cellHeight - 1);

    // Reset alpha
    this.ctx.globalAlpha = 1;
  }

  private render = (timestamp: number) => {
    // Stop if paused
    if (this.isPaused) return;

    // Determine render bounds
    let startRow = 0;
    let endRow = this.height;
    let startCol = 0;
    let endCol = this.width;

    if (this.renderRadius !== null && this.focalPoint) {
      // Calculate visible area based on focal point and radius
      startRow = Math.max(0, this.focalPoint.row - this.renderRadius);
      endRow = Math.min(this.height, this.focalPoint.row + this.renderRadius + 1);
      startCol = Math.max(0, this.focalPoint.col - this.renderRadius);
      endCol = Math.min(this.width, this.focalPoint.col + this.renderRadius + 1);
    }

    // Clear only the visible area
    const clearX = startCol * this.cellWidth;
    const clearY = startRow * this.cellHeight;
    const clearWidth = (endCol - startCol) * this.cellWidth;
    const clearHeight = (endRow - startRow) * this.cellHeight;

    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(clearX, clearY, clearWidth, clearHeight);

    // Draw cells within render bounds
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        this.drawCell(this.grid[row][col], timestamp);
      }
    }

    // Draw hover effect on top
    if (this.hoveredCell) {
      this.drawHoverEffect(this.hoveredCell.row, this.hoveredCell.col, timestamp);
    }

    // Continue loop
    this.animationFrame = requestAnimationFrame(this.render);
  };

  private startRenderLoop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animationFrame = requestAnimationFrame(this.render);
  }

  public destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
