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

    $.fn.phoneCall = function(oper, opts) {
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
        var opts = $.extend({}, $.fn.phoneCall.defaults, dataval);
        if (opts) {
            $widget.find(".phoneNumber").find("span").html(opts.contact);
            $widget.find("a").attr("href", "tel:" + opts.contact);
        }
    };

    $.fn.phoneCall.defaults = {
        contact: ""
    };
})(jQuery);
