
function reportInit()
{

	if(DCellWeb1.Login( "浪潮齐鲁软件", "", "13040257", "5000-1207-7711-6004" ) == 0)
		{ 
			alert("注册失败!");
		}
		
		filename=filename+setfilename();
		//alert(filename);
		var result=CellRpt.OpenFile(filename,"") ;

         	if(result!=1){
			alert("打开文件错误");
			}


		//设置打印的也边距
		CellRpt.PrintSetMargin(100,100,100,100);
		CellRpt.PrintSetAlign(1,0);
		CellRpt.Border=false;
		filldata();
		
		var num;  
		for(var sheet = 0 ; sheet <= CellRpt.GetTotalSheets();sheet++){
			for(m=1; m<=CellRpt.getRows(sheet); m++) {
				for(n=1; n<=CellRpt.getCols(sheet); n++) {
					CellRpt.SetCellTextStyle( n, m, sheet, 2 );
				}
				//设置最佳列宽使得报表太过稠密，程玉坤20050906修改为最佳＋10
				if(isBestHeight){
				    num = CellRpt.GetRowBestHeight(m);
					CellRpt.SetRowHeight(1,num+10,m,sheet);
				}
			}
			for(n=1; n<=CellRpt.getCols(sheet); n++) {
			 	if(isBestWidth){
				num = CellRpt.GetColBestWidth(n);
				CellRpt.SetColWidth(1,num+10,n,sheet);
				}
			}
		}
		//update by lxy20020929
		CellRpt.Readonly=true;//Readonly属性使Cell报表不能编辑，同时也屏蔽上下光标箭头
		CellRpt.WndBkColor = 0xFFFFFF;
		CellRpt.AllowDragDrop =false;
		//CellRpt.SetSelectMode(0,0);
		CellRpt.SetSelectMode(0,1);
		document.getElementById("Msg").style.display="none";
		document.getElementById("Content").style.display="block";
  }
