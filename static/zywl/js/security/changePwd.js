//jquery after ready
$(document).ready(function() {

	// pwd's validating rule
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr = testPassWordStrength(value);
		if (pswdStr < 2) {
			return false;
		} else {
			return true;
		}
	}, "密码强度过低");

	// vadation init
	$(function() {
		$("#changePwd_form").validate({
			rules : {
				oldPassWord : {
					required : true,
					password_rule : true,
					remote : {
						url : checkOldPasswordUrl,
						type : "post",
						data : {
							"oldPsw" : function() {
								return toMD5Str($("#oldPassWord").val())
							}
						}
					}
				},
				newPassWord : {
					required : true,
					password_rule : true,
					pswd_strength : true
				},
				confirm_password : {
					required : true,
					equalTo : "#newPassWord"
				},
				personal_phone_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkChangePwsToPhoneUrl,
						type : "post",
						data : { 
							"phoneCode":function() { return $("#personal_phone_code").val(); },
						}
					}
				},
				personal_email_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkChangePwsToEmailUrl,
						type : "post",
						data : { 
							"emailCode":function() { return $("#personal_email_code").val(); },
						}
					}
				}
				
			},

			messages : {
				newPassWord : {
					required : "请输入您的新密码",
					password_rule : "请按格式要求填写"
				},
				oldPassWord : {
					required : "当前密码非空",
					password_rule : "格式不正确",
					remote : "原密码错误"
				},
				confirm_password : {
					required : "请输入确认密码",
					equalTo : "请与上次输入密码相一致"
				},
				personal_phone_code : {
					required : "请输入验证码",
					number : "验证码应为数字",
					minlength : "位数应为六位",
					maxlength : "位数应为六位",
					remote : "验证码不正确，请重新输入或获取"
				},
				personal_email_code : {
					required : "请输入验证码",
					number : "验证码应为数字",
					minlength : "位数应为六位",
					maxlength : "位数应为六位",
					remote : "验证码不正确，请重新输入或获取"
				}
			}
		});
	});

	// reset input
	function clearInput() {
		$("#newPassWord").val("");
		$("#confirm_password").val("");
		$("#oldPassWord").val("");
		$("#personal_phone_code").val("");
		$("#personal_email_code").val("");
		$(".form-tip").html("");
	}
	;
	var body = $("body");
	// submit click
	$("#submit_btn").on("click", function() {

		var validate = $("#changePwd_form").valid();
		if (!validate) {
			return false;
		}
		if ($("#oldPassWord").val() == $("#newPassWord").val()) {
			alert("您设置新密码与当前密码相同，无需修改！");
			return false;
		}
		// pwd strength
		var password = $("#newPassWord").val();
		var grade = testPassWordStrength(password);
		$("#newPassWordStrength").val(grade);
		$("#oldPassWord").val(toMD5Str($("#oldPassWord").val()));
		$("#newPassWord").val(toMD5Str($("#newPassWord").val()));
		$("#confirm_password").val(toMD5Str($("#confirm_password").val()));
		$("#changePwd_form").ajaxSubmit({
			success : function(data) {
				data = eval('(' + data + ')');
				if (data == 1) {
			      alert("密码修改成功！");
				  top.location.href = $("body").find("input[name='login_url']").val();  
				} else if (data == -1) {
					alert("当前密码输入有误，请重新输入！");
				} else {
					alert("保存失败，请稍后重试！");
				}
			}
		});
		clearInput();
	});
	//cancle
	$("#clear_btn").on("click", clearInput);
});
