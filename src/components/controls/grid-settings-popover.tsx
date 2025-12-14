import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Settings } from 'lucide-react';
import { LabeledSlider } from './labeled-slider';

interface GridSettingsPopoverProps {
  gridWidth: number;
  gridHeight: number;
  onGridSizeChange: (width: number, height: number) => void;
  showVisitedNodes: boolean;
  onShowVisitedNodesChange: (show: boolean) => void;
  showCellBorders: boolean;
  onShowCellBordersChange: (show: boolean) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
}

export function GridSettingsPopover({
  gridWidth,
  gridHeight,
  onGridSizeChange,
  showVisitedNodes,
  onShowVisitedNodesChange,
  showCellBorders,
  onShowCellBordersChange,
  animationSpeed,
  onAnimationSpeedChange,
}: GridSettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm'>
          <Settings className='w-4 h-4 mr-2' />
          Grid
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80' align='end'>
        <div className='space-y-4'>
          <h4 className='font-medium text-sm'>Grid Settings</h4>
          <div className='space-y-3'>
            <LabeledSlider
              label='Width'
              value={gridWidth}
              min={10}
              max={120}
              onValueChange={(value) => onGridSizeChange(value, gridHeight)}
            />

            <LabeledSlider
              label='Height'
              value={gridHeight}
              min={10}
              max={60}
              onValueChange={(value) => onGridSizeChange(gridWidth, value)}
            />

            <div className='pt-2 border-t'>
              <LabeledSlider
                label='Animation Speed (ms)'
                value={animationSpeed}
                min={0}
                max={500}
                step={10}
                onValueChange={onAnimationSpeedChange}
                formatValue={(value) => (value === 0 ? 'Instant' : `${value}ms`)}
              />
            </div>

            <div className='flex items-center space-x-2 pt-2'>
              <Checkbox id='show-visited' checked={showVisitedNodes} onCheckedChange={onShowVisitedNodesChange} />
              <Label htmlFor='show-visited' className='text-sm font-normal cursor-pointer select-none'>
                Show visited nodes
              </Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox id='show-borders' checked={showCellBorders} onCheckedChange={onShowCellBordersChange} />
              <Label htmlFor='show-borders' className='text-sm font-normal cursor-pointer select-none'>
                Show cell borders
              </Label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
