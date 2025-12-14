import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MazeAlgorithm } from '@/features/maze/types/maze';
import { mazeAlgorithmOptions } from '@/features/maze/config/algorithm-labels';

interface MazeAlgorithmSelectProps {
  value: MazeAlgorithm;
  onValueChange: (value: MazeAlgorithm) => void;
  className?: string;
}

export function MazeAlgorithmSelect({ value, onValueChange, className }: MazeAlgorithmSelectProps) {
  const selectedOption = mazeAlgorithmOptions.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={(val) => onValueChange(val as MazeAlgorithm)}>
      <SelectTrigger className={className}>
        <SelectValue>{selectedOption?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {mazeAlgorithmOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className='flex flex-col items-start gap-0.5 py-0.5'>
              <span className='font-medium text-white'>{option.label}</span>
              <span className='text-xs text-white/50 font-normal'>{option.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
