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
				confirm_password:{
					required:true,
					equalTo:"#newPassWord"
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
						}
			},
				
			messages:{
				newPassWord:{
					required:"请输入您的新密码",
					minlength:"密码长度不能小于6个字符",
					pswd_strength:"请重新设置,试试数字、字母、符号组合",
					check:"新旧密码不能一样"
						},  
					checknum : {
						required : "请输入验证码",
						number : "请正确输入验证码",
						minlength : "请输入四位验证码",
						maxlength : "请输入四位验证码",
						remote : "验证码不正确"
					},
				confirm_password:{
					required:"请输入确认密码",
					equalTo:"请与新密码相一致"
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
	//submit clicks
	$("#submit_btn").on("click",function(){ 
			var validate=$("#changePwd_form").valid();
			if(!validate){
				return false;
			}  
			if($("#oldPassWord").val() == null ||$("#oldPassWord").val() == ''){
				dialog.error("请输入当前密码！"); 
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
						dialog.success("密码修改成功！",function(){  
							top.location.href =$("body").find("input[name='login_url']").val(); 
						});
					}else if(data==-1){ 
						 dialog.error("当前密码输入有误，请重新输入！",function()
									{
								window.location.reload(); 
								}); 
					}
					else if(data==-2){
						 dialog.error("验证码输入有误！",function()
									{
								window.location.reload(); 
								}); 
					}else{
						dialog.error("修改失败，请稍后重试！",function()
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