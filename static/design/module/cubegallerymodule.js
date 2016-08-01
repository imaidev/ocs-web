(function($){
	var g = {
	    config:function($el){
	        return moduleTool.config($el);
	    },
	    reset:function($el,opts){
	    	moduleTool.reset($el,opts,render);
	    },
	    run:function($el){
	    },
	    init:function($el){
	    	moduleTool.init($el,render);
	    },
	    reRender:function($el){
	    	render($el,moduleTool.config($el));
	    }
	};
	
	var render=function($widget,dataval){
		var opts = $.extend({}, $.fn.cubegallerymodule.defaults, dataval);
		
		var $modulePart=$widget.find(".cardStyle");//组件主体
		$modulePart.css("height",opts.height+"px");
		
		var $TablePart=$modulePart.find(".photoCardTable");//组件内TABLE
			
		$TablePart.remove();
			
		var table=tpl["type"+opts.type](opts);
		$modulePart.append(table);
		setCardHeight($widget,opts);
		setImgOpt($widget);
	}
    
	$.fn.cubegallerymodule=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};

	var tpl={
			type1:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='33.3%' rowspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardB"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");
				return arr.join("");
			},
			type2:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='33.3%' rowspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardB"));
				arr.push("        </td>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");
				return arr.join("");
			},
			type3:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='32%' rowspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardB"));
				arr.push("        </td>");
				arr.push("        <td width='36%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='32%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type4:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type5:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'");
				arr.push("	<tr>");
				arr.push("		<td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("		</td>");
				arr.push("		<td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("		</td>");
				arr.push("	</tr>");
				arr.push("	<tr>");
				arr.push("		<td>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("		</td>");
				arr.push("		<td>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("		</td>");
				arr.push("		<td>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("		</td>");
				arr.push("	</tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type6:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type7:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 5, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 6, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type8:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='33.3%' colspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='3'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='3'>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type9:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='50.21%' colspan='3'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='3'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type10:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='50%'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='50%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type11:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='65.73%' colspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");


				return arr.join("");
			},
			type12:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='47.78%' colspan='10'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='29.6%' colspan='6'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='5'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td colspan='5'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='6'>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td colspan='10'>");
				arr.push("				",getCardDiv(dataval, 5, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type13:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td colspan='2'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td width='50%'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='50%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type14:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='33.3%' rowspan='2'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardB"));
				arr.push("        </td>");
				arr.push("        <td width='33.3%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
			type15:function(dataval){
				var arr=[];
				arr.push("<table class='photoCardTable'>");
				arr.push("    <tr>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 0, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='25%' rowspan='2'>");
				arr.push("				",getCardDiv(dataval, 1, "photoCardB"));
				arr.push("        </td>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 2, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td width='25%'>");
				arr.push("				",getCardDiv(dataval, 3, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("    <tr>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 4, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 5, "photoCardS"));
				arr.push("        </td>");
				arr.push("        <td>");
				arr.push("				",getCardDiv(dataval, 6, "photoCardS"));
				arr.push("        </td>");
				arr.push("    </tr>");
				arr.push("</table>");

				return arr.join("");
			},
	};
	
	
	function setCardHeight($widget,dataval){
		//根据容器高度和块间距设置每个图片块的height
		$widget.find(".cardStyle").each(function(){
			var $this=$(this);
			var conH=$this.height();				
			var tdSpace=0;
			tdSpace=dataval.cellspacing;
			$this.find(".photoCardTable").css('border-spacing',tdSpace+"px");			
			var photoBH=conH-tdSpace*2;
			var photoSH=(conH-tdSpace*3)/2;
			$this.find(".photoCardB").css('height',photoBH);
			$this.find(".photoCardS").css('height',photoSH);
		})
	}
	function setImgOpt($widget){
			var $cardPanel=$widget.find(".cardStyle");
			
			var transFlag=false;
			var tansNum=$cardPanel.find(".album-moveL").length;//每个table中有偏移效果的图片块数
			if( tansNum>0 ){
				transFlag=true;				
			}
			
			var cardArr=$cardPanel.find(".photoCard");
			for(var i=0;i<cardArr.length;i++){
				var $imgCon=$(cardArr[i]);
				//var $cardDiv=$imgCon.find(".cardDiv");
				
				var imgArr=$imgCon.find("img.cardImg");
				for(var j=0;j<imgArr.length;j++){
					var $img=$(imgArr[j]);
					
					var image=new Image();
					image.my$img=$img;
					image.my$imgCon=$imgCon;
					//image.my$cardDiv=$cardDiv;
					image.onload=function(){
						var imgW= this.width;
						var imgH= this.height;
						
						var containerW=this.my$imgCon.width();
						var containerH=this.my$imgCon.height();
						
						var conPI=containerW/containerH;
						var imgPI=imgW/imgH;
						var imgShowW=0,imgShowH=0,marginT=0,marginL=0;					
						if( imgPI>conPI  ){
							/******
								图片宽高比  大于  容器宽高比，图片显示高==容器高，
								计算图片显示宽，水平偏移量,
								img设置height,父元素设置左外边距
							******/
							imgShowH=containerH;				
							imgShowW=Math.floor( (imgW*imgShowH)/imgH );
							/******
								如果有偏移效果，则需用额外方式计算图片width值
								此处需要
								1、获取改图片块的索引i（
								2、计算整个table中需要偏移的图片块数T					
								则width=由公式计算出来的width+(T-i+1)*10
							******/					
							if(transFlag){
								//获取该图片块在所有有偏移效果块集合中的索引
								var tansIndex=-1;
								var $obj=this.my$imgCon.find('.album-moveL');
								tansIndex=$cardPanel.find(".album-moveL").index( $obj );
								//console.log('要找元素的索引值'+tansIndex);
								//imgShowW=imgShowW+(tansNum-tansIndex+1)*10;
								imgShowW+=10;
								this.my$img.css('width',imgShowW);
							}
							marginL=(imgShowW-containerW)/2;
							this.my$img.css('height',imgShowH);
							//this.my$cardDiv.css('margin-left',-marginL);
							this.my$img.parent().parent().css('margin-left',-marginL);
						}else{
							/******
								图片宽高比  小于等于  容器宽高比，图片显示宽==容器宽，计算图片显示高，垂直偏移量
								img设置width,父元素设置上外边距
							******/
							imgShowW=containerW;									
							if(transFlag){
								var tansIndex=-1;
								var $obj=this.my$imgCon.find('.album-moveL');
								tansIndex=$cardPanel.find(".album-moveL").index( $obj );
								//imgShowW=imgShowW+(tansNum-tansIndex+1)*10;
								imgShowW+=10;
							}
							imgShowH=Math.floor( (imgH*imgShowW)/imgW );
							marginT=(imgShowH-containerH)/2;
							this.my$img.css('width',imgShowW);
							//this.my$cardDiv.css('margin-top',-marginT);		
							this.my$img.parent().parent().css('margin-top',-marginT);	
						}
					}
					image.src=$img.attr("src");
				}
			}
	}
	function getCardDiv(dataval,index,cardClass){
		var arr=[];
		arr.push("            <div class='photoCard ",cardClass,"'>");
		arr.push("                <div class='album ",dataval.effect,"'>");
		arr.push("                    <div class='cardDiv'>");
		arr.push("                        <a target='",dataval.target,"' ",dataval.imgs[index].href!=""?"href='"+dataval.imgs[index].href+"'":"style='cursor: default;'","><img class='cardImg ",dataval.effect=="album-moveL"?"moveImg":"","' src='",dataval.imgs[index].src,"'></a>");
		//各种特效追加DOM不同
		if(dataval.effect=="album-border"){
			if(dataval.custBorder=="0")//使用默认边框
				arr.push("<div class='inner' style='border:",$.fn.cubegallerymodule.defaults.borderWidth,"px ",$.fn.cubegallerymodule.defaults.borderStyle," ",$.fn.cubegallerymodule.defaults.borderColor,";'></div>");
			else
				arr.push("<div class='inner' style='border:",dataval.borderWidth,"px ",dataval.borderStyle," ",dataval.borderColor,";'></div>");
		}
		else if(dataval.effect=="album-mask" || dataval.effect=="album-mask-half"){
			arr.push("<div class='shDiv'>");
				if(dataval.custBg=="0"){//默认遮罩层
					arr.push("<div class='shade'></div>");
				}
				else{
					arr.push("<div class='shade' style='background:",dataval.bgColor,";-moz-opacity:",dataval.bgOp,";-khtml-opacity:",dataval.bgOp,";opacity:",dataval.bgOp,";    filter: alpha(opacity=",dataval.bgOp*100,")'></div>");
				}
				
				arr.push("<div class='sh-inner'>");
					arr.push("<div class='mask-info'>");
						if(dataval.custTitF=="0"){//默认图片标题
							arr.push("<p style='text-align:",dataval.tfAlign,";color:",$.fn.cubegallerymodule.defaults.tfColor,";font-weight:",$.fn.cubegallerymodule.defaults.tfBold=="on"?"bold":"","'>",dataval.imgs[index].title,"</p>");
						}
						else{
							arr.push("<p style='text-align:",dataval.tfAlign,";color:",dataval.tfColor,";font-weight:",dataval.tfBold=="on"?"bold":"","'>",dataval.imgs[index].title,"</p>");
						}
						
						if(dataval.showDesc=="1"){//需要显示描述
							if(dataval.custDescF=="0"){
								arr.push("<div style='text-align:",dataval.descAlign,";color:",$.fn.cubegallerymodule.defaults.descColor,";'>",decodeURI(decodeURI(dataval.imgs[index].desc)),"</div>");
							}
							else {
								arr.push("<div style='text-align:",dataval.descAlign,";color:",dataval.descColor,";'>",decodeURI(decodeURI(dataval.imgs[index].desc)),"</div>");
							}
							
						}
						
					arr.push("</div>");
				arr.push("</div>");
			arr.push("</div>");
		}
		else if(dataval.effect=="album-change"){
			arr.push("<div class='inner'><div class='cardDiv'>");
				arr.push("<a target='",dataval.target,"' ",dataval.imgs[index].href!=""?"href='"+dataval.imgs[index].href+"'":"style='cursor: default;'","><img class='cardImg' src='",dataval.imgs[index].replace,"'></a>");
			arr.push("</div></div>");
		}
		
		arr.push("                    </div>");
		arr.push("                </div>");
		arr.push("            </div>");
		return arr.join("");
	}
	$.fn.cubegallerymodule.defaults ={
			cellspacing:"10",
			type:"1",
			effect:"",
			height:"500",
			target:"_blank",
			
			custBorder:"0",
			borderColor:"#999",
			borderWidth:"3",
			borderStyle:"solid",
			
			custBg:"0",
			bgColor:"#000",
			bgOp:"0.6",
			
			custTitF:"0",
			tfBold:"",
			tfColor:"#fff",
			
			tfAlign:"center",
			
			showDesc:"1",
			custDescF:"0",
			descColor:"#fff",
			descAlign:"center",
			
			imgs:[{
			    	  href:"",
			    	  src:"/static/design/img/cube01.jpg",
			    	  title:"标题1",
			    	  desc:"",
			    	  replace:"/static/design/img/cube02.jpg"
			      },
			      {
			    	  href:"",
			    	  src:"/static/design/img/cube02.jpg",
			    	  title:"标题2",
			    	  desc:"",
			    	  replace:"/static/design/img/cube03.jpg"
			      },
			      {
			    	  href:"",
			    	  src:"/static/design/img/cube03.jpg",
			    	  title:"标题3",
			    	  desc:"",
			    	  replace:"/static/design/img/cube04.jpg"
			      },
			      {
			    	  href:"",
			    	  src:"/static/design/img/cube04.jpg",
			    	  title:"标题4",
			    	  desc:"",
			    	  replace:"/static/design/img/cube05.jpg"
			      },
			      {
			    	  href:"",
			    	  src:"/static/design/img/cube05.jpg",
			    	  title:"标题5",
			    	  desc:"",
			    	  replace:"/static/design/img/cube01.jpg"
			      },
			      {
			    	  href:"",
			    	  src:"/static/design/img/cube01.jpg",
			    	  title:"标题6",
			    	  desc:"",
			    	  replace:"/static/design/img/cube02.jpg"
			      },
			      {
			    	  href:"",
			    	  src:"/static/design/img/cube02.jpg",
			    	  title:"标题7",
			    	  desc:"",
			    	  replace:"/static/design/img/cube01.jpg"
			      }]
	}
})(jQuery)