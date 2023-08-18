import { DFSStrategy } from '../src/SearchStrategies/DFSStrategy';
import { Search8DirectionsComponent } from '../src/SearchStrategies/component/Search8DirectionComponent';
describe('Depth First Search Strategy', () => {
    it('should be defined', () => {
        expect(new DFSStrategy([], new Search8DirectionsComponent([]))).toBeDefined();
    });
});
