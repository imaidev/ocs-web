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
        }
    };

    $.fn.shopSignBoard = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);
            if (operr) return false;
        })
        if (operr) return operr;

        return this;
    };

    var render = function ($widget, dataval,renderType) {
        var opts = $.extend({}, $.fn.shopSignBoard.defaults, dataval);
        
        if(renderType=="reset"){
        	$widget.find(".backP").css("backgroundImage",opts.bgimg).css("height",opts.height);
        	
        	var hei = opts.height;
        	var siz = opts.boardfontsize;
        	$widget.find(".word").css("top",Math.round((hei-siz*1.5)/2));
        }
        
        $widget.find("h2").css("display","none");
        if("2"==opts.isshowtitle){
    		$.get(ctx+"/design/shop/ShopCard.do?method=getShopInfo"+"&vendId="+g_vendid,
    				function(data){
    					$widget.find("h2").css({
    						"font-family":decodeURIComponent(opts.boardfontfamily),
    						"font-size":opts.boardfontsize+"px",
    						"font-weight":opts.isbold=="1"?"bold":"normal",
    						"display":"block"
    					});
    					
    					try {
    						$widget.find("h2")[0].innerHTML=data.SHOP_NAME;
						} catch (e) {
							$widget.find("h2")[0].innerHTML="";
						}
    				}
    		,'json');
    	}
        else if("1"==opts.isshowtitle){
			$widget.find("h2").css({
				"font-family":decodeURIComponent(opts.boardfontfamily),
				"font-size":opts.boardfontsize+"px",
				"font-weight":opts.isbold=="1"?"bold":"normal",
				"display":"block"
			});
			$widget.find("h2")[0].innerHTML=opts.assignTitle;
    	}
    }


    $.fn.shopSignBoard.defaults = {
    	bgimg:"url(/static/design/img/shopboard.jpg)",
    	height:120,
    	isbold:"1",
    	assignTitle:"",
    	boardfontsize:"36",
    	boardfontfamily:"Microsoft%20YaHei",
    	boardcolor:"#fff",
    	
    	isshowtitle:"2",//0 不显示标题 1 显示指定标题 2 显示店铺名称
    };
})(jQuery)