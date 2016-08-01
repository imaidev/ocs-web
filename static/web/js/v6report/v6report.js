(function($) {
    $.fn.v6report = function(options) {
    	var bodyData=options.tableBody.data;
    	var style=options.tableBody.style;
    	var widthArr=options.tableHead.widthArr;
    	var headData=options.tableHead.data;
    	options.tableBody.data="";
    	options.tableBody.style={};
    	options.tableHead.widthArr="";
    	options.tableHead.data="";
        var opts = $.extend(true,{},$.fn.v6report.defaults, options);
        opts.tableBody.data=bodyData;
        opts.tableBody.style=style;
        opts.tableHead.widthArr=widthArr;
        opts.tableHead.data=headData;
        var $this = $(this);
        var dataUrl=opts.tableBody.dataUrl;
        if(dataUrl&&$.type(dataUrl)=="string"){
        	$.ajax({
                url: opts.tableBody.dataUrl,
                beforeSend: function() {
                    reportShowLoading();
                },
                success: function(data) {
                	var bodyData="";
                	try{
                		bodyData=eval(data);
                	}catch(e){
                		alert("数据格式错误");
                	}
                    opts.tableBody.data = bodyData;
                    opts=v6reportInit(opts,$this);
					
                },
                complete: function() {
                	removeLoading();
    				
    			},
                error: function() {
    				//
    			}
            });
        }else{
        	var bodyData="";
        	try{
        		bodyData=eval(opts.tableBody.data);
        	}catch(e){
        		alert("数据格式错误");
        	}
        	
        	opts.tableBody.data = bodyData;
        	opts=v6reportInit(opts,$this);
        }
        
		return {
			getBodyData:function(colNum){
				var bodyData=opts.tableBody.data;
				var colData=[];
				if(colNum==undefined){
					colData=bodyData;
				}else{
					for(var i=0;i<bodyData.length;i++){
						colData.push(bodyData[i][colNum]);
					}
				}
				return colData;
			},
			getHeadData:function(){
				return opts.tableHead.data;
			}
		};
    };
    $.fn.v6report.defaults = {
        baseTdMultiple: 5,
        baseTdWidth: 20,
        tdheight: 30,
        titleHeight:20,
        reportInfo:{
        	title:"我的报表",
        	parms:""
        },
		container:{
		},
		tableBody:{
			style:{}
		},
		stepLoad:{
			open:true,
			lineNum:50
		},
        colHeadFixed: {
            fixed: false,
            number: 0
        },
		colHeadMerge:{
			merge:false,
			number:0 //[3,4,5]可以填类似的数组，用于指定列进行合并
		},
		scrollBar:{
			step:30
		},
		colSort:{
			changeCol:false,
			defaultSortCol:{}
		},
		drag:{
			enable:true //拖拽列宽开关
		},
		filter:{
			open:false,
			number:0,
			colFilter:-1,
			colFilterData:[]
		},
		edit:{
			open:false,
			hasInit:false,
			dependJs:{
				draggable:true,
				dropable:true,
				sortable:true
			}
		},
		graph:{
			open:false
		},
		btns:{
			saveAsExcel:true,
			fullScreen:true,
			filterData:true,
			editData:true,
			share2group:true,
			print:true,
			graph:true
		},
		//当数据量大时，报表插件自带的导出功能会有性能问题，这时需要对导出excel功能进行扩展开发，在Java里生成excel
		saveAsExcelExtend:{
			enable:false,
			url:"",
			formId:""
		},
		//记录当前滚动位置
		scrollPosition:{
			x:0,
			y:0
		}
    };
  var activeRowNum=-1;
	var v6reportInit=function(opts,$this){
		$(".v6report-title",$this).remove();
		$(".v6report-table-container",$this).remove();
		opts = configOpts(opts,$this);
		initDom(opts,$this);
		var beginLineNum=0;
		var endLineNum=opts.stepLoad.lineNum<opts.tableBody.dataSize?opts.stepLoad.lineNum:opts.tableBody.dataSize;
		loadBodyTr(beginLineNum,endLineNum,opts,$this);
		for(one in Events){
    		Events[one](opts,$this);
		}
		return opts;
	};
	function configOpts(opts,$this) {
		if(opts.btns.allClose){
			for(var one in opts.btns){
				opts.btns[one]=false;
			}
			opts.btns.allClose=true;
		}
		if (!opts.colHeadFixed.fixed) {
			opts.colHeadFixed.number = 0;
		}
		var headData = opts.tableHead.data;
		var headRowNum = headData.length;
		var headColNum = headData[0].length;
		var baseTdMultiple=opts.baseTdMultiple;
		opts.tableHead.rowNum = headRowNum;
		opts.tableHead.colNum = headColNum;
		var headWidthArr=opts.tableHead.widthArr;
		if (!headWidthArr) {
			headWidthArr = [];
			for (var i = 0; i < headColNum; i++) {
				headWidthArr.push(baseTdMultiple);
			}
			opts.tableHead.widthArr=headWidthArr;
		}
		var dimCloumn=opts.tableBody.dimCloumn;
		if(!dimCloumn){
			dimCloumn =[];
			var fixNum = opts.colHeadFixed.number;
			for (var i = 0; i < headColNum; i++) {
				if(i<fixNum){
					dimCloumn.push(0);
				}else{
					dimCloumn.push(1);
				}
			}
			opts.tableBody.dimCloumn=dimCloumn;
		}
		var canSort=opts.colSort.canSort;
		if(!canSort){
			canSort=[];
			for (var i = 0; i < headColNum; i++) {
				canSort.push(1);
			}
			opts.colSort.canSort=canSort;
		}
		//为表格头合并单元格准备参数
		for (var i = 0; i < headRowNum; i++) {
			for (var j = 0; j < headColNum; j++) {
				headData[i][j].width = (headWidthArr[j] * opts.baseTdWidth);
				headData[i][j].height = opts.tdheight;
				headData[i][j].colspan=1;
				headData[i][j].colNum=j;
				if (headData[i][j].disable) {
					continue;
				}
				var n = 1;
				while (headData[i][j + n] && headData[i][j].text == headData[i][j + n].text) {
					headData[i][j].colspan = n + 1;
					headData[i][j].width += (headWidthArr[j + n] * opts.baseTdWidth) ;
					headData[i][j + n].disable = true;
					n++;
				}
				var m = 1;
				while (headData[i + m] && headData[i][j].text == headData[i + m][j].text) {
					headData[i][j].rowspan = m + 1;
					headData[i][j].height +=opts.tdheight;
					headData[i + m][j].disable = true;
					m++;
				}
				var canSortArr=opts.colSort.canSort;
				if(headData[i][j].colspan<2&&opts.colHeadMerge.merge==false&&canSortArr[j]){
					headData[i][j].sortAble=true;
				}
			}
		}
		var tableWidth = 0;
		var baseTdWidth=opts.baseTdWidth;
		var widthArr=opts.tableHead.widthArr;
		var colFixedWidth=0;
		var tbodyWidth=0;
		for (var i = 0; i < headColNum; i++) {
			tableWidth += (widthArr[i] * baseTdWidth);
			if (i < opts.colHeadFixed.number) {
				colFixedWidth += (widthArr[i] * baseTdWidth);
			} else {
				tbodyWidth += (widthArr[i] * baseTdWidth);
			}
		}
		opts.tableWidth = tableWidth;
		opts.tableHead.colFixedWidth = colFixedWidth;
		opts.tableBody.colFixedWidth = colFixedWidth;
		opts.tableHead.width = tbodyWidth;
		opts.tableBody.width = tbodyWidth;
		
		var bodyTrSize=opts.tableBody.data.length;
		opts.tableBody.dataSize=bodyTrSize;
		var theadHeight = headRowNum * opts.tdheight;
		var tbodyHeight= bodyTrSize * opts.tdheight;
		opts.tableHead.height = theadHeight;
		opts.tableBody.height = tbodyHeight;
		opts.scrollBar.height=tbodyHeight;
		var tableHeight = theadHeight + tbodyHeight;
		opts.tableHeight=tableHeight;
		
		if (!opts.colHeadFixed.number) {
			opts.colHeadFixed.fixed = false;
			opts.colHeadFixed.number = 0;
		}
		
		var viewWidth=$this.width();
		opts.viewWidth = viewWidth > tableWidth ? tableWidth: viewWidth;
		
		var viewHeight=$this.height();
		opts.viewHeight = viewHeight < 40 || viewHeight> tableHeight ? tableHeight : viewHeight;

		var theadViewWidth = 0;
		var tbodyViewWidth = 0;
		var viewWidth=opts.viewWidth;
		var viewHeight=opts.viewHeight;
		opts.container.width=viewWidth;
		opts.container.height=viewHeight;
		if (tableHeight > viewHeight) {
			theadViewWidth = viewWidth - colFixedWidth;
			tbodyViewWidth = viewWidth - colFixedWidth;
			opts.container.width+=17;
			opts.scrollBar.show=true;
		} else {
			opts.scrollBar.show=false;
			theadViewWidth = viewWidth - colFixedWidth;
			tbodyViewWidth = viewWidth - colFixedWidth;
		}
		opts.tableHead.viewWidth = theadViewWidth;
		opts.tableBody.viewWidth = tbodyViewWidth;
		var colHeadViewHeight = 0;
		var scrollBarViewHeight=0;
		var tbodyViewHeight = 0;
		if (tableWidth > viewWidth) {
			colHeadViewHeight = viewHeight - theadHeight;
			scrollBarViewHeight =viewHeight - theadHeight;
			tbodyViewHeight =viewHeight - theadHeight + 17;
			opts.container.height+=17;
		} else {
			colHeadViewHeight = viewHeight - theadHeight;
			scrollBarViewHeight =viewHeight - theadHeight;
			tbodyViewHeight =viewHeight - theadHeight;
		}
		opts.scrollBar.viewHeight=scrollBarViewHeight;
		opts.tableBody.colHeadViewHeight = colHeadViewHeight;
		opts.tableBody.viewHeight = tbodyViewHeight;
		
		opts.stepLoad.lineNum=Math.round(tbodyViewHeight/opts.tdheight)+20;
		var colSort=opts.colSort;
		var sortBy=opts.colSort.sortBy;
		if(colSort.defaultSortCol&&colSort.defaultSortCol.colNum){
			opts=bodyDataSort(opts,colSort.defaultSortCol.colNum,sortBy);
		}
		
		if(opts.btns.editData){
			if(!opts.edit.hasInit && opts.colHeadFixed.number==0){
				opts.btns.editData = false;
				opts.edit.open = false;
			}else if(opts.edit.open && !opts.edit.dimAttrDetail){
				//为数据分析准备数据
				opts.edit.dimAttrDetail = getDimAttrDetail(opts);
			}
		}
		
		if(opts.btns.filterData){
			if(opts.filter.number==0 || opts.edit.open ){
				if(opts.colHeadFixed.number==0){
					opts.btns.filterData=false;
					opts.filter.open = false;
				}else{
					opts.filter.number=opts.colHeadFixed.number
				}
			}
			if(opts.filter.open){
				if(!opts.filter.filterDataJson || opts.edit.open){
					var bodyData=opts.tableBody.editdata;
					var number=opts.filter.number;
	
					opts.filter.filterDataJson = new Array(number);
					var filterStrArr = new Array(number);
					for(var i=0;i<number;i++){
						filterStrArr[i] = ",";
					}
					for(var i=0;i<bodyData.length;i++){
						for(var j=0;j<number;j++){	
							if(filterStrArr[j].indexOf(","+bodyData[i][j].value+",")==-1){
								filterStrArr[j] += bodyData[i][j].value+",";
							}
						}
					}
					for(var i=0;i<filterStrArr.length;i++){
						if(filterStrArr[i].length>1){
							filterStrArr[i] = filterStrArr[i].slice(1,filterStrArr[i].length-1);
							opts.filter.filterDataJson[i] = filterStrArr[i].split(",");
						}
					}					
				}
			}
		}else{
			opts.filter.open=false;
		}

		return opts;
	}
	function initDom(opts,container) {

		if(opts.edit.open && !opts.edit.hasInit){
			var edit=$("<div id='v6report-edit-container'></div>");
			var searchContainer = $("<div id='search-container'></div>");
			var xAxisDim = $("<div class='dim-continer' id='XAxisDim'></div>")
				.html("<div class='title'>表头：</div><span id='XAxisDimDesc'>拖动上方蓝色方框到此</span>")
			var yAxisDim = $("<div class='dim-continer' id='YAxisDim'></div>")
				.html("<div class='title'>行头：</div><span id='YAxisDimDesc'>拖动上方蓝色方框到此</span>")			
				
			var editList = $("<div id=\"edit-list\" class='pop-list'></div>");
			var editContainer = $("<div id=\"edit-checkbox-container\" class='pop-checkbox-container' ></div>")
				.append($("<div id=\"edit-title\" class='pop-title'></div>").text("指标列表"))
				.append(editList)
				.append($("<div id=\"edit-des\" class='pop-des'></div>").html("*&nbsp;&nbsp;请选指标!").css("display","block"));
		
			var editBtnContainer = $("<div class='buttonRightContainer'></div>")
				.append("<input type=\"button\" id=\"edit-btn-sure\" class=\"dataConButton\" value=\"确定\">")
				.append("<input type=\"button\" id=\"edit-btn-cancel\" class=\"dataConButton\" value=\"取消\">")
				.appendTo(editContainer);
				
			edit.append(searchContainer)
				.append(xAxisDim)
				.append(yAxisDim)
				.append(Dim(opts,searchContainer))
				.append(editContainer);

			var measureIdStr = opts.edit.measureIdStr;
			var measureNameStr = opts.edit.measureNameStr;
			var editUl = $("<ul></ul>").attr("id","editUl");
			if(measureIdStr!=''){
				var measureIdArr = measureIdStr.split(",");			
				var measureNameArr = measureNameStr.split(",");
				for(var i=0;i<measureIdArr.length;i++){
					editUl.append($("<li></li>").html("<input type='checkbox' name='measure-dim' value='"+measureIdArr[i]+"' text='"+measureNameArr[i]+"' >"+measureNameArr[i]));
				}					
				editList.append(editUl);
			}
			
			edit.appendTo(container);
		}else if(!opts.edit.open){
			$("#v6report-edit-container").remove();
		}
		var title=$("<div class='v6report-title'></div>")
		.width(opts.container.width)
		.height(opts.titleHeight);
		if(opts.btns.fullScreen){
			title.append($("<div class='v6report-btns icon-expand full-screen-btn' title='全屏查看'></div>"))
		}
		if(opts.btns.saveAsExcel){
			title.append($("<div class='v6report-btns icon-file-excel save-excel-btn' title='导出EXCEL'></div>"))
		}
		if(opts.btns.editData){
			if(opts.edit.open){
				title.append($("<div class='v6report-btns icon-compose edit-table-btn active' title='取消分析'></div>"))
			}else{
				title.append($("<div class='v6report-btns icon-compose edit-table-btn' title='分析数据'></div>"))					
			}
		}
		if(opts.btns.filterData){
			if(opts.filter.open){
				title.append($("<div class='v6report-btns icon-filter filter-table-btn active' title='取消筛选'></div>"))
			}else{
				title.append($("<div class='v6report-btns icon-filter filter-table-btn' title='筛选'></div>"))					
			}
		}
		if(opts.btns.share2group){
			title.append($("<div class='v6report-btns icon-share share-group-btn' title='分享到我的团队'></div>"))
		}
		if(opts.btns.print){
			title.append($("<div class='v6report-btns icon-printer report-print' title='打印报表'></div>"))
		}
		if(opts.btns.graph){
			if(opts.graph.open){
				title.append($("<div class='v6report-btns icon-bars gene-graph active' title='取消图形'></div>"));
				try{
					highchartsInit;
				}catch(e){
					$.ajax({
						  url: "/skin/js/highcharts.js",
						  async:false,
						  dataType: "script"
					});
				}
				try{
					highchartsExportingInit;
				}catch(e){
					$.ajax({
						  url: "/skin/js/modules/exporting.js",
						  async:false,
						  dataType: "script"
					});
				}
				
			}else{
				title.append($("<div class='v6report-btns icon-bars gene-graph' title='生成图形'></div>"))
			}
		}
		if(opts.reportInfo.parms!==undefined){
			title.append($("<div class='report-table-descriptor' >"+opts.reportInfo.parms+"</div>"))
		}
		if(opts.reportInfo.info!==undefined){
			title.append($("<div class='report-table-info' title='"+opts.reportInfo.info+"'>"+opts.reportInfo.info+"</div>"))
		}
		title.appendTo(container);
		
	
		var tableContainer = $("<div class='v6report-table-container'></div>")
		.width(opts.container.width)
		.height(opts.container.height)
		.append(HeadBlock(opts,container))
		.append(THead(opts,container))
		.append(ScollBar(opts,container))
		.append(Body(opts,container))
		.appendTo(container);

		if(opts.btns.filterData && opts.filter.open){
			var filterContainer = $("<div id=\"filter-checkbox-container\" class='pop-checkbox-container'></div>")
			.append($("<div id=\"filter-title\" class='pop-title'></div>").text("筛选内容"))	
			.append($("<div id=\"filter-list\" class='pop-list'></div>"))
			.append($("<div id=\"filter-des\" class='pop-des'></div>").html("*&nbsp;&nbsp;请选择筛选内容!"));

			var filterBtnContainer = $("<div class='buttonRightContainer'></div>")
				.append("<input type=\"button\" id=\"filter-btn-sure\" class=\"dataConButton\" value=\"确定\">")
				.append("<input type=\"button\" id=\"filter-btn-cancel\" class=\"dataConButton\" value=\"取消\">")
				.appendTo(filterContainer);
				
			filterContainer.appendTo(tableContainer);
		}
		
		//创建一个用来标识拖拽位置的div
		if(opts.drag.enable){
			var	dragPosition = $("<div class='v6report-drag-position'></div>");
			dragPosition.appendTo(tableContainer);
		}
		
	}
	var HeadBlock = function(opts,container) {
		var box = $("<div class='v6report-headblock'></div>")
			.width(opts.tableHead.colFixedWidth)
			.height(opts.tableHead.height);
		var colFiexed = opts.colHeadFixed.fixed;
		var colFiexedNum = opts.colHeadFixed.number;
		var colnum = opts.tableHead.colNum;
		var headData = opts.tableHead.data;
		var widthArr=opts.tableHead.widthArr;
		var table = $("<table class='v6report-thead' cellpadding='0' cellspacing='0'></table>")
		.width(opts.tableHead.colFixedWidth);
		var fixTr=$("<tr></tr>").height(0);
		for(var i=0;i<colFiexedNum;i++){
			$("<td></td>").width(widthArr[i]*opts.baseTdWidth)
			.appendTo(fixTr);
		}
		table.append(fixTr);
		for (var i = 0; i < headData.length; i++) {
			var tr=$("<tr></tr>").height(opts.tdheight);
			for (var j = 0; j < colFiexedNum; j++) {
				var tddata=headData[i][j];
				if (tddata.disable) {
					continue;
				} else {
					var td = $("<td class='v6report-td' index="+j+"></td>");
					tddata.rowspan=tddata.rowspan?tddata.rowspan:"1";
					tddata.colspan=tddata.colspan?tddata.colspan:"1";
					td.css("line-height", tddata.height + "px")
					.width(tddata.width)
					.height(tddata.height)
					.attr("rowspan",tddata.rowspan)
					.attr("colspan",tddata.colspan);
					tr.append(td);
					var sortBy="";
					if("sortBy" in tddata){
						sortBy=tddata["sortBy"];
					}else{
						sortBy=j;
					}
					if(tddata.sortAble){
						td.addClass("sortable")
						.append($("<a href='#' colNum='"+j+"' sortBy='"+sortBy+"'></a>").text(tddata.text))					
					}else{
						td.text(tddata.text)
					}
					if(opts.filter.open && j<opts.filter.number){
						var filterTd = $("<div></div>")
							.addClass("filter-table-td")
							.height(tddata.height)
							.attr("colNum",j)
							.appendTo(td);
						var colFilterArr = opts.filter.colFilterData;
						if(colFilterArr){
							for(var k=0;k<colFilterArr.length;k++){
								if(colFilterArr[k][0] == j){
									filterTd.addClass("active")
										.css("background-position-y","center");	
								}
							}
						}
					}
					if(!opts.filter.open&&"extendEvent" in tddata){
						var imgSrc=tddata.extendEvent.img;
						if(!imgSrc){
							imgSrc="";
						}
						var parm=tddata.extendEvent.parm;
						var clickFunc=tddata.extendEvent.clickFunc;
						var $img=$("<img />").width(16).height(16)
						.attr("src",imgSrc)
						.addClass("extendBtn")
						.bind("error",function(){
							$(this).attr("src","/skin/skin2/v6report/icon.gif")
						}).bind("click",{parm:parm},clickFunc)
						.appendTo(td);
					}
					if(opts.drag.enable&&tddata.colspan=="1"){
						var scrollSpan = $("<div class='v6report-drag'></div>");
						td.append(scrollSpan);
					}	
				}					
			}
			table.append(tr);
		}
		return box.append(table);
   }
	var THead = function(opts,container) {
		var colFiexed = opts.colHeadFixed.fixed;
		var colFiexedNum = opts.colHeadFixed.number;
		var colnum = opts.tableHead.colNum;
		var headData = opts.tableHead.data;
		var widthArr=opts.tableHead.widthArr;
		var view = $("<div class='v6report-thead-view'></div>")
		.width(opts.tableHead.viewWidth);
		var table = $("<table class='v6report-thead' cellpadding='0' cellspacing='0'></table>")
		.width(opts.tableHead.width);
		var beginCol = 0;
		if (colFiexed) {
			beginCol = colFiexedNum;
		}
		var fixTr=$("<tr></tr>").height(0);
		for(var i=beginCol;i<widthArr.length;i++){
			$("<td></td>").width(widthArr[i]*opts.baseTdWidth)
			.appendTo(fixTr);
		}
		table.append(fixTr);
		for (var i = 0; i < headData.length; i++) {
			var tr=$("<tr></tr>").height(opts.tdheight);;
			for (var j = beginCol; j < colnum; j++) {
				var tddata=headData[i][j];
				if (tddata.disable) {
					continue;
				} else {
					var td = $("<td class='v6report-td' index="+j+"></td>");
					tddata.rowspan=tddata.rowspan?tddata.rowspan:"1";
					tddata.colspan=tddata.colspan?tddata.colspan:"1";
					td.width(tddata.width)
					.height(tddata.height)
					.css("line-height", tddata.height + "px")
					.attr("rowspan",tddata.rowspan)
					.attr("colspan",tddata.colspan);
					tr.append(td);
					if("sortBy" in tddata){
						sortBy=tddata["sortBy"];
					}else{
						sortBy=j;
					}
					if(tddata.sortAble){
						td.addClass("sortable")
						td.append($("<a href='#' colNum='"+j+"' sortBy='"+sortBy+"'></a>").text(tddata.text))		
					}else{
						td.text(tddata.text)
					}
					if(opts.filter.open && j<opts.filter.number){
						var filterTd = $("<div></div>")
							.addClass("filter-table-td")
							.height(tddata.height)
							.attr("colNum",j)
							.appendTo(td);
						var colFilterArr = opts.filter.colFilterData;
						if(colFilterArr){
							for(var k=0;k<colFilterArr.length;k++){
								if(colFilterArr[k][0] == j){
									filterTd.addClass("active")
										.css("background-position-y","center");	
								}
							}
						}
					}
					if("extendEvent" in tddata&&!opts.filter.open&&!opts.graph.open){
						var imgSrc=tddata.extendEvent.img;
						if(!imgSrc){
							imgSrc="";
						}
						var parm=tddata.extendEvent.parm;
						var clickFunc=tddata.extendEvent.clickFunc;
						var $img=$("<img />").width(16).height(16)
						.attr("src",imgSrc)
						.addClass("extendBtn")
						.bind("error",function(){
							$(this).attr("src","/skin/skin2/v6report/icon.gif")
						}).bind("click",{parm:parm},clickFunc)
						.appendTo(td);
					}
					
					if(opts.graph.open){
						if(!tddata.colspan||tddata.colspan==1){
							var imgSrc="/skin/skin2/v6report/icon.gif";
							var $img=$("<img />").width(16).height(16)
							.attr("src",imgSrc)
							.addClass("extendBtn")
							.bind("click",{opts:opts,box:container,colnum:j,type:'column'},graphFactory)
							.appendTo(td);
						}
						
					}
					
					
					if(opts.drag.enable&&tddata.colspan=="1"){
						var scrollSpan = $("<div class='v6report-drag'></div>");
					  td.append(scrollSpan);
					}	
				}
			}
			table.append(tr);
		}

		return view.append(table);
	}

	var Body=function(opts){
		var colFiexed=opts.colHeadFixed.fixed;
		var colFiexedNum=opts.colHeadFixed.number;
		var rowNumber=0;
		var dataUrl=opts.tableBody.dataUrl;
		var tdWidth=opts.tdWidth;
		var box=$("<div class='v6report-table-body'></div>")
		.width(opts.viewWidth)
		.height(opts.tableBody.viewHeight);
		var colHeadView;
		var colHead;
		if(colFiexed){
			colHeadView=$("<div class='v6report-colhead-view'></div>")
			.width(opts.tableBody.colFixedWidth)
			.height(opts.tableBody.colHeadViewHeight);
			colHead=$("<div class='v6report-cloumhead'></div>")
			.width(opts.tableBody.colFixedWidth)
			.height(opts.tableBody.height)
			box.append(colHeadView.append(colHead));
		}
		var tbodyView=$("<div class='v6report-tbody-view'></div>")
		.width(opts.tableBody.viewWidth)
		.height(opts.tableBody.viewHeight);
		var tbody=$("<div class='v6report-tbody'></div>")
		.width(opts.tableBody.width)
		.height(opts.tableBody.height)
		box.append(tbodyView.append(tbody));
		return box;
	}
	var ScollBar=function(opts){
		var sbc=$("<div></div>");
		if(opts.scrollBar.show){
			sbc.addClass("scollBarContainer")
			.append(
				$("<div class='scollBar'></div>").height(opts.scrollBar.height)
			).height(opts.scrollBar.viewHeight)
			.css("top",opts.tableHead.height);
		}
		
		return sbc;
	}
	
	var Dim = function(opts,container){
		var dimCloumn = opts.tableBody.dimCloumn;
		if(null!=dimCloumn && dimCloumn!="" && typeof(dimCloumn)!='undefined'){
			var theaddata = opts.tableHead.data;
			var measureIds="";
			var measureNames="";
			var dimAttrDetail = opts.edit.dimAttrDetail;
			for(var i=0;i<dimCloumn.length;i++){
				if(dimCloumn[i] == '0'){//维度
					var name = "";
					for(var j=0;j<theaddata.length;j++){
						if(name.indexOf(theaddata[j][i].text)==-1){
							name += " "+theaddata[j][i].text;	
						}
					}
					//var dimIdValue = getDimValues(i,opts);
					var dimIdValue = "";
					var dimIdAttr = dimAttrDetail[i];
					for(var j=0;j<dimIdAttr.length;j++){
						dimIdValue += dimIdAttr[j][0];
						if(j<dimIdAttr.length-1){
							dimIdValue += ",";
						}
					}
					
					$(container).addSearch({
						id:"D"+i,
						name:name,
						type:"0",
						colNum:i,
						dimIdValue:dimIdValue,
						dimNameValue:dimIdValue
					});
				}else{//指标
					var name = "";
					for(var j=0;j<theaddata.length;j++){
						name += " "+theaddata[j][i].text;			
					}
					measureIds += i +",";
					measureNames += name+",";					
				}			
			}
			if(measureIds.length>0){
				measureIds = measureIds.slice(0,measureIds.length-1);
				measureNames = measureNames.slice(0,measureNames.length-1);
				opts.edit.measureIdStr = measureIds;
				opts.edit.measureNameStr = measureNames;
			}
			
			//添加指标
			$(container).addSearch({
				id:"MEASURE",
				name:"指标",
				type:"1",
				dimIdValue:measureIds,
				dimNameValue:measureNames
			});
					
			var clearObj = $("<div></div>").css("clear","both");
			clearObj.appendTo(container);
		}
	}
	function loadBodyTr(benginLineNum,endLineNum,opts,container){
		var bodyData=opts.tableBody.data;
		var colFiexed=opts.colHeadFixed.fixed;
		var colFiexedNum=opts.colHeadFixed.number;
		var tdWidth=opts.baseTdWidth;
		var tdHeight=opts.tdheight;
		
		var trsize=opts.tableBody.dataSize;
		var widthArr=opts.tableHead.widthArr;
		var colMerge=opts.colHeadMerge.merge;
		var colMergeNum=opts.colHeadMerge.number;
		var headStr="";
		var bodyStr="";
		var headMergeStr="";
		var bodyMergeStr="";
		for(var i=benginLineNum; i<endLineNum;i++){
			var length=bodyData[i].length;
			for(var j=0;j<length;j++){
				bodyData[i][j].disable=false;
			}
		}
		for(var i=benginLineNum;i<endLineNum;i++){
			var styleStr="style='top:"+i*tdHeight+"px'";
			var active="";
			if(i==activeRowNum){
				active="active";
			}
			if(i%2==1){
				headStr+="<div class='v6report-tr szline' "+styleStr+">";
				bodyStr+="<div class='v6report-tr szline "+active+"' "+styleStr+" rowNum='"+i+"'>";
			}else{
				headStr+="<div class='v6report-tr' "+styleStr+">";
				bodyStr+="<div class='v6report-tr "+active+"' "+styleStr+" rowNum='"+i+"'>";
			}
			var tdsize=bodyData[i].length;
			for(var j=0;j<tdsize;j++){
				bodyData[i][j].colspan=1;
				bodyData[i][j].rowspan=1;
				if(colMerge){
					if(Object.prototype.toString.apply(colMergeNum) === '[object Array]'){
						if(colMergeNum.in_array(j)){
							var n = 1;
							//如果单元格和下侧单元格内容相同则合并
							while (bodyData[i][j]&&bodyData[i + n]&&bodyData[i][j].value == bodyData[i + n][j].value) {
								if(bodyData[i][j].disable){
									break;
								}
								if(i+n>=endLineNum){
									break; 
								}
								bodyData[i][j].rowspan = n + 1;
								bodyData[i + n][j].disable = true;
								n++;
							}
							var m = 1;	
							//如果单元格和右侧内容相同则合并
							while (bodyData[i][j]&&bodyData[i][j+m]&&bodyData[i][j].value == bodyData[i][j+m].value&&(j+m) in colMergeNum) {
								if(bodyData[i][j].disable){
									break;
								}
								bodyData[i][j].colspan = m + 1;
								bodyData[i][j+m].disable = true;
								m++;
							}
						}
					}else{
						if(j<colMergeNum){
							var n = 1;
							//如果单元格和下侧单元格内容相同则合并
							while (bodyData[i][j]&&bodyData[i + n]&&bodyData[i][j].value == bodyData[i + n][j].value) {
								if(bodyData[i][j].disable){
									break;
								}
								if(i+n>=endLineNum){
									break; 
								}
								bodyData[i][j].rowspan = n + 1;
								bodyData[i + n][j].disable = true;
								n++;
							}
							var m = 1;	
							//如果单元格和右侧内容相同则合并
							while (bodyData[i][j]&& bodyData[i][j+m]&&bodyData[i][j].value == bodyData[i][j+m].value&&(j+m)<colMergeNum) {
								if(bodyData[i][j].disable){
									break;
								}
								bodyData[i][j].colspan = m + 1;
								bodyData[i][j+m].disable = true;
								m++;
							}	
						}
					}
					
				}
				var mergeClassStr="";
				var mergeStyle="";
				var tddata=bodyData[i][j];
				var classStr="v6report-td";
				var styleStr="width:"+widthArr[j]*tdWidth+"px";
				if(colMerge){
					mergeClassStr="v6report-merge-td w"+(widthArr[j]*tdWidth*tddata.colspan);
					mergeStyle="height:"+tddata.rowspan*tdHeight+"px;";
					mergeStyle+="line-height:"+tddata.rowspan*tdHeight+"px;";
					mergeStyle+="width:"+(widthArr[j]*tdWidth*tddata.colspan)+"px;";
					mergeStyle+="top:"+i*tdHeight+"px;";
					mergeStyle+="text-align:center;";
					if(Object.prototype.toString.apply(colMergeNum) === '[object Array]'){
						if(colMergeNum.in_array(j)){
							var left=0;
							var t=j<colFiexedNum?0:colFiexedNum;
							for(t;t<j;t++){
								left+=(widthArr[t]*opts.baseTdWidth);
							}
							mergeStyle+="left:"+left+"px;";
						}
					}else{
						if(j<colMergeNum){
							var left=0;
							var t=j<colFiexedNum?0:colFiexedNum;
							for(t;t<j;t++){
								left+=(widthArr[t]*opts.baseTdWidth);
							}
							mergeStyle+="left:"+left+"px;";
						}
					}
				}
				var bodyStyle=opts.tableBody.style;
				var contentClass="content ";
				if(bodyStyle&&bodyStyle.textAlign){
					var textAlign=bodyStyle.textAlign;
					if(textAlign[j]=="left"){
						contentClass+="v6report-textalign-left ";
					}else if(textAlign[j]=="right"){
						contentClass+="v6report-textalign-right ";
					}else{
						contentClass+="v6report-textalign-center ";
					}
				}
				
				var titleStr="";
				if(tddata.value===""){
					tddata.value="&nbsp;";
				}else if(tddata.value.toString().indexOf("<")==-1){
					titleStr="title='"+tddata.value+"'";
				}
				//根据body参数，给单元格设置样式
				if("backgroundColor" in tddata){
					styleStr += ";background-color:"+tddata.backgroundColor;
				};
				var tdContentStyle="";//td中内容的样式
				if("color" in tddata){
					tdContentStyle+="color:"+tddata.color;
				};
				if(colFiexed&&j<colFiexedNum){
					headStr+="<div class='"+classStr+"' style='"+styleStr+"'>";
					//根据body参数给每个单元格添加事件
					if(!tddata.events){
						headStr+="<div "+titleStr+" class='"+contentClass+"' style='"+tdContentStyle+"'>"+tddata.value+"</div>";
					}else{
						if(tddata.events.click){
							headStr+="<a href='#' onClick='"+tddata.events.click+"' "+titleStr+" class='"+contentClass+"' style='"+tdContentStyle+"'>"
							+tddata.value+"</a>";
						}else{
							headStr+="<a href='#' "+titleStr+" class='"+contentClass+"' style='"+tdContentStyle+"'>"
							+tddata.value+"</a>";
						}
					}
					headStr+="</div>";
					if((tddata.rowspan>1||tddata.colspan>1)&&	tddata.disable!=true){
						headMergeStr+="<div class='"+mergeClassStr+"' style='"+mergeStyle+"'>"+tddata.value+"</div>"
					}
				}else{
					bodyStr+="<div class='"+classStr+"' style='"+styleStr+"'>";
					if(!tddata.events){
						bodyStr+="<div "+titleStr+" class='"+contentClass+"' style='"+tdContentStyle+"'>"+tddata.value+"</div>";
					}else{
						if(tddata.events.click){
							bodyStr+="<a href='#' onClick='"+tddata.events.click+"' "+titleStr+" class='"+contentClass+"' style='"+tdContentStyle+"'>"
							+tddata.value+"</a>";
						}else{
							bodyStr+="<a href='#' "+titleStr+" class='"+contentClass+"' style='"+tdContentStyle+"'>"
							+tddata.value+"</a>";
						}
					}
					bodyStr+="</div>";
					if((tddata.rowspan>1||tddata.colspan>1)&&tddata.disable!=true){
						bodyMergeStr+="<div class='"+mergeClassStr+"' style='"+mergeStyle+"'>"+tddata.value+"</div>"
					}
				}
			}
			headStr+="</div>";
			bodyStr+="</div>";
		}
		
		
		if(colFiexed){
			var colHead=$(".v6report-cloumhead",container);
			colHead.html(headMergeStr+headStr);
		}
		var tbody=$(".v6report-tbody",container);
		tbody.html(bodyMergeStr+bodyStr);
		}
	
	var Events={
		  //表格头部拖拽
		headDrag:function(opts,box){
			if(opts.drag.enable){
				var widthArr=opts.tableHead.widthArr;
				var dragDiv = '';   //当前拖拽的div
				var dragTd = '';    //当前改变宽度的td
				var beginWidth=0;   //拖拽前left位置
				var moveWidth=0;    
				var endWidth=0;     //拖拽完成时left位置
				var dragWidth=0;    //拖拽的宽度
				var tdWidth = 0;    //td原来的宽度
				var ifDrag=false;
				var dragIndxe = 0 ;
				var dragPosition = $(".v6report-drag-position",box);//用来判断当前拖拽到的位置的div
				var dragLeftWidth = 0;
				var $boxContainer = $(".v6report-table-container",box);
				var containerLeftWidth =$boxContainer.offset().left;
				var forMoveWidth = 0;
				$boxContainer.bind('mousedown',function(e){					
					dragDiv = (e||window.event).target;
					if(dragDiv.className.toLowerCase()=="v6report-drag"){
						ifDrag=true;
					    dragPosition.show();	
						dragTd = $(dragDiv).closest("td");
						$(".v6report-thead tr td", box).index(dragTd);
						dragIndxe = dragTd.attr("index");
						tdWidth = dragTd.width();				
						beginWidth = (e||window.event).clientX;
					  $(box).css("cursor","w-resize");
					};
				});
				$boxContainer.bind('mousemove',function(e){
					if(ifDrag){
						moveWidth = (e||window.event).clientX;
						forMoveWidth=moveWidth-containerLeftWidth;
						dragPosition.css("margin-left",Math.floor(forMoveWidth>0?forMoveWidth:0)+"px")	;
					};
						
				});
				$boxContainer.bind('mouseup',function(e){
					dragPosition.hide();
					if(ifDrag){
					  endWidth = (e||window.event).clientX;
					  dragWidth = Math.floor(endWidth-beginWidth);
					  tdWidth = tdWidth+dragWidth;
					  if(tdWidth>0){
						  var mathWidth = Math.floor(tdWidth/20);
						  if(mathWidth==0){
							  opts.tableHead.widthArr[dragIndxe]=1;
						  }else if(mathWidth>35){                     
							  opts.tableHead.widthArr[dragIndxe]=35;//一列所能拖拽的最宽宽度为35×20，当分辨率较低时，太宽了会影响页面布局，暂不考虑
						  }else{
							  opts.tableHead.widthArr[dragIndxe]=mathWidth
						  }
					  }
					  $(box).css("cursor","auto");
					  v6reportInit(opts,box);
					}	
				});
			}
		},
		//初始化滚动条位置
		initScrollPosition:function(opts,box){
				var $this=$(this);
				$(".v6report-tbody-view",box).scrollLeft(opts.scrollPosition.x);
				$(".v6report-thead-view",box).scrollLeft(opts.scrollPosition.x);
				$(".v6report-colhead-view",box).scrollTop(opts.scrollPosition.y);
				$(".scollBarContainer",box).scrollTop(opts.scrollPosition.y);
			},
		fixhead:function(opts,box){
			$(".v6report-tbody-view",box).scroll(function(){
				var $this=$(this);
				$(".v6report-thead-view",box).scrollLeft($this.scrollLeft());
				$(".v6report-colhead-view",box).scrollTop($this.scrollTop());
				opts.scrollPosition.x=$this.scrollLeft();
				opts.scrollPosition.y=$this.scrollTop();
			})
		},
		stepload:function(opts,box){
			var t;
			var tbodyView=$(".v6report-tbody-view",box);
			$(".scollBarContainer",box).scroll(function(){
				var $this=$(this);
				tbodyView.scrollTop($this.scrollTop());
				clearTimeout(t);
				t=setTimeout(function(){
					var benginLineNum=Math.round($this.scrollTop()/30);
					if(benginLineNum>10){
						benginLineNum-=10;
					}else{
						benginLineNum=0;
					}
					var allLineNum=opts.tableBody.dataSize;
					var stepLineNum=opts.stepLoad.lineNum;
					var endLineNum=benginLineNum+stepLineNum>allLineNum?allLineNum:benginLineNum+stepLineNum;
					if(endLineNum==allLineNum){
						benginLineNum=allLineNum-stepLineNum<0?0:allLineNum-stepLineNum;
					}
					loadBodyTr(benginLineNum,endLineNum,opts,box)
				},100)
				
			})
			var index=0;
		},
		mouseWhell:function(opts,box){
			box.mousewheel(function(event,delta){
				var scrollBar=$(".scollBarContainer",box);
				var top=scrollBar.scrollTop();
				if(delta<0){
					top=top+opts.scrollBar.step
				}else{
					top=top-opts.scrollBar.step
				}
				scrollBar.scrollTop(top);
				if(opts.scrollBar.show){
					return false;
				}
				
			})
		},
		saveAsExcel:function(opts,box){
			$(".save-excel-btn",box).click(function(){
				reportSaveAsExcel(opts,box);
			})
		},
		fullScreen:function(opts,box){
			$(".full-screen-btn",box).click(function(){
				fullScreen(opts,box);
			})
		},
		reportPrint:function(opts,box){
			$(".report-print",box).click(function(){
				reportPrint(opts,box);
			})
		},
		geneGraph:function(opts,box){
			$(".gene-graph",box).click(function(){
				geneGraph(opts,box,$(this));
			})
		},
		sortAble:function(opts,box){
			$(".v6report-td.sortable a",box).click(function(){
					var $this=$(this);
					var colNum=$this.attr("colNum");
					var sortBy=$this.attr("sortBy");
					$this.toggleClass("desc");
					if(!opts.colSort.defaultSortCol){
						opts.colSort.defaultSortCol={};
					}else{
						if(colNum!=opts.colSort.defaultSortCol.colNum){
							opts.colSort.changeCol=true;
						}else{
							opts.colSort.changeCol=false;
						}
					}
					opts.colSort.defaultSortCol.colNum=colNum;
					opts.colSort.sortBy=sortBy;
					v6reportInit(opts,box);
			});
		},
		filterBtn:function(opts,box){
			$(".filter-table-btn",box).click(function(){
				if($(this).hasClass("active")){
					opts.filter.open=false;
					opts.filter.colFilter = -1;
					opts.filter.colFilterData = [];
					opts.tableBody.data=opts.tableBody.editdata;
				}else{
					opts.filter.open=true;					
					if(!opts.tableBody.editdata){
						opts.tableBody.editdata=opts.tableBody.data;
					}
					if(!opts.tableBody.databak){
						opts.tableBody.databak=opts.tableBody.data;
					}
				}
				v6reportInit(opts,box);
			});
		},
		filterEventsInit:function(opts,box){
			if(opts.filter.open){
				for(var one in filterEvents){
					filterEvents[one](opts,box);
				}
			}
		},
		editBtn:function(opts,box){
			$(".edit-table-btn",box).click(function(){
				var active=$(this).hasClass("active");
				reportShowLoading();
				if(opts.edit.dependJs.draggable){
					$.ajax({
						  url: "/skin/js/jquery.ui.draggable.js",
						  async:false,
						  dataType: "script"
					});
				}
				if(opts.edit.dependJs.dropable){
					$.ajax({
						  url: "/skin/js/jquery.ui.droppable.js",
						  async:false,
						  dataType: "script"
					});
				}
				if(opts.edit.dependJs.sortable){
					$.ajax({
						  url: "/skin/js/jquery.ui.sortable.js",
						  async:false,
						  dataType: "script"
					});
				}	
				initEditOpt(opts,box,active);
				removeLoading();
				
			});
		},
		editEventsInit:function(opts,box){
			if(opts.edit.open && !opts.edit.hasInit){
				for(var one in editEvents){
					editEvents[one](opts,box);
					opts.edit.hasInit = true;
				}
			}
		},
		share2GroupBtn:function(opts,box){
			$(".share-group-btn",box).click(function(){
				if(opts.filter.open||opts.edit.open){
					jAlert("分享前请取消编辑状态");
					return false;
				}
				var x=$(this).position().left;
				var y=$(this).position().top;
				var shareBox=$(".share-group-box",box);
				if(shareBox.size()==0){
					ShareGroup.init(opts,box,x,y);
				}
	
			})
		},
		highLightARow:function(opts,box){
			$(".v6report-tbody").delegate(".v6report-tr","click",function(){
				var $this=$(this);
				var rowNum=parseInt($this.attr("rowNum"));
				activeRowNum=rowNum;
				$(".v6report-tbody .v6report-tr",box).removeClass("active");
				$this.addClass("active");
			});
		}
	}
	var filterEvents={
		filterTableCol:function(opts,box){
			$(".filter-table-td",box).click(function(){					
				var $this=$(this);
				var $filterContainer = $("#filter-checkbox-container");
				var colNum = $this.attr("colNum");
				opts.filter.colFilter = colNum
				var colFilterText = "";
				
				var colFilterArr = opts.filter.colFilterData;
				if(colFilterArr){
					for(var i=0;i<colFilterArr.length;i++){
						if(colFilterArr[i][0] == colNum){
							if(colFilterArr[i][1].length>0){
								colFilterText = ","+colFilterArr[i][1]+",";
							}
							break;
						}
					}
				}		
				
				var filterList = $("#filter-list",$filterContainer).empty();
				var filterUl = $("<ul></ul>").attr("id","filterUl");
				var optionArr = opts.filter.filterDataJson[colNum];
					
				var filterNum = colFilterText.split(",");
				
				var firstChecked = "";
				if(colFilterText == "" || filterNum==optionArr.length){
					firstChecked = "checked='checked'";
				}
				filterUl.append($("<li></li>").html("<input type='checkbox' id='checkAll' name='filter-dim' value='' "+firstChecked+">(全选)"));
					
				var checked = "";
				if(colFilterText.length>0){
					colFilterText = ","+colFilterText+",";
				}
				if(optionArr){
					for(var i=0;i<optionArr.length;i++){
						if(firstChecked!="" || colFilterText.indexOf(","+optionArr[i]+",")!=-1){
							checked = "checked='checked'";
						}else{
							checked = "";
						}
						filterUl.append($("<li></li>").html("<input type='checkbox' name='filter-dim' value='"+optionArr[i]+"' "+checked+">"+optionArr[i]));
					}
				}
				
				filterUl.appendTo(filterList);

				var $thisParent = $this.parent();
				$filterContainer.show()
					.css({"top":$thisParent.position().top+$this.height(),"left":$thisParent.position().left});
			});
		},
		filterTableOk:function(opts,box){
			$("#filter-btn-sure",box).click(function(){	
				var $checkedDimObj = $("#filter-list input[name=filter-dim]:checked",box);
				if($checkedDimObj.length==0){
					$("#filter-checkbox-container #filter-des").show();
					return false;
				}else{
					var colFilter = opts.filter.colFilter;
					var colFilterText = "";
					var dimLength = opts.filter.filterDataJson[colFilter].length;
					
					if($checkedDimObj.length==dimLength+1){
						colFilterText="";
					}else{
						$.each($checkedDimObj,function(i){
							colFilterText+=$(this).attr("value");	
							if(i<$checkedDimObj.length-1){
								colFilterText+=",";	
							}
						})						
					}
					
					var colFilterArr = opts.filter.colFilterData;
					var hasCol = false;
					if(colFilterArr){
						for(var i=0;i<colFilterArr.length;i++){
							if(colFilterArr[i][0] == colFilter){
								colFilterArr[i][1] = colFilterText;
								hasCol = true;
								break;
							}
						}
					}
					
					if(!hasCol){
						opts.filter.colFilterData.push(new Array(colFilter,colFilterText));
					}
					
					bodyDataFilter(opts);
					
					v6reportInit(opts,box);
				}
			});
		},
		filterTableCancel:function(opts,box){
			$("#filter-btn-cancel",box).click(function(){	
				$("#filter-checkbox-container").hide();	
			});
		},
		filterListclick:function(opts,box){
			$("#filter-list input[name=filter-dim]",box).live('click',function () {
				var thisId = $(this).attr('id');
				var $filterDimObj = $("#filter-list input[name=filter-dim]",box);
				var $filterDesObj = $("#filter-checkbox-container #filter-des");
				if(thisId=="checkAll"){
					if($(this).attr("checked")){
						$filterDimObj.attr("checked",true);		
						$filterDesObj.hide();
					}else{
						$filterDimObj.attr("checked",false);
						$filterDesObj.show();
					}
				}else{
					var checkedLength = $("#filter-list input[name=filter-dim]:checked",box).length;
					var $firstLiObj = $($filterDimObj[0]);
					var firstChecked = $firstLiObj.attr("checked");
					if(firstChecked){
						checkedLength = checkedLength-1;
					}
					var dimLength = opts.filter.filterDataJson[opts.filter.colFilter].length;
					if(!firstChecked && checkedLength == dimLength){
						$firstLiObj.attr("checked",true);
					}else if(firstChecked && checkedLength != dimLength){
						$firstLiObj.attr("checked",false);
					}
					if(checkedLength == 0){
						$filterDesObj.show();
					}else{
						$filterDesObj.hide();
					}
				}
			});
		}
	}
	
	var editEvents = {
		dimDraggable:function(opts,box){
			$(".dragBtn",box).draggable({
				revert: true, 
				start: function(event, ui) {
					var dimId = $(this).attr("value");
					opts.edit.activeDim = dimId;
					opts.edit.hasDroped=0;
					$("#"+dimId+"_Id").hide();	
				},
				stop:function(event, ui) {
					if(opts.edit.hasDroped==0){
						$("#"+opts.edit.activeDim+"_Id").show();
					}
				}
			});
		},
		axisdimDropable:function(opts,box){
			$( ".dim-continer" ,box).droppable({
				hoverClass: "active-drop-container",
				drop: function( event, ui ) {
					var activeAxis = $(this).attr("id");
					var activeDim = opts.edit.activeDim;	
					opts.edit.hasDroped=1;
					if(activeDim != "" && typeof(activeDim) != "undefined"){
						var $dimObj = $("#"+activeDim+"_Drag");				
						$dimObj.hide();
						var $dimIdAxisObj = $("#"+activeDim+"_Axis");
						if($dimIdAxisObj.length>0){
							$dimIdAxisObj.remove();
						}
						new axisDrag(activeDim,activeAxis);
						$("#"+activeDim+"_Id").val("");
						var type = $dimObj.attr("dragType");
						if(type==0){
							var dimIdValue = $dimObj.attr("dimIdValue");
							var dimNameValue = $dimObj.attr("dimNameValue");
							$("#"+activeDim+"_Id_Axis").val(dimIdValue);
							$("#"+activeDim+"_Name_Axis").val(dimNameValue);	
							doEditTable(opts,box);
						}else{
							$("#edit-checkbox-container").show();
						}
					}
				}
			});
		},
		axisdimSortable:function(opts,box){
			$( ".dim-continer",box).sortable({
				connectWith: ".dim-continer",
				start:function(event, ui) {
					opts.edit.activeDim = "";
				},
				stop:function(event, ui) {	
					if(opts.edit.activeDim ==""){
						doEditTable(opts,box);
					}
				}
			}).disableSelection();
		},
		closeAxisDim:function(opts,box){
			$(".closeAxisDim",box).live('click',function(event){
				$(this).parent().remove();				
				var dimId = $(this).parent().attr("id");
				dimId = dimId.slice(0,dimId.length-5);
				$("#"+dimId+"_Id_Axis").val("");
				$("#"+dimId+"_Name_Axis").val("");
				$("#"+dimId+"_Drag").show();		
				$("#"+dimId+"_Id").show();
				doEditTable(opts,box);
				event.stopPropagation();
			});
		},
		measureChilck:function(opts,box){
			$("#MEASURE_Axis").live('click',function(){
				$("#edit-checkbox-container").show();
			});
		},
		dimSelectChange:function(opts,box){
			$(".dim-select").live('change',function(event){
				var dimId = $(this).attr("id");
				var value = $(this).val();
				dimId = dimId.slice(0,dimId.length-3);			
				if(value == "" ){
					var $dragObj = $("#"+dimId+"_Drag");
					$("#"+dimId+"_Id_Axis").val($dragObj.attr("dimIdValue"));
					$("#"+dimId+"_Name_Axis").val($dragObj.attr("dimNameValue"));
				}else{
					var text = $('option:selected',this).text();
					$("#"+dimId+"_Id_Axis").val(value);
					$("#"+dimId+"_Name_Axis").val(text);
				}

				doEditTable(opts,box);
			});
		},
		measureCheckOk:function(opts,box){
			$("#edit-btn-sure",box).click(function(){	
				var $checkedDimObj = $("#edit-list input[name=measure-dim]:checked",box);
				if($checkedDimObj.length==0){
					$("#edit-checkbox-container #edit-des").show();
					return false;
				}else{
					var measureIds = "";
					var measureNames = "";
					$.each($checkedDimObj,function(i){
						measureIds+=$(this).attr("value");	
						measureNames+=$(this).attr("text");
						if(i<$checkedDimObj.length-1){
							measureIds+=",";	
							measureNames+=",";	
						}
					})	
					$("#MEASURE_Id_Axis").val(measureIds);
					$("#MEASURE_Name_Axis").val(measureNames);
					
					$("#edit-checkbox-container").hide();	
					doEditTable(opts,box);
				}
			})
		},
		measureCheckCancel:function(opts,box){
			$("#edit-btn-cancel",box).click(function(){	
				$("#edit-checkbox-container").hide();	
			});
		},
		editListclick:function(opts,box){
			$("#edit-list input[name=measure-dim]",box).live('click',function () {
				var $checkedDimObj = $("#edit-list input[name=measure-dim]:checked",box);
				if($checkedDimObj.length==0){
					$("#edit-checkbox-container #edit-des").show();
				}else{
					$("#edit-checkbox-container #edit-des").hide();
				}
			});
		}
	}
	
	function reportSaveAsExcel(opts,box){
		if(!opts.saveAsExcelExtend.enable){
			if(opts.reportInfo.title==undefined||!opts.reportInfo.title){
				var text=$(".pageLable").text();
				opts.reportInfo.title=text==""?"数据报表":text;
			}
			var jsonStr=O2String(opts);
			$("[name=\"sReportFormHidden\"]").remove();
			var input=$("<input type=\"hidden\" name=\"sReportJsonHidden\" />").val(encodeURIComponent(jsonStr));
			box.after($("<form name='sReportFormHidden' method='post'></form>").append(input));
			var url="v6ReportSaveAsExcelCmd.cmd?method=saveAsExcel";
			document.forms['sReportFormHidden'].action =url;
			document.forms['sReportFormHidden'].submit();
		}else{
			var url=opts.saveAsExcelExtend.url;
			var formId=opts.saveAsExcelExtend.formId;
			var $form=$("#"+formId);
			var urlBak=$form.attr("action");
			$form.attr("action",url);
			document.getElementById(formId).submit();
			$form.attr("action",urlBak);
		}
		
	}
	function fullScreen(opts,box){
		reportShowLoading();
		var optsClone=cloneObject(opts);
		optsClone.tableBody.dataUrl="";
		$.ajax({
			  type:"post",
			  data:{"option":O2String(optsClone)},
			  url: "pubReportSnapshotCmd.cmd?method=saveReportSnapshot",
			  success:function(data){
				  removeLoading()
				  var snapShotId=data;
				  window.open("/base/v6report/baseReportSnapshotCmd.cmd?method=querySnapshot&snapShotId="+snapShotId);
			  }
		});
	}
	function reportPrint(opts,box){
		reportShowLoading();
		var optsClone=cloneObject(opts);
		optsClone.tableBody.dataUrl="";
		$.ajax({
			  type:"post",
			  data:{"option":O2String(optsClone)},
			  url: "pubReportSnapshotCmd.cmd?method=saveReportSnapshot",
			  success:function(data){
				  removeLoading()
				  var snapShotId=data;
				  window.open("/base/v6report/baseReportSnapshotCmd.cmd?method=reportPrint&snapShotId="+snapShotId);
			  }
		});
	}
	function geneGraph(opts,box,$this){
		if($this.hasClass("active")){
			opts.graph.open=false;
			$(".highchartContainer",box).remove();
			$(".graphChangeBtn",box).remove();
		}else{
			opts.graph.open=true;
		}
		v6reportInit(opts,box);
	}
	
	function graphFactory(event){
		reportShowLoading();
		var opts=event.data.opts;
		var box=event.data.box;
		var colnum=event.data.colnum;
		var type=event.data.type;;
		var bodyData=opts.tableBody.data;
		var go=true;
		for(var i=0;i<bodyData.length;i++){
			var tdData=bodyData[i][colnum];
			if(isNaN(tdData.value)&&!tdData.sumLine){
				alert("自动生成图形失败");
				removeLoading();
				go=false;
				break;
				
			}
		}
		if(!go){
			return false;
		}

		var headDate=opts.tableHead.data;
		var yTitle="";
		for(var i=0;i<headDate.length;i++){
			var tdData=headDate[i][colnum];
			if((i>0&&tdData.text!=headDate[i-1][colnum])||i==0){
				yTitle+=tdData.text;
			}
			
		}
		var fixNum=opts.colHeadFixed.fixed?opts.colHeadFixed.number:1;
		var xCategories=[];
		var yData=[];
		for(var i=0;i<bodyData.length;i++){
			var name="";
			for(var j=0;j<fixNum;j++){
				var tdData=bodyData[i][j];
				if(j==fixNum-1){
					name+=tdData.value;
				}else{
					name+=tdData.value+":";
				}
			}
			if(!bodyData[i][0].sumLine){
				xCategories.push(name);
			}
			var dataObj=bodyData[i][colnum];
			if(!dataObj.sumLine){
				var value=parseFloat(dataObj.value);
				yData.push([name,value])
			}
		}
		
		var highChartOption={
			chart:{
				type:type,
				margin:[20,20,70,70]
			},
			title: {
                text: ''
            },
			xAxis:{
				categories:xCategories//,
				//labels: {
                //    rotation: -45,
                //    align: 'right',
                //    style: {
                //        fontSize: '13px',
                //        fontFamily: 'Verdana, sans-serif'
                //    }
	           // }
			},
			yAxis:{
				title:{
					text:yTitle
				}
			},
			legend:{
				align: 'right',
				verticalAlign: 'top',
				layout: 'vertical',
				y: 40
            },
            tooltip:{
                pointFormat: "{point.x}"+yTitle
            },
            series:[{
            	name:yTitle,
            	data:yData
            }]
		}

		var highchartContainer=$(".highchartContainer",box);
		if(highchartContainer.size()==0){
			box.prepend("<div class='highchartContainer' style='height:300px'></div>");
			box.prepend(
				$("<div class='graphChangeBtn' style='height:30px'></div>")
				.append("<input type='button' class='close dataConButton fr' value='关闭'/>")
				.append("<input type='button' class='line dataConButton fr' value='线性图'/>")
				.append("<input type='button' class='pie dataConButton fr' value='饼状图'/>")
				.append("<input type='button' class='column dataConButton fr' value='柱状图'/>")
			);
			$(".graphChangeBtn .column",box).click(function(){
				event.data.type='column';
				graphFactory(event);
			});
			$(".graphChangeBtn .pie",box).click(function(){
				event.data.type='pie';
				graphFactory(event);
			});
			$(".graphChangeBtn .line",box).click(function(){
				event.data.type='line';
				graphFactory(event);
			});
			$(".graphChangeBtn .close",box).click(function(){
				$(".gene-graph",box).click();
			});
		}else{
			highchartContainer.html("");
		}
		var optsClone=cloneObject(highChartOption);
		//console.log(O2String(optsClone));
		
		$(".highchartContainer",box).highcharts(highChartOption);
		
		removeLoading();
		
		
		
		
		
		
		
	}
	
	function bodyDataSort(opts,colNum,sortBy){
		var extendSort=opts.colSort.extend;
		if(extendSort&&sortBy){
				extendSort(sortBy);
		}
		if(colNum==undefined){
			return opts;
		}
		var arr=opts.tableBody.data;
		var colSort=opts.colSort;
		var desc;
		if(colSort.changeCol){
			desc=true;
			colSort.defaultSortCol.type="asc";
		}else{
			if(colSort.defaultSortCol.type=='desc'){
				desc=true;
				colSort.defaultSortCol.type="asc";
			}else if(colSort.defaultSortCol.type=='asc'){
				desc=false;
				colSort.defaultSortCol.type="desc";
			}
		}
		arr.sort(function(a,b){
			var aValue = Number(a[colNum].value);
			var bValue = Number(b[colNum].value);
			if (!isNaN(aValue)&&(!isNaN(bValue)))//如果ab都是数字
			{
				if(desc){
					if(a[colNum].sumLine||b[colNum].sumLine){
						if(a[colNum].sumLine){
							return -1;
						}else if(b[colNum].sumLine){
							return 1;
						}
					}else{
						return b[colNum].value-a[colNum].value;
					}
					
				}else{
					if(a[colNum].sumLine||b[colNum].sumLine){
						if(a[colNum].sumLine){
							return -1;
						}else if(b[colNum].sumLine){
							return 1;
						}
					}else{
						return a[colNum].value-b[colNum].value;
					}
				}
			}else{
				if(desc){
					if(a[colNum].sumLine||b[colNum].sumLine){
						if(a[colNum].sumLine){
							return -1;
						}else if(b[colNum].sumLine){
							return 1;
						}
					}else{
						return b[colNum].value.localeCompare(a[colNum].value);
					}	
				}else{
					if(a[colNum].sumLine||b[colNum].sumLine){
						if(a[colNum].sumLine){
							return -1;
						}else if(b[colNum].sumLine){
							return 1;
						}
					}else{
						return a[colNum].value.localeCompare(b[colNum].value);
					}
				}
				 
			}
		});
		return opts;
	};
	var ShareGroup={
		init:function(opts,box,x,y){
			var shareBox=$("<div class='share-group-box'></div>")
			.css("left",x-200).css("top",y+20)
			.append(
				$("<div class='share-group-title'><div>")
				.append("将报表分享到我的团队:")
				.append("<div class='share-box-spe-line'></div>")
			)
			.appendTo(box);
			reportShowLoading(shareBox);
			var content=$("<div class='share-box-content'></div>");
			var sid="";
			$.ajax({
				  url: "pubReportSnapshotCmd.cmd?method=getUserIdforSns",
				  async:false,
				  success:function(data){
					  sid=data;
				  }
			});
			var groupData="";
			$.ajax({
				  url: "/sns/index.php?app=api&mod=group&act=allTheGroup&page=1&count=100&sid="+sid,
				  success:function(data){
					  groupData=eval("("+data+")");
					  var dom=ShareGroup.domFactory(groupData);
					  content.html(dom);
					  shareBox.append(content);
					  var sEvent=ShareGroup.Event;
					  ShareGroup.saveReportSnapshot(opts,box);
					  for(var one in sEvent){
						  sEvent[one](box,sid);
					  }
					  removeLoading();
				  }
			});
			
		},
		domFactory:function(groupData){
			var groupNum=groupData["count"];
			var dom="";
			if(groupNum==0){
				dom+="<div class='share-no-group'>";
				dom+="您还没有加入过团队,点击";
				dom+="<a class='goforgroup' href='/sns/index.php?app=group&mod=SomeOne&act=index' target='_blank'>这里</a>";
				dom+="加入一个团队或者创建一个自己的团队吧。";
				dom+="</div>";
				dom+="<div class='share-group-btns'>";
				dom+="<input type='button' class='dataConButton share-box-close' value='关闭'/>";
				dom+="<div style='clear:both'></div>";
				dom+="</div>";
			}else{
				var groupList=groupData["data"];
				
				for(var i=0;i<groupList.length;i++){
					var group=groupList[i];
					dom+="<div class='group-list'>";
					dom+="<input type='radio' name='group-key' value='"+group["id"]+"' class='group-key' />";
					dom+="<img class='group-img' src='"+group["logo"]+"' width='30' height='30' />";
					dom+="<div class='group-name'>"+group["name"]+"</div>";
					dom+="<div style='clear:both'></div>";
					dom+="</div>";
				}
				dom+="<div class='share-text-box'>";
				dom+="<div class='share-text-box-title'>";
				dom+="</div>";
				dom+="<textarea class='share-text'>";
				dom+="</textarea>";
				dom+="</div>";
				dom+="<div class='share-group-btns buttonRightContainer'>";
				dom+="<input type='button' class='dataConButton share-box-ok' value='分享'/>";
				dom+="<input type='button' class='dataConButton share-box-close' value='关闭'/>";
				dom+="<div style='clear:both'></div>";
				dom+="</div>";
				dom+="</div>";
			}
			return dom;
		},
		saveReportSnapshot:function(opts,box){
			var reportName=opts.reportInfo.title;
			var optsClone=cloneObject(opts);
			optsClone.tableBody.dataUrl="";
			$.ajax({
				  type:"post",
				  data:{"option":O2String(optsClone)},
				  url: "pubReportSnapshotCmd.cmd?method=saveReportSnapshot",
				  async:false,
				  success:function(data){
					  var snapShotId=data;
					  var ip=getIpFromBrowse();
					  var text="分享报表【"+reportName+"】";
					  text+="http://"+ip+"/base/v6report/baseReportSnapshotCmd.cmd?method=querySnapshot&snapShotId="+snapShotId;
					  $(".share-text",box).text(text);
				  }
			});
		},
		share2group:function(box,groupId,sid,shareText){
			$.ajax({
				  type:"post",
				  data:{"content":shareText},
				  url: "/sns/index.php?app=api&mod=group&act=groupWeiboPublish&gid="+groupId+"&sid="+sid,
				  async:false,
				  success:function(data){
					  if(data){
						  ShareGroup.shareSuccess(box,groupId);
					  }else{
						  jError("分享失败，请联系系统管理员");
					  }
				  }
			});
		},
		shareSuccess:function(box,groupId){
			var dom="<div class='share-no-group'>";
			dom+="恭喜,报表分享成功,点击";
			dom+="<a class='goforgroup' href='/sns/index.php?app=group&mod=Group&act=index&gid="+groupId+"' target='_blank'>这里</a>";
			dom+="查看我分享的报表。";
			dom+="</div>";
			dom+="<div class='share-group-btns'>";
			dom+="<input type='button' class='dataConButton share-box-close' value='关闭'/>";
			dom+="<div style='clear:both'></div>";
			dom+="</div>";
			
			$(".share-box-content",box).html(dom);
			
			
		},
		Event:{
			closeBtn:function(box){
				$(".share-box-close",box).live("click",function(){
					$(".share-group-box",box).remove();
				});
			},
			groupChoice:function(box){
				$(".group-list",box).click(function(){
					var key=$(".group-key",$(this)).val();
					setSel([key],"group-key");
				});
			},
			okBtn:function(box,sid){
				$(".share-box-ok",box).click(function(){
					var groupId=$(".group-key:checked",box).val();
					if(groupId==undefined){
						jAlert("请选择一个团队");
						return false;
					}
					var shareText=$(".share-text",box).text();
					ShareGroup.share2group(box,groupId,sid,shareText);
				});
			}
		}
	}
	function initEditOpt(opts,box,active){
		if(active){
			opts.edit.open=false;
			opts.edit.hasInit=false;
			opts.filter.open=false;
			opts.filter.colFilterData = new Array();
			opts.tableHead.widthArr=opts.tableHead.widthArrbak;
			opts.tableHead.data=opts.tableHead.databak;
			opts.tableBody.dimCloumn=opts.tableBody.dimCloumnbak;
			opts.tableBody.style=opts.tableBody.stylebak;
			opts.tableBody.data=opts.tableBody.databak;
			opts.colHeadFixed.fixed=opts.colHeadFixed.fixedbak;
			opts.colHeadFixed.number=opts.colHeadFixed.numberbak;
			opts.btns.filterData =opts.btns.filterDatabak;
			opts.tableBody.editdata=opts.tableBody.databak;
			opts.colSort.canSort=opts.tableBody.canSortbak;
		}else{
			opts.edit.open=true;
			if(!opts.tableHead.widthArrbak){
				opts.tableHead.widthArrbak=opts.tableHead.widthArr;
			}
			if(!opts.tableHead.databak){
				opts.tableHead.databak=opts.tableHead.data;
			}
			if(!opts.tableBody.dimCloumnbak){
				opts.tableBody.dimCloumnbak=opts.tableBody.dimCloumn;
			}
			if(!opts.tableBody.stylebak){
				opts.tableBody.stylebak=opts.tableBody.style;
			}
			if(!opts.tableBody.databak){
				opts.tableBody.databak=opts.tableBody.data;
			}else{
				if(opts.filter.open){
					opts.tableBody.data = opts.tableBody.databak;
					opts.filter.open=false;
				}
			}
			if(!opts.colHeadFixed.fixedbak){
				opts.colHeadFixed.fixedbak=opts.colHeadFixed.fixed;
			}
			if(!opts.colHeadFixed.numberbak){
				opts.colHeadFixed.numberbak=opts.colHeadFixed.number;
			}
			if(!opts.btns.filterDatabak){
				opts.btns.filterDatabak=opts.btns.filterData;
			}
			if(!opts.tableBody.canSortbak){
				opts.tableBody.canSortbak = opts.colSort.canSort;
			}
		}
		v6reportInit(opts,box);
	}

	
	function bodyDataFilter(opts){		
		var colFilterArr = opts.filter.colFilterData;
		if(colFilterArr.length==0){
			return false;
		}else{
			for(var j=0;j<colFilterArr.length;j++){
				if(colFilterArr[j][1]!=""){
					colFilterArr[j][1] = ","+colFilterArr[j][1]+",";
				}
			}
		}
		
		var arr = new Array();
		var editdata = opts.tableBody.editdata;
		var isData = true;
		for(var i=0;i<editdata.length;i++){
			isData = true;
			for(var j=0;j<colFilterArr.length;j++){
				if(colFilterArr[j][1]!="" &&  colFilterArr[j][1].indexOf(","+editdata[i][colFilterArr[j][0]].value+",")==-1){
					isData = false;
					break;
				}
			}
			if(isData){
				arr.push(editdata[i]);
			}
		}	
		opts.tableBody.data = arr;
		
		return true;
	};

	var axisDrag=function(dimId,container){
		var $dimObj = $("#"+dimId+"_Drag");	
		var dimName = $dimObj.text();
		var colNum = $dimObj.attr("colNum");
		var dragwidth = $dimObj.width()+20;		
		$("<div></div>").width(dragwidth)
			.attr("id",dimId+"_Axis")
			.attr("value",dimId)
			.attr("colNum",colNum)
			.addClass("dragBtn")
			.addClass("axisDimdragBtn")
			.html(dimName+"<span class=\"closeAxisDim\"></span>")
			.appendTo("#"+container);		
	}
	
	function doEditTable(opts,box){
		opts.filter.open=false;		
		opts.filter.colFilterData = new Array();
		
		var xAxisDims = getAxisDims("XAxisDim");
		if(xAxisDims == ""){
			$("#XAxisDimDesc").html("拖动上方蓝色方框到此");
			opts.edit.XAxisDimType = "";
		}else{
			$("#XAxisDimDesc").html("");
			opts.edit.XAxisDimType = xAxisDims;
		}
		
		var yAxisDims = getAxisDims("YAxisDim");
		if(yAxisDims == ""){
			$("#YAxisDimDesc").html("拖动上方蓝色方框到此");
			opts.edit.YAxisDimType = "";
		}else{
			$("#YAxisDimDesc").html("");
			opts.edit.YAxisDimType = xAxisDims;
		}
		
		if(xAxisDims=="" && yAxisDims==""){
			opts.tableHead.widthArr=opts.tableHead.widthArrbak;
			opts.tableHead.data=opts.tableHead.databak;
			opts.tableBody.dimCloumn=opts.tableBody.dimCloumnbak;
			opts.tableBody.style=opts.tableBody.stylebak;
			opts.tableBody.data=opts.tableBody.databak;
			opts.colHeadFixed.number=opts.colHeadFixed.numberbak;
			opts.btns.filterData=opts.btns.filterDatabak;
			opts.tableBody.editdata = opts.tableBody.data;
			opts.tableBody.canSort = opts.colSort.canSortbak;

			v6reportInit(opts,box);
		}else{
			var xAxisDimArr = new Array();
			var xDataArr = new Array();
			if(xAxisDims.length>0){
				xAxisDimArr = xAxisDims.split(",");
				xDataArr = getAxisDataAttr(xAxisDimArr,opts);
			}		
			var yAxisDimArr = new Array();
			var yDataArr = new Array();
			var rowFixMeasureStr;
			if(yAxisDims.length>0){
				yAxisDimArr = yAxisDims.split(",");
				yDataArr = getAxisDataAttr(yAxisDimArr,opts);
				rowFixMeasureStr = getRowFixMeasureStr(yAxisDimArr);
			}
			
			var fixNum = 0;
			if(null!=rowFixMeasureStr && rowFixMeasureStr.length>0){
				fixNum = rowFixMeasureStr.split(",").length;
			}
			var colnum = fixNum;
			var dataAttr = getDataAttr(xAxisDimArr,yAxisDimArr,opts);

			if(xAxisDims.length>0){
				colnum += xDataArr.length;
			}else{
				if(dataAttr[0] == 1){
					colnum += 1;	
				}
			}		
	
			if(colnum>0){
				//表头
				var thWidthArr = new Array(colnum);
				var dimCloumnArr = new Array(colnum);
				var thAlignArr = new Array(colnum);
				var thDataArr = getTableThData(xDataArr,rowFixMeasureStr,dataAttr);
				var canSortArr = new Array(colnum);
			
				for(var i=0;i<colnum;i++){
					if(i<fixNum){
						dimCloumnArr[i] = 0;
						thAlignArr[i] = "center";
					}else{
						dimCloumnArr[i] = 1;
						thAlignArr[i] = "right";
					}
					thWidthArr[i] = 5;
					canSortArr[i]=1;
				}
							
				//组织数据
				var dataJson = getTableTbody(xAxisDimArr,yAxisDimArr,xDataArr,yDataArr,dataAttr,opts);
				
				opts.tableHead.widthArr=thWidthArr;
				opts.tableHead.data=eval(thDataArr);
				opts.tableBody.dimCloumn=dimCloumnArr;
				opts.tableBody.style.textAlign=thAlignArr;
				opts.tableBody.data=eval(dataJson);
				opts.colSort.canSort = canSortArr;
				opts.colHeadFixed.fixed=opts.colHeadFixed.fixedbak;
				opts.btns.filterData=opts.btns.filterDatabak;
				opts.colHeadFixed.number=fixNum;
				
				opts.tableBody.editdata = eval(dataJson);
				
				v6reportInit(opts,box);
			}
			
		}
	}
	
	function getAxisDims(container){
		var dimStr = "";
		var axisDimObjs = $("#"+container+" .dragBtn");
		axisDimObjs.each(function(i){
			var dimid=$(this).attr("value");
			var dimname=$(this).text();
			var colNum=$(this).attr("colNum");
			dimStr += dimid+":"+dimname+":"+colNum;
			if(i!=axisDimObjs.length-1){
				dimStr += ",";
			}
		});
		return dimStr;
	}
	
	//组织表头或行头数据，2维数组，数据取数行（数组）、维度名称（数组）
	function getAxisDataAttr(dimArr,opts){
		var dimNum = dimArr.length;
		var dimAttrDetail = opts.edit.dimAttrDetail;

		var measureArr = new Array();
		var newDimArr = new Array();

		for(var i=0;i<dimNum;i++){
			var dimAttr = dimArr[i].split(":");
			if(dimAttr[0] == "MEASURE"){
				var dimIdDataArr = $("#MEASURE_Id_Axis").val().split(",");
				var dimNameDataArr = $("#MEASURE_Name_Axis").val().split(",");
				for(var j=0;j<dimNameDataArr.length;j++){
					measureArr.push(new Array(dimNameDataArr[j],new Array(),dimIdDataArr[j]));			
				}
				newDimArr.push(measureArr);
			}else{
				newDimArr.push(dimAttrDetail[dimAttr[2]]);
			}
		}

		var tHeadArr = getTheadArr(newDimArr);

		return tHeadArr;
	}

	function getTheadArr(dimArr){
		var dimNum = dimArr.length;
		var theadArr = new Array();
		if(dimNum>0){	
			for(var i=0;i<dimArr[0].length;i++){
				var trArr = new Array(new Array(),new Array(),-1)
				
				trArr[1].push(dimArr[0][i][0]);
				if(dimArr[0][i][2]!=-1){
					trArr[2] = dimArr[0][i][2];
				}

				if(dimNum>1 && (dimArr[0][i][1].length>0 || dimArr[0][i][2]!=-1)){
					getTrChildren(theadArr,1,dimArr[0][i][1],dimArr,trArr);
				}else{
					trArr[0]=dimArr[0][i][1];
					theadArr.push(trArr);
				}
			}
		}
		
		return theadArr;
	}
	 
	function getTrChildren(theadArr,dimNum,parentLineArr,dimArr,trArr){
		for(var i=0;i<dimArr[dimNum].length;i++){	
			var newTrArr = new Array(new Array(),new Array(),-1);
			for(var k=0;k<trArr[1].length;k++){
				newTrArr[1].push(trArr[1][k]);
			}	
			newTrArr[2] = trArr[2];
			if(dimArr[dimNum][i][2]!=-1){
				newTrArr[2] = dimArr[dimNum][i][2];
			}	
			var publicArr = getPubArr(parentLineArr,dimArr[dimNum][i][1]);

			if(publicArr.length>0){
				newTrArr[1].push(dimArr[dimNum][i][0]);
				if(dimNum<dimArr.length-1){
					getTrChildren(theadArr,dimNum+1,publicArr,dimArr,newTrArr)
				}else{
					newTrArr[0] = publicArr;
					theadArr.push(newTrArr);
				}
			}
		}
	 }
	 
	function getPubArr(arr1,arr2){
		var pubArr = new Array();
		if(null==arr1){
			arr1 = new Array();
		}
		if(null==arr2){
			arr2 = new Array();
		}
		
		if(arr1.length==0 && arr2.length==0){
		}else if(arr1.length!=0 && arr2.length==0){
			for(var i=0;i<arr1.length;i++){
				pubArr.push(arr1[i]);
			}
		}else if(arr1.length==0 && arr2.length!=0){
			for(var i=0;i<arr2.length;i++){
				pubArr.push(arr2[i]);
			}
		}else{
			for(var i=0;i<arr1.length;i++){
				for(var j=0;j<arr2.length;j++){
					if(arr1[i] == arr2[j]){
						pubArr.push(arr1[i]);
						break;
					}
				}
			}
		}

		return pubArr;
	 }

	function getRowFixMeasureStr(dimArr){
		var fixMeasureStr = "";
		var num = dimArr.length;
		for(var i=0;i<num;i++){
			var dimAttrArr = dimArr[i].split(":");
			fixMeasureStr += dimAttrArr[1];
			if(i<num-1){
				fixMeasureStr += ",";
			}
		}
	
		return fixMeasureStr;
	}
	
	//检查拖拽及选择内容是否包含了原表格的所有非数据列,返回 ：是否可以组织数据，表格中是否含有指标列，查询条件指标列值,查询条件名称
	function getDataAttr(xAxisDimArr,yAxisDimArr,opts){
		var dataAttr = new Array(4);
		dataAttr[0]=0;
		dataAttr[1]=0;
	
		var dimCloumn = opts.tableBody.dimCloumnbak
		var dimSourceStr = ",";
		for(var i=0;i<dimCloumn.length;i++){
			if(dimCloumn[i] == 0){
				dimSourceStr += i+",";
			}
		}
	
		if(null!=xAxisDimArr){
			for(var i=0;i<xAxisDimArr.length;i++){
				var dimAttrArr = xAxisDimArr[i].split(":");
				if(dimAttrArr[0] == "MEASURE"){
					dataAttr[1]=1;
				}else if(dimCloumn[dimAttrArr[2]] == 0){
					dimSourceStr = dimSourceStr.replace(","+dimAttrArr[2]+",",",");
				}
			}
		}
		if(null!=yAxisDimArr){
			for(var i=0;i<yAxisDimArr.length;i++){
				var dimAttrArr = yAxisDimArr[i].split(":");
				if(dimAttrArr[0] == "MEASURE"){
					dataAttr[1]=1;
				}else if(dimCloumn[dimAttrArr[2]] == 0){
					dimSourceStr = dimSourceStr.replace(","+dimAttrArr[2]+",",",");
				}
			}
		}
	
		if(dimSourceStr==","){
			dataAttr[2] = $('#MEASURE_Id_Axis').val();
			dataAttr[3] = $('#MEASURE_Name_Axis').text();
		}else{
			//查询条件
			var dimObjs = $(".dim-select");
			$.each(dimObjs,function(i){
				if($(this).val()!=''){
					var dimId = $(this).attr("id");
					dimId = dimId.slice(0,dimId.length-3);
					if(dimId == "MEASURE"){
						dataAttr[2] = $(this).val();
						dataAttr[3] = $('option:selected',this).text();
					}else{
						var colNum = $("#"+dimId+"_Drag").attr("colNum");
						dimSourceStr = dimSourceStr.replace(","+colNum+",",",");
					}
				}
			})
		}
	
		if(dimSourceStr==","){
			if(dataAttr[1]==1 || (null!=dataAttr[2]&&dataAttr[2]!='undefined'&&dataAttr[2]!= "")){
				dataAttr[0]=1;
			}else{
				dataAttr[0]=0;
			}	
		}
		
		return dataAttr;
	}
	
	function getTableThData(xDataArr,rowFixMeasureStr,dataAttr){
		var thDataStr = "";
		thDataStr +="[";
		var fixHtmlStr = "";
		if(null!=rowFixMeasureStr){
			var thDataArr = rowFixMeasureStr.split(",");
			for(var j=0;j<thDataArr.length;j++){
				fixHtmlStr += "{text:'"+thDataArr[j]+"'}";
				if(j<thDataArr.length-1){
					fixHtmlStr += ",";
				}
			}
		}
		
		if(null!=xDataArr && xDataArr.length>0){
			var trNum = xDataArr[0][1].length;
			for(var i=0;i<trNum;i++){
				thDataStr +="[";
				if(fixHtmlStr.length>0){
					thDataStr += fixHtmlStr+",";
				}
				for(var j=0;j<xDataArr.length;j++){
					thDataStr += "{text:'"+xDataArr[j][1][i]+"'}";
					if(j<xDataArr.length-1){
						thDataStr += ",";
					}
				}
				thDataStr +="]";
				if(i<trNum-1){
					thDataStr += ",";
				}
			}
		}else{
			if(null!=rowFixMeasureStr && rowFixMeasureStr!=''){
				thDataStr +="["+fixHtmlStr;
				if(dataAttr[0] == 1){
					thDataStr +=",{text:'指标值'}";
				}
				thDataStr +="]";
			}	  
		}
		thDataStr +="]";

		return thDataStr;
	}
	
	function getTableTbody(xAxisDimArr,yAxisDimArr,xDataArr,yDataArr,dataAttr,opts){
		var dataJson = "[";
		var trStr = ""; //行内容
		var dataClomn=-1; //数据列
		if(dataAttr[1]==0){
			dataClomn = dataAttr[2];
		}

		var selectArr = getSelectRowArr(xAxisDimArr,yAxisDimArr,opts);//查询条件
	
		var bodyData = opts.tableBody.databak;
		
		if(xDataArr.length>0 && yDataArr.length==0 && dataAttr[0]==1){//只有表头	
			trStr ="[";
			for(var i=0;i<xDataArr.length;i++){	
				var dataRow = new Array();
				dataRow = getPubArr(selectArr,xDataArr[i][0]);
				if(xDataArr[i][2]!=-1){
					dataClomn = xDataArr[i][2];
				}

				if(dataRow.length==1 && dataClomn!=-1){
					trStr += "{value:'"+bodyData[dataRow[0]][dataClomn].value+"'}";
				}else{
					trStr += "{value:''}";
				}
				if(i<xDataArr.length-1){
					trStr += ",";
				}
			}
			trStr +="]";
			
			dataJson += trStr;
		
		}else if(xDataArr.length==0 &&yDataArr.length>0){//只有行头
			for(var i=0;i<yDataArr.length;i++){
				trStr ="[";
				for(var j=0;j<yDataArr[i][1].length;j++){
					trStr += "{value:'"+yDataArr[i][1][j]+"'}";
					
					if(j<yDataArr[i][1].length-1){
						trStr += ",";
					}
				}				
				
				if(dataAttr[0]==1){
					var dataRow = new Array();
					dataRow = getPubArr(selectArr,yDataArr[i][0]);
					if(yDataArr[i][2]!=-1){
						dataClomn = yDataArr[i][2];
					}
					if(dataRow.length==1 && dataClomn!=-1){
						trStr += ",{value:'"+bodyData[dataRow[0]][dataClomn].value+"'}";
					}else{
						trStr += ",{value:''}";
					}
				}
				
				trStr +="]";
				if(i<yDataArr.length-1){
					trStr += ",";
				}
				dataJson += trStr;
			}
		}else if(xDataArr.length>0 && yDataArr.length>0){//表头、行头都有
			var yOnlyMeasure = false;
			if(yAxisDimArr.length==1){
				if(yAxisDimArr[0].indexOf("MEASURE")!=-1){
					yOnlyMeasure =  true;
				}
			}
			for(var i=0;i<yDataArr.length;i++){
				trStr ="[";
				for(var j=0;j<yDataArr[i][1].length;j++){
					trStr += "{value:'"+yDataArr[i][1][j]+"'},";
				}				
				
				if(dataAttr[0]==1){
					var dataRowY = new Array();
					dataRowY = getPubArr(selectArr,yDataArr[i][0]);
					if(yDataArr[i][2]!=-1){
						dataClomn = yDataArr[i][2];
					}
					
					for(var k=0;k<xDataArr.length;k++){	
						var dataRowX = new Array();
						if(dataRowY.length>0 || yOnlyMeasure){
							dataRowX = getPubArr(dataRowY,xDataArr[k][0]);
						}
						if(xDataArr[k][2]!=-1){
							dataClomn = xDataArr[k][2];
						}
						
						if(dataRowX.length==1 && null!=dataClomn && dataClomn!=-1){
							trStr += "{value:'"+bodyData[dataRowX[0]][dataClomn].value+"'}";
						}else{
							trStr += "{value:''}";
						}
						if(k<xDataArr.length-1){
							trStr += ",";
						}
					}
				}else{
					for(var k=0;k<xDataArr.length;k++){
						trStr += "{value:''}";
						if(k<xDataArr.length-1){
							trStr += ",";
						}
					}
				}
				
				trStr +="]";
				if(i<yDataArr.length-1){
					trStr += ",";
				}
				dataJson += trStr;
			}
		}
					
		dataJson += "]";
		return dataJson;
	}
	
	function getSelectRowArr(xAxisDimArr,yAxisDimArr,opts){
		//查询条件
		var dimObjs = $(".dim-select");
		var dimRowArr = new Array();
		var dimAttrDetail = opts.edit.dimAttrDetail;
		for(var i=0;i<dimObjs.length;i++){
			var $dimObj = $(dimObjs[i]);
			var text = $dimObj.val();
			if(text!=''){
				var dimId = $dimObj.attr("id");
				dimId = dimId.slice(0,dimId.length-3);
				if(dimId!="MEASURE"){
					var colNum = $("#"+dimId+"_Drag").attr("colNum");
					var dimAttr = dimAttrDetail[colNum];
					for(var j=0;j<dimAttr.length;j++){
						if(dimAttr[j][0] == text){
							dimRowArr.push(dimAttr[j][1]);
						}
					}
				}
			}
		}

		var selectRowArr = new Array();
		if(dimRowArr.length==0){			
		}else if(dimRowArr.length==1){
			for(var i=0;i<dimRowArr[0].length;i++){
				selectRowArr.push(dimRowArr[0][i]);
			}
		}else{
			var n=2;
			selectRowArr = getPubArr(dimRowArr[0],dimRowArr[1]);
			while(selectRowArr.length>0 && n<dimRowArr.length){
				selectRowArr =  getPubArr(selectRowArr,dimRowArr[n]);
				n++;
			}
		}

		return selectRowArr;
	}
	
	//为数据分析准备数据
	function getDimAttrDetail(opts){
		var dimCloumn = opts.tableBody.dimCloumn;
		var editNum = dimCloumn.length;

		if(editNum==0){
			return new Array();
		}else{
			var bodyData = opts.tableBody.databak;
			var dimArr = new Array(editNum);
			for(var i=0;i<editNum;i++){
				dimArr[i] = new Array();
			}
			var isDim = true;
			for(var i=0;i<bodyData.length;i++){
				for(var j=0;j<editNum;j++){
					if(dimCloumn[j]==0){				
						isDim = true;
						for(var k=0;k<dimArr[j].length;k++){
							if(dimArr[j][k][0] == bodyData[i][j].value){
								isDim = false;
								break;
							}
						}
						if(isDim){
							dimArr[j].push(new Array(bodyData[i][j].value,new Array(),-1));
						}
					}
				}
			}
			
			for(var i=0;i<bodyData.length;i++){
				for(var j=0;j<editNum;j++){	
					if(dimCloumn[j]==0){	
						for(var k=0;k<dimArr[j].length;k++){
							if(dimArr[j][k][0] == bodyData[i][j].value){
								dimArr[j][k][1].push(i);
							}
						}
					}
				}
			}
			return dimArr;
		}
	}
	
	var O2String = function (O) { 
		var S = []; 
		var J = ""; 
		if (Object.prototype.toString.apply(O) === '[object String]') { 
			J = '"'+ O.replace(/\"/g,"'") +'"'; 
		}else if (Object.prototype.toString.apply(O) === '[object Array]') {
			if(O.length==0){
				J='[]';
			}
			for (var i = 0; i < O.length; i++){
				S.push(O2String(O[i])); 
				J = '[' + S.join(',') + ']'; 
			} 
		}else if (Object.prototype.toString.apply(O) === '[object Object]') { 
			for (var i in O) { 
				J = O2String(O[i]); 
				S.push(i + ':' + J); 
			} 
			J = '{' + S.join(',') + '}'; 
		}else{
			J = O;
		}

		return J; 
	};
	
	function getIpFromBrowse(){
		return top.location.hostname;
	}
	
	function cloneObject(o) {
		if (!o || 'object' != typeof o) {
			return o;
		}
		var c = Object.prototype.toString.call(o) == '[object Array]' ? [] : {};
		var p, v;
		for (p in o) {
			if (o.hasOwnProperty(p)) {
				v = o[p];
				if (v && 'object' == typeof v) {
					c[p] = cloneObject(v);
				} else {
					c[p] = v;
				}
			}
		}
		return c;
	}
	
	Array.prototype.in_array = function(e)
	{
		for(i=0;i<this.length && this[i]!=e;i++);
		return !(i==this.length);
	}
})(jQuery);

/**
 * 实现将opts解析成html形式table
 */
(function($) {
	$.fn.report2html=function(opts){
		var colnum = opts.tableHead.colNum;
		var headData = opts.tableHead.data;
		var widthArr=opts.tableHead.widthArr;
		var bodyData = opts.tableBody.data;
		var table = "<table class='v6report-htmltable'>";
		for (var i = 0; i < headData.length; i++) {
			table+="<tr>";
			for (var j = 0; j < colnum; j++) {
				var tddata=headData[i][j];
				if (tddata.disable) {
					continue;
				} else {
					tddata.rowspan=tddata.rowspan?tddata.rowspan:"1";
					tddata.colspan=tddata.colspan?tddata.colspan:"1";
					table+="<th rowspan='"+tddata.rowspan+"' colspan='"+tddata.colspan+"'>";
					table+=tddata.text;
					table+="</th>";
					
				}
			}
			table+="</tr>";
		}
		for(var i=0;i<bodyData.length;i++){
			table+="<tr>";
			for (var j = 0; j < colnum; j++) {
				var tddata=bodyData[i][j];
				table+="<td>";
				table+=tddata.value;
				table+="</td>";
			}
			table+="</tr>";
		}
		
		table+="</table>";
		return table
	}
})(jQuery); 


function reportShowLoading($target){
	if($target==undefined){
		var docWidth=$(window).width();
		var docHeight=$(window).height();
		var loading=$("<div class='v6report-loading'></div>")
		.width(docWidth)
		.height(docHeight)
		.css("opacity",0.5);
		$("body").append(loading);
	}else{
		var docWidth=$target.width();
		var docHeight=$target.height();
		$("<div class='v6report-loading'></div>")
		.width(docWidth)
		.height(docHeight)
		.css("opacity",0.5)
		.appendTo($target);
	};
	
}
function removeLoading(){
	$(".v6report-loading").remove();
}
/*
 *jquery.mousewheel.js
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

}));

(function($) {
	//查询条件
	$.fn.addSearch = function(options){
		var defaults = { 			
			parentId:$(this),//父div
			id:"",
			name:"",
			type:"",//查询条件类型 0 维度，1：指标
			colNum:0,//数据所在列
			value:"",//查询条件 数据值
			dimIdValue:"",//维度所有值
			dimNameValue:"",//维度所有值
			axisValueId:"",//坐标轴数值 ID
			axisValueName:""//坐标轴数值 NAME
		};  
		var dragOpts = $.extend(defaults, options); 
		
		initsearch();
		//初始化查询条件
		function initsearch(){
			
			var searchObj = $("<div></div>").addClass("searchButton").attr("id",dragOpts.id);
			
			//可拖拽区域		
			var searchHtml = "<span id=\""+dragOpts.id+"_Drag\"  class=\"dragBtn\" value=\""+dragOpts.id+"\" colNum=\""+dragOpts.colNum+"\" dragType=\""+dragOpts.type+"\" "+
					"  dimIdValue=\""+dragOpts.dimIdValue+"\" dimNameValue=\""+dragOpts.dimNameValue+"\">"+dragOpts.name+"</span>";//可拖拽区域
			
			searchHtml += "<input type=\"hidden\" id=\""+dragOpts.id+"_Id_Axis\" value=\""+dragOpts.axisValueId+"\" />";//坐标轴值
			searchHtml += "<input type=\"hidden\" id=\""+dragOpts.id+"_Name_Axis\" value=\""+dragOpts.axisValueName+"\" />";//坐标轴值
			
			//查询条件
			searchHtml += "<select id=\""+dragOpts.id+"_Id\" class=\"dim-select\">";
			searchHtml +="<option value=\"\">&nbsp;&nbsp;请选择&nbsp;&nbsp;</option>";			
			if(null!=dragOpts.dimIdValue && dragOpts.dimIdValue.length>0){
				var valueIdArr = dragOpts.dimIdValue.split(",");
				var valueNameArr = dragOpts.dimNameValue.split(",");
				for(var i=0;i<valueIdArr.length;i++){
					if(valueIdArr[i]!=""){
						searchHtml +="<option value=\""+valueIdArr[i]+"\">"+valueNameArr[i]+"</option>";
					}
				}
			}	
			searchHtml +="</select>";	

			searchObj.html(searchHtml);
			searchObj.appendTo(dragOpts.parentId);
			

		}
	}
		   
})(jQuery); 