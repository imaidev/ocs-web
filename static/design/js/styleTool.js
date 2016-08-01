/**
 * @Description: 样式工具
 */
if (typeof StyleTool == "undefined") {
	StyleTool = {}
}
$(function(){
	$("div.custPosition").each(function(){
		if($(this).css("position")=="absolute"){
			$(this).draggable({
			});
		}
		else {
			$(this).draggable({
				start:function(event,ui){
					ui.helper.data("templeft",ui.helper.css("left"));
				},
				stop: function( event, ui ) {
					var ml=parseInt(ui.helper.css("left"))+parseInt(ui.helper.css("margin-left"))-parseInt(ui.helper.data("templeft"));
					ui.helper.css("margin-left", ml+"px").css("left", "50%");
				}
			});
		}
		
		try {
			$(this).find(".ui-resizable-handle").remove();
			$(this).resizable("destory");
		} catch (e) {
			// TODO: handle exception
		}
		
		$(this).resizable({
			handles:"e",
			stop:function( event, ui ) {
				reInitModule(ui.helper);
			}
		});
	})
})

/**
 * @Description: 打开样式工具面板
 * @param: widgetId 组件id，如果要修改页面样式，传入字符串“body”
 */
StyleTool.openToolBar = function(widgetId) {
	if (widgetId == null || widgetId == "body") {
		var selected_name = $(".sidebar-nav .tab-bar .selected").removeClass("selected").attr("class");
    	$(".sidebar-nav .tab-bar .style").addClass("selected");
    	
    	// 调用页面样式工具初始化方法
    	StyleTool.bodyToolBarInit();
    	
    	// 打开页面样式工具面板、关闭其他面板
    	$(".sidebar-nav .tool-bar .style .module-style").hide();
    	$(".sidebar-nav .tool-bar .style .body-style").show();
    	$(".sidebar-nav .tool-bar ."+selected_name+" .body").scrollTop(0);
    	$(".sidebar-nav .tool-bar ."+selected_name).css("left", "-285px");
    	$(".sidebar-nav .tool-bar .style").css("left", "50px");
    	$(".sidebar-nav .tool-bar .style .body-style .body").children(".content0").css("height", 
    			$(".sidebar-nav .tool-bar .style .body-style .body").height()-
    			$(".sidebar-nav .tool-bar .style .body-style .body").children(".anchor-content:visible").last().outerHeight(true)-16);
	} else {
		var selected_name = $(".sidebar-nav .tab-bar .selected").removeClass("selected").attr("class");
    	$(".sidebar-nav .tab-bar .style").addClass("selected");
    	
    	// 调用组件样式工具初始化方法
    	StyleTool.moduleToolBarInit(widgetId);
    	
    	// 打开组件样式工具面板、关闭其他面板
    	$(".sidebar-nav .tool-bar .style .body-style").hide();
    	$(".sidebar-nav .tool-bar .style .module-style").show();
    	$(".sidebar-nav .tool-bar ."+selected_name+" .body").scrollTop(0);
    	$(".sidebar-nav .tool-bar ."+selected_name).css("left", "-285px");
    	$(".sidebar-nav .tool-bar .style").css("left", "50px");
    	$(".sidebar-nav .tool-bar .style .module-style .body").children(".content0").css("height", 
    			$(".sidebar-nav .tool-bar .style .module-style .body").height()-
    			$(".sidebar-nav .tool-bar .style .module-style .body").children(".anchor-content:visible").last().outerHeight(true)-16);
    	
    	// 添加组件阴影遮罩
    	StyleTool.addModuleMask();
	}
}

/**
 * @Description: 关闭样式工具面板
 */
StyleTool.closeToolBar = function() {
	$(".sidebar-nav .tab-bar .style").removeClass("selected");
	$(".sidebar-nav .tool-bar .style .body").scrollTop(0);
	$(".sidebar-nav .tool-bar .style").css("left", "-285px");
	
	// 移除组件阴影遮罩
	StyleTool.removeModuleMask();
}

/**
 * @Description: 添加组件阴影遮罩
 */
StyleTool.addModuleMask = function() {
	var $maskContainer = $("<div>", {"class":"style-tool-module-mask-container"});
	$maskContainer.click(function() {
		StyleTool.closeToolBar();
	});
	
	// 计算所需宽度和高度
	var $el = StyleTool.getElement();
	var wh = $(window).outerHeight(true);
	var ww = $(window).outerWidth(true);
	var elh = $el.outerHeight(true);
	var elw = $el.outerWidth(true);
	var elt = $el.offset().top;
	var ell = $el.offset().left;
	var elb = (wh-elh-elt) < 0 ? 0 : (wh-elh-elt);
	var elr = (ww-elw-ell) < 0 ? 0 : (ww-elw-ell);
	
	$maskContainer.append($("<div>", {"class": "style-tool-module-mask style-tool-module-mask-top", "style":"position:absolute;top:50px;left:"+ell+"px;width:"+elw+"px;height:"+(elt-50)+"px;"}).prop("outerHTML"));
	$maskContainer.append($("<div>", {"class": "style-tool-module-mask style-tool-module-mask-left", "style":"position:absolute;top:50px;left:0px;width:"+ell+"px;height:"+(wh-50)+"px;"}).prop("outerHTML"));
	$maskContainer.append($("<div>", {"class": "style-tool-module-mask style-tool-module-mask-bottom", "style":"position:absolute;top:"+(elt+elh)+"px;left:"+ell+"px;width:"+elw+"px;height:"+elb+"px;"}).prop("outerHTML"));
	$maskContainer.append($("<div>", {"class": "style-tool-module-mask style-tool-module-mask-right", "style":"position:absolute;top:50px;left:"+(ell+elw)+"px;width:"+elr+"px;height:"+(wh-50)+"px;"}).prop("outerHTML"));
	$maskContainer.append($("<div>", {"class": "style-tool-module-mask style-tool-module-mask-center", "style":"position:absolute;top:"+elt+"px;left:"+ell+"px;width:"+elw+"px;height:"+elh+"px;"}).prop("outerHTML"));
	
	$("body > .container").append($maskContainer);
	$("body > .container").bind('mousewheel', function(event) {
        event.preventDefault();
	});
}

/**
 * @Description: 移除组件阴影遮罩
 */
StyleTool.removeModuleMask = function() {
	$("body > .container .style-tool-module-mask-container").remove();
	$("body > .container").unbind('mousewheel');
}

/**
 * @Description: 页面样式工具初始化方法
 */
StyleTool.bodyToolBarInit = function() {
	// 初始化页面的样式信息存储空间
	if (typeof $(".container").data("style") == "undefined") {
		$(".container").data("style", {});
	}
	// 向样式工具注册当前修改的组件id
	StyleTool.defaultOption.widgetId = "body";
	// 获取页面的样式配置信息
	var opts = StyleTool.getStyleOption();
	
	// 循环构建样式工具中的修改项
	for (key in opts) {
		var $head = $(".sidebar-nav .tool-bar .style .body-style .head a[href=#body_style_anchor_"+key+"]").parent();
		var $body = $(".sidebar-nav .tool-bar .style .body-style .body div#body_style_anchor_"+key);
		var $ul = $body.find(".content > ul");
		$ul.empty();
		$head.hide();
		$body.hide();
		if (Object.keys(opts[key]).length == 0) {
			continue;
		} else {
			var style = opts[key];
			for (name in style) {
				if (style[name].selector == "" || StyleTool.getElement().find(style[name].selector).length > 0) {
					if (typeof StyleTool.styleModule[style[name].templateCode] != "undefined") {
						try {
							$ul.append(StyleTool.styleModule[style[name].templateCode].init(name, style[name]));
						} catch(e) {
							console.log("样式工具初始化遇到问题："+e.message);
						}
					} else {
						console.log("样式工具初始化遇到问题：未找到编号为"+style[name].templateCode+"的配置模板.");
					}
				} else {
					console.log("样式工具初始化遇到问题：选择器配置不正确，未找到对应元素.");
				}
			}
			if ($ul.children().length > 0) {
				$head.show();
				$body.show();
			}
		}
	}
	
	// 锚点激活
	$(".sidebar-nav .tool-bar .style .body-style .head ul.nav-bubble li:visible").first().addClass("active");
}

/**
 * @Description: 组件样式工具初始化方法
 */
StyleTool.moduleToolBarInit = function(wId) {
	// 初始化当前组件的样式信息存储空间
	if (typeof $("#"+wId).data("style") == "undefined") {
		$("#"+wId).data("style", {});
	}
	// 向样式工具注册当前修改的组件id
	StyleTool.defaultOption.widgetId = wId;
	// 获取组件的样式配置信息
	var opts = StyleTool.getStyleOption();
	
	// 循环构建样式工具中的修改项
	for (key in opts) {
		var $head = $(".sidebar-nav .tool-bar .style .module-style .head a[href=#module_style_anchor_"+key+"]").parent();
		var $body = $(".sidebar-nav .tool-bar .style .module-style .body div#module_style_anchor_"+key);
		var $ul = $body.find(".content > ul");
		$ul.empty();
		$head.hide();
		$body.hide();
		if (Object.keys(opts[key]).length == 0) {
			continue;
		} else {
			var style = opts[key];
			for (name in style) {
				if (style[name].selector == "" || StyleTool.getElement().find(style[name].selector).length > 0) {
					if (typeof StyleTool.styleModule[style[name].templateCode] != "undefined") {
						try {
							$ul.append(StyleTool.styleModule[style[name].templateCode].init(name, style[name]));
						} catch(e) {
							console.log("样式工具初始化遇到问题："+e.message);
						}
					} else {
						console.log("样式工具初始化遇到问题：未找到编号为"+style[name].templateCode+"的配置模板.");
					}
				} else {
					console.log("样式工具初始化遇到问题：选择器配置不正确，未找到对应元素.");
				}
			}
			if ($ul.children().length > 0) {
				$head.show();
				$body.show();
				if (key == "title" && StyleTool.getElement().find(".title-box").css("display") == "none") {
					$head.hide();
					$body.hide();
				}
			}
		}
	}
	
	// 锚点激活
	$(".sidebar-nav .tool-bar .style .module-style .head ul.nav-bubble li:visible").first().addClass("active");
}

/**
 * @Description: 获取组件的样式配置信息
 * 				 调用此方法前需要首先将需要修改的组件id注册到样式工具中
 */
StyleTool.getStyleOption = function() {
	var wId = StyleTool.defaultOption.widgetId;
	if (wId == null || wId == "body") {
		return StyleTool.defaultOption.bodyDefaultStyle;
	} else {
		try {
			return $("#"+wId)[$("#"+wId).attr("data-componentid")]("getStyle");
		} catch(e) {
			return StyleTool.defaultOption.widgetDefaultStyle
		}
	}
}

/**
 * @Description: 获取组件dom，返回jquery对象
 * 				 调用此方法前需要首先将需要修改的组件id注册到样式工具中
 */
StyleTool.getElement = function() {
	var wId = StyleTool.defaultOption.widgetId;
	if (wId == null || wId == "body") {
		return $(".edit > .container");
	} else {
		return $("#"+wId);
	}
}

/**
 * @Description: 获取当前组件某样式修改项所修改的元素，返回jquery对象
 * 				 调用此方法前需要: 1.将需要修改的组件id注册到样式工具中
 * 								  2.使用对应的修改项初始化方法（StyleTool.styleModule.XXXX.init()）进行初始化
 */
StyleTool.selectElement = function(name) {
	var selector = StyleTool.getData(name).selector;
	if (selector == null || selector == "") {
		return StyleTool.getElement();
	} else {
		return StyleTool.getElement().find(selector);
	}
}

/**
 * @Description: 获取当前组件某样式修改项的数据，返回对象
 * 				 调用此方法前需要: 1.将需要修改的组件id注册到样式工具中
 * 								  2.使用对应的修改项初始化方法（StyleTool.styleModule.XXXX.init()）进行初始化
 */
StyleTool.getData = function(name) {
	return StyleTool.getElement().data("style")[name];
}

/**
 * @Description: 获取当前组件某样式修改项的数据，返回对象
 * 				 调用此方法前需要: 1.将需要修改的组件id注册到样式工具中
 */
StyleTool.setData = function(name, o) {
	StyleTool.getElement().data("style")[name] = $.extend({}, StyleTool.getElement().data("style")[name], o);
}

/**
 * @Description: 恢复默认
 */
StyleTool.restoreDefault = function() {
	var $ul = $(".sidebar-nav .tool-bar .style .module-style .body .content > ul > li");
	$ul.each(function() {
		$(this).find('.style-content-c > input:radio').get(0).click();
	});
}

/**
 * @Description: 样式工具通用工具方法
 * 				 "isNumberKey(e[, k])": 判断键盘按下的按键是否为数字键或退格键
 * 								@param e: 当前事件；k:按键code
 * 								@return true:是合法的按键，false:不是合法的按键
 * 				 "isNumber(num)": 判断是否为数字
 * 								@param num: 需要判断的内容
 * 								@return true:是数字，false:不是数字
 * 				 "selectPic(opt)": 打开图片空间选择图片窗口
 * 								@param opt: 打开图片空间的参数对象("dir":上传图片目录,默认为shop;"maxuploadsize":上传图片的最大可上传大小,默认为2M;
 * 											"callBack":选择图片回调函数,默认为默认回调函数)
 * 				 "selectPicDefaultCallBack(path)": 打开图片空间选择图片默认回调函数
 * 								@param path: 上传图片地址
 * 				 "alertMsg(msg[, keep])": 消息提示
 * 								@param msg: 需要展示的消息；keep：true保持窗口不自动关闭，false/null三秒后自动关闭
 */
StyleTool.util = {
	"isNumberKey": function(e, k) {
		if (!e.which) {
			if (k && event.keyCode == 45) {
				return true
			}
			if (((event.keyCode > 47) && (event.keyCode < 58)) || (event.keyCode == 8)) {
				return true
			} else {
				return false
			}
		} else {
			if (k && e.which == 45) {
				return true
			}
			if (((e.which > 47) && (e.which < 58)) || (e.which == 8)) {
				return true
			} else {
				return false
			}
		}
	},
	"isNumber": function(num) {
		if (/[^\d]/.test(num)) {
			return false
		} else {
			return true
		}
	},
	"isNum": function(num) {
		if (/^\-?[1-9]*[0-9]*/.test(num)) {
			return true
		} else {
			return false
		}
	},
	"selectPic": function(opt) {
		opt = $.extend({}, {"dir":"shop", "maxuploadsize":"2M", "callBack":"StyleTool.util.selectPicDefaultCallBack"}, opt);
		layer.open({
	        type : 2,
	        content :  ctx+"/res/tu/ResSelect.htm?dir="+opt.dir+"&maxuploadsize="+opt.maxuploadsize+"&callback="+opt.callBack,
	        title : "图片选取",
	        shadeClose: true,
	        area : ['750px','500px']
	    });
	},
	"selectPicDefaultCallBack": function(path) {
		StyleTool.util.alertMsg('已选择图片（<a href="'+path+'" target="_blank">查看</a>）', true);
	},
	"alertMsg": function(msg, keep) {
		if (keep) {
			var time = 0;
		} else {
			var time = 6000;
		}
		layer.msg(msg, {
		    offset: 80,
		    shift: 5,
		    closeBtn: 1,
		    time: time
		}); 
	}
}

/**
 * @Description: 样式工具修改项模板方法
 * 				 每一个模板都包含init(初始化)、switch(默认、隐藏、自定义切换开关)、setStyle(设置样式)、getStyle(获取样式)四个基本方法
 * 				 以及每个模板具体的操作方法
 * 				 初始化(init)方法对样式修改项的模板进行初始化，将样式配置数据放入模板，同时初始化当前修改项的数据区域
 * 				 切换开关(switch)方法是当用户点击默认、隐藏、自定义radio时控制修改项dom展示的方法，同时按照当前的选择调用一次设置样式方法以刷新页面样式
 * 				 设置样式(setStyle)方法会取出当前数据区中的该修改项的样式数据信息，按照规则对所控制的元素（通过选择器选择的）设置样式
 * 				 获取样式(getStyle)方法会将当前所控制的元素（通过选择器选择的）样式按规则取出并形成样式数据对象，主要用于保存的页面再次编辑时将原先通过样式工具设置的样式取出
 */
StyleTool.styleModule = {
	"CSS_Background": {
		"init": function(name, opts) {
			var $el;
			$.ajax({
				url: "/static/design/cfg/cfgstyle.html?_v="+Math.random(),
				success: function(data){
					$el = $(data).children("."+opts.templateCode).clone();
				},
				error: function(t, o, e) {
					console.log(e);
					return;
				},
				async:false,
				dataType: "html"
			});
			$el.children(".CSS_StyleName").val(name);
			if (opts.title != null) {
				$el.children(".style-title").text(opts.title);
			}
			$el.find(".style-content-c input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".style-content-c label").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});

			if (typeof StyleTool.getData(name) == "undefined") {
				var o = {
					"selector": opts.selector,
					"switch": "0",
					"custColor": opts.templateArgs.custColor == null ? "#ffffff" : opts.templateArgs.custColor,
					"custImageRepeat": opts.templateArgs.custImageRepeat == null ? "11" : opts.templateArgs.custImageRepeat,
					"custImage": StyleTool.defaultOption.defaultImagePath,
					"imageFixed": opts.templateArgs.imageFixed == null ? "0" : opts.templateArgs.imageFixed
				}
				if (opts.selector == "") {
					var $elem = StyleTool.getElement();
				} else {
					var $elem = StyleTool.getElement().find(opts.selector);
				}
				o = $.extend({}, o, StyleTool.styleModule.CSS_Background.getStyle($elem));
				StyleTool.setData(name, o);
			} else {
				var o = StyleTool.getData(name);
			}
			$el.find(".CSS_colorPicker").spectrum({
	            color: o.custColor,
	            preferredFormat: "hex6",
	            showInput: true
	        });
			$el.find(".CSS_Background_Image .CSS_Background_Image_Check").attr("href", o.custImage);
			$el.find(".CSS_Background_Image .upload-image-container img").attr("src", o.custImage);
			if (o.custImage != StyleTool.defaultOption.defaultImagePath) {
				$el.find(".CSS_Background_Image .CSS_Background_Image_Check").show();
				$el.find(".CSS_Background_Image").show();
			}
			$el.find(".CSS_Background_Image_Repeat select").val(o.custImageRepeat);
			
			var isShowImageFixed = opts.templateArgs.showImageFixed == null ? "0" : opts.templateArgs.showImageFixed;
			if (isShowImageFixed == "1") {
				$el.find(".CSS_background_Image_Fixed input").each(function() {
					$(this).attr("name", $(this).attr("name")+"_"+name);
					$(this).attr("id", $(this).attr("id")+"_"+name);
				});
				$el.find(".CSS_background_Image_Fixed label:gt(0)").each(function() {
					$(this).attr("for", $(this).attr("for")+"_"+name);
				});
				if (o.custImageRepeat != "-1") {
					$el.find(".CSS_background_Image_Fixed").show();
				} else {
					$el.find(".CSS_background_Image_Fixed").hide();
				}
				
				if (o.imageFixed == "1") {
					$el.find(".CSS_background_Image_Fixed input[id^=CSS_background_img_fixed]").attr("checked", "checked");
				}
			} else {
				$el.find(".CSS_background_Image_Fixed").remove();
			}
			
			if (o.switch == 0) {
				$el.find(".style-content-c input[id^=CSS_background_default]").attr("checked", "checked");
				$el.find(".style-content-h").hide();
			} else if (o.switch == 1) {
				$el.find(".style-content-c input[id^=CSS_background_hide]").attr("checked", "checked");
				$el.find(".style-content-h").hide();
			} else if (o.switch == 2) {
				$el.find(".style-content-c input[id^=CSS_background_cus]").attr("checked", "checked");
				$el.find(".style-content-h").show();
			}
			return $el;
		},
		"switch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"switch": f});
			StyleTool.styleModule.CSS_Background.setStyle($el);
			
			if (f == 0) {
				$el.find(".style-content-h").hide();
			} else if (f == 1) {
				$el.find(".style-content-h").hide();
			} else if (f == 2) {
				$el.find(".style-content-h").show();
			}
		},
		"selectPic": function() {
			var option = {
				"callBack": "StyleTool.styleModule.CSS_Background.selectPicCallBack"
			}
			var event = window.event || arguments.callee.caller.arguments[0];
			StyleTool.styleModule.CSS_Background.selectPicCallBack.prototype.curli=$(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			StyleTool.util.selectPic(option);
		},
		"selectPicCallBack": function(path) {
			var $curli = StyleTool.styleModule.CSS_Background.selectPicCallBack.prototype.curli;
			var styleName = $curli.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custImage": path});
			StyleTool.styleModule.CSS_Background.setStyle($curli);
			
			$curli.find(".style-content-h .upload-image-container img").attr("src", path);
			$curli.find(".style-content-h .CSS_Background_Image_Check").attr("href", path).show();
			
			$curli.find(".style-content-h .CSS_Background_Image").show();
		},
		"colorChange": function(obj) {
			var $el = $(obj).closest(".style-item");
			var color = $el.find(".CSS_Background_Color .CSS_colorPicker").val();
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custColor": color});
			StyleTool.styleModule.CSS_Background.setStyle($el);
		},
		"imageRepeatChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var imageRepeat = $el.find(".CSS_Background_Image_Repeat select").val();
			var styleName = $el.children(".CSS_StyleName").val();
			var o = StyleTool.getData(styleName);
			
			StyleTool.setData(styleName, {"custImageRepeat": imageRepeat});
			StyleTool.styleModule.CSS_Background.setStyle($el);
			if ($el.find(".CSS_background_Image_Fixed").length != 0 && imageRepeat != "-1") {
				$el.find(".CSS_background_Image_Fixed").show();
			} else {
				$el.find(".CSS_background_Image_Fixed").hide();
			}
			if (o.custImage == StyleTool.defaultOption.defaultImagePath) {
				StyleTool.util.alertMsg("请先添加背景图片");
				return;
			}
			if (imageRepeat == "12" || imageRepeat == "13") {
				StyleTool.util.alertMsg("低版本浏览器显示为‘完全平铺’");
			}
		},
		"imageFixedChange": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"imageFixed": f});
			StyleTool.styleModule.CSS_Background.setStyle($el);
		},
		"setStyle": function($el) {
			var styleName = $el.children(".CSS_StyleName").val();
			var $target = StyleTool.selectElement(styleName);
			var o = StyleTool.getData(styleName);
			$target.each(function() {
				if (o.switch == 0) {
					$(this).css("background", "");
				} else if (o.switch == 1) {
					$(this).css("background", "none");
				} else if (o.switch == 2) {
					$(this).css("background", "");
					$(this).css("background-color", o.custColor);
					if (o.custImage != StyleTool.defaultOption.defaultImagePath && o.custImageRepeat != "-1") {
						$(this).css("background-image", "url("+o.custImage+")");
						if (o.custImageRepeat.substr(0, 1) == "0") {
							var k = o.custImageRepeat.substr(1, 1);
							$(this).css("background-repeat", "no-repeat");
							if (k == 1)$(this).css("background-position", "center center");
							if (k == 2)$(this).css("background-position", "left");
							if (k == 3)$(this).css("background-position", "right");
							if (k == 4)$(this).css("background-position", "top");
							if (k == 5)$(this).css("background-position", "bottom");
							if (k == 6)$(this).css("background-position", "left top");
							if (k == 7)$(this).css("background-position", "right top");
							if (k == 8)$(this).css("background-position", "left bottom");
							if (k == 9)$(this).css("background-position", "right bottom");
						}
						if (o.custImageRepeat.substr(0, 1) == "1") {
							var k = o.custImageRepeat.substr(1, 1);
							$(this).css("background-repeat", "repeat");
							$(this).css("background-position", "top");
							if (k == "2")$(this).css("background-size", "100% 100%");
							if (k == "3")$(this).css("background-size", "100%");
						}
						if (o.custImageRepeat.substr(0, 1) == "2") {
							var k = o.custImageRepeat.substr(1, 1);
							$(this).css("background-repeat", "repeat-y");
							if (k == 1)$(this).css("background-position", "top left");
							if (k == 2)$(this).css("background-position", "top center");
							if (k == 3)$(this).css("background-position", "top right");
						}
						if (o.custImageRepeat.substr(0, 1) == "3") {
							var k = o.custImageRepeat.substr(1, 1);
							$(this).css("background-repeat", "repeat-x");
							if (k == 1)$(this).css("background-position", "top center");
							if (k == 2)$(this).css("background-position", "center center");
							if (k == 3)$(this).css("background-position", "bottom center");
						}
						if (o.imageFixed == "1") {
							$(this).css("background-attachment", "fixed");
						}
					}
				}
			});
		},
		"getStyle": function($el) {
			var o = {};
			if ($el.get(0).style.background == "none") {
				o.switch = "1";
				return o;
			}
			if ($el.get(0).style.backgroundColor != "") {
				o.custColor = $el.get(0).style.backgroundColor;
				o.switch = "2";
			}
			if ($el.get(0).style.backgroundImage != "") {
				var custImage = $el.get(0).style.backgroundImage;
				o.custImage = custImage.substring(5, custImage.length-2);
				o.switch = "2";
				if ($el.get(0).style.backgroundRepeat != "") {
					var repeat = $el.get(0).style.backgroundRepeat;
					var positionX = $el.get(0).style.backgroundPositionX == "" ? "50%" : $el.get(0).style.backgroundPositionX;
					var positionY = $el.get(0).style.backgroundPositionY == "" ? "50%" : $el.get(0).style.backgroundPositionY;
					if (repeat == "no-repeat") {
						if (positionX == "0%" && positionY == "0%")o.custImageRepeat = "06";
						if (positionX == "0%" && positionY == "50%")o.custImageRepeat = "02";
						if (positionX == "0%" && positionY == "100%")o.custImageRepeat = "08";
						if (positionX == "50%" && positionY == "0%")o.custImageRepeat = "04";
						if (positionX == "50%" && positionY == "50%")o.custImageRepeat = "01";
						if (positionX == "50%" && positionY == "100%")o.custImageRepeat = "05";
						if (positionX == "100%" && positionY == "0%")o.custImageRepeat = "07";
						if (positionX == "100%" && positionY == "50%")o.custImageRepeat = "03";
						if (positionX == "100%" && positionY == "100%")o.custImageRepeat = "09";
					}
					if (repeat == "repeat") {
						o.custImageRepeat = "11";
						if ($el.get(0).style.backgroundSize == "100% 100%")o.custImageRepeat = "12";
						if ($el.get(0).style.backgroundSize == "100%")o.custImageRepeat = "13";
					}
					if (repeat == "repeat-y") {
						if (positionX == "0%" && positionY == "0%")o.custImageRepeat = "21";
						if (positionX == "50%" && positionY == "0%")o.custImageRepeat = "22";
						if (positionX == "100%" && positionY == "0%")o.custImageRepeat = "23";
					}
					if (repeat == "repeat-x") {
						if (positionX == "50%" && positionY == "0%")o.custImageRepeat = "31";
						if (positionX == "50%" && positionY == "50%")o.custImageRepeat = "32";
						if (positionX == "50%" && positionY == "100%")o.custImageRepeat = "33";
					}
					if ($el.get(0).style.backgroundAttachment == "fixed") {
						o.imageFixed = "1";
					}
				}
			}
			return o;
		}
	},
	"CSS_Height": {
		"init": function(name, opts) {
			var $el;
			$.ajax({
				url: "/static/design/cfg/cfgstyle.html?_v="+Math.random(),
				success: function(data){
					$el = $(data).children("."+opts.templateCode).clone();
				},
				error: function(t, o, e) {
					console.log(e);
					return;
				},
				async:false,
				dataType: "html"
			});
			$el.children(".CSS_StyleName").val(name);
			if (opts.title != null) {
				$el.children(".style-title").text(opts.title);
			}
			$el.find(".style-content-c input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".style-content-c label").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});

			if (typeof StyleTool.getData(name) == "undefined") {
				var o = {
					"selector": opts.selector,
					"switch": "0",
					"custHeight": opts.templateArgs.custHeight == null ? "" : opts.templateArgs.custHeight,
					"custMinHeight": opts.templateArgs.custMinHeight == null ? 1 : opts.templateArgs.custMinHeight,
					"custMaxHeight": opts.templateArgs.custMaxHeight == null ? 980 : opts.templateArgs.custMaxHeight
				}
				if (opts.selector == "") {
					var $elem = StyleTool.getElement();
				} else {
					var $elem = StyleTool.getElement().find(opts.selector);
				}
				o = $.extend({}, o, StyleTool.styleModule.CSS_Height.getStyle($elem));
				StyleTool.setData(name, o);
			} else {
				var o = StyleTool.getData(name);
			}
			$el.find(".CSS_height_value input").val(o.custHeight);
			
			if (o.switch == 0) {
				$el.find(".style-content-c input[id^=CSS_height_default]").attr("checked", "checked");
				$el.find(".style-content-c .CSS_height_value").hide();
			} else if (o.switch == 2) {
				$el.find(".style-content-c input[id^=CSS_height_cus]").attr("checked", "checked");
				$el.find(".style-content-c .CSS_height_value").css("display", "");
			}
			return $el;
		},
		"switch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"switch": f});
			StyleTool.styleModule.CSS_Height.setStyle($el);
			
			if (f == 0) {
				$el.find(".style-content-c .CSS_height_value").hide();
			} else if (f == 2) {
				$el.find(".style-content-c .CSS_height_value").css("display", "");
			}
		},
		"heightChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var height = $el.find(".CSS_height_value input").val();
			var styleName = $el.children(".CSS_StyleName").val();
			var o = StyleTool.getData(styleName);
			if (height == "") {
				StyleTool.util.alertMsg("高度不能为空。");
				return;
			}
			if (height > o.custMaxHeight || height < o.custMinHeight) {
				StyleTool.util.alertMsg("高度须设置在"+o.custMinHeight+"-"+o.custMaxHeight+"像素之间。");
				return;
			}
			if (!StyleTool.util.isNumber(height)) {
				$el.find(".CSS_height_value input").val("");
				StyleTool.util.alertMsg("高度只能输入数字。");
				return;
			}
			StyleTool.setData(styleName, {"custHeight": height});
			StyleTool.styleModule.CSS_Height.setStyle($el);
		},
		"setStyle": function($el) {
			var styleName = $el.children(".CSS_StyleName").val();
			var $target = StyleTool.selectElement(styleName);
			var o = StyleTool.getData(styleName);
			$target.each(function() {
				if (o.switch == 0) {
					$(this).css("height", "");
				} else if (o.switch == 2) {
					$(this).css("height", o.custHeight+"px");
				}
			});
		},
		"getStyle": function($el) {
			var o = {};
			if ($el.get(0).style.height != "") {
				o.custHeight = parseInt($el.get(0).style.height);
				o.switch = "2";
			}
			return o;
		}
	},
	"CSS_Border": {
		"init": function(name, opts) {
			var $el;
			$.ajax({
				url: "/static/design/cfg/cfgstyle.html?_v="+Math.random(),
				success: function(data){
					$el = $(data).children("."+opts.templateCode).clone();
				},
				error: function(t, o, e) {
					console.log(e);
					return;
				},
				async:false,
				dataType: "html"
			});
			$el.children(".CSS_StyleName").val(name);
			if (opts.title != null) {
				$el.children(".style-title").text(opts.title);
			}
			$el.find(".style-content-c input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".style-content-c label").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});

			if (typeof StyleTool.getData(name) == "undefined") {
				var o = {
					"selector": opts.selector,
					"switch": "0",
					"custColor": opts.templateArgs.custColor == null ? "#000000" : opts.templateArgs.custColor,
					"custWidth": opts.templateArgs.custWidth == null ? "1" : opts.templateArgs.custWidth,
					"custStyle": opts.templateArgs.custStyle == null ? "0" : opts.templateArgs.custStyle,
				}
				if (opts.selector == "") {
					var $elem = StyleTool.getElement();
				} else {
					var $elem = StyleTool.getElement().find(opts.selector);
				}
				o = $.extend({}, o, StyleTool.styleModule.CSS_Border.getStyle($elem));
				StyleTool.setData(name, o);
			} else {
				var o = StyleTool.getData(name);
			}
			$el.find(".CSS_colorPicker").spectrum({
	            color: o.custColor,
	            preferredFormat: "hex6",
	            showInput: true
	        });
			$el.find(".CSS_Border_Width select").val(o.custWidth);
			$el.find(".CSS_Border_Style select").val(o.custStyle);
			
			if (o.switch == 0) {
				$el.find(".style-content-c input[id^=CSS_border_default]").attr("checked", "checked");
				$el.find(".style-content-h").hide();
			} else if (o.switch == 1) {
				$el.find(".style-content-c input[id^=CSS_border_hide]").attr("checked", "checked");
				$el.find(".style-content-h").hide();
			} else if (o.switch == 2) {
				$el.find(".style-content-c input[id^=CSS_border_cus]").attr("checked", "checked");
				$el.find(".style-content-h").show();
			}
			return $el;
		},
		"switch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"switch": f});
			StyleTool.styleModule.CSS_Border.setStyle($el);
			
			if (f == 0) {
				$el.find(".style-content-h").hide();
			} else if (f == 1) {
				$el.find(".style-content-h").hide();
			} else if (f == 2) {
				$el.find(".style-content-h").show();
			}
		},
		"colorChange": function(obj) {
			var $el = $(obj).closest(".style-item");
			var color = $el.find(".CSS_Border_Color .CSS_colorPicker").val();
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custColor": color});
			StyleTool.styleModule.CSS_Border.setStyle($el);
		},
		"widthChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var width = $el.find(".CSS_Border_Width select").val();
			var styleName = $el.children(".CSS_StyleName").val();
			var o = StyleTool.getData(styleName);
			
			StyleTool.setData(styleName, {"custWidth": width});
			StyleTool.styleModule.CSS_Border.setStyle($el);
		},
		"styleChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var style = $el.find(".CSS_Border_Style select").val();
			var styleName = $el.children(".CSS_StyleName").val();
			var o = StyleTool.getData(styleName);
			
			StyleTool.setData(styleName, {"custStyle": style});
			StyleTool.styleModule.CSS_Border.setStyle($el);
		},
		"setStyle": function($el) {
			var styleName = $el.children(".CSS_StyleName").val();
			var $target = StyleTool.selectElement(styleName);
			var o = StyleTool.getData(styleName);
			$target.each(function() {
				if (o.switch == 0) {
					$(this).css("border", "");
				} else if (o.switch == 1) {
					$(this).css("border", "none");
				} else if (o.switch == 2) {
					$(this).css("border", "");
					$(this).css("border-color", o.custColor);
					$(this).css("border-width", o.custWidth+"px");
					if (o.custStyle == "0") {
						$(this).css("border-style", "solid");
					}
					if (o.custStyle == "1") {
						$(this).css("border-style", "dotted");
					}
					if (o.custStyle == "2") {
						$(this).css("border-style", "dashed");
					}
				}
			});
		},
		"getStyle": function($el) {
			var o = {};
			if ($el.get(0).style.border == "none") {
				o.switch = "1";
				return o;
			}
			if ($el.get(0).style.borderColor != "") {
				o.custColor = $el.get(0).style.borderColor;
				o.switch = "2";
			}
			if ($el.get(0).style.borderWidth != "") {
				o.custWidth = parseInt($el.get(0).style.borderWidth);
				o.switch = "2";
			}
			if ($el.get(0).style.borderStyle != "") {
				var style = $el.get(0).style.borderStyle;
				if (style == "solid")o.custStyle = "0";
				if (style == "dotted")o.custStyle = "1";
				if (style == "dashed")o.custStyle = "2";
				o.switch = "2";
			}
			return o;
		}
	},
	"CSS_ShowSwitch": {
		"init": function(name, opts) {
			var $el;
			$.ajax({
				url: "/static/design/cfg/cfgstyle.html?_v="+Math.random(),
				success: function(data){
					$el = $(data).children("."+opts.templateCode).clone();
				},
				error: function(t, o, e) {
					console.log(e);
					return;
				},
				async:false,
				dataType: "html"
			});
			$el.children(".CSS_StyleName").val(name);
			if (opts.title != null) {
				$el.children(".style-title").text(opts.title);
			}
			$el.find(".style-content-c input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".style-content-c label").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});

			if (typeof StyleTool.getData(name) == "undefined") {
				var o = {
					"selector": opts.selector,
					"switch": "0",
					"callBack": opts.templateArgs.callBack == null ? (function($el){}) : opts.templateArgs.callBack
				}
				if (opts.selector == "") {
					var $elem = StyleTool.getElement();
				} else {
					var $elem = StyleTool.getElement().find(opts.selector);
				}
				o = $.extend({}, o, StyleTool.styleModule.CSS_ShowSwitch.getStyle($elem));
				StyleTool.setData(name, o);
			} else {
				var o = StyleTool.getData(name);
			}
			
			if (o.switch == 0) {
				$el.find(".style-content-c input[id^=CSS_showSwitch_show]").attr("checked", "checked");
			} else if (o.switch == 1) {
				$el.find(".style-content-c input[id^=CSS_showSwitch_hide]").attr("checked", "checked");
			}
			return $el;
		},
		"switch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"switch": f});
			StyleTool.styleModule.CSS_ShowSwitch.setStyle($el);
		},
		"setStyle": function($el) {
			var styleName = $el.children(".CSS_StyleName").val();
			var $target = StyleTool.selectElement(styleName);
			var o = StyleTool.getData(styleName);
			$target.each(function() {
				if (o.switch == 0) {
					$(this).css("display", "");
				} else if (o.switch == 1) {
					$(this).css("display", "none");
				}
			});
			o.callBack($el);
		},
		"getStyle": function($el) {
			var o = {};
			if ($el.get(0).style.display == "none") {
				o.switch = "1";
			} else {
				o.switch = "0";
			}
			return o;
		}
	},
	
	"CSS_Position": {
		"init": function(name, opts) {
			var $el;
			$.ajax({
				url: "/static/design/cfg/cfgstyle.html?_v="+Math.random(),
				success: function(data){
					$el = $(data).children("."+opts.templateCode).clone();
				},
				error: function(t, o, e) {
					console.log(e);
					return;
				},
				async:false,
				dataType: "html"
			});
			$el.children(".CSS_StyleName").val(name);
			if (opts.title != null) {
				$el.children(".style-title").text(opts.title);
			}
			$el.find(".style-content-c input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".style-content-c label").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});
				
			if (typeof StyleTool.getData(name) == "undefined") {
				var o = {
					"selector": opts.selector,
					"switch": "0",
					"absolute_left":opts.templateArgs.absolute_left == null ? 50 : opts.templateArgs.absolute_left,
					"absolute_top":opts.templateArgs.absolute_top == null ? "" : opts.templateArgs.absolute_top,
							
					"fixed_marginleft":opts.templateArgs.fixed_marginleft == null ? 0 : opts.templateArgs.fixed_marginleft,
					"fixed_top":opts.templateArgs.fixed_top == null ? "" : opts.templateArgs.fixed_top,
							
					"MinOffset": opts.templateArgs.MinOffset == null ? -999 : opts.templateArgs.MinOffset,
					"MaxOffset": opts.templateArgs.MaxOffset == null ? 999 : opts.templateArgs.MaxOffset
				}
				if (opts.selector == "") {
					var $elem = StyleTool.getElement();
				} else {
					var $elem = StyleTool.getElement().find(opts.selector);
				}
				o = $.extend({}, o, StyleTool.styleModule.CSS_Position.getStyle($elem));
				StyleTool.setData(name, o);
			} else {
				var o = StyleTool.getData(name);
			}
			
			if (o.switch == 0) {
				$el.find(".style-content-c input[id^=CSS_Position_default]").attr("checked", "checked");
				$el.find(".style-content-h").hide();
			} else if (o.switch == 3) {
				$el.find(".style-content-c input[id^=CSS_Position_absolute]").attr("checked", "checked");
				$el.find(".style-content-h").show();
				
				$el.find(".CSS_Position_top input").val(o.absolute_top);
				$el.find(".CSS_Position_leftorMagrinLeft input").val(o.absolute_left);
				
			} else if (o.switch == 4) {
				$el.find(".style-content-c input[id^=CSS_Position_fixed]").attr("checked", "checked");
				$el.find(".style-content-h").show();
				
				$el.find(".CSS_Position_top input").val(o.fixed_top);
				$el.find(".CSS_Position_leftorMagrinLeft input").val(o.fixed_marginleft);
			}
			
			return $el;
		},
		"switch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"switch": f});
			StyleTool.styleModule.CSS_Position.setStyle($el);
			
			var o = StyleTool.getData(styleName);
			if (f == 0) {
				$el.find(".style-content-h").hide();
				
				
			} else if (f == 3 ) {
				$el.find(".CSS_Position_top input").val(o.absolute_top);
				$el.find(".CSS_Position_leftorMagrinLeft input").val(o.absolute_left);
				$el.find(".style-content-h").show();
				
				
				
			} else if (f == 4 ) {
				$el.find(".CSS_Position_top input").val(o.fixed_top);
				$el.find(".CSS_Position_leftorMagrinLeft input").val(o.fixed_marginleft);
				$el.find(".style-content-h").show();
			}
		},
		"topChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			
			var top = $el.find(".CSS_Position_top input").val();
			var styleName = $el.children(".CSS_StyleName").val();
			var o = StyleTool.getData(styleName);
			if (top > o.MaxOffset || top < o.MinOffset) {
				StyleTool.util.alertMsg("偏移量须设置在"+o.MinOffset+"-"+o.MaxOffset+"像素之间。");
				return;
			}
			if (!StyleTool.util.isNum(top)) {
				$el.find(".CSS_Position_top input").val("");
				StyleTool.util.alertMsg("偏移量只能输入正负整数。");
				return;
			}
			if(o.switch==3){
				StyleTool.setData(styleName, {"absolute_top": top});
			}
			if(o.switch==4){
				StyleTool.setData(styleName, {"fixed_top": top});
			}
			
			StyleTool.styleModule.CSS_Position.setStyle($el);
		},
		"leftorMagrinLeftChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			
			var leftormarginleft = $el.find(".CSS_Position_leftorMagrinLeft input").val();
			var styleName = $el.children(".CSS_StyleName").val();
			var o = StyleTool.getData(styleName);
			if (leftormarginleft > o.MaxOffset || leftormarginleft < o.MinOffset) {
				StyleTool.util.alertMsg("偏移量须设置在"+o.MinOffset+"-"+o.MaxOffset+"像素之间。");
				return;
			}
			if (!StyleTool.util.isNum(leftormarginleft)) {
				$el.find(".CSS_Position_leftorMagrinLeft input").val("");
				StyleTool.util.alertMsg("偏移量只能输入正负整数。");
				return;
			}
			if(o.switch==3){
				StyleTool.setData(styleName, {"absolute_left": leftormarginleft});
			}
			if(o.switch==4){
				StyleTool.setData(styleName, {"fixed_marginleft": leftormarginleft});
			}
			
			StyleTool.styleModule.CSS_Position.setStyle($el);
		},
		"setStyle": function($el) {
			var styleName = $el.children(".CSS_StyleName").val();
			var $target = StyleTool.selectElement(styleName);
			var o = StyleTool.getData(styleName);
			
			$target.each(function() {
				if (o.switch == 0) {//停靠
					var $box=$(this).closest('.box');
					$box.removeClass("custPosition").removeClass("positionFix").removeClass("positionFixed");
					
					$box.css("width", "")
					.css("position", "")
					.css("top", "")
					.css("left", "")
					.css("margin-left", "")
					
					var $stuckdiv=$('div[data-ref='+$(this).attr("id")+']');
					
					if($stuckdiv.length==0){
						
						//如果没有占位的DIV，则找到所在页头、页尾或内容区的第一个column，创建一个占位DIV
						var $demo;
						var $demo_free=$box.parent();
						if($demo_free.hasClass('demo_c_free')) {
							$demo=$('.demo_c');
						}
						else if($demo_free.hasClass('demo_h_free')) {
							$demo=$('.demo_h');
						}
						else if($demo_free.hasClass('demo_f_free')) {
							$demo=$('.demo_f');
						}
						
						if($demo.find('.column').length>0){
							$demo.find('.column:first').append('<div data-ref='+$(this).attr("id")+'></div>');
							$stuckdiv=$('div[data-ref='+$(this).attr("id")+']');
						}
						else{
							$box.remove();
							return;
						}
					}
					
					$stuckdiv.after($box);
					$stuckdiv.remove();
					
					StyleTool.removeModuleMask();
					StyleTool.addModuleMask();
					
					$box.draggable("destroy");
					$box.resizable("destroy");
					
					reInitModule($box);
					
					/*$(this).removeClass("custPosition").removeClass("positionFix");
					$(this).parent().removeClass('stuckview');
					$(this).css("width", "");
					$(this).css("position", "");
					
					$(this).css("top", "");
					$(this).css("left", "");
					$(this).css("margin-left", "");
					
					StyleTool.removeModuleMask();
					StyleTool.addModuleMask();
					
					$(this).draggable( "destroy" );*/
				} else if (o.switch == 3) {
					var $box=$(this).closest('.box');
					
					if($box.css("position")=="absolute") return;
					
					$box.css("width",$box.width()).addClass("custPosition").removeClass("positionFix");
					
					//移动到相应的自由拖动层
					var $demo=$box.parents(".demo");
					var $demo_free;
					if($demo.length>0) $box.after("<div data-ref="+$(this).attr("id")+" ></div>");//创建一个占位div
					if($demo.hasClass('demo_c')) {
						$demo_free=$('.demo_c_free');
					}
					else if($demo.hasClass('demo_h')){
						$demo_free=$('.demo_h_free');
					}
					else if($demo.hasClass('demo_f')){
						$demo_free=$('.demo_f_free');
					}
					
					if(o.absolute_top==""){
						if($demo_free){
							o.absolute_top=$box.offset().top-$demo_free.offset().top;
							o.absolute_left=$box.offset().left-$demo_free.offset().left;
						}
						else{
							o.absolute_top=$box.offset().top;
							o.absolute_left=$box.offset().left;
						}
						
						StyleTool.setData(styleName, {"absolute_top": o.absolute_top});
						
						
						StyleTool.setData(styleName, {"absolute_left": o.absolute_left});
					}
					
					$box.appendTo($demo_free);
					$box.css("position", "absolute")
					.css("top",o.absolute_top+"px")
					.css("left",o.absolute_left+"px")
					.css("margin-left", "");
					
					StyleTool.util.alertMsg("现在你可以自由拖动组件了，建议您切换到预览模式调整浮动组件位置");
					$box.draggable({
						stop: function( event, ui ) {
							StyleTool.setData(styleName, {"absolute_top": parseInt(ui.helper.css("top"))});
							StyleTool.setData(styleName, {"absolute_left": parseInt(ui.helper.css("left"))});
						}
					});
					
					$box.resizable({
						handles:"e",
						stop:function( event, ui ) {
							reInitModule(ui.helper);
						}
					});
					
					addFix();
					
					StyleTool.removeModuleMask();
					StyleTool.addModuleMask();
					/*$(this).addClass("custPosition").removeClass("positionFix");
					$(this).parent().addClass('stuckview');
					$(this).css("width",$(this).width());//显式指定宽度
					$(this).css("position", "absolute");
					
					$(this).css("top",o.absolute_top+"px");
					$(this).css("left",o.absolute_left+"px");
					$(this).css("margin-left", "");
					
					patchZIndex();
					StyleTool.removeModuleMask();
					StyleTool.addModuleMask();
					
					StyleTool.util.alertMsg("现在你可以自由拖动图片了。");
					$(this).draggable({
						stop: function( event, ui ) {
							StyleTool.setData(styleName, {"absolute_top": parseInt(ui.helper.css("top"))});
							StyleTool.setData(styleName, {"absolute_left": parseInt(ui.helper.css("left"))});
						}
					});*/
				} else if(o.switch == 4){
					var $box=$(this).closest('.box');
					$box.css("width",$box.width()).addClass("custPosition").addClass("positionFix");;
					
					if(o.fixed_top==""){
						o.fixed_top=$box.offset().top;
						StyleTool.setData(styleName, {"fixed_top": o.fixed_top});
					}
					
					//移动到相应的自由拖动层
					var $demo=$box.parents(".demo");
					if($demo.length>0) $box.after("<div data-ref="+$(this).attr("id")+" ></div>");//创建一个占位div
					if($demo.hasClass('demo_c')) $box.appendTo('.demo_c_free');
					if($demo.hasClass('demo_h')) $box.appendTo('.demo_h_free');
					if($demo.hasClass('demo_f')) $box.appendTo('.demo_f_free');
					
					
					$box.css("position", "fixed")
					.css("top",o.fixed_top+"px")
					.css("left","50%")
					.css("margin-left", o.fixed_marginleft+"px");
					
					StyleTool.util.alertMsg("现在你可以自由拖动组件了,建议您切换到预览模式调整浮动组件位置");
					$box.draggable({
						start:function(event,ui){
							ui.helper.data("templeft",ui.helper.css("left"));
						},
						stop: function( event, ui ) {
							StyleTool.setData(styleName, {"fixed_top": parseInt(ui.helper.css("top"))});
							
							var ml=parseInt(ui.helper.css("left"))+parseInt(ui.helper.css("margin-left"))-parseInt(ui.helper.data("templeft"));
							ui.helper.css("margin-left", ml+"px").css("left", "50%");
							StyleTool.setData(styleName, {"fixed_marginleft": ml})
							
						}
					});
					
					$box.resizable({
						handles:"e",
						stop:function( event, ui ) {
							reInitModule(ui.helper);
						}
					});
					
					addFix();
					
					StyleTool.removeModuleMask();
					StyleTool.addModuleMask();
					/*$(this).addClass("custPosition").addClass("positionFix");
					$(this).parent().addClass('stuckview');
					$(this).css("width",$(this).width());//显式指定宽度
					
					if(o.fixed_top==""){
						o.fixed_top=$(this).offset().top;
						StyleTool.setData(styleName, {"fixed_top": o.fixed_top});
					}
					$(this).css("position", "fixed");
					$(this).css("top",o.fixed_top+"px");
					$(this).css("left","50%");
					$(this).css("margin-left", o.fixed_marginleft+"px");
					
					StyleTool.util.alertMsg("现在你可以自由拖动图片了。");
					$(this).draggable({
						start:function(event,ui){
							ui.helper.data("templeft",ui.helper.css("left"));
						},
						stop: function( event, ui ) {
							StyleTool.setData(styleName, {"fixed_top": parseInt(ui.helper.css("top"))});
							
							var ml=parseInt(ui.helper.css("left"))+parseInt(ui.helper.css("margin-left"))-parseInt(ui.helper.data("templeft"));
							ui.helper.css("margin-left", ml+"px").css("left", "50%");
							StyleTool.setData(styleName, {"fixed_marginleft": ml})
							
						}
					});
					patchZIndex();
					StyleTool.removeModuleMask();
					StyleTool.addModuleMask();*/
				}
			});
		},
		"getStyle": function($el) {
			var o = {};
			var $box=$el.closest('.box');
			if ($box.get(0).style.position=="" || $box.get(0).style.position=="static"){
				o.switch="0";
			}
			else if($box.get(0).style.position=="absolute"){
				o.switch="3";
				o.absolute_left=parseInt($box.get(0).style.left);
				o.absolute_top=parseInt($box.get(0).style.top);
			}
			else if($box.get(0).style.position=="fixed"){
				o.switch="4";
				o.fixed_marginleft=parseInt($box.get(0).style.marginLeft);
				o.fixed_top=parseInt($box.get(0).style.top);
			}
			
			return o;
		}
	},
	"CSS_Font": {
		"init": function(name, opts) {
			var $el;
			$.ajax({
				url: "/static/design/cfg/cfgstyle.html?_v="+Math.random(),
				success: function(data){
					$el = $(data).children("."+opts.templateCode).clone();
				},
				error: function(t, o, e) {
					console.log(e);
					return;
				},
				async:false,
				dataType: "html"
			});
			$el.children(".CSS_StyleName").val(name);
			if (opts.title != null) {
				$el.children(".style-title").text(opts.title);
			}
			$el.find(".style-content-c input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".style-content-c label").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});

			if (typeof StyleTool.getData(name) == "undefined") {
				var o = {
					"selector": opts.selector,
					"switch": "0",
					"custColorSwitch": "0",
					"custColor": opts.templateArgs.custColor == null ? "#ffffff" : opts.templateArgs.custColor,
					"custSize": opts.templateArgs.custSize == null ? "12" : opts.templateArgs.custSize,
					"custFamily": opts.templateArgs.custFamily == null ? "SimSun" : opts.templateArgs.custFamily,
					"custWeight": opts.templateArgs.custWeight == null ? "normal" : opts.templateArgs.custWeight,
					"custStyle": opts.templateArgs.custStyle == null ? "normal" : opts.templateArgs.custStyle,
					"custSizeMin": opts.templateArgs.custSizeMin == null ? 12 : opts.templateArgs.custSizeMin,
					"custSizeMax": opts.templateArgs.custSizeMax == null ? 25 : opts.templateArgs.custSizeMax
							
				}
				if (opts.selector == "") {
					var $elem = StyleTool.getElement();
				} else {
					var $elem = StyleTool.getElement().find(opts.selector);
				}
				o = $.extend({}, o, StyleTool.styleModule.CSS_Font.getStyle($elem));
				StyleTool.setData(name, o);
			} else {
				var o = StyleTool.getData(name);
			}
			
			$el.find(".CSS_Font_Color input").each(function() {
				$(this).attr("name", $(this).attr("name")+"_"+name);
				$(this).attr("id", $(this).attr("id")+"_"+name);
			});
			$el.find(".CSS_Font_Color label[for]").each(function() {
				$(this).attr("for", $(this).attr("for")+"_"+name);
			});
			if (o.custColorSwitch == 2) {
				$el.find(".CSS_Font_Color input[id^=CSS_font_color_cus]").attr("checked", "checked");
				$el.find(".CSS_colorPicker").spectrum({
					color: o.custColor,
					preferredFormat: "hex6",
					showInput: true
				});
			} else {
				$el.find(".CSS_Font_Color input[id^=CSS_font_color_default]").attr("checked", "checked");
			}
			$el.find("select.CSS_Font_Size").empty();
			for (var i = o.custSizeMin; i <= o.custSizeMax; i++) {
				$el.find("select.CSS_Font_Size").append('<option value="'+i+'">'+i+'</option>');
			}
			$el.find("select.CSS_Font_Size").val(o.custSize);
			
			$el.find(".CSS_Font_Family select").val(o.custFamily);
			
			$el.find("input.CSS_Font_Weight").attr("id", $el.find("input.CSS_Font_Weight").attr("id")+"_"+name);
			$el.find("input.CSS_Font_Weight").prev().attr("for", $el.find("input.CSS_Font_Weight").prev().attr("for")+"_"+name);
			if (o.custWeight == "bold") {
				$el.find("input.CSS_Font_Weight").attr("checked", "checked");
			}
			$el.find("input.CSS_Font_Style").attr("id", $el.find("input.CSS_Font_Style").attr("id")+"_"+name);
			$el.find("input.CSS_Font_Style").prev().attr("for", $el.find("input.CSS_Font_Style").prev().attr("for")+"_"+name);
			if (o.custStyle == "italic") {
				$el.find("input.CSS_Font_Style").attr("checked", "checked");
			}
			if (o.switch == 0) {
				$el.find(".style-content-c input[id^=CSS_font_default]").attr("checked", "checked");
				$el.find(".style-content-h").hide();
			} else if (o.switch == 2) {
				$el.find(".style-content-c input[id^=CSS_font_cus]").attr("checked", "checked");
				$el.find(".style-content-h").show();
			}
			return $el;
		},
		"switch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"switch": f});
			StyleTool.styleModule.CSS_Font.setStyle($el);
			
			if (f == 0) {
				$el.find(".style-content-h").hide();
			} else if (f == 2) {
				$el.find(".style-content-h").show();
			}
		},
		"colorSwitch": function (f) {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custColorSwitch": f});
			StyleTool.styleModule.CSS_Font.setStyle($el);
			var o = StyleTool.getData(styleName);
			
			if (f == 0) {
				$el.find(".CSS_colorPicker").spectrum("destroy");
			} else if (f == 2) {
				$el.find(".CSS_colorPicker").spectrum({
					color: o.custColor,
					preferredFormat: "hex6",
					showInput: true
				});
			}
		},
		"colorChange": function(obj) {
			var $el = $(obj).closest(".style-item");
			var color = $el.find(".CSS_Font_Color .CSS_colorPicker").val();
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custColor": color});
			StyleTool.styleModule.CSS_Font.setStyle($el);
		},
		"sizeChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var size = $el.find("select.CSS_Font_Size").val();
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custSize": size});
			StyleTool.styleModule.CSS_Font.setStyle($el);
		},
		"familyChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var family = $el.find(".CSS_Font_Family select").val();
			var styleName = $el.children(".CSS_StyleName").val();
			StyleTool.setData(styleName, {"custFamily": family});
			StyleTool.styleModule.CSS_Font.setStyle($el);
		},
		"weightChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			if ($el.find("input.CSS_Font_Weight").get(0).checked) {
				StyleTool.setData(styleName, {"custWeight": "bold"});
			} else {
				StyleTool.setData(styleName, {"custWeight": "normal"});
			}
			StyleTool.styleModule.CSS_Font.setStyle($el);
		},
		"styleChange": function () {
		    var event = window.event || arguments.callee.caller.arguments[0];
			var $el = $(event.srcElement ? event.srcElement:event.target).closest(".style-item");
			var styleName = $el.children(".CSS_StyleName").val();
			if ($el.find("input.CSS_Font_Style").get(0).checked) {
				StyleTool.setData(styleName, {"custStyle": "italic"});
			} else {
				StyleTool.setData(styleName, {"custStyle": "normal"});
			}
			StyleTool.styleModule.CSS_Font.setStyle($el);
		},
		"setStyle": function($el) {
			var styleName = $el.children(".CSS_StyleName").val();
			var $target = StyleTool.selectElement(styleName);
			var o = StyleTool.getData(styleName);
			$target.each(function() {
				if (o.switch == 0) {
					$(this).css("font", "");
					$(this).css("color", "");
				} else if (o.switch == 2) {
					$(this).css("font", "");
					$(this).css("color", "");
					if (o.custColorSwitch == 2) {
						$(this).css("color", o.custColor);
					}
					$(this).css("font-size", o.custSize+"px");
					$(this).css("font-family", o.custFamily);
					if (o.custWeight != "normal") {
						$(this).css("font-weight", o.custWeight);
					}
					if (o.custStyle != "normal") {
						$(this).css("font-style", o.custStyle);
					}
				}
			});
		},
		"getStyle": function($el) {
			var o = {};
			if ($el.get(0).style.font == "") {
				o.switch = "0";
				return o;
			}
			if ($el.get(0).style.color != "") {
				o.custColor = $el.get(0).style.color;
				o.custColorSwitch = "2";
				o.switch = "2";
			}
			if ($el.get(0).style.fontSize != "") {
				o.custSize = parseInt($el.get(0).style.fontSize)+"";
				o.switch = "2";
			}
			if ($el.get(0).style.fontFamily != "") {
				o.custFamily = $el.get(0).style.fontFamily.replace(/('|")/g, '').replace(/\s?,\s?/g, ',');
				o.switch = "2";
			}
			if ($el.get(0).style.fontWeight != "") {
				o.custWeight = $el.get(0).style.fontWeight;
				o.switch = "2";
			}
			if ($el.get(0).style.fontStyle != "") {
				o.custStyle= $el.get(0).style.fontStyle;
				o.switch = "2";
			}
			return o;
		}
	}
}

StyleTool.defaultOption = {
	widgetId: "", // 当前编辑的组件id
	bodyDefaultStyle: {  // 页面样式默认配置,没有配置项为空即可
		"background": { // 整体背景
	    	 "body_background": { // 样式修改项的名称，要求必须在一个组件的所有样式修改项中唯一，且由字母和下划线组成
	 			"selector": " > .row", // 需要修改的dom选择器，必配，从.container的子元素选择器开始，为空即选择.container，如果配置的选择器找不到对应dom元素，则不会在样式工具中展示该样式修改项
	 			"title": "背景", // 样式修改项的展示项目名称，选配，不配默认为模板自带的名称
	 			"templateCode": "CSS_Background", // 样式修改项套用的模板编号， 必配，不配或配置无效的编号则不会在样式工具中展示该样式修改项
	 			"templateArgs": { // 样式修改项套用模板所需的参数，它是一个对象
					"custColor": "#ffffff", // 自定义中的初始背景颜色，选配，不配为“#FFFFFF”，值为6位颜色的十六进制数
					"custImageRepeat": "11", // 自定义中的初始背景图片显示方式， 选配，不配为“11”(完全平铺)，
											 // 值为"01"：不平铺（居中），"11"：完全平铺，"12"：拉伸平铺，"13"：缩放平铺（等比例），
											 // "21"：纵向平铺（左边对齐），"22"：纵向平铺（中间对齐），"23"：纵向平铺（右边对齐），
											 // "31"：横向平铺（顶部对齐），"32"：横向平铺（中部对齐），"33"：横向平铺（底部对齐），
											 // "02"：不平铺（左对齐），"03"：不平铺（右对齐），"04"：不平铺（上对齐），"05"：不平铺（下对齐），
											 // "06"：不平铺（左上对齐），"07"：不平铺（右上对齐），"08"：不平铺（左下对齐），"09"：不平铺（右下对齐）
	 				"showImageFixed": "1", // 自定义中是否可配置背景图片效果，选配，不配为“0”（不可配置），值为“1”：展示效果配置项，“0”：不展示效果配置项
 					"imageFixed": "0" // 自定义中可配置背景图片效果，选配，不配为“0”（默认），当“showImageFixed”为“1”时才生效，值为“1”：锁定背景图片，“0”：默认
	 			} 
	 		 }
		},
		"header": { // 顶部
			"header_background": {
	 			"selector": ".demo_h",
	 			"title": "背景",
	 			"templateCode": "CSS_Background",
	 			"templateArgs": {
	 			} 
	 		 },
	 		"header_height": {
	 			"selector": ".demo_h",
	 			"title": "高度",
	 			"templateCode": "CSS_Height",
	 			"templateArgs": {
	 				"custHeight": "", // 自定义中的高度默认值，选配，不配为空，值为大于0的数字
					"custMinHeight": 100, // 自定义中的高度可以输入的最小值（含），选配，不配为1，值为大于0的数字
					"custMaxHeight": 500 // 自定义中的高度可以输入的最大值（含），选配，不配为980，值为大于0的数字
	 			} 
	 		 }
	    },
	    "container": { // 内容区
	    	"container_background": {
	 			"selector": ".demo_c",
	 			"title": "背景",
	 			"templateCode": "CSS_Background",
	 			"templateArgs": {
	 			} 
	 		 }
	    },
	    "footer": { // 底部
	    	"footer_background": {
	 			"selector": ".demo_f",
	 			"title": "背景",
	 			"templateCode": "CSS_Background",
	 			"templateArgs": {
	 			} 
	 		 },
	 		"footer_height": {
	 			"selector": ".demo_f",
	 			"title": "高度",
	 			"templateCode": "CSS_Height",
	 			"templateArgs": {
	 				"custMinHeight": 100,
					"custMaxHeight": 500
	 			} 
	 		 }
	    }
	},
	widgetDefaultStyle: { // 组件样式默认配置
		"default": { // 常规
			"widget_background": {
	 			"selector": "",
	 			"title": "背景",
	 			"templateCode": "CSS_Background",
	 			"templateArgs": {
	 			} 
	 		 },
	 		"title_show": {
	    		 "selector": ".title-box",
	    		 "title": "标题栏",
	    		 "templateCode": "CSS_ShowSwitch",
	    		 "templateArgs": {
	    			 "callBack": function($el) {
	    				  var styleName = $el.children(".CSS_StyleName").val();
	    				  var o = StyleTool.getData(styleName);
	    				  var $head = $(".sidebar-nav .tool-bar .style .module-style .head a[href=#module_style_anchor_title]").parent();
	    				  var $body = $(".sidebar-nav .tool-bar .style .module-style .body div#module_style_anchor_title");
	    				  if (o.switch == 0) {
	    					  $head.show();
	    					  $body.show();
	    				  } else {
	    					  $head.hide();
	    					  $body.hide();
	    				  }
	    				  // 锚点激活
	    				  $(".sidebar-nav .tool-bar .style .body-style .head ul.nav-bubble li:visible").first().addClass("active");
	    				  $(".sidebar-nav .tool-bar .style .module-style .body").children(".content0").css("height", 
	    			    			$(".sidebar-nav .tool-bar .style .module-style .body").height()-
	    			    			$(".sidebar-nav .tool-bar .style .module-style .body").children(".anchor-content:visible").last().outerHeight(true)-16);
	    			 }
	    		 } 
	    	 },
	 		"widget_postion": {
	 			"selector": "",
	 			"title": "定位",
	 			"templateCode": "CSS_Position",
	 			"templateArgs": {

	 			} 
	 		 },
	 		"widget_height": {
	 			"selector": "",
	 			"title": "高度",
	 			"templateCode": "CSS_Height",
	 			"templateArgs": {
	 				"custMinHeight": 0,
					"custMaxHeight": 999
	 			} 
	 		 }
	     },
	     "border": { // 边框
	    	 "widget_border": {
	 			"selector": "",
	 			"title": "边框",
	 			"templateCode": "CSS_Border",
	 			"templateArgs": {
	 				"custColor": "#666666",
	 				"custWidth": "3",
	 				"custStyle": "2"
	 			} 
	 		 }
	     },
	     "title": { // 标题栏
	    	 "title_background": {
	    		 "selector": ".title-box",
	    		 "title": "背景",
	    		 "templateCode": "CSS_Background",
	    		 "templateArgs": {
	    		 } 
	    	 },
	    	 "title_height": {
	 			"selector": ".title-box",
	 			"title": "高度",
	 			"templateCode": "CSS_Height",
	 			"templateArgs": {
	 				"custMinHeight": 25,
					"custMaxHeight": 50
	 			} 
	 		 },
	    	 "title_font": {
	    		 "selector": ".title-box > h3 > span",
	 			 "title": "标题文字",
	 			 "templateCode": "CSS_Font",
	 			 "templateArgs": {
	 			 } 
	    	 }
	     },
	     "container": { // 内容区
	    	 
	     }
	},
	defaultImagePath: "/res/default/grey.png"
}



