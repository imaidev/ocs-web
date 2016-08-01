(function ($) {
    var g = {
        config: function ($el) {
            return moduleTool.config($el);
        },
        reset: function ($el, opts) {
            moduleTool.reset($el, opts, render);
        },
        run: function ($el) {
            moduleTool.run($el, render);
        },
        init: function ($el) {
            moduleTool.init($el, render);
        },
	    reRender:function($el){
	    	render($el,moduleTool.config($el));
	    }
    };

    $.fn.slidermodule = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);
            if (operr) return false;
        });
        if (operr) return operr;

        return this;
    };

    var render = function ($widget, dataval) {
        var opts = $.extend({}, $.fn.slidermodule.defaults, dataval);

        var strT = [], strC = [];
        for (var i = 0; i < opts.imgs.length; i++) {
            strT.push("<li></li>");
            strC.push("<li><a style='display:block;overflow:hidden;background: url(",opts.imgs[i].src,") center no-repeat;' ", (opts.imgs[i].href !== "" ? "target='_blank' href='" + opts.imgs[i].href + "'" : ""), ">");
            strC.push("</a></li>");
        }
        $widget.find(".delChildren").children().remove();
        $widget.find(".delChildren").removeAttr("style");

        var $hd=$widget.find(".adsBannerHd");
        var $bd=$widget.find(".adsBannerBd");

        $hd.html(strT.join(''));
        $bd.css("height", opts.height).append('<ul>'+strC.join('')+'</ul>');

        $widget.find('.adsBanner').slide(opts);

        if(opts.effect=="fold"){
        	$bd.find("ul").css("width","100%");
        	$bd.find("li").css("width","100%");
        }
    };


    $.fn.slidermodule.defaults = {
        imgs:[{
            href:"",
            src:"/static/design/img/banner1.jpg"
        },{
            href:"",
            src:"/static/design/img/banner2.jpg"}
        ],
        height: "400",


        titCell: ".adsBannerHd li",
        mainCell: ".adsBannerBd ul",
        effect: "fold",
        autoPlay: true,
        trigger: "mouseover",
        easing: "swing",
        delayTime: 500,
        mouseOverStop: true,
        pnLoop: true
    };
})(jQuery)
