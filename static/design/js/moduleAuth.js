/**
 * @Description: 权限工具
 */
if (typeof moduleAuth == "undefined") {
    moduleAuth = {};
}

moduleAuth = {
    widgetNum: {},
    calWidgetNum: function(callback) {
        moduleAuth.widgetNum = {};
        $(".container div[data-componentid]").each(function() {
            var moduleName = $(this).attr("data-componentid");
            if (moduleAuth.widgetNum[moduleName]) {
                moduleAuth.widgetNum[moduleName]++;
            } else {
                moduleAuth.widgetNum[moduleName] = 1;
            }

            if (callback && (callback instanceof Function)) {
                callback(moduleName, moduleAuth.widgetNum[moduleName]); //回调
            }
        });

        if (callback && (callback instanceof Function)) {
            $("#desgTool div[data-componentid]").each(function() {
                var moduleName = $(this).attr("data-componentid");
                if (moduleAuth.widgetNum[moduleName] === undefined) {
                    callback(moduleName, 0); //回调
                }
            });
        }

    },

    checkRowSort: function($elem, $holder) {
        if ($elem.parent().attr("class") != $holder.parent().attr("class")) {
            return "布局行不允许在页头、内容区、页脚之间拖动";
        }
    },

    checkSort: function($elem, $holder) {
        // 检测宽度
        var error = moduleAuth.checkWidth($elem, $holder);
        if (error) return error;

        // 检测位置
        error = moduleAuth.checkPosition($elem, $holder);
        if (error) return error;

        //检测数目
        error = moduleAuth.checkCount($elem);
        if (error) return error;
    },

    checkWidth: function($elem, $holder) {
        var requiredW = $elem.find(".view").attr("data-w"); // data-w在VIEW层

        if (requiredW) {
            var $col = $holder.parent(".column");
            var columnw = $col.css("width");

            if ($col.parent().hasClass("wfullscr") && requiredW.indexOf("full") != -1) {
                return;
            }
            if (requiredW.indexOf(columnw) == -1)
                return "此模块要求宽度满足:" + requiredW.replace("full", "通栏");
        }
    },
    checkCount: function($elem) {
        var maxC = $elem.find(".view").attr("data-c");

        if (maxC) {
            var componentid = $elem.find("div[data-componentid]").attr("data-componentid");
            return moduleAuth.widgetNum[componentid] >= parseInt(maxC) ? "已经达到该模块最大展现数目:" + maxC + "个" : "";
        }
    },
    checkPosition: function($elem, $holder) {
        var requiredP = $elem.find(".view").attr("data-p"); // data-p在VIEW层
        if (requiredP) {
            var $targetDemo = $holder.parents(".demo");

            var arrP = requiredP.split(",");
            for (var i = 0; i < arrP.length; i++) {
                if ($targetDemo.hasClass(arrP[i])) return;
            }

            return "此模块要求放置在页面的" + requiredP.replace("demo_h", "页头").replace("demo_f", "页脚").replace("demo_c", "内容") + "位置";
        }
    }
};
