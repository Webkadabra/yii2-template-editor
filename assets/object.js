/**
 * Объект шаблона
 */
function EditorObject(editor) {

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.lineWidth = 0;
    this.strokeStyle = '#000000';
    this.fillStyle = null;
    this.textStyle = '#000000';
    this.textAlign = 'center';
    this.textBaseline = 'middle';
    this.lineHeight = 25;
    this.fontFamily = 'Arial';
    this.fontSize = 16;
    this.fontBold = false;
    this.fontItalic = false;
    this.text = null;

    this.old = {x: 0, y: 0, width: 0, height: 0, rx: 0, rw: 0, ry: 0, rh: 0};

    editor.objects.add(this);

    var font,
        lines = [],
        textHeight = 0;

    /**
     * Клонирование объекта
     * @returns {EditorObject}
     */
    this.clone = function() {
        var clone = new EditorObject(editor);
        for (var attr in this) {
            if (clone.hasOwnProperty(attr)) {
                clone[attr] = this[attr];
            }
        }
        return clone;
    };

    this.testPoint = function (point) {
        return (point.x > this.x && point.y > this.y && point.x < this.x + this.width && point.y < this.y + this.height);
    };

    /**
     * @param markers Markers
     */
    this.updateOld = function (markers) {
        this.old.x = this.x;
        this.old.y = this.y;
        this.old.width = this.width;
        this.old.height = this.height;

        this.old.rx = markers.x / this.x;
        this.old.rw = this.width / markers.width;
        this.old.ry = markers.y / this.y;
        this.old.rh = this.height / markers.height;
    };

    this.setText = function (value) {
        this.text = value;
        this.updateTextLines();
    };

    this.getText = function () {
        return this.text;
    };

    /**
     * Инициализация объекта
     */
    this.init = function () {
        this.updateFont();
        this.updateTextLines();
    };

    this.update = function() {
        this.updateFont();
        this.updateTextLines();
    };

    /**
     * Обновить шрифт
     */
    this.updateFont = function () {
        font = this.fontSize + 'pt ' + this.fontFamily;
        if (this.fontBold) font += ' bold';
        if (this.fontItalic) font += ' italic';
    };

    /**
     * Подготовить текст для вывода
     */
    this.updateTextLines = function () {
        lines = [];
        if (this.text && this.text != '') {
            var ln = this.text.split('\n'),
                count = ln.length,
                context = editor.context;

            textHeight = this.lineHeight * count;
            editor.context.font = font;

            for (var i = 0; i < count; i++) {
                var line = '',
                    words = ln[i].split(' ');

                for (var n = 0, l = words.length; n < l; n++) {
                    var testLine = line + words[n],
                        testWidth = context.measureText(testLine).width;

                    if (testWidth > this.width - 10) {
                        lines.push(line);
                        textHeight += this.lineHeight;
                        line = words[n] + ' ';
                    } else {
                        line = testLine + ' ';
                    }
                }
                lines.push(line);
            }
            textHeight -= this.lineHeight;
        }
    };

    /**
     * Отрисовка объекта
     */
    this.draw = function () {
        var context = editor.context;

        if (this.fillStyle) {
            context.fillStyle = this.fillStyle;
            context.fillRect(this.x, this.y, this.width, this.height);
        }

        if (this.lineWidth > 0) {
            context.strokeStyle = this.strokeStyle;
            context.lineWidth = this.lineWidth;
            context.setLineDash([]);
            context.strokeRect(this.x, this.y, this.width, this.height);
        } else if (!this.fillStyle && editor.showFrame && !editor.printMode) {
            context.setLineDash([1, 2]);
            context.strokeStyle = '#888888';
            context.lineWidth = 1;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        var l;
        if (l = lines.length) {
            context.fillStyle = this.textStyle;
            context.font = font;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;

            var top = this.y + this.height / 2 - textHeight / 2,
                left = this.x + this.width / 2;

            for (var n = 0; n < l; n++) {
                context.fillText(lines[n], left, top);
                top += this.lineHeight;
            }
        }
    };
}