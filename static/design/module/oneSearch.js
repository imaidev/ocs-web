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
    
	$.fn.oneSearch=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};
	var selectCt1= function(){
			var $tarObj = $(this);
			var srhTypeId="#" +$tarObj.attr('id');
			srhTypeId = srhTypeId.replace("Li","");
			$tarObj.siblings().removeClass("active");
			$tarObj.addClass('active');
			if ($(srhTypeId).length == 0) {return}
			$('.srh-inner').find('.srh-input').css('display','none');
			$('.srh-inner').find('.srh-input').removeClass('curselected');
			$(srhTypeId).css('display','block');
			$(srhTypeId).addClass('curselected');
			$tarObj.parent().parent().parent().find(".hotSearch").find("li").each(function(){
				$(this).css('display','none');
			});
			$("."+srhTypeId.replace("#","")+"keyWords").removeAttr("style");
		}
		
	var selectCt2= function(obj){ 
		var $elements=$(obj);
        return $elements.each(function(){ 
            var $this = $(this); 
            var $shows = $this.find(".shows"); 
            var $selectOption = $this.find(".selectOption"); 
            var $widget = $this.find("ul > li");                                        
            $this.click(function(e){ 
                $(this).toggleClass("zIndex"); 
                $(this).children("ul").toggleClass("dis"); 
                e.stopPropagation(); 
            });     
			
            $widget.bind("click",function(){ 
                var $this_ = $(this);
                $this_.parent().parent().find(".selectOption").text($this_.text()); 
				var srhTypeId="#" +$this_.attr('class');
				if ($(srhTypeId).length == 0) {return}
				$('.srh-inner').find('.srh-input').css('display','none');
				$('.srh-inner').find('.srh-input').removeClass('curselected');
				$(srhTypeId).css('display','inline-block');
				$(srhTypeId).addClass('curselected');
				var str="",strK=[];
				$this_.parent().parent().parent().parent().parent().parent().find(".hotSearch").find("li").each(function(){
					$(this).css('display','none');
				});
				$("."+$this_.attr('class')+"keyWords").removeAttr("style");
            }); 
			
            $("body").bind("click",function(){ 
                $this.removeClass("zIndex"); 
                $this.find("ul").removeClass("dis");     
            }) 
			
			$this.children("ul").find(".dis").hover(function () {
				$(this).addClass("hover-in");
				$(this).show();
			},function(){ 
				$(this).removeClass("hover-in");
				$(this).hide();
			});
        });            
    } 
	
	var selectCt3= function(){

	}
	
	var render=function($widget,dataval,type){
		var opts = $.extend({}, $.fn.oneSearch.defaults, dataval);
		
		if(type=="run"){
	    	var csstype=opts.cssType;
	    	if(csstype==undefined){
	    		csstype="1";
	    	}
	    	var searchType=GetQueryString("searchType");
	    	if(searchType==null){
	    		//如果为空，则取默认
	    		var datalist = opts.oneser;
	    		for(var k=0;k<opts.oneser.length;k++){
	    			var isDef = opts.oneser[k].isDef;
	    			if("1"==isDef){
	    				searchType = opts.oneser[k].enName;
	    			}
	    		}
	    		
	    	}
	    	if("1"==csstype){
	    		$this_ = $widget.find("."+searchType);
	    		if($this_.length!=0){
	    			$widget.find(".selectOption").text($this_.text());
	    			
	    		}
	    		
	    		var srhTypeId="#" +$this_.attr('class');
				if ($(srhTypeId).length == 0) {return}
				$('.srh-inner').find('.srh-input').css('display','none');
				$('.srh-inner').find('.srh-input').removeClass('curselected');
				$(srhTypeId).css('display','inline-block');
				$(srhTypeId).addClass('curselected');
				$this_.parent().parent().parent().parent().parent().parent().find(".hotSearch").find("li").each(function(){
					$(this).css('display','none');
				});
				$("."+$this_.attr('class')+"keyWords").removeAttr("style");
				selectCt2(".selectContainer");
	    	}else if("2"==csstype){
	    		var $tarObj =$widget.find("#"+searchType+"Li");
	    		$tarObj.siblings().removeClass("active");
				var srhTypeId="#" +$tarObj.attr('id');
				$tarObj.addClass('active');
				if ($(srhTypeId).length == 0) {return}
				$('.srh-inner').find('.srh-input').css('display','none');
				$('.srh-inner').find('.srh-input').removeClass('curselected');
				$("#"+searchType).css('display','block');
				$("#"+searchType).addClass('curselected');
				$tarObj.parent().parent().parent().find(".hotSearch").find("li").each(function(){
					$(this).css('display','none');
				});
				$("."+srhTypeId.replace("#","").replace("Li","")+"keyWords").removeAttr("style");
	    		$widget.find('.s-tags').find('li').on("click",selectCt1);
	    	}else if("3"==csstype){
	    		$('.srh-inner').find('.srh-input').css('display','none');
				$('.srh-inner').find('.srh-input').removeClass('curselected');
				$("#OneSearch_item").css('display','block');
	    		$("#OneSearch_item").css('height','33px');
				$("#OneSearch_item").addClass('curselected');
				
				/*$tarObj.parent().parent().parent().find(".hotSearch").find("li").each(function(){
					$(this).css('display','none');
				});*/
				searchType="OneSearch_item";
	    	}
	    	var keyWord = GetQueryString("keyWord");
	    	
	    	$("#"+searchType).val(keyWord);
	    	$("#searchType").val(searchType);
	    	$widget.find("#searchBtn").bind("click",function (){
				var searchLat = $widget.find("#latitudeSearchForm").find('.srh-inner').find('.srh-input.curselected').attr("id");
				$widget.find("#searchType").val(searchLat);
				$("#keyWord").val($("#"+searchLat).val());
	    		document.getElementById ("latitudeSearchForm").action = ctx+"/"+$("#"+searchLat+"Url").val()+"?searchType="+$widget.find("#searchType").val()+"&keyWord="+encodeURI(encodeURI($widget.find("#keyWord").val()));
				document.getElementById ("latitudeSearchForm").submit();
	    	});
	    	if("OneSearch_item"==searchType){
	    		$widget.find("#searchBtnInShop").bind("click",function (){
				var searchLat = $widget.find("#latitudeSearchForm").find('.srh-inner').find('.srh-input.curselected').attr("id");
				$widget.find("#searchType").val(searchLat);
				$("#keyWord").val($("#"+searchLat).val());
	    		document.getElementById ("latitudeSearchForm").action = "/shop/"+g_vendid+"/itemList.html?keyWordSearch="+encodeURI(encodeURI($widget.find("#keyWord").val()));
				document.getElementById ("latitudeSearchForm").submit();
	    	})
	    	}
	    	
	    	
	    	
	    	
	    	$widget.find(".hotSearch").find("li").each(function(){
	    		$(this).find("a").on("click",function(){
	    			$("#keyWord").val($(this).html());
	    			var searchLat = $widget.find('.srh-inner').find('.srh-input.curselected').attr("id");
	    			$("#searchType").val(searchLat);
	    			$("#"+searchLat).val($(this).html());
	    			document.getElementById ("latitudeSearchForm").action = ctx+"/"+$("#"+searchLat+"Url").val()+"?searchType="+$widget.find("#searchType").val()+"&keyWord="+encodeURI(encodeURI($widget.find("#keyWord").val()));
	    			document.getElementById ("latitudeSearchForm").submit();
	    			
	    		});
	    	});
		}else{
			var strT=[],strM=[],strK=[],strL=[],strU=[];
			
			//获取下拉列表的数据
	        $.get(ctx+"/design/dataAPI/base/OneSearchDataApi.do?method=getLatitudeInfo",
	     	       function(data){
	        			if(opts){
	        				var cssType = opts.cssType;
	        				if("1"==cssType){
	        					var msgValue=[];
	        					for(var i=0;i<opts.oneser.length;i++){
	        						var dataValue=[];
	        						dataValue.push("class='",opts.oneser[i].enName,"'");
	        						msgValue.push("<input id='",opts.oneser[i].enName,"'","class='srh-input ");
	        						var curkeyWords = opts.oneser[i].keyWors.split(",");
	        						if('1'==opts.oneser[i].isDef){
	        							for(var j=0;j<curkeyWords.length;j++){
	        								strK.push("<li class='"+opts.oneser[i].enName+"keyWords'><a  onclick=\"doSearch('"+opts.oneser[i].enName+"','"+curkeyWords[j]+"')\">",curkeyWords[j],"</a></li>");
	        							}
	        							//热词搜索
	        							strT.push(opts.oneser[i].showName);//当前默认展示的搜索关键字
	        							strM.push(opts.oneser[i].prompt);//搜索关键字
	        							msgValue.push(" curselected'");
	        							msgValue.push("style='display:inline-block;'");
	        						}else{
	        							msgValue.push("'");
	        							for(var j=0;j<curkeyWords.length;j++){
	        								strK.push("<li class='"+opts.oneser[i].enName+"keyWords' style='display:none'><a  onclick=\"doSearch('"+opts.oneser[i].enName+"','"+curkeyWords[j]+"')\">",curkeyWords[j],"</a></li>");
	        							}
	        						}
	        						msgValue.push( "type='text'","placeholder='",opts.oneser[i].prompt,"'" );
	        						msgValue.push(" />");
	        						strU.push("<input id='"+opts.oneser[i].enName+"KeyWords' value='"+opts.oneser[i].keyWors+"' style='display:none' />");
	        						strU.push("<input id='"+opts.oneser[i].enName+"Url' name='"+opts.oneser[i].enName+"Url' value='"+opts.oneser[i].searchUrl+"' style='display:none' />");
	        						if("1"==opts.oneser[i].isShow){
	        							strL.push("<li ",dataValue.join(''),">",opts.oneser[i].showName,"</li>");
	        						}else{
	        							strL.push("<li ",dataValue.join('')," style='display:none'>",opts.oneser[i].showName,"</li>");
	        						}
	        						
	        					}
	        					var strall="";
	        					strall+="<form id=\"latitudeSearchForm\" name=\"latitudeSearchForm\" method=\"post\" action=\"\">";
	        					strall+="<input id=\"searchType\" name=\"searchType\" type=\"hidden\" value=\"\" />";
	        					strall+="<input id=\"keyWord\" name=\"keyWord\" type=\"hidden\" value=\"\" />";
	        					strall+=strU.join("");
	        					strall+="<div class=\"search-select\">";
	        					strall+="<div class=\"searchCon\">";
	        					strall+="<div class=\"srh-inner\">";
	        					strall+="<div class=\"selectContainer\"> ";
	        					strall+="<span class=\"selectOption\">"+strT.join('')+"</span> ";
	        					strall+="<ul class=\"selectMenu\">";
	        					strall+=strL.join('');
	        					strall+="</ul> ";
	        					strall+="<span class=\"shows\"></span>";
	        					strall+="</div>";
	        					strall+=msgValue.join('');
	        					strall+="</div>";
	        					strall+="<button id=\"searchBtn\" onclick=\"searchFormSubmit()\">搜&nbsp;索</button>";
	        					strall+="</div>";
	        					strall+="</div>";
	        					strall+="<ul class=\"hotSearch\">	";
	        					strall+=strK.join('');
	        					strall+="</ul>";
	        					strall+="</form>";
	        					$widget.find(".searchPanel").html(strall);
	        					selectCt2(".selectContainer");
	        				}else if("2"==cssType){
	        					var msgValue=[];
	        					for(var i=0;i<opts.oneser.length;i++){
	        						var dataValue=[]
	        						dataValue.push("id='",opts.oneser[i].enName,"Li'");
	        						msgValue.push("<input id='",opts.oneser[i].enName,"'","class='srh-input ");
	        						var curkeyWords = opts.oneser[i].keyWors.split(",");
	        						if('1'==opts.oneser[i].isDef){
	        							for(var j=0;j<curkeyWords.length;j++){
	        								strK.push("<li class='"+opts.oneser[i].enName+"keyWords'><a  onclick=\"doSearch('"+opts.oneser[i].enName+"','"+curkeyWords[j]+"')\">",curkeyWords[j],"</a></li>");
	        							}
	        							dataValue.push("class='active'");//当前默认展示的搜索关键字
	        							msgValue.push(" curselected'");
	        							msgValue.push("style='display:block;'");
	        							strM.push(opts.oneser[i].prompt);//搜索关键字
	        						}else{
	        							for(var j=0;j<curkeyWords.length;j++){
	        								strK.push("<li class='"+opts.oneser[i].enName+"keyWords' style='display:none'><a  onclick=\"doSearch('"+opts.oneser[i].enName+"','"+curkeyWords[j]+"')\">",curkeyWords[j],"</a></li>");
	        							}
	        							msgValue.push("'");
	        						}
	        						msgValue.push( "type='text'","placeholder='",opts.oneser[i].prompt,"'" );
	        						msgValue.push(" />");
	        						strU.push("<input id='"+opts.oneser[i].enName+"Url' name='"+opts.oneser[i].enName+"Url' value='"+opts.oneser[i].searchUrl+"' style='display:none' />");
	        						strU.push("<input id='"+opts.oneser[i].enName+"KeyWords' value='"+opts.oneser[i].keyWors+"'  style='display:none' />");
	        						if("1"==opts.oneser[i].isShow){
	        							strL.push("<li ",dataValue.join(''),">",opts.oneser[i].showName,"</li>");
	        						}else{
	        							strL.push("<li ",dataValue.join('')," style='display:none'>",opts.oneser[i].showName,"</li>");
	        						}
	        						
	        					}
	        					var strall="";
	        					strall+="<form id=\"latitudeSearchForm\" name=\"latitudeSearchForm\" method=\"post\" action=\"\">";
	        					strall+="<input id=\"searchType\" name=\"searchType\" type=\"hidden\" value=\"\" />";
	        					strall+="<input id=\"keyWord\" name=\"keyWord\" type=\"hidden\" value=\"\" />";
	        					strall+=strU.join("");
	        					strall+="<div class=\"search-tabs\">";
	        					strall+="<ul class=\"s-tags\">";
	        					strall+=strL.join('');
	        					strall+="</ul>";
	        					strall+="<div class=\"searchCon\">";
	        					strall+="<div class=\"srh-inner\">";
	        					strall+=msgValue.join('');
	        					strall+="</div>";
	        					strall+="<button id=\"searchBtn\" onclick=\"searchFormSubmit()\">搜&nbsp;索</button>";
	        					strall+="</div>";
	        					strall+="</div>";
	        					strall+="<ul class=\"hotSearch\">";
	        					strall+=strK.join('');
	        					strall+="</ul>";
	        					strall+="</form>";
	        					$widget.find(".searchPanel").html(strall);
	        					$('.s-tags').find('li').on("click",selectCt1);
	        				}else if("3"==cssType){
	        					var msgValue=[];
	        					for(var i=0;i<opts.oneser.length;i++){
	        						var curkeyWords = opts.oneser[i].keyWors.split(",");
	        						if("OneSearch_item"==opts.oneser[i].enName){
	        							msgValue.push("<input id='",opts.oneser[i].enName,"'","class='srh-input ");
	        						}
	        						
	        						if('1'==opts.oneser[i].isDef){
	        							for(var j=0;j<curkeyWords.length;j++){
	        								strK.push("<li class='"+opts.oneser[i].enName+"keyWords'><a  onclick=\"doSearch('"+opts.oneser[i].enName+"','"+curkeyWords[j]+"')\">",curkeyWords[j],"</a></li>");
	        							}
	        						/*	if("OneSearch_item"==opts.oneser[i].enName){
	        								msgValue.push(" curselected'");
		        							msgValue.push("style='display:block;'");
	        							}
	        							*/
	        						}else{
	        							for(var j=0;j<curkeyWords.length;j++){
	        								strK.push("<li class='"+opts.oneser[i].enName+"keyWords' style='display:none'><a  onclick=\"doSearch('"+opts.oneser[i].enName+"','"+curkeyWords[j]+"')\">",curkeyWords[j],"</a></li>");
	        							}	
	        							if("OneSearch_item"==opts.oneser[i].enName){
	        								msgValue.push(" curselected'");
		        							msgValue.push("style='display:block;height:33px;'");
	        								msgValue.push("'");
	        							}
	        							
	        						}
	        						if("OneSearch_item"==opts.oneser[i].enName){
	        							msgValue.push( "type='text'","placeholder='",opts.oneser[i].prompt,"'" );
		        						msgValue.push(" />");
	        						}
	        						strU.push("<input id='"+opts.oneser[i].enName+"Url' name='"+opts.oneser[i].enName+"Url' value='"+opts.oneser[i].searchUrl+"' style='display:none' />");
	        						strU.push("<input id='"+opts.oneser[i].enName+"KeyWords' value='"+opts.oneser[i].keyWors+"'  style='display:none' />");
	        					}
	        					var strall="";
	        					strall+="<form id=\"latitudeSearchForm\" name=\"latitudeSearchForm\" method=\"post\" action=\"\">";
	        					strall+="<input id=\"searchType\" name=\"searchType\" type=\"hidden\" value=\"\" />";
	        					strall+="<input id=\"keyWord\" name=\"keyWord\" type=\"hidden\" value=\"\" />";
	        					strall+=strU.join("");

	        					strall+="<div class=\"searchCon\">";
	        					strall+="<div class=\"srh-inner\">";
	        					strall+=msgValue.join('');
	        					strall+="</div>";
	        					strall+="<button id=\"searchBtnInShop\" onclick=\"searchFormSubmit()\">搜本店</button>";
	        					strall+="<button id=\"searchBtn\" onclick=\"searchFormSubmit()\" style='left:510px;'>搜商城</button>";
//	        					strall+="<a class='srh-btn f14' style='color:#fff; line-height:36px; text-align:center;' >搜本店</a>";
//	        					strall+="<a class='srh-btn f14' style='color:#fff; line-height:38px; height:38px; text-align:center; left:450px; background:#2797c3;' id='searchType'>搜商城</a> ";
	        					strall+="</div>";
	        					
	        					strall+="<ul class=\"hotSearch\">";
	        					strall+=strK.join('');
	        					strall+="</ul>";
	        					strall+="</form>";
	        					$widget.find(".searchPanel").html(strall);
	        					
	        				}
	        				
	        				
	        				
	        				else{
	            				var msgValue=[];
	            				for(var i=0;i<data.length;i++){
	            					var dataValue=[];
	        						dataValue.push("class='",data[i].searchLatitud,"'");
	        						msgValue.push("<input id='",data[i].searchLatitud,"'","class='srh-input ");
	        						if(i==0){
	        							//热词搜索
	        							strT.push(data[i].searchName);//当前默认展示的搜索关键字
	        							msgValue.push(" curselected'");
	        							msgValue.push("style='display:inline-block;'");
	        						}else{
	        							msgValue.push("'");
	        						}
	        						msgValue.push( "type='text'","placeholder=''" );
	        						msgValue.push(" />");
	        						strU.push("<input id='"+data[i].searchLatitud+"KeyWords' value='' style='display:none' />");
	        						strU.push("<input id='"+data[i].searchLatitud+"Url' name='"+data[i].searchLatitud+"Url' value='"+data[i].searchUrl+"' style='display:none' />");
	    							strL.push("<li ",dataValue.join(''),">",data[i].searchName,"</li>");
	            				}
	        					var strall="";
	        					strall+="<form id=\"latitudeSearchForm\" name=\"latitudeSearchForm\" method=\"post\" action=\"\">";
	        					strall+="<input id=\"searchType\" name=\"searchType\" type=\"hidden\" value=\"\" />";
	        					strall+="<input id=\"keyWord\" name=\"keyWord\" type=\"hidden\" value=\"\" />";
	        					strall+=strU.join("");
	        					strall+="<div class=\"search-select\">";
	        					strall+="<div class=\"searchCon\">";
	        					strall+="<div class=\"srh-inner\">";
	        					strall+="<div class=\"selectContainer\"> ";
	        					strall+="<span class=\"selectOption\">"+strT.join('')+"</span> ";
	        					strall+="<ul class=\"selectMenu\">";
	        					strall+=strL.join('');
	        					strall+="</ul> ";
	        					strall+="<span class=\"shows\"></span>";
	        					strall+="</div>";
	        					strall+=msgValue.join('');
	        					strall+="</div>";
	        					strall+="<button id=\"searchBtn\" onclick=\"searchFormSubmit()\">搜&nbsp;索</button>";
	        					strall+="</div>";
	        					strall+="</div>";
	        					strall+="<ul class=\"hotSearch\">	";
	        					strall+=strK.join('');
	        					strall+="</ul>";
	        					strall+="</form>";
	        					$widget.find(".searchPanel").html(strall);
	        					selectCt2(".selectContainer");
	        				}
	        			}
	     			},'json');
		
		}
	}

	
	$.fn.oneSearch.defaults ={
			oneser:[{
				enName:"OneSearch_shop",
				showName:"店铺",
				prompt:"",
				isShow:"1",
				isDef:"1",
				keyWors:"",
				searchUrl:""
	        },{
				enName:"OneSearch_item",
				showName:"商品",
				prompt:"",
				isShow:"1",
				isDef:"0",
				keyWors:"",
				searchUrl:""
	        },
	        {
				enName:"OneSearch_article",
				showName:"文章",
				prompt:"",
				isShow:"1",
				isDef:"0",
				keyWors:"",
				searchUrl:""
	        }
	        ],
	        
		
	};
	
	function GetQueryString(name)
	{
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = decodeURI(decodeURI(window.location.search)).substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
})(jQuery)