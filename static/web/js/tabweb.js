 function switchTab(tabCount,ProTag, ProBox) {
	if(tabCount <=1){
		return;
	}
    for (i = 1; i < tabCount+1; i++) {
        if ("tab" + i == ProTag) {
            document.getElementById(ProTag).getElementsByTagName("a")[0].className = "on";
        } else {
            document.getElementById("tab" + i).getElementsByTagName("a")[0].className = "";
        }
        if ("con" + i == ProBox) {
            document.getElementById(ProBox).style.display = "";
        } else {
            document.getElementById("con" + i).style.display = "none";
        }
    }
}