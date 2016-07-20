//系统配置对象
var Channel_CONFIG = {
	getServer_url :"/im/rest/getServer",
    server_ip:"",
    server_port:"",
    userInfo_url:"", //用户中心地址(获取好友列表)
    rc_url:"", //资源中心地址(文件上传、图片上传)
    language:"cn"
};

//
var InitChannel = {
	isReady : false,
	
	//加载依赖的css和js文件
	loadFiles:function(){
		var langFile = "/im/imclient/language/properties_" + Channel_CONFIG.language + ".js";
		var jsFile = "/im/imclient/channel/channel-all.js";
		
		JSLoader.call.include({
            cssFiles : [],//加载css文件
            scripts : [langFile, jsFile],// 加载js文件
            fun : this.startChannel //启动方法
	    });
	},
	
	//启动通道
	startChannel:function(){
		isReady = true;
		Channel.init();
		InitChannel.trigger("init_channel_success");
	},
	
	on : function(eventName, func, scope) {
	   if (!this.eventDispatcher)
	        this.eventDispatcher = $(this);
	    this.eventDispatcher.on.apply(this.eventDispatcher, arguments);
	},  
	
	trigger : function(eventName, args) {
	    if (!this.eventDispatcher)
	        this.eventDispatcher = $(this);
	    this.eventDispatcher.trigger.apply(this.eventDispatcher, arguments);
	}
};


/*$(document).ready(function(){
	InitChannel.loadFiles();
});*/


/** ***************************************************提供给外部的公用对象******************************************************* */
//发送聊天消息
function sendChatMsg(data){	
	if(InitChannel.isReady){
		sendChatMsg(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			sendChatMsg(callback);
		});
	}
}
//接收聊天消息
function receiveChatMsg(callback) {
	if(InitChannel.isReady){
		receiveChatMsg(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveChatMsg(callback);
		});
	}
}


//接收推送消息
function WebIMPushMsg(callback) {
	if(InitChannel.isReady){
		WebIMPushMsg(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			WebIMPushMsg(callback);
		});
	}
}

//发出获取好友在线状态的请求
function sendFriendsStatus(data){
	if(InitChannel.isReady){
		sendFriendsStatus(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			sendFriendsStatus(callback);
		});
	}
}

//监听获取好友在线状态的请求
function receiveFriendsStatus(callback) {
	if(InitChannel.isReady){
		receiveFriendsStatus(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveFriendsStatus(callback);
		});
	}
}


//发出获取某个(些)用户在线状态的请求
function sendGetUserStatus(data){
	if(InitChannel.isReady){
		sendGetUserStatus(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			sendGetUserStatus(callback);
		});
	}
}


//监听获取某个(些)用户在线状态的请求
function receiveGetUserStatus(callback) {
	if(InitChannel.isReady){
		receiveGetUserStatus(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveGetUserStatus(callback);
		});
	}
}




//发起改变Redis中的用户状态
function sendChangeRedisStatus(data){
	if(InitChannel.isReady){
		sendChangeRedisStatus(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			sendChangeRedisStatus(callback);
		});
	}
}


//监听改变Redis中的用户状态的请求
function receiveChangeRedisStatus(callback) {
	if(InitChannel.isReady){
		receiveChangeRedisStatus(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveChangeRedisStatus(callback);
		});
	}
}


//发起改变Redis中的用户状态
function sendGetOnlineCustomerService(data){
	if(InitChannel.isReady){
		sendGetOnlineCustomerService(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			sendGetOnlineCustomerService(callback);
		});
	}
}

//监听改变Redis中的用户状态的请求
function receiveGetOnlineCustomerService (callback) {
	if(InitChannel.isReady){
		receiveGetOnlineCustomerService(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveGetOnlineCustomerService(callback);
		});
	}
}

//发起改变Redis中的用户状态
function sendGetAllOnlineCustomerService(data){
	if(InitChannel.isReady){
		sendGetAllOnlineCustomerService(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			sendGetAllOnlineCustomerService(callback);
		});
	}
}
//监听改变Redis中的用户状态的请求
function receiveGetAllOnlineCustomerService (callback) {
	if(InitChannel.isReady){
		receiveGetAllOnlineCustomerService(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveGetAllOnlineCustomerService(callback);
		});
	}
}



//有用户退出
function receiveLogout(callback) {
	if(InitChannel.isReady){
		receiveLogout(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			receiveLogout(callback);
		});
	}
}

//获得当前用户信息
function getCurrentUserInfo(callback){
	if(InitChannel.isReady){
		getCurrentUserInfo(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			getCurrentUserInfo(callback);
		});
	}
}

//获得imclient对象
function getImclient(callback){
	if(InitChannel.isReady){
		getImclient(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			getImclient(callback);
		});
	}
}

//获取注册成功后，服务器返回的数据
function getInfoFromInit(callback){
	if(InitChannel.isReady){
		    getInfoFromInit(callback);
	}else{
		InitChannel.on("init_channel_success",function(){
			getInfoFromInit(callback);
		});
	}
}

//抽象ajax方法
function getAjax(url,callback,data){
	if(InitChannel.isReady){
		getAjax(url,callback,data);
	}else{
		InitChannel.on("init_channel_success",function(){
			getAjax(url,callback,data);
		});
	}
}












/** ******************************************文件动态加载工具************************************************************* */
/*
 * JS文件动态加载工具(动态加载CSS和JS)
 */
var JSLoader = {

    // 浏览器判断
    browser : {
        ie : /msie/.test(window.navigator.userAgent.toLowerCase()),
        moz : /gecko/.test(window.navigator.userAgent.toLowerCase()),
        opera : /opera/.test(window.navigator.userAgent.toLowerCase()),
        safari : /safari/.test(window.navigator.userAgent.toLowerCase())
    },

    // 具体方法
    call : (function() {

        /**
         * 判断要加载的文件是否存在
         */
        function hasFile(tag, url) {
            var contains = false;
            var files = document.getElementsByTagName(tag);
            var type = tag == "script" ? "src" : "href";
            for (var i = 0, len = files.length; i < len; i++) {
                if (files[i].getAttribute(type) == url) {
                    contains = true;
                    break;
                }
            }
            return contains;
        }

        /**
         * 文件加载方法
         */
        function loadFile(element, callback, parent) {
            var p = parent && parent != undefined ? parent : "head";
            if (callback) {
                element.onload = element.onreadystatechange = function() {
                    if (element.readyState && (element.readyState != 'loaded') && (element.readyState != 'complete')) {
                        return;
                    }
                    element.onreadystatechange = element.onload = null;
                    loadScriptCallback(callback);
                };
            }

            document.getElementsByTagName(p)[0].appendChild(element);

        }

        /**
         * 加载CSS文件，异步，添加完毕直接执行方法，不同步
         */
        function loadCssFile(files, callback) {
        	if (files && (files.length > 0)) {
                var urls = files && typeof(files) == "string" ? [files] : files;
                for (var i = 0, len = urls.length; i < len; i++) {
                    var cssFile = document.createElement("link");
                    cssFile.setAttribute('rel', 'stylesheet');
                    cssFile.setAttribute('type', 'text/css');
                    cssFile.setAttribute('href', urls[i]);
                    if (!hasFile("link", urls[i])) {
                        document.getElementsByTagName("head")[0].appendChild(cssFile);
                    }
                }
            }
            callback();
        }

        /**
         * 加载JS文件
         */
        var jsLen = 0;// 总的文件的数目
        var jsIndex = 0;// 当前加载的文件的索引
        function loadScript(files, callback, parent) {
            if (files && (files.length > 0)) {
                var urls = files && typeof(files) == "string" ? [files] : files;
                jsLen = urls.length;
                for (var i = 0, len = urls.length; i < len; i++) {
                    var script = document.createElement("script");
                    script.setAttribute('charset', 'utf-8');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', urls[i]);
                    if (!hasFile("script", urls[i])) {
                        loadFile(script, callback, parent);
                    }
                }
            } else {
                callback();
            }
        }

        /**
         * js全部加载完毕，进行回调
         */
        function loadScriptCallback(callback) {
            jsIndex++;
            if (jsIndex == jsLen) {
                callback();
            }
        }

        /**
         * 加载CSS文件和JS文件(先加载CSS再加载JS)
         */
        function includeFile(options) {
            loadCssFile(options.cssFiles, function() {
                        loadScript(options.scripts, options.fun, "body");
                    });
        }

        return {
            include : includeFile
        };

    })()
};


/** *****************************************************字符串工具类******************************************************* */
/**
 * 判断字符串是否为空
 */
function isEmpty(str) {
    if (str != null && !/^\s*$/.test(str)) {
        return false;
    } else {
        return true;
    }
};
