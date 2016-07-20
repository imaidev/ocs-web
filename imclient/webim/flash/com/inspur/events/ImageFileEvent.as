package com.inspur.events
{
	import flash.events.Event;

	public class ImageFileEvent extends Event
	{
		public static const LOAD_COMPLETE:String = "load_complete";
		
		public function ImageFileEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
		}
		
	}
}