//校验规则初始化
$(document).ready(function() {
	var body = $("body");
	$("#getpwd_byque_form").validate({
		rules : {
			checknum_que : {
				required : true
			},
			answer : {
				required : true
			}
		},
		messages:{
			checknum_que : {
				required : "请输入机验证码"
			},
			answer : {
				required : "请输入密码答案"
			}
				
		}
	});
	
	//去掉重选找回方式的按钮
	var cancelReChoose = function(){
		var e = $("body").find("div[name='re_choose']");
		if(e[0]){
			e.remove();
		}
	}
	//清除填写的信息
	var bindClear = function(){
		body.find("input[name='answer']").val("");
		body.find("input[name='checknum_que']").val("");
	};
	//提交
	var submit = function(){
		var answer = body.find("input[name='answer']").val();
		var checknum_que = body.find("input[name='checknum_que']").val();
		var submit_url = body.find("input[name='doGetByQue_url']").val();
		var data = {
				answer : answer,
				checknum_que : checknum_que
		};
		$.ajax({
			type : "POST",
			url : submit_url,
			data : data,
			success : function(data) {
				if(data=='-1') {
					dialog.error("验证码不正确！");
				}else if(data=='-2'){
					dialog.error("密保问题答案错误，请重新填写！");
				}else if(data="1"){
					window.location.href =  body.find("input[name='resetpwd_url']").val();
				}else{
					dialog.error("网页已失效，请重新找回密码！",function(){
						window.location.href =  body.find("input[name='getPwd_url']").val();
					});
				}
			},
			error : function(data) {
				dialog.error("由于网络原因，获取验证码失败！");
			}
		});
	};
	
	$("#submit_btn_que").click(function() {
		var validate = $("#getpwd_byque_form").valid();
		if(!validate){
			return false;
		}
		submit();
	});
	$("#cancle_btn_que").click(function() {
		bindClear();
	});
	
});
