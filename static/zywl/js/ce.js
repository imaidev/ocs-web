/*******选择类目页面  cuiyanyan  V20140625************/
//var ctxPath=document.getElementById("ctxPath").value;
//var csCode = document.getElementById("csCode").value;
$(function(){
	hasSelected();
	kindsOption();
	// 控制高度添加滚动条
	scrollTd('.kinds-table', 8);
});

//列表通过li的个数判断添加滚动条
function scrollTd(obj, i) {
	$(obj).find(".list").each(function() {
		var liNum = $(this).find("li").length;
		if (liNum > i) {
			$(this).addClass("list-scroll");
		}else{
			$(this).removeClass("list-scroll");
		}
	});
};
//选中主营类目后，清除提示语
/*$("input[name='mainCateCode']:checked").live("click",function(){
	 $("#warnTip").html("");
});	*/

//申请新类目----已选择的类目 
function hasSelected(){
	$(".kinds-table li").hover(function(){
		$(this).addClass("selected");
	},function(){
		$(this).removeClass("selected");
	});

}
//类目查询
function kindsOption(){
	// 一级类目说鼠标悬浮效果
	$(".run-kinds .kinds-hover").hover(function(){
		$(this).addClass("has-selected");
	},function(){
		$(this).removeClass("has-selected");
	});
	// 一级类目鼠标点击效果
	$(".run-kinds .kinds-hover").click(function(){
		$(this).addClass("on").siblings().removeClass("on");
	});

	// 当前的选择:鼠标悬浮效果
	$(".kind-has-select li b").hover(function(){
		$(this).addClass("remove-hover");
	},function(){
		$(this).removeClass("remove-hover");
	});
	// 当前的选择:鼠标点击效果
	$(".kind-has-select li b").click(function(){
		$(this).parent().hide();
	});
}

//新入驻，保存类目，提交并下一步
function saveCsCategory(flag){
$("#warnTip").html("");
	var checkedFlag=0;
	var oneArray=new Array();
	var threeArray=new Array();
	//遍历一级类目
	$(".kinds-table tr .kinds-first").each(function(i){
				//一级类目
				var cateInfo = $(this).attr("selectonecode");
				//文化制品
				if(cateInfo == "R5000"){
					if($(this).parent().parent().siblings().find("td").size()>0){
						$("#warnTip").removeClass("hide");
						$("#warnTip").html('<em class="tipFalse2"></em>尊敬的商家，同一个店铺中不允许同时经营文化制品及其他非文化制品类目！ ');
						return;
					 }
				}
				oneArray.push(cateInfo);
		});		
	
	//遍历二级类目
	/*$(".kinds-table tr .kinds-seconds .cate-two").each(function(i){
					是否是主营类目
					var isMain=$(this).parent().find("input").attr("checked");
					if(isMain=="checked"){
						checkedFlag++;
					}
		});	*/
	
	//遍历三级类目
	$(".kinds-table tr .kinds-three .cate-thr").each(function(i){
				//三级类目
				var thrCate = $(this).parent().attr("code");
				threeArray.push(thrCate);
		});	
	
	
	// 遍历主营类目
	$("input[name='mainCateCode']").each(function(){
		var isMain = $(this).attr("checked");
		if(isMain == "checked"){
			checkedFlag++;
		}
	});
	
	
	//若类目已选择
	if($(".kinds-table").find("td").size()>0){	
		if(checkedFlag==0){
		    $("#warnTip").removeClass("hide");
			$("#warnTip").html('<em class="tipFalse2"></em>请在选择的类目中，选择一项主营类目！');
			return;
		}
		var shopTypeVal = $("input[name='shopType']:checked").val();
		if(shopTypeVal==undefined){
		    $("#warnTip").removeClass("hide");
			$("#warnTip").html('<em class="tipFalse2"></em>请选择店铺类型！');
			return;
		}
	}else{
	        $("#warnTip").removeClass("hide");
			$("#warnTip").html('<em class="tipFalse2"></em>请选择经营类目！');
			 return;
	}	
		if($("#warnTip").html()!==""){
		    return;
		}
	 $("#oneCodeArray").val(oneArray);
	 $("#thrCodeArray").val(threeArray);
		//主营类目
		var mainCateCode = $("input[name='mainCateCode']:checked").val();
		//店铺类型
		var shopType = $("input[name='shopType']:checked").val();
		ajaxInSameDomain(
		ctxPath + "/csCategory/saveCategoryItemOnly.action",
		{"csCode":csCode,"oneCodeArray":oneArray,"thrCodeArray":threeArray,"mainCateCode":mainCateCode,"shopType":shopType},
		"post",
		 function(data) {
			if(data == -1){
				alertPopup("参数错误",'#warnPrompt2');
			}else if(data == 5){
				alertPopup("尊敬的商家，品牌直营旗舰店只允许经营自有品牌，请确认品牌类型后再进行提交！",'#warnPrompt3');
			}else if(data == 6){
				alertPopup("尊敬的商家，品牌授权旗舰店只允许经营代理品牌，请确认品牌类型后再进行提交！",'#warnPrompt3');
			}else{
				if(flag == 0){
					//保存操作
					SCON.com.popupbox('#warnPrompt2');
				}else{
					// 跳转到品牌页面
					 $("#csCtegoryForm").attr("action",ctxPath + "/csBrandOpe/toCsBrandOpeInfo.action");
					 $("#csCtegoryForm").submit();
				}
			}
  		}, null);
}
 // 错误提示弹出框统一js
function alertPopup(desc,obj){
	if(obj=='#warnPrompt2'){
		$(obj).find("h3").html(desc);
	}else if(obj=='#warnPrompt3'){
		$(obj).find("h1").html(desc);
	}
	SCON.com.popupbox(obj);
}   

//重新入驻，保存类目，提交并下一步
function saveCsCategoryAgain(flag){
       $("#warnTip").html("");
       var checkedFlag=0;
       var oneArray=new Array();
       var threeArray=new Array();
		//遍历一级类目
		$(".kinds-table tr .kinds-first").each(function(i){
					//一级类目
					var cateInfo = $(this).attr("selectonecode");
					//文化制品
					if(cateInfo == "R5000"){
						if($(this).parent().parent().siblings().find("td").size()>0){
							$("#warnTip").removeClass("hide");
							$("#warnTip").html('<em class="tipFalse2"></em>尊敬的商家，同一个店铺中不允许同时经营文化制品及其他非文化制品类目！ ');
							return;
						 }
					}
					oneArray.push(cateInfo);
			});
		
		//遍历二级类目
		/*$(".kinds-table tr .kinds-seconds .cate-two").each(function(i){
						//是否是主营类目
						var isMain=$(this).parent().find("input").attr("checked");
						if(isMain=="checked"){
							checkedFlag++;
						}
			});	*/
		
		//遍历三级类目
		$(".kinds-table tr .kinds-three .cate-thr").each(function(i){
					//三级类目
					var thrCate = $(this).parent().attr("code");
					threeArray.push(thrCate);
			});
		
		// 遍历主营类目
		$("input[name='mainCateCode']").each(function(){
			var isMain = $(this).attr("checked");
			if(isMain == "checked"){
				checkedFlag++;
			}
		});
		
		//若类目已选择
		if($(".kinds-table").find("td").size()>0){	
			if(checkedFlag==0){
			    $("#warnTip").removeClass("hide");
				$("#warnTip").html('<em class="tipFalse2"></em>请在选择的类目中，选择一项主营类目！');
				return;
			}
		}else{
		        $("#warnTip").removeClass("hide");
				$("#warnTip").html('<em class="tipFalse2"></em>请选择经营类目！');
				 return;
		}	
			if($("#warnTip").html()!==""){
			    return;
			}
		 $("#oneCodeArray").val(oneArray);
		 $("#thrCodeArray").val(threeArray);
		 //主营类目
		 var mainCateCode = $("input[name='mainCateCode']:checked").val();
			ajaxInSameDomain(
			ctxPath + "/csCategory/saveCategoryItemOnly.action",
			{"csCode":csCode,"oneCodeArray":oneArray,"thrCodeArray":threeArray,"mainCateCode":mainCateCode},
			"post",
			function(data) {
				if(data == -1){
					alertPopup("参数错误",'#warnPrompt2');
				}else{
					if(flag == 0){
						//保存操作
						SCON.com.popupbox('#warnPrompt2');
					}else{
						if(data == 3){
							// 若重新入驻且为文化制品，直接跳转到协议确认页面
							 $("#csCtegoryForm").attr("action",ctxPath + "/csContract/contractAffirm.action");
							 $("#csCtegoryForm").submit();
						}else{
							// 跳转到品牌页面
							 $("#csCtegoryForm").attr("action",ctxPath + "/csBrandOpe/toCsBrandOpeInfo.action");
							 $("#csCtegoryForm").submit();
						}
					}
				}
	  		}, null);
}


//全选勾选，删除已选一级类目及以下所有二级类目、三级类目
function deleteTwoAllCategory(obj){
		// 如果二级类目全部删除，则将此父类目也删除
		var oneVal = $(".kinds-first");
		var nameVal=$(obj).attr("allSelectOneCode");
		oneVal.each(function(){
			var oneCode = $(this).attr("selectonecode");
			if(oneCode==nameVal){
				$(this).parent().parent().remove();
			}
		});
	}

//删除二级类目时，对应的已选二级类目也同时删除
function deleteTwoCategory(obj){
	// 获取当前是否选中
	var checkVal = $(obj).attr("checked");
	if(checkVal != "checked"){
		// 获取当前的value值
		var nameVal = $(obj).val();
		// 获取已展示类目中二级类目code与此nameVal相同的并删除
		var two = $(".select-items");
		two.each(function(index, domEle){
				if($.trim($(domEle).attr("code")) == nameVal){
				// 对应已选中三级删除
						var three = $(".select-items3");
						three.each(function(index, domEle){
							if($.trim($(domEle).attr("parentcode")) == nameVal){
								$(this).remove();
							}
						});
					$(this).remove();
				}
		});
		// 如果二级类目全部删除，则将此父类目也删除
		var oneVal = $(".kinds-first");
		oneVal.each(function(){
			var oneTd = $(this).parent().parent().find("td").get(1);
			if($(oneTd).find("li").size()==0){
				$(this).parent().parent().remove();
			}
		});
	}
	scrollTd('.kinds-table', 8);
}