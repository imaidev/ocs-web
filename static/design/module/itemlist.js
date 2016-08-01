(function($){
	var g = {
		    config:function($el){
		    	return moduleTool.config($el);
		    },
		    reset:function($el,opts){
		    	moduleTool.reset($el,opts,render);
		    },
		    run:function($el){
		    	moduleTool.run($el,render);
		    },
		    init:function($el){
		    	moduleTool.init($el,render);
		    }
		};

	var render=function($widget,dataval,renderType){
		
		var opts = $.extend({}, $.fn.itemlist.defaults, dataval);
		if(renderType=="run"){
			console.log(window.location.href);
	    	var src_end = "";
	    	var str=window.location.href;
	    	var num=str.indexOf("?");
	    	if(num>0){
	    		str=str.substr(num+1);
	    		src_end="&";
	    		src_end=src_end+str;
	    	}
	    	
	    	var src = ctx+"/"+g_comid+"item/iteminfo/PageDesignShowItems.htm?" +
	    			"showGaid="+opts.showGaid
	    			+"&viewType="+opts.viewType
	    			+"&sort="+opts.sort
	    			+"&itemNum="+opts.itemNum
	    			+"&grid_t="+opts.grid_t
	    			+"&showDiscount="+opts.showDiscount
	    			+"&showSaleData="+opts.showSaleData
	    			+"&showEvaluateCount="+opts.showEvaluateCount
	    			+"&showEvaluate="+opts.showEvaluate
	    			+"&vend_id="+g_vendid
	    			+src_end;
	    	
	    	$widget.children().attr("src",src);
		}
		
	};
	
	$.fn.itemlist=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};
	
	$.fn.itemlist.defaults = {
			showGaid:true,
			viewType:"grid",
			sort:"coefp_desc",
			itemNum:"16",
			grid_t:"180",
	}	
	
/*$.fn.itemlist.defaults = {
		showGaid:"true",
		viewType:"grid",
		sort:"coefp_desc",
		itemNum:"16",
		grid_t:"180",
		showDiscount:false,
		showSaleData:true,
		showEvaluateCount:true,
		showEvaluate:false
	}*/
	
})(jQuery)