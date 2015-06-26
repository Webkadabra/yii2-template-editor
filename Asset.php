<?php

namespace mrssoft\template;

use yii\web\AssetBundle;

class Asset extends AssetBundle
{
    public $css = [
        'flaticon.css',
        'style.css',
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapPluginAsset',
    ];

    public function init()
    {
        /*$this->sourcePath = YII_DEBUG ?
            '@app/extensions/yii2-template-editor/assets' :
            '@vendor/mrssoft/yii2-template-editor/assets';*/

        $this->sourcePath = '@app/extensions/yii2-template-editor/assets';

        $this->js = YII_DEBUG ? [
            'noty/packaged/jquery.noty.packaged.min.js',
            'source/object.js',
            'source/markers.js',
            'source/group.js',
            'source/functions.js',
            'source/editor.js',
            'source/history.js',
            'source/serialize.js',
            'source/print.js',
            'source/main.js',
        ] : [
            'noty/packaged/jquery.noty.packaged.min.js',
            'editor.min.js'
        ];
    }
}
