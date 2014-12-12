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
     * @var string Сериализованная строка объектов
     */
    public $objects;

    /**
     * @var float Ширина шаблона
     */
    public $width = 21;

    /**
     * @var float Высота шаблона
     */
    public $height = 29.7;

    /**
     * @var string Название шаблона
     */
    public $title = '';

    /**
     * @var string Адрес сохранения
     */
    public $saveUrl;

    /**
     * @var string Адрес закрытия редактора
     */
    public $returnUrl;

    /**
     * @var array Доп. параметры передваемые при сохранении
     */
    public $params = [];

    /**
     * @var null/mixed Данные для заполнения шаблона
     */
    public $data = null;

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

        if (!empty($this->data))
        {
            $patternManager->fillData($this->objects, $this->data);
            $view = 'print';
        }
        else
        {
            $view = 'editor';
        }

        $paper = Html::tag('div', '', ['id' => 'paper', 'style' => 'width:'.$this->width.'cm;height:'.$this->height.'cm']);
        $paper .= Html::tag('div', $this->objects, ['id' => 'te-objects', 'style' => 'display:none']);

        echo $this->render($view, [
            'patterns' => $patternManager->getList(),
            'paper' => $paper
        ]);
    }
}