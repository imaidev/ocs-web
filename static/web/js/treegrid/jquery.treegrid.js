/**
 * @author zhaowj
 * @version 1.0
 */
TreeGrid = function(_config) {
	var cfg = {
		id : "tg1",
		tableWidth : "800",
		headerAlign : "left",
		headerHeight : "30",
		trHeight:"25",
		theadtrcss:"theadtrcss",
		tbodytrcss:"tbodytrcss",
		tableHeight:"200",
		dataAlign : "left",
		indentation : "20",
		hoverRowBackground : "true",
		folderColumnIndex : "1"
	};
	_config = $.extend(cfg, _config);
	var s = "";
	var t = "";
	var rownum = 0;
	var __root;
	var __selectedData = null;
	var __selectedId = null;
	var __selectedIndex = null;
	// 显示表头行
	drowHeader = function() {
		if(_config.theadtrcss){
			s += "<thead><tr class='header "+_config.theadtrcss+"' height='" + (_config.headerHeight || "25")
			+ "'>";
		}
		else{
			s += "<thead><tr class='header' height='" + (_config.headerHeight || "25")
			+ "'>";
		}
		
		var cols = _config.columns;
		for (i = 0; i < cols.length; i++) {
			var col = cols[i];
			s += "<th align='"
					+ (col.headerAlign || _config.headerAlign || "center")
					+ "' width='" + (col.width || "") + "'>"
					+ (col.headerText || "") + "</th>";
		}
		s += "</tr></thead>";
	}
	extend = function(des, src, override){
	    if(src instanceof Array){
	        for(var i = 0, len = src.length; i < len; i++)
	             extend(des, src[i], override);
	    }
	    for( var i in src){
	        if(override || !(i in des)){
	            des[i] = src[i];
	        }
	    }
	    return des;
	}
	drowDatafromAjax = function(trid, level, data) {
		var paths = document.location.pathname.split("/");
		var webPath="";
		if (paths[0] == '') {// ie下面有时候paths[0]是空
		webPath = "/" + paths[1];
		} else {
		webPath = "/" + paths[0];
		}
		var ajaxUrl=webPath+"/"+_config.url;
		var cols = _config.columns;
		var autoParam = _config.autoParam;
		var otherParam = _config.otherParam;
		var map = {};
		if(autoParam){
			var autoParamLength = autoParam.length;
			// var a=autoParam[0];
			var dataObj = TreeGrid.str2json(data);
			
			for ( var i = 0; i < autoParamLength; i++) {

				map[autoParam[i]] = dataObj[autoParam[i]];
			}	
		}
		if(otherParam){
			var otherParamLength = otherParam.length;
			for ( var i = 0; i < otherParamLength; i++) {
				map = extend(map, otherParam[i]);
			}
		}
		
		//var pa = TreeGrid.json2str(params);
		// alert(params.params.map.folderName);
		$.ajax({
			type : 'post',
			url : ajaxUrl,
			dataType: 'json',
			data : map,
			success : function(data) {
				drowRowDatafromAjax(data, cols, level, trid);
				init();
				openOrClose(trid);
			},
			error : function() {
			}
		});
	}
	// 递归显示数据行
	drowData = function() {
		var cols = _config.columns;
		var rows = _config.data;
		if (rows) {
			drowRowData(rows, cols, 0, "");
			s += "</table>";
			  if(_config.tableHeight){
		        	s +="</div>"
		        }
			__root = $("#" + _config.renderTo);
			__root.append(s);
			init();
			openOrClose();
		} 

	}

	drowRowDatafromAjax = function(_rows, _cols, _level, _pid) {
		var folderColumnIndex = (_config.folderColumnIndex || 1);
		s = "";
		for ( var i = 0; i < _rows.length; i++) {
			var id = _pid + "_" + i; // 行id
			var row = _rows[i];
			if(_config.tbodytrcss){
				s += "<tr class='"+_config.tbodytrcss+"' id='" + id + "' height='"+(_config.trHeight||"auto")+"'  level='" + (_level + 1) + "' pid='"
				+ ((_pid == "") ? "" : (_pid)) + "' isopen='true' data=\""
				+ TreeGrid.json2str(row) + "\" rowIndex='" + rownum++
				+ "'>";
			}else{
				s += "<tr id='" + id + "' height='"+(_config.trHeight||"auto")+"'  level='" + (_level + 1) + "' pid='"
				+ ((_pid == "") ? "" : (_pid)) + "' isopen='true' data=\""
				+ TreeGrid.json2str(row) + "\" rowIndex='" + rownum++
				+ "'>";	
			}


			for ( var j = 0; j < _cols.length; j++) {
				var col = _cols[j];
				s += "<td align='"
						+ (col.dataAlign || _config.dataAlign || "left") + "'";

				// 层次缩进
				if (j == folderColumnIndex) {
					s += " style='padding-left:"
							+ (parseInt((_config.indentation || "20")) * (_level + 1))
							+ "px;'> ";
				} else {
					s += ">";
				}
				// 节点图标
				if (j == folderColumnIndex) {				
						s += "<div  folder='true' trid='" + id + "' class='image_hand'>";
				}

				// 单元格内容
				if (col.handler) {
					s += (eval(col.handler + ".call(new Object(), row, col)") || "")
							+ "</td>";
				} else {
					s += (row[col.dataField] || "") + "</td>";
				}
			}
			s += "</tr>";

			// 递归显示下级数据
			if (row.children) {

				var row=TreeGrid.str2json(row.children);
				drowRowData(row, _cols, _level + 1, id);
			}

		}

		__root.find('tr[id=' + _pid + ']').after(s);

	}

	// 局部变量i、j必须要用 var 来声明，否则，后续的数据无法正常显示
	drowRowData = function(_rows, _cols, _level, pid) {
		var folderColumnIndex = (_config.folderColumnIndex || 0);
		var _pid="";
		var id="";
		for ( var i = 0; i < _rows.length; i++) {
			if(pid.substring(0,2)=="TR"){
				_pid=pid.substring(2);
				id = _pid;
			}else{
				_pid=pid;
				id=_pid;
			}
			var id = _pid + "_" + i; // 行id
			var row = _rows[i];
			if(_config.tbodytrcss){
				s += "<tr class='"+_config.tbodytrcss+"' id='TR" + id + "'   height='"+(_config.trHeight||"auto")+"'  level='" + _level + "' pid='"
				+ ((_pid == "") ? "" : ("TR" + _pid))
				+ "' isopen='true' data=\"" + TreeGrid.json2str(row)
				+ "\" rowIndex='" + rownum++ + "'>";
			}else{
				s += "<tr id='TR" + id + "'   height='"+(_config.trHeight||"auto")+"'  level='" + _level + "' pid='"
				+ ((_pid == "") ? "" : ("TR" + _pid))
				+ "' isopen='true' data=\"" + TreeGrid.json2str(row)
				+ "\" rowIndex='" + rownum++ + "'>";
			}

			for ( var j = 0; j < _cols.length; j++) {
				var col = _cols[j];
				s += "<td align='"
						+ (col.dataAlign || _config.dataAlign || "left") + "'";

				// 层次缩进
				if (j == folderColumnIndex) {
					s += " style='padding-left:"
							+ (parseInt((_config.indentation || "20")) * _level)
							+ "px;'> ";
				} else {
					s += ">";
				}

				// 节点图标
				if (j == folderColumnIndex) {
//					 if(row.children){ //有下级数据
//					 s += "<div folder='true' trid='TR" + id + "' src='" +
//					 folderOpenIcon + "' class='image_hand'>";
//					 }else{
//					 s += "<div src='" + defaultLeafIcon + "' class='image_nohand'>";
//											
//					 }
					s += "<div folder='true' trid='TR" + id + "' class='image_hand'>";
				}

				// 单元格内容
				if (col.handler) {
					s += (eval(col.handler + ".call(new Object(), row, col)") || "")
							+ "</td>";
				} else {
					s += (row[col.dataField] || "") + "</td>";
				}
			}
			s += "</tr>";

			// 递归显示下级数据
			if (row.children) {
				drowRowData(row.children, _cols, _level + 1, id);
			}

		}

	}

	// 主函数
	this.show = function() {
		this.id = _config.id || ("TreeGrid" + TreeGrid.COUNT++);
        if(_config.tableHeight){
        	s +="<div style='overflow:auto;height:"+_config.tableHheight+"px;width:"+(parseInt(_config.tableWidth)+18)+"px;'>"
        }
		s += "<table id='" + this.id + "' cellspacing=0 cellpadding=0  width='"
				+ (_config.tableWidth || "100%") + "' class='TreeGrid'>";
		drowHeader();
		drowData();
		// init();

	}

	init = function() {

		// 以新背景色标识鼠标所指行
		if ((_config.hoverRowBackground || "false") == "true") {
			__root.find("tr").hover(function() {
				if ($(this).attr("class") && $(this).attr("class") == "header")
					return;
				$(this).addClass("row_hover");
			}, function() {
				$(this).removeClass("row_hover");
			});
		}

		// 将单击事件绑定到tr标签
		__root.find("tbody tr").bind(
						"click",
						function() {
							__root.find("tbody tr").removeClass("row_active");
							$(this).addClass("row_active");

							// 获取当前行的数据
							__selectedData = this.data
									|| this.getAttribute("data");
							__selectedId = this.id || this.getAttribute("id");
							__selectedIndex = this.rownum
									|| this.getAttribute("rowIndex");

							// 行记录单击后触发的事件
							if (_config.itemClick) {
								eval(_config.itemClick
										+ "(__selectedId, TreeGrid.str2json(__selectedData))");
							}
						});
		//$("tbody tr").trigger("click");

	}
	openOrClose = function(trid) {
		var div = "";
		if (trid) {
			var tr = __root.find("tr[pid=" + trid + "]");
			div = $("div[folder='true']", tr);
		} else {
			div = __root.find("div[folder='true']");
		}
		// 展开、关闭下级节点
	
		div.bind("click", function() {
			var trid = this.trid || this.getAttribute("trid");
			if(_config.url){
				if ($(this).attr("ajax")) {
					var isOpen = __root.find("#" + trid).attr("isopen");
					isOpen = (isOpen == "true") ? "false" : "true";
					__root.find("#" + trid).attr("isopen", isOpen);
					showHiddenNode(trid, isOpen);
					// $(this).parent().parent().after(s);

				} else {
					var level = parseInt($(this).parent().parent().attr("level"));
					var data = $(this).parent().parent().attr("data");
					$(this).attr("ajax", true);
					drowDatafromAjax(trid, level, data);

				}	
			}else{
				var isOpen = __root.find("#" + trid).attr("isopen");
				isOpen = (isOpen == "true") ? "false" : "true";
				__root.find("#" + trid).attr("isopen", isOpen);
				showHiddenNode(trid, isOpen);
			}


		});
	}


	// 显示或隐藏子节点数据
	showHiddenNode = function(_trid, _open) {
		if (!_open||_open=="false") { // 隐藏子节点
			__root.find("#" + _trid).find("div[folder='true']").attr("class",
					"image_nohand");
			__root.find("#" + _trid).attr("isopen","false");
			__root.find("tr[id^=" + _trid + "_]").css("display", "none");
		} else { // 显示子节点
//			__root.find("#" + _trid).find("div[folder='true']").attr("src",
//					folderOpenIcon);
			__root.find("#" + _trid).find("div[folder='true']").attr("class",
					"image_hand");
			__root.find("#" + _trid).attr("isopen","true");
			
			showSubs(_trid);
		}
	}

	// 递归检查下一级节点是否需要显示
	showSubs = function(_trid) {
		var isOpen = __root.find("#" + _trid).attr("isopen");
		if (isOpen == "true") {
			var trs = __root.find("tr[pid=" + _trid + "]");
			trs.css("display", "");

			for ( var i = 0; i < trs.length; i++) {
				showSubs(trs[i].id);
			}
		}
	}

	// 展开或收起所有节点
	this.expandAll = function(isOpen) {
		var trs = __root.find("tr[pid]");
		for ( var i = 0; i < trs.length; i++) {
			var trid = trs[i].id || trs[i].getAttribute("id");
			showHiddenNode(trid, isOpen);
		}
	}

	// 取得当前选中的行记录
	this.getSelectedItem = function() {
		return new TreeGridItem(__root, __selectedId, __selectedIndex, TreeGrid
				.str2json(__selectedData));
	}

};

// 将json对象转换成字符串


TreeGrid.json2str = function(o) {
	var arr = [];
	var fmt = function(s) {
		if (typeof s == 'object' && s != null)
			return TreeGrid.json2str(s);
		return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
	}
	for ( var i in o)
		arr.push("'" + i + "':" + fmt(o[i]));
	return '{' + arr.join(',') + '}';
}

TreeGrid.str2json = function(s) {
	var json = null;
	if ($.browser.msie) {
		json = eval("(" + s + ")");
	} else {
		json = new Function("return " + s)();
	}
	return json;
}

// 数据行对象
function TreeGridItem(_root, _rowId, _rowIndex, _rowData) {
	var __root = _root;

	this.id = _rowId;
	this.index = _rowIndex;
	this.data = _rowData;

	this.getParent = function() {
		var pid = $("#" + this.id).attr("pid");
		if (pid != "") {
			var rowIndex = $("#" + pid).attr("rowIndex");
			var data = $("#" + pid).attr("data");
			return new TreeGridItem(_root, pid, rowIndex, TreeGrid
					.str2json(data));
		}
		return null;
	}

	this.getChildren = function() {
		var arr = [];
		var trs = $(__root).find("tr[pid='" + this.id + "']");
		for ( var i = 0; i < trs.length; i++) {
			var tr = trs[i];
			arr.push(new TreeGridItem(__root, tr.id, tr.rowIndex, TreeGrid
					.str2json($(tr).attr("data"))));
		}
		return arr;
	}
};