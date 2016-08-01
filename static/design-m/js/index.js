//当前选中的组件及其配置
var _$module, _cfg;
//模板引擎
var bt = baidu.template;

function randomNumber() {
    return randomFromInterval(1, 1e7);
}

function randomFromInterval(e, t) {
    var timestamp = new Date().getTime();
    var ran = Math.floor(Math.random() * (t - e + 1) + e);
    return timestamp + '' + ran;
}

function delegateRemoveElm() {
    $(".container").delegate(".del", "click", function(e) {
        e.preventDefault();

        $(this).parent().parent().remove();
        moduleAuth.calWidgetNum(moduleCountsCallback);

        hideEdit();
    });
}

function delegateUpElm() {
    $(".container").delegate(".up", "click", function(e) {
        e.preventDefault();

        var $elem = $(this).parent().parent();

        $elem.after($elem.prev());
        loadElemButtons();
    });
}

function delegateDownElm() {
    $(".container").delegate(".down", "click", function(e) {
        e.preventDefault();

        var $elem = $(this).parent().parent();
        $elem.next().after($elem);
        loadElemButtons();
    });
}

function hideEdit() {
    $("#design-edit").hide();
    $(".container").find('.module-wrap-active').find(".button-box").remove();
    $(".container").find('.module-wrap').removeClass('module-wrap-active');

    $("#phone-box").removeClass('phone-box-moveL');
}

function showEdit() {
    $("#design-edit").show();
    $("#phone-box").addClass('phone-box-moveL');
}

function delegateSelectElm() {
    $(".container").delegate(".module-wrap", "click", function(e) {
        e.preventDefault();

        selectElem($(this));
    });
}

function selectElem($this) {
    if ($this.hasClass('module-wrap-active')) return;


    $(".container").find('.module-wrap').removeClass('module-wrap-active');
    $this.addClass('module-wrap-active');

    loadElemButtons();

    // 加载配置项
    if (typeof BAK_ID == "undefined") {
        _$module = $this.find("div[data-componentid]");
        var componentname = _$module.attr("data-componentid");
        try {
            _cfg = _$module[componentname]('config');
        } catch (e) {
            _cfg = {};
        }

        $.get("/static/design-m/cfg/cfg" + componentname + ".html" + "?rnd=" + new Date().getTime(), function(data) {
            $('#edit-wrap').html(data);
            showEdit();
        }).error(function() {
            $('#edit-wrap').html("");
            showEdit();
        });
    }
}

//加载按钮
function loadElemButtons() {
    var $elem = $(".container").find('.module-wrap-active');

    $(".container").find('.button-box').remove();

    //店铺页头/页尾的组件不显示按钮
    if (!$elem.parent().hasClass('column')) return;

    var $buttons = $("#buttonContainer").find(".button-box").clone();
    if ($elem.prevAll().length === 0) {
        $buttons.find(".up").remove();
    }
    if ($elem.nextAll().length === 0) {
        $buttons.find(".down").remove();
    }
    $elem.prepend($buttons);
}

function setColumnSortable() {
    $(".container .column").sortable({
        connectWith: ".column", //允许排序列表连接另一个排序列表，将条目拖动至另一个列表中去
        opacity: 0.35,
        //handle: ".drag", 移动端整体拖拽
        tolerance: "pointer",
        placeholder: "holderCss",
        start: function(event, ui) {},
        sort: function(event, ui) {
            var errStr = moduleAuth.checkSort(ui.item, ui.placeholder);
            if (errStr) {
                ui.placeholder.removeClass("holderCss").addClass("holderCssInvaild").html("<span>" + errStr + "</span>");
            } else {
                ui.placeholder.removeClass("holderCssInvaild").addClass("holderCss").html("<span>松开鼠标在此处添加模块</span>");
            }
        },
        stop: function(event, ui) {
            if (ui.placeholder.hasClass("holderCssInvaild")) {
                if ($(ui.item.context).parent().hasClass('module-list')) {
                    //draggable与sortable
                    ui.item.remove();
                } else {
                    //sortable之间
                    $(this).sortable('cancel');
                }

                return;
            }
            ui.item.find(".view").removeAttr("data-c");

            //拖动后组件重新选中组件
            loadElemButtons();

            moduleAuth.calWidgetNum(moduleCountsCallback);
        }
    });
}

function setBoxDrag() {
    $("#desgTool .module-wrap").draggable({
        connectToSortable: ".column", //只允许被拖拽到column中
        helper: "clone",
        //handle: ".drag,.draghandle",移动端整体拖拽
        appendTo: ".main-wrap",
        zIndex: 1002,
        start: function(e, t) {
            //以下 hack scroll 使组件能使container滚动条滚动
            $(this).data("ui-draggable").scrollParent[0] = $("#phone-box")[0];
            $(this).data("ui-draggable").overflowOffset = $("#phone-box").offset();
        },
        drag: function(e, t) {},
        stop: function(e, t) {
            //生成wigetId
            var elems = $(".container .view").children();
            elems.each(function(i, elem) {
                if ($(elem).attr("data-componentid") && !$(elem).attr("id")) {
                    var elid = randomNumber();
                    $(elem).attr("id", elid);
                    $(elem).parent().siblings().remove();
                    //组件初始化
                    try {
                        $("#" + elid)[$(elem).attr("data-componentid")]();
                    } catch (e) {}

                }
            });
        }
    });
}

function beforeSave() {
    $('#phone-box').click(); //清除编辑状态的自定义区

    //自定义区定义的px转为rem
    $("div[data-componentid='customModule']").find(".unedit").each(function() {
        $(this).css({
            width: parseInt($(this).css('width')) / 100 + "rem",
            height: parseInt($(this).css('height')) / 100 + "rem",
            left: parseInt($(this).css('left')) / 100 + "rem",
            top: parseInt($(this).css('top')) / 100 + "rem",
        });
    });
}



//渲染组件数目
function moduleCountsCallback(moduleName, moduleCounts) {
    $("#desgTool div[data-componentid=" + moduleName + "]").parent().parent().find('span.counts').text(moduleCounts);
}

$(document).ready(function() {
    //计算组件数目
    moduleAuth.calWidgetNum(moduleCountsCallback);
    //组件初始化
    $(".container .view>div").each(function() {
        if ($(this).attr("data-componentid")) {
            try {
                $(this)[$(this).attr("data-componentid")]();
            } catch (e) {
                console.log(e);
            }

        }
    });

    setColumnSortable();
    setBoxDrag();

    delegateSelectElm();
    delegateRemoveElm();
    delegateUpElm();
    delegateDownElm();
});

function getWidgetData() {
    var widget_data = {
        demo_h: [],
        demo_c: [],
        demo_f: []
    };
    $('.container').find("div[data-componentid]").each(function() {
        if (typeof $(this).data("data-val") == "object")
            widget_data.demo_c.push({
                "id": $(this).attr("id"),
                "cid": $(this).attr("data-componentid"),
                "data-val": JSON.stringify($(this).data("data-val"))
            });
    });

    return JSON.stringify(widget_data);
}


$(function() {
    setConH();
    $(window).resize(function() {
        setConH();
    });
    var topH = $('#design-header').height();
    $("#desgTool").css('top', -topH);

    /***保存按钮点击下拉***/
    $(".dropdown-save").click(function(e) {
        var $this = $(this);
        var dMenu = $this.find('.dropdown-menu');
        var dMenuF = dMenu.css('display');
        if (dMenuF == 'none') {
            dMenu.css('display', 'block');
        } else {
            dMenu.css('display', 'none');
        }
        e.stopPropagation();
    });
    $('body').click(function() {
        if ($(".dropdown-save").find('.dropdown-menu').css('display') == 'block') {
            $(".dropdown-save").find('.dropdown-menu').css('display', 'none');
        }
    });

});



function setConH() {
    var winH = $(window).height();
    var topH = $('#design-header').height();
    var handerH = $(".handler-wrap").height();
    $("#designCon").css('height', winH);
    $("#design-main").css('height', winH - topH);
    $("#edit-wrap").css('height', winH - topH - handerH);
}


//链接小工具
function showLinkWin(callback) {
    layer.open({
        type: 2,
        content: '/static/design-m/cfg/linktool.html?callback=' + callback,
        title: "链接小工具",
        shadeClose: true,
        area: ['1000px', '600px']
    });
}

//图片小工具
function showPicWin(callback) {
    opt = {
        "dir": "shop",
        "maxuploadsize": "2M",
        "callBack": callback
    };
    layer.open({
        type: 2,
        content: parent.ctx + "/res/tu/ResSelect.htm?dir=" + opt.dir + "&maxuploadsize=" + opt.maxuploadsize + "&callback=" + opt.callBack,
        title: "图片小工具",
        shadeClose: true,
        area: ['750px', '660px']
    });
}

//商品小工具
function showItemWin(callback) {
    var item = "1";
    layer.open({
        type: 2,
        content: '/static/design-m/cfg/itemtool.html?callback=' + callback,
        title: "商品小工具",
        shadeClose: true,
        area: ['1000px', '500px']
    });
}

//检测input长度
function obInputLength(obj) {
    var val = $(obj).val();
    var maxlength = $(obj).next().text().substring($(obj).next().text().indexOf("/") + 1);

    if (val.length > maxlength) {
        $(obj).addClass("beyond");
    } else {
        $(obj).removeClass("beyond");
    }

    $(obj).next().text(val.length + "/" + maxlength);
}

//组件没有数据时设置占位图片，隐藏组件
function setNoData($module) {
    var $modulewrap = $module.parents('.module-wrap');
    $modulewrap.addClass("delWhenRelease");
    $modulewrap.find(".view>div").hide();
    if ($modulewrap.find("div.nodatapic").length === 0) {
        $modulewrap.append('<div class="nodatapic delSelf"><img width="100%" src="/static/design-m/img/nodata.png"></div>');
    }
}

//组件有数据时取消占位图片，显示组件
function setHasData($module) {
    var $modulewrap = $module.parents('.module-wrap');
    $modulewrap.removeClass("delWhenRelease");
    $modulewrap.find("div.nodatapic").remove();
    $modulewrap.find(".view>div").show();
}
