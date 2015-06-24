/**
 * Маркеры выделения
 * @param editor Editor
 */
function Markers(editor) {

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    var size = 6,
        fillStyle = '#337AB7',
        visible = false,
        markers = [],
        that = this;

    this.cursors = [
        'nw-resize',
        'n-resize',
        'sw-resize',
        'w-resize',
        'w-resize',
        'sw-resize',
        'n-resize',
        'nw-resize'
    ];

    /**
     * Обновить видимость и расположение маркеров
     */
    this.update = function () {
        if (editor.selected.count() == 0) {
            visible = false
        } else {
            visible = true;

            var x2 = 0, y2 = 0;
            that.x = Infinity;
            that.y = Infinity;

            editor.selected.each(function () {
                if (that.x > this.x) that.x = this.x;
                if (that.y > this.y) that.y = this.y;
                if (x2 < this.x + this.width) x2 = this.x + this.width;
                if (y2 < this.y + this.height) y2 = this.y + this.height;
            });

            this.width = x2 - this.x;
            this.height = y2 - this.y;

            markers[0] = {x: this.x - size, y: this.y - size};
            markers[1] = {x: this.x + this.width / 2 - size / 2, y: this.y - size};
            markers[2] = {x: this.x + this.width, y: this.y - size};
            markers[3] = {x: this.x - size, y: this.y + this.height / 2 - size / 2};
            markers[4] = {x: this.x + this.width, y: this.y + this.height / 2 - size / 2};
            markers[5] = {x: this.x - size, y: this.y + this.height};
            markers[6] = {x: this.x + this.width / 2 - size / 2, y: this.y + this.height};
            markers[7] = {x: this.x + this.width, y: this.y + this.height};
        }
    };

    /**
     * Возвращает ID маркера если указанная точка находится в его пределах. Иначе null
     * @param point
     * @returns {Number/null}
     */
    this.testPoint = function (point) {
        if (visible) {
            for (var i = 0; i < 8; i++) {
                if (point.x > markers[i].x && point.y > markers[i].y && point.x < markers[i].x + size && point.y < markers[i].y + size) {
                    return i;
                }
            }
        }
        return null;
    };

    /**
     * Отрисовка маркеров
     */
    this.draw = function () {
        if (visible) {
            editor.context.fillStyle = fillStyle;
            for (var i = 0; i < 8; i++) {
                editor.context.fillRect(markers[i].x, markers[i].y, size, size);
            }
        }
    };
}