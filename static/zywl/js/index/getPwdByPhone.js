//校验规则初始化
$(document).ready(function() {
	var body = $("body");
	$("#getpwd_byphone_form").validate({
		rules : {
			code : {
				required : true
			}
		},
		messages : {
			code : {
				required : "请输入手机验证码"
			}
		}
	});

	$("#verify_btn").on("click", phoneClick);
	function phoneClick() {
		$("#verify_btn").unbind("click", phoneClick);
		// 获取手机校验码
		var sendPwdCodeToPhoneUrl = body.find("input[name='sendPwdCodeToPhoneUrl']").val();
		$.ajax({
			type : "POST",
			url : sendPwdCodeToPhoneUrl,
			success : function(data) {
				if (data == '-1') {
					alert("服务器异常，获取验证码失败。请联系系统管理员！");
				} else if (data == '1') {
					var color = $("#verify").css("color");
					var value = $("#verify")[0].firstChild.nodeValue;
					$("#verify").css("color", "red");
					$("#verify")[0].firstChild.nodeValue = "已发送手机验证码，请查收并输入"
					$("#vcode").on("change", function() {
						$("#verify").css("color", color);
						$("#verify")[0].firstChild.nodeValue = value;
					});
					$("#verify_btn").addClass('back');
					phoneSettime();
					$("#verify_btn").unbind("click", phoneClick);
				} else {
					var color = $("#verify").css("color");
					var value = $("#verify")[0].firstChild.nodeValue;
					$("#verify").css("color", "red");
					$("#verify")[0].firstChild.nodeValue = "已发送手机验证码，请查收并输入"
					$("#vcode").on("change", function() {
						$("#verify").css("color", color);
						$("#verify")[0].firstChild.nodeValue = value;
					});
					$("#verify_btn").addClass('back');
					phoneSettime();
					$("#verify_btn").unbind("click", phoneClick);
				}
			},
			error : function(data) {
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
			$("#verify_btn").attr("disabled", true);
			$("#verify_btn").find("span")[0].firstChild.nodeValue = phoneTimedown + "s后重新发送";
			phoneTimedown--;
			setTimeout(function() {
				phoneSettime();
			}, 1000);
		}
	}
	// 去掉重选找回方式的按钮
	var cancelReChoose = function() {
		var e = $("body").find("div[name='re_choose']");
		if (e[0]) {
			e.remove();
		}
	}
	// 清除填写的信息
	var bindClear = function() {
		body.find("input[name='code']").val("");
	};
	// 提交
	var submit = function() {
		var vcode = body.find("input[name='code']").val();
		var checkPwdCodeByPhoneUrl = body.find("input[name='checkPwdCodeByPhoneUrl']").val();
		var data = {
			vcode : vcode
		};
		$.ajax({
			type : "POST",
			url : checkPwdCodeByPhoneUrl,
			data : data,
			success : function(data) {
				if (data == '0') {
					window.location.href = body.find("input[name='getPwdUrl']").val();
				} else if (data == '1') {
					window.location.href = body.find("input[name='resetPwdUrl']").val();
				} else if(data == '-1'){
					alert("短信校验码错误！");
				}
			},
			error : function(data) {
				alert("由于网络原因，获取验证码失败！");
			}
		});
	};

	$("#submit_btn_phone").click(function() {
		var validate = $("#getpwd_byphone_form").valid();
		if (!validate) {
			return false;
		}
		submit();
	});
	$("#cancle_btn_phone").click(function() {
		bindClear();
	});
});
