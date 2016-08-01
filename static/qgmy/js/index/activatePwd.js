 
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
						url : checkPwdCodeToEmailUrl,
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
					required : "Please enter the verification code.",
					number : "Please input correct verification code.",
					minlength : "Please enter the six-figure verification code.",
					maxlength : "Please enter the six-figure verification code.",
					remote : "The verification code is not correct, please re-enter or obtain again."
				}
			}
		});
	}); 

	// 发送邮件
	$("#get_company_email_code").on("click", function() {
		var email = $("#company_email_num").val();  
		$.ajax({
		type : "post",
		url : getPwdEmailActivateUrl + email,
		success : function(data) {
		if (data == 'true') {
		btnDisabled("#get_company_email_code");
		} else {
		alert("Fail to send an email.");
		}}
		});
	});
	function btnDisabled(btnid) {
		var count = 30;
		var countdown = setInterval(CountDown, 1000); 
		function CountDown() {
			$(btnid).text("It has been sent, please wait for " + count + "seconds!");
			if (count == 0) {
				$(btnid).text("Resend");
				clearInterval(countdown);
			}
			count--;
		}
	} 
	$("#company_email_submit").on("click", function() {
		if($("#email_change_from").valid()){
		$.ajax({
			type : "post",
			url : checkPwdCodeToEmailUrl,
			async:false,
			data : {
				"company_email_code":function() {return $("#company_email_code").val();}, 
                "company_email_num":function() {return $("#company_email_num").val();} 
			},
			success : function(data) {
			if (data=='true') {
				window.location.href = activateEmailUrl; 
			} else {
				alert("verification code is wrong");
			}}
			});
		}
	});
});