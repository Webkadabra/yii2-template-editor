$(document).ready(function () {

    const unit = 37.795;
    const selectBorderStyle = '1px dotted red';

    var $paper = $('#paper');
    var $selected = null;
    var $selectedBorder = null;


    var objectProps = [
        'left', 'top', 'width', 'height', 'background', 'border'
    ];

    var initObject = function ($obj) {
        $obj.draggable({
            start: function( event, ui ) {
                if ($selected != $(this)) {
                    selectObject($(this));
                }
            },
            drag: function( event, ui ) {
                updateProps($(this));
            }
        }).resizable({
            handles: 'all',
            //helper: "ui-resizable-helper",
            autoHide: true,
            start: function( event, ui ) {
                if ($selected != $(this)) {
                    selectObject($(this));
                }
            },
            resize: function( event, ui ) {
                updateObject($(this));
            },
            stop: function( event, ui ) {
                updateProps($(this));
            }
        });
        $paper.append($obj);
        updateObject($obj);
    };

    var updateObject = function ($obj) {
        var $t = $obj.find('.t');
        $t.css({
            width: $obj.css('width'),
            height: $obj.css('height')
        });
    };

    var createObject = function() {
        return $('<div class="object"><div class="t"></div></div>').css({
            'top': 10,
            'left': 10
        });
    };

    var toNumber = function (value) {
        if (typeof value === 'string') {
            value = parseFloat(value.replace(',', '.'));
        }
        return value;
    };

    var toUnit = function (value) {
        return (toNumber(value) / unit).toFixed(2);
    };

    var fromUnit = function (value) {
        return parseFloat(toNumber(value)) * unit;
    };

    var selectObject = function($obj) {
        if ($selected) {
            $selected.css('border', $selectedBorder);
        }
        $selected = $obj;
        $selectedBorder = $obj.css('border');
        $obj.css('border', selectBorderStyle);
        updateProps($obj);
        $buttonDelete.removeAttr('disabled');
        $buttonCopy.removeAttr('disabled');
        $uiProps.removeAttr('disabled');
    };

    var unselectAll = function () {
        $buttonDelete.attr('disabled', 'disabled');
        $buttonCopy.attr('disabled', 'disabled');
        $uiProps.val('').attr('disabled', 'disabled');
        $textArea.val('').attr('disabled', 'disabled');
        $listFont.attr('disabled', 'disabled');
        $textFontSize.attr('disabled', 'disabled');

        if ($selected) {
            $selected.css('border', $selectedBorder);
        }
        $selected = null;
    };

    var updateProps = function ($obj) {
        $uiProps.each(function () {
            var prop = $(this).attr('data-te-prop');
            var value = $obj.css(prop);
            if ($(this).attr('data-unit') == 1) value = toUnit(value);
            if ($(this).attr('data-color') == 1) value = rgb2hex(value);
            $(this).val(value);
        });

        var objText = $obj.find('.t');

        var text = objText.text().replace('<br>', "\n");
        $textArea.val(text).removeAttr('disabled');
        $listFont.val(objText.css('font-family')).removeAttr('disabled');
        $textFontSize.val(objText.css('font-size')).removeAttr('disabled');
        //$btnBold.
    };

    $paper.on('click', '.object', function (e) {
        e.stopPropagation();
        e.preventDefault();
        selectObject($(this));
    });

    $paper.click(function () {
        unselectAll();
    });

    /**
     * ==================================================================================
     * ОБРАБОТКА ЭУ
     * ==================================================================================
     */

    var $buttonSave = $('#te-btn-save'),
        $buttonCopy = $('#te-btn-copy'),
        $buttonCreate = $('#te-btn-create'),
        $buttonDelete = $('#te-btn-delete'),
        $textArea = $('#te-text'),
        $templatesList = $('#te-templates'),

        $listFont = $('#te-font'),
        $textFontSize = $('#te-font-size'),
        $btnBold = $('#te-btn-bold'),
        $btnItalic = $('#te-btn-italic'),

        $uiProps = $('[data-te-prop]');


    $buttonSave.click(function () {
        unselectAll();
        var serializer = new Serialize();
        var objects = serializer.save($paper.find('.object'));
        templateEditorSaveData(objects);
    });

    /**
     * Создать элемент
     */
    $buttonCreate.click(function () {
        var $obj = createObject();
        initObject($obj);
        selectObject($obj);
    });

    /**
     * Копия
     */
    $buttonCopy.click(function () {
        if ($selected) {
            var $obj = createObject();
            var $sel = $selected;
            unselectAll();
            for (var i = 0; i < objectProps.length; i++) {
                $obj.css(objectProps[i], $sel.css(objectProps[i]));
            }
            $obj.find('.t').html($sel.find('.t').html());
            $obj.css('left', $sel.offset().left + 10 + 'px');
            $obj.css('top', $sel.offset().top + 10 + 'px');
            initObject($obj);
            selectObject($obj);
        }
    });

    /**
     * Удалить элемент
     */
    $buttonDelete.click(function () {
        if ($selected) {
            $selected.remove();
            $selected = null;
            unselectAll();
        }
    });

    /**
     * Изменение свойства объекта
     */
    $uiProps.change(function () {
        if ($selected) {
            var prop = $(this).attr('data-te-prop');
            var value = $(this).val();
            if ($(this).attr('data-unit')) value = fromUnit(value);
            $selected.css(prop, value);
            updateObject($selected);
        }
    });

    $textArea.bind('keyup change', function () {
       if ($selected) {
           var html = $(this).val().replace(/\n/g, '<br>');
           $selected.find('.t').html(html);
       }
    });

    $templatesList.dblclick(function () {
        if ($selected) {
            $textArea.val($textArea.val() + $(this).val());
            $textArea.change();
        }
    });

    $listFont.change(function () {
        if ($selected) {
            $selected.find('.t').css('font-family', $(this).val());
        }
    });

    $textFontSize.change(function () {
        if ($selected) {
            var value = $(this).val();
            value = parseFloat(value);
            if (!isNaN(value)) {
                value += 'px';
                $(this).val(value);
                $selected.find('.t').css('font-size', value);
            }
        }
    });

    var keyModeCtrl, keyModeShift;
    const KEY_SHIFT = 16;
    const KEY_CTRL = 17;
    const KEY_SPACE = 32;
    const KEY_Z = 90;
    const KEY_J = 74;
    const KEY_ZPT = 188;
    const KEY_DEL = 46;

    function checkField(obj) {
        return !(obj.activeElement && (obj.activeElement.nodeName == 'TEXTAREA' || obj.activeElement.nodeName == 'INPUT'));
    }

    $(document).keydown(function (e) {
        switch (e.which) {
            case KEY_CTRL: keyModeCtrl = true; break;
            case KEY_SHIFT: keyModeShift = true; break;
        }
    }).keyup(function (e) {
        //alert(e.which);
        if (keyModeCtrl) {
            if (keyModeShift) {
                switch (e.which) {
                    case KEY_Z: history.redo(); break;
                }
            } else {
                switch (e.which) {
                    case KEY_Z: history.undo(); break;
                }
            }
        }

        switch (e.which) {
            case KEY_CTRL:  keyModeCtrl = false; break;
            case KEY_SHIFT: keyModeShift = false; break;
            case KEY_DEL: if (checkField(this)) $buttonDelete.click();
        }
    });

    /**
     * Размеры рабочей области
     */
    var $left = $('.left');
    function setupLeft() {
        var h = $(window).height() - ($('.footer').outerHeight() + $left.offset().top);
        $left.height(h);
    }
    $(window).resize(setupLeft);
    setupLeft();

    unselectAll();

    /**
     * Загрузка
     */
    var searize = new Serialize($paper);
    searize.init = initObject;
    searize.create = createObject;
    searize.load($('#te-objects').text());
});