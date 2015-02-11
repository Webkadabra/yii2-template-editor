/**
 * Объект редактора
 */
function Editor() {

    this.objects = new EditorGroup();
    this.selected = new EditorGroup();
    this.selectedObject = null;
    this.markers = new Markers(this);
    this.history = new EditorHistory(this);
    this.fn = new EditorFunctions(this);

    this.canvas = document.getElementById('paper');
    this.context = this.canvas.getContext('2d');

    this.showFrame = true;
    this.printMode = false;

    this.onObjectChange = null;

    var startDrag = null,
        markerResize = null,
        startResize = null,
        lockHistory = false,
        that = this;

    /**
     * Выделить объект
     * @param obj EditorObject
     */
    this.selectObject = function (obj) {
        that.selected.add(obj);
        that.markers.update();
        if (that.selected.count() == 1) {
            that.selectedObject = that.selected.item(0);
        } else {
            that.selectedObject = null;
        }
    };

    /**
     * Снять выделение со всех объектов
     */
    this.unselectAll = function () {
        if (this.selected.count()) {
            this.selected.clear();
            this.markers.update();
            that.selectedObject = null;
        }
    };

    /**
     * Перетаскивание объектов
     * @param point
     */
    function drag(point) {

        if (!lockHistory) {
            that.history.change(that.selected.items(), ['x', 'y']);
            lockHistory = true;
        }

        var dx = point.x - startDrag.x,
            dy = point.y - startDrag.y;

        if (keyModeShift && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
            if (Math.abs(dx) > Math.abs(dy)) {
                dy = 0;
            } else {
                dx = 0;
            }
        }

        that.selected.each(function () {
            this.x = this.old.x + dx;
            this.y = this.old.y + dy;
        });

        that.markers.update();
        that.update();
    }

    /**
     * Изменение размеров объектов
     * @param point
     */
    function resize(point) {

        if (!lockHistory) {
            that.history.change(that.selected.items(), ['x', 'y', 'width', 'height']);
            lockHistory = true;
        }

        var dx = point.x - startResize.x,
            dy = point.y - startResize.y;

        //TODO это не работатет
        if (keyModeShift && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
            if (Math.abs(dx) > Math.abs(dy)) {
                dy = Math.abs(dx) * (dy / dx);
            } else {
                dx = Math.abs(dy) * (dx / dy);
            }
        }

        var minSize = 10;
        that.selected.each(function () {
            if (markerResize == 2 || markerResize == 4 || markerResize == 7) {
                this.width = this.old.width + dx * this.old.rw;
                if (this.width < minSize) this.width = minSize;
                this.x = this.old.x + dx * (1 - this.old.rx);
            } else if (markerResize == 0 || markerResize == 3 || markerResize == 5) {
                this.width = this.old.width - dx * this.old.rx;
                if (this.width < minSize) {
                    this.width = minSize;
                } else {
                    this.x = this.old.x + dx * this.old.rx;
                }
            }
            if (markerResize == 5 || markerResize == 6 || markerResize == 7) {
                this.height = this.old.height + dy * this.old.rh;
                if (this.height < minSize) this.height = minSize;
                this.y = this.old.y + dy * (1 - this.old.ry);
            } else if (markerResize == 0 || markerResize == 1 || markerResize == 2) {
                this.height = this.old.height - dy * this.old.rh;
                if (this.height < minSize) {
                    this.height = minSize;
                } else {
                    this.y = this.old.y + dy * this.old.ry;
                }
            }

            this.updateTextLines(that.context);
        });

        that.markers.update();
        that.update();
    }

    function updateOld() {
        that.selected.each(function () {
            this.updateOld();
        });
    }

    function render() {
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        that.objects.each(function () {
            this.draw(that.context);
        });
    }

    this.print = function () {
        this.printMode = true;
        render();
        this.printMode = false;
    };

    /**
     * Перерисовка холста
     */
    this.draw = function () {
        render();
        that.markers.draw();
    };

    /**
     * Обновление страницы
     */
    this.update = function () {
        this.draw();
        this.onObjectChange.call(this);
    };

    this.canvas.onmousemove = function (e) {
        var point = that.fn.windowToCanvas(e.clientX, e.clientY);

        if (startDrag) {
            drag(point);
        } else if (startResize) {
            resize(point);
        } else {

            var cursor = that.canvas.style.cursor,
                newCursor = 'default',
                markerID = that.markers.testPoint(point);

            if (markerID === null) {
                that.objects.each(function () {
                    if (this.testPoint(point)) {
                        newCursor = 'move';
                        return false;
                    }
                });
            } else {
                newCursor = that.markers.cursors[markerID];
            }

            if (newCursor != cursor) {
                that.canvas.style.cursor = newCursor;
            }
        }
    };

    this.canvas.onmouseup = function (e) {

        if (startResize) {
            startResize = null;
            return;
        }

        var point = that.fn.windowToCanvas(e.clientX, e.clientY);

        if (startDrag) {
            var dx = point.x - startDrag.x,
                dy = point.y - startDrag.y;
            startDrag = null;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) return;
        }

        var priz = false;

        that.objects.reverseEach(function () {
            if (this.testPoint(point)) {
                priz = true;
                if (keyModeCtrl) {
                    if (that.selected.remove(this)) {
                        that.markers.update();
                        return false;
                    }
                } else {
                    that.unselectAll();
                }
                that.selectObject(this);
                return false;
            }
        });

        if (!priz && !keyModeCtrl) that.unselectAll();
        that.onObjectChange.call(this);
        that.draw();
    };

    this.canvas.onmousedown = function (e) {
        if (startDrag === null) {
            var point = that.fn.windowToCanvas(e.clientX, e.clientY);
            var markerID = that.markers.testPoint(point);
            if (markerID !== null) {
                updateOld();
                markerResize = markerID;
                startResize = point;
                lockHistory = false;
            } else {
                that.selected.each(function () {
                    if (this.testPoint(point)) {
                        updateOld();
                        startDrag = point;
                        lockHistory = false;
                        return false;
                    }
                });
            }
        }
    };
}