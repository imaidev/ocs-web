/**
 * @Description: 组件工具
 */
if (typeof moduleTool == "undefined") {
    moduleTool = {};
}

moduleTool = {
    config: function($el) {
        var defaultOpt = $.fn[$el.attr("data-componentid")].defaults;

        return defaultOpt ? $.extend({}, defaultOpt, $el.data("data-val")) : $el.data("data-val");
    },
    reset: function($el, opts, callback) {
        var defaultOpt = $.fn[$el.attr("data-componentid")].defaults;
        if (defaultOpt) {
            //过滤出非默认的配置
            var originOpt = $.extend({}, $el.data('data-val'), opts);
            opts = moduleTool.exclusive(defaultOpt, originOpt);
        } else {
            opts = $.extend({}, $el.data("data-val"), opts);
        }

        opts = JSON.parse(moduleTool.rplChar(JSON.stringify(opts))); //过滤空格

        $el.data("data-val", opts);
        callback($el, opts, "reset");
        $el.attr("data-renderurl", "WIDGET_ID=" + $el.attr("id") + "&rnd=" + new Date().getTime());
    },
    run: function($el, callback) {
        callback($el, g_data_widget[$el.attr("id")], "run");
    },
    init: function($el, callback) {
        if (typeof $el.data("data-val") == "object") { //使用数据区配置 快速初始化
            callback($el, $el.data("data-val"), "init");
        } else if ($el.attr("data-renderurl")) { //根据组件url 初始化
            var url = g_widget_url_r;
            if (typeof BAK_ID != "undefined") url = g_bak_widget_url_r + "&BAK_ID=" + BAK_ID; //备份预览功能

            $.get(url + "&" + $el.attr("data-renderurl") + "&rnd=" + new Date().getTime(),
                    function(data) {
                        var dataObject = data.DATAVAL ? JSON.parse(data.DATAVAL) : {};
                        $el.data("data-val", dataObject);
                        callback($el, dataObject, "init");
                    }, 'json')
                .error(function(xhr, errorText, errorType) {
                    try {
                        //获取组件数据异常后，300ms后重试
                        setTimeout(function() {
                            try {
                                $.get(url + "&" + $el.attr("data-renderurl") + "&rnd=" + new Date().getTime(),
                                        function(data) {
                                            var dataObject = data.DATAVAL ? JSON.parse(data.DATAVAL) : {};
                                            $el.data("data-val", dataObject);
                                            callback($el, dataObject, "init");
                                        }, 'json')
                                    .error(function(xhr, errorText, errorType) {

                                        console.log("获取数据异常组件:" + $el.attr("id"));
                                        if (layer) {
                                            if (g_scene == '4') { //暂时手机端使用空对象初始化
                                                layer.msg("获取部分组件数据失败，已使用默认设置初始化有问题的组件", {
                                                    offset: 80,
                                                    shift: 5,
                                                    time: 5000,
                                                });
                                                $el.data("data-val", {});
                                                callback($el, {}, "init");
                                            } else {
                                                layer.msg("获取部分组件数据失败，请刷新页面重试！可以在控制台查看异常组件的ID", {
                                                    offset: 80,
                                                    shift: 5,
                                                    time: 5000,
                                                });
                                            }
                                        } else {
                                            alert("网络异常，获取部分组件数据失败，请刷新页面重试！可以在控制台查看异常组件的ID");
                                        }
                                    });

                            } catch (e) {}
                        }, 300);
                    } catch (e) {}
                });
        } else { //第一次初始化 使用组件初值data-val属性(data-val属性最好只用来覆盖组件的默认设置) 设置组件url
            var datavalStr = moduleTool.rplChar($el.attr("data-val"));
            var datavalObj = datavalStr ? JSON.parse(datavalStr) : {};
            $el.data("data-val", datavalObj);
            callback($el, datavalObj, "init");
            $el.attr("data-renderurl", "WIDGET_ID=" + $el.attr("id") + "&rnd=" + new Date().getTime())
                .removeAttr("data-val");
        }
    },

    exclusive: function(opt1, opt2) {
        var options = {};

        if (typeof opt1 == "object" && typeof opt2 == "object") {
            for (var name in opt2) {
                diff = opt1[name];
                copy = opt2[name];

                if (copy !== undefined && copy != diff) {
                    options[name] = copy;
                }
            }
        }

        return options;
    },

    rplChar: function(str) {
        if (!str) {
            return "";
        }
        return str.replace(/\s/g, ""); //过滤空格防止JSON.PARSE报错
    }
};

$(function() {
    //PC端组件运行
    if (typeof g_data_widget_header != "undefined" || typeof g_data_widget_body != "undefined" || typeof g_data_widget_footer != "undefined") {
        g_data_widget = $.extend({}, (typeof g_data_widget_header == "undefined" ? {} : g_data_widget_header),
            (typeof g_data_widget_body == "undefined" ? {} : g_data_widget_body), (typeof g_data_widget_footer == "undefined" ? {} : g_data_widget_footer),
            (typeof g_data_widget_shopHeader == "undefined" ? {} : g_data_widget_shopHeader), (typeof g_data_widget_shopFooter == "undefined" ? {} : g_data_widget_shopFooter));
        var componentsNeedRun = ["cubeitemmodule","siteNavmodule", "goodsrank", "custommodule", "slidermodule", "itemlistmodule",
            "shopcards", "customerservice", "weathermodule", "shopchannel", "tablayout",
            "snoweffect", "itemlist", "portalchannel", "personalityclassification", "shopsearch",
            "portalonlineservice", "sharetool", "rollingNoticeModule", "leavemsg", "vote",
            "investigate", "articlecatagory", "articlelist", "articledetail", "sitecollect",
            "shopnotice", "sitenotice", "customAdModule", "oneSearch", "floorguide",
            "selectalbum", "logoconfiguration", "recommenditemmodule", "videoplayer", "shopcardtool", "scene360", "shopLogo", "shopSignBoard", "mallchannel"
        ];
        for (var i = 0; i < componentsNeedRun.length; i++) {
            $("div[data-componentid=" + componentsNeedRun[i] + "]").each(function() {
                try {
                    $(this)[componentsNeedRun[i]]("run");
                } catch (e) {
                  
                }
            });
        }
    }
    //todo 手机端组件运行
    if (typeof g_data_mobile_widget != "undefined") {
        g_data_widget = g_data_mobile_widget;
        $("div[data-run]").each(function() {
            try {
                $(this)[$(this).attr("data-componentid")]("run");
            } catch (e) {
            	console.log(e);
            }
        });
    }
});
