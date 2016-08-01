(function($){
	var g = {
	    config:function($el){
	    },
	    reset:function($el, opts){
	    },
	    run:function($el){
	    	if ($el.find("iframe").attr("data-lazyLoad")) {
	    		var src = $el.find("iframe").attr("data-lazyLoad");
	    		var search = location.search;
	    		if (src.indexOf("?") != -1) {
	    			src = src+search.replace("?", "&");
	    		} else {
	    			src = src+search;
	    		}
	    		$el.find("iframe").attr("src", src);
	    	}
	    },
	    init:function($el){
	    	moduleTool.init($el,render);
	    }
	};
	
	$.fn.custommodule=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};

	var render=function($widget,dataval){
	}
	
})(jQuery)