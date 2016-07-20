/**
 * 侧边栏界面配置
 * @type
 */
 
 /********右侧tab切换js*********/
function ChangeDiv(menuName, indexes, divName, divCount){
	for(i = 0; i < divCount; i++){
		var menu = document.getElementById(menuName + i);
		var con = document.getElementById(divName + i);
		menu.className = i == indexes ? "current" : "";
		con.style.display = i == indexes ? "block" : "none";
	}
}
//var sideBar = {
//	//
//};

