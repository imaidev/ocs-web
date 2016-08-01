(function($){
    var g = {
        config:function($el){
            return moduleTool.config($el);
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
    
    $.fn.sitecollect=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);
	        
        })
        if (operr) return operr;

        return this;
    };

    var render=function($widget,dataval,renderType){
        var opts = $.extend({}, $.fn.sitecollect.defaults, dataval);
        if(renderType=="init" || renderType=="reset"){
            var strS=[];
            strS.push('<a hidefocus="true" class="sethomepage" href="javascript:void(0);">设为首页</a>&nbsp;');
            strS.push('<a>|</a>&nbsp;');
            strS.push('<a hidefocus="true" class="collectwebsite" href="javascript:void(0);">收藏本站</a>');
            
            $widget.find(".favorite").html(strS.join(''));
        }
      //获取当前页面的url
    	var curUrl=window.location.href;
    	$widget.find("a.sethomepage").click(function(){
         	SetHome(this,curUrl);
        })
        $widget.find("a.collectwebsite").click(function(){
        	AddFavorite('我的网站',curUrl);
        })
    }
    
  //设为首页
	function SetHome(obj,url){
		try{
			obj.style.behavior='url(#default#homepage)';
			obj.setHomePage(url);
		}catch(e){
			if(window.netscape){
				try{
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}catch(e){
				alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
				}
			}else{
				alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【"+url+"】设置为首页。");
			}
		}		
	}
	//收藏本站
	function AddFavorite(title, url) {
		try {
			window.external.addFavorite(url, title);
		}
		catch (e) {
			try {
				window.sidebar.addPanel(title, url, "");
			}
			catch (e) {
				alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
			}
		}
	}
    
	$.fn.sitecollect.defaults ={
    	title:"我的网站"
    };
})(jQuery)

