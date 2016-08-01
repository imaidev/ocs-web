//jquery after ready
$(document).ready(function(){  
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr = testPassWordStrength(value);
		if (pswdStr < 2) {
			return false;
		} else {
			return true;
		}
	}, "Password strength is too low, please choose to use letters, numbers or special characters in any of the two");
//vadation init
	$(function(){
		$("#changePwd_form").validate({
			rules:{ 
				newPassWord:{
					required:true,
					password_rule:true,
					pswd_strength:$("#newPassWord").val()
					},
				confirm_password:{
					required:true,
					equalTo:"#newPassWord"
						}
			},
				
			messages:{
				newPassWord:{
					required:"Please enter your new password.",
					password_rule:"Please fill in according to the format requirements.",
					pswd_strength:"Please choose  letters, numbers or special characters in any of the two."
						}, 
				confirm_password:{
					required:"Please enter the confirmation password.",
					equalTo:"Please keep this password consistent with the last input one. "
							}
			}
			});
	});
	
	//reset input
	function clearInput(){
		$("#newPassWord").val("");
		$("#confirm_password").val(""); 
		$("#oldPassWord").val("");
		$(".form-tip").html("");
	}; 
	//submit click
	$("#submit_btn").click(function(){
		
			var validate=$("#changePwd_form").valid();
			if(!validate){
				return false;
			} 
			if($("#oldPassWord").val() == $("#newPassWord").val()){
				dialog.error("You set a new password and current password is the same, the need to modify！");
				return false;
			}
			//pwd strength
			var password=$("#newPassWord").val();  
			$("#newPassWord").val(toMD5Str($("#newPassWord").val()));
			$("#confirm_password").val(toMD5Str($("#confirm_password").val()));
			$("#changePwd_form").ajaxSubmit({
				success:function(data) {
					if(data==1) { 
						window.location.href = $("body").find("input[name='login_url']").val(); 
					}else if(data==-1){
						 dialog.error("The input password is wrong, please input again!");
					}else{
						dialog.error("Fail to save, please try again later!");
					}
				}
			});
			clearInput();
	});
	//cancle
	$("#clear_btn").click(clearInput);
});