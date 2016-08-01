var WebIM = function() {
	this.init();
};

(function($) {

	WebIM.prototype = {
		eventDispatcher : null,
		tag : null,
		imList : null,
		imChatbox : null,
		imSysMsg : null,
		friends : null,
		nearList : null,
		groups : null,
		onlines : null,
		userInfo : null,
		statusTimer : null,
		isConnected : false,
		isLoaded : false,
		isCreated : false,
		session : null,

		robotMap : null,

		// 新消息提示控件
		soundControl : null,

		/**
		 * 初始化
		 */
		init : function() {
			this.eventDispatcher = $(this);
			var $this = this;

			// 获取页面展示的html的版本
			var temp = "";
			if (WEB_IM_CONFIG.skin == "1") {
				temp = webim_tag1;
			} else if (WEB_IM_CONFIG.skin == "2") {
				temp = webim_tag2;
			} else if (WEB_IM_CONFIG.skin == "3") {
				temp = webim_tag3;
			} else if (WEB_IM_CONFIG.skin == "4") {
				temp = webim_tag4;
			}

			// 显示
			$("body").append('<div id="wbim_box_container"></div><div id="newMessageDIV" style="display:none"></div>');

			// 发送声音设置
			if ($.browser.msie && ($.browser.version == '8.0' || $.browser.version == '7.0' || $.browser.version == '6.0')) {
				$('#newMessageDIV').html(
						'<embed id="soundControl" src="' + WEB_IM_CONFIG.project_address
								+ 'sound/msg.wav" width="0" height="0" autostart="false"></embed>');
			} else {
				// IE9+,Firefox,Chrome均支持<audio/>
				$('#newMessageDIV').html(
						'<audio id="soundControl" preload="auto"><source src="' + WEB_IM_CONFIG.project_address
								+ 'sound/msg.mp3" type="audio/mp3"><source src="' + WEB_IM_CONFIG.project_address
								+ 'sound/msg.wav" type="audio/wav"/></audio>');
			}
			
			$('#wbim_box_container').html(temp);

			// 获取用户数据
			WEB_IM_CONFIG.openTest ? $this.testGetUserInfo(E.INIT_USER_INFO) : $this.getUserInfo(E.INIT_USER_INFO);
		},

		/**
		 * 初始化界面 应在登录聊天服务器成功后初始化界面
		 */
		initView : function() {
			var $this = this;

			if ($this.isCreated)
				return;

			$this.tag = $("#wbim_box");
			$this.tag.css("display", "block");

			$this.imList = new WebIMList();
			$this.imList.init($this);

			$this.imChatbox = new WebIMChatbox();
			$this.imChatbox.init($this);

			$this.imBar = new WebIMBar();
			$this.imBar.init($this);

			$this.imSysMsg = new WebIMSystemMessage();
			$this.imSysMsg.init($this);

			// 初始化机器人界面
			$this.robotMap = new RobotMap();

			$this.listenerTagEvent();
			$this.listener();

			$this.isCreated = true;

			// 好友列表
			$this.setFriends($this.friends);
			// 群组列表
			$this.setGroups($this.groups);

			$this.imChatbox.createView();

			// 获取声音提示控件对象
			$this.soundControl = document.getElementById("soundControl");
		},
		/**
		 * 监听内部事件
		 */
		listenerTagEvent : function() {

			var $this = this;
		},
		listener : function() {
			var $this = this;
			this.tag.on(E.SELF_STATUS_CHANGE, function(e, data, s) {
				if (s != E.DO_NOT_CONTROL && data.s != E.DO_NOT_CONTROL) {
					$this.sendUserStatus(data);
				}
			}).on(E.ON_SEND_MESSAGE, function(e, data, s) {
				if (s != E.DO_NOT_CONTROL) {
					$this.sendMessage(data);
				}
			}).on(E.ON_SEND_CONTROL, function(e, data, s) {
				if (s != E.DO_NOT_CONTROL) {
					$this.sendControl();
				}
			})
			// 获取聊天记录
			.on(E.GET_CHAT_INFO, function(e, data) {
				if (data.isHistory) {// 查看聊天记录
					$this.trigger("getchatinfo", {
						uid : data.uid,
						start : data.start,
						size : data.size
					});
				} else {// 打开与某个用户的聊天界面，显示最近30条的聊天内容
					$this.trigger("getchatinfo", {
						uid : data.uid,
						start : 0,
						size : 30
					});
				}
			});
		},
		/**
		 * 监听外部事件
		 * 
		 * @param type
		 * @param data
		 */
		innerTrigger : function(type, data, s) {
			data.s = s;
			if (this.tag)
				this.tag.trigger(type, data, s);
		},
		/**
		 * 根据ID获取好友信息
		 * 
		 * @param id
		 * @returns
		 */
		getFriend : function(id) {
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				if (g.gmember) {
					for ( var j = 0; j < g.gmember.length; j++) {
						var f = g.gmember[j];
						if (f.uid == id) {
							return f;
						}
					}
				}
			}
			return null;
		},
		/**
		 * 根据ID获取用户是否在线
		 * 
		 * @param id
		 * @returns {Boolean}
		 */
		getIsOnline : function(id) {
			for ( var i = 0; i < this.onlines.length; i++) {
				var f = this.onlines[i];
				if (f.uid == id) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 通过关键字查询好友
		 */
		getSearchFriends : function(key) {
			var arr = new Array();
			if (!this.friends)
				return arr;
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				if (g.gmember) {
					for ( var j = 0; j < g.gmember.length; j++) {
						var f = g.gmember[j];
						if (f.uname.indexOf(key) != -1) {
							arr.push(f);
						}
					}
				}
			}
			return arr;
		},
		/**
		 * 获取用户状态对应的class名称
		 * 
		 * @param data
		 * @returns {String}
		 */
		getUserStatusStyle : function(data) {
			var status;
			if (typeof (data) === "string" || typeof (data) === "number") {
				status = data;
			} else {
				status = data.status;
			}
			status = parseInt(status);
			switch (status) {
			case 1:
				return "wbim_status_online";// 在线
				break;
			case 2:
				return "wbim_status_busy";// 繁忙
				break;
			case 3:
				return "wbim_status_offline";// 离线
				break;
			}
			return "wbim_status_offline";
		},
		/**
		 * 设置用户状态对应标记的class样式
		 * 
		 * @param tag
		 * @param status
		 */
		setUserStatusStyle : function(tag, status) {
			var s = [ "wbim_status_online", "wbim_status_offline", "wbim_status_busy" ];
			var node = tag.node("wbim_status");
			for ( var i = 0; i < s.length; i++) {
				if (s[i] == status) {
					node.addClass(status);
					tag.attr("data-sort", status);
				} else
					node.removeClass(s[i]);
			}
		},
		/**
		 * 设置好友列表
		 * 
		 * @param data
		 */
		setFriends : function(data) {
			this.imList.setFriends(data);
		},

		/**
		 * 设置群
		 */
		setGroups : function(data) {
			this.imList.setGroups(data);
		},

		/**
		 * 获取最近联系人
		 */
		getNearFriends : function() {
			this.trigger("getNearFriendsEvent");
		},

		/**
		 * 设置最近联系人
		 * 
		 * @param data
		 */
		setNearFriends : function(data) {
			this.nearList = [];
			var arr = new Array();
			for ( var i = 0; i < data.length; i++) {
				arr[i] = {
					uid : data[i].user_id,
					uname : data[i].user_name,
					status : data[i].status,
					skill : data[i].user_skill
				};
				
				this.nearList.push(arr[i]);

				var user = this.getFriend(arr[i].uid);
				if (user) {
					arr[i].icon = user.icon;
				} else {
					arr[i].icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
				}
			}
			this.imList.setNearFriends(arr);
		},
		setOnlines : function(data) {
			// if (data && (data.length > 0)) {
			// var users = data.split(",");
			// if (users) {
			// for (var i = 0; i < users.length; i++) {
			// var user = this.getFriend(users[i]);
			// if (user) {
			// user.status = "1";
			// this.innerTrigger(E.SET_USER_STATUS, user);
			// }
			// }
			// }
			// }
			//
			// return;
			var arr = data;
			if (typeof (data) == "string") {
				arr = data.split(",");
			}
			if (!arr)
				return;

			for ( var i = 0; i < arr.length; i++) {
				var u = arr[i];
				var s = 1;
				if (typeof (u) != "string") {
					s = u.status;
					u = u.user_id;
				}
				var user = this.getFriend(u);
				if (user) {
					user.status = s;
					this.innerTrigger(E.SET_USER_STATUS, user);
				}
			}
		},

		/**
		 * 将所有用户设为离线
		 */
		setAllUsersOffline : function() {
			// 将好友设为离线
			if (this.friends && (this.friends.length > 0)) {
				for ( var i = 0; i < this.friends.length; i++) {
					this.setUserOfflineHandler(this.friends[i].gmember);
				}
			}
			// 将最近联系人设为离线
			this.setUserOfflineHandler(this.nearList);
		},

		/**
		 * 将用户在线状态设为离线的具体操作
		 */
		setUserOfflineHandler : function(list) {
			if (list && (list.length > 0)) {
				for ( var i = 0; i < list.length; i++) {
					var user = list[i];
					user.status = "3";
					this.innerTrigger(E.SET_USER_STATUS, user);
				}
			}
		},

		/**
		 * 设置用户状态（好友）
		 * 
		 * @param data
		 */
		setUserStatus : function(data) {
			if (data.uid == this.userInfo.uid) {
				// 设置自己的状态
				if (this.imList.status != data.status) {
					var type = this.getUserStatusStyle(data.status);
					this.innerTrigger(E.SELF_STATUS_CHANGE, {
						status : data.status,
						cla : type,
						s : E.DO_NOT_CONTROL
					}, E.DO_NOT_CONTROL);
				}
			} else {
				// 设置好友的状态
				/*
				 * var user = this.getFriend(data.uid); 
				 * if(user) { 
				 * user.status = data.status; 
				 * this.innerTrigger(E.SET_USER_STATUS, user); 
				 * }
				 */
				this.innerTrigger(E.SET_USER_STATUS, data);
			}
		},
		/**
		 * 设置其他用户发来的消息
		 * 
		 * @param data
		 */
		setMessage : function(data) {
			// 组装消息内容
			var msg = {
				isSelf : false,
				uid : data.from,
				uname : data.from_name,
				time : data.chat_time,
				date : data.chat_date,
				content : data.msg,
				msg_status : data.msg_status,
				msg_type : data.msg_type,
				itemId: data.itemId,
				vendId: data.vendId
			};

			// 接收到自己发的消息
			if (data.from == this.userInfo.uid) {
				msg.isSelf = true;
				msg.uid = data.to;
				msg.uname = data.to_name;
			}

			// 从好友列表中获取昵称和头像
			var user = this.getFriend(msg.uid);
			if (user) {
				msg.uname = user.uname;
				msg.status = user.status;
				msg.icon = user.icon;
			}
			if (!msg.icon) {
				msg.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
			}

			// 派发
			this.innerTrigger(E.ON_ACCEPT_MESSAGE, msg);

			// 有新消息，播放提示音
			if (this.imChatbox.voiceEnabled) {
				if (this.soundControl != null) {
					this.soundControl.play();
				}
			}

			if (!msg.isSelf) {
				this.innerTrigger(E.HAS_MESSAGE, msg);
			}
		},

		/**
		 * 设置离线消息
		 */
		setOfflineMessage : function(data) {
			for ( var i = 0; i < data.length; i++) {
				var user = data[i];
				var obj = {
					uid : user.from,
					uname : user.from_name,
					count : parseInt(user.msg_status)
				};
				this.innerTrigger(E.ADD_CHAT_USER, obj);
				this.innerTrigger(E.HAS_MESSAGE, obj);
			}
		},
		/**
		 * 获取与某用户的聊天记录 data:Message:Array
		 */
		setUserMessage : function(data) {
			var chats = data.result_message;
			var user = {
				messages : []
			};
			if (chats.length > 0) {
				user.uid = chats[0].from;
				user.uname = chats[0].from_name;
				if (this.userInfo.uid == user.uid) {
					user.uid = chats[0].to;
					user.uname = chats[0].to_name;
				}
				var arr = new Array();
				for ( var i = 0; i < chats.length; i++) {
					var m = chats[i];
					var msg = {
						isSelf : (m.from == this.userInfo.uid),
						// uid:user.uid,
						// uname:user.uname,
						uid : m.from,
						uname : m.from_name,
						date : m.chat_date,
						time : m.chat_time,
						content : m.msg,
						msg_status : m.msg_status
					};
					arr.push(msg);
				}
				user.messages = arr;
			}

			// 分页信息，服务器端放到了user_id字段下
			var str = data.user_id;
			var arr = str.split(",");

			user.start = parseInt(arr[0]);
			user.size = parseInt(arr[1]);
			user.max = parseInt(arr[2]);
			user.count = parseInt((user.max - 1) / user.size + 1);

			if (user.size == 30) {
				this.innerTrigger(E.ADD_MULMESSAGE, user);
			} else {
				this.innerTrigger(E.ADD_HISTORYMESSAGE, user);
			}
		},
		/**
		 * 设置用户在其他页面所做的操作信息
		 * 
		 * @param data
		 */
		setControl : function(data) {
			var i = data.indexOf(",");
			var str = data.substr(i + 1);
			var obj = $.parseJSON(str);
			this.imList.setViewStatus(obj.list);
			this.imChatbox.setViewStatus(obj.box);
			this.imBar.setViewStatus(obj.bar);
		},
		/**
		 * 打开与一个用户的聊天窗口
		 */
		setOpenChatBox : function(data) {
			if (this.isService(data.user_skill) && data.type) {// 在线客服
				var obj = {
					name : data.user_name,
					type : data.type,
					value : data.user_id
				};
				this.getService(obj);
			} else {
				this.innerTrigger(E.OPEN_CHATBOX, {
					uid : data.user_id,
					uname : data.user_name,
					skill : data.user_skill,
					status : data.status,
					type : data.user_type,
					itemId: data.itemId,
					vendId: data.vendId
				});
			}
		},
		
		//设置侧边栏内容
		setSideBar: function(data){
			var uid = data.result_status[0].user_id;
			var id = "baseInfo_" + uid;
			var orderId = "orderInfo_" + uid;
			
			if(document.getElementById(id)){
				$("#" + id).empty();
			} else {
				$("#sidebar_baseInfo").append('<div id="' + id + '"></div>');
			}
			
			if(document.getElementById(orderId)){
				$("#" + orderId).empty();
			} else {
				$("#sidebar_orderInfo").append('<div id="' + orderId + '"></div>');
			}
			
			//对方信息
			if(data.personInfo){
				
				data.personInfo.userId = data.personInfo.userId.replace("_0_", ":");
				data.personInfo.userId = data.personInfo.userId.replace("_at_","@");
				data.personInfo.userId =data.personInfo.userId.replace("_dt_",".");
				
				//个人信息
				var userType = "";
				var skill = data.personInfo.userSkill;
				if(skill == 1){
					if(data.personInfo.userName == properties.webim_visitor){
						userType = properties.webim_visitor;
					} else {
						userType = properties.webim_buyers;
					}
				} else if(skill == 2){
					userType = properties.webim_customer_service;
				}
				
				var t = '<div class="marginT10">'
					+ '<p class="marginT5">'+properties.webim_account_number+'：' + data.personInfo.userId + '</p>'
					+ '<p class="marginT5">'+properties.webim_nickname+'：' + data.personInfo.userName + '</p>'
					+ '<p class="marginT5">'+properties.webim_type+'：' + userType  + '</p>'
					+ '</div>';
				$("#" + id).append(t);
			} else if(data.vendInfo){
				var postStr = data.vendInfo.POST_NUM;
				if(postStr==undefined || postStr ==null || postStr=="null"){
					postStr = "";
				}
				//店铺信息
				var t = '<div class="marginT10">'
					+ '<p class="marginT5">'+properties.webim_company_name+'：' + data.vendInfo.COM_NAME + '</p>'
					+ '<p class="marginT5">'+properties.webim_scopeof_business+'：' + data.vendInfo.MAIN_ITEM + '</p>'
					+ '<p class="marginT5">'+properties.webim_address+'：' + data.vendInfo.ADDR + '</p>'
					+ '<p class="marginT5">'+properties.webim_zipcode+'：' + postStr + '</p>'
					+ '<p class="marginT5">'+properties.webim_telephone+'：' + data.vendInfo.COM_TEL + '</p>'
					+ '</div>';
				$("#" + id).append(t);
			} else if(data.activeInfo && data.activeInfo.length > 0){
				//商城促销活动信息
				var t = '<div class="marginT10">';
				for(var i = 0; i < data.activeInfo.length; i++){
					t += '<p class="marginT5"><a href="/ecweb/' + data.activeInfo[i].COM_NAME + '/notice/showNoticeInfo.htm?NOTICE_ID=' + data.activeInfo[i].NOTICE_ID + '" target="_blank">' + data.activeInfo[i].NOTICE_TITLE + '</a></p>';
				}
				t += '</div>';
				$("#" + id).append(t);
			}
			
			//商品信息
			if(data.itemInfo){
				var t = '<div class="marginT20">';
					if(Channel_CONFIG.rc_url.indexOf("DocCenterService")>-1){
						t = t + '<p align="center"><img src="/DocCenterService/' + data.itemInfo.IMG_URL + '&photo_size=150"/></p>';
					}else{
						t = t + '<p align="center"><img src="' +getResCutPath(data.itemInfo.IMG_URL,'150x150')+'"/></p>';
					}
					
					t = t + '<p>' + data.itemInfo.ITEM_TITLE + '</p>'
					+ '<p align="center"><font color="990000">' + data.itemInfo.PRICE + '</font>&nbsp;'+properties.webim_unit+'</p>'
					+ '</div>';
				$("#" + id).append(t);
			}
			
			//订单信息
			if(data.orderInfo && data.orderInfo.length > 0){
				for(var i = 0; i < data.orderInfo.length; i++){
					var photoid=data.orderInfo[i].IMG_URL;
					if (photoid == null || photoid == undefined) {
						photoid = "image?photo_id=-1";
					}
					var t = '<div class="marginT5">';
						if(Channel_CONFIG.rc_url.indexOf("DocCenterService")>-1){
							t = t + '<p align="center"><img src="/DocCenterService/' + photoid + '&photo_size=150"/></p>';
						}else{
							t = t + '<p align="center"><img src="' +getResCutPath(photoid,'150x150')+'"/></p>';
						}
						
						t = t + '<p>'+properties.webim_order_number+'：' + data.orderInfo[i].CO_NUM + '</p>'
						+ '<p>'+properties.webim_order_time+'：' + data.orderInfo[i].CRT_TIME + '</p>'
						+ '<P>'+properties.webim_order_money+'：<font color="990000">' + data.orderInfo[i].AMT_SUM + '</font> '+properties.webim_unit+'</P>'
						+ '</div>';
					$("#" + orderId).append(t);
				}
			}
		},
		
		//切换默认侧边栏用户
		changeSideBar : function(uid) {
			$("#sidebar_baseInfo").children().each(function(){
				if(this.id == "baseInfo_" + uid){
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			$("#sidebar_orderInfo").children().each(function(){
				if(this.id == "orderInfo_" + uid){
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		},
		
		//自定义侧边栏
		setSideBarNew : function(uid) {
			uid = Channel.uidDecode(uid);
			var custom_siderbar = '<iframe style="border:0px; width:282px; height:462px;" src="' + WEB_IM_CONFIG.sideBar_url + '?userId=' + uid + '"></iframe>';
			$('#im_sidebar_container').html(custom_siderbar);
		},
		
		setServiceStatus : function(list) {
			for ( var i = 0; i < list.length; i++) {
				var data = list[i];
				var type = data.user_type.split("_id");
				type = type[0];
				this.innerTrigger(E.SET_SERVICE_STATUS, {
					type : type,
					value : data.ext,
					status : data.user_id ? "1" : "3"
				});
			}
		},

		/**
		 * 向服务器发送当前用户状态
		 * 
		 * @param data
		 */
		sendUserStatus : function(data) {
			this.trigger("sendstatus", data);
		},

		/**
		 * 向服务器发送与其他用户的聊天消息
		 * 
		 * @param data
		 */
		sendMessage : function(data) {
			var obj = {
				to : data.user.uid,
				to_name : data.user.uname,
				msg : data.content
			};
			this.trigger("sendmessage", obj);
		},

		/**
		 * 向服务器发送操作信息
		 * 
		 * @param data
		 */
		sendControl : function() {
			var $this = this;
			if ($this.statusTimer) {
				clearTimeout($this.statusTimer);
			}
			$this.statusTimer = setTimeout(function() {
				var c = new Object();
				c.list = $this.imList.getViewStatus();
				c.box = $this.imChatbox.getViewStatus();
				c.bar = $this.imBar.getViewStatus();
				var str = $.jsonStringify(c);
				var cu = "";
				if ($this.imChatbox.currentUser) {
					cu += $this.imChatbox.currentUser.uid;
				}
				cu += "," + str;
				$this.trigger("sendcontrol", {
					ext : cu
				});
			}, 50);
		},

		pushMessage : function(data) {
			// alert("接收到推送消息：" + data.msg);
			this.imSysMsg.addSystemMessage(data);
		},

		getService : function(obj) {
			this.trigger("onservice", obj);
		},
		sendCloseService : function(sid, score) {
			this.trigger("closeservice", {
				sid : sid,
				score : score
			});
		},
		sendServiceAppraise : function(uid) {
			if (this.isConnected) {
				this.trigger("appraiseservice", {
					uid : uid
				});
				showAlert(L.serviceSendLabel);
			}
		},

		checkService : function() {
			this.trigger("checkservice", {
				list : this.getServiceList()
			});
		},

		/**
		 * 从用户数据中心获取用户基本信息
		 */
		getUserInfo : function(trigger_event) {
			try {
				var $this = this;

				getCurrentUserInfo(function(data) {
					$this.userInfo = data;
					$this.getFriendsInfo(trigger_event);
				});
			} catch (e) {
				// alert("获取当前用户信息失败"+e);
			}
		},
		/**
		 * 获取好友数据
		 */
		getFriendsInfo : function(trigger_event) {
			var $this = this;
			try {
				var data = {
					type : "2900",
					user_id : $this.userInfo.uid
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
						alert("err:" + textStatus + ",readyState:" + XMLHttpRequest.readyState + ",errorThrown" + errorThrown);
					},
					success : function(data) {
						if (!data) {
							return;
						}

						if (typeof (data) === "string") {
							data = JSON.parse(data);
						}

						if (!data.friends) {
							$this.friends = [];
						} else {
							for(var i = 0; i < data.friends.length; i++){
								var friend = data.friends[i];
								if (friend.id == "-1" && friend.gname == "默认") {
									friend.gname = properties.webim_default_group;
									break;
								}
							}
							$this.friends = data.friends;
						}

						// 设置分组
						if (!data.groups) {
							$this.groups = [];
						} else {
							$this.groups = data.groups;
						}

						// 设置用户技能
						$this.userInfo.skill = $this.getUserSkill($this.userInfo.skill);

						if ($this.session && WEB_IM_CONFIG.useUserId) {
							$this.userInfo.weibo_uid = '' + $this.userInfo.uid;
							$this.userInfo.uid = $this.userInfo.userId;
							if (!$this.userInfo.uid && $this.session) {
								$this.userInfo.uid = $this.session.userId;
							}
						}

						$this.userInfo.userId = '' + $this.userInfo.userId;
						$this.userInfo.uid = '' + $this.userInfo.uid;
						$this.userInfo.user_type = '' + $this.userInfo.user_type;

						// 应用id，默认是1(0:icity;1:新商盟)
						if (!$this.userInfo.app_id) {
							$this.userInfo.app_id = "ecweb";
						}
						$this.userInfo.app_id = $this.userInfo.app_id;

						// 获取小头像
						if ($this.userInfo.figure) {
							$this.userInfo.icon = $this.userInfo.figure.small;
						}

						// 如果无头像则设置默认头像
						if (!$this.userInfo.icon || $this.userInfo.icon == "") {
							$this.userInfo.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
						}

						if ($this.friends) {
							for ( var i = 0; i < $this.friends.length; i++) {
								var g = $this.friends[i];
								if (g.gmember) {
									for ( var j = 0; j < g.gmember.length; j++) {
										var u = g.gmember[j];
										if (u.figure) {
											u.icon = u.figure.small;
										}
										if (!u.icon || u.icon == "") {
											u.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
										} else {
											u.icon += "&photo_size=30";
										}

										if ($this.session && WEB_IM_CONFIG.useUserId) {
											u.weibo_uid = '' + u.uid;
											if (u.userId) {
												u.uid = u.userId;
											}
										}

										u.uid = '' + u.uid;
										u.userId = '' + u.userId;
										u.tag = g.type;
									}
								} else {
									g.gmember = [];
								}
							}
						}

						$this.trigger(trigger_event);
					}
				});

			} catch (e) {
				alert(properties.webim_getfriends_failure + e);
			}
		},

		testGetFriendsInfo : function(trigger_event) {
			var $this = this;
			var flag = WEB_IM_CONFIG.isCustomer;

			if (flag == "3") {
				// var jsonURL = WEB_IM_CONFIG.project_address + "js/userinfo1.json";
				var jsonURL = WEB_IM_CONFIG.project_address + "../test/friendsinfo2.json";
			} else if (flag == "0") {
				// var jsonURL = WEB_IM_CONFIG.project_address + "js/userinfo.json";
				var jsonURL = WEB_IM_CONFIG.project_address + "../test/friendsinfo3.json";
			} else if (flag == "4") {
				var jsonURL = "friendsinfo4.json";
			} else {
				// var jsonURL = WEB_IM_CONFIG.project_address + "js/userinfo.json";
				var jsonURL = WEB_IM_CONFIG.project_address + "../test/friendsinfo1.json";
			}

			try {
				$.ajax({
					url : jsonURL,
					dataType : "json",
					type : "get",
					error : function(data) {
						// alert("userinfo.json加载失败!");
					},
					success : function(data) {
						if (!data) {
							alert(properties.webim_notget_user);
							return;
						}
						// alert("加载成功！");
						if (typeof (data) === "string") {
							data = JSON.parse(data);
						}
						// $this.userInfo = data.userinfo;

						if (!data.friends) {
							$this.friends = [];
						} else {
							$this.friends = data.friends;
						}

						// 设置分组
						if (!data.groups) {
							$this.groups = [];
						} else {
							$this.groups = data.groups;
						}

						// 设置用户技能
						$this.userInfo.skill = $this.getUserSkill($this.userInfo.skill);

						if ($this.session && WEB_IM_CONFIG.useUserId) {
							$this.userInfo.weibo_uid = '' + $this.userInfo.uid;
							$this.userInfo.uid = $this.userInfo.userId;
							if (!$this.userInfo.uid && $this.session) {
								$this.userInfo.uid = $this.session.userId;
							}
						}

						$this.userInfo.userId = '' + $this.userInfo.userId;
						$this.userInfo.uid = '' + $this.userInfo.uid;
						$this.userInfo.user_type = '' + $this.userInfo.user_type;
						if (!$this.userInfo.app_id)
							$this.userInfo.app_id = "iop";
						$this.userInfo.app_id = '' + $this.userInfo.app_id;

						if ($this.userInfo.figure) {
							$this.userInfo.icon = $this.userInfo.figure.small;
						}
						// 如果无头像则设置默认头像
						if (!$this.userInfo.icon || $this.userInfo.icon == "") {
							$this.userInfo.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
						}
						if ($this.friends) {
							for ( var i = 0; i < $this.friends.length; i++) {
								var g = $this.friends[i];
								if (g.gmember) {
									for ( var j = 0; j < g.gmember.length; j++) {
										var u = g.gmember[j];
										if (u.figure) {
											u.icon = u.figure.small;
										}
										if (!u.icon || u.icon == "") {
											u.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
										}

										if ($this.session && WEB_IM_CONFIG.useUserId) {
											u.weibo_uid = '' + u.uid;
											if (u.userId) {
												u.uid = u.userId;
											}
										}

										u.uid = '' + u.uid;
										u.userId = '' + u.userId;
										u.tag = g.type;
									}
								} else {
									g.gmember = [];
								}
							}
						}

						$this.trigger(trigger_event);
					}
				});
			} catch (e) {
				// alert("获取好友信息失败"+e);
			}

		},

		/**
		 * 测试专用---从用户数据中心获取用户基本信息
		 */
		testGetUserInfo : function(trigger_event) {

			var $this = this;

			getCurrentUserInfo(function(data) {
				$this.userInfo = data;
				$this.testGetFriendsInfo(trigger_event);
			});
		},

		/**
		 * 计算用户的skill值，新商盟传的是true，icity传的是1、2、3。为了统一，将true设置为2，默认为1
		 */
		getUserSkill : function(skill) {
			if (skill == "1")
				return "1";
			if (skill == "2")
				return "2";
			if (skill == "3")
				return "3";
			if (skill)
				return "2";
			return "1";
		},

		/**
		 * 判断用户是否是客服
		 */
		isService : function(skill) {
			if (skill == "2") {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 设置默认skill
		 */
		getDefaultSkill : function(skill) {
			if (!skill || (skill == "undefined") || (skill.length == 0)) {
				return "1";
			}
			return skill;
		},

		getFriendsID : function() {
			var str = "";
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				var l = g.gmember.length;
				for ( var j = 0; j < l; j++) {
					var f = g.gmember[j];
					if (!this.isRobot(f.skill)) {
						if (f.uid) {
							str += f.uid + ",";
						}
					}
				}
			}
			if (str)
				return str.substring(0, str.length - 1);
			return "";
		},

		getServiceList : function() {
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				if (g.type == "service") {
					return g.gmember;
				}
			}
		},

		/** *******************************机器人相关***************************** */
		/**
		 * 判断用户是否是机器人
		 */
		isRobot : function(skill) {
			if (skill == "3") {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 打开与机器人聊天对话框
		 */
		openRobotBox : function(user) {
			var robot = this.robotMap.get(user.uid);
			if (!robot) {
				robot = new Robot();
				robot.openBox(user);
				this.robotMap.put(user.uid, robot);
			}
		},

		// 收到机器人推送来的聊天答案
		pushRobotMessage : function(data) {
			var robot = this.robotMap.get(data.from);
			if (robot)
				robot.pushRobotMessage(data);
		},

		// 收到机器人推送来的热门问题
		pushHotMessage : function(data) {
			var robot = this.robotMap.get(data.user_id);
			if (robot)
				robot.pushHotMessage(data);
		},

		// 收到机器人推送来的相关问题
		pushAboutMessage : function(data) {
			var robot = this.robotMap.get(data.user_id);
			if (robot)
				robot.pushAboutMessage(data);
		},

		/** ************************************************************ */
		on : function(eventName, func, scope) {
			if (this.eventDispatcher && this.eventDispatcher.on) {
				this.eventDispatcher.on.apply(this.eventDispatcher, arguments);
			}
		},
		off : function(eventName, func, scope) {
			if (this.eventDispatcher && this.eventDispatcher.off) {
				this.eventDispatcher.off.apply(this.eventDispatcher, arguments);
			}
		},
		trigger : function(eventName, args) {
			if (this.eventDispatcher && this.eventDispatcher.trigger) {
				this.eventDispatcher.trigger.apply(this.eventDispatcher, arguments);
			}
		}
	};

})(jQuery);

var _globalWebIM = null;
WebIM.newInstance = function() {
	if (_globalWebIM == null)
		_globalWebIM = new WebIM();
	return _globalWebIM;
};
WebIM.getInstance = function() {
	return _globalWebIM;
};