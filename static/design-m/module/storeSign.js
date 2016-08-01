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
    
    
    $.fn.storeSign = function(oper, opts){
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
    
        ajaxGetShopInfo($widget, isReset, dataval);
        autoGetItems("PRICE", $widget);//全部
        autoGetItems("DATE", $widget);//上新
    }
    
    function ajaxGetShopInfo($widget, isReset, dataval){
        if (typeof dataval.url != "undefined") {
            $widget.find(".storeName").find("a").attr("href", dataval.url);
        }
        if (typeof dataval.img != "undefined") {
            $widget.find(".storeHeaderTop1").find("img").attr("src", dataval.img);
        }
        //		if(typeof dataval.shopName!="undefined"){
        //			$widget.find(".storeName").find("span").text(dataval.shopName);
        //			
        //		}
        
        
      var url = "" + ctx + "/design/dataAPI/vend/vendShop/AjaxVendShopDataApi.do?method=getVendShopInfo&vendId=" + g_vendid;
        $.ajax({
            url: url,
            type: "POST",
            success: function(data){
            
                if (typeof data.shopInfo != "undefined") {
                    $widget.find(".storeName").find("span").text(data.shopInfo.SHOP_NAME);
                    $widget.find(".portrait").find("img").attr("src", data.shopInfo.LOGO);
                }
                if (typeof data.noSearch != "undefined") {
                    layer.msg(data.noSearch, {
                        offset: 80,
                        shift: 5,
                        time: 2500
                    });
                }
            },
            error: function(){
                alert("error");
            },
            dataType: "json"
        })
    }
    
    //自动推荐 ajax 
    function autoGetItems(sort, $widget){
    
        var itemNum = 99999;
        var url = "" + ctx + "/design/dataAPI/itemList/AjaxItemListDataApi.do?method=getItemInfoSorting&vend_id=" + g_vendid;
        var data = "sort=" + sort;
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: function(data){
                if (sort == "PRICE") {
                    $widget.find(".allItem").text(data.total);
                }
                if (sort == "DATE") {
                    $widget.find(".dateItem").text(data.total);
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
