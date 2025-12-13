import { useCallback } from 'react';
import { useCanvasGridManager } from '../../contexts/CanvasGridContext';

interface CanvasGridProps {
  onCellClick: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseDown: () => void;
}

const CanvasGridV2 = ({ onCellClick, onCellMouseEnter, onCellMouseDown }: CanvasGridProps) => {
  const { manager, canvasRef, containerRef } = useCanvasGridManager();
  // Mouse event handlers
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!manager) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const pos = manager.screenToGridCoords(x, y);
      if (pos) {
        onCellClick(pos.row, pos.col);
      }
    },
    [manager, canvasRef, onCellClick]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!manager) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const pos = manager.screenToGridCoords(x, y);
      if (pos) {
        manager.setHoveredCell(pos.row, pos.col);
        onCellMouseEnter(pos.row, pos.col);
      }
    },
    [manager, canvasRef, onCellMouseEnter]
  );

  const handleMouseLeave = useCallback(() => {
    if (!manager) return;
    manager.setHoveredCell(null, null);
  }, [manager]);

  return (
    <div ref={containerRef} className='w-full h-full overflow-auto flex items-center justify-center'>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={onCellMouseDown}
        className='cursor-pointer'
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
};

export default CanvasGridV2;
