jQuery.fn.extend({ 
__isQuoteIn:function(){ 

return false;
} ,
__isNum:function()
{
	var s=$(this).val();
	var re = /^[+|-]*[0-9]+$/;
	return re.test(s);
},

__isFloat:function()
{
	var s=$(this).val();
	if ($(this).__isNum()) return true;
	var re = /^[+|-]{0,1}\d*\.\d*$/;
	return re.test(s);
},
__checkMonth:function ()
{
    var value = $(this).val();
    if (!$(this).__isNum()) {
		sError = "必须是整数";
		return false;
	}
    if(value < 0 || value > 12)
     {
     	sError = "月份不能小于1，也不能大于12";
     	return false;
     }
   	return true;
},
__isLegalYear:function ()
{
	var year=$(this).val();
     if(year < 1900 || year > 3000)
     {
     	sError = "年份错误";
     	return false;
     }
	return true;
},
__checkStdYear:function ()
{
	var value =$(this).val();
	if (value.length != 4) {
		sError = "日期长度不对";
		return false;
	}
	if (!$(this).__isNum()) {
		sError = "不是合法的日期";
		return false;
	}
	var bReturn =$(this). __isLegalYear();
	return bReturn;
}
  
}); 

jQuery.__isLegalTime=function(hour, minute, second)
{
	     if(hour < 0 || hour > 23)
	     {
	     	sError = "时钟错误";
	     	return false;
	     }
	     if(minute < 0 || minute > 59)
	     {
	     	sError = "分钟错误";
	     	return false;
	     }
	     if (second < 0 || second > 59)
	     {
	     	sError = "秒钟错误";
	     	return false;
	     }
		return true;
	} 
jQuery.__isNum=function(s)
	{
		var re = /^[+|-]*[0-9]+$/;
		return re.test(s);
	}
