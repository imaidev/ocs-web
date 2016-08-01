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

    $.fn.selectalbum = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);
        })
        if (operr) return operr;

        return this;
    };

    //设置显示的内容
    var render = function ($widget, dataval, renderType) {
        var wit = $widget.closest('.column').width();
        var opts = "";

        if (renderType == "run") {
            if (wit >= 1210) {
                opts = $.extend({}, $.fn.selectalbum.defaults, dataval, g_data_widget[$widget.attr("id")]);
            } else {
                opts = $.extend({}, $.fn.selectalbum.defaultsless, dataval, g_data_widget[$widget.attr("id")]);
            }
        }
        else {
            if (wit >= 1210) {
                opts = $.extend({}, $.fn.selectalbum.defaults, dataval);
            } else {
                opts = $.extend({}, $.fn.selectalbum.defaultsless, dataval);
            }
        }


        // 相册横向显示
        if (opts.showStyle == "0") {
            $widget.find("#shop-picCons-hor").show();
            $widget.find("#shop-picCons").hide();
            var strC = [];
            strC.push(" <ul style='width:100%; left: 0px; position: relative; overflow: hidden; padding: 0px; margin: 0px;'> ");
            for (var i = 0; i < opts.imgs.length; i++) {
                strC.push(" <li> ");
                if (null == opts.imgs[i].coverurl || "" == opts.imgs[i].coverurl || undefined == opts.imgs[i].coverurl) {
                    strC.push(" <div class='shopAlbumimg'><a  href='/static/design/cfg/cfgselectalbumdetail.html?srcurl=", opts.imgs[i].resid, "'   target='_blank'> <img src='/static/design/img/defaultAlbumPicture.jpg' alt=", opts.imgs[i].resname, "  height='190' width='190' style='display: inline;'></a></div>");
                } else {
                    strC.push(" <div class='shopAlbumimg'><a  href='/static/design/cfg/cfgselectalbumdetail.html?srcurl=", opts.imgs[i].resid, "'   target='_blank'> <img src=", opts.imgs[i].coverurl, " alt=", opts.imgs[i].resname, "  height='190' width='190' style='display: inline;'></a></div>");
                }
                strC.push(" <div class='shopAlbumname fm1'>", opts.imgs[i].resname, "</div>");
                strC.push(" </li>");
            }
            strC.push(" </ul> ");
            $widget.find(".shopAlbumBd").html(strC.join(''));
            $widget.find('#shopAlbum').slide(opts);
        }
            // 相册纵向显示
        else if (opts.showStyle == "1") {
            //if (renderType != "run") {
            $widget.find("#shop-picCons").show();
            $widget.find("#shop-picCons-hor").hide();
            // 竖向相册展示
            var strVer = [];
            var strResIds = [];
            // 竖向相册
            for (var i = 0; i < opts.imgs.length; i++) {
                if (i == 0) {
                    strVer.push(' <li class="hover"> ');
                } else {
                    strVer.push(' <li> ');
                }

                if (null == opts.imgs[i].coverurl || "" == opts.imgs[i].coverurl || undefined == opts.imgs[i].coverurl) {
                    strVer.push(' <img width="130" height="95" alt="商品名称" src="/static/design/img/defaultAlbumPicture.jpg" /> ');
                } else {
                    strVer.push(' <img id="img' + opts.imgs[i].resid + '" width="130" height="95" alt="' + opts.imgs[i].resname + '" src="/static/design/img/defaultAlbumPicture.jpg" /> ');

                }
                strVer.push(' </li> ');
                if (opts.imgs[i].resid != "") {
                    strResIds.push(opts.imgs[i].resid);
                }
            }
            $widget.find("#pic-list").find(".pic-list-bd ul").html(strVer.join(''))

            if (strResIds.length != 0) {
                var detailAlbum = [];
                $.ajax({
                    url: ctx + "/design/dataAPI/base/resDataApi.do?method=getAllBaseInfoList&parentResIds=" + strResIds.join(','),
                    type: "POST",
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        if (json.list.length >= 0) {
                            for (var i = 0; i < strResIds.length; i++) {
                                detailAlbum.push('<div class="pic-Content"><div class="pic-scroll"><div class="scrollBd"><ul>');
                                var count = 0;
                                for (var j = 0; j < json.list.length; j++) {
                                    if (strResIds[i] == json.list[j].PARENT_RES_ID) {
                                        detailAlbum.push('<li><img src="' + json.list[j].RES_ADDR + '" /></li>');
                                        if (count == 0 || json.list[j].IS_COVER == '1') {
                                            $widget.find("#img" + strResIds[i]).attr("src", json.list[j].RES_ADDR);
                                        }
                                        count++;
                                    } else {
                                        count = 0;
                                    }
                                }
                                detailAlbum.push('</ul></div><a class="pic-prev" href="javascript:void(0)"><em></em></a><a class="pic-next" href="javascript:void(0)"><em></em></a>');
                                detailAlbum.push('</div></div>');
                            }
                        }
                        $widget.find("#shop-picCons").find("#pic-Contents").html("").html(detailAlbum.join(''));
                        if (strResIds.length > 0) {
                            $widget.find("#pic-Contents").find(".pic-Content").hide().eq(0).show();
                        }
                    },
                    error: function (t, e, o) {
                        alert("相册调取异常");
                    }
                });
            }

            $widget.find("#pic-list").slide({
                mainCell: ".pic-list-bd ul",
                autoPage: true,
                effect: "top",
                autoPlay: false,
                scroll: "1",
                vis: "3",
                prevCell: ".list-prev",
                nextCell: ".list-next",
                easing: "swing",
                delayTime: "500",
                pnLoop: false,
                trigger: true,
                mouseOverStop: "click"
            });
            $widget.find(".pic-scroll").slide({
                mainCell: ".scrollBd ul",
                autoPlay: true,
                prevCell: ".pic-prev",
                nextCell: ".pic-next"
            });
            $widget.find("#pic-list").find(".pic-list-bd li").click(function () {
                $(this).addClass("hover").siblings().removeClass("hover");
                $widget.find("#pic-Contents").find(".pic-Content").hide().eq($widget.find("#pic-list").find(".pic-list-bd li").index(this)).show();
            })
        }
    }

    $.fn.selectalbum.defaultsless = {
        mainCell: ".shopAlbumBd ul",
        autoPage: true,
        effect: "left",
        autoPlay: true,
        scroll: "1",
        vis: "3",
        easing: "swing",
        delayTime: "500",
        pnLoop: false,
        trigger: true,
        mouseOverStop: "click",
        showStyle: "1"
    };
    $.fn.selectalbum.defaults = {
        mainCell: ".shopAlbumBd ul",
        autoPage: true,
        effect: "left",
        autoPlay: true,
        scroll: "1",
        vis: "4",
        easing: "swing",
        delayTime: "500",
        pnLoop: false,
        trigger: true,
        mouseOverStop: "click",
        showStyle: "1"
    };
})(jQuery)