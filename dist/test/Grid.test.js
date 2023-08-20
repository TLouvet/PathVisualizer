import { PathStartState } from '../src/GraphNode/State/PathStartState';
import { Grid } from '../src/Grid';
import { PathOption } from '../src/GraphNode/State/PathStateOption.enum';
import { PathSelectorSingleton } from '../src/PathSelectorSingleton';
describe('Grid', () => {
    it('should be defined', () => {
        expect(new Grid()).toBeDefined();
    });
    it('should generate grid', () => {
        const grid = new Grid();
        grid.generate();
        const htmlgrid = document.getElementById('grid');
        expect(htmlgrid).toBeTruthy();
        // expect(grid.nodes).toHaveLength(100);
        // expect(grid.nodes[0].node.id).toBe('s0-0');
    });
    it('should set the start after selecting the button', () => {
        document.body.innerHTML = ` <div id="gridUtils">
    <h2></h2>
    <button id="btn-path-start">Place Start</button>
    <button id="btn-path-end">Place End</button>
    <button id="btn-path-wall">Place Wall</button>
    <button id="btn-path-none">Remove placement</button>
    <button>Reinit Grid</button>
  </div>`;
        PathSelectorSingleton.initListeners();
        const grid = new Grid();
        grid.generate();
        const htmlgrid = document.getElementById('grid');
        document.getElementById('btn-path-start')?.click();
        (htmlgrid?.children[0].children[0]).click();
        expect(grid.nodes[0].getCurrentPath()).toBe(PathOption.START);
        expect(htmlgrid?.children[0].children[0].classList.toString()).toBe('square path-start');
    });
    it('should reinitialize Grid', () => {
        const grid = new Grid();
        grid.generate();
        grid.nodes[0].changeState(new PathStartState());
        grid.reinitialize();
        expect(grid.nodes[0].getCurrentPath()).toBe(PathOption.NONE);
    });
    it('should reinitialize on click', () => {
        document.body.innerHTML = ` <div id="gridUtils">
    <h2></h2>
    <button id="btn-path-start">Place Start</button>
    <button id="btn-path-end">Place End</button>
    <button id="btn-path-wall">Place Wall</button>
    <button id="btn-path-none">Remove placement</button>
    <button id="btn-path-reinitialize">Reinit Grid</button>
  </div>`;
        const grid = new Grid();
        grid.generate();
        grid.nodes[0].changeState(new PathStartState());
        document.getElementById('btn-path-reinitialize')?.click();
        expect(grid.nodes[0].getCurrentPath()).toBe(PathOption.NONE);
    });
});
