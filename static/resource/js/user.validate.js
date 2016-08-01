/**
 * 校验用户
 */
$().ready(function() {
	$("#actUserForm").validate({
		rules : {
			"LOGIN_ID" : {
				required : true,
				loginName_rule : true,
				remote : {
					url : "user.cmd?method=checkLoginIdUnique"
				}
			},
			"NICK_NAME" : {
				required : true
			},
			"LOGIN_EMAIL" : {
				required : true,
				remote : {
					url : "user.cmd?method=checkLoginEmailUnique"
				},
				email : true

			},
			"LOGIN_PHONE" : {
				required : true,
				isMobile:true,
				digits:true,
				minlength:11,
				maxlength:11,
				remote : {
					url : "user.cmd?method=checkLoginPhoneUnique"
				}
			},
			"PASSWORD" : {
				required : true,
				password_rule : true
			},
			"confirm_password" : {
				required : true,
				equalTo : "#PASSWORD"
			}
		},
		messages : {
			"LOGIN_ID" : {
				required : "请输入登录账号",
				loginName_rule : "登录账号应为字母开头，允许数字下划线的5-20位组合",
				remote:"该登录账号已存在"
			},
			"NICK_NAME" : {
				required : "请输入用户昵称"
			},
			"LOGIN_EMAIL" : {
				required : "请输入登录邮箱",
				email : "邮件格式不正确",
				remote:"该登录邮箱已存在"
			},
			"LOGIN_PHONE" : {
				required : "请输入登录手机号",
				isMobile:"请输入正确的手机号",
				digits:"请输入正确的手机号",
				minlength:"请输入11位手机号码",
				maxlength:"请输入11位手机号码",
				remote:"该登录手机号已存在"
			},
			"PASSWORD" : {
				required : "请输入登录密码",
				password_rule : "密码强度不符合"
			},
			"confirm_password" : {
				required : "请重复输入密码",
				equalTo : "两次输入不一致"
			}
		}
	});
});