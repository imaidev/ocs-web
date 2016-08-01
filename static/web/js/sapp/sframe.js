$(document).ready(function(){
	var TabObj=function(){
		function getTabId(menuId){
			return "tab-"+menuId;
		}
		var Events={
			closeTab:function(){
				$("#tab-list").on("click",".close",function(event){
					var tab=$(this).closest(".tab")
					var menuId=tab.attr("menuId");
					if(tab.hasClass("current")){
						tab.prev().click();
					};
					tab.remove();
					iframeObj.removeIframe(menuId);
					event.stopPropagation();
				})
			},
			tabClick:function(){
				$("#tab-list").on("click",".tab",function(){
					var $this=$(this);
					if($this.is("#tabManage")){
						return;
					}
					$this.addClass("current").siblings(".tab").removeClass("current");
					var menuId=$this.attr("menuId");
					iframeObj.setActive(menuId);
				})
			},
			closeAll:function(){
				$("#tabCloseAll").click(function(){
					tabObj.closeAllTab();
				})
			},
			closeCurrent:function(){
				$("#tabCloseCur").click(function(){
					tabObj.closeTab();
				})
			},
			refreshCurrent:function(){
				$("#tabRefCur").click(function(){
					var current=$("#tab-list").find(".tab.current");
					var menuId=current.attr("menuId");
					iframeObj.refreshIframe(menuId);
				})
				
			}
		}
		return {
			init:function(menuId){
				var tab="<div class='tab mainPage current' id='"+getTabId(menuId)+"' menuId='"+menuId+"'>";
				tab+="<div class='text'>首页</div>";
				$("#tab-list #tabManage").before(tab);
				for(one in Events){
					Events[one]();
				}
			},
			newTab:function(menuId,text){
				$("#tab-list").find(".tab").removeClass("current");
				var tab="<div class='tab current' id='"+getTabId(menuId)+"' menuId='"+menuId+"'>";
				tab+="<div class='text'>"+text+"</div>";
				tab+="<div class='close'></div>";
				tab+="</div>";
				var tabs=$("#tab-list").find(".tab").not(".mainPage").not("#tabManage");
				if(tabs.size()>5){
					var tabFirst=tabs.eq(0);
					tabFirst.remove();
					var menuId=tabFirst.attr("menuId");
					iframeObj.removeIframe(menuId);
				}
				$("#tab-list #tabManage").before(tab);
			},
			closeTab:function(){
				var current=$("#tab-list").find(".tab.current").not(".mainPage");
				current.prev().click();
				current.remove();
				iframeObj.removeIframe(current.attr("menuId"));
				
			},
			closeAllTab:function(){
				$("#tab-list").find(".tab").not(".mainPage").not("#tabManage").remove();
				$("#tab-list").find(".mainPage").click();
			}
		}
	}
	
	var IframeObj=function(){
		function getIframeId(menuId){
			return "i-"+menuId;
		}
		function createIframe(iframeId,menuUrl){
			$("<iframe></iframe>").addClass("content-iframe").attr({
				"id" : iframeId,
				"frameborder" : "no",
				"allowTransparency" : "true",
				"scrolling" : "auto",
				"marginwidth" : "0",
				"marginheight" : "0",
				"height":getIframeHeight()+"px",
				"src" : menuUrl
			}).appendTo($("#mainframe"));
		}
		return {
			init:function(menuId,menuUrl){
				var iframeId=getIframeId(menuId);
				createIframe(iframeId,menuUrl)
			},
			newIframe:function(menuId,menuUrl){
				var iframeId=getIframeId(menuId);
				var targetIframe=$("#"+iframeId);
				$(".content-iframe").hide();
				if(targetIframe.size()>0){
					targetIframe.show();
				}else{
					createIframe(iframeId,menuUrl)
				}
				
			},
			setActive:function(menuId){
				var targetIframe=$("#"+getIframeId(menuId));
				$(".content-iframe").hide();
				targetIframe.show();
			},
			refreshIframe:function(menuId){
				var targetIframe=$("#"+getIframeId(menuId));
				targetIframe.attr("src",targetIframe.attr("src"));
			},
			removeIframe:function(menuId){
				var targetIframe=$("#"+getIframeId(menuId));
				targetIframe.remove();
			}
		}
	}
	
		


	var t,AppEvents={
			bindAppListEvent:function(){
				$("#app-list").mouseleave(function(){
					t=setTimeout(function(){
						if($.browser.msie && ($.browser.version >= 9)){
								$("#menubox").hide(200);
							}else{
								$("#menubox").hide();
						}
					},300)
				}).mouseenter(function(){
					clearTimeout(t);
				})
			},
			bindAppMouseEnterEvent:function(){
				$(".app").mouseenter(function(){
					var $this=$(this);
					$this.addClass("current").siblings(".app").removeClass("current");
					if($.browser.msie && ($.browser.version >= 9)){
						$("#menubox").show(200);
					}else{
						$("#menubox").show();
					}
					menuObj.init($this.attr("id"));
				})
			},
			bingAppClickEvent:function(){
				$(".app").click(function(){
					var $this=$(this);
					$this.addClass("current").siblings(".app").removeClass("current");
					var fixed=$this.hasClass("fixed");
					if(fixed){
						$(".menuFixed").removeClass("menuFixed").addClass("menuFloat");
						$this.removeClass("fixed");
						AppEvents.bindAppMouseEnterEvent();
						AppEvents.bindAppListEvent();
					}else{
						$(".menuFloat").removeClass("menuFloat").addClass("menuFixed");
						$this.addClass("fixed").siblings(".app").removeClass("fixed");
						$(".app").unbind("mouseenter");
						$("#app-list").unbind("mouseleave").unbind("mouseenter")
					}
					menuObj.init($this.attr("id"));
				})
			},
			appScroll:function(){
				var windowHeight=$(window).height();
				var visible=windowHeight>615?5:4;
				$(".carousel").jCarouselLite({
					   btnNext: ".next",
					   btnPrev: ".prev",
					   vertical: true,
					   circular: false,
					   visible: visible,
					   scroll: 2,
					   mouseWheel:true
				});
			}
		}
	
	var _appId, menuObj={
		init:function(appId){
			if(appId==_appId){
				return;
			}else{
				_appId=appId;
			}
			var setting = {
				view: {
					removeHoverDom: menuObj.removeHoverDom,
					addHoverDom: menuObj.addHoverDom,
					addDiyDom: menuObj.addDiyDom
					
				},
				callback: {
					onClick:menuObj.menuClick,
					onCollapse:menuObj.ztreeOnCollapse,
					onExpand:menuObj.ztreeOnExpand,
					beforeExpand:menuObj.ztreeBeforeExpand
				}
			};
			$.post("/"+config.bspCtx+"/subMenuQuery.cmd?pId="+appId,function(data){
				var menuJson;
				try{
					menuJson=eval("("+data+")").menu.rows;
				}catch(e){
					alert("系统会话已失效，请重新登录!");
					return ;
				}
				menuObj.initleftMenuByZtreeType(menuJson, 0);
				var zNodes=menuJson;
				$.fn.zTree.init($("#menutree"), setting, zNodes);
				menuObj.fixZtreeHeight();
				menuObj.initScrollBar();
				
			})
			
		},
		menuClick:function(event,treeId, treeNode){
			var $target=$(event.target);
			if("children" in treeNode && treeNode.children!=''){
				var zTree = $.fn.zTree.getZTreeObj("menutree");
				zTree.expandNode(treeNode,null,null,null,true);
				// 下面的这个分支解决了收藏菜单为空是异常跳转的问题
			}else if("children" in treeNode && treeNode.children.length == 0 && (!treeNode.isLeaf || "false"==treeNode.isLeaf)){
				return;
			} else{
				$("#menutree.ztree a.active").removeClass("active");
				$("#"+treeNode.tId+"_a").addClass("active");
				var menuId = treeNode.id;
				var url = treeNode.menuUrl;
				var target = treeNode.target;
				var text = treeNode.name;
				if(!url){
					return false;
				}
				menuObj.showScreen(menuId, url, target, text);
				// 使用记录
				$.ajax({
					type : "post",
					url : "/portal/portal/appCenterInitCmd.cmd?method=insertRecord",
					data : {
						menuId : menuId,
						menuUrl : url,
						menuName : text,
						appType : '9'
					}
				});
			}
		},
		addHoverDom:function(treeId, treeNode){
		},
		removeHoverDom:function(treeId, treeNode){
		},
		addDiyDom:function(treeId, treeNode){
			if(treeNode.getParentNode()==null){
				var switchObj = $("#" + treeNode.tId + "_switch"),
				icoObj = $("#" + treeNode.tId + "_ico"),
				spanObj = $("#" + treeNode.tId + "_span");
				switchObj.remove();
				icoObj.before(switchObj);
				spanObj.addClass("menu_span");
			}else{
				spanObj = $("#" + treeNode.tId + "_span");
				spanObj.addClass("menu_span");
			}
			
		},
		initScrollBar:function(event, treeId, treeNode){
			var h=$(window).height()-$("#header").height()
			$("#menutree").slimscroll({
				height:h,
				position:'right',
				distance:"2px",
				opacity:0.3
			});
		},
		ztreeBeforeExpand:function(treeId, treeNode){
			$("#"+treeNode.tId).addClass("open");
		},
		ztreeOnCollapse:function(event, treeId, treeNode){
			$("#"+treeNode.tId).removeClass("open");
			// AppFrame.fixZtreeHeight();
		},
		ztreeOnExpand:function(event, treeId, treeNode){
			// AppFrame.fixZtreeHeight();
			// jquery.slimscroll.js里定义了showbar事件
			$("#menutree").trigger("showbar");
		},
		fixZtreeHeight:function(){
		},
		initleftMenuByZtreeType:function(menuJson,index){
			index++;
			for(var i=0;i<menuJson.length;i++){
				menuJson[i].name=menuJson[i].text;
				menuJson[i].menuUrl=menuJson[i].url;
				menuJson[i].url="";
				menuJson[i].icon="";
				if("children" in menuJson[i]){
					menuObj.initleftMenuByZtreeType(menuJson[i].children,index);
				}
			}
		},
		showScreen:function(menuId, url, target, text){
			tabObj.newTab(menuId,text);
			iframeObj.newIframe(menuId,url);
		}
	}
	var AppFrame={
		loadConfig:function(callBack){
			$.post("/static/web/config.ini",function(data){
				try{
					config=eval("("+data+")");
				}catch(e){
					alert("/static/web/config.ini格式不正确,请检查!");
					return ;
				}
				callBack();
				
			})
		},
		loadApps:function(callBack){
			$.post("/"+config.bspCtx+"/topMenuQuery.cmd",function(data){
				var appList;
				try{
					appList=eval("("+data+")").menu.rows;
				}catch(e){
					alert("系统会话已失效，请重新登录!");
					return ;
				}
				var str="<ul>";
				for(var i=0;i<appList.length;i++){
					var app=appList[i];
					str+= "<li id='"+app.id+"' class='app'>"
			             +  "<img class='icon' width='59' height='59' src='"+app.icon+"' />"
			             +  "<div class='text'>"+app.text+"</div>"
			             +  "<div class='arrow'></div>"
			             +  "<div class='pushdin'></div>"
			             + "</li>";
				}
				str+="</ul>";
				$("#app-content").html(str);
				callBack();
				
			})
		},
		init:function(){
			for(one in AppEvents){
				AppEvents[one]();
			}
		}
	};
	
	var pageEvents={
		logoClick:function(){
			$("#logo").click(function(){
				$("#tab-list .mainPage").click();
			})
		},
		sitMap:function(){
			$("#sitmap").click(function(){
				InterfaceObj.creatTabWindow("sitMap", "/portal/jsp/map/map.jsp", "菜单地图");
			})
		},
		setPassWord:function(){
			$("#setPassword").click(function(){
				InterfaceObj.creatTabWindow("setPassword", "/"+config.bspCtx+"/jsp/bsp/user/user_passwordmgt.jsp", "修改密码");
			})
		},
		logout:function(){
			$("#logout").click(function(){
				document.location.href="/"+config.bspCtx+"/logout";
			})
		},
		setHeight:function(){
			$("#menubox").height($(window).height()-$("#header").height());
			
			$(window).resize(function(){
				$(".content-iframe").height(getIframeHeight());
				$("#menubox").height($(window).height()-$("#header").height());
				
				var windowHeight=$(window).height();
				var visible=windowHeight>585?5:4;
				$(".carousel").jCarouselLite({
					   btnNext: ".next",
					   btnPrev: ".prev",
					   vertical: true,
					   circular: false,
					   visible: visible,
					   scroll: 2,
					   mouseWheel:true
				});
				
				var h=$(window).height()-$("#header").height()
				$("#menutree").slimscroll({
					height:h,
					position:'right',
					distance:"2px",
					opacity:0.3
				});
			})
		}
	}
	
	var config;
	tabObj=TabObj();
	iframeObj=IframeObj();
	tabObj.init("mainPage");
	iframeObj.init("mainPage","/sgp/supply/sgpHomePageCmd.cmd?method=query");
	AppFrame.loadConfig(function(){
		AppFrame.loadApps(function(){
			AppFrame.init();
			for(one in pageEvents){
				pageEvents[one]();
			}
		});
	})
	
	function  getIframeHeight(){
		var windowHeight=$(window).height();
		var headerHeight=$("#header").height();
		var tabHeight=$("#tab-list").height();
		return windowHeight-headerHeight-tabHeight-4;
	}
})
var tabObj,iframeObj;
//对外暴露的方法
var InterfaceObj={
	creatTabWindow:function(menuId, url, text) {
		tabObj.newTab(menuId,text);
		iframeObj.newIframe(menuId,url);
	}
};
