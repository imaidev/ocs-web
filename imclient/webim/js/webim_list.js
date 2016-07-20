/**
 * 用户设置在线状态、切换好友与群组、获取最近联系人等操作
 */
var WebIMList = function() {
	
};

(function( $ ) {
	/**
	 * 好友列表界面操作
	 */
	WebIMList.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		isOpen: false,
		status: 1,
		tabIndex:0,
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			this.webim = webim;
			this.ptag = this.webim.tag;
			if(this.ptag.node){
				this.tag = this.ptag.node("wbim_list_expand");
			}
			
			this.listenerTagEvent();
			this.listener();
		},
		
		/**
		 * 处理列表内部事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			
			var wbimListTag = this.tag.find(".wbim_list_tab");
			var wbimListBox = this.tag.find(".wbim_list_box");
			wbimListTag.find("li").removeClass("curr").eq(0).addClass("curr");//默认切换到好友列表
			// 列表切换（好友、群组、最近联系人）
			wbimListTag.find("li").click(function(e) {
				//获取当前选中标签的索引
				$this.tabIndex = -1;
				$.each(wbimListTag.find("li"), function(i, atag) {
					if(atag == e.currentTarget) {
						$this.tabIndex = i;
						return false;
					}
				});
				showWbimList($this);
			});
			
			//显示好友列表
			var showWbimList = function($this){
				//标签页
				wbimListTag.find("ul").css("display","block");
                wbimListTag.find("li").removeClass("curr").eq($this.tabIndex).addClass("curr");
                //中间内容
                wbimListBox.find(".wbim_list_friend").css("display", "none").eq($this.tabIndex).css("display", "");
                
                
                if($this.tabIndex == 1){//最近联系人
                	$this.webim.getNearFriends();
                }
			};
			
			// 用户在线状态设置
			var status = this.tag.node("status_manager");
			var status_arrow = this.tag.node("wbim_status_tit_arrow");
			status.hover(function(e) {
				$(e.currentTarget).find("ul").css("display", "block");
				status.parent().addClass("wbim_tit_lf_hover");
				
				if(status_arrow){
					status_arrow.removeClass("wbim_status_tit_arrow");
                    status_arrow.addClass("wbim_status_tit_arrow_hover");
				}
			}, function(e) {
				$(e.currentTarget).find("ul").css("display", "none");
				status.parent().removeClass("wbim_tit_lf_hover");
				
				if(status_arrow){
                    status_arrow.removeClass("wbim_status_tit_arrow_hover");
                    status_arrow.addClass("wbim_status_tit_arrow");
                }
			});
			// 用户选择在线状态
			status.find("ul li").click(function(e, s) {
				var $target = $(e.currentTarget);
				
				//断网情况下不可以设置状态
				if(!$this.webim.isConnected){
					$target.parent().css("display", "none");
//					$this.tag.node("status_manager").parent().removeClass("wbim_tit_lf_hover");
				    return;
				}
				
				
				var value = $target.attr("data-status");
				if($this.status != value) {
				
					var type = $this.webim.getUserStatusStyle(value);
					
					var h = $target.find("a").clone();
					h.node("wbim_status_label").addClass("txt");
					var tit = status.node("wbim_status_tit");
					tit.empty();
					tit.append(h.html());
					
					//$this.webim.setUserStatusStyle(tit, type);
					$target.parent().css("display", "none");
					
					status.find("ul li").removeClass("wbim_status_selected");
					$target.addClass("wbim_status_selected");
					
					$this.status = value;
					$this.trigger(E.SELF_STATUS_CHANGE, {status: value, cla:type, s: s});
					
				}
			});
			
			// 监听最小化按钮点击
			this.tag.node("wbim_icon_mini").click(function(e) {
				$this.hideIMListBox();
			});
			// 监听关闭按钮点击
			this.tag.node("wbim_clicknone").click(function(e) {
				$this.hideIMListBox();
			});
			// 监听列表头部点击
			this.tag.node("wbim_titin").click(function(e) {
				if(e.target == e.currentTarget) {
					$this.hideIMListBox();
				}
			});
			
			var friendlist = this.tag.node("wbim_list_friendlist");
			var nearlist = this.tag.node("wbim_list_nearlist");
			
			// 监听其他用户状态改变
			this.tag.on("listSetUserStatus", function(e, data){
				var type = $this.webim.getUserStatusStyle(data);
				var user = friendlist.find("li[uid=" + data.uid + "]");
				$this.webim.setUserStatusStyle(user, type);
				user = nearlist.find("li[uid=" + data.uid + "]");
				$this.webim.setUserStatusStyle(user, type);
				
				$this.listSort();
			})
			.on("listSetServiceStatus", function(e, data) {
				var service = friendlist.find("li[data-value="+data.value+"]");
				var type = $this.webim.getUserStatusStyle(data.status);
				$this.webim.setUserStatusStyle(service, type);
				
				$this.listSort();
			})
			.on("showSearchList", function(e) {
				wbimListTag.find("ul").css("display", "none");
				wbimListBox.find(".wbim_list_friend").css("display", "none");
				wbimListBox.node("wbim_list_searchlist").css("display", "block");
			})
			.on("hideSearchList", function(e) {
				wbimListTag.find("ul").css("display", "block");
				wbimListTag.find(".curr a").trigger("click");
			});
			
			// 搜索好友
			var search = this.tag.find("#wbim_search");
			search.ui_prompt({prompt:L.searchLabel});
			var searching = function(e) {
				var str = search.val();
				if(str) {
					var arr = $this.webim.getSearchFriends(str);
					$this.setSearchFriends(arr);
				} else {
//					$this.setSearchFriends(null);
					showWbimList($this);
				}
			};
			search.keyup(function(e) {
				searching(e);
			});
		},
		
		/**
		 * 将当前用户状态设置为离线(断网时调用)
		 */
		changeStatusLeaveLine:function(){
			var tit = this.tag.node("status_manager").node("wbim_status_tit");
            tit.empty();
            tit.append("<span class='wbim_status_offline'></span><span class='wbim_status_label txt' node-type='wbim_status_label'>"+properties.webimlist_offline+"</span>");
		    this.status = "3";
		},
		
		/**
		 * 显示好友列表
		 */
		showIMListBox: function(s) {
			this.tag.css("display", "block");;
			this.isOpen = true;
			
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
		},
		/**
		 * 隐藏好友列表
		 */
		hideIMListBox: function(s) {
			this.tag.css("display", "none");;
			this.isOpen = false;
			
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
		},
		/**
		 * 设置用户的好友
		 * @param data
		 */
		setFriends: function(data) {
			var $this = this;
			
			var str = '<div class="wbim_list_group">';
			var hf = false;
			$.each(data, function(i, obj) {
				str += '<div class="wbim_list_group_tit wbim_open" data-open="false" data-type="'+obj.type+'" title="' + obj.gname + '">' + obj.gname + ' [ <span node-type="wbim_onlinecount" title="' + L.onlineLabel + '">0</span> ]</div>';
				str += '<ul style="display:block">';
				$.each(obj.gmember, function(j, obj2) {
					str += $this.getLiTag(obj2);
					hf = true;
				});
				str += '</ul>';
			});
			
			str += '</div>';
			
			// 没有好友
			if(!hf) return;
			
			var friendlist = this.tag.node("wbim_list_friendlist");
			friendlist.empty();
			friendlist.append(str);
			
			this.listSort();
			
			// 好友分组操作
			friendlist.find(".wbim_list_group_tit").click(function(e) {
				var $target = $(e.currentTarget);
				var $list = $target.next();
				var open = $target.attr("data-open");
				if(open == "true") {
					$target.removeClass("wbim_open");
					$target.addClass("wbim_close");
					$list.css("display", "none");
					$target.attr("data-open", "false");
				} else if(open == "false") {
					$target.addClass("wbim_open");
					$target.removeClass("wbim_close");
					$list.css("display", "block");
					$target.attr("data-open", "true");
					
					$this.webim.checkService();
				}
				
			});
			
			// 监听点击某个好友，打开聊天窗口
			friendlist.find("li").click(function(e) {
				$this.openChatBoxHandler($this,$(e.currentTarget));
			});
		},
		/**
		 * 设置群
		 * @param data
		 */
		setGroups: function(data) {
			var $this = this;
			var groupList = this.tag.node("wbim_list_grouplist");
			if(data && (data.length>0)){
				var str = '<div class="wbim_list_group">';
				str += '<ul>';
				$.each(data, function(i, obj) {
					str += '<li id="' +obj.gid+ '" title="' +obj.gname+'" data-icon="' +obj.icon+ '" gmember="' +obj.gmember+ '">'
					+'<div class="wbim_userhead"><img src="' + obj.icon + '"><span style="display:none;" class="wbim_icon_msg_s"></span><span node-type="wbim_status"></span></div>'
					+ '<div class="wbim_username">' + obj.gname + '</div></li>';
				});
				str += '</ul>';
				str += '</div>';
				
				groupList.empty();
				groupList.append(str);
				
				// 监听点击打开聊天窗口
				groupList.find("li").click(function(e) {
					var $target = $(e.currentTarget);
					var data = {uid: $target.attr("uid"), uname:$target.attr("uname"),
								icon: $target.attr("icon"),way:"group",gmember:"gmember"};
					$this.trigger(E.OPEN_CHATBOX, data);
				});
			}
		},
		/**
		 * 设置最近联系好友
		 * @param data
		 */
		setNearFriends: function(data) {
			var nearlist = this.tag.node("wbim_list_nearlist");
			if(data.length > 0) {
				this.createFriendList(data, nearlist);
			}
		},
		/**
		 * 设置搜索出的好友
		 * @param data
		 */
		setSearchFriends: function(data) {
			var $this = this;
			var searchlist = this.tag.node("wbim_list_searchlist");
			if(data) {
				if(data.length > 0) {
					this.createFriendList(data, searchlist);
				} else {
					searchlist.empty();
					searchlist.append('<p class="noresult_warn"><p class="warn_icon"/>' + L.searchNoneLabel + '</p>');
					searchlist.parent().bind("click", function(e) {
						searchlist.parent().unbind("click");
						$this.innerTrigger("hideSearchList");
					});
				}
				$this.innerTrigger("showSearchList");
			} else {
				$this.innerTrigger("hideSearchList");
			}
		},
		createFriendList: function(data, parentTag) {
			var $this = this;
			
			var str = '<div class="wbim_list_group">';
			str += '<ul>';
			$.each(data, function(j, s) {
				var user = $this.webim.getFriend(s.uid);
				if(!user)
					user = s;
				str += $this.getLiTag(user);
			});
			str += '</ul>';
			str += '</div>';
			
			parentTag.empty();
			parentTag.append(str);
			
			// 点击好友打开聊天窗口
			parentTag.find("li").click(function(e) {
				$this.openChatBoxHandler($this,$(e.currentTarget));
			});
		},
		
		/**
		 * 从点击的li获取数据打开聊天框
		 */
		openChatBoxHandler:function($this,$target){
			
                var skill = $target.attr("data-skill");//技能，区分客服与普通用户
                
                //在线客服和普通用户
                if($this.webim.isService(skill)) {
                    var obj = {name: $target.attr("data-name"),
                            type: $target.attr("data-type"),
                            value: $target.attr("data-value"),
                            icon: $target.attr("data-icon"),
                            skill: $target.attr("data-skill")};
                    $this.webim.getService(obj);
                } else {
                    var data = {
                       icon:$target.attr("icon"),
                       uid:$target.attr("uid"),
                       uname:$target.attr("uname"),
                       skill:$this.webim.getDefaultSkill($target.attr("skill"))
                    };
                    $this.trigger(E.OPEN_CHATBOX, data);
                }
		},
		
		/**
		 * 获取好友列表中单项的HTML代码
		 * @param data
		 * @returns {String}
		 */
		getLiTag: function(data) {
			var str = "";
			if(data.tag == "service") {
				
				//默认是在线客服
				if(isEmpty(data.skill)){
				    data.skill = "2";
				}
				
				//将在线客服的默认状态统一设为不在线
				data.status = 3;
				
				//将智能机器人设置为在线
				if(this.webim.isRobot(data.skill)){
					data.status = 1;
//					data.uname = "小city";
				}
				
				//组装数据
                str = ' tagtype="'+data.tag+'" data-name="'+data.uname+'" data-value="'+data.uid+'" data-type="'+data.type+'" data-skill="'+data.skill+'" data-icon="' + data.icon;
			}
			
			var status_style = this.webim.getUserStatusStyle(data);
			
			return '<li uid="' + data.uid + '" '+str+'" uname="' + data.uname + '" data-status="'+data.status
			+ '" skill="' + data.skill
			+ '" icon="' + data.icon+'" class="" data-sort="' + status_style + '">'
			+ '<div class="wbim_userhead"><img src="' + data.icon + '"><span style="display:none;" class="wbim_icon_msg_s"></span><span node-type="wbim_status" class="' + status_style + '"></span></div>'
			+ '<div class="wbim_username">' + data.uname + '</div></li>';
		},
		/**
		 * 好友列表排序
		 */
		listSort: function() {
			var friendlist = this.tag.node("wbim_list_friendlist");
			
			var alll = 0;
			var onnn = 0;
			var groups = friendlist.find("ul");
			$.each(groups, function(i, ul) {
				var $ul = $(ul);
				var $group = $ul.prev();
				var onlines = $ul.find("li[data-sort=wbim_status_online]");
				var busys = $ul.find("li[data-sort=wbim_status_busy]");
				var offlines = $ul.find("li[data-sort=wbim_status_offline]");
				$ul.prepend(busys);
				$ul.prepend(onlines);
				
				var on = onlines.length + busys.length;
				var len = on + offlines.length;
				$group.node("wbim_onlinecount").text(on + "/" + len);
				
				onnn += on;
				alll += len;
			});
			
			var data = new Object();
			data.on = onnn;
			data.all = alll;
			this.trigger(E.ONLINES, data);
		},
		/**
		 * 获取当前界面的显示状态
		 * @returns {___data0}
		 */
		getViewStatus: function() {
			var data = new Object();
			data.isOpen = this.isOpen;
			data.status = this.status;
			return data;
		},
		/**
		 * 设置当前界面的显示状态
		 * @param data
		 */
		setViewStatus: function(data) {
			if(data.isOpen)
				this.showIMListBox(E.DO_NOT_CONTROL);
			else
				this.hideIMListBox(E.DO_NOT_CONTROL);
			
			var status = this.tag.node("status_manager");
			status.find("ul li[data-status=" + data.status + "]").trigger("click", E.DO_NOT_CONTROL);
		},
		/**
		 * 监听外部操作事件
		 */
		listener: function() {
			var $this = this;
			this.ptag.on(E.OPEN_LIST, function(e, data) {
				$this.showIMListBox();
			}).on(E.CLOSE_LIST, function(e, data) {
				$this.hideIMListBox();
			}).on(E.SET_USER_STATUS, function(e, data) {
				$this.innerTrigger("listSetUserStatus", data);
			}).on(E.SELF_STATUS_CHANGE, function(e, data) {
				var status = $this.tag.node("status_manager");
				status.find("ul li[data-status=" + data.status + "]").trigger("click", data.s);
			}).on(E.SET_SERVICE_STATUS, function(e, data) {
				$this.innerTrigger("listSetServiceStatus", data);
			});
		},
		/**
		 * 触发外部操作事件，供其他组件监听
		 * @param type
		 * @param data
		 */
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		/**
		 * 触发内部操作事件
		 * @param type
		 * @param data
		 */
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		}
	};
	
})(jQuery);