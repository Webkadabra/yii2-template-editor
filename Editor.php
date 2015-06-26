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
     * @var \app\models\Template
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

    const SCALE = 37.795;

    public function run()
    {
        $patternManager = new PatternManager([
            'patternNamespace' => $this->patternNamespace,
            'patternPath' => $this->patternPath
        ]);

        if ($this->instantPrint) {
            $this->printing($patternManager);
        } else {

            $paper =  Html::tag('canvas', '', [
                'id' => 'paper',
                'class' => 'paper',
                'width' => $this->model->width * self::SCALE,
                'height' => $this->model->height * self::SCALE
            ]);

            echo $this->render('editor', [
                'patterns' => $patternManager->getList(),
                'paper' => $paper,
            ]);
        }
    }

    /**
     * Печать шаблонов
     * @param PatternManager $patternManager
     */
    private function printing($patternManager)
    {
        $result = Html::beginTag('tr');

        $cols = 1;
        $n = 0;

        $width = $this->model->width * self::SCALE;
        $height = $this->model->height * self::SCALE;

        foreach (call_user_func($this->data, $patternManager) as $item) {

            $data = json_decode($item);
            if ($data->version != '1.0.0') {
                return;
            }

            $resultObj = '';
            foreach ($data->objects as $object) {
                $resultObj .= $this->renderObject($object);
            }

            $result .=  Html::tag('td', $resultObj, ['style' => 'width:' . $width . 'px;height:' . $height . 'px']);

            $n++;
            if ($n >= $cols) {
                $result .= Html::endTag('tr').Html::beginTag('tr');
            }
        }

        echo $this->render('print', [
            'objects' => Html::tag('table', Html::endTag('tr') . $result, ['class' => 'wrapper'])
        ]);
    }

    /**
     * Рендер объекта на печатной странице
     * @param \StdClass $object
     * @return string
     */
    private function renderObject($object)
    {
        $styles['left'] = $object->x . 'px';
        $styles['top'] = $object->y . 'px';
        $styles['width'] = $object->width . 'px';
        $styles['height'] = $object->height . 'px';
        $styles['font-size'] = $object->fontSize . 'pt';
        $styles['vertical-align'] = $object->textBaseline;
        $styles['line-height'] = $object->lineHeight . 'px';
        $styles['font-family'] = $object->fontFamily;
        $styles['color'] = $object->textStyle;
        $styles['border'] = $object->strokeStyle;
        $styles['text-align'] = $object->textAlign;

        if (preg_match('/\[image:(.*)\]/', $object->text, $matches)) {
            $object->text = Html::img($matches[1], ['width' => $object->width, 'class' => 'img']);
        } elseif ($object->fillStyle) {
            $options = ['width' => $object->width, 'height' => $object->height, 'class' => 'bg'];
            $object->text = Html::img(['template/bg', 'c' => substr($object->fillStyle, 1)], $options) . $object->text;
        }

        if ($object->fontBold) $styles['font-weight'] = 'bold';
        if ($object->fontItalic) $styles['font-style'] = 'italic';

        foreach ($styles as $key => &$value) {
            $value = $key.':'.$value;
        }

        $styles = implode(';', $styles);

        $text = Html::tag('div', $object->text, ['class' => 'text', 'style' => $styles]);
        return Html::tag('div', $text, ['class' => 'object', 'style' => $styles]);
    }
}