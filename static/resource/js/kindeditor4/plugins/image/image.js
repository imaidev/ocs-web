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
	myself.plugin.image.callback(path);
};

KindEditor.plugin('image', function(K) {
	var self = this;
	var url = self.rcUrl;
	
	self.plugin.image = {
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
		        offset:['' , ''],
		        area : ['750px','450px']
		    });
		},
		callback: function(path){
			//alert(path);
			self.exec('insertimage', path+"?random="+Math.random());
		}
	};
	
	self.clickToolbar("image", self.plugin.image.upload);
});
