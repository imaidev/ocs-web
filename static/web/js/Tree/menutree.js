(function($) {
	var selectTree;
	var selectSampleTreeContent;
	var callBackFun;
	var menuTreeBox;//放菜单树的div
	var backDiv;
	var zNodes='';
    $.fn.v6MenuTree=function(options,callBack){
		 backDiv = $("#v6-menu-tree-backdiv");			 
    	 var opts = $.extend(true,{}, $.fn.v6MenuTree.defaults, options);   
    	 var $this=$(this);
    	 $.each($(this),function(){
    		 $this=$(this);
    		 for(j in Fun){
    			 Fun[j](opts,$this,callBack);
        	 }
    		 for(i in Events){
        		 Events[i](opts,$this,callBack);
        	 }
    		// return $this
    	 })   
    	 return  $this;
	 }
    //获取展示成tree的json串   
     $.ajax({
 			type : "post",
 		    url :  "/v6/menujson.cmd?method=query",
 		    async : false,
 			beforeSend : function(XMLHttpRequest) {				
 			},
 			success : function(data, textStatus) {	 
 				zNodes=eval("("+data+")").menu.rows;			
 			},
 			error : function(xhr) {
 				alert("接收菜单json失败");
 			}
 	 });	
     //默认参数
	 $.fn.v6MenuTree.defaults={
			 height:400,
			 width:400,
			 setting:{
				 check: {
					 enable: true,
					 chkStyle: "radio",   
					 radioType: "level"
				 },
				 data:{		
 					key:{
 						name:"text"   
 					}	
 				 },				
				view:{
						showIcon: false,
						selectedMulti: false
				},
				callback: {
				    beforeClick:beforeClick,
					onClick:onClick ,
					onCheck:onCheck,
					beforeCheck: beforeCheck   //选择radio和checkbox前的回调
				}				
			 }
	 } 
	 var Events={
		//点击清除按钮
		clearBtn:function(opts,$this){
			$("#v6-menu-tree-button-clear").bind('click',function(event){
				var nodes = selectTree.getCheckedNodes(true);
				selectTree.checkAllNodes(false);				
   			 return; 
            })	
		},
		//点击确定按钮
		okBtn:function(opts,$this,callBack){	
			$("#v6-menu-tree-button-sure").bind('click',function(event){
				 if(callBack){					
		    		 callBack(selectTree);
		    	 }				
				 backDiv.remove();
	   			 return ; 
	            })	
		},
		//点击取消按钮
		cancelBtn:function(opts,$this){
			 $("#v6-menu-tree-button-cancel").bind('click',function(event){
				 backDiv.remove();
    			 return false; 
             })	
		},
		closeContent:function(opts,$this){
			$("#close-menu-tree-content").click(function(){
				 backDiv.remove();
    			 return false; 
			});
		}
		 
	 };
	 
	 var Fun={
		 //初始化dom结构
	     initDom:function(opts,$this){	    	 
			 var divInElement='';	    	 
			 divInElement = '' +
			 '<DIV id="v6-menu-tree-backdiv">'+
	         '<DIV class="x-window x-window-plain x-window-dlg" id="menu-tree-all-content-div" >'+
	             '<DIV class="x-window-tl">'+
	                 '<DIV class="x-window-tr">'+
	                     '<DIV class="x-window-tc">'+
	                         '<DIV class="x-window-header x-unselectable x-window-draggable" id="ext-gen15" style="MozUserSelect: none; KhtmlUserSelect: none;height:100%" unselectable="on" >'+
	                             '<DIV class="x-tool x-tool-close " id="close-menu-tree-content"  style="DISPLAY: block">'+
	                                 '&nbsp;'+
	                             '</DIV>'+
	                             '<SPAN class="x-window-header-text" id="x-window-title">'+
	                                 '菜单树'+
	                             '</SPAN>'+
	                         '</DIV>'+
	                     '</DIV>'+
	                 '</DIV>'+
	             '</DIV>'+
	             '<DIV class="x-window-bwrap" id="ext-gen16">'+
	                 '<DIV class="x-window-ml">'+
	                     '<DIV class="x-window-mr">'+
	                         '<DIV class="x-window-mc">'+
	 '<!-- Start-->'+
	 		'<div id="popBodyBox">'	+   
	 		       "<div class='v6-menu-tree-box'>"+
	 			   "<div class='v6-menu-tree-head-button-div'>"+
	 			   "	<input class='dataConButton'  type='button' style='display:none' />"+
	 			   "	<input class='topFunButton' id='v6-menu-tree-button-sure'  type='button' value='确定' />"+
	 			   "	<input class='topFunButton' id='v6-menu-tree-button-cancel'  type='button' value='取消' />"+
	 			   "	<input class='topFunButton' id='v6-menu-tree-button-clear' type='button' value='清除' />"+
	 			   "</div>"	+
	 			   "<div class='v6-menu-tree-div-content'><ul id='v6-menu-tree-ul' class='ztree'></ul></div>"+
	 			   "</div>"+
	 			 		
	 		'</div>'+
	 '<!-- End-->'+
	                         '</DIV>'+
	                     '</DIV>'+
	                 '</DIV>'+
	                 '<DIV class="x-window-bl">'+
	                     '<DIV class="x-window-br">'+
	                         '<DIV class="x-window-bc">'+
	                             '<DIV class="x-window-footer" id="ext-gen18"></DIV>'+
	                         '</DIV>'+
	                     '</DIV>'+
	                 '</DIV>'+
	             '</DIV>'+
	            
	         '</DIV>'+
	         '</DIV>';
	    	 
	    	 
	    	 
            
			
			 $("body").append(divInElement);
			 menuTreeBox = $("#menu-tree-all-content-div");	 
			 backDiv = $("#v6-menu-tree-backdiv");
	     }, 
	     //定义样式
	     domCss:function(opts,$this){
	    	 backDiv.height(document.body.clientHeight>document.documentElement.clientHeight?document.body.clientHeight:document.documentElement.clientHeight);
	    	 backDiv.width(document.body.clientWidth>document.documentElement.clientWidth?document.body.clientWidth:document.documentElement.clientWidth);
	    	 backDiv.css("display","block");
	    	// $(".v6-menu-tree-box").width(opts.width);
	    	// $(".v6-menu-tree-box").height(opts.height);
	    	 $("#menu-tree-all-content-div").width(opts.width);
	    	 $("#menu-tree-all-content-div").height(opts.height);
	    	 
	    	 $(".x-window-ml").height(opts.height-$(".x-window-tl").height());
	    	 $(".x-window-mr").height(opts.height-$(".x-window-tl").height());
	    	 $(".v6-menu-tree-box").width(opts.width-12);
	    	 $(".v6-menu-tree-box").height(opts.height-$(".x-window-tl").height());
	    	 $(".v6-menu-tree-div-content").height(opts.height-$(".v6-menu-tree-head-button-div").height()-$(".x-window-tl").height());
	    	 
	    	 
	     },
	     //弹出框位置
	     domPosition:function(opts,$this){
			 var objWidth = menuTreeBox.width();
			 var objHeight = menuTreeBox.height();
			 if(document.body.clientWidth>document.documentElement.clientWidth){
				 var bodyWidth=document.body.clientWidth;
			 }else{
				 var bodyWidth=document.documentElement.clientWidth;
			 }			 
			 if(document.body.clientHeight>document.documentElement.clientHeight){
				 var bodyHeight=document.body.clientWidth;
			 }else{
				 var bodyHeight=document.documentElement.clientHeight
			 };
			 var leftWidth = parseInt((bodyWidth-objWidth)/2);
			 var topHeight = parseInt((bodyHeight-objHeight)/2);
			 menuTreeBox.css({
				top:topHeight+"px",
				left:leftWidth+"px"
			 });

	     },
	     loadTree:function(opts,$this){
	    	 opts.setting.check.chkStyle=opts.chkStyle;
	    	 selectTree=$.fn.zTree.init($("#v6-menu-tree-ul"), opts.setting,zNodes); 
	    	 //取消a标签的跳转
	    	 $("#v6-menu-tree-ul a").live('click',function(){
	    		 return false;
	    	 });
	     }
			 
	 };	 
	 function removeSelectTree(opts,$this){
		 $this.live("blur",function(){ 
				 $(".selectSampleTreeContent",$this).remove();
			 })
	 }	
	 function onClick(){
		 return ;
	 }
	 function onCheck(){
			 return ; 
	 }
	 //点击文字自动选中checkbox
	 function beforeClick(treeId, treeNode) {
			selectTree.checkNode(treeNode, !treeNode.checked, null, true);
			return true;
	 };
	 function beforeCheck(treeId, treeNode, clickFlag){
		 return !treeNode.isParent;//当是父节点 返回false 不让选取 
	 }
	 function hideMenuTreeContent(){
		 backDiv.remove();
	 }
})(jQuery);