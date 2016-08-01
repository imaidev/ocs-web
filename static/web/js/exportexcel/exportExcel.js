(function($) {	
$(document).ready(function(){
	var tableJson='';//table数据组织
	var combiJson='';//整合全部数据	
	$("form table.exportExcel").each(function(){
		$thisTable=$(this);
		var initBodyDiv = document.createElement('div');
		$(initBodyDiv).addClass("exportExcelDiv");  
	    $thisTable.after($(initBodyDiv));
		$(initBodyDiv).click(function(){
			 for(i in creatJson){
				 creatJson[i]($thisTable);
			 }
		});
		
	});
})
var creatJson={
	tableData:function($thisTable){		
		tableJson="\"tableStr\":[";
		var trs=$thisTable.find("tr");
		if(trs.length>0){
			trs.each(function(i){	
			 var ths=$(this).find("th");
			 if(ths.length>0){
					tableJson+="[";
					ths.each(function(j){
					    var $this=$(this);
					    tableJson+="{";
								
					    var thisTex=$this.text().replace(/\ +/g,"");//去掉空格
					    thisTex= thisTex.replace(/[\r\n]/g,"");//去掉回车换行
					            
					    tableJson+="\"text\":\""+thisTex+"\",";
					    tableJson+="\"type\":\"th\",";
					    tableJson+="\"dimColumn\":\""+1+"\",";
					    tableJson+="\"thWidth\":\""+$this.width()+"\",";
			            tableJson+="\"rowSpan\":\""+($this.attr("rowSpan")==undefined?1:$this.attr("rowSpan"))+"\",";
					    tableJson+="\"colSpan\":\""+($this.attr("colSpan")==undefined?1:$this.attr("colSpan"))+"\"";
					    tableJson+="}";
					    if(j!=ths.length-1)tableJson+=",";
					})
					tableJson+="]";
					}
			var tds=$(this).find("td");
			if(tds.length>0){
				    tableJson+="[";
					tds.each(function(j){	
						var $this=$(this);
						tableJson+="{";
						var thisTex = '';
						var orSelect = $("select",$this);
						var orInput = $("input:visible[type='text']",$this);
						if(orSelect.length==1){
							thisTex=orSelect.val();
						}else if(orInput.length==1){
							thisTex=orInput.val();
						}else{
							thisTex=$this.text();
						}
								
						thisTex= thisTex.replace(/\ +/g,"");//去掉空格
					    thisTex= thisTex.replace(/[\r\n]/g,"");//去掉回车换行
					            
					    tableJson+="\"text\":\""+thisTex+"\",";
					    tableJson+="\"type\":\"td\",";
					    tableJson+="\"dimColumn\":\""+($this.attr("dimColumn")==undefined?0:1)+"\",";
					    tableJson+="\"rowSpan\":\""+($this.attr("rowSpan")==undefined?1:$this.attr("rowSpan"))+"\",";
					    tableJson+="\"colSpan\":\""+($this.attr("colSpan")==undefined?1:$this.attr("colSpan"))+"\"";
					    tableJson+="}";
						if(j!=tds.length-1)tableJson+=",";
					})
					tableJson+="]";
			}
			if(i!=trs.length-1)tableJson+=",";
			})
			}
				tableJson+="]";
			},
			combiData:function($thisTable){						
				if($thisTable.length==0){alert("id为："+tableId+"的表格不存在，请检查");return};			
				combiJson="{";				
				//导出excel是否自动换行
				var isWrapText=$thisTable.attr("wrapText");
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
				var fixedTr = $("thead tr",$thisTable).length;
				fixedTrStr+="\"fixedTrNum\":\"";
				fixedTrStr+=fixedTr;
				fixedTrStr+="\"";
				//导出excel后固定的列数
				var fixedTdStr="";
				fixedTdStr+="\"fixedTdNum\":\"";
				fixedTdStr+=0;
				fixedTdStr+="\"";
				
				//预留导出title信息
				var titleStr="";
				titleStr+="\"titleStr\":\"";
				titleStr+="明细表";
				titleStr+="\"";
				//预留导出更多信息
				var parmsStr="";
					parmsStr+="\"parmsStr\":\"";
					parmsStr+="";
					parmsStr+="\""
								
				combiJson+=wrapText+",";
				combiJson+=tableJson+",";
				combiJson+=titleStr+",";
				combiJson+=fixedTrStr+",";
				combiJson+=fixedTdStr+",";
				combiJson+=parmsStr;
				combiJson+="}";
				
				$("[name=\"sReportJsonHidden\"]").remove();
				$thisTable.after($("<input type=\"hidden\" name=\"sReportJsonHidden\" />").val(combiJson));
				//alert("form id='"+containerId+"' 需要action属性，并且submit，生成的json字符换放在name为sReportJsonHidden的hidden标签下，可以根据此名字在CMD内获取");
				var url="report2Excel.scmd";
				document.forms[0].action =url;
				document.forms[0].submit();	
			}
}
})(jQuery);
