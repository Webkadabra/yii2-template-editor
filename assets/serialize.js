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
    ];

    this.propertiesText = [
        'font-size',
        'font-weight',
        'font-style',
        'font-family',
        'text-align',
        'vertical-align'
    ];

    var that = this;

    /**
     * Сериализация объектов шаблона
     * @returns string
     */
    this.save = function (elements) {
        var lenghtObject = that.properties.length,
            lenghtText = that.propertiesText.length,
            objects = [],
            cssObject,
            cssText,
            $text,
            i;

        elements.each(function () {
            cssObject = {};
            for (i = 0; i < lenghtObject; i++) {
                cssObject[that.properties[i]] = $(this).css(that.properties[i]);
            }
            $text = $(this).find('.t');
            cssText = {};
            for (i = 0; i < lenghtText; i++) {
                cssText[that.propertiesText[i]] = $text.css(that.propertiesText[i]);
            }
            objects.push({
                cssObject: cssObject,
                cssText: cssText,
                html: $text.html()
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
                $div.css(objects[i]['cssObject']);
                $div.find('.t').css(objects[i]['cssText']).html(objects[i]['html']);
                that.init($div);
            }
            return true;
        }
        return false;
    };
}