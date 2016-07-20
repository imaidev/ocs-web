(function($) {
	$.fn.jqDrag = function(h) {
		return i(this, h, 'd');
	};
	$.fn.jqResize = function(h) {
		return i(this, h, 'r');
	};
	$.jqDnR = {
		dnr : {},
		e : 0,
		drag : function(v) {
			E.css('cursor', 'move');
			if (M.k == 'd') {
				E.css({
					left : (M.X + v.pageX - M.pX) < 0
							? 0
							: (M.X + v.pageX - M.pX) < document.documentElement.clientWidth - M.W
									? (M.X + v.pageX - M.pX)
									: document.documentElement.clientWidth
											- M.W,
					top : (M.Y + v.pageY - M.pY) < 0
							? 0
							: (M.Y + v.pageY - M.pY) < document.documentElement.clientHeight
									- M.H
									? (M.Y + v.pageY - M.pY)
									: document.documentElement.clientHeight
											- M.H
				});
			} else {
				E.css({
							width : Math.max(v.pageX - M.pX + M.W, 0),
							height : Math.max(v.pageY - M.pY + M.H, 0)
						});
				return false;
			}
		},

		stop : function() {
			E.css('cursor','auto');
			E.css('opacity', 1);
			$(document).unbind('mousemove', J.drag).unbind('mouseup', J.stop);
		}
	};
	var J = $.jqDnR, M = J.dnr, E = J.e, i = function(e, h, k) {
		return e.each(function() {
					h = (h) ? $(h, e) : e;
					h.bind('mousedown', {
								e : e,
								k : k
							}, function(v) {
								var d = v.data, p = {};
								E = d.e;
								if (E.css('position') != 'relative') {
									try {
										E.position(p);
									} catch (e) {
									}
								}
								M = {
									X : p.left || f('left') || 0,
									Y : p.top || f('top') || 0,
									W : f('width') || E[0].scrollWidth || 0,
									H : f('height') || E[0].scrollHeight || 0,
									pX : v.pageX,
									pY : v.pageY,
									k : d.k,
									o : E.css('opacity')
								};
								E.css({
											opacity : 0.8
										});
								$(document).mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
								return false;
							});
				});
	}, f = function(k) {
		return parseInt(E.css(k)) || false;
	};
})(jQuery);