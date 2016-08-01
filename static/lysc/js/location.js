//this is the location.js
var xmlD;

$(function() {
	var selectedProvince = $("#province").val();
	var selectedCity = $("#city").val();
	var selectedCounty = $("#county").val();
	$.ajax({
		url : "/ecweb/jsp/lysc/ord/screen/co/province_city.xml",
		async : false,
		success : function(xmldoc) {
			xmlD = xmldoc;
			var valueList = $(xmldoc).find("province");
			$("#province").append("<option value=''>请选择</option>");
			//设置省
				$(valueList).each(function(i) {
					var xmlprovince = $(this).attr("name");
					var opt = "<option ";
					if (xmlprovince == selectedProvince)
						opt = opt + "  selected ='selected'  ";
					opt = opt + " value='" + $(this).attr("name") + "'>" + $(this).attr("name") + "</option>";
					$("#province").append(opt);
				});
			$("#city").append("<option value=''>请选择</option>");
			//设置市
			if(selectedProvince!=null&&selectedProvince!=''){
			$(xmlD).find("province[name=" + selectedProvince + "] >city").each(function(i) {
				var xmlcity = $(this).attr("name");
				var opt = "<option ";
				if (xmlcity == selectedCity)
					opt = opt + "  selected ='selected'  ";
				opt = opt + " value='" + $(this).attr("name") + "'>" + $(this).attr("name") + "</option>";
				$("#city").append(opt);
			});
			};
			//设置县
			$("#county").append("<option value=''>请选择</option>");
			if(selectedCity!=null&&selectedCity!=''){
			$(xmlD).find("province[name=" + selectedProvince + "] >city[name=" + selectedCity + "] > county").each(function(i) {
				var xmlcounty = $(this).attr("name");
				var opt = "<option ";
				if (xmlcounty == selectedCounty)
					opt = opt + "  selected ='selected'  ";
				opt = opt + " value='" + $(this).attr("name") + "'>" + $(this).attr("name") + "</option>";
				$("#county").append(opt);
			});
			};
		},
		dataType : "xml"
	});
});
function changeCity() {
	$("#city").find("option").remove();
	$("#city").append("<option value=''>请选择市</option>");
	$("#county").find("option").remove();
	$("#county").append("<option value=''>请选择区</option>");
	var selectvalue = $("#province").val();
	if(selectvalue!=null&&selectvalue!=''){
	$(xmlD).find("province[name=" + selectvalue + "] > city").each(function() {
		$("#city").append("<option value='" + $(this).attr("name") + "'>" + $(this).attr("name") + "</option>");
	});
	}
	selectCountry2();

}
function changeZone() {
	$("#county").find("option").remove();
	$("#county").append("<option value=''>请选择区</option>");
	var selectvalue = $("#city").val();
	var selectvalue1 = $("#province").val();
	if(selectvalue1!=null&&selectvalue1!=''&&selectvalue!=''&&selectvalue!=''){
	$(xmlD).find("province[name=" + selectvalue1 + "] >city[name=" + selectvalue + "] > county").each(function() {
		$("#county").append("<option value='" + $(this).attr("name") + "'>" + $(this).attr("name") + "</option>");
	});
	}
	selectCountry2();
}
function selectCountry2() {
	var province = $("#province").val();
	var city = $("#city").val();
	var county = $("#county").val();
}