<?php

namespace mrssoft\template;

use yii\web\AssetBundle;

class Asset extends AssetBundle
{
    //public $basePath = '@vendor/mrssoft/yii2-template-editor/assets';
    public $sourcePath = '@app/extensions/yii2-template-editor/assets';

    public $css = [
        'flaticon.css',
        'style.css',
    ];
    public $js = [
        'noty/packaged/jquery.noty.packaged.min.js',
        'source/object.js',
        'source/markers.js',
        'source/group.js',
        'source/functions.js',
        'source/editor.js',
        'source/history.js',
        'source/serialize.js',
        'source/main.js',
    ];
    /*public $js = [
        'noty/packaged/jquery.noty.packaged.min.js',
        'editor.min.js',
    ];*/
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapPluginAsset',
    ];
}
