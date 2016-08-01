(function($){
	var g = {
	    config:function($el,opts){
	    },
	    reset:function($el,opts){
	    },
	    run:function($el,opts){
	    	var name = decodeURI(decodeURI(GetQueryString("keyWordSearch")));
	    	var lp = GetQueryString("beginPrice");
	    	var hp = GetQueryString("endPrice");
			if(($el.find(".shop-search-w960").length!=0)){
				$el.find("#shopSearchKeyWord960").val(name=="null"?"":name);
				if(lp!=""&&hp!=""){
					$el.find("#lprice960").val(lp>hp?hp:lp);
					$el.find("#hprice960").val(lp>hp?lp:hp);
				}else if(lp!=""){
					$el.find("#lprice960").val(lp);
				}else{
					$el.find("#hprice960").val(hp);
				}
				
				$el.find(".sousuoCli960").attr("onclick","shopSearch('960','0')");
				$el.find(".sousuoCli9601").attr("onclick","shopSearch('960','1')");
				$el.find(".sousuoCli9602").attr("onclick","shopSearch('960','2')");
				$el.find(".sousuoCli9603").attr("onclick","shopSearch('960','3')");
			}
			if(($el.find(".shop-search-w240").length!=0)){
				$el.find("#shopSearchKeyWord240").val(name=="null"?"":name);
				if(lp!=""&&hp!=""){
					$el.find("#lprice240").val(lp>hp?hp:lp);
					$el.find("#hprice240").val(lp>hp?lp:hp);
				}else if(lp!=""){
					$el.find("#lprice240").val(lp);
				}else{
					$el.find("#hprice240").val(hp);
				}
				$el.find(".sousuoCli240").attr("onclick","shopSearch('240','0')");
				$el.find(".sousuoCli2401").attr("onclick","shopSearch('240','1')");
				$el.find(".sousuoCli2402").attr("onclick","shopSearch('240','2')");
				$el.find(".sousuoCli2403").attr("onclick","shopSearch('240','3')");
			}
			if(($el.find(".shop-search-w1210").length!=0)){
				$el.find("#shopSearchKeyWord1210").val(name=="null"?"":name);
				if(lp!=""&&hp!=""){
					$el.find("#lprice1210").val(lp>hp?hp:lp);
					$el.find("#hprice1210").val(lp>hp?lp:hp);
				}else if(lp!=""){
					$el.find("#lprice1210").val(lp);
				}else{
					$el.find("#hprice1210").val(hp);
				}
				$el.find(".sousuoCli1210").attr("onclick","shopSearch('1210','0')");
				$el.find(".sousuoCli12101").attr("onclick","shopSearch('1210','1')");
				$el.find(".sousuoCli12102").attr("onclick","shopSearch('1210','2')");
				$el.find(".sousuoCli12103").attr("onclick","shopSearch('1210','3')");
			}
	    },
	    init:function($el,opts){
	    	var name = decodeURI(decodeURI(GetQueryString("keyWordSearch")));
	    	var lp = GetQueryString("beginPrice");
	    	var hp = GetQueryString("endPrice");
	    	//获得布局宽度
	    	var wit = $el.closest('.column').width()
	    	var strWit="";
			if("960"==wit&&($el.find(".shop-search-w960").length==0)){
				strWit = strWit + 
				'<form method="post" id="shopSearchForm960" action=""> <input type="hidden" name="shopSearchTitle" value=""/>'
			    +'<input type="hidden" name="shopLowPrice" value=""/><input type="hidden" name="shopHidePrice" value=""/><div class="shop-search shop-search-w960"><div class="srh-fl srh960"><label class="ml10">关键字：</label>'			
				+'<span><input id="shopSearchKeyWord960" name="shopSearch960"  value="" class="searchText w140 ml5" type="text"><label class="ml10 price_show">价格：</label>'
				+'<input class="searchText w40 price_show" type="text" id="lprice960">'
				+'<label class="price_show">&nbsp;-&nbsp;</label><input class="searchText w40 price_show" id="hprice960" type="text"></span>'
				+'<a class="btnBg1 btn4 radius2 ml10 sousuoCli960" onclick="shopSearch(960,0)">搜&nbsp;索</a></div>'
				+'<div class="keyWords keyWords960">'
				+'<span class="item searchkey1 sousuoCli9601" onclick="shopSearch(960,1)">关键词一</span>' 
				+'<span class="item searchkey2 sousuoCli9602" onclick="shopSearch(960,2)">关键词二</span>'
				+'<span class="item searchkey3 sousuoCli9603" onclick="shopSearch(960,3)">关键词三</span>'
				+'</div></div></form>'
			}
			if("960"==wit&&($el.find(".shop-search-w960").length!=0)){
				$el.find("#shopSearchKeyWord960").val(name=="null"?"":name);
				if(lp!=""&&hp!=""){
					$el.find("#lprice960").val(lp>hp?hp:lp);
					$el.find("#hprice960").val(lp>hp?lp:hp);
				}else if(lp!=""){
					$el.find("#lprice960").val(lp);
				}else{
					$el.find("#hprice960").val(hp);
				}
				$el.find(".sousuoCli960").attr("onclick","shopSearch('960','0')");
				$el.find(".sousuoCli9601").attr("onclick","shopSearch('960','1')");
				$el.find(".sousuoCli9602").attr("onclick","shopSearch('960','2')");
				$el.find(".sousuoCli9603").attr("onclick","shopSearch('960','3')");
			}
			if("240"==wit&&($el.find(".shop-search-w240").length==0)){
				strWit = strWit + 
				'<form method="post" id="shopSearchForm240" action=""><input type="hidden" name="shopSearchTitle" value=""/>'
			    +'<input type="hidden" name="shopLowPrice" value=""/><input type="hidden" name="shopHidePrice" value=""/><div  class="shop-search shop-search-w240 related-buy ba fc6"><table><tr><td width="28%" align="right" valign="top">关键字：</td>'
				+'<td width="72%"><input class="searchText w110" name="shopSearch240"  value="" id="shopSearchKeyWord240" type="text"/></td></tr><tr class="price_show"><td align="right" valign="top">价格：</td>'
				+'<td><input type="text" id="lprice240" class="searchText w40" >&nbsp;--&nbsp;'
				+'<input type="text" id="hprice240" class="searchText w40"></td></tr>'
				+'<tr><td align="right" valign="top">&nbsp;</td><td><p class="mt5"><a class="btnBg1 btn4 radius2 sousuoCli240" onclick="shopSearch(240,0)">搜索</a></p></td></tr>'
				+'<tr><td colspan="2"><div class="keyWords keyWords240">'
				+'<span class="item searchkey1 sousuoCli2401" onclick="shopSearch(240,1)">关键词一</span>'
				+'<span class="item searchkey2 sousuoCli2402" onclick="shopSearch(240,2)">关键词二</span>'
				+'<span class="item searchkey3 sousuoCli2403" onclick="shopSearch(240,3)">关键词三</span>'
                +'</div></td></tr></table></div></form>';
			}
			if("240"==wit&&($el.find(".shop-search-w240").length!=0)){
				$el.find("#shopSearchKeyWord240").val(name=="null"?"":name);
				if(lp!=""&&hp!=""){
					$el.find("#lprice240").val(lp>hp?hp:lp);
					$el.find("#hprice240").val(lp>hp?lp:hp);
				}else if(lp!=""){
					$el.find("#lprice240").val(lp);
				}else{
					$el.find("#hprice240").val(hp);
				}
				$el.find(".sousuoCli240").attr("onclick","shopSearch('240','0')");
				$el.find(".sousuoCli2401").attr("onclick","shopSearch('240','1')");
				$el.find(".sousuoCli2402").attr("onclick","shopSearch('240','2')");
				$el.find(".sousuoCli2403").attr("onclick","shopSearch('240','3')");
			}
			if("1210"==wit&&($el.find(".shop-search-w1210").length==0)){
				strWit = strWit + 
				'<form method="post" id="shopSearchForm1210" action=""><input type="hidden" name="shopSearchTitle" value=""/>'
			    +'<input type="hidden" name="shopLowPrice" value=""/><input type="hidden" name="shopHidePrice" value=""/><div class="shop-search shop-search-w1210"><div class="srh-fl srh1210"><label class="ml10">关键字：</label><span>'
				+'<input class="searchText w140 ml5" name="shopSearch1210" value="" id="shopSearchKeyWord1210" type="text"><label class="ml10 price_show">价格：</label>'
				+'<input class="searchText w40 price_show" type="text" id="lprice1210">'
				+'<label class="price_show">&nbsp;-&nbsp;</label><input id="hprice1210" class="searchText w40 price_show" type="text"></span>'
				+'<a class="srhOpt btnBg1 btn4 radius2 ml10 sousuoCli1210" onclick="shopSearch(1210,0)">搜&nbsp;索</a></div>'
				+'<div class="keyWords keyWords1210"><span class="item searchkey1 sousuoCli12101" onclick="shopSearch(1210,1)">关键词一</span><span class="item searchkey2 sousuoCli12102"  onclick="shopSearch(1210,2)">关键词二</span>'
				+'<span class="item searchkey3 sousuoCli12103" onclick="shopSearch(1210,3)">关键词三</span></div></div></form>';
			}
			if("1210"==wit&&($el.find(".shop-search-w1210").length!=0)){
				$el.find("#shopSearchKeyWord1210").val(name=="null"?"":name);
				if(lp!=""&&hp!=""){
					$el.find("#lprice1210").val(lp>hp?hp:lp);
					$el.find("#hprice1210").val(lp>hp?lp:hp);
				}else if(lp!=""){
					$el.find("#lprice1210").val(lp);
				}else{
					$el.find("#hprice1210").val(hp);
				}
				$el.find(".sousuoCli1210").attr("onclick","shopSearch('1210','0')");
				$el.find(".sousuoCli12101").attr("onclick","shopSearch('1210','1')");
				$el.find(".sousuoCli12102").attr("onclick","shopSearch('1210','2')");
				$el.find(".sousuoCli12103").attr("onclick","shopSearch('1210','3')");
			}
			$el.find("#shopsearchdiv").append(strWit);
	    }
	};
    
	$.fn.shopsearch=function(oper,opts){
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

})(jQuery);

//输入的价格校验
function shopSearchNumValidate(opt){
	var valP = opt.value.replace(/[^0-9]+/,'');
	opt.value=valP;
}
//搜索页面转向
function shopSearch(items,kw){
	var keyWord ="";
	var temp = ".keyWords"+items+" .searchkey"+kw;
	if("0"!=kw){
		keyWord =$(temp)[0].innerHTML;
	}else{
		keyWord =$("#shopSearchKeyWord"+items).val();
	}
	$('input[name="shopSearchTitle"]').val(keyWord);
	var lPrice =$("#lprice"+items).val();
	var hPrice =$("#hprice"+items).val();
	var reg = new RegExp("^\\d+(\\.\\d+)?$");  
	if(lPrice!=""&&!reg.test(lPrice)){
		 alert("价格请输入数字!");  
		 return;
	}
	if(hPrice!=""&&!reg.test(hPrice)){
		 alert("价格请输入数字!");  
		 return;
	}
	$('input[name="shopLowPrice"]').val(lPrice);
	$('input[name="shopHidePrice"]').val(hPrice);
	document.getElementById ("shopSearchForm"+items).action = "/shop/"+g_vendid+"/itemList.html?keyWordSearch="+encodeURI(encodeURI(keyWord))+"&beginPrice="+lPrice+"&endPrice="+hPrice;
	document.getElementById ("shopSearchForm"+items).submit();
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
