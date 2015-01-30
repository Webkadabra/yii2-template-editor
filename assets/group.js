/**
 * Группа объектов
 */
function EditorGroup() {

    var items = [];

    /**
     * Добавить в группу
     * @param obj {EditorObject}
     */
    this.add = function (obj) {
        items.push(obj);
    };

    /**
     * Удаление элемента
     * @param obj
     */
    this.remove = function (obj) {
        for (var i = 0, l = items.length; i < l; i++) {
            if (obj == items[i]) {
                items.splice(i, 1);
                return i;
            }
        }
        return null;
    };

    /**
     * Вернуть элемент по индексу
     * @param index
     * @returns {EditorObject}
     */
    this.item = function (index) {
        return items[index];
    };

    /**
     * Все элементы группы
     * @returns {Array}
     */
    this.items = function () {
        return items;
    };

    /**
     * Очистить группу
     */
    this.clear = function () {
        items = [];
    };

    /**
     * Размер группы
     * @returns {Number}
     */
    this.count = function () {
        return items.length;
    };

    /**
     * Обход элементов группы
     * @param callback
     */
    this.each = function (callback) {
        for (var i = 0, l = items.length; i < l; i++) {
            if (callback.call(items[i]) === false) break;
        }
    };

    /**
     * Обход элементов группы в обратном порядке
     * @param callback
     */
    this.reverseEach = function (callback) {
        for (var i = items.length - 1; i >= 0; i--) {
            if (callback.call(items[i]) === false) break;
        }
    }
}