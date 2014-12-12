<?
namespace mrssoft\template;

use yii\base\Component;

class PatternManager extends Component
{
    public $startTag = '%';

    public $endTag = '%';

    public $patterns = [];

    public $patternNamespace;

    public $patternPath;

    private $_patterns;

    public function init()
    {
        $files = glob($this->patternPath.'*.php');

        /** @var PatternInterface $class */
        foreach ($files as $file)
        {
            $class = $this->patternNamespace.basename($file, '.php');
            if ((new $class) instanceof PatternInterface)
            {
                $tag = $this->startTag . $class::getPattern() . $this->endTag;
                $this->patterns[$tag] = $class::getTitle();
                $this->_patterns[$tag] = $class;
            }
        }
    }

    public function getList()
    {
        return $this->patterns;
    }

    public function fillData(&$objects, $data)
    {
        /** @var \mrssoft\template\PatternInterface $class */
        foreach ($this->_patterns as $tag => $class)
        {
            if (strpos($objects, $tag) !== false)
            {
                $objects = str_replace($tag, $class::execute($data), $objects);
            }
        }
    }
}