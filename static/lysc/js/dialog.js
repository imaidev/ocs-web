(function($,window){
	var callback_opt = {};
	$.extend($.blockUI.defaults.overlayCSS, { 
        backgroundColor:'#aaa', 
        opacity:        '0.4' ,
		cursor:'default'
	});
	$.extend($.blockUI.defaults.themedCSS, { 
		width:	'300px',
		left:'40%'
	});
	$.blockUI.defaults.baseZ = 90000000;
	$.blockUI.defaults.centerX = false;
	$.blockUI.defaults.centerY = false;
	$.extend($.blockUI.defaults.css, { 
		minWidth:	'180px',
		minHeight:'60px',
		width:'auto',
		height:'auto',
		_height:'60px',
		left:'40%',
		border:		'3px solid #d3e8f5',
		textAlign:	'left',
		maxWidth:'230px'
	});
	window.dialog = {
		/**
		 * @private
		 */
		_show2 : function(title,msg,callback,scope,btn_str,tip){
			if(typeof title == "object"){
				msg = title.msg || title.message;
				callback = title.callback || title.cb;
				scope = title.scope;
				title = title.title;
			}
			title = $.trim(title) || tip;
			title = title+"<a href='javascript:dialog.unblockUI(false,false);' class='ui-dialog-titlebar-close dialog-close-icon'></a>";
			$.blockUI({ 
		        theme:     true, 
		        title:    title, 
		        message:  (msg || "")+btn_str
		    });
			callback_opt = {
					onUnblock : function(){
						if($.isFunction(callback)){
							callback.call(scope||window,callback_opt.ok);
						} else if(typeof callback == "string"){
							try{
								window[callback](callback_opt.ok);
							}catch(e){
								
							}
						}
						callback_opt = {};
					}	
			};
		},
		show : function(config){
			if(!config){
				return;
			}
			var _close = "<a href='javascript:dialog.unblockUI(false,false);' class='ui-dialog-titlebar-close dialog-close-icon'></a>";
			config.title = config.title ? config.title+_close : _close;
			var callback = config['callback'] || config['onUnblock']
			,scope = config['scope'];
			$.blockUI(config);
			callback_opt = {
					onUnblock : function(){
						if($.isFunction(callback)){
							callback.call(scope||window,callback_opt.ok);
						} else if(typeof callback == "string"){
							try{
								window[callback](callback_opt.ok);
							}catch(e){
								
							}
						}
						callback_opt = {};
					}	
			};
		
		},
		alert : function(title,msg,callback,scope){
			var btn_str = '<div class="ui-dialog-btn-bar">'
						  +'<a class="ui-dialog-btn btn_o" href="javascript:dialog.unblockUI();">确定</a>'
						  +'</div>';
			if(typeof msg !="string"){
				callback = msg;
				msg = title;
				title = "提示框";
			}
			dialog._show2(title,msg,callback,scope,btn_str,"提示框");
		},
		confirm : function(title,msg,callback,scope){
			var btn_str = '<div class="ui-dialog-btn-bar">'
						  +'<a class="ui-dialog-btn btn_o" href="javascript:dialog.unblockUI(true);">确定</a>'
						  +'<a class="ui-dialog-btn btn_w" href="javascript:dialog.unblockUI(false);">取消</a>'
						  +'</div>';
			if(typeof msg !="string"){
				callback = msg;
				msg = title;
				title = "确认对话框";
			}
			dialog._show2(title,msg,callback,scope,btn_str,"确认对话框");
		},
		success : function(msg,callback,scope,sc){
			if(typeof msg == "object"){
				callback = msg.callback || msg.cb;
				scope = msg.scope;
				msg = msg.msg || msg.message;
			}
			sc = sc || "dialog-success";
			$.blockUI({ 
				message: '<div class="'+sc+'"></div><p class="dialog-tip">'+msg+'</p>',
	            fadeOut: 700,
				timeout: 2000,
				onUnblock: function(){
					if($.isFunction(callback)){
						callback.call(scope||window);
					} else if(typeof callback == "string"){
						try{
							window[callback]();
						}catch(e){
							
						}
					}
				} 
			});
		},
		error : function(msg,callback,scope){
			dialog.success(msg,callback,scope,"dialog-error");
		},
		unblockUI : function(ok,docb){
			if(docb===false){
				callback_opt = {};
			} else {
				callback_opt.ok = ok;
			}
			$.unblockUI(callback_opt);
		}
	}
	
})(jQuery,window);