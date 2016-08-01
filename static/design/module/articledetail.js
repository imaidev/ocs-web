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
        		opts = $.extend({}, $.fn.articledetail.defaults, g_data_widget[$el.attr("id")]);
	        	var rootUrl = "";
	        	// 门户
	        	if (g_scene == "1") {
	        			rootUrl = "/portal/article/";
	        	} 
	        	// 商城
	        	else if (g_scene == "2") {
	        			rootUrl = "/mall/article/";
	        	} 
	        	// 店铺
	        	else if (g_scene == "3") {
	        			rootUrl = "/shop/"+g_vendid+"/article/";
	        	}
	        	
	        	$el.find(".prevArticle").find("a").attr("href", rootUrl+$("#prevArticleId").val()+".html");
	        	$el.find(".nextArticle").find("a").attr("href", rootUrl+$("#nextArticleId").val()+".html");
	        	$el.find(".textImg4").find("a").attr("target", "_blank").attr("href", $el.find(".textImg4 .newsDetailImg").attr("src"));
	        	$el.find(".textImg5").find("a").attr("target", "_blank").attr("href", $el.find(".textImg5 .newsDetailImg").attr("src"));
	        	$el.find(".textImg6").find("a").attr("target", "_blank").attr("href", $el.find(".textImg6 .newsDetailImg").attr("src"));
	        	
	        	$el.find(".textImg4").hide();
						$el.find(".textImg5").hide();
						$el.find(".textImg6").hide();
						// 文章附图是否显示(1:显示;2:隐藏)
						if (opts.displayImg == "1") {
								$el.find(".textImg"+(parseInt(opts.imgStyle,10)+3)).show();
						}
						
						// 上下篇访问设置
						$el.find(".prevNextArticle").hide();
						$el.find(".prevNextTitleArticle").hide();
						// 判断是否支持上/下一篇(1:是;2:否)
						if (opts.upDown == "1") {
								// 上/下一篇标题(1:显示;2:隐藏)
								if (opts.upDownTitle == "1") {
										$el.find(".prevNextTitleArticle").show();
								} else {
										$el.find(".prevNextArticle").show();
								}
						}
						
						// 设置上一篇文章访问地址
						if ($el.find("#prevArticleId").val() == "") {
								$el.find(".prevArticle").hide();
						}
						
						// 设置下一篇文章访问地址
						if ($el.find("#nextArticleId").val() == "") {
								$el.find(".nextArticle").hide();
						}
		    },
        init:function($el){
        		$el.find("#articleDetailArea").html("");
        		moduleTool.init($el, render);
        }
    };

    $.fn.articledetail=function(oper,opts){
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
    	dataval = $.extend({}, $.fn.articledetail.defaults, dataval);	
			$.ajax({
				url : ctx + "/design/article/ArticleDetail.htm?articleId="+getQueryString("articleId")+"&vendId="+g_vendid+"&random="+Math.random(),
				type : "post",
				dataType : "html",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) { 
					$widget.find("#articleDetailArea").html($(data).find('#articleDetailDiv').html());
					
					$widget.find(".textImg4").hide();
					$widget.find(".textImg5").hide();
					$widget.find(".textImg6").hide();
					// 文章附图是否显示(1:显示;2:隐藏)
					if (dataval.displayImg == "1") {
							$widget.find(".textImg"+(parseInt(dataval.imgStyle,10)+3)).show();
					}
					
					// 上下篇访问设置
					$widget.find(".prevNextArticle").hide();
					$widget.find(".prevNextTitleArticle").hide();
					// 判断是否支持上/下一篇(1:是;2:否)
					if (dataval.upDown == "1") {
							// 上/下一篇标题(1:显示;2:隐藏)
							if (dataval.upDownTitle == "1") {
									$widget.find(".prevNextTitleArticle").show();
							} else {
									$widget.find(".prevNextArticle").show();
							}
					}

					// 设置上一篇文章访问地址
					if ($widget.find("#prevArticleId").val() != "") {
							$widget.find(".prevArticle").delegate("a","click",function(e){ 
									var article = {"articleId": $widget.find("#prevArticleId").val()};
						
									// 跳转到文章详情页
									jumpPage($("#articleDetailPage").val(), article);
							});
					} else {
						$widget.find(".prevArticle").hide();
					}
					
					// 设置下一篇文章访问地址
					if ($widget.find("#nextArticleId").val() != "") {
						$widget.find(".nextArticle").delegate("a","click",function(e){ 
								var article = {"articleId": $widget.find("#nextArticleId").val()};
					
								// 跳转到文章详情页
								jumpPage($("#articleDetailPage").val(), article);
						});
					} else {
						$widget.find(".nextArticle").hide();
					}
					
					// 点击编辑文章
					$widget.find("#articleDetailArea").find(".articleContent").css("cursor", "pointer").attr("title", "点击编辑文章").click(function() {
							var paramUrl = "";
							// 取不到ID时为新增文章
							var articleId = $widget.find("#articleId").val();
							if (articleId != "") {
									paramUrl = "articleId="+articleId;
							}
							layer.open({
					        type : 2,
					        content :  ctx + "/design/article/ArticleMgr.htm?"+paramUrl+"&vendId="+g_vendid,
					        title : (paramUrl != "") ? "修改文章" : "新增文章",
					        shadeClose: true,
					        area : ['780px','590px'],
					        end : function() {
					        	 render($widget,dataval);
					        }
				    	});
					});
				}
			});
		}
		
		// 从地址栏获取字串
		function getQueryString(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = decodeURI(decodeURI(window.location.search)).substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return "";
		}
		
		$.fn.articledetail.defaults = {
        displayImg: "1",
        imgStyle:"1",
        upDown:"1",
        upDownTitle:"1"
    };
})(jQuery);

