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

    public function run()
    {
        Asset::register($this->view);

        $patternManager = new PatternManager([
            'patternNamespace' => $this->patternNamespace,
            'patternPath' => $this->patternPath
        ]);

        if ($this->instantPrint)
        {
            $view = 'print';
        }
        else
        {
            $view = 'editor';
        }

        $paper = Html::tag('canvas', '', [
            'id' => 'paper',
            'width' => $this->model->width * 37.795,
            'height' => $this->model->height * 37.795
            //'style' => 'width:'.$this->model->width.'cm;height:'.$this->model->height.'cm'
        ]);

        echo $this->render($view, [
            'patterns' => $patternManager->getList(),
            'paper' => $paper,
        ]);
    }
}