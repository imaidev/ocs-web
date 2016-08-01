
function init(){
}

function button_over()
{
	var ob=event.srcElement;
	if (ob.tagName!="BUTTON")
	{
		return;
	}
	ob.className="btnMouseOver";
}
function button_out()
{
	var ob=event.srcElement;
	if (ob.tagName!="BUTTON")
	{
		return;
	}
	ob.className="btnMouseOut";
}
function modi_list()
{
	var f=0;
	if(typeof(document.forms[0].primaryKey)=="undefined")
		return false;
	if(typeof(document.forms[0].primaryKey.length)=="undefined")
	{
		if(document.forms[0].primaryKey.checked==true)
			f=1;
	}else{
		var len=document.forms[0].primaryKey.length;
		for(var i=0;i<len;i++)
		{
		if(document.forms[0].primaryKey[i].checked==true)
			f++;
		}
	}
	if(f > 0) return true;
	else return false;
}
function can_update()
{
	var f=0;
	if(typeof(document.forms[0].primaryKey)=="undefined")
		return false;
	if(typeof(document.forms[0].primaryKey.length)=="undefined")
	{
		if(document.forms[0].primaryKey.checked==true)
			f=1;
	}else{
		var len=document.forms[0].primaryKey.length;
		for(var i=0;i<len;i++)
		{
		if(document.forms[0].primaryKey[i].checked==true)
			f++;
		}
	}
	if(f==1)return true;
	if(f==0)return;
	if(f>1){
		alert("请选择一条记录修改");
		return false;
	}
}

function byteLength(str)
{
	var x=0;
	for (i=0; i<str.length; i++) {
		if(str.charCodeAt( i) > 128){
			x=x+2;
		}else{
			x=x+1;
		}
	}
	return x;
}
//add by liubzh,功能是检查如入的长度和能否为空，(暂只能对字符串)
//obj:待检查对象，len:最大长度，canEmpty能否为空
//return :true & false
function checkLength(obj,len,canEmpty)
{	obj.value=trim(obj.value);
	if(obj.value==null||obj.value=="")
	{
		return canEmpty;
	}
	else
	{
		if(byteLength(obj.value)>len)
		{
			return false;
		}
		else{
			return true;
		}
	}
}