
/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
/*
*Flash Player version 9.28 or above
*/
function preLoad() {
	if (!this.support.loading) {
		alert("请升级Flash Player为9.028或更高版本。");
		return false;
	}
}
/*
*Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative
*/
function loadFailed() {
	alert("加载上传组件失败!");
}

/*
*在文件选取窗口将要弹出时触发
*/
function fileDialogStart() {
	this.cancelUpload();
}


/*
*当文件添加到上传队列失败时触发此事件，失败的原因可能是文件大小超过了你允许的数值、文件是空的或者文件队列已经满员了等。
*第一个参数是当前出现问题的文件对象，第二个参数是具体的错误代码，可以参照SWFUpload.QUEUE_ERROR中定义的常量
*/
function fileQueueError(file, errorCode, message){
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			alert((message === 0 ? "文件数已经超过上传限制." : "最多只能选择" + (message > 1 ? " " + message + " 个文件." : " 1 个文件.")));
			return;
		}

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			progress.setStatus("文件太大了,压缩一下试试？");
			this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			progress.setStatus("文件是空的,换个有内容的吧。");
			this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			progress.setStatus("抱歉,不支持此文件类型。");
			this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		default:
			if (file !== null) {
				progress.setStatus("发生了不可知错误...");
			}
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}
/*
*当一个文件被添加到上传队列时会触发此事件
*唯一参数为包含该文件信息的file object对象
*/
function fileQueued(file) {
	
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("等待中...");
		progress.toggleCancel(true, this);
	} catch (e) {
		this.debug();
	}

}
/*
*当文件选取完毕且选取的文件经过处理后（指添加到上传队列），会立即触发该事件。
*参数number of files selected指本次在文件选取框里选取的文件数量
*参数number of files queued指本次被添加到上传队列的文件数量
*参数total number of files in the queued指当前上传队列里共有多少个文件（包括了本次添加进去的文件）
*/
function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		if (numFilesSelected > 0) {
			document.getElementById(this.customSettings.cancelButtonId).disabled = false;
		}
		this.startUpload();
	} catch (ex)  {
        this.debug(ex);
	}
}
/*
*当文件即将上传时会触发该事件,可以通过返回false来取消本次文件的上传		
*参数file object为当前要上传的文件的信息对象
*/
function uploadStart(file){
	this.removePostParam("name");
	this.addPostParam("name",encodeURI(file.name));
	this.removePostParam("uid");
	this.addPostParam("uid",$("#USER_ID").val());
	try {
		
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("上传中...");
		progress.toggleCancel(true, this);
	}
	catch (ex) {
		this.debug();
	}
	return true;
}
/*
*该事件会在文件的上传过程中反复触发，可以利用该事件来实现上传进度条
*参数file object为文件信息对象
*参数bytes complete为当前已上传的字节数
*参数total bytes为文件总的字节数
*/
function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setProgress(percent);
		progress.setStatus("上传中...");
	} catch (ex) {
		this.debug(ex);
	}
}
/*
*当一个文件上传成功后会触发该事件
*参数file object为文件信息对象
*参数server data为服务器端输出的数据
*
*/
function uploadSuccess(file, serverData) {
	try {
		
		var serverDataObj = eval("("+serverData+")");
		if(serverDataObj.code=="0000"){
			var progress = new FileProgress(file, this.customSettings.progress_target);
			progress.setComplete();
			progress.setStatus("上传成功.");
			progress.toggleCancel(false);
			showFile(file,serverDataObj);
		}
		if(serverDataObj.code=="0001"){
			var progress = new FileProgress(file, this.customSettings.progress_target);
			progress.setComplete();
			progress.setStatus("服务器返回空数据，上传失败.");
			progress.toggleCancel(false);
		}
	} catch (e) {
		this.debug(e);
	}
}
/*
*展示上传成功的文件到列表中，不是事件方法
*参数file object为文件信息对象
*参数server data为服务器端输出的数据
*
*/
function showFile(file,serverData){
	var tr = $('#attachment').find("tr:last");
	if(tr.find("input[name*='FILE_ID']").val()==""){
	}else{
		 $('#attachment').addRow();
		 tr = $('#attachment').find("tr:last");
	}
	  
	tr.find("input[name*='FILE_ID']").val(serverData.docid);
	tr.find("input[name*='FILE_NAME']").val(file.name);
	tr.find("input[name*='TYPE']").val(file.type);
	tr.find("input[name*='UPLOAD_USER']").val($("#USER_ID").val());
	var htmlValue = "<a style='text-decoration: underline;' href='/DocCenterService/doc?doc_id="+serverData.docid+"'>"+file.name+"</a>";
	tr.find("td.txtFileName").html(htmlValue);
}
/*
*当一次文件上传的流程完成时（不管是成功的还是不成功的）会触发该事件，该事件表明本次上传已经完成，上传队列里的下一个文件可以开始上传了。该事件发生后队列中下一个文件的上传将会开始
*
*
*
*/
function uploadComplete(file) {
	if (this.getStats().files_queued === 0) {
		document.getElementById(this.customSettings.cancelButtonId).disabled = true;
	}
}
/*
*文件上传被中断或是文件没有成功上传时会触发该事件。
*停止、取消文件上传或是在uploadStart事件中返回false都会引发这个事件，但是如果某个文件被取消了但仍然还在队列中则不会触发该事件
*参数file object为文件信息对象
*参数error code为错误代码，具体的可参照SWFUpload.UPLOAD_ERROR中定义的常量
*/
function uploadError(file, errorCode, message) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			progress.setStatus("上传错误: " + message);
			this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			progress.setStatus("上传失败");
			this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			progress.setStatus("服务器(IO)错误");
			this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			progress.setStatus("安全错误");
			this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			progress.setStatus("上传被限制");
			this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			progress.setStatus("文件校验失败，跳过上传");
			this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			// If there aren't any files left (they were all cancelled) disable the cancel button
			if (this.getStats().files_queued === 0) {
				document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			}
			progress.setStatus("已取消");
			progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			progress.setStatus("已暂停");
			break;
		default:
			progress.setStatus("未知错误: " + errorCode);
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}
// This event comes from the Queue Plugin
function queueComplete(numFilesUploaded) {
	var status = document.getElementById("divStatus");
	status.innerHTML = "已上传 "+numFilesUploaded + " 文件";
}
/*
*删除列表一行
*/
function doDeleteRow() {
	$('#attachment').removeRow();
}
