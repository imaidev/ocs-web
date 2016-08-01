/**
 * 生成统计图标方法
 * @author gaojingqi
 * @param swfAddress swf地址路径
 * @param width swf宽度
 * @param height swf的搞的
 * @param data 引用的xml数据文件
 * @param divId 填充div标签的id
 */
function showCharts(swfAddress,width,height,data,divId)
{
	var charts = new FusionCharts(swfAddress,divId,width,height);
	charts.setDataURL(data);
	charts.setTransparent(true);
	charts.render(divId);
}
