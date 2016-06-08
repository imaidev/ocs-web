IMClient = function(){
//	this.init();
};

IMClient.prototype = {
	eventDispatcher:$(this),
	socket:null,
	sip:null,
	port:8888,
	isConnected: false,
	connTimerId: null,
	initFlag:false,
	user_status:{
		type:'',
		user_id:'',
		device_type:0,
		user_name:'',
		user_type:'',
		status:1,
		user_skill:"1",
		user_ext:{},
		ext:'',
		app_id:'iop',
		device_id:""
	},
			
	init:function(){
		this.sip = Channel_CONFIG.server_ip;
		this.port = Channel_CONFIG.server_port;
		this.initConnection();
		this.initListener();
	},
	initConnection:function(){
		if (!window.WebSocket){
			socket = io.connect(this.sip+':'+this.port,{transports:['jsonp-polling']}); 
		}else{
			socket = io.connect(this.sip+':'+this.port ,{transports:['websocket']}); 
		}
	},
	initListener:function(){
		var $this = this;
		
		//监听用户是否连接成功
		socket.on('connected', function () {
			$this.initFlag = true;
			$this.trigger("connected");
			if($this.connTimerId)window.clearInterval($this.connTimerId);
		});
		
		/*监听连接出错*/
		socket.on('error', function(msg) {
            $this.trigger("connect_error");
			$this.connectServer();
		});
		
		/*
		socket.on('disconnect', function () {
            $this.trigger("disconnect");
        });
		socket.on('connect_failed', function() {
			$this.trigger("error");
		});
		*/
		
		//监听状态推送
		socket.on('pushStatus',function(data){
			$this.trigger(data.type, [data]);
		});
		
		//监听消息推送
		socket.on('pushMessage',function(data){
			$this.trigger(data.type, [data]);
		});
		
		//监听手机端操作推送
		socket.on('pushPhoneMessage',function(data){
			$this.trigger(data.type, [data]);
		});
		
		//监听操作推送
		socket.on('pushOperate',function(data){
			$this.trigger(data.type, [data]);
		});
	},
	//断开连接后进行重连
	connectServer:function(){
		var $this = this;
		this.connTimerId = window.setInterval(this.connectServerHandler,50,$this);
	},
	//重连操作
	connectServerHandler:function($this){
        $this.initConnection();
        if(!$this.initFlag){
        	$this.initListener();
        }
	},
	changeStatus:function(data){
		socket.emit('changeStatus',data);
	},
	sendOperate:function(data){
		socket.emit('sendOperate',data);
	},
	sendMessage:function(data){
		socket.emit('sendMessage',data);
	},
	newStatus:function(type,status,ext){
		return {
			type:type,
			user_id:this.user_status.user_id,
			device_type:this.user_status.device_type,
			user_name:this.user_status.user_name,
			user_type:this.user_status.user_type,
			app_id:this.user_status.app_id,
			status:status,
			user_skill:this.user_status.user_skill,
			user_ext:this.user_status.user_ext,
			ext:ext,
			device_id:this.user_status.device_id
			};
	},
	newMiniStatus:function(type, status, ext) {
		return {
			type:type,
			user_id:this.user_status.user_id,
			device_type:this.user_status.device_type,
			user_name:this.user_status.user_name,
			app_id:this.user_status.app_id,
			status:status,
			ext:ext
			};
	},
	newMessage:function(type,to,to_name,msg,to_type,to_user_type){
		return {
			type:type,
			from:this.user_status.user_id,
			to:to,
			from_name:this.user_status.user_name,
			to_name:to_name,
			app_id:this.user_status.app_id,
			msg:msg,
			to_type:to_type,
			to_user_type:to_user_type
		};
	},
	newOperate:function(type,query_ext){
		return {
			type:type,
			user_id:this.user_status.user_id,
			query_ext:query_ext,
			app_id:this.user_status.app_id
		};
	},
	
	getIsConnected: function() {
		return this.isConnected;
	},
	
	/***************************************************************/
	on:function(eventName,func,scope){
		if(this.eventDispatcher && this.eventDispatcher.on)
		  this.eventDispatcher.on.apply(this.eventDispatcher,arguments);
	},
	off:function(eventName,func,scope){
		if(this.eventDispatcher && this.eventDispatcher.off)
		  this.eventDispatcher.off.apply(this.eventDispatcher,arguments);
	},
	trigger:function(eventName,args){
		if(this.eventDispatcher && this.eventDispatcher.trigger)
		  this.eventDispatcher.trigger.apply(this.eventDispatcher,arguments);
	}
};
var _globalIMClient = null;
IMClient.newInstance = function(){
	if(_globalIMClient == null)_globalIMClient = new IMClient();
	return _globalIMClient;
};