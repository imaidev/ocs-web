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
    
	$.fn.logoconfiguration=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};

	var render=function($widget,dataval,type){
		var opts = $.extend({}, $.fn.logoconfiguration.defaults, dataval);

		if(opts){
			$widget.parent().addClass("stuckSiteview");
			//主标题
			//$widget.find("#siteTitleC").empty();
				if($(".demo_h_free").find("#siteLogo").length>0){
					$(".demo_h_free").find("#siteLogo").remove();
				}
				if($(".demo_h_free").find("#siteTitleC").length>0){
					$(".demo_h_free").find("#siteTitleC").remove();
				}
			 var str = '<div id="siteLogo"  data-ref="'+$widget.attr('id')+'"></div><div id="siteTitleC" style="float:left;" data-ref="'+$widget.attr('id')+'"></div>';
			
            $(".demo_h_free").append(str);
			var strT = "";
			//自定义跳转
			if(opts.jumpMode=="2"){
				strT = strT +'<a href="'+opts.titleUrl+'" target="'+opts.titleOpenWay+'">';
			}
			strT = strT +'<div id="primaryTitle" style="color:'
			+opts.mainColor+';font-size:'+opts.mainFontS+'px;font-family:'+opts.mainFontF+';';
			if(opts.mainBold=="1"){
				strT = strT+'font-weight:bold;';
			}
			if(opts.mainItalic=="1"){
				strT = strT+'font-style:italic;';
			}
			if(opts.mainUnderline=="1"){
				strT = strT+'text-decoration:underline;';
			}
			strT = strT+'">'+opts.mainTitle+'</div>';
			//副标题不为空
			if(opts.subTitle!=""){
				strT = strT+'<div id="subTitle" style="color:'+opts.subColor+';font-size:'+opts.subFontS+'px;font-family:'+opts.subFontF+';';
				if(opts.subBold=="1"){
					strT = strT+'font-weight:bold;';
				}
				if(opts.subItalic=="1"){
					strT = strT+'font-style:italic;';
				}
				if(opts.subUnderline=="1"){
					strT = strT+'text-decoration:underline;';
				}
				strT = strT +'">'+opts.subTitle+'</div>';
			}
			if(opts.jumpMode=="2"){
				strT = strT+'</a>';
			}
			
			if(type=="run"){
            	$(".demo_h_free").find("#siteTitleC").append(strT);
     			//可拖拽title
     			 $(".demo_h_free").find("#siteTitleC")[0].style.position="absolute";
     			 $(".demo_h_free").find("#siteTitleC")[0].style.zIndex="99";
     			 $(".demo_h_free").find("#siteTitleC")[0].style.left=opts.titleLeft+"px";
     			 $(".demo_h_free").find("#siteTitleC")[0].style.top=parseInt(opts.titleTop)+"px";
     			//显示logo
             }
             else{
            	 $(".demo_h_free").find("#siteTitleC").append(strT);
     			//可拖拽title
     			 $(".demo_h_free").find("#siteTitleC").draggable({
     					stop: function( event, ui ) {
     						var o={};
     						o.titleLeft=parseInt(ui.helper.css("left"));
     						o.titleTop=parseInt(ui.helper.css("top"));
     						$("#"+ui.helper.attr("data-ref")).logoconfiguration('reset',o);
    					}
     		     });
     			 $(".demo_h_free").find("#siteTitleC")[0].style.position="absolute";
     			 $(".demo_h_free").find("#siteTitleC")[0].style.zIndex="99";
     			 $(".demo_h_free").find("#siteTitleC")[0].style.left=opts.titleLeft+"px";
     			 $(".demo_h_free").find("#siteTitleC")[0].style.top=parseInt(opts.titleTop)+"px";
             }
			//显示logo
			var strL = ""; 
			if(opts.isLogo=="1"){
				if(opts.logojumpMode=="2"){
					strL = strL + '<a href="'+opts.logoUrl+'" target="'+opts.logoOpenWay+'">';
				}
				strL = strL+'<img src="'+opts.pictureUrl+'" width="'+opts.logoWidth+'" height="'+opts.logoHeight+'" alt="'+opts.logoDesc+'" />';
				if(opts.logojumpMode=="2"){
					strL = strL+'</a>';
				}
				if(type=="run"){
	            	$(".demo_h_free").find("#siteLogo").append(strL);
	            	$(".demo_h_free").find("#siteLogo")[0].style.cssFloat="left";
	            	$(".demo_h_free").find("#siteLogo")[0].style.styleFloat="left";
	            	$(".demo_h_free").find("#siteLogo")[0].style.left=opts.logoLeft+"px";
	            	$(".demo_h_free").find("#siteLogo")[0].style.top=parseInt(opts.logoTop)+"px";
	            	$(".demo_h_free").find("#siteLogo")[0].style.position="absolute";
	            	$(".demo_h_free").find("#siteLogo")[0].style.zIndex="99";
	             }
	             else{
	            	$(".demo_h_free").find("#siteLogo").append(strL);
	            	$(".demo_h_free").find("#siteLogo")[0].style.cssFloat="left";
	            	$(".demo_h_free").find("#siteLogo")[0].style.styleFloat="left";
	            	$(".demo_h_free").find("#siteLogo")[0].style.left=opts.logoLeft+"px";
	            	$(".demo_h_free").find("#siteLogo")[0].style.top=opts.logoTop+"px";
	            	$(".demo_h_free").find("#siteLogo").draggable({
     					stop: function( event, ui ) {
     						var o={};
     						o.logoLeft=parseInt(ui.helper.css("left"));
     						o.logoTop=parseInt(ui.helper.css("top"));
     						$("#"+ui.helper.attr("data-ref")).logoconfiguration('reset',o);
    					}
     		     });;
	            	$(".demo_h_free").find("#siteLogo")[0].style.position="absolute";
	            	$(".demo_h_free").find("#siteLogo")[0].style.zIndex="99";
	             }
			}
		}
	}
	
	$.fn.logoconfiguration.defaults = {
			
			//主标题
			mainTitle:"编辑网站标题",
			mainFontF:"SimSun",
			mainFontS:"24",
			mainBold:"0",
			mainItalic:"0",
			mainUnderline:"0",
			mainColor:"black",
			
			//副标题
			subTitle:"",
			subFontF:"SimSun",
			subFontS:"24",
			subBold:"0",
			subItalic:"0",
			subUnderline:"0",
			subColor:"black",
			
			//LOGO
			isLogo:"0",
			pictureUrl:"/static/design/img/default.png",
			jumpMode:"1",
			titleUrl:"",
			titleOpenWay:"_blank",
			titleFix:"0",
			titleLeft:"200",
			titleTop:"50",
			logojumpMode:"1",
			logoUrl:"",
			logoOpenWay:"_blank",
			logoFix:"0",
			logoLeft:"150",
			logoTop:"50",
			logoWidth:"60",
			logoHeight:"60",
			logoDesc:""
	}
	
})(jQuery)