//校验规则初始化
$(document).ready(function() {
	$("#personal_email_code").validate({
		rules : {
			code : {
				required : true
			}
		},
		messages : {
			code : {
				required : "请输入邮箱验证码"
			}
		}
	});

	$("#verify_btn_email").on("click", emailClick);
	function emailClick() {
		$("#verify_btn_email").attr("disabled", true);
		// 获取邮箱校验码
		$.ajax({
			type : "POST",
			url : sendChangePwdCodeToEmailUrl,
			success : function(data) {
				if (data == 'true') {
					btnDisabled("#verify_btn_email");
				} else {
					alert("邮件发送失败");
					$("#verify_btn_email").attr("disabled", false);
					return false;
				}
			},
			error : function(data) {
				alert("由于网络原因，获取验证码失败！");
			}
		});
	}

	var phoneTimedown = 30;
	function phoneSettime() {
		if (phoneTimedown == 0) {
			$("#verify_btn_email").removeClass("back");
			$("#verify_btn_email").attr("disabled", false);
			$("#verify_btn_email").find("span")[0].firstChild.nodeValue = "获取邮箱验证码";
			$("#verify_btn_email").bind("click", phoneClick);
			phoneTimedown = 30;
		} else {
			$("#verify_btn_email").attr("disabled", true);
			$("#verify_btn_email").find("span")[0].firstChild.nodeValue = phoneTimedown + "s后重新发送";
			phoneTimedown--;
			setTimeout(function() {
				phoneSettime();
			}, 1000);
		}
	}
	
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
});
