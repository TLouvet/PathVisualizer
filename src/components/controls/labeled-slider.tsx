import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import { useId } from 'react';

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function LabeledSlider({ label, value, min, max, step, onValueChange, formatValue }: LabeledSliderProps) {
  const id = useId();
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label htmlFor={id} className='text-sm'>
          {label}
        </Label>
        <span className='text-sm font-medium text-white'>{displayValue}</span>
      </div>
      <Slider id={id} min={min} max={max} step={step} value={[value]} onValueChange={(values) => onValueChange(values[0])} />
    </div>
  );
}
