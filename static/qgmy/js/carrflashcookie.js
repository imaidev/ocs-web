carr_flashcookie_swfname="carrFC";
carr_flashcookie_swfurl="http://www.1koufan.com/static/qgmy/js/carrflashcookie.swf";
carr_flashcookie_flashvars="namespace=carrFC";
carr_flashcookie_con= '<object height="0" width="0" codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' +
            carr_flashcookie_swfname + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
            '	<param value="' + carr_flashcookie_swfurl + '" name="movie">' +
            '	<param value="' + carr_flashcookie_flashvars + '" name="FlashVars">' +
            '	<param value="always" name="allowScriptAccess">' +
            '	<embed height="0" align="middle" width="0" pluginspage="https://www.macromedia.com/go/getflashplayer" allowScriptAccess="always" ' +
            'flashvars="' + carr_flashcookie_flashvars + '" type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" loop="false" play="true" ' +
            'name="' + carr_flashcookie_swfname + '" bgcolor="#ffffff" src="' + carr_flashcookie_swfurl + '">' +
            '</object>';
document.write("<div >"+carr_flashcookie_con+"</div>");
var carr_flashcookie_2016 = document[carr_flashcookie_swfname] || window[carr_flashcookie_swfname];



// 获取浏览器内核 名字及版本！注意js顺序不要换！
var carr_b_type ="";
var carr_b_var ="Null";
var carr_ua=navigator.userAgent.toLowerCase();
carr_temp_ie11UP = (carr_ua.match(/rv:([\d.]+)\) like gecko/))?carr_ua.match(/rv:([\d.]+)\) like gecko/)[1]:0;

if(carr_ua.indexOf("opera") != -1) {
  carr_b_type='Opera';
  c = carr_ua.match(/opera.([\d.]+)/)[1];
  if(c>0){
	  carr_b_var='Opera '+c;
	}else{
    carr_b_var='Opera XX';
  }
}else if(carr_ua.indexOf("msie") != -1) {
	
	carr_b_type='Internet Explorer';
	c=carr_ua.match(/msie ([\d.]+)/)[1];
  if (!window.XMLHttpRequest){
    carr_b_var='Internet Explorer 6.0';
  }else if(window.XMLHttpRequest && !document.documentMode){
  	carr_b_var='Internet Explorer 7.0';
  }else if (!-[1,]&&document.documentMode){
  	carr_b_var='Internet Explorer 8.0';
  }else if(c>0){
  	carr_b_var='Internet Explorer '+ c;
  }else{
    carr_b_var='Internet Explorer X';
  }
  
 }else if(carr_ua.indexOf("micromessenger") != -1) { 
  carr_b_type='MicroMessenger';
  c = carr_ua.match(/micromessenger\/([\d.]+)/)[1];
	if(c.length>0){
	  carr_b_var='MicroMessenger '+c;
	}else{
    carr_b_var='MicroMessenger XX';
  }
  
  
}else if(carr_ua.indexOf("firefox") != -1) {
  carr_b_type='Firefox';
  c = navigator.userAgent.toLowerCase().match(/firefox\/([\d.]+)/)[1];
	if(c>0){
	  carr_b_var='Firefox '+c;
	}else{
    carr_b_var='Firefox XX';
  }

}else if(carr_ua.indexOf("chrome") != -1) {
  carr_b_type='Chrome';
  c = carr_ua.match(/chrome\/([\d.]+)/)[1];
	if(c.length>0){
	  carr_b_var='Chrome '+c;
	}else{
    carr_b_var='Chrome XX';
  }

}else if(carr_ua.indexOf("netscape") != -1) {
  carr_b_type='Netscape';


}else if(carr_ua.indexOf("safari") != -1) {
carr_b_type='Safari';
c = carr_ua.match(/version\/([\d.]+).*safari/)[1];
	if(c>0){
	  carr_b_var='Safari '+c;
	}else{
    carr_b_var='Safari XX';
  }
}else if(carr_temp_ie11UP > 0  ){
	
	carr_b_type='Internet Explorer';
	c=carr_temp_ie11UP ;
	//c = carr_ua.match(/rv:([\d.]+)\) like gecko/)[1];
	if(c>0){
	  carr_b_var='Internet Explorer '+c;
	}else{
    carr_b_var='Internet Explorer XX';
  }

}else{
carr_b_type='Null';


} 
//获取全部插件名称 
function carr_getPluginName(){
 var info = "";
 var plugins = navigator.plugins;
 if (plugins.length>0) { 
  for (i=0; i < navigator.plugins.length; i++ ) { 
   info = info +"[" +navigator.plugins[i].name + "]" ;
  }
 } 
 return info;
}
function carr_getPluginName_ver(){
 var info = "";
 var plugins = navigator.plugins;
 if (plugins.length>0) { 
  for (i=0; i < navigator.plugins.length; i++ ) { 
   info = info +"[" +navigator.plugins[i].name +","+navigator.plugins[i].description.split(navigator.plugins[i].name)[1]+ "]" ;
  }
 } 
 return info;
}