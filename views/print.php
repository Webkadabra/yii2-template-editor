<?
/**
 * @var \mrssoft\template\Editor $widget
 * @var \yii\web\View $this ;
 * @var string $objects
 */

$this->registerJs('$(document).ready(function () {window.print();});');
echo $objects;
?>

<style>

    @page :first {
        margin: 0.5cm
    }

    @page :left {
        margin: 0.5cm
    }

    @page :right {
        margin: 0.5cm
    }

    * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    body {
        margin: 0;
        width: 100%
    }

    img {
        margin: 0;
        outline: none
    }

    table {
        margin: 0
    }

    table td {
        padding: 0
    }

    body {
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        position: relative;
    }
    .wrapper {
        background: #fff;
    }
    .wrapper td {
        position: relative;
    }
    .object {
        position: absolute;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
    .object .bg {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        left 0;
        top: 0;
    }
    .object .text {
        display: table-cell;
    }
    .object .img {
        width: 100%;
        height: auto;
    }
    .table-options {
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        border-collapse: collapse;
    }
    .table-options td {
        padding: 3px;
        border: 1px solid #000;
    }
</style>
