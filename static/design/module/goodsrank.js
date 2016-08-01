(function ($) {
    var g = {
        config: function ($el) {
            return moduleTool.config($el);
        },
        reset: function ($el, opts) {
            moduleTool.reset($el, opts, render);
        },
        run: function ($el) {
            moduleTool.run($el, render);
        },
        init: function ($el) {
            moduleTool.init($el, render);
        },
    };

    var render = function ($widget, dataval) {
        var opts = $.extend({}, $.fn.goodsrank.defaults, dataval);

        $widget.find(".panel").children().remove();
        var item = [];
        if (opts.tblrType == 'tbType') {
            item.push("<ul class='top-list'>");
        } else {
            item.push("<ul class='top-list top-list02'>");
        }
        var canshu = '';
        if (opts.rankType != null && opts.rankType != "") {
            canshu = canshu + '&FLAG=' + opts.rankType;
        }
        if (opts.showNum != null && opts.showNum != "") {
            canshu = canshu + '&QTY=' + opts.showNum;
        }
        if (opts.searchWord != null && opts.searchWord != "") {
            canshu = canshu + '&KEY_WORDS=' + encodeURI(encodeURI(opts.searchWord));
        }
        if (opts.lowerLimitPrice != null && opts.lowerLimitPrice != "") {
            canshu = canshu + '&BEGIN_PRICE=' + opts.lowerLimitPrice;
        }
        if (opts.upperLimitPrice != null && opts.upperLimitPrice != "") {
            canshu = canshu + '&END_PRICE=' + opts.upperLimitPrice;
        }
        if (opts.classify != null && opts.classify != "") {
            canshu = canshu + '&CATAGORY_ID=' + opts.classify;
        }

        var $el = $widget;
        $.get(ctx + "/design/dataAPI/itemList/ItemListForSaleAndCollectDataApi.do?method=getItemList&VEND_ID=" + g_vendid + canshu,
	       function (data) {
	           for (var i = 0; i < data.length; i++) {
	               item.push("<li>");
	               item.push("<div class='item'>");
	               item.push("<div class='img'><a href='" + data[i].ITEM_URL + "'><img src='" + data[i].IMG_URL + "' width='60' height='60'/></a></div>	");
	               item.push("<div class='detail'>");
	               item.push("<p class='detail-item'><a href='" + data[i].ITEM_URL + "'>" + data[i].ITEM_TITLE + "</a></p>");
	               item.push("<p class='detail-item price fcR'><span class='dollarFM'>￥</span><span>" + data[i].PRICE + "</span></p>");
	               if (opts.rankType != '1') {
	                   item.push("<p class='detail-item sale'>已收藏<span class='sale-count'>" + data[i].COLLECTION_NUM + "</span>次</p>");
	               } else if (opts.showSellSituation) {
	                   item.push("<p class='detail-item sale'>已出售<span class='sale-count'>" + data[i].QTY + "</span>件</p>");
	               }

	               item.push("</div>");
	               item.push("</div>");
	               item.push("</li>");
	           }

	           item.push("</ul>");
	           /*item.push("<div class='control-group'><a class='btnBg1 btn2 radius2'>查看更多宝贝</a></div>");*/
	           $el.find(".panel").html(item.join(''));

	       }, 'json');
    };

    $.fn.goodsrank = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };

    $.fn.goodsrank.defaults = {
        classify: "",
        searchWord: "",
        lowerLimitPrice: "",
        upperLimitPrice: "",
        showNum: "6",
        rankType: "0",//热门收藏
        tblrType: "tbType",
        showSellSituation: false
    }
})(jQuery)