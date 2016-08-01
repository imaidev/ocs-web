(function($) {  
  $.fn.basePhotoWall = function(options){    
      var opts = $.extend({}, $.fn.basePhotoWall.defaults, options);   
	  initPhotoWall(opts);   
      return function() {    
    }
  } ;
	function initPhotoWall(opts){
     var simplePhoWidth=opts.simplePhoWidth;
	 var simplePhoHeight=opts.simplePhoHeight;
	 var  fullPhotoWidth=opts.fullPhotoWidth;
	 var  fullPhotoHeight=opts.fullPhotoHeight;
	 //设置缩略图中图片的大小
	 $('.photoWall img').css({
	    width:simplePhoWidth,
		height:simplePhoHeight
	 })
	  
	 var photoWall=$(".photoWall");
     $("img",photoWall).click(function(){
         var imgs = $("img",photoWall);
	     var imgURLs=new Array(imgs.length);
		 var photoContent=imgs.length;
	     for(var i = 0;i<imgs.length;i++){   
	        imgURLs[i] = imgs[i].src;
	     }
	      var imgIndex=($(this).index());
  
          //获取浏览器的宽度和高度
          var bodyWidth=document.documentElement.clientWidth;
	      var bodyHeight=document.documentElement.clientHeight;
	      //获取body对象
          var theBody = document.getElementsByTagName('BODY')[0];
	      //创建遮挡的div
          var coverDiv = document.createElement('div');
          $(coverDiv).attr('class','v6_photoWal_coverDiv');
	      coverDiv.style.width=bodyWidth+"px";
	      coverDiv.style.height=bodyHeight+"px";
	      theBody.appendChild(coverDiv);
	      //创建左侧的div
	      var leftSlideDiv = document.createElement('div');
          $(leftSlideDiv).attr('class','v6_photoWall_leftSlideDiv');
	      leftSlideDiv.style.width="10%";
	      leftSlideDiv.style.height=bodyHeight+"px";
	      coverDiv.appendChild(leftSlideDiv);
	      //创建右侧的div
	      var rightSlideDiv = document.createElement('div');
          $(rightSlideDiv).attr('class','v6_photoWall_rightSlideDiv');
	      rightSlideDiv.style.width="10%";
	      rightSlideDiv.style.height=bodyHeight+"px";
	      coverDiv.appendChild(rightSlideDiv);
	      //创建中间的div
	      var centerSlideDiv = document.createElement('div');
          $(centerSlideDiv).attr('class','v6_photoWall_centerSlideDiv');
	      centerSlideDiv.style.width="80%";
	      centerSlideDiv.style.height=bodyHeight+"px";
	      $(centerSlideDiv).css("line-height",bodyHeight+"px");
	      coverDiv.appendChild(centerSlideDiv);
	      var imgSrc=$(this).attr("src");
	      $(centerSlideDiv).html("<img src="+imgSrc+"  class=\"v6_photoWall_centerImg\"  />");
	   // $('.v6_photoWall_centerImg').height();
	      var scrollTop = $(window).scrollTop();
	      scrollTop=50+scrollTop;
	      $(centerSlideDiv).css("top",scrollTop+"px");
	      //创建返回的按钮
	      var photoBackDiv = document.createElement('div');
          $(photoBackDiv).attr('class','v6_photoWall_backDiv');
          coverDiv.appendChild(photoBackDiv);
           
	    
	     var imges=$("img",photoWall);
		 $('.v6_photoWall_centerImg').css({
		       width:fullPhotoWidth,
			   height:fullPhotoHeight
		 
		 })
	      //为左侧div定义事件
	      $(leftSlideDiv).click(function(){
		    if(imgIndex>0){
	            imgIndex=imgIndex-1;
	            $(centerSlideDiv).html("<img src="+imgURLs[imgIndex]+"  class=\"v6_photoWall_centerImg\"  />");
			 }else if(imgIndex==0){
			    imgIndex=imgIndex-1;
				 $(centerSlideDiv).html("<div style=\"font-size:20px\" class=\"v6_photoWall_centerImg\">没有更多图片</div>");
				  return;
			 }else{
			     $(centerSlideDiv).html("<div style=\"font-size:20px\" class=\"v6_photoWall_centerImg\">没有更多图片</div>");
				  return;
			 
			 }
	   
	       });
	        //为右侧div定义事件
	      $(rightSlideDiv).click(function(){
			  if(imgIndex+1<photoContent){
			      imgIndex=imgIndex+1;
				    $(centerSlideDiv).html("<img src="+imgURLs[imgIndex]+"  class=\"v6_photoWall_centerImg\"  />");
			      
			  }else if(imgIndex+1==photoContent){
			      imgIndex=imgIndex+1;
				  $(centerSlideDiv).html("<div style=\"font-size:20px\" class=\"v6_photoWall_centerImg\">图片到了最后的尾巴</div>");
				  return;
			  
			  }else{
			    
			     $(centerSlideDiv).html("<div style=\"font-size:20px\" class=\"v6_photoWall_centerImg\">图片到了最后的尾巴</div>");
				  return;
			  
			  }
	      })
	       //为放大的图片定义事件
	      $(".v6_photoWall_centerImg").live('dblclick',function(){
	          $(".v6_photoWal_coverDiv").remove();
	      })
	      //为返回按钮定义事件    
	       $(photoBackDiv).click(function(){  
	    	  $(".v6_photoWal_coverDiv").remove();  
	       })
        })
	 } ;	
 
  //默认default属性的值
  $.fn.basePhotoWall.defaults = {    
      simplePhoWidth:'auto',                 //缩略图的宽度
	  simplePhoHeight:'400',                 //缩略图的高度
	  fullPhotoWidth:'auto',                 //大图的宽度
	  fullPhotoHeight:'auto'                 //大图的高度 
  };      
  
})(jQuery);