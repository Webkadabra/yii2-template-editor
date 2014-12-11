/**
 * Сохранение и загрузка объектов шаблона
 */
function Serialize () {

    this.version = '1.0.0';

    this.init = null;

    this.create = null;

    this.properties = [
        'left',
        'top',
        'width',
        'height',
        'left',
        'color',
        'border-width',
        'border-color',
        'background-color',
        'font-size',
        'font-weight',
        'font-style',
        'font-family'
    ];

    var that = this;

    /**
     * Сериализация объектов шаблона
     * @returns string
     */
    this.save = function (elements) {
        var l = that.properties.length,
            objects = [],
            css;

        elements.each(function () {
            css = {};
            for (var i = 0; i < l; i++) {
                css[that.properties[i]] = $(this).css(that.properties[i]);
            }
            objects.push({
                css: css,
                html: $(this).find('.t').html()
            });
        });

        return JSON.stringify({
            version: that.version,
            objects:objects
        });
    };

    /**
     * Загрузка объектов шаблона из строки
     * @param string
     * @returns {boolean}
     */
    this.load = function (string) {
        if (string == '') return false;
        var data = JSON.parse(string);
        if (data && data.hasOwnProperty('version') && data.hasOwnProperty('objects') && data.version == that.version) {
            var objects = data.objects,
                $div;

            for (var i = 0, l = objects.length; i < l; i++) {
                $div = that.create();
                $div.css(objects[i]['css']);
                $div.find('.t').html(objects[i]['html']);
                that.init($div);
            }
            return true;
        }
        return false;
    };
}