$().ready(function(){
		$("#br_form").validate({
			rules:{
				realName : {
					required : true,
					maxlength : 30
				},
				phone_area : {
					required : true
				},
				other_tel:{
					required : true,
					maxlength : 20
				},
				country : {
					required : true
				},	
				address : {
					required : true,
					maxlength : 80
				},
				doc_id:{
					required : true,
					maxlength : 25
				}
			},
			messages:{
				realName : {
					required : "Please enter real name",
					maxlength : "Out of range"
				},
				phone_area:{
					required : "Please select area"
				},
				other_tel : {
					required : "Please enter mobile Phone",
					maxlength : "Out of range"
				},	
				country : {
					required : "Please select country"
				},
				address:{
					required : "Please enter address",
					maxlength : "Out of range"
				},
				doc_id:{
					required : "Please enter number of the certificate",
					maxlength : "Out of range"
				}
			}
	});
});		

function uploadImg(flag){
	$.layer({
        type : 2,
        iframe : {
            src :  "/ecweb/resUpload.res?method=init&lang=en&dir=vend&type=image&callback=imageCallBack"+flag
        },
        title : "上传资源",
        closeBtn : false,
        shadeClose: true,
        offset:['50px' , ''],
        area : ['550px','450px']
    });
}

function save(){
	var validate = $("#br_form").valid();	
	if (!validate) {
		return;
	}
	var legal_upload_a = $("#legal_upload_a").val();
	var legal_upload_b = $("#legal_upload_b").val();
	var legal_upload_c = $("#legal_upload_c").val();
	if(legal_upload_a==null || legal_upload_a==''){
		alert("Please upload certificate scanned copy(front)");
		return;
	}
	if(legal_upload_b==null || legal_upload_b==''){
		alert("Please upload certificate scanned copy(back)");
		return;
	}
	if(legal_upload_c==null || legal_upload_c==''){
		alert("Please upload upper body photo with certificate in hand");
		return;
	}
	document.forms[0].submit();
}

//回调函数
function imageCallBack0(path) { 
	$("#legal_upload_a").val(path);
	$("#legal_img_a").attr("src",path);
	$("#legal_img_a").show("fast");
}
function imageCallBack1(path) { 
	$("#legal_upload_b").val(path);
	$("#legal_img_b").attr("src",path);
	$("#legal_img_b").show("fast");
}

function imageCallBack2(path) { 
	$("#legal_upload_c").val(path);
	$("#legal_img_c").attr("src",path);
	$("#legal_img_c").show("fast");
}
		