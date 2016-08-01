/**
 * 智能机器人界面配置
 * @type 
 */
var ROBOT_CONFIG = {
	width:800,
	height:500,
	header_height:45,
	inputpanel_height:100,
	attach_box_width:220,
	
	MAX_INPUT_COUNT:120
};

var Robot = function() {
    
};

(function( $ ) {
	Robot.prototype = {
		
		robot:null,
		header:null,
		chat_box:null,
		attach_box:null,
		
		chatpanel:null,
		inputpanel:null,
		input_text:null,
		input_count:null,
		
		max_btn:null,//最大化按钮
		box_status:0,//0：最大化；1：中；2：最小化
		
		currentUser:null,//当前用户
		
		ext_hot:null,
		ext_about:null,
		ext_hot_box:null,
        ext_about_box:null,
		
		init:function(){
			
		},
		
		openBox:function(user){
			this.currentUser = user;
			var robot = "<div class='robot' id='robot_" + user.uid + "' name='robot_" + user.uid + "'>";
            $("body").append(robot);
            this.initBox();
            //加载机器人欢迎语
            this.showRobotWelcom(user.uid);
		},
		
		showRobotWelcom: function(uid){
			IM.call("3600",
				{serviceId: uid},
				this.showWelcom,
				this
			);
		},
		
		showWelcom: function(data){
			var date = new Date();
			var welInfo = {
				from: this.currentUser.uid,
                from_name: this.currentUser.uname,
                chat_date: $.dateFormat(date, "yyyy-MM-dd"),
                chat_time: $.dateFormat(date, "hh:mm:ss"),
                msg: WEB_IM_CONFIG.welcome.replace(/%s/, $this.currentUser.uname)
			};
			if(data && data.welcomeInfo){
				welInfo.msg = data.welcomeInfo;
			}
			this.pushRobotMessage(welInfo);
		},
		
		initBox:function(){
			var $this = this;
			$this.robot = $("div[id=robot_"+$this.currentUser.uid+"]");
			$this.robot.append(sb);
			$this.header = $this.robot.node("header");
			$this.chat_box = $this.robot.node("chat_box");
			$this.max_btn = $this.robot.node("max_btn");
			
			$this.attach_box = $this.robot.node("attach_box");
			$this.ext_hot = $this.robot.node("ext_hot");
            $this.ext_about = $this.robot.node("ext_about");
            $this.ext_hot_box = $this.robot.node("ext_hot_box");
            $this.ext_about_box = $this.robot.node("ext_about_box");
			
			$this.initHeader();//初始化header
			$this.initChatBox();//初始化聊天框
			$this.initListener();//初始化监听
		//	IM.imclient.sendOperate(IM.imclient.newOperate("4200",{uid:this.currentUser.uid}));//获取热门问题
		},
		
		/**
		 * 初始化header
		 */
        initHeader:function(){
            this.header.node("head").attr("src",this.currentUser.icon);
            this.header.node("title").html(this.currentUser.uname);
            this.header.node("welcome").html(properties.robot_iam+this.currentUser.uname + properties.robot_online_advice);
        	this.robot.jqDrag('.header');
//			$this.robot.jqDrag('.header').jqResize('.drag_icon');
        },
		
		
		/**
		 * 初始化聊天框
		 */
		initChatBox:function(){
			var $this = this;
			$this.chatpanel = $this.robot.node("chatpanel");
            $this.inputpanel = $this.robot.node("inputpanel");
            $this.input_text = $this.robot.node("input_text");
            $this.input_count = $this.robot.node("input_count");
            
            //聊天框内容容器
            var dl = '<div name="chat_list"><dl uid="' + $this.currentUser.uid + '"></dl></div>';
            $this.chatpanel.append(dl);
            
            //调整样式
            $this.initRobotBoxSize();
            
//            $this.input_text.attr("maxlength",ROBOT_CONFIG.MAX_INPUT_COUNT);
            $this.input_count.html(ROBOT_CONFIG.MAX_INPUT_COUNT);//输入框最多输入字数
		},
		
		/**
		 * 初始化整体大小
		 */
		initRobotBoxSize:function(){
            var $this = this;
            var top = 0;
            var left = 0;
            var width = 0;//总宽度
            var heigt = 0;//总高度
            
            if($this.box_status == 0){//最大化
            	top = 0;
            	left = 0;
            	width = $(window).width();
            	height = $(window).height();
            	$this.robot.css("border","0");
            	$this.robot.css("border-radius","0");
            	$this.max_btn.removeClass("robot_icon_max");
            	$this.max_btn.addClass("robot_icon_mid");
        	}else if($this.box_status == 1){
                width = ROBOT_CONFIG.width;
                height = ROBOT_CONFIG.height-2;
                top = ($(window).height() - height)/2;
                left = ($(window).width() - width)/2;
                $this.robot.css("border","1px solid #36648B");
                $this.robot.css("border-radius","4px");
                $this.robot.css("-moz-border-radius","4px");
                $this.robot.css("-webkit-border-radius","4px");
                $this.max_btn.removeClass("robot_icon_mid");
                $this.max_btn.addClass("robot_icon_max");
            }
            
            //总大小
            var headerHeight = ROBOT_CONFIG.header_height;
            $this.robot.width(width);
            $this.robot.height(height);
            $this.robot.css("top",top);
            $this.robot.css("left",left);
            $this.robot.css("position","fixed");
            $this.header.width(width);
            $this.header.height(headerHeight);
            
            //输入框
            var inputWidth = width - ROBOT_CONFIG.attach_box_width;//输入框宽度
            var inputHeight = ROBOT_CONFIG.inputpanel_height - 10;//输入框高度
            $this.inputpanel.width(inputWidth);
            $this.inputpanel.height(inputHeight);
            $this.input_text.width(inputWidth - 2);
            $this.input_text.height(inputHeight - 32);
            
            //聊天框
            var chatHeight = height - headerHeight - inputHeight - 1;//聊天框高度
            $this.chatpanel.width(width);
            $this.chatpanel.height(chatHeight);
            $this.chatpanel.css("top",headerHeight);
            
            //显示内容
            var chat_list = $this.chatpanel.find("div[name=chat_list]");
            chat_list.width(width - ROBOT_CONFIG.attach_box_width);
            chat_list.height(chatHeight);
            chat_list.css("float","left");
            chat_list.css("margin-top","5px");
            chat_list.css("overflow-x","hidden");
            chat_list.css("overflow-y","auto");
            
            
            //右侧，相关问题和热门问题
            $this.attach_box.width(ROBOT_CONFIG.attach_box_width);
            $this.attach_box.height(height - headerHeight - 1);
            $this.attach_box.css("top",headerHeight);
            $this.attach_box.css("margin-left","-220px");
            
            var extHeight = (height - headerHeight - 78) / 2;
            if($this.ext_hot_box.css("display") == "none"){
            	$this.ext_about_box.height(extHeight * 2);
            }else{
            	$this.ext_hot_box.height(extHeight);
            	$this.ext_about_box.height(extHeight);
            }
            
            $this.ext_hot.height("100%");
            $this.ext_about.height("100%");
        },
		
        
        /**
         * 初始化监听
         */
        initListener:function(){
        	$this = this;
        	var uid = $this.currentUser.uid;
        	//关闭
        	$this.robot.node("close_btn").click(function(e) {
                IM.webim.robotMap.remove(uid);
                $this.robot.remove();
                
                $this.robot = null;
                $this.attach_box = null;
                $this.chat_box = null;
                $this.chatpanel = null;
                $this.ext_about = null;
                $this.ext_hot = null;
                $this.header = null;
                $this.input_count = null;
                $this.input_text = null;
                $this.inputpanel = null;
                $this.max_btn = null;
            });
            //最大化
            $this.robot.node("max_btn").click(function(e) {
            	if($this.box_status == 0){
            		$this.box_status = 1;
            		$.jqDnR.stop();
            	}else{
            		$this.box_status = 0;
            	}
                $this.initRobotBoxSize($this);
            });
            //发送按钮
            $this.robot.node("send_btn").click(function(e) {
                $this.sendMessage();
            });
            //输入框
            $this.input_text.on("keydown", function(e) {
                var code = e.keyCode || e.which || e.charCode;
                if(code == 13) {
                    $this.sendMessage();
                    e.preventDefault();
                    return false;
                }
                $this.checkInput(e);
            }).keyup(function(e) {
                $this.checkInput(e);
            });
            //展开热门信息
            $this.robot.node("ext_hot_head").click(function(e) {
                $this.showExtHotBox();
            });
            //展开相关问题
            $this.robot.node("ext_about_head").click(function(e) {
                $this.showExtAboutBox();
            });
            //窗口拉伸
            window.onresize = function(){
            	if($this.box_status == 0 && $this.robot){
            		$this.initRobotBoxSize($this);
            	}
            };
            //转人工客服
        	$this.robot.node("service_btn").click(function(e) {
        		//请求人工客服
        		IM_engin.doStart("", "1");
        		//关闭机器人
                $this.robot.node("close_btn").click();
            });
        },
        
        /**
         * 检查用户输入的字符
         */ 
        checkInput : function(e) {
            var l = ROBOT_CONFIG.MAX_INPUT_COUNT - this.input_text.val().length;
            if(l >= 0) {
                this.input_count.html(l);
            }else{
            	this.input_count.html("<span style='color:red'>" + l + "</span>");
            }
            return true;
        },
        
        /**
         * 发送消息
         */
        sendMessage : function() {
            $this = this;
            var msg = $this.checkSendMsgLength();
            if(!msg)return;
                
            //显示在消息接收框
            var date = new Date();
            var chat_msg = {
            	isSelf:true,
                uid : $this.currentUser.uid,
                uname:IM.webim.userInfo.uname,
                date: $.dateFormat(date, "yyyy-MM-dd"),//日期
                time: $.dateFormat(date, "hh:mm:ss"),//时间
                msg : msg
            };
            $this.showChatContent(chat_msg);
            
            //发送给聊天服务器
            IM.call("4100", {
            		robotId: $this.currentUser.uid,
            		robotName: $this.currentUser.uname,
            		question: msg
				},
				$this.pushRobotMessage,
				$this
			);
            
            //清除发送框文字
            $this.input_text.val("");//清空发送框
            $this.input_count.html(ROBOT_CONFIG.MAX_INPUT_COUNT);//字符限制
        },
        
        //机器人推送的答案
        pushRobotMessage:function(data){
        	// 组装消息内容
            var msg = {
                isSelf : false,
                uid : data.from,
                uname : data.from_name,
                time : data.chat_time,
                date : data.chat_date,
                msg : data.msg
            };
            
            //显示在消息接收框
            this.showChatContent(msg);
        },
        
        //机器人推送的热门问题
        pushHotMessage:function(data){
        	$this = this;
        	$this.getExtContent($this.ext_hot,data);
//        	slideup.init($this.ext_hot.find("ul"));//热门问题跑马灯效果
        },
        
        //机器人推送的相关问题
        pushAboutMessage : function(data){
            $this = this;
            $this.getExtContent($this.ext_about,data);
            $this.showExtAboutBox();
        },
        
        //显示热门问题
        showExtHotBox : function(){
        	$this = this;
            var height = ($this.robot.height() - $this.header.height() - 78)/2;
            $this.ext_about_box.animate({height:height},300);
            $this.ext_hot_box.animate({height:height},300);
        },
        
        //显示相关问题
        showExtAboutBox : function(){
            $this = this;
            var height = $this.ext_about.height() + $this.ext_hot.height();
//            $this.ext_hot.find("ul").children().stop();
            $this.ext_hot_box.animate({height:0},300);
            $this.ext_about_box.animate({height:height},300);
        },
        
        //创建热门问题和热门问题内容
        getExtContent : function(ext_box,data){
        	//移除之前的
        	ext_box.find("li").unbind();
            ext_box.find("ul").children().remove();
            
            //显示新的
        	var str = "";
            var list = data.result_message;
            if(list && (list.length > 0)){
                for (var i = 0; i < list.length; i++) {
                    str += "<div><li><a href='#' title='" + list[i].msg + "'>" + list[i].msg + "</a></li></div>";
                }
                $this = this;
	            ext_box.find("ul").append(str);
	            
	            //点击后直接提问
	            ext_box.find("li").bind('click', function(e) {
	                $this.input_text.val($(this).text());
	                $this.sendMessage();
	                e.preventDefault();
                    return false;
	            });
            }else{
                str += "<p style='text-align:center;'>"+properties.robot_norelated_issues;
                ext_box.find("ul").append(str);
            }
        },
        
        
        /**
         * 显示消息内容
         */
        showChatContent : function(data){
            var chatUserName = '<div class="' + (data.isSelf?"self_name":"other_name") + '">' + 
            (data.uname + "&nbsp;&nbsp;") + data.date + "&nbsp;" + data.time + '</div>';
            
            var str = '<dd class="robot_msgl">'
            + '<div class="robot_msgpos">' + chatUserName
            + '<div class="msg_box">' + data.msg+'</div>'
            + '</div></dd>';
            
            this.chatpanel.find("dl[uid=" + data.uid + "]").append(str);
            this.chatpanel.find("div[name=chat_list]").scrollTop(9999999);
        },
        
        /**
	     * 消息内容是否超出限制
	     */
	    sendMsgBgTimeId : null,
	    setSendMsgIndex : 0,
	    checkSendMsgLength : function(){
	    	$this = this;
	    	var msg = $this.input_text.val();
	        if(!msg || (msg && (msg.length > ROBOT_CONFIG.MAX_INPUT_COUNT))){
	        	if(!sendMsgBgTimeId){
		            this.sendMsgBgTimeId = setInterval(function(){
		            	if($this.setSendMsgIndex % 2 == 0){
				            $this.input_text.css("background-color","#FFFFFF");
				        }else{
				            $this.input_text.css("background-color","#FA8072");
				        }
				        $this.setSendMsgIndex ++;
				        
				        if($this.setSendMsgIndex >= 5){
				            $this.setSendMsgIndex = 0;
				            clearInterval($this.sendMsgBgTimeId);
				            sendMsgBgTimeId = null;
				        }
		            },200);
	        	}
	            return false;
	        }
	        return msg;
	    }
   };
})(jQuery);


    /**
     * 获取单例对象
     * @type 
     */
    var _globalRobot = null;
    Robot.newInstance = function() {
        if (_globalRobot == null)
            _globalRobot = new Robot();
        return _globalRobot;
    };
    Robot.getInstance = function() {
        return _globalRobot;
    };

    /**
     * 跑马灯效果
     * @type 
     */
    var slideup = {
    	init : function(ticker){
            slideup.animator(ticker.children(":first"));
            ticker.mouseenter(function() {
            	ticker.children().stop();
            });
            ticker.mouseleave(function() {
            	slideup.animator(ticker.children(":first"));
            });
    	},
    	
    	animator : function(currentItem){
    		var distance = currentItem.height();
                duration = (distance + parseInt(currentItem.css("marginTop"))) / 0.015;
                currentItem.animate({marginTop : -distance}, duration, "linear", function() {
                            currentItem.appendTo(currentItem.parent()).css("marginTop", 0);
                            slideup.animator(currentItem.parent().children(":first"));
                });
    	}
    };