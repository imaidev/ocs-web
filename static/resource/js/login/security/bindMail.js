
$(document).ready(function() {
	// validating rule
	$("#bindmail_form").validate({
		rules:{
			oldMail : {
				required:true
				
			},
			newMail:{
				required:true,
				email:true
			},
			password:{
				required:true
				/*password_rule:true */
			}
		},
		messages:{
			oldMail : {
				required:"请输入您的邮箱"
				
			},
			newMail:{
				required:"请输入您的邮箱",
				email:"请输入正确的邮箱"
			},
			password:{
				required:"请输入密码"
				/*password_rule:"请按要求填写"*/
			}		
		}
	});

	var body = $("body");
	//clear input
	function bindClear(){
		body.find("input[name='oldMail']").val("");
		body.find("input[name='newMail']").val("");
		body.find("input[name='password']").val("");
	};
	//submit 
	$("#submit_btn").click(function() {
		var validate = $("#bindmail_form").valid();
		if(!validate){
			return false;
		}
		var suf = "";
		var suffix = $("#emailSuffix");
		if(suffix&&suffix[0]){
			suf = suffix[0].firstChild.nodeValue;
		}
		var oldMail = body.find("input[name='oldMail']").val();
		if(oldMail){
			oldMail = oldMail.replace(/(^\s*)|(\s*$)/g,"") + suf;
		}else{
			oldMail = "";
		}
		var newMail = body.find("input[name='newMail']").val();
		var password = toMD5Str(body.find("input[name='password']").val());
		oldMail=oldMail.toUpperCase().replace(/(^\s*)|(\s*$)/g,"");
		newMail=newMail.toUpperCase().replace(/(^\s*)|(\s*$)/g,"");
		if(oldMail==newMail){
			dialog.error("新安全邮箱不能和当前安全邮箱相同！");
			return;
		}
		var submit_url = body.find("input[name='submit_url']").val();
		var data = {
			oldMail : oldMail,
			newMail : newMail,
			password : password
		};
		$.ajax({
			type : "POST",
			url : submit_url,
			data : data,
			success : function(data) {
				data = eval('('+data+')');
				switch(data){
				 /*1：成功发送绑定激活邮件
			 	  *	0：用户名与登录密码不匹配
			 	  * -1：旧绑定邮箱不匹配
			 	  * -2：服务端错误，稍后重试
			 	  * */
					case "1" : 
						window.location.href =  body.find("input[name='activate_url']").val();
						break;
					case "0" :
						dialog.error("登录密码填写有误，请重新填写!");
						break;
					case "-1" : 
						dialog.error("已绑定邮箱填写有误，请重新填写!");
						break;
					case "-2" : 
						dialog.error("服务器异常，绑定失败。请稍后重试!");
						break;
					default:
						dialog.error("服务器异常，绑定失败。请稍后重试!");
						break;
				}
			},
			error : function(data) {
				dialog.error("由于网络原因，绑定失败!");
			}
		});
	}); 
	$("#cancle_btn").on("click",function(){
		bindClear();
	});
});
