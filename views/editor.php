<?
/**
 * @var \mrssoft\template\Editor $widget
 * @var \yii\web\View $this;
 * @var array $patterns
 * @var string $paper;
 */

use kartik\color\ColorInput;
use yii\helpers\Html;

$widget = $this->context;
?>

<div class="container">
    <div id="template-editor-wrapper">
        <div class="left">
            <?=$paper;?>
        </div>
        <div class="right">
            <div class="group">
                <button type="button" id="te-btn-save" class="btn btn-default"><i class="flaticon-floppy1"></i> Сохранить</button>
                <button type="button" id="te-btn-print" class="btn btn-default">Печать</button>
                <button type="button" id="te-btn-close" data-url="<?=$widget->returnUrl;?>" class="btn btn-default">Закрыть</button>
            </div>
            <div>
                <button type="button" data-type="rect" id="te-btn-create" class="btn btn-primary"><i class="flaticon-add182"></i> Добавить</button>
                <button type="button" id="te-btn-copy" class="btn btn-success only-select" title="Создать копию объекта"><span class="flaticon-copy9"></span></button>
                <button type="button" id="te-btn-undo" class="btn btn-default" title="Отмена"><span class="flaticon-curve9"></span></button>
                <button type="button" id="te-btn-redo" class="btn btn-default" title="Повтор"><span class="flaticon-redo3"></span></button>
                <button type="button" id="te-btn-delete" class="btn btn-danger only-select" title="Удалить"><span class="flaticon-delete81"></span></button>
            </div>
            <table class="prop-grid">
                <tr>
                    <td><label for="te-obj-left">x</label></td>
                    <td><input type="text" id="te-obj-left" data-te-prop="left" class="only-select" data-unit="1"></td>
                    <td><label for="te-obj-top">y</label></td>
                    <td><input type="text" id="te-obj-top" data-te-prop="top" class="only-select" data-unit="1"></td>
                </tr>
                <tr>
                    <td><label for="te-obj-width">ширина</label></td>
                    <td><input type="text" id="te-obj-width" data-te-prop="width" class="only-select" data-unit="1"></td>
                    <td><label for="te-obj-height">высота</label></td>
                    <td><input type="text" id="te-obj-height" data-te-prop="height" class="only-select" data-unit="1"></td>
                </tr>
            </table>
            <hr>
            <div class="group btn-toolbar">
                <div class="btn-group">
                    <button type="button" id="te-btn-left" class="align btn btn-default only-select" data-te-prop="left" title="Выравнивание текста влево"><span class="flaticon-left31"></span></button>
                    <button type="button" id="te-btn-center" class="align btn btn-default only-select" data-te-prop="center" title="Выравнивание текста по центру"><span class="flaticon-center4"></span></button>
                    <button type="button" id="te-btn-right" class="align btn btn-default only-select" data-te-prop="right" title="Выравнивание текста вправо"><span class="flaticon-right26"></span></button>
                </div>
                <div class="btn-group">
                    <button type="button" id="te-btn-bold" class="btn btn-default only-select" title="Полужирное начертание"><span class="flaticon-bold13"></span></button>
                    <button type="button" id="te-btn-italic" class="btn btn-default only-select" title="Курсивное начертание"><span class="flaticon-italic3"></span></button>
                </div>
                <div class="btn-group pull-right">
                    <button type="button" id="te-btn-valign" class="btn btn-default only-select dropdown-toggle" data-toggle="dropdown" title="Вертикальное выравнивание"><span class="flaticon-two262"></span> <span class="caret"></span></button>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#" class="valign" data-te-prop="top">По верхнему краю</a></li>
                        <li><a href="#" class="valign" data-te-prop="middle">По центру</a></li>
                        <li><a href="#" class="valign" data-te-prop="bottom">По нижнему краю</a></li>
                    </ul>
                </div>
            </div>
            <div class="group">
                <table class="prop-grid">
                    <tr>
                        <td><?=Html::dropDownList('font', null, $widget->fontList, ['id' => 'te-font', 'class' => 'only-select']);?></td>
                        <td><input type="text" id="te-font-size" class="only-select"></td>
                    </tr>
                </table>
                <textarea id="te-text" rows="4" class="only-select"></textarea>
            </div>
            <div class="group">
                <?=Html::listBox('templates', null, $patterns, ['id' => 'te-templates', 'class' => 'only-select']);?>
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
                                'options' => ['data-te-prop' => 'color', 'class' => 'change-color only-select']
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
                                'options' => ['data-te-prop' => 'background-color', 'class' => 'change-color only-select']
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
                                'options' => ['data-te-prop' => 'border-color', 'class' => 'change-color only-select']
                            ]); ?>
                        </td>
                    </tr>
                </table>

            </div>
        </div>
    </div>
</div>

<?php if (!empty($widget->saveUrl)):?>
    <script>
        function templateEditorSaveData(objects) {
            var post = {<?php foreach ($widget->params as $k => $v) {echo '"'.$k.'":"'.$v.'"';} ?>};
            post.objects = objects;
            $.post('<?=$widget->saveUrl;?>', post, function (response) {
                showNoty({
                    text: response.message,
                    type: response.result ? 'success' : 'alert'
                });
            });
        }
    </script>
<?php endif ?>