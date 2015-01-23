/**
 * Сохранение и загрузка объектов шаблона
 */
function Serialize () {

    var version = '1.0.0';

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

    var that = this;

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
     * @param editor EditorTemplate
     * @param string
     * @returns {boolean}
     */
    this.load = function (editor, string) {
        if (string == '') return false;
        var data = JSON.parse(string);
        if (data && data.hasOwnProperty('version') && data.hasOwnProperty('objects') && data.version == version) {
            var objects = data.objects,
                lenght = properties.length,
                i, j, l;

            for (i = 0, l = objects.length; i < l; i++) {
                var obj = new EditorObject(editor);
                for (j = 0; j < lenght; j++) {
                    obj[properties[j]] = objects[i][properties[j]];
                }
                obj.init();
            }
            return true;
        }
        return false;
    };
}