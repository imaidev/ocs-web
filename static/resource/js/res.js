/**
 * 获取某种尺寸的图片路径
 * 如果路径为空和size 都为空，则返回默认图片原图路径。
 * 			如果size不为空，返回指定size尺寸的默认图片路径
 * @param path
 *            原图路径
 * @param size
 *            尺寸，比如100x100
 */

function getResCutPath(path, size) {
	//默认图片路径
	var defaultRes = "/res/default/grey.png";
	
	if (null == path || "" == path) {
		if (size != "null" && size != "" && size != undefined && size != null) {
			defaultRes = "/res/default/" + size + "/grey.png";
		}
		return defaultRes;
	}
	//大小为空，则返回原图
	if (size == "null" || size == "" || size == undefined || size == null) {
		return path;
	}
	
	var pos = path.lastIndexOf("/");
	return path.substring(0, pos + 1) + size + path.substring(pos);
}
