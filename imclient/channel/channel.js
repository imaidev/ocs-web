//通道对象，被外部调用
var Channel = {
    isReady : false,// 是否创建完毕
    imclient : IMClient.newInstance(),// 长连接对象
    currentUser:{},  //当前用户
    infoFromlogin:{},//注册成功,服务器返回的信息，包括当前用户信息和在线状态

    
    on : function(eventName, func, scope) {
        if (!this.eventDispatcher)
            this.eventDispatcher = $(this);
        this.eventDispatcher.on.apply(this.eventDispatcher, arguments);
    },  
    trigger : function(eventName, args) {
        if (!this.eventDispatcher)
            this.eventDispatcher = $(this);
        this.eventDispatcher.trigger.apply(this.eventDispatcher, arguments);
    },
    
    init:function(){
    	//获取服务器地址以及个性化配置
    	Channel.loadServerInfo();
    	
    	/**
         * 连接聊天服务器成功，重置全局变量，进行登录
         */
    	Channel.imclient.on('connected', function(e){
    	   Channel.imclient.changeStatus(Channel.imclient.newStatus('0000', null, ''));
        });
       
       /**
        * 连接聊天服务器失败，重置全局变量，设为离线
        */
    	Channel.imclient.on('connect_error',function(e){
        //   alert(properties.channel_connect_fail+":"+e);
       });
    	
    	
    	Channel.imclient.on("0000",function(e,data){
    		Channel.isReady = true;	
    		Channel.infoFromlogin = data;
    		Channel.trigger("webim_connect_success");
    	});
    	
    },
	
	//获取服务器地址以及个性化配置
	loadServerInfo:function(){
		if(Channel_CONFIG.getServer_url){ 
			Channel.ajax(Channel_CONFIG.getServer_url,Channel.loadUserInfo);
		}
	},
	
	//加载当前用户信息
	loadUserInfo:function(data){
        if(data){
        	//服务器数据
        	var server = data.server;
        	Channel_CONFIG.server_ip = server.server_ip;
        	Channel_CONFIG.server_port = server.server_port;
        	Channel_CONFIG.userInfo_url = server.userinfo_url;
        	Channel_CONFIG.rc_url = server.rc_url;
        	
        	if(Channel_CONFIG.userInfo_url){
        		Channel.ajax(Channel_CONFIG.userInfo_url,function(data){   
        		//	alert( JSON.stringify(data));

        			//重置用户扩展信息
					var extinfo = {};
					if (data.extinfo) {
						for (var i = 0; i < data.extinfo.length; i++) {
							var obj = data.extinfo[i];
							// 判断是否为空，并且防止map中出现value为数字的情况。
							if (obj != null) {
								if (obj.value != null && obj.value != "")
									extinfo[obj.type + "_id"] = obj.value
											+ "";
								if (obj.name != null && obj.name != "")
									extinfo[obj.type + "_name"] = obj.name
											+ "";
							}

						}
					}
					
					data.userinfo.extinfo = extinfo;
					
					//替换userId中的冒号为分号
					data.userinfo.uid = data.userinfo.uid.replace(/\:/g, "_0_");
					data.userinfo.userId = data.userinfo.userId.replace(/\:/g, "_0_");
					data.userinfo.uid = data.userinfo.uid.replace(/\@/g, "_at_");
					data.userinfo.userId = data.userinfo.userId.replace(/\@/g, "_at_");
					data.userinfo.uid = data.userinfo.uid.replace(/\./g, "_dt_");
					data.userinfo.userId = data.userinfo.userId.replace(/\./g, "_dt_");
					
					var index = data.userinfo.uname.indexOf('@');
					if(index > -1){
						data.userinfo.uname = data.userinfo.uname.substring(0, index);
					}
					
        			//设置当前用户
					Channel.currentUser= data.userinfo;
        			// 重置用户数据
        			Channel.resetUserInfo(data.userinfo);
        	    	//连接通道服务器
        	    	Channel.imclient.init();
        		});
    		}
        }
	},
	
	/**
	 * 对uid进行特殊字符编码
	 */
	uidEncode:function(uid){
		return uid.replace(/\:/g, "_0_").replace(/\@/g, "_at_").replace(/\./g, "_dt_");
	},
	
	/**
	 * 还原uid中的特殊字符
	 */
	uidDecode:function(uid){
		return uid.replace(/_0_/g, ":").replace(/_at_/g, "@").replace(/_dt_/g, ".");
	},
	
    /**
     * 重置用户数据
     */
    resetUserInfo:function(data){
    	Channel.imclient.user_status.user_id = data.uid;
    	Channel.imclient.user_status.user_name = data.uname;
    	Channel.imclient.user_status.user_type = data.user_type;
    	Channel.imclient.user_status.user_skill = data.skill;
    	Channel.imclient.user_status.user_ext = data.extinfo;
    	if(!data.app_id){
    		data.app_id = "iop";
    	}
    	Channel.imclient.user_status.app_id = data.app_id;
    },
	
    //格式化推送过来的消息
	parseIMMsgData:function(data){
		if (data && data.msg){
	        var msg = data.msg;
	        if(typeof(msg) === "string") {
	            msg = JSON.parse(msg);
	        }else{
	            msg = eval("(" + msg + ")");
	        }
	        if(msg.content){
	            return msg;
	        }
	    }
	    return null;
	},
    
    
	//公用的ajax方法
	ajaxJsonp:function(url,callback,data){
		$.ajax({
            url:url,
            data:data,
            dataType: "jsonp",
            jsonp: "jsonp",
            type: "post",
			jsonpCallback:"jsonpCallback",
            error:function(data){
            	alert("err:"+url + " data:" + JSON.stringify(data));
            	
            },
            success: function(data) {
	          	 if (typeof(eval(callback)) == "function") {
	               	callback(data);
	         	 }
            }
        });
	},
	
	//公用的ajax方法
	ajax:function(url,callback,data){
		$.ajax({
            url:url,
            data:data,
            dataType: "json",
            jsonp: "json",
            type: "post",
            error:function(data){
			//	alert("err:"+url + " data:" + JSON.stringify(data));
				if(data != null && data.responseText != null && data.responseText.indexOf("needLogin") != -1) {
					if(WEB_IM_CONFIG.nologin_enable && confirm(properties.channel_not_loggedin)){ //允许游客使用在线客服
						//组织游客身份信息
						var nologinCookie = Channel.getIMCookie();
						callback({
							"userinfo":{
								"uid": nologinCookie,
								"userId": nologinCookie,
								"uname": properties.channel_visitor,
								"skill": "1",
								"icon": "",
								"typeId": ""
							}
						});
					} else { //跳转到登录页面
						window.location = WEB_IM_CONFIG.login_url;
					}
				}
            },
            success: function(data) {
	          	 if (typeof(eval(callback)) == "function") {
	               	callback(data);
	         	 }
            }
        });
	},
	
	//未登录用户写入cookie以作标识，返回已存在的cookie，否则创建新的cookie
	getIMCookie: function(){
		var cookies = document.cookie.split(";");
		var cookieName = "im_nologin";
		for(var i = 0; i < cookies.length; i++){
			var arr = cookies[i].split("=");
			if(arr[0] == cookieName){
				return arr[1];
			}
		}
		var cookieValue = "im_" + new Date().valueOf() + Channel.getRandom(5);
		document.cookie = cookieName + "=" + cookieValue;
		return cookieValue;
	},
	
	getRandom: function(n){
		var str = "abcdefghijklmnopqrstuvwxyz";
		var res = "";
		for(var i = 0; i < n; i++){
			var j = Math.floor(Math.random() * str.length);
			res += str.charAt(j);
		}
		return res;
	},
	
/** ***************************************************调用socket发送的方法******************************************************* */    
   //接收推送消息
    receiveMsg:function(callback){
    	 Channel.imclient.on("3300", function(e, data) {
           	var msg = Channel.parseIMMsgData(data);
               if(msg){
               	 if (typeof(eval(callback)) == "function") {// 直接执行的方法
           	           callback(msg);
               	 }
               }
           });
    },
    
    
    //发送消息
    sendChatMsg:function(data){
    	var msg = Channel.imclient.newMessage("1100", data.to, data.to_name, data.msg, "", "");
    	msg.itemId = data.itemId;
    	msg.vendId = data.vendId;
    	Channel.imclient.sendMessage(msg);
    },   
    //接收聊天的消息
    receiveChatMsg:function(callback){
		//单个用户聊天消息
    	Channel.imclient.on('1100',function(e, data){
          	 if (typeof(eval(callback)) == "function") {// 直接执行的方法
          	      callback(data);
          	 }
		});
    },
    
    
    //发出获取好友在线状态的请求
    sendFriendsStatus:function(data){
    	Channel.imclient.sendOperate(Channel.imclient.newOperate('2200',{friend_list:data}));
    },    
    //监听获取好友在线状态的请求
    receiveFriendsStatus:function(callback){
    	Channel.imclient.on('2200',function(e,data){
    		 if (typeof(eval(callback)) == "function") {// 直接执行的方法
     	           callback(data);
         	 }
    	});
    },
    
    //发出获取某个(些)用户在线状态的请求
    sendGetUserStatus:function(data){
    	Channel.imclient.sendOperate(Channel.imclient.newOperate('2201',{friend_list:data}));
    },    
    //监听获取某个(些)用户在线状态的请求
    receiveGetUserStatus:function(callback){
    	Channel.imclient.on('2201',function(e,data){
    		 if (typeof(eval(callback)) == "function") {// 直接执行的方法
     	           callback(data);
         	 }
    	});
    },
    
    
    //发出改变Redis中的用户状态的请求
    sendChangeRedisStatus:function(data){
    	if(data.eventName == "sendcontrol"){
    		Channel.imclient.changeStatus(Channel.imclient.newMiniStatus('0200', 0, data.ext));
    	}else if(data.eventName == "sendstatus"){
    		Channel.imclient.changeStatus(Channel.imclient.newMiniStatus('0200', data.status));
    	}
    },
    //监听改变Redis中的用户状态的请求
    receiveChangeRedisStatus:function(callback){
    	Channel.imclient.on('0200',function(e,data){
	   		 if (typeof(eval(callback)) == "function") {// 直接执行的方法
	    	           callback(data);
	         }
    	});
    },
    
    //发起获取在线客服的请求
    sendGetOnlineCustomerService:function(data){
    	Channel.imclient.sendOperate(Channel.imclient.newOperate('2500', data));
    },
    receiveGetOnlineCustomerService:function(callback){
    	Channel.imclient.on('2500',function(e,data){
	   		 if (typeof(eval(callback)) == "function") {// 直接执行的方法
	    	     callback(data);
	         }
    	});
    },
    
    //发起获取在线客服的请求
    sendGetAllOnlineCustomerService:function(data){
    	Channel.imclient.sendOperate(Channel.imclient.newOperate('2503', data));
    },
    receiveGetAllOnlineCustomerService:function(callback){
    	Channel.imclient.on('2503',function(e,data){
	   		 if (typeof(eval(callback)) == "function") {// 直接执行的方法
	    	           callback(data);
	         }
    	});
    },
    
    
    
    //有用户退出
    receiveLogout:function(callback){
    	Channel.imclient.on('0100',function(e,data){
	   		 if (typeof(eval(callback)) == "function") {// 直接执行的方法
	    	           callback(data);
	         }
    	});
    }
};



/*$(document).ready(function(){
	Channel.init();
});*/


/** ***************************************************提供给外部的公用对象******************************************************* */
//发送聊天消息
function sendChatMsg(data){	
	if(Channel.isReady){
		Channel.sendChatMsg(data);
	}else{
		Channel.on("webim_connect_success",function(){
			Channel.sendChatMsg(data);
		});
	}  
}
//接收聊天消息
function receiveChatMsg(callback) {
	if(Channel.isReady){
		Channel.receiveChatMsg(callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveChatMsg(callback);
		});
	}  
}


//接收推送消息
function WebIMPushMsg(callback) {
	if(Channel.isReady){
		Channel.receiveMsg(callback);
	}else{
		Channel.on("webim_connect_success", function(){
			Channel.receiveMsg(callback);
		});
	}  
}

//发出获取好友在线状态的请求
function sendFriendsStatus(data){
	if(Channel.isReady){
		Channel.sendFriendsStatus(data);
	}else{
		Channel.on("webim_connect_success", function(){
			Channel.sendFriendsStatus(data);
		});
	}  
}
//监听获取好友在线状态的请求
function receiveFriendsStatus(callback) {
	if(Channel.isReady){
		Channel.receiveFriendsStatus(callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveFriendsStatus(callback);
		});
	}  
}


//发出获取某个(些)用户在线状态的请求
function sendGetUserStatus(data){
	if(Channel.isReady){
		Channel.sendGetUserStatus(data);
	}else{
		Channel.on("webim_connect_success", function(){
			Channel.sendGetUserStatus(data);
		});
	}  
}
//监听获取某个(些)用户在线状态的请求
function receiveGetUserStatus(callback) {
	if(Channel.isReady){
		Channel.receiveGetUserStatus(callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveGetUserStatus(callback);
		});
	}  
}




//发起改变Redis中的用户状态
function sendChangeRedisStatus(data){
	if(Channel.isReady){
		Channel.sendChangeRedisStatus(data);
	}else{
		Channel.on("webim_connect_success", function(){
			Channel.sendChangeRedisStatus(data);
		});
	}  
}
//监听改变Redis中的用户状态的请求
function receiveChangeRedisStatus(callback) {
	if(Channel.isReady){
		Channel.receiveChangeRedisStatus(callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveChangeRedisStatus(callback);
		});
	}  
}


//发起改变Redis中的用户状态
function sendGetOnlineCustomerService(data){
	if(Channel.isReady){
		Channel.sendGetOnlineCustomerService(data);
	}else{
		Channel.on("webim_connect_success", function(){
			Channel.sendGetOnlineCustomerService(data);
		});
	}  
}
//监听改变Redis中的用户状态的请求
function receiveGetOnlineCustomerService (callback) {
	if(Channel.isReady){
		Channel.receiveGetOnlineCustomerService (callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveGetOnlineCustomerService (callback);
		});
	}  
}

//发起改变Redis中的用户状态
function sendGetAllOnlineCustomerService(data){
	if(Channel.isReady){
		Channel.sendGetAllOnlineCustomerService(data);
	}else{
		Channel.on("webim_connect_success", function(){
			Channel.sendGetAllOnlineCustomerService(data);
		});
	}  
}
//监听改变Redis中的用户状态的请求
function receiveGetAllOnlineCustomerService (callback) {
	if(Channel.isReady){
		Channel.receiveGetAllOnlineCustomerService (callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveGetAllOnlineCustomerService (callback);
		});
	}  
}


//有用户退出
function receiveLogout(callback) {
	if(Channel.isReady){
		Channel.receiveLogout(callback);
	}else{
		Channel.on("webim_connect_success",function(){
			 Channel.receiveLogout(callback);
		});
	}  
}

//获得当前用户信息
function getCurrentUserInfo(callback){
	if(Channel.isReady){
		 callback(Channel.currentUser);
	}else{
		 Channel.on("webim_connect_success", function(){
			 callback(Channel.currentUser);
		 });
	}  
}

//获得imclient对象
function getImclient(callback){
	if(Channel.isReady){
		 callback(Channel.imclient);
	}else{
		 Channel.on("webim_connect_success", function(){
			 callback(Channel.imclient);
		 });
	} 
}

//获取注册成功后，服务器返回的数据
function getInfoFromInit(callback){
	if(Channel.isReady){
		 callback(Channel.infoFromlogin);
	}else{
		 Channel.on("webim_connect_success", function(){
			 callback(Channel.infoFromlogin);
		 });
	}
}

//抽象ajax方法
function getAjax(url,callback,data){
	Channel.ajaxJsonp(url,callback,data);
}
