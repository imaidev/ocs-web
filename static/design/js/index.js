function randomNumber() {
    return randomFromInterval(1, 1e7);
}

function randomFromInterval(e, t) {
    var timestamp = new Date().getTime();
    var ran = Math.floor(Math.random() * (t - e + 1) + e);
    return timestamp + '' + ran;
}

function removeElm() {
    $(".demo,.freelayer").delegate(".remove", "click", function(e) {
        e.preventDefault();

        $(this).parent().parent().remove();
        if ($(".demo .lyrow").length === 0) {
            clearDemo();
        }

        $(this).parent().parent().find("div[data-componentid]").each(function() {
            var id = $(this).attr("id");
            $('div[data-ref=' + id + ']').remove();
        });

        moduleAuth.calWidgetNum();
    });
}

function clearDemo() {
    $(".demo_c,.demo_c_free").find("div[data-componentid]").each(function() {
        var id = $(this).attr("id");
        $('div[data-ref=' + id + ']').remove();
    });
    $(".demo_c,.demo_c_free").empty();
}

function setResizeable() {
    if (g_scene == 3) return;

    $(".demo .screenL").each(function() {
        var revesid = '#' + $(this).attr("revesid");
        var rightColChain = [];
        rightColChain.push($(this).siblings().attr("id")); //右侧id链  初值为screenR的id

        function getRevesid($leftCol) {
            if (!$leftCol.length) return;

            var $rightCol = $leftCol.siblings();

            if (rightColChain.indexOf($rightCol.parents(".screenR").first().attr("id")) != -1) {
                revesid = revesid + ",#" + $leftCol.attr("revesid");
                rightColChain.push($rightCol.attr("id"));
                getRevesid($leftCol.siblings().find(".screenL").first());
            }
        }

        getRevesid($(this).siblings().find(".screenL").first());

        $(this).resizable({
            reverseResize: revesid,
            minWidth: 150,
            maxWidth: 1060,
            handles: "e",
            stop: function(event, ui) {
                resetResizeable();
                reRenderModule($(this).parent());
            },
            resize: function(event, ui) {

            }
        });
    });

    //screenR在拖出容器后 再拖回来会发生宽度不对的情况 此时重设width
    showWidth();
}

function resetResizeable() {
    if (g_scene == 3) return;

    removeResize();
    $(".demo .screenR").each(function() {
        $(this).attr("preset-marginL", $(this).css("margin-left"));
    });

    setResizeable();
}

function removeResize() {
    if (g_scene == 3) return;

    try {
        $(".demo .screenL").resizable("destroy");
    } catch (e) {}
}

function patchZIndex() {
    //防止拖动后jquery ui将z-index置为0
    $(".demo .lyrow").css("z-index", "1");
    $(".demo .box").css("z-index", "1");
    $(".demo .column").css("z-index", "1");
    $(".demo .lyrow").each(function() {
        if ($(this).find(".custPosition").length > 0 || $(this).find("div[data-componentid='portalchannel']").length > 0 || $(this).find("div[data-componentid='shopchannel']").length > 0 || $(this).find("div[data-componentid='logoconfiguration']").length > 0 || $(this).find("div[data-componentid='siteNavmodule']").length > 0) {
            $(this).css("z-index", "2"); //自定义定位后的父z-index重设置
        }
    });
    $(".demo .column").each(function() {
        if ($(this).find(".custPosition").length > 0 || $(this).find("div[data-componentid='portalchannel']").length > 0 || $(this).find("div[data-componentid='mallchannel']").length > 0 || $(this).find("div[data-componentid='shopchannel']").length > 0 || $(this).find("div[data-componentid='logoconfiguration']").length > 0) {
            $(this).css("z-index", "2"); //自定义定位后父z-index重设置
        }
        if ($(this).find("div[data-componentid='siteNavmodule']").length > 0) {
            $(this).css("z-index", "3"); //顶部功能区z-index重设置
        }
    });
    $(".demo .box").each(function() {
        if ($(this).find(".custPosition").length > 0) {
            $(this).css("z-index", "100"); //自定义定位后父z-index重设置
        }
        if ($(this).find("div[data-componentid='portalchannel']").length > 0 || $(this).find("div[data-componentid='shopchannel']").length > 0 || $(this).find("div[data-componentid='logoconfiguration']").length > 0) {
            $(this).css("z-index", "2"); //门户导航的父z-index重设置
        }
        if ($(this).find("div[data-componentid='siteNavmodule']").length > 0) {
            $(this).css("z-index", "3"); //顶部功能区z-index重设置
        }
    });
}

function showWidth() {
    //显示宽度
    $(".demo .screenR").css("width", "auto");
    $(".showwidth").each(function() {
        $(this).html($(this).parent().width() + "px");
    });
}

function setContainerSortable() {
    $(".demo").sortable({
        connectWith: ".demo", //布局块只能自己进行排序
        opacity: 0.35,
        tolerance: "pointer",
        greedy: true,
        handle: ".drag",
        placeholder: "holderCss",
        start: function(event, ui) {
            if (!ui.helper.parent().hasClass("sidebar-nav")) {
                ui.helper.css("margin", ui.placeholder.css("margin"));
            }
        },
        sort: function(event, ui) {
            var errStr = moduleAuth.checkRowSort(ui.item, ui.placeholder);
            if (!$(ui.item.context).parent().hasClass('content') && errStr) {
                ui.placeholder.removeClass("holderCss").addClass("holderCssInvaild").html("<span>" + errStr + "</span>");
            } else {
                ui.placeholder.removeClass("holderCssInvaild").addClass("holderCss").html("<span>松开鼠标在此处添加布局</span>");
            }
        },
        stop: function(event, ui) {
            if (ui.placeholder.hasClass("holderCssInvaild")) {
                $(this).sortable('cancel');
                return;
            }
            ui.item.find(".view").removeAttr("data-c");

            if (ui.helper) {
                ui.helper.css("margin", "");
            }
            if (ui.item) {
                ui.item.css("margin", "");
            }
            patchZIndex();
            setResizeable();
            showWidth();
            moduleAuth.calWidgetNum();
        }
    });
}

function setColumnSortable() {
    $(".demo .column").sortable({
        connectWith: ".column", //允许排序列表连接另一个排序列表，将条目拖动至另一个列表中去
        opacity: 0.35,
        handle: ".drag",
        tolerance: "pointer",
        placeholder: "holderCss",
        //scroll: false,
        start: function(event, ui) {
            if (ui.helper.parent().attr('id') != 'dragc') {
                ui.helper.parents('.lyrow').last().css('z-index', '4');
                ui.helper.parent('.column').css('z-index', '4');
            }
        },
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
                if ($(ui.item.context).parent().hasClass('content')) {
                    //draggable与sortable
                    ui.item.remove();
                } else {
                    //sortable之间
                    $(this).sortable('cancel');
                }

                return;
            }
            ui.item.find(".view").removeAttr("data-c");

            //拖动后组件重新渲染init
            reInitModule(ui.item);

            patchZIndex();
            setResizeable();
            showWidth();
            moduleAuth.calWidgetNum();
        }
    });
}
//拖动或者Resize后重新初始化部分组件
function reRenderModule($parent) { //以后废弃该方法，因为重新Init已经不再保存数据库，所以可以统一调用重新Init
    $parent.find("div[data-componentid='tablayout'][id]").tablayout('reRender');
    $parent.find("div[data-componentid='cubegallerymodule'][id]").cubegallerymodule('reRender');
    $parent.find("div[data-componentid='slidermodule'][id]").slidermodule('reRender');
}

function reInitModule($box) {
    var $elem = $box.find("div[data-componentid][id]");
    if ($elem.length > 0) {
        try {
            $elem[$elem.attr("data-componentid")]();
        } catch (e) {}
    }
}

function afterLyrowDrag() {
    //布局组件的preview拖动到demo中去后，重新设置column能够排序
    setColumnSortable();

    //生成左右SCREEN ID
    var scrR = $(".demo .view .screenR");
    scrR.each(function(i, elem) {
        if (!$(elem).attr("id")) {
            var id = "scrR" + randomNumber();
            $(elem).attr("id", id);
            $(elem).siblings().attr("revesid", id);

            $(".demo .screenR").css("width", "auto");
        }
    });

    // 显示column宽度
    showWidth();
    setResizeable();
}
var _sortablesArr = [];

function setLyrowDrag() {
    $(".sidebar-nav .lyrow").draggable({
        connectToSortable: ".demo", //允许被拖拽到demo中（.column因为clearfix问题被屏蔽）
        helper: "clone",
        handle: ".drag,.draghandle",
        appendTo: ".sidebar-nav",
        zIndex: 1002,
        start: function(e, t) {
            //$('#dragc').css('left',t.helper.parent().offset().left+"px").css('top',t.helper.parent().offset().top+"px").append(t.helper);
            _sortablesArr = $(this).data("ui-draggable").sortables;
            $(this).data("ui-draggable").sortables = [];

            //以下 hack scroll 使组件能使container滚动条滚动
            $(this).data("ui-draggable").scrollParent[0] = $(".container")[0];
            $(this).data("ui-draggable").overflowOffset = $(".container").offset();
        },
        drag: function(e, t) {
            t.helper.width(95); //设置从组件库中拖拽出的初始宽度
            t.helper.css("cursor", "move");
            if (parseInt(t.helper.css("left")) > 375) {
                $(".sidebar-nav .tool-bar .layout").css("left", "-285px");
                $(".sidebar-nav .tab-bar .selected").removeClass("selected");
                if ($(this).data("ui-draggable").sortables.length === 0) {
                    $(this).data("ui-draggable").sortables = _sortablesArr;
                    _sortablesArr = [];
                }
            }
        },
        stop: function() {
            afterLyrowDrag();
        }
    });
}

function setBoxDrag() {
    //浮动图片组件的父级box
    $(".sidebar-nav div[data-componentid='imgmoduleFloat']").parent().parent().addClass('floatPicBox');
    $('.floatPicBox').draggable({
        helper: "clone",
        handle: ".drag,.draghandle",
        appendTo: ".sidebar-nav",
        zIndex: 1002,
        start: function(e, t) {
            //以下 hack scroll 使组件能使container滚动条滚动
            $(this).data("ui-draggable").scrollParent[0] = $(".container")[0];
            $(this).data("ui-draggable").overflowOffset = $(".container").offset();
        },
        drag: function(e, t) {
            t.helper.width(95);
            t.helper.css("cursor", "move");
            if (parseInt(t.helper.css("left")) > 375) {
                t.helper.addClass("addedToDemo");

                $(".sidebar-nav .tool-bar .module").css("left", "-285px");
                $(".sidebar-nav .tab-bar .selected").removeClass("selected");
            }
        },
        stop: function(e, t) {

            //生成wigetId
            var elems = $(".demo .view,.demo_free .view").children();
            elems.each(function(i, elem) {
                if ($(elem).attr("data-componentid") && !$(elem).attr("id")) {
                    var elid = randomNumber();
                    $(elem).attr("id", elid);

                    //组件初始化
                    try {
                        $("#" + elid)[$(elem).attr("data-componentid")]();
                    } catch (e) {}

                }
            });

            resetResizeable();
        }
    });


    $('.demo').droppable({
        accept: ".floatPicBox",
        //activeClass: "ui-state-hover",
        //hoverClass: "ui-state-active",
        drop: function(event, ui) {
            if (!ui.helper.hasClass("addedToDemo")) {
                ui.helper.remove();
                return;
            }

            var $demo = $(this);
            var $demo_free;
            if ($demo.hasClass('demo_c')) {
                $demo_free = $('.demo_c_free');
            } else if ($demo.hasClass('demo_h')) {
                $demo_free = $('.demo_h_free');
            } else if ($demo.hasClass('demo_f')) {
                $demo_free = $('.demo_f_free');
            }

            var absolute_top = ui.helper.offset().top - $demo_free.offset().top;
            var absolute_left = ui.helper.offset().left - $demo_free.offset().left;

            var $box = ui.helper.clone();
            $box.appendTo($demo_free);
            $box.css({
                    "position": "absolute",
                    "top": absolute_top + "px",
                    "left": absolute_left + "px",
                    "margin-left": "",
                    "width": "150px"
                })
                .removeClass('floatPicBox')
                .addClass("custPosition");

            StyleTool.util.alertMsg("现在你可以自由拖动组件了，建议您切换到预览模式调整浮动组件位置");
            $box.draggable({});

            $box.resizable({
                handles: "e",
                stop: function(event, ui) {
                    reInitModule(ui.helper);
                }
            });

            addFix();
        }
    });

    $(".sidebar-nav .box:not(.floatPicBox)").draggable({
        connectToSortable: ".column", //只允许被拖拽到column中
        helper: "clone",
        handle: ".drag,.draghandle",
        appendTo: ".sidebar-nav",
        zIndex: 1002,
        start: function(e, t) {
            _sortablesArr = $(this).data("ui-draggable").sortables;
            $(this).data("ui-draggable").sortables = [];

            //以下 hack scroll 使组件能使container滚动条滚动
            $(this).data("ui-draggable").scrollParent[0] = $(".container")[0];
            $(this).data("ui-draggable").overflowOffset = $(".container").offset();
        },
        drag: function(e, t) {
            t.helper.width(95);
            t.helper.css("cursor", "move");
            if (parseInt(t.helper.css("left")) > 375) {
                $(".sidebar-nav .tool-bar .module").css("left", "-285px");
                $(".sidebar-nav .tab-bar .selected").removeClass("selected");
                if ($(this).data("ui-draggable").sortables.length === 0) {
                    $(this).data("ui-draggable").sortables = _sortablesArr;
                    _sortablesArr = [];
                }
            }
        },
        stop: function(e, t) {
            //生成wigetId
            var elems = $(".demo .view").children();
            elems.each(function(i, elem) {
                if ($(elem).attr("data-componentid") && !$(elem).attr("id")) {
                    var elid = randomNumber();
                    $(elem).attr("id", elid);

                    //组件初始化
                    try {
                        $("#" + elid)[$(elem).attr("data-componentid")]();
                    } catch (e) {}

                }
            });

            resetResizeable();
        }
    });
}


/*定位 固定 相关方法begin*/
function addFix() {
    //定位固定位置元素的补丁,使编辑模式下fixed的组件定位准确
    $(".positionFix").each(function() {
        if (!$(this).hasClass("positionFixed")) {
            var curml = parseInt($(this).css("margin-left"));
            $(this).css("margin-left", curml + 21);
            $(this).addClass("positionFixed");
        }
    });
}

function removeFix() {
    //定位固定位置元素的补丁,使预览模式下fixed的组件定位准确
    $(".positionFix").each(function() {
        if ($(this).hasClass("positionFixed")) {
            var curml = parseInt($(this).css("margin-left"));
            $(this).css("margin-left", curml - 21);
            $(this).removeClass("positionFixed");
        }
    });
}

function handleFixBeforeRelease() {
    //因为顶部两个工具栏的原因 固定浮动的元素需要减去122像素
    $(".positionFix").each(function() {
        $(this).css("top", parseInt($(this).css("top")) - 122);
    });

    if ($("body").hasClass("edit")) {
        removeFix();
    }
}

function handleFixAfterRelease() {
    $(".positionFix").each(function() {
        $(this).css("top", parseInt($(this).css("top")) + 122);
    });

    if ($("body").hasClass("edit")) {
        addFix();
    }
}
/*定位 固定 相关方法end*/

function setDemoWidthWithSidebar() {
    setFreelayer();

    $(".demo").css("width", $(window).width() - 78);
    $(".demo").css("left", "60px");
    $(".demo").css("margin-left", "");

    $(".freelayer").css("width", $(window).width() - 78);
    $(".freelayer").css("left", "60px");
    $(".freelayer").css("margin-left", "");

    addFix();
}

function setFreelayer() {
    if ($(".demo_h_free").length === 0) {
        $(".demo_h").before("<div class='freelayer' style='position: relative; z-index: 6; height: 0px;'><div class='demo_free demo_h_free' style='position: relative;width:1210px;margin:0 auto;border: none;'></div></div>");
    }
    if ($(".demo_c_free").length === 0) {
        $(".demo_c").before("<div class='freelayer' style='position: relative; z-index: 6; height: 0px;'><div class='demo_free demo_c_free' style='position: relative;width:1210px;margin:0 auto;border: none;'></div></div>");
    }
    if ($(".demo_f_free").length === 0) {
        $(".demo_f").before("<div class='freelayer' style='position: relative; z-index: 6; height: 0px;'><div class='demo_free demo_f_free' style='position: relative;width:1210px;margin:0 auto;border: none;'></div></div>");
    }
}

function setDemoWidthWithoutSidebar() {
    $(".demo").css("width", "");
    $(".demo").css("left", "");
    $(".demo").css("margin-left", "17px");

    $(".freelayer").css("width", "");
    $(".freelayer").css("left", "");
    $(".freelayer").css("margin-left", "17px");

    removeFix();
}

function resetModule() {
    setTimeout(function() {
        $(".demo div[data-componentid='slidermodule']").slidermodule('reset');
        $(".demo div[data-componentid='customAdModule']").customAdModule('reset');
    }, 1000);
}

//demo 统一配置
function cfg(opt) {
    var event = window.event || arguments.callee.caller ? arguments.callee.caller.arguments[0] : null;
    var $selEl;
    if (event) {
        $selEl = $(event.srcElement ? event.srcElement : event.target).parent().parent().siblings(".view").children();
        if ($selEl.length === 0) $selEl = $(event.srcElement ? event.srcElement : event.target).parent().siblings(".view").children();
    }

    $.get("/static/design/cfg/cfg" + opt + ".html"+ "?rnd=" + new Date().getTime(), function(data) {
        $('#CfgModal').html(data);
        cfgRead($selEl);
        $('#CfgModal').modal('show');
    });
}

$(document).ready(function() {
    $("body").css("min-height", $(window).height() - 90);
    $(".demo_c").css("min-height", $(window).height() - 300);
    setDemoWidthWithSidebar();
    $(".sidebar-nav[id!=dragc]").css("height", $(window).height() - 60);
    $(".arrowNavigation").css("height", $(window).height() - 60);
    $("body > .container").css("height", $(window).height() - 60);
    $(".sidebar-nav .tool-bar .inside .body").each(function() {
        $(this).css("height", $(this).parent().height() -
            $(this).siblings(".head").outerHeight(true) -
            $(this).siblings(".foot").outerHeight(true));
        $(this).children(".content0").css("height", $(this).height() - $(this).children(".anchor-content").last().outerHeight(true) - 16);
    });

    patchZIndex();
    resetResizeable();
    moduleAuth.calWidgetNum();
    //组件初始化
    $(".demo .view>div").each(function() {
        if ($(this).attr("data-componentid")) {
            try {
                $(this)[$(this).attr("data-componentid")]();
            } catch (e) {}

        }
    });

    setContainerSortable();
    setColumnSortable();
    setLyrowDrag();
    setBoxDrag();
    $(".container").click(function() {
        resetResizeable();
        //return false
    });

    removeElm();

    //临沂商城增加需求，检测内容区是否为空，为空则弹出提示框添加布局
    if ($(".demo_c").children().length === 0) {
        cfg('block');
    }
});

$(window).resize(function() {
    $("body").css("min-height", $(window).height() - 90);
    $(".demo_c").css("min-height", $(window).height() - 300);
    if ($('body').hasClass('edit')) {
        setDemoWidthWithSidebar();
    } else {
        setDemoWidthWithoutSidebar();
    }

    $(".arrowNavigation").css("height", $(window).height() - 60);
    $(".sidebar-nav[id!=dragc]").css("height", $(window).height() - 60);
    $("body > .container").css("height", $(window).height() - 60);
});


//链接小工具
var G_LINK_CALLBACK = {};

function showLinkWin(callback,showtype) {
    if (callback && typeof callback == 'function') {
        G_LINK_CALLBACK = callback;
    } else {
        alert("参数错误，应该给小工具传入一个函数而不是函数名");
        return;
    }

    if (g_scene == '2') { //商城版链接小工具
        layer.open({
            type: 2,
            content: '/static/design-m/cfg/linktoolForMall.html?callback=G_LINK_CALLBACK' +"&showtype="+showtype+ "&rnd=" + new Date().getTime(),
            title: "链接小工具",
            shadeClose: true,
            area: ['1000px', '600px']
        });
    } else if (g_scene == '1') { //门户版链接小工具
        //todo
    }
}


//链接小工具
var G_ITEM_CALLBACK = {};

function showItemWin(callback) {
    if (callback && typeof callback == 'function') {
        G_ITEM_CALLBACK = callback;
    } else {
        alert("参数错误，应该给小工具传入一个函数而不是函数名");
        return;
    }

    layer.open({
        type: 2,
        content: '/static/design-m/cfg/itemtool.html?callback=G_ITEM_CALLBACK',
        title: "商品小工具",
        shadeClose: true,
        area: ['1000px', '500px']
    });
}


//图片小工具
var G_PIC_CALLBACK = {};

function showPicWin(callback) {
    if (callback && typeof callback == 'function') {
        G_PIC_CALLBACK = callback;
    } else {
        alert("参数错误，应该给小工具传入一个函数而不是函数名");
        return;
    }

    opt = {
        "dir": "shop",
        "maxuploadsize": "2M",
        "callBack": G_PIC_CALLBACK
    };
    layer.open({
        type: 2,
        content: parent.ctx + "/res/tu/ResSelect.htm?dir=" + opt.dir + "&maxuploadsize=" + opt.maxuploadsize + "&callback=G_PIC_CALLBACK",
        title: "图片小工具",
        shadeClose: true,
        area: ['750px', '660px']
    });
}
