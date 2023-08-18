import { PathOption } from '../src/PathOption.enum';
import { PathSelectorSingleton } from '../src/PathSelectorSingleton';

/*

  - call init multiple times ?

  */

describe('Path Selector', () => {
  beforeEach(() => {
    PathSelectorSingleton.currentPath = PathOption.NONE;
  });

  it('should change the selected path on select', () => {
    PathSelectorSingleton.select(PathOption.START);
    expect(PathSelectorSingleton.currentPath).toBe(PathOption.START);
  });

  it('should change when the button is clicked', () => {
    document.body.innerHTML = `
    <div id="gridUtils">
    <h2></h2>
    <button id="btn-path-start">Place Start</button>
    <button id="btn-path-end">Place End</button>
    <button id="btn-path-wall">Place Wall</button>
    <button id="btn-path-none">Remove placement</button>
    <button>Reinit Grid</button>
  </div>
    `;
    PathSelectorSingleton.initListeners();

    document.getElementById('btn-path-start')?.click();
    expect(PathSelectorSingleton.currentPath).toBe(PathOption.START);

    document.getElementById('btn-path-end')?.click();
    expect(PathSelectorSingleton.currentPath).toBe(PathOption.END);
  });
});
