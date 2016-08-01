(function() {
    /*输入框默认提示插件*/
    $.fn.placeholder = function(options){
        var elements = this;//dom元素，调用jQuery扩展方法的对象数组
        var $elements = $(this);//jquery对象数组
        var settings = {
            defaultColor :'999',//默认字体颜色
            activeColor:'666'//输入时的字体颜色
        };

        if(options){$.extend(settings, options);}
        $elements.each(function(){
            var $targetObj = $(this);
            var temp=$targetObj.val();//每个绑定的函数有单独的temp变了，互不影响
            $targetObj.css('color','#'+settings.defaultColor);//调用了此方法的input设置默认字体颜色值，可不用在样式表里在设置默认字体样式，直接条用js传入对应的字体颜色值即可。
            $targetObj.bind('focus',function(){
                if(temp==$targetObj.val()){
                    $targetObj.val('');
                    $targetObj.css('color','#'+settings.activeColor);
                }
            }).bind('blur',function(){
                if($targetObj.val().trim()==''||$targetObj.val().trim()==null){
                    $targetObj.val(temp);
                    $targetObj.css('color','#'+settings.defaultColor);
                }
            });

        });
    }
})(jQuery, window, document);