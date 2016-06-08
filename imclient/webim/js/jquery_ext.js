(function( $ ) {
	
	$.fn.extend({
		/**
		 * 实现基于jQuery的node方法，用于获取标签中node-type为对应值的标签
		 * @param str
		 * @returns
		 */
		node: function(str) {
			return this.find("*[node-type=" + str + "]");
		},
		/**
		 * 给可输入文本的控件增加提示文字
		 * 用法：$(express).ui_prompt(option);
		 * 
		 * @param option {
		 *	prompt：提示文字	//也可在控件上增加data-prompt属性 
		 * }
		 */
		ui_prompt: function(option) {
			this.each( function() {
				var thisTag = $(this);
				
				var opt = new Object();
				$.copyValue(option, opt);
				
				thisTag.unbind("focusin");
				thisTag.unbind("focusout");
				if(thisTag.attr("value") === thisTag.attr("data-prompt")) {
					thisTag.attr("value", "");
				}
				if(opt.prompt) {
					thisTag.attr("data-prompt", opt.prompt);
				}
				
				thisTag.bind("focusin", function(e) {
					if(thisTag.attr("value") === thisTag.attr("data-prompt")) {
						thisTag.attr("value", "");
					}
					thisTag.removeClass("ui_prompt_font");
				});
				var focusout = function(e) {
					if(!thisTag.attr("value")){
						thisTag.addClass("ui_prompt_font");
						thisTag.attr("value", thisTag.attr("data-prompt"));
					}
				};
				thisTag.bind("focusout", focusout);
				
				focusout();
			});
			return this;
		}
	});
	
	$.extend({
		copyValue: function(source, target) {
			for(var s in source) {
				target[s] = source[s];
			}
		},
		jsonStringify: function(str) {
			return JSON.stringify(str);
		},
		dateFormat: function(date, format) {
			var o = { 
				"M+" : date.getMonth()+1, //month 
				"d+" : date.getDate(), //day 
				"h+" : date.getHours(), //hour 
				"m+" : date.getMinutes(), //minute 
				"s+" : date.getSeconds(), //second 
				"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
				"S" : date.getMilliseconds() //millisecond 
			};

			if(/(y+)/.test(format)) { 
				format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			} 

			for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
			} 
			return format; 
		},
		limiter: function(limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html( limit - chars );
            }
            setCount($(this)[0], elem);
        }
	});
	
})(jQuery);
/*
if(!Array.indexOf){
	Array.prototype.indexOf = function(Object){
		for(var i = 0;i<this.length;i++){
			if(this[i] == Object){
				return i;
			}
		}
		return -1;
	};
}*/