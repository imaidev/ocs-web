/*******************************************************************************
 * jQuery 插件. 功能: 固定表尾 调用方法: $('#myTable').fixedEditgridFoot();
 ******************************************************************************/

jQuery.fn.extend({
	fixedEditgridFoot : function() {
		var editgrid = this;
		var listname = this.attr("listName");
		var tablefoot = $('tfoot', this);
		var footTable = document.createElement('table');
		var tr = document.createElement('tr');
		var footwidth = $(this).width();
		$(footTable).width(footwidth);
		$(footTable).addClass('editgridtfoot editgrid '+'editgrid'+listname+'');
		$(footTable).append(tablefoot);
		$(this).after(footTable);
		if (top != window) {
			var offtop = "";
			var win = window;
			do {
				var top1 = $(win.frameElement).offset().top;
				offtop = parseInt(top1 + offtop);
				win = win.parent;
			} while (top != win);
			$(window.top).scroll(
					function() {
						var sctop = $(window.top).scrollTop();
						var wheight = $(window.top).height();
						var scbot = wheight + sctop;
						var itop = scbot - offtop - $('.editgridtfoot').height();
						var elmtop = $(editgrid).offset().top
								+ $(editgrid).height() + offtop;
						if (elmtop > scbot) {
							$(footTable).css({
								"position" : "fixed",
								"top" : itop + "px",
								"left" : $(editgrid).offset().left,
								"z-index":"2"
							});
						} else {
							$(footTable).css({
								"position" : "relative",
								"top" : "0px",
								"left" :"0px"
							});
						}
					});
		} else {
			$(window).scroll(
					function() {
						var sctop = $(window).scrollTop();
						var wheight = $(window).height();
						var scbot = wheight + sctop;
						var elmtop = $(editgrid).offset().top
								+ $(editgrid).height();
						if (elmtop > scbot) {
							$(footTable).css({
								"position" : "fixed",
								"bottom" : "0px",
								"left" : $(editgrid).offset().left,
								"z-index":"2"
							});
						} else {
							$(footTable).css({
								"position" : "relative",
								"bottom" : "0",
								"left" : "0"
							});
						}
					});
		}
	},
//需要在增加行调用
fixedEditgridLastTr : function(){
	var editgrid =this;
	var tfootheight=$('.editgridtfoot',this).height();
if(top != window){
	var offtop = "";
	var win = window;
	do {
		var top1 = $(win.frameElement).offset().top;
		offtop = parseInt(top1 + offtop);
		win = win.parent;
	} while (top != win);
	var sctop = $(window.top).scrollTop();
	var wheight = $(window.top).height();
	var scbot = wheight + sctop;
	var itop = scbot - offtop - tfootheight;
	var elmtop = $(editgrid).offset().top
			+ $(editgrid).height() + offtop;
	var trtop = elmtop+1;
	if (trtop >=scbot) {
		var scrollheight=elmtop-wheight+tfootheight;
		$(window.top).scrollTop(scrollheight);
	} else{
		
	}
}else{
	var sctop = $(window).scrollTop();
	var wheight = $(window).height();
	var scbot = wheight + sctop;
	var elmtop = $(editgrid).offset().top
			+ $(editgrid).height();
	var trtop = elmtop+1;
	if (trtop >=scbot) {
		var scrollheigth = elmtop-wheight+tfootheight;
		$(window).scrollTop(scrollheigth);
	} else {
		//$(window).scrollTop(sctop);
	}

}
}

});
