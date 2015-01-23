<?
/**
 * @var \mrssoft\template\Editor $widget
 * @var \yii\web\View $this;
 * @var string $paper
 *
 */

use yii\helpers\Html;
use yii\helpers\Url;

$widget = $this->context;
echo $paper;
echo Html::hiddenInput('fast-print', '1', ['id' => 'fast-print']);
?>
<script>
    var templateData = {
        loadUrl: '<?=Url::toRoute(['template/load', 'templateID' => $widget->model->id, 'data' => $widget->data]);?>'
    };
</script>
<style>body { background: #fff; }</style>