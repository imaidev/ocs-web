/**
 * 获取某个用户的在线状态，将用户头像存储到指定容器内
 * @param uid:用户id
 * @param containerId:外部容器的id，如果没有传这个值，就默认将头像添加到引用这个方法的地方
 */

var onLineStatus = 1;
var offLineStatus = 0;

/**
 * 初始化所有状态检测逻辑，刷新需要打开的窗体
 */
function initCheckUserStatus(){
	
	//遍历内存待获取的状态
	var keys = UserMap.keys();
	if(keys && (keys.length>0)){
		var friend_list = "";
		for(var i=0;i<keys.length;i++){
			var uid = keys[i];
			if(isEmptyStr(uid)){
				friend_list += uid + ",";
				var udata = UserMap.get(uid);
				if(udata){
					if(udata.openChat == "true")IM.webim.setOpenChatBox(udata);//打开待要打开的窗体
				}
			}
		}
		
		//获取所有缓存中的用户状态，进行头像刷新
		if(isEmptyStr(friend_list)){
			friend_list = friend_list.substr(0,friend_list.lastIndexOf(","));
//			IM.imclient.sendOperate(IM.imclient.newOperate('2201',{friend_list:friend_list}));
			sendGetUserStatus(friend_list);
		}
	}
	
	receiveGetUserStatus(function(e,data){
		if(data){
			if (data && data.result_status){
				for (var i = 0; i < data.length; i++) {
                    setUserStatus(data[i].user_id,onLineStatus);
                }
			}
		}
	});
	
	
	//监听人物上线通知
//	IM.imclient.on('2201',function(e,data){
//		if(data){
//			
//			if (data && data.result_status){
//				for (var i = 0; i < data.length; i++) {
//                    setUserStatus(data[i].user_id,onLineStatus);
//                }
//			}
//		}
//	});
	
	//监听人物改变状态通知
//	IM.imclient.on('0200',function(e,data){
//		if(data){
//			setUserStatus(data.user_id,data.status);
//		}
//	});
	//监听窗口状态的方法。-----客服
    receiveChangeRedisStatus(function(data){
    	if(data){
			setUserStatus(data.user_id,data.status);
		}
    });
    	
}

/**
 * 设置用户在线状态
 * @return
 */
function setUserStatus(userId,userStatus){
	if(userStatus == onLineStatus){
		$("#"+userId+HEAD_STATUS_Str).removeClass(offLineClass);
		$("#"+userId+HEAD_STATUS_Str).addClass(onLineClass);
	}else{
		$("#"+userId+HEAD_STATUS_Str).removeClass(onLineClass);
		$("#"+userId+HEAD_STATUS_Str).addClass(offLineClass);
	}
	if(data){
		var data = UserMap.get(userId);
		if(data){
			data.status = userStatus;
			UserMap.set(userId,data);
		}
	}
}


/**
 * 创建人物头像图标图标
 * @param online
 * @param divId
 */
function showHeadIconByPos(online,divId){
	var class_status = "wbim_head_offline";
	if(online){
		class_status = "wbim_head_inline";
	}
	var span = $("<span class='wbim_head_status a'><a href='#' class="+class_status+"/></span>");
	return span;
}

 /**
  * 判断字符串是否为空
  * @param str
  * @return
  */
function isEmptyStr(str){
	return (str && (str.length > 0));
}

/**
 * 测试
 * @param online
 */
function testShowHead(){
	for(var i=0;i<10;i++){
		var spanId = 'headTD' + i;
		$("#mytable").append("<tr><td width='100' class='row'>"+i+"号客服</td><td class='row'>2012-11-02</td></td>" +
				"<td class='row'>1515313752"+i+"</td><td id='"+ spanId +"' class='row'/></tr>");
		var bo=false;
		if(!(i%2)){
			bo=true;
		}
		showHeadIcon(bo,spanId);
	}
}