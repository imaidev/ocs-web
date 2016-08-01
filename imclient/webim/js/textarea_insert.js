function getCurPos(_textarea){
 
	var pos = {};
    if('number' === typeof _textarea.selectionStart){//chrome 、firefox ……
        pos.start = _textarea.selectionStart;//如果用户没有建立一个文本选区， selectStart为光标当前所在的位置。 pos.start == pos.end
        pos.end = _textarea.selectionEnd;
    }
    else if(document.selection){//IE 6,7,8
        //获取用户的选区
        var userRange = document.selection.createRange();
        //判断选区是否为改 textarea 
        if(userRange.parentElement() == _textarea){
            //创建一个文本区 createTextRange只在IE中有效
            var textRange = document.body.createTextRange();
            //移动文本区到 _textarea
            textRange.moveToElementText(_textarea);//此时 textRange.text = _textarea.value ,及textRange选区涵盖了 整个_textarea
            
            //接下来，调整文本选区textRange的区域，与userRange的区域重合 
            var start = 0;
            for(start = 0 ; textRange.compareEndPoints('StartToStart',userRange) < 0 && textRange.moveStart('character',1) !== 0 ; ++start ){
                //计算 \n
                if(_textarea.value.charAt(start) == '\n'){
                    ++start;
                }
            }
            pos.start = start ;//如果用户没有建立一个文本选区， selectStart为光标当前所在的位置。 pos.start == pos.end
            if(userRange.length != undefined){
                pos.end = start + userRange.length;
            }
            else{
                pos.end = start;
            }
        }
    }
    return pos;
}
// set cursor position  type = point(只移动光标到某点) | range(选中文本) 
function setCurPos(_textarea , pos , type){
    if(_textarea.setSelectionRange){//chrome 、 firefox ……
        _textarea.focus();//先聚焦到该输入框
        
        if(type != undefined && type == 'range' ){
        	
            //1、方法一
            //_textarea.setSelectionRange(pos.start,pos.end);//载入选区
        	
            //2、方法二
            _textarea.selectionStart = pos.start;
            _textarea.selectionEnd = pos.end;
        }
        else{
            _textarea.setSelectionRange(pos.end,pos.end);
        }
    }
    else if(_textarea.createTextRange){//IE 6,7,8
        //在_textarea 中直接创建 文本选区
        var textRange = _textarea.createTextRange();
        
        if(type != undefined && type == 'range'){
            //1、定位光标位置
            //textRange.move('character',pos.start);//
            //textRange.select();//设为被选中状态
        	
            //2、载入选区
            textRange.collapse(true);
            textRange.moveStart('character',pos.start);
            textRange.moveEnd('character',pos.end-pos.start);
            textRange.select();
        }
        else{
            textRange.move('character',pos.end);
            textRange.select();
        }
    }
}

//具体使用环境： 需要在某个<textarea></textarea>中光标出插入一个字符串
function insertStrToTextarea(_textarea,str){
    if(str == undefined || str == ''){
        return false;
    }
    /*
    if(document.selection){//IE6,7,8下光标处插入文本的简易方法
        //document.selection.createTextRange()为页面中当前被选中的地方
        document.selection.createTextRange().text = str;
        return true;
    }
    */
    var pos = getCurPos(_textarea);
    var str0 = _textarea.value.substring(0,pos.start) , str1 = _textarea.value.substring(pos.end);
    _textarea.value = str0 + str + str1;
    
    pos.end += str.length;
    setCurPos(_textarea,pos,'point');
    return true;
}