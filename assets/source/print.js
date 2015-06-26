/**
 * Печать шаблона
 * @param editors Editor[]
 * @param createWin boolean
 */
function EditorPrinter(editors, createWin) {

    if (createWin) {
        var win = window.open();
    } else {
        win = window;
    }

    function writeImage(win, editor, w, h) {
        win.document.write('<img width="' + w + '" height="' + h + '" src="' + editor.canvas.toDataURL() + '">');
    }

    function renderEditor(win, editor) {

        win.document.write('<canvas id="p1"></canvas>');

        //var canvas = document.createElement('canvas');
        var canvas = document.getElementById('p1');
        canvas.width = 793;
        canvas.height = 1111;
        editor.setCanvas(canvas);
        editor.print();

        //writeImage(win, editor, w, h);
    }

    this.print = function () {

        var css = "@page :first {margin: 0.5cm} " +
            "@page :left { margin: 0.5cm } " +
            "@page :right { margin: 0.5cm } " +
            "@media print and (color) { * { -webkit-print-color-adjust: exact; print-color-adjust: exact }} " +
            "body {margin:0; width:100%} img {margin:0; outline:none} " +
            "table {margin: 0} table td {padding: 0}";

        win.document.write('<head><title>NovatorPriceService</title><style>' + css + '</style></head><body>');

        var n = 0,
            cols = parseInt(editors[0].fn.fromUnit(21) / editors[0].canvas.width),
            style = 'style="width:' + editors[0].canvas.width + 'px;height:' + editors[0].canvas.height + 'px"';

        win.document.write('<table><tr>');

        for (var i = 0; i < editors.length; i++) {
            win.document.write('<td ' + style + '>');
            renderEditor(win, editors[i]);
            win.document.write('</td>');
            n++;
            if (n >= cols) {
                n = 0;
                win.document.write('</td></tr><tr>');
            }
        }

        win.document.write('</tr></table>');

        win.document.write('</body>');

        //win.print();
        //win.close();
        //win.location.reload();

        if (createWin) {
            editors[0].update();
        }
    }
}