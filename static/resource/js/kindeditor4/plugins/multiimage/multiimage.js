/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/
var myself;

var uploadCallBack = function(path){
	var returnPath = new Array;
	returnPath = path.split(",");
	for(var i =0;i<returnPath.length;i++){
		myself.plugin.multiimage.callback(returnPath[i]);
	}
	
};

KindEditor.plugin('multiimage', function(K) {
	var self = this;
	debugger;var url = self.rcUrlMulti;
	
	self.plugin.multiimage = {
		upload: function(){
			myself = self;
			$.layer({
		        type : 2,
		        iframe : {
		            src : url
		        },
		        title : "图片上传",
		        closeBtn : false,
		        shadeClose: true,
		        offset:['50px' , ''],
		        area : ['850px','600px']
		    });
		},
		callback: function(path){
			self.exec('insertimage', path);
		}
	};
	
	self.clickToolbar("multiimage", self.plugin.multiimage.upload);
});
