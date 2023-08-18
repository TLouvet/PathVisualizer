export class SearchComponentTypeSingleton {
    constructor() { }
    static chosenType = '8D';
    static initListeners() {
        document.getElementById('btn-directional-4d')?.addEventListener('click', (e) => {
            SearchComponentTypeSingleton.chosenType = '4D';
            document.querySelectorAll('.search-selected')?.forEach((el) => el.classList.remove('search-selected'));
            e.target.classList.add('search-selected');
        });
        document.getElementById('btn-directional-8d')?.addEventListener('click', (e) => {
            SearchComponentTypeSingleton.chosenType = '8D';
            document.querySelectorAll('.search-selected')?.forEach((el) => el.classList.remove('search-selected'));
            e.target.classList.add('search-selected');
        });
    }
}
