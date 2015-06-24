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
        var w = editor.canvas.width,
            h = editor.canvas.height,
            printScale = 2;

        editor.canvas.width = w * printScale;
        editor.canvas.height = h * printScale;
        editor.context.scale(printScale, printScale);
        editor.print();

        writeImage(win, editor, w, h);
    }

    this.print = function () {

        var css = "@page :first {margin: 0.5cm} " +
            "@page :left { margin: 0.5cm } " +
            "@page :right { margin: 0.5cm } " +
            "@media print and (color) { * { -webkit-print-color-adjust: exact; print-color-adjust: exact }} " +
            "body {margin:0; width:100%} img {margin:0; outline:none} " +
            "table {margin: 0} table td {padding: 0}";

        win.document.write('<head><title>NovatorPriceService</title><style>' + css + '</style></head><body>');

        if (editors.length == 1) {
            editors[0].print();
            writeImage(win, editors[0], editors[0].canvas.width, editors[0].canvas.height);
        } else {

            var fn = new EditorFunctions(editors[0]),
                cols = parseInt(fn.fromUnit(21) / editors[0].canvas.width),
                n = 0,
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
        }

        win.document.write('</body>');

        win.print();
        win.close();
        win.location.reload();

        if (createWin) {
            editors[0].update();
        }
    }
}