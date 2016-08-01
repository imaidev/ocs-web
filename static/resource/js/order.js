//格式化数字
function formatNum(num,cnt) {
	var f = parseFloat(num);
	if(cnt<0){
		cnt=0;
	}
	return f.toFixed(cnt);
}
//检查是否数字
function isNumberic(num){
	if (num == null || num == '' || num.length <= 0) {
		return false;
	}
	var numChar = "0123456789";
	var i;
	for( i = 0; i < num.length;i++)
	{
		if( numChar.indexOf(num.substring(i,i+1)) == -1 )
			return false;	
	}
	return true;
}

//实时获取卷烟限量
function getBusiCgtLmt(url,obj,func) {
	$.ajaxLoad({
	    //请求的url为xxx.do，后面带一个method的参数
	    url:url, 
	    callback:function(data) {
	        func(data,obj);
	    },
	    dataType:"json",
	    type:"post"
	});
}
//批量实时获取卷烟限量
function getBusiCgtLmtPL(url,func) {
	$.ajaxLoad({
	    //请求的url为xxx.do，后面带一个method的参数
	    url:url, 
	    callback:function(data) {
	        func(data);
	    },
	    dataType:"json",
	    type:"post"
	});
}
//获取银行余额
function getAcc(url,func){
	$.ajaxLoad({
	    //请求的url为xxx.do，后面带一个method的参数
	    url:url, 
	    callback:function(data) {
			func(data);
	    },
	    dataType:"text",
	    type:"post"
	});
}
//重新获取零售户卷烟限量
function getCurCgtLmtPL(url,func) {
	$.ajaxLoad({
	    //请求的url为xxx.do，后面带一个method的参数
	    url:url, 
	    callback:function(data) {
	        func(data);
	    },
	    dataType:"json",
	    type:"post"
	});
}
//处理键盘按下事件
function doKeyDown() {
	var evt=getEvent();
	var obj = evt.srcElement || evt.target;
	var dataBox = document.getElementById("cgt");
	//获取当前行号
	var row = obj.parentElement.parentElement.rowIndex;
	//如果按回车或向下键，则跳到下一个
	if (evt.keyCode == 13 || evt.keyCode == 40){//回车或向下键
		if (row < dataBox.rows.length-2) {
			$("input[name=req_qty]")[row].select();
			$("input[name=req_qty]")[row].focus();
		} else {//如果是最后一行，则失去焦点
			evt.keyCode = 9;
		}
	} else if (evt.keyCode == 38){//如果按向上键，则跳到上一个
		if (row > 1) {
			$("input[name=req_qty]")[row-2].select();
			$("input[name=req_qty]")[row-2].focus();
		}
	}
}
//获取事件
function getEvent() {
	if(document.all) {
		return window.event;//如果是ie
	}
	func=getEvent.caller;
	while(func!=null) {
		var arg0=func.arguments[0];
		if(arg0) {
			if((arg0.constructor==Event || arg0.constructor ==MouseEvent)
			||(typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation))
			{
				return arg0;
			}
		}
		func=func.caller;
	}
	return null;
}

//获取事件对象
function getEventObj() {
	var evt=getEvent();
	var obj = evt.srcElement || evt.target;
	return obj;
}

//删除卷烟
function delCgt(obj) {
	var dataBox = document.getElementById("cgt");
	var i = obj.parentElement.parentElement.rowIndex;//图片按钮->td->tr->rowIndex
	//获取当前行卷烟信息
	var cgtName = dataBox.rows[i].cells[7].children[3].value;
	if( !confirm( "您确定要删除卷烟【"+cgtName+"】?") ){
		return ;
	}
	//删除行
	var row = dataBox.rows[i];
	var par = row.parentNode;
	//dataBox.rows[i].removeNode(true);
	par.removeChild(row);
	//重新计算合计
	calSum();	
}
