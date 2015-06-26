/**
 * Сохранение и загрузка объектов шаблона
 */
function Serialize (editor) {

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
            if (this.image != null) {
                obj.text = '[image:' + this.image.src + ']';
            }
            objects.push(obj);
        });

        return JSON.stringify({
            version: version,
            objects: objects
        });
    };

    this.callback = null;
    this.editor = editor;
    var imageCount = 0;
    var that = this;

    /**
     * Загрузка объектов шаблона из строки
     * @param string
     */
    this.load = function (string) {
        if (string == '') return false;
        var data = JSON.parse(string);
        if (data && data.hasOwnProperty('version') && data.hasOwnProperty('objects') && data.version == version) {
            var objects = data.objects,
                lenght = properties.length,
                i, j, l;

            for (i = 0, l = objects.length; i < l; i++) {
                var obj = new EditorObject(that.editor);
                for (j = 0; j < lenght; j++) {
                    obj[properties[j]] = objects[i][properties[j]];
                }
            }

            parseObjects(that.editor.objects);

        } else {
            that.callback(false);
        }

        if (imageCount == 0) {
            that.callback(true);
        }
    };

    function onload() {
        imageCount--;
        if (imageCount == 0) {
            that.callback(true);
        }
    }

    function parseObjects(objects) {
        objects.each(function () {
            var obj = this,
                matches;

            //Изображения
            matches = /\[image:(.*)\]/.exec(obj.text);
            if (matches) {
                imageCount++;
                obj.image = new Image();
                if (matches[1].indexOf('http') != -1) obj.image.crossOrigin = '';
                obj.image.onload = obj.image.onerror = onload;
                obj.image.src = matches[1];
                obj.text = null;
            } else {
                obj.update();
            }
        });
    }
}