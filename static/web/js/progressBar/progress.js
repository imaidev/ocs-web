	
	function SetProgress(progress) {
		if (progress) {
			$("#" + progress_id + " > div")
					.css("width", String(progress) + "%"); //控制#loading div宽度 
			$("#" + progress_id + " > div").html(String(progress) + "%"); //显示百分比 
		}
	}
	var i = 0;
	function doProgress() {
		if (i > 100) {
			$("#message").html("加载完毕！").fadeIn("slow");//加载完毕提示 
			return;
		}
		if (i <= 100) {
			setTimeout("doProgress()", 100);
			SetProgress(i);
			i++;
		}
	}