$.ajaxSetup({
	async : false
});
$.post(getVerifyCodeUrl, function(verify) {
	$("#verifycode_hid_p").attr("value", verify);
});
$(document).ready(function() {
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr = testPassWordStrength(value);
		if (pswdStr < 2) {
			return false;
		} else {
			return true;
		}
	}, "密码强度过低，请选择使用字母、数字或特殊字符中任两种");
	// 企业用户注册验证
	$(function() {
		$("#company_phone_signup_from").validate({
			rules : {
				company_login_name : {
					required : true,
					loginName_rule : $("#company_login_name").val(),
					remote :{
						url : checkLoginNameUrl,
						type : "post",
						data : {
							"loginName":function() {return $("#company_login_name").val();}
							 }
						}
				},
				company_name : {
					required : true,
					isChnAndEng:true,
					maxlength : 20
				},
				contact_name : { 
					isChinese:true,
					maxlength : 20
				},
				company_phone_password : {
					required : true,
					minlength : 6,
					maxlength : 15,
					pswd_strength:$("#company_phone_password").val()
				},
				company_phone_password_comfirm : {
					required : true,
					equalTo : "#company_phone_password"
				},
				company_phone_num : {
					required : true,
					maxlength: 11,
					phone_rule : true,
					remote : {
						url : CheckPhoneNum,
						type : "post",
						data : {"phoneNum" : function() { return $("#company_phone_num").val();}}
					} 
				},
				company_phone_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToPhoneUrl,
						type : "post",
						data : { 
							"phoneCode":function() { return $("#company_phone_code").val(); },
							"phoneNum":function() { return $("#company_phone_num").val(); }
						}
					} 
				}
			},
			messages : {
				company_login_name : {
					required : "请自定义登录账号",
					loginName_rule : "登录账号应为字母开头，允许数字下划线的5-20位组合",
					remote : "该用户名已被注册"
				},
				company_name : {
					required : "请输入公司名称",
					isChnAndEng :"只能包含汉字和字母",
					maxlength : "超出范围"
				},
				contact_name : { 
					isChinese:"联系人请输入汉字",
					maxlength : "超出范围"
				},
				company_phone_password : {
					required : "请输入密码",
					minlength : "密码长度不能小于6个字符",
					maxlength : "密码长度不能大于15个字符",
					pswd_strength:"密码强度过低，请选择使用字母、数字或特殊字符中任两种"
				},
				company_phone_password_comfirm : {
					required : "请输入确认密码",
					equalTo : "请与上次输入密码相一致"
				},
				company_phone_num : {
					required : "请输入手机号",
					maxlength :"手机号码为11位",
					phone_rule : "请输入正确的手机号",
					remote : "该手机号已被注册"
				},
				company_phone_code : {
					required : "请输入验证码",
					number : "请正确输入验证码",
					minlength : "请输入六位验证码",
					maxlength : "请输入六位验证码",
					remote : "验证不正确，请重新填写或获取"
				}
			}
		});
	});
	// 个人 邮箱注册验证
	$().ready(function() {
		$("#personal_mail_signup_form").validate({
			rules : {
				personal_email_num : {
					required : true,
					email: true,
					maxlength:50,
					remote: {
						url: checkEmailUrl,
						type: "post",
						data:{ "emailNum" : function() {return $("#personal_email_num").val(); }
							 }
					}
				},
				personal_email_password : {
					required : true,
					minlength : 6,
					maxlength : 15,
					pswd_strength:$("#personal_email_password").val()
				},
				personal_email_password_confirm : {
					required : true,
					equalTo : "#personal_email_password"
				},
				personal_email_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToEmailUrl,
						type : "post",
						data : {
							"emailCode": function() { return $("#personal_email_code").val(); },
							"emailNum" : function() {  return $("#personal_email_num").val();
							}
						}
					}
				}

			},
			messages : {
				personal_email_num : {
					required : "请输入您的邮箱地址",
					email : "请输入正确的邮箱地址",
					maxlength : "超出范围",
					remote : "您的邮箱已被注册"
				},
				personal_email_password : {
					required : "请输入密码",
					minlength : "密码长度不能小于6个字符",
					maxlength : "密码长度不能大于15个字符",
					pswd_strength:"密码强度过低，请选择使用字母、数字或特殊字符中任两种"
				},
				personal_email_password_confirm : {
					required : "请输入确认密码",
					equalTo : "两次输入密码不一致"
				},
				personal_email_code : {
					required : "请输入验证码",
					number : "验证码应为数字",
					minlength : "位数应为六位",
					maxlength : "位数应为六位",
					remote : "验证不正确，请重新填写或获取"
				}
			}
		});
	});
	// 个人 手机号注册验证
	$().ready(function() {
		$("#personal_phone_signup_form").validate({
			rules : {
				personal_phone_num : {
					required : true,
					maxlength : 11,
					phone_rule : true,
					remote : {
						url : CheckPhoneNum,
						type : "post",
						data : {"phoneNum" : function() { return $("#personal_phone_num").val();}}
					}
				},
				personal_phone_password : {
					required : true,
					minlength : 6,
					maxlength : 15,
					pswd_strength:$("#personal_phone_password").val()
				},
				personal_phone_password_confirm : {
					required : true,
					equalTo : "#personal_phone_password"
				},
				personal_phone_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToPhoneUrl,
						type : "post",
						data : { 
							"phoneCode":function() { return $("#personal_phone_code").val(); },
							"phoneNum":function() { return $("#personal_phone_num").val(); }
						}
					}
				}
			},
			messages : {
				personal_phone_num : {
					required : "请输入手机号",
					maxlength:"手机号码为11位",
					phone_rule : "请输入正确的手机号",
					remote : "该手机号已被注册"
				},
				personal_phone_password : {
					required : "请输入密码",
					minlength : "密码长度不能小于6个字符",
					maxlength : "密码长度不能大于15个字符",
					pswd_strength:"密码强度过低，请选择使用字母、数字或特殊字符中任两种"
				},
				personal_phone_password_confirm : {
					required : "请输入确认密码",
					equalTo : "两次输入密码不一致"
				},
				personal_phone_code : {
					required : "请输入验证码",
					number : "验证码应为数字",
					minlength : "位数应为六位",
					maxlength : "位数应为六位",
					remote : "验证码不正确，请重新输入或获取"
				}
			}
		});
	});
	$("#personal_email_submit").on("click", function() {
		var validate = $("#personal_mail_signup_form").valid();
		if (!validate) {
			return false;
		}
		$("#personal_email_password_strength").val(testPassWordStrength($("#personal_email_password").val()));
		$("#personal_email_password_hidden").val(toMD5Str($("#personal_email_password").val()));
		$("#personal_mail_signup_form").ajaxSubmit({
			type:"POST",
			success : function(data) {
				if (data > 0) {
					// 激活邮箱界面
					window.location.href = activateEmailUrl;
				} else if (data == '-1') {
					alert("注册失败");
					 
				} else if (data == '-2') {
					alert("用户名重复");
					 
				} else if (data == '-3') {
					alert("该邮箱已被注册");
					 
				} else if (data == '-4') {
					alert("验证码已失效");
				 
				} else if (data == '-5') {
					alert("验证码错误");
				 
				}
			}
		});
	});

	// 个人 注册发送手机验证码
	$("#get_personal_phone_code").on("click", function() {
		var phone = $("#personal_phone_num").val();
		var validate = $("#personal_phone_num").valid();
		if (!validate) return ;
		$("#get_personal_phone_code").attr("disabled", true);
		 $.ajax({
			async : true,
			type : "post",
			url : sendRegCodeToPhoneUrl + phone,
			success : function(data) {
			if (data == 'true') {
			btnDisabled("#get_personal_phone_code");
			} else {
				alert("短信发送失败");
				$("#get_personal_phone_code").attr("disabled", false);
				}
			}
		 
		 });	 
	});
	// 个人注册发送邮件
	$("#get_personal_email_code").on("click", function() {
		var email = $("#personal_email_num").val();
		var validate = $("#personal_email_num").valid();
		if (!validate) {
			return false;
		}
		$("#get_personal_email_code").attr("disabled", true);
		$.ajax({
			async : true,
			type : "post",
			url : sendRegCodeToEmailUrl + email,
			success : function(data) {
			if (data == 'true') {
			btnDisabled("#get_personal_email_code");
			} else {
				alert("邮件发送失败");
				$("#get_personal_email_code").attr("disabled", false);
				return false;
			}}
		});		 
	});

	// 企业发送手机验证码
	$("#get_company_phone_code").on("click", function() {
		var phone = $("#company_phone_num").val();
		var validate = $("#company_phone_num").valid();
		if (!validate) {
			return false;
		}
		$("#get_company_phone_code").attr("disabled", true);
		$.ajax({
		async : true,
		type : "post",
		url : sendRegCodeToPhoneUrl + phone,
		success : function(data) {
		if (data == 'true') {
		btnDisabled("#get_company_phone_code");
		} else {
		alert("短信发送失败");
		$("#get_company_phone_code").attr("disabled", false);
		return false;
		}}
		});
	});
	function btnDisabled(btnid) {
		var count = 30;
		var countdown = setInterval(CountDown, 1000);

		function CountDown() {
			$(btnid).attr("disabled", true);
			$(btnid).val("已发送，请等待 " + count + " 秒!");
			if (count == 0) {
				$(btnid).val("重新发送").removeAttr("disabled");
				clearInterval(countdown);
			}
			count--;
		}
	}
	$("#personal_phone_submit").on("click", function() {
		var validate = $("#personal_phone_signup_form").valid();
		if (!validate) {
			return false;
		}
		$("#personal_phone_password_strength").val(testPassWordStrength($("#personal_phone_password").val()));
		$("#personal_phone_password_hidden").val(toMD5Str($("#personal_phone_password").val()));
		$("#personal_phone_signup_form").ajaxSubmit({
			type:"POST",
			success : function(data) {
			if (data > 0) {
				// 激活邮箱界面
				window.location.href = activateEmailUrl;
			} else if (data == '-1') {
				alert("注册失败");
			} else if (data == '-2') {
				alert("用户名重复");
			} else if (data == '-3') {
				alert("该手机已被注册");
			} else if (data == '-4') {
				alert("验证码已失效");
			} else if (data == '-5') {
				alert("验证码错误");
			}
			}
		});
	});
	$("#company_phone_submit").on("click", function() {
		var validate = $("#company_phone_signup_from").valid();
		if (!validate) {
			return false;
		}
		$("#company_phone_password_strength").val(testPassWordStrength($("#company_phone_password").val()));
		$("#company_phone_password_hidden").val(toMD5Str($("#company_phone_password").val()));
		$("#company_phone_signup_from").ajaxSubmit({
			type:"POST",
			success : function(data) {
				if (data > 0) {
					// 激活邮箱界面
					window.location.href = activateEmailUrl;
				} else if (data == '-1') {
					alert("注册失败");
				} else if (data == '-2') {
					alert("用户名重复");
				} else if (data == '-3') {
					alert("该手机已被注册");
				} else if (data == '-4') {
					alert("验证码已失效");
				} else if (data == '-5') {
					alert("验证码错误");
				}
			}
		});
	});
});
