$.ajaxSetup({
	async : false
});
$(document).ready(function() {
	getAddrKids('-1', 1 , 'company_province');
	getAddrKids($("#company_province").val(), 2 , "company_city");
	getAddrKids($("#company_city").val(), 3 , "company_county");
	getAddrKids($("#company_county").val(), 4 , "company_town");
	getAddrKids($("#company_town").val(), 5 , "company_village");
	jQuery.validator.addMethod("pswd_strength", function(value, element) {
		var pswdStr = testPassWordStrength(value);
		if (pswdStr < 2) {
			return false;
		} else {
			return true;
		}
	}, "密码强度过低，请选择使用字母、数字或特殊字符中任两种");
	
	jQuery.validator.addMethod("englishTest", function(value, element) {       
		   return this.optional(element) || /^[a-zA-Z 0-9 \,\.\;\:\"\'!@$#*(\)-_?]+$/i.test(value);
		},true);
	// 用户注册验证
	$(function() {
		$("#sign_form").validate({
			rules : {
				userId : {
					required : true,
					englishTest : true,
					loginName_rule : $("#userId").val(),
					remote :{
						url : checkLoginNameUrl,
						type : "post",
						data : {
							"loginName":function() {return $("#userId").val();}
							 }
						}
				},
				nickName : {
					required : true,
					maxlength : 30
				},
				password : {
					required : true,
					minlength : 6,
					maxlength : 15,
					pswd_strength:$("#password").val()
				},
			    repassword : {
					required : true,
					equalTo : "#password"
				},
				login_phone : {
					required : true,
					isMobile : true,
					remote :{
						url : CheckPhoneNum,
						type : "post",
						data : {"phoneNum":function(){return $("#login_phone").val();} }
					}
				},
				phone_code : {
					required : true,
					number : true,
					minlength : 6,
					maxlength : 6,
					remote : {
						url : checkRegCodeToPhoneUrl,
						type : "post",
						data : {
							"phoneCode":function() {return $("#phone_code").val();},
							"phoneNum" : function() {return $("#login_phone").val();}
						}
					}
				},
				email : {
					required : true,
					email : true,
					remote :{
						url : checkEmailUrl,
						type : "post",
						data : {"emailNum":function(){return $("#email").val();} }
					}
				},
				id_num : {
					maxlength : 20,
					isIdCardNo : true,
					remote :{
						url : checkIdNumUrl,
						type : "post",
						data : {"idNum":function(){return $("#id_num").val();} }
					}
					}
			},
			messages : {
				userId : {
					required : "请输入用户名",
					englishTest : "请正确输入",
					loginName_rule : "请正确输入",
					remote : "该用户名已被注册"
				},
				nickName : {
					required : "请输入昵称",
					maxlength : "超出范围"
				},
				password : {
					required : "请输入密码",
					minlength : "长度不能小于6个字符",
					maxlength : "长度不能超过15个字符",
					pswd_strength:"请正确输入"
				},
				repassword : {
					required : "请输入确认密码",
					equalTo : "请与上次输入密码相同"
				},
				login_phone : {
					required : "请输入您的手机号",
					isMobile : "请输入正确的手机号",
					remote : "该手机号已被占用"
				},
				phone_code : {
					required : "请输入验证码",
					number : "请正确输入验证码",
					minlength : "请输入六位验证码",
					maxlength : "请输入六位验证码",
					remote : "验证码不正确"
				},
				email : {
					required : "请输入邮箱",
					email : "请输入正确的邮箱地址",
					remote : "该邮箱已被占用"
				},
				id_num : {
					maxlength : "输入超长",
					isIdCardNo : "请输入正确的身份证号",
					remote : "该身份证号已被占用"
				}
			}
		});
	});
	
	// 个人 注册发送手机验证码
	$("#get_phone_code").on("click", function() {
		var phone = $("#login_phone").val();
		var validate = $("#login_phone").valid();
		if (!validate) return ;
		$("#get_phone_code").attr("disabled", true);
		 $.ajax({
			type : "post",
			url : sendRegCodeToPhoneUrl + phone,
			success : function(data) {
			if (data == 'true') {
			btnDisabled("#get_phone_code");
			} else {alert("短信发送失败");}
			}
		 });	 
	});

	function btnDisabled(btnid) {
		var count = 30;
		var countdown = setInterval(CountDown, 1000);

		function CountDown() {
			$(btnid).attr("disabled", true);
			$(btnid).val("已发送，请等待 " + count + " 秒!");
			if (count == 0) {
				$(btnid).val("重新发送").removeAttr("disabled");
				clearInterval(countdown);
			}
			count--;
		}
	}
	$("#phone_submit").on("click", function() {
		var validate = $("#sign_form").valid();
		if (!validate) {
			return false;
		}
		$("#personal_phone_password_strength").val(testPassWordStrength($("#password").val()));
		$("#personal_phone_password_hidden").val(toMD5Str($("#password").val()));
		$("#sign_form").ajaxSubmit({
			type:"POST",
			success : function(data) {
			if (data > 0) {
				window.location.href = activateEmailUrl;
			} else if (data == '-1') {
				alert("注册失败");
			} else if (data == '-2') {
				alert("用户名重复");
			} else if (data == '-3') {
				alert("该手机已被注册");
			} else if (data == '-4') {
				alert("验证码已失效");
			} else if (data == '-5') {
				alert("验证码错误");
			}
			}
		});
	});
});

function getAddrKids(zoneId, level, adr) {
    var url = "signUp.do?method=getAddrKids&zoneId=" + zoneId;
    $.ajaxLoad({
        url: url,
        async: false,
        callback: function(json) {
            var zone = json.zone;
            $.each(zone,
            function(i, zzone) {
                if (level == 1) {
                    $("#"+adr).append("<option id='" + zzone.ZONE_ID + "' value='" + zzone.ZONE_ID + "'>" + zzone.ZONE_NAME + "</option>");
                }
                if (level == 2) {
                    $("#"+adr).append("<option id='" + zzone.ZONE_ID + "' value='" + zzone.ZONE_ID + "'>" + zzone.ZONE_NAME + "</option>");
                }
                if (level == 3) {
                	$("#"+adr).append("<option id='" + zzone.ZONE_ID + "' value='" + zzone.ZONE_ID + "'>" + zzone.ZONE_NAME + "</option>");
                }
                if (level == 4) {
                	$("#"+adr).append("<option id='" + zzone.ZONE_ID + "' value='" + zzone.ZONE_ID + "'>" + zzone.ZONE_NAME + "</option>");
                }	          
                if (level == 5) {
                	$("#"+adr).append("<option id='" + zzone.ZONE_ID + "' value='" + zzone.ZONE_ID + "'>" + zzone.ZONE_NAME + "</option>");
                }	          
            });
        },
        dataType: "json",
        type: "post"
    });
}

function selectCountry2() {
    var company_province = $("#company_province").val();
    var company_city = $("#company_city").val();
    var company_county = $("#company_county").val();
    var company_town = $("#company_town").val();
    var company_village = $("#company_village").val();
}

function changeCity(province, city , county, town, village) { 
    $("#"+city).find("option").remove();

    $("#"+city).append("<option value=''>请选择市</option>");

    $("#"+county).find("option").remove();

    $("#"+county).append("<option value=''>请选择区</option>");
    
    $("#"+town).find("option").remove();

    $("#"+town).append("<option value=''>请选择镇</option>");
    
    $("#"+village).find("option").remove();

    $("#"+village).append("<option value=''>请选择村</option>");

    var selectvalue = $("#"+province).val();
    var id = $("#"+province+"  option:selected").attr("id"); // 获取当前省的id
    $('#provinceId').val(id);
    getAddrKids(id, 2 , city);
    selectCountry2();
}

function changeZone(city, county, town, village) {
    $("#"+county).find("option").remove();
    
    $("#"+county).append("<option value=''>请选择区</option>");
    
    $("#"+town).find("option").remove();
    
    $("#"+town).append("<option value=''>请选择镇</option>");
    
    $("#"+village).find("option").remove();
    
    $("#"+village).append("<option value=''>请选择村</option>");
    
    var selectvalue = $("#"+city).val();
    var id = $("#"+city+"  option:selected").attr("id");
    $('#cityId').val(id);
    getAddrKids(id, 3 ,county);
    selectCountry2();
}

function changeTown(county, town, village) {
    
    $("#"+town).find("option").remove();
    
    $("#"+town).append("<option value=''>请选择镇</option>");
    
    $("#"+village).find("option").remove();
    
    $("#"+village).append("<option value=''>请选择村</option>");
    
    var selectvalue = $("#"+county).val();
    var id = $("#"+county+"  option:selected").attr("id");
    $('#countyId').val(id);
    getAddrKids(id, 4 ,town);
    selectCountry2();
}

function changeVillage(town, village) {
    
    $("#"+village).find("option").remove();
    
    $("#"+village).append("<option value=''>请选择村</option>");
    
    var selectvalue = $("#"+town).val();
    var id = $("#"+town+"  option:selected").attr("id");
    $('#townId').val(id);
    getAddrKids(id, 5 ,village);
    selectCountry2();
}

function changeServicePoint(village, servicePoint){
	$("#"+servicePoint).find("option").remove();
	
	$("#"+servicePoint).append("<option value=''>请选择服务站</option>");
	
	 var selectvalue = $("#"+village).val();
	 var id = $("#"+village+"  option:selected").attr("id");
	 $('#villageId').val(id);
	 getServicePoints(id, servicePoint);
}

function getServicePoints(zoneId, adr) {
    var url = "signUp.do?method=getServicePoints&zoneId=" + zoneId;
    $.ajaxLoad({
        url: url,
        async: false,
        callback: function(json) {
            var zone = json.zone;
            $.each(zone,
            function(i, zzone) {
                    $("#"+adr).append("<option id='" + zzone.STATION_ID + "' value='" + zzone.STATION_ID + "'>" + zzone.STATION_NAME + "</option>");
            });
        },
        dataType: "json",
        type: "post"
    });
}

function changeReferrer(servicePoint, referrer){
	$("#"+referrer).find("option").remove();
	
	$("#"+referrer).append("<option value=''>请选择</option>");
	
	 var selectvalue = $("#"+servicePoint).val();
	 var id = $("#"+servicePoint+"  option:selected").attr("id");
	 $('#servicePointId').val(id);
	 getReferrer(id, referrer);
}

function getReferrer(zoneId, adr) {
    var url = "signUp.do?method=getReferrer&zoneId=" + zoneId;
    $.ajaxLoad({
        url: url,
        async: false,
        callback: function(json) {
            var zone = json.zone;
            $.each(zone,
            function(i, zzone) {
                    $("#"+adr).append("<option id='" + zzone.PROMOTER_ID + "' value='" + zzone.PROMOTER_ID + "'>" + zzone.PROMOTER_NAME + "</option>");
            });
        },
        dataType: "json",
        type: "post"
    });
}







	