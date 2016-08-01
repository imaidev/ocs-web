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
	        },
	    };
		$.fn.recommenditemmodule=function(oper,opts){
		    if(!oper) oper="init";
		    var operr;
		    this.each(function(){
		        operr = g[oper]($(this), opts);
		    })
		    if (operr) return operr;
		    return this;
		};
	 var render = function ($widget, dataval, renderType){
		 var opts = $.extend({}, $.fn.recommenditemmodule.defaults, dataval);
		 var wit = $widget.closest('.column').width();
			 if(opts){
				 var showTitle = opts.showTitle;
		    		var showPrice = opts.showPrice;
		    		var showCode = opts.showCode;
		    		var showType=opts.showType;
		    		var ShowEffect = opts.ShowEffect;
		    		var sortOrder = opts.sortOrder;
		    		var promoteType = opts.promoteType;
		    		var category = opts.category;
		    		var keyword=opts.keyword;
		    		var itemNum=opts.itemNum;
		    		var lowerLimitPrice=opts.lowerLimitPrice;
		    		var upperLimitPrice=opts.upperLimitPrice;
		    		var itemIdArr=opts.itemIdArr;
		    		$.getJSON(ctx+"/design/shop/ShopRecommend.do?method=queryRecommend&vendid="+g_vendid, opts,
		    			function(recommendResult){
		    				var itemHtml="";
		    				var itemSize=""
		    				if(showType=="01"||"240"==wit){
		    	    			itemHtml += "<div class='recGoods recGoods-240'>"+
		    	    			"<div class='goodLists'><ul>";
		    	    			itemSize=3;
		    	    		}else if(wit=="960"&&(showType==undefined||showType=="")){
		    	    			itemHtml += "<div class='recGoods recGoods-960'>"+
		    	    			"<div class='goodLists goodLists-four'><ul>";
		    	    			itemSize=4;
		    	    		}else if(wit=="960"&&showType=="02"){
		    	    			itemHtml += "<div class='recGoods recGoods-960'>"+
		    	    			"<div class='goodLists goodLists-three'><ul>";
		    	    			itemSize=3;
		    	    		}else if(wit=="960"&&showType=="03"){
		    	    			itemHtml += "<div class='recGoods recGoods-960'>"+
		    	    			"<div class='goodLists goodLists-four'><ul>";
		    	    			itemSize=4;
		    	    		}else if(wit=="1210"&&(showType==undefined||showType=="")){
		    	    			itemHtml += "<div class='recGoods recGoods-1210'>"+
		    	    			"<div class='goodLists goodLists-four'><ul>";
		    	    			itemSize=4;
		    	    		}else if(wit=="1210"&&showType=="04"){
		    	    			itemHtml += "<div class='recGoods recGoods-1210'>"+
		    	    			"<div class='goodLists goodLists-three'><ul>";
		    	    			itemSize=3;
		    	    		}else if(wit=="1210"&&showType=="05"){
		    	    			itemHtml += "<div class='recGoods recGoods-1210'>"+
		    	    			"<div class='goodLists goodLists-four'><ul>";
		    	    			itemSize=4;
		    	    		}else if(wit=="1210"&&showType=="06"){
		    	    			itemHtml += "<div class='recGoods recGoods-1210'>"+
		    	    			"<div class='goodLists goodLists-five'><ul>";
		    	    			itemSize=5;
		    	    		}else if(wit=="1210"&&showType=="07"){
		    	    			itemHtml += "<div class='recGoods recGoods-1210'>"+
		    	    			"<div class='goodLists goodLists-six'><ul>";
		    	    			itemSize=6;
		    	    		}else if(wit=="1210"&&showType=="08"){
		    	    			itemHtml += "<div class='recGoods recGoods-1210'>"+
		    	    			"<div class='goodLists goodLists-seven'><ul>";
		    	    			itemSize=7;
		    	    		}else{
		    	    			itemHtml += "<div class='recGoods recGoods-240'>"+
		    	    			"<div class='goodLists goodLists-four'><ul>";
		    	    			itemSize=4;
		    	    		}
		    				var itemHtml2="";
		    				var resultSize="0";
		    				if(recommendResult){
		    					resultSize=recommendResult.length;
		    				}
		    				for(var i = 0; i < resultSize; i++){
		    					var itemObj = recommendResult[i];
		    					itemId=itemObj.ITEM_ID;
			        			img=itemObj.IMG_URL;
			        			itemCode=itemObj.ITEM_CODE;
			        			itemTltit=itemObj.ITEM_TITLE;
			        			keyWords=itemObj.KEY_WORDS;
			        			price=itemObj.PRICE;
			        			itemUrl=itemObj.ITEM_URL;
			        			itemHtml2+="<li class='goodList'>"+
	    						"<a href='"+itemUrl+"' target='_blank'>"+
	    						"<div class='good-pic'><img calss='lazy' src='"+img+"' data-original='resource/static/design/img/default.png' alt='"+itemTltit+"'></div></a>"+
	    						"<div class='good-item good-name'>"+itemTltit+"</div>";
			        			
			        			if(showPrice=='1'){
	    							itemHtml2+="<div class='good-item good-price'><span class='fcR f14'>￥"+price+"</span></div>";
	    						}
			        			if(showCode=='1'){
	    							itemHtml2+=	"<a href='"+itemUrl+"' target='_blank'><div class='good-item good-other'>商品编号:"+itemCode+"</div></a>";
	    						}
			        			itemHtml2+="</li>";
		    				}
		    				if(renderType!="run"){
		    					if(resultSize<itemSize){
			    					var itemHtml3="";
			    					var itemGraps=itemSize-resultSize;
			    					for(var j=0;j<itemGraps;j++){
			    						itemHtml3+="<li class='goodList'>"+
				    					"<a href='javascript:void(0)'>"+
				    					"<div class='good-pic'><img calss='lazy' src='/static/design/img/default.png' alt='默认商品'></div></a>"+
				    					"<div class='good-item good-name'>默认商品</div>";

			    						if(showPrice=='1'){
			    							itemHtml3+="<div class='good-item good-price'><span class='fcR f14'>￥100</span></div>";
			    						}
					        			if(showCode=='1'){
			    							itemHtml3+=	"<a href='javascript:void(0)'><div class='good-item good-other'>商品编号:默认商品</div></a>";
			    						}
					        			itemHtml3+="</li>"
			    					}
				        			itemHtml2+=itemHtml3;
			    				}
		    				}
		    				itemHtml+=itemHtml2+"</ul></div></div>";
		    				$widget.find('.recommendItemContent').html(itemHtml);
		    			}
		    		);
			 }

	}
	 $.fn.recommenditemmodule.defaults = {
			 showPrice:"1",
			 showCode:"1",
			showType:"",
			ShowEffect:"1",
	 		sortOrder:"hotsell_desc",
		promoteType:"01",
		category:"",
		keyword:"",
		itemNum:"",
		lowerLimitPrice:"",
		upperLimitPrice:"",
		itemIdArr:"",
		item:""
	 }
})(jQuery)