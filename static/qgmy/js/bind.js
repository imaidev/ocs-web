function changeVerify(){
	if(typeof verifyUrl == "undefined")return;
    var date = new Date();
    var url = verifyUrl;
    var ttime = date.getTime();
    verifyImg.src = url + '&_='+ttime;
}

jQuery.validator.addMethod("pswd_strength", function(value, element) {
	var pswdStr = testPassWordStrength(value);
	if (pswdStr < 2) {
		return false;
	} else {
		return true;
	}
}, "密码强度过低，请选择使用字母、数字或特殊字符中任两种");

var ajaxInit_no_account={
		success:function(data) {
			//如果新注册成功，并且与外部账号绑定成功，则执行单点登录
			if(data == '1') {
				//aftersso中会对登录类型进行校验，如果session中不存在sso_type，则仍然会跳转至用户中心home页面，所以此处不再进行登录类型的判断，直接跳转至aftersso。
				/*if(typeof afterssoUrl == "undefined")return;
				window.location.href=afterssoUrl;*/
				window.location.href=afterssoUrl;
			}
		}
	};
//提交ajax登录请求
var ajaxInit_has_account={
		success:function(data) {
			//如果新注册成功，并且与外部账号绑定成功，则执行单点登录
			if(data == '1') {
				//aftersso中会对登录类型进行校验，如果session中不存在sso_type，则仍然会跳转至用户中心home页面，所以此处不再进行登录类型的判断，直接跳转至aftersso。
				/*if(typeof afterssoUrl == "undefined")return;
				window.location.href=afterssoUrl;*/
				window.location.href=afterssoUrl;
			}
		}
	};

//校验规则初始化
$(function(){
	$("#register_form").validate({
		rules:{
			loginName:{
				required:true,
				email:true,
				maxlength:30,
				/*loginName_rule:true,*/
				remote:checkLoginNameUrl
				},
			nickname:{
				required:true,
				maxlength:20
					},
			password:{
				required:true,
				pswd_strength:$("#password").val() 
				},
			confirm_password:{
				required:true,
				equalTo:"#password"
					}
			/*emailNum:{
				required:true,
				email:true,
				remote:checkEmailUrl
					}*/
			},
			
		messages:{
			loginName:{
				required:"Please enter your login name",
				email:"Please enter your email address correctly.",
				maxlength:"Out of range",
				/*loginName_rule:"Please enter your email address correctly",*/
				remote:"Login name already exists"	
				},
			nickname:{
					required:"Please enter a nickname",
					maxlength:"Out of range"
					},
			password:{
				required:"Please enter a password",
				pswd_strength:"Please enter your password correctly"
					},
			confirm_password:{
				required:"Please enter the confirmation password",
				equalTo:"This input password is not consistant with last one"
						}
			/*emailNum:{
				required:"Please enter your email address",
				email:"Please enter your email address correctly",
				remote:"Login email already exists"
						}*/
			}
		});
});

$(function(){
	$("#login_form").validate({
		rules:{
			account:{
				required:true,
				email:true,
				maxlength:30,
				/*loginName_rule:true,*/
				remote :{
					url : checkLoginName,
					type : "post",
					data : {
						"loginName":function() {return $("#account").val();}
						 }
					}
				},
			pass:{
				required:true,
				password_rule:true,
				remote :{
					url : checkLoginPasswordUrl,
					type : "post",
					data : {
						"account":function() {return $("#account").val();},
						"pass":function() {return $("#pass").val();}
						 }
					}
				}
			},
		messages:{
			account:{
				required:"Please enter your login name",
				email:"Please enter your email address correctly.",
				maxlength:"Out of range",
				/*loginName_rule:"Please enter your login name correctly",*/
				remote:"Login name does not exist"
				},
			pass:{
				required:"Please enter a password",
				password_rule:"Please enter your password correctly",
				remote:"Password error"	
					}
			}
		});
});

//点击提交触发校验并确认提交的对话框
function btnClick(){
var validate=$("#register_form").valid();
if(!validate){
	return false;
	}
registerSave();
}
function btnClickHave(){
	var validate=$("#login_form").valid();
	if(!validate){
		return false;
		}
	has_account_submit();
	}

//不存在本地账户时的提交
function registerSave(){
    var password=$("#password").val();
    var grade=testPassWordStrength(password);
    $("#passwordStrength").val(grade);
	document.getElementById('password').value=toMD5Str(document.getElementById('password').value);
	$("#register_form").ajaxSubmit(ajaxInit_no_account);
}
//已存在本地账户时的提交
function has_account_submit(){
	var password = document.getElementById('pass').value;
	document.getElementById('pwd').value = toMD5Str(password);
	/*document.getElementById('verify_code').value = document.getElementById('verify').value;*/
	$("#login_form").ajaxSubmit(ajaxInit_has_account);
}
//更新展现，显示、隐藏
function updateShow(obj){
	if(obj.value=="yes"){
		document.getElementById('no_account').style.display="none";  
		document.getElementById('has_account').style.display="block";  
	}else if(obj.value=="no"){
		document.getElementById('has_account').style.display="none";  
		document.getElementById('no_account').style.display="block";  
	}else{
		alert("未知的value："+obj.value);
	}
}
//刷新验证码
function changeVerify(){
    var date = new Date();
    var ttime = date.getTime();
    var verifyImg = document.getElementById('verifyImg');
    var urlArray = verifyImg.src.split("&_=");
    verifyImg.src = urlArray[0] + '&_='+ttime;
}
//注册事件
/*$(document).ready(function(){
	document.getElementById('verify').onkeydown=function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];   
		if(e && e.keyCode==13){ // enter 键
			has_account_submit();
		}
	}; 
	document.getElementById('pass').onkeydown=function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];   
		if(e && e.keyCode==13){ // enter 键
			document.getElementById('verify').focus();
		}
	}; 
});
*/