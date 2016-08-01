(function ($) {
    var g = {
        config: function ($el) {

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


    $.fn.vote = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);
        })
        if (operr) return operr;

        return this;
    };


    var render = function ($widget, dataval, isReset) {


        if (isReset == "run") {

            getVoteDetial($widget.find(".voteDiv"));
            $widget.find(".s_ibutton").click(setVoteByUser);
            $widget.find(".Result").click(getResult);



        } else if (isReset == "init") {
            getVoteDetial($widget.find(".voteDiv"));
            $widget.find(".s_ibutton").click(noAlowSubmit);
            $widget.find(".Result").click(noAlowSubmit);

            if ($widget.find(".voteDiv:has(div)").length === 0) {
                var domstr = [];
                domstr.push("<h1 class='fm1' style='height: 200px;font-size: 18px;line-height: 200px;'>未配置投票项</h1>");
                var str = domstr.join("");
                $widget.find(".noVote").html(str);

                //隐藏按钮
                $widget.find(".voteOnline").hide();

            }

        } else if (isReset == "reset") {

            var voteId = dataval.voteId;
            var voteColor = dataval.voteColor;
            var oldVoteColor = $widget.find("input[name='voteColor']").val();
            if (oldVoteColor === "") {
                $widget.find(".s_ibutton ").removeClass("btn_blue");
            } else {
                $widget.find(".s_ibutton ").removeClass(oldVoteColor);
            }
            $widget.find(".s_ibutton ").addClass(voteColor);
            $widget.find("input[name='voteId']").val(voteId);
            $widget.find("input[name='voteColor']").val(voteColor);
            $widget.data('data-val', dataval);
            getVoteDetial($widget.find(".voteDiv"));

            $widget.find(".s_ibutton").click(noAlowSubmit);
            $widget.find(".Result").click(noAlowSubmit);



            $widget.find(".noVote").html("");//删除需要默认配置提示
            //显示按钮
            $widget.find(".voteOnline").show();
        }


    }
    //编辑页面禁止提交
    function noAlowSubmit() {
        var event = window.event || arguments.callee.caller.arguments[0];
        var prevObj = $(event.srcElement ? event.srcElement : event.target);
        layer.tips('编辑页面不允许点击', prevObj, { tips: [1, '#5AB4FF'], time: 1000, isGuide: true });
    }
    //收起结果
    function hideResult() {
        var event = window.event || arguments.callee.caller.arguments[0];
        var $widget = $(event.srcElement ? event.srcElement : event.target).closest('form')
        $(event.srcElement ? event.srcElement : event.target).hide();
        $widget.find(".resultParent").html("");
    }

    //获取投票详情
    function getVoteDetial($widget) {

        var vateId = $widget.closest("form").find("input[name='voteId']").val();
        var url = ctx + "/base/vote/Vote.do?method=getVote&voteId=" + vateId;
        window.voteColor = $widget.closest("form").find("input[name='voteColor']").val();
        $.ajax({
            url: url,
            type: "POST",
            success: function (data) {
                var domstr = [];
                for (var i = 0; i < data.length; i++) {
                    domstr.push("<div class='voteOnline ba p10'>");
                    domstr.push("<div class='voteSubject'>", data[i].SUBJECT_TITLE, "</div>");
                    domstr.push(" <div class='voteItembox'>");
                    domstr.push("<ul>");

                    for (var j = 0; j < data[i].optionList.length; j++) {


                        if (data[i].IS_IMG == 1) {
                            domstr.push(" <li class='voteItemImgPanel'>");
                            domstr.push("<div class='voteItemImgBox'>");
                            domstr.push("<img src='", data[i].optionList[j].OPTION_IMG, "' imgName='", data[i].optionList[j].OPTION_ID, "' style='width:150px;height:150px;cursor:pointer'>");
                            domstr.push("</div>");
                            domstr.push("<div class='voteItemImgName'>");
                            if (data[i].SUBJECT_TYPE === 0) {
                                domstr.push("<input style='margin-right:5px;'  type='radio' name='", data[i].SUBJECT_ID, "' value='", data[i].optionList[j].OPTION_ID, "'>");
                            } else {
                                domstr.push("<input style='margin-right:5px;'  type='checkbox' name='", data[i].SUBJECT_ID, "' value='", data[i].optionList[j].OPTION_ID, "'>");
                            }
                            domstr.push("<span class='voteItemSpans' >", data[i].optionList[j].OPTION_TITLE, "</span>");
                            domstr.push("</div>");
                        } else {
                            domstr.push(" <li class='voteItemPanel'>");
                            domstr.push("<div  class='voteItemName'>");
                            if (data[i].SUBJECT_TYPE === 0) {
                                domstr.push(" <input name='", data[i].SUBJECT_ID, "' type='radio' value='", data[i].optionList[j].OPTION_ID, "' >");
                            } else {
                                domstr.push(" <input name='", data[i].SUBJECT_ID, "' type='checkbox' value='", data[i].optionList[j].OPTION_ID, "' >");
                            }
                            domstr.push(" <span class='voteItemSpan' >", data[i].optionList[j].OPTION_TITLE, "</span>");
                            domstr.push(" </div>");
                        }
                        domstr.push("</li>");

                    }
                    domstr.push("</ul>");
                    domstr.push("</div>");
                    domstr.push("<input type='hidden' name='", data[i].SUBJECT_ID, "type' value='", data[i].SUBJECT_TYPE, "' />");
                    domstr.push("</div>");
                }
                var str = domstr.join("");
                $widget.html(str);
                $widget.find("img").click(
                            function () {
                                $(this).parent().next().find("input").click();
                            }
                        );
                $widget.find("span").click(
                            function () {
                                $(this).prev().click();
                            }
                        );

            },
            error: function (e) {

            },
            dataType: "json"
        });

    }

    //获取投票结果
    function getResult() {
        var event = window.event || arguments.callee.caller.arguments[0];
        window.$this = $(event.srcElement ? event.srcElement : event.target).closest('form');
        var vateId = $($this).find("input[name='voteId']").val();
        window.voteColor = $($this).find("input[name='voteColor']").val();
        var url = ctx + "/base/vote/Vote.do?method=getResult&voteId=" + vateId;
        $.ajax({
            url: url,
            type: "POST",
            success: function (data) {
                var domstr = [];
                for (var i = 0; i < data.length; i++) {
                    domstr.push("<div class='voteResult'>");
                    domstr.push("<div class='voteSubject'>", data[i].SUBJECT_TITLE, "</div>");
                    domstr.push("<table class='voteItems' cellpadding='0' cellspcaing='0'>");
                    domstr.push("<tbody >");
                    for (var j = 0; j < data[i].optionList.length; j++) {
                        domstr.push("<tr>");

                        var percent = data[i].optionList[j].PERCENT;
                        percent = Math.round(percent * 100)
                        domstr.push(" <td width='15%' class='vi-name'>");
                        domstr.push(" <div class='voteItemName fm1'>", data[i].optionList[j].OPTION_TITLE, "：</div>");
                        domstr.push("</td>");
                        domstr.push("<td width='70%' class='vi-percent'>");
                        domstr.push("<span style='border-width:0px' class='voteVfm g_border'>");
                        domstr.push("<span class='voteVpd g_block ", voteColor, "' style='width:", percent, "%'></span>");
                        domstr.push("</span>");
                        domstr.push("</td>");
                        domstr.push("<td width='15%' class='vi-count'>");
                        domstr.push(" <div class='voteItemCount fm1'>&nbsp;", data[i].optionList[j].SELECT, " &nbsp;（", percent, "%）</div>");
                        domstr.push("</td>");
                        domstr.push("</tr>");
                    }
                    domstr.push("</tbody>");
                    domstr.push("</table>");
                    domstr.push("</div>");


                }
                var str = domstr.join("");

                layer.open({
                    type: 1,
                    area: ['800px', '600px'],
                    title: '投票结果',
                    shade: 0,
                    moveType: 1,
                    shift: 3,
                    content: str
                });



            },
            error: function (e) {

            },
            dataType: "json"
        });
    }
    //用户投票
    function setVoteByUser() {
        var event = window.event || arguments.callee.caller.arguments[0];
        var datas = $(event.srcElement ? event.srcElement : event.target).closest('form').serialize();
        var vateId = $(event.srcElement ? event.srcElement : event.target).closest('form').find("input[name='voteId']").val();
        var url = ctx + "/base/vote/Vote.do?method=setVoteByUser&voteId=" + vateId;
        $.ajax({
            url: url,
            data: datas,
            type: "POST",
            success: function (data) {
                if (data.RESULT == "success") {
                    layer.alert('投票成功！', {
                        icon: 1
                    });
                } else if (data.RESULT == "nochose") {
                    layer.alert('每组至少选择一项！');
                } else if (data.RESULT == "haschose") {
                    layer.alert('您已经投过票了！');
                }


            },
            error: function (e) {

            },
            dataType: "json"
        });
    }

})(jQuery)
