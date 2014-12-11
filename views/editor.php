<?
/**
 * @var \mrssoft\template\Editor $widget
 * @var \yii\web\View $this;
 * @var array $patterns
 *
 */

use kartik\color\ColorInput;
use yii\helpers\Html;

$widget = $this->context;

?>

<div id="template-editor-wrapper">
    <div class="left">
        <div id="paper" style="width: <?=$widget->width;?>cm; height: <?=$widget->height;?>cm;"></div>
    </div>
    <div class="right">
        <div class="group">
            <button type="button" id="te-btn-save" class="btn btn-default"><i class="flaticon-floppy1"></i> Сохранить</button>
            <button type="button" id="te-btn-save" class="btn btn-default"><i class="flaticon-floppy1"></i> Печать</button>
            <button type="button" id="te-btn-delete" class="btn btn-danger" title="Удалить"><span class="flaticon-delete81"></span></button>
        </div>
        <div>
            <button type="button" data-type="rect" id="te-btn-create" class="btn btn-primary"><i class="flaticon-add182"></i> Добавить</button>
            <button type="button" id="te-btn-copy" class="btn btn-success" title="Создать копию объекта"><span class="flaticon-copy9"></span></button>
            <button type="button" id="te-btn-undo" class="btn btn-default" title="Отмена"><span class="flaticon-curve9"></span></button>
            <button type="button" id="te-btn-redo" class="btn btn-default" title="Повтор"><span class="flaticon-redo3"></span></button>
        </div>
        <table class="prop-grid">
            <tr>
                <td><label for="te-obj-left">x</label></td>
                <td><input type="text" id="te-obj-left" data-te-prop="left" data-unit="1"></td>
                <td><label for="te-obj-top">y</label></td>
                <td><input type="text" id="te-obj-top" data-te-prop="top" data-unit="1"></td>
            </tr>
            <tr>
                <td><label for="te-obj-width">ширина</label></td>
                <td><input type="text" id="te-obj-width" data-te-prop="width" data-unit="1"></td>
                <td><label for="te-obj-height">высота</label></td>
                <td><input type="text" id="te-obj-height" data-te-prop="height" data-unit="1"></td>
            </tr>
        </table>
        <hr>
        <div class="group">
            <span class="btn-set">
                <button type="button" id="te-btn-left" class="align btn btn-default" data-te-prop="left" title="Выравнивание текста влево"><span class="flaticon-left31"></span></button>
                <button type="button" id="te-btn-center" class="align btn btn-default" data-te-prop="center" title="Выравнивание текста по центру"><span class="flaticon-center4"></span></button>
                <button type="button" id="te-btn-right" class="align btn btn-default" data-te-prop="right" title="Выравнивание текста вправо"><span class="flaticon-right26"></span></button>
            </span>
            <span class="btn-set">
                <button type="button" id="te-btn-bold" class="align btn btn-default" title="Полужирное начертание"><span class="flaticon-bold13"></span></button>
                <button type="button" id="te-btn-italic" class="align btn btn-default" title="Курсивное начертание"><span class="flaticon-italic3"></span></button>
            </span>
        </div>
        <div class="group">
            <table class="prop-grid">
                <tr>
                    <td><?=Html::dropDownList('font', null, $widget->fontList, ['id' => 'te-font']);?></td>
                    <td><input type="text" id="te-font-size"></td>
                </tr>
            </table>
            <textarea id="te-text" rows="4"></textarea>
        </div>
        <div class="group">
            <?=Html::listBox('templates', null, $patterns, ['id' => 'te-templates']);?>
        </div>
        <div class="group">
            <table class="prop-grid">
                <tr>
                    <td>Текст</td>
                    <td>
                        <? echo ColorInput::widget([
                            'name' => 'color',
                            'id' => 'color',
                            'value' => '#000',
                            'options' => ['data-te-prop' => 'color', 'class' => 'change-color']
                        ]); ?>
                    </td>
                </tr>
                <tr>
                    <td>Заливка</td>
                    <td>
                        <? echo ColorInput::widget([
                            'name' => 'background-color',
                            'id' => 'background-color',
                            'value' => '#fff',
                            'options' => ['data-te-prop' => 'background-color', 'class' => 'change-color']
                        ]); ?>
                    </td>
                </tr>
                <tr>
                    <td>Рамка</td>
                    <td>
                        <? echo ColorInput::widget([
                            'name' => 'border-color',
                            'id' => 'border-color',
                            'value' => '#000',
                            'options' => ['data-te-prop' => 'border-color', 'class' => 'change-color']
                        ]); ?>
                    </td>
                </tr>
            </table>

        </div>
    </div>
</div>

<div style="display: none" id="te-objects"><?=$widget->objects;?></div>

<?php if (!empty($widget->saveUrl)):?>
    <script>
        function templateEditorSaveData(objects) {
            var post = {<?php foreach ($widget->params as $k => $v) {echo '"'.$k.'":"'.$v.'"';} ?>};
            post.objects = objects;
            $.post('<?=$widget->saveUrl;?>', post, function (response) {
                console.log(response);
            });
        }
    </script>
<?php endif ?>