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

    this.image = null;
    this.old = {};
    this.font = '';
    this.lines = [];
    this.textHeight = 0;

    editor.objects.add(this);

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

    this.updateOld = function () {
        this.old.x = this.x;
        this.old.y = this.y;
        this.old.width = this.width;
        this.old.height = this.height;
        this.old.rx = editor.markers.x / this.x;
        this.old.rw = this.width / editor.markers.width;
        this.old.ry = editor.markers.y / this.y;
        this.old.rh = this.height / editor.markers.height;
    };

    this.setText = function (value) {
        this.text = value;
        this.updateTextLines();
    };

    this.getText = function () {
        return this.text;
    };

    this.update = function() {
        this.updateFont();
        this.updateTextLines();
    };

    /**
     * Обновить шрифт
     */
    this.updateFont = function () {
        this.font = '';
        if (this.fontItalic) this.font += 'italic ';
        if (this.fontBold) this.font += 'bold ';
        this.lineHeight = this.fontSize * 1.4;
        this.font += this.fontSize + 'pt ' + this.fontFamily;
    };

    /**
     * Подготовить текст для вывода
     */
    this.updateTextLines = function () {
        this.lines = [];
        if (this.text && this.text != '') {
            var ln = this.text.split('\n'),
                count = ln.length,
                context = editor.context;

            this.textHeight = this.lineHeight * count;
            editor.context.font = this.font;

            for (var i = 0; i < count; i++) {
                var line = '',
                    words = ln[i].split(' ');

                for (var n = 0, l = words.length; n < l; n++) {
                    var testLine = line + words[n],
                        testWidth = context.measureText(testLine).width;

                    if (testWidth > this.width - 10) {
                        this.lines.push(line);
                        this.textHeight += this.lineHeight;
                        line = words[n] + ' ';
                    } else {
                        line = testLine + ' ';
                    }
                }
                this.lines.push(line);
            }
            this.textHeight -= this.lineHeight;
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

        if (this.image) {
            var h = this.image.naturalHeight * this.width / this.image.naturalWidth;
            context.drawImage(this.image, 20, 20, this.image.naturalWidth - 40, this.image.naturalHeight - 40, this.x, this.y, this.width, h);
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
        if (l = this.lines.length) {
            context.fillStyle = this.textStyle;
            context.font = this.font;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;

            var top, left;

            if (this.textAlign == 'left') {
                left = this.x;
            } else if (this.textAlign == 'right') {
                left = this.x + this.width;
            } else {
                left = this.x + this.width / 2;
            }

            if (this.textBaseline == 'top') {
                top = this.y;
            } else if (this.textBaseline == 'bottom') {
                top = this.y + this.height - this.textHeight;
            } else {
                top = this.y + this.height / 2 - this.textHeight / 2;
            }

            for (var n = 0; n < l; n++) {
                context.fillText(this.lines[n], left, top);
                top += this.lineHeight;
            }
        }
    };
}