package com.inspur.pojo
{
	import flash.net.FileFilter;
	
	public class File
	{
		private var _id:String;//文件id
		private var _name:String;//文件名
		private var _type:String;//类型(文件或者图片)
		
		//常量
		public static const TYPE_IMG:String = "image";
		public static const TYPE_FILE:String = "doc";
		public static const TYPE_DEFAULT:String = "weibo";
		
		//图片过滤器
		public static const IMG_FILTER:FileFilter = new FileFilter("选择图片 *.jpg;*.jpeg;*.gif;*.png", "*.jpg;*.jpeg;*.gif;*.png");
		//文件过滤器
		public static const FILE_FILTER:FileFilter = new FileFilter("选择文件 *.*", "*.*");
		
		public function set name(name:String):void{
			this._name = name;
		}
		public function get name():String{
			return this._name;
		}
		
		public function set id(id:String):void{
			this._id = id;
		}
		public function get id():String{
			return this._id;
		}
		
		public function set type(type:String):void{
			this._type = type;
		}
		public function get type():String{
			return this._type;
		}
	}
}