<?
namespace mrssoft\template;

use yii\base\Component;

class PatternManager extends Component
{
    public $startTag = '{';

    public $endTag = '}';

    public $patterns = [];

    public $patternNamespace;

    public $patternPath;

    public function init()
    {
        $files = glob($this->patternPath.'*.php');

        /** @var PatternInterface $class */
        foreach ($files as $file)
        {
            $class = $this->patternNamespace.basename($file, '.php');
            $this->patterns[$this->startTag.$class::getPattern().$this->endTag] = $class::getTitle();
        }
    }

    public function getList()
    {
        return $this->patterns;
    }

    public function parce()
    {

    }
}