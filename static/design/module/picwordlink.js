(function($){
	var g = {
		    config:function($el){
		    	return moduleTool.config($el);
		    },
		    reset:function($el,opts){
		    	moduleTool.reset($el,opts,render);
		    },
		    run:function($el){
		    	moduleTool.run($el,render);
		    },
		    init:function($el){
		    	moduleTool.init($el,render);
		    }
		};
	$.fn.picwordlink=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};
	
	
	//设置显示的内容
	var render=function($widget,dataval,renderType){
		var opts = $.extend({}, $.fn.picwordlink.defaults, dataval);
        
		if(opts){
			var Underline;
			var bold;
			if(opts.Underline==true){
				 Underline="underline";
			}
			if(opts.bold==true){
				bold="bold";
			}
			
			var styletype=opts.styletype;
			var colortype=opts.colortype;
			var showstyle=opts.showstyle;// 01 图文  , 02 横向 , 03 纵向
			var wordsize=opts.wordsize;
			
			if(null!=wordsize&&wordsize!="undefined"&&wordsize!=""&&(wordsize).indexOf('px')=="-1"){
				wordsize=wordsize+"px";
			}else{
				wordsize=wordsize;
			}
			var strC=[];
			
			for(var i=0;i<opts.imgs.length;i++){
				
				var  urlwidth;
				var  urlhigh;
				
				var  openway; 
				if(null!=opts.imgs[i].openstyle&&opts.imgs[i].openstyle=="01"){
					//新窗口
					openway="_blank";
				}else{
					//当前窗口
					openway="_self";
				}
				
				if(null!=opts.imgs[i].urlwidth&&opts.imgs[i].urlwidth!="undefined"&&opts.imgs[i].urlwidth!=""&&(opts.imgs[i].urlwidth).indexOf('px')=="-1"){
					 urlwidth=opts.imgs[i].urlwidth+"px";
				}else{
					 urlwidth=opts.imgs[i].urlwidth;
				}
				
				if(null!=opts.imgs[i].urlhigh&&opts.imgs[i].urlhigh!="undefined"&&opts.imgs[i].urlhigh!=""&&(opts.imgs[i].urlhigh).indexOf('px')=="-1"){
					 urlhigh=opts.imgs[i].urlhigh+"px";
				}else{
					 urlhigh=opts.imgs[i].urlhigh;
				}
				
				if("02"==showstyle){
					//横向
					strC.push("<div class='link-h-container' ><a class='link-h' href=",opts.imgs[i].href," target=",openway,">   <font style='font-family:",styletype,";font-weight:",bold,";text-decoration:",Underline,";color:",colortype,";font-size:",wordsize," ' >",opts.imgs[i].wordsrc,"</font> </a></div>");
				}else if ("03"==showstyle){
					//纵向
					strC.push("<div class='link-v-container' ><a class='link-h' href=",opts.imgs[i].href," target=",openway,">  <font style='font-family:",styletype,";font-weight:",bold,";text-decoration:",Underline,";color:",colortype,";font-size:",wordsize," '>",opts.imgs[i].wordsrc,"</font>  </a></div>");
				}else if ("01"==showstyle){
					strC.push("<div class='link-p-container'>");
					strC.push("<table cellpadding='0' cellspacing='0'>");
					strC.push("<tbody>");
					strC.push("<tr>");
					strC.push("<td align='center' valign='bottom' ><a class='link-p' href=",opts.imgs[i].href," target=",openway,"><img style='width:",urlwidth,";height:",urlhigh,";' src=",opts.imgs[i].src," title='' alt='' ></a></td>");
					strC.push("</tr>");
					strC.push("<tr>");
					strC.push("<td align='center'><a class='link-h' href=",opts.imgs[i].href," target=",openway,">   <font style='font-family:",styletype,";font-weight:",bold,";text-decoration:",Underline,";color:",colortype,";font-size:",wordsize," '>   ",opts.imgs[i].wordsrc," </font> </a></td>");
					strC.push("</tr>");
					strC.push("</tbody>");
					strC.push("</table>");
					strC.push("</div>");
				}
				
			}
			
			$widget.find(".graphicsText ").html(strC.join('')); 
			
		}
	}


	
	$.fn.picwordlink.defaults ={
			imgs:[
			      {src:"/static/design/img/default.png",
			       href:"#",
			       wordsrc:"示例文字一",
			       openstyle:"01",
			       urlwidth:"200",
			       urlhigh:"200"
			    	   }
			      ],
			height:"400",
			Underline:false,
			bold:false,
			styletype:"",
			colortype:"",
			showstyle:"01",
			isself:"02",
			moduleTitle:"图文链接",
			wordsize:""
	};
})(jQuery)