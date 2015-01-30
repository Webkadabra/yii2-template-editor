
function EditorHistory (editor) {

    var list = [],
        current = 0,
        that = this,
        size = 100;

    var OP_CHANGE = 0;
    var OP_CREATE = 1;
    var OP_REMOVE = 2;

    this.enableUndo = false;
    this.enableRedo = false;

    this.onChange = null;

    var push = function (operation, objects, changes) {

        list[current] = {
            operation: operation,
            objects: objects
        };

        if (changes) {
            var props = [], l = changes.length;
            for (var j = 0, k = objects.length; j < k; j++) {
                for (var i = 0; l, i < l; i++) {
                    if (objects[j].hasOwnProperty(changes[i])) {
                        props[changes[i]] = objects[j][changes[i]];
                    }
                }
            }
            list[current].props = props;
        }

        if (list.length == size) {
            size.splice(0, 1);
        } else {
            current++;
        }

        that.enableUndo = true;
        if (that.onChange) that.onChange.call(that);
    };

    /**
     * Зафиксировать изменения в объекте
     * @param objects {Array} - массив объектов
     * @param changes {Array} - массив названий фиксируемых свойств
     */
    this.change = function (objects, changes) {
        push(OP_CHANGE, objects, changes);
    };

    /**
     * Зафиксировать создание объекта
     * @param objects {Array}
     */
    this.create = function (objects) {
        push(OP_CREATE, objects);
    };

    /**
     * Зафиксировать удаление объекта
     * @param objects {Array}
     */
    this.remove = function (objects) {
        push(OP_REMOVE, objects);
    };

    var applyChange = function () {
        var i, tmp,
            objects = list[current].objects,
            lenght = objects.length,
            props = list[current].props;

        for (i = 0; i < lenght; i++) {
            for (var attr in props) {
                tmp = objects[i][attr];
                objects[i][attr] = props[attr];
                props[attr] = tmp;
            }
            objects[i].update();
            editor.selectObject(objects[i]);
        }
    };

    var applyCreate = function () {
        var i, objects = list[current].objects, lenght = objects.length;
        for (i = 0; i < lenght; i++) {
            editor.objects.add(objects[i]);
            editor.selectObject(objects[i]);
        }
    };

    var applyRemove = function () {
        var i, objects = list[current].objects, lenght = objects.length;
        for (i = 0; i < lenght; i++) {
            editor.objects.remove(objects[i]);
        }
    };

    /**
     * Отмена действия
     */
    this.undo = function() {
        if (current > 0) {
            current--;
            editor.unselectAll();

            switch (list[current].operation) {
                case OP_CHANGE:
                    applyChange();
                    break;

                case OP_CREATE:
                    applyRemove();
                    break;

                case OP_REMOVE:
                    applyCreate();
                    break;
            }

            editor.markers.update();
            editor.update();

            that.enableUndo = (current > 0);
            that.enableRedo = true;
            if (that.onChange) that.onChange.call(that);
        }
    };

    /**
     * Повтор дейтсвия
     */
    this.redo = function() {
        if (current < list.length) {
            editor.unselectAll();

            switch (list[current].operation) {
                case OP_CHANGE:
                    applyChange();
                    break;

                case OP_CREATE:
                    applyCreate();
                    break;

                case OP_REMOVE:
                    applyRemove();
                    break;
            }

            editor.markers.update();
            editor.update();

            current++;
            that.enableUndo = true;
            that.enableRedo = (current < list.length);
            if (that.onChange) that.onChange.call(that);
        }
    };
}