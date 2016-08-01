(function($) {
    var g = {
        config: function($el) {
            return moduleTool.config($el);
        },
        reset: function($el, opts) {
            moduleTool.reset($el, opts, render);
        },
        run: function($el) {},
        init: function($el) {
            moduleTool.init($el, render);
        }
    };

    $.fn.textModule = function(oper, opts) {
        if (!oper)
            oper = "init";

        var operr;
        this.each(function() {
            operr = g[oper]($(this), opts);
        });
        if (operr)
            return operr;

        return this;
    };

    var render = function($widget, dataval, isReset) {
        var opts = $.extend({}, $.fn.textModule.defaults, dataval);
        if (!opts.content) {
            setNoData($widget);
        } else {
            var txtArr = opts.content.split("\n");
            $widget.find(".textContent").html("<p>" + txtArr.join("</p><p>") + "</p>");
            setHasData($widget);
        }
    };

    $.fn.textModule.defaults = {
        content: ""
    };
})(jQuery);
