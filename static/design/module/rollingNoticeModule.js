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

    var render = function ($widget, dataval) {
        var opts = $.extend({}, $.fn.rollingNoticeModule.defaults, dataval);

        var $divTxt = $widget.find('div.noticetxt');
        var $tableNotice = $divTxt.find('.noticeTable');
        var $divCon = $widget.find('div.noticeCon');
        
        //内容渲染部分
        var tdArr=[];
        var widthArr = [];
        for (var i = 0; i < opts.notice.length; i++) {
            var tdwidth=len(opts.notice[i].title)* 6 + 20;
            widthArr.push(tdwidth);
            tdArr.push("<td style='width:"+tdwidth+"px'><a "+(opts.notice[i].href!=""?"target='_blank' href='"+opts.notice[i].href+"'":"")+">"+opts.notice[i].title+"</a></td>");
        }
        
        var totalwidth = 0;
        if (opts.direction == "left" || opts.direction == "right") {
            widthArr.forEach(function (w) {
                totalwidth += w;
            })

            $tableNotice.html("<tr>" + tdArr.join("") + "</tr>");
        }
        else {//向上 向下滚动时 table宽度为最大的TD宽度
            widthArr.forEach(function (w) {
                totalwidth = w > totalwidth ? w : totalwidth;
            })
            
            $tableNotice.html("<tr>" + tdArr.join("</tr><tr>") + "</tr>");
        }

        $tableNotice.css("width", totalwidth);
        $divTxt.css("width", totalwidth);
        
        $divCon.parent().removeClass().addClass(opts.iconClass);
        
        //事件部分
        $divTxt.css("top",0).css("left",0)
        if (opts.direction == "left" && opts.rollingways == "in") {
            //左移入初始位置
            $divTxt.css('left', $divCon.width());
        }
        if (opts.direction == "right" && opts.rollingways == "in") {
            //右移入初始位置
            $divTxt.css('left', -$divTxt.width());
        }
/*        if (opts.direction == "top" && opts.rollingways == "in") {
            //上移入初始位置
            $divTxt.css('top', $divCon.height());
        }
        if (opts.direction == "down" && opts.rollingways == "in") {
            //下移入初始位置
            $divTxt.css('top', -$divTxt.height());
        }*/
        
        function Marquee() {
            //左滚动
        	if(opts.direction=="left"){
        		if (parseInt($divTxt.css('left')) < -$divTxt.width()) {
                	if(opts.isrepeat=="0"){
                    	clearInterval(MyMar);
                    }
                	else{
                		$divTxt.css('left', $divCon.width());
                	}
                }
                else {
                    $divTxt.css('left', parseInt($divTxt.css('left')) - 1 + "px");
                }
        	}
        	
        	//右滚动
        	if(opts.direction=="right"){
        		if (parseInt($divTxt.css('left')) > (parseInt($divTxt.width())+parseInt($divCon.width()))) {
                	if(opts.isrepeat=="0"){
                    	clearInterval(MyMar);
                    }
                	else{
                		$divTxt.css('left', -$divTxt.width());
                	}
                }
                else {
                    $divTxt.css('left', parseInt($divTxt.css('left')) + 1 + "px");
                }
        	}
            
        	//上滚动
        	if(opts.direction=="top"){
        		if (parseInt($divTxt.css('top')) < -$divTxt.height()) {
                	//if(opts.isrepeat=="0"){
                    //	clearInterval(MyMar);
                    //}
                	//else{
                		$divTxt.css('top', $divCon.height());
                	//}
                }
                else {
                	if( parseInt($divTxt.css('top'))!=$divCon.height() && parseInt($divTxt.css('top'))!=-$divTxt.height() && parseInt($divTxt.css('top'))%$tableNotice.find('tr:eq(0)').height()==0){
                		if(!$divTxt.data('sleeped'))
                			$divTxt.data('sleeped',0);
                		
                		$divTxt.data('sleeped',$divTxt.data('sleeped')+parseInt(opts.speed));
                		
                		if($divTxt.data('sleeped')>=opts.freezetime){
                			$divTxt.data('sleeped',0);
                		}
                		else{
                			return;
                		}
                	}
                    $divTxt.css('top', parseInt($divTxt.css('top')) - 1 + "px");
                }
        	}
        	
        	//下滚动
        	if(opts.direction=="down"){
        		if (parseInt($divTxt.css('top')) > parseInt($divCon.height())) {
                	//if(opts.isrepeat=="0"){
                    //	clearInterval(MyMar);
                    //}
                	//else{
                		$divTxt.css('top', -$divTxt.height());
                	//}
                }
                else {
                	if(parseInt($divTxt.css('top'))!=-$divTxt.height() && parseInt($divTxt.css('top'))!=parseInt($divCon.height()) && parseInt($divTxt.css('top'))%$tableNotice.find('tr:eq(0)').height()==0){
                		if(!$divTxt.data('sleeped'))
                			$divTxt.data('sleeped',0);
                		
                		$divTxt.data('sleeped',$divTxt.data('sleeped')+parseInt(opts.speed));
                		
                		if($divTxt.data('sleeped')>=opts.freezetime){
                			$divTxt.data('sleeped',0);
                		}
                		else{
                			return;
                		}
                	}
                    $divTxt.css('top', parseInt($divTxt.css('top')) + 1 + "px");
                }
        	}
        }
        //清除上次定义的计时器
        var lastMar=$divTxt.data('intervalIndex');
        clearInterval(lastMar);
        
        var MyMar;
        $divTxt[0].onmouseover=null;
        $divTxt[0].onmouseout=null;
        $divTxt[0].onmouseover = function () {
            clearInterval(MyMar)
        }
        $divTxt[0].onmouseout = function () {

            MyMar = setInterval(Marquee, opts.direction=="top" || opts.direction=="down"? parseInt(opts.speed)+10:opts.speed)
            $divTxt.data('intervalIndex',MyMar);
        }
        $divTxt[0].onmouseout();
    }

    $.fn.rollingNoticeModule = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };


    $.fn.rollingNoticeModule.defaults = {
        direction: "left",
        isrepeat: "1",
        rollingways: "out",//out 移出 in 移入
        speed: 30,
        iconClass: "notice-image0",
        freezetime:3000,
        notice: [{
            href: "",
            title: "公告内容1",
        },
		{
			href: "",
			title: "公告内容2",
		}]
    }

    function len(s) {
        var l = 0;
        var a = s.split("");
        for (var i = 0; i < a.length; i++) {
            if (a[i].charCodeAt(0) < 299) {
                l++;
            } else {
                l += 2;
            }
        }
        return l;
    }
})(jQuery)