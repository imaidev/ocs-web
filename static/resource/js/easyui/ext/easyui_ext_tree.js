jQuery.fn.extend({
	

ui_tree:function (option) {
		var opt = {struId: "", struType: "1"};
		$.copyValue(option, opt);
		var struId = opt.struId;
		var struType = opt.struType;
		var level = opt.level;
		var webUrl = opt.webUrl;
		this.each( function() {
			$.ajaxLoad({
		    //请求的url为xxx.do，后面带一个method的参数
		    url: webUrl+"/inter/tree/organTree.do?method=getOrganTree&initFlag=1&struId="+struId+"&struType="+struType+"&level="+level,
		    dataType:"text",
		    type:"get",
		    callback:function(data) {
					try{
						data = data.replace(/[\[\]]/g, "" );
						
						var obj = eval("["+data+"]");
					
						renderTreeData(obj,webUrl);
					}catch(err){
						
					};
				}
		})			 
	})
return this;
	}

})
	
//渲染树方法
	function renderTreeData(dataJson,webUrl){
		var level = $("#level").val();
		$('#treebox').tree({
			data: dataJson,
			onBeforeExpand:function(node,param){ 
				var treeid = node.id;
				var treeArr = treeid.split("-");
				var struId = treeArr[0];
				var struType = treeArr[1];
				$('#treebox').tree('options').url = webUrl+"/inter/tree/organTree.do?method=getOrganTree&initFlag=0&struId="+struId+"&struType="+struType+"&level="+level;
      },
			onCheck: function(node, checked){
				
			},
		 onClick:function(node){
		 	var treeid = node.id;
				var treeArr = treeid.split("-");
				$("#struId").val(treeArr[0]);
				$("#struType").val(treeArr[1]);
				$("#type").val(treeArr[2]);
				$("#pStruId").val(treeArr[3]);
				$("#comId").val(treeArr[4]);
         } 
		});
	}