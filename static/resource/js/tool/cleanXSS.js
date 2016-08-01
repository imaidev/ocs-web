function cleanXSS(obj){
		if(obj==null||obj=="null"||obj==undefined||obj=="undefined"){
			return "";
		}
		obj = obj.replace(/[\"\'][\s]*javascript:(.*)[\"\']/gi, "\"\"");
		obj = obj.replace(/script(.*)/gi, "");
		obj = obj.replace(/iframe(.*)/gi, "");
	    obj = obj.replace(/eval\((.*)\)/gi, "");
	    obj = obj.replace(/</g, "").replace(/>/g, "");
	    obj = obj.replace(/&/g, "");
	    obj = obj.replace(/\+/g, "");
	    obj = obj.replace(/\s/g, "");
	    obj = obj.replace(/\"/g, "");
	    obj = obj.replace(/\'/g, "");
	    obj = obj.replace(/\n/g, "");
	    obj = obj.replace(/\//g, "");
	    obj = obj.replace(/\(/g, "");
	    obj= obj.replace(/\)/g, "");
	    obj = obj.replace(/\=/g, "");
	    obj = obj.replace(/\|/g, "");
	    obj = obj.replace(/;/g, "");
	    return obj;
}

function checkTxtLength(str,mins,maxs){
	if(str==""){
		msg="字符串不能为空";
		return false;
	}
	var i,sum; 
	sum=0; 
	for(i=0;i<str.length;i++) 
	{ 
		if ((str.charCodeAt(i)>=0) & (str.charCodeAt(i)<=255)) 
			sum=sum+1; 
		else 
			sum=sum+2; 
		}
	//alert("sum "+sum);
	if(sum<(mins*1)){
		return "不能少于"+mins+"个字符";
	}
	if(sum>(maxs*1)){
		return "不能多于"+maxs+"个字符";
	}	 
	
	return "ok";
}

function compareTime(startDate, endDate) {   
	 if(startDate.length > 0 && endDate.length > 0) {   
		    var startDateTemp = startDate.split(" ");   
		    var endDateTemp = endDate.split(" ");   
		                   
		    var arrStartDate = startDateTemp[0].split("/");   
		    var arrEndDate = endDateTemp[0].split("/");   
		  
		    var arrStartTime = startDateTemp[1].split(":");   
		    var arrEndTime = endDateTemp[1].split(":");   
		  
		var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);   
		var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   
		                   
		if (allStartDate.getTime() > allEndDate.getTime()) {   
			jAlert("开始时间不能大于结束时间!");   
		        return false;   
		} else {   
		    return true;   
		 }   
	} else {   
		jAlert("时间不能为空");   
	    return false;   
	      }   
	}  