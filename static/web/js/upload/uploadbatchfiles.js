
var swfu;

window.onload = function () {
	swfu = new SWFUpload({
		// Backend settings
		upload_url: "DocCenterService/upload",
		file_post_name: "uploadfile",

		// Flash file settings
		file_size_limit : "50 MB",
		file_types : "*.*",
		file_types_description : "All Files",
		file_upload_limit : "3",
		file_queue_limit : "3",
		custom_settings : {
			progressTarget : "fsUploadProgress",
			cancelButtonId : "btnCancel"
		},
		// Event handler settings
		
		swfupload_preload_handler : preLoad,
		swfupload_load_failed_handler : loadFailed,
		file_dialog_start_handler: fileDialogStart,
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,
		queue_complete_handler : queueComplete,

		// Button Settings 
		button_image_url : "skin/js/upload/XPButtonUploadText_61x22.png",
		button_placeholder_id : "spanButtonPlaceholder",
		button_width: 62,
		button_height: 22,
		
		// Flash Settings
		flash_url : "skin/js/upload/swfupload.swf",

		
		
		// Debug settings
		debug: false
	});

};

