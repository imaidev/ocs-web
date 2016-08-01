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

    var render = function ($widget, dataval, renderType) {
        var opts = $.extend({}, $.fn.personalityclassification.defaults, dataval);
        var $el = $widget;
        /*if (renderType != "run") {*/
            var widgetWith = $widget.closest('.column').width();

            //设置分类外层DOM
            var strWit = [];
            if ("240" == widgetWith) {
                strWit = '<div class="tabCon"><div class="related-Buy ba fc6"><div class="personalityStr"></div></div></div>';
            }
            else {
                strWit = '<div class="recGoods recGoods-960"><div class="goodLists goodLists-three pb10"></div></div>';
            }
            $el.find(".findclass").html(strWit);

            //设置分类列表
            var str = [];
            if (widgetWith == '240') {
                str.push('<h4 class="Btit"><span class="f22 fcS1">.</span><a href="/shop/' + g_vendid + '/itemList.html">查看所有宝贝</a></h4>');
            }
            else {
                str.push('<ul class="pb0">');
                str.push('<li class="goodList fN">');
                str.push('<h4 class="fl">');
                str.push('<a href="/shop/' + g_vendid + '/itemList.html" name="" class="pc_sort">查看所有宝贝</a>');
                str.push('</h4>');
                str.push('</li>	');
                str.push('</ul>');
            }

            $.get(ctx + "/design/dataAPI/itemCategory/ItemCategoryDataApi.do?method=getVendCataByVendId&VEND_ID=" + g_vendid,
                    function (data) {
                        if (opts.f_array == undefined) {
                            for (var i = 0; i < data.length; i++) {
                                var child_cat = data[i].CHILD_CATAGORY;
                                if (widgetWith == '240') {
                                    str.push('<div class="clearfloat"></div>');
                                    if (child_cat != null && child_cat != '') {
                                    	str.push('<h4 class="Btit"><div class="f16 pr pl20"><b class="treeview-cut"></b><a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + data[i].CATAGORY_ID + '">' + data[i].CATAGORY_NAME + '</a></div></h4>');
                                    } else {
                                    	str.push('<h4 class="Btit"><div class="f16 pr pl20"><a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + data[i].CATAGORY_ID + '">' + data[i].CATAGORY_NAME + '</a></div></h4>');
                                    }
                                    str.push('<ul>');
                                } else {
                                    str.push('<ul class="pb0">');
                                    str.push('<li class="goodList fN">');
                                    str.push('<h4 class="fl">');
                                    if (child_cat != null && child_cat != '') {
                                    	str.push('<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + data[i].CATAGORY_ID + '" name="' + data[i].CATAGORY_ID + '" class="catagory_name_url">' + data[i].CATAGORY_NAME + '</a>');
                                    } else {
                                        str.push('<a name="' + data[i].CATAGORY_ID + '" class="catagory_name_url" href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + data[i].CATAGORY_ID + '">' + data[i].CATAGORY_NAME + '</a>');
                                    }
                                    str.push('</h4>');
                                    str.push('<ul>');
                                }
                                for (var j = 0; j < child_cat.length; j++) {
                                    if (widgetWith == '240') {
                                        if (j == 0) {
                                            str.push('<li>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + child_cat[j].CATAGORY_ID + '" name="' + child_cat[j].CATAGORY_ID + '" class="catagory_name_url">' + child_cat[j].CATAGORY_NAME + '</a></li>');
                                        } else {
                                            str.push('<li>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + child_cat[j].CATAGORY_ID + '" name="' + child_cat[j].CATAGORY_ID + '" class="catagory_name_url">' + child_cat[j].CATAGORY_NAME + '</a></li>');
                                        }
                                    } else{
                                        str.push('<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + child_cat[j].CATAGORY_ID + '" name="' + child_cat[j].CATAGORY_ID + '" class="catagory_name_url">' + child_cat[j].CATAGORY_NAME + '</a>');
                                    }

                                }
                                if (widgetWith == '240') {
                                    str.push('</ul>');
                                } else {
                                    str.push('</ul>');
                                    str.push('</li>');
                                    str.push('</ul>');
                                }
                            }
                            if (widgetWith == '240') {
                                $el.find('.related-Buy .personalityStr').html(str.join(''));
                            } else {
                                $el.find('.goodLists').html(str.join(''));
                            }

                        } else {
                            var f_array = opts.f_array;
                            for (var i = 0; i < f_array.length; i++) {
                                var f_data_id = f_array[i].data_id;
                                var f_show_cat = f_array[i].show_cat;
                                var s_array = f_array[i].s_array;
                                if (f_show_cat) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].CATAGORY_ID == f_data_id) {
                                            var url_s_data = data[j].CHILD_CATAGORY;
                                            if (widgetWith == '240') {
                                            	var isshowchildcat=false;
                                            	$.each(s_array,function(){
                                            		if(this.show_cat){
                                            			isshowchildcat=true;
                                            			return;
                                            		}
                                            	})
                                                str.push('<div class="clearfloat"></div>');
                                                if (url_s_data != null && url_s_data != '' && isshowchildcat) {
                                                	str.push('<h4 class="Btit"><div  class="f16 pr pl20"><b class="treeview-cut"></b><a href="/shop/' + parent.g_vendid + '/itemList.html?VEND_CATID=' + data[j].CATAGORY_ID + '">' + data[j].CATAGORY_NAME + '</a></div></h4>');
                                                } else {
                                                	str.push('<h4 class="Btit"><div  class="f16 pr pl20"><a href="/shop/' + parent.g_vendid + '/itemList.html?VEND_CATID=' + data[j].CATAGORY_ID + '">' + data[j].CATAGORY_NAME + '</a></div></h4>');
                                                }
                                                str.push('<ul>');
                                            } else {
                                                str.push('<ul class="pb0">');
                                                str.push('<li class="goodList fN">');
                                                str.push('<h4 class="fl">');
                                                if (url_s_data != null && url_s_data != '') {
                                                    str.push('<a class="catagory_name_url" href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + data[j].CATAGORY_ID + '">' + data[j].CATAGORY_NAME + '</a>');
                                                } else {
                                                    str.push('<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + data[j].CATAGORY_ID + '" name="' + data[j].CATAGORY_ID + '" class="catagory_name_url">' + data[j].CATAGORY_NAME + '</a>');
                                                }
                                                str.push('</h4>');
                                                str.push('<ul>');
                                            }
                                            for (var m = 0; m < s_array.length; m++) {
                                                if (s_array[m].show_cat) {
                                                    for (var n = 0; n < url_s_data.length; n++) {
                                                        if (s_array[m].data_id == url_s_data[n].CATAGORY_ID) {
                                                            if (widgetWith == '240') {
                                                                if (m == 0) {
                                                                    str.push('<li class="bt">&nbsp;&nbsp;&nbsp;&nbsp;<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + url_s_data[n].CATAGORY_ID + '" name="' + url_s_data[n].CATAGORY_ID + '" class="catagory_name_url">' + url_s_data[n].CATAGORY_NAME + '</a></li>');
                                                                } else {
                                                                    str.push('<li>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/shop/' + g_vendid + '/itemList.html?VEND_CATID=' + url_s_data[n].CATAGORY_ID + '" name="' + url_s_data[n].CATAGORY_ID + '" class="catagory_name_url">' + url_s_data[n].CATAGORY_NAME + '</a></li>');
                                                                }
                                                            } else {
                                                                str.push('<a href="/shop/' + parent.g_vendid + '/itemList.html?VEND_CATID=' + url_s_data[n].CATAGORY_ID + '" name="' + url_s_data[n].CATAGORY_ID + '" class="catagory_name_url">' + url_s_data[n].CATAGORY_NAME + '</a>');
                                                            }

                                                        }
                                                    }
                                                }
                                            }
                                            if (widgetWith == '240') {
                                                str.push('</ul>');
                                            } else {
                                                str.push('</ul>');
                                                str.push('</li>');
                                                str.push('</ul>');
                                            }
                                        }
                                    }
                                }
                            }
                            if (widgetWith == '240') {
                                $el.find('.related-Buy .personalityStr').html(str.join(''));
                            } else {
                                $el.find('.goodLists').html(str.join(''));
                            }
                        }
                        $widget.find('.personalityStr b').click(function () {
                            $(this).parent().parent().next().toggle();//折叠效果
                            $(this).toggleClass("treeview-cut treeview-plus");
                        });

                    }, 'json');
        /*}
        else {
            $widget.find('.personalityStr h4').click(function () {
                $(this).next().toggle();//折叠效果
            });
        }*/
    };

    $.fn.personalityclassification = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };

    $.fn.personalityclassification.defaults = {
    }
})(jQuery)

