import { GridGenerator } from '../src/GridGenerator';
/*
  Quels test va t-on mener ?

  - create a square -- x
  - create a row -- x
  - create the grid -- x
  - Inject into HTML

  - Customize row width ?
  - Customize grid height ?
  - Reinitialize grid ?
*/
describe('GridGenerator', () => {
    it('should create the grid', () => {
        const gridGen = new GridGenerator();
        const grid = gridGen.createGrid([]);
        expect(grid.id).toBe('grid');
        expect(grid.children.length).toBe(10);
        expect(grid.children[0].id).toBe('r0');
        expect(grid.children[0].children.length).toBe(10);
        expect(grid.children[0].children[0].id).toBe('s0-0');
    });
});
