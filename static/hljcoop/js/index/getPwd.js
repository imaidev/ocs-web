
$(document).ready(function() {
	var body = $("body");
	// validate init
	$("#getpwd_form").validate({
		rules : {
			login_name:{
				required:true
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
				required:"请输入登录用户名"
			},
			checknum :{
				required:"请输入验证码",
				number:"请正确输入验证码",
				minlength:"请输入四位验证码",
				maxlength:"请输入四位验证码",
				remote:"验证码不正确"
			}
				
		}
	});
	//清除填写的信息
	var bindClear = function(){
		body.find("input[name='login_name']").val("");
		body.find("input[name='checknum']").val("");
	};
	//提交
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
					dialog.error("校验码错误，请重新输入或者重新获取！");
					changeVerify();
				}else if(data == '0'){
					dialog.error("登录账号不存在，请重新输入！");
					changeVerify();
				}else if(data == '1'){
					window.location.href = $("body").find("input[name='chooseSecPwd_url']").val();
				}else{
                                     
					dialog.error("系统错误，请稍后重试！");
				}
			},
			error : function(data) {
				dialog.error("由于网络原因，获取验证码失败！");
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
