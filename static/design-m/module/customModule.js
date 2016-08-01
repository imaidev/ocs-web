(function($) {
    var g = {
        config: function($el) {},
        reset: function($el, opts) {},
        run: function($el) {},
        init: function($el) {
            moduleTool.init($el, render);
        }
    };

    $.fn.customModule = function(oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function() {
            operr = g[oper]($(this), opts);
            if (operr) return false;
        });
        if (operr) return operr;

        return this;
    };

    var render = function($widget, dataval, renderType) {
        var opts = $.extend({}, $.fn.customModule.defaults, dataval);

        $widget.find(".defineEditBox").delegate(".unedit", "click", function(e) {
            e.stopPropagation();
            selectElem($widget.parents('.module-wrap'));

            if ($widget.find(".edit").length === 0) { //没有拖动块时，可以激活编辑块
                activeMod($widget, $(this));
            }
        });

        $widget.find(".defineEditBox").delegate(".unedit a", "click", function(e) { //防止点击a标签后跳转
            e.preventDefault();
        });

        $widget.find(".defineEditBox").delegate(".delModule", "click", function(e) { //删除编辑块
            e.stopPropagation();

            $(this).parent().remove();
        });

        $widget.find(".defineEditBox").delegate(".edit", "dblclick", function(e) { //双击拖动块 转换为编辑块
            e.stopPropagation();

            $(this).draggable('destroy');
            $(this).resizable('destroy');

            activeMod($widget, $(this));
        });

        $widget.click(function(e) { //组件处于没有拖动块的状态时，点击组件激活网格，检测是否有拖动块，不存在则添加
            e.stopPropagation();
            selectElem($widget.parents('.module-wrap'));

            if (!$widget.find(".defineBox").hasClass("boxInEdit")) {
                if ($widget.find('.edit').length === 0) {
                    if (!addDragBlock($widget)) //插入拖动快失败 则返回
                        return;
                }

                $widget.find(".defineBox").addClass("boxInEdit");

                removeActiveEdit($widget);
                //切换配置框
                loadOriginCfg();

                activeDrag($widget);
            }
        });

        $('#phone-box').click(function() {
            $widget.find(".defineBox").removeClass("boxInEdit");
            $widget.find(".edit").remove();
            removeActiveEdit($widget);
        });

        activeDrag($widget);
    };


    function removeActiveEdit($widget) {
        $widget.find(".active").removeClass('active');
        $widget.find(".delModule").remove();
    }
    //激活拖动块
    function activeDrag($widget) {
        $widget.find(".edit").draggable({
            containment: 'parent',
            grid: [38, 38],
        });

        $widget.find(".edit").resizable({
            containment: 'parent',
            minWidth: 76,
            minHeight: 76,
            handles: 'se',
            grid: [38, 38],
        });
    }

    //激活编辑快
    function activeMod($widget, $mod) {
        $widget.find(".defineBox").removeClass("boxInEdit");

        $mod.siblings('.unedit').removeClass('active').find(".delModule").remove();
        if ($mod.hasClass('edit')) {
            $mod.empty();
        }


        $mod.removeClass('edit delSelf').addClass("unedit active");
        if ($mod.find("a").length === 0) {
            $mod.append('<a><img height="100%" width="100%"></a>');
        }
        if ($mod.find(".delModule").length === 0) {
            $mod.append('<div class="delModule"></div>');
        }

        //配置框变更
        loadPicCfg();
    }

    function addDragBlock($widget) {
        $otherRect = $widget.find(".unedit");

        var h = parseInt($widget.find(".boxContainer").css('height')) / 38;

        for (var i = 0; i <= h - 2; i++) {
            for (j = 0; j <= 6; j++) {
                var left = j * 38,
                    top = i * 38;
                var rect = [{
                    x: left,
                    y: top,
                }, {
                    x: left + 76,
                    y: top + 76
                }];

                if (!isCollision(rect, $otherRect)) {
                    var arr = [];
                    arr.push('<div class="edit delSelf" style="left: ', left, 'px;top: ', top, 'px;position: absolute;width: 76px;height: 76px;transition: all 0.1s;">');
                    arr.push('<p style="font-size: 16px;font-family: \'microsoft yahei\';">请双击确认位置选择</p></div>');
                    $widget.find('.defineEditBox').prepend(arr.join(""));

                    return true;
                }
            }
        }

        return false;
    }

    function isCollision(rect, $otherRect) {
        if ($otherRect.length === 0) return false;


        var isCollision = false;
        $otherRect.each(function() {
            var otherRect = [{
                x: parseFloat($(this).css("left")),
                y: parseFloat($(this).css("top"))
            }, {
                x: parseFloat($(this).css("left")) + parseFloat($(this).css("width")),
                y: parseFloat($(this).css("top")) + parseFloat($(this).css("height"))
            }];


            if (rect[0].x >= otherRect[0].x && rect[1].x <= otherRect[1].x &&
                rect[0].y >= otherRect[0].y && rect[1].y <= otherRect[1].y) { //被包含
                isCollision = true;
                return false;
            } else if ((rect[0].x < otherRect[0].x && rect[1].x <= otherRect[0].x) ||
                (rect[0].x >= otherRect[1].x && rect[1].x > otherRect[1].x)) { //x不相交
                return true;
            } else if ((rect[0].y < otherRect[0].y && rect[1].y <= otherRect[0].y) ||
                (rect[0].y >= otherRect[1].y && rect[1].y > otherRect[1].y)) { //y不相交
                return true;
            } else {
                isCollision = true;
                return false;
            }

        });

        return isCollision;
    }

    function loadOriginCfg() {
        $("#customModule").show();
        $("#customModuleEdit").hide();
    }

    function loadPicCfg() {
        $("#customModule").hide();
        $("#customModuleEdit").show();

        loadActive(_$module.find("div.active"));
    }

    $.fn.customModule.defaults = {};
})(jQuery);
