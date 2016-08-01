/**
 * Created by zhanglei on 2016-01-12.
 */
(function($){

    var g = {
        config:function($el,opts){
            return JSON.parse($el.attr("data-val"));
        },
        reset:function($el,opts){
            // 渲染数据
        		render($el, $el.attr("id"));
        },
        run:function($el,opts){
        		// 显示所有分类
        		showAllChannel($el);
		    },
        init:function($el,opts){
        		// 渲染数据
        		render($el, $el.attr("id"));
        		// 禁用链接的默认行为
    				$el.find(".mainNav-navList").delegate("a","click",function(e){ 
								// 栏目为自定义页面
        				if ($(this).attr("id") == "channelType2") {
        						window.open(ctx+"/design/portal/PortalDesign.htm?pageId="+$(this).attr("name").replace("channelTypeId", ""));
        				} 
        				// 栏目为自定义链接
        				else if ($(this).attr("id") == "channelType3") {
        						window.open($(this).attr("href"));
        				} 
        				// 栏目为首页
        				else if ($(this).attr("id") == "portalIndex") {
        						window.open(ctx+"/design/portal/PortalDesign.htm");
        				}
								e.preventDefault();
						});
        }
    };

    $.fn.portalchannel=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };

		// 显示导航信息
    var render=function($el, widgetid) {
    		$.getJSON(ctx+"/design/portal/PortalChannel.do?method=queryChannel&random="+Math.random(), "",
            function(resultList){
            		var channelResult = resultList.CHANNEL_RESULT;
            		var portalIndexPage = resultList.PORTAL_INDEX_PAGE;
            		var channelHtml = "";
            		$el.find("#portalIndex").attr("href", portalIndexPage.PAGE_URL);
            		
            		// 清除导航信息
            		$("#"+widgetid).find(".mainNav-navList li").not(":eq(0)").remove();
            		
            		// 遍历显示栏目
            		for(var i = 0; i < channelResult.length; i++){
										var channelObj = channelResult[i];
										var secondList = channelObj.CHILD_CHANNEL;
										channelHtml = channelHtml + "<li><a id='channelType"+channelObj.CHANNEL_TYPE+"' name='channelTypeId"+channelObj.CHANNEL_HREF_VALUE+"' class='navMehu' target='"+channelObj.TARGET_TEMP+"' href='"+channelObj.CHANNEL_URL+"'>"+channelObj.CHANNEL_NAME+"</a>";
										
										// 组装二级栏目
										if (secondList != null) {
												channelHtml = channelHtml + "<div class='ejNavCon'><ul class='ejnav'>"
												for(var j = 0; j < secondList.length; j++){
														var secondObj = secondList[j];
														var thridList = secondObj.THRID_CHANNEL;
														channelHtml = channelHtml + "<li class='ejLi'><a id='channelType"+secondObj.CHANNEL_TYPE+"' name='channelTypeId"+secondObj.CHANNEL_HREF_VALUE+"' class='ejLink' target='"+secondObj.TARGET_TEMP+"' href='"+secondObj.CHANNEL_URL+"'>"+secondObj.CHANNEL_NAME+"</a>"
														
														// 组装三级栏目
														if (thridList != null) {
																channelHtml = channelHtml + "<div class='sjNav'><ul>"
																for(var k = 0; k < thridList.length; k++){
																		var thridObj = thridList[k];
																		channelHtml = channelHtml + "<li><a id='channelType"+thridObj.CHANNEL_TYPE+"' name='channelTypeId"+thridObj.CHANNEL_HREF_VALUE+"' target='"+thridObj.TARGET_TEMP+"' href='"+thridObj.CHANNEL_URL+"'>"+thridObj.CHANNEL_NAME+"</a></li>"
																}
																channelHtml = channelHtml + "</ul></div>"
														}

														channelHtml = channelHtml + "</li>"
												}
												channelHtml = channelHtml + "</ul></div>"
										}
										
										channelHtml = channelHtml + "</li>";
								}
								$("#"+widgetid).find(".mainNav-navList").append(channelHtml);

								// 显示所有分类
        				showAllChannel($el);
            }
        );
    }
    
    // 门户显示所有分类
    function showAllChannel($el) {
    		$el.find(".mainNav-index-ejnav").hide();
    		$el.find(".mainNav-index-yjnav").unbind("hover");
    		$el.find(".mainNav-index-yjnav").add($el.find(".mainNav-index-ejnav")).hover(function(){
					var $indexEjNav=$el.find(".mainNav-index-ejnav");
					$indexEjNav.css('display','block');
					/*var flag=$indexEjNav.css('display');
					if(flag=="block"){
						$indexEjNav.css('display','none');
					}else{
						$indexEjNav.css('display','block');
					}*/
				},function(){
					var $indexEjNav=$el.find(".mainNav-index-ejnav");
					$indexEjNav.css('display','none');
				});
    		
    		var navTimer;
				$el.find(".mainNav-navList .navMehu").hover(function(){
					var $this=$(this);
					var leftT=0,topT=0;
					topT= $(this).height();
					leftT=0;
					$this.addClass("hover").next(".ejNavCon").css({
						display:"block",
						left:leftT,
						top:topT
					});							
					/******设置3级菜单的位置****/
					var maxWidth=0;
					try{
						if ($this.siblings(".ejNavCon").find(".ejnav")[0] != "") {
							maxWidth=$this.siblings(".ejNavCon").find(".ejnav")[0].clientWidth-10;
							var paddingL=$this.siblings(".ejNavCon").find(".ejnav").find("li").css("padding-left");
							var paddingR=$this.siblings(".ejNavCon").find(".ejnav").find("li").css("padding-right");
							paddingL=parseInt( paddingL.substring(0,paddingL.indexOf("p")) );
							paddingR=parseInt( paddingR.substring(0,paddingR.indexOf("p")) );						
							maxWidth=parseInt(maxWidth);
							maxWidth=maxWidth+paddingL+paddingR;						
							$this.siblings(".ejNavCon").find(".sjNav").css({
								"left":maxWidth
							})
						}
					} catch(e){}		
				},function(){
					var obj=$(this);
					navTimer=setTimeout(function(){
						obj.removeClass("hover").next(".ejNavCon").hide();
					},50);
				});
				
				$el.find(".mainNav-navList .ejNavCon").hover(
					function(){
						clearTimeout(navTimer);
					},
					function(){
						$(this).hide().prev(".navMehu").removeClass("hover");
					}
				);
				
				var url = window.location.href.substring(0, window.location.href.lastIndexOf(window.location.hash));
				url = url.substring(0, url.lastIndexOf(window.location.search));
				var protocol = window.location.protocol;
				if (!window.location.origin) {
					  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
				}
				var origin = window.location.origin;
				$el.find(".mainNav-navList > li:visible > a").each(function() {
					var href = $(this).attr("href");
					if (href.indexOf(protocol) == 0) {
						if (href == url) {
							$(this).parent().addClass("current");
						}
					} else {
						if (origin+href == url) {
							$(this).parent().addClass("current");
						}
					}
				})
		}
})(jQuery);