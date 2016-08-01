$(document).ready(function() {

	// validating method

	jQuery.validator.addMethod("photo_repeate", function(value, element) {
		if ($("#oldMobile").length > 0 && bind_phone != "") {
			if (this.settings.onfocusout) {
				if (value === bind_phone) {
					return false;
				} else {
					return true;
				}
			}
		}
		return true;
	}, "该手机号与上次绑定手机一致");

	// validating rule
	$("#bindphone_form").validate({
		rules : {
			mobile : {
				required : true,
				phone_rule : true,
				photo_repeate : true,
				remote : checkLoginPhoneUniqueUrl
			},
			vcode : {
				required : true
			},
			password : {
				required : true,
				password_rule : true
			}
		},
		messages : {
			mobile : {
				required : "请输入您要绑定的手机号",
				phone_rule : "请正确输入手机号",
				remote : "手机号已绑定"
			},
			vcode : {
				required : "请输入手机验证码"
			},
			password : {
				required : "请输入密码",
				password_rule : "请按要求填写"
			}
		}
	});

	var body = $("body");
	// clear input
	function bindClear() {
		body.find("input[name='mobile']").val("");
		body.find("input[name='vcode']").val("");
		body.find("input[name='password']").val("");
	}

	// submit
	$("#submit_btn").on("click", function() {
		var validate = $("#bindphone_form").valid();
		if (!validate) {
			return false;
		}
		var mobile = body.find("input[name='mobile']").val();
		var vcode = body.find("input[name='vcode']").val();
		var password = toMD5Str(body.find("input[name='password']").val());
		var submit_url = body.find("input[name='submit_url']").val();
		var data = {
			mobile : mobile,
			vcode : vcode,
			password : password
		};
		$.ajax({
			type : "POST",
			url : submit_url,
			data : data,
			success : function(data) {
				data = eval('(' + data + ')');
				switch (data) {
				case 1:
					alert("绑定成功！");
					window.location.href=bind_success;
					break;
				case 0:
					alert("激活码已失效，请重新获取激活码！");
					break;
				case -1:
					alert("验证码错误，请重新填写或重新获取！");
					break;
				case -2:
					alert("登录密码填写有误，请重新填写！");
					break;
				case 2:
					alert("绑定失败，请稍后重试！");
					break;
				}
			},
			error : function(data) {
				alert("由于网络原因，获取验证码失败！");
			}
		});
	});

	$("#cancle_btn").on("click", bindClear);

	var body = $("body");
	$("#verify_btn").on("click", phoneClick);

	function phoneClick() {
		$("#verify_btn").unbind("click", phoneClick);
		var validate = body.find("input[name='mobile']").valid();
		if (!validate) {
			$("#verify_btn").bind("click", phoneClick);
			return false;
		}
		var mobile = body.find("input[name='mobile']").val();
		var oldMobileDom = $("#oldMobile");
		if (oldMobileDom && oldMobileDom[0]) {
			var oldMobile = oldMobileDom[0].firstChild.nodeValue;
			if (mobile == oldMobile) {
				alert("新手机号与已绑定的手机号重复，请输入其他手机号！");
				$("#verify_btn").bind("click", phoneClick);
				return false;
			}
		}
		// get verify code
		var verifyPhone_url = body.find("input[name='verifyPhone_url']").val();
		var data = {
			mobile : mobile
		};
		$.ajax({
			type : "POST",
			url : verifyPhone_url,
			data : data,
			success : function(data) {
				if ("true" == data) {
					var color = $("#verifyOK").css("color");
					var value = $("#verifyOK")[0].firstChild.nodeValue;
					$("#verifyOK").css("color", "red");
					$("#verifyOK")[0].firstChild.nodeValue = "已发送手机验证码，请查收并输入";
					$("#verify_btn").addClass('back');
					phoneSettime();
				}
			},
			error : function(data) {
				$("#verify_btn").bind("click", phoneClick);
				alert("由于网络原因，获取验证码失败！");
			}
		});
	}
	var phoneTimedown = 60;
	function phoneSettime() {
		if (phoneTimedown == 0) {
			$("#verify_btn").removeClass("back");
			$("#verify_btn").attr("disabled", false);
			$("#verify_btn").find("span")[0].firstChild.nodeValue = "获取短信验证码";
			$("#verify_btn").bind("click", phoneClick);
			$("#verifyOK").css("color", "gray");
			$("#verifyOK")[0].firstChild.nodeValue = "请输入短信验证码";
			phoneTimedown = 60;
		} else {
			$("#verify_btn").find("span")[0].firstChild.nodeValue = phoneTimedown + "s后重新发送";
			phoneTimedown--;
			setTimeout(function() {
				phoneSettime();
			}, 1000);
		}
	}
});
