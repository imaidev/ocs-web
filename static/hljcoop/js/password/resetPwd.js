//校验规则初始化
$(document).ready(function() {
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr = testPassWordStrength(value);
		if (pswdStr < 2) {
			return false;
		} else {
			return true;
		}
	}, "密码强度过低");

	var body = $("body");
	$("#resetpwd_form").validate({
		rules : {
			password : {
				required : true,
				minlength : 6,
				maxlength : 15,
				password_rule : true,
				pswd_strength : true
			},
			confirm_password : {
				required : true,
				minlength : 6,
				maxlength : 15,
				equalTo : "#password"
			}
		},
		messages : {
			password : {
				required : "请输入密码",
				minlength : "输入长度最小是6 的字符。",
				maxlength : "输入长度最多是15 的字符。",
				password_rule : "请按要求填写"
			},
			confirm_password : {
				required : "请输入确认密码",
				minlength : "输入长度最小是6 的字符。",
				maxlength : "输入长度最多是15 的字符。",
				equalTo : "请与上次输入密码相一致"
			}

		}
	});

	// 清除填写的信息
	var bindClear = function() {
		body.find("input[name='password']").val("");
		body.find("input[name='confirm_password']").val("");
	};
	// 提交
	var submit = function() {
		// 计算密码强度
		var password = $("#password").val();
		var grade = testPassWordStrength(password);
		var password = toMD5Str(body.find("input[name='password']").val());
		var resetPwdUrl = body.find("input[name='resetPwdUrl']").val();
		var data = {
			password : password,
			password_strength : grade
		};
		$.ajax({
			type : "POST",
			url : resetPwdUrl,
			data : data,
			success : function(data) {
				switch (data) {
				case "0":window.location.href = $("body").find("input[name='getPwdUrl']").val();
				case "1":
					alert("修改密码成功!");
					window.location.href = $("body").find("input[name='loginUrl']").val();
					break;
				default:
					alert("重置密码失败，重新找回密码!");
					window.location.href = $("body").find("input[name='getPwdUrl']").val();
					break;
				}
			},
			error : function(data) {
				alert("由于网络原因，重置密码失败!");
			}
		});
	};

	$("#submit_btn").click(function() {
		var validate = $("#resetpwd_form").valid();
		if (!validate) {
			return false;
		}
		submit();
	});
	$("#cancle_btn").click(function() {
		bindClear();
	});
});
