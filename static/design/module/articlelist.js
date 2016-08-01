/**
 * Created by zhanglei on 2016-01-12.
 */
(function($){
    var g = {
        config:function($el){
            return moduleTool.config($el);
        },
        reset:function($el,opts){
        	
        		// 取消操作
        		if (opts.oper == "cancel") {
        				//update
				        $.get(g_widget_url_r+"&"+$el.attr("data-renderurl"),
		               function(data){
		                  render($el,data.DATAVAL?JSON.parse(data.DATAVAL):{});
		            },'json')
        		} else {
        				moduleTool.reset($el, opts, render);
        		}
        },
        run:function($el){
        		moduleTool.run($el, runrender);
		    },
        init:function($el){
		        moduleTool.init($el, render);
        }
    };

    $.fn.articlelist=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };
    
    // 运行组件渲染
    var runrender = function($widget,dataval){			
				dataval.isRun = "1";
				render($widget,dataval);
		}
    
    // 组件渲染
    var render=function($widget,dataval){		
    	dataval = $.extend({}, $.fn.articlelist.defaults, dataval);	
			var pString = "";
			var selCats = getQueryString("selCats");
			for (pKey in dataval) {
					if (selCats != "" && pKey == "selCats") {
							pString += "&"+pKey+"="+selCats;
					} else {
							pString += "&"+pKey+"="+dataval[pKey];
					}
			}

			$widget.find("#articleListArea").html("<iframe id='articleListIFrame' name='articleListIFrame' scrolling='yes' frameborder='0' style='width:100%;'></iframe>");
      $widget.find("#articleListIFrame").attr("src", ctx + "/design/article/ArticleList.htm"+"?catagoryId="+getQueryString("catagoryId")+"&widgetId="+$widget.attr("id")+"&keyWord="+encodeURI(encodeURI(getQueryString("keyWord")))+"&vendId="+g_vendid+"&scene="+g_scene+pString);
		}
		
		// 从地址栏获取字串
		function getQueryString(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = decodeURI(decodeURI(window.location.search)).substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return "";
		}
		
		$.fn.articlelist.defaults = {
        displayMode: "1",
        showCat:"1",
        showPage:"1",
        pageNum:"10",
        displayCat:"1",
        selCats:[],
        topSign:"1",
        signImg:"1"
    };
})(jQuery);

