var province = [],
addr_url_pub = '/ecweb/zywlitem/goods/goodsInfoSim/PublishItem.do?method=getAddrKids';
if(province.length == 0){
    $.post(addr_url_pub+"&zoneId=-1",function(zoneJson){
        if(zoneJson!=null&&zoneJson!=undefined&&zoneJson!=""&&JSON.parse(zoneJson).zone != undefined){
            initProvince(JSON.parse(zoneJson).zone);
        }
    });
}
//初始化省
function initProvince(provinceObj){
    if(province.length == 0){
        province=provinceObj;
    }
}

function SelCity(obj,e) {
    var ths = obj;
    var dal = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">省份</li><li>城市</li><li>区县</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><div style="display:none" id="_citys2" class="_citys1"></div></div>';
    Iput.show({ id: ths, event: e, content: dal,width:"470"});
    $("#cColse").click(function () {
        Iput.colse();
    });
    var tb_province = [];
    var b = province;
    for (var i = 0, len = b.length; i < len; i++) {
        tb_province.push('<a data-level="0" data-id="' + b[i]['ZONE_ID'] + '" data-name="' + b[i]['ZONE_NAME'] + '">' + b[i]['ZONE_NAME'] + '</a>');
    }
    $("#_citys0").append(tb_province.join(""));
    $("#_citys0 a").click(function () {
        ajaxCity($(this),ths);

    });
    $("#_citysheng li").click(function () {
        $("#_citysheng li").removeClass("citySel");
        $(this).addClass("citySel");
        var s = $("#_citysheng li").index(this);
        $("._citys1").hide();
        $("._citys1:eq(" + s + ")").show();
    });
}
function ajaxCity(obj,ths){
    var c = obj.data('id'),
    g = '';

    $.post(addr_url_pub+"&zoneId="+c,function(zoneJson){
        if(zoneJson!=null&&zoneJson!=undefined&&zoneJson!=""&&JSON.parse(zoneJson).zone != undefined){
            $.each(JSON.parse(zoneJson).zone,function(index,item){
                g += '<a data-level="1" data-id="' + item['ZONE_ID'] + '" data-name="' + item['ZONE_NAME'] + '" value="'+item['ZONE_ID']+'" title="' + item['ZONE_NAME'] + '">' + item['ZONE_NAME'] + '</a>'
            });
            $("#_citysheng li").removeClass("citySel");
            $("#_citysheng li:eq(1)").addClass("citySel");
            $("#_citys1 a").remove();
            $("#_citys1").append(g);
            $("._citys1").hide();
            $("._citys1:eq(1)").show();
            $("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
            obj.addClass("AreaS");
            var lev = obj.data("name");
            ths.value = obj.data("name");
            if (document.getElementById("hcity") == null) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: "hcity",
                    "data-id": obj.data("id"),
                    id: "hcity",
                    val: lev
                });
                $(ths).after(hcitys);
            }
            else {
                $("#hcity").val(lev);
                $("#hcity").attr("data-id", obj.data("id"));
                if (document.getElementById("hproper") != null){
                    $("#hproper").attr("data-id", "");
                    $("#hproper").val("");
                }
                if (document.getElementById("harea") != null) {
                    $("#harea").val("");
                    $("#harea").attr("data-id", "");
                }
                


            }
            $("#_citys1 a").click(function () {
                $("#_citys1 a,#_citys2 a").removeClass("AreaS");
                $(this).addClass("AreaS");
                var lev =  $(this).data("name");
                if (document.getElementById("hproper") == null) {
                    var hcitys = $('<input>', {
                        type: 'hidden',
                        name: "hproper",
                        "data-id": $(this).data("id"),
                        id: "hproper",
                        val: lev
                    });
                    $(ths).after(hcitys);
                }
                else {
                    $("#hproper").attr("data-id", $(this).data("id"));
                    $("#hproper").val(lev);
                    if (document.getElementById("harea") != null) {
                        $("#harea").val("");
                        $("#harea").attr("data-id", "");
                    }
                }
                var bc = $("#hcity").val();
                ths.value = bc+ "-" + $(this).data("name");
                ajaxArea($(this),ths);
        

            });
        }
    });
    
    }
function ajaxArea(obj,ths){
    var c = obj.data('id');
   
    var f = [];
    var ar = '';
    $.post(addr_url_pub+"&zoneId="+c,function(zoneJson){
        if(zoneJson!=null&&zoneJson!=undefined&&zoneJson!=""&&JSON.parse(zoneJson).zone != undefined){
            $.each(JSON.parse(zoneJson).zone,function(index,item){
                ar += '<a data-level="1" data-id="' + item['ZONE_ID'] + '" data-name="' + item['ZONE_NAME'] + '" value="' + item['ZONE_ID'] + ' "title="' + item['ZONE_NAME'] + '">' + item['ZONE_NAME'] + '</a>'
            });
            $("#_citysheng li").removeClass("citySel");
            $("#_citysheng li:eq(2)").addClass("citySel");
            //     var ar = getArea(obj);

            $("#_citys2 a").remove();
            $("#_citys2").append(ar);
            $("._citys1").hide();
            $("._citys1:eq(2)").show();

            $("#_citys2 a").click(function () {
                $("#_citys2 a").removeClass("AreaS");
                $(this).addClass("AreaS");
                var lev = $(this).data("name");
                if (document.getElementById("harea") == null) {
                    var hcitys = $('<input>', {
                        type: 'hidden',
                        name: "harea",
                        "data-id": $(this).data("id"),
                        id: "harea",
                        val: lev
                    });
                    $(ths).after(hcitys);
                }
                else {
                    $("#harea").val(lev);
                    $("#harea").attr("data-id", $(this).data("id"));
                }
                var bc = $("#hcity").val();
                var bp = $("#hproper").val();
                ths.value = bc + "-" + bp + "-" + $(this).data("name");
                Iput.colse();
            });
        }
    });
}

