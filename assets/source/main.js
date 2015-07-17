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
        timeout: options.timeout ? options.timeout : 1400,
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
    timeout: false
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
        $btnShowFrames = $('#te-btn-frames'),
        $btnShowMargin = $('#te-btn-margin'),
        $alignButtons = $('.align'),
        $btnMakeAlign = $('.m-align'),
        $uiSizeProps = $('[data-te-size-prop]'),
        $uiProps = $('[data-te-prop]');

    var $valign = $('.valign');

    editor = new Editor();
    editor.setCanvas(document.getElementById('paper'));

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
                    var prop = $(this).data('te-prop'),
                        value = editor.selectedObject[prop];
                    if (!(value == null && (prop == 'fillStyle'))) {
                        $(this).val(value);
                    }
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
        obj.text = '';
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
        var printer = new EditorPrinter([editor], true);
        printer.print();
        keyModeCtrl = null;
        keyModeShift  = null;
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
            timeout: false
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
     * Границы объектов
     */
    $btnShowFrames.click(function () {
        $(this).toggleClass('active');
        editor.showFrame = $(this).hasClass('active');
        editor.draw();
        return true;
    });

    /**
     * Направляющие
     */
    $btnShowMargin.click(function () {
        $(this).toggleClass('active');
        editor.showMargin = $(this).hasClass('active');
        editor.draw();
        return true;
    });

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
            editor.selectedObject[prop] = editor.fn.fromUnit($(this).val());
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
     * Вставка изображения
     */
    var isLoadElfinder = false;
    $('#add-img').click(function () {
        if (editor.selectedObject) {
            var $modal = $('#modal-elfinder');
            $modal.modal();
            if (!isLoadElfinder) {
                $.get($modal.data('url'), function (response) {
                    $modal.find('.modal-body').html(response);
                    isLoadElfinder = true;
                });
            }
        }
        return false;
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
     * Масштаб
     */
    var $rngZoom = $('#zoom');
    function updateZoomValue() {
        $('#zoom-value').text((parseFloat($rngZoom.val()) * 100).toFixed() + '%');
    }
    $rngZoom.change(function () {
        editor.setZoom($(this).val());
        updateZoomValue();
    });
    $('#zoom100').click(function () {
        editor.setZoom(1);
        $rngZoom.val(1);
        updateZoomValue();
    });

    /**
     * Размеры рабочей области
     */
    var $middle = $('.middle');
    if ($middle.length) {
        function setupWorkArea() {
            var h = $(window).height() - $middle.offset().top,
                w = $(window).width() - ($('.left').width() + $('.right').width());

            $middle.height(h);
            $middle.width(w);
        }

        $(window).resize(setupWorkArea);
        setupWorkArea();
    }

    /**
     * Запрет выделения в зоне рисования
     */
    $middle.disableSelection();

    /**
     * Снять выделение при щелчке по фону зоны рисования
     */
    /*$middle.click(function () {
        editor.unselectAll();
    });*/

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
     * Загрузка объектов шаблона
     */
    $.get(templateData.loadUrl, function (response) {
        var serialze = new Serialize(editor);
        serialze.callback = function (result) {
            if (result) {
                $.noty.closeAll();
                editor.update();
            }
        };
        serialze.load(response);
    });

});