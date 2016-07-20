WebIMClient = function(client){
	this.init(client);
};

WebIMClient.prototype = {
	imclient: null,
	eventDispatcher: null,
	
	init: function(c) {
		this.imclient = c;
		this.eventDispatcher = $(this.imclient);
	},
	
	changeStatus:function(data){
		this.imclient.changeStatus(data);
	},
	sendOperate:function(data){
		this.imclient.sendOperate(data);
	},
	sendMessage:function(data){
		this.imclient.sendMessage(data);
	},
	newStatus:function(type,status,ext){
		return this.imclient.newStatus(type,status,ext);
	},
	newMiniStatus:function(type, status, ext) {
		return this.imclient.newMiniStatus(type,status,ext);
	},
	newMessage:function(type,to,to_name,msg,to_type,to_user_type){
		return this.imclient.newMessage(type,to,to_name,msg,to_type,to_user_type);
	},
	newOperate:function(type,query_ext){
		return this.imclient.newOperate(type,query_ext);
	},
	
	getIsConnected: function() {
		return this.imclient.getIsConnected();
	},
	
	/***************************************************************/
	on:function(eventName,func,scope){
		//this.eventDispatcher.on.apply(this.eventDispatcher,arguments);
		this.imclient.on(eventName, func, scope);
	},
	off:function(eventName,func,scope){
		//this.eventDispatcher.off.apply(this.eventDispatcher,arguments);
		this.imclient.off(eventName, func, scope);
	},
	trigger:function(eventName,args){
		//this.eventDispatcher.trigger.apply(this.eventDispatcher,arguments);
		this.imclient.trigger(eventName, args);
	}
};
var _globalWebIMClient = null;
/**
 * 获取即时消息对象
 * @param callback
 * @returns
 */
function getWebIMClient(callback) {
	if(_globalWebIMClient)  {
		if(callback)
			callback(_globalWebIMClient);
		return _globalWebIMClient;
	}
	var getWebImCallback = function(client) {
		_globalWebIMClient = new WebIMClient(client);
		if(callback)
			callback(_globalWebIMClient);
	};
	try {
		if(window.top.getWebIMClient) {
			var imclient = window.top.getWebIMClient(getWebImCallback);
			if(imclient) {
				_globalWebIMClient = new WebIMClient(imclient);
				return _globalWebIMClient;
			}
		} else {
			//alert("获取即时消息对象存在跨域");
		}
	} catch(e) {
		//alert("获取即时消息对象存在跨域2");
	}
	return null;
}