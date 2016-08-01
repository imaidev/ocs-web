(function($){
    var g = {
        config: function($el){
            return moduleTool.config($el);
        },
        reset: function($el, opts){
            moduleTool.reset($el, opts, render);
        },
        run: function($el){
        },
        init: function($el){
            moduleTool.init($el, render);
        }
    };
    
    $.fn.oneColumnImg = function(oper, opts){
        if (!oper) 
            oper = "init";
        
        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);
        });
        if (operr) 
            return operr;
        
        return this;
    };
    
    var render = function($widget, dataval, isReset){
        if (isReset == "init") {
            if (typeof dataval.imgPath == "undefined") {
                setNoData($widget);
            }
            else {
                setHasData($widget);
                setImgIntoPage($widget, dataval);
            }
            
        }
        if (isReset == "reset") {
            if (typeof dataval.imgPath == "undefined") {
                setNoData($widget);
            }
            else {
                setHasData($widget);
                setImgIntoPage($widget, dataval);
            }
        }
    };
    
    function setImgIntoPage($widget, dataval){
        if (dataval.imgPath !== null && dataval.imgPath !== "") {
            setHasData($widget);
            var domstr = [];
            domstr.push(" <img src='", dataval.imgPath, "' class='lib-img'>");
            var str = domstr.join("");
            $widget.find(".responseImg").html(str);
        }
        
        if (dataval.title !== "") { //若P标签中的值为“” 则会被过滤器过滤掉。
           $widget.find(".lib-img").next().remove();
		    var domstr = [];
            domstr.push("<div class='tit'> ");
            domstr.push("<a href='" + dataval.url + "'>");
            domstr.push(dataval.title);
            domstr.push("</a>");
            domstr.push(" </div>");
            var str = domstr.join("");
            $widget.find(".lib-img").after(str);
        }else{
			$widget.find(".lib-img").next().remove();
		}
    }
})(jQuery);
