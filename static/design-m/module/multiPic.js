(function($) {
    var g = {
        config: function($el) {
            return moduleTool.config($el);
        },
        reset: function($el, opts) {
            moduleTool.reset($el, opts, render);
        },
        run: function($el) {
            moduleTool.run($el, render);
        },
        init: function($el) {
            moduleTool.init($el, render);
        }
    };

    $.fn.multiPic = function(oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function() {
            operr = g[oper]($(this), opts);
            if (operr) return false;
        });
        if (operr) return operr;

        return this;
    };

    var render = function($widget, dataval, renderType) {
        var opts = $.extend({}, $.fn.multiPic.defaults, dataval);

        //if(renderType=='run'){
        var scrollCon = $widget.find(".moreImgMain")[0];
        var myScroll = new IScroll(scrollCon, {
            scrollX: true,
            scrollY: false,
            mouseWheel: true
        });
        //}
    };

    $.fn.multiPic.defaults = {

    };
})(jQuery);
