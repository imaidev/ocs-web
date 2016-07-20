package {
	import com.inspur.json.JSON;
	import com.inspur.pojo.File;
	import com.inspur.util.MultiPartFormData;
	
	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.net.FileReference;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestHeader;
	import flash.net.URLRequestMethod;
	import flash.system.Security;
	
	/**
	 * 文件上传
	 * 默认上传按钮不可见，该swf作为透明区域隐藏在html上
	 * */
	public class iu extends Sprite
	{
		private var _parameter:Object;//参数容器
		private var _fileType:String;//文件类型
		private var _fileReference:FileReference;//文件选择器
		
		
		
		
//		private var previewPage:MovieClip;
//		private var container:MovieClip;
//		private var scrollBar:MovieClip;
//		private var appendBtn:SimpleButton;
//		private var uploadBtn:SimpleButton;
//		private var tipTxt:TextField;
		
		private var _file:File;
		
		
		
		/**
		* 构造函数
		*/
		public function iu()
		{
			if (stage)this.init();
			var btn:SimpleButton;
		}
		
		/**
		 * 初始化 
		 */
		private function init():void{
			
			//默认上传按钮不可见，该swf作为透明区域隐藏在html上
			imgUpBtn.alpha = 0.0;
			fileUpBtn.alpha = 0.0;
			Security.allowDomain("*");
			
            //初始化对象
            this._file = new File();
			this._fileReference = new FileReference();
            this._parameter = this.loaderInfo.parameters;
            
			
			//初始化事件
            this.imgUpBtn.addEventListener(MouseEvent.CLICK,imgChooseHandler);//上传图片
			this.fileUpBtn.addEventListener(MouseEvent.CLICK,fileChooseHandler);//上传文件
  			this._fileReference.addEventListener(Event.SELECT, selectHandler);//选择文件
  			this._fileReference.addEventListener(Event.COMPLETE, onFileLoadCompleteHandle);//文件上传完毕
  			
  			ExternalInterface.addCallback("btnEnable", btnEnable);//允许鼠标点击
  			ExternalInterface.addCallback("btnUnEnable", btnUnEnable);//组织鼠标点击
  		}
  		
		/**
		* 选择图片
		*/
  		private function imgChooseHandler(e:MouseEvent):void{
  			_file.type = File.TYPE_IMG;
			fileBrowse([File.IMG_FILTER]);
  		}
		
		/**
		* 选择文件
		*/
  		private function fileChooseHandler(e:MouseEvent):void{
  			_file.type = File.TYPE_FILE;
  			fileBrowse([File.FILE_FILTER]);
  		}
		
		/**
		* 文件选择器
		* @parame 
		*/
		private function fileBrowse(fileFilter):void{
			try{
				this._fileReference.browse(fileFilter);//browse的参数是以个FileFilter对象，限制文件选择的类型
			}catch (e:Error){
                trace("文件选择异常: " + e.toString());
                ExternalInterface.call("fileUpError",e.toString());
            }
		}
  		
		/**
		 * 文件选择完毕后进行加载
		 **/
		private function selectHandler(e:Event):void{
			try{
				var fileData = e.target;
				ExternalInterface.call("fileUpLoading");
				_fileReference.load();
//				trace("开始上传!!!前台传来的uid:" + uid + ",方法名：" + callback + ",url:" + url + ",fileData.data:" + fileData.data);
//				ExternalInterface.call(callback,fileData.name);
			}catch(ex:Error){
				trace("文件上传出错：" + ex.toString());
				ExternalInterface.call("fileUpError",e.toString());
			}
		}
		
		/**
		 * 加载完毕后进行上传
		 */ 
		function onFileLoadCompleteHandle(e:Event) {
			try{
				var fileData = e.target;
				
				//File对象
				_file.name = fileData.name;
				_file.id = "204";
				ExternalInterface.call("fileUpComplete",_file);
				return;
				//数据对象
				var formData:MultiPartFormData = new MultiPartFormData();
				formData.addFormField("uid",this._parameter["uid"]);
	            formData.addFormField("type",_file.type);
	            formData.addFormField("file_post_name","uploadfile");
	            formData.addFormField("default_place",File.TYPE_DEFAULT);
	            formData.addStreamFile("uploadfile",fileData.name,fileData.data);
			
	        	//请求
	        	var urlHeader:URLRequestHeader = new URLRequestHeader("Content-Type", "multipart/form-data; boundary="+formData.BOUNDARY);
	            var urlRequest:URLRequest = new URLRequest(this._parameter["url"]);
	            urlRequest.requestHeaders.push(urlHeader);
	            urlRequest.method = URLRequestMethod.POST;
	            urlRequest.data = formData.getFormData();
	            var urlLoader:URLLoader = new URLLoader();
	            urlLoader.addEventListener(Event.COMPLETE, this.uploadSuccess);
	            urlLoader.addEventListener(IOErrorEvent.IO_ERROR, this.uploadError);
	            urlLoader.load(urlRequest);
				
			}catch(ex:Error){
				trace("文件上传出错：" + ex.toString());
				ExternalInterface.call("fileUpError","文件上传出错，错误日志：" + ex.toString());
			}
		}
		
		
		/**
		 * 上传成功
		 */ 
		private function uploadSuccess(e:Event):void{
			try{
				var data:String = (e.target as URLLoader).data;
				trace("文件上传成功。返回数据："+data);
				var json:Object = JSON.decode(data);
				if(json){
					if(_file.type == File.TYPE_IMG){
						_file.id = json.photo_id;
					}else if(_file.type == File.TYPE_FILE){
						_file.id = json.docid;
					}
					ExternalInterface.call("fileUpComplete",_file);
				}else{
					errorCallback("服务器繁忙！");
				}
			}catch(e:Error){
				errorCallback(e.toString());
			}
		}
		
		/**
		 * 上传失败
		 */ 
		private function uploadError(e:IOErrorEvent):void{
			errorCallback(e.toString());
		}
		
		/**
		 * 出错后回调js前台
		 */ 
		private function errorCallback(msg:String):void{
			trace("文件上传失败！错误日志：" + msg);
			ExternalInterface.call("fileUpError","文件上传失败，错误日志：" + msg);
		}
		
		/**
		 * 屏蔽上传事件
		 * 图片上传完毕没有发送时调用，防止同时上传多个文件
		 */ 
		public function btnUnEnable():void{
			trace("阻止图片上传！！！");
			this.imgUpBtn.mouseEnabled=false;
			this.fileUpBtn.mouseEnabled=false;
		}
		
		/**
		 * 允许上传事件
		 * 发送图片后允许继续上传文件
		 */ 
		public function btnEnable():void{
			trace("允许图片上传！！！");
			this.imgUpBtn.mouseEnabled=true;
			this.fileUpBtn.mouseEnabled=true;
		}
	}
}

