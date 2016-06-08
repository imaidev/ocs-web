// 系统配置对象
var WEB_IM_CONFIG = {
	project_address: "/im/imclient/webim/",//前台项目目录
    order_search: "",//订单查询的页面
    skin: "3",//皮肤版本(目前有1，2,3三个版本)
    showUserName: true,// 收到消息的消息内容是否显示用户名
    useUserId: false,// 使用用户中心传来的userId作为uid，不使用uid
    appendUId: false,// 当前对话人的昵称后面是否带上(id)，默认只显示昵称
    testVersionTitle: "",// 测试版提示
    sendImg: true,// 是否显示发送图片和文件上传按钮
    welcome: "您好，%s 为您服务中...",//打开与客服聊天框后的友好提示语
    openTest: false,//是否开启测试模式
    imUrL: "/im/RequestDispatcher/",
    friendsUrl: "/ecweb/act/user/UserInfoGet.do?method=getUserInfo",
    rc_url: "/DocCenterService/",
    login_url: "/ecweb/hhds/login",
    ajaxDataType: "jsonp",
    ajaxJsonp: "jsonpcallback",
    vendId: null, //店铺id
    itemId: null, //商品id
    serviceId: null, //指定对话客服Id
    nologin_enable: true, //是否允许游客登录
    serviceLogin: false, //是否客服登录
    showSideBar: 0, //显示侧边栏，0-不显示，1-默认侧边栏，2商城自定义侧边栏
    sideBar_url: "/ecweb/lyscim/sidebar/SideBar.htm" //自定义侧边栏的地址
};



/** ***************************************************提供给外部的公用对象******************************************************* */
// 公用对象，被外部调用
var IM = {
    webim : null,// 窗体控制
    isReady : false,// 是否创建完毕
    imclient : null,// 长连接对象
    eventDispatcher : null,// 事件监听器
    getUserInfoEvent: "wbim_get_user_info",//获取用户信息事件标示
    callbackList : new Array(),// 存放的回调事件，IM初始化完毕后进行回调

    on : function(eventName, func, scope) {
        if (!this.eventDispatcher)
            this.eventDispatcher = $(this);
        this.eventDispatcher.on.apply(this.eventDispatcher, arguments);
    },
    off : function(eventName, func, scope) {
        if (!this.eventDispatcher)
            this.eventDispatcher = $(this);
        this.eventDispatcher.off.apply(this.eventDispatcher, arguments);
    },
    trigger : function(eventName, args) {
        if (!this.eventDispatcher)
            this.eventDispatcher = $(this);
        this.eventDispatcher.trigger.apply(this.eventDispatcher, arguments);
    },
    call: function (typeCode, extData, callback, obj) {
		$.ajax({
			url: WEB_IM_CONFIG.imUrL + "sendOperate",
			data: {
				data : JSON.stringify({
					type: typeCode,
					app_id : this.webim.userInfo.app_id,
					user_id : this.webim.userInfo.uid,
					user_name: this.webim.userInfo.uname,
					query_ext: extData
				})
			},
			dataType: WEB_IM_CONFIG.ajaxDataType,
			jsonp: WEB_IM_CONFIG.ajaxJsonp,
			type: "post",
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// alert("err:"+textStatus+",readyState:"+XMLHttpRequest.readyState+",errorThrown"+errorThrown);
			},
			success: function(data) {
				if (typeof (eval(callback)) == "function") {
					if(obj){
						callback.call(obj, data);
					} else {
						callback(data);
					}
				}
			}
		});
	}
};
/** ***************************************************提供给外部的公用方法******************************************************* */
var onLineClass = "wbim_head_inline";// 在线图标
var offLineClass = "wbim_head_offline";// 离线图标
var HEAD_STATUS_Str = "_USER_HEAD_STATUS";// 用户状态唯一标示关键字

/**
 * 打开与某个用户的聊天框
 * 
 * @param data:Object
 *            用户对象，{user_id:XXX,user_name:XXX,user_skill:XXX}
 *            user_skill:代表用户身份。值为1代表普通用户，用户名显示user_name；值为2代表客服，用户名显示“与user_name咨询中"，结束对话后会出现打分界面；
 *            值为3代表咨询用户，用户名显示“与user_name咨询中"，但是结束对话后不出现打分界面
 */
function openChatBox(data) {
    data.openChat = "true";// 标示即时通信通道建立后直接打开聊天框
    UserMap.set(data.user_id, data);
    if (IM.isReady && IM.webim) {
        IM.webim.setOpenChatBox(data);
    }
}

/**
 * 调用该方法会自动创建一个在线用户的头像图标，类似于阿里旺旺的在线咨询图标，点击图标可以打开聊天框聊天
 * 
 * @param data:Object
 *            用户对象，{user_id:XXX,user_name:XXX,user_skill:XXX}
 * @param containerId:String
 *            外部容器的id，可以为空，为空的话图标显示到嵌入该js方法的位置，不为空的话图标显示到指定id的容器内
 */
function showUserIMHead(data, containerId) {
    var uid = data.user_id;
    // 显示
    if (containerId) {
        $("#" + containerId).append($(getHeadHtml(offLineClass, uid)));
    } else {
        document.write(getHeadHtml(offLineClass, uid));
    }
    // 存储到容器
    UserMap.set(uid, data);

    $("#" + uid + HEAD_STATUS_Str).click(function() {
                openChatBox(data);
            });

    // IM加载完毕，执行检测
    if (IM.isReady) {
        createHead();
    }
}

/**
 * 获取人物头像html完整标签
 * 
 * @param class_status
 * @param markId
 * @returns {String}
 */
function getHeadHtml(class_status, uid) {
    return "<span class='wbim_head_status a'><a id='" + (uid + HEAD_STATUS_Str)
            + "' class='" + class_status + "'/></span>";
}

/**
 * 刷新好友列表
 */
function refreshFriendList(){
	if(IM.isReady && IM.webim){
		WEB_IM_CONFIG.openTest?IM.webim.testGetUserInfo(IM.getUserInfoEvent):IM.webim.getUserInfo(IM.getUserInfoEvent);
	}else{
		IM.on("webim_connect_success", refreshFriendHandler);
	}
}

/**
 * 刷新好友列表回调 
 */
function refreshFriendHandler(){
	WEB_IM_CONFIG.openTest?IM.webim.testGetUserInfo(IM.getUserInfoEvent):IM.webim.getUserInfo(IM.getUserInfoEvent);
}

/** *****************************************************消息推送工具方法，可以动态将消息推送到外部方法中******************************************************* */
/**
 * 消息推送，监听消息中心推送的通知，监听到通知后回调外部传来的方法，并把参数传给外部方法，参数为{type:count}
 * callback：外部传来的回调函数
 */
//function WebIMPushMsg(callback) {
//    IM.callbackList.push(callback);
//    if (IM.isReady) {
//        WebIMReadyHandler(callback);
//    } else {
//        IM.on("webim_connect_success", WebIMReadyHandler);
//    }
//}

//function parseIMMsgData(data){
//	if (data && data.msg){
//        var msg = data.msg;
//        if(typeof(msg) === "string") {
//            msg = JSON.parse(msg);
//        }else{
//            msg = eval("(" + msg + ")");
//        }
//        if(msg.content){
//            return msg;
//        }
//    }
//    return null;
//}

/**
 * IM初始化完毕，执行回调函数
 */
function WebIMReadyHandler(callback) {
    // 消息中心推送监听
    IM.imclient.on("3300", function(e, data) {
    	var msg = parseIMMsgData(data);
        if(msg)callbackHandler(callback,msg);
    });

    // 后台推送的系统消息监听
    IM.imclient.on("1400", function(e, data) {
        if (data)callbackHandler(callback, data);
    });

    // 前台推送的系统消息监听
    IM.imclient.on("3100", function(e, data) {
        if (data)callbackHandler(callback, data);
    });
}

/**
 * 执行回调方法
 * 
 * @param {}
 *            data
 */
function callbackHandler(callback, data) {
    if (typeof(eval(callback)) == "function") {// 直接执行的方法
        if (callback) {
            callback(data);
        }
    } else {// 回调，执行callbackList集合中的所有函数
        var target = callback.target;
        if (target) {
            $.each(target.callbackList, function(key, value) {
                        value(data);
            });
        }
    }
}

/** ****************************************************存储用户状态的集合用户************************************************************* */
var UserMap = {
    _keys : new Array(),
    clear : function() {
        this._keys = new Array();
    },
    contains : function(key) {
        return this[key] != null;
    },
    get : function(key) {
        return this[key];
    },
    set : function(key, value) {
        if (this.contains(key)) {
            this[key] = value;
        } else {
            this[key] = value;
            this._keys.push(key);
        }
    },
    remove : function(key) {
        var result = null;
        if (this.contains(key)) {
            delete this[key];
            var index = this._keys.indexOf(key);
            if (index > -1) {
                this._keys.splice(index, 1);
            }
        }
        return result;
    },
    size : function() {
        return this._keys.length;
    },
    isEmpty : function() {
        return this.size() < 1;
    },
    keys : function() {
        return this._keys;
    }
};
/** ******************************************文件动态加载工具************************************************************* */
/*
 * JS文件动态加载工具(动态加载CSS和JS)
 */
var IMJSLoader = {

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

/*
 * 供外部调用接口 include({cssFiles:[], scripts:[]})
 */
function include(options) {
    IMJSLoader.call.include(options);
};




/***********************警告框******************************/
var alertTimeout = 0;
var alertCallback = null;
var showAlert = function(content, title, autoHidden, callback, model) {
    clearTimeout(alertTimeout);
    alertTimeout = 0;

    // if(alertCallback) {
    // alertCallback();
    // alertCallback = null;
    // }

    alertCallback = callback;

    var ale = $("#alertView");
    if (!ale[0]) {
        var str = '<div><div class="alertViewModel" style="display:none;"></div><div id="alertView"><div class="alertTitle"></div><div class="alertContent"></div><div class="alertButtons"><a class="okbtn">'+properties.im_confirm+'</a></div></div></div>';
        $(document.body).append(str);
        ale = $("#alertView");

        ale.find(".okbtn").click(function(e) {
                    hideAnimate();
                });
    }

    var getContentHeight = function() {
        var contentHeight = window.document.body.scrollHeight;
        // 其它浏览器默认值
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            contentHeight = window.document.body.clientHeight;
        }
        var iframe = $("#iframediv");
        if (iframe[0]) {
            contentHeight = iframe.height();
        }
        return contentHeight;
    };

    var $window = $(window);

    var showAnimate = function() {

        $(".alertViewModel").css("display", model ? "block" : "none").css(
                "height", getContentHeight());

        var w = $window.width();
        var h = $window.height();
        var l = (w - ale.width()) / 2;
        var t = (h - ale.height()) / 2;

        ale.css("display", "block").css("opacity", "0").css("left", l).css(
                "top", t + 50);
        ale.animate({
                    top : t,
                    opacity : 1
                }, 500);
    };
    var hideAnimate = function() {
        clearTimeout(alertTimeout);
        alertTimeout = 0;

        var pos = ale.position();
        ale.animate({
                    top : pos.top - 50,
                    opacity : 0
                }, 500, function() {
                    ale.css("display", "none");
                    if (alertCallback) {
                        alertCallback();
                    }
                });

        $(".alertViewModel").css("display", "none");
    };

    if (typeof(content) == "undefined")
        content = "";
    if (typeof(title) == "undefined")
        title = properties.im_prompt;
    if (typeof(autoHidden) == "undefined")
        autoHidden = true;
    if (typeof(model) == "undefined")
        model = false;

    ale.find(".alertTitle").text(title);
    ale.find(".alertContent").html(content);

    if (autoHidden) {
        alertTimeout = setTimeout(function() {
                    hideAnimate();
                }, 5000);
    }

    showAnimate();
};

/*********************拖拽***************************/
/**
 * 注意，被移动的容器position一定要是absolute
 * titleId:鼠标拖拽的容器id
 * dragId:移动的容器的id
 */
function dragHandler(titleId, dragId) {
    var dx, dy, moveout;
    var C = $("#" + dragId);
    var T = $('#' + titleId).css('cursor', 'move');
    var isIE = (document.all) ? true : false;
    T.bind("selectstart", function() {
                return false;
            });
    T.mousedown(function(e) {
                dx = e.clientX;
                dy = e.clientY;

                T.mouseup(up);// 被拖拽的头部
                C.css('opacity', 0.8);
                $("body").mousemove(move).mouseout(out);// 移动的总容器
            });
    function move(e) {
        moveout = false;
        // 更改坐标
        var r = dx - e.clientX + parseInt(C.css("right"));
        var t = e.clientY - dy + parseInt(C.position().top);
        C.css({
                    right : r,
                    top : t
                });
        // 记录本次移动的位置
        dx = e.clientX;
        dy = e.clientY;
    }
    function out(e) {
        moveout = true;
        setTimeout(function() {
                    checkout(e);
                }, 100);
    }
    function up(e) {
        C.css('opacity', 1);
        $("body").unbind("mousemove", move).unbind("mouseout", out);
        T.unbind("mouseup", up);
    }
    function checkout(e) {
        moveout && up(e);
    }
}


/*********************初始化***************************/
var IM_engin = {

	func: null,
	
	//初始化即时消息
    initIM : function(){
    	var cssFileName = "webim" + WEB_IM_CONFIG.skin + "_" + Channel_CONFIG.language + ".css";
        var jsFile = WEB_IM_CONFIG.project_address + "js/webim-all.js";//js
        var robotCssFile = WEB_IM_CONFIG.project_address + "css/robot_" + Channel_CONFIG.language + ".css";//机器人css
        var chatCssFile = WEB_IM_CONFIG.project_address + "css/" + cssFileName;// 聊天框css
        var defaultJqueryFile = WEB_IM_CONFIG.project_address + "js/jquery-1.7.1.min.js";// //默认提供的jquery(如果外部没有使用jquery的话)
        IMJSLoader.call.include({
            cssFiles : [robotCssFile,chatCssFile],//加载css文件
            scripts : [jsFile],// 加载js文件
            fun : this.startIM //启动方法
        });
    },
    
    //启动聊天程序
    startIM : function(){
        if ((typeof(createWebIM) != "undefined") && (createWebIM instanceof Function)) {
            createWebIM(IM_engin.startHandler);
        }
    },
    
    //启动完毕，回调全局变量
    startHandler : function(params){
    	if (params.code == 1) {
            IM.isReady = true;
            IM.webim = params.webim;
            IM.trigger("webim_connect_success");
            initCheckUserStatus();// 检测用户在线状态，刷新所有图标
            func = params.func;
            IM_engin.doStart(WEB_IM_CONFIG.vendId, null, WEB_IM_CONFIG.itemId, WEB_IM_CONFIG.serviceId);
        }
    },
    
    //开启一个路由客服对话窗口
    doStart: function(vendId, turnService, itemId, serviceId){
    	if(!IM.isReady){
    		this.initIM();
    	} else if(!WEB_IM_CONFIG.serviceLogin) {
    		//打开客服对话框
    		func({
				"vendId": vendId,
				"itemId": itemId,
				"serviceId": serviceId,
				"user_skill": IM.webim.userInfo.skill,
				"turnService": turnService
			});
			//如果是普通用户隐藏控制面板
			if(IM.webim.userInfo.skill == 1){
				$('#wbim_box_container').find('div[class="wbim_min_box_col3"]').width("270px");
				$('#wbim_box_container').find('div[class="wbim_list_expand"]').hide();
				$('#wbim_box_container').find('div[class="wbim_min_friend"]').hide();
			}
    	}
    }
};

/**
 * jquery加载完毕

$(document).ready(function(){
  //启动
  IM_engin.initIM();
}); */