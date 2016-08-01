$(document).ready(
		function() {
			$("#secAsk_select").on("change", function() {
				if (this.value == 'others') {
					$("#selfquestion").css("display", "");
					$("#selfQue").val = "";
				} else {
					$("#selfquestion").css("display", "none");
				}
			});

			// validate rule
			jQuery.validator.addMethod("birthday_num_rule", function(value, element) {
				return this.optional(element)
						|| /^((0[13456789]|1[0-2])(0[1-9]|[12][0-9]|3[01]))|(02(0[1-9]|1[0-9]|2[0-9]))$/.test(value);
			}, "请填写生日，例如0312");
			jQuery.validator.addMethod("last_phonenum_rule", function(value, element) {
				return this.optional(element) || /^[0-9]{6}$/.test(value);
			}, "请填写手机号的后6位数字");
			$("#secAsk_form").validate({
				rules : {
					oldAnswer : {
						required : true,
						maxlength : function() {
							if ($("#oldQue").length > 0) {
								var selectStr = $("#oldQue").text();
								if (selectStr.indexOf("生日") >= 0) {
									return 4;
								} else if (selectStr.indexOf("位") >= 0) {
									return 6;
								}else {
									return 20;
								} 
							 }
						  },  
						birthday_num_rule : function() {
							if ($("#oldQue").length > 0) {
								var selectStr = $("#oldQue").text();
								if (selectStr.indexOf("生日") >= 0) {
									return true;
								}
							}
						}, 
						last_phonenum_rule : function() {
							if ($("#oldQue").length > 0) {
								var selectStr = $("#oldQue").text();
								if (selectStr.indexOf("位") >= 0) {
									return true;
								}
							}
						}
					},
					secAsk_select : {
						required : true
					},
					selfQue : {
						required : true,
						maxlength : 20
					},
					newAnswer : {
						required : true,
						maxlength : function() {
							var selectStr = $("#secAsk_select").val();
							var selfQue = $("#selfQue").val();
							if (selectStr.indexOf("生日") >= 0 || selfQue.indexOf("生日") >= 0) {
								return 4;
							} else if (selectStr.indexOf("位") >= 0 || selfQue.indexOf("位") >= 0) {
								return 6;
							} else {
								return 20;
							}
						  },
						birthday_num_rule : function() {
							var selectStr = $("#secAsk_select").val();
							var selfQue = $("#selfQue").val();
							if (selectStr.indexOf("生日") >= 0|| selfQue.indexOf("生日") >= 0) {
								return true;
							}
						},
						last_phonenum_rule : function() {
							var selectStr = $("#secAsk_select").val();
							var selfQue = $("#selfQue").val();
							if (selectStr.indexOf("位") >= 0|| selfQue.indexOf("位") >= 0) {
								return true;
							}
						}
					}, 
					password : {
						required : true,
						password_rule : true
					}
				},
				messages : {
					oldAnswer : {
						required : "请输入旧密保答案",
						maxlength : function() {
							if ($("#oldQue").length > 0) {
								var selectStr = $("#oldQue").text();
								if (selectStr.indexOf("生日") >= 0) {
									return "超过了4位，请填写生日，例如0312";
								} else if (selectStr.indexOf("位") >= 0) {
									return "超过了6位，请填写后6位手机号";
								}else {
									return "答案位数不可超过20"; 
							}
						 }
					   }
					},
					secAsk_select : {
						required : "请输入新密保问题"
					},
					selfQue : {
						required : "请输入自定义密保问题",
						maxlength : "答案位数不可超过20"
					},
					newAnswer : {
						required : "请输入新密保答案",
						maxlength : function() {
							var selectStr = $("#secAsk_select").val();
							var selfQue = $("#selfQue").val();
							if (selectStr.indexOf("生日") >= 0 || selfQue.indexOf("生日") >= 0) {
								return "超过了4位，请填写生日，例如0312";
							} else if (selectStr.indexOf("位") >= 0 || selfQue.indexOf("位") >= 0) {
								return "超过了6位，请填写后6位手机号";
							} else {
								return "答案位数不可超过20";
							}
						}
					},
					password : {
						required : "请输入密码",
						password_rule : "请按要求填写"
					}
				}
			});

			var body = $("body");

			// clear input
			function bindClear() {
				var old = body.find("input[name='oldAnswer']");
				if (old[0]) {
					old.val("");
				}
				body.find("select[name='secAsk_select']").val("");
				body.find("input[name='selfQue']").val("");
				body.find("input[name='newAnswer']").val("");
				body.find("input[name='password']").val("");
			}
			;
			// submit
			$("#submit_btn").on("click", function() {
				var validate = $("#secAsk_form").valid();
				if (!validate) {
					return false;
				}
				var oldAnswer = "";
				var old = body.find("input[name='oldAnswer']");
				if (old[0]) {
					oldAnswer = toMD5Str(old.val());
				}

				var newQue = body.find("select[name='secAsk_select']").val();
				if (newQue == "others") {
					newQue = body.find("input[name='selfQue']").val();
				}
				var newAnswer = toMD5Str(body.find("input[name='newAnswer']").val());
				var password = toMD5Str(body.find("input[name='password']").val());

				var submit_url = body.find("input[name='submit_url']").val();
				var data = {
					oldAnswer : oldAnswer,
					newQue : newQue,
					newAnswer : newAnswer,
					password : password
				};
				$.ajax({
					type : "POST",
					url : submit_url,
					data : data,
					success : function(data) {
						if ("true" == data) {
							alert("保存成功！");
							window.location.href=bind_success;
						} else
							alert(data);
					},
					error : function(data) {
						alert("由于网络原因，修改密保问题失败!");
					}
				});
			});
			$("#cancle_btn").on("click", function() {
				bindClear();
			});
		});
