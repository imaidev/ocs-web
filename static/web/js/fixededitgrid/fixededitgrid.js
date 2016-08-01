	
	/****************************************************************

	jQuery 插件.

	功能: 固定表格列


	调用方法:
	$('#myTable').fixEditgrid(
	    pCol, //可滚动区域列的列号
	    splitColor, //(可选)固定区域与滚动区域的分隔线颜色
	);


	****************************************************************/

	jQuery.fn.extend({ fixEditgrid: function(pCol,splitColor){
	    //滚动条宽度
	    var scrW = 16;

	    //设置分隔线颜色
	    if(!splitColor){
	       splitColor = '#333';
	    }

	    //得到表格本身
	    var t = $(this);
	    var pid = 'editgridfixbox';
	    
	    t.show();

	    //得到表格实际大小
	    var tw = t.outerWidth(true);
	    var th = t.outerHeight(true);

	    //在外部包一个DIV,用来获取允许显示区域大小
	    t.wrap("<div id='"+pid+"' ></div>");
	    var p = $('#'+pid);
	    p.css({
	        width: '100%',
	        height: '100%',
	        border: '0px',
	        margin: '0 0 0 0',
	        padding: '0 0 0 0'
	    });

	    //允许显示区域大小
	    t.hide();
	    var cw = p.outerWidth(true);
	    var ch = th+scrW;
	    
	    t.show();
	    
	    //拿到表格的HTML代码
	    var thtml = p.html();
        var table = p.clone(true);
	    //判断是否需要固定行列头
	    if(tw<=cw && th<=ch){
	        return;
	    }
	    //固定单元格的位置
	    var w1 = 0;
	    var h1 = 0;

	    var post = t.offset();

	    var p1, p2, p3, p4;
	        var pos = $("th",t).eq(pCol).offset();
	        w1 = pos.left - post.left;

	        var tmp='<table style="background: #ECE9D8;" ';
	        tmp+='border="0" cellspacing="0" cellpadding="0">';
	        tmp+='<tr><td valign="top" style="border-right: 1px solid '+splitColor+'">';
	        tmp+='<div id="'+pid+'1"></div></td>';
	        tmp+='<td><div id="'+pid+'2"></div></td></tr>';
	        tmp+='</table>';

	        p.before(tmp);
	        
	        $('div[id^='+pid+']').each(function(){
	            $(this).css({
	                background: 'white',
	                overflow: 'hidden',
	                margin: '0 0 0 0',
	                padding: '0 0 0 0',
	                border: '0'
	            });
	        });
	        p1 = $('#'+pid+'1');
	        p2 = $('#'+pid+'2');
	        //上方方块
	        p1.html(thtml).css({width: w1-1, height: th});
	       // p1.append(table).css({width: w1-1, height: th});
	        p1.find('table:first').attr('edit1',true);
	        p1.find('table:first').attr('fixheader','header1');
	        $('thead tr th:gt('+(pCol-1)+')',p1).remove();
	        var trs = $("tbody tr",p1);
	        $('td:gt('+(pCol-1)+')',trs).remove();
	        //主方块
	        p2.append(p).css({
	            width: cw-w1, 
	            height: ch+1,
	            overflow: 'auto'
	        });
	        t.css({
	            position: 'relative',
	            top: 0,
	            left: 0
	        });
	        $('thead tr th:lt('+pCol+')',p2).remove();
	        var tr2s = $("tbody tr",p2);
	        $('td:lt('+pCol+')',tr2s).remove();
	        p2.find('table:first').attr('edit2',true);
	        p2.find('table:first').attr('fixheader','header2');
	        p.css({width: tw-w1, height: th, overflow: 'hidden'});
	        $("table[edit1]").editgridFixedHeader();
	        $("table[edit2]").editgridFixedHeader();
	        
	    
	}});
