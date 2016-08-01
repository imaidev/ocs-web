(function ($) {
    var g = {
        config: function ($el) {
        },
        reset: function ($el, opts) {
        },
        run: function ($el) {
        },
        init: function ($el) {
            moduleTool.init($el, render);
        }
    };

    var render = function ($widget, dataval,renderType) {
        var opts = $.extend({}, $.fn.anchorModule.defaults, dataval);

        if ($widget.find("a[id]").length == 0) {
            var nid = randomNumber();
            $widget.find("a").attr({ id: nid, name: nid });
            $widget.find("span").text(nid);
        }
    }

    $.fn.anchorModule = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };


    $.fn.anchorModule.defaults = {
    	   
    }
})(jQuery)