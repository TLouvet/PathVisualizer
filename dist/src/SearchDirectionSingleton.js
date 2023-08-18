export var ESearchDirection;
(function (ESearchDirection) {
    ESearchDirection["4D"] = "4D";
    ESearchDirection["8D"] = "8D";
})(ESearchDirection || (ESearchDirection = {}));
export class SearchDirectionSingleton {
    static searchDirection = ESearchDirection['4D'];
}
