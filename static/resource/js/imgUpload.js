//上传图片
var _target = null;
var _src = "";
var _max_img_num = 10;

$(document).ready(function(){
	$("div.imgUploadContainer").each(function(){
		imgUploadInit(this);
	});
	$("div.imgShowContainer").each(function(){
		imgShowInit(this);
	});
});

// 上传图片容器初始化
function imgUploadInit(target){
	$(target).css({"width" : "100%",
								 "margin-top" : "4px",
    						 "display" : "inline-block",
    						 "color" : "#343434",
    						 "overflow" : "hidden"
    						});
	var src = $(target).children("#imgUpload_Src").val();
	_src = src.substring(0, src.indexOf("?"));
	var max_img_num = $(target).children("#imgUpload_MaxNumOfImg").val();
	if (max_img_num != null && max_img_num != "") _max_img_num = max_img_num;
	var target_id = $(target).attr("id");
	$(target).append("<button type=\"button\" onclick=\"uploadImg('" + src + "', '" + target_id + "')\" class=\"btn btn-primary btn-sm\" style=\"margin-left:20px\">"
								+ "<span class=\"v6icon upload white\" style=\"margin-left:0\"></span> 上传"
								+ "</button>");
	imgUploadContainerInit(target);
}

function imgUploadContainerInit(target) {
	var target_id = $(target).attr("id");
	$(target).append("<div id=\"img_Container\"></div>");
	$(target).children("#img_Container").css({"width" : "90%",
																					 "height" : "auto",
																					 "margin-top" : "10px",
													    						 "display" : "inline-block",
													    						 "color" : "#343434",
													    						 "border" : "3px #cdd5e0 dashed",
													    						 "overflow" : "hidden"
													    						});
	// 若已经有图片，则做展示
	var imgUpload_Path = $(target).children("#imgUpload_Path").val();
	if (imgUpload_Path != "") {
		var pathArr = new Array();
		pathArr = imgUpload_Path.split(",");
		for (var i=0; i<pathArr.length; i++) {
			addImg(pathArr[i], target_id);
		}
	}
}

// 图片展示容器初始化
function imgShowInit(target){
	$(target).css({"width" : "100%",
								 "margin-top" : "4px",
    						 "display" : "inline-block",
    						 "color" : "#343434",
    						 "overflow" : "hidden"
    						});
	var src = $(target).children("#imgUpload_Src").val();
	_src = src;
	var target_id = $(target).attr("id");
	$(target).append("<div id=\"img_Container\"></div>");
	$(target).children("#img_Container").css({"width" : "90%",
																					 "height" : "auto",
																					 "margin-top" : "10px",
													    						 "display" : "inline-block",
													    						 "color" : "#343434",
													    						 "border" : "3px #cdd5e0 dashed",
													    						 "overflow" : "hidden"
													    						});
	// 若已经有图片，则做展示
	var imgUpload_Path = $(target).children("#imgUpload_Path").val();
	if (imgUpload_Path != "") {
		var pathArr = new Array();
		pathArr = imgUpload_Path.split(",");
		for (var i=0; i<pathArr.length; i++) {
			addImg4Show(pathArr[i], target_id);
		}
	}
}

// 上传照片
function uploadImg(src, target_id){
	var is_fix = $("#"+target_id).children("#imgUpload_IsFix").val();
	if (is_fix == "false"){
		_fix = false ;
	} else {
		_fix = true;
	}
	var imgUpload_Path = $("#"+target_id).children("#imgUpload_Path").val();
	var pathArr = imgUpload_Path.split(",");
	if (pathArr.length >= _max_img_num) {
		jAlert("最多上传" + _max_img_num + "张图片！");
	} else {
		_target = target_id;
		$.layer({
			type : 2,
			iframe : {
				src :  src
			},
			title : "图片上传",
			closeBtn : false,
			shadeClose: true,
			fix : _fix,
			offset:['50px' , ''],
			area : ['550px','450px']
		});
	}
}

//上传照片回调函数
function imageCallBack(path) { 
	addImg(path, _target);
	//$("#"+_target).children("#hidden_text_input").get(0).focus();
}

//删除图片
function deleteImg(path){
	ymPrompt.confirmInfo({
		title : '提示',
		message : '确认要删除吗?',
		handler : function(tp) {
			if ('ok' == tp) {
				if (path != "") {
					var target = $("[src$='"+path+"']").parent().parent().parent().parent();
					var imgUpload_Path = $(target).children("#imgUpload_Path").val();
					// 获取刷新进入的图片（通常这部分图片不应删除）
					var oldPath = "";
					if ($(target).children("#imgUpload_OldPath").length != 0) {
						oldPath = $(target).children("#imgUpload_OldPath").val();
					}
					if (oldPath.indexOf(path) >= 0) {
						ymPrompt.alert({message:'删除成功',title:'提示'});
						$("[src$='"+path+"']").parent().parent().remove();
						if (imgUpload_Path.indexOf(path) == 0) {
							imgUpload_Path = imgUpload_Path.replace(path, "");
							if (imgUpload_Path.indexOf(",") == 0){
								imgUpload_Path = imgUpload_Path.substring(1);
							}
						} else if (imgUpload_Path.indexOf(path) > 0) {
							imgUpload_Path = imgUpload_Path.replace("," + path, "");
						}
						$(target).children("#imgUpload_Path").val(imgUpload_Path);
						return;
					}
					var option = {
							url : _src + "?method=delete&path=" + path,
							type : "POST",
							dataType : "text",
							contentType : "application/x-www-form-urlencoded; charset=UTF-8",
							success : function(data) {
								ymPrompt.alert({message:data,title:'提示'});
								$("[src$='"+path+"']").parent().parent().remove();
								if (imgUpload_Path.indexOf(path) == 0) {
									imgUpload_Path = imgUpload_Path.replace(path, "");
									if (imgUpload_Path.indexOf(",") == 0){
										imgUpload_Path = imgUpload_Path.substring(1);
									}
								} else if (imgUpload_Path.indexOf(path) > 0) {
									imgUpload_Path = imgUpload_Path.replace("," + path, "");
								}
								$(target).children("#imgUpload_Path").val(imgUpload_Path);
							}
						}
					$.ajax(option);
					}
			}
		}
	});
}

// 获取资源描述路径
function getDescUrl(path){
	if (_src.indexOf("ftweb") >= 0){
		return "/ftweb/ord/comng/ImgUploadTool.do?method=getImgDesc&path=" + path;
	} else if (_src.indexOf("ft") >= 0){
		return "/ft/ord/imgUploadTool.cmd?method=getImgDesc&path=" + path;
	}
	
	
}


// 添加图片展示节点
function addImg(path, target){
	var urlto = getDescUrl(path);
	var imgDesc = "暂无描述";
	$.ajaxLoad({url:urlto,
	callback:function(data1){
		imgDesc=data1.data.imgDesc;
	},
	dataType:"json",
	type:"post",
	async: false
	});
	$("#"+target).children("#img_Container").append("<div style=\"width:100px;margin:10px;float:left;\">"
																									+ "<a href=\"" + path + "\" target=\"_blank\">"
																									+ "<img src=\"" + path + "\" width=\"100px\" height=\"100px\" style=\"margin-bottom:10px;\"/>"
																									+ "</a>"
																									+ "<p style=\"height:40px;width:100px;font-size:60%;border:1px #cdd5e0 solid;overflow-y:auto;margin-bottom:5px;\">" + imgDesc + "</p>"
																									+ "<button type=\"button\" onclick=\"deleteImg('" + path + "')\" class=\"btn btn-danger btn-sm\" style=\"width:100px\">"
																									+ "<span class='v6icon trash  white'></span> 删除"
																									+ "</button>");
	var imgUpload_Path = $("#"+target).children("#imgUpload_Path").val();
	if (imgUpload_Path=="") {
		$("#"+target).children("#imgUpload_Path").val(path);
	} else if (imgUpload_Path.indexOf(path) < 0) {
		$("#"+target).children("#imgUpload_Path").val(imgUpload_Path + "," + path);
	}
}

// 添加图片展示节点--不带删除按钮
function addImg4Show(path, target){
	var urlto = getDescUrl(path);
	var imgDesc = "暂无描述";
	$.ajaxLoad({url:urlto,
	callback:function(data1){
		imgDesc=data1.data.imgDesc;
	},
	dataType:"json",
	type:"post",
	async: false
	});
	$("#"+target).children("#img_Container").append("<div style=\"width:100px;margin:10px;float:left;\">"
																									+ "<a href=\"" + path + "\" target=\"_blank\">"
																									+ "<img src=\"" + path + "\" width=\"100px\" height=\"100px\" style=\"margin-bottom:10px;\"/>"
																									+ "</a>"
																									+ "<p style=\"height:40px;width:100px;font-size:60%;border:1px #cdd5e0 solid;overflow-y:auto;margin-bottom:5px;\">" + imgDesc + "</p>"
																									);
	
}

function showSourceImg(obj){
	var diyHtml="<div style=\"width:800px;height:800px;overflow-y:auto;overflow-x:auto;\"><img src=\"" + $(obj).attr("src") + "\"/></div>";
    
  var i = $.layer({
      type: 1,
      title: "<div><a href=\"" + $(obj).attr("src") + "\" target=\"_blank\">查看原图</a></div>",
      closeBtn: [1 , true],
      border : [5, 0.5, '#666', true],
      offset: ['100px',''],
      //move: ['.movebar', true],
      area: ['800px','800px'],
      page: {
          html: diyHtml
      }
  });
}
