
var EditorFunctions = function (editor) {

    const unit = 37.795;

    var toNumber = function (value) {
        if (typeof value === 'string') {
            value = parseFloat(value.replace(',', '.'));
        }
        return value;
    };

    /**
     * Преобразовать в человеческие единицы измерения
     * @param value
     * @returns {Number}
     */
    this.toUnit = function (value) {
        return toNumber(value) / unit;
    };

    /**
     * Преобразовать в единицы измерения холста
     * @param value
     * @returns {number}
     */
    this.fromUnit = function (value) {
        return parseFloat(toNumber(value)) * unit;
    };

    /**
     * Преобразовать координаты мыши
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    this.windowToCanvas = function (x, y) {
        var bbox = editor.canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (editor.canvas.width / bbox.width),
            y: y - bbox.top * (editor.canvas.height / bbox.height)
        };
    };

    /**
     * Клонировыние выделенных объектов
     */
    this.clone = function() {
        if (editor.selected.count()) {
            var clones = new EditorGroup();
            editor.selected.each(function () {
                var obj = this.clone();
                obj.x += 20;
                obj.y += 20;
                obj.init();
                clones.add(obj);
            });
            editor.selected = clones;
            editor.history.create(clones.items());
            editor.markers.update();
            editor.update();
        }
    };

    /**
     * Удаление выделенных объектов
     */
    this.remove = function () {
        if (editor.selected.count()) {
            editor.history.remove(editor.selected.items());
            editor.selected.each(function () {
                editor.objects.remove(this);
            });
            editor.unselectAll();
            editor.update();
        }
    };
};