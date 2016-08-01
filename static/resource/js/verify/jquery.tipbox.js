/**
 * 一个简单的box插件，可用于展现提示信息
 * depends：jq，jq-ui
 */
(function($) {
	$.fn.tipBox = function(options) {
		if (!this.length) {
			return this;
		}
		if($("body").find("#_tipbox").length)
			return;
		var $this = this;
		options = $.extend(true, {
			width:200,
			height:30,
			tips:"这里是要显示的提示信息",
			parent:$this.parent(),
			offsetX:0,
			offsetY:0
		}, options);
		var top=0,left=0;
		var structure = 			 
			'<div id="_tipbox" style="z-index:999999999;visibile:hidden;position: absolute; top: '+ top +'; left:'+ left +'" class="layer_tips">'+
				'<div class="error">'+
					'<div class="error_text">'+
						'<span class="icon"></span>'+
						'<span node-type="content">'+options.tips+'</span>'+
					'</div>'+
				'</div>'+
				'<a class="close_icon" href="javascript:;" node-type="close"></a>'+
				'<span class="arrow_down"></span>'+
			'</div>';
		var parent = options.parent||$("body");
		parent.prepend(structure);
		var o = parent.find("#_tipbox");
		o.alignTo($this,"tl-tl",[(options.offsetY||-10),(options.offsetX||-options.height||8)-8]);
		o.css("visibile","visibility");
		
		$this.on("focus",function(){
			o.remove();
		});
		o.find(".close_icon").on("click",function(){
			o.remove();
		})
		
	};
})(jQuery);