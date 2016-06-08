<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	request.setAttribute("ctx", request.getContextPath());
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	<script type="text/javascript" src="/ecweb/uweb/swfobject.js" ></script>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>上传文件----imgUpload</title>
	
		<script type="text/javascript">
			window.onload = function(){ 
				var flashVars = {
					id : "fileUpload",
					swfPath : "/ecweb/uweb/imgUpLoad.swf",
					url :  'http://yanfa.inspur.com/ecweb/resUpload.res?method=flashUpload',
					type:"doc",
					dir :"item444",
					maxuploadsize:"20M", 
					fileUpError : "fileUpError",
					fileUpComplete:"fileUpComplete",
					checkFileSize:"checkFileSize11" //超过设置的限制大小，会调用这个回调函数，在该回调函数中自定义提示信息
				};
				swfobject.embedSWF(flashVars);
			};
			
			
			function fileUpComplete(path){
			  alert("上传文件名称:"+path);
            }
			
			function checkFileSize11(result){
				alert("上传文件超过最大限制");
            }
			function fileUpError(msg){
				alert(msg);
			}
		</script>
	</head>
	<body>
	<div id="focusViwer" align="center">
		<div id="fileUpload">上传</div> 
	</div>

	<div id="divPro"></div>
	</body>
</html>
