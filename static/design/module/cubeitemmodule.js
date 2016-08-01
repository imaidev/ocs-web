(function($) {
        var g = {
            config: function($el) {
                return moduleTool.config($el);
            },
            reset: function($el, opts) {
                moduleTool.reset($el, opts, render);
            },
            run: function($el) {
                moduleTool.run($el, render);
            },
            init: function($el) {
                moduleTool.init($el, render);
            }
        };

        var $tplContainer; //模板容器
        var getTemplate = function() {
            if ($tplContainer) return $tplContainer;

            $.ajax({
                url: "/static/design/cfg/cfgcubeitemmoduletpl.html" + "?rnd=" + new Date().getTime(),
                success: function(data) {
                    $tplContainer = $("<div id='tplContainer'></div>").append(data);
                    $('body').append($tplContainer);
                },
                error: function(t, o, e) {
                    console.log(e);
                    return;
                },
                async: false,
                dataType: "html",
                cache: false
            });

            return $tplContainer;
        };

        var autoGetItems = function(opts) {
            var data = {
                comId: opts.comId || window.g_sub_comid || window.g_comid,
                catId: opts.catId || "",
                keyWordSearch: opts.keyWord || "",
                beginPrice: opts.beginPrice || "",
                endPrice: opts.endPrice || "",
                sortRule: opts.sortRule || "",
                itemNum: opts.itemNum || "10"
            };

            var items = [];
            var url = ctx + "/design/dataAPI/itemList/AjaxItemListDataApi.do?method=getItemList";
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                success: function(data) {
                    if (data.total !== 0) {
                        for (var i = 0; i < data.list.length; i++) {
                            items[i] = {
                                type: "item",
                                itemid: data.list[i].ITEM_ID,

                                usecustomstyle: "0",
                                isshowtitleandprice: opts.isshowtitleandprice,
                                padding: opts.padding,

                                href: data.list[i].ITEM_URL,
                                src: data.list[i].IMG_URL,
                                title: data.list[i].ITEM_TITLE,
                                price: "￥" + data.list[i].PRICE,
                            };
                        }
                    }
                },
                error: function() {},
                dataType: "json",
                async: false,
                cache: false
            });

            return items;
        };

        var manualGetItems = function(opts) {
            var itemIdArr = [];
            for (var i = 0; i < opts.items.length; i++) {
                if (opts.items[i].type == "item" && opts.items[i].itemid) {
                    itemIdArr.push(opts.items[i].itemid);
                }
            }

            if (itemIdArr.length > 0) {
                var url = ctx + "/design/dataAPI/item/AjaxItemInfoDataApi.do?method=getItemIsList&itemId=" + itemIdArr.toString();
                $.ajax({
                        url: url,
                        type: "POST",
                        success: function(data) {
                            for (var i = 0; i < data.list.length;i++ ) {
                                for (var j = 0; j < opts.items.length; j++) {
                                    if (opts.items[j].itemid == data.list[i].ITEM_ID) {
                                        opts.items[j].href = data.list[i].ITEM_URL;
                                        opts.items[j].src = data.list[i].IMG_URL;
                                        opts.items[j].title = data.list[i].ITEM_TITLE;
                                        opts.items[j].price = "￥" + data.list[i].PRICE;
                                        break;
                                    }
                                }
                            }
                    },
                    error: function() {
                        alert("error");
                    },
                    dataType: "json",
                    async:false
                });
        }

    };

    var render = function($widget, dataval, renderType) {
        console.log("test");
        var opts = $.extend({}, $.fn.cubeitemmodule.defaults, dataval);
        //获取模板数据
        var bt = baidu.template; //模板引擎
        getTemplate(); //将模板的HTML添加页面

        var items;
        if (opts.autoSelect == "1") { //自动推荐
            opts.itemNum = opts.tplmeta[opts.type].itemnum; //当前模板对应的商品数目
            opts.items = autoGetItems(opts);
        } else {
            //todo 获取手动指定的itemid的商品数据
            manualGetItems(opts);
        }

        //生成li内的html内容
        var lihtml = [];
        for (var i = 0; i < opts.tplmeta[opts.type].itemnum; i++) {
            lihtml.push(bt("cubeitemtpl_iteminfo", {
                item: opts.items[i] || {
                    type: "empty"
                },
                opts: opts,
                defaults: $.fn.cubeitemmodule.defaults
            }));
        }

        var html = bt("cubeitemtpl_" + opts.type, {
            opts: opts,
            doms: lihtml
        });
        $widget.find(".goodsInfo").html(html);

        //样式设置
        $widget.find(".goodsInfo").each(function() {
            var $this = $(this);
            if(opts.showborderup=="0"){
            	$(this).css("border-top","none");
            }
            else{
            	$(this).css("border-top","");
            }
            if(opts.showborderdown=="0"){
            	$(this).css("border-bottom","none");
            }
            else{
            	$(this).css("border-bottom","");
            }
            if(opts.showborderleft=="0"){
            	$(this).css("border-left","none");
            }
            else{
            	$(this).css("border-left","");
            }
            if(opts.showborderright=="0"){
            	$(this).css("border-right","none");
            }
            else{
            	$(this).css("border-right","");
            }
            
            
            $(this).height(opts.height);

            $this.find(".goodsMain>li").each(function() {
                var $li = $(this),
                    index = $li.attr("data-index"),
                    liheight = opts.height * ($li.attr("data-height") || 0.5);

                $li.css("height", liheight);

                var padding;
                if (opts.items[index]) {
                    if (opts.items[index].usecustomstyle == "1") {
                        padding = opts.items[index].padding; //个性化padding
                    } else {
                        padding = opts.padding; //默认padding
                    }
                }

                //li内主内容高度和padding
                $li.find('.infoMain').css({
                    'padding': padding,
                    'height': liheight - padding * 2
                });

                //li内图片区高度
                if ($li.find('.goodsBot').length > 0) {
                    $li.find('.goodsImg').css({
                        'height': liheight - 46 - 3 * padding,
                        'margin-bottom': padding
                    });
                } else {
                    $li.find('.goodsImg').css({
                        'height': liheight - 2 * padding,
                        'margin-bottom': padding
                    });
                }
            });

        });
        
        //轮播渲染
        $widget.find('.adsBanner').each(function() {
            $(this).slide($.fn.slidermodule.defaults);
            if ($.fn.slidermodule.effect == "fold") {
                $(this).find(".adsBannerBd ul").css("width", "100%");
                $(this).find(".adsBannerBd li").css("width", "100%");
            }
        });


    };

    $.fn.cubeitemmodule = function(oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function() {
            operr = g[oper]($(this), opts);

        });
        if (operr) return operr;

        return this;
    };

    $.fn.cubeitemmodule.defaults = {
        tplmeta: { //模板基础数据不允许修改
            type1: {
                itemnum: 10, //10个商品展示位
            },
            type2: {
                itemnum: 5,
            },
            type3: {
                itemnum: 9,
            }
        },
        showborderup: "1",
        showborderdown: "1",
        showborderleft: "1",
        showborderright: "1",
        
        type: "type3",
        effect: "", //"album-moveL", //"album-border",
        height: 500,
        target: "_blank",

        custBorder: "0",
        borderColor: "#999",
        borderWidth: "2",
        borderStyle: "solid",

        autoSelect: "1", //自动推荐
        padding: 10, //展示设置：padding
        isshowtitleandprice: "1", //展示设置：是否显示标题和价格

        comId: "",
        comName: "",
        catId: "",
        catName: "",
        beginPrice: "",
        endPrice: "",
        sortRule: "",

        items: [
                // {
                //       type: "pic",
                //
                //       usecustomstyle: "0",
                //       padding: "0",
                //
                //       href: "",
                //       src: "/static/design/img/cube01.jpg",
                //   }, {
                //       type: "item",
                //       itemid: "",
                //
                //       usecustomstyle: "0",
                //       isshowtitleandprice: "",
                //       padding: "10",
                //
                //       href: "",
                //       src: "/static/design/img/cube01.jpg",
                //       title: "标题1",
                //   }, {
                //       type: "slide",
                //
                //       usecustomstyle: "0",
                //       padding: "0",
                //
                //       pics: [{
                //           href: "",
                //           src: "/static/design/img/cube01.jpg",
                //       }, {
                //           href: "",
                //           src: "/static/design/img/cube02.jpg",
                //       }, {
                //           href: "",
                //           src: "/static/design/img/cube03.jpg",
                //       }]
                //   }
            ] //手动设置商品、图片、轮播
    };


})(jQuery);
