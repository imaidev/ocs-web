(function($) {
	var cloneRow;
	var validateCurtInput;
	var listName;
	var settings = jQuery.extend({
		headerrowsize : 2,
		highlightrow : true,
		highlightclass : "highlight"
	}, {});
	var fixtableheader = function(table) {
		var $tbl = $(table);
		listName = $tbl.attr("listName");
		if(!listName){
			listName="editGridList";
		};
		$('tbody tr', $tbl).hide();
		var tw=$tbl.width();
		$("tbody tr:hidden",$tbl).css('display',''); 
		// 将th 宽度赋值给input,支持百分比
		var tri;
		for(i=0;i<$('tbody tr', $tbl).size();i++){
		 tri=$('tbody tr', $tbl).get(i);
			
		$('td', tri).each(function() { 
			var n = $('td', $(this).parent()).index(this);
			var th = $('th:eq(' + n + ')', $tbl).get(0);
			var thw=th.style.width||th.width;
			var isPercentow=thw.substring(thw.length-1,thw.length);
			if(isPercentow=="%"){
				var rt=thw.substring(0,thw.length-1)/100;
				var thwidth=tw*rt+"px";
				$(th).attr("width",thwidth);
				$(th).attr("style","width:"+thwidth);
				$(":input",this).attr("style","width:"+thwidth);
			}else{
				if(thw.indexOf("px")>0){
					$(th).attr("width",thw);
					$(th).attr("style","width:"+thw);
					$(":input",this).attr("style","width:"+thw);	
				}else{
					$(th).attr("width",thw+"px");
					$(th).attr("style","width:"+thw+"px");
					$(":input",this).attr("style","width:"+thw+"px");
				}
				
			}
				

			
		});
		}

		$($tbl).addClass('editgrid');
		$('tbody tr:odd:visible', $tbl).addClass('erow');// 奇数行

		var $tblhfixed = $tbl.find("thead");
		var headerelement = "th";
		if ($tblhfixed.find(headerelement).length == 0)
			headerelement = "td";
		if ($tblhfixed.find(headerelement).length > 0) {
			$tblhfixed.find(headerelement).each(function() {
				// var ttt = $(this).width();
			// this.style.width="";
				// $(this).css("width", ttt);
			});
			var $clonedTable = $tbl.clone().empty();
			var tblwidth = $tbl.outerWidth();
			$clonedTable.attr("id", "fixedtableheader" + $tbl.attr('id')).css({
				"position" : "fixed",
				"top" : "0",
				"left" : $tbl.offset().left
			}).append($tblhfixed.clone()).width(tblwidth).hide().appendTo(
					$("body"));
			if (settings.highlightrow)
				
				$("tr:gt(" + (settings.headerrowsize - 1) + ")", $tbl).hover(
						
						function() {
							$(this).addClass(settings.highlightclass);
						}, function() {
							$(this).removeClass(settings.highlightclass);
						});
			$(window)
					.scroll(
							function() {
								if (jQuery.browser.msie
										&& jQuery.browser.version == "6.0")
									$clonedTable.css({
										"position" : "absolute",
										"top" : $(window).scrollTop(),
										"left" : $tbl.offset().left
									});
								else
									$clonedTable.css({
										"position" : "fixed",
										"top" : "0",
										"left" : $tbl.offset().left
												- $(window).scrollLeft()
									});
								var sctop = $(window).scrollTop();
								var elmtop = $tblhfixed.offset().top;
								if (sctop > elmtop
										&& sctop <= (elmtop + $tbl.height() - $tblhfixed
												.height()))
									$clonedTable.show();
								else
									$clonedTable.hide();
							});
			$(window).resize(
					function() {
						if ($clonedTable.outerWidth() != $tbl.outerWidth()) {
							$tblhfixed.find(headerelement).each(
									function(index) {
										var w = $(this).width();
										$(this).css("width", w);
										$clonedTable.find(headerelement).eq(
												index).css("width", w);
									});
							$clonedTable.width($tbl.outerWidth());
						}
						$clonedTable.css("left", $tbl.offset().left);
					});
		}
		
		$($tbl).attr("edit", true);

	}
	/**
	 * 默认的配置项
	 */
	var config = {
		selectText : true,
		isSum:false
	};

	/**
	 * 假如table还没有被转为grid就先延迟加载
	 */
	var delayEditGrid = function(tables) {
		var delayArray = [];
		$.each(tables, function(index, table) {
			if (table.grid) {
				editableGrid(table);// 调用Edit模式将table转为Edit模式
			} else {
				delayArray.push(table);// 还没有将table转为table，延迟加载一会儿,先放到延迟加载数组里面
			}
		});
		if (delayArray.length > 0) {
			setTimeout(function() {
				delayEditGrid(delayArray);// 延迟加载
			}, 10);
		}
	};
	/**
	 * 初始化通用帮助列
	 * 
	 * @param trsEl
	 * @returns
	 */
	var initHelpColumn = function(trsEl) {

	};
	/**
	 * 初始化日期列，所有日期组件公用一个
	 * 
	 * @param trsEl
	 * @returns
	 */
	var initDateColumn = function(trsEl) {

	};
	/**
	 * 获取下一个可编辑的编辑器
	 * 
	 * @param curCell
	 * @returns
	 */
	var nextEditableCell = function(curCell) {
		var curTr, nextTr, curTd, nextTd, nextEditor;
		curTd = curCell.nodeName.toLowerCase() === "td" ? curCell : $(curCell)
				.parents("td:first")[0];
		curTd = !!curTd ? curTd : $(curCell).find("td:first")[0];
		if (!curTd)
			return false;
		nextTd = curTd.nextSibling;
		if(nextTd != null) {
			while(nextTd.nodeType == 8) {
				nextTd = nextTd.nextSibling;
				if(nextTd == null)
					break;
			}
		}
		nextTd = nextTd ? (nextTd.nodeType == 3 ? curTd.nextElementSibling
				: nextTd) : nextTd;
		validateCurtInput=validate(curTd);
		if(!validateCurtInput){
			return;
		}
		if (nextTd) {
			nextEditor = $(nextTd).find(
					"input:visible,select:visible,textarea:visible,button:visible");
			if (nextEditor = isEditable(nextEditor)) {
				return nextEditor;
			} else {// 不存在可编辑的element就递归调用
				return nextEditableCell(nextTd);
			}
		} else {
			curTr = curTd.parentNode;
			nextTr = curTr.nextSibling;
			nextTr = nextTr ? (nextTr.nodeType == 3 ? curTr.nextElementSibling
					: nextTr) : nextTr;
			if (nextTr) {
				nextTd = nextTr.cells[0];
				nextEditor = $(nextTd).find(
						"input:visible,select:visible,textarea:visible,button:visible");
				if (nextEditor = isEditable(nextEditor)) {
					return nextEditor;
				} else {// 不存在可编辑的element就递归调用
					return nextEditableCell(nextTd);
				}
			} else {
				return false;// 这就是最后一个单元格不作处理
			}
		}
		
	};
	/**
	 * 判断元素是否可编辑
	 * 
	 * @param curCell
	 * @returns
	 */
	var isEditable = function(editors) {
		for ( var i = 0, len = editors.length; i < len; i++) {
			var ele = editors[i];
			var nodeName = ele.nodeName.toLowerCase(), type = ele
					.getAttribute("type"), disabled, editable, readonly;
			if (nodeName == "input"
					&& (type == "button" || type == "image" || type == "reset" || type == "submit")) {
				return false;
			}
			disabled = ele.getAttribute("disabled");
			if (disabled == true || disabled == "disabled"
					|| disabled == "true") {
				return false;
			}
			readonly = ele.getAttribute("readonly");
			if (readonly == true || readonly == "readonly"
					|| readonly == "true") {
				return false;
			}
			editable = ele.getAttribute("editable");
			if (editable === "false") {
				return false;
			}
			return ele;
		}
		return false;
	};
	/**
	 * 选中编辑器中的文字
	 * 
	 * @param curCell
	 * @returns
	 */
	var selectText = function(editor, start, end) {
		var v = $(editor).val();
		var doFocus = false;
		if (typeof v == "string" && v.length > 0) {
			start = start === undefined ? 0 : start;
			end = end === undefined ? v.length : end;
			var d = editor;
			if (d.setSelectionRange) {
				d.setSelectionRange(start, end);
			} else if (d.createTextRange) {
				var range = d.createTextRange();
				range.moveStart("character", start);
				range.moveEnd("character", end - v.length);
				range.select();
			}
			doFocus = $.browser.gecko || $.browser.opera;
		} else {
			doFocus = true;
		}
		if (doFocus) {
			editor.focus();
		}
	};
	/**
	 * 初始化键盘事件
	 * 
	 * @param editors
	 * @returns
	 */
	var initKeyboardEvents = function(table) {
		var grid = $(table);
		grid.on("keydown", function(event) {
			if (event.which !== 13) {
				return;
			}

			var nextEditor = nextEditableCell(event.target);
			if (!validateCurtInput){
				
				return;
			}else{
				if (nextEditor) {
					
					nextEditor.focus();
					if (config.selectText) {
						selectText(nextEditor);
					}
				} else {// 没有下一个编辑器

					grid.addRow();
					nextEditor = nextEditableCell(event.target);
					nextEditor.focus();
				}	
			}
	
			return false;
		});
	};
	/**
	 * @param table
	 * @returns
	 */
	var editableGrid = function(table) {
		var editors = $(table).find("td div>*");
		// 先将table每个单元格转为编辑的模式，因为已经要求开发人员写了input和select，
		// 所以这里就需要专门针对通用帮助，日期组件做处理

		// 然后初始化键盘事件
		initKeyboardEvents(table);
		// 还有什么？？

		// 最后为dom增加一个标志表明已经editable了
		table.editgrid = true;

	};
	/**
	 * 增加行方法
	 * 
	 * @param index
	 *            增加行的索引，增加行时处理name，增加行时处理下拉和日期组件
	 */
	$.fn.addRow = function() {
		    var length=$("tbody tr",this).length;
			var clone = cloneRow.clone(true).removeAttr('id');
			clone.find("td div>*").val(null);
			$(clone).find("input[type='text']").val("");
			$(clone).find("select").val("");
			$(clone).find("select").removeAttr('id');
			$(clone).find("select").removeAttr('sel');
			$(":input", clone).each(function(i) {
				var inputname = $(this).attr("name");
				if(inputname!=null){
					if(inputname.indexOf(".")>0){
						var names = inputname.split(".");
						var javabean = "";
						var beanproperty = "";					
							if(names[0].indexOf("[")>0){
								javabean = names[0].substring(0, names[0].length - 3);	
							}else{
								javabean = names[0];
							}
							
							beanproperty = names[1];
							var namecopy = javabean + "[" + length + "]" + "." + beanproperty;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
					}else{
						var namecopy =listName+"["+length+"]."+inputname;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
						
					}	
				}
	
				
			});
			clone.removeAttr('style');
			clone.attr("editgrid-add", true);

			if ($(this).find("tbody tr:last").attr("class") == "erow") {
				clone.attr("class", "");
			} else {
				clone.attr("class", "erow");
			}

			// $(clone).find("input[type='text']").removeAttr("id");
			$("table[edit]").append(clone);


		this.countRow();
		// 对外部组件的支持
		$('select').multiselect();
		$(".dateImg",clone).each(function(){
			$(this).datepicker();
		});
		return this;
	};
	/**
	 * 删除行方法
	 * 
	 * @param index
	 *            删除行的索引，重置删除行以后的所有行name
	 */
	$.fn.removeRow = function() {
		var row=this.getSelected();		
		var index1=row.index();
		row.remove();		
		var length=$("tbody tr",this).length;
		if(index1>=0){					
		for(j=index1;j<length;j++){
			 tri=$('tbody tr:eq('+j+')',this).get(0);
			 $(":input", tri).each(function(i) {
					var inputname = $(this).attr("name");
					if(inputname!=null){
						if(inputname.indexOf(".")>0){
							var names = inputname.split(".");
							var javabean = "";
							var beanproperty = "";
   
								if(names[0].indexOf("[")>0){
									javabean = names[0].substring(0, names[0].length - 3);	
								}else{
									javabean = names[0];
								}
								
								beanproperty = names[1];
				              var namecopy = javabean + "[" +  j + "]" + "." + beanproperty;
							$(this).removeAttr('name');
							$(this).prop({
								name : namecopy
							});	
						}else{
							var namecopy =listName+"["+j+"]."+inputname;
							$(this).removeAttr('name');
							$(this).prop({
								name : namecopy
							});	
							
						}		
					}							
				});
		}	 			
		}
		$('tbody tr',this).removeClass("erow");
		$('tbody tr:odd:visible',this).attr("class", "erow");// 奇数行
		this.countRow();
		this.putValue();
		return this;
	};
	/**
	 * 计算行数
	 * 
	 * 
	 */
	$.fn.countRow = function() {
		var row = $(this).find("tbody tr:visible");
		var rowcount = row.size();
		$("input[name='org.loushang.web.taglib.util.GRIDLENGTH']").attr(
				"value", rowcount);
	};
	/**
	 * 删除行方法
	 * 
	 * @param filed
	 *            要获取的值得列名
	 * @param index
	 *            要获取哪一行的值的索引
	 */
	$.fn.getValue = function(field, index) {
		var tr = this.find("tbody tr:visible").eq(index);
		var editor = tr.find("td [name=" + field + "]");
		return editor.val();
	};
	/**
	 * 得到选择行
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.getSelected = function() {
		var trcount=$('.selected',this);
		
		return trcount;

	}
	/**
	 * 合计行功能-创建dom
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.creatDom =function(){
		var tr=cloneRow.clone();
		tr.removeAttr("");
		tr.attr("sum",true);
		tr.attr("class","sum");
		$('td',tr).empty();
		var $tbl=$(this);
		var tw=$tbl.width();
		$('td', tr).each(function() { 
			var n = $('td', $(this).parent()).index(this);
			var th = $('th:eq(' + n + ')', $tbl).get(0);
			var thw=th.style.width||th.width;
			var isPercentow=thw.substring(thw.length-1,thw.length);
			if(isPercentow=="%"){
				var rt=thw.substring(0,thw.length-1)/100;
				var thwidth=tw*rt+"px";
				$(this).attr("style","width:"+thwidth);
			}else{
				if(thw.indexOf("px")>0){
					$(this).attr("style","width:"+thw);	
				}else{
					$(this).attr("style","width:"+thw+"px");
				}
				
			}							
		});
		
		$('tbody',this)
		.after(tr);
		$("tr[sum]").wrap("<tfoot></tfoot>");
	}
	/**
	 * 合计行功能-将value放入DOM
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.putValue = function() {
		
		var sums =new Array();
		var th=$('thead th:visible',this);
		var thi;
		var suminfo;
		for(var i=0;i<th.size();i++){
			 thi=$("th:eq("+i+")");
			 if($(thi).attr("isSum")=="true"){
				 var sumname=$(thi).attr("sumName");
				 var n=$(thi).index();
				 sums[n]=this.amount(n);
				 if(sumname){
					 suminfo=sumname+":"+sums[n];
				 }else{
					 suminfo=sums[n];
				 }
				 var trsum=$("tr[sum]");
				 $('td:eq('+n+')',trsum).text(suminfo);
				}
		      }
	 }
	/**
	 * 合计行功能-加法计算
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.amount = function(index) {
		var sum=0;
		var tds=new Array();
		var trs=$('tbody',this);
		var num=parseInt(index)+1;
		var tds=$("tr td:nth-child("+num+")",trs);

		$(":input",tds).each(function(i){
			var value=$(this).val();
			if(value==""){
				value=0;
			}
				sum=parseInt(sum)+parseInt(value);
			});
		return sum;
	}
	
	/**
	 * 对校验支持
	 * 
	 * @param 调用editgrid触发该方法
	 */
	var validate = function(curTd){
		var v=$(":input",curTd).attr("validate");
		if(v!=undefined){
			return eval(v);
		}else{
			return true;}
	}
	
	
	/**
	 * 克隆行方法,同时初始化tbody所有输入域 name,form提交后台根据name向java bean或者map放入数据
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.cloneRow = function() {
		var row=$(this).find("tbody tr:first");
		cloneRow=row.clone(true);
		var rows=$("tbody tr",this);
		for(l=0;l<rows.size();l++){
			var rowl=rows.get(l);
			$(":input",rowl).each(function(i) {
				var inputname = $(this).attr("name");
				if(inputname!=null){
					if(inputname.indexOf(".")>0){
						var names = inputname.split(".");
						var javabean = "";
						var beanproperty = "";					
							if(names[0].indexOf("[")>0){
								javabean = names[0].substring(0, names[0].length - 3);	
							}else{
								javabean = names[0];
							}
							
							beanproperty = names[1];
							var namecopy = javabean + "[" + l + "]" + "." + beanproperty;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
					}else{
						var namecopy =listName+"["+l+"]."+inputname;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
						
					}	
				}

				
			});
		}
	
		$(this)
				.after(
						"<input type='hidden' name='org.loushang.web.taglib.util.GRIDLENGTH' value=''>");
	
	}
	/**
	 * 将flexGrid可编辑
	 * 
	 * @param cfg
	 * @returns
	 */
	$.fn.editgrid = function(cfg) {	
		// 事件绑定，添加样式
		var $t=this;
		$('tbody tr', this).bind({
			click:function(){
				 $(this).addClass("selected ");					
					$(this).siblings().removeClass('selected');
				},
			focusin:function(){
				 $(this).addClass("selected ");
					
					$(this).siblings().removeClass('selected');
				}
		});
		$('tbody tr', this).find(":input").bind({
			focusin:function(){
				$(this).addClass("focus");
				//$(this).siblings().removeClass("focus");
			},
			focusout:function(){
				$(this).removeClass("focus");
			}
			
		});

		if(this.attr("isSum")=="true"){
			config.isSum=true;
		}else{
			config.isSum=false;
		}
		if (cfg) {// 拷贝配置参数
			$.extend(config, cfg);
		}
		if(config.isSum){
		var th=$('thead th:visible',this);
		var thi;
		//合计功能绑定事件
		for(var i=0;i<th.size();i++){
			 thi=$("th:eq("+i+")");
			 if($(thi).attr("isSum")=="true"){
				 var n=$(thi).index();
				 var num=parseInt(n)+1;
				 var trs=$('tbody',this);
				 var tds=$("tr td:nth-child("+num+")",trs); 
				 $(":input",tds).bind("change", function(){
					 $t.putValue();
					});
				}
		      }
		}
		var delayArray = [];
		this.each(function(index) {			
			fixtableheader(this);
			if (true) {
				editableGrid(this);// 调用Edit模式将table转为Edit模式
			} else {
				delayArray.push(this);
				;// 还没有将table转为table，延迟加载一会儿,先放到延迟加载数组里面
			}
		});
		if (delayArray.length > 0) {
			setTimeout(function() {
				delayEditGrid(delayArray);// 延迟加载
			}, 10);
		}
		this.cloneRow();
		this.countRow();
		if(config.isSum){
			this.creatDom();
			this.putValue();	
		}
		return this;
	}; // end editgrid
})(jQuery);

$(document).ready(function(){
 	$('table.editGrid').editgrid();
 
});