$.ajaxSetup({
	async : false
});
$.post(getVerifyCodeUrl, function(verify) {
	$("#verifycode_hid_p").attr("value", verify);
});
	// 企业用户注册验证
jQuery.validator.addMethod("phone", function (value, element) {
	return this.optional(element)|| /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/i.test(value);
}, "电话格式如：0371-68787027");
jQuery.validator.addMethod("isMobile", function(value, element){
    var length = value.length;
    return this.optional(element) || length == 11 && /^1[34578]\d{9}$/.test(value);
},"请填写正确的手机号码");
	$(function() {
		$("#company_email_signup_from").validate({
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
					maxlength : 30,
					remote :{
						url : checkComNameUrl,
						type : "post",
						data : {"company_name":function(){return $("#company_name").val();} }
					}
				},
				company_email_password : {
					required : true,
					minlength : 6,
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
							"emailNum" : function() {return $("#company_email_num").val();}
						}
					}
				},
				company_area : {
					required : true,
				},
				contact_name : {
					required : true,
				},
				contact_phone : {
					required : true,
					isMobile : true,
					remote : {
						url : checkContactPhoneUrl,
						type : "post",
						data : {"contact_phone":function() {return $("#contact_phone").val();} 
						}
					}
				},
				fixed_telephone : {
					phone : true,
				},
				company_email_checkbox : {
					required : true,
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
					maxlength : "超出范围",
					remote : "该公司名称已被注册"
				},
				company_email_password : {
					required : "请输入密码",
					minlength : "密码长度不能小于6个字符",
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
				company_area : {
					required : "请输入企业所在地"
				},
				contact_name : {
					required : "请输入联系人姓名"
				},
				contact_phone : {
					required : "请输入手机号",
					isMobile : "请输入正确的手机号",
					remote :"手机号已被占用"
				},
				fixed_telephone : {
					phone : "请输入正确的电话号，包含区号"
				},
				company_email_checkbox : {
					required : "请阅读注册协议"
				}
			}
		});
	});
	// 企业发送邮件
	$("#get_company_email_code").on("click", function() {
		var email = $("#company_email_num").val();
		var validate = $("#company_email_num").valid(); 
		if (!validate) {
			return false;
		} 
		$("#get_company_email_code").val("发送中···").attr("disabled", true);
		$.ajax({
		async : true,
		type : "post",
		url : sendRegCodeToEmailUrl + email,
		success : function(data) {
		if (data == 'true') {
		btnDisabled("#get_company_email_code");
		} else {
		alert("邮件发送失败");
		}},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			$("#get_company_email_code").val("重新发送").removeAttr("disabled");
			alert( "发送失败:" + errorThrown +".请重试！" );
		}
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
	$("#company_email_submit").on("click", function() { 
		var validate = $("#company_email_signup_from").valid();
		if (!validate) {
			return false;
		}
		$("#company_email_password_hidden").val(toMD5Str($("#company_email_password").val()));
		$("#company_email_signup_from").ajaxSubmit({
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
