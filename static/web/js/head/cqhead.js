// JavaScript Document
var bspcontent="v6";//bsp应用上下文
var apacheAddr="http://10.11.2.51";
var userId="";
var userName="";
var str=[];
str.push("<div id='headcontainer'>");
str.push("	<div id='menuandsch'>");
str.push("	<div id='v6headlogo'></div>");
str.push("    <div id='headmenus'>");
str.push("    	<div id='mainpage' class='v6menuitem'>");
str.push("        	<span id='topmenu1' class='v6topmenuicon'></span>");
str.push("            <span class='v6topmenutext'>首页</span>");
str.push("            <div style='clear:both'></div>");
str.push("        </div>");
str.push("        <div class='v6topmenuline'></div>");
str.push("        <div class='v6menuitem'>");
str.push("        	  <span id='topmenu2' class='v6topmenuicon'></span>");
str.push("        	  <span id='mymenu'></span>");
str.push("            <span class='v6topmenutext'>应用</span>");
str.push("            <span class='v6topmenuarrow'></span>");
str.push("            <div id='applist' class='appbox'>");
str.push("            </div>");
str.push("            <div style='clear:both'></div>");
str.push("        </div>");
str.push("        <div class='v6topmenuline'></div>");
str.push("        <div id='cooperation' class='v6menuitem'>");
str.push("        	<span id='topmenu3' class='v6topmenuicon'></span>");
str.push("            <span class='v6topmenutext'>协作</span>");
str.push("            <span class='v6topmenuarrow'></span>");
str.push("            <div class='appbox'>");
str.push("				<div class='v6app' id='myspace'>");
str.push("  				<a title='个人空间' class='v6appicon' url=''>");
str.push("    					<img width='59' height='59' src='/skin/icons/41.png' >");
str.push("    					</img>");
str.push(					"个人空间");	
str.push("  				</a>");
str.push("				</div>");
str.push("				<div class='v6app' id='groupspace'>");
str.push("  				<a title='团队空间' class='v6appicon' url=''>");
str.push("    					<img width='59' height='59' src='/skin/icons/42.png' >");
str.push("    					</img>");
str.push(					"团队空间");	
str.push("  				</a>");
str.push("				</div>")
str.push("            </div>");
str.push("            <div style='clear:both'></div>");
str.push("        </div>");
str.push("        <div class='v6topmenuline'></div>");
str.push("        <div id='resource' class='v6menuitem'>");
str.push("        	<span id='topmenu4' class='v6topmenuicon'></span>");
str.push("            <span class='v6topmenutext'>资源</span>");
str.push("            <span class='v6topmenuarrow'></span>");
str.push("            <div class='appbox'>");
str.push("				<div id='doccenter' class='v6app'>");
str.push("  				<a title='文档中心' class='v6appicon' url=''>");
str.push("    					<img width='59' height='59' src='/skin/icons/51.png' >");
str.push("    					</img>");
str.push(					"文档中心");	
str.push("  				</a>");
str.push("				</div>");
str.push("				<div id='reportcenter' class='v6app'>");
str.push("  				<a title='报表中心' class='v6appicon' url=''>");
str.push("    					<img width='59' height='59' src='/skin/icons/54.png' >");
str.push("    					</img>");
str.push(					"报表中心");	
str.push("  				</a>");
str.push("				</div>")
str.push("            </div>");
str.push("            <div style='clear:both'></div>");
str.push("        </div>");
str.push("        <div class='v6topmenuline'></div>");
str.push("        <div id='manageandcontorl' class='v6menuitem'>");
str.push("        	<span id='topmenu5' class='v6topmenuicon'></span>");
str.push("            <span class='v6topmenutext'>管控</span>");
str.push("            <span class='v6topmenuarrow'></span>");
str.push("            <div class='appbox'>");
str.push("				<div id='decisioncenter' class='v6app'>");
str.push("  				<a title='决策中心' class='v6appicon' url=''>");
str.push("    					<img width='59' height='59' src='/skin/icons/51.png' >");
str.push("    					</img>");
str.push(					"决策中心");	
str.push("  				</a>");
str.push("				</div>");
str.push("				<div id='monitorcenter' class='v6app'>");
str.push("  				<a title='监控中心' class='v6appicon' url=''>");
str.push("    					<img width='59' height='59' src='/skin/icons/54.png' >");
str.push("    					</img>");
str.push(					"监控中心");	
str.push("  				</a>");
str.push("				</div>")
str.push("            </div>");
str.push("            <div style='clear:both'></div>");
str.push("        </div>");
str.push("    </div>");
str.push("    <div id='logoutdiv'>退出</div>");
str.push("    <div id='headoptionbtn'>账号");
str.push("    	<ul>");
str.push("    		<li id='setpassword'>修改密码</li>");
str.push("    	</ul>");
str.push("    </div>");
str.push("    <div id='headmsg'>消息<span id='headmsgspan'></span>");
str.push("    	<ul>");
str.push("    		<li id='contactme'>查看@我(<span id='headatme' style='color:red'>0</span>)</li>");
str.push("    		<li id='personalmsg'>查看私信(<span id='headsime' style='color:red'>0</span>)</li>");
str.push("    	</ul>");
str.push("    	</div>");
str.push("    <div id='v6searchbox'>");
str.push("    	<input id='v6searchtext' type='text'style='height:19px' onkeydown='keyDown(event)'  />");
str.push("        <div id='v6searchbtn'></div>");
str.push("    </div>");
str.push(" </div>");
str.push("</div>");

str.push("<form name='v6_app_form' method='post'>");
str.push("<input id='v6_app_id' name='v6_app_id' type='hidden' value='' />");
str.push("<input id='v6_app_code' name='v6_app_code' type='hidden' value='' />");
str.push("<input id='v6_app_url' name='v6_app_url' type='hidden' value='' />");
str.push("<input id='v6_app_type' name='v6_app_type' type='hidden' value='' />");
str.push("<input id='v6_app_icon' name='v6_app_icon' type='hidden' value='' />");
str.push("<input id='v6_app_text' name='v6_app_text' type='hidden' value='' />");
str.push("</form>");
$(document).ready(function(){
	$("#headholder").html(str.join(""));
	
	var topUrl = "/"+bspcontent+"/topMenuQuery.cmd";
	var topMenuStr=[];
	$.ajax({
		  type: "post",
		  url:topUrl,
		  beforeSend: function(XMLHttpRequest){
			$("#applist").html("正在加载...请稍后");
		  },
		  success: function(data, textStatus){
			var topMenuJson=eval("("+data+")");
			var topMenus=topMenuJson.menu.rows;
			for(var i=0;i<topMenus.length;i++){
				var menu=topMenus[i];
				var id=menu.id;
				var appCode=menu.appCode;
				if(appCode=="portal"){
					continue;
				}
				var target=menu.target;
				var text=menu.text;
				var url=menu.url;
				var icon=menu.icon;
				if(id=='BSPV601'){
					icon="/skin/icons/32.png";
				}
				topMenuStr.push("<div class='v6app bsp' appId='"+appCode+"' appCode='"+id+"' appTarget='"+target+"' appUrl='"+url+"' appIcon='"+icon+"' appText='"+text+"'>" );
				topMenuStr.push("  <a title='"+text+"' class='v6appicon'>");
				topMenuStr.push("    <img width='59' height='59' src='"+icon+"'  onerror='noicon();'>");
				topMenuStr.push("    </img>");
				topMenuStr.push(menu.text);	
				topMenuStr.push("  </a>");
				topMenuStr.push("</div>");
			}
		  },
		  complete: function(XMLHttpRequest, textStatus){
			  $("#applist").html(topMenuStr.join(""));
			  init();
		  },
		  error: function(xhr){
			  
		  }
	  });
	  
})

function noicon(){
	var img=event.srcElement;
	img.src="/skin/icons/1.png";
	img.onerror=null;
}
function init(){
	//从cookie中获取用户的信息
	getUserInfo();
	//根据appbox里应用的数量，计算appbox的宽度
	fixAppBoxWidth();
	//为应用添加事件
	addEventForApp();
	//为导航条上的按钮添加事件
	addEventForTopBar();
	initMsg();
}
function initMsg(){
	//initSX();
	//initWB();
}
function initSX(){
		$.ajax({
		  type: "post",
		  url:"/portal/portal/appCenterInitCmd.cmd?method=queryMsg",
		  beforeSend: function(XMLHttpRequest){
		  },
		  success: function(data, textStatus){
			  var obj=eval("("+data+")");
			   if(obj.msgs>0){ 
			   	$("#headmsgspan").html("<img src='/skin/skin2/head/imgs/hong.png'/>");
			  	$("#headsime").html(obj.msgs);
			   	}
		  },
		  complete: function(XMLHttpRequest, textStatus){
		  },
		  error: function(xhr){
		  }
	  });
	}
		function initWB(){
		$.ajax({
		  type: "post",
		  url:"/sns/index.php?app=home&mod=user&act=forCount",
		  beforeSend: function(XMLHttpRequest){
		  },
		  success: function(data, textStatus){
			  var obj=eval("("+data+")");
			   if(obj.atme>0){ 
			   	$("#headmsgspan").html("<img src='/skin/skin2/head/imgs/hong.png'/>");
			  	$("#headatme").html(obj.atme);
			   	}
		  },
		  complete: function(XMLHttpRequest, textStatus){
		  },
		  error: function(xhr){
		  }
	  });
	}

function fixAppBoxWidth(){
	$(".appbox").each(function(i){
		var $this=$(this);
		var num=$this.find(".v6app").size();
		var w=100;
		if(num<6){
			w=num*100;
		}else{
			w=600;
		}
		$this.width(w);
	})
}
function addEventForApp(){
	$(".v6app.bsp").click(function(){
		var appId=$(this).attr("appId");
		var appCode=$(this).attr("appCode");
		var appUrl=$(this).attr("appUrl");
		var appTarget=$(this).attr("target");
		var appIcon=$(this).attr("appIcon");
		var appText=$(this).attr("appText");
		var appType="1";
		//从URL中获取appType的值
		if(appUrl!='/'&&appUrl!=null&&appUrl.indexOf("appType")!=-1){
			appType=appUrl.substr(appUrl.indexOf("appType")+8,1);
		} 
		if(appType=="1"||appType=="2"){//V6应用||楼上3应用
			document.forms[0].action="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit";
			$("#v6_app_id").val(appId);
			$("#v6_app_code").val(appCode);
			$("#v6_app_url").val(appUrl);
			$("#v6_app_type").val(appType);
			$("#v6_app_icon").val(appIcon);
			$("#v6_app_text").val(appText);
			document.forms[0].submit();
		}else if(appType=="3"){//其他单点登录应用
			var url="/portal/AuthenService" + "?USERID=" + userId + "&APP="+ appId + "&sampleSSO=1&IsAuthenNew=1";
			window.open(url);
		}
	})
}
function addEventForTopBar(){
	$("#mymenu").click(function(){
		document.forms[0].action="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit";
		$("#v6_app_id").val("mymenu");
		$("#v6_app_code").val("mymenu");
		$("#v6_app_type").val("mymenu");
		$("#v6_app_icon").val("/skin/icons/32.png");
		$("#v6_app_text").val("我的应用");
		document.forms[0].submit();
	})
  	$("#contactme").click(function(){
  		window.location.href('/sns/index.php?app=home&mod=user&act=atme');
  	})
	$("#personalmsg").click(function(){
	window.location.href('/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&appType=record&menuId=func_message&text=消息管理&menuUrl=http://10.10.10.67/base/base/message_query_init.cmd');
	})
	$("#mainpage").click(function(){
		window.location.href="/portal/portal/pwscq.cmd?method=queryPage";
	})
	$("#myspace").click(function(){
		window.location.href="/sns/index.php?app=home&mod=User&act=index";
	})
	$("#groupspace").click(function(){
		window.location.href="/sns/index.php?app=group&mod=SomeOne&act=index";
	})
	$("#knowledgecenter").click(function(){
		window.location.href="/doc";
	})
	$("#doccenter").click(function(){
		window.location.href="/doc/index.php/rc";
	})
	$("#reportcenter").click(function(){
		var url=apacheAddr+"/d3/cqreportcentercmd.cmd?method=querynew|sid="+userId;
		url = "/portal/AuthenService?USERID=" + userId + "&APP=1&RESOURCE=" + url+ "&IsAuthenNew=1";
		window.location.href=url;
	})
	$("#decisioncenter").click(function(){
		alert("尚未就绪");
	})
	$("#monitorcenter").click(function(){
		alert("尚未就绪");
	})
	


	$("#v6searchbtn").click(function(){
		 var searchText=$("#v6searchtext").val();
		 var textAfterEnCode = encodeURIComponent(searchText);
		 var b = new Base64();
		 var userIdAfterEncode = b.encode(userId);
		 var url="/sch/all.jsp?q="+textAfterEnCode+"&version=2.2&start=0&rows=10&userId="+userIdAfterEncode+"&type=0";
		 window.location.href=url;
	})
   	
	$("#setpassword").click(function(){
		window.open("/"+bspcontent+"/jsp/bsp/user/user_passwordmgt.jsp");
	})
	$("#logoutdiv").click(function(){
		document.location.href="/"+bspcontent+"/logout";
	})
	$("#v6headlogo").click(function(){
		document.location.href="/portal/jsp/help/help.html";
	})

}
function keyDown(e) {
  var ev= window.event||e;

//13是键盘上面固定的回车键
  if (ev.keyCode == 13) {
  $("#v6searchbtn").click();
  }
 }
function getUserInfo(){
	var v6u=getCookie("v6u");
	var b = new Base64();
	var userInfo=b.decode(v6u).split("#");
	userId=userInfo[0];
}

//读取cookie
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
}



//base64解码
function Base64() {
 
	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
 
	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
 
	// private method for UTF-8 encoding
	_utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
		return utftext;
	}
 
	// private method for UTF-8 decoding
	_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

