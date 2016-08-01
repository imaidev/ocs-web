jQuery.fn.commonFloatBox = function(options){
	var url=options.url;
	var staticHtml=options.staticHtml;
	$("body").append("<div class='floatWindowOuter'></div>");
	var $linkpopup = $(".floatWindowOuter");
	var $curLink = null;
	var linkPopupFlag = false;
	var timeId;
	var delay=500;//悬浮 n秒后显示
	var linkpopupwidth;
	var linkpopupheight;
	var linkpopuptext;
	var linkpopupstyle1="<div class='floatWindow'><div class='floatWindowUn'><div class='floatWindowBody'></div></div><div class='floatWindowUnArrow' ></div></div>";
	this.each(function(){
		var link = $(this);
			link.hover(function() {
				timeId = setTimeout(function() {
					 $curLink = link;
					  //ajax
					  $.ajaxSetup({cache: false}); 
					  $linkpopup.append("<div class='floatWindow'><div class='floatWindowOnArrow' ></div><div class='floatWindowOn'><div class='floatWindowBody'>正在加载 ...</div></div></div>");
					  $linkpopup.css("display", "block");
			          if(url!=undefined){
			            var floatUrl=url; 
					    $(".floatWindowBody").load(floatUrl,
					    function(){
					  	linkpopupheight=$linkpopup.height();
					  	linkpopupwidth=$linkpopup.width();
					  	linkpopuptext=$(".floatWindowBody").html();			
					    var offset = link.offset();
					    //判断浮动应该在链接的上边还是下边
					   	if((offset.top+linkpopupheight-$(document).scrollTop()+10)>$(window).height()){
					  		$(".floatWindow").remove();
					  		$linkpopup.append(linkpopupstyle1);
					  	 	$(".floatWindowBody").html(linkpopuptext);
					  	 	offset.top = offset.top - link.height()-$linkpopup.height()+10;
					  	}else{
					  		offset.top = offset.top + link.height();
					  	}
					   	//判断浮动靠左还是靠右
					   	if((offset.left+linkpopupwidth-$(document).scrollLeft()+10)>$(window).width()){
					   		//如果靠右，箭头同样需要放到右边
					  	 	$(".floatWindowOnArrow").css("left",$linkpopup.width()-40+'px');
					  	 	$(".floatWindowUnArrow").css("left",$linkpopup.width()-40+'px');
					  	 	offset.left = offset.left + link.width()-$linkpopup.width()+5;
					  	}
						$linkpopup.offset(offset);
					  });
				      }else if(staticHtml!=undefined){	
							    var offset = link.offset();
							    /*
							    $(".floatWindowBody").css({
							    	"min-height":"100px",
							    	"min-width":"200px"
							    })*/
								$(".floatWindowBody").html(staticHtml);
							    //判断浮动应该在链接的上边还是下边
							   	if((offset.top+linkpopupheight-$(document).scrollTop()+10)>$(window).height()){
							  		$(".floatWindow").remove();
							  		$linkpopup.append(linkpopupstyle1);
							  	 
							  	 	offset.top = offset.top - link.height()-$linkpopup.height()+10;
							  	}else{
							  		offset.top = offset.top + link.height();
							  	}
							   	//判断浮动靠左还是靠右
							   	if((offset.left+linkpopupwidth-$(document).scrollLeft()+10)>$(window).width()){
							   		//如果靠右，箭头同样需要放到右边
							  	 	$(".floatWindowOnArrow").css("left",$linkpopup.width()-40+'px');
							  	 	$(".floatWindowUnArrow").css("left",$linkpopup.width()-40+'px');
							  	 	offset.left = offset.left + link.width()-$linkpopup.width()+5;
							  	}
								$linkpopup.offset(offset);	  
				      }else{
				    	  
				    	  var offset = link.offset();
				    	  /*
						    $(".floatWindowBody").css({
						    	"min-height":"100px",
						    	"min-width":"200px"
						    })*/
							$(".floatWindowBody").html("<div class=\"undefiedFloatContent\"></div>");
						    //判断浮动应该在链接的上边还是下边
						   	if((offset.top+linkpopupheight-$(document).scrollTop()+10)>$(window).height()){
						  		$(".floatWindow").remove();
						  		$linkpopup.append(linkpopupstyle1);
						  	 
						  	 	offset.top = offset.top - link.height()-$linkpopup.height()+10;
						  	}else{
						  		offset.top = offset.top + link.height();
						  	}
						   	//判断浮动靠左还是靠右
						   	if((offset.left+linkpopupwidth-$(document).scrollLeft()+10)>$(window).width()){
						   		//如果靠右，箭头同样需要放到右边
						  	 	$(".floatWindowOnArrow").css("left",$linkpopup.width()-40+'px');
						  	 	$(".floatWindowUnArrow").css("left",$linkpopup.width()-40+'px');
						  	 	offset.left = offset.left + link.width()-$linkpopup.width()+5;
						  	}
							$linkpopup.offset(offset);	  
				    	  
				    	  
				    	  
				      }
				  	 	$linkpopup.css("display", "block");	
				},delay);
		  },function(){
			  clearTimeout(timeId);
			  linkPopupFlag=true;
			  setTimeout(linkPopupDisappear,200);
		  }
		 );
	});
	function linkPopupDisappear(){
		if(linkPopupFlag){
			$linkpopup.css("display","none");
			$(".floatWindow").remove();
		}				  
	}
	$linkpopup.hover(function(){
		linkPopupFlag=false;			  
	  },function(){
		  linkPopupFlag=true;
		  linkPopupDisappear();
	  });
};
