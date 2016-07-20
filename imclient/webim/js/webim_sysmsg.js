var WebIMSystemMessage = function() {
	
};

(function( $ ) {
	/**
	 * 聊天窗口界面操作
	 */
	WebIMSystemMessage.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		isShow: false,
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			var $this = this;
			this.webim = webim;
			this.ptag = this.webim.tag;
			this.tag = this.ptag.node("wbim_sys_msg");
			
			this.listenerTagEvent();
			this.listener();
		},
		/**
		 * 监听内部处理事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			
			$this.tag.node("wbim_icon_sys_close").click(function(e) {
				$this.hideSystemMessage();
			});
		},
		addSystemMessage: function(data) {
			//系统提示框
			var sysList = this.tag.node("wbim_sys_con");
			var sysDl = this.tag.node("wbim_sys_dl");
			var msg = '<dd class="wbim_sysmsgl">'
			+ '<div class="msg_box"><p class="txt">' + data.msg + '</p></div>'
			+ '</dd>';
			sysDl.append(msg);
			sysList.scrollTop(9999999);
			
			//闪动的喇叭
			if(!this.isShow) {
				this.trigger(E.SHOW_SYSTEM_TIP);
			}
		},
		
		showSystemMessage: function() {
			this.tag.css("display", "block");
			this.isShow = true;
			var sysList = this.tag.node("wbim_sys_con");
			sysList.scrollTop(9999999);
			
			this.trigger(E.CANCEL_SYSTEM_TIP);
		},
		hideSystemMessage: function() {
			this.tag.css("display", "none");
			this.isShow = false;
		},
		
		listener : function() {
			var $this = this;
			$this.ptag.on(E.OPEN_SYSTEM_MESSAGE, function(e, data) {
				$this.showSystemMessage();
			}).on(E.CLOSE_SYSTEM_MESSAGE, function(e, data) {
				$this.hideSystemMessage();
			}).on(E.CHANGE_SYSTEM_MESSAGE, function(e) {
				if($this.isShow) {
					$this.hideSystemMessage();
				} else {
					$this.showSystemMessage();
				}
			});
		},
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		}
	};
})(jQuery);