//jquery after ready
$(document).ready(function(){
	 jQuery.validator.addMethod("check", function(value, element) { 
		 return $("#oldPassWord").val()!=$("#newPassWord").val(); 
		      }, "新旧密码不能一样！"); 
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr = testPassWordStrength(value);
		if (pswdStr < 2) {
			return false;
		} else {
			return true;
		}
	}, "密码强度过低，请使用字母、数字或特殊字符中任两种"); 
//vadation init
	$(function(){
		$("#changePwd_form").validate({
			rules:{ 
				newPassWord:{
					required:true,
					minlength : 6,
					pswd_strength:$("#newPassWord").val(),
					check :true
					},
					checknum : {
						required:true,
						number:true,
						minlength:4,
						maxlength:4,
						remote :{
							url:checkNumUrl,
							type: "post",
							data:{
								"checknum":function(){
									return $("#checknum").val()}
							}
						}
					},
				confirm_password:{
					required:true,
					equalTo:"#newPassWord"
						}
			},
				
			messages:{
				newPassWord:{
					required:"Please enter your new password.",
					minlength:"Password length cannot be less than 6 characters.",
					pswd_strength:"Password safety level is too low, please choose any.",
					check:"Old and new passwords can not be the same！"
						}, 
					checknum :{
						required:"Please enter the verification code.",
						number:"Please input correct verification code.",
						minlength:"Please enter the four-figure verification code.",
						maxlength:"Please enter the four-figure verification code.",
						remote:"The verification code is not correct."
					},
				confirm_password:{
					required:"lease enter the confirmation password.",
					equalTo:"Please make sure the password is consistent."
							}
			}
			});
	}); 
	var body = $("body");
	//reset input
	function clearInput(){
		$("#newPassWord").val("");
		$("#confirm_password").val("");
		$("#oldPassWord").val("");
		$("#checknum").val("");
		$(".form-tip").html("");
	}; 
	//submit click
	$("#submit_btn").on("click",function(){
		
			var validate=$("#changePwd_form").valid();
			if(!validate){
				return false;
			} 
			if($("#oldPassWord").val() == null ||$("#oldPassWord").val() == ''){
				dialog.error("Enter your current password！"); 
				return false; 
			}
			//pwd strength
			$("#personal_email_password_strength").val(testPassWordStrength($("#newPassWord").val())); 
			$("#oldPassWord").val(toMD5Str($("#oldPassWord").val()));
			$("#newPassWord").val(toMD5Str($("#newPassWord").val()));
			$("#confirm_password").val(toMD5Str($("#confirm_password").val()));
			$("#changePwd_form").ajaxSubmit({
				success:function(data) {
					if(data==1) { 
						dialog.success("Password modification success！",function(){ 
							top.location.href = $("body").find("input[name='login_url']").val(); 
						});
					}else if(data==-1){
						 dialog.error("The current password is wrong, please input again！",function()
									{
								window.location.reload(); 
								}); 
					}
					else if(data==-2){
						 dialog.error("Verification code is not correct！",function()
									{
								window.location.reload(); 
								}); 
					}else{
						dialog.error("Save failed, please try again later！",function()
								{
							parent.location.reload(); 
							}); 
				}
				}
			});
			clearInput();
	}); 
});
setTimeout("changeVerify()",'100');  
function changeVerify(){ 
    var date = new Date();
    var url = verifyUrl;
    var ttime = date.getTime();
    /*verifyImg.src = url + '&_='+ttime;*/
    $("#verifyImg").attr("src",url + '&_='+ttime);
}