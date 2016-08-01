$(document).ready(function(){
	var windowWidth=$(window).width();
	var windowHeight=$(window).height();
	var expanded = false;
	$.ajax({
		  type: "post",
		  url:"/portal/portal/workstationcmd.cmd?method=queryConfig",
		  dataType:"json",
		  beforeSend: function(XMLHttpRequest){
		  },
		  success: function(data, textStatus){
			var sMenuTop=(windowHeight-100)/2-50;
			var wsBoxTop=(windowHeight-450)/2-5;
			var tabs=data?data.tabs:null;
			if(tabs&&tabs.length>0){
				var str="<div id='s-menu' class='s-menu' style='top:"+sMenuTop+"px'>";
				str+="	我的工作台";
				str+="</div>";
				str+="<div id='ws-layer' style='top:"+wsBoxTop+"px'>";
				str+="	<div id='ws-box'>";
				str+="		<div class='ws-title'>";
				str+="			<img id='ws-img' class='ws-img' src='"+data.img+"' />";
				str+="			<span id='ws-name' class='ws-name'>"+data.name+"</span>";
				str+="			<div class='ws-closebtn' title='关闭'></div>";
				str+="		</div>";
				str+="		<div class='ws-content'>";
				str+="			<div class='ws-content-left'>";
				str+="				<ul id='ws-tab-index'>";
				for(var i=0;i<tabs.length;i++){
					str+="<li link='"+tabs[i].url+"'>";
					str+="	<img class='ws-tab-img' src='"+tabs[i].img+"' />";
					str+="	<span class='ws-tab-text'>"+tabs[i].name+"</span>";
					str+="</li>";
					
				}
				str+="				</ul>";
				str+="			</div>";
				str+="			<div class='ws-contetn-right'>";
				str+="				<iframe class='ws-iframe' frameborder='no' scrolling='auto' marginwidth='0' marginheight='0' src='"+tabs[0].url+"'></iframe>";
				str+="			</div>";
				str+="		</div>";
				str+="	</div>";
				str+="</div>";
				
				$("body").append(str);
			}
			$('#s-menu').click(function(){
				if (expanded) {
					wsclose();
				}else {
					wsopen();
				}
			});
			$(".ws-closebtn").click(function(){
				wsclose();
				
			});
			$("#ws-mask").live("click",function(){
				wsclose();
			});
			$("#ws-tab-index li").click(function(){
				var $this=$(this);
				$("#ws-tab-index li.active").removeClass("active");
				$this.addClass("active");
				var link=$this.attr("link");
				var iframe=$(".ws-iframe");
				iframe.fadeOut(300,function(){
					iframe.attr("src",link);
					setTimeout(function(){
						iframe.fadeIn(300);
					},100);
				});
			});
			$("#ws-tab-index li:first").addClass("active");
			
		  },
		  complete: function(XMLHttpRequest, textStatus){
			
		  },
		  error: function(xhr){
			  
		  }
	  });
	function wsclose(){
		$('#ws-box').animate({right:'-802px'},700,'easeInOutQuint',function(){
			$("#ws-layer").hide();
			$("#ws-mask").remove();
		});
		expanded = !expanded;
	}
	function wsopen(){
		$("#ws-layer").show();
		$('#ws-box').animate({right:'0px'},700,'easeInOutQuint');
		$("<div id='ws-mask'></div>").width(windowWidth).height(windowHeight).css("opacity",0.2).appendTo("body");
		expanded = !expanded;
	}
});

jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

function openNewPage(menuId,menuUrl,menuName){
	try{
		InterfaceObj.creatTabWindow(menuId,decodeURIComponent(menuUrl),menuName);
	}catch(e){
		window.location.href="/portal/portal/appCenterInitCmd.cmd?method=queryPageInit&appType=record&menuId="+menuId+"&menuText="+menuName+"&menuUrl="+menuUrl
	}
}
