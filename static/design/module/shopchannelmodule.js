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
        		// 渲染数据
        		render($el, $el.attr("id"));
		    },
        init:function($el,opts){
        		// 渲染数据
        		render($el, $el.attr("id"), true);
        }
    };

    $.fn.shopchannel=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };

		// 显示导航信息
    var render=function($el, widgetid, isAddClick) {
    		$.getJSON(ctx+"/design/shop/ShopChannel.do?method=queryChannel&vendId="+g_vendid+"&random="+Math.random(), "",
            function(resultList){
            		var catResult = resultList.CAT_RESULT;
            		var channelResult = resultList.CHANNEL_RESULT;
            		var shopIndexUrl = resultList.SHOP_INDEX_URL;
            		var itemListUrl = resultList.ITEM_LIST_URL;
            		var itemListPage = resultList.ITEM_LIST_PAGE;
            		$el.find("#shopIndex").attr("href", shopIndexUrl);
            		var catagoryHtml = "";
            		var channelHtml = "";
            		// 清除分类信息
            		$("#"+widgetid).find(".menuIn").remove();
            		// 遍历显示父分类
            		for(var i = 0; i < catResult.length; i++){
										var catagoryObj = catResult[i];
										catagoryHtml = catagoryHtml + "<div class='menuIn'><div title='"+catagoryObj.CATAGORY_NAME+"' class='mainMenuConDt'> <b></b> <a id='channelType1' name='channelTypeId"+catagoryObj.CATAGORY_ID+"' href='"+itemListUrl+catagoryObj.CATAGORY_ID+"'>"+catagoryObj.CATAGORY_NAME+"</a> </div>";
										if (catagoryObj.CHILD_CATAGORY.length > 0) {
												catagoryHtml = catagoryHtml + "<div class='menuOut'>";
										}
										// 遍历显示子分类
										for(var j = 0; j < catagoryObj.CHILD_CATAGORY.length; j++){
												var childCatagoryObj = catagoryObj.CHILD_CATAGORY[j];
												catagoryHtml = catagoryHtml + "<p title='"+childCatagoryObj.CATAGORY_NAME+"' class='menu'><a id='channelType1' name='channelTypeId"+childCatagoryObj.CATAGORY_ID+"' href='"+itemListUrl+childCatagoryObj.CATAGORY_ID+"'>"+childCatagoryObj.CATAGORY_NAME+"</a></p>";
										}
										if (catagoryObj.CHILD_CATAGORY.length > 0) {
												catagoryHtml = catagoryHtml + "</div>";
										}
										catagoryHtml = catagoryHtml + "</div>";
								}
								$("#"+widgetid).find("#mainMenuCon").append("<div class='menuIn'><div title='全部商品' class='mainMenuConDt'> <b></b> <a id='allItemList' href='"+itemListUrl+"'>全部商品</a> </div>");
								$("#"+widgetid).find("#mainMenuCon").append(catagoryHtml);
            		
            		// 清除导航信息
            		$("#"+widgetid).find(".nav-cates").not(":eq(0)").remove();
            		// 遍历显示父类渠道
            		for(var i = 0; i < channelResult.length; i++){
										var channelObj = channelResult[i];
										if (channelObj.CHANNEL_URL == null || channelObj.CHANNEL_URL == "") {
												channelObj.CHANNEL_URL = itemListUrl+channelObj.CHANNEL_HREF_VALUE;
										}
										var aTarget = "";
										if (channelObj.CHANNEL_TYPE == "3") {
												aTarget = "_blank";
										}
										channelHtml = channelHtml + "<li title='"+channelObj.CHANNEL_NAME+"' class='nav-cates'><a id='channelType"+channelObj.CHANNEL_TYPE+"' name='channelTypeId"+channelObj.CHANNEL_HREF_VALUE+"' href='"+channelObj.CHANNEL_URL+"' target='"+aTarget+"'>"+channelObj.CHANNEL_NAME+"</a><div class='nav-cateLists '>";
										// 遍历显示子类渠道
										for(var j = 0; j < channelObj.CHILD_CHANNEL.length; j++){
												var childChannelObj = channelObj.CHILD_CHANNEL[j];
												channelHtml = channelHtml + "<p title='"+childChannelObj.CATAGORY_NAME+"' class='items'><a id='channelType"+childChannelObj.CHANNEL_TYPE+"' name='channelTypeId"+channelObj.CHANNEL_HREF_VALUE+"' href='"+itemListUrl+childChannelObj.CHANNEL_HREF_VALUE+"'><span class='fcS1 fb f16'>.</span>&nbsp;&nbsp;"+childChannelObj.CATAGORY_NAME+"</a></p>";
										}
										channelHtml = channelHtml + "</div></li>";
								}
								$("#"+widgetid).find(".shopList").append(channelHtml);
								
								// 显示所有分类
        				showAllChannel($el);
        				
        				// 禁用链接的默认行为
        				if (isAddClick) {
        						$el.delegate("a","click",function(e){ 
												// 栏目为商家分类
				        				if ($(this).attr("id") == "channelType1") {
				        						window.open(ctx+"/design/shop/ShopDesign.htm?pageId="+itemListPage.PAGE_ID+"&catId="+$(this).attr("name").replace("channelTypeId", ""));
				        				}
				        				// 栏目为自定义页面
				        				else if ($(this).attr("id") == "channelType2") {
				        						window.open(ctx+"/design/shop/ShopDesign.htm?pageId="+$(this).attr("name").replace("channelTypeId", ""));
				        				} 
				        				// 栏目为自定义链接
				        				else if ($(this).attr("id") == "channelType3") {
				        						window.open($(this).attr("href"));
				        				} 
				        				// 栏目为首页
				        				else if ($(this).attr("id") == "shopIndex") {
				        						window.open(ctx+"/design/shop/ShopDesign.htm");
				        				}
				        				// 栏目为所有商品
				        				else if ($(this).attr("id") == "allItemList") {
				        						window.open(ctx+"/design/shop/ShopDesign.htm?pageId="+itemListPage.PAGE_ID);
				        				}
												e.preventDefault();
										});
        				}
            }
        );
    }
    
    // 店铺显示所有分类
    function showAllChannel($el) {
			/*****去首页外其他页面，收起，打开所有分类****/
		 	$el.find("#category").mouseover(function(){
				$el.find("#mainMenu").show();
			});
			$el.find("#category").mouseleave(function(){
				$el.find("#mainMenu").hide();
			});	
			$el.find(".menuIn").hover(function(){
				$(this).addClass("hover");
				var childrenTop = $(this).offset().top;
				var parentTop = $el.find("#mainMenuCon").offset().top;
				var top = childrenTop - parentTop;
				var childrenHeight = $(this).find(".menuOut").innerHeight();
				var totalHeight = $el.find("#mainMenuCon").height();
				if((top + childrenHeight) > totalHeight)
				{
					if(childrenHeight > totalHeight)
					{
						$(this).find(".menuOut").css("top",-top);
					}else{
						//上移动
						var topX = (childrenHeight+top) - totalHeight;
						$(this).find(".menuOut").css("top",-topX);				
					}
				}		
			},function(){
				$(this).removeClass("hover");
			});
		}
})(jQuery);

