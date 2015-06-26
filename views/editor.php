<?
/**
 * @var \mrssoft\template\Editor $widget
 * @var \yii\web\View $this;
 * @var array $patterns
 * @var string $paper;
 */

use app\models\Template;
use mrssoft\template\Asset;
use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use yii\helpers\Url;

Asset::register($this);

$widget = $this->context;
?>

<table id="template-editor-wrapper"><tr>
    <td class="left">
        <button type="button" id="te-btn-close" data-url="<?=Url::toRoute(['template/index']);?>" title="Закрыть" class="btn btn-default"><span class="flaticon-cross106"></span></button>
        <button type="button" id="te-btn-save" class="btn btn-success" title="Сохранить"><i class="flaticon-floppy1"></i></button>
        <!--<button type="button" id="te-btn-print" class="btn btn-default" title="Печать шаблона..."><span class="flaticon-print26"></span></button>-->
        <button type="button" id="te-btn-config" class="btn btn-default" data-toggle="modal" data-target="#modal-config" title="Параметры шаблона..."><span class="flaticon-settings61"></span></button>
        <hr>
        <button type="button" id="te-btn-create" class="btn btn-primary" title="Новый объект"><i class="flaticon-add182"></i></button>
        <button type="button" id="te-btn-copy" class="btn btn-default only-select only-select2" title="Создать копию объекта"><span class="flaticon-copy8"></span></button>
        <button type="button" id="te-btn-undo" class="btn btn-default" disabled title="Отмена"><span class="flaticon-return13"></span></button>
        <button type="button" id="te-btn-redo" class="btn btn-default" disabled title="Повтор"><span class="flaticon-send"></span></button>
        <button type="button" id="te-btn-delete" class="btn btn-danger only-select only-select2" title="Удалить"><span class="flaticon-delete81"></span></button>
    </td>
    <td class="center">
        <div class="middle">
            <?=$paper;?>
        </div>
    </td>
    <td class="right">
        <table class="prop-grid">
            <tr>
                <td><label for="te-obj-left">x</label></td>
                <td><input type="text" class="only-select" data-te-size-prop="x"></td>
                <td><label for="te-obj-top">y</label></td>
                <td><input type="text" class="only-select" data-te-size-prop="y"></td>
            </tr>
            <tr>
                <td><label for="te-obj-width">ширина</label></td>
                <td><input type="text" class="only-select" data-te-size-prop="width"></td>
                <td><label for="te-obj-height">высота</label></td>
                <td><input type="text" class="only-select" data-te-size-prop="height"></td>
            </tr>
        </table>
        <hr>
        <div class="group btn-toolbar">
            <div class="btn-group">
                <button type="button" id="te-btn-left" class="align btn btn-default only-select" data-te-prop="left" title="Выравнивание текста влево"><span class="flaticon-left31"></span></button>
                <button type="button" id="te-btn-center" class="align btn btn-default only-select" data-te-prop="center" title="Выравнивание текста по центру"><span class="flaticon-paragraph12"></span></button>
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
                    <td><?=Html::dropDownList('font', null, $widget->fontList, ['id' => 'te-font', 'data-te-prop' => 'fontFamily', 'class' => 'only-select']);?></td>
                    <td><input type="text" id="te-font-size" data-te-prop="fontSize" class="only-select"></td>
                </tr>
            </table>
            <textarea id="te-text" rows="4" class="only-select"></textarea>
            <button id="add-img" class="btn btn-default btn-xs only-select">Вставка изображения...</button>
        </div>
        <div class="group">
            <?=Html::listBox('templates', null, $patterns, ['id' => 'te-templates', 'class' => 'only-select']);?>
        </div>
        <div class="group">
            <table class="prop-grid">
                <tr>
                    <td>Текст</td>
                    <td><input id="te-color-text" data-te-prop="textStyle" type="color" class="only-select" value="#000000"></td>
                    <td>Заливка</td>
                    <td><input id="te-color-fill" data-te-prop="fillStyle" type="color" class="only-select" value="#ffffff"></td>
                </tr>
                <tr>
                    <td>Рамка</td>
                    <td><input id="te-color-stroke" data-te-prop="strokeStyle" type="color" class="only-select" value="#000000"></td>
                    <td>Толщина</td>
                    <td><input id="te-border-width" data-te-prop="lineWidth" type="number" class="only-select" value="0"></td>
                </tr>
<!--                <tr>
                    <td>Масштаб <span id="zoom-value">100%</span></td>
                    <td>
                        <input type="range" min="0.5" max="2" step="0.01" value="1" id="zoom">
                        <button id="zoom100" class="btn btn-default btn-xs">100%</button>
                    </td>
                </tr>-->
            </table>
        </div>
        <div class="group btn-toolbar">
            <div class="btn-group">
                <button type="button" class="m-align btn btn-default only-select2" data-prop="left" title="Выравнивание влево"><span class="flaticon-object6"></span></button>
                <button type="button" class="m-align btn btn-default only-select2" data-prop="center" title="Выравнивание по центру"><span class="flaticon-object7"></span></button>
                <button type="button" class="m-align btn btn-default only-select2" data-prop="right" title="Выравнивание вправо"><span class="flaticon-object5"></span></button>
                <button type="button" class="m-align btn btn-default only-select2" data-prop="top" title="Выравнивание по верху"><span class="flaticon-object11"></span></button>
                <button type="button" class="m-align btn btn-default only-select2" data-prop="middle" title="Выравнивание по центру"><span class="flaticon-object8"></span></button>
                <button type="button" class="m-align btn btn-default only-select2" data-prop="bottom" title="Выравниванять по низу"><span class="flaticon-object10"></span></button>
            </div>
        </div>
    </td>
</tr></table>

<!-- Параметры шаблона -->
<div class="modal" id="modal-config">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Параметры шаблона</h4>
            </div>
            <div class="modal-body">
                <? $form = ActiveForm::begin([
                        'action' => Url::toRoute(['template/config']),
                        'id' => 'form-config',
                        'layout' => 'horizontal',
                        'fieldConfig' => [
                            'template' => '{label}<div class="col-xs-10">{input}</div><div class="col-xs-offset-2 col-xs-10">{error}</div>',
                            'labelOptions' => ['class' => 'col-xs-2 control-label'],
                        ]
                    ]);
                    echo Html::hiddenInput('template_id', $widget->model->id);
                    echo $form->field($widget->model, 'title');
                    echo $form->field($widget->model, 'width');
                    echo $form->field($widget->model, 'height');
                    echo $form->field($widget->model, 'type')->dropDownList(Template::getTypes());
                    ActiveForm::end(); ?>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="save-config">Сохранить изменения</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<!-- Выбор изображения -->
<div class="modal" id="modal-elfinder" data-url="<?=Url::toRoute(['template/image']);?>">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                <h4 class="modal-title">Выбор изображения</h4>
            </div>
            <div class="modal-body" style="min-height: 450px">
                Загрузка...
            </div>
        </div>
    </div>
</div>

<script>
    var templateData = {
        id: <?=$widget->model->id;?>,
        saveUrl: '<?=Url::toRoute(['template/save']);?>',
        loadUrl: '<?=Url::toRoute(['template/load', 'templateID' => $widget->model->id]);?>'
    };
</script>