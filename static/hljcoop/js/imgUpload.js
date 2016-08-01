function uploadImg(obj){
	$("#IMG_NAME").val(obj);
	if($("#"+obj+"1_SHOW").val()!="" && $("#"+obj+"2_SHOW").val() != "" && $("#"+obj+"3_SHOW").val()!= "" && $("#"+obj+"4_SHOW").val() !=""){
		alert("图片已上传完毕!");
		return false;
	}
	
	$.layer({
        type : 2,
        iframe : {
            src :  imgUploadUrl
        },
        title : "上传资源",
        closeBtn : false,
        shadeClose: true,
        offset:['50px' , ''],
        area : ['550px','450px']
    });
}

//回调函数
function imageCallBack(path) { 
	var IMG_NAME = $("#IMG_NAME").val();
	if($("#"+IMG_NAME+"1_SHOW").val() =="" ){
		$("#"+IMG_NAME+"1_SHOW").val(path);
		$("#"+IMG_NAME+"1_A").attr("href",path);
		$("#"+IMG_NAME+"1").attr("src",path);
		$("#"+IMG_NAME+"1").show("fast");
		return ;
	}
	else if($("#"+IMG_NAME+"2_SHOW").val() ==""){
		$("#"+IMG_NAME+"2_SHOW").val(path);
		$("#"+IMG_NAME+"2_A").attr("href",path);
		$("#"+IMG_NAME+"2").attr("src",path);
		$("#"+IMG_NAME+"2").show("fast");
		return ;
	}
	else if($("#"+IMG_NAME+"3_SHOW").val() ==""){
		$("#"+IMG_NAME+"3_SHOW").val(path);
		$("#"+IMG_NAME+"3_A").attr("href",path);
		$("#"+IMG_NAME+"3").attr("src",path);
		$("#"+IMG_NAME+"3").show("fast");
		return ;
	}
	else if($("#"+IMG_NAME+"4_SHOW").val() ==""){
		$("#"+IMG_NAME+"4_SHOW").val(path);
		$("#"+IMG_NAME+"4_A").attr("href",path);
		$("#"+IMG_NAME+"4").attr("src",path);
		$("#"+IMG_NAME+"4").show("fast");
		return ;
	}else {
		alert("图片上传完毕");
	}
}
//删除图片
function delImg(obj){
	var imgPath = "";
	var input = "";
	var img = "";
	var a = "";
	if($("#"+obj+"4_SHOW").val() !=""){
		imgPath = $("#"+obj+"4_SHOW").val();
		input = "#"+obj+"4_SHOW";
		img = "#"+obj+"4";
		a = "#"+obj+"4_A";
	}
	else if($("#"+obj+"3_SHOW").val() !=""){
		imgPath = $("#"+obj+"3_SHOW").val();
		input = "#"+obj+"3_SHOW";
		img = "#"+obj+"3";
		a = "#"+obj+"3_A";
	}
	else if($("#"+obj+"2_SHOW").val() !=""){
		imgPath = $("#"+obj+"2_SHOW").val();
		input = "#"+obj+"2_SHOW";
		img = "#"+obj+"2";
		a = "#"+obj+"2_A";
	}
	else if($("#"+obj+"1_SHOW").val() !=""){
		imgPath = $("#"+obj+"1_SHOW").val();
		input = "#"+obj+"1_SHOW";
		img = "#"+obj+"1";
		a = "#"+obj+"1_A";
	}
	else{
		alert("图片已全部删除");
		return false;
	}
	var option = {
			url : delImgUrl + imgPath,
			type : "POST",
			dataType : "text",
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			success : function(data) {
				alert(data);
				$(input).val("");
				$(img).attr("src","");
				$(a).removeAttr("href");
			}
		}
	$.ajax(option);
	
}