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
    
	$.fn.portalonlineservice=function(oper,opts){
	    if(!oper) oper="init";
	    var operr;
	    this.each(function(){
	        operr = g[oper]($(this), opts);
	        
	    })
	    if (operr) return operr;

	    return this;
	};

	var render=function($widget,dataval,type){
		var opts = $.extend({}, $.fn.portalonlineservice.defaults, dataval);
		//获取当前时间
		var myDate = new Date();
		var day = myDate.getDay(); 
		var hour = myDate.getHours();
		if(hour<10){
			hour = "0"+hour;
		}
		var minis = myDate.getMinutes();
		if(minis<10){
			minis = "0"+minis;
		}
		var time = hour+":"+minis;
		var week = ["周日","周一","周二","周三","周四","周五","周六"];
		if(opts){
			$widget.find("#onlineDiv").empty();
			var isOnline="0";
			for(var j=0;j<opts.timeList.length;j++){
				var setDayFrom = opts.timeList[j].fromDate;
				var setDayTo = opts.timeList[j].toDate;
				if(setDayFrom=="0"){
					if(day==setDayFrom || setDayTo>=day){
						var fromTime = opts.timeList[j].fromTime;
						var toTime = opts.timeList[j].toTime;
						if(time>=fromTime && time<=toTime){
							isOnline="1";
							break;
						}
					}
				}
				if(setDayFrom<=setDayTo){
					if(day>=setDayFrom && setDayTo>=day){
						var fromTime = opts.timeList[j].fromTime;
						var toTime = opts.timeList[j].toTime;
						if(time>=fromTime && time<=toTime){
							isOnline="1";
							break;
						}
					}
				}else{
					if(day>=setDayFrom || day<=setDayTo){
						var fromTime = opts.timeList[j].fromTime;
						var toTime = opts.timeList[j].toTime;
						if(time>=fromTime && time<=toTime){
							isOnline="1";
							break;
						}
					}
				}
			}
			var str='<div class="Servs-bdpor"><div class="servItempor"><p class="serv-titpor">在线咨询</p>';
			if(opts.showType=="1"){
				str=str+'<ul class="serv-valuepor tool-servspor serv-lists-verpor">';
			}else{
				str=str+'<ul class="serv-valuepor tool-servspor serv-lists-horpor">';
			}
			for(var i=0;i<opts.onlineList.length;i++){
				//qq的情况
				if(opts.onlineList[i].customerType=="1"){
					str = str+'<li><p><a href="http://wpa.qq.com/msgrd?v=3&uin='+opts.onlineList[i].customerId+'"&site=qq&menu=yes" title="'+opts.onlineList[i].customerName+'">';
				}else{//平台客服的情况
					str = str+'<li><p><a target="_blank" href="/im/index.jsp?userId='+opts.onlineList[i].customerId+'" title="'+opts.onlineList[i].customerName+'">';
				}
				//在线客服的情况
				if(opts.onlineList[i].customerType=="2"){
					//一直在线的情况
					if(opts.onlineList[i].customerStatus=="1"){
						str=str+'<i class="icon-serv serv-on"></i>';
					}else{//工作时间在线的情况
						//在工作时间内
						if(isOnline=="1"){
							str=str+'<i class="icon-serv serv-on"></i>';
						}else{//非工作时间
							str=str+'<i class="icon-serv serv-off"></i>';
						}
					}
				}else{//qq客服的情况
					var qq = opts.qqShowStyle;
					var num = parseInt(qq)+1;
					//一直在线的情况
					if(opts.onlineList[i].customerStatus=="1"){
						str=str+'<i class="icon-qqserv qqserv'+num+'-on"></i>';
					}else{//工作时间在线的情况
						//在工作时间内
						if(isOnline=="1"){
							str=str+'<i class="icon-qqserv qqserv'+num+'-on"></i>';
						}else{//非工作时间
							str=str+'<i class="icon-qqserv qqserv'+num+'-off"></i>';
						}
					}
					
				}
				str = str + '<span class="serv-name">'+opts.onlineList[i].customerName+'</span></a></p></li>';
			}
			str = str + '</ul></div>'
			if(opts.timeFlag=="1"){
				str = str + '<div class="servItempor"><p class="serv-titpor">工作时间</p>';	
				if(opts.showType=="1"){
					str=str+'<ul class="serv-valuepor tool-servspor serv-lists-verpor">';
				}else{
					str=str+'<ul class="serv-valuepor tool-servspor serv-lists-horpor">';
				}
				for(var j=0;j<opts.timeList.length;j++){
					str=str+'<li class="item">'+week[opts.timeList[j].fromDate]+'至'+week[opts.timeList[j].toDate]+'：'
					+opts.timeList[j].fromTime+'-'+opts.timeList[j].toTime+'</li>';
				}
				str=str+'</ul></div>';
			}
			if(opts.contactFlag=="1"){
				str=str+'<div class="servItempor"><p class="serv-titpor">联系电话</p>';
				if(opts.showType=="1"){
					str=str+'<ul class="serv-valuepor tool-servspor serv-lists-verpor">';
				}else{
					str=str+'<ul class="serv-valuepor tool-servspor serv-lists-horpor">';
				}
				for(var k=0;k<opts.contactList.length;k++){
					str=str+'<li class="item">'+opts.contactList[k].contactName+'：'+opts.contactList[k].contactMobile+'</li>';
				}
				str = str+'</ul>';
				str = str+'</div>';
			}
			str = str+'</div>';
			$widget.find("#onlineDiv").append(str);
			//设置标题
			$widget.find("span")[0].innerHtml=opts.title;
			$widget.find("span")[0].innerText=opts.title;
		}
	}
	
	
	$.fn.portalonlineservice.defaults = {
			title:"客服中心",
			qqShowStyle:"0",
			showType:"1",
			contactFlag:"1",
			timeFlag:"1",
			onlineList:[{customerType:"1",customerId:"12345",customerName:"客服名称",customerStatus:"1"},
			            {customerType:"1",customerId:"12345",customerName:"客服名称",customerStatus:"1"}],
			timeList:[{fromDate:"1",toDate:"5",fromTime:"08:30",toTime:"17:30"},
			          {fromDate:"6",toDate:"0",fromTime:"09:00",toTime:"17:00"}],
			contactList:[{contactName:"陈经理",contactMobile:"18000000000"},
			             {contactName:"邮箱",contactMobile:"abc@163.com"}]
	}
})(jQuery)