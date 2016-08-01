(function($){
    var g = {
        config: function($el){
            return moduleTool.config($el);
        },
        reset: function($el, opts){
            moduleTool.reset($el, opts, render);
        },
        run: function($el){
            moduleTool.run($el, render);
        },
        init: function($el){
            moduleTool.init($el, render);
        }
    };
    
    
    $.fn.goodsArrangement = function(oper, opts){
        if (!oper) 
            oper = "init";
        
        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);
        })
        if (operr) 
            return operr;
        
        return this;
    };
    
    
    var render = function($widget, dataval, isReset){
    
    
        if (isReset == "run") {
            tabActive($widget);
            getItemInfoForSale($widget, dataval, isReset);
            getItemInfoForCollect($widget, dataval, isReset);
        }
        
        if (isReset == "init") {
            tabActive($widget);
            getItemInfoForSale($widget, dataval, isReset);
            getItemInfoForCollect($widget, dataval, isReset);
            
        }
        
        if (isReset == "reset") {
            tabActive($widget);
            
            getItemInfoForSale($widget, dataval, isReset);
            getItemInfoForCollect($widget, dataval, isReset);
            
            
            
        }
        
        
    }
    
    function tabActive($widget){
        $widget.find("#ranking").slide({
            titCell: ".rankTit li",
            mainCell: ".rankMain",
            effect: "fade",
            autoPlay: false,
            trigger: "click",
            easing: "swing",
            delayTime: 500,
            pnLoop: false
        });
    }
    
    function setSaleListPage($widget, item, type){
    
        var domstr = [];
        //销量排行第一个 --begin
        domstr.push("<div class='fistPho' title='", item[0].ITEM_TITLE, "'>");
        domstr.push("<a href='", item[0].MOBILE_URL, "'>");
        domstr.push("<div class='fistPhoMain'>");
        domstr.push("<img src='", item[0].IMG_URL, "' height='100%'> ");
        domstr.push("<div class='rankNum'>");
        domstr.push("<img src='/static/design-m/img/topRank1.png'> ");
        domstr.push("</div>");
        domstr.push("<div class='rankInfoBg'>");
        domstr.push("</div>");
        domstr.push("<div class='rankInfo'>");
        domstr.push("<div class='sold'>", type, ":", (type == "已售" ? item[0].SALE_QTY : item[0].COLLECTION_NUM), "</div>");
        domstr.push("<div class='price'>¥:", item[0].PRICE, "</div>");
        domstr.push("</div>");
        domstr.push("</div>");
        domstr.push("</a>");
        domstr.push("</div>");
        //销量排行第一个 --end
        //销量排行第二三个 --begin
        for (var j = 1; j < item.length; j++) {
            if (j == 1) {
                domstr.push("<div class='secondPho' title='", item[j].ITEM_TITLE, "'>");
            }
            else {
                domstr.push("<div class='secondPho bottom0' title='", item[j].ITEM_TITLE, "'>");
            }
            
            domstr.push("<a href='", item[j].MOBILE_URL, "'>");
            domstr.push("<div class='secondPhoMain'>");
            domstr.push("<img src='", item[j].IMG_URL, "' height='100%'> ");
            domstr.push("<div class='rankNum'>");
            domstr.push("<img src='/static/design-m/img/topRank", (j + 1), ".png'> ");
            domstr.push("</div>");
            domstr.push("<div class='rankInfoBg'>");
            domstr.push("</div>");
            domstr.push("<div class='rankInfo'>");
            domstr.push("<div class='rankInfoR'>", type, ":", (type == "已售" ? item[j].SALE_QTY : item[j].COLLECTION_NUM), "</div>");
            domstr.push("</div>");
            domstr.push("</div>");
            domstr.push("</a>");
            domstr.push("</div>");
        }
        
        //销量排行第二三个 --end
        var str = domstr.join("");
        if (type == "已售") {
            $widget.find(".soldbox").html(str);
        }
        else {
            $widget.find(".collectionbox").html(str);
        }
        
    }
    
    
    function getItemInfoForSale($widget, dataval, isReset){
        var url = "" + parent.ctx + "/design/dataAPI/itemList/AjaxItemListDataApi.do?method=getItemInfoSorting&vend_id=" + parent.g_vendid;
        var data = "keyWordSearch=" + dataval.keyWord + "&beginPrice=" + dataval.beginPrice + "&endPrice=" + dataval.endPrice + "&category=" + dataval.category + "&sort=SALE" + "&itemNum=3";
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: function(data){
            
                if (data.list.length >= 3) {
                    if (isReset != "run") {
                        setHasData($widget);
                    }
                    
                    setSaleListPage($widget, data.list, "已售");
                }
                else {
                    if (isReset != "run") {
                        setNoData($widget);
                    }
                    
                }
            },
            error: function(){
                alert("error");
            },
            dataType: "json",
            async: false
        
        });
    }
    
    function getItemInfoForCollect($widget, dataval, isReset){
        var url = "" + parent.ctx + "/design/dataAPI/itemList/AjaxItemListDataApi.do?method=getItemInfoForCollect&vend_id=" + parent.g_vendid;
        var data = "keyWordSearch=" + dataval.keyWord + "&beginPrice=" + dataval.beginPrice + "&endPrice=" + dataval.endPrice + "&category=" + dataval.category + "&itemNum=3";
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: function(data){
            
                if (data.list.length >= 3) {
					if (isReset != "run"){
						setHasData($widget);
					}
                    setSaleListPage($widget, data.list, "已收藏");
                }
                else {
					if (isReset != "run"){
						setNoData($widget);
					}
                    
                }
            },
            error: function(){
                alert("error");
            },
            dataType: "json",
            async: false
        
        });
    }
    
    
    
})(jQuery)
