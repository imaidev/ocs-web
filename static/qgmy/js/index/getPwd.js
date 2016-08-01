
$(document).ready(function() {
	var body = $("body");
	// validate init
	$("#getpwd_form").validate({
		rules : {
			login_name:{
				required:true,
				email:true
			},
			checknum : {
				required:true,
				number:true,
				minlength:4,
				maxlength:4,
				remote :{
					url:checkNumUrl,
					type: "post",
					data:{
						"checknum":function(){
							return $("#checknum").val()}
					}
				}
			}
		},
		messages:{
			login_name:{
				required:"Please enter the login email."
			},
			checknum :{
				required:"Please enter the verification code.",
				number:"Please input correct verification code.",
				minlength:"Please enter the four-figure verification code.",
				maxlength:"Please enter the four-figure verification code.",
				remote:"The verification code is not correct."
			}
				
		}
	});
	// 清除填写的信息
	var bindClear = function(){
		body.find("input[name='login_name']").val("");
		body.find("input[name='checknum']").val("");
	};
	// 提交
	var submit = function(){
		var login_name = body.find("input[name='login_name']").val();
		var checknum = body.find("input[name='checknum']").val();
		var submit_url = body.find("input[name='secPassword_url']").val();
		var data = {
				login_name : login_name,
				checknum : checknum
		};
		$.ajax({
			type : "POST",
			url : submit_url,
			data : data,
			success : function(data) {
				if(data=='-1') {	
					dialog.error("The verification code is not correct, please re-enter or obtain again!");
					changeVerify();
				}else if(data == '0'){
					dialog.error("The login name does not exist, please enter again!");
					changeVerify();
				}else if(data == '1'){
					window.location.href = $("body").find("input[name='chooseSecPwd_url']").val();
				}else{
                                     
					dialog.error("System error!Please try again later!");
				}
			},
			error : function(data) {
				dialog.error(" Fail to get verification code due to network reasons!");
			}
		});
	};
	
	$("#submit_btn").click(function() {
		var validate = $("#getpwd_form").valid();
		if(!validate){
			return false;
		}
		submit();
	});
	$("#cancle_btn").click(function() {
		bindClear();
	});
});
