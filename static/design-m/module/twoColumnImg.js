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
    
    $.fn.twoColumnImg = function(oper, opts){
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
        if (dataval.imgPath[0] !== null && dataval.imgPath[0] !== "") {
            $($widget.find("img")[0]).attr("src", dataval.imgPath[0]);
        }
        if (dataval.imgPath[1] !== null && dataval.imgPath[1] !== "") {
            $($widget.find("img")[1]).attr("src", dataval.imgPath[1]);
        }
        if (dataval.link[0] !== null && dataval.link[0] !== "") {
            $($widget.find("a")[0]).attr("href", dataval.link[0]);
        }
        if (dataval.link[1] !== null && dataval.link[1] !== "") {
            $($widget.find("a")[1]).attr("href", dataval.link[1]);
        }
    }
})(jQuery);
