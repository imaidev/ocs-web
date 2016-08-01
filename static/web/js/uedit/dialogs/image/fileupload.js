var config ={};
//初始化全局变量
$.fn.initConfig = function(){
	var ajaxUrl="/static/web/config.ini";
	$.ajax({
		type : 'post',
		url : ajaxUrl,
		dataType : 'json',
		contentType : 'application/json',
		async:false,
		success : function(data) {
			config =data;
		},
		error : function() {
		}
	});	
};
$(document).ready(function(){
	$.fn.initConfig();
     initView();
});
function showPanel() {
		isUpload = false;
		$("#uploadbox").dialog({
			width: "548",
			height: "380",
            title: "上传文件",
            modal: true,
            open:function(){
            	//渲染页面后，再初始化flash对象
        		if(!initFlashFlag){
        			initFlash();
        			initFlashFlag = true;
        		}
            },
            close:function(){
            	$('#log').empty();
            	btnFloatCenter();
            	if(isUpload) {
					var ret=result.split(",");
					var listview=[];
					var imgObjs=[];		        
					for(var i=0;i<ret.length-1;i++){
						listview.push('<div class="upload-img-box">');
						listview.push('<img src="'+config.docServerUrl+'pubDoc?doc_id='+ret[i]+'" style="width:185px;height: 120px;"/>');
						listview.push('<div class="upload-img-box-width" >宽度:<input type="text"  />px</div>');
						listview.push('<div class="upload-img-box-height">高度:<input type="text" />px</div>');
						listview.push('</div>');						
						//listview.push('<a href="http://10.10.10.67/DocCenterService/pubDoc?doc_id='+ret[i]+'"></a>');
					}					
					$("#resultimg").html(listview.join(""));
					$("#resultimg").show();
						
				dialog.onok = function () {    
		        var imgWidth='';
		        var imgHeight='';
				$(".upload-img-box").each(function(j){		
					imgWidth=$(".upload-img-box-width input",$(this)).val();
					imgHeight=$(".upload-img-box-height input",$(this)).val()
					imgObjs[j]={src:$("img",$(this)).attr("src"),width:imgWidth?imgWidth+"px":'',height:imgHeight?imgHeight+"px":''};
				});
                editor.fireEvent('beforeInsertImage', imgObjs);
                editor.execCommand("insertImage", imgObjs);              
          };
					
					
					
            }
          }
		});
		
	}
	function hidePanel() {
		$("#uploadbox").dialog("close");
	}
	
	function initView() {
		//var hash = box.getHashcode();			
		//截取/和|之间的文件夹id
		//var start=hash.indexOf("/");
		//var stop=hash.indexOf("|");
		//pid=hash.substring(start+1,stop);
		//但url为#list|.. 时，start为-1，所以得到的pid=#list 
		//if(start<0){
		//	pid="0"; // 如果是根目录，则pid为0
		//}
		$("#cancelbtn").click(function(e) {
			hidePanel();
		});
		//curdisk=data.disklist[0];
		
		// 解决IE6浏览器下，上传文件按钮出不来的问题
		// 这个问题可能的原因是：在加载SWF时被取消，SWF加载不成功
		// 通过延迟50毫秒加载SWF，避免加载SWF被后面的代码阻止
		setTimeout(function() {
			showPanel();
		}, 50);
	}
	/**
	 * cancleFlag --取消上传的文件数 
	 * 			 -- 取消上传，总数减去1，排队数减去1
	 * finishFlag --已经成功上传的文件数
	 * 			 -- 成功上传，排队数减去1
	 * failFlag  --上传失败数
	 *  		 --上传失败，失败数加1
	 */
	function freshData(cancleFlag,finishFlag,failFlag){
		if(cancleFlag ){
			fileSelectedNum -= 1;
			filesQueuedNum  -= 1;
		}
		if(finishFlag){
			filesQueuedNum -= 1;
		}
		if(failFlag){
			fileFailNum += 1;
		}
		if(fileSelectedNum == 0 && filesQueuedNum==0){
			queuestatus.text("");
			btnFloatCenter();
		}else if(fileFailNum>0 && filesQueuedNum ==0){
			queuestatus.text('已选中: ' + fileSelectedNum + ' / 上传失败: ' + fileFailNum);
		}else if(filesQueuedNum>0){
			queuestatus.text('已选中: ' + fileSelectedNum + ' / 排队中: ' + filesQueuedNum);
		}
	}
	//刷新
//	function freshData(){
//		fileSelectedNum --;
//		filesQueuedNum --;
//		if(filesQueuedNum ==0){
//			queuestatus.text("");
//			btnFloatCenter();
//		}else if(filesQueuedNum>0){
//			queuestatus.text('已选中: ' + fileSelectedNum + ' / 排队中: ' + filesQueuedNum);
//		}
//	}
		//按钮移动到左下方
		function btnFloatLeft(){
			var multiObject = $.multiupload.getInstance('#fsUploadProgress');
			if(multiObject != null) {
				multiObject.setButtonDimensions("84", "30");
				multiObject.setButtonText('<span class="btnStyleNew">继续添加</span>');
				multiObject.setButtonTextPadding(0, 8);
				multiObject.setButtonTextStyle(".btnStyleNew {color:#5c5c5c;font-size:12px;text-align:center}");
				multiObject.setPostParams({
					uid:userId,
					folder_id:0
					});
			}
			$("#uploadfirstwrapper").css({
	            left: "1.4em",
	            top: "auto",
	            width: "84px",
	            height: "30px"
	        }).addClass("whiteBtn").removeClass("blueBtn");
		}
		//按钮移动到中央
		function btnFloatCenter(){
			timewait = 0;
			
			var multiObject = $.multiupload.getInstance('#fsUploadProgress');
			if(multiObject != null) {
				multiObject.setButtonDimensions("168", "43");
				multiObject.setButtonText('<span class="flashStyle">选择电脑上的文件</span>');
				multiObject.setButtonTextPadding(0, 13);
				multiObject.setButtonTextStyle(".flashStyle {color:#FFFFFF;font-size:16px;text-align:center}");
			}
			$("#uploadfirstwrapper").css({
	                 left: "190px",
	                 top: "130px",
	                 width: "168px",
	                 height: "43px"
	             }).addClass("blueBtn").removeClass("whiteBtn");
		}
		//取消上传
		function cancelUpload(file){
			 var swfu = $.multiupload.getInstance('#fsUploadProgress');
			 swfu.cancelUpload(file.id);
			 $('#log li#' + file.id).find('p.status').text('取消');
			 $('#log li#' + file.id).find('span.stopUpload').css('background-image','none');
			 $('#log li#' + file.id).find('span.stopUpload').css('cursor','defult');
			 $('#log li#' + file.id).remove();
			if( $("#log li").length == 0){
				btnFloatCenter();
			}
		}
		function isAppFile(extName){
    	extName = extName.toLocaleLowerCase();
		//var ret0=extName == ".exe" || extName == ".bat" || extName == ".cmd"
		//	|| extName == ".msi" || extName == ".vbs" || extName == ".js" 
		//	|| extName == ".reg" || extName == ".src" ; 
		//var ret=extName == ".png" || extName == ".jpeg" || extName == ".jpg" || extName == ".gif" || extName == ".bmp"
		//"bmp","dib","gif","jfif","jpe","jpeg","jpg","png","tif","tiff","ico"
		return extName == ".png" || extName == ".jpeg" || extName == ".jpg" 
			|| extName == ".gif" || extName == ".jfif" || extName == ".bmp"
			|| extName == ".dib" || extName == ".tiff" || extName == ".jpe"
			|| extName == ".tif" || extName == ".ico";
    }
		
		function swfFileQueued(event, file) {
			//var disk_maxsize=curdisk.disk_max_space;//当前网盘的总大小，单位B
			//var disk_usesize=curdisk.disk_use_space;//当前网盘的使用大小，单位B
			 btnFloatLeft();
			 var listitem = '<li id="' + file.id + '" >' +
             '文件名: <em>' + file.name + '</em> (' + Math.round(file.size / (1024)) + ' KB) <span class="progressvalue" ></span>' +
             '<div class="progressbar" ><div class="progress" ></div></div>' +
             '<p class="status" >Pending</p>' +
             '<span class="stopUpload" ></span>' +
             '</li>';
			 $('#log').append(listitem);
			 $('li#' + file.id + ' .stopUpload').bind('click',function () { //Remove from queue on cancel click
				 cancelUpload(file)
				 });
			var max = 500;
			//if(DISKLIMIT.UPLOAD_LIMIT != ""){
			//	 max = DISKLIMIT.UPLOAD_LIMIT;
			//}
			// disk_usesize = Number(file.size) + Number(disk_usesize);
			 var appFlag = isAppFile(file.type);
			 if(false){
				 var swfu = $.multiupload.getInstance('#fsUploadProgress');
				 swfu.cancelUpload(file.id);
				 $('#log li#' + file.id).find('p.status').text('该网盘容量已满'); 
				 return;
			 }else if(!appFlag){
				 var swfu = $.multiupload.getInstance('#fsUploadProgress');
				 swfu.cancelUpload(file.id);
				 $('#log li#' + file.id).find('p.status').text('不支持该格式文档上传!');
				 //freshData(0,0,1);
				 return;
			 }else if(file.size>max*1024*1024){ //超过大小不上传
				 var swfu = $.multiupload.getInstance('#fsUploadProgress');
				 swfu.cancelUpload(file.id);
				 $('#log li#' + file.id).find('p.status').text('文件大小不能超过'+max+'M!');
				// freshData(0,0,1);
				 return;
			 }else{
				 //注意：is_update=0用来和“更新”is_update=1进行区分 <doc_attachment_address>dd,dd</doc_attachment_address>
				 //var extents = "<qd><data_source_type>1</data_source_type><font_size>22px</font_size><department>青岛政务</department><doc_attachment_name>xxxx,mmm</doc_attachment_name></qd>";
				$.multiupload.getInstance($('#fsUploadProgress')).setPostParams({uid:userId});
				 //$.multiupload.getInstance($('#fsUploadProgress')).setPostParams({uid:userId,type:'image',default_place:'weibo'});
				 $(this).multiupload('startUpload');   // start the upload since it's queued
			 }
			 divs.scrollTop = divs.scrollHeight; //显示最后一个上传任务
        }
		function fileQueueErrors(event, file, errorCode, message) {
//			hidePanel();
			box.showDialog({content: message});
        }
		function fileDialogComplete(event, numFilesSelected, numFilesQueued) {
			fileSelectedNum += numFilesSelected;
			filesQueuedNum += numFilesQueued;

//			if(numFilesSelected>0){
//				queuestatus.text('已选中: ' + fileSelectedNum + ' / 排队中: ' + filesQueuedNum);	
//			}
        }
		function uploadStart(event, file) {
            $('#log li#' + file.id).find('p.status').text('上传中...');
            $('#log li#' + file.id).find('span.progressvalue').text('0%');
            $('#log li#' + file.id).find('span.cancel').hide();
        }
		function uploadProgress(event, file, bytesLoaded,total) {
        	if(total==null)total = file.size;
            // Show Progress
            var percentage = Math.round((bytesLoaded / total) * 99);
            $('#log li#' + file.id).find('div.progress').css('width', percentage + '%');
            $('#log li#' + file.id).find('span.progressvalue').text(percentage + '%');
        }
		function uploadSuccess(event, file, serverData) {
			var json_data = $.parseJSON(serverData); 
            if(json_data=="" || json_data.code=="0000"){
            	 var item = $('#log li#' + file.id);
                 item.find('div.progress').css('width', '99%');
                 item.find('span.progressvalue').text('99%');
                 item.find('p.status').html('上传失败，请重新上传！ ');
                 //item.find('span.stopUpload').css('background-image','none') ;
                 //item.find('span.stopUpload').css('cursor','default') ;
            }//else if (json_data.code=="1000") {
            	//var item = $('#log li#' + file.id);
                //item.find('p.status').html('网盘空间已满');
			//}
			else{
            	 var item = $('#log li#' + file.id);
                 item.find('div.progress').css('width', '100%');
                 item.find('span.progressvalue').text('100%');
                 item.addClass('success').find('p.status').html('恭喜您，上传成功！ ');
                 item.find('span.stopUpload').css('background-image','none') ;
                 item.find('span.stopUpload').css('cursor','default') ;
				 result+=json_data+",";
//               item.delay(timewait*301).animate({height:'hide'},300,function(){ // 使用延时的方法不妥，暂用
//             	freshData();
//             });
             //freshData(0,1,0);
             //返回值转为json数据
             //var doc_id=json_data.docid;
             //1、您已共享当前文件夹给好友
             //2、若您上传的文件，在当前文件夹下已存在同名同类型的文件，（即认为您想要更新此文件）
             //3、但是，此时该共享文件已经被您的共享人锁定
             //若同时满足以上三点，那么，就会弹出此对话框
             //if(doc_id<0){
             //	box.showDialog({content:"很巧哦！'"+file.name+"'该刚被您的共享好友锁定了！为避免冲突，您暂不可上传与此同名的文件！"});
             //}
             
             isUpload = true;
          }
		}
		function uploadComplete(event, file) {
            // upload has completed, try the next one in the queue
            $(this).multiupload('startUpload');
        }
		function initFlash(){
			$('#log').empty();
			try{
        		$("#fsUploadProgress").multiupload({       			
                    upload_url:config.docServerUrl+"pubUpload",
                    file_post_name:'uploadfile',
                    file_size_limit:"20000 MB",                
                    file_types:"*.*",
                    file_types_description:"All files",
                    flash_url:'upload/swfupload.swf',
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    button_width:168,
                    button_height:43,
                    button_text:'<span class="btnStyle">选择电脑上的文件</span>',
                    button_text_style: ".btnStyle { color: #FFFFFF; font-size:16px;text-align:center}",
                    button_text_top_padding:13,
                    button_cursor:-2,
                    button_placeholder_id:"uploadfirst",
                    debugEnabled:true
                })
                .bind('fileQueued', swfFileQueued)
                .bind('fileQueueError',fileQueueErrors)
                .bind('fileDialogComplete',fileDialogComplete)
                .bind('uploadStart', uploadStart)
                .bind('uploadProgress',uploadProgress)
                .bind('uploadSuccess', uploadSuccess)
                .bind('uploadComplete', uploadComplete)
                .bind('debug', function(msg) {
                	alert(msg);
                })
                .bind('flashReady', function(msg) {
                	alert("flash ready");
                });
    			}catch(ex){
    				alert(ex);
    			}
		}
           
