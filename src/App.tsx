import { Activity, useState } from 'react';
import Grid from './components/grid/grid';
import { Header } from './components/layout/header';
import { Toolbar } from './components/controls/toolbar';
import { LandscapePrompt } from './components/layout/landscape-prompt';
import { CanvasGridProvider } from './contexts/CanvasGridContext';
import { useOrientation } from './shared/hooks/use-orientation';
import { useIsMobile } from './shared/hooks/use-is-mobile';
import { MazeView3D } from './features/3d-view/components/MazeView3D';

function App() {
  const orientation = useOrientation();
  const isMobile = useIsMobile();
  const showLandscapePrompt = isMobile && orientation === 'portrait';
  const [show3DView, setShow3DView] = useState(false);

  return (
    <CanvasGridProvider>
      {showLandscapePrompt && <LandscapePrompt />}
      <Activity mode={show3DView ? 'hidden' : 'visible'}>
        <div className='min-h-screen bg-background flex flex-col'>
          <Header />
          <Toolbar onShow3DView={() => setShow3DView(true)} />
          <div className='flex-1 p-4 md:p-8 overflow-hidden'>
            <div className='max-w-7xl mx-auto h-full'>
              <Grid />
            </div>
          </div>
        </div>
      </Activity>
      {show3DView && <MazeView3D onExit={() => setShow3DView(false)} />}
    </CanvasGridProvider>
  );
}

export default App;
