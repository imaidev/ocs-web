	function showLoading(objId)
	{
		 
			var img = $("#"+objId+" img");
			var parentObj=$("#"+objId);
			
	 		if(img.length==0){
				$("#"+objId).append('<a   href= "#a " class ="loadingImg"  style="border: 0px none; position: absolute; top: '+(parentObj.offset().top+parentObj.height()/2-16)+'px; left: '+(parentObj.offset().left+parentObj.width()/2-16)+'px; background-color:transparent; width: 32px; height: 32px; z-index: 1001; " />');
				//уз╦г╡Ц
				$("#"+objId).append('<div   style="border: 0px none; position: absolute; top: '+parentObj.offset().top+'px; left: '+parentObj.offset().left+'px; background-color:transparent; width: '+parentObj.width()+'px; height:'+parentObj.height()+'px; z-index: 1000; ">');
	 		}	
		 
	}
	//detachloading img
	function detachLoading(objId)
	{
		var img = $("#"+objId+" a");
		var div = $("#"+objId+" div");
		if(img.length>0)
			{
			img.detach();
			div.detach();
			}
			
	}
	
	
