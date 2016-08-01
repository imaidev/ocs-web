var WebIMChatbox = function() {
	
};

(function( $ ) {
	/**
	 * 聊天窗口界面操作
	 */
	WebIMChatbox.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		users: null,			// 当前聊天的所有用户
		currentUser: null,		// 正在聊天的用户（打开的聊天窗口正与该用户聊天）
		sendKey: "entry",		// 发送按钮快捷键
		isOpen: false,
		historySize: 40,
		historyIsShow: false,
		upImgSwf:null,//文件上传swf
		voiceEnabled:true,//默认开启声音提示
		
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			var $this = this;
			this.webim = webim;
			this.ptag = this.webim.tag;
			this.tag = this.ptag.node("wbim_chat_box");
			
			this.users = new Array();
			//监听内部事件
			this.listenerTagEvent();
			//监听外部事件
			this.listener();
			//加载图片上传swf
			this.createFileUpLoad();
			//显示“测试版”
			this.createTextVersionTitle();
			
			//默认最大化
			this.trigger(E.OPEN_LIST);
			
			//增加刷新按钮
			//this.createRefreshBtn();
		},
		/**
		 * 监听内部处理事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			
			//监听拖拽事件
            dragHandler("wbim_chat_box_head","wbim_chat_box");
			
			// 监听最小化按钮点击
			var iconMini = this.tag.node("wbim_icon_mini");
			iconMini.click(function(e) {
				$this.hideIMChatBox();
			});
			// 监听聊天窗口顶部点击
			var titin = this.tag.node("wbim_titin");
			titin.click(function(e) {
				if(e.target == e.currentTarget) {
					$this.hideIMChatBox();
				}
			});
			var btmin = this.tag.node("wbim_chat_btmin");
			btmin.click(function(e) {
				if(e.target == e.currentTarget) {
					$this.hideIMChatBox();
				}
			});
			// 监听关闭按钮点击
			var iconClose = this.tag.node("wbim_icon_close");
			iconClose.click(function(e) {
				$this.trigger(E.CLOSE_CHATBOX);
			});
			// 监听结束会话按钮
			var btnClose = this.tag.node("wbim_btn_close");
			btnClose.click(function(e) {
				if($this.currentUser) {
					if($this.webim.isService($this.currentUser.skill)) {
						$this.showPingView($this.currentUser.uid);
					}else {
						$this.removeUser($this.currentUser.uid, true);
					}
				}
			});
			// 监听结束会话按钮
			var btnConfirm = this.tag.node("wbim_btn_confirm");
			btnConfirm.click(function(e) {
				
				var pingView = $this.tag.node("wbim_ping_box");
				var uid = pingView.attr("uid");
				var score = pingView.find(":radio:checked").val();
				
				pingView.find(":radio:checked").val(2);
				$this.hidePingView(E.DO_NOT_CONTROL);
				
				$this.webim.sendCloseService(uid, score);
				
				$this.removeUser(uid, true);
			});
			
			var singleUser = this.tag.node("wbim_single_user");
			var singleUserName = singleUser.node("wbim_tit_lf_user_name");
			
			var group = this.tag.node("wbim_group");
			
			var chatList = this.tag.node("wbim_chat_list");
			var friendList = this.tag.node("wbim_chat_friend_list");
			var friendsList = this.tag.node("wbim_list_friendlist");
			
			// 发送按钮
			var sendBtn = this.tag.node("wbim_btn_publish");
			var sendMsg = this.tag.node("wbim_chat_input_ta");
			var sendLength = this.tag.node("wbim_tips_char");
			
			// 聊天窗口左侧列表
			var chatLf = this.tag.node("wbim_chat_lf");
			
			// 聊天窗口顶部提示
			var chatTips = this.tag.node("wbim_chat_tips");
			
			// 聊天表情
			var faceView = this.tag.node("wbim_face_box");
			var faceATag = faceView.node("wbim_face_list").find("a");
			
			//声音提示
			var voiceTag = this.tag.node("wbim_icon_voice");
			var voiceITag = voiceTag.find("i");
			
			// 打分邀请按钮
			var pingBtn = this.tag.node("wbim_icon_ping");
			// 常用语（快捷回复）
			var quickBtn = this.tag.node("wbim_icon_quick");
			var quickView = this.tag.node("wbim_quick_box");
			// 订单查询
			//var quickSearch = this.tag.node("wbim_icon_chaxun");
			
			// 聊天记录按钮
			var historyBtn = this.tag.node("wbim_history");
			// 聊天记录界面
			var historyView = this.tag.node("wbim_history_box");
			var historyList = this.tag.node("wbim_history_con");
			
			var historyNext = historyView.node("wbim_history_next");
			var historyPrev = historyView.node("wbim_history_prev");
			var historyRefresh = historyView.node("wbim_history_refresh");
			var historyMax = historyView.node("wbim_history_max");
			var historyII = historyView.find("#wbim_history_ii");
			var historyIIBtn = historyView.node("wbim_history_query_btn");
			
			//声音提示与禁止
			voiceTag.click(function(e){
				if($this.voiceEnabled){
					voiceITag.removeClass("wbim_icon_voice");
					voiceITag.addClass("wbim_icon_voice_dis");
					$this.voiceEnabled = false;
				}else{
					voiceITag.removeClass("wbim_icon_voice_dis");
					voiceITag.addClass("wbim_icon_voice");
					$this.voiceEnabled = true;
				}
			});
			
			/**
			 * 清除消息内容
			 */
			var clearMessage = function() {
				sendMsg.val("");//清空发送框
				sendLength.text("200");//字符限制
				setFileUpTool("none");//文件传送栏
			};
			
			/**
			 * 发送消息
			 * @param e：事件
			 * @param msg:消息内容
			 */
			var onSendMessage = function(e, msg) {
				//消息内容判断
				msg = checkSendMsgLength(msg);
				if(!msg){
				    return;
				}
				
				//组装消息内容
				var date = new Date();
				var data = {
					isSelf:true,//默认是自己发的消息
					way: $this.currentUser.way,//发送方式(group代表群聊，默认私聊)
					uid: $this.currentUser.uid,//消息接收者id。聊天框是以对方id为标记的，便于查找对方的聊天框界面
					uname: $this.currentUser.uname,//消息接收者昵称
					date: $.dateFormat(date, "yyyy-MM-dd"),//日期
					time: $.dateFormat(date, "hh:mm:ss"),//时间
					content: msg//内容
				};
				
				//显示在消息接收框
				$this.innerTrigger("addMessage", data);
				
				//发送给聊天服务器
				if($this.webim.isConnected) {    
					//当前对话人信息
					sendChatMsg({
						"to": $this.currentUser.uid,
						"to_name": $this.currentUser.uname,
						"msg": msg,
						"vendId": WEB_IM_CONFIG.vendId,
						"itemId": WEB_IM_CONFIG.itemId
					});
					clearMessage();
					
					$this.trigger(E.ON_SEND_MESSAGE, {user: $this.currentUser, content: msg});
				} else {
					$this.innerTrigger("showBoxTips", {content:L.failedLabel});
				}
			};
			
			/**
			 * 消息内容是否超出限制
			 */
			var sendMsgBgTimeId = "";
			var checkSendMsgLength = function(msg){
				//默认获取发送框里的文字，快捷回复是可以传过来msg的
				if(!msg || (msg.length == 0)){
				    msg = sendMsg.val();
				}
				
				//大于200字进行提示
				if(msg && (msg.length > 200)){
					if(sendMsgBgTimeId == ""){
                    	sendMsgBgTimeId = setInterval(function(){setSendMsgBgHander();},200);
					}
                    return false;
				}
				
				//上传的附件
                var fileMsg = $("#fileUpTextId").val();//上传的文件
                if(fileMsg && (fileMsg.length>0)){
                    msg = $.trim(msg + fileMsg);
                }
                
                //判断
                if(!msg && (msg.length <= 0)){
                    if(sendMsgBgTimeId == ""){
                    	sendMsgBgTimeId = setInterval(function(){setSendMsgBgHander();},200);
					}
                    return false;
                }
                
                return msg;
                
			};
			/**
			 * 输入框闪动警告
			 */
			var setSendMsgIndex = 0;
			var setSendMsgBgHander = function(){
			     if(setSendMsgIndex % 2 == 0){
                  sendMsg.css("background-color","#FFFFFF");
                }else{
                  sendMsg.css("background-color","#FA8072");
                }
                setSendMsgIndex ++;
                
                if(setSendMsgIndex >= 5){
                	setSendMsgIndex = 0;
                    clearInterval(sendMsgBgTimeId);
                    sendMsgBgTimeId = "";
                }
			};
			
			
			var current = $.dateFormat(new Date(), "yyyy-MM-dd");
			var getTimeFormat = function(m) {
				var str = "";
				if(m.date != current) {
					str += m.date + " ";
				}
				str += m.time;
				return str;
			};
			
			/**
			 * 打开与客服聊天框后的友好提示语
			 */
			var showWelcome = function(uid){
				var dl = chatList.find("dl[uid=" + uid + "]");
				var newContent = properties.welcome.replace(/%s/, $this.currentUser.uname);
					
				if ($this.webim.isService($this.currentUser.skill) || $this.webim.isRobot($this.currentUser.skill)) {
					var data = {
						type : "3600",
						user_id: $this.currentUser.uid
					};
					var date = new Date();
					var welcom_data = {
							dd_id : "welcome_id",
							isSelf : false,//客服消息
							uname : $this.currentUser.uname,//消息接收者昵称
							uid : $this.currentUser.uid,
							date : $.dateFormat(date, "yyyy-MM-dd"),//日期
							time : $.dateFormat(date, "hh:mm:ss"),//时间
							content : newContent//内容
						};
					$.ajax({
						url : WEB_IM_CONFIG.imUrL + "sendOperate",
						data : {
							data : JSON.stringify(data)
						},
						dataType : WEB_IM_CONFIG.ajaxDataType,
						jsonp : WEB_IM_CONFIG.ajaxJsonp,
						type : "post",
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							$("#welcome_id").remove();
							dl.append(getChatContent(welcom_data));
							chatList.scrollTop(9999999);
						},
						success : function(data) {
							if (!data) {
								return;
							}
							if (typeof (data) === "string") {
								data = JSON.parse(data);
							}
							if (data.welcomeInfo) {
								newContent = data.welcomeInfo;
							}
							welcom_data.content = newContent;
							$("#welcome_id").remove();
							dl.append(getChatContent(welcom_data));
							chatList.scrollTop(9999999);
						}
					});
				}
				
			};

			/**
			 * 增加与某个用户的聊天
			 */
			this.tag.on("addUser", function(e, data) {
				//显示聊天内容
				var dl = '<dl uid="' + data.uid + '" style="display:none;" data-hasmsg="false"></dl>';
				chatList.append(dl);
				
				//多个用户时
				if(!data.icon || (data.icon == "undefined")){
					data.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
				}
				var li = '<li node-type="wbim_list_user" uid="' + data.uid + '" title="' + data.uname + '" skill="'+ data.skill +'" class="wbim_offline">'
					 + '<div class="wbim_userhead"><img node-type="wbim_userhead" src="'+ (data.icon ? data.icon:"") + '"><span node-type="wbim_status" class="' + $this.webim.getUserStatusStyle(data) + '"></span></div>'
					 + '<div node-type="wbim_username" class="wbim_username">' + data.uname + '</div>'
					 + '<a node-type="wbim_icon_close_s" class="wbim_icon_close_s" />' 
					 + '</li>';
				friendList.append(li);
				
				if(data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			})
			.on("removeUser", function(e, data) {			// 移除与某个用户的聊天
				chatList.find("dl[uid=" + data.uid + "]").remove();
				var li = friendList.find("li[uid=" + data.uid + "]").remove();
				var h = friendList.height();
				var top = friendList.position().top;
				if(top < 0) {
					friendList.css("top", top + 32);
					friendList.css("height",h - 32);
				}
				if(data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
				
				//移除侧边栏信息
				$("#baseInfo_" + data.uid).remove();
				$("#orderInfo_" + data.uid).remove();
			})
			

			/**
			 * 设置新的聊天用户
			 */
			.on("setCurrentUser", function(e, data) {		// 当前聊天用户改变
				
				chatList.find("dl").css("display", "none");
				friendList.find("li").removeClass("wbim_active");
				
				if(data) {
					
					var uname = data.uname;
					
					//顶部对话人的昵称
					
					//客服的昵称显示为：与XXX咨询中...
					if($this.webim.isService(data.skill) || $this.webim.isRobot(data.skill)) {
						uname = L.serviceLabel.replace(/%s/, uname);
						singleUserName = singleUser.node("wbim_tit_lf_service_name");
						$("#wbim_tit_lf_user_name_id").css("display","none");
						$("#wbim_tit_lf_service_name_id").css("display","block");
					}else{//普通用户直接显示昵称
						singleUserName = singleUser.node("wbim_tit_lf_user_name");
						$("#wbim_tit_lf_service_name_id").css("display","none");
						$("#wbim_tit_lf_user_name_id").css("display","block");
					}
					
					//第二套皮肤打开的聊天对话框左上角显示人物头像
					if(WEB_IM_CONFIG.skin == "3"){
					   var headIcon = '<div class="wbim_userhead" style="margin-right:6px;"><img node-type="wbim_userhead" src="' 
                        + (data.icon ? data.icon:"") + '"><span node-type="wbim_status" class="' 
                        + $this.webim.getUserStatusStyle(data) + '"></span></div>';
                        singleUser.find(".txt .wbim_userhead").remove();
                        singleUser.find(".txt").prepend(headIcon);
					}
					
					uname = uname + (WEB_IM_CONFIG.appendUId?"("+data.uid+")":"");
					singleUserName.attr("title", uname).html(uname);
					
					//设置在线状态
					var u = friendList.find("li[uid=" + data.uid + "]");
					var s = u.node("wbim_status");
					var c = s.attr("class");
					$this.webim.setUserStatusStyle(singleUser, c);
					
					//显示聊天记录
					var chat = chatList.find("dl[uid=" + data.uid + "]");
					var h = chat.css("display", "block").height();
					friendList.find("li[uid=" + data.uid + "]").addClass("wbim_active");
					chatList.scrollTop(9999999);
					
					if(c == "wbim_status_offline" || c == "wbim_status_busy") {
						$this.innerTrigger("showBoxTips", {content: L.userOfflineBusy});
					} else {
						$this.innerTrigger("hideBoxTips");
					}
					$this.innerTrigger("unactiveChatbox", data);
					
					if(chat.attr("data-hasmsg") == "false") {
						$this.trigger(E.GET_CHAT_INFO, data);
						chat.attr("data-hasmsg", "true");
					}
					
					showWelcome(data.uid);
					
					if(WEB_IM_CONFIG.showSideBar == 1){ //设置默认侧边栏
						$this.webim.changeSideBar(data.uid);
					} else if(WEB_IM_CONFIG.showSideBar == 2){ //自定义侧边栏
						$this.webim.setSideBarNew(data.uid);
					}
				}
				
				//清空发送框
				clearMessage();
				
				if(data && data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			})
			.on("showUserList", function(e) {		// 显示左侧的用户列表
				//$this.tag.addClass("wbim_chat_box_s");
				//控制侧边栏能正常显示的宽度
				if(chatLf.css("display") == "none"){
					$(".wbim_chat_box_s").width($(".wbim_chat_box_s").width() + 120);
				}
				chatLf.css("display", "block");
			})
			.on("hideUserList", function(e) {		// 隐藏左侧的用户列表
				//$this.tag.removeClass("wbim_chat_box_s");
				if(chatLf.css("display") == "block"){
					$(".wbim_chat_box_s").width($(".wbim_chat_box_s").width() - 120);
				}
				chatLf.css("display", "none");
			})
			.on("addMessage", function(e, data) {	// 显示用户发的消息
				var dl = chatList.find("dl[uid=" + data.uid + "]");
				if(dl[0]) {
//					var msg = '<dd class="' + (data.isSelf ? 'wbim_msgr' : 'wbim_msgl') + '">'
//							+ '<div class="wbim_msgpos"><div class="msg_time">' + data.time + '</div>'
//							+ '<div class="msg_box"><p class="txt">' + replaceFace(data.content) + '</p></div>'
//							+ '<div class="msg_arr"></div></div></dd>';
					
					if(data.isSelf){
						data.uname = $this.webim.userInfo.uname;
						data.uid = $this.webim.userInfo.uid;
					}
					dl.append(getChatContent(data));
					
					chatList.scrollTop(9999999);
				}
			})
			//显示多条消息
			.on("addMulMessage", function(e, data) {
				var dl = chatList.find("dl[uid=" + data.uid + "]");
				
				if(dl[0]) {
					var msg = "";
					for(var i=0; i < data.messages.length; i++) {
						var m = data.messages[i];
//						msg = '<dd class="' + (m.isSelf ? 'wbim_msgr' : 'wbim_msgl') + '">'
//						+ '<div class="wbim_msgpos"><div class="msg_time">' + getTimeFormat(m) + '</div>'
//						+ '<div class="msg_box"><p class="txt">' + replaceFace(m.content) + '</p></div>'
//						+ '<div class="msg_arr"></div></div></dd>' + msg;
						
						msg = getChatContent(m) + msg;
					}
					
					dl.append(msg);
					
					showWelcome(data.uid);
				}
			})
			.on("boxSetUserStatus", function(e, data){	// 用户在线状态改变
				var type = $this.webim.getUserStatusStyle(data);
				var user = friendList.find("li[uid=" + data.uid + "]");
				// 设置左侧列表的用户状态
				$this.webim.setUserStatusStyle(user, type);
				
				if($this.currentUser && $this.currentUser.uid == data.uid) {
					// 设置当前正在聊天的用户状态
					$this.webim.setUserStatusStyle(singleUser, type);
					// 显示当前聊天用户是否在线的提示
					
					if(type == "wbim_status_offline" || type == "wbim_status_busy") {
						$this.innerTrigger("showBoxTips", {content: L.userOfflineBusy});
					} else {
						$this.innerTrigger("hideBoxTips");
					}
				}
			})
			.on("showBoxTips", function(e, data) {
				chatTips.css("display", "block");
				chatTips.node("wbim_chat_tips_content").text(data.content);
			})
			.on("hideBoxTips", function(e){
				chatTips.css("display", "none");
				chatTips.node("wbim_chat_tips_content").empty();
			})
			.on("activeChatbox", function(e, data) {
				if($this.currentUser && $this.currentUser.uid == data.uid) return;
				
				var uli = friendList.find("li[uid=" + data.uid + "]");
				
				var i = 0;
				var timeout = function() {
					var t = setTimeout(function() {
						if(i%2 == 0) {
							uli.addClass("wbim_highlight");
						} else {
							uli.removeClass("wbim_highlight");
						}
						i++;
						if(i < 7) {
							timeout();
						}
					}, 500);
					uli.attr("data-timeout", t);
				};
				timeout();
			})
			.on("unactiveChatbox", function(e, data) {
				var uli = friendList.find("li[uid=" + data.uid + "]");
				uli.removeClass("wbim_highlight");
				
				var timeout = uli.attr("data-timeout");
				if(timeout) {
					clearTimeout(timeout);
				}
			})
			.on("showChatHistoryView", function(e, data) {
				var user = $this.getUser(data.uid);
				if(user) {
					historyView.node("wbim_history_tit_lf").text(L.historyLabel.replace(/%s/, user.uname));
					historyView.attr("data-current", user.uid);
					historyView.css("display", "block");
					$this.historyIsShow = true;
					
					var chatlist = historyList.find("div[uid="+user.uid+"]");
					if(!chatlist[0]) {
						var dl = '<div uid="' + user.uid + '" isload="false" class="wbim_chat_history_list wbim_chat_list"></div>';
						historyList.append(dl);
						chatlist = historyList.find("div[uid="+user.uid+"]");
					}
					
					historyList.find(".wbim_chat_history_list").css("display", "none");
					chatlist.css("display", "block");
					
//					if(chatlist.attr("isload") == "false") {
//						$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: user.uid, start: 0, size: $this.historySize});
//					} else {
//						refreshBtns();
//					}
					
					$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: user.uid, start: 0, size: $this.historySize});
					/*
					if(!data || data.s != E.DO_NOT_CONTROL) {
						$this.trigger(E.ON_SEND_CONTROL);
					}*/
				}
			})
			.on("hideChatHistoryView", function(e, data) {
				historyView.css("display", "none");
				if(!data || data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
				$this.historyIsShow = false;
			})
			.on("addChatHistoryMessage", function(e, data) {
				var uid = data.uid;
				var index = (data.start / data.size) + 1;
				var msgs = data.messages;
				
				if(!msgs || msgs.length<= 0) {
					showWelcome(uid);
					return;
				}
				
				var chatlist = historyList.find("div[uid="+uid+"]");
				var currentPage = chatlist.find("dl[data-index="+index+"]");
				
				var oldindex = parseInt(chatlist.attr("data-index"));
				
				chatlist.attr("data-index", index);
				chatlist.attr("data-count", data.count);
				chatlist.attr("data-max", data.max);
				
				var dl = '<dl data-index="' + index + '">';
				var msg = "";
				for(var i=0; i < msgs.length; i++) {
					var m = msgs[i];
//					msg = '<dd class="' + (m.isSelf ? 'wbim_msgr' : 'wbim_msgl') + '">'
//					+ '<div class="wbim_msgpos"><div class="msg_time">' + getTimeFormat(m) + '</div>'
//					+ '<div class="msg_box"><p class="txt">' + replaceFace(m.content) + '</p></div>'
//					+ '<div class="msg_arr"></div></div></dd>' + msg;
					
					msg = getChatContent(m) + msg;
				}
				dl += msg;
				dl += "</dl>";
				
				if(currentPage[0]) {
					currentPage.replaceWith(dl);
				} else {
					chatlist.append(dl);
					currentPage = chatlist.find("dl[data-index="+index+"]");
				}
				
				chatlist.attr("isload", "true");
		//		chatlist.find("dl").css("display", "none");
				currentPage.css("display", "block");
				
				refreshBtns();
				
				if(!oldindex) oldindex = -1;
				if(oldindex == -1 || oldindex < index){
					chatlist.scrollTop(9999999);
				}else{
					chatlist.scrollTop(0);
				}
					
				showWelcome(uid);
			});
			
			// 左侧用户列表点击
			friendList.click(function(e){
				var target = $(e.target);
				var nt = target.attr("node-type");
				// 是否点击的是关闭按钮
				if(nt == "wbim_icon_close_s") {
					var li = target.parent();
					var id = li.attr("uid");
					$this.removeUser(id, true);
					return;
				}
				// 切换正在聊天的用户
				var par = target.parents("li");
				if(par[0]) {
					var id = par.attr("uid");
					var user = $this.getUser(id);
					var user2 = $this.webim.getFriend(id);
					if(!user) user = user2;
					if(user && user2){
						user.uname = user2.uname;
						user.skill = user2.skill;
						user.icon = user2.icon;
					}
					$this.setCurrentUser(user);
				}
			});
			
			// 左侧用户列表上下箭头
			var friendbox = this.tag.node("wbim_chat_friend_box");
			chatLf.node("wbim_scrolltop").click(function(e) {
				var ph = friendbox.height();
				var h = friendList.height();
				var top = friendList.position().top;
				if(top < 0) {
					friendList.css("top", top + 32);
					friendList.css("height",h - 32);
				}
			});
			chatLf.node("wbim_scrollbtm").click(function(e) {
				var ph = friendbox.height();
				var h = friendList.height();
				var top = friendList.position().top;
				var length = friendList[0].children.length;
				if((h + top >= ph)&&(h<=420+(length-13-1)*32)) {
					friendList.css("top", top - 32);
					friendList.css("height",h + 32);
				}
			});
			
			// 检查用户输入的字符
			var checkInput = function(e) {
				var code = e.keyCode || e.which || e.charCode;
				var l = 200 - sendMsg.val().length;
				
				if(l > 0) {
					sendLength.text(l);
				} else {
					sendLength.html("<span style='color:red'>" + l + "</span>");
					
//					if(l <= -50) {
//						if(code > 31 && code < 127) {
//                            sendMsg.val(sendMsg.val().substring(0, 200));
//                        }
//					}
					
				}
				return true;
			};
			
			//发送按钮监听
			sendBtn.click(onSendMessage);
			
			
			// 监听输入消息时鼠标按下事件
			sendMsg.on("keydown", function(e) {
				var code = e.keyCode || e.which || e.charCode;
				if(code == 13) {
					if($this.sendKey == "entry" || e.ctrlKey) {
						onSendMessage();
						e.preventDefault();
						return false;
					}
				}
				return checkInput(e);
			}).keyup(function(e) {
				return checkInput(e);
			});
			
			// 选择发送快捷键
			var choosea = this.tag.node("wbim_btn_choose_a");
			var chooseItem = this.tag.node("wbim_btn_choose");
			choosea.on("click", function(e){
				chooseItem.css("display", "block");
				if(e.stopPropagation) e.stopPropagation();
				else e.cancelBubble = true;
			});
			$(document.body).on("click", function(e) {
				chooseItem.css("display", "none");
			});
			// 选择按entry键发送
			chooseItem.node("wbim_enter_send").on("click", function(e, s) {
				$this.sendKey = "entry";
				chooseItem.find("li.curr").removeClass("curr");
				chooseItem.node("wbim_enter_send_li").addClass("curr");
				if(s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			});
			// 选择按ctrl+entry键发送
			chooseItem.node("wbim_ctrlenter_send").on("click", function(e, s) {
				$this.sendKey = "entry+ctrl";
				chooseItem.find("li.curr").removeClass("curr");
				chooseItem.node("wbim_ctrlenter_send_li").addClass("curr");
				if(s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			});
			
			// 聊天窗口上方的提示信息关闭
			chatTips.node("wbim_icon_close_s").click(function(e) {
				$this.innerTrigger("hideBoxTips");
			});
			
			// 聊天表情
			var getImgInfo = function(aTag) {
				$aTag = $(aTag);
				var img = $aTag.find("img");
				if(!img[0]) return null;
				
				var obj = {
					img: img,
					url: img.attr("imgsrc"),
					title: $aTag.attr("title")
				};
				return obj;
			};
			var getImgInfoByTitle = function(t) {
				return getImgInfo(faceView.node("wbim_face_list").find("a[title='" + t + "']"));
			};
			
			// 表情替换
			var replaceFace = function(msg) {
				var rep = /\[[^\[]+\]/g;
				var arr = msg.match(rep);//rep.match(msg);
				if(!arr) return msg;
				for(var i=0; i<arr.length; i++) {
					var str = arr[i];
					var obj = getImgInfoByTitle(str);
					if(obj) {
						if(!obj.img.attr("src")) {
							obj.img.attr("src", WEB_IM_CONFIG.project_address + obj.url);
						}
						msg = msg.replace(str, obj.img[0].outerHTML);
					}
				}
				return msg;
			};
			
/*****************************************解析消息内容 开始*********************************************************/
			/**
			 * 解析聊天消息
			 * 对文件和图片进行特殊化处理
			 */
			var getChatContent = function(data){
				var chatContent = replaceFace(data.content);
				if(F.FILE_IMG_REP.test(chatContent)){//图片
					var id=getFileId(F.FILE_IMG_STR,chatContent);
					var name=getFileName(chatContent);
					var imgURL = WEB_IM_CONFIG.rc_url + "image?photo_id=" + id;//+ "&photo_size="
					var imgContent = "<div><p class='lr'><span class='picsbox_n'>"
					+	"<a>"
					+		"<img onload='imgLoadHandler(event)' style='width:120px' onclick='enlargeImgClick(event)' name='"+name+"' src='"+imgURL+"'/>"
					+	"</a>"
					+	"<i></i></span>"
					+"</p></div>";
					
					chatContent = properties.webimchatbox_share_pic;
					chatContent = getMsgView(F.FILE_IMG_STR,chatContent,imgContent,id,name);
				}else if(F.FILE_FILE_REP.test(chatContent)){//文件
					var id=getFileId(F.FILE_DOC_STR,chatContent);
					var name=getFileName(chatContent);
					var fileContent = "<span class='picsbox'><em class='wbim_icon_b_txt' title='"+properties.webimchatbox_file+"'/>"+properties.webimchatbox_share_file+"</span>"
					+"<span class='infos'>"+name+"<br>"+"</span><span class='pos'>"
					+(data.isSelf ? "" : "<a href='"+WEB_IM_CONFIG.rc_url+"doc?doc_id="+id+"' target='_blank'>"+properties.webimchatbox_download+"</a>")+"</span>";
					
					chatContent = properties.webimchatbox_share_file + (data.isSelf?"":properties.webimchatbox_downloadview);
					chatContent = getMsgView(F.FILE_DOC_STR,chatContent,fileContent,id,name);
				}else if(F.FILE_IMG_RES.test(chatContent)){//新版资源中心图片
					var path=getFileId("file-start&type=image&path=",chatContent);
					var name=getFileName(chatContent);
					var imgContent = "<div><p class='lr'><span class='picsbox_n'>"
					+	"<a>"
					+		"<img onload='imgLoadHandler(event)' style='width:120px' onclick='enlargeImgClick(event)' name='"+name+"' src='"+path+"'/>"
					+	"</a>"
					+	"<i></i></span>"
					+"</p></div>";
					chatContent = properties.webimchatbox_share_pic;
					chatContent = getMsgView("file-start&type=image&path=",chatContent,imgContent,path,name);
				}else if(F.FILE_FILE_RES.test(chatContent)){//新版资源中心文件
					var path=getFileId("file-start&type=doc&path=",chatContent);
					var name=getFileName(chatContent);
					var fileContent = "<span class='picsbox'><em class='wbim_icon_b_txt' title='"+properties.webimchatbox_file+"'/>"+properties.webimchatbox_share_file+"</span>"
						+"<span class='infos'>"+name+"<br>"+"</span><span class='pos'>"
						+(data.isSelf ? "" : "<a href='"+path+"' target='_blank'>"+properties.webimchatbox_download+"</a>")+"</span>";
					chatContent = properties.webimchatbox_share_file + (data.isSelf?"":properties.webimchatbox_downloadview);
					chatContent = getMsgView("file-start&type=doc&path=",chatContent,fileContent,path,name);
				}
				
				//发送者昵称和时间
				var uname0 = data.uname + (WEB_IM_CONFIG.appendUId?"("+data.uid+")":"");
				var chatUserName = '<div class="' + (data.isSelf?"self_name":"other_name") + '">' + 
				(WEB_IM_CONFIG.showUserName?(uname0 +"&nbsp;&nbsp;"):"") + data.date + "&nbsp;" + data.time + '</div>';
				//wbim_msgr
				return '<dd id="'+data.dd_id+'" class="' + (data.isSelf ? 'wbim_msgl' : 'wbim_msgl') + '">'
				+ '<div class="wbim_msgpos">' + chatUserName
				+ '<div class="msg_box">'+hasUrl(chatContent)+'</div>'
				+ '<div class="msg_arr"></div></div></dd>';
				
				//航购网聊天内容增加气泡样式
			/*	return '<dd id="'+data.dd_id+'" class="' + (data.isSelf ? 'wbim_msgl wbim_msgl_my' : 'wbim_msgl') + '">'
				+ '<div class="wbim_msgpos">' + chatUserName
				+ (data.isSelf ? '<div class="msg_box msg_box_qp msg_box_my">' : '<div class="msg_box msg_box_qp msg_box_other">')+hasUrl(chatContent)+'</div>'
				+ '<div class="msg_arr"></div></div></dd>';*/

				
			};
			
			var getFileNameStr = function(name,type,isSelf){
			     return "#"+(isSelf?properties.webimchatbox_share:"")+type+":"+name;
			};
			
			
			//字符串中如果包含链接，加上<a>标签
			var hasUrl = function(content){
				var reg = /(^|[^"'(=])((http|https|ftp)\:\/\/[\.\-\_\/a-zA-Z0-9\~\?\%\#\=\@\:\&\;\*\+]+\b[\?\#\/\*]*)/g;
				var re = new RegExp(reg);
				return content.replace(re, "<a target=\"_blank\" href=\" $& \"> $& </a>");
			};
			
			
			/**
			 * 生成显示的消息内容的样式
			 * @param fileStr:文件开头标示(图像或者文件)
			 * @param fileHtml:上传的文件html
			 * @param chatContent:消息内容
			 * @param id:文件id
			 * @param name:文件名
			 */
			var getMsgView = function(fileStr,chatContent,fileHtml,id,name){
//				chatContent = chatContent.replace(fileStr+id+F.FILE_NAME_STR+name+F.FILE_END_STR,"");
				chatContent = "<p class='txt'>"+chatContent+"</p>"
				   + "<p class='line'/>"
				   + "<p class='lr' node-key='" +new Date().getTime()+ "'>"
				   + fileHtml
				   + "</p>";
				return chatContent;
			};
			
			/**
			 * 计算上传的文件的id
			 */
			var getFileId = function(idStr,str){
				return str.substring(str.indexOf(idStr)+idStr.length,str.indexOf(F.FILE_NAME_STR));
			};
			
			/**
			 * 计算上传的文件的名称
			 */
			var getFileName = function(str){
				return str.substring(str.indexOf(F.FILE_NAME_STR)+F.FILE_NAME_STR.length,str.indexOf(F.FILE_END_STR));
			};
			
			/*****************************************解析消息内容 完毕*********************************************************/
			
			
			//
			this.tag.node("wbim_icon_face").click(function(e) {
				faceView.css("display", "block");
				$.each(faceATag, function(i, aTag) {
					var obj = getImgInfo(aTag);
					if(!obj.img.attr("src")) {
						obj.img.attr("src", WEB_IM_CONFIG.project_address + obj.url);
					}
				});
			});
			faceView.node("wbim_icon_face_close").click(function(e) {
				faceView.css("display", "none");
			});
			
			// 聊天表情点击
			faceATag.click(function(e) {
				var obj = getImgInfo(e.currentTarget);
				if(obj) {
					sendMsg.focus();
					insertStrToTextarea(sendMsg[0], obj.title);
				}
			});
			
			var spetxt = this.tag.node("spetxt");
			//发送之后，隐藏快捷回复框
			sendMsg.focus(function(e) {
				faceView.css("display", "none");
				quickView.css("display", "none");
				
				if($.trim(sendMsg.val())){
				    sendLength.val(200 - sendMsg.val().length);
				}
			});
			
			// 常用语（快捷回复）点击
			quickBtn.click(function(e) {
				var data = {
					type : "3601",
					user_id : $this.webim.userInfo.uid
				};
				$.ajax({
					url : WEB_IM_CONFIG.imUrL + "sendOperate",
					data : {
						data : JSON.stringify(data)
					},
					dataType : WEB_IM_CONFIG.ajaxDataType,
					jsonp : WEB_IM_CONFIG.ajaxJsonp,
					type : "post",
					error : function(XMLHttpRequest, textStatus, errorThrown) {

					},
					success : function(data) {
						if (!data) {
							return;
						}
						if (typeof (data) === "string") {
							data = JSON.parse(data);
						}
						if (data.usualList) {
							var dataList = data.usualList;
							var innerContent = "<ul>";
							for ( var i = 0; i < dataList.length; i++) {
								innerContent += "<li><a>" + dataList[i].CONTENT + "</a></li>";
							}
							innerContent += "</ul>";
							$(".wbim_quick_con").html(innerContent);
							quickView.node("wbim_quick_con").find("ul a").click(function(e) {
								var txt = $(e.currentTarget).text();
								quickView.css("display", "none");
								onSendMessage(e, txt);
							});
						}
					}
				});
				quickView.css("display", "block");
			});
			quickView.node("wbim_icon_quick_close").click(function(e) {
				quickView.css("display", "none");
			});
			
			
			//订单查询
			/*quickSearch.click(function(e){
				window.open(WEB_IM_CONFIG.order_search);
			});*/
			
			// 打分邀请点击
			pingBtn.click(function(e) {
				// 自己是客服时
				if($this.webim.isService($this.webim.userInfo.skill)){
					$this.webim.sendServiceAppraise($this.currentUser.uid);
				}
			});
			var pingView = this.tag.node("wbim_ping_box");
			pingView.node("wbim_icon_ping_close").click(function(e) {
				$this.hidePingView();
			});
			
			// 聊天记录按钮点击
			historyBtn.click(function(e) {
//				alert("点击聊天记录！");
				$this.innerTrigger("showChatHistoryView", {uid: $this.currentUser.uid});
			});
			historyView.node("wbim_icon_history_close").click(function(e) {
				$this.innerTrigger("hideChatHistoryView");
			});
			
			// 聊天记录分页请求
			var requestPage = function(isNext, i) {
				var uid = historyView.attr("data-current");
				var chatlist = historyList.find("div[uid="+uid+"]");
				var index = parseInt(chatlist.attr("data-index"));
				var count = parseInt(chatlist.attr("data-count"));
				
				var p = count - i + 1;
				if(!p){
					p = isNext ? index + 1 : index - 1;
				}	
				
				if(p == index) return;
				
				if(p > 0 && p <= count) {
					var page = chatlist.find("dl[data-index="+p+"]");
					if(page[0]) {
						chatlist.find("dl").css("display", "none");
						page.css("display", "block");
						
						var oldindex = parseInt(chatlist.attr("data-index"));
						chatlist.attr("data-index", p);
						refreshBtns();
						
						if(!oldindex) oldindex = -1;
						if(oldindex == -1 || oldindex < p)
							chatlist.scrollTop(9999999);
						else
							chatlist.scrollTop(0);
					} else {
						$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: uid, start: (p-1)*$this.historySize, size: $this.historySize});
					}
				}
			};
			// 聊天记录刷新底部按钮
			var refreshBtns = function() {
				var uid = historyView.attr("data-current");
				var chatlist = historyList.find("div[uid="+uid+"]");
				var index = parseInt(chatlist.attr("data-index"));
				var count = parseInt(chatlist.attr("data-count"));
				
				historyMax.text(count);
				historyII.val(count - index + 1);
				historyPrev.css("visibility", index <= 1 ? "hidden" : "visible");
				historyNext.css("visibility", index >= count ? "hidden" : "visible");
			};
			// 上一页（实际处理为下一页）
			historyNext.click(function(e) {
				requestPage(true);
			});
			// 下一页（实际处理为上一页）
			historyPrev.click(function(e) {
				requestPage(false);
			});
			historyII.change(function(e) {
				var i = parseInt(historyII.val());
				if(i)requestPage(false, i);
			});
			//确定，进行请求聊天记录
			historyIIBtn.click(function(e){
			     var i = parseInt(historyII.val());
                 if(i)requestPage(false, i);
			});
			
			// 聊天记录刷新
			historyRefresh.click(function(e) {
				var uid = historyView.attr("data-current");
				var chatlist = historyList.find("div[uid="+uid+"]");
				chatlist.empty();
				
				$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: uid, start: 0, size: $this.historySize});
			});
		},
		
		createView: function() {
			var $this = this;
			
			// 自己是客服时
			if($this.webim.isService($this.webim.userInfo.skill)){
				this.tag.node("wbim_icon_ping").css("display", "block");
				this.tag.node("wbim_icon_quick").css("display", "block");
				/*this.tag.node("wbim_icon_chaxun").css("display", "block");*/
			}
		},
		
		/**
		 * 显示聊天窗口
		 */
		showIMChatBox: function(s) {
			this.tag.css("display", "block");
			this.isOpen = true;
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
			
			var chatList = this.tag.node("wbim_chat_list");
			chatList.scrollTop(9999999);
		},
		/**
		 * 隐藏聊天窗口
		 */
		hideIMChatBox: function(s) {
			this.tag.css("display", "none");
			this.isOpen = false;
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
				this.trigger(E.HIDE_CHATBOX);
			}
		},
		
		/**
		 * 显示给客服评分框
		 */
		showPingView: function(uid, s) {
			var user = this.getUser(uid);
			if(user) {
				var pingView = this.tag.node("wbim_ping_box");
				pingView.attr("uid", user.uid);
				//pingView.node("wbim_ping_tit_lf").text(L.pingServiceLabel.replace(/%s/, user.uname));
				pingView.node("wbim_ping_tit_lf").text(L.pingServiceLabel.replace(/%s/, ""));
				
				pingView.css("display", "block");
				if(s != E.DO_NOT_CONTROL) {
					this.trigger(E.ON_SEND_CONTROL);
				}
			}
		},
		
		/**
		 * 隐藏给客服评分框
		 */
		hidePingView: function(s) {
			this.tag.node("wbim_ping_box").css("display", "none");
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
		},
		isGroupWay:function(obj){
			return (obj.way == "group");
		},
		/**
		 * 增加聊天用户，打开用户窗体
		 * @param id
		 */
		addUser: function(user, setuser, s) {
//			if(typeof(user) == "string") {
//				user = this.webim.getFriend(user.uid);
//				if(!user)
//					user = {uid: user.uid, uname: L.noneNickName, isfriend: "false"};
//				else
//					user.isfriend = "true";
//			} else {
				var tmpuser = this.webim.getFriend(user.uid);
				if(tmpuser && (!this.isGroupWay(user))) {
					user.uname = tmpuser.uname;
					user.icon = tmpuser.icon;
					user.status = tmpuser.status;
					user.isfriend = "true";
				} else {
					user.isfriend = "false";
				}
				
//			}
			
			if(user) {
				user.s = s;
				if(!this.getUser(user.uid)) {
					this.users.push(user);
					this.innerTrigger("addUser", user);
				}
				if(setuser)
					this.setCurrentUser(user);
				
				//用户窗体列表
				if(this.users.length > 1) {
					this.innerTrigger("showUserList");
				}
				
				//设置侧边栏信息
				var $this = this;
				if(WEB_IM_CONFIG.showSideBar == 0){ //隐藏侧边栏
					$('#wbim_chat_box').find('div[class="im-right-sidebar"]').css("display", "none");
				} else if(WEB_IM_CONFIG.showSideBar == 1){ //默认侧边栏
					IM.call("2510", {
							itemId: user.itemId,
							vendId: user.vendId,
							uid: user.uid,
							uname: user.uname,
							skill: "" + $this.webim.getDefaultSkill(user.skill)
						},
						$this.webim.setSideBar,
						$this.webim
					);
				} else if(WEB_IM_CONFIG.showSideBar == 2){ //自定义侧边栏
					$this.webim.setSideBarNew(user.uid);
				}
			}
		},
		/**
		 * 移除聊天用户
		 * @param id
		 */
		removeUser: function(id, setuser, s) {
			var user = null;
			for(var i=0; i < this.users.length; i++) {
				var f = this.users[i];
				if(f.uid == id) {
					user = f;
					user.s = s;
					this.users.splice(i, 1);
					this.innerTrigger("removeUser", f);
					break;
				}
			}
			
			if(this.users.length == 0) {
				// 已没有聊天用户，关闭聊天窗口
				this.innerTrigger("hideUserList");
				this.tag.node("wbim_history_box").css("display", "none");
				this.historyIsShow = false;
				
				if(setuser) {
					this.setCurrentUser(null);
					this.trigger(E.CLOSE_CHATBOX);
				}
			} else if(this.currentUser && this.currentUser.uid == id) {
				// 当前聊天用户设为第一个用户
				if(setuser) {
					this.setCurrentUser(this.users[0]);
				}
			}
		},
		/**
		 * 检测是否跟某用户聊天
		 * @param id
		 * @returns {Boolean}
		 */
		getUser: function(id, list) {
			var l = list;
			if(!l) l = this.users;
			for(var i=0; i < l.length; i++) {
				var f = l[i];
				if(f.uid == id) {
					return f;
				}
			}
			return null;
		},
		/**
		 * 设置当前聊天用户
		 * @param user
		 */
		setCurrentUser: function(user, s) {
			if(!this.currentUser && !user) return;
			if(this.currentUser && user && this.currentUser.uid == user.uid) return;
			
			this.currentUser = user;
			if(user)
				user.s = s;
			this.innerTrigger("setCurrentUser", user);
			
			if(this.historyIsShow && user) {
				this.innerTrigger("showChatHistoryView", {uid: user.uid});
			}
			
			this.trigger(E.CURRENT_USER, user);
		},
		
		/**
		 * 获取当前界面的显示状态
		 * @returns {___data0}
		 */
		getViewStatus: function() {
			var data = new Object();
			var str = "";
			for(var i=0; i < this.users.length; i++) {
				var user = this.users[i];
				str += user.uid + "|" + user.uname + "|" + user.skill + "|" + user.status;
				if(user.isfriend == "false") {
					str += "|" + user.icon; 
				}
				str += ",";
			}
			data.users = str;
			if(this.currentUser)
				data.current = this.currentUser.uid;
			data.sendKey = this.sendKey;
			data.isOpen = this.isOpen;
			var pingView = this.tag.node("wbim_ping_box");
			data.ping = {uid: pingView.attr("uid"), pingcss: pingView.css("display")};
			return data;
		},
		
		/**
		 * 设置当前界面的显示状态
		 * @param data
		 */
		setViewStatus: function(data) {
			
			if(data.ping){
				if(data.ping.pingcss == "block")
					this.showPingView(data.ping.uid, E.DO_NOT_CONTROL);
				else
					this.hidePingView(E.DO_NOT_CONTROL);
			}
			
			var ids = data.users.split(",");
			var arr = new Array();
			var current;
			for(var i=0; i<ids.length; i++) {
				if(!ids[i]) continue;
				
				var tmpu = ids[i].split("|");
				var user = this.webim.getFriend(tmpu[0]);
				if(!user)
					user = {uid:tmpu[0], uname:tmpu[1], skill:tmpu[2], status: tmpu[3], icon: tmpu[4]};
				else {
					if(tmpu.length > 2 && tmpu[2]) {
						user.skill = tmpu[2];
					}
				}
				
				this.addUser(user, false, E.DO_NOT_CONTROL);
				arr.push(user);
				
				if(user.uid == data.current)
					current = user;
			}
			for(var i=0; i<this.users.length; i++) {
				var u = this.users[i];
				if(!this.getUser(u.uid, arr)) {
					this.removeUser(u.uid, false, E.DO_NOT_CONTROL);
				}
			}
			
			this.setCurrentUser(current, E.DO_NOT_CONTROL);
			
			if(data.isOpen)
				this.showIMChatBox(E.DO_NOT_CONTROL);
			else
				this.hideIMChatBox(E.DO_NOT_CONTROL);
			
			if(data.sendKey != this.sendKey) {
				var chooseItem = this.tag.node("wbim_btn_choose");
				if(data.sendKey == "entry")
					chooseItem.node("wbim_enter_send").trigger("click", E.DO_NOT_CONTROL);
				else
					chooseItem.node("wbim_ctrlenter_send").trigger("click", E.DO_NOT_CONTROL);
			}
		},
		
		getHasMessage: function() {
			var friendList = this.tag.node("wbim_chat_friend_list");
			var uli = friendList.find("li.wbim_highlight");
			return uli.length > 0;
		},
		
		/**
		 * 测试版提示标题
		 */
		createTextVersionTitle:function(){
			if(WEB_IM_CONFIG.testVersionTitle){
			     var str = "<div class='wbim_tit_lf'><p style='padding-top:4px'/>" +WEB_IM_CONFIG.testVersionTitle+ "</p></div>";
                 $("#wbim_titin_id").append($(str));
			}
		},
		
		createRefreshBtn:function(){
		    //var titin = this.tag.node("wbim_titin");
		    //$("#wbim_titin_id").append("<div class='wbim_icon_tips'></div>");
		},
		
		/**
		 * 监听外部事件
		 */
		listener: function() {
			var $this = this;
			this.ptag.on(E.OPEN_CHATBOX, function(e, data) {
				
				//机器人
				if(data && $this.webim.isRobot(data.skill)){
					$this.webim.openRobotBox(data);
				    return;
				}
				
				if(data) {
					var b = data.isShow;
					if(b !== "false") b = true;
					$this.addUser(data, b);
				} else {
					if(!$this.currentUser && $this.users && $this.users.length > 0) {
						$this.setCurrentUser($this.users[0]);
					}
				}
				if($this.users && $this.users.length > 0) {
					$this.showIMChatBox();
				}
			}).on(E.CLOSE_CHATBOX, function(e, data) {
				if(data) {
					$this.removeUser(data.uid, true);
				} else {
					$this.hideIMChatBox();
					$this.trigger(E.HIDE_CHATBOX);
				}
			}).on(E.ADD_CHAT_USER, function(e, data) {
				$this.addUser(data, data.isShow);
			}).on(E.SET_USER_STATUS, function(e, data) {
				$this.innerTrigger("boxSetUserStatus", data);
			}).on(E.ON_ACCEPT_MESSAGE, function(e, data) {
				if(!$this.getUser(data.uid)) {
					$this.addUser(data);
				} else {
					$this.innerTrigger("addMessage", data);
				}
			}).on(E.HAS_MESSAGE, function(e, data) {
				$this.innerTrigger("activeChatbox", data);
			}).on(E.ADD_MULMESSAGE, function(e, data) {
				$this.innerTrigger("addMulMessage", data);
			}).on(E.ADD_HISTORYMESSAGE, function(e, data) {
				$this.innerTrigger("addChatHistoryMessage", data);
			});
		},
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		},
		
		
		/**
		 * 加载文件上传swf
		 */
		createFileUpLoad:function(){
			//不显示图片和文件
			if(!WEB_IM_CONFIG.sendImg){
				this.tag.node("wbim_icon_img").css("display","none");
				this.tag.node("wbim_icon_doc").css("display","none");
				return;
			}
			//创建文件上传div(注意：需要创建两个div，里面的那个被swf覆盖掉)
			var div = $("<div id='imgUpLoadDiv' class='fileUpLoadOfFlash'/>");
			div.append($("<div id='imgUpLoad'>"));
			$(".wbim_chat_rt").append(div);
			//swf参数
			var lparams = {
				allowfullscreen:"true",
				allowscriptaccess:"always",
				wmode:"transparent",
//				wmode:"opaque",
				quality:"high",
				scale:"noScale",
				menu:"false"
			};
			
			//参数
			var flashVars = new Object();
			flashVars.uid = this.webim.userInfo.uid;//用户id
			flashVars.fileUpError = "fileUpError";//上传失败回调
			
			flashVars.url = Channel_CONFIG.rc_url + "upload";//资源中心地址
			if(flashVars.url.indexOf("DocCenterService")>-1){//老版资源中心
				flashVars.swfUrl = WEB_IM_CONFIG.project_address + "images/imgUpLoad.swf";
				flashVars.fileUpComplete = "fileUpComplete";//上传成功回调
			}else{//新版资源中心
				flashVars.swfUrl = WEB_IM_CONFIG.project_address+"newimgupload/imgUpLoad.swf";
				flashVars.url =  Channel_CONFIG.rc_url;
				flashVars.dir ="im";
				flashVars.fileUpComplete = "fileUpCompleteNew";//上传成功回调
			}
			swfobject.embedSWF(flashVars.swfUrl, 
					"imgUpLoad", "96px", "20px", "9.0.124", 
					null, flashVars, lparams,{id:"IMG_UP_LOAD",name:"IMG_UP_LOAD"});
			//注册事件
			//删除上传的文件
			$("#deleteFileId").click(function(){
				setFileUpTool("none");
			});
			
			
			// 设置swf全局变量，用于方法回调
			upImgSwf = $("#IMG_UP_LOAD")[0];
			return;
			if(typeof upImgSwf == "undefined") {
				var tip = [];
				tip.push("<p>"+properties.webimchatbox_nofound_swf+"</p>");
				tip.push("<p><a href='http://get.adobe.com/cn/flashplayer/'>http://get.adobe.com/cn/flashplayer/</a></p>");
				tip.push("<p>"+properties.webimchatbox_nouse_flash+"</p>");
				alert(tip.join(""));
			}
		}
	};
})(jQuery);



/**
 * 文件上传过程中
 */
function fileUpLoading(){
	$(".wbim_icon_s_photo").css("display","none");//文件默认图片
	$(".icon_ing").css("display","block");
	$(".wbim_chat_input_tips").css("display","block");
	
	$("#webimBtnSendDivId").removeClass("wbim_btn_send");
	$("#webimBtnSendDivId").addClass("wbim_btn_send wbim_btn_send_disable");
	$("#upFileNameId").html(properties.webimchatbox_uploading+"...");
	$("#webimBtnSendId").attr("disabled", true);
//	setFileUpToolCSS("none","上传中...");
}


/**
 * 文件上传成功
 * @param file:上传的文件对象
 */
function fileUpComplete(file){
//	alert("上传的图片名称:"+file.name+",服务器返回的id:"+file.id);
	setFileUpTool("block",file.name);
	var data = F.FILE_START_STR + "&type=" + file.type + "&id=" + file.id + "&name=" + file.name + F.FILE_END_STR;
	$("#fileUpTextId").val(data);
}

function fileUpCompleteNew(file){
	setFileUpTool("block",file.name);
	var data = F.FILE_START_STR+"&type="+ file.type + "&path="+file.path+"&name="+ file.name + F.FILE_END_STR;
	$("#fileUpTextId").val(data);
}

/**
 * 文件上传出错
 * @param msg
 */
function fileUpError(msg){
	showAlert(msg,properties.webimchatbox_prompt,true);
	setFileUpTool("none");
}

/**
 * 提供给外部的设置文件上传的一栏css设置
 * @param disp
 */
function setFileUpToolCSS(disp){
	$(".wbim_icon_s_photo").css("display",disp);//文件默认图片
	$("#upFileNameId").html("");//文件名
	$("#fileUpTextId").val("");//清空存储文件路径的隐藏框
//	$("#vdiskId").css("display",disp);//查看微盘
	$("#deleteFileId").css("display",disp);//删除
	$(".icon_ing").css("display","none");//进度条
}

/**
 * 图片加载完毕修改滚动条
 * @param {} event
 */
function imgLoadHandler(event){
	 $(".wbim_chat_list").scrollTop(9999999);
}

/**
 * 点击图片进行放大
 * @param event 点击的图片
 */
function enlargeImgClick(event){
	 event = (window.event || event);
	 var srcEle = (event.target || event.srcElement);
	 //名字
	 $("#wbim_ptit_id").html(srcEle.name);
	 //加载原图
	 /*alert(srcEle.src.lastIndexOf("&"));
	 var src = srcEle.src.substring(0,srcEle.src.lastIndexOf("&"));*/
	 var src = srcEle.src;
	 var img = $("<img src='" + src +"'>");
	 img.on("load",scaleImgLoadHandler);
	 
	 //添加
	 $(".wbim_pic_zone").empty();
	 $(".wbim_pic_zone").append(img);
	 $(".wbim_pic_zone").css("display","block");
	 $(".wbim_picview_box").css("display","block"); 
};

/**
 * 放大的图片加载完毕
 */
function scaleImgLoadHandler(){
	$(this).off("load",scaleImgLoadHandler);
	var width = this.width;
	var height = this.height;
	
	if(width > 900 || height > 500){
		width = 900;
		height = 500;
		$(".wbim_picview_box").css("top", "-50px");
	} else {
		if(width < 500 || height > 300){
			width = 500;
			height = 300;
		}
		$(".wbim_picview_box").css("top", "0px");
	}
	
	$(".wbim_picview_box").width(width + "px");
	$(".wbim_picview_box").height(height + 26 + "px");
	$(".wbim_pic_zone").width(width + "px");
	$(".wbim_pic_zone").height(height + "px");
	$(".wbim_picview_box").css("right", (document.body.clientWidth - width) / 2 + "px");
	
	//设置图片的位置
	var imgLeft = (width - this.width) / 2;
	var imgTop = (height - this.height) / 2;
	$(this).css("left", imgLeft < 0 ? 0 : imgLeft);
	$(this).css("top", imgTop > 0 ? imgTop : 0);
}


/**
 * 点击关闭图片缩放的界面
 */
function closeImgZone(){
	$(".wbim_pic_zone").empty();
	$(".wbim_picview_box").css("display","none"); 
}

/**
 * 统一设置文件上传工具条
 * @param disp：工具条显示与否
 * @param fileName:上传的文件名
 */
function setFileUpTool(disp,fileName){
	if(!fileName)fileName="";
	setFileUpToolCSS(disp,fileName);
	$("#upFileNameId").html(fileName);//文件名
	
	$("#webimBtnSendId").removeAttr("disabled");
	$("#webimBtnSendDivId").removeClass("wbim_btn_send wbim_btn_send_disable");
	$("#webimBtnSendDivId").addClass("wbim_btn_send");
	
	try{
		if(upImgSwf){
			if(disp=="block"){//文件上传后显示“删除”按钮，并屏蔽鼠标事件
				$(".wbim_chat_input_tips").css("display","block");
				upImgSwf.btnUnEnable();
			}else{
				$(".wbim_chat_input_tips").css("display","none");
				upImgSwf.btnEnable();
			}
		}
	}catch(e){}
}