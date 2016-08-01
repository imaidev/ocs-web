	 // JavaScript Document
	 //返回顶部
function returnTop(speed){
	$('body,html').animate({scrollTop:0},speed);
	}
//解决不同浏览器input=“text”默认显示null的问题
$(function() {
	//去首页外其他页面，收起，打开商品分类		
 	$("#category").mouseover(function(){
		$("#mainMenu").show();});
	$("#category").mouseleave(function(){
		$("#mainMenu").hide();});
    /****集体调用

    $("input").each(function(){

        $(this).setDefauleValue();

    });
 **/
})

 

//设置input,textarea默认值

$.fn.setDefauleValue = function() {

    var defauleValue = $(this).val();
    if(defauleValue==""||defauleValue=="null"){
    	$(this).val("");
    }

    $(this).blur(function(){
    	if ($(this).val() == ""||$(this).val() == "null"){
    		$(this).val("")
    	}
    });

}


$(function(){
		$('a').bind("focus", function(){
    $(this).blur();
});
})


	function setTab(name,cursel,n){
 for(i=1;i<=n;i++){
  var menu=document.getElementById(name+i);
  var con=document.getElementById("con_"+name+"_"+i);
  menu.className=i==cursel?"hover":"";
  con.style.display=i==cursel?"block":"none";
 }
}
	function setTab2(name,cursel,n){
      //if(cursel==1){
		 // var menu=document.getElementById(name+1);
  //var con=document.getElementById("con_"+name+"_"+1);
	//	  menu.className="san h_red";
		//  con.style.display="block";
	  //}else{
	//	  var menu=document.getElementById(name+1);
 // var con=document.getElementById("con_"+name+"_"+1);
	//	  menu.className="san red";
	//	  con.style.display="none";
		//  }
	  if(cursel==1){
		  var menu=document.getElementById(name+1);
  var con=document.getElementById("con_"+name+"_"+1);
		  menu.className="si h_green";
		  con.style.display="block"
	  }else{
		  var menu=document.getElementById(name+1);
  var con=document.getElementById("con_"+name+"_"+1);
		  menu.className="si green";
		  con.style.display="none";
		  }
	  if(cursel==2){
		  var menu=document.getElementById(name+2);
  var con=document.getElementById("con_"+name+"_"+2);
		  menu.className="si h_yellow";
		  con.style.display="block";
	  }else{
		  var menu=document.getElementById(name+2);
  var con=document.getElementById("con_"+name+"_"+2);
		  menu.className="si yellow";
		  con.style.display="none";
		  }
	  if(cursel==3){
		  var menu=document.getElementById(name+3);
  var con=document.getElementById("con_"+name+"_"+3);
		  menu.className="si h_blue";
		  con.style.display="block";
	  }else{
		  var menu=document.getElementById(name+3);
  var con=document.getElementById("con_"+name+"_"+3);
		  menu.className="si blue";
		  con.style.display="none";
		  } 
}
 
$(document).ready(function () {
	$("#menuRight").find('li').mouseover(function(){
		var pageX = $(this).offset().left-$("#menuRight").offset().left+200;
		var pageY = $(this).offset().top-$("#menuRight").offset().top;
		$(this).find('b').css({"left":pageX,"top":pageY+2 });
		$(this).parent().find('.out').css({"left":pageX,"top":pageY });
		});
	})
	
	
	
	//高度自适应
function reinitIframe(id){
 
var iframe = document.getElementById(id);
 
try{
 
var bHeight = iframe.contentWindow.document.body.scrollHeight;
 
var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
 
var height = Math.max(bHeight, dHeight);
 
iframe.height =  height;
 
}catch (ex){}
 
}
 
//分期付款
$(function(){
	//为复选框添加点击事件
	$(".fqfk input[type='checkbox']").click(function(){
		if($(this).attr('checked')){
		$(".fqfk .fqfkCon").show();
		}else{
			$(".fqfk .fqfkCon").hide();
			}
		});
	
	//为选择框添加点击事件
	$(".fqfkCon select").change(function(){
		$(".fqfkCon ul").remove();
		var counts = parseInt($(this).val());
		if(/^(\+|-)?\d+$/.test( counts )){
			for(var i=0; i< counts; i++){
				var str='<li><label>分期金额：<input id="stage_amount_'+i+  '" name="stage_amount" type="text" class="input2" />元&nbsp;&nbsp;&nbsp;&nbsp;</label><input name="stage_date" id="stage_date_'+i+'" class="Wdate" type="text" onClick="WdatePicker({dateFmt:\'yyyyMMdd\'})" /></li>';
				$("<ul id='stagecul'></ul>").appendTo($(".fqfkCon")).append(str);
			}
			}
		
		});
	})
	
	
	// JavaScript Document
//设置input,textarea默认值


function clearValue(obj){
	if((obj.value=="请输入关键词")){
		obj.value="";
	}
}

function setDefaultvalue(obj){
	if((obj.value=="") || (obj.value==null)){
		obj.value="请输入关键词";
	}
}
	
/****
function intFloat(){
	$("body").append('<div class="float_nav" style="display:none;"><ul><li><a href="/ecweb/casicord/cart/myCart.htm" class="shopping-cart" id="shopping-cart">&nbsp;</a></li><li><a class="weibo">&nbsp;</a></li><li><a href="javascript:void(0)" class="go-top" id="go-top">&nbsp;</a></li></ul></div>');
	$('.go-top').bind('click', function(event) {
		$('html,body').animate({ scrollTop: '0px' }, 500); return false; 
	});
	var floatNav = $('div.float_nav');
	$(window).scroll(function(event) {
		if ($(window).scrollTop() > 100) {
			floatNav.fadeIn(250);
		} else {
			floatNav.fadeOut(250);
		}
	});
}
***/

