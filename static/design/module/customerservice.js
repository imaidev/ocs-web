(function($){
	var g = {
	    config:function($el,opts){
	        return JSON.parse($el.attr("data-val"));
	    },
	    reset:function($el,opts){
	    },
	    run:function($el,opts){
	    	if($el.find(".960kefu").length!=0||$el.find(".240kefu").length!=0){
	    		var kefuStringGet = $el.find("#checkeduser").val().trim();
				var arrayKefu = new Array();
				if(null!=kefuStringGet&&""!=kefuStringGet){
					arrayKefu = kefuStringGet.split(",");
				}
				$.get(ctx+"/im/serviceuser/QueryServiceUser.do?method=getServiceUserList"+"&vendId="+g_vendid,
	    	        function(data){
	    				 var str = "";
	    				 for(var i=0;i<data.length;i++){
	    					for(var j=0;j<arrayKefu.length;j++){
	    						if(data[i].USER_ID==arrayKefu[j]){
	    							 str=str+
			    						"<li><p><a target='_blank' href='/im/index.jsp?vendId="+g_vendid+"&userId="+data[i].USER_ID+"' title='"+data[i].NICK_NAME+"'>";
			    						if(data[i].STATUS=='1'){
			    							str = str+"<i class='icon-serv serv-on'></i>";
			    						}else{
			    							str = str+"<i class='icon-serv serv-off'></i>";
			    						}
			    						str = str+"<span class='serv-name'>"+data[i].NICK_NAME+"</span></a></p></li>";
	    						}
	    					}
	    				 }
	    				 $el.find("li").remove(); 
	    				 $el.find(".kefu").append(str);
	    		  },'json');
	    	}
	    },
	    init:function($el,opts){
	    	//获得布局宽度
	    	var wit = $el.closest('.column').width()
	    	var strWit="";
			if("240"<wit&&($el.find(".960kefu").length==0)){
				strWit = strWit + 
				'<div class="ba p10 960kefu"><div class="horServs kefuappend"><p class="serv-tit ml5 onlineservice">在线咨询</p><ul class="serv-lists-hor ml10 kefu">'
				+'<li><p><a title="测试客服"><i class="icon-serv serv-on"></i><span class="serv-name">测试客服</span></a></p></li>'		
				+'</ul></div><div class="mt10 servicetime"><span class="serv-tit ml5">营业时间</span><span class="ml10 datetime1">周一至周五：9:00-21:00</span>'
				+'<span class="ml30 datetime2">周六至周日：0:00-24:00</span></div>	<div class="mt10 servicecontact">'
				+'<span class="serv-tit ml5">联系电话</span><span class="ml10 shoptelshow">123456789012</span><span class="ml30 shopphoneshow">123456789012</span>'
				+'</div></div>';
			}else if("240">=wit&&($el.find(".240kefu").length==0)){
				strWit = strWit + 
				'<div class="verServs ba 240kefu"><div class="verServs-bd">'
				+'<div class="servItem bb servicetime"><p class="serv-tit mt10 mb10">营业时间</p>'
				+'<div class="serv-time ml10"><p class="item datetime1">周一至周五：9:00-21:00</p><p class="item datetime2">周六至周日：0:00-24:00</p>'
				+'</div></div> <div class="servItem bb kefuappend"><p class="serv-tit mt10 mb10">在线咨询</p><ul class="serv-lists-ver ml10 kefu">'
				+'<li><p><a title="测试客服"><i class="icon-serv serv-on"></i><span class="serv-name">测试客服</span></a></p></li>'
				+'</ul></div>'
				+'<div class="servItem servicecontact"><p class="serv-tit mt10 mb10">联系电话</p><div class="serv-time ml10">'
				+'<p><span class="shoptelshow">123456789012</span><span class="ml30 shopphoneshow">12345678901</span></p></div></div></div></div>';
			}else{
				var kefuStringGet = $el.find("#checkeduser").val().trim();
				var arrayKefu = new Array();
				if(null!=kefuStringGet&&""!=kefuStringGet){
					arrayKefu = kefuStringGet.split(",");
				}
				$.get(ctx+"/im/serviceuser/QueryServiceUser.do?method=getServiceUserList"+"&vendId="+g_vendid,
	    	        function(data){
	    				 var str = "";
	    				 for(var i=0;i<data.length;i++){
	    					for(var j=0;j<arrayKefu.length;j++){
	    						if(data[i].USER_ID==arrayKefu[j]){
	    							 str=str+
			    						"<li><p><a target='_blank' href='/im/index.jsp?vendId="+g_vendid+"&userId="+data[i].USER_ID+"' title='"+data[i].NICK_NAME+"'>";
			    						if(data[i].STATUS=='3'){
			    							str = str+"<i class='icon-serv serv-off'></i>";
			    						}else{
			    							str = str+"<i class='icon-serv serv-on'></i>";
			    						}
			    						str = str+"<span class='serv-name'>"+data[i].NICK_NAME+"</span></a></p></li>";
	    						}
	    					}
	    				 }
	    				 $el.find("li").remove(); 
	    				 $el.find(".kefu").append(str);
	    		  },'json');
			}
			$el.find("#showcustomerservice").append(strWit);
	    }
	};
    
	$.fn.customerservice=function(oper,opts){
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

})(jQuery)