//兼容各种浏览器
function initXMLHttp(){
	try {
		if (XMLHttpRequest.prototype.sendAsBinary) return;
		XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		    function byteValue(x) {
		        return x.charCodeAt(0) & 0xff;
		    }
		    var ords = Array.prototype.map.call(datastr, byteValue);
		    var ui8a = new Uint8Array(ords);
		    this.send(ui8a.buffer);
		}
	} catch(e) {}
}
initXMLHttp();
var HTML5Upload;

if (HTML5Upload == undefined) {
	HTML5Upload = function (opts) {
		this.init(opts);
		this.queues=[];
		this.index=0;
		this.isupload=false;
	};
}
HTML5Upload.prototype.init = function (opts) {
	this.opts = opts;
	//创建div和一个file域，然后覆盖上按钮的上面。
	var offset = $(opts.button_placeholder).offset(); 
	var left = offset.left-2; 
	var top = offset.top-2; 
	var html = '<div style="opacity:0;overflow:hidden;position:absolute;left:'+left+'px;top:'+top+'px;width:'+opts.button_width+'px;height:'+opts.button_height+'px"><input  type="file" style="font-size:30px;" size="1" multiple=""></div>';
	var button = document.createElement("button");
	var el = $(button);
	el.css("width",opts.button_width);
	el.css("height",opts.button_height);
	el.css("border","0px");
	el.css("cursor","pointer");
	el.css("background-image","url("+opts.button_image_url+")");
	$(opts.button_placeholder).replaceWith(button);
	el.after($(html));
	this.fileObj = el.next().children().first();
	var obj = this;
	this.fileObj[0].addEventListener("change",function(e){
		obj.selectChange(e.target.files || e.dataTransfer.files)}, false);
}
HTML5Upload.prototype.selectChange=function(files){
	var files_count = files.length;
	if (files_count > this.opts.maxfiles) {
	    alert("选择文件数目超过限定数目");
	    return false;
	}
	for (var i=0; i<files_count; i++) {
		var len = this.queues.push(files[i]);
		files[i].id=len-1;
		//判断文件大小，是否超过设置的大小
		if(true){
			this.queueEvent("file_queued_handler", files[i]);
		}else{
			this.queueEvent("file_queue_error_handler", [files[i],100,"操作附件大小限制"]);
		}		
	}
}
HTML5Upload.prototype.startUpload = function (e) {
	if(this.isupload)return;
	var opts = this.opts;
	var index = this.index;
	var file = this.queues[index];
	var obj = this;
	try {
		if (this.index==this.queues.length) return;
		this.isupload=true;
		var reader = new FileReader();			
		reader.index = this.index;		
		reader.onloadend = send;
		reader.readAsBinaryString(file);
	} catch(err) {
		//opts.error(errors[0]);
		alert(err);
		return false;
	}
	//上传函数
	function send(e) {
		var xhr = new XMLHttpRequest(),
			upload = xhr.upload,
			start_time = new Date().getTime(),
			boundary = '------multipartformboundary' + (new Date).getTime(),
			builder;
		builder = getBuilder(file.name, e.target.result, boundary);
		upload.onloadstart=function(e){obj.queueEvent("upload_start_handler", file);};
		upload.addEventListener("progress", function(ev){
			obj.queueEvent("upload_progress_handler", [file,ev.loaded,ev.total]);
			}, false);
		
		xhr.open("POST", opts.upload_url, true);
		xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' 
		    + boundary);	    
		xhr.sendAsBinary(builder);  
		xhr.onload = function() { 
			obj.isupload=false;
	    	var now = new Date().getTime(), timeDiff = now - start_time;
			obj.queueEvent("upload_success_handler", [file, xhr.responseText, timeDiff]);
			obj.queueEvent("upload_complete_handler", file);
		};
	};
	function getBuilder(filename, filedata, boundary) {
		var dashdash = '--',
			crlf = '\r\n',
			builder = '';
		if(opts.post_params!=null)
		$.each(opts.post_params, function(i, val) {
	    	if (typeof val === 'function') val = val();
			builder += dashdash;
			builder += boundary;
			builder += crlf;
			builder += 'Content-Disposition: form-data; name="'+i+'"';
			builder += crlf;
			builder += crlf;
			builder += val;
			builder += crlf;
		});	
		builder += dashdash;
		builder += boundary;
		builder += crlf;
		builder += 'Content-Disposition: form-data; name="'+opts.file_post_name+'"';
		builder += '; filename="' + unescape(encodeURIComponent(file.name)) + '"';
		builder += crlf;	
		builder += 'Content-Type: application/octet-stream';
		builder += crlf;
		builder += crlf; 
		builder += filedata;
		builder += crlf;
		builder += dashdash;
		builder += boundary;
		builder += dashdash;
		builder += crlf;
		return builder;
	};
	this.index++;
};
HTML5Upload.prototype.fileDragHover =function (e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
};
HTML5Upload.prototype.queueEvent = function (handlerName, argumentArray) {
	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}
	var self = this;
	if (typeof this.opts[handlerName] === "function") {
		this.opts[handlerName].apply(this, argumentArray);		
	} else if (this.opts[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};