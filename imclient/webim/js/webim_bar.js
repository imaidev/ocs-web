var WebIMBar = function() {
	
};

(function( $ ) {
	/**
	 * 最小化的聊天状态栏
	 */
	WebIMBar.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		isOpen: false,
		settimeout: 0,
		systimeout: 0,
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			var $this = this;
			this.webim = webim;
			this.ptag = this.webim.tag;
			this.tag = this.ptag.node("wbim_min_box_col");
			
			this.listenerTagEvent();
			this.listener();
		},
		/**
		 * 监听内部事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			// 监听打开聊天窗口事件
			this.tag.node("wbim_min_chat").click(function(e) {
				$this.trigger(E.OPEN_CHATBOX);
			});
			// 监听好友列表窗口事件
			this.tag.node("wbim_min_friend").click(function(e){
				$this.trigger(E.OPEN_LIST);
			});
			
			this.tag.node("wbim_sys_btn").click(function(e) {
				$this.trigger(E.CHANGE_SYSTEM_MESSAGE);
				return false;
			});
			this.tag.node("wbim_sys_btncon").click(function(e) {
				return false;
			});
		},
		/**
		 * 获取当前界面的显示状态
		 * @returns {___data0}
		 */
		getViewStatus: function() {
			var data = new Object();
			data.isOpen = this.isOpen;
			return data;
		},
		/**
		 * 设置当前界面的显示状态
		 * @param data
		 */
		setViewStatus: function(data) {
			if(!data.isOpen) {
				this.tag.removeClass("wbim_min_box_col3");
				this.tag.addClass("wbim_min_box_col2");
			} else {
				this.tag.removeClass("wbim_min_box_col2");
				this.tag.addClass("wbim_min_box_col3");
			}
		},
		showMinBox: function(b) {
			this.tag.removeClass("wbim_min_box_col2");
			this.tag.addClass("wbim_min_box_col3");
			this.isOpen = true;
			if(b) {
				this.unactiveMinBox();
			}
		},
		hideMinBox: function() {
			this.tag.removeClass("wbim_min_box_col3");
			this.tag.addClass("wbim_min_box_col2");
			this.isOpen = false;
		},
		activeMinBox: function() {
			var $this = this;
			
			if($this.webim && $this.webim.imChatbox && $this.webim.imChatbox.isOpen){
				return;
			}
			
			$this.tag.node("wbim_min_tipbar").html(L.hasMessageLabel);
			var minchat = $this.tag.node("wbim_min_chat");
			
			var i = 0;
			var timeout = function() {
				$this.settimeout = setTimeout(function() {
					if(i%2 == 0) {
						minchat.addClass("wbim_min_chat_msg");
					} else {
						minchat.removeClass("wbim_min_chat_msg");
					}
					i++;
					if(i < 7) {
						timeout();
					}
				}, 500);
			};
			timeout();
			
			this.tag.node("wbim_min_tipbar").css("display", "inline");
			this.tag.node("wbim_min_chatuserbar").css("display", "none");
		},
		unactiveMinBox: function() {
			var minchat = this.tag.node("wbim_min_chat");
			minchat.removeClass("wbim_min_chat_msg");
			clearTimeout(this.settimeout);
			
			this.tag.node("wbim_min_tipbar").css("display", "none");
			this.tag.node("wbim_min_chatuserbar").css("display", "inline");
		},
		activeSysIcon: function() {
			var $this = this;
			if(this.systimeout != 0) return;
			var sysbtn = this.tag.node("wbim_btn_sysmsg");
			var i = 0;
			var timeout = function() {
				$this.systimeout = setTimeout(function() {
					if(i%2 == 0) {
						sysbtn.css("visibility", "visible");
					} else {
						sysbtn.css("visibility", "hidden");
					}
					
					timeout();
				}, 500);
				i++;
			};
			timeout();
		},
		unactiveSysIcon: function() {
			var sysbtn = this.tag.node("wbim_btn_sysmsg");
			sysbtn.css("visibility", "visible");
			clearTimeout(this.systimeout);
			this.systimeout = 0;
		},
		/**
		 * 监听外部事件
		 */
		listener: function() {
			var $this = this;
			this.ptag.on(E.OPEN_CHATBOX, function(e, data) {
				if(data && $this.webim.isRobot(data.skill))return;
				$this.showMinBox(true);
			}).on(E.HIDE_CHATBOX, function(e, data) {
				if(!$this.webim.imChatbox.getHasMessage()) {
					$this.unactiveMinBox();
				}
			}).on(E.CLOSE_CHATBOX, function(e, data) {
				$this.hideMinBox();
			}).on(E.CURRENT_USER, function(e, data) {
				if(data) {
					$this.tag.node("wbim_min_nick").text(data.uname);
				}
			}).on(E.SELF_STATUS_CHANGE, function(e, data) {
				var box = $this.tag.node("wbim_statusbox");
				box.empty();
				box.append('<span class="' + data.cla + '" style="float:left;"></span>');
			}).on(E.ONLINES, function(e, data) {
				var n = $this.tag.node("wbim_online_count");
				n.text(data.on + "/" + data.all);
			}).on(E.HAS_MESSAGE, function(e, data) {
				$this.showMinBox();
				$this.activeMinBox();
			}).on(E.SHOW_SYSTEM_TIP, function(e) {
				$this.activeSysIcon();
			}).on(E.CANCEL_SYSTEM_TIP, function(e) {
				$this.unactiveSysIcon();
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