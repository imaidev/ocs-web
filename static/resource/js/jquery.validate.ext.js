jQuery.validator.addMethod("nickname_rule", function(value, element) {
	return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z0-9\_]{5,20}$/.test(value);
}, "昵称不可包含除汉字、英文、数字和_外的5~20个字符");
jQuery.validator.addMethod("underline_rule", function(value, element) {
	return this.optional(element) || /^(?!_)(?!.*?_$)/.test(value);
}, "开头和结尾不能是下划线");
jQuery.validator.addMethod("character_test", function(value, element) {
	return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z0-9.~!@#$%\^\+\*&\\\/\?\|:\.{}()';="]{1,30}$/.test(value);
}, "公司名称格式不正确");
jQuery.validator.setDefaults({
	errorElement : "label",
	errorClass : "error",
	validClass : "valid",
	success : function(element) {
		element.addClass("valid");
	},
	onfocusout : function(element, event) {
		if (!this.checkable(element)) {
			this.element(element);
		}
	}
});
$.validator.prototype.startRequest = function(element) {
	if (!this.pending[element.name]) {
		this.pendingRequest++;
		this.pending[element.name] = true;
		var label = this.errorsFor(element);
		label.addClass("loading");
	}
};
$.validator.prototype.stopRequest = function(element, valid) {
	this.pendingRequest--;
	// sometimes synchronization fails, make sure pendingRequest is never < 0
	if (this.pendingRequest < 0) {
		this.pendingRequest = 0;
	}
	delete this.pending[element.name];
	if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
		$(this.currentForm).submit();
		this.formSubmitted = false;
	} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
		$(this.currentForm).triggerHandler("invalid-form", [ this ]);
		this.formSubmitted = false;
	}

	var label = this.errorsFor(element);
	label.removeClass("loading");
};
/**
 * remote rewrite
 */
$.validator.methods.remote = function(value, element, param) {
	if (element === document.activeElement) {// 低版本浏览器可能不兼容，不过不会报错只不过多验证几次
		return true;
	}
	if (this.optional(element)) {
		return "dependency-mismatch";
	}

	var previous = this.previousValue(element);
	if (!this.settings.messages[element.name]) {
		this.settings.messages[element.name] = {};
	}
	previous.originalMessage = this.settings.messages[element.name].remote;
	this.settings.messages[element.name].remote = previous.message;

	param = typeof param === "string" && {
		url : param
	} || param;

	if (this.pending[element.name]) {
		return "pending";
	}
	if (previous.old === value && !element.getAttribute('group_name')) {
		return previous.valid;
	}

	previous.old = value;
	var validator = this;
	this.startRequest(element);
	var data = {};
	data[element.name] = value;
	$.ajax($.extend(true, {
		url : param,
		mode : "abort",
		port : "validate" + element.name,
		dataType : "json",
		data : data,
		success : function(response) {
			validator.settings.messages[element.name].remote = previous.originalMessage;
			var valid = response === true || response === "true";
			if (valid) {
				var submitted = validator.formSubmitted;
				validator.prepareElement(element);
				validator.formSubmitted = submitted;
				validator.successList.push(element);
				delete validator.invalid[element.name];
				validator.showErrors();
			} else {
				var errors = {};
				var message = response || validator.defaultMessage(element, "remote");
				errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
				validator.invalid[element.name] = true;
				validator.showErrors(errors);
			}
			previous.valid = valid;
			validator.stopRequest(element, valid);
		}
	}, param));
	return "pending";
};

// extend methods
/*******************************************************************************
 * jQuery Validate扩展验证方法 (lt)
 ******************************************************************************/
$(function() {
	// 只能输入[0-9]数字
	jQuery.validator.addMethod("isDigits", function(value, element) {
		return this.optional(element) || /^\d+$/.test(value);
	}, "只能输入0-9数字");

	// 判断中文字符
	jQuery.validator.addMethod("isChinese", function(value, element) {
		return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
	}, "只能包含中文字符。");
	// 判断中文字符和字母
	jQuery.validator.addMethod("isChnAndEng", function(value, element) {
		return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z]+$/.test(value);
	}, "只能包含中文字符与字母。");
	// 判断英文字符
	jQuery.validator.addMethod("isEnglish", function(value, element) {
		return this.optional(element) || /^[A-Za-z]+$/.test(value);
	}, "只能包含英文字符。");
	// 判断英文字符
	jQuery.validator.addMethod("isEngAndNum", function(value, element) {
		return this.optional(element) || /^[A-Za-z0-9]+$/.test(value);
	}, "只能包含英文字符和数字。");
	// 手机号码验证
	jQuery.validator.addMethod("isMobile", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
	}, "请正确填写您的手机号码。");

	// 电话号码验证
	jQuery.validator.addMethod("isTel", function(value, element) {
		var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
		return this.optional(element) || (tel.test(value));
	}, "请正确填写您的电话号码。");
	// 邮箱验证
	jQuery.validator.addMethod("isEmail", function(value, element) {
		var email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@[a-z0-9]+([._\\-]*[a-z0-9])*((\.\w{2,3}){1,3})$/;
		return this.optional(element) || (email.test(value));
	}, "请正确填写您的邮箱。");
	
	// 联系方式(手机/电话皆可)验证
	jQuery.validator.addMethod("telOrPhone", function(value, element) { 
		var mobile = /^(((([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$)|(^1[3|4|5|7|8][0-9]{9}$))/; 
		return this.optional(element) || (mobile.test(value));
	}, "请正确填写您的联系方式");
	// 邮政编码验证
	jQuery.validator.addMethod("isZipCode", function(value, element) {
		var zip = /^[0-9]{6}$/;
		return this.optional(element) || (zip.test(value));
	}, "请正确填写您的邮政编码。");

	// 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
	jQuery.validator.addMethod("isPwd", function(value, element) {
		return this.optional(element) || /^[a-zA-Z]\\w{6,12}$/.test(value);
	}, "以字母开头，长度在6-12之间，只能包含字符、数字和下划线。");

	// 字符验证，只能包含中文、英文、数字、下划线等字符。
	jQuery.validator.addMethod("isString", function(value, element) {
		return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
	}, "只能包含中文、英文、数字、下划线等字符");
	// 数字、下划线字符
	jQuery.validator.addMethod("isNumOrD", function(value, element) {
		return this.optional(element) || /^[0-9-]+$/.test(value);
	}, "只能包含数字、下划线字符");
	jQuery.validator.addMethod("isRole", function(value, element) {
		return this.optional(element) || /^(0|[1-9][0-9]*)$/.test(value);
	}, "超过两位整数开头不能是0");
	jQuery.validator.addMethod("isDecimal", function(value, element) {
		return this.optional(element) || /^((0|[1-9][0-9]*)|((0|[1-9][0-9]*)\.[0-9]{1,2}))$/.test(value);
	}, "超过两位整数开头不能是0且不超过两位小数");
	// 判断是否包含中英文特殊字符，除英文"-_"字符外
	jQuery.validator
			.addMethod(
					"nonSpecialChar",
					function(value, element) {
						var reg = RegExp(/[(\`)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\')(\[)(\])(\<)(\>)(\/)(\~)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\”)(\“)(\’)]+/);
						return this.optional(element) || !reg.test(value);
					}, "含有中英文特殊字符");
}); 