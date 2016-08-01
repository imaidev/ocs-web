// JavaScript Document
//去首页外其他页面，收起，打开商品分类		
 	

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

function initSlider() {
    // 幻灯片 
	var sliders = $('.flexslider');
	if (sliders.length>0) {
	    sliders.each(function() {
	        var slider = $(this);
	        var animation = slider.attr('animation') || 'fold';
	        
			slider.slide({
			    mainCell:".bd ul",
                effect: animation,
                trigger:"click",
                interTime: 7000,
                delayTime: 500,
                autoPlay: true
            });
		});
	}
}
//lifei 20140504 
 $(function(){
	 //去首页外其他页面，收起，打开商品分类		
 	$(".pro_classifi").mouseover(function(){
		$("#mainMenu").show();});
	$(".pro_classifi").mouseleave(function(){
		$("#mainMenu").hide();});
	 //首页banner
	// jQuery(".lf_topBanner").slide( { titCell:".bannerHd li", mainCell:".bannerBd ul", effect:"fold",autoPlay:true,trigger:"click",easing:"swing",delayTime:500,mouseOverStop:true,pnLoop:true });
		 initSlider();
	//首页滚动公告
	jQuery(".lf_message_left").slide( { mainCell:".lf_message_left_bd ul",autoPlay:true,effect:"leftMarquee",vis:2,interTime:25,opp:false,pnLoop:true,trigger:"click",mouseOverStop:true  });
	
	//首页滚动中标信息
	jQuery(".lf_message_right").slide( { mainCell:".lf_message_right_bd ul",autoPlay:true,effect:"leftMarquee",vis:2,interTime:25,opp:false,pnLoop:true,trigger:"click",mouseOverStop:true  });
		
	 //首页内容区adsBanner
	 jQuery(".adsBanner").slide( { titCell:".adsBannerHd li", mainCell:".adsBannerBd ul", effect:"fold",autoPlay:true,trigger:"click",easing:"swing",delayTime:500,mouseOverStop:true,pnLoop:true });
	
	jQuery(".hotSale").slide( { mainCell:".hotSaleBd ul",autoPage:true,effect:"left",autoPlay:true,scroll:"1",vis:"5",easing:"swing",delayTime:"500",pnLoop:false,trigger:true,mouseOverStop:"click" });
		
	 })