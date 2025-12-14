import { useGridStore } from '@/store/grid-store';
import { PathOption } from '@/types/grid-node';
import { AlgorithmType, DirectionType } from '@/features/pathfinding/types/algorithm';
import { Button } from '@/shared/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { RotateCcw, Activity, Sparkles, Box } from 'lucide-react';
import { CustomSelect } from './custom-select';
import { MazeAlgorithmSelect } from './maze-algorithm-select';
import { GridSettingsPopover } from './grid-settings-popover';
import { algorithmOptions, directionOptions } from '@/features/pathfinding/config/algorithm-labels';
import { useCanvasGridManager } from '@/contexts/CanvasGridContext';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';

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
    triggerAnimatedMaze,
    executionTime,
    isCalculating,
  } = useGridStore();

  const { manager } = useCanvasGridManager();
  const isMobile = useIsMobile();

  const handleResetGrid = () => {
    if (manager) {
      manager.resetGrid();
    }
  };

  return (
    <div className='w-full backdrop-blur-md bg-background/30 border-b border-white/10 sticky top-0 z-50'>
      <div className='flex items-center justify-between px-4 py-3 gap-4 flex-wrap'>
        {/* Left side - Drawing Tools */}
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-sm text-muted-foreground hidden lg:inline'>Tool:</span>
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

        {/* Right side - Settings and Controls */}
        <div className='flex items-center gap-2 flex-wrap'>
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

          <Separator orientation='vertical' className='h-8 hidden md:block' />

          <GridSettingsPopover gridWidth={gridWidth} gridHeight={gridHeight} onGridSizeChange={setGridSize} />

          {/* Maze Algorithm Select */}
          <MazeAlgorithmSelect
            value={selectedMazeAlgorithm}
            onValueChange={setSelectedMazeAlgorithm}
            className='w-32 h-9'
          />

          {/* Generate Maze Button */}
          <Button onClick={triggerAnimatedMaze} variant='outline' size='sm' disabled={isCalculating}>
            <Sparkles className='w-4 h-4' />
            <span className='ml-2 hidden sm:inline'>Generate</span>
          </Button>

          {/* Reset Button */}
          <Button onClick={handleResetGrid} variant='outline' size='sm'>
            <RotateCcw className='w-4 h-4' />
            <span className='ml-2 hidden sm:inline'>Reset</span>
          </Button>

          {/* 3D View Button - Hidden on mobile (keyboard navigation only) */}
          {onShow3DView && !isMobile && (
            <Button onClick={onShow3DView} variant='outline' size='sm' className='hidden lg:flex'>
              <Box className='w-4 h-4' />
              <span className='ml-2'>3D View</span>
            </Button>
          )}

          <Separator orientation='vertical' className='h-8 hidden md:block' />

          {/* Status & Execution Time */}
          <div className='flex items-center gap-2'>
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
