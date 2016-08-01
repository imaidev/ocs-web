//校验规则初始化
$(document).ready(function() {
	$("#personal_phone_code").validate({
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
		$("#verify_btn").attr("disabled", true);
		// 获取手机校验码
		$.ajax({
			type : "POST",
			url : sendChangePwdCodeToPhoneUrl,
			success : function(data) {
				if (data == 'true') {
					btnDisabled("#verify_btn");
				} else {
					alert("短信发送失败");
					$("#verify_btn").attr("disabled", false);
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
			$("#verify_btn").removeClass("back");
			$("#verify_btn").attr("disabled", false);
			$("#verify_btn").find("span")[0].firstChild.nodeValue = "获取短信验证码";
			$("#verify_btn").bind("click", phoneClick);
			phoneTimedown = 30;
		} else {
			$("#verify_btn").attr("disabled", true);
			$("#verify_btn").find("span")[0].firstChild.nodeValue = phoneTimedown + "s后重新发送";
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
