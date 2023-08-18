export interface SearchStrategy {
  solve(): void;
  clear(): void;
  changeSearchComponent(component: '4D' | '8D'): void;
}
