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
    
    $.fn.shopBottom = function(oper, opts){
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
            if (typeof dataval.items == "undefined") {
                setNoData($widget);
            }
            
        }
        if (isReset == "reset") {
        
            setImgIntoPage($widget, dataval);
        }
    };
    
    function setImgIntoPage($widget, dataval){
    	var flag = 0;
        for (var i = 0; i < dataval.items.length; i++) {
			
            if (($widget.parents(".module-wrap").find(".nodatapic").length!=0) && (dataval.items[i].imgPath != "")) {
                setHasData($widget);
				
            }
			if(dataval.items[i].imgPath != ""){
				flag++;
			}
			
         	if ((dataval.items[i].imgPath != "")&&(i<3)) {
                $($widget.find("li")[i]).find("img").attr("src", dataval.items[i].imgPath);
                $($widget.find("li")[i]).find("a").attr("href", dataval.items[i].imgLink);
				$($widget.find("li")[i]).attr("style","display:block");
            }
            else if((dataval.items[i].imgPath == "")&&(i<3)){
              $($widget.find("li")[i]).attr("style","display:none");
            }
           if ((i == 3) && (dataval.items[i].imgIndex == 3) && (dataval.items[i].imgTitle == "背景图")) {
                $widget.find(".controlImg").find("img").attr("src", dataval.items[i].imgPath);
                $widget.find(".controlImg").find("a").attr("href", dataval.items[i].imgLink);
                
            }
            
        }
        	if(flag==0){
				setNoData($widget);
			}
        
    }
})(jQuery);
