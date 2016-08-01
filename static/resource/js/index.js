function noticeHide() {
	$('#noticeFloat').hide();
}
// JavaScript Document
// 滚动条向下滚动时，returnTop按钮出现
$(window).scroll(function() {
	var top = parseInt($(document).scrollTop());

	if (top > 10) {
		$("#returnTop").fadeIn();
	} else {
		$("#returnTop").fadeOut();
	}

})

$(document).ready(
		function() {
			// $("#returnTop").mouseover(function(){
			// $(this).stop(true, false).animate({right:'0'},300);
			// });
			// $("#returnTop").mouseout(function(){
			// $(this).stop(true, false).animate({right:'-45'},300);
			// });
			// 取出点击链接后的虚线框
			$('a').bind("focus", function() {
				$(this).blur();

			});

			$("#menuRight").find('li').mouseover(
					function() {
						var pageX = $(this).offset().left
								- $("#menuRight").offset().left + 200;
						var pageY = $(this).offset().top
								- $("#menuRight").offset().top;
						$(this).find('b').css({
							"left" : pageX,
							"top" : pageY + 2
						});
						$(this).parent().find('.out').css({
							"left" : pageX,
							"top" : pageY
						});

					});

			var flag = 0;
			var intervalProcess = setInterval(flicker, 1000);
			$('#yjyl').hover(function() {
				clearInterval(intervalProcess);
				flag = 1;
			}, function() {
				if (flag == 1) {
					setInterval(flicker, 1000);
				}
			});

			function flicker() {
				$('#yjyl').fadeOut(500).fadeIn(500);
			}

			$("#srh_select").find('li').click(function() {
				var value1 = $(this).html();
				$("#select").html(value1);
				$("#srh_select").find('.select').hide();
			});
			$("#srh_select").find('a').click(function() {
				$("#srh_select").find('.select').toggle();
			});

			$("#srh_select").find('.select').mouseleave(function() {
				$(this).hide();
			});

		})

function setTab2(name, cursel, n) {
	// if(cursel==1){
	// var menu=document.getElementById(name+1);
	// var con=document.getElementById("con_"+name+"_"+1);
	// menu.className="san h_red";
	// con.style.display="block";
	// }else{
	// var menu=document.getElementById(name+1);
	// var con=document.getElementById("con_"+name+"_"+1);
	// menu.className="san red";
	// con.style.display="none";
	// }
	if (cursel == 1) {
		var menu = document.getElementById(name + 1);
		var con = document.getElementById("con_" + name + "_" + 1);
		menu.className = "si h_green";
		con.style.display = "block"
	} else {
		var menu = document.getElementById(name + 1);
		var con = document.getElementById("con_" + name + "_" + 1);
		menu.className = "si green";
		con.style.display = "none";
	}
	if (cursel == 2) {
		var menu = document.getElementById(name + 2);
		var con = document.getElementById("con_" + name + "_" + 2);
		menu.className = "si h_yellow";
		con.style.display = "block";
	} else {
		var menu = document.getElementById(name + 2);
		var con = document.getElementById("con_" + name + "_" + 2);
		menu.className = "si yellow";
		con.style.display = "none";
	}
	if (cursel == 3) {
		var menu = document.getElementById(name + 3);
		var con = document.getElementById("con_" + name + "_" + 3);
		menu.className = "si h_blue";
		con.style.display = "block";
	} else {
		var menu = document.getElementById(name + 3);
		var con = document.getElementById("con_" + name + "_" + 3);
		menu.className = "si blue";
		con.style.display = "none";
	}
}

function slide_pic(id, flag, widths, w, pages, speed) {
	var page_n_obj = $("#" + id + "_pages");
	var page_n = parseInt(page_n_obj.html());
	var fla_picture = $("#" + id);
	var temp_obj = document.getElementById(id + "_temp");
	var temp = parseInt(temp_obj.value);
	// 移动的距离
	var distance = 0;
	// 往左移动
	if (flag == 1) {
		if (page_n >= 1 && page_n < pages) {
			page_n = page_n + 1;
		}
		if (Math.abs(temp) < widths && temp <= 0) {
			distance = temp - parseInt(w);
		} else {
			distance = temp;
		}
	} else {// 往右移动
		if (page_n > 1 && page_n <= pages) {
			page_n = page_n - 1;
		}
		if (Math.abs(temp) <= widths && temp < 0) {
			distance = temp + parseInt(w);
		} else {
			distance = temp;
		}
	}
	page_n_obj.html(page_n);
	temp_obj.value = distance;
	fla_picture.animate({
		left : distance
	}, speed, function() {
		// Animation complete.
	});

}
// 订单start
function setTab(name, cursel, n) {
	for (i = 1; i <= n; i++) {
		var menu = document.getElementById(name + i);
		var con = document.getElementById("con_" + name + "_" + i);
		menu.className = i == cursel ? "hover" : "";
		con.style.display = i == cursel ? "block" : "none";
	}
}

$(function() {
	var widthV = document.body.clientWidth;// 网页可见内容区域的宽度
	var contentWidth = $('#mainContent').width();
	var overWidth = parseInt((widthV - contentWidth) / 2) - 110;
	if (overWidth > 0) {
		$('#indexLeft').css({
			'left' : 0
		});
		$('#indexRight').css({
			'right' : 0
		});
	} else {
		$('#indexLeft').css({
			'left' : overWidth
		});
		$('#indexRight').css({
			'right' : overWidth
		});
	}
})

function showElement() {
	var widthV = document.body.clientWidth;// 网页可见内容区域的宽度
	var contentWidth = $('#mainContent').width();
	var overWidth = parseInt((widthV - contentWidth) / 2) - 110;
	if (overWidth > 0) {
		$('#indexLeft').css({
			'left' : 0
		});
		$('#indexRight').css({
			'right' : 0
		});
	} else {
		$('#indexLeft').css({
			'left' : overWidth
		});
		$('#indexRight').css({
			'right' : overWidth
		});
	}

}
window.setInterval("showElement()", 200);