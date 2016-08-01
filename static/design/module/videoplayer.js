(function($){
	var g = {
	    config:function($el){
	        return moduleTool.config($el);
	    },
	    reset:function($el,opts){
	    	moduleTool.reset($el,opts,render);
	    },
	    run:function($el){
	    	videojs($el.find("video").attr("id"));
	    },
	    init:function($el){
	    	moduleTool.init($el,render);
	    }
	};
    
	$.fn.videoplayer=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};

	var render=function($widget,dataval){
		var opts = $.extend({}, $.fn.videoplayer.defaults, dataval);
		
		var videoId = "v"+$widget.attr("id")+Math.round(Math.random()*1000);
		var $video = $("<video>", {"id":videoId,"class":"video-js vjs-default-skin vjs-big-play-centered","style":"margin:0 auto;"});
		if (opts.controls) $video.attr("controls", "controls");
		if (opts.muted) $video.attr("muted", "muted");
		if (opts.autoplay) $video.attr("autoplay", "autoplay");
		if (opts.loop) $video.attr("loop", "loop");
		if (opts.poster !== "") $video.attr("poster", opts.poster);
		$video.attr("preload", opts.preload);
		$video.attr("width", opts.width);
		$video.attr("height", opts.height);
		
		for (var i=0; i < opts.source.length; i++) {
			var $source = $("<source>", {"src":opts.source[i].src,"type":"video/"+opts.source[i].type});
			$video.append($source);
		}
		
		if ($widget.find(".videoWapper video p.vjs-no-js").size() > 0) {
			$video.append($widget.find(".videoWapper video p.vjs-no-js"));
		}
		$widget.children(".title-box").find("h3 > span").text(opts.moduleTitle);
		$widget.children(".videoWapper").empty().append($video);
		videojs(videoId);
	}
	
	$.fn.videoplayer.defaults ={
		moduleTitle: "在线视频",
		controls: true,
		autoplay: false,
		loop: false,
		preload: "none",
		muted: false,
		width: 150,
		height: 150,
		poster: "",
		source: []
	};
})(jQuery)