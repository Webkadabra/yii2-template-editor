/** {Editor} */
var editor;

/** {Boolean} */
var keyModeCtrl, keyModeShift, isChange = false;

function showNoty(options) {
    return noty({
        text: options.text,
        theme: 'defaultTheme',
        layout: options.layout ? options.layout : 'bottomLeft',
        type: options.type ? options.type : 'information',
        dismissQueue: false,
        timeout: options.timeout ? options.timeout : 2000,
        modal: options.modal ? options.modal : false,
        closeWith: options.modal ? [] : ['click'],
        force: true,
        killer: true
    });
}

showNoty({
    text: 'Загрузка...',
    theme: 'defaultTheme',
    layout: 'topCenter',
    type: 'success',
    timeout: false,
    modal: true
});

jQuery.fn.disableSelection = function() {
    this.each(function() {
        this.onselectstart = function() { return false; };
        this.unselectable = "on";
        jQuery(this).css({
            '-moz-user-select': 'none'
            ,'-o-user-select': 'none'
            ,'-khtml-user-select': 'none'
            ,'-webkit-user-select': 'none'
            ,'-ms-user-select': 'none'
            ,'user-select': 'none'
        });
        // Для Opera
        jQuery(this).bind('mousedown', function() {
            return false;
        });
    });
};

jQuery.fn.disabled = function (mode) {
    $(this).each(function () {
        if (mode) {
            $(this).attr('disabled', 'disabled');
        } else {
            $(this).removeAttr('disabled');
        }
    });

    return $(this);
};

function changeObjectColor() {
    if (editor.selectedObject) {
        var $obj = $(this);
        var prop = $obj.data('te-prop');
        if (typeof prop === 'undefined') {
            prop = $obj.parent().next('input').data('te-prop');
        }

        editor.selectedObject[prop] = $obj.val();
        editor.update();
    }
}

$(function () {

    var $buttonSave = $('#te-btn-save'),
        $buttonPrint = $('#te-btn-print'),
        $buttonSaveConfig = $('#save-config'),
        $buttonCopy = $('#te-btn-copy'),
        $buttonCreate = $('#te-btn-create'),
        $buttonUndo = $('#te-btn-undo'),
        $buttonRedo = $('#te-btn-redo'),
        $buttonDelete = $('#te-btn-delete'),
        $textArea = $('#te-text'),
        $templatesList = $('#te-templates'),

        $listFont = $('#te-font'),
        $btnBold = $('#te-btn-bold'),
        $btnItalic = $('#te-btn-italic'),
        $alignButtons = $('.align'),
        $btnMakeAlign = $('.m-align'),
        $uiSizeProps = $('[data-te-size-prop]'),
        $uiProps = $('[data-te-prop]');

        var $valign = $('.valign');

    editor = new Editor();

    /**
     * Изменения на листе
     * @param onlyPosition
     */
    editor.onObjectChange = function (onlyPosition) {
        if (editor.selectedObject) {
            $('.only-select').disabled(false);

            $uiSizeProps.each(function () {
                var value = editor.selectedObject[$(this).data('te-size-prop')];
                $(this).val(editor.fn.toUnit(value).toFixed(2));
            });

            if (!onlyPosition) {
                $uiProps.each(function () {
                    $(this).val(editor.selectedObject[$(this).data('te-prop')]);
                });

                $textArea.val(editor.selectedObject.getText());

                $alignButtons.removeClass('active');
                $('.align[data-te-prop="' + editor.selectedObject.textAlign + '"]').addClass('active');

                $valign.each(function () {
                    $(this).parent().removeClass('active');
                });
                $('.valign[data-te-prop="' + editor.selectedObject.textBaseline + '"]').parent().addClass('active');

                if (editor.selectedObject.fontBold) $btnBold.addClass('active'); else $btnBold.removeClass('active');
                if (editor.selectedObject.fontItalic) $btnItalic.addClass('active'); else $btnItalic.removeClass('active');
            }
        } else {
            $('.only-select, .only-select2').disabled(true);
            if (editor.selected.count() > 1) {
                $('.only-select2').disabled(false);
            }
        }
    };

    /**
     * Изменеия в истории
     */
    editor.history.onChange = function () {
        isChange = true;
        $buttonSave.disabled(false);
        $buttonUndo.disabled(!this.enableUndo);
        $buttonRedo.disabled(!this.enableRedo);
    };

    /**
     * Создание объекта
     */
    $buttonCreate.click(function () {
        var obj = new EditorObject(editor);
        obj.text = 'Текст';
        obj.width = obj.height = 150;
        obj.x = editor.canvas.width / 2 - obj.width / 2;
        obj.y = editor.canvas.height / 2 - obj.height / 2;
        obj.update();
        editor.history.create([obj]);
        editor.unselectAll();
        editor.selectObject(obj);
        editor.update();
    });

    /**
     * Печать
     */
    $buttonPrint.click(function () {
        printPaper(true);
    });

    /**
     * Закрыть
     */
    $('#te-btn-close').click(function () {
        if (!isChange || confirm('Вы собираетесь уйти со страницы. Изменения будут потеряны. Уйти?')) {
            location.href = $(this).data('url');
        }
    });

    /**
     * Сохранить параметры шаблона
     */
    $buttonSaveConfig.click(function () {
        var form = $('#form-config');
        $('#modal-config').modal('hide');
        $.post(form.attr('action'), form.serialize(), function (response) {
            if (response.result) {
                editor.canvas.width = editor.fn.fromUnit($('#template-width').val());
                editor.canvas.height = editor.fn.fromUnit($('#template-height').val());
                editor.update();
            } else {
                $('#modal-config').modal('show');
            }
            showNoty({
                text: response.message,
                type: response.result ? 'success' : 'error'
            });
        });
    });

    /**
     * Сохранить
     */
    $buttonSave.click(function () {
        var serializer = new Serialize();
        var data = {
            id: templateData.id,
            objects: serializer.save(editor.objects)
        };
        var notySave = showNoty({
            text: 'Сохранение...',
            theme: 'defaultTheme',
            timeout: false,
            modal: true
        });
        $.post(templateData.saveUrl, data, function (response) {
            notySave.setText(response.message);
            notySave.setType(response.result ? 'success' : 'error');
            $buttonSave.disabled(true);
            isChange = false;
        });
    });

    $buttonUndo.click(editor.history.undo);
    $buttonRedo.click(editor.history.redo);
    $buttonDelete.click(editor.fn.remove);
    $buttonCopy.click(editor.fn.clone);

    /**
     * Изменение свойства объекта
     */
    $uiProps.change(function () {
        if (editor.selectedObject) {
            var prop = $(this).attr('data-te-prop');
            var value = $(this).val();
            if ($(this).attr('data-unit')) value = editor.fn.fromUnit(value);
            editor.history.change([editor.selectedObject], [prop]);
            editor.selectedObject[prop] = value;
            editor.selectedObject.update();
            editor.markers.update(editor.selected);
            editor.draw();
        }
    });

    /**
     * Изменение размеров и положения объекта
     */
    $uiSizeProps.change(function () {
        if (editor.selectedObject) {
            var prop = $(this).attr('data-te-size-prop');
            editor.history.change([editor.selectedObject], [prop]);
            editor.selectedObject[prop] = editor.fn.fromUnit( $(this).val());
            editor.selectedObject.update();
            editor.markers.update(editor.selected);
            editor.draw();
        }
    });

    /**
     * Ввод текста
     */
    var startTextChange = false, fixTextHistory = false;
    $textArea.bind('keyup change', function () {
        if (editor.selectedObject) {
            if (startTextChange && !fixTextHistory) {
                editor.history.change([editor.selectedObject], ['text']);
                fixTextHistory = true;
            }
            editor.selectedObject.setText($(this).val());
            editor.draw();
        }
    }).focus(function () {
        startTextChange = true;
        fixTextHistory = false;
    }).blur(function () {
        startTextChange = false;
    });

    /**
     * Выбор текстового шаблона
     */
    $templatesList.dblclick(function () {
        if (editor.selectedObject) {
            $textArea.val($textArea.val() + $(this).val());
            $textArea.change();
        }
    });

    /**
     * Вертикальное выравнивание
     */
    $valign.click(function () {
        if (editor.selectedObject) {
            editor.selectedObject.textBaseline = $(this).data('te-prop');
            editor.selectedObject.updateTextLines();
            editor.update();

            $valign.each(function () {
                $(this).parent().removeClass('active');
            });
            $(this).parent().addClass('active');
        }
    });

    /**
     * Выбор шрифта
     */
    $listFont.change(function () {
        if (editor.selectedObject) {
            editor.history.change([editor.selectedObject], ['fontFamily']);
            editor.selectedObject.fontFamily = $(this).val();
            editor.selectedObject.updateTextLines();
            editor.update();
        }
    });

    /**
     * Полужирный и курсив
     */
    function toggleFontParam(e) {
        if (editor.selectedObject) {
            var value;
            if ($(this).hasClass('active')) {
                value = false;
                $(this).removeClass('active');
            } else {
                value = true;
                $(this).addClass('active');
            }
            editor.history.change([editor.selectedObject], [e.data.param]);
            editor.selectedObject[e.data.param] = value;
            editor.selectedObject.updateFont();
            editor.update();
        }
    }
    $btnBold.click({param: 'fontBold'}, toggleFontParam);
    $btnItalic.click({param: 'fontItalic'}, toggleFontParam);

    /**
     * Выравнивание по горизонтали
     */
    $alignButtons.click(function () {
        if (editor.selectedObject) {
            editor.history.change([editor.selectedObject], ['textAlign']);
            editor.selectedObject.textAlign = $(this).data('te-prop');
            editor.update();
            $alignButtons.removeClass('active');
            $(this).addClass('active');
        }
        return false;
    });

    /**
     * Выравнивание текста по вертикали
     */
    $valign.click(function () {
        if (editor.selectedObject) {
            editor.history.change([editor.selectedObject], ['textBaseline']);
            editor.selectedObject.textBaseline = $(this).data('te-prop');
            editor.update();
            $valign.each(function () {
                $(this).parent().removeClass('active');
            });
            $(this).parent().addClass('active');
        }
        return false;
    });

    /**
     * Выравнивание объектов
     */
    $btnMakeAlign.click(editor.fn.align);

    /**
     * Размеры рабочей области
     */
    var $middle = $('.middle');
    if ($middle.length) {
        function setupLeft() {
            var h = $(window).height() - $middle.offset().top;
            $middle.height(h);
        }
        $(window).resize(setupLeft);
        setupLeft();
    }

    /**
     * Запрет выделения в зоне рисования
     */
    $middle.disableSelection();

    /**
     * Снять выделение при щелчке по фону зоны рисования
     */
    $middle.click(editor.unselectAll);

    $('.only-select').disabled(true);
    $buttonSave.disabled(true);

    /**
     * ===== Обработка клавиатуры =====
     */
    var KEY_DEL = 46;

    function checkField(obj) {
        return !(obj.activeElement && (obj.activeElement.nodeName == 'TEXTAREA' || obj.activeElement.nodeName == 'INPUT'));
    }

    $(document).keydown(function (event) {
        keyModeCtrl = event.ctrlKey;
        keyModeShift = event.shiftKey;
        if (event.ctrlKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's':
                    event.preventDefault();
                    $buttonSave.click();
                    break;
                case 'p':
                    event.preventDefault();
                    $buttonPrint.click();
                    break;
                case 'd':
                    event.preventDefault();
                    $buttonCopy.click();
                    break;
                case 'z':
                    if (event.shiftKey) {
                        $buttonRedo.click();
                    } else {
                        $buttonUndo.click();
                    }
                    event.preventDefault();
                    break;
                case 'b':
                    $btnBold.click();
                    break;
                case 'i':
                    $btnItalic.click();
                    break;
            }
        }
    }).keyup(function (event) {
        keyModeCtrl = event.ctrlKey;
        keyModeShift = event.shiftKey;
        switch (event.which) {
            case KEY_DEL:
                if (checkField(this)) {
                    $buttonDelete.click();
                }
                break;
        }
    });

    /**
     * Печать шаблона
     */
    function printPaper(createWin) {
        var w = editor.canvas.width, h = editor.canvas.height;
        var printScale = 2;
        editor.canvas.width = w * printScale;
        editor.canvas.height = h * printScale;
        editor.context.scale(printScale, printScale);
        editor.print();

        if (createWin) {
            var win = window.open();
        } else {
            win = window;
        }
        var css = "@page :first {margin: 0;} " +
            "@page :left { margin: 0; } " +
            "@page :right { margin: 0; } " +
            "@media print and (color) { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }} " +
            "body {margin:0}";

        win.document.write('<head><style>' + css + '</style></head><body><img width="' + w + '" height="' + h + '" src="' + editor.canvas.toDataURL() + '"></body>');
        win.print();
        win.close();
        //win.location.reload();

        editor.context.scale(1, 1);
        editor.canvas.width = w;
        editor.canvas.height = h;
        editor.update();

        keyModeCtrl = null;
        keyModeShift  = null;
    }

    /**
     * Загрузка
     */
    $.get(templateData.loadUrl, function (response) {
        var searize = new Serialize();
        searize.load(editor, response, function(result) {
            if (result) {
                $.noty.closeAll();
                if ($('#fast-print').val() == '1') {
                    printPaper();
                } else {
                    editor.update();
                }
            }
        });
    });
});