import { PathOption } from './GraphNode/State/PathStateOption.enum';

export class PathSelectorSingleton {
  private constructor() {}

  static currentPath: PathOption = PathOption.NONE;
  private static initialized = false;

  static initListeners() {
    if (PathSelectorSingleton.initialized) return;

    PathSelectorSingleton.onClick('btn-path-start', PathOption.START);
    PathSelectorSingleton.onClick('btn-path-end', PathOption.END);
    PathSelectorSingleton.onClick('btn-path-wall', PathOption.WALL);
    PathSelectorSingleton.onClick('btn-path-none', PathOption.NONE);
    PathSelectorSingleton.initialized = true;
  }

  private static onClick(id: string, selectedOption: PathOption) {
    document.getElementById(id)?.addEventListener('click', () => {
      PathSelectorSingleton.select(selectedOption);
      document.querySelectorAll('.path-selected').forEach((btn) => btn.classList.remove('path-selected'));
      document.getElementById(id)?.classList.add('path-selected');
    });
  }

  static select(option: PathOption) {
    PathSelectorSingleton.currentPath = option;
  }
}
