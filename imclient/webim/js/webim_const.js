var IM_CONFIG = {
	DEFAULT_ICON: "images/untitled.png"
};

var L = {
	onlineLabel:properties.webimconst_online_friends,
	myfriendLabel:properties.webimconst_my_friends,
	userOfflineBusy:properties.webimconst_other_busy,
	searchLabel:properties.webimconst_find_contact,
	searchNoneLabel:properties.webimconst_nofind_contact,
	failedLabel: properties.webimconst_nosend_msg,
	defaultName: properties.webimconst_user,
	hasMessageLabel: properties.webimconst_new_msg,
	noneNickName:properties.webimconst_anonymous_user,
	serviceLabel:properties.webimconst_service_foryou,
	pingServiceLabel:properties.webimconst_service_scoring,
	serviceSendLabel:properties.webimconst_sent_score,
	noneServiceLabel:properties.webimconst_nofree_service,
	historyLabel:properties.webimconst_chat_log,
	serviceLabel: "%s",
	salemanLabel: properties.webimconst_mymanager
};

var E = {
	
	INIT_USER_INFO:"wbim_init_user_info",
	GET_USER_INFO:"wbim_get_user_info",
	
	OPEN_LIST:"wbim_event_openlist",
	CLOSE_LIST:"wbim_event_closelist",
	
	OPEN_CHATBOX:"wbim_event_openchatbox",
	CLOSE_CHATBOX:"wbim_event_closechatbox",
	HIDE_CHATBOX:"wbim_event_hidechatbox",
	ADD_CHAT_USER:"wbim_event_addchatuser",
	
	CURRENT_USER:"wbim_event_currentuser",
	
	SET_USER_STATUS:"wbim_event_setUserStatus",
	SET_SERVICE_STATUS:"wbim_event_setServiceStatus",
	SELF_STATUS_CHANGE:"wbim_event_selfstatuschange1",
	ONLINES:"wbim_event_onlines",
	
	ON_SEND_MESSAGE:"wbim_event_sendmessage",
	ON_ACCEPT_MESSAGE:"wbim_event_acceptmessage",
	ON_SEND_CONTROL:"wbim_event_sendcontrol",
	DO_NOT_CONTROL:"wbim_event_donotcontrol",
	
	GET_CHAT_INFO:"wbim_event_getchatinfo",
	HAS_MESSAGE:"wbim_event_hasmessage",
	ADD_MULMESSAGE:"wbim_event_addmulmessage",
	ADD_HISTORYMESSAGE:"wbim_event_addhistorymessage",
	
	OPEN_SYSTEM_MESSAGE:"wbim_event_openSysMsg",
	CLOSE_SYSTEM_MESSAGE:"wbim_event_closeSysMsg",
	CHANGE_SYSTEM_MESSAGE:"wbim_event_changeSysMsg",
	SHOW_SYSTEM_TIP:"wbim_event_showSysMsgTip",
	CANCEL_SYSTEM_TIP:"wbim_event_cancelSysMsgTip"
};

var F = {
		FILE_START_STR:"file-start",
		FILE_IMG_STR:"file-start&type=image&id=",
		FILE_DOC_STR:"file-start&type=doc&id=",
		FILE_NAME_STR:"&name=",
		FILE_END_STR:"file-end",

		FILE_IMG_REP:/file-start&type=image&id=/,
		FILE_FILE_REP:/file-start&type=doc&id=/,
		
		FILE_IMG_RES:/file-start&type=image&path=/,
		FILE_FILE_RES:/file-start&type=doc&path=/
};