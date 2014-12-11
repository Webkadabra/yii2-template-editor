<?
namespace mrssoft\template;

use yii\base\Widget;

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
     * @var array Доп. параметры передваемые при сохранении
     */
    public $params = [];

    /**
     * @var array Шрифты
     */
    public $fontList = [
        'Arial, Arial, Helvetica, sans-serif' => 'Arial',
        'Arial Black, Arial Black, Gadget, sans-serif' => 'Arial Black',
        'Comic Sans MS, cursive' => 'Comic Sans MS',
        'Courier New, Courier New, Courier6, monospace' => 'Courier New',
        'Georgia, Georgia, serif' => 'Georgia',
        'Impact, Charcoal, sans-serif' => 'Impact',
        'Lucida Console, Monaco, monospace' => 'Lucida Console',
        'Lucida Sans Unicode, Lucida Grande, sans-serif' => 'Lucida Sans',
        'Palatino Linotype, Book Antiqua, Palatino, serif' => 'Palatino Linotype',
        'Tahoma, Geneva, sans-serif' => 'Tahoma',
        'Times New Roman, Times, serif' => 'Times New Roman',
        'Trebuchet MS, Helvetica, sans-serif' => 'Trebuchet',
        'Verdana, Verdana, Geneva, sans-serif' => 'Verdana',
    ];

    public function run()
    {
        Asset::register($this->view);

        $patternManager = new PatternManager([
            'patternNamespace' => $this->patternNamespace,
            'patternPath' => $this->patternPath
        ]);


        echo $this->render('editor', [
            'patterns' => $patternManager->getList(),
        ]);
    }
}