package com.inspur.image
{
	import com.inspur.events.ImageFileEvent;
	
	import flash.display.Bitmap;
	import flash.display.Loader;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	import com.inspur.util.JPGEncoder;

	public class ImageFile extends Sprite
	{
		public static const GAP:uint = 5;
		public static const WIDTH:uint = 108;
		public static const HEIGHT:uint = 108;
		
		private var file:FileReference;
		private var loader:Loader;
		
		private var container:Sprite;
		private var containerMask:Shape;
		private var bg:*;
		
		public var fileName:String;
		public var size:Number;
		public var data:ByteArray;
		public var contentType:String;
		public var createDate:String;
		public var modifyDate:String;
		
		
		public function ImageFile(file:FileReference)
		{
			this.file = file;
			this.bg = new ImageFileBg();
			this.addChild(bg);
			bg.nameTxt.text = file.name;
			container = new Sprite();
			this.addChild(container);
			this.containerMask = new Shape();
			this.containerMask.graphics.beginFill(0x000000);
			this.containerMask.graphics.drawRect(0,0,WIDTH,HEIGHT);
			this.container.mask = this.containerMask;
			this.addChild(this.containerMask);
			this.file.addEventListener(Event.COMPLETE,showImage);
			this.file.addEventListener(IOErrorEvent.IO_ERROR,error);
			this.addEventListener(MouseEvent.MOUSE_OVER,overHandler);
		}
		/**
		 * 开始加载预览图片
		 * */
		public function startLoad():void{
			this.file.load();
		}
		
		private function showImage(e:Event):void{
			trace("预览中");
			loader = new Loader();
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE,completeHandler);
			loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR,error);
			loader.loadBytes(this.file.data);
		}
		
		private function  completeHandler(e:Event):void{
			var bitmap:Bitmap = this.loader.content as Bitmap;
			this.container.addChild(bitmap);
			
			//处理编码图像数据
			this.data = new JPGEncoder(100).encode(bitmap.bitmapData);
			this.name = this.file.name;
			this.contentType = this.file.type;
			this.size = this.file.size;
			this.createDate = this.file.creationDate.toDateString();
			this.modifyDate = this.file.modificationDate.toDateString();
			

			//调整显示图像大小
			if(bitmap.width>bitmap.height){
				bitmap.height = HEIGHT;
				bitmap.scaleX = bitmap.scaleY;
			}else{
				bitmap.width = WIDTH;
				bitmap.scaleY = bitmap.scaleX;
			}
			
			
			this.dispatchEvent(new ImageFileEvent(ImageFileEvent.LOAD_COMPLETE));
		}
		
		private function error(e:IOErrorEvent):void{
			trace("预览error");
			trace("e:"+e);
			this.dispatchEvent(new ImageFileEvent(ImageFileEvent.LOAD_COMPLETE));
		}
		
		/**
		 * 鼠标滑过处理
		 * 
		 * */
		private function overHandler(e:MouseEvent):void{
			this.addEventListener(MouseEvent.MOUSE_OUT,outHandler);
			
		}
		
		private function outHandler(e:MouseEvent):void{
			this.removeEventListener(MouseEvent.MOUSE_OUT,outHandler);
		}
		
		
		
	}
}
