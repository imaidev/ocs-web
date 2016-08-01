/**
 * Created by zhanglei on 2016-01-12.
 */
(function($){

    var g = {
        config:function($el,opts){
            return JSON.parse($el.attr("data-val"));
        },
        reset:function($el,opts){
        },
        run:function($el,opts){
		    },
        init:function($el,opts){
        }
    };

    $.fn.portalfooter=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);

        })
        if (operr) return operr;

        return this;
    };
})(jQuery);