function help(helpId,parms,style){
	var url ="../jsp/mof/help/help.jsp?url=pubcommonhelpcontrol.cmd&HELP_ID="+helpId;
	if(parms!=null && parms!="")
	{
		var urlStr = url+"&"+parms; 
		if(urlStr.length>2000 ||parms.indexOf("#")>-1) //应为2048，但考虑url太长，所以以2000为准。
		{
  	 		url = url + "&helpLongString=1";  
  			var bodyHtml = document.body.innerHTML;
  			var oTxa = document.createElement('<textarea id="helpLongString"   style="display:none"></textarea>');
				document.body.insertAdjacentElement("beforeEnd", oTxa);
  			var objStr = "";
		    for(var i=0;i<parms.split("&").length;i++)
				{
				  objStr = objStr + '<input type="hidden" name="' + parms.split("&")[i].split("=")[0] + '" value="' + parms.split("&")[i].split("=")[1] + '">' ;
				}
				document.getElementById("helpLongString").value = objStr;
			 
  	  	} 
  	 	else
			url=url+"&"+parms;
	}
	if(style==null || style=="")
		style = "scroll:auto;status:no;dialogWidth:700px;dialogHeight:500px";
	var win = showModalDialog(url,window,style);
	return win;
}

//实现外部调用,用户自己写通用帮助时，例如：doHelp("self.cmd","para1=1&para2=2")
function doHelp(URL,parms,style){
	
	var url ="jsp/help/help.jsp?url="+ URL +"&clear=true";
	if(parms!=null && parms!="")
	{
		var urlStr = url+"&"+parms; 
		if(urlStr.length>2000 ||parms.indexOf("#")>-1) //应为2048，但考虑url太长，所以以2000为准。
		{
  	 		url = url + "&helpLongString=1";  
  			var bodyHtml = document.body.innerHTML;
  			var oTxa = document.createElement('<textarea id="helpLongString"   style="display:none"></textarea>');
				document.body.insertAdjacentElement("beforeEnd", oTxa);
  			var objStr = "";
		    for(var i=0;i<parms.split("&").length;i++)
				{
				  objStr = objStr + '<input type="hidden" name="' + parms.split("&")[i].split("=")[0] + '" value="' + parms.split("&")[i].split("=")[1] + '">' ;
				}
				document.getElementById("helpLongString").value = objStr;
			 
  	  	} 
  	 	else
		  	url=url+"&"+parms;
	}
	if(style==null || style=="")
		style = "scroll:auto;status:no;dialogWidth:600px;dialogHeight:500px";
	var win = showModalDialog(url,window,style);
	return win;
}


function getIHelpUrl(helpNo,parms,objId,method,addEmpty){
	var url = "pubcommonhelp.cmd?method=objectHelp&iframeHelp=true&helpno="+helpNo;
	url=url+"&help_method="+method;
	url=url+"&addEmpty="+addEmpty;
	if( parms != null && parms !="")
		url = url + "&"+parms;
	if( objId != null && objId !="")
		url = url + "&primaryKey="+objId;
	//alert("objid:" + objId);
	return url;
}
//
function fill_List(list_forms,win,customMethod){
     //alert("fill:" + list_forms.length+", win="+win);
	 var contain=false;
	 for(var j = 0; j < list_forms.length; j ++ ){
	    var sel_form = list_forms[j];
	    var pvalue = sel_form.value;
		var options = sel_form.options;
		//
		if(options){
			var len = options.length;
			for( var i=0;i<len;i++){
				options.remove(0);
			}		
			if(win!=null && win.length>0){
			   for(var i = 0; i < win.length; i ++){
			      var object = document.createElement("OPTION");
				  object.value=win[i][0];
				  object.text=win[i][1];
				  sel_form.add(object);
				  if(object.value==pvalue)
				  	contain=true;
			   }
			}
			if( contain )
				sel_form.value=pvalue;
			else
				sel_form.value="";
		 }
		 //
		 try{
		 	 eval(customMethod);
		 }
		 catch(ex){	}
	 }
}

function quickHelp(helpNo,parms,objId){
	var url = "pubcommonhelp.cmd?method=objectHelp&helpno="+helpNo;
	if( parms != null && parms !="")
		url = url + "&"+parms;
	if( objId != null && objId !="")
		url = url + "&primaryKey="+objId;
	var win = showModalDialog(url,window,"scroll:auto;status:no;dialogHide:yes;dialogTop:0px;dialogLeft:0px;dialogWidth:0px;dialogHeight:0px");
	return win;
}
function fillHelpList(list_forms,help_no,condition,addEmpty){
	 var win = quickHelp(help_no,condition,null);
	 fill_List(win);
}
function pubCommonkeyHelp(isKeyHelp,customMethod){
	if(isKeyHelp)
		eval(customMethod);
}
function fill_Comb(list_forms,win,customMethod){
	 var contain=false;
	 for(var j = 0; j < list_forms.length; j ++ ){
		var sel_form;
		if(list_forms[j]){
			sel_form=list_forms[j].getList();
		}
	    var pvalue = list_forms[j].getValue();
		var options = sel_form.options;
		//
		if(options){
			var len = options.length;
			list_forms[j].delAllLine();	
			if(win!=null && win.length>0){
			   for(var i = 0; i < win.length; i ++){
			   	  var comb_text=win[i][1];
			   	  //if(comb_text!="请选择"){
			   	  //公安需求，ID空格NAME
//				  if(comb_text!=""){
//				  	comb_text= win[i][0]+" "+comb_text;
//				  }
				  list_forms[j].addline(comb_text,win[i][0]);
				  if(win[i][0]==pvalue)
				  contain=true;
			   }
			}
			if( contain )
				list_forms[j].setSelect(pvalue);
			else
				list_forms[j].setSelect("");
		 }
		 //
		 try{
		 	 eval(customMethod);
		 }
		 catch(ex){	}
	 }
}
/**
 * 给通用帮助框动态设置值
 * @param d_form: 通用帮助所在的form对象;例如document.forms[0]
 * @param form_name:  通用帮助的页面域的名称;例如:<input name="age"> 中的age
 * @param value:  要设置的数值;例如 20
 * @param customMethod:要执行的自定义方法:例如:custMethod()
 * @return true:设置成功,false:设置失败
 * @example setSearchHelpValue(document.forms[0],"age","20","custMethod()")
 */
function setSearchHelpValue(d_form,form_name,value,customMethod){
	if(d_form&&form_name){
		try{
			eval("d_form."+form_name+"_TEXT.value=value");
			eval(form_name+"_blur()");
			eval("d_form."+form_name+".fireEvent('onchange')");
			eval(customMethod);
		}catch(e){
			return false;
		}
	}
	return true;
}