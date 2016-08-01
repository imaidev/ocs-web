(function($){
	var g = {
	    config:function($el){
	        //return moduleTool.config($el, $.fn.leavemsg.defaults);
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
	
	 
	$.fn.leavemsg=function(oper,opts){
	    if(!oper) oper="init";

	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	    })
	    if (operr) return operr;

	    return this;
	};	
	
	
		var render=function($widget,dataval,isReset){
			
			
				if(isReset!="init"){
					$widget.find("div.m-pagination").children().remove();
					$widget.find("img[name='verifyImg']").click(changeVerify).click();
					ajaxPage($widget.find("div.m-pagination"));
					
					if(isReset=="run"){
						$widget.find("input[name='submitMsg']").click(sendLeaveMsg);
					}else{
						$widget.find("input[name='submitMsg']").click(noAlowSubmit);
					}
					
				
				}else if(isReset=="init"){
					$widget.find("div.m-pagination").children().remove();
					var domstr=[];
					domstr.push("<textarea maxlength='1000' name='REQ_CONTENT' style='width:87%;' cols='50' rows='3' id='reqContent' class='g_textarea'></textarea>");
					var $textarea = $widget.find("div[name='textarea']");
					$textarea.html(domstr);
					$widget.find("input[name='submitMsg']").click(noAlowSubmit);
					$widget.find("img[name='verifyImg']").click(changeVerify).click();
					
					ajaxPage($widget.find("div.m-pagination"));
					
				}

				
		}
		//编辑页面禁止提交
		function noAlowSubmit(){
			var event = window.event || arguments.callee.caller.arguments[0];
			var prevObj = $(event.srcElement ? event.srcElement:event.target);
			layer.tips('编辑页面不允许提交', prevObj , {tips: [1,'#5AB4FF'], time: 1000,isGuide: true});
	}
		
		//刷新验证码
		function changeVerify(){
			var verifyUrl = ctx+"/design/portal/leaveMsg/verify.htm";
			var date = new Date();
		    var url=verifyUrl;
		    var ttime = date.getTime();
		    $(this).attr("src",url + '&_='+ttime);
		}
		

	
		
		function sendLeaveMsg(){
			var event = window.event || arguments.callee.caller.arguments[0];
			window.$this = $(event.srcElement ? event.srcElement:event.target).closest('form');
			var form = $(event.srcElement ? event.srcElement:event.target).closest('form');
			var datas = $(form).serialize();
			var url = ctx+"/base/leaveMsg/LeaveMsg.do?method=sendMsg";
			$.ajax({
				url : url,
				data : datas,
				type :"POST",
				success :function (data){
					if(data=="success1"){ //"-1" 姓名未填 //"-2" 内容未填写//-3 验证码错误 
						
						layer.alert('发送成功,留言需管理员审核后才会在网页中显示!', {
						    icon: 1
						})
						location.reload(); 
					}else if(data=="success0"){
						layer.alert('发送成功!', {
						    icon: 1,
						    yes: function(index, layero){
						    	location.reload(); 
						        layer.close(index); //如果设定了yes回调，需进行手工关闭
						      }
						})
						
					}else if(data=="-1"){
						var prevObj = $($this).find("input[name='REQ_NAME']")
						layer.tips('用户名未填写！', prevObj , {tips: 1, time: 1000,isGuide: true});
						//$("input[name='REQ_NAME']").tipBox({tips:"用户名未填写！"});
					}else if(data=="-2"){
						var prevObj = $($this).find("textarea[name='REQ_CONTENT']");
						layer.tips('内容未填写！', prevObj , {tips: 1, time: 1000,isGuide: true});
						//$("textarea[name='REQ_CONTENT']").tipBox({tips:"内容未填写！"});
					}else if(data=="-3"){
						var prevObj =$($this).find("input[name='acthcode']");
						layer.tips('验证码不正确！', prevObj , {tips: 1, time: 1000,isGuide: true});
						//$("input[name='acthcode']").tipBox({tips:"验证码不正确！"});
						changeVerify
					}
				},
				error :function(e){
					
				}
			})
		}
		
		
		function ajaxPage($widget){
			//window.widget = $widget;
			//$widget.pagination('destroy');
			if($widget.pagination()!=false){
				$widget.pagination('destroy');
			}
			$widget.pagination({
			    pageSize: 3,
			    showInfo: false,
	            showJump: true,
	            showPageSizes: false,
	            showPageSizes: false,
	            //pageBtnCount : true,
	            prevBtnText :"上一页",
	            nextBtnText :"下一页",
	            firstBtnText :"|<",
	            lastBtnText : ">|",
	            jumpBtnText :"确定",
			    remote: {
			        url: ""+ctx+"/base/leaveMsg/LeaveMsg.do?method=ajaxPage",
			        success: function(json){
		            	if(json.list.length>0){
		            		var domstr=[];
		            		for(var i=json.list.length-1;i>=0;i--){
		            			domstr.push("<div class='message_item'>");
		            				domstr.push("<div class='item_title'>");
		            					domstr.push("<div class='item_name'>",json.list[i].REQ_NAME,"</div>");
		            					domstr.push("<div class='item_data'>",json.list[i].REQ_TIME_STR,"</div>");
		            				domstr.push(" </div>");
		            				domstr.push(" <div class='item_des'>",json.list[i].REQ_CONTENT,"</div>");
		            			if(json.list[i].hasOwnProperty("RESP_CONTENT")){
		            				domstr.push(" <div class='item_apply'>");
		                				domstr.push("<div class='item_Arrow'>◆</div>");
		                				domstr.push(" <div class='apply_content'>");
		                					domstr.push("<p><strong>管理员回复：(",json.list[i].RESP_TIME_STR,")</strong></p>");
		                					domstr.push("<p class='pl15'>",json.list[i].RESP_CONTENT,"</p>");
		                				domstr.push("</div>");
		                			domstr.push("</div>");
		                			
		            			}
		            				domstr.push("</div>");
		            		}
		            		var str=domstr.join("");
		            		$widget.parent().prev().html(str);
		            	}
					},
					
			        totalName:'total'
			    }
			});
		}

})(jQuery)
