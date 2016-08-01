(function($) {
	var g = {
		config : function($el, opts) {
		},
		reset : function($el, opts) {
		},
		run : function($el, opts) {
			render($el.attr("id"),{});
		},
		init : function($el, opts) {
			render($el.attr("id"),{});
		}
	};

	$.fn.scene360 = function(oper, opts) {
		if (!oper)
			oper = "init";

		var operr;
		this.each(function() {
			operr = g[oper]($(this), opts);
		});
		if (operr)
			return operr;

		return this;
	};

	var render = function(widgetid, dataval) {
		get360(widgetid,"");
	}
	
	var get360=function(widgetid,pwd){
		var o={pwd:pwd}
		
		$.ajax({
			url: ctx + "/base/scene360/scene360.do?method=scene360Url&vendId=" + g_vendid,
			data:o,
			type : "post",
			dataType : "json",
			success : function(data){
				if(data.result=="needpwd"){//需要密码
					var arr=[];
					arr.push('<div class="shop_360_none delSelf">');
						arr.push('<div class="shop_360_none_input fm1">');
							arr.push('<label class="ml15">');
								arr.push('<input type="password" value="">');
							arr.push('</label>');
							arr.push('<button class="bn b-bg1 btnget360">确定</button> <br>');
							arr.push('<div class=" f16 fcF mt15">请联系商户索取密码查看全景展示</div>');
						arr.push('</div>');
					arr.push('</div>');
					
					var $widget=$("#" + widgetid);
					
					$widget.find(".scene360").hide();
					$widget.find(".shop_360_none").remove();
					$widget.append(arr.join(""));
					$widget.find(".btnget360").click(function(){
						get360(widgetid,$widget.find("input").val());
						return false;
					})
					return;
				}
				
				if(data.result=="wrongpwd"){
					alert("密码错误");
					return;
				}
				
				if(data.result=="no360"){
					$("#" + widgetid).find("div.scene360").html('<img width="950" height="480" src="/static/resource/images/scene360.jpg"/>').show();
					$("#" + widgetid).find(".shop_360_none").hide();
					return;
				}
				
				if(data && data.success && data.path){
					$("#" + widgetid).find("div.scene360").html('<iframe name="scene360Iframe" scrolling="no" frameborder="0" style="width:950px; height:480px;" src="' + data.path + '"></iframe>').show();
					$("#" + widgetid).find(".shop_360_none").hide();
				}
			}
		});
	}

})(jQuery);
