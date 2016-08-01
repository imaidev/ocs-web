/**
 * Created by zhanglei on 2016-01-12.
 */
(function($){

    var g = {
        config: function ($el) {
            return moduleTool.config($el);
        },
        reset: function ($el, opts) {
            moduleTool.reset($el, opts, render);
        },
        run: function ($el) {
            
        },
        init: function ($el) {
            moduleTool.init($el, render);
        }
    };

    $.fn.imagearea = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);
            if (operr) return false;
        })
        if (operr) return operr;

        return this;
    };
    
    // 组件渲染
    var render = function ($widget, dataval) {
        var opts = $.extend({}, $.fn.imagearea.defaults, dataval);
        $widget.find("map").remove();
        var mapAreaId = "map"+getRandom(1, 1e7);
        var mapArea = '<map name="'+mapAreaId+'">';
        $widget.find("img").attr("src", opts.imgsrc).attr("usemap","#"+mapAreaId);
        
        $(opts.areas).each(function(){
        		var hrefval = this.hothref;
        		if (hrefval == "") {
        				hrefval = "javascript:void(0)";
        		}
        		mapArea = mapArea + '<area shape="rect" coords="'+this.hotarea+'" href="'+hrefval+'" target="'+this.hottarget+'" style="outline: none;" hidefocus="true">';
        })
        
        mapArea = mapArea + '</map>';
        
        $widget.append(mapArea);
    }
		
		$.fn.imagearea.defaults = {
        imgsrc: "/static/design/img/hotspotsdefault.jpg",
        areas:[]
    };
    
    function getRandom(e, t) {
			var timestamp=new Date().getTime();
			var ran=Math.floor(Math.random() * (t - e + 1) + e);
			return timestamp+''+ran;
		}
})(jQuery);

