/**
 * Вспомогателные функции редактора
 * @param editor Editor
 */
var EditorFunctions = function (editor) {

    var unit = 37.795;

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
            x: (x - bbox.left * (editor.canvas.width / bbox.width)) / editor.zoom,
            y: (y - bbox.top * (editor.canvas.height / bbox.height)) / editor.zoom
        };
    };

    /**
     * Клонировыние выделенных объектов
     */
    this.clone = function() {
        if (editor.selected.count()) {
            var clones = [];
            editor.selected.each(function () {
                var obj = this.clone();
                obj.x += 20;
                obj.y += 20;
                obj.update();
                clones.push(obj);
            });
            editor.history.create(clones);
            editor.unselectAll();
            for (var i = 0, l = clones.length; i < l; i++) {
                editor.selectObject(clones[i]);
            }
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

    /**
     * Выравнивание объектов
     */
    this.align = function () {
        if (editor.selected.count()) {
            var main = editor.selected.item(0),
                mode = $(this).data('prop');

            editor.history.change(editor.selected.items(), ['x', 'y']);
            editor.selected.each(function () {
                switch (mode) {
                    case 'left': this.x = main.x; break;
                    case 'center': this.x = main.x + main.width / 2 - this.width / 2; break;
                    case 'right': this.x = main.x + main.width - this.width; break;
                    case 'top': this.y = main.y; break;
                    case 'middle': this.y = main.y + main.height / 2 - this.height / 2; break;
                    case 'bottom': this.y = main.y + main.height - this.height; break;
                }
            });
            editor.markers.update();
            editor.update();
        }
    };

    /**
     * Вставка изображения
     * @param file
     */
    this.insertImage = function(file) {
        if (editor.selected.count() == 1) {
            var obj = editor.selected.item(0);
            obj.image = new Image();
            obj.image.onload = obj.image.onerror = function () {
                obj.text = '';
                obj.update();
                editor.update();
                editor.history.change([editor.selectedObject], ['text']);
            };
            obj.image.src = file.url;
        }
    }
};