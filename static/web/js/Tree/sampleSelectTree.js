(function($) {
	var selectTree;
	var selectSampleContent;
	var callBackFun;
	var activeDivContent='';//当前激活的下拉div容器
	var sureButton = '';//当前确定按钮
	var clearButton ='';//当前清除按钮
	var cancelButton = '';//当前取消按钮
	var activeTree='';//当前树形组件
	var ifTree = false ;//树是否已加载
	var activeTreeId='';
     $.fn.v6SampleSelectTree=function(options,callBack,cancalCallBack,clearCallBack){
    	 var opts = $.extend(true,{}, $.fn.v6SampleSelectTree.defaults, options);   
    	 var $this=$(this);   	 
    	 $.each($(this),function(){
    		 $this=$(this);
    		 for(i in Events){
        		 Events[i](opts,$this,callBack,cancalCallBack,clearCallBack);
        	 }
    		// return $this
    	 })   
    	 return  $this;
	 }
     //默认参数
	 $.fn.v6SampleSelectTree.defaults={
			 selectHeight:200,
			 selectWidth:200,
			 setting:{
				 callback: {
				    beforeClick:beforeClick,
					onClick:onClick ,
					onCheck:onCheck
				}				
			 }
	 } 
	 function initSelectTree(opts,$this){
		// Events.selectClick();
	 }
	 var Events={
	    //点击向下的箭头
		arrowClick:function(opts,$this,callBack,cancalCallBack,clearCallBack){	
			$(".sampleSelectTreeBtn",$this).click(function(event){
				$(".selectSampleTreeContent").hide();
				ifTree = false ;
				selectSampleContent=$this;	
				initDom(opts,$this);
				loadTree(opts,$this);
				domCss(opts,$this);
				domPosition(opts,$this);
				if(!ifTree){
				   removeSelectTree(opts,$this);
				   for(j in InSampleContentEvent){
					InSampleContentEvent[j](opts,$this,callBack,cancalCallBack,clearCallBack);
	        	   }
			    }
				event.stopPropagation();
			})
		}	
	 };
	//下拉div内部元素事件绑定
	 var InSampleContentEvent={
		//点击清除按钮
			clearBtn:function(opts,$this,callBack,cancalCallBack,clearCallBack){
				clearButton.live('click',function(event){
	           	 selectTree.checkAllNodes(false);
	           	 $(".sampleSelectTreeText",selectSampleContent).val("");
	           	 if(clearCallBack){
	           		clearCallBack(); 
	           	 }
	           	 event.stopPropagation();
	   			     return; 
	            })	
			},
			//点击确定按钮
			okBtn:function(opts,$this,callBack){	
				sureButton.live('click',function(event){
					if(callBack){
			    		 callBack(selectTree);
			    	 }
					 activeDivContent.hide();
					 event.stopPropagation();
		   			 return; 
		            })	
			},
			//点击取消按钮
			cancelBtn:function(opts,$this,callBack,cancalCallBack,clearCallBack){
				cancelButton.live('click',function(event){
	            	 //selectTree.checkAllNodes(false);
					 activeDivContent.hide();
					 if(cancalCallBack){
						 cancalCallBack(); 
			           	 }
	    			 event.stopPropagation();
	    			 return; 
	             })	
			}
	 }
	 function removeSelectTree(opts,$this){
		 $this.live("blur",function(){ 
			 activeDivContent.hide();
			 })
	 }
	 //初始化dom结构
	 function initDom(opts,$this){
		 var divInElement=[];
		 var thisId = $this.attr("id");
		 var contentId = "selectSampleTreeContent"+thisId;
		 var sureButtonId = "v6_selectTree_button_sure"+thisId;
		 var cancelButtonId = "v6_selectTree_button_cancel"+thisId;
		 var clearButtonId = "v6_selectTree_button_clear"+thisId;
		 activeTreeId = "v6_ztree"+thisId;
		 
         if($("#"+contentId).length===0){
        	 divInElement.push("<div id="+contentId+" class='selectSampleTreeContent'>");
    		 divInElement.push("<div class='v6_selectTree_head_button_div'>");        //按钮区域
    	     divInElement.push("	<input class='v6_selectTree_button' id='' type='button' style='display:none' />");//没有发现bug引起的原因，临时添加隐藏的button
    		 divInElement.push("	<input id="+sureButtonId+" class='v6_selectTree_button v6_selectTree_button_sure'  type='button' value='确定' />");
    		 divInElement.push("	<input id="+cancelButtonId+" class='v6_selectTree_button v6_selectTree_button_cancel' style='display:none'  type='button' value='取消' />");
    		 divInElement.push("	<input id="+clearButtonId+" class='v6_selectTree_button v6_selectTree_button_clear'  type='button' value='清空' />");
    		 divInElement.push("</div>");
    		 divInElement.push("<div style='clear:both'></div>");
    		 divInElement.push("<div class='v6_concreteSampleSelectTreeDiv'><ul id="+activeTreeId+" class='ztree'></ul></div>");  //树形区域
    		 divInElement.push("</div>")
    		 $("body").prepend(divInElement.join('')); 
    		 activeDivContent = $("#"+contentId);
    		 sureButton= $("#"+sureButtonId);
    		 cancelButton= $("#"+cancelButtonId);
    		 clearButton= $("#"+clearButtonId);
    		 activeTree=$("#"+activeTreeId);
         }else{
        	 ifTree=true;
        	 activeDivContent = $("#"+contentId);
        	 sureButton= $("#"+sureButtonId);
    		 cancelButton= $("#"+cancelButtonId);
    		 clearButton= $("#"+clearButtonId);
        	 activeDivContent.show();  
         }
		
	 }
	 function loadTree(opts,$this){
		 if(!ifTree){
			 selectTree=$.fn.zTree.init(activeTree, opts.setting,opts.zNodes); 
		 }else{
			 selectTree = $.fn.zTree.getZTreeObj(activeTreeId);
		 }	 
	 }
	 function domCss(opts,$this){
		 activeDivContent.height(opts.selectHeight);
		 activeDivContent.width(opts.selectWidth);
		 $(".v6_concreteSampleSelectTreeDiv",activeDivContent).height(opts.selectHeight-32);//为了让树超长的时候出现滚动条
	 }
	 //定义下拉出div的位置
	 function domPosition(opts,$this){
		 var objPositionLeft = $this.offset().left;         //当前对象的位置
		 var objPositionTop = $this.offset().top;
		 var objWidth = $this.width();
		 var objHeight = $this.height();
		 var bodyWidth = document.body.clientWidth;
		 var bodyHeight = document.body.clientHeight;
		 var twoWidth = objPositionLeft+objWidth;
		 if(opts.selectWidth<=twoWidth){                         //定义下拉div的水平位置
			 activeDivContent.css({                        
			    	left:(twoWidth-opts.selectWidth)+"px"
			    });
		    }else{
		    	activeDivContent.css({                        
			    	left:objPositionLeft+"px"
			    });	
		    };
		 if(bodyHeight>opts.selectHeight){
			 if((bodyHeight-objPositionTop-objHeight)>=opts.selectHeight){
				 activeDivContent.css({                        
				    	top:(objHeight+objPositionTop+2)+"px"
				    });
			 }else{
				 activeDivContent.css({                        
					 top:(objHeight+objPositionTop+2)+"px"
				    });
			 }	 
		 }else{
			 activeDivContent.css({                        
			    	top:objHeight+"px"
			    }); 
		 }	 
	 }
	 function onClick(){
		var selectTreeNode = selectTree.getSelectedNodes(true);
		var selectedName="";
		var selectedId="";
		 for (var i=0, l=selectTreeNode.length; i<l; i++) {
		        if(selectTreeNode[i].isParent==false){
		           selectedName += ","+selectTreeNode[i].name;
		           selectedId += ","+selectTreeNode[i].id;
		           selectTree.checkNode(selectTreeNode[i],true,true);
		        }
		   }
		 selectedName=selectedName.substring(1,selectedName.length);
		 selectedId=selectedId.substring(1,selectedId.length);
         $(".sampleSelectTreeText",selectSampleContent).val(selectedName);
		 return selectedId;
	 }
	 function onCheck(){
		 var selectTreeNode = selectTree.getCheckedNodes(true);
			var selectedName="";
			var selectedId="";
			 for (var i=0, l=selectTreeNode.length; i<l; i++) {
			        if(selectTreeNode[i].isParent==false){
			           selectedName += ","+selectTreeNode[i].name;
			           selectedId += ","+selectTreeNode[i].id;
			        }
			   }
			 selectedName=selectedName.substring(1,selectedName.length);
			 selectedId=selectedId.substring(1,selectedId.length);
			 $(".sampleSelectTreeText",selectSampleContent).val(selectedName);
			 return selectedId; 
	 }
	 function beforeClick(){
	 }
})(jQuery);