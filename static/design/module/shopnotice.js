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

    $.fn.shopnotice = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };
    var render = function ($widget, dataval) {
        var opts = $.extend({}, $.fn.shopnotice.defaults, dataval);

        var vurl =ctx+opts.vistorurl + '&vend_id=' + g_vendid + '&type=' + opts.type + '&NOTICE_SCOPE=03';
        var html = '', start = '<ul>', end = '</ul>';
        var j = 0;
        var intSpeed = 0;
        if (opts.showmarquee == 'true') { intSpeed = 500; } else { intSpeed = 1000 * 60 * 60 * 24; }

        $.ajax({
            url: vurl,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                var prefix = data.prefix;
                $(data.item).each(function (i) {
                    var tmp = '';// /ecweb[/lysc/]notice/showNoticeInfo.htm?NOTICE_ID=2016011614242751612042
                    tmp = '<li><a href=\'' + ctx + '/' + prefix + '/notice/showNoticeInfo.htm?NOTICE_ID=' + this.NOTICE_ID + '\' target=\'_blank\'>' + this.NOTICE_TITLE + '</a></li>';
                    html = html + tmp;//+'<br>'
                    j = (i + 1);
                });
                $widget.find('.divMContainer > :eq(1)').removeClass("p10 ba").html('');
                if (html != '') {
                    $widget.find('.divMContainer > :first').html(start + html + end);
                    if (j > 2) {
                        $widget.find('.divMContainer > :eq(1)').addClass("p10 ba").html('');
                        JS_Marquee($widget.find('.divMContainer'), $widget.find('.divMContainer > :first'), $widget.find('.divMContainer > :eq(1)'), intSpeed);
                    }
                } else {
                    $widget.find('.divMContainer > :first').html('暂无信息!');
                }
            }
        })
    }//-------------------render end---------------------------------------

    //----------------方式1 start---------------------------------------------
    var JS_Marquee = function (ContainerId, TContentId, BContentId, intSpeed) {
        var objMContainer = ContainerId[0];//document.getElementById(ContainerId);
        var objMTContent = TContentId[0];//document.getElementById(TContentId);
        var objMBContent = BContentId[0];//document.getElementById(BContentId);

        var interIndex = ContainerId.data("myInter");

        if (intSpeed == 1000 * 60 * 60 * 24) { clearInterval(interIndex); }
        objMBContent.innerHTML = objMTContent.innerHTML;
        interIndex = setInterval(function () {
            Marquee(objMContainer, objMTContent, objMBContent)
        }, intSpeed);
        ContainerId.data("myInter", interIndex);

        objMContainer.onmouseover = function () {
            clearInterval(ContainerId.data("myInter"));
        };

        objMContainer.onmouseout = function () {
            var interIndex = setInterval(function () {
                Marquee(objMContainer, objMTContent, objMBContent)
            }, intSpeed);
            ContainerId.data("myInter", interIndex);
        };
    }
    var Marquee = function (objMContainer, objMTContent, objMBContent) {
        if (objMBContent.offsetTop - objMContainer.scrollTop <= 45) {
            objMContainer.scrollTop -= objMTContent.offsetHeight;
        } else {
            objMContainer.scrollTop++;
        }
    }
    //----------------方式1 end--------------------------------------

    $.fn.shopnotice.defaults = {
        type: "01",//店铺公告
        vistorurl: '/base/promotion/design/notice.do?method=getShopNotices',
        showmarquee: "false"
    }
})(jQuery)