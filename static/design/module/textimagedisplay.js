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
    
	$.fn.textimagedisplay=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};
	
	var render=function($widget,dataval,type){
		
		var opts = $.extend({}, $.fn.textimagedisplay.defaults, dataval);

		if(opts){
			var style=opts.style;
			var strT=[];
			var content = decodeURI(decodeURI(opts.textContent));
			if(0===style||"0"===style){
				strT.push("<div class='richContent'>");
				strT.push("<p>"+content+"</p></div>");
			}else if(1==style||"1"==style){
				strT.push('<div class="textImg2"><a target="'+opts.openWay+'" href="'+opts.urlAddress+'">');
				strT.push('<img style="width:'+opts.imageWidth+'px;height:'+opts.imageHeight+'px;" src="'+opts.picture+'" title="'+opts.imageDesc+'" alt=""></a></div>');
				strT.push('<div class="richContent richContent2"><a href="'+opts.urlAddress+'" target="'+opts.openWay+'"><p>'+content+'</p></a></div>');
			}else if(2==style||"2"==style){
				strT.push('<div class="textImg1"><a target="'+opts.openWay+'" href="'+opts.urlAddress+'">');
				strT.push('<img style="width:'+opts.imageWidth+'px;height:'+opts.imageHeight+'px;" src="'+opts.picture+'" title="'+opts.imageDesc+'" alt=""></a></div>');
				strT.push('<div class="richContent richContent1"><a href="'+opts.urlAddress+'" target="'+opts.openWay+'"><p>'+content+'</p></a></div>');
			}else if(3==style||"3"==style){
				strT.push('<div class="textImg1"><a target="'+opts.openWay+'" href="'+opts.urlAddress+'">');
				strT.push('<img style="width:'+opts.imageWidth+'px;height:'+opts.imageHeight+'px;" src="'+opts.picture+'" title="'+opts.imageDesc+'" alt=""></a></div>');
				strT.push('<div class="richContent richContent2"><a href="'+opts.urlAddress+'" target="'+opts.openWay+'"><p>'+content+'</p></a></div>');
			}else if(4==style||"4"==style){
				strT.push('<div class="textImg3"><a target="'+opts.openWay+'" href="'+opts.urlAddress+'">');
				strT.push('<img style="width:'+opts.imageWidth+'px;height:'+opts.imageHeight+'px;" src="'+opts.picture+'" title="'+opts.imageDesc+'" alt=""></a></div>');
				strT.push('<div class="richContent richContent1"><a href="'+opts.urlAddress+'" target="'+opts.openWay+'"><p>'+content+'</p></a></div>');
			}else if(5==style||"5"==style){
				strT.push('<div class="textImg3"><a target="'+opts.openWay+'" href="'+opts.urlAddress+'">');
				strT.push('<img style="width:'+opts.imageWidth+'px;height:'+opts.imageHeight+'px;" src="'+opts.picture+'" title="'+opts.imageDesc+'" alt=""></a></div>');
				strT.push('<div class="richContent richContent2"><a href="'+opts.urlAddress+'" target="'+opts.openWay+'"><p>'+content+'</p></a></div>');
			}else{
				strT.push('<div class="richContent richContent2"><a href="'+opts.urlAddress+'" target="'+opts.openWay+'"><p>'+content+'</p></a></div>');
				strT.push('<div class="textImg2"><a target="'+opts.openWay+'" href="'+opts.urlAddress+'">');
				strT.push('<img style="width:'+opts.imageWidth+'px;height:'+opts.imageHeight+'px;" src="'+opts.picture+'" title="'+opts.imageDesc+'" alt=""></a></div>');
			}
			$widget.find(".graphicalInfo").html(strT.join(''));
			//设置标题
			$widget.find("span")[0].innerHtml=opts.title;
			$widget.find("span")[0].innerText=opts.title;
			if(opts.isMore=="1"){
				$widget.find(".title-box span").find("a").remove();
				var moreHtml = "<a class='moreStyle' href='"+opts.moreHrefUrl+"' target='"+opts.openWay2+"'>更多>></a>";
				$widget.find(".title-box span").append(moreHtml);
			}
		}
	}
	
	$.fn.textimagedisplay.defaults = {
			title:"图文展示",
			style:"0",
			picture:"",
			imageHeight:"",
			imageWidth:"",
			imageDesc:"",
			urlAddress:"",
			openWay:"_blank",
			textContent:"图文内容",
			isMore:"0",
			openWay2:"_blank",
			moreHref:"",
			moreHrefUrl:"#"
    	}
})(jQuery)