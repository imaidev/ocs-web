/*
 * Flexigrid for jQuery -  v1.1
 *
 * Copyright (c) 2008 Paulo P. Marinas (code.google.com/p/flexigrid/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
(function($) {
	$.addFlex = function(t, cfg) {
		var config = {
				striped : true, // apply odd even stripes
				novstripe : false,
				minwidth : 30, // min width of columns
				minheight : 80, // min height of columns
				nowrap : true,
				title : false,
				minColToggle : 1, // minimum allowed column to be hidden
				showToggleBtn : true, // show or hide column toggle popup
				onDragCol : false,
				onToggleCol : false,
				multi: false,
				hideShow: false,
				drag:true
			};
		if($(t).attr("striped")=="false"){
        	config.striped=false;
        }else{
        	config.striped=true;
        }
        if($(t).attr("hideShow")=="true"){
        	config.hideShow=true;
        }else{
        	config.hideShow=false;
        }
        if($(t).attr("multi")=="true"){
        	config.multi=true;
        }else{
        	config.multi=false;
        }
        if($(t).attr("drag")=="false"){
        	config.drag=false;
        }else{
        	config.drag=true;
        }     
		//支持宽度设置百分比
		var tw=$(t).width();
		$('thead th',t).each(function(){
			var ow=this.style.width||this.width;
			var isPercentow=ow.substring(ow.length-1,ow.length);
			var display=this.style.display;
			if(!display){
				if(isPercentow=="%"){
					var rt=ow.substring(0,ow.length-1)/100;		
					$(this).attr('width',tw*rt);
					this.style.width="";
					}
					else{
						$(this).attr('width',ow);
						this.style.width="";
						};
			}

		});
       
		if (t.grid)
			return false; // return if already exist
		p = $.extend(config, cfg);
		// alert(navigator.userAgent);
		// alert($.browser.msie);
		$(t).show() // show if hidden
		.attr({
			cellPadding : 0,
			cellSpacing : 0,
			border : 0
		}) // remove padding and spacing
		.removeAttr('width'); // remove width properties
		// create grid class

		var g = {
			hset : {},
			
			// 重新计算列宽拖动条的位置(top和left)
			rePosDrag : function() {
				var cdleft = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft > 0)
					cdleft -= Math.floor(p.cgwidth / 2);
				// 修改top
				$(g.cDrag).css({
					top : g.hDiv.offsetTop + 1
				});
				// 修改left
				var cdpad = this.cdpad;
				$('div', g.cDrag).hide();
				$('thead tr:first th:visible', this.hDiv).each(function() {
					var n = $('thead tr:first th:visible', g.hDiv).index(this);
					var cdpos = parseInt($('div', this).width());
					if (cdleft == 0)
						cdleft -= Math.floor(p.cgwidth / 2);
					cdpos = cdpos + cdleft + cdpad;
					if (isNaN(cdpos)) {
						cdpos = 0;
					}
					$('div:eq(' + n + ')', g.cDrag).css({
						'left' : cdpos + 'px'
					}).show();
					cdleft = cdpos;
				});
			},

			// 重新计算高度
			fixHeight : function(newH) {
				// 设置bDiv的高度属性，因为1、ie9下出横向滚动条时，bDiv的高度会拉长；2、ie6、ie7下出横向滚动条时会同时出纵向滚动条
				if ($.browser.msie
						&& ($.browser.version < 8 || $.browser.version >= 9)) {
					var bdiv=$(g.bDiv)[0];
					var btable = $(g.bDiv).find("table:first");
					if(bdiv.scrollHeight>bdiv.clientHeight||bdiv.offsetHeight>bdiv.clientHeight){
						$(g.bDiv).height(btable.outerHeight(true) + 20);// 'true',表示计算margin;'20'，预留出滚动条的位置	
					}
					
					
				}
			},

			dragStart : function(dragtype, e, obj) { // default drag function
				// start
				if (dragtype == 'colresize') {// 改变列的宽度
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					var n = $('div', this.cDrag).index(obj);
					var ow = $('th:visible div:eq(' + n + ')', this.hDiv)
							.width();
					$(obj).addClass('dragging').siblings().hide();
					$(obj).prev().addClass('dragging').show();
					this.colresize = {
						startX : e.pageX,
						ol : parseInt(obj.style.left),
						ow : ow,
						n : n
					};
					$('body').css('cursor', 'col-resize');
				}
				$('body').noSelect();
			},

			dragMove : function(e) {
				if (this.colresize) {// 改变列的宽度
					var n = this.colresize.n;
					var diff = e.pageX - this.colresize.startX;
					var nleft = this.colresize.ol + diff;
					var nw = this.colresize.ow + diff;
					if (nw > p.minwidth) {
						$('div:eq(' + n + ')', this.cDrag).css('left', nleft);
						this.colresize.nw = nw;
					}
				} else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver');
					if (e.pageX > this.hset.right || e.pageX < this.hset.left
							|| e.pageY > this.hset.bottom
							|| e.pageY < this.hset.top) {
						// this.dragEnd();
						$('body').css('cursor', 'move');
					} else {
						$('body').css('cursor', 'pointer');
					}
					$(this.colCopy).css({
						top : e.pageY + 10,
						left : e.pageX + 20,
						display : 'block'
					});
				}
			},

			dragEnd : function() {
				if (this.colresize) {
					var n = this.colresize.n;
					var nw = this.colresize.nw;
					$('th:visible div:eq(' + n + ')', this.hDiv).css('width',
							nw);
					$('tr', this.bDiv).each(
							function() {
								$('td:visible div:eq(' + n + ')', this).css(
										'width', nw);
							});
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					$('div:eq(' + n + ')', this.cDrag).siblings().show();
					$('.dragging', this.cDrag).removeClass('dragging');
					this.rePosDrag();
					this.fixHeight();
					this.colresize = false;
				} else if (this.colCopy) {
					$(this.colCopy).remove();
					if (this.dcolt != null) {
						if (this.dcoln > this.dcolt)
							$('th:eq(' + this.dcolt + ')', this.hDiv).before(
									this.dcol);
						else
							$('th:eq(' + this.dcolt + ')', this.hDiv).after(
									this.dcol);
						this.switchCol(this.dcoln, this.dcolt);
						$(this.cdropleft).remove();
						$(this.cdropright).remove();
						this.rePosDrag();
						if (p.onDragCol) {
							p.onDragCol(this.dcoln, this.dcolt);
						}
					}
					this.dcol = null;
					this.hset = null;
					this.dcoln = null;
					this.dcolt = null;
					this.colCopy = null;
					$('.thMove', this.hDiv).removeClass('thMove');
					$(this.cDrag).show();
				}
				$('body').css('cursor', 'default');
				$('body').noSelect(false);
			},

			// 控制某一列隐藏或显示
			toggleCol : function(cid, visible) {
				var ncol = $("th[axis='col" + cid + "']", this.hDiv)[0];// 表头上的列
				var n = $('thead th', g.hDiv).index(ncol);
      			var cb = $('input[value=' + cid + ']', g.nDiv)[0];// 下拉菜单上的复选框
				//var cb = $('<span class="jNiceCheckbox jNiceChecked"></span>', g.nDiv);
				//var cb = $(g.nDiv).find('.jNiceCheckbox').siblings()[0];
				if (visible == null) {
					visible = ncol.hidden;
				}
				if ($('input:checked', g.nDiv).length < p.minColToggle
						&& !visible) {
					return false;
				}
				if (visible) {
					ncol.hidden = false;
					$(ncol).show();
					
				//	$('input:checkbox',g.nDiv).siblings().addClass('jNiceChecked');
					cb.checked = true;
				} else {
					ncol.hidden = true;
					$(ncol).hide();
				//	$('input:checkbox',g.nDiv).siblings().removeClass('jNiceChecked');
					cb.checked = false;
				}

				// 隐藏表体中对应的列
				$('tbody tr', t).each(function() {
					if (visible) {
						$('td:eq(' + n + ')', this).show();
					} else {
						$('td:eq(' + n + ')', this).hide();
					}
				});

				this.rePosDrag();

				// 调用回调函数
				if (p.onToggleCol) {
					p.onToggleCol(cid, visible);
				}
				return visible;
			},

			// 拖动列的顺序
			switchCol : function(cdrag, cdrop) { // switch columns
				$('tbody tr', t).each(
						function() {
							if (cdrag > cdrop)
								$('td:eq(' + cdrop + ')', this).before(
										$('td:eq(' + cdrag + ')', this));
							else
								$('td:eq(' + cdrop + ')', this).after(
										$('td:eq(' + cdrag + ')', this));
						});
				// switch order in nDiv
				if (cdrag > cdrop) {
					$('tr:eq(' + cdrop + ')', this.nDiv).before(
							$('tr:eq(' + cdrag + ')', this.nDiv));
				} else {
					$('tr:eq(' + cdrop + ')', this.nDiv).after(
							$('tr:eq(' + cdrag + ')', this.nDiv));
				}
				if ($.browser.msie && $.browser.version < 7.0) {
					$('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},

			scroll : function() {
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				this.rePosDrag();
			},

			// 每个td里增加一个新的div包住原来td的内容
			addCellProp : function() {
				$('tbody tr td', g.bDiv).each(function() {
					var tdDiv = document.createElement('div');
					var n = $('td', $(this).parent()).index(this);
					var pth = $('th:eq(' + n + ')', g.hDiv).get(0);// 获取td对应的表头的th
					if (pth != null) {
						if (p.sortname == $(pth).attr('abbr') && p.sortname) {
							this.className = 'sorted';
						}
						$(tdDiv).css({
							textAlign : pth.align,
							width : $('div:first', pth)[0].style.width
						});
						if (pth.hidden) {
							$(this).css('display', 'none');
						}
						if (pth.style.display) {
							$(this).css('display', 'none');
						}
						
					}
					if (p.nowrap == false) {
						$(tdDiv).css('white-space', 'normal');
					}
					if (this.innerHTML == '') {
						this.innerHTML = '&nbsp;';
					}
					tdDiv.innerHTML = this.innerHTML;
					var prnt = $(this).parent()[0];
					var pid = false;
					if (prnt.id) {
						pid = prnt.id.substr(3);
					}
					if (pth != null) {
						if (pth.process)
							pth.process(tdDiv, pid);
					}
					$(this).empty().append(tdDiv).removeAttr('width'); // wrap
					// content
				});
			},

			// 获取单元格属性：长宽高、坐标
			getCellDim : function(obj) {
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {
					ht : ht,
					wt : wt,
					top : top,
					left : left,
					pdl : pdl,
					pdt : pdt,
					pht : pht,
					pwt : pwt
				};
			},

			// 给表格行(tr)增加附加属性、样式、事件
			addRowProp : function() {
				$('tbody tr', g.bDiv).each(function() {
					$(this).click(function(e) {// 选中行处理
						var obj = (e.target || e.srcElement);
						if (obj.href || obj.type)
							return true;
						$(this).toggleClass('trSelected');
						if (!(p.multi)){
							$(this).siblings().removeClass('trSelected');	
						}
							
					}).mousedown(function(e) {// 按住shift、拖动鼠标多选
						if (e.shiftKey) {
							$(this).toggleClass('trSelected');
							g.multisel = true;
							this.focus();
							$(g.gDiv).noSelect();
						}
					}).mouseup(function() {// 按住shift、拖动鼠标多选
						if (g.multisel) {
							g.multisel = false;
							$(g.gDiv).noSelect(false);
						}
					}).hover(function(e) {// 按住shift、拖动鼠标多选
						if (g.multisel) {
							$(this).toggleClass('trSelected');
						}
					}, function() {
					});
					//if ($.browser.msie && $.browser.version < 7.0) {// ie6，鼠标移动变色
						$(this).hover(function() {
							$(this).addClass('trOver');
						}, function() {
							$(this).removeClass('trOver');
						});
					//}
				});
			},
			pager : 0
		};

		// init divs
		g.gDiv = document.createElement('div'); // create global container
		// //根div
		// g.mDiv = document.createElement('div'); //create title container
		// //title头
		g.hDiv = document.createElement('div'); // create header
		// container//表头、列标题
		g.bDiv = document.createElement('div'); // create body container //表体、数据
		// g.vDiv = document.createElement('div'); //create grip
		// g.rDiv = document.createElement('div'); //create horizontal resizer
		g.cDrag = document.createElement('div'); // create column drag//列宽拖拽条
		g.nDiv = document.createElement('div'); // create column show/hide
		// popup//菜单“隐藏/显示哪些列”
		g.nBtn = document.createElement('div'); // create column show/hide
		// button//图标按钮，点了后可以显示“用于隐藏显示哪些列的菜单”
		// g.iDiv = document.createElement('div'); //create editable layer
		// g.tDiv = document.createElement('div'); // create toolbar
		// g.sDiv = document.createElement('div');
		// g.pDiv = document.createElement('div'); //create pager
		// container//翻页工具条div

		g.hTable = document.createElement('table');

		// 顶层div
		g.gDiv.className = 'flexigrid';
		if ($.browser.msie) {
			$(g.gDiv).addClass('ie');
		}
		/*
		 * if (p.width != 'auto') { g.gDiv.style.width = p.width + 'px'; }
		 */
		$(t).before(g.gDiv);// ??
		$(g.gDiv).append(t);// ??

		// 表头div
		g.hDiv.className = 'hDiv';
		$(t).before(g.hDiv);// ??
		g.hTable.cellPadding = 0;
		g.hTable.cellSpacing = 0;
		$(g.hDiv).append('<div class="hDivBox"></div>');
		$('div', g.hDiv).append(g.hTable);
		var thead = $("thead:first", t).get(0);
		if (thead)
			$(g.hTable).append(thead);
		thead = null;
		if (!p.colmodel)
			var ci = 0;
		$('thead tr:first th', g.hDiv)
				.each(
						function() {
							var thdiv = document.createElement('div');

							if (this.hidden) {
								$(this).hide();
							}
							if (!p.colmodel) {
								$(this).attr('axis', 'col' + ci++);
							}
							$(thdiv).css({
								textAlign : this.align,
								width : this.width + 'px'
							});
							thdiv.innerHTML = this.innerHTML;
							$(this)
									.empty()
									.append(thdiv)
									.removeAttr('width')
									.mousedown(function(e) {
										g.dragStart('colMove', e, this);
									})
									.hover(
											function() {
												if (!g.colresize
														&& !$(this).hasClass(
																'thMove')
														&& !g.colCopy) {
													$(this).addClass('thOver');
												}
												if ($(this).attr('abbr') != p.sortname
														&& !g.colCopy
														&& !g.colresize
														&& $(this).attr('abbr')) {
													$('div', this).addClass(
															's' + p.sortorder);
												} else if ($(this).attr('abbr') == p.sortname
														&& !g.colCopy
														&& !g.colresize
														&& $(this).attr('abbr')) {
													var no = (p.sortorder == 'asc') ? 'desc'
															: 'asc';
													$('div', this).removeClass(
															's' + p.sortorder)
															.addClass('s' + no);
												}
												if (g.colCopy) {
													var n = $('th', g.hDiv)
															.index(this);
													if (n == g.dcoln) {
														return false;
													}
													if (n < g.dcoln) {
														$(this).append(
																g.cdropleft);
													} else {
														$(this).append(
																g.cdropright);
													}
													g.dcolt = n;
												} else if (!g.colresize) {
													var nv = $('th:visible',
															g.hDiv).index(this);
													var onl = parseInt($(
															'div:eq(' + nv
																	+ ')',
															g.cDrag)
															.css('left'));
													var nw = jQuery(g.nBtn)
															.outerWidth();
													var nl = onl
															- nw
															+ Math
																	.floor(p.cgwidth / 2);
													$(g.nDiv).hide();
													$(g.nBtn).hide();

													var top = $(window)
															.scrollTop()
															- g.gDiv.offsetTop;
													if (top < 0)
														top = 0;
													$(g.nBtn).css({
														'left' : nl,
														top : top
													}).show();

													var ndw = parseInt($(g.nDiv)
															.width());
													var top2 = top
															+ $(g.nBtn)
																	.height();
													$(g.nDiv).css({
														top : top2
													});
													if ((nl + ndw) > $(g.gDiv)
															.width()) {
														$(g.nDiv).css('left',
																onl - ndw + 1);
													} else {
														$(g.nDiv).css('left',
																nl);
													}
													if ($(this).hasClass(
															'sorted')) {
														$(g.nBtn).addClass(
																'srtd');
													} else {
														$(g.nBtn).removeClass(
																'srtd');
													}
												}
											},
											function() {
												$(this).removeClass('thOver');
												if ($(this).attr('abbr') != p.sortname) {
													$('div', this).removeClass(
															's' + p.sortorder);
												} else if ($(this).attr('abbr') == p.sortname) {
													var no = (p.sortorder == 'asc') ? 'desc'
															: 'asc';
													$('div', this).addClass(
															's' + p.sortorder)
															.removeClass(
																	's' + no);
												}
												if (g.colCopy) {
													$(g.cdropleft).remove();
													$(g.cdropright).remove();
													g.dcolt = null;
												}
											}); // wrap content
						});

		// 表体
		g.bDiv.className = 'bDiv';
		$(t).before(g.bDiv);

		$(g.bDiv).scroll(function(e) {
			g.scroll();
		}).append(t);

		g.addCellProp();
		g.addRowProp();

		// 用于改变列宽的div条
		var cdcol = $('thead tr:first th:first', g.hDiv).get(0);
		if (cdcol != null) {
			g.cDrag.className = 'cDrag';
			g.cdpad = 0;// 合计左右边框
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth'))) ? 0
					: parseInt($('div', cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth'))) ? 0
					: parseInt($('div', cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft'))) ? 0
					: parseInt($('div', cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight'))) ? 0
					: parseInt($('div', cdcol).css('paddingRight')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0
					: parseInt($(cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0
					: parseInt($(cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0
					: parseInt($(cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0
					: parseInt($(cdcol).css('paddingRight')));
			$(g.bDiv).before(g.cDrag);
			var cdheight = $(g.bDiv).height();
			var hdheight = $(g.hDiv).height();
			$(g.cDrag).css({
				top : -hdheight + 'px'
			});
			if(p.drag){
				$('thead tr:first th', g.hDiv).each(function() {
					var cgDiv = document.createElement('div');
					$(g.cDrag).append(cgDiv);
					if (!p.cgwidth) {
						p.cgwidth = $(cgDiv).width();
					}
					$(cgDiv).css({
						height : cdheight + hdheight
					}).mousedown(function(e) {
						g.dragStart('colresize', e, this);
					});
					if ($.browser.msie && $.browser.version < 7.0) {
						g.fixHeight($(g.gDiv).height());
						$(cgDiv).hover(function() {
							g.fixHeight();
							$(this).addClass('dragging');
						}, function() {
							if (!g.colresize)
								$(this).removeClass('dragging');
						});
					}
				});	
			}
	
		}

		// 条纹样式(隔行换颜色)
		if (p.striped) {
			$('tbody tr', g.bDiv).removeClass('erow');
			$('tbody tr:odd', g.bDiv).addClass('erow');// 奇数行
		}

		// setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';

		// 列的控制按钮和控制菜单
		var gh = $(g.bDiv).height();
		var gtop = g.bDiv.offsetTop;
		if ($('th', g.hDiv).length) {
			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css({
				marginBottom : (gh * -1),
				display : 'none',
				top : gtop
			}).noSelect();
			var cn = 0;
			$('th div', g.hDiv).each(
					function() {
						var kcol = $("th[axis='col" + cn + "']", g.hDiv)[0];
						var chk = 'checked="checked"';
						if (kcol.style.display == 'none') {
							chk = '';
						}
						$('tbody', g.nDiv).append(
								'<tr><td class="ndcol1"><input type="checkbox" '
										+ chk + ' class="togCol" value="' + cn
										+ '" /></td><td class="ndcol2">'
										+ this.innerHTML + '</td></tr>');
						cn++;
					});
			if ($.browser.msie && $.browser.version < 7.0)
				$('tr', g.nDiv).hover(function() {
					$(this).addClass('ndcolover');
				}, function() {
					$(this).removeClass('ndcolover');
				});
			$('td.ndcol2', g.nDiv).click(
					function() {
				
						if ($('input:checked', g.nDiv).length <= p.minColToggle
								&& $(this).prev().find('input')[0].checked)
							return false;
						return g.toggleCol($(this).prev().find('input').val());
					});
			$('input.togCol', g.nDiv).click(
			
					function() {
						if ($('input:checked', g.nDiv).length < p.minColToggle
								&& this.checked == false)
							return false;
						$(this).parent().next().trigger('click');
					});
			$(g.gDiv).prepend(g.nDiv);
			if(p.hideShow){
				$(g.nBtn).addClass('nBtn').html('<div></div>').attr('title',
				'Hide/Show Columns').click(function() {
			$(g.nDiv).toggle();
			return true;
		});	
			}

			if (p.showToggleBtn) {
				$(g.gDiv).prepend(g.nBtn);
			}
		}

		// add flexigrid events
		$(g.bDiv).hover(function() {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		}, function() {
			if (g.multisel) {
				g.multisel = false;
			}
		});
		$(g.gDiv).hover(function() {
		}, function() {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		});
		// add document events
		$(document).mousemove(function(e) {
			g.dragMove(e);
		}).mouseup(function(e) {
			g.dragEnd();
		}).hover(function() {
		}, function() {
			g.dragEnd();
		});
		// browser adjustments
		if ($.browser.msie && $.browser.version < 7.0) {
			$('.hDiv,.bDiv', g.gDiv).css({
				width : '100%'
			});
			$(g.gDiv).addClass('ie6');
			if (p.width != 'auto') {
				$(g.gDiv).addClass('ie6fullwidthbug');
			}
		}
		g.rePosDrag();
		g.fixHeight();
		// make grid functions accessible
		t.p = p;
		t.grid = g;

		// 固定表头
		$(window)
				.scroll(
						function() {
							var sctop = $(window).scrollTop();
							var elmtop = $(g.gDiv).offset().top;

							if (sctop > elmtop
									&& sctop <= (elmtop + $(g.gDiv).height() - $(
											g.hDiv).height())) {
								if (jQuery.browser.msie
										&& jQuery.browser.version == "6.0")
									$(g.hDiv).css({
										"position" : "absolute",
										"top" : $(window).scrollTop(),
										"z-index" : 1,
										"left" : $(g.bDiv).offset().left
									});
								else {
									$(g.hDiv)
											.css(
													{
														"position" : "fixed",
														"top" : "0",
														"z-index" : 1,
														"width" : $(g.gDiv)
																.width(),
														"left" : $(g.bDiv)
																.offset().left
																- $(window)
																		.scrollLeft()
													});
									
								}
							} else {
								$(g.hDiv).css({
									"position" : "relative",
									"top" : 0,
									"left" : 0
								});
							}
							g.hDiv.scrollLeft = g.bDiv.scrollLeft;
						});

		return t;
	};

	var docloaded = false;
	$(document).ready(function() {
		docloaded = true;
	});

	$.fn.flexigrid = function(cfg) {
		return this.each(function() {
			if (!docloaded) {
				$(this).hide();
				var t = this;
				$(document).ready(function() {
					$.addFlex(t, cfg);
				});
			} else {
				$.addFlex(this, cfg);
			}
		});
	}; // end flexigrid
	$.fn.gettrSelected = function() {
		var trcount=$('.trSelected',this);
		
		return trcount;

	}
	//重新计算高度
	$.fn.fixHeight = function() {
		var grid = $(".flexigrid.ie");
		if ($.browser.msie
				&& ($.browser.version < 8 || $.browser.version >= 9)) {
			$(grid).each(function(){
				var btable = $(".bDiv",this).find("table:first");
				$(".bDiv",this).height(btable.outerHeight(true) + 20);
			});
			
		}	
	}
	//隔行换色
	$.fn.stripedColors = function(){
		$('tbody tr', this).removeClass('erow');
		$('tbody tr:odd', this).addClass('erow');	
	}
	$.fn.gettrValues = function() {
		var tr=$('.trSelected',this);
		var td=new Array();
		$(tr).find("td").each(function(i){
			td[i]=$(this).text();			
		});
		return td;
	}
	$.fn.flexToggleCol = function(cid, visible) { // function to reload grid
		return this.each(function() {
			if (this.grid)
				this.grid.toggleCol(cid, visible);
		});
	}; // end flexToggleCol

	// 禁止选中文本
	$.fn.noSelect = function(p) { // no select plugin by me :-)
		var prevent = (p == null) ? true : p;
		if (prevent) {
			return this.each(function() {
				if ($.browser.msie || $.browser.safari)
					$(this).bind('selectstart', function() {
						return false;
					});
				else if ($.browser.mozilla) {
					$(this).css('MozUserSelect', 'none');
					$('body').trigger('focus');
				} else if ($.browser.opera)
					$(this).bind('mousedown', function() {
						return false;
					});
				else
					$(this).attr('unselectable', 'on');
			});
		} else {
			return this.each(function() {
				if ($.browser.msie || $.browser.safari)
					$(this).unbind('selectstart');
				else if ($.browser.mozilla)
					$(this).css('MozUserSelect', 'inherit');
				else if ($.browser.opera)
					$(this).unbind('mousedown');
				else
					$(this).removeAttr('unselectable', 'on');
			});
		}
	}; // end noSelect
	
})(jQuery);
function checkAll(groupName) { 
	var selector ='input:checkbox[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		this.checked = true;
		imageCtrl.addClass('jNiceChecked');
	});
}
function clearAll(groupName) { 
	var selector ='input:checkbox[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		this.checked = false;
		imageCtrl.removeClass('jNiceChecked');
	});
}
$(document).ready(function(){
	$('table.flexGrid').flexigrid();
 
});