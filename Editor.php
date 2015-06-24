<?
namespace mrssoft\template;

use yii\base\Widget;
use yii\helpers\Html;

/**
 * Виджет редактора шаблонов
 */
class Editor extends Widget
{
    /**
     * @var string Пространоство имён шаблонных классов
     */
    public $patternNamespace;

    /**
     * @var string Путь к шаблонным классам
     */
    public $patternPath;

    /**
     * @var
     */
    public $model;

    /**
     * @var string Адрес закрытия редактора
     */
    public $returnUrl;

    public $instantPrint = false;

    public $data = null;

    /**
     * @var array Доп. параметры передваемые при сохранении
     */
    public $params = [];

    /**
     * @var array Шрифты
     */
    public $fontList = [
        "Arial" => "Arial",
        "'Arial Black'" => "Arial Black",
        "'Comic Sans MS'" => "Comic Sans MS",
        "'Courier New'" => "Courier New",
        "Georgia" => "Georgia",
        "Impact" => "Impact",
        "'Lucida Console'" => "Lucida Console",
        "'Lucida Sans Unicode'" => "Lucida Sans",
        "'Palatino Linotype'" => "Palatino Linotype",
        "Tahoma" => "Tahoma",
        "'Times New Roman'" => "Times New Roman",
        "'Trebuchet MS'" => "Trebuchet",
        "Verdana" => "Verdana",
    ];

    public $count = 1;

    const SCALE = 37.795;

    public function run()
    {
        Asset::register($this->view);

        $patternManager = new PatternManager([
            'patternNamespace' => $this->patternNamespace,
            'patternPath' => $this->patternPath
        ]);

        $view = $this->instantPrint ? 'print' : 'editor';

        $paper = '';
        for ($i = 0; $i < $this->count; $i++) {
            $paper .= $this->createPaper($i);
        }

        echo $this->render($view, [
            'patterns' => $patternManager->getList(),
            'paper' => $paper,
        ]);
    }

    private function createPaper($index)
    {
        return Html::tag('canvas', '', [
            'id' => 'paper'.$index,
            'class' => 'paper',
            'width' => $this->model->width * self::SCALE,
            'height' => $this->model->height * self::SCALE
        ]);
    }
}