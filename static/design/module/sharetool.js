(function($){
    var g = {
        config:function($el){
            return moduleTool.config($el);
        },
        reset:function($el,opts){
            moduleTool.reset($el,opts,render);
        },
        run:function($el){
        	moduleTool.run($el,render);
        },
        init:function($el){
            moduleTool.init($el,render);
        }
    };
    
    $.fn.sharetool=function(oper,opts){
        if(!oper) oper="init";

        var operr;
        this.each(function(){
            operr = g[oper]($(this), opts);
	        
        })
        if (operr) return operr;

        return this;
    };

    var render=function($widget,dataval,renderType){
        var opts = $.extend({}, $.fn.sharetool.defaults, dataval);
        //获取当前页面的url
        var urlD = window.location.href;
        if(renderType=="init" || renderType=="reset"){
            var strS=[];
            for(var i=0;i<opts.shares.length;i++){
               if(opts.shares[i].id == 'copy_wangzhi'){
            	    //alert("复制网址的opts："+opts.shares[i].class1);
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="复制网址" >');
                    strS.push('<div class="shareIcon copy __web-inspector-hide-shortcut__"></div>');
                    strS.push('<div class="shareCtrl">复制网址</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'qq_wb'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到腾讯微博" >');
                    strS.push('<div class="shareIcon qq_weibo"></div>');
                    strS.push('<div class="shareCtrl">腾讯微博</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'sina_wb'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到新浪微博" >');
                    strS.push('<div class="shareIcon sina_weibo"></div>');
                    strS.push('<div class="shareCtrl">新浪微博</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'qq_kj'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到QQ空间" >');
                    strS.push('<div class="shareIcon qq_zone"></div>');
                    strS.push('<div class="shareCtrl">QQ空间</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'kaixin001w'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到开心网" >');
                    strS.push('<div class="shareIcon kaixin001"></div>');
                    strS.push('<div class="shareCtrl">开心网</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'renrenw'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到人人网" >');
                    strS.push('<div class="shareIcon renren"></div>');
                    strS.push('<div class="shareCtrl">人人网</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'doubanw'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到豆瓣网" >');
                    strS.push('<div class="shareIcon douban"></div>');
                    strS.push('<div class="shareCtrl">豆瓣网</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'netease_wb'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到网易微博" >');
                    strS.push('<div class="shareIcon netease_weibo"></div>');
                    strS.push('<div class="shareCtrl">网易微博</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'baidu_tb'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到百度贴吧" >');
                    strS.push('<div class="shareIcon baidu_tieba"></div>');
                    strS.push('<div class="shareCtrl">百度贴吧</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'Wei_xin'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到微信" >');
                    strS.push('<div class="shareIcon Weixin"></div>');
					strS.push('<div class="shareCtrl">微信</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'FaceBookW'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到Facebook" >');
                    strS.push('<div class="shareIcon FaceBook"></div>');
                    strS.push('<div class="shareCtrl">Facebook</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'TwitterW'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到Twitter" >');
                    strS.push('<div class="shareIcon Twitter"></div>');
                    strS.push('<div class="shareCtrl">Twitter</div>');
                    strS.push('</a>');
                }
                if(opts.shares[i].id == 'LinkedInW'){
                    strS.push('<a hidefocus="true" class="',opts.shares[i].id,' ',opts.shares[i].class1,'" title="分享到LinkedIn" >');
                    strS.push('<div class="shareIcon LinkedIn"></div>');
                    strS.push('<div class="shareCtrl">LinkedIn</div>');
                    strS.push('</a>');
                }
            }
            
            $widget.find(".shareBox").children().remove();
           
            $widget.find(".shareBox").html(strS.join(''));
            $widget.find(".shareclose").hide();
        }
        
        if(renderType!="run"){
        	function forbidShare(){
        		layer.msg("界面设计阶段不允许点击分享，请发布后再试！", {
					offset : 80,
					shift : 5,
					time : 2000
				});
        	}
        	$widget.find("a.copy_wangzhi,a.qq_wb,a.sina_wb,a.qq_kj,a.kaixin001w,a.renrenw,a.doubanw,a.netease_wb,a.baidu_tb,a.Wei_xin,a.FaceBookW,a.TwitterW,a.LinkedInW").click(forbidShare);
        }
        else {
        	var curUrl=window.location.href;
        	var sharewords=opts.sharewords;
        	$widget.find("a.copy_wangzhi").click(function(){
        		if(window.clipboardData) {
        			window.clipboardData.setData("Text",curUrl)
        		}else {
        			layer.open({
        			    area: ['400px', '200px'],
        			    title: '复制网址：',
        			    content:'<div name="urls" style="font-size:10px;">您使用的是非IE核心的浏览器,请按ctrl+c 复制网址到剪切板<br><input type="text" class="copy-text" style="font-size:12px;width:350px;" onfocus="this.select()" value="'+curUrl+'"><script>(function($){$("input").focus();$("input").select();})</script></div>',
        			    btn: ['确定','取消'], //按钮
        			    success: function(layero, index){
        			        $(layero).find(".copy-text").focus();
        			     }
        			});
        		};
            })
        	$widget.find("a.qq_wb").click(function(){
             	var url="http://v.t.qq.com\/share\/share.php?title="+sharewords+"&url="+curUrl;
             	window.open(url);
            })
            $widget.find("a.sina_wb").click(function(){
             	var url="http://service.weibo.com/share/share.php?title="+sharewords+"&url="+curUrl;
             	window.open(url);
            })
            $widget.find("a.qq_kj").click(function(){
             	var url="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=&url="+curUrl+"&pics=&title="+sharewords;
             	window.open(url);
            })
            $widget.find("a.kaixin001w").click(function(){
             	var url="http://www.kaixin001.com/rest/records.php?content="+sharewords+"&style=11";
             	window.open(url);
            })
            $widget.find("a.renrenw").click(function(){
             	var url="http://widget.renren.com/dialog/share?resourceUrl="+curUrl+"&description=&title="+sharewords+"&pic=";
             	window.open(url);
            })
            $widget.find("a.doubanw").click(function(){
             	var url="http://shuo.douban.com/!service/share?name="+sharewords+"&text="+curUrl+"&image=";
             	window.open(url);
            })
            $widget.find("a.netease_wb").click(function(){
             	var url="http://t.163.com/article/user/checkLogin.do?info="+sharewords+"&images=&togImg=true";
             	window.open(url);
            })
            $widget.find("a.baidu_tb").click(function(){
             	var url="http://tieba.baidu.com/i/app/open_share_api?comment=&pic=&url="+curUrl+"&title="+sharewords;
             	window.open(url);
            })
            //微信二维码
            $widget.find("a.Wei_xin").click(function(){
            	
            	$.ajax({
		            url: ctx+"/base/qrcode/qrCode.do?method=qrcodePath&content="+window.location.href,
		            success: function(json) {
		               if(json.success){
		            	   layer.open({
		            		   type: 1,
		            		   title: '分享',
		           		    area: ['400px', '360px'],
		           		    content: '<div style="text-align:center;width:100%;height:20px;margin-top:35px;">打开微信"扫一扫"，打开网页后点击屏幕右上角分享按钮</div><div style="text-align:center;width:100%;margin:25px auto;"><img alt src="'+json.qrcodePath+'"></div>'
		           		});
		               }
		            },
		            error: function(t, e, o) {
		               
		            },
		            type : "POST",
		            dataType: 'json'
		        });

            })
            
            $widget.find("a.FaceBookW").click(function(){
             	var url="http://www.facebook.com/sharer.php?t="+sharewords+"&u="+curUrl+"&pic=";
             	window.open(url);
            })
            $widget.find("a.TwitterW").click(function(){
             	var url="http://twitter.com/intent/tweet?text="+sharewords+"&pic=";
             	window.open(url);
            })
            $widget.find("a.LinkedInW").click(function(){
             	var url="http://www.linkedin.com/shareArticle?summary="+sharewords+"&url="+curUrl+"&title="+sharewords;
             	window.open(url);
            })
            
            //其他分享链接
            
		}
        
       
    }
	$.fn.sharetool.defaults ={
    	sharewords:"分享"
    };
})(jQuery)

