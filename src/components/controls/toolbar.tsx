import { useGridStore } from '@/store/grid-store';
import { PathOption } from '@/types/grid-node';
import { AlgorithmType, DirectionType } from '@/features/pathfinding/types/algorithm';
import { Button } from '@/shared/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { RotateCcw, Activity, Sparkles, Box, Info } from 'lucide-react';
import { CustomSelect } from './custom-select';
import { MazeAlgorithmSelect } from './maze-algorithm-select';
import { GridSettingsPopover } from './grid-settings-popover';
import { algorithmOptions, directionOptions } from '@/features/pathfinding/config/algorithm-labels';
import { useCanvasGridManager } from '@/contexts/CanvasGridContext';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';
import { useEffect, useState } from 'react';

interface ToolbarProps {
  onShow3DView?: () => void;
}

export function Toolbar({ onShow3DView }: ToolbarProps) {
  const {
    currentTool,
    setCurrentTool,
    selectedAlgorithm,
    setSelectedAlgorithm,
    selectedDirection,
    setSelectedDirection,
    selectedMazeAlgorithm,
    setSelectedMazeAlgorithm,
    gridWidth,
    gridHeight,
    setGridSize,
    showVisitedNodes,
    setShowVisitedNodes,
    showCellBorders,
    setShowCellBorders,
    triggerAnimatedMaze,
    executionTime,
    isCalculating,
    startNode,
    endNode,
    incrementGridVersion,
  } = useGridStore();

  const { manager } = useCanvasGridManager();
  const isMobile = useIsMobile();
  const [showQuickStartHint, setShowQuickStartHint] = useState(true);

  const handleResetGrid = () => {
    if (manager) {
      manager.resetGrid();
      incrementGridVersion(); // Abort any ongoing algorithm visualization
    }
  };

  // Hide hint after first visualization or if start & end are placed
  useEffect(() => {
    if (startNode && endNode) {
      setShowQuickStartHint(false);
    }
  }, [startNode, endNode]);

  return (
    <div className='w-full backdrop-blur-md bg-background/30 border-b border-white/10 sticky top-0 z-50'>
      <div className='flex items-center justify-between px-4 py-3 gap-4 flex-wrap'>
        {/* Quick Start Hint */}
        {showQuickStartHint && (
          <div className='w-full flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2'>
            <Info className='w-4 h-4 shrink-0' />
            <span>
              Quick start: Place <strong>Start</strong> and <strong>End</strong> points on the grid to see the pathfinding visualization
            </span>
          </div>
        )}

        {/* Main Toolbar */}
        <div className='w-full flex items-center justify-between gap-3 flex-wrap'>
          {/* Group 1: Grid Setup */}
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-xs text-muted-foreground hidden lg:inline font-medium'>Setup:</span>
            <GridSettingsPopover
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              onGridSizeChange={setGridSize}
              showVisitedNodes={showVisitedNodes}
              onShowVisitedNodesChange={setShowVisitedNodes}
              showCellBorders={showCellBorders}
              onShowCellBordersChange={setShowCellBorders}
            />

            {/* Drawing Tools */}
            <ToggleGroup
              type='single'
              value={currentTool}
              onValueChange={(value) => value && setCurrentTool(value as PathOption)}
              size='sm'
            >
              <ToggleGroupItem value={PathOption.START} aria-label='Place Start'>
                Start
              </ToggleGroupItem>
              <ToggleGroupItem value={PathOption.END} aria-label='Place End'>
                End
              </ToggleGroupItem>
              <ToggleGroupItem value={PathOption.WALL} aria-label='Place Wall'>
                Wall
              </ToggleGroupItem>
              <ToggleGroupItem value={PathOption.NONE} aria-label='Erase'>
                Erase
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator orientation='vertical' className='h-10 hidden lg:block' />

          {/* Group 2: Algorithm Configuration */}
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-xs text-muted-foreground hidden lg:inline font-medium'>Algorithm:</span>
            <CustomSelect
              value={selectedAlgorithm}
              onValueChange={(value) => setSelectedAlgorithm(value as AlgorithmType)}
              options={algorithmOptions}
              className='w-32 h-9'
            />

            <CustomSelect
              value={String(selectedDirection)}
              onValueChange={(value) => setSelectedDirection(Number(value) as DirectionType)}
              options={directionOptions}
              className='w-32 h-9'
            />
          </div>

          <Separator orientation='vertical' className='h-10 hidden lg:block' />

          {/* Group 3: Maze Generation */}
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-xs text-muted-foreground hidden lg:inline font-medium'>Maze:</span>
            <MazeAlgorithmSelect
              value={selectedMazeAlgorithm}
              onValueChange={setSelectedMazeAlgorithm}
              className='w-32 h-9'
            />

            <Button onClick={triggerAnimatedMaze} variant='outline' size='sm' disabled={isCalculating}>
              <Sparkles className='w-4 h-4' />
              <span className='ml-2 hidden sm:inline'>Generate</span>
            </Button>
          </div>

          <Separator orientation='vertical' className='h-10 hidden lg:block' />

          {/* Group 4: Action Buttons */}
          <div className='flex items-center gap-2 flex-wrap'>
            <Button onClick={handleResetGrid} variant='outline' size='sm'>
              <RotateCcw className='w-4 h-4' />
              <span className='ml-2 hidden sm:inline'>Clear</span>
            </Button>
          </div>

          <Separator orientation='vertical' className='h-10 hidden lg:block' />

          {/* Group 5: Stats & Extras */}
          <div className='flex items-center gap-2 flex-wrap'>
            {/* 3D View Button - Hidden on mobile */}
            {onShow3DView && !isMobile && (
              <Button onClick={onShow3DView} variant='outline' size='sm' className='hidden lg:flex'>
                <Box className='w-4 h-4' />
                <span className='ml-2'>3D View</span>
              </Button>
            )}

            {/* Status & Execution Time */}
            {isCalculating && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Activity className='w-3 h-3 animate-pulse' />
                <span className='hidden sm:inline'>Calculating</span>
              </Badge>
            )}
            <Badge variant='outline' className='flex items-center gap-1'>
              <span className='hidden sm:inline'>Time:</span>
              <span className='font-mono'>{executionTime.toFixed(2)}ms</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
