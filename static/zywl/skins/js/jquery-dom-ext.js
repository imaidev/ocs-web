/**
 * 来源于Ext的align，将element定位到其他element的某个位置附加偏移量
 */
(function($) {
	var getViewWidth =function(){
		if ($.browser.msie) {
			return (document.compatMode == "CSS1Compat") ? document.documentElement.clientWidth
					: document.body.clientWidth;
		} else {
			return self.innerWidth;
		}
	};
	var getViewHeight  = function(){
		if ($.browser.msie) {
			return $.isStrict ? document.documentElement.clientHeight
					: document.body.clientHeight;
		} else {
			return self.innerHeight;
		}
	};
	$.fn.extend({
		/**
		 * 由元素上的锚位置来获得x,y坐标
		 * 
		 * @param {String}
		 *            anchor (可选)，指定的锚位置 (默认为
		 *            "c"). 支持的锚位置的详细信息参见 {@link #alignTo} .
		 * @param {Boolean}
		 *            local (可选)，为true表示获得局部 (相对于元素的顶部或左部)的锚位置，而非页面的坐标
		 * @param {Object}
		 *            s (可选) 包含用于计算锚位置大小的对象 {width: (target width), height:
		 *            (target height)} (默认为元素的当前大小)
		 * @return {Array} [x, y] 包含元素的x,y坐标的数组
		 */
		getAnchorXY : function(anchor, local, s) {
			// 传递一个不同的大小，用于预计算锚,
			// 尤其是改变el大小的锚的动画.

			var w, h, vp = false;
			if (!s) {
				var d = this[0];
				if (d == document.body || d == document) {
					vp = true;
					w = getViewWidth();
					h = getViewHeight();
				} else {
					w = this.width();
					h = this.height();
				}
			} else {
				w = s.width;
				h = s.height;
			}
			var x = 0, y = 0, r = Math.round;
			switch ((anchor || "tl").toLowerCase()) {
			case "c":
				x = r(w * .5);
				y = r(h * .5);
				break;
			case "t":
				x = r(w * .5);
				y = 0;
				break;
			case "l":
				x = 0;
				y = r(h * .5);
				break;
			case "r":
				x = w;
				y = r(h * .5);
				break;
			case "b":
				x = r(w * .5);
				y = h;
				break;
			case "tl":
				x = 0;
				y = 0;
				break;
			case "bl":
				x = 0;
				y = h;
				break;
			case "br":
				x = w;
				y = h;
				break;
			case "tr":
				x = w;
				y = 0;
				break;
			}
			if (local === true) {
				return [ x, y ];
			}
			if (vp) {
				return [ x + this.scrollLeft(), y + this.scrollTop() ];
			}
			// 增加元素的xy偏移量
			var o = this.position();
			return [ x + o["left"], y + o["top"] ];
		},

		/**
		 * 获得该元素与其他元素对齐的x,y坐标. 支持的坐标值的详细信息参见
		 * {@link #alignTo}.
		 * 
		 * @param {Mixed}
		 *            element 用于对齐的元素.
		 * @param {String}
		 *            position 用于对齐的位置.
		 * @param {Array}
		 *            offsets (可选)  [x, y]的偏移量
		 * @return {Array} [x, y]
		 */
		getAlignToXY : function(el, p, o) {
			el = $(el);
			if (!el || el.length===0) {
				throw "Element.alignToXY with an element that doesn't exist";
			}
			var c = false; // constrain to viewport
			var p1 = "", p2 = "";
			o = o || [ 0, 0 ];

			if (!p) {
				p = "tl-bl";
			} else if (p == "?") {
				p = "tl-bl?";
			} else if (p.indexOf("-") == -1) {
				p = "tl-" + p;
			}
			p = p.toLowerCase();
			var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
			if (!m) {
				throw "Element.alignTo with an invalid alignment " + p;
			}
			p1 = m[1];
			p2 = m[2];
			c = !!m[3];

			// Subtract the aligned el's internal xy from the target's offset xy
			// plus custom offset to get the aligned el's new offset xy
			var a1 = this.getAnchorXY(p1, true);
			var a2 = el.getAnchorXY(p2, false);

			var x = a2[0] - a1[0] + o[0];
			var y = a2[1] - a1[1] + o[1];

			if (c) {
				// constrain the aligned el to viewport if necessary
				var w = this.width(), h = this.height(), r = el.position();
				// 5px of margin for ie
				var dw = getViewWidth() - 5, dh = getViewHeight() - 5;

				// If we are at a viewport boundary and the aligned el is
				// anchored on a target border that is
				// perpendicular to the vp border, allow the aligned el to slide
				// on that border,
				// otherwise swap the aligned el to the opposite border of the
				// target.
				var p1y = p1.charAt(0), p1x = p1.charAt(p1.length - 1);
				var p2y = p2.charAt(0), p2x = p2.charAt(p2.length - 1);
				var swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
				var swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));

				var doc = document;
				var scrollX = (doc.documentElement.scrollLeft
						|| doc.body.scrollLeft || 0) + 5;
				var scrollY = (doc.documentElement.scrollTop || doc.body.scrollTop || 0) + 5;

				if ((x + w) > dw + scrollX) {
					x = swapX ? r.left - w : dw + scrollX - w;
				}
				if (x < scrollX) {
					x = swapX ? r.left+el[0].offsetWidth : scrollX;
				}
				if ((y + h) > dh + scrollY) {
					y = swapY ? r.top - h : dh + scrollY - h;
				}
				if (y < scrollY) {
					y = swapY ? r.top+el[0].offsetHeight : scrollY;
				}
			}
			return [ x, y ];
		},



		/**
		 * 相对于指定的锚点将该元素与其他元素对齐.若对齐的目标元素是document，则与
		 * viewport对齐. 位置参数是可选的,能以如下格式中的一种来指定:
		 * <ul>
		 * <li><b>Blank</b>: 默认地对齐元素的左上角到目标元素的左下角 ("tl-bl").</li>
		 * <li><b>One anchor (deprecated)</b>: 传递的锚位置是用于目标元素的锚点.被对齐的元素将
		 * 定位其左上角值该位置. <i>该方法已经过期，请使用两个锚参数的方法</i>.</li>
		 * <li><b>Two anchors</b>: 若传递破折号相连的两个值, 第一个值被用作元素的锚点,第二个值被用作目标元素的锚点.</li>
		 * </ul>
		 * 除此之外, 位置参数也支持"?" 符号.若"?"在位置字符串的结尾,该元素将尝试按照指定的位置来对齐,但是该位置可能会根据viewport来调节. 注意到被对齐的元素可能交替对齐不同的位置，而不是强制指定viewport的约束. 以下是所有支持的锚位置:
		 * 
		 * <pre>
		 * 		值          描述
		 * 		-----  -----------------------------
		 * 		tl     左上角 (默认值)
		 * 		t      上边居中
		 * 		tr     右上角
		 * 		l      左边居中
		 * 		c      元素的正中间
		 * 		r      右边居中
		 * 		bl     左下角
		 * 		b      下边居中
		 * 		br     右下角
		 * 		
		 * </pre>
		 * 
		 * 实例:
		 * 
		 * <pre><code>
		 * //使用默认位置来对齐el 到 other-el ("tl-bl", 非约束)
		 * el.alignTo("other-el");
		 * 
		 * // 将el的左上角与other-el的右上角对齐 (约束于viewport)
		 * el.alignTo("other-el", "tr?");
		 * 
		 * // 将 el的右下角与other-el的左边居中对齐
		 * el.alignTo("other-el", "br-l?");
		 * 
		 * //将el的中间位置与other-el的左下角对齐，并且
		 * // 调整x位置-6 个像素，调整 y 位置 0个像素)
		 * el.alignTo("other-el", "c-bl", [ -6, 0 ]);
		 * </code></pre>
		 * 
		 * @param {Mixed}
		 *            element 对齐的元素.
		 * @param {String}
		 *            position 对齐的位置.
		 * @param {Array}
		 *            offsets (可选) [x, y]偏移量
		 * @param {Boolean/Object}
		 *            animate (可选) 值为true 表示默认的动画 或者一个标准元素动画配置对象
		 * @return {L5.Element} this
		 */
		alignTo : function(element, position, offsets, animate) {
			var xy = this.getAlignToXY(element, position, offsets);
			this.setXY(xy , animate);
			return this;
		},

		/**
		 * 将一个元素锚向另一个元素或当窗口大小改变时重新对齐.
		 * 
		 * @param {Mixed}
		 *            element 对齐的元素.
		 * @param {String}
		 *            position 对齐的位置.
		 * @param {Array}
		 *            offsets (可选) [x, y]的偏移位置
		 * @param {Boolean/Object}
		 *            animate (可选) 值为True 表示默认的动画或者一个标准元素的动画配置对象
		 * @param {Boolean/Number}
		 *            monitorScroll (可选) 值为True 表示监控body滚动和重新定位. 若该参数为数字, 用于缓冲延迟(默认值为50ms).
		 * @param {Function}
		 *            callback 动画结束之后的回调函数
		 * @return {Element} this
		 */
		anchorTo : function(el, alignment, offsets, animate,
				monitorScroll, callback) {
			var action = function() {
				this.alignTo(el, alignment, offsets, animate);
				if (typeof callback == "function") {
					callback.apply(this, args || []);
				}
			};
			$(window).on.call(this,"resize",action);
//			L5.EventManager.onWindowResize(action, this);
			var tm = typeof monitorScroll;
			if (tm != 'undefined') {
				$(window).on.call(this,"scroll",action);
//				L5.EventManager.on(window, 'scroll', action, this, {
//					buffer : tm == 'number' ? monitorScroll : 50
//				});
			}
			action.call(this); // align immediately
			return this;
		},

		/**
		 * 获得元素中心点的x/y坐标
		 * @return {Array} 数组 [x, y]
		 */
		getCenterXY : function() {
			return this.getAlignToXY(document, 'c-c');
		},

		/**
		 * 将该元素放置在 viewport, 或者其他元素的中间.
		 * 
		 * @param {Mixed}
		 *            centerIn (可选) 将该元素放置在中间位置的其他元素.
		 */
		center : function(centerIn) {
			this.alignTo(centerIn || document, 'c-c');
			return this;
		}
	});
	
})(jQuery);
/**
 * getXY和setXY来源于ext的position
 */
(function($){
	$.fn.extend({
		/**
		 * 返回数组
		 */
		getXY : function(){
			var o = this.position();
			return [o["left"],o["top"] ];
		},
		setXY : function(xy,animate) {
			if( this.css("position") == 'static' ){
				this.css('position', 'relative');
			}
			var pts = this.translatePoints(xy);
			if(!animate){
				if (xy[0] !== false) {
					this.css('left',pts.left + "px");
				}
				if (xy[1] !== false) {
					this.css('top',pts.top + "px");
				}
			} else {
				if( typeof animate === "object" ){
					this.animate({left:pts.left + "px",top:pts.top + "px"},animate["speed"],animate["easing"],animate["callback"]);
				} else {
					this.animate({left:pts.left + "px",top:pts.top + "px"},"slow");
				}
			}
		},
		translatePoints : function(x, y) {
			if (typeof x == 'object' || $.isArray(x)) {
				y = x[1];
				x = x[0];
			}
			var p = this.css('position');
			var o = this.position();
			var oldZoom;
			if($.browser.webkit){
				oldZoom = this.css("zoom");
				this.css("zoom","reset");
			}
			var l = parseInt(this.css('left'), 10);
			var t = parseInt(this.css('top'), 10);
			var offset = this.offset();
			if($.browser.webkit){
				this.css("zoom",oldZoom);
			}
			if (isNaN(l)) {
				l = (p == "relative") ? 0 : offset["left"];
			}
			if (isNaN(t)) {
				t = (p == "relative") ? 0 : offset["top"];
			}
	
			return {
				left : (x - o["left"] + l),
				top : (y - o["top"] + t)
			};
		}
	});
})(jQuery);
(function($){
	$.fn.repaint = function() {
		var tt = this;
		this.addClass("jq-repaint");
		setTimeout(function() {
			tt.removeClass("jq-repaint");
		}, 1);
		return this;
	};
	var preventDefaultEvent = function(e) {
		e.stopPropagation();
		if (e.preventDefault) {
			e.preventDefault();
		}
	};
	$.fn.unselectable = function() {
		this.prop("unselectable","on");
		if ($.browser.msie || $.browser.safari || $.browser.chrome){
			this.on('selectstart.selectable',preventDefaultEvent);
		} else if ($.browser.mozilla) {
			this.css('MozUserSelect', 'none');
		}
		if(!this.hasClass("jq-unselectable")){
			this.addClass("jq-unselectable");
		}
		return this;
	};
	$.fn.selectable = function() {
		this.removeProp("unselectable");
		if ($.browser.msie || $.browser.safari || $.browser.chrome){
			this.off('selectstart.selectable',preventDefaultEvent);
		} else if ($.browser.mozilla) {
			this.css('MozUserSelect', 'inherit');
		}
		if(this.hasClass("jq-unselectable")){
			this.removeClass("jq-unselectable");
		}
		return this;
	};

})(jQuery);
/**
 * 初始化页面css信息，为body加上基础的css比如<body class="jq-ie jq-ie8">
 */
(function($){
	var ua = navigator.userAgent.toLowerCase();
	var isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1),
	isLinux = ua.indexOf("linux") != -1 , isChrome = ua.indexOf("chrome") > -1 , isBorderBox = $.browser.msie && !$.isStrict;
	
	$.isStrict = document.compatMode == "CSS1Compat";
	//1.7webkit内核的都会被设置成safari
	if(isChrome){
		$.browser.chrome = true;
		$.browser.safari = null;
		delete $.browser.safari;
		//version不改了没什么意义
//		$.browser.version = 
	}
	
	
	var initJQCss = function() {
		// find the body element
		var bd = document.body || document.getElementsByTagName('body')[0];
		if (!bd) {
			return false;
		}
		var cls = [
				' ',
				$.browser.msie ? "jq-ie jq-ie"
						+ ($.browser.version.split("\.")[0]) : $.browser.gecko ? "jq-gecko jq-gecko"
						+ ($.browser.version.split("\.")[0])
						: $.browser.opera ? "jq-opera" : $.browser.chrome ? "jq-chrome"
								: $.browser.safari ? "jq-safari" : $.browser.mozilla ? "jq-mozilla" : "" ];

		if (isMac) {
			cls.push("jq-mac");
		}
		if (isLinux) {
			cls.push("jq-linux");
		}
		if (isBorderBox) {
			cls.push('jq-border-box');
		}
		if ($.isStrict) { // add to the parent to allow for selectors like
			// ".jq-strict .jq-ie"
			var p = bd.parentNode;
			if (p) {
				p.className += ' jq-strict';
			}
		}
		bd.className += cls.join(' ');
		return true;
	}

	if (!initJQCss()) {
		$(document).ready(initJQCss);
	}
	
})(jQuery);