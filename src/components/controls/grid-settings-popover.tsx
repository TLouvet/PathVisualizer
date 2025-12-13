import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { Settings } from 'lucide-react';
import { LabeledSlider } from './labeled-slider';

interface GridSettingsPopoverProps {
  gridWidth: number;
  gridHeight: number;
  onGridSizeChange: (width: number, height: number) => void;
}

export function GridSettingsPopover({ gridWidth, gridHeight, onGridSizeChange }: GridSettingsPopoverProps) {
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
              max={100}
              onValueChange={(value) => onGridSizeChange(value, gridHeight)}
            />

            <LabeledSlider
              label='Height'
              value={gridHeight}
              min={10}
              max={60}
              onValueChange={(value) => onGridSizeChange(gridWidth, value)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
