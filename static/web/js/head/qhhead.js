/**
 * 2013-6-9 孙振重构代码
 */
 
var v6head={
	bspcontent:"v6",
	userId:"",
	userName:"",
	skin:""
};
$(document).ready(function(){
	initHeadDom();
});
function initHeadDom(){	
	var str=[];
	str.push("<div id='headcontainer'>");
	str.push("	<div id='menuandsch'>");
	str.push("    <div id='headmenus'>");
	str.push("    	<div id='mainpage' class='v6menuitem'>");
	str.push("        	<span id='topmenu1' class='v6topmenuicon'></span>");
	str.push("            <span class='v6topmenutext'>首页</span>");
	str.push("            <div style='clear:both'></div>");
	str.push("        </div>");
	str.push("        <div class='v6topmenuline'></div>");
	str.push("        <div id='appCenter' class='v6menuitem'>");
	str.push("        	  <span id='topmenu2' class='v6topmenuicon'></span>");
	str.push("        	  <span id='mymenu'></span>");
	str.push("            <span class='v6topmenutext'>应用</span>");
	str.push("            <span class='v6topmenuarrow'></span>");
	str.push("            <div id='applist' class='appbox'>");
	str.push("            	<div class='bottomInfo'>");
	str.push("            		<span class='menumap'>我的菜单</span>");
	str.push("            	</div>");
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
	str.push("				<div id='knowledgecenter' class='v6app'>");
	str.push("  				<a title='资源中心' class='v6appicon' url=''>");
	str.push("    					<img width='59' height='59' src='/skin/icons/51.png' >");
	str.push("    					</img>");
	str.push(					"资源中心");	
	str.push("  				</a>");
	str.push("				</div>")
	str.push("				<div id='doccenter' class='v6app'>");
	str.push("  				<a title='行业资料' class='v6appicon' url=''>");
	str.push("    					<img width='59' height='59' src='/skin/icons/6.png' >");
	str.push("    					</img>");
	str.push(					"行业资料");	
	str.push("  				</a>");
	str.push("				</div>");
	str.push("				<div id='knowledgeshare' class='v6app'>");
	str.push("  				<a title='知识共享' class='v6appicon' url=''>");
	str.push("    					<img width='59' height='59' src='/skin/icons/52.png' >");
	str.push("    					</img>");
	str.push(					"知识共享");	
	str.push("  				</a>");
	str.push("				</div>")
	str.push("				<div id='positiontool' class='v6app'>");
	str.push("  				<a title='岗位工具箱' class='v6appicon' url=''>");
	str.push("    					<img width='59' height='59' src='/skin/icons/24.png' >");
	str.push("    					</img>");
	str.push(					"岗位工具箱");	
	str.push("  				</a>");
	str.push("				</div>")
	str.push("				<div id='personaldisc' class='v6app'>");
	str.push("  				<a title='个人网盘' class='v6appicon' url=''>");
	str.push("    					<img width='59' height='59' src='/skin/icons/53.png' >");
	str.push("    					</img>");
	str.push(					"个人网盘");	
	str.push("  				</a>");
	str.push("				</div>")
	str.push("            </div>");
	str.push("            <div style='clear:both'></div>");
	str.push("        </div>");
	str.push("        <div class='v6topmenuline'></div>");
	str.push("        <div id='datacenter' class='v6menuitem'>");
	str.push("        	  <span id='topmenu5' class='v6topmenuicon'></span>");
	str.push("        	  <span id='juece'></span>");
	str.push("            <span class='v6topmenutext'>决策</span>");
	str.push("            </div>");
	str.push("            <div style='clear:both'></div>");
	str.push("        </div>");
	str.push("    </div>");
	str.push("    <div id='v6searchbox'>");
	str.push("    	<input id='v6searchtext' type='text'style='height:19px'/>");
	str.push("        <div id='v6searchbtn'></div>");
	str.push("    </div>");
	str.push("    <div id='headmsg'>消息<span id='headmsgspan'></span>");
	str.push("    	<ul>");
	str.push("    		<li id='contactme'>查看@我(<span id='headatme' style='color:red'>0</span>)</li>");
	str.push("    		<li id='personalmsg'>查看私信(<span id='headsime' style='color:red'>0</span>)</li>");
	str.push("    		<li id='undo'>待办任务(<span id='undonum' style='color:red'>0</span>)</li>");
	str.push("    		<li id='busimsg'>业务消息(<span id='busimsgnum' style='color:red'>0</span>)</li>");
	str.push("    		<li id='comAnnouncement'>公司通告(<span id='comAnnouncementNum' style='color:red'>0</span>)</li>");
	str.push("    		<li id='selfMail'>个人信件&nbsp;&nbsp;&nbsp;</li>");	
	str.push("    	</ul>");
	str.push("    </div>");
	str.push("    <div id='headoptionbtn'><span id='headUserName'>账号</span>");
	str.push("    	<ul>");
	str.push("    		<li id='setpassword'>修改密码</li>");
	str.push("    	</ul>");
	str.push("    </div>");
	str.push("    <div id='logoutdiv'>退出</div>");
	str.push("    <div style='clear:both'></div>");
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
	
	$("#headholder").html(str.join(""));
	
	var topUrl = "/"+v6head.bspcontent+"/topMenuQuery.cmd";
	var topMenuStr=[];
	$.ajax({
		  type: "post",
		  url:topUrl,
		  beforeSend: function(XMLHttpRequest){			
		  	$("#applist").append("<div id='loading'>正在加载...请稍后</div>");
		  },
		  success: function(data, textStatus){
			var topMenuJson;
			try{
				topMenuJson=eval("("+data+")");
			}catch(e){
				headLoadDataFromBspOnError();
			}
			var topMenus=topMenuJson.menu.rows;
			for(var i=0;i<topMenus.length;i++){
				var menu=topMenus[i];
				var id=menu.id;
				var appCode=menu.appCode;
				//alert("appCode"+appCode);
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
				topMenuStr.push("<div class='v6app business' appCode='"+id+"' appId='"+appCode+"' appTarget='"+target+"' appUrl='"+url+"' appIcon='"+icon+"' appText='"+text+"'>" );
				topMenuStr.push("  <a title='"+text+"' class='v6appicon'>");
				topMenuStr.push("    <img width='59' height='59' src='"+icon+"' onerror='noicon();'>");
				topMenuStr.push("    </img>");
				topMenuStr.push(menu.text);	
				topMenuStr.push("  </a>");
				topMenuStr.push("</div>");
			}
		  },
		  complete: function(XMLHttpRequest, textStatus){
			  $("#loading").remove();
			  $("#applist").append(topMenuStr.join(""));
			  	for(one in Events){
					Events[one]();
				}
		  },
		  error: function(xhr){
			  headLoadDataFromBspOnError();
		  }
	  });
	
}

var Events={
	//获取cookie中skin的样式
	getSkin:function(){
		v6head.skin=getCookie("skin");
	},
	//计算apps容器的宽
	fixAppBoxWidth:function(){
		$(".appbox").each(function(i){
			var $this=$(this);
			var num=$this.find(".v6app").size();
			var w=90;
			if(num<8){
				w=num*90;
			}else{
				w=720;
			}
			if(num==1){
				$this.css({"left":"-1px"});
				w=97;
			}
			$this.width(w);
		})
	},
	//为app添加事件
	app:function(){
		$(".v6app.business").click(function(){
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
			if(appType=="1"){//V6应用
				var open=$("#mt-menu").size()==0?false:true;//找一下应用中心的mt-menu标签，以判断应用中心是否已经打开了
				var supbrowser=$("#supbrowser").size()==0?false:true;//找一下应用中心的supbrowser标签，以判断当前是否是降浏览器版本访问模式
				if(appUrl==null){
					appUrl="";
				}
				if(appUrl.indexOf("supbrowser")==-1&&open&&!supbrowser){
					var opts={
						appId:appId,
						appCode:appCode,
						appType:appType,
						appIcon:appIcon,
						appText:appText,
						appUrl:appUrl
					}
					AppFrame.init(opts);//调用dcframe.js中的方法,以实现局部刷新
				}else{
					document.forms[0].action="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit";
					$("#v6_app_id").val(appId);
					$("#v6_app_code").val(appCode);
					$("#v6_app_url").val(appUrl);
					$("#v6_app_type").val(appType);
					$("#v6_app_icon").val(appIcon);
					$("#v6_app_text").val(appText);
					document.forms[0].submit();
				}
			}else if(appType=="2"||appType=="4"){//楼上3应用
				document.forms[0].action="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit";
				$("#v6_app_id").val(appId);
				$("#v6_app_code").val(appCode);
				//alert("appType==2"+appCode);
				$("#v6_app_url").val(appUrl);
				$("#v6_app_type").val(appType);
				$("#v6_app_icon").val(appIcon);
				$("#v6_app_text").val(appText);
				document.forms[0].submit();
			}else if(appType=="3"){//其他单点登录应用
			var url="/portal/AuthenService" + "?USERID=" + v6head.userId + "&APP="+ appId + "&sampleSSO=1";
			window.open(url);
			}
		})
	},
		topMenu:function(){
		var t;
		var current;
		$(".v6menuitem").hover(function(){
			var $this=$(this);
			var id=$this.attr("id");
			if(id==current){
				clearTimeout(t);
			}else{
				current=id;
			}
			$this.addClass("active");
			$(".appbox",$this).show();
		},function(){
			var $this=$(this);
			t=setTimeout(function(){
				$this.removeClass("active");
				$(".appbox",$this).hide();
			},200);
		})
	},
	//为我的应用添加事件
	myMenu:function(){
		$("#mymenu,.menumap").click(function(){
			document.forms[0].action="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&menuId=menuMap";
			$("#v6_app_id").val("mymenu");
			$("#v6_app_code").val("mymenu");
			$("#v6_app_type").val("mymenu");
			$("#v6_app_icon").val("/skin/icons/32.png");
			$("#v6_app_text").val("我的应用");
			document.forms[0].submit();
		})
	},
	//为其他应用添加事件
	otherApp:function(){
		//首页
		$("#mainpage").click(function(){	
			var url="/portal/portal/pwsqh.cmd?method=goHomePage";
			$.ajax({
				  type: "post",
				  url:"/portal/pubdatacmd.cmd?method=mainPageUrl",
				  beforeSend: function(XMLHttpRequest){ 
				  },
				  dataType: "text",
				  success: function( data, textStatus){				  	
					  if(data!="error"){
						  url=data;
					  }
				  },
				  complete:function(){			  	
					  window.location.href=url;
				  },
				  error:function(){
					  window.location.href=url;
				  }
			 })
			 
			
		})
		//个人空间
		$("#myspace").click(function(){
			window.location.href="/sns/index.php?app=home&mod=User&act=index";
		})
		//团队空间
		$("#groupspace").click(function(){
			window.location.href="/sns/index.php?app=group&mod=SomeOne&act=index";
		})
		//资源中心
		$("#knowledgecenter").click(function(){
			window.location.href="/doc";
		})
		//知识库
		$("#knowledgeshare").click(function(){
			window.location.href="/doc/index.php?r=/rc/comkownlege";
		})
		//岗位工具箱
		$("#positiontool").click(function(){
			window.location.href="/doc/index.php?r=/postbox/mainpagead";
		})
		//行业文档库
		$("#doccenter").click(function(){
			window.location.href="/doc/index.php?r=/rc/resources";
		})
		//个人网盘
		$("#personaldisc").click(function(){
			window.location.href="/doc/index.php?r=/home";
		})
		//决策中心
		$("#datacenter").click(function(){
			window.open("/datacenter/jsp/com/v6/screen/bi/qh/menubar/menubar.jsp");
		})
	},
	//消息相关按钮
	msgBtn:function(){
		//@我的
		$("#contactme").click(function(){
	 	 	window.location.href="/sns/index.php?app=home&mod=user&act=atme";
 		});
		//私信
		$("#personalmsg").click(function(){
			var url="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&appType=record&menuId=base_noticereciever&menuText=消息管理&menuUrl=/base/notice/noticereciever_query_init.cmd";
			window.location.href=url;
		});
				//待办任务
		$("#undo").click(function(){
			window.location.href="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&appType=record&menuId=000000000000000000000000005212&menuText=任务列表&menuUrl=/bpm/command/dispatcher/org.loushang.bwf.api.BizTaskListCmd/getDaibanByPage";
		});
		//业务消息
		$("#busimsg").click(function(){
			window.location.href="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&appType=record&menuId=busimsg0001&menuText=业务消息&menuUrl=/base/base/putmsg/putmsg_page_init.cmd";
		});
		//个人信件
		$("#selfMail").click(function(){
			window.open("/base/mail/personMail.cmd?method=getFrame");		
		});
		//公司通告
		$("#comAnnouncement").click(function(){
			window.location.href="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&appType=record&menuId=000000000000000000000000007602&menuText=公司通告&menuUrl=/base/base/announcementl/ann_show_query_init.cmd";
		});

	},
	loginOut:function(){
		$("#logoutdiv").click(function(){
			document.location.href="/"+v6head.bspcontent+"/logout";
		})
	},
	setPassWord:function(){
		$("#setpassword").click(function(){
			window.open("/"+v6head.bspcontent+"/jsp/bsp/user/user_passwordmgt.jsp");
		})
	},
	logoHelp:function(){
		$("#v6headlogo").click(function(){
			document.location.href="/portal/jsp/help/help.html";
		})
	},
	getUserInfo:function(){
		var v6u=getCookie("v6u");
		var b = new Base64();
		var userInfo=[];
		try{
			userInfo=b.decode(v6u).split("#");
		}catch(e){
			headLoadDataFromBspOnError();
		}
		
		v6head.userId=userInfo[0];
		v6head.userName=userInfo[1];
		if(v6head.userName){
			$("#headUserName").text(v6head.userName);
		}
	},
	//搜索
	search:function(){
		$("#v6searchbtn").click(function(){
			 var searchText=$("#v6searchtext").val();
			 var textAfterEnCode = encodeURIComponent(searchText);
			 var b = new Base64();
			 var userIdAfterEncode = b.encode(v6head.userId);
			 var url="/sch/all.jsp?q="+textAfterEnCode+"&version=2.2&start=0&rows=10&userId="+userIdAfterEncode+"&type=0";
			 window.location.href=url;
		})
		$("#v6searchtext").keypress(function(e){
			  var ev= window.event||e;
			  if (ev.keyCode == 13) {
			  	$("#v6searchbtn").click();
			  }
		})
	},
	getNotice:function(){
		for(var one in headNoticeObj){
			headNoticeObj[one]();
		}
		setInterval(function(){
			for(var one in headNoticeObj){
				headNoticeObj[one]();
			}
		},3600000);
	},
	headLayoutCenter:function(){
		$("#menuandsch").css("margin-left",function(){
			var windowWidth=$(window).width();
			var myWidth=$(this).width();
			return (windowWidth-myWidth)/2-148;
		})
	},
	headOptionBtnLayOut:function(){
		$("#headoptionbtn ul").css("left",function(){
			var aWidth=$("#headUserName").width();
			var bWidth=$("#headoptionbtn ul").width();
			return aWidth-bWidth+9;
		})
	}
}
var headNoticeObj={
			noticeData:function(){
			$.ajax({
			  type: "post",
			  url:"/portal/portal/appCenterInitCmd.cmd?method=queryMsg",
			  beforeSend: function(XMLHttpRequest){
			  },
			  success: function(data, textStatus){
				  var obj="";
				  try{
					  obj=eval("("+data+")");  
				  }catch(e){
					  
				  }
				   if(obj.msgs>0){ 
				   		$("#headmsgspan").html("<img src='/skin/"+v6head.skin+"/head/imgs/hong.png'/>");
				  		$("#headsime").html(obj.msgs);
				   }
			  },
			  complete: function(XMLHttpRequest, textStatus){
			  },
			  error: function(xhr){
			  }
		  	});
		},
		//获取at我的信息个数
		atmeData:function(){
			$.ajax({
			  type: "post",
			  url:"/portal/portal/appCenterInitCmd.cmd?method=queryMsg",
			  beforeSend: function(XMLHttpRequest){
			  },
			  success: function(data, textStatus){
				  var obj="";
				  try{
					  obj=eval("("+data+")");  
				  }catch(e){
					  
				  }
				   if(obj.msgs>0){ 
				   		$("#headmsgspan").html("<img src='/skin/"+v6head.skin+"/head/imgs/hong.png'/>");
				  		$("#headsime").html(obj.msgs);
				   }
			  },
			  complete: function(XMLHttpRequest, textStatus){
			  },
			  error: function(xhr){
			  }
		  	});
		},
		getUnDoData:function(){
			$.ajax({
			  type: "post",
			  url:"/portal/portal/appCenterInitCmd.cmd?method=queryDaiban",
			  beforeSend: function(XMLHttpRequest){
			  },
			  success: function(data, textStatus){
				  var obj="";
				  try{
					  obj=eval("("+data+")");  
				  }catch(e){
					  
				  }
				   if(obj.daiban>0){ 
						$("#headmsgspan").html("<img src='/skin/"+v6head.skin+"/head/imgs/hong.png'/>");
						$("#undonum").html(obj.daiban);
				   }
			  },
			  complete: function(XMLHttpRequest, textStatus){
			  },
			  error: function(xhr){
			  }
	  		});
		},
		//获取业务消息
		getUnDoData:function(){
			$.ajax({
			  type: "post",
			  url:"/portal/portal/appCenterInitCmd.cmd?method=queryBusimsg",
			  beforeSend: function(XMLHttpRequest){
			  },
			  success: function(data, textStatus){
				  var obj="";
				  try{
					  obj=eval("("+data+")");  
				  }catch(e){
					  
				  }
				   if(obj.number>0){ 
						$("#headmsgspan").html("<img src='/skin/"+v6head.skin+"/head/imgs/hong.png'/>");
						$("#busimsgnum").html(obj.number);
				   }
			  },
			  complete: function(XMLHttpRequest, textStatus){
			  },
			  error: function(xhr){
			  }
	  		});
		},
		//未读公司通告数
		getUnReadAnnouncement:function(){
			$.ajax({
			  type: "post",
			  url:"/portal/portal/appCenterInitCmd.cmd?method=queryComAnnouncement",
			  beforeSend: function(XMLHttpRequest){
			  },
			  success: function(data, textStatus){
				  var obj="";
				  try{
					  obj=eval("("+data+")");  
				  }catch(e){					  
				  }
				  if(obj.number>0){ 				   
						$("#headmsgspan").html("<img src='/skin/"+v6head.skin+"/head/imgs/hong.png'/>");
						$("#comAnnouncementNum").html(obj.number);
				  }
			  },
			  complete: function(XMLHttpRequest, textStatus){
			  },
			  error: function(xhr){
			  }
	  		});
		}
};


function headLoadDataFromBspOnError(){

	
}

function changeAppNoFlush(appId,appCode,appUrl,appIcon,appText){
	
}

function noicon(){
	var img=event.srcElement;
	img.src="/skin/icons/1.png";
	img.onerror=null;
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

