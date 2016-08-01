(function($){
    var g = {
        config: function($el){
            return moduleTool.config($el);
        },
        reset: function($el, opts){
            moduleTool.reset($el, opts, render);
        },
        run: function($el){
            moduleTool.run($el, render);
        },
        init: function($el){
            moduleTool.init($el, render);
        }
    };
    
    
    $.fn.cubeitemheadmodule = function(oper, opts){
        if (!oper) 
            oper = "init";
        
        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);
        })
        if (operr) 
            return operr;
        
        return this;
    };
    
    
    var render = function($widget, dataval, isReset){
    
        if (isReset == "reset") {
            setCfg($widget, dataval);
        }
        
    }
    
    function setCfg($widget, dataval){
        $widget.find(".flowTit").attr("style", "border-bottom-color:" + dataval.Left.bgColor);
        $widget.find(".titLeft").attr("style", "background-color:" + dataval.Left.bgColor + ";color:" + dataval.Left.fontColor + ";width:" + dataval.Left.leftWidth + "px");
        $widget.find(".titLeft").find("a").attr("href", dataval.Left.Link);
        $widget.find(".titLeft").find("a").html(dataval.Left.title);
        $widget.find(".classification").html("");
        for (var i = 0; i < dataval.Right.length; i++) {
            var domstr = [];
            domstr.push("<li>");
            domstr.push("<a href='", dataval.Right[i].Link, "' target='_blank'>");
            domstr.push(dataval.Right[i].title);
            domstr.push("</a> ");
            domstr.push("</li> ");
            var str = domstr.join("");
           $widget.find(".classification").append(str);
        }
        
    }
    $.fn.cubeitemheadmodule.defaults = {
        leftWidth: "200",
        bgColor: "#F16C00",
        fontColor: "#fff",
        leftTitle: "左侧文字"
    }
})(jQuery)
