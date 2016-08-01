(function($){
	var g = {
	    config:function($el,opts){
	    },
	    reset:function($el,opts){
	    },
	    run:function($el,opts){
	    	//运行时获得店铺信息
	    	if($el.find(".shopExtra").length!=0){
	    		$el.find(".shopExtra").remove();
	    	}
	    	organizeData($el);
	    },
	    init:function($el,opts){
	    	
	    }
	};
    
	$.fn.shopcards=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};
	
	var render=function(widgetid,dataval){
	}
	
	function organizeData(opt){
		$.get(ctx+"/design/shop/ShopCard.do?method=getShopInfo"+"&vendId="+g_vendid,
		     function(data){
			  var desc = parseInt(data.CONSISTENT_WITH_DESCRIPTION*2);
			  var sell = parseInt(data.SELLER_SERVICE_GRADE*2);
			  var deli = parseInt(data.SELLER_DELIVERY_GRADE*2);
			  var addr = data.SHOP_ADDR;
			  var keeperName = data.SHOPKEEPER_NAME;
			  var keeperTel = data.SHOPKEEPER_TEL;
				var str = '<div class="shopExtra">'
					+'<div class="shopName"> 店铺名称：<a class="fcS1">'+data.SHOP_NAME+'</a><div class="hideCon shopInfo" style="z-index:999">'
					+'<div class="hideCon-item"><p>店铺动态评分</p><table><tr><td width="32%" align="right"><p><label>描述相符：</label></p></td>'
					+'<td width="68%"><span class="f14 fcS1"><div class="starLevel lh'+desc+'"></div>&nbsp;&nbsp;'+data.CONSISTENT_WITH_DESCRIPTION+'</span></td></tr>'				
					+'<tr><td align="right"><p><label>服务态度：</label></p></td>'
					+'<td><span class="f14 fcS1"><div class="starLevel lh'+sell+'"></div>&nbsp;&nbsp;'+data.SELLER_SERVICE_GRADE+'</span></td></tr>'				
					+'<tr><td align="right"><p><label>发货速度：</label></p></td>'	
					+'<td><span class="f14 fcS1"><div class="starLevel lh'+deli+'"></div>&nbsp;&nbsp;'+data.SELLER_DELIVERY_GRADE+'</span></td></tr></table></div>'				
					+'<div class="hideCon-item"><p>店铺服务</p>'
					+'<table><tr><td width="32%" align="right" valign="top">店铺名称：</td><td width="68%">'
					+'<p class="wordWB">'+data.SHOP_NAME+'</p></td></tr>'
					+'<tr><td align="right" valign="top">店铺地址：</td><td><p class="wordWB">'+addr+'</p></td></tr>'
					+'<tr><td align="right" valign="top">联系人：</td><td><p class="wordWB">'+keeperName+'</p></td></tr>'
					+'<tr><td align="right" valign="top">联系电话：</td><td><p class="wordWB">'+keeperTel+'</p></td></tr>'
					+'</table></div><div class="hideCon-item hideCon-btns mt10">'	
					+'<a class="btn-item btn-goShop" target="_blank" href="/shop/'+g_vendid+'/index.html"><b></b>进店逛逛</a><a class="btn-item btn-favShop" onclick="collectionShop()"><b></b>收藏本店</a></div></div></div></div>';
					opt.find("#shopCardCont").append(str);
			  },'json');
	}

})(jQuery);

