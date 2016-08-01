/**
 * Created by zhanglei on 2016-05-25.
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
        		// 显示所有导航
        		showAllChannel($el);
        		
        		// 显示所有分类
						showAllCatatory($el);
		    },
        init:function($el,opts){
        		// 渲染数据
        		render($el, $el.attr("id"));
        		// 禁用链接的默认行为
    				$el.find(".mainNav-navList2").delegate("a","click",function(e){ 
								// 栏目为自定义页面
        				if ($(this).attr("id") == "channelType2") {
        						window.open(ctx+"/design/mall/MallDesign.htm?pageId="+$(this).attr("name").replace("channelTypeId", ""));
        				} 
        				// 栏目为自定义链接
        				else if ($(this).attr("id") == "channelType3") {
        						window.open($(this).attr("href"));
        				} 
        				// 栏目为首页
        				else if ($(this).attr("id") == "mallIndex") {
        						window.open(ctx+"/design/mall/MallDesign.htm");
        				}
								e.preventDefault();
						});
        }
    };

    $.fn.mallchannel=function(oper,opts){
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
    	
    		$.getJSON(ctx+"/design/mall/MallChannel.do?method=queryItemCat&random="+Math.random()+"&comId="+g_comid+"&subComId="+g_sub_comid, "",
            function(firstCatList){
            		// 遍历显示类目
            		var htmlContent = [];
            		for(var i = 0; i < firstCatList.length; i++){
										var firstCatObj = firstCatList[i];
										htmlContent.push('<div class="menuIn2"><div class="menuOut22"></div><div class="menuOut2">');
										var secondCatList = firstCatObj.SECOND_CATAGORY;
										for(var j = 0; j < secondCatList.length; j++){
												var secondCatObj = secondCatList[j];
												htmlContent.push('<h2><a title="'+secondCatObj.CAT_NAME+'" href="'+ctx+'/'+g_comid+'item/iteminfo/ShowItems.htm?PTID='+secondCatObj.PARENT_CID+'&catId='+secondCatObj.CAT_ID+'">'+secondCatObj.CAT_NAME+'</a>：</h2><p>');
												var thirdCatList = secondCatObj.THIRD_CATAGORY;
												for(var k = 0; k < thirdCatList.length; k++){
														var thirdCatObj = thirdCatList[k];
														htmlContent.push('<a title="'+thirdCatObj.CAT_NAME+'" href="'+ctx+'/'+g_comid+'item/iteminfo/ShowItems.htm?PTID='+thirdCatObj.PARENT_CID+'&catId='+thirdCatObj.CAT_ID+'">| '+thirdCatObj.CAT_NAME+'</a>');
												}
												htmlContent.push('</p><div class="clearfix"></div>');
										}
										htmlContent.push('</div>');
										htmlContent.push('<div class="mainMenuConDt2 mainMenuConDt20'+(i+1)+'"> <b></b><a title="'+firstCatObj.CAT_NAME+'" href="'+ctx+'/'+g_comid+'item/iteminfo/ShowItems.htm?PTID='+firstCatObj.PARENT_CID+'&catId='+firstCatObj.CAT_ID+'">'+firstCatObj.CAT_NAME+'</a> <em></em> </div></div>');
								}
								$el.find("#mainMenuCon2").html(htmlContent.join(''));
								
								// 显示所有分类
								showAllCatatory($el);
            }
        );
    	
    		$.getJSON(ctx+"/design/mall/MallChannel.do?method=queryChannel&subComId="+g_sub_comid+"&random="+Math.random(), "",
            function(resultList){
            		var channelResult = resultList.CHANNEL_RESULT;
            		var mallIndexPage = resultList.MALL_INDEX_PAGE;
            		var channelHtml = "";
            		if (mallIndexPage != null) {
            				$el.find("#mallIndex").attr("href", mallIndexPage.PAGE_URL);
            		}

            		// 清除导航信息
            		$el.find(".mainNav-navList2 li").not(":eq(0)").remove();
            		
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
																		channelHtml = channelHtml + "<li class='third'><a id='channelType"+thridObj.CHANNEL_TYPE+"' name='channelTypeId"+thridObj.CHANNEL_HREF_VALUE+"' target='"+thridObj.TARGET_TEMP+"' href='"+thridObj.CHANNEL_URL+"'>"+thridObj.CHANNEL_NAME+"</a></li>"
																}
																channelHtml = channelHtml + "</ul></div>"
														}

														channelHtml = channelHtml + "</li>"
												}
												channelHtml = channelHtml + "</ul></div>"
										}
										
										channelHtml = channelHtml + "</li>";
								}
								$el.find(".mainNav-navList2").append(channelHtml);

								// 显示所有导航
        				showAllChannel($el);
            }
        );
    }
    
    // 显示所有类目
    function showAllCatatory($el) {
    	
    		$.getJSON(ctx+"/design/mall/MallChannel.do?method=queryChannel&subComId="+g_sub_comid+"&random="+Math.random(), "",
            function(resultList){
            		var mallIndexPage = resultList.MALL_INDEX_PAGE;
            		if (mallIndexPage != null) {
            				var isIndex = false;
            				try {
            						if (g_pageid == mallIndexPage.PAGE_ID) {
            								isIndex = true;
            						}
            				} catch (e) {}
            			
            				if (!isIndex) {
        								/*****去首页外其他页面，收起，打开商品分类****/
											 	$el.find("#category2").mouseover(function(){
													$el.find("#mainMenu2").show();
												});
												$el.find("#category2").mouseleave(function(){
													$el.find("#mainMenu2").hide();
												});
												$el.find("#mainMenu2").hide();
		        				} else {
		        						$el.find("#mainMenu2").show();	
		        				}
            		}
            }
        );
    	
    		$el.find(".menuIn2").hover(function(){
						var childrenTop = $(this).offset().top;
						var parentTop = $el.find("#mainMenuCon2").offset().top;
						var top = childrenTop - parentTop;
						var childrenHeight = $(this).find(".menuOut2").innerHeight();
						var totalHeight = $el.find("#mainMenuCon2").height();
						if((top + childrenHeight) > totalHeight)
						{
							if(childrenHeight > totalHeight)
							{
								$(this).find(".menuOut2").css("top",-top);
							}else{
								//上移动
								var topX = (childrenHeight+top) - totalHeight;
								$(this).find(".menuOut2").css("top",-topX);				
							}
						}		
					}
				);
    }
    
    // 显示所有导航
    function showAllChannel($el) {
    		var navTimer;
				$el.find(".mainNav-navList2 .navMehu").hover(function(){
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
				
				$el.find(".mainNav-navList2 .ejNavCon").hover(
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
				$el.find(".mainNav-navList2 > li:visible > a").each(function() {
					var href = $(this).attr("href");
					if (href != null) {
						if (href.indexOf(protocol) == 0) {
							if (href == url) {
								$(this).parent().addClass("current");
							}
						} else {
							if (origin+href == url) {
								$(this).parent().addClass("current");
							}
						}
					}
				})
		}
})(jQuery);