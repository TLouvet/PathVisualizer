import { DFSStrategy } from '../src/SearchStrategies/DFSStrategy';

describe('Depth First Search Strategy', () => {
  it('should be defined', () => {
    expect(new DFSStrategy([])).toBeDefined();
  });
});
