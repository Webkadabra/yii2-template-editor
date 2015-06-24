/**
 * Сохранение и загрузка объектов шаблона
 */
function Serialize () {

    var version = '1.0.0';

    /**
     * Список сохраняемых параметров объекта
     */
    var properties = [
        'x',
        'y',
        'width',
        'height',
        'text',
        'lineWidth',
        'strokeStyle',
        'fillStyle',
        'textStyle',
        'textAlign',
        'textBaseline',
        'lineHeight',
        'fontFamily',
        'fontSize',
        'fontBold',
        'fontItalic'
    ];

    /**
     * Сериализация объектов шаблона
     * @returns string
     */
    this.save = function (items) {
        var objects = [], i, lenght = properties.length;
        items.each(function () {
            var obj = {};
            for (i = 0; i < lenght; i++) {
                obj[properties[i]] = this[properties[i]];
            }
            objects.push(obj);
        });

        return JSON.stringify({
            version: version,
            objects: objects
        });
    };

    /**
     * Загрузка объектов шаблона из строки
     * @param strings
     * @param editor
     * @param callback
     */
    this.load = function (strings, editor, callback) {
        if (strings == '') return false;
        var imageCount = 0,
            editors = [], e;

        for (var n = 0; n < strings.length; n++) {

            var data = JSON.parse(strings[n]);

            if (n == 0) {
                e = editor;
            } else {
                e = new Editor(n);
            }
            editors.push(e);

            if (data && data.hasOwnProperty('version') && data.hasOwnProperty('objects') && data.version == version) {
                var objects = data.objects,
                    lenght = properties.length,
                    i, j, l;

                for (i = 0, l = objects.length; i < l; i++) {
                    var obj = new EditorObject(e);
                    for (j = 0; j < lenght; j++) {
                        obj[properties[j]] = objects[i][properties[j]];
                    }
                }

                var result = function () {
                    imageCount--;
                    if (imageCount == 0) {
                        callback({state: true, editors: editors});
                    }
                };

                e.objects.each(function () {
                    var obj = this,
                        matches = /\[image:(.*)\]/.exec(obj.text);
                    if (matches) {
                        imageCount++;
                        obj.image = new Image();
                        if (matches[1].indexOf('http') != -1) obj.image.crossOrigin = '';
                        obj.image.onload = obj.image.onerror = result;
                        obj.image.src = matches[1];
                        obj.text = null;
                    } else {
                        obj.update();
                    }
                });
            } else {
                callback(false);
            }
        }

        if (imageCount == 0) {
            callback({state: true, editors: editors});
        }
    };
}