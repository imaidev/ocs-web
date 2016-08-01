$(document).ready(function() {
	//注册事件
	document.getElementById('verify').onkeydown=function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];   
	     if(e && e.keyCode==13){ // enter 键
	    	 okSubmit();
	    }
	}; 
	document.getElementById('password').onkeydown=function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];   
	     if(e && e.keyCode==13){ // enter 键
	    	 if($("#verify_code_div").css("display")=="none"){
	    		 okSubmit();
	         }else if($("#verify_code_div").css("display")=="block"){
	        	 document.getElementById('verify').focus();
	             }
	    }
	}; 
});
function changeVerify(){
	if(typeof verifyUrl == "undefined")return;
    var date = new Date();
    var url = verifyUrl;
    var ttime = date.getTime();
    var verifyImg = $("#verifyImg");
    verifyImg.attr("src",url+"&_="+ttime);
}
//提交ajax登录请求
var ajaxInit={
		success:function(data) { 
			if(data != 1 && data != 10 && data != -3){
				$(".btn-smb").removeClass("btn-smb-ing");
				$(".btn-smb").removeAttr("disabled");
			}
			if(data == -5){ 
				// 登录出现错误模糊提示
				document.getElementById('verify_code_div').style.display="block";  	
				$("#_tipbox").remove();
				$("#account").tipBox({tips:"User name or password error!",relatedTo:"#password"});
				changeVerify();//刷新验证码
			}else if(data == 1){
				if(typeof defaultRelayState == "undefined")return;
				if(RelayState != null && RelayState != "") {
					window.location.href = RelayState;
				}else {
					window.location.href = defaultRelayState;
				}
				
			}else if(data == 4){
				//完善资料页面
				if(typeof supplementUrl == "undefined")return;
				showPopWin('选择用户', supplementUrl, 800,380, kefuCallback, true, true); 
			}else if(data == -2){
				$("#_tipbox").remove();
				$("#verify").tipBox({tips:"Verification code is not correct!"});
				changeVerify();//刷新验证码
			}else if(data == -1){ 
				document.getElementById('verify_code_div').style.display="block";  	
				$("#_tipbox").remove();
				$("#account").tipBox({tips:"User name or password error!",relatedTo:"#password"});
				changeVerify();//刷新验证码 
			}else if(data == 2){
				$("#_tipbox").remove();
				$("#account").tipBox({tips:"Your account has been locked, please contact the administrator unlock",relatedTo:"#password"});
				changeVerify();//刷新验证码
			}else if(data == 3){
				$("#_tipbox").remove();
				$("#account").tipBox({tips:"The user has been deactivated!",relatedTo:"#password"});
				changeVerify();//刷新验证码
			}else{
				$("#_tipbox").remove();
				$("#account").tipBox({tips:"System error! Please try again later.",relatedTo:"#password"});
			}
		},
		error:function(e){
			$(".btn-smb").removeClass("btn-smb-ing");
			$(".btn-smb").removeAttr("disabled");
		}
	}; 
function kefuCallback(win){  
	$("#login_form").attr("action", "/ftweb/login/login/login.do?method=loginnopass&user_id="+win); 
	$("#login_form").ajaxSubmit(ajaxInit);
} 
function okSubmit(){
	var account = document.getElementById('account').value;
	var password = document.getElementById('password').value;
	if(account=="" || account==null || password=="" || password==null){
		$("#account").tipBox({tips:"Please enter a user name and password!"});
		return false;
		}
	document.getElementById('pwd').value = toMD5Str(toMD5Str(password) + login_salt);  
	document.getElementById('verify_code').value = document.getElementById('verify').value;
	if(document.getElementById('remember_me').checked){
 		document.getElementById('hid_remember_me').value = '1';
 	}else{
 		document.getElementById('hid_remember_me').value = '0';
 	}
	//选择记住登录状态
	if($('#remember_login_state').is(':checked')){
		$('#hid_remember_login_state').val(1);
	}
	$(".btn-smb").addClass("btn-smb-on"); 
	$("#login_form").ajaxSubmit(ajaxInit);
}
function gotoRegister(){
	if(typeof signupUrl == "undefined")return;
	window.location.href = signupUrl;
} 
function initPlaceHolders(){
    if('placeholder' in document.createElement('input')){ //如果浏览器原生支持placeholder
        return ;
    }
    var target = function (e){
        var e=e||window.event;
        return e.target||e.srcElement;
    };
    var _getEmptyHintEl = function (el){
        var hintEl=el.hintEl;
        return hintEl && g(hintEl);
    };
    var blurFn = function(e){
        var el=target(e);
        if(!el || el.tagName !='INPUT' && el.tagName !='TEXTAREA') return;//IE下，onfocusin会在div等元素触发 
        var    emptyHintEl=el.__emptyHintEl;
        if(emptyHintEl){
            //clearTimeout(el.__placeholderTimer||0);
            //el.__placeholderTimer=setTimeout(function(){//在360浏览器下，autocomplete会先blur再change
                if(el.value) emptyHintEl.style.display='none';
                else emptyHintEl.style.display='';
            //},600);
        }
    };
    var focusFn = function(e){
        var el=target(e);
        if(!el || el.tagName !='INPUT' && el.tagName !='TEXTAREA') return;//IE下，onfocusin会在div等元素触发 
        var emptyHintEl=el.__emptyHintEl;
        if(emptyHintEl){
            //clearTimeout(el.__placeholderTimer||0);
            emptyHintEl.style.display='none';
        }
    };
    if(document.addEventListener){//ie
        document.addEventListener('focus',focusFn, true);
        document.addEventListener('blur', blurFn, true);
    }
    else{
        document.attachEvent('onfocusin',focusFn);
        document.attachEvent('onfocusout',blurFn);
    }

    var elss=[document.getElementsByTagName('input'),document.getElementsByTagName('textarea')];
    for(var n=0;n<2;n++){
        var els=elss[n];
        for(var i =0;i<els.length;i++){
            var el=els[i];
            var placeholder=el.getAttribute('placeholder'),
                emptyHintEl=el.__emptyHintEl;
            if(placeholder && !emptyHintEl){
                emptyHintEl=document.createElement('span');
                emptyHintEl.innerHTML=placeholder;
                emptyHintEl.className='emptyhint';
                emptyHintEl.onclick=function (el){return function(){try{el.focus();}catch(ex){}}}(el);
                if(el.value) emptyHintEl.style.display='none';
                el.parentNode.insertBefore(emptyHintEl,el);
                el.__emptyHintEl=emptyHintEl;
            }
        }
    }
}
function disabledButton(){
	/*$("#dlg_ca_type1").attr("disabled","disabled");
	$("#dlg_ca_type1").addClass("disabled");
	$("#dlg_ca_type1").attr("href","#");*/
}
disabledButton();
initPlaceHolders();
setTimeout("changeVerify()",'100');  

$(document).ready(function() {
	var loginFailTime = login_fail_time;
	if(loginFailTime >= 1){
		//$('#verify_code_div').show();
		document.getElementById('verify_code_div').style.display="block";  
	}else{
		$('#verify_code_div').hide();
	}
});