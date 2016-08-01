$(document).ready(function() {
	$(".auto_item_id").each(function(){
		 $(this).autocomplete("../autocomplete.cmd?method=itemIdAssociate", {
		        max: 15, //列表里的条目数 
		        minChars: 1, //自动完成激活之前填入的最小字符 
		        width: 250, //提示的宽度，溢出隐藏 
		        scrollHeight: 300, //提示的高度，溢出显示滚动条 
		        matchContains: true, //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示 
		        autoFill: false, //自动填充
		        //显示在下拉框里的内容
		        formatItem: function (row, i, max) {//row表示每一行的数据对象，i表示每一行的编号，max表示总的数据行数
		            //return  row.KEY+"#"+row.VALUE;
		        	//alert(row.VALUE);
		        	return row.VALUE;
		        }
		    })
			.result(function (event, row, formatted) {
				//选择一行时触发
				$("#itemIdSearch").val(row.KEY);
				$(this).val(row.KEY2);
			});
	});
	
	$(".auto_item_id_mul").each(function(){
		 $(this).autocomplete("../autocomplete.cmd?method=itemIdAssociate", {
		        max: 15, //列表里的条目数 
		        minChars: 1, //自动完成激活之前填入的最小字符 
		        width: 250, //提示的宽度，溢出隐藏 
		        scrollHeight: 300, //提示的高度，溢出显示滚动条 
		        matchContains: true, //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示 
		        autoFill: false, //自动填充
		        //显示在下拉框里的内容
		        multiSelect:true,
		        formatItem: function (row, i, max) {//row表示每一行的数据对象，i表示每一行的编号，max表示总的数据行数
		        	return row.VALUE;
		        }
		    })
			.result(function (event, rows) {
				var rowKeys  = "";
				var rowKeys2 = "";
				for(var i=0;i<rows.length;i++){
					rowKeys = rowKeys+"'"+rows[i].KEY+"',";
					rowKeys2 = rowKeys2+rows[i].KEY2+",";
	  			}
				if(rowKeys!=null&&rowKeys!=''){
					rowKeys= rowKeys.substring(0, rowKeys.length-1);
					rowKeys2= rowKeys2.substring(0, rowKeys2.length-1);
				}
				//选择一行时触发
				$("#itemIdSearch").val(rowKeys);
				$(this).val(rowKeys2);
			});
	});
});

function clearItemId(){ //用于清除itemid
 	var itemName_Search = $("#itemName_Search").val();
 	if(itemName_Search==""||itemName_Search==null){
 		$("#itemIdSearch").val("");
 	}
 	

}