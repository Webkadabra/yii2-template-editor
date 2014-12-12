function showNoty(options) {
    noty({
        text: options.text,
        theme: 'defaultTheme',
        layout: 'bottomLeft',
        type: options.type ? options.type : 'information',
        dismissQueue: false,
        timeout: options.timeout ? options.timeout : 1500,
        force: true,
        killer: true
    });
}

$(document).ready(function () {

    const selectBorderStyle = '1px dotted red';

    var $paper = $('#paper');
    var $selected = null;
    var $selectedBorder = null;

    var functions = new Functions();

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

    var selectObject = function($obj) {
        if ($selected) {
            $selected.css('border', $selectedBorder);
        }
        $selected = $obj;
        $selectedBorder = $obj.css('border');
        $obj.css('border', selectBorderStyle);
        updateProps($obj);
    };

    var unselectAll = function () {
        $('.only-select').attr('disabled', 'disabled');

        if ($selected) {
            $selected.css('border', $selectedBorder);
        }
        $selected = null;
    };

    var updateProps = function ($obj) {

        $('.only-select').removeAttr('disabled');

        $uiProps.each(function () {
            var prop = $(this).attr('data-te-prop');
            var value = $obj.css(prop);
            if ($(this).attr('data-unit') == 1) value = functions.toUnit(value);
            if ($(this).attr('data-color') == 1) value = rgb2hex(value);
            $(this).val(value);
        });

        var objText = $obj.find('.t');

        var text = objText.html();
        $textArea.val(text.replace(/<br>/g, "\n"));
        $listFont.val(objText.css('font-family'));
        $textFontSize.val(objText.css('font-size'));

        if (objText.css('font-weight') == 'bold') $btnBold.addClass('active'); else $btnBold.removeClass('active');
        if (objText.css('font-style') == 'italic') $btnItalic.addClass('active'); else $btnItalic.removeClass('active');

        $alignButtons.removeClass('active');
        $('.align[data-te-prop="' + objText.css('text-align') + '"]').addClass('active');

        $valign.each(function () {
            $(this).parent().removeClass('active');
        });
        $('.valign[data-te-prop="' + objText.css('vertical-align') + '"]').parent().addClass('active');

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
        $buttonPrint = $('#te-btn-print'),
        $buttonClose = $('#te-btn-close'),
        $buttonCopy = $('#te-btn-copy'),
        $buttonCreate = $('#te-btn-create'),
        $buttonDelete = $('#te-btn-delete'),
        $textArea = $('#te-text'),
        $templatesList = $('#te-templates'),

        $listFont = $('#te-font'),
        $textFontSize = $('#te-font-size'),
        $btnBold = $('#te-btn-bold'),
        $btnItalic = $('#te-btn-italic'),
        $btnValign = $('#te-btn-valign'),
        $uiProps = $('[data-te-prop]');


    /**
     * Сохранить
     */
    $buttonSave.click(function () {
        unselectAll();
        var serializer = new Serialize();
        var objects = serializer.save($paper.find('.object'));
        templateEditorSaveData(objects);
    });

    $buttonPrint.click(function () {
        unselectAll();
        window.print();
    });

    /**
     * Закрыть редактор
     */
    $buttonClose.click(function () {
        //TODO Проверка на изменения в документе
        location.href = $(this).data('url');
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
            $obj.css('left', $sel.position().left + 10 + 'px');
            $obj.css('top', $sel.position().top + 10 + 'px');
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
            if ($(this).attr('data-unit')) value = functions.fromUnit(value);
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

    function toggleFontParam(e) {
        if ($selected) {
            var value;
            if ($(this).hasClass('active')) {
                value = 'normal';
                $(this).removeClass('active');
            } else {
                value =  e.data.newValue;
                $(this).addClass('active');
            }
            $selected.find('.t').css(e.data.param, value);
        }
    }
    $btnBold.click({param: 'font-weight', newValue: 'bold'}, toggleFontParam);
    $btnItalic.click({param: 'font-style', newValue: 'italic'}, toggleFontParam);

    var $alignButtons = $('.align');
    $alignButtons.click(function () {
        if ($selected) {
            $selected.find('.t').css('text-align', $(this).data('te-prop'));
            $alignButtons.removeClass('active');
            $(this).addClass('active');
        }
    });

    var $valign = $('.valign');
    $valign.click(function () {
        if ($selected) {
            $selected.find('.t').css('vertical-align', $(this).data('te-prop'));
            $valign.each(function () {
                $(this).parent().removeClass('active');
            });
            $(this).parent().addClass('active');
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
    if ($left.length) {
        function setupLeft() {
            var h = $(window).height() - $left.offset().top;
            $left.height(h);
        }

        $(window).resize(setupLeft);
        setupLeft();
    }

    $paper.parent().disableSelection();

    unselectAll();

    /**
     * Загрузка
     */
    var searize = new Serialize($paper);
    searize.init = initObject;
    searize.create = createObject;
    searize.load($('#te-objects').text());
});