$(document).ready(function() {
	var body = $("body");
	//去掉重选找回方式的按钮
	var cancelReChoose = function(){
		var e = $("body").find("div[name='re_choose']");
		if(e[0]){
			e.remove();
		}
	}
	//清除填写的信息
	var bindClear = function(){
		body.find("input[name='checknum_mail']").val("");
	};
	//提交
	var submit = function(){
		var login_name = body.find("input[name='login_name']").val();
		var submit_url = body.find("input[name='doGetByMail_url']").val()+"&user="+login_name;
		$.ajax({
			url:submit_url,
			data: null,//如果不需要传参数，传null即可
			type : "POST",
			success : function(data){
				if(data == '1'){
					window.location.href=body.find("input[name='activateGetPwd_url']").val();
				}else if(data=='-1'){
					dialog.error("系统故障，请重新找回！",function(){
						window.location.href=body.find("input[name='getpwd_url']").val();
					});
				}
			}
		});
	};
	
	$("#submit_btn_mail").click(function() {
		submit();
	});
	$("#cancle_btn_mail").click(function() {
		bindClear();
	});
	
	
});
