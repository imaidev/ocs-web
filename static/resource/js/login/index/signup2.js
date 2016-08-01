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
		$("#company_email_signup_from").validate({
			rules : {
				company_login_email : {
					required : true,
					maxlength:60,
					email : true,
					remote :{
						url : checkLoginNameUrl,
						type : "post",
						data : {
							"loginName":function() {return $("#company_login_email").val();}
							 }
						}
				},
				company_name : {
					required : true,
					maxlength : 100,
					character_test : true,
					remote :{
						url : checkNickNameUrl,
						type : "post",
						data : {"nickName":function(){return $("#company_name").val();} }
					}
				},
				company_email_password : {
					required : true,
					minlength : 6,
					pswd_strength:$("#company_email_password").val()
				},
				company_email_password_comfirm : {
					required : true,
					equalTo : "#company_email_password"
				},
				company_email_num : {
					required : true,
					email : true,
					remote :{
						url : checkEmailUrl,
						type : "post",
						data : {"emailNum":function(){return $("#company_email_num").val();} }
					}
				},
				company_email_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToEmailUrl,
						type : "post",
						data : {
							"emailCode":function() {return $("#company_email_code").val();},
							"emailNum" : function() {return $("#company_login_email").val();}
						}
					}
				},
				company_email_checkbox : {
					required : true,
				}
			},
			errorPlacement: function(error, element) 
			{  
			    $('<br/>').appendTo(element.parent());   
			    error.appendTo(element.parent());
			},
			messages : {
				company_login_email : {
					required : "请自定义登录邮箱",
					maxlength :"登录邮箱超长",
					email : "请输入正确邮箱",
					remote : "该登录邮箱已被注册"
				},
				company_name : {
					required : "请输入公司名称",
					maxlength : "超出范围",
					character_test : "公司名称格式不正确",
					remote : "该公司名称已被注册"
				},
				company_email_password : {
					required : "请输入密码",
					minlength : "密码长度不能小于6个字符",
					pswd_strength:"密码强度过低，建议使用字母、数字或特殊字符中任两种"
				},
				company_email_password_comfirm : {
					required : "请输入确认密码",
					equalTo : "请与上次输入密码相一致"
				},
				company_email_num : {
					required : "请输入您的邮箱",
					email : "请输入正确的邮箱",
					remote : "该邮箱已被占用"
				},
				company_email_code : {
					required : "请输入验证码",
					number : "请正确输入验证码",
					minlength : "请输入六位验证码",
					maxlength : "请输入六位验证码",
					remote : "验证不正确，请重新填写或获取"
				},
				company_email_checkbox : {
					required : "请阅读并同意注册协议",
				}
			}
		});
	});
	// 企业用户英文注册验证
	$(function() {
		$("#company_email_signup_from_en").validate({
			rules : {
				company_login_email : {
					required : true,
					maxlength:60,
					email : true,
					remote :{
						url : checkLoginNameUrl,
						type : "post",
						data : {
							"loginName":function() {return $("#company_login_email").val();}
							 }
						}
				},
				company_name : {
					required : true,
					maxlength : 100,
					remote :{
						url : checkNickNameUrl,
						type : "post",
						data : {"nickName":function(){return $("#company_name").val();} }
					}
				},
				company_email_password : {
					required : true,
					minlength : 6,
					pswd_strength:$("#company_email_password").val()
				},
				company_email_password_comfirm : {
					required : true,
					equalTo : "#company_email_password"
				},
				company_email_num : {
					required : true,
					email : true,
					remote :{
						url : checkEmailUrl,
						type : "post",
						data : {"emailNum":function(){return $("#company_email_num").val();} }
					}
				},
				company_email_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToEmailUrl,
						type : "post",
						data : {
							"emailCode":function() {return $("#company_email_code").val();},
							"emailNum" : function() {return $("#company_login_email").val();}
						}
					}
				},
				company_email_checkbox : {
					required : true,
				}
			},
			errorPlacement: function(error, element) 
			{  
			    $('<br/>').appendTo(element.parent());   
			    error.appendTo(element.parent());
			},
			messages : {
				company_login_email : {
					required : "Please enter your email.",
					maxlength :"Mailbox input length.",
					email : "Please enter your email address correctly.",
					remote : "Your email has been registered."
				},
				company_name : {
					required : "Please enter the company name.",
					maxlength : "Company name is overlong",
					remote : "Your company has been registered."
				},
				company_email_password : {
					required : "Please enter the password.",
					minlength : "Password length cannot be less than 6 characters.",
					pswd_strength:"Password safety level is too low."
				},
				company_email_password_comfirm : {
					required : "Please enter the confirmation password.",
					equalTo : "This input password is not consistant with last one."
				},
				company_email_num : {
					required : "Please enter your email.",
					email : "Please enter your email address correctly.",
					remote : "Your email has been registered."
				},
				company_email_code : {
					required : "Please enter the verification code.",
					number : "Verification code should be digital.",
					minlength : "It should be a six-figure digital.",
					maxlength : "It should be a six-figure digital.",
					remote : "The verification code is not correct, please re-enter or obtain again."
				},
				company_email_checkbox : {
					required : "Please read the agreement and agree",
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
					maxlength:60,
					email: true,
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
					pswd_strength:$("#personal_email_password").val()
				},
				personal_email_password_confirm : {
					required : true,
					minlength : 6,
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
				},
				personal_email_checkbox : {
					required : true,
				},
				personal_referrer : {
					maxlength:60
				}

			},
			errorPlacement: function(error, element) 
			{  
			    $('<br/>').appendTo(element.parent());   
			    error.appendTo(element.parent());
			},
			messages : {
				personal_email_num : {
					required : "Please enter your email.",
					maxlength :"Mailbox input length.",
					email : "Please enter your email address correctly.",
					remote : "Your email has been registered."
				},
				personal_email_password : {
					required : "Please enter the password.",
					minlength : "Password length cannot be less than 6 characters.",
					pswd_strength:"Password safety level is too low."
				},
				personal_email_password_confirm : {
					required : "Please enter the confirmation password.",
					minlength : "The confirmation password cannot be less than 6 characters.",
					equalTo : "This input password is not consistant with last one."
				},
				personal_email_code : {
					required : "Please enter the verification code.",
					number : "Verification code should be digital.",
					minlength : "It should be a six-figure digital.",
					maxlength : "It should be a six-figure digital.",
					remote : "The verification code is not correct, please re-enter or obtain again."
				},
				personal_email_checkbox : {
					required : "Please read the agreement and agree.",
				},
				personal_referrer : {
					maxlength :"Referrer input length.",
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
					isMobile : true,
					remote : {
						url : CheckPhoneNum,
						type : "post",
						data : {"phoneNum" : function() { return $("#personal_phone_num").val();}}
					}
				},
				personal_phone_password : {
					required : true,
					minlength : 6,
					pswd_strength:$("#personal_phone_password").val()
				},
				personal_phone_password_confirm : {
					required : true,
					minlength : 6,
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
					isMobile : "请输入正确的手机号",
					remote : "该手机号已被注册"
				},
				personal_phone_password : {
					required : "请输入密码",
					minlength : "密码长度不能小于6个字符",
					pswd_strength:"密码强度过低，请选择使用字母、数字或特殊字符中任两种"
				},
				personal_phone_password_confirm : {
					required : "请输入确认密码",
					minlength : "确认密码不能小于6个字符",
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
					alert("注册失败，系统异常");
					 
				} else if (data == '-2') {
					alert("用户名重复");
					 
				} else if (data == '-3') {
					alert("该邮箱已被注册");
					 
				} else if (data == '-4') {
					alert("验证码已失效");
				 
				} else if (data == '-5') {
					alert("验证码错误");
				 
				}else{
					alert("系统错误");
				}
			}
		});
	});
	
	$("#personal_email_submit2").on("click", function() {
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
					window.location.href = brBasicInfoUrl;
				} else if (data == '-1') {
					alert("注册失败，系统异常");
					 
				} else if (data == '-2') {
					alert("用户名重复");
					 
				} else if (data == '-3') {
					alert("该邮箱已被注册");
					 
				} else if (data == '-4') {
					alert("验证码已失效");
				 
				} else if (data == '-5') {
					alert("验证码错误");
				 
				}else{
					alert("系统错误");
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
			type : "post",
			url : sendRegCodeToPhoneUrl + phone,
			success : function(data) {
			if (data == 'true') {
			btnDisabled("#get_personal_phone_code");
			} else {alert("短信发送失败");}
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
		/*$("#get_personal_email_code").val("Send in···").attr("disabled", true);*/
		$("#get_personal_email_code").attr("disabled", true);
		$.ajax({
			async : true,
			type : "post",
			url : sendRegCodeToEmailUrl + email,
			success : function(data) {
			if (data == 'true') {
			btnDisabled("#get_personal_email_code");
			} else {
				alert("Message sending failed");
				$("#get_personal_email_code").attr("disabled", false);
				return false;
			}}
		});		 
	});

	// 企业发送邮件
	$("#get_company_email_code").on("click", function() {
		var email = $("#company_login_email").val();
		var validate = $("#company_login_email").valid();
		if (!validate) {
			return false;
		}
		/*$("#get_company_email_code").val("发送中···").attr("disabled", true);*/
		$("#get_company_email_code").attr("disabled", true);
		$.ajax({
		async : true,
		type : "post",
		url : sendRegCodeToEmailUrl + email,
		success : function(data) {
		if (data == 'true') {
			btnDisabledFactory("#get_company_email_code");
		} else {
		alert("邮件发送失败");
		$("#get_company_email_code").attr("disabled", false);
		return false;
		}}
		});
	});
	// 英文企业发送邮件
	$("#get_company_email_code_en").on("click", function() {
		var email = $("#company_login_email").val();
		var validate = $("#company_login_email").valid();
		if (!validate) {
			return false;
		}
		/*$("#get_company_email_code").val("发送中···").attr("disabled", true);*/
		$("#get_company_email_code").attr("disabled", true);
		$.ajax({
		async : true,
		type : "post",
		url : sendRegCodeToEmailUrl + email,
		success : function(data) {
		if (data == 'true') {
			btnDisabledFactoryEn("#get_company_email_code_en");
		} else {
		alert("Message sending failed");
		$("#get_company_email_code").attr("disabled", false);
		return false;
		}}
		});
	});
	function btnDisabled(btnid) {
		var count = 60;
		var countdown = setInterval(CountDown, 1000);

		function CountDown() {
			$(btnid).attr("disabled", true);
			$(btnid).val("Please wait for " + count + " seconds.");
			if (count == 0) {
				$(btnid).val("Resend").removeAttr("disabled");
				clearInterval(countdown);
			}
			count--;
		}
	}
	function btnDisabledFactory(btnid) {
		var count = 60;
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
	function btnDisabledFactoryEn(btnid) {
		var count = 60;
		var countdown = setInterval(CountDown, 1000);

		function CountDown() {
			$(btnid).attr("disabled", true);
			$(btnid).val("Please wait for " + count + " seconds.");
			if (count == 0) {
				$(btnid).val("Resend").removeAttr("disabled");
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
	$("#company_email_submit").on("click", function() {
		var validate = $("#company_email_signup_from").valid();	
		if (!validate) {
			return false;
		}
		$("#company_email_password_strength").val(testPassWordStrength($("#company_email_password").val()));
		$("#company_email_password_hidden").val(toMD5Str($("#company_email_password").val()));
		$("#company_email_signup_from").ajaxSubmit({
			type:"POST",
			success : function(data) {
				if (data > 0) {
					// 激活邮箱界面
					window.location.href = "/ecweb/qgmyvend/vendfactory/vendFactory.htm";
				} else if (data == '-1') {
					alert("注册失败，系统异常");
				} else if (data == '-2') {
					alert("用户名重复");
				} else if (data == '-3') {
					alert("该邮箱已被注册");
				} else if (data == '-4') {
					alert("验证码已失效");
				} else if (data == '-5') {
					alert("验证码错误");
				}else{
					alert("系统错误");
				}
			}
		});
	});
	$("#company_email_submit_en").on("click", function() {
		var validate = $("#company_email_signup_from_en").valid();	
		if (!validate) {
			return false;
		}
		$("#company_email_password_strength").val(testPassWordStrength($("#company_email_password").val()));
		$("#company_email_password_hidden").val(toMD5Str($("#company_email_password").val()));
		$("#company_email_signup_from_en").ajaxSubmit({
			type:"POST",
			success : function(data) {
				if (data > 0) {
					// 激活邮箱界面
					window.location.href = "/ecweb/qgmyenvend/vendfactory/vendFactory.htm";
				} else if (data == '-1') {
					alert("注册失败，系统异常");
				} else if (data == '-2') {
					alert("用户名重复");
				} else if (data == '-3') {
					alert("该邮箱已被注册");
				} else if (data == '-4') {
					alert("验证码已失效");
				} else if (data == '-5') {
					alert("验证码错误");
				}else{
					alert("系统错误");
				}
			}
		});
	});
});
