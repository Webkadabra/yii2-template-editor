/**
 * Undo system
 */
function EditorHistory (obj) {

    this.list = [];
    this.current = -1;

    this.deleteObject = null;
    this.createObject =  null;
    this.getAttributes = null;

    if (obj) {
        if (obj.hasOwnProperty('deleteObject')) this.deleteObject = obj.deleteObject;
        if (obj.hasOwnProperty('createObject')) this.createObject = obj.createObject;
        if (obj.hasOwnProperty('getAttributes')) this.getAttributes = obj.getAttributes;
    }

    /**
     * Добавить событие в историю
     * @param object
     * @param eventType string|null
     */
    this.push = function (object, eventType) {
        if (eventType === null) {
            eventType = 'change';
        }

        var attrs;
            if (typeof this.getAttributes === 'function') {
            attrs = this.getAttributes(object);
        } else {
            attrs = [];
        }

        this.list.push({
            eventType: eventType,
            object: object,
            attrs: attrs
        });

        this.current++;
    };

    /**
     * Отменить событие
     */
    this.undo = function() {
        if (this.current > -1) {
            var c = this.current--;
            switch (this.list[c].eventType) {
                case 'create':
                    if (typeof this.deleteObject === 'function') {
                        this.deleteObject(this.list[c]);
                    }
                    break;
                case 'change':
                    var attrs = this.list[c].attrs;
                    var object = this.list[c].paper;
                    for (var attr in attrs) {
                        if (attrs.hasOwnProperty(attr)) {
                            object.attr(attr, this.list[c].attrs[attr]);
                        }
                    }
                    break;

                case 'remove':
                    break;
            }
        }
    };

    /**
     * Повторить событие
     */
    this.redo = function () {
        if (this.current < this.list.length) {
            this.current++;
            switch (this.list[this.current].eventType) {
                case 'create':
                    if (typeof this.createObject === 'function') {
                        this.createObject(this.list[this.current]);
                    }
                    break;
                case 'change':
                    break;

                case 'remove':
                    break;
            }
        }
    };
}