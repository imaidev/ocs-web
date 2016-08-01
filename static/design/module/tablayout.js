(function($){
	var g = {
	    config:function($el){
	    	return moduleTool.config($el);
	    },
	    reset:function($el,opts){
	    	moduleTool.reset($el,opts,render);
	    },
	    run:function($el){
	    	var opts = $.extend({}, $.fn.tablayout.defaults, g_data_widget[$el.attr("id")])
	    	if ("style03|".indexOf(opts.skinClass) >= 0) {
				var hdW = $el.find('.tabLayout .tabLayoutHd').outerWidth(true);
				var hdH = $el.find('.tabLayout .tabLayoutHd').outerHeight(true);
				var tabW = $el.find('.tabLayout').width();
				$el.find('.tabLayout .tabLayoutBd').children().css("height", hdH);
				$el.find('.tabLayout .tabLayoutBd').children().css("width", tabW-hdW);
			}
	    	$el.find('.tabLayout').tabslide(opts);
	    	if (opts.effect == "fade") {
	    		var timerId = window.setInterval(function() {
	    			var index = $el.find('.tabLayout .tabLayoutHd li.on').index();
	    			$el.find('.tabLayout .tempWrap').height($el.find('.tabLayout .tabLayoutBd > div').eq(index).height());
	    		}, 300);
	    		window.setTimeout(function() {
	    			window.clearInterval(timerId);
	    		}, 60000);
	    	}
	    },
	    init:function($el){
	    	if (!$el.attr("data-renderurl")) {
	    		var dataval = JSON.parse($el.attr("data-val"));
	    		if (dataval.tags == null || dataval.tags.length == 0) {
	    			dataval.tags = $.fn.tablayout.defaults.tags;
	    		}
	    		for (var i=0; i<dataval.tags.length; i++) {
	    			dataval.tags[i].id = $el.attr("id") + '' + Math.floor(Math.random()*10000);
	    		}
	    		$el.attr("data-val", JSON.stringify(dataval));
	    	}
	    	
	    	moduleTool.init($el,render);
	    },
	    reRender:function($el){
	    	render($el,moduleTool.config($el));
	    }

	};
    
	$.fn.tablayout=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};

	var render=function($widget,dataval){
		var opts = $.extend({}, $.fn.tablayout.defaults, dataval);

		$widget.find('.tabLayout').css("width", "").removeClass().addClass('tabLayout '+opts.skinClass);
		$widget.find('.tabLayout > .title-box > h3 > span').text(opts.moduleTitle);
		renderHd($widget, opts);
		renderBd($widget, opts);
		
		$widget.find('.tabLayout').tabslide(opts);
		if ("style03|".indexOf(opts.skinClass) >= 0) {
			$widget.find('.tabLayout').css("width", parseInt($widget.find('.tabLayout .tabLayoutHd').outerWidth(true))+parseInt($widget.find('.tabLayout .tempWrap').outerWidth(true))+'px');
		}
		setColumnSortable();
		setTabLayoutHeight($widget, opts);
	}
	
	var setTabLayoutHeight = function($widget, opts) {
		var dataval = $widget.data("tabLayoutTimers")==null?{}:$widget.data("tabLayoutTimers");
		if (dataval.setHeightTimerId) {
			window.clearInterval(dataval.setHeightTimerId);
			dataval.setHeightTimerId = null;
		}
		if (opts.effect == "fade") {
			dataval.setHeightTimerId = window.setInterval(function(){
				var index = $widget.find(".tabLayout .tabLayoutHd > ul > li.on").index();
				var childH = $widget.find(".tabLayout .tabLayoutBd").children().eq(index).height();
				$widget.find(".tabLayout .tabLayoutBd").parent().css("height", childH);
			}, 300);
		}
		$widget.data("tabLayoutTimers", dataval);
	}
	
	var renderHd = function($widget, opts) {
		var $hd = $("<ul>");
		if ("style03|".indexOf(opts.skinClass) >= 0) {
			for (var i=0; i<opts.tags.length; i++) {
				var tag = opts.tags[i];
				$hd.append('<li><a '+((tag.url!="" && opts.trigger!="click")?('href="'+tag.url+'" target="'+tag.target+'"'):'')+'>'+tag.title+'</a></li>');
			}
		} else {
			var widthStr = "";
			if (opts.tagWidth == "average") {
				var width = parseInt($widget.find('.tabLayout .tabLayoutHd').width())/opts.tags.length;
				widthStr = 'style="width:'+width+'px"';
			} else if (opts.tagWidth == "custom" && opts.tagWidthCust != "") {
				widthStr = 'style="width:'+opts.tagWidthCust+'px"';
			}
			for (var i=0; i<opts.tags.length; i++) {
				var tag = opts.tags[i];
				$hd.append('<li '+widthStr+'><a '+((tag.url!="" && opts.trigger!="click")?('href="'+tag.url+'" target="'+tag.target+'"'):'')+'>'+tag.title+'</a></li>');
			}
		}
		$widget.find('.tabLayout .tabLayoutHd').empty().append($hd);
	}
	
	var renderBd = function($widget, opts) {
		if ($widget.find('.tabLayout .tabLayoutBd').parent().hasClass('tempWrap')) {
			$widget.find('.tabLayout .tabLayoutBd').unwrap();
		}
		var $newTabLayoutBd = $("<div>", {"class" : "tabLayoutBd"});
		
		for (var i=0; i<opts.tags.length; i++) {
			var tag = opts.tags[i];
			var $temp = $('<div id='+tag.id+' ></div>');
			if ("style03|".indexOf(opts.skinClass) >= 0) {
				var hdW = $widget.find('.tabLayout .tabLayoutHd').outerWidth(true);
				var hdH = $widget.find('.tabLayout .tabLayoutHd').outerHeight(true);
				var tabW = $widget.find('.tabLayout').width();
				$temp.css("height", hdH);
				$temp.css("width", tabW-hdW);
			}
			if ($widget.find('.tabLayout .tabLayoutBd').children('div[id='+tag.id+']').length > 0) {
				$temp.append($widget.find('.tabLayout .tabLayoutBd').children('div[id='+tag.id+']').children());
			} else {
				$temp.append('<div class="column tab-column ui-sortable"></div>');
			}
			$newTabLayoutBd.append($temp);
		}
		
		$widget.find('.tabLayout .tabLayoutBd').replaceWith($newTabLayoutBd);
	}
	
	$.fn.tablayout.defaults ={
		moduleTitle : "标签页布局",
		tags : [{
			title:"标签", 
			url:"",
			target:"_blank"
	    }],
		skinClass : "style01",
		titCell : ".tabLayoutHd li",
		mainCell : ".tabLayoutBd",
		delayTime : 0,
		effect : "fade",
		autoPlay : false,
		trigger : "mouseover",
		interTime : 2500,
		tagWidth: "default",
		tagWidthCust: 176
	};
})(jQuery)