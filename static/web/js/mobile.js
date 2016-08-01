var getElementByClass = function(searchClass, node, tag) {
	if (node == null)
		node = document;
	if (tag == null)
		tag = '*';
	try{
	var els = node.getElementById(tag).childNodes[1].childNodes;
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if (pattern.test(els[i].className)) {
			return els[i];
			j++;
		}
	}
	}catch(err){
		console.log("header 0 处理异常"+err.code);
	}
	return "undisplay";
};
function MJAnylHead() {
	var left, leftArr, title, rightArr, right;
	title = getElementByClass("title", null, "header")
	if (title != "undisplay") {
		title = title.textContent;
		left = getElementByClass("header-btn-left", null, "header").textContent;
		right = getElementByClass("header-btn-right", null, "header").textContent;
		leftArr = getElementByClass("header-btn-left-arr", null, "header").textContent;
		rightArr = getElementByClass("header-btn-right-arr", null, "header").textContent;
	}
	// alert(left+title+right+leftArr+rightArr);
	try {
		window.native.setHead(left, leftArr, title, rightArr, right);
		document.getElementById("header").style.display = "none";
	} catch (err) {
		document.getElementById("header").style.display = "";
		console.log("header 1 处理异常" + err.code);
	}
}	
function test(){
	alert("werw");
}
//document.addEventListener("deviceready", MJAnylHead, false);
document.addEventListener("DOMContentLoaded", MJAnylHead, false);


function MJLeftArrOnclick(){
//	alert("leftArr test")
}
function MJRightArrOnclick(){
//	alert("rightArr test")
}
function MJLeftBtnOnclick(){
	try {
		window.ins.backHistory();
	} catch (e) {
		history.back();
	}
	
}
function MJRightBtnOnclick(){
//	alert("rightBtn test")
}

var tempInput;
function MCSetDate(date) {
	tempInput.value = date;
}
function MCSetMonth(month) {
	tempInput.value = month;
}
function MCSetTime(time) {
	tempInput.value = time;
}
function MJGetDate(callBack) {
	try {
		if(callBack){
			window.native.getDate(callBack);
		}else{
			window.native.getDate("MCSetDate");
		}
	} catch (e) {
		tempInput.value = "today";
	}
}
function MJGetMonth(callBack) {
	try {
		if(callBack){
			window.native.getMonth(callBack);
		}else{
			window.native.getMonth("MCSetMonth");
		}
	} catch (e) {
		tempInput.value = "month";
	}
}

function MJGetTime(callBack) {
	try {
		if(callBack){
			window.native.getTime(callBack);
		}else{
			window.native.getTime("MCSetTime");
		}
	} catch (e) {
		tempInput.value = "month";
	}
}
//弹出编辑框
function MJShowEditDialog(callBackOK,callBackCancle,title,message){
    $("#mobile_title").siblings().remove();
	   var returnVal=null;
	   $("#mobile_all").css("display","block");
	   $("#mobile_all").css("z-index",9999);
	   if(message==""){
			$("#mobile_title").before('<div id="mobile_cancel_button">取消</div>');	
		} else{
			$("#mobile_title").before('<div id="mobile_cancel_button">删除</div>');
		};
		$("#mobile_title").before('<div id="mobile_sure_button">确定</div>');
		$("#mobile_title").text(title);
		$("#mobile_message").text(message);
		$("#mobile_sure_button").click(function(){
		    $("#mobile_all").css("display","none");
		    returnVal=$("#mobile_message").text();
		    $("#mobile_title").siblings().remove();
		    //alert(returnVal);
		    if(callBackOK) callBackOK();//点击确定的回调函数
		  //  function callBackOK();
		    return returnVal;
		});

		
		$("#mobile_cancel_button").live('click',function(){
			if($("#mobile_cancel_button").text()=="取消"){
				$("#mobile_all").css("display","none");
				$("#mobile_title").siblings().remove();
				 return null;
			}
			if($("#mobile_cancel_button").text()=="删除"){
			   if(callBackCancle) callBackCancle(); //点击删除的回调函数
			  // alert('调用删除的方法');
            if($("#mobile_message").text()==""){
				$("#mobile_cancel_button").text('取消');
			   }
			}
			
		}); 			
}
//弹出选择框
function MJShowSingleChoiceDialog(array,title){
	   $("#mobile_content").children().remove();
	   $("#mobile_choise").css("display","block");
	   $("#mobile_choise").css("z-index",9999);
	   if(title==""){
		   title="请选择";
	   }
	   $("#mobile_title").text(title);  
	 //  getArgs(array);
		 for(var i=0; i<array.length;i++){
				var pairs = array[i].split('#');
				//alert(pairs[0]);
				//alert(pairs[1]);
				//alert(pairs[2]);
				if(pairs[2]==0){
			     $tmpHTML='<div id=\"message_array'+i+'\"class=\"row_message\">'
	    	                  +'<span id=\"message_text'+i+'\"class=\"message_text\">'+pairs[1]+'</span>'
	    	                  +'<span id=\"message_radio'+i+'\"class=\"message_radio\"></span>'
	    	                  +'</div>';
	    	                  $("#mobile_content").append($tmpHTML); 
				}else{
				$tmpHTML='<div id=\"message_array'+i+'\"class=\"row_message\">'
	                  +'<span id=\"message_text'+i+'\"class=\"message_text\">'+pairs[1]+'</span>'
	                  +'<span id=\"message_radio'+i+'\"class=\"message_radio_checked\"></span>'
	                  +'</div>';
	                  $("#mobile_content").append($tmpHTML); 
					
				}
	                
		 }
	    $(".message_radio").click(function(){

	    	var backVal=null;
	    	backVal=$(this).siblings('.message_text').text();
	    	$(this).removeClass("message_radio");
	    	$(this).addClass("message_radio_checked");
	    	//alert(backVal);
	    	setTimeout($("#mobile_choise").css("display","none"),2000);
	    	
	    	//$("#mobile_content").children().remove();
	    	//$(this).siblings().remove();
	    	//$(this).parents(".row_message").remove();
	    	

	    	return backVal;
	    })
	   $(".message_radio_checked").click(function(){
		    var backVal=null;
	    	backVal=$(this).siblings('.message_text').text();
	    	$(this).removeClass("message_radio");
	    	//alert(backVal);
	    	setTimeout($("#mobile_choise").css("display","none"),2000); 
	    	return backVal;
	   })
	   
}	