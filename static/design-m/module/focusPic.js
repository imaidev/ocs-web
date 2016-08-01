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

    $.fn.focusPic = function(oper, opts) {
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
        var opts = $.extend({}, $.fn.focusPic.defaults, dataval);

        $widget.empty();

        if (opts.imgs.length > 0) {
            var domArr = [];
            domArr.push('<div class="hd">');
            domArr.push('<ul></ul>');
            domArr.push('</div>');
            domArr.push('<div class="bd">');
            domArr.push('<ul>');
            opts.imgs.forEach(function(item) {
                domArr.push('<li><a', (item.href ? ' href="' + item.href + '"' : ''), '><img src="', item.src, '" src="/static/design-m/img/blank.png" /></a></li>');
            });
            domArr.push('</ul>');
            domArr.push('</div>');

            $widget.html(domArr.join("")).show();

            opts.slideCell = "#" + $widget.attr("id");
            TouchSlide(opts);

            if (renderType != "run") { //有图片且非运行状态取消显示无数据图片
                setHasData($widget);
            }
        } else if (renderType != "run") { //无图片且非运行状态显示无数据图片
            setNoData($widget);
        }
    };


    $.fn.focusPic.defaults = {
        imgs: [], //{href:"",src:"/static/design/img/banner1.jpg"},{

        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: ".bd ul",
        effect: "leftLoop",
        autoPlay: true, //自动播放
        autoPage: true, //自动分页
        switchLoad: "_src" //切换加载，真实图片路径为"_src"
    };
})(jQuery);
