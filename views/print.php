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

    @page :first, @page :left, @page :right {
        margin: 0;
    }

    @media print and (color) {
        * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }

    body {
        margin: 0;
        width: 100%;
    }

    img {
        margin: 0;
        outline: none;
    }

    table {
        margin: 0;
    }

    table td {
        padding: 0;
    }

    body {
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        position: relative;
    }
    .wrapper {
        page-break-after: always;
        background: #fff;
        /*margin-left: -0.5cm;*/
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
        /*        -webkit-print-color-adjust: exact;
                print-color-adjust: exact;*/
    }
    .object .img {
        width: 100%;
        height: auto;
    }

    /*Таблица свойств*/
    .table-options {
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        border-collapse: collapse;
    }
    .table-options td {
        width: 50%;
        padding: 4px 10px;
        border: 1px solid #000;
    }

    /*Таблица прайса*/
    .table-price {
        width: 100%;
        border: 1px solid #000;
        border-collapse: collapse;
    }
    .table-price td, .table-price th {
        padding: 3px;
        border: 1px solid #000;
        text-align: center;
    }
    .table-price td:first-child {
        text-align: left;
    }
    .table-price th, .table-price td:last-child, .table-price td:first-child {
        font-weight: bold;
    }
</style>

