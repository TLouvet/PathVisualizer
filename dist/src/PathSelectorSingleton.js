import { PathOption } from './PathOption.enum.js';
export class PathSelectorSingleton {
    constructor() { }
    static currentPath = PathOption.NONE;
    static initialized = false;
    static initListeners() {
        if (PathSelectorSingleton.initialized)
            return;
        PathSelectorSingleton.onClick('btn-path-start', PathOption.START);
        PathSelectorSingleton.onClick('btn-path-end', PathOption.END);
        PathSelectorSingleton.onClick('btn-path-wall', PathOption.WALL);
        PathSelectorSingleton.onClick('btn-path-none', PathOption.NONE);
        PathSelectorSingleton.initialized = true;
    }
    static onClick(id, selectedOption) {
        document.getElementById(id)?.addEventListener('click', () => {
            PathSelectorSingleton.select(selectedOption);
            document.querySelectorAll('.path-selected').forEach((btn) => btn.classList.remove('path-selected'));
            document.getElementById(id)?.classList.add('path-selected');
        });
    }
    static select(option) {
        PathSelectorSingleton.currentPath = option;
    }
}
