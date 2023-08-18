import { GraphNode } from '../src/GraphNode/GraphNode';
import { PathEndState } from '../src/GraphNode/State/PathEndState';
import { PathNoneState } from '../src/GraphNode/State/PathNoneState';
import { PathStartState } from '../src/GraphNode/State/PathStartState';
import { PathWallState } from '../src/GraphNode/State/PathWallState';
import { Grid } from '../src/Grid';
import { PathOption } from '../src/PathOption.enum';
import { PathSelectorSingleton } from '../src/PathSelectorSingleton';
/*
 - Definition
 - PathType change
 - Html view change
 - One start/ One end

 - Link Square Node to Html Square representation ?
*/
describe('GraphNode', () => {
    let square;
    beforeEach(() => {
        const div = document.createElement('div');
        square = new GraphNode(div);
    });
    it('should create a GraphNode', () => {
        expect(square).toBeDefined();
    });
    it('should change the PathType of the Node', () => {
        PathSelectorSingleton.currentPath = PathOption.START;
        square.updatePathState();
        expect(square.getCurrentPath()).toBe(PathOption.START);
        PathSelectorSingleton.currentPath = PathOption.END;
        square.updatePathState();
        expect(square.getCurrentPath()).toBe(PathOption.END);
        PathSelectorSingleton.currentPath = PathOption.NONE;
        square.updatePathState();
        expect(square.getCurrentPath()).toBe(PathOption.NONE);
        PathSelectorSingleton.currentPath = PathOption.WALL;
        square.updatePathState();
        expect(square.getCurrentPath()).toBe(PathOption.WALL);
    });
    it('should change the HTML view', () => {
        square.changeState(new PathStartState());
        expect(square.node.classList.toString()).toBe('square path-start');
        square.changeState(new PathEndState());
        expect(square.node.classList.toString()).toBe('square path-end');
        square.changeState(new PathWallState());
        expect(square.node.classList.toString()).toBe('square path-wall');
        square.changeState(new PathNoneState());
        expect(square.node.classList.toString()).toBe('square path-none');
    });
    it('should have only one start', () => {
        const grid = new Grid();
        grid.generate();
        PathSelectorSingleton.currentPath = PathOption.START;
        const first = grid.nodes[0].node;
        const second = grid.nodes[1].node;
        first.click();
        second.click();
        expect(grid.nodes[0].getCurrentPath()).not.toBe(grid.nodes[1].getCurrentPath());
        expect(document.querySelectorAll('.path-start')).toHaveLength(1);
    });
    it('should have only one end', () => {
        const grid = new Grid();
        grid.generate();
        PathSelectorSingleton.currentPath = PathOption.END;
        const first = grid.nodes[0].node;
        const second = grid.nodes[1].node;
        first.click();
        second.click();
        expect(grid.nodes[0].getCurrentPath()).not.toBe(grid.nodes[1].getCurrentPath());
        expect(document.querySelectorAll('.path-end')).toHaveLength(1);
    });
    it('should get current path', () => {
        expect(square.getCurrentPath()).toBe(PathOption.NONE);
        PathSelectorSingleton.currentPath = PathOption.WALL;
        square.updatePathState();
        expect(square.getCurrentPath()).toBe(PathOption.WALL);
    });
});
