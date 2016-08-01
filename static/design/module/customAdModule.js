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

    var render = function ($widget, dataval,renderType) {
        var opts = $.extend({}, $.fn.customAdModule.defaults, dataval);

        //清除上次设置在body上的广告
        $('div[data-ref=' + $widget.attr('id') + ']').remove();
        //清除上次定义的计时器
        //var lastMar = $widget.data('intervalIndex');
        //clearInterval(lastMar);

        if (opts.type == "stretch") {//伸缩广告效果
        	var $adCon=$("<div></div>");
            if(renderType=="run"){
            	$("body").prepend($adCon);
            }
            else{
            	$(".container>.row").prepend($adCon);
            }
            
            $widget.parent().removeClass('stuckAdview').addClass('stuckAdview');
            $adCon.css("background-color", opts.stretch_bgColor);

            var stretch_arr = [];
            stretch_arr.push("<div class='stretchAds' style='margin: 0 auto; display: none; width: ", opts.stretch_width, "px; height: 0px; overflow: hidden; text-align: center;'>");
            stretch_arr.push("    <table  style='margin: 0 auto;'>");
            stretch_arr.push("        <tr>");
            stretch_arr.push("            <td width='100%' height='", opts.stretch_height, "'>");
            stretch_arr.push("                <a ", (opts.stretch_href != "" ? "target='_blank' href='" + opts.stretch_href + "'" : ""), ">");
            stretch_arr.push("                    <img src='", opts.stretch_src, "' border='0' alt='' width='100%' height='100%'></a>");
            stretch_arr.push("            </td>");
            stretch_arr.push("        </tr>");
            stretch_arr.push("    </table>");
            stretch_arr.push("</div>");

            $adCon.html(stretch_arr.join(""));

            var $stretchAds = $adCon.find('.stretchAds');

            var time = 500;
            var h = 0;
            function addCount() {
                if (time > 0) {
                    time--;
                    h = h + 5;
                } else {
                    return;
                }
                if (h > opts.stretch_height) //gao
                {
                    clearInterval(MyMar);

                    var T = 90;
                    var N = opts.stretch_height; //gao
                    function noneAds() {
                        if (T > 0) {
                            T--;
                            N = N - 5;
                        } else {
                            clearInterval(MyMarFadeOut);
                            $adCon.remove();
                            return;
                        }
                        if (N < 0) {
                            clearInterval(MyMarFadeOut);
                            $adCon.remove();
                            $stretchAds[0].style.display = "none";
                            return;
                        }
                        $stretchAds[0].style.height = N + "px";

                    }
                    var lastMarFadeOut = $widget.data('intervalIndexFadeOut');
                    clearInterval(lastMarFadeOut);

                    var MyMarFadeOut;
                    setTimeout(function () {
                        MyMarFadeOut = setInterval(noneAds, 30)
                        $widget.data('intervalIndexFadeOut', MyMarFadeOut);
                    }, parseFloat(opts.stretch_time)*1000)

                    return;
                }
                $stretchAds[0].style.display = "";
                $stretchAds[0].style.height = h + "px";
            }

            var MyMar = setInterval(addCount, 40)
            $widget.data('intervalIndex', MyMar);
        }
        else if (opts.type == "wings") {//对联式广告效果
            $widget.parent().addClass('stuckAdview');
            
            var wings_arr = [];
            wings_arr.push("<div class='twosideAD' data-ref=", $widget.attr("id"), ">");
            for (var i = 1; i <= 2; i++) {
            	if(opts["wings_pic_src_"+i]!=""){
	                wings_arr.push("    <div class='adimgbox' style='width: ", opts.wings_width, "px; height: ", opts.wings_height, "px;position: ", opts.wings_isfixed, "; top: ", opts.wings_top, "px; ", i == 1 ? "left" : "right", ": 0px;'>");
	                wings_arr.push("        <div style='width: 100%; height: 100%;'>");
	                if (opts["wings_pic_type_"+i] == "swf") {
	                    wings_arr.push("            <object id='dllbMovie' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='", opts.wings_width, "' height='", opts.wings_height, "'>");
	                    wings_arr.push("                <param name='movie' value='", opts["wings_pic_src_"+i], "'>");
	                    wings_arr.push("                <param name='wmode' value='transparent'>");
	                    wings_arr.push("                <param name='quality' value='high'>");
	                    wings_arr.push("                <param name='allowScriptAccess' value='always'>");
	                    wings_arr.push("                <embed wmode='transparent' src='", opts["wings_pic_src_"+i], "' quality='high' width='", opts.wings_width, "' height='", opts.wings_height, "' type='application/x-shockwave-flash' allowscriptaccess='always' name='dllbMovie'>");
	                    wings_arr.push("            </object>");
	                }
	                else {
	                    wings_arr.push("            <img src='", opts["wings_pic_src_"+i], "' width='", opts.wings_width, "' height='", opts.wings_height, "' alt='' />");
	                }
	                wings_arr.push("        </div>");
	                wings_arr.push("        <a class='adclose' style='position: absolute; left: 0px; top: 0px;z-index:2' href='javascript:' onclick='javascript:this.parentNode.parentNode.style.display=\"none\";'>&nbsp;</a>");
	
	                if (opts["wings_pic_href_"+i] != "") {
	                    wings_arr.push("        <a class='adclose' style='position:absolute; left: 0px; top: 0px;width: 100%;height: 100%;z-index:1' href='",opts["wings_pic_href_"+i], "' target='_blank' ></a>");
	                }
	
	                wings_arr.push("    </div>");
            	}
            }
            wings_arr.push("</div>");
            if(renderType=="run"){
            	$("body").append(wings_arr.join(""));
            }
            else{
            	$(".container>.row").append(wings_arr.join(""));
            }

        }
        else if (opts.type == "mask") {//遮罩式广告效果
            $widget.parent().addClass('stuckAdview');

            var mask_arr = [];
            mask_arr.push("<div class='sponsorAdDiv' data-ref=", $widget.attr("id"), " style='display: none;top:", opts.mask_top, "px;position: ", opts.mask_isfixed, ";'>");
            mask_arr.push("    <table width='100%' height='auto'>");
            mask_arr.push("        <tbody>");
            mask_arr.push("            <tr>");
            mask_arr.push("                <td>");
            mask_arr.push("                    <div class='imgbox'>");
            mask_arr.push("                        <span onclick='javascript:$(this).closest(\".sponsorAdDiv\").fadeOut();' class='adclose'>&nbsp;</span>");
            mask_arr.push("                        <a ", (opts.mask_href != "" ? "target='_blank' href='" + opts.mask_href + "'" : ""), ">");
            mask_arr.push("                            <img src='",opts.mask_src,"' width='",opts.mask_width,"' height='",opts.mask_height,"' alt='' />");
            mask_arr.push("                        </a>");
            mask_arr.push("                    </div");
            mask_arr.push("                </td>");
            mask_arr.push("            </tr>");
            mask_arr.push("        </tbody>");
            mask_arr.push("    </table>");
            mask_arr.push("</div>");

            if(renderType=="run"){
            	$("body").append(mask_arr.join(""));
                $('body>div[data-ref=' + $widget.attr('id') + ']').fadeIn();
            }
            else{
            	$(".container>.row").append(mask_arr.join(""));
                $('.container>.row>div[data-ref=' + $widget.attr('id') + ']').fadeIn();
            }
            
            var id = $widget.attr('id');
            setTimeout(function () {
                $('div[data-ref=' + id + ']').fadeOut();
            }, parseFloat(opts.mask_time)*1000);
        }
    }

    $.fn.customAdModule = function (oper, opts) {
        if (!oper) oper = "init";

        var operr;
        this.each(function () {
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };


    $.fn.customAdModule.defaults = {
    	    type: "wings",//stretch伸缩式， "wings"对联式 "mask"遮罩式
    	    //伸缩式广告
    	    stretch_src: "/static/design/img/ad01.jpg",
    	    stretch_href: "",
    	    stretch_bgColor: "#000",
    	    stretch_width: "1210",
    	    stretch_height: "90",
    	    stretch_time: "6",

    	    //对联式广告
    	    wings_isfixed: "fixed",
    	    wings_top: "200",
    	    wings_width: "120",
    	    wings_height: "400",
    	    wings_pic_href_1: "",
    	    wings_pic_src_1: "/static/design/img/ad02.swf",
    	    wings_pic_type_1: "swf",
    	    wings_pic_href_2: "",
    	    wings_pic_src_2: "/static/design/img/ad02.swf",
    	    wings_pic_type_2: "swf",

    	    //遮罩式
    	    mask_isfixed: "fixed",
    	    mask_top: "300", //像素
    	    mask_src: "/static/design/img/ad01.jpg",
    	    mask_href: "",
    	    mask_width: "1210",
    	    mask_height: "90",
    	    mask_time: "6"
    	}
})(jQuery)