/**
 * 商品推荐
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
		        	moduleTool.run($el, render);
		        },
		        init: function ($el) {
		            moduleTool.init($el, render);
		        }
		    };
    
	$.fn.recommenditem=function(oper,opts){
	    if(!oper) oper="init";
	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	    })
	    if (operr) return operr;
	    return this;
	};

	 var render = function ($widget, dataval) {
		var opts = $.extend({}, $.fn.recommenditem.defaults, dataval);
		if(opts==''){
			return false;
		}
		//for(var i in dataval) console.log(i+'--->>>'+dataval[i]);
		if(opts){
			if(opts.backcolor!='' && typeof(opts.backcolor) != "undefined"){
				$widget.css('background-color',opts.backcolor);
			}
			if(opts.backpic!='' && typeof(opts.backpic) != "undefined"){//
				//alert('backpic='+opts.backpic);
				$widget.css('background-image','url('+opts.backpic+')');
			}
			if(opts.item!='' && typeof(opts.item) != 'undefined'){
				//alert('--opts.ITEM--'+opts.item);
			}
			//$widget.append('<span>'+opts.isshow+'</span>');
			//$widget.find(".site-nav-bd-l").append();
			//alert('append value');
		}
	}
	/*$.fn.recommenditem.defaults ={
			titCell : ".adsBannerHd li",
			mainCell : ".adsBannerBd ul",
			effect : "topLoop",
			autoPlay : true,
			trigger : "click",
			easing : "swing",
			delayTime : 500,
			mouseOverStop : true,
			pnLoop : true
	};*/
})(jQuery)