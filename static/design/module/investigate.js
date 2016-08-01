(function($){
	var g = {
	    config:function($el){
	        
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
	
	 
	$.fn.investigate=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	    })
	    if (operr) return operr;

	    return this;
	};	
	
	
	
		var render=function($widget,dataval,isReset){
			
			
				if (isReset == "run") {
					
					getInvestigateDetial($widget.find(".investigateDiv"));
					$widget.find(".s_ibutton").click(setInvestigateByUser);
				
				
				}else if (isReset == "init") {
					$widget.find(".s_ibutton").click(noAlowSubmit);
					getInvestigateDetial($widget.find(".investigateDiv"));
					
					if($widget.find(".investigateDiv:has(div)").length==0){
							var domstr=[];
							 domstr.push("<h1 class='fm1' style='height: 200px;font-size: 18px;line-height: 200px;'>未配置调查问卷</h1>");
							var str=domstr.join("");
							$widget.find(".noInvestigate").html(str);
							
							//隐藏按钮
							$widget.find(".questionaireOnline").hide();
							
						}
					
				}else if (isReset == "reset") {
					$widget.find(".s_ibutton").click(noAlowSubmit);
					//颜色主题设置 begin
					var investigateId = dataval.investigateId;
					var investigateColor = dataval.investigateColor;
					$widget.data('data-val',dataval);
					var oldVoteColor = $widget.find("input[name='investigateColor']").val();
					if(oldVoteColor==""){
						$widget.find(".s_ibutton ").removeClass("btn_blue");	
					}else{
						$widget.find(".s_ibutton ").removeClass(oldVoteColor);
					}
					$widget.find(".s_ibutton ").addClass(investigateColor);
					$widget.find("input[name='investigateId']").val(investigateId);
					$widget.find("input[name='investigateColor']").val(investigateColor);
					//颜色主题设置 end
					
					getInvestigateDetial($widget.find(".investigateDiv"));
						
					$widget.find(".noInvestigate").html("");//删除需要默认配置提示
					//显示按钮
					$widget.find(".questionaireOnline").show();	
				}		
		}
		
		//编辑页面禁止提交
		function noAlowSubmit(){
				var event = window.event || arguments.callee.caller.arguments[0];
				var prevObj = $(event.srcElement ? event.srcElement:event.target);
				layer.tips('编辑页面不允许提交', prevObj , {tips: [1,'#5AB4FF'], time: 1000,isGuide: true});
		}
		
		//获取投票详情
  		function getInvestigateDetial($widget){
  			
			var investigateId = $widget.closest("form").find("input[name='investigateId']").val();
  			var url =  ctx+"/base/vote/Investigate.do?method=getInvestigate&investigateId="+investigateId;
			window.voteColor = $widget.closest("form").find("input[name='investigateColor']").val();
  			$.ajax({
				url : url,
				type :"POST",
				success:function(data){
					var domstr=[];
					for(var i=0;i<data.length;i++){
					    domstr.push("<div class='questionaireOnline ba p10'>");
				        domstr.push("<div class='questionaireSubject'>",data[i].SUBJECT_TITLE,"</div>");
				        domstr.push(" <div class='questionaireItembox'>");
						if(data[i].SUBJECT_TYPE==2){//问答题
								domstr.push(" <div class='questionaireItembox'>");		
								domstr.push("<textarea name='",data[i].SUBJECT_ID,"' maxlength='256' style='width:50%;min-width:150px; max-width:960px; min-height:90px;'></textarea>");		
								domstr.push("</div>");		
						}else{
							domstr.push("<ul>");
				          
				            for(var j=0;j<data[i].optionList.length;j++){
				            	
				                	domstr.push(" <li class='questionaireItemPanel'>");
				                    domstr.push("<div  class='questionaireItemName'>");
				                   
								    if(data[i].SUBJECT_TYPE==0){ //单选
				                    	domstr.push(" <input name='",data[i].SUBJECT_ID,"' type='radio' value='",data[i].optionList[j].OPTION_ID,"' >");
				                    }else if(data[i].SUBJECT_TYPE==1){ //多选
				                    	domstr.push(" <input name='",data[i].SUBJECT_ID,"' type='checkbox' value='",data[i].optionList[j].OPTION_ID,"' >");
				                    }
				                        domstr.push(" <span class='questionaireItemSpan' >",data[i].optionList[j].OPTION_TITLE,"</span>");
				                     domstr.push(" </div>");
				                
				                domstr.push("</li>");
							
				            }
				            domstr.push("</ul>");
						}

				        domstr.push("</div>");
				        domstr.push("<input type='hidden' name='",data[i].SUBJECT_ID,"type' value='",data[i].SUBJECT_TYPE,"' />");
				    domstr.push("</div>");					
					}
					var str=domstr.join("");
					$widget.html(str);
					$widget.find("span").click(
									function(){
										$(this).prev().click();
									}
								);		
					
					},
				error:function(e){
					
				},
				dataType : "json"
  			});
			
  		}
		
		//用户提交调查问卷
  		function setInvestigateByUser(){
  			var event = window.event || arguments.callee.caller.arguments[0];
  			var datas = $(event.srcElement ? event.srcElement:event.target).closest('form').serialize();
  			var investigateId = $(event.srcElement ? event.srcElement:event.target).closest('form').find("input[name='investigateId']").val();
  			var url = ctx+"/base/vote/Investigate.do?method=setInvestigateByUser&investigateId="+investigateId;
  			$.ajax({
				url : url,
				data : datas,
				type :"POST",
				success:function(data){
					if(data.RESULT=="success"){
						layer.alert('投票成功！', {
					    icon: 1
					});
					}else if(data.RESULT=="nochose"){
						layer.alert('各组调查不能为空！');
					}
					
					
					},
				error:function(e){
					
				},
				dataType : "json"
  			});
  		}
})(jQuery)