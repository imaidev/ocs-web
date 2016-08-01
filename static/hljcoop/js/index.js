// JavaScript Document
 $(function(){
	//首页js
	jQuery(".adsBanner").slide( { titCell:".adsBannerHd li", mainCell:".adsBannerBd ul", effect:"fold",autoPlay:true,trigger:"click",easing:"swing",delayTime:500,mouseOverStop:true,pnLoop:true });
	jQuery(".notice").slide( { titCell:".noticeHd li", mainCell:".noticeBd", effect:"fade",autoPlay:false,trigger:"click",easing:"swing",delayTime:500,pnLoop:false });
	})