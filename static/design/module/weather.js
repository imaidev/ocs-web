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
        }
    };

    $.fn.weathermodule = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };

    var render = function ($widget, dataval, type) {
        var opts = $.extend({}, $.fn.weathermodule.defaults, dataval);

        var cityUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
        $.getScript(cityUrl, function (script, textStatus, jqXHR) {
            var citytq = remote_ip_info.city;// 获取城市remote_ip_info.city
            var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + citytq + "&day=0&dfc=3";
            $.ajax({
                url: url,
                dataType: "script",
                scriptCharset: "gbk",
                success: function (data) {
                    var _w = window.SWther.w[citytq][0];
                    var tq, img;

                    //判断天气样式
                    if ("1" == opts.weatherStyle) {
                        tq = "<div class='weather1' style='background-color:white;'><p style='line-height:50px;text-align: center;'><span>" + citytq + "</span>&nbsp;&nbsp;&nbsp;<span>" + _w.s1 +
                				"</span>&nbsp;&nbsp;&nbsp;<span>" + _w.t1 + "℃-" + _w.t2 + "℃</span>&nbsp;&nbsp;&nbsp;<span>" + _w.d1 + "</span></p></div>";
                    } else if ("2" == opts.weatherStyle) {
                        img = "<img class='vm' height='22' width='32' alt='" + _w.d1 + "' src='http://0.ss.faisys.com/image/site/weather/" + _w.f1 + "1.png' />";
                        tq = "<div class='weather1' style='background-color:white;'><p style='line-height:50px;text-align: center;'><span>" + citytq + "</span>&nbsp;&nbsp;&nbsp;<span>" + img +
                               "</span>&nbsp;&nbsp;&nbsp;<span>" + _w.t1 + "℃-" + _w.t2 + "℃</span>&nbsp;&nbsp;&nbsp;<span>" + _w.d1 +
                               "</span>&nbsp;&nbsp;&nbsp;<span>" + _w.p1 + " 级</span></p></div>";
                    } else {
                        img = "<img class='vm' height='70' width='80' alt='" + _w.d1 + "' src='http://0.ss.faisys.com/image/site/weather/" + _w.f1 + "11.png' />";
                        tq = "<div class='weather1' style='background-color:white;'><table width='240px' class='weather3' style='text-align: center;'><tr><td width='40%' rowspan='2'>" + img +
                               "</td><td width='60%'><span>" + citytq + "</span>&nbsp;&nbsp;&nbsp;<span class='f18' style='color:#f00;'>" + _w.t1 +
                               "℃</span></td></tr><tr><td width='60%'><span>" + _w.s1 + "</span>&nbsp;&nbsp;&nbsp;<span>" + _w.d1 + "</span></td></tr></table></div>";
                    }
                    $widget.find(".addw").html(tq);
                }
            });
        });
    }


    $.fn.weathermodule.defaults = {

    };
})(jQuery)
