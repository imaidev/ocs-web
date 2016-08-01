//校验规则初始化
$(document).ready(function() {
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr=testPassWordStrength(value);
		if(pswdStr<2){
			return false;
		}else{
			return true;}
		}, "密码强度过低，请选择使用字母、数字或特殊字符中任两种"); 
	
	var body = $("body");
	$("#resetpwd_form").validate({
		rules : {
			password:{
				required:true,
				password_rule:true,
				pswd_strength:true
			},
			confirm_password:{
				required:true,
				equalTo:"#password"
			}
		},
		messages:{
			password:{
				required:"请输入密码",
				password_rule:"请按要求填写"
			},
			confirm_password:{
				required:"请输入确认密码",
				equalTo:"请与上次输入密码相一致"
			}
				
		}
	});
	
	//清除填写的信息
	var bindClear = function(){
		body.find("input[name='password']").val("");
		body.find("input[name='confirm_password']").val("");
	};
	//提交
	var submit = function(){
		//计算密码强度
		var password=$("#password").val();
		var grade=testPassWordStrength(password);
		var password = toMD5Str(body.find("input[name='password']").val());
		var submit_url = body.find("input[name='submit_url']").val();
		var data = {
				password : password,
				password_strength:grade
		};
		$.ajax({
			type : "POST",
			url : submit_url,
			data : data,
			success : function(data) {
				switch(data){
					case "1":
						dialog.success("修改密码成功!",function(){
							window.location.href = $("body").find("input[name='login_url']").val();
						});
						
						break;
					default:
						dialog.error("重置密码失败，重新找回密码!",function(){
							window.location.href = $("body").find("input[name='getPwd_url']").val();
						});
						break;
				}
			},
			error : function(data) {
				dialog.error("由于网络原因，重置密码失败!");
			}
		});
	};
	
	$("#submit_btn").click(function(){
		var validate = $("#resetpwd_form").valid();
		if(!validate){
			return false;
		}
		submit();
	});
	$("#cancle_btn").click(function(){
		bindClear();
		//取消校验？？？？？？
	});
});
