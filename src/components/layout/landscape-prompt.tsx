import { RotateCw } from 'lucide-react';

export function LandscapePrompt() {
  return (
    <div className='fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6'>
      <div className='max-w-md text-center space-y-6'>
        <div className='flex justify-center'>
          <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse'>
            <RotateCw className='w-10 h-10 text-primary' />
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-foreground'>
            Rotate Your Device
          </h2>
          <p className='text-muted-foreground'>
            For the best experience, please rotate your device to landscape mode.
          </p>
        </div>

        <div className='text-sm text-muted-foreground/60'>
          You can still use the app in portrait mode, but the visualization will be limited.
        </div>
      </div>
    </div>
  );
}
