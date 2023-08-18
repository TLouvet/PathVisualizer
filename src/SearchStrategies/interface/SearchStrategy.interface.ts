export interface SearchStrategy {
  solve(): void;
  clear(): void;
  changeSearchComponent(): void;
}
