(function($){
    var g = {
        config:function($el){
        	return moduleTool.config($el);
        },
        reset:function($el,opts){
        	moduleTool.reset($el,opts,render);
        },
        run:function($el) {
        	var opts = $.extend({}, $.fn.siteNavmodule.defaults, g_data_widget[$el.attr("id")]);
        	setLoginParam($el,opts)
        	doLogin($el, opts)
        },
        init:function($el){
        	moduleTool.init($el,render);
        }
    };

    $.fn.siteNavmodule=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };

    var render=function($widget,dataval,renderType){
        var opts = $.extend({}, $.fn.siteNavmodule.defaults, dataval);

        doUnlogin($widget, opts);
        
        //doLogin($widget, opts);
    }

    var doLogin=function($widget, opts) {
    	var menu = opts.leftMenu.concat(opts.rightMenu);
    	var o = new Array();
    	for (var i=0; i<menu.length; i++) {
    		if ("greeting|userCenter|login|userFavorite|myCart|mailTop|custServiceCenter".indexOf(menu[i].type) >= 0)
    		o.push(menu[i].type);
    	}
    	$.ajax({
    		url: ctx+"/design/dataAPI/base/SiteNavDataApi.do?method=getMenuData",
    		dataType: "json",
    		method: "POST",
    		data: {"menu": o.join("|")},
    		success: function(json) {
    			if (json.LOGIN == "login") {
    				buildLoginNode($widget.find("ul.site-nav-bd-l"), opts.leftMenu, json);
    				buildLoginNode($widget.find("ul.site-nav-bd-r"), opts.rightMenu, json);
    			}
    			cleanVertical($widget); // 清除有可能出现在两头的分隔线
    		}
    	});
    }
    
    var doUnlogin=function($widget, opts) {
    	var menu = opts.leftMenu.concat(opts.rightMenu);
    	var o = new Array();
    	for (var i=0; i<menu.length; i++) {
    		if ("login|register|helpCenter|custServiceCenter".indexOf(menu[i].type) >= 0)
    			o.push(menu[i].type);
    	}
    	$.ajax({
    		url: ctx+"/design/dataAPI/base/SiteNavDataApi.do?method=getMenuData",
    		dataType: "json",
    		method: "POST",
    		data: {"menu": o.join("|")},
    		success: function(json) {
    			$widget.find("ul.site-nav-bd-l").empty().append(buildUnloginNode(opts.leftMenu, json));
    	    	$widget.find("ul.site-nav-bd-r").empty().append(buildUnloginNode(opts.rightMenu, json));
    	    	hideVertical($widget);
    		}
    	});
    }
    
    var buildUnloginNode=function(opts, datas) {
    	var $ul = $("<ul>");
    	for (var i=0; i<opts.length; i++) {
    		if (opts[i].type == "greeting") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu greeting">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<span>'+opts[i].title+'</span>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "login") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu login">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a '+(datas.loginUrl==""?'':('href="'+datas.loginUrl+'" '))+'target="'+opts[i].target+'">'+opts[i].loginTitle+'</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "register") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu register">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a '+(datas.registerUrl==""?'':('href="'+datas.registerUrl+'" '))+'target="'+opts[i].target+'">'+opts[i].title+'</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "helpCenter") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu helpCenter">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a '+(datas.helpCenterUrl==""?'':('href="'+datas.helpCenterUrl+'" '))+'target="'+opts[i].target+'">'+opts[i].title+'</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "custServiceCenter") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu custServiceCenter">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a '+(opts[i].showIcon=="true"?'class="top_icon "':'')+(datas.custServiceCenterUrl==""?'':('href="'+datas.custServiceCenterUrl+'" '))+'target="'+opts[i].target+'">'+opts[i].title);
    			if (opts[i].showIcon == "true") menuHd.push('<i class="custService"></i>');
    			menuHd.push('</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "siteFavorite") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu siteFavorite">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a rel="sidebar" onclick="AddSiteFavorite(\''+(opts[i].siteTitle==null?"":opts[i].siteTitle)+'\',\''+(opts[i].siteUrl==null?"":opts[i].siteUrl)+'\');">'+opts[i].title+'</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "vertical") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu vertical">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<span class="site-nav-vertical">|</span>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		} else if (opts[i].type == "custLink") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu custLink">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a href="'+opts[i].url+'" target="'+opts[i].target+'">'+opts[i].title+'</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			$ul.append(menuHd.join(''));
    		}
    	}
    	return $ul.html();
    }
    
    var buildLoginNode=function($ul, opts, datas) {
    	for (var i=0; i<opts.length; i++) {
    		if (opts[i].type == "greeting") {
    			if (datas.accountCenterUrl != "") {
    				$ul.children("."+opts[i].type).find(".menu-hd span").replaceWith(opts[i].loginTitlePrefix+'<a href="'+datas.accountCenterUrl+'" target="'+opts[i].target+'">'+datas.userNickName+'</a>'+opts[i].loginTitleSuffix);
    			} else {
    				$ul.children("."+opts[i].type).find(".menu-hd span").text(opts[i].loginTitlePrefix+datas.userNickName+opts[i].loginTitleSuffix);
    			}
    		} else if (opts[i].type == "login") {
    			$ul.children("."+opts[i].type).find(".menu-hd a").attr("href", (datas.logoutUrl==""?'javascript:void(0);':datas.logoutUrl))
    				.attr("target", "_self").text(opts[i].logoutTitle);
    		} else if (opts[i].type == "register") {
    			$ul.children("."+opts[i].type).replaceWith('<li class="menu"></li>');
    		} else if (opts[i].type == "userCenter" && (datas.userCenterUrl != "" || datas.userCenterUrls.length > 0)) {
    			var menuHd = new Array();
    			if (datas.userCenterUrl != "") {
    				menuHd.push('<li class="menu userCenter">');
    				menuHd.push('<div class="menu-hd">');
    				menuHd.push('<a href="'+datas.userCenterUrl+'" target="'+opts[i].target+'">'+datas.userCenterTitle+'</a>');
    				menuHd.push('</div>');
    				menuHd.push('</li>');
    			} else if (datas.userCenterUrls.length > 0) {
    				menuHd.push('<li class="menu userCenter pull">');
    				menuHd.push('<div class="menu-hd">');
    				menuHd.push('<span>'+datas.userCenterTitle+'</span>');
    				menuHd.push('</div>');
    				menuHd.push('<div class="menu-bd">');
        			menuHd.push('<ul>');
        			for (var k=0; k<datas.userCenterUrls.length; k++) {
        				menuHd.push('<li>');
        				menuHd.push('<a '+(datas.userCenterUrls[k].href==""?'':('href="'+datas.userCenterUrls[k].href+'" '))+'target="'+opts[i].target+'">'+datas.userCenterUrls[k].title+'</a>');
        				menuHd.push('</li>');
        			}
        			menuHd.push('</ul>');
        			menuHd.push('</div>');
    				menuHd.push('</li>');
    			}
    			
    			if (i-1 < 0) 
    				$ul.prepend(menuHd.join(''));
    			else
    				$ul.children().eq(i-1).after(menuHd.join(''));
    		} else if (opts[i].type == "siteFavorite") {
    			$ul.children("."+opts[i].type).find(".menu-hd a").attr("href", "javascript:void(0);").attr("rel","sidebar")
    				.attr("onclick", 'AddSiteFavorite(\''+(opts[i].siteTitle==null?"":opts[i].siteTitle)+'\',\''+(opts[i].siteUrl==null?"":opts[i].siteUrl)+'\');');
    		} else if (opts[i].type == "userFavorite" && datas.userFavoriteUrl != "") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu userFavorite">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a '+(opts[i].showIcon=="true"?'class="top_icon "':'')+'href="'+datas.userFavoriteUrl+'" target="'+opts[i].target+'">');
    			if (opts[i].showIcon == "true") menuHd.push('<i class="collect"></i>');
    			menuHd.push(opts[i].title);
    			menuHd.push('</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			if (i-1 < 0) 
    				$ul.prepend(menuHd.join(''));
    			else
    				$ul.children().eq(i-1).after(menuHd.join(''));
    		} else if (opts[i].type == "myCart" && datas.myCartUrl != "") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu myCart">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<a '+(opts[i].showIcon=="true"?'class="top_icon "':'')+'href="'+datas.myCartUrl+'" target="'+opts[i].target+'">');
    			if (opts[i].showIcon == "true") menuHd.push('<i class="cart"></i>');
    			menuHd.push(opts[i].title);
    			if (opts[i].showItemCount == "true") menuHd.push('<span class="my-cart-count">&nbsp;('+datas.myCartItemCount+')</span>');
    			menuHd.push('</a>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			if (i-1 < 0) 
    				$ul.prepend(menuHd.join(''));
    			else
    				$ul.children().eq(i-1).after(menuHd.join(''));
    		} else if (opts[i].type == "mailTop" && datas.mailTopUrl != "") {
    			var menuHd = new Array();
    			menuHd.push('<li class="menu mailTop">');
    			menuHd.push('<div class="menu-hd">');
    			menuHd.push('<span class="storeregs-outer">'+opts[i].title+'<span class="fcS1 mailNumTop"></span></span>');
    			menuHd.push('</div>');
    			menuHd.push('<div class="menu-bd" style="display:block;top:-340px">');
    			menuHd.push('<iframe width="362" height="332" src="'+datas.mailTopUrl+'" scrolling="no" frameborder="0"></iframe>');
    			menuHd.push('</div>');
    			menuHd.push('</li>');
    			
    			if (i-1 < 0) 
    				$ul.prepend(menuHd.join(''));
    			else
    				$ul.children().eq(i-1).after(menuHd.join(''));
    			$ul.children(".mailTop").find("iframe").load(function() {
    				$(this).parent().parent().find(".mailNumTop").text($(this).contents().find("#mailNumTop").text());
    				$(this).parent().parent().find(".mailNumTop").parent().prepend($(this).contents().find("#mailNumTop").parent().prev());
    				$(this).parent().removeAttr("style");
    			});
    			$ul.children(".mailTop").mouseover(function() {
    				$(this).children(".menu-bd").show();
    			});
    			$ul.children(".mailTop").mouseout(function() {
    				$(this).children(".menu-bd").hide();
    			});
    		} else if (opts[i].type == "custServiceCenter" && datas.custServiceLoginUrl != "") {
    			var menuHd = new Array();
    			menuHd.push('<div class="menu-bd">');
    			menuHd.push('<ul>');
    			menuHd.push('<li>');
    			menuHd.push('<a '+(datas.custServiceCenterUrl==""?'':('href="'+datas.custServiceCenterUrl+'" '))+'target="'+opts[i].target+'">咨询平台客服</a>');
    			menuHd.push('</li>');
    			menuHd.push('<li>');
    			menuHd.push('<a '+(datas.custServiceLoginUrl==""?'':('href="'+datas.custServiceLoginUrl+'" '))+'target="'+opts[i].target+'">店铺客服中心</a>');
    			menuHd.push('</li>');
    			menuHd.push('</ul>');
    			menuHd.push('</div>');
    			
    			$ul.children("."+opts[i].type).addClass("pull");
    			$ul.children("."+opts[i].type).find(".menu-hd a").replaceWith('<span'+(opts[i].showIcon=="true"?' class="top_icon"':'')+'>'+(opts[i].showIcon == "true"?'<i class="custService"></i>':'')+opts[i].title+'</span><b></b>');
    			$ul.children("."+opts[i].type).append(menuHd.join(''));
    		}
    	}
    }
    
    // 清除区域两端多余的分隔线和相邻两条分隔线
    var cleanVertical = function($widget) {
    	var $ul = $widget.find("ul.site-nav-bd-l").children();
    	$ul.each(function() {
    		if (!$(this).hasClass("vertical")) return false;
    		$(this).remove();
    	})
    	for(var i=$ul.length-1; i >= 0; i--) {
    		if (!$ul.eq(i).hasClass("vertical")) break;
    		$ul.eq(i).remove();
    	}
    	$ul.each(function() {
    		if ($(this).hasClass("vertical") && $(this).next().hasClass("vertical")) 
    		$(this).remove();
    	})
    	$widget.find("ul.site-nav-bd-l").children("li.vertical").show();
    	
    	var $ul = $widget.find("ul.site-nav-bd-r").children();
    	$ul.each(function() {
    		if (!$(this).hasClass("vertical")) return false;
    		$(this).remove();
    	})
    	for(var i=$ul.length-1; i >= 0; i--) {
    		if (!$ul.eq(i).hasClass("vertical")) break;
    		$ul.eq(i).remove();
    	}
    	$ul.each(function() {
    		if ($(this).hasClass("vertical") && $(this).next().hasClass("vertical")) 
    		$(this).remove();
    	})
    	$widget.find("ul.site-nav-bd-r").children("li.vertical").show();
    }
    
    // 隐藏区域两端多余的分隔线
    var hideVertical = function($widget) {
    	var $ul = $widget.find("ul.site-nav-bd-l").children();
    	$ul.each(function() {
    		if (!$(this).hasClass("vertical")) return false;
    		$(this).hide();
    	})
    	for(var i=$ul.length-1; i >= 0; i--) {
    		if (!$ul.eq(i).hasClass("vertical")) break;
    		$ul.eq(i).hide();
    	}
    	$ul.each(function() {
    		if ($(this).hasClass("vertical") && $(this).next().hasClass("vertical")) 
    		$(this).hide();
    	})
    	
    	var $ul = $widget.find("ul.site-nav-bd-r").children();
    	$ul.each(function() {
    		if (!$(this).hasClass("vertical")) return false;
    		$(this).hide();
    	})
    	for(var i=$ul.length-1; i >= 0; i--) {
    		if (!$ul.eq(i).hasClass("vertical")) break;
    		$ul.eq(i).hide();
    	}
    	$ul.each(function() {
    		if ($(this).hasClass("vertical") && $(this).next().hasClass("vertical")) 
    		$(this).hide();
    	})
    }

    var setLoginParam = function($el,opts) {
    	var param = encodeURI(window.location.href);
    	var href = $el.find("ul li.login a").attr("href");
    	if (href.indexOf("?") >= 0) {
    		param = "&RelayState="+param;
    	} else {
    		param = "?RelayState="+param;
    	}
    	$el.find("ul li.login a").attr("href", href+param);
    	
    	$el.find(".siteFavorite a").attr("rel","sidebar").attr("onclick", 'AddSiteFavorite(\''+(opts.presetModule.siteFavorite.siteTitle==null?"":opts.presetModule.siteFavorite.siteTitle)+'\',\''+(opts.presetModule.siteFavorite.siteUrl==null?"":opts.presetModule.siteFavorite.siteUrl)+'\');');
    }

    $.fn.siteNavmodule.defaults ={
        leftMenu: [
        	{
        		type: "greeting",
                title: "欢迎光临！",
                target: "_self",
                loginTitlePrefix: "尊敬的：",
                loginTitleSuffix: "，您好！"
            },
            {
            	type: "login",
                target: "_self",
                loginTitle: "登录",
                logoutTitle: "退出",
                title: "登录/退出"
            },
            {
            	type: "register",
                target: "_self",
                title: "注册"
            }
        ],
        rightMenu: [
			{
				type: "myCart",
				target: "_self",
				title: "购物车",
				showIcon: "true",
				showItemCount: "true"
			},
			{
        		type: "userFavorite",
        		target: "_self",
            	title: "收藏夹",
            	showIcon: "true"
        	},
            {
            	type: "userCenter",
        		target: "_self",
            	title: "用户中心"
            },
			{
				type: "vertical"
			},
        	{
        		type: "custServiceCenter",
                target: "_blank",
                title: "客服中心",
                showIcon: "true"
            },
            {
            	type: "helpCenter",
                target: "_blank",
                title: "帮助中心"
            }
        ],
        presetModule: {
        	greeting: {
        		type: "greeting",
                title: "欢迎光临！",
                target: "_self",
                loginTitlePrefix: "尊敬的：",
                loginTitleSuffix: "，您好！"
        	},
        	login: {
        		type: "login",
                target: "_self",
                loginTitle: "登录",
                logoutTitle: "退出",
                title: "登录/退出"
        	},
        	register: {
        		type: "register",
                target: "_self",
                title: "注册"
        	},
        	custServiceCenter: {
        		type: "custServiceCenter",
                target: "_blank",
                title: "客服中心",
                showIcon: "true"
        	},
        	helpCenter: {
        		type: "helpCenter",
                target: "_blank",
                title: "帮助中心"
        	},
        	siteFavorite: {
        		type: "siteFavorite",
            	title: "收藏本站",
            	siteTitle: "",
            	siteUrl: ""
        	},
        	userCenter: {
        		type: "userCenter",
        		target: "_self",
            	title: "用户中心"
        	},
        	userFavorite: {
        		type: "userFavorite",
        		target: "_self",
            	title: "收藏夹",
            	showIcon: "true"
        	},
        	myCart: {
        		type: "myCart",
        		target: "_self",
            	title: "购物车",
            	showIcon: "true",
            	showItemCount: "true"
        	},
        	mailTop: {
        		type: "mailTop",
            	title: "站内信"
        	}
        },
        type: {
            greeting: {name:"欢迎语模块",config:true,tip:"登录后的欢迎语须发布并登录后才能看到"},
            login: {name:"登录/退出模块",config:true,tip:""},
            register: {name:"注册模块",config:true,tip:""},
            helpCenter: {name:"帮助中心模块",config:true,tip:""},
            custServiceCenter: {name:"客服中心模块",config:true,tip:""},
            siteFavorite: {name:"站点收藏模块",config:true,tip:""},
            vertical: {name:"分隔线",config:false,tip:""},
            custLink: {name:"自定义链接",config:true,tip:""},
            userCenter: {name:"用户中心模块",config:true,tip:"用户中心模块需发布且相应用户登录后才能看到其对应的用户中心"},
            userFavorite: {name:"收藏夹模块",config:true,tip:"收藏夹模块需发布且买家登录后才能看到"},
            myCart: {name:"购物车模块",config:true,tip:"购物车模块需发布且买家登录后才能看到"},
            mailTop: {name:"站内信模块",config:true,tip:"站内信模块需发布并登录后才能看到"}
	    }
    };
})(jQuery)