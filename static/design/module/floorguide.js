(function($){
    var g = {
        config:function($el){
            return moduleTool.config($el);
        },
        reset:function($el,opts){
            moduleTool.reset($el,opts,render);
        },
        run:function($el){
        	moduleTool.run($el,render);
        },
        init:function($el){
            moduleTool.init($el,render);
        }
    };
    
    $.fn.floorguide=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);
	        
        })
        if (operr) return operr;

        return this;
    };

    var render=function($widget,dataval,renderType){
        var opts = $.extend({}, $.fn.floorguide.defaults, dataval);
        
        var rt = renderType;
        //添加占位符
        $widget.parent().addClass('stuckfloorview');
        if(opts){
            var strS=[];
            // 竖版显示图片+文字
            if (opts.floorstyle == 1) {
	            strS.push("<div class='nav-menu navMenu-left' style='display: block; margin-top: -122px;' data-ref="+$widget.attr("id")+">");
	            strS.push("<ul>");
	            for(var i=0;i<opts.floors.length;i++){
	            	if(opts.floors[i].floorliclass != "go-top"){
	            		strS.push("<li rel='"+opts.floors[i].anchorpoint+"' class='"+opts.floors[i].floorliclass+"' style='background: rgb(246, 246, 246);'>");
	                    strS.push("<a href='javascript:;' class='floormenu' style='ground:url("+opts.floors[i].floorurls+") center center no-repeat;'><div><em style='background-image: url("+opts.floors[i].floorurls+");background-repeat: no-repeat;background-position: center;background-size: 100% 100%;'></em><p style='color:"+(opts.floorwordscolour == "#fff" ? "" : opts.floorwordscolour)+";'>"+opts.floors[i].floornames+"</p></div></a>");
	                    strS.push("</li>");
	            	}
	            }
	            strS.push("<li rel='' class='go-top' style='background: rgb(246, 246, 246);'>");
	            strS.push("<a href='javascript:;' class='floormenu' style='background:url(/static/design/img/icon/menu-gotop.png) center center no-repeat;'><div><p style='position: relative;left: 2px;color:"+(opts.floorwordscolour == "#fff" ? "" : opts.floorwordscolour)+";'>返回顶部</p></div></a>");
	            strS.push("</li></ul></div>");
            } else {
            	strS.push("<div class='floatBar-left'style='display: block; margin-top: -122px;' data-ref="+$widget.attr("id")+">");
	            strS.push("<ul class='floor-guide'>");
	            for(var i=0;i<opts.floors.length;i++){
	            	if(opts.floors[i].floorliclass != "go-top"){
	            		strS.push("<li rel='"+opts.floors[i].anchorpoint+"' class='"+opts.floors[i].floorliclass+"' style='background: rgb(246, 246, 246);'>");
	                    strS.push("<a href='javascript:;' class='floormenu' style='ground:url("+opts.floors[i].floorurls+") center center no-repeat;'>&nbsp;</a><span style='color:"+opts.floorwordscolour+";'>"+opts.floors[i].floornames+"</span>");
	                    strS.push("</li>");
	            	}
	            }
	            strS.push("<li rel='' class='go-top' style='background: rgb(246, 246back, 246);'>");
	            strS.push("<a href='javascript:;' class='floormenu' style='background:url(/static/design/img/icon/menu-gotop.png) center center no-repeat;'>&nbsp;</a><span style='color:"+opts.floorwordscolour+";'>返回顶部</span>");
	            strS.push("</li></ul></div>");
            }

            //清除上次设置在body上的导航
            $('div[data-ref=' + $widget.attr('id') + ']').remove();
            if(renderType=="run"){
            	$("body").append(strS.join(""));
            }
            else{
            	$(".container>.row").append(strS.join(""));
            }
            
            //隐藏到顶部标签
            if(opts.toTop == "0"){
            	$('div[data-ref=' + $widget.attr('id') + ']').find(".go-top").hide();
            }
        }
        //加载完成后调用floorGuide()方法
        floorGuide(rt);

        function floorGuide(rt) {
            var floorheight = opts.floorheight;
            var $leftBar = $('div[data-ref=' + $widget.attr('id') + ']');
            var leftBarH = $leftBar.height();
            var marginT = Math.floor(leftBarH / 2);

            if (rt != "run") {//设计阶段
                $(".container").scroll(function (event) {
                    if ($('.container').scrollTop() > floorheight) {
                        $leftBar.fadeIn(1000).css({
                            'margin-top': -marginT
                        });
                    } else {
                        $leftBar.fadeOut(1000);
                    }
                });
                $('div[data-ref=' + $widget.attr('id') + ']').find(".go-top").click(function () {
                    $(".container").stop(true).animate({     
                        scrollTop: 0
                    }, '2000');
                });

                $('div[data-ref=' + $widget.attr('id') + ']').find("li").css("background-color", opts.floorbackgroundcolour);
                $('div[data-ref=' + $widget.attr('id') + ']').find("li").hover(function () {
                    $(this).css("background-color", opts.floorhovercolour);
                }, function () {
                    $(this).css("background-color", opts.floorbackgroundcolour);
                });
                $('div[data-ref=' + $widget.attr('id') + ']').find("li").click(function () {
                	var $li = $(this);
                	var oldurls = window.location.href.split("#") ;
                	var oldurl = oldurls[0];
                    var Q = "#" + $li.attr("rel");	   
                    if ($(Q).length == 0) {
                        return
                    }
                	window.location.href= oldurl + Q;
                });
                $('div[data-ref=' + $widget.attr('id') + ']').find("li").hover(function () {
                    $(this).addClass("hover")
                }, function () {
                    $(this).removeClass("hover")
                });
            }else{
            	$(window).scroll(function(event) {
	        		if ($(window).scrollTop() >floorheight) {
	        			$leftBar.fadeIn(1000).css({
	        				'margin-top':-marginT
	        			});
	        		} else {
	        			$leftBar.fadeOut(1000);
	        		}
	        	});			
            	$('div[data-ref=' + $widget.attr('id') + ']').find(".go-top").click(function(){
	        		$("html, body").stop(true).animate({     
	        			scrollTop:0
	        		},'2000');
	        	});	
	        	
            	$('div[data-ref=' + $widget.attr('id') + ']').find("li").css("background-color",opts.floorbackgroundcolour);	
            	$('div[data-ref=' + $widget.attr('id') + ']').find("li").hover(function() {
	        				$(this).css("background-color",opts.floorhovercolour);
	        			}, function() {
	        				$(this).css("background-color", opts.floorbackgroundcolour);
	        		});
            	$('div[data-ref=' + $widget.attr('id') + ']').find("li").click(function(){
	        		var $li=$(this);
	        		flag=false;	
	        		var Q = "#" + $li.attr("rel");	 
	        		if ($(Q).length == 0) {
	        			return
	        		}

	        		$("html, body").stop(true).animate({
	        			scrollTop: $(Q).offset().top - 30
	        		}, "2000", function() {
	        			flag = true
	        		})	
	        	});			
            	$('div[data-ref=' + $widget.attr('id') + ']').find("li").hover(function() {
	        		$(this).addClass("hover")
	        	}, function() {
	        		$(this).removeClass("hover")
	        	});
            }
        }
    }
	$.fn.floorguide.defaults ={
		floors:[{anchorpoint:"",
			floorliclass:"go-top",
			floorurls:"/static/design/img/icon/menu-gotop.png",
			floornames:"回到顶部"}],
	    
		floorheight:100,
		floorwordscolour:"#fff",
    	floorbackgroundcolour:"#f6f6f6",
    	floorhovercolour:"#0e7aa5",
    	floorstyle:2
    };
})(jQuery)

