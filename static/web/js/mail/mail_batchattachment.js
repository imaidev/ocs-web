
var swfu;

$(document).ready(function(){
	swfu = new SWFUpload({
		// Backend settings
		upload_url: "/DocCenterService/pubUpload",
		file_post_name: "uploadfile",

		// Flash file settings
		file_size_limit : "10 MB",
		file_types : "*.*",
		file_types_description : "All Files",
		file_upload_limit : "0",
		file_queue_limit : "1",

		// Event handler settings
		swfupload_loaded_handler : swfUploadLoaded,
		
		file_dialog_start_handler: fileDialogStart,
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		
		//upload_start_handler : uploadStart,	// I could do some client/JavaScript validation here, but I don't need to.
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,

		// Button Settings
		button_image_url : "/skin/images/mail/upload_blue_mail.png",
		button_placeholder_id : "spanButtonPlaceholder",
		button_width: 198,
		button_height: 22,
		
		// Flash Settings
		flash_url : "/skin/js/upload/swfupload.swf",

		custom_settings : {
			progress_target : "fsUploadProgress",
			upload_successful : false
		},
		
		// Debug settings
		debug: false
	});

});

function fileQueued(file) {
	//alert(file.name);
	try {
		var rawName=document.getElementById("txtFileName");
		rawName.value=file.name;
		var txtFileName = document.getElementById("FILE_NAME");
		txtFileName.value = file.name;
		//赋值fileName
		addAttachment(file.name);
		uploadAttachment();
	} catch (e) {
	}
}

//在附件列表区显示上传的附件
function addAttachment(fileName) {
	var $fileDiv=$("<div></div>").addClass("fileShow").click(function(e){
		if($(e.target).hasClass("delLink")){
			$(this).remove();
		}
	});
	var $fileImgB=$("<img></img>").addClass("fileImg").addClass("ico");
	//解析文件名，获取文件类型
	var fileInfoArr=fileName.split(".");
	var fileType="";
	if(fileInfoArr.length!=1){
		fileType=fileInfoArr[fileInfoArr.length-1];
	}
	 $fileImgB.addClass(fileType);
	var $filenNameD=$("<div></div>").addClass("filename").text(fileName);
	var $fileActionD=$("<div></div>").addClass("action").html("<a class='delLink' href='#'>删除</a>");
	var $fileinfoD=$("<div></div>").addClass("fileinfo").text("上传中...");
	var $fileRightD=$("<div></div>").addClass("fileright").append($fileActionD).append($fileinfoD);
	var $fileContentD=$("<div></div>").addClass("filecontent").append($fileImgB).append($fileRightD);
	$fileDiv.append($filenNameD).append($fileContentD).insertBefore("#attachmentEnd");
}
//上传附件
function uploadAttachment(){
	if (formChecker != null) {
		clearInterval(formChecker);
		formChecker = null;
	}
	try {
		//上传数据
		swfu.setPostParams({uid:$("#USERID").val(),name:encodeURI($("#FILE_NAME").val())});
		swfu.startUpload();
	} catch (ex) {

	}
	return false;
}


function uploadSuccess(file, serverData) {
	//alert(JSON.stringify(file));
	try {
		file.id = "singlefile";	
		var progress = new FileProgress(file, this.customSettings.progress_target);
		progress.setComplete();
		progress.setStatus("Complete.");
		progress.toggleCancel(false);
		if (serverData === " ") {
			this.customSettings.upload_successful = false;
		} else {
			this.customSettings.upload_successful = true;
			document.getElementById("fileId").value = serverData;
			//赋值FILE_ID
			setFileInfo(serverData,file.name,file.size);
		}
		uploadDone(serverData);
	} catch (e) {
	}
}

function uploadError(){
}

//上传成功后，设置上传文件信息
function setFileInfo(FileId,fileName,fileSize){
	var fileSizeInfo=getFileSizeInfo(fileSize);
		
	var $filen=$(".fileShow:last .filename");
	var name=$filen.text();
	$filen.html("<a style='text-decoration: underline;' href='/DocCenterService/pubDoc?doc_id="+FileId+"'>"+name+"</a>");
	var $filei=$(".fileShow:last .fileinfo");
	$filei.text(fileSizeInfo+"  上传成功");
	$filei.append("<input type='hidden' name='upload_fileInfo' value='"+FileId+"|"+fileName+"|"+fileSize+"'/>");
}

//计算文件大小的显示
function getFileSizeInfo(fileSize){
	var fileSizeInfo;
	if(fileSize > 1048576){
		fileSizeInfo = (fileSize/1048576).toFixed(2)*100/100+"MB"; 
	}else if(fileSize > 1024){
		fileSizeInfo = (fileSize/1024).toFixed(2)*100/100+"KB"; 
	}else{
		fileSizeInfo = fileSize+"B";
	}
	return fileSizeInfo;
}

//上传完文件后的回调函数
function uploadDone(id) {
	id = eval(id);
	if(!id.error){
		jSuccess("文档上传成功！");
	}else{
		jError("文档上传失败！");
	}
}

//覆写handlers.js中的swfUploadLoaded方法
function swfUploadLoaded() {
//	var btnSubmit = document.getElementById("btnSubmit");
	//调用保存方法
//	btnSubmit.onclick = forSave;
}

	