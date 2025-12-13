import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import { useId } from 'react';

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
}

export function LabeledSlider({ label, value, min, max, onValueChange }: LabeledSliderProps) {
  const id = useId();

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label htmlFor={id} className='text-sm'>
          {label}
        </Label>
        <span className='text-sm font-medium text-white'>{value}</span>
      </div>
      <Slider id={id} min={min} max={max} value={[value]} onValueChange={(values) => onValueChange(values[0])} />
    </div>
  );
}
