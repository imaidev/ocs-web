// 校验控件长度是否正确
function checkMaxLength(str, maxs) {
	var values = str;// 使用$(this)表示对哪个对象添加了扩展方法
	var re = /\"|\'|\“|\”|\‘|\’/;
	if (re.test(values)) {
		return "不能含有非法字符";
	}
	var i, sum;
	sum = 0;
	for (i = 0; i < str.length; i++) {
		if ((str.charCodeAt(i) >= 0) & (str.charCodeAt(i) <= 255))
			sum = sum + 1;
		else
			sum = sum + 2;
	}

	if (sum > (maxs * 1)) {
		return "不能多于" + (maxs / 2) + "个汉字或" + maxs + "个英文字符";
	}

	return "ok";
}

/**
 * 校验是否为大于0的整数
 * @param ss
 * @returns {Boolean}
 */

function forcheck(ss){  
	 var type="^[0-9]*[1-9][0-9]*$";  
	 var re = new RegExp(type);  
	 if(ss.match(re)==null)
	 {  
		 alert("请输入大于零的整数!");  
		return true;  
	}
	 return false;
	}
function checkLengthIsOk(str, mins, maxs) {
	if (str == "") {
		return "不能为空";
	}
	var values = str;// 使用$(this)表示对哪个对象添加了扩展方法
	var re = /\"|\'|\“|\”|\‘|\’/;
	if (re.test(values)) {
		return "不能含有非法字符";
	}
	var i, sum;
	sum = 0;
	for (i = 0; i < str.length; i++) {
		if ((str.charCodeAt(i) >= 0) & (str.charCodeAt(i) <= 255))
			sum = sum + 1;
		else
			sum = sum + 2;
	}
	if (sum < (mins * 1)) {
		return "不能少于" + mins + "个汉字或英文字符";
	}
	if (sum > (maxs * 1)) {
		return "不能多于" + (maxs / 2) + "个汉字或" + maxs + "个英文字符";
	}

	return "ok";
}

/**
 * 时间比较
 * 
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {Boolean}
 */
function compareTime(startDate, endDate) {
	if (startDate.length > 0 && endDate.length > 0) {
		var startDateTemp = startDate.split(" ");
		var endDateTemp = endDate.split(" ");

		var arrStartDate = startDateTemp[0].split("/");
		var arrEndDate = endDateTemp[0].split("/");

		var arrStartTime = startDateTemp[1].split(":");
		var arrEndTime = endDateTemp[1].split(":");

		var allStartDate = new Date(arrStartDate[0], arrStartDate[1],
				arrStartDate[2], arrStartTime[0], arrStartTime[1],
				arrStartTime[2]);
		var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2],
				arrEndTime[0], arrEndTime[1], arrEndTime[2]);

		if (allStartDate.getTime() > allEndDate.getTime()) {
			jAlert("开始时间不能大于结束时间!");
			return false;
		} else {
			return true;
		}
	} else {
		jAlert("时间不能为空");
		return false;
	}
}