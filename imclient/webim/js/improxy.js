/**
 * 用户界面逻辑代理代码
 * 
 */
function createWebIM(callback) {
	var webim = WebIM.newInstance();

	var serviceInfo = null;

	var get_userinfo_success = false;// 获取用户基本信息成功
	var socket_connec_success = false;// 连接socket服务器成功

	// ---------------------监听socket服务-------------------------
	// 有用户退出
	receiveLogout(function(data) {
		webim.setUserStatus({
			uid : data.user_id,
			uname : data.user_name,
			status : 3
		});
	});

	// 单个用户聊天消息
	receiveChatMsg(function(data) {
		if (!data.self_send) {
			webim.setMessage(data);
		}
	});

	// 获取用户好友状态，获取状态的同时获取最近联系人
	receiveFriendsStatus(function(data) {
		// 所有在线的好友
		webim.setOnlines(data.result_status);
		// 最近联系人
		getRecentContact();
	});

	// 消息中心推送的命令
	WebIMPushMsg(function(data) {
		data.msg = data.content;
		webim.pushMessage(data);
	});

	// 有用户修改在线状态
	receiveChangeRedisStatus(function(data) {
		var self = data;
		if (webim.userInfo.uid == self.user_id) {
			if (!data.self_send) {
				if (data.ext) {
					webim.setControl(data.ext);
				} else {
					webim.setUserStatus({
						uid : data.user_id,
						uname : data.user_name,
						status : data.status
					});
				}
			}
		} else {
			webim.setUserStatus({
				uid : data.user_id,
				uname : data.user_name,
				status : data.status
			});
		}

		webim.checkService();
	});

	// 获取在线客服
	receiveGetOnlineCustomerService(function(data) {
		if (data.result_status && data.result_status.length > 0) {
			var user = data.result_status[0];
			if (user && serviceInfo)
				user.user_name = serviceInfo.name;
			serviceInfo = null;
			webim.setOpenChatBox(user);
		} else {
			showAlert(L.noneServiceLabel);
		}
	});

	// 获取所有的在线客服
	receiveGetAllOnlineCustomerService(function(data) {
		if (data.result_status && data.result_status.length > 0) {
			webim.setServiceStatus(data.result_status);
		}
	});

	// 自定义监听事件
	getImclient(function(imclient) {
		imclient.on('2502', function(e, data) {
			webim.imChatbox.showPingView(data.user_id, E.DO_NOT_CONTROL);
		});
	});

	// ---------------------发起和监听rest服务-------------------------
	var dataType = WEB_IM_CONFIG.ajaxDataType;
	var jsonp = WEB_IM_CONFIG.ajaxJsonp;

	// 公用的ajax方法
	function ajaxForIm(url, callback, data) {
		$.ajax({
			url : url,
			data : data,
			dataType : dataType,
			jsonp : jsonp,
			type : "post",
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// alert("err:"+textStatus+",readyState:"+XMLHttpRequest.readyState+",errorThrown"+errorThrown);
			},
			success : function(data) {
				if (typeof (eval(callback)) == "function") {
					callback(data);
				}
			}
		});
	}

	// 获取最近联系人
	function getRecentContact() {
		var data = {
			type : "2300",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			page_start : "0",
			page_size : "20"
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getRecentContactCallback, {
					data : JSON.stringify(data)
				});
	}

	function getRecentContactCallback(data) {
		webim.setNearFriends(data);
	}

	// 获取未读消息数
	function getUnreadMsgCount() {
		var data = {
			type : "2401",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getUnreadMsgCountCallback, {
					data : JSON.stringify(data)
				});
	}

	function getUnreadMsgCountCallback(data) {
		webim.setOfflineMessage(data);
	}

	// 获取聊天记录
	function getChatRecord(data) {
		var data = {
			type : "2402",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : {
				to_id : data.uid,
				start : "" + data.start,
				size : "" + data.size
			}
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate", getChatRecordCallback, {
			data : JSON.stringify(data)
		});
	}

	function getChatRecordCallback(data) {
		if (data.result_message) {
			webim.setUserMessage(data);
		}
	}

	// 获取在线客服
	function getOnlineService(data) {
		var data = {
			type : "2500",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			user_name: webim.userInfo.uname,
			query_ext : data
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getOnlineServiceCallback, {
					data : JSON.stringify(data)
				});
	}

	function getOnlineServiceCallback(data) {
		if (data.result_status && data.result_status.length > 0) {
			var user = data.result_status[0];
			if (user && serviceInfo)
				user.user_name = serviceInfo.name;
			serviceInfo = null;
			user.itemId = WEB_IM_CONFIG.itemId;
			user.vendId = WEB_IM_CONFIG.vendId;
			webim.setOpenChatBox(user);
		} else {
			showAlert(L.noneServiceLabel);
		}
	}

	// 结束聊天
	function endChat(data) {
		var data = {
			type : "2501",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : {
				serviceId : data.sid,
				score : data.score
			}
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate", "", {
			data : JSON.stringify(data)
		});
	}

	// 获取所有在线客服
	function getALLOnlineService(data) {
		var data = {
			type : "2503",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : data
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getALLOnlineServiceCallback, {
					data : JSON.stringify(data)
				});
	}

	function getALLOnlineServiceCallback(data) {
		webim.setServiceStatus(data);
	}

	// 客服用户申请打分，普通用户收到打分界面
	function CallScore(data) {
		var data = {
			type : "2502",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : data
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate", "", {
			data : JSON.stringify(data)
		});
	}

	// 如果是更新扩展信息，判断是否是更新扩展信息的最近联系人，如果是，更新数据库中的消息为已读
	function getChangeStatus(data) {
		var data = {
			type : "0200",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			ext : data.ext
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "changeStatus", "", {
			data : JSON.stringify(data)
		});
	}

	// 保存聊天记录
	function saveChatRecord(data) {
		var data = {
			type : "1101",
			app_id : webim.userInfo.app_id,
			from : webim.userInfo.uid,
			to : data.to,
			from_name : webim.userInfo.uname,
			to_name : data.to_name,
			msg : data.msg
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendMessage", "", {
			data : JSON.stringify(data)
		});
	}

	// 保存最近联系人
	function saveOrUpdateRecentContact(data) {
		var data = {
			type : "1102",
			app_id : webim.userInfo.app_id,
			from : webim.userInfo.uid,
			to : data.to,
			from_name : webim.userInfo.uname,
			to_name : data.to_name,
			msg : data.msg
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendMessage", "", {
			data : JSON.stringify(data)
		});
	}

	// //收到推送的消息，显示在左下角聊天框
	// imclient.on('3100', function(e, data) {
	// webim.pushMessage(data);
	// });
	//		
	// //收到推送的消息，不显示在聊天框，纯命令
	// imclient.on('3200', function(e, data) {
	// XSM3.swfMain.receiveMsg(data);
	// });
	//		   

	/**
	 * 监听初始化用户基本信息完毕，获取成功之后登陆聊天服务器 回调函数中返回用户基本信息数据
	 * 
	 * @param function:登陆聊天服务器
	 */
	webim.on(E.INIT_USER_INFO, function(e, data) {
		get_userinfo_success = true;
		getInfoFromInit(initIm);
	});

	var initIm = function(data) {
		webim.isConnected = true;
		var self = data;
		if (!webim || !webim.userInfo || !self)
			return;
		if (webim.userInfo.uid == self.user_id) {// 自己登陆，显示聊天框

			if (self.self_send) {

				webim.initView();
				IM.webim = webim;
				if (self.ext) {
					webim.setControl(self.ext);
				}
				webim.setUserStatus({
					uid : self.user_id,
					uname : self.user_name,
					status : self.status
				});

				var str = webim.getFriendsID();

				// 获取好友在线状态
				sendFriendsStatus(str);

				// 获取未读消息的记录数
				getUnreadMsgCount();

				// 检查客服是否在线
				webim.checkService();

				// 回调
				callback({
					code : 1,
					webim : webim,
					func : getOnlineService
				});
			}
		} else {
			webim.setUserStatus({
				uid : self.user_id,
				uname : self.user_name,
				status : self.status
			});
		}
	};

	/**
	 * 监听获取用户信息，获取后初始化好友状态
	 */
	webim.on(E.GET_USER_INFO, function(e, data) {
		webim.setFriends(webim.friends);// 好友列表
		webim.setGroups(webim.groups);// 群组列表
		sendFriendsStatus(webim.getFriendsID());// 获取好友在线状态
		webim.checkService();// 检查客服是否在线
	});

	// 发送窗口状态
	webim.on("sendcontrol", function(e, data) {
		data.eventName = "sendcontrol";
		sendChangeRedisStatus(data);

		var ext = data.ext;
		if (ext) {
			var tempExt = ext.split(",");
			if (tempExt[0] && tempExt[0] == webim.imChatbox.currentUser.uid) {
				getChangeStatus(data);
			}
		}

	});

	// 发送用户在线状态
	webim.on("sendstatus", function(e, data) {
		data.eventName = "sendstatus";
		sendChangeRedisStatus(data);
	});

	// 获取与某个用户的聊天记录
	webim.on("getchatinfo", function(e, data) {
		getChatRecord(data);
	});

	// 最近联系人
	webim.on("getNearFriendsEvent", function(e, data) {
		getRecentContact();
	});

	webim.on("onservice", function(e, data) {
		var extinfo = new Object();
		var type = data.type;

		if (type == "mfr")
			type = "com";
		if (type)
			extinfo.ext_type = type + "_id";
		if (data.value)
			extinfo.ext_value = data.value;

		extinfo.user_skill = '2';
		extinfo.user_status = '1';

		serviceInfo = data;

		// 获取在线客服
		sendGetOnlineCustomerService(extinfo);
	});
	webim.on("closeservice", function(e, data) {
		// 关闭在线客服
		endChat(data);
	});
	webim.on("appraiseservice", function(e, data) {
		// 客服发送评价提示
		CallScore({
			customer : data.uid
		});
	});
	webim.on("checkservice", function(e, data) {
		var extinfo = new Object();
		extinfo.ext_type = "";
		extinfo.ext_value = "";

		if (!data.list)
			return;

		var list = data.list;
		for ( var i = 0; i < list.length; i++) {
			var user = list[i];
			if (webim.isService(user.skill)) {
				var type = user.type;
				if (type == "mfr")
					type = "com";
				extinfo.ext_type += type + "_id";
				extinfo.ext_value += user.uid;
				if (i != list.length - 1) {
					extinfo.ext_type += ",";
					extinfo.ext_value += ",";
				}
			}
		}

		extinfo.user_skill = '2';
		extinfo.user_status = '1';

		// 获取在线客服
		sendGetAllOnlineCustomerService(extinfo);
	});

	// 发送普通私聊消息
	webim.on("sendmessage", function(e, data) {
		// 保存聊天记录
		saveChatRecord(data);
		// 保存最近联系人
		saveOrUpdateRecentContact(data);
	});
}

/**
 * 打开一个聊天窗口
 * 
 * @param data
 *            {user_id, user_name, user_skill, status, user_type}
 */
function webim_openChatBox(data) {
	var webim = WebIM.getInstance();
	if (webim) {
		webim.setOpenChatBox(data);
	}
}

/**
 * 接受flash发出的命令
 * 
 * @param data
 */
function webim_sendCommand(data) {
	var webim = WebIM.getInstance();
	if (webim) {
		switch (data.type) {
		case "push":
			webim.pushMessage(data);
			break;
		}
	}
}