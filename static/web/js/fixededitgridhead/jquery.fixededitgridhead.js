/*******************************************************************************
 * jQuery ���. ����: �̶���ͷ��div ���÷���: $('#eidtgrid').fixedEditgridHead(divid);
 ******************************************************************************/

jQuery.fn.extend({
	fixedEditgridHead : function(height) {
		var editgrid =this;
		if(editgrid.attr("listName")){
			var listname = editgrid.attr("listName");
		}else{
			var listname = "editgridlist";
		}
		var divwidth = editgrid.width();
		var divheight = height||200;
		var div=$("<div class=\"wrapEditDiv\"></div>");
		//$(editgrid).wrap("");
		$(editgrid).before(div);
		div.append($(editgrid));
		var cloneHead=$("thead",editgrid);
		var cloneFoot=$("tfoot",editgrid);
		var top="-"+cloneHead.height()+"px";
        var inDiv = $("<div class=\"editgridFixedInDiv\"></div>");
        inDiv.css({height:divheight,width:divwidth,overflowX: 'hidden',position:'relative',"top":top});
        inDiv.append(editgrid);
        $(editgrid).wrap("<div style=\"height:"+(height+10)+"px"+"\"></div>");
        div.height(height);
        div.append(inDiv);
        var width=cloneHead.css("width");
        var height=cloneHead.css("height");
        //insert head
        var fixedTable=$("<table class=\"fixedEditgridHead\" style=\"width:"+width+";height:"+height+"\"></table>");
        fixedTable.append(cloneHead.clone(true));
		div.prepend(fixedTable);
		$("th",fixedTable).css("height",height);
		/*if(editgrid.attr("multiSelected")=="true"||editgrid.attr("multi")=="true"){
			col.toggle(function(){
				var trs = $('tbody tr', editgrid);
				trs.addClass("selected");
				for(i=0;i<trs.length;i++){
					var tri = trs[i];
					$("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
					$("td",tri).eq(colindex).find(":input")[0].checked = true;
				}
			},
			function(){
				var trs = $('tbody tr', editgrid);
				trs.removeClass("selected");
				for(i=0;i<trs.length;i++){
					var tri = trs[i];
					$("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
					$("td",tri).eq(colindex).find(":input")[0].checked = false;
				}
			});
		}
		div.scroll(function(){
			fixededitgridHead(editgrid);
		});
		$(window.top).scroll(function(){
			fixededitgridHead(editgrid);
		});
		fixededitgridHead=function(editgrid){
			var tblwidth = editgrid.outerWidth();
			if(top!=window){
				editgridhead.css({
					"position" : "fixed",
					"z-index"  : "90",
					"left" : editgrid.offset().left,
					"top"  :div.offset().top,
					"width" : tblwidth

				});	
				editgridhead.show();
			}else{
				editgridhead.css({
					"position" : "fixed",
					"z-index"  : "90",
					"left" : editgrid.offset().left,
					"top"  : div.offset().top-$(window.top).scrollTop(),
					"width" : tblwidth

				});	
				editgridhead.show();
			}
		};*/
	}
});
