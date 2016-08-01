(function($){
	var g = {
	    config:function($el){
	        
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
	
	 
	$.fn.shopLogo=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	    })
	    if (operr) return operr;

	    return this;
	};
	
	
	
		var render=function($widget,dataval,isReset){
			
			
			if (isReset == "run") {
					getMarketInfo($widget);
				
				}else if (isReset == "init") {
					getMarketInfo($widget);
					
				}else if (isReset == "reset") {
					getMarketInfo($widget);
				}		
		}
		//用户提交调查问卷
  		function getMarketInfo($widget){
  			//ecweb\src\com\lysc\portal\screen\market\MarketDetail.java getMarketInfo
  			var url = ctx+"/lyscportal/market/MarketDetail.do?method=getMarketInfo&vendId="+g_vendid;
  			$.ajax({
				url : url,
				type :"POST",
				success:function(data){
					if(""==data){
						$widget.find(".shopLogo").html("市场名称");
					}else{
						$widget.find(".shopLogo").html(data);
					}

					},
				error:function(e){
					
				}
				
  			});
  		}
	

})(jQuery)