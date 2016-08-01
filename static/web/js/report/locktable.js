//锁定表格，行列都锁定
function FixTable(TableID, FixColumnNumber, width, height) {
	var oldTable=$("#" + TableID);
	if(navigator.userAgent.indexOf("MSIE")>0) {
	  if(navigator.userAgent.indexOf("MSIE 9.0")>0)  
      {  
        // alert("ie9");  
        var re = />\s+/g;
       	oldTable.html(oldTable.html().replace(re,">"));//过滤掉table中的空格回车tab符
      }   
	};
	var layOutTable=$("#" + TableID + "_tableLayout");
	if(height>oldTable.height()){
		height=oldTable.height();
	}
    if (layOutTable.length != 0) {
    	layOutTable.before(oldTable);
    	layOutTable.empty();
    }
    else {
    	oldTable.wrap("<div class='" + TableID + "_tableLayout' style='overflow:auto;height:" + (height+17) + "px; width:" + width + ";'></div>");
    	
    };
 /*
	var re = />\s+/g;
	var oldTable=$("#" + TableID);
	oldTable.html(oldTable.html().replace(re,">"));//过滤掉table中的空格回车tab符
	var layOutTable=$("#" + TableID + "_tableLayout");
	if(height>oldTable.height()){
		height=oldTable.height();
	}
    if (layOutTable.length != 0) {
    	layOutTable.before(oldTable);
    	layOutTable.empty();
    }
    else {
    	oldTable.after("<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + (height+17) + "px; width:" + width + ";'></div>");
    	layOutTable=$("#" + TableID + "_tableLayout");
    }
    $('<div id="' + TableID + '_tableFix"></div>'
    + '<div id="' + TableID + '_tableHead"></div>'
    + '<div id="' + TableID + '_tableColumn"></div>'
    + '<div id="' + TableID + '_tableData"></div>').appendTo(layOutTable);
    
    var oldTableClone=oldTable.clone(true);

    var tableFixClone = oldTableClone;
    tableFixClone.attr("id", TableID + "_tableFixClone");
    var tableFix=$("#" + TableID + "_tableFix");
	tableFix.append(oldTable.clone(true));
	
    var tableHeadClone =oldTableClone;
    tableHeadClone.attr("id", TableID + "_tableHeadClone");
    var tableHead=$("#" + TableID + "_tableHead");
    tableHead.append(oldTable.clone(true));
    
    var tableColumnClone = oldTableClone;
    tableColumnClone.attr("id", TableID + "_tableColumnClone");
    var tableColumn=$("#" + TableID + "_tableColumn");
    tableColumn.append(oldTable.clone(true));
    
   	var tableData=$("#" + TableID + "_tableData");
    tableData.html(oldTable);
    $("table",layOutTable).css("margin", "0");
    
    
    var HeadHeight = $("thead",tableHead).height();
    HeadHeight += 2;
    tableHead.css("height", HeadHeight);
    tableFix.css("height", HeadHeight);
    var ColumnsWidth = 0;
    var ColumnsNumber = 0;
    $("tr:first th:lt(" + FixColumnNumber + ")",tableColumn).each(function () {
    	var colspan = $(this).attr("colspan");
    	ColumnsNumber = parseInt(ColumnsNumber)
		if(!isNaN(colspan)){
			ColumnsNumber += parseInt(colspan);
		}
    	if(ColumnsNumber<=FixColumnNumber){
    		 ColumnsWidth += $(this).outerWidth(true);
    	}
    });
    ColumnsWidth += 2;
    if ($.browser.msie) {
        switch ($.browser.version) {
            case "7.0":
                if (ColumnsNumber >= 3) ColumnsWidth--;
                break;
            case "8.0":
                if (ColumnsNumber >= 2) ColumnsWidth--;
                break;
        }
    }
    tableColumn.width(ColumnsWidth);
    tableFix.width(ColumnsWidth);
	
	
    tableData.scroll(function () {
        tableHead.scrollLeft(tableData.scrollLeft());
        tableColumn.scrollTop(tableData.scrollTop());
    });
    tableFix.css({ "overflow": "hidden", "position": "relative", "z-index": "50", "background-color": "#e7f2ff" });
    tableHead.css({ "overflow": "hidden", "width": width, "position": "relative", "z-index": "45" });
   
	var TableIDWid=tableHead.width();
	tableHead.width(TableIDWid-17);
	$(window).resize(function(){
		   tableFix.css({ "overflow": "hidden", "position": "relative", "z-index": "50", "background-color": "#e7f2ff" });
		   tableHead.css({ "overflow": "hidden", "width": width, "position": "relative", "z-index": "45" });
		   var TableIDWid=tableHead.width();
			tableHead.width(TableIDWid-17);
	});
    tableColumn.css({ "overflow": "hidden", "height": height , "position": "relative", "z-index": "40", "background-color": "#e7f2ff" });
    tableData.css({ "overflow": "auto", "width": width, "height": height+17, "position": "relative", "z-index": "35" });
    if (tableHead.width() > $("table",tableFix).width()) {
        tableHead.css("width", $("table",tableFix).width()+2);
        tableData.css("width", $("table",tableFix).width() + 19);
    }
    if (tableColumn.height() > $("table",tableColumn).height()) {
        tableColumn.css("height", $("table",tableColumn).height()+2);
        tableData.css("height", $("table",tableColumn).height() + 19);
    }
    var fixHeight = tableFix.height();
    var headHeight = tableHead.height();
    var columnHeight = tableColumn.height();

    tableHead.css("top",-fixHeight+"px");
    tableColumn.css("top",-(fixHeight+headHeight)+"px");
    tableData.css("top",-(fixHeight+headHeight+columnHeight)+"px");
    */
}

//锁定表格，只锁定列
function FixTableColumn(TableID, FixColumnNumber, width) {
	var re = />\s+/g;
	var oldTable=$("#" + TableID);
	oldTable.html(oldTable.html().replace(re,">"));
	var height=oldTable.height()+17;
	var layOutTable=$("#" + TableID + "_tableLayout");
    if (layOutTable.length != 0) {
    	layOutTable.before($("#" + TableID));
    	layOutTable.empty();
    }
    else {
        $("#" + TableID).after("<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");
    }
    layOutTable=$("#" + TableID + "_tableLayout");
    $('<div id="' + TableID + '_tableColumn"></div>'
    + '<div id="' + TableID + '_tableData"></div>').appendTo("#" + TableID + "_tableLayout"); 
    var tableColumnClone = oldTable.clone(true);
    tableColumnClone.attr("id", TableID + "_tableColumnClone");
    $("#" + TableID + "_tableColumn").append(tableColumnClone);
    $("#" + TableID + "_tableData").append(oldTable);
    $("#" + TableID + "_tableLayout table").each(function () {
        $(this).css("margin", "0");
    });
    var ColumnsWidth = 0;
    var ColumnsNumber = 0;
    $("#" + TableID + "_tableColumn tr:first th:lt(" + FixColumnNumber + ")").each(function () {
    	var colspan = $(this).attr("colspan");
    	ColumnsNumber = parseInt(ColumnsNumber)
		if(!isNaN(colspan)){
			ColumnsNumber += parseInt(colspan);
		}
    	if(ColumnsNumber<=FixColumnNumber){
    		 ColumnsWidth += $(this).outerWidth(true);
    	}
    });
    ColumnsWidth += 2;
    if ($.browser.msie) {
        switch ($.browser.version) {
            case "7.0":
                if (ColumnsNumber >= 3) ColumnsWidth--;
                break;
            case "8.0":
                if (ColumnsNumber >= 2) ColumnsWidth--;
                break;
        }
    }
    $("#" + TableID + "_tableColumn").css("width", ColumnsWidth);
    $("#" + TableID + "_tableData").scroll(function () {
        $("#" + TableID + "_tableColumn").scrollTop($("#" + TableID + "_tableData").scrollTop());
    });
    $("#" + TableID + "_tableColumn").css({ "overflow": "hidden", "height": height - 17, "position": "relative", "z-index": "40", "background-color": "#e7f2ff" });
    $("#" + TableID + "_tableData").css({ "overflow-x": "auto","overflow-y": "hidden", "width": width, "height": height, "position": "relative", "z-index": "35" });
    if ($("#" + TableID + "_tableColumn").height() > $("#" + TableID + "_tableColumn table").height()) {
        $("#" + TableID + "_tableColumn").css("height", $("#" + TableID + "_tableColumn table").height()+2);
        $("#" + TableID + "_tableData").css("height", $("#" + TableID + "_tableColumn table").height() + 19);
    }
    var columnHeight = $("#" + TableID + "_tableColumn").height();

    $("#" + TableID + "_tableData").css("top",-(columnHeight)+"px");
}


//锁定表格，只锁定行
function FixTableRow(TableID,width, height) {
	if(height>$("#" + TableID).height()){
		height=$("#" + TableID).height();
	}
    if ($("#" + TableID + "_tableLayout").length != 0) {
        $("#" + TableID + "_tableLayout").before($("#" + TableID));
        $("#" + TableID + "_tableLayout").empty();
    }
    else {
        $("#" + TableID).after("<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");
    }
    $('<div id="' + TableID + '_tableHead"></div>'
    + '<div id="' + TableID + '_tableData"></div>').appendTo("#" + TableID + "_tableLayout");

	var re = />\s+/g;
	var oldTable=$("#" + TableID);
	oldTable.html(oldTable.html().replace(re,">"));	
 		
	$("#" + TableID + "_tableData").append(oldTable);
	
   	//组织表头部分开始
	var oldTablehtml = $("#" + TableID + "_tableData").html();
	var theadnum = oldTablehtml.indexOf("</thead>");
	if(theadnum==-1){
		theadnum = oldTablehtml.indexOf("</THEAD>");
	}
	var headhtml = oldTablehtml.substring(0,oldTablehtml.indexOf("</thead>"))+"</thead></body></table>";
    $("#" + TableID + "_tableHead").html(headhtml);
    //组织表头部分结束
    
    $("#" + TableID + "_tableLayout table").each(function () {
        $(this).css("margin", "0");
    });
    var HeadHeight = $("#" + TableID + "_tableHead thead").height();
    HeadHeight += 2;
    $("#" + TableID + "_tableHead").css("height", HeadHeight);
    var ColumnsWidth = 0;
    ColumnsWidth += 2;
   
    $("#" + TableID + "_tableColumn").css("width", ColumnsWidth);
    $("#" + TableID + "_tableData").scroll(function () {
        $("#" + TableID + "_tableHead").scrollLeft($("#" + TableID + "_tableData").scrollLeft());
    });
    $("#" + TableID + "_tableHead").css({ "overflow": "hidden", "width": width - 17, "position": "relative", "z-index": "45" });
    $("#" + TableID + "_tableData").css({ "overflow": "auto", "width": width, "height": height, "position": "relative", "z-index": "35" });

    var headHeight = $("#" + TableID + "_tableHead").height();

    $("#" + TableID + "_tableHead").css("top","0px");
    $("#" + TableID + "_tableData").css("top",-(headHeight)+"px");
}

//锁定表格适应浏览器变化
function resizeTable(TableID,width, height){
	if(height>$("#" + TableID).height()){
		height=$("#" + TableID).height();
	}
	$("#" + TableID + "_tableLayout").css({"width":width+"px","height":height+"px"});
	var tfixwidth = $("#" + TableID+ "_tableFix").width();
	var tfixheight = $("#" + TableID+ "_tableFix").height();
	var theadwidth = width-17;
	var tcolumnheight = height - 17;
	var tdatawidth = width;
	var tdataheight = height;
	var tfixtablewidth = $("#" + TableID + "_tableFix table").width();
	if (theadwidth > tfixtablewidth) {
	 	theadwidth = tfixtablewidth+2;
	 	tdatawidth = tfixtablewidth+19;
   	}
    var tcolumntableheight = $("#" + TableID + "_tableColumn table").height();
    if (tcolumnheight > tcolumntableheight) {
       tcolumnheight = tcolumntableheight+2;
       tdataheight = tcolumntableheight+19;
   	}
	$("#" + TableID + "_tableHead").css("width",theadwidth+2+"px");
	$("#" + TableID + "_tableColumn").css("height",tcolumnheight+"px");
	$("#" + TableID + "_tableData").css({"width":tdatawidth+"px","height":tdataheight+"px"});
	
    var theadHeight = $("#" + TableID + "_tableHead").height();

    $("#" + TableID + "_tableHead").css("top",-tfixheight+"px");
    $("#" + TableID + "_tableColumn").css("top",-(tfixheight+theadHeight)+"px");
    $("#" + TableID + "_tableData").css("top",-(tfixheight+theadHeight+tcolumnheight)+"px");
}
//表格全屏
function tableFullscreen(id,columnTD){
	    var width=$('#'+id).width();
	    var tableContent=$('#'+id).html();
	    if(arguments.length==2){
	      window.top.InterfaceObj.fullScreen(width,tableContent,columnTD);
	    }else if(arguments.length==1){
	    	window.top.InterfaceObj.fullScreen(width,tableContent,0);
	    }else{
	    	alert("传入参数有误");
	    	return;
	    }
	   
	  
}

//指定列排序
$.fn.formOrder=function(){
	var tableObject = $(this);//获取id为tableSort的table对象 
	var tbHead = tableObject.children('thead');//获取table对象下的thead 
	var tbHeadTh = tbHead.find('tr th');//获取thead下的tr下的th 
	var tbBody = tableObject.children('tbody');//获取table对象下的tbody 
	var tbBodyTr = tbBody.find('tr');//获取tbody下的tr 
	var sortIndex = -1; 
	tbHeadTh.each(function() {//遍历thead的tr下的th 
	   var thisIndex = tbHeadTh.index($(this));//获取th所在的列号 
	   $(this).mouseover(function(){ 
	       tbBodyTr.each(function(){//编列tbody下的tr 
	            var tds = $(this).find("td");//获取列号为参数index的td对象集合 
	        }); 
	   }).mouseout(function(){ 
	        tbBodyTr.each(function(){ 
	        var tds = $(this).find("td");      
	   }); 
	   }); 
	   $(this).click(function() { 
	       if($(this).attr("isOrder")=="true"){
	       var dataType = $(this).attr("type"); 
	       checkColumnValue(thisIndex, dataType); 
	    }
	   }); 
	}); 
	//$("tbody tr" ,tableObject).removeClass();//先移除tbody下tr的所有css类 
	//对表格排序 
	function checkColumnValue(index, type) { 
	var trsValue = new Array(); 
	tbBodyTr.each(function() { 
	        var tds = $(this).find('td'); 
	        trsValue.push(type + ".separator" + $(tds[index]).html() + ".separator" + $(this).html()); 
	        $(this).html(""); 
	}); 
	var len = trsValue.length; 
	if(index == sortIndex){ 
	      trsValue.reverse(); 
	} else { 
	    for(var i = 0; i < len; i++){ 
	     type = trsValue[i].split(".separator")[0]; 
	       for(var j = i + 1; j < len; j++){ 
	               value1 = trsValue[i].split(".separator")[1]; 
	               value2 = trsValue[j].split(".separator")[1]; 
	                if(type == "number"){ 
	                    value1 = value1 == "" ? 0 : value1; 
	                    value2 = value2 == "" ? 0 : value2; 
	                if(parseFloat(value1) > parseFloat(value2)){ 
	                     var temp = trsValue[j]; 
	                     trsValue[j] = trsValue[i]; 
	                     trsValue[i] = temp; 
	                   } 
	                } else { 
	                  if (value1>value2) {//该方法不兼容谷歌浏览器 
   	                 var temp = trsValue[j]; 
	                     trsValue[j] = trsValue[i]; 
	                     trsValue[i] = temp; 
	                   } 
	                } 
	         } 
	     } 
	} 
	for(var i = 0; i < len; i++){ 
	      $("tbody tr:eq(" + i + ")",tableObject).html(trsValue[i].split(".separator")[2]); 
	} 
	      sortIndex = index; 
	} 
	
}
