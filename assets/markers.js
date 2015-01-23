/**
 * Маркеры выделения
 */
function Markers(editor) {

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.size = 6;
    this.fillStyle = '#337AB7';

    this.visible = false;
    this.markers = [];

    var that = this;

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
            this.visible = false
        } else {
            this.visible = true;

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

            this.markers[0] = {x: this.x - this.size, y: this.y - this.size};
            this.markers[1] = {x: this.x + this.width / 2 - this.size / 2, y: this.y - this.size};
            this.markers[2] = {x: this.x + this.width, y: this.y - this.size};
            this.markers[3] = {x: this.x - this.size, y: this.y + this.height / 2 - this.size / 2};
            this.markers[4] = {x: this.x + this.width, y: this.y + this.height / 2 - this.size / 2};
            this.markers[5] = {x: this.x - this.size, y: this.y + this.height};
            this.markers[6] = {x: this.x + this.width / 2 - this.size / 2, y: this.y + this.height};
            this.markers[7] = {x: this.x + this.width, y: this.y + this.height};
        }
    };

    /**
     * Возвращает ID маркера если указанная точка находится в его пределах. Иначе null
     * @param point
     */
    this.testPoint = function (point) {
        if (this.visible) {
            for (var i = 0; i < 8; i++) {
                if (point.x > this.markers[i].x && point.y > this.markers[i].y && point.x < this.markers[i].x + this.size && point.y < this.markers[i].y + this.size) {
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
        if (this.visible) {
            editor.context.fillStyle = this.fillStyle;
            for (var i = 0; i < 8; i++) {
                editor.context.fillRect(this.markers[i].x, this.markers[i].y, this.size, this.size);
            }
        }
    };
}