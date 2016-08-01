//匹配^[A-Za-z0-9]{8}-[A-Za-z0-9]{1} //组织机构代码
jQuery.validator.addMethod("org_code_rule", function(value, element) {       
   return this.optional(element) || /^[A-Za-z0-9]{8}[A-Za-z0-9]{1}$/.test(value);
},"请正确输入组织机构代码");  
// 只能包括中英文     ^[a-zA-Z\u4e00-\u9fa5]+$
jQuery.validator.addMethod("string_rule", function(value, element) {       
   return this.optional(element) || /^[a-zA-Z\u4e00-\u9fa5]+$/.test(value);
},"请正确输入");
jQuery.validator.addMethod("date_per_rule", function(value, element) {       
	return this.optional(element) || /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.test(value)
},"格式不正确");
//验证护照
jQuery.validator.addMethod("passport_rule", function(value, element) {       
	   return this.optional(element) || /^(P\d{7})|(G\d{8})$/.test(value);
	},"请正确输入护照号码");
jQuery.validator.addMethod("isMobile", function(value, element){
    var length = value.length;
    return this.optional(element) || length == 11 && /^1[358]\d{9}|1[47][7]\d{8}$/.test(value);
},"请填写正确的手机号码");
// 字符验证，只能包含中文、英文、数字、下划线等字符。
jQuery.validator.addMethod("isString", function(value, element) {
	return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
}, "只能包含中文、英文、数字、下划线等字符");
var idCardNoUtil = {
	provinceAndCitys: {
		11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
		21:"辽宁",22:"吉林",23:"黑龙江",
		31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
		41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",
		50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
		61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
		71:"台湾",81:"香港",82:"澳门",91:"国外"
	},
	powers: ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"],
	parityBit: ["1","0","X","9","8","7","6","5","4","3","2"],
	genders: {male:"男",female:"女"},
	checkAddressCode: function(addressCode){
		var check = /^[1-9]\d{5}$/.test(addressCode);
		if(!check) return false;
		if(idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0,2))]){
			return true;
		}else{
			return false;
		}
	},
	checkBirthDayCode: function(birDayCode){
		var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
		if(!check) return false;
		var yyyy = parseInt(birDayCode.substring(0,4),10);
		var mm = parseInt(birDayCode.substring(4,6),10);
		var dd = parseInt(birDayCode.substring(6),10);
		var xdata = new Date(yyyy,mm-1,dd);
		if(xdata > new Date()){
			return false;//生日不能大于当前日期
		}else if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) ){
			return true;
		}else{
			return false;
		}
	},
	getParityBit: function(idCardNo){
		var id17 = idCardNo.substring(0,17);
		var power = 0;
		for(var i=0;i<17;i++){
			power += parseInt(id17.charAt(i),10) * parseInt(idCardNoUtil.powers[i]);
		}
		var mod = power % 11;
		return idCardNoUtil.parityBit[mod];
	},
	checkParityBit: function(idCardNo){
		var parityBit = idCardNo.charAt(17).toUpperCase();
		if(idCardNoUtil.getParityBit(idCardNo) == parityBit){
			return true;
		}else{
			return false;
		}
	},
	checkIdCardNo: function(idCardNo){
		//15位和18位身份证号码的基本校验
		var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
		if(!check) return false;
		//判断长度为15位或18位
		if(idCardNo.length==15){
			return idCardNoUtil.check15IdCardNo(idCardNo);
		}else if(idCardNo.length==18){
			return idCardNoUtil.check18IdCardNo(idCardNo);
		}else{
			return false;
		}
	},
	//校验15位的身份证号码
	check15IdCardNo: function(idCardNo){
		//15位身份证号码的基本校验
		var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
		if(!check) return false;
		//校验地址码
		var addressCode = idCardNo.substring(0,6);
		check = idCardNoUtil.checkAddressCode(addressCode);
		if(!check) return false;
		var birDayCode = '19' + idCardNo.substring(6,12);
		//校验日期码
		return idCardNoUtil.checkBirthDayCode(birDayCode);
	},
	//校验18位的身份证号码
	check18IdCardNo: function(idCardNo){
		//18位身份证号码的基本格式校验
		var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
		if(!check) return false;
		//校验地址码
		var addressCode = idCardNo.substring(0,6);
		check = idCardNoUtil.checkAddressCode(addressCode);
		if(!check) return false;
		//校验日期码
		var birDayCode = idCardNo.substring(6,14);
		check = idCardNoUtil.checkBirthDayCode(birDayCode);
		if(!check) return false;
		//验证校检码
		return idCardNoUtil.checkParityBit(idCardNo);
	},
	formateDateCN: function(day){
		var yyyy =day.substring(0,4);
		var mm = day.substring(4,6);
		var dd = day.substring(6);
		return yyyy + '-' + mm +'-' + dd;
	},
	//获取信息
	getIdCardInfo: function(idCardNo){
		var idCardInfo = {
			gender:"", //性别
			birthday:"" // 出生日期(yyyy-mm-dd)
		};
		if(idCardNo.length==15){
			var aday = '19' + idCardNo.substring(6,12);
			idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
			if(parseInt(idCardNo.charAt(14))%2==0){
				idCardInfo.gender=idCardNoUtil.genders.female;
			}else{
				idCardInfo.gender=idCardNoUtil.genders.male;
			}
		}else if(idCardNo.length==18){
			var aday = idCardNo.substring(6,14);
			idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
			if(parseInt(idCardNo.charAt(16))%2==0){
				idCardInfo.gender=idCardNoUtil.genders.female;
			}else{
				idCardInfo.gender=idCardNoUtil.genders.male;
			}
		}
		return idCardInfo;
	},
	getId15:function(idCardNo){
		if(idCardNo.length==15){
			return idCardNo;
		}else if(idCardNo.length==18){
			return idCardNo.substring(0,6) + idCardNo.substring(8,17);
		}else{
			return null;
		}
	},
	getId18: function(idCardNo){
		if(idCardNo.length==15){
			var id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
			var parityBit = idCardNoUtil.getParityBit(id17);
			return id17 + parityBit;
		}else if(idCardNo.length==18){
			return idCardNo;
		}else{
			return null;
		}
	}
};

jQuery.validator.addMethod("isIdCardNo", function(value, element) { 
	  return this.optional(element) || idCardNoUtil.checkIdCardNo(value);
}, "请正确输入身份证号码"); 

jQuery.validator.setDefaults({
	errorElement: "span",
	errorClass: "invalid",
	success: function(element) {
		element.addClass("valid");
	},
	onfocusout: function(element, event) {
		if ( !this.checkable(element) ) {
			this.element(element);
		}
	},
	errorPlacement: function(error,element) {
		var errorCt = element.parents("dd:first").next(".form-tip:first");
		if(errorCt.length==0){
			error.insertAfter(element);
		} else {
			error.appendTo(errorCt);
		}
	}
});
$.validator.prototype.startRequest =  function(element) {
	if (!this.pending[element.name]) {
		this.pendingRequest++;
		this.pending[element.name] = true;
		var label = this.errorsFor( element );
		label.addClass("loading");
	}
};
$.validator.prototype.stopRequest =  function(element, valid) {
	this.pendingRequest--;
	// sometimes synchronization fails, make sure pendingRequest is never < 0
	if (this.pendingRequest < 0) {
		this.pendingRequest = 0;
	}
	delete this.pending[element.name];
	if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
		$(this.currentForm).submit();
		this.formSubmitted = false;
	} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
		$(this.currentForm).triggerHandler("invalid-form", [this]);
		this.formSubmitted = false;
	}
	
	var label = this.errorsFor( element );
	label.removeClass("loading");
};
/**
 * remote重写，防止onkeyup的时候远程验证多次
 */
$.validator.methods.remote = function(value, element, param){
	if(element === document.activeElement){//低版本浏览器可能不兼容，不过不会报错只不过多验证几次
		return true;
	}
	if ( this.optional(element) ) {
		return "dependency-mismatch";
	}

	var previous = this.previousValue(element);
	if (!this.settings.messages[element.name] ) {
		this.settings.messages[element.name] = {};
	}
	previous.originalMessage = this.settings.messages[element.name].remote;
	this.settings.messages[element.name].remote = previous.message;

	param = typeof param === "string" && {url:param} || param;

	if ( this.pending[element.name] ) {
		return "pending";
	}
	if ( previous.old === value && !element.getAttribute('group_name')) {
		return previous.valid;
	}

	previous.old = value;
	var validator = this;
	this.startRequest(element);
	var data = {};
	data[element.name] = value;
	$.ajax($.extend(true, {
		url: param,
		mode: "abort",
		port: "validate" + element.name,
		dataType: "json",
		data: data,
		success: function(response) {
			validator.settings.messages[element.name].remote = previous.originalMessage;
			var valid = response === true || response === "true";
			if ( valid ) {
				var submitted = validator.formSubmitted;
				validator.prepareElement(element);
				validator.formSubmitted = submitted;
				validator.successList.push(element);
				delete validator.invalid[element.name];
				validator.showErrors();
			} else {
				var errors = {};
				var message = response || validator.defaultMessage( element, "remote" );
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
