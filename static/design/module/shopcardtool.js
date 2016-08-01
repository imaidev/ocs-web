(function($){
	var g = {
	    config:function($el,opts){
	    },
	    reset:function($el,opts){
	    },
	    run:function($el,opts){
	    	render($el);
	    },
	    init:function($el,opts){
	    	render($el);
	    }
	};
    
	$.fn.shopcardtool=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};
	
	var render=function($widget){
		//运行时获得店铺信息
    	organizeData($widget);
	}
	
	var checkOpenService = function(serviceStr, serviceFlag) {
		if (serviceStr == null || serviceStr == "") return false;
		var serviceArr = serviceStr.split(",");
		for (var i = 0; i < serviceArr.length; i++) {
			if (serviceArr[i] == serviceFlag) return true;
		}
		return false;
	}
	
	function organizeData(opt){
		$.get(ctx+"/design/shop/ShopCard.do?method=getShopInfoForCardTool"+"&vendId="+g_vendid,
		     function(data){
			  if(opt.find("#shopCardTool").length!=0){
				  opt.find("#shopCardTool").empty();
		      }
			  if(!data) data={
					  shop_name:"未获取到店铺信息"
			  };
			  var shopName = data.shop_name;
			  if(!shopName){
				  shopName="";
			  }
			  
			  var shopNumber = data.SHOP_NUMBER;
			  if(!shopNumber){
				  shopNumber="";
			  }
			  
			  var shopKeeperTel=data.SHOPKEEPER_TEL||"";
			  
			  
			  var keeperName = data.shopkeeper_name;
			  if(!keeperName){
				  keeperName="";
			  }
			  var province = data.province;
			  if(!province){
				  province="";
			  }
			  var city = data.city;
			  if(!city){
				  city="";
			  }
			  var county = data.county; 
			  if(!county){
				  county="";
			  }
			  var addr = data.addr; 
			  if(!addr){
				  addr="";
			  }
			  var status = data.status;
			  var validate="未认证";
			  if(status=="1"){
				  validate="已认证"
			  }
			  var time = data.apply_time;
			  if(!time){
				  time="";
			  }
				var str = '<div class="shopDes">'
		            +'<p class="spxxA" title="'+shopName+'">'+shopName+'</p>'
		            +'<p class="yikaitong"><span>已开通的服务:</span><a class="approve"><img src="/static/design/img/shanghuxinxi-chui'+(checkOpenService(data.OPENED_SERVICES, '1')?'01':'02')+'.png" alt="">'
		            +'</a><a class="approve"><img src="/static/design/img/shanghuxinxi-wang'+(checkOpenService(data.OPENED_SERVICES, '2')?'01':'02')+'.png" alt=""></a>'
		            +'<a class="approve"><img src="/static/design/img/shanghuxinxi-hai'+(checkOpenService(data.OPENED_SERVICES, '3')?'01':'02')+'.png" alt=""></a>'
		            +'<a class="approve"><img src="/static/design/img/shanghuxinxi-yi'+(checkOpenService(data.OPENED_SERVICES, '4')?'01':'02')+'.png" alt=""></a></p>'
		            +'<ul class="desLists">'
			        +    '<li><span class="desLists-key">联系人：</span><span class="desLists-value">'+keeperName+'</span></li>'
			        +    '<li><span class="desLists-key">满意度：</span><span class="desLists-value">5.0</span></li>'
			        +    '<li><span class="desLists-key">经营模式：</span><span class="desLists-value authFlag">['+validate+']</span></li>'
			        +    (g_comid != "lysc"?('<li><span class="desLists-key">所在地区：</span><span class="desLists-value">'+province+city+county+addr+'</span></li>'):"")
			        +    (shopNumber?('<li><span class="desLists-key">门牌号：</span><span class="desLists-value">'+shopNumber+'</span></li>'):"")
			        +    (shopKeeperTel?('<li><span class="desLists-key">联系电话：</span><span class="desLists-value">'+shopKeeperTel+'</span></li>'):"")
			        +    '<li><span class="desLists-key">创店时间：</span><span class="desLists-value">'+time+'</span></li>'
		            +'</ul>'
		            /*+'<div class="shop-auth mt10 mb10">'
		            +	'<div class="item">'
		            +				'<p><img src="/static/design/img/auth01.png"/></p>'
		            +				'<p>实名认证</p>'
		            +		'</div>'
		            +		'<div class="item">'
		            +				'<p><img src="/static/design/img/auth02.png"/></p>'
		            +				'<p>知名企业</p>'
		            +		'</div>'
		            +		'<div class="item">'
		            +				'<p><img src="/static/design/img/auth03.png"/></p>'
		            +				'<p>诚信商户</p>'
		            +		'</div>'
		            +'</div>*/
		            +'</div>';
					opt.find("#shopCardTool").append(str);
			  },'json');
	}
})(jQuery);

//

