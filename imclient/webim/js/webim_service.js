/**
 * 在线客服选择模块设计
 * 
 */
/**
 * 在线客服按钮
 */
var ChatService = function(){
	this.init();
};

ChatService.prototype = {
	$body:null,
	onlineBtn:null,
	chooser:null,
	init:function(){
		this.$body = $('body');
		this.initOnlineButton();
		this.initEvent();
	},
	initOnlineButton:function(){
		var onlineTpl = '<a href="javascript:void(0);" class="online_service"></a>';
		this.$body.append(onlineTpl);
		this.onlineBtn = this.$body.find('.online_service');
	},
	initEvent:function(){
		var $this = this;
		this.onlineBtn.on("click",function(){$this.showChooser();});
	},
	showChooser:function(){
		if(this.chooser){
			this.chooser.show();
		}else{
			this.chooser = new ServiceChooser();
			this.chooser.init(this.onlineBtn);
		}
	}
};
/**
 * 客服选择窗口
 * 
 * 
 */
var ServiceChooser = function(){
};
ServiceChooser.prototype = {
	$body:null,
	$online:null,
	box:null,
	titleBar:null,
	closeBtn:null,
	content:null,
	itemArray:[],
	itemTpl:'<span class="chooser_item"><img class="item_img"/><a href="javascript:void(0);" class="item_a"></a></span>',
	isComplete:false,
	boxPosition:{disLeft:0,disTop:0,disWidth:0,disHeight:0,origLeft:0,origTop:0,origWidth:0,origHeight:0},
	/**
	 * 初始化box，将onlineBtn按钮引用传入
	 * @param onlineBtn
	 */
	init:function(onlineBtn){
		this.$body = $('body');
		this.$online = onlineBtn;
		this.boxPosition.origLeft = this.$online.position().left;
		this.boxPosition.origTop = this.$online.position().top;
		this.getServiceList();
		//this.testLoadResponse();
	},
	getServiceList:function(){
		$.ajax({url:IM_CONFIG.GET_COM_URL,
			success:this.loadResponse,
			error:this.loadError,
			type:'GET',
			async:true,
			context:this
		});
	},
	/**
	 * 加载成功
	 * @param data
	 * @param textStatus
	 * @param jqXHR
	 */
	loadResponse:function(data, textStatus, jqXHR){
		if(data == null){
			alet('request data is blank');
			return;
		}
		data = $.parseJSON(data);
		this.initBox(data);
		this.initEvent();
		this.showBox();
		this.isComplete = true;
	},
	/**
	 * 测试加载成功
	 * @param data
	 * @param textStatus
	 * @param jqXHR
	 */
	testLoadResponse:function(){
		data = '[{"name":"\u5546\u4e1a\u516c\u53f8","items":[{"value":"19999991","name":"A\u5e02\u516c\u53f8","type":"com"}]},{"name":"\u5de5\u4e1a\u516c\u53f8","items":[{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"},{"value":"20370001","name":"\u5c71\u4e1c\u4e2d\u70df","type":"com"}]}]';
		data = $.parseJSON(data);
		this.initBox(data);
		this.initEvent();
		this.showBox();
		this.isComplete = true;
	},
	/**
	 * 加载失败
	 * @param xhr
	 * @param textStatus
	 * @param errorThrown
	 */
	loadError:function(xhr, textStatus, errorThrown){
		if(xhr.status === 404){
			alert('request 404 error please again');
		}
	},	
	initBox:function(data){
		//初始化窗口容器
		var winTpl = '<div class="chooser_box"></div>';
		this.$body.append(winTpl);
		this.box = this.$body.find('.chooser_box');
		this.box.css('visibility','hidden');
		var titleTpl = '<span class="chooser_title">请选择您要咨询的客服：</span>';
		this.box.append(titleTpl);
		this.titleBar = this.box.find('.chooser_title');
		//初始化关闭按钮
		var closeTpl = '<a href="javascript:void(0);" class="chooser_close"></a>';
		this.box.append(closeTpl);
		this.closeBtn = this.box.find('.chooser_close');
		//初始化内容容器
		var contentTpl = '<div class="chooser_content"></div>';
		this.box.append(contentTpl);
		this.content = this.box.find('.chooser_content');
		//initial content
		var last=null;
		for(var i=0,len=data.length;i<len;i++){
			var tempObj = data[i];
			var tempName = tempObj.name;
			var tempItems = tempObj.items;
			for(var j=0,jlen=tempItems.length;j<jlen;j++){
				var tempItem = tempItems[j];
				this.content.append(this.itemTpl);
				last = this.content.children('.chooser_item').last();
				var imgfirst = last.children('.item_img').last();
				var alast = last.children('.item_a').last();
				alast.on('click',{'$this':this,'itemData':tempItem},this.itemClick);
				
				if(tempName=='商业公司'){
					imgfirst.attr('src',WEB_IM_CONFIG.project_address+'images/business.png');
					alast.text(tempItem.name);
				}else if(tempName == '工业公司'){
					imgfirst.attr('src',WEB_IM_CONFIG.project_address+'images/industry.png');
					alast.text(tempItem.name);
				}
				this.itemArray.push(last);
			}
		}
		//调整窗口高度
		var contentHeight = Math.ceil(this.itemArray.length/5)*last.outerHeight(true)+20;
		var titleHeight = this.titleBar.outerHeight(true);
		this.content.css('top',titleHeight);
		this.content.height(contentHeight);
		this.box.height(this.content.outerHeight(true)+titleHeight);
		//计算box的最终宽度
		this.boxPosition.disWidth = this.box.width();
		this.boxPosition.disHeight = this.box.height();
	},
	
	showBox:function(){
		this.box.width(this.boxPosition.origWidth);
		this.box.height(this.boxPosition.origHeight);		
		this.box.css('top',this.boxPosition.origTop);
		this.box.css('left',this.boxPosition.origLeft);
		
		var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		var disLeft = (clientWidth - this.boxPosition.disWidth)/2;
		var disTop = (clientHeight - this.boxPosition.disHeight)/2;
		
		this.box.css('visibility','visible');
		this.box.animate({top:disTop,left:disLeft,width:this.boxPosition.disWidth,height:this.boxPosition.disHeight},300,function(){
			
		});
	},
	hiddenBox:function(){
		var $this = this;
		this.box.animate({top:this.boxPosition.origTop,left:this.boxPosition.origLeft,width:this.boxPosition.origWidth,height:this.boxPosition.origHeight},300,function(){
			$this.box.css('visibility','hidden');
		});
	},
	initEvent:function(){
		var $this = this;
		this.closeBtn.on('click',function(){
			//隐藏box
			$this.hiddenBox();
		});
	},
	show:function(){
		if(!this.isComplete){
			this.getServiceList();
		}else{
			if(this.box.css('visibility') != 'visible'){
				this.showBox();
			}
		}
	},
	itemClick:function(event){
		var $this = event.data.$this;
		var itemData = event.data.itemData;
		try{
			if(webim != undefined){
				webim.trigger('onservice',itemData);
			}
		}catch(e){
		}
		$this.closeBtn.click();
	}
};


$(document).ready(function(){
	var chatService = new ChatService();
});



