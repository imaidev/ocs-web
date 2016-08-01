function saveAsExcel(containerId,tableId,rptName,rptParms){
	var selector=$("#"+tableId);
	var container=$("#"+containerId);
	if(selector.length==0){alert("id为："+tableId+"的表格不存在，请检查");return};
	if(container.length==0){alert("id为"+containerId+"的容器不存在，请检查");return};
	var jsonStr="{";
	var tableStr=getTableStr(selector);
	//导出excel是否自动换行
	var isWrapText=selector.attr("wrapText");
	if(isWrapText=="true"){
		isWrapText=1;  
	}else{
		isWrapText=0;    
	 }
	var wrapText="";
	wrapText+="\"wrapText\":\"";
	wrapText+=isWrapText;
	wrapText+="\"";
	//导出excel后固定的行数
	var fixedTrStr="";
	var fixedTr = $("thead tr",selector).length;
	fixedTrStr+="\"fixedTrNum\":\"";
	fixedTrStr+=fixedTr;
	fixedTrStr+="\"";
	//导出excel后固定的列数
	var fixedTdStr="";
	fixedTdStr+="\"fixedTdNum\":\"";
	fixedTdStr+=0;
	fixedTdStr+="\"";
	var titleStr="";
	if(rptName){
		titleStr+="\"titleStr\":\"";
		titleStr+=rptName;
		titleStr+="\"";
	}else{
		titleStr=getTableTitle(container);
	}
	var parmsStr="";
	if(rptParms){
		parmsStr+="\"parmsStr\":\"";
		parmsStr+=rptParms;
		parmsStr+="\""
	}else{
		parmsStr=getTableParms(container);
	}
	jsonStr+=wrapText+",";
	jsonStr+=tableStr+",";
	jsonStr+=titleStr+",";
	jsonStr+=fixedTrStr+",";
	jsonStr+=fixedTdStr+",";
	jsonStr+=parmsStr;
	jsonStr+="}";
	
	$("[name=\"sReportJsonHidden\"]").remove();
	selector.after($("<input type=\"hidden\" name=\"sReportJsonHidden\" />").val(jsonStr));
	//alert("form id='"+containerId+"' 需要action属性，并且submit，生成的json字符换放在name为sReportJsonHidden的hidden标签下，可以根据此名字在CMD内获取");
	var url="report2Excel.scmd";
	document.forms[containerId].action =url;
	document.forms[containerId].submit();
	//document.forms[0].action =url;
	//document.forms[0].submit();
}
function getTableStr(selector){
	var tableStr="\"tableStr\":[";
	var trs=selector.find("tr");
	if(trs.length>0){
		trs.each(function(i){	
			var ths=$(this).find("th");
			if(ths.length>0){
				tableStr+="[";
				ths.each(function(j){
					var $this=$(this);
					tableStr+="{";
					
					var thisTex=$this.text().replace(/\ +/g,"");//去掉空格
		            thisTex= thisTex.replace(/[\r\n]/g,"");//去掉回车换行
		            
					tableStr+="\"text\":\""+thisTex+"\",";
					tableStr+="\"type\":\"th\",";
					tableStr+="\"dimColumn\":\""+1+"\",";
					tableStr+="\"thWidth\":\""+$this.width()+"\",";
					tableStr+="\"rowSpan\":\""+($this.attr("rowSpan")==undefined?1:$this.attr("rowSpan"))+"\",";
					tableStr+="\"colSpan\":\""+($this.attr("colSpan")==undefined?1:$this.attr("colSpan"))+"\"";
					tableStr+="}";
					if(j!=ths.length-1)tableStr+=",";
				})
				tableStr+="]";
			}
			var tds=$(this).find("td");
			if(tds.length>0){
				tableStr+="[";
				tds.each(function(j){
					var $this=$(this);
					tableStr+="{";
					
					var thisTex=$this.text().replace(/\ +/g,"");//去掉空格
		            thisTex= thisTex.replace(/[\r\n]/g,"");//去掉回车换行
		            
					tableStr+="\"text\":\""+thisTex+"\",";
					tableStr+="\"type\":\"td\",";
					tableStr+="\"dimColumn\":\""+($this.attr("dimColumn")==undefined?0:1)+"\",";
					tableStr+="\"rowSpan\":\""+($this.attr("rowSpan")==undefined?1:$this.attr("rowSpan"))+"\",";
					tableStr+="\"colSpan\":\""+($this.attr("colSpan")==undefined?1:$this.attr("colSpan"))+"\"";
					tableStr+="}";
					if(j!=tds.length-1)tableStr+=",";
				})
				tableStr+="]";
			}
			if(i!=trs.length-1)tableStr+=",";
		})
	}
	tableStr+="]";
	return tableStr;
}

function getTableTitle(container){
	var $tableTitle=container.find(".table-title");
	if($tableTitle.length==0)return "";
	var titleStr="\"titleStr\":\"";
	titleStr+=$tableTitle.text();
	titleStr+="\"";
	return titleStr;
}
function getTableParms(container){
	var $tableParms=container.find(".table-search");
	if($tableParms.length==0)return "";
	var parmsStr="\"parmsStr\":";
	var $parms=$tableParms.find(".table-search-item");
	if($parms.length==0)return "";
	$.each($parms,function(i){
		parmsStr+="\"";
		if($(".name",$(this)).text()!=""){
		   parmsStr+=$(".name",$(this)).text();
		}
		if($(".value",$(this)).text()!=""){
		   parmsStr+=$(".value",$(this)).text()+"";
		}
		parmsStr+="\"";
		if(i!=$parms.length-1){
			parmsStr+=",";
		}
	})
	//parmsStr+="";
	return parmsStr;
}