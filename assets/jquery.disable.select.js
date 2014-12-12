jQuery.fn.extend({
    disableSelection : function() {
        this.each(function() {
            this.onselectstart = function() { return false; };
            this.unselectable = "on";
            jQuery(this).css({
                '-moz-user-select': 'none'
                ,'-o-user-select': 'none'
                ,'-khtml-user-select': 'none'
                ,'-webkit-user-select': 'none'
                ,'-ms-user-select': 'none'
                ,'user-select': 'none'
            });
            // Для Opera
            jQuery(this).bind('mousedown', function() {
                return false;
            });
        });
    }
});