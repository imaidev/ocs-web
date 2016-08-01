
/**百度地图开始**/
window.map = new BMap.Map("baiduMap");
//弹出框初始化
var opts = {
    width: 320,     // 信息窗口宽度
    title: "", // 信息窗口标题
    enableMessage: false, //设置允许信息窗发送短息
    offset: new BMap.Size(0, -24)
};

//打开地图窗口
function openInfo(content, e) {
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow, point); //开启信息窗口
}

//初始化地图
function initBaiduMap(action, search_key) {
    $.ajax({
        url: "Map/helper/indexBaiduMapHelper.ashx?action=" + action + "&search_key=" + encodeURIComponent(search_key),
        cache: false,
        success: function (result) {
            if (result != "") {
                result = eval("(" + result + ")");

                //map.centerAndZoom("临沂", 1);      // 用城市名设置地图中心点
                map = new BMap.Map("baiduMap");

                //设置默认图标
                //var icon = new BMap.Icon('/images/wzlogoico.png', new BMap.Size(22, 22), { anchor: new BMap.Size(11, 0) });

                map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                map.enableInertialDragging(); // 开启惯性拖拽效果

                //向地图中添加比例尺控件
                var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
                map.addControl(ctrl_sca);

                // 添加带有定位的导航控件
                var navigationControl = new BMap.NavigationControl({
                    // 靠左上角位置
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    // LARGE类型
                    type: BMAP_NAVIGATION_CONTROL_LARGE,
                    // 启用显示定位
                    enableGeolocation: true
                });
                map.addControl(navigationControl);

                //添加卫星切换
                map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP] }));

                //生成市场列表
                var marketList = "";
                for (var i = 0; i < result.market.length; i++) {
                    marketList += "<li class='sel' onclick=showInfo('" + result.market[i].id + "','" + result.market[i].title + "','" + result.market[i].img_url + "','" + result.market[i].contact_user + "','" + result.market[i].telephone + "','" + result.market[i].address + "','" + result.market[i].baidu_map_coordinate + "')>";
                    marketList += " <a>";
                    marketList += "     <div class='res-num'>";
                    marketList += "         <span class='num'>" + (i + 1) + "</span>";
                    marketList += "     </div>";
                    marketList += "     <div class='res-infos'>";
                    marketList += "         <p id='market_name'>市场名称： " + result.market[i].title + "</p>";
                    marketList += "         <p id='market_addr'>市场地址： " + result.market[i].address + "</p>";
                    marketList += "     </div>";
                    marketList += " </a>";
                    marketList += "</li>";

                }
                $("#market_container").html(marketList);

                //生成百度地图坐标点
                var point_list = new Array();
                for (var i = 0; i < result.market.length; i++) {
                    var marketItem = result.market[i];
                    var point_array = result.market[i].baidu_map_coordinate.split(",");
                    if (point_array.length == 2) {
                        //坐标点定位地图
                        var marker = new BMap.Marker(new BMap.Point(point_array[0], point_array[1]));
                        map.addOverlay(marker);
                        point_list[point_list.length] = new BMap.Point(point_array[0], point_array[1]);
                        var popinfo = "<div style='width:320px;'><div style='float:left;display:inline;width:100px;height:90px;'><a ><img width='90' height='80' src='.." + marketItem.img_url + "'/></a></div><div style='float:left;display:inline;width:215px;margin-left:5px;'><p style='font-weight:bold;'><a style='color:Black;' target='_blank'>" + marketItem.title + "</a></p><p>商铺数量：" + marketItem.all_shop_num + "</p><p>联系电话：" + marketItem.telephone + "</p><p>地址：" + marketItem.address + "</p><p style='width:100%;text-align:right;margin-right:10px;'><a href='Map/ShopMap.aspx?id=" + marketItem.id + "' target='_blank'>进入地图</a></p></div></div>";
                        //ie7 ie8 事件不支持
                        var isIE = !!window.ActiveXObject;
                        var isIE6 = isIE && !window.XMLHttpRequest;
                        var isIE8 = isIE && !!document.documentMode;
                        var isIE7 = isIE && !isIE6 && !isIE8;
                        if (isIE8 || isIE7) {
                        } else {
                            marker.addEventListener("click", openInfo.bind(null, popinfo));
                        }
                    }
                }
                if (point_list.length > 0) {
                    //让所有点在视野范围内
                    map.setViewport(point_list);
                }
                else {
                    map.centerAndZoom("临沂", 11);
                }
            }
            else {
                map = new BMap.Map("baiduMap");
                map.centerAndZoom("临沂", 11);
            }
        }
    });
}

$(document).ready(function () {
    $("#mask").on("click", function () {
        $(this).remove();
    });
    initBaiduMap("classify", $("#first_classify_id").val());
});