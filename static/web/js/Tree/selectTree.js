(function($) {
	var selectTree;
	var forHover=0;
	var thisLabelClick;
	var thisInputVal='';
	var isExistSelectDiv=1;
     $.fn.v6selectTree=function(options,callBack){
    	 if($(".selectTreeContent").length==0){
    		 isExistSelectDiv = 0;
    	 }		
    	 var opts = $.extend(true,{}, $.fn.v6selectTree.defaults, options);   
    	 var $this=$(this);
    	 thisLabelClick=$this;
    	 $.each($(this),function(){
    		 $this=$(this);
    		 for(i in Events){
        		 Events[i](opts,$this,callBack);
        	 }
    		// return $this
    	 })   
    	 return  $this;
	 }
     //默认参数
	 $.fn.v6selectTree.defaults={
		selectWidth:200,
		selectHeight:280,
		selectOption:[{text:"厂家", type:"brandowner", url:"SelectQueryTreeCmd.cmd?method=getBrandOwner"},
		              {text:"品牌", type:"brand", url:"SelectQueryTreeCmd.cmd?method=getBrand", checked:true},
		              {text:"商品", type:"item", url:"SelectQueryTreeCmd.cmd?method=getItem"}]
	 } 
	 function initSelectTree(opts,$this){
		// Events.selectClick();
	 }
	 var Events={
	    //点击向下的箭头
		arrowClick:function(opts,$this,callBack){
			$(".selectTreeBtn",$this).click(function(){
			if($(".selectTreeContent",$this).length>0){
				var selectTreeContentIsShow=$(".selectTreeContent",$this).css("display");
				 if(selectTreeContentIsShow=="none"){
					 $(".selectTreeContent",$this).css("display",""); 
				 }	else{
					 $(".selectTreeContent",$this).css("display","none"); 
				 } 
				getThisInputVal(opts,$this);
			    return;
		    }else{
			initDom(opts,$this);
			domCss(opts,$this);
			domPosition(opts,$this);
			defauleChecked(opts,$this);
			getThisInputVal(opts,$this);
		    }
			})
		},
		//点击清除按钮
		clearBtn:function(opts,$this){
			$(".v6_selectTree_button_clear",$this).live("click",function(){
				 selectTree.checkAllNodes(false);
				 $(".selectTreeText",$this).val('');
			})
		},
		//点击确定按钮
		okBtn:function(opts,$this,callBack){
			$(".v6_selectTree_button_sure",$this).live("click",function(){
				returnSql(opts,$this,callBack);
			})	
		},
		//点击取消按钮
		/*cancelBtn:function(opts,$this){
             $(".v6_selectTree_button_cancel",$this).live('click',function(){
            	 selectTree.checkAllNodes(false);
            	 $(".selectTreeText",$this).val();
            	 if(thisInputVal<=0){
            		 $(".selectTreeText",$this).val('');
            	 }else{
            	     $(".selectTreeText",$this).val(thisInputVal); 
            	 }
            	 $(".selectTreeContent",$this).css("display","none");
    			 return; 
             })	
		},*/
		//下拉框的chang事件
		itemTypeChange:function(opts,$this){
			getSelecTree(opts,$this);
		}	
	 };
	 //获取当前input框的值
	 function getThisInputVal(opts,$this){	
		 thisInputVal=$(".selectTreeText",$this).val();
		return thisInputVal;
	 }
	 //初始化dom结构
	 function initDom(opts,$this){
		 if($(".selectTreeContent",$this).length>0){
			 $(".selectTreeContent",$this).css("display","");
          }else{
		 var divInElement=[];
		 divInElement.push("<div class='selectTreeContent'>");
		 divInElement.push("<div class='v6_selectTree_head_button_div'>");        //按钮区域
		 divInElement.push("	<input class='v6_selectTree_button' id='' type='button' style='display:none' />");//没有发现bug引起的原因，临时添加隐藏的button
		 divInElement.push("	<input class='dataConButton v6_selectTree_button_sure' type='button' value='确定' />");
		// divInElement.push("	<input class='v6_selectTree_button  v6_selectTree_button_cancel' type='button' value='取消' />");
		 divInElement.push("	<input class='dataConButton v6_selectTree_button_clear' type='button' value='清空' />");
		 divInElement.push("</div>");
		 divInElement.push("<div style='clear:both'></div>");
		 divInElement.push("<div class='v6_selectTree_head_select_div'>");       //下拉框区域
		 divInElement.push("	<select id='selectTreeSelect' class='selectTreeSelectSearch' name='selectTreeSelectSearch'>");
		 divInElement.push(" 	<option value=''>请选择</option>");
		 for(var i=0,l=opts.selectOption.length;i<l;i++){
			 divInElement.push("<option value="+opts.selectOption[i].url+" type="+opts.selectOption[i].type+" >"+opts.selectOption[i].text+"</option>")
		 };
		 divInElement.push("	</select>");
		 divInElement.push("	<label>方式选择:</label>");
		 divInElement.push("</div>");
		 divInElement.push("<div style='clear:both'></div>");
		 divInElement.push("<div class='v6_concreteSelectTreeDiv'><ul id='select_query_tree' class='ztree'></ul></div>");  //树形区域
		 divInElement.push("</div>")
		 $this.prepend(divInElement.join('')); 
         }
	 }
	 function domCss(opts,$this){
		 $(".selectTreeContent",$this).height(opts.selectHeight);
		 $(".selectTreeContent",$this).width(opts.selectWidth);
		 $(".v6_concreteSelectTreeDiv",$this).height(opts.selectHeight-68);//为了让树超长的时候出现滚动条
	 }	
	 //定义下拉出div的位置
	 function domPosition(opts,$this){
		 var objPositionLeft = $this.offset().left;         //当点对象的位置
		 var objPositionTop = $this.offset().top;
		 var objWidth = $this.width();
		 var objHeight = $this.height();
		 var selectContentDiv=$(".selectTreeContent");
		 var bodyWidth = document.body.clientWidth;
		 var bodyHeight = document.body.clientHeight;
		 var twoWidth = objPositionLeft+objWidth;
		 if(opts.selectWidth<=twoWidth){                         //定义下拉div的水平位置
			 $(".selectTreeContent",$this).css({                        
			    	right:"0px"	
			    });
		    }else{
		    	$(".selectTreeContent",$this).css({                        
			    	left:"0px"
			    });	
		    };
		 if(bodyHeight>opts.selectHeight){
			 if((bodyHeight-objPositionTop-objHeight)>=opts.selectHeight){
				 $(".selectTreeContent",$this).css({                        
				    	top:objHeight+"px"
				    });
			 }else{
				 $(".selectTreeContent",$this).css({                        
				    	top:(objHeight+opts.selectHeight)+"px"
				    });
			 }	 
		 }else{
			 $(".selectTreeContent",$this).css({                        
			    	top:objHeight+"px"
			    }); 
		 }	
	 }
	 //具体定义下拉框的chang事件
	 function getSelecTree(opts,$this){
		 var  selectTreeSelect = $("#selectTreeSelect");   
		 selectTreeSelect.live('click',function(){
			 $(".selectTreeText",$this).blur();
		 })
		 selectTreeSelect.live('change',function(){
			 forHover=0;
			 var optionCmd = $(this).val();
			 $.ajax({
				  type: "post",
				  url:optionCmd,
				
				  beforeSend: function(XMLHttpRequest){
					  $("#treeDemo").html("正在加载...请稍后");	  
				  },
				  success: function(data, textStatus){
					  var zNodes=[{id:1,name:"请选择",isParent:true,type:"root",sql:null}];
					  var setting={
							  callback: {
								    //beforeClick:beforeClick,
									onClick:selectItemClick ,
									onCheck:selectItemCheck
								},
							  async: {
									enable: true,
									url: optionCmd,
									autoParam:["id","type"]
							  },
							  treeNodeKey : "selectTree",
			                  check:{
			                	chkStyle:"checkbox",
			                  	enable:true,
			                  	nocheckInherit: true
			                  
			                  }	
					  };
					  $.fn.zTree.init($("#select_query_tree",$this), setting, zNodes);
					  selectTree = $.fn.zTree.getZTreeObj("select_query_tree");  //获取zTree对象  
				  },
				  error:function(){
					  alert("请求出错");
				  }
			 })
		 }) 
	 }
	 //点击文字
	 function selectItemClick(){
	 }
	 //勾选多选框
	 function selectItemCheck(){
		   var selectTreeNode = selectTree.getCheckedNodes();//选中的各个节点对象数组
		   var selectNum=selectTreeNode.length;		   
		   if(selectNum<=0){
      		 $(".selectTreeText",thisLabelClick).val('');
      	 }else{
      		 $(".selectTreeText",thisLabelClick).val(selectNum+"已选");  
      	 }  
	 }
	 //返回sql的方法
	 function  returnSql(opts,$this,callBack){
		 
		   var selectCheckType = $("#selectTreeSelect option:selected").attr("type");//获取当前下拉框中选择的条件类型
		   var selectTreeNode = selectTree.getCheckedNodes();//选中的各个节点对象数组
		   if(selectTreeNode.length>0){
		   // var halfCheck = selectTree.getCheckedNodes()[0].getCheckStatus();
		   var selectedName = "";
		   var selectedId = "";
		   var selectedSql = "";
		   //下拉框选中品牌拥有者
		   if(selectCheckType==="brandowner"){
			   for (var i=0, l=selectTreeNode.length; i<l; i++) {
				  if(selectTreeNode[i].type==="brandowner"){  //获取选中的值
			        if(selectTreeNode[i].isParent==false){
			           selectedName += ","+selectTreeNode[i].name;
			           selectedId += ","+selectTreeNode[i].id;
			           selectedSql +=" OR BRDOWNER_ID='"+selectTreeNode[i].id+"'";
			        }
				  }
			   }
			   selectedName = selectedName.substring(1, selectedName.length);
			   selectedId = selectedId.substring(1, selectedId.length);	
			   selectedSql = selectedSql.substring(3, selectedSql.length);
		       if(selectedSql===""){
		    	   selectedSql = "SELECT ITEM_ID FROM PLM_ITEM"; 
		       }else{
		    	   selectedSql = "SELECT ITEM_ID FROM PLM_ITEM WHERE "+selectedSql;
		       }
		       $(".selectTreeContent",$this).css("display","none");
			  /* $.ajax({
					  type: "post",
					  url:"SelectQueryTreeCmd.cmd?method=getBrandOwnerS&sql="+selectedSql,
					  beforeSend: function(XMLHttpRequest){
						  $(".selectTreeText",$this).val("正在加载...请稍后");	  
					  },
					  success: function(data, textStatus){
						  $(".selectTreeText",$this).val(data); 
					  },
					  error:function(){
						  alert("请求出错");
					  }
			   });*/
		      // $(".selectTreeText",$this).val(selectedName);
			   if(callBack){
		    		 callBack(selectedSql);
		    	 }
			   
			   return;
		   }
		   //下拉框选中厂家
		   if(selectCheckType==="brand"){
			   for (var i=0, l=selectTreeNode.length; i<l; i++) {
				    // alert(selectTreeNode[i].getCheckStatus().half);
					 if(selectTreeNode[i].type==="brand"){  //获取选中的值
				           selectedName += ","+selectTreeNode[i].name;
				           selectedId += ","+selectTreeNode[i].id;
				           selectedSql +=" OR BRAND_ID='"+selectTreeNode[i].id+"'";
					  }else if(selectTreeNode[i].type==="brandowner"){
						  if(selectTreeNode[i].getCheckStatus().half===false){
						   selectedSql +=" OR BRDOWNER_ID='"+selectTreeNode[i].id+"'";
						  }
					 }
				   }
			   selectedName = selectedName.substring(1, selectedName.length);
			   selectedId = selectedId.substring(1, selectedId.length);	
			   selectedSql = selectedSql.substring(3, selectedSql.length);
		       if(selectedSql===""){
		    	   selectedSql = "SELECT ITEM_ID FROM PLM_ITEM WHERE"; 
		       }else{
		    	   selectedSql = "SELECT ITEM_ID FROM PLM_ITEM WHERE "+selectedSql;
		       }
		       $(".selectTreeContent",$this).css("display","none");
		   /*    $.ajax({
					  type: "post",
					  url:"SelectQueryTreeCmd.cmd?method=getBrandS",
					  data:"sql="+selectedSql,
					  beforeSend: function(XMLHttpRequest){
						  $(".selectTreeText",$this).val("正在加载...请稍后");	  
					  },
					  success: function(data, textStatus){
						 // alert(data);
						  $(".selectTreeText",$this).val(data); 
					  },
					  error:function(){
						  alert("请求出错");
					  }
			   });*/
		     //  $(".selectTreeText",$this).val(selectedName);
			   if(callBack){
		    		 callBack(selectedSql);
		    	 }
			  return ;     
		   }
		   //下拉框选中商品
		   if(selectCheckType==="item"){
			   for (var i=0, l=selectTreeNode.length; i<l; i++) {
				    // alert(selectTreeNode[i].getCheckStatus().half);
				     if(selectTreeNode[i].type==="item"){
				    	   selectedName += ","+selectTreeNode[i].name;
				           selectedId += ","+selectTreeNode[i].id;
				           selectedSql +=" OR ITEM_ID='"+selectTreeNode[i].id+"'";
				     }else if(selectTreeNode[i].type==="brand"){  //获取选中的值
				    	  if(selectTreeNode[i].getCheckStatus().half===false){
							   selectedSql +=" OR BRAND_ID='"+selectTreeNode[i].id+"'";
							  }
					  }else if(selectTreeNode[i].type==="brandowner"){
						  if(selectTreeNode[i].getCheckStatus().half===false){
						   selectedSql +=" OR BRDOWNER_ID='"+selectTreeNode[i].id+"'";
						  }
					 }
				   }
			   selectedName = selectedName.substring(1, selectedName.length);
			   selectedId = selectedId.substring(1, selectedId.length);	
			   selectedSql = selectedSql.substring(3, selectedSql.length);
		       if(selectedSql===""){
		    	   selectedSql = "SELECT ITEM_ID FROM PLM_ITEM WHERE"; 
		       }else{
		    	   selectedSql = "SELECT ITEM_ID FROM PLM_ITEM WHERE "+selectedSql;
		       }
		       $(".selectTreeContent",$this).css("display","none");
		      /* $.ajax({
					  type: "post",
					  url:"SelectQueryTreeCmd.cmd?method=getItemS",
					  data:"sql="+selectedSql,
					  beforeSend: function(XMLHttpRequest){
						  $(".selectTreeText",$this).val("正在加载...请稍后");	  
					  },
					  success: function(data, textStatus){
						  $(".selectTreeText",$this).val(data); 
					  },
					  error:function(){
						  alert("请求出错");
					  }  
			   });*/
		     //  $(".selectTreeText",$this).val(selectedName);
			   if(callBack){
		    		 callBack(selectedSql);
		    	 }
			   return;
		   }
		   }
		   if(callBack){
	    		 callBack('');
	    	 }
		   $(".selectTreeContent",$this).css("display","none");
		   return ; 
	 }
	 function defauleChecked(opts,$this){
		 var  selectTreeSelect = $("#selectTreeSelect");      
		 for(var i=0,l=opts.selectOption.length;i<l;i++){     
			   $("option",selectTreeSelect).eq(i).attr("selected",true);
				if(opts.selectOption[i].checked==true){
					var url = opts.selectOption[i].url;
					$.ajax({
						  type: "post",
						  url:url,
						  beforeSend: function(XMLHttpRequest){
							  $("#treeDemo").html("正在加载...请稍后");	  
						  },
						  success: function(data, textStatus){
							  var zNodes=[{id:1,name:"请选择",isParent:true,type:"root"}];
							  var setting={
									  callback: {
										    //beforeClick:beforeClick,
											onClick:selectItemClick ,
											onCheck:selectItemCheck
										},
									  async: {
											enable: true,
											url: url,
											autoParam:["id","type"]
									  },
									  treeNodeKey : "selectTree",
					                  check:{
					                	chkStyle:"checkbox",
					                  	enable:true
					                  }	
							  };
							  $.fn.zTree.init($("#select_query_tree",$this), setting, zNodes);
							  selectTree = $.fn.zTree.getZTreeObj("select_query_tree");  //获取zTree对象  
						  },
						  error:function(){
							  alert("请求出错");
						  }
					 })
				};
			} 
	 }
	 
	 
})(jQuery);