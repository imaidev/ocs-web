 
$(document).ready(function() { 
	// 验证码输入验证
	
	$(function() {
		$("#email_change_from").validate({
			rules : {  
				company_email_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToEmailUrl,
						type : "post",
						data : {
							"company_email_code":function() {return $("#company_email_code").val();}, 
		                    "company_email_num":function() {return $("#company_email_num").val();} 
						}
					}
				}
			},
			messages : { 
				company_email_code : {
					required : "请输入验证码",
					number : "请正确输入验证码",
					minlength : "请输入六位验证码",
					maxlength : "请输入六位验证码",
					remote : "验证不正确，请重新填写或获取"
				}
			}
		});
	}); 

	// 发送邮件
	$("#get_company_email_code").on("click", function() {
		var email = $("#company_email_num").val();  
		//$("#get_company_email_code").attr("disabled", true);
		//$("#get_company_email_code").hide();
		$.ajax({
		type : "post",
		url : sendRegCodeToEmailUrl + email,
		success : function(data) {
		if (data == 'true') {
		btnDisabled("#get_company_email_code");
		} else {
		alert("邮件发送失败");
		}}
		});
	});
	function btnDisabled(btnid) {
		var count = 30;
		var countdown = setInterval(CountDown, 1000); 
		function CountDown() {
			//$(btnid).attr("disabled", true);
			$(btnid).text("已发送，请等待 " + count + " 秒!");
			if (count == 0) {
				//$(btnid).val("重新发送").removeAttr("disabled");
				$(btnid).text("重新发送");
				clearInterval(countdown);
			}
			count--;
		}
	} 
	$("#company_email_submit").on("click", function() { 
		$("#email_change_from").ajaxSubmit({
			type:"POST",
			success : function(data) {
				if (data > 0) {
					// 激活邮箱界面
					window.location.href = activateEmailUrl; 
				} else if (data == '-4') {
					alert("验证码已失效");
				}  
			}
		});
	});
});