$(document).ready(function() {
	// validating rule
	$("#bindmail_form").validate({
		rules : {
			oldMail : {
				required : true

			},
			newMail : {
				required : true,
				email : true,
				remote : checkLoginEmailUniqueUrl
			},
			password : {
				required : true
			}
		},
		messages : {
			oldMail : {
				required : "请输入您的邮箱"

			},
			newMail : {
				required : "请输入您的邮箱",
				email : "请输入正确的邮箱",
				remote : "该邮箱已绑定"
			},
			password : {
				required : "请输入密码"
			}
		}
	});

	var body = $("body");
	// clear input
	function bindClear() {
		body.find("input[name='oldMail']").val("");
		body.find("input[name='newMail']").val("");
		body.find("input[name='password']").val("");
	}
	;
	// submit
	$("#submit_btn").click(function() {
		var validate = $("#bindmail_form").valid();
		if (!validate) {
			return false;
		}
		var suf = "";
		var suffix = $("#emailSuffix");
		if (suffix && suffix[0]) {
			suf = suffix[0].firstChild.nodeValue;
		}
		var email = body.find("input[name='newMail']").val();
		var vcode = body.find("input[name='vcode']").val();
		var password = toMD5Str(body.find("input[name='password']").val());
		var submit_url = body.find("input[name='submit_url']").val();
		var data = {
			email : email,
			vcode : vcode,
			password : password
		};
		$.ajax({
			type : "POST",
			url : submit_url,
			data : data,
			success : function(data) {
				if ("-2" == data)
					alert("登录密码错误");
				if ("-1" == data)
					alert("验证码错误，请重新填写或重新获取！");
				if ("1" == data)
					alert("绑定成功");
				window.location.href=bind_success;
			},
			error : function(data) {
				alert("由于网络原因，绑定失败!");
			}
		});
	});
	$("#cancle_btn").on("click", function() {
		bindClear();
	});

	$("#verify_btn").on("click", phoneClick);

	function phoneClick() {
		$("#verify_btn").unbind("click", phoneClick);
		var validate = body.find("input[name='newMail']").valid();
		if (!validate) {
			$("#verify_btn").bind("click", phoneClick);
			return false;
		}
		var email = body.find("input[name='newMail']").val();
		// get verify code
		var sendLoginEmailCodeToEmailUrl = body.find("input[name='sendLoginEmailCodeToEmailUrl']").val();
		var data = {
			email : email
		};
		$.ajax({
			type : "POST",
			url : sendLoginEmailCodeToEmailUrl,
			data : data,
			success : function(data) {
				if ("true" == data) {
					var color = $("#verifyOK").css("color");
					var value = $("#verifyOK")[0].firstChild.nodeValue;
					$("#verifyOK").css("color", "red");
					$("#verifyOK")[0].firstChild.nodeValue = "已发送邮件验证码，请查收并输入";
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
			$("#verify_btn").find("span")[0].firstChild.nodeValue = "获取邮箱验证码";
			$("#verify_btn").bind("click", phoneClick);
			$("#verifyOK").css("color", "gray");
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
