/**
 * Created by zhanglei on 2016-01-12.
 */
(function($){

    var g = {
        config:function($el){
            return moduleTool.config($el);
        },
        reset:function($el,opts){
        		moduleTool.reset($el, opts, render);
        },
        run:function($el){
        	var catagoryUrl = "";
        	// 门户
        	if (g_scene == "1") {
        			catagoryUrl = "/portal/articleList.html?catagoryId=";
        	} 
        	// 商城
        	else if (g_scene == "2") {
        			catagoryUrl = "/mall/articleList.html?catagoryId=";
        	} 
        	// 店铺
        	else if (g_scene == "3") {
        			catagoryUrl = "/shop/"+g_vendid+"/articleList.html?catagoryId=";
        	}
        	$el.find("#articleCatagoryDiv").find("a").attr("target", "_self").each(function(){
        			$(this).attr("href", catagoryUrl+(typeof($(this).attr("id"))=="undefined" ? "" : $(this).attr("id")));
        	});
		    },
        init:function($el){
        		moduleTool.init($el, render);
        }
    };

    $.fn.articlecatagory=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };
    
    // 组件渲染
    var render=function($widget,dataval){
    	dataval = $.extend({}, $.fn.articlelist.defaults, dataval);	
			$widget.find("#articleCatagoryDiv").html("");
			$.getJSON(ctx+"/design/article/CatagoryMgr.do?method=queryCatList&vendId="+g_vendid+"&random="+Math.random(), "",
            function(resultList){
            		var liHtml = "";
            		var liClass = (dataval.displayMode == "1") ? "upright" : "transverse";
            		var articleListPageId = "";
								for(var i = 0; i < resultList.length; i++){
									var catObj = resultList[i];
									// 显示全部文章分类 或 显示指定文章分类
									if (dataval.showCat == "1" || (dataval.showCat == "2" && dataval.selCats.indexOf(catObj.CATAGORY_ID) > -1)) {
											liHtml = liHtml + "<li class='"+liClass+"'><a id='"+catObj.CATAGORY_ID+"'>"+catObj.CATAGORY_NAME+"</a></li>";
									}
								}
								$widget.find("#articleCatagoryDiv").html("<ul><li class='"+liClass+"'><a>全部</a></li>"+liHtml+"</ul>");
								
								// 查询文章列表页PageId
								$.getJSON(ctx+"/design/article/CatagoryMgr.do?method=queryArticleListPage&vendId="+g_vendid+"&random="+Math.random(), "",
				            function(resultPage){
				            		var articleListPageId = resultPage.PAGE_ID;
												$widget.find("#articleCatagoryDiv").delegate("a","click",function(e){ 
														var catagory = {"catagoryId": ($(this).attr("id") != null ? $(this).attr("id") : "")};
										
														// 跳转到文章列表
														jumpPage(articleListPageId, catagory);
												});
				            }
				        );
            }
        );
		}
		
		$.fn.articlecatagory.defaults = {
        displayMode: "1",
        showCat:"1",
        selCats:[]
    };
})(jQuery);

