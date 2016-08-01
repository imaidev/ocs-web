var skin=getSkin("skin");
var config;
function getSkin(Name)    
{   var search = Name + "=";  
	if(document.cookie.length > 0)   
	{   
		var offset = document.cookie.indexOf(search);
        if(offset != -1)    
		{   offset += search.length;
			var end = document.cookie.indexOf(";", offset) ;
			if(end == -1) end = document.cookie.length;  
			return unescape(document.cookie.substring(offset, end)); 
		}   
		else return null;
	}  
}
function setCookie(c_name,c_value){
	var Days = 365; 
	var exp = new Date(); 
	exp.setTime(exp.getTime() + Days*24*60*60*1000); 
	document.cookie = c_name + "="+ escape (c_value) + ";expires=" + exp.toGMTString(); 
}
/**
 * 初始化头部导航条
 * @param requireJquery:true，需要加载jquery;false，不需要加载jquery
 */
function initHeadBar(requireJquery){
	var defaultJqueryFile = "/static/web/js/jquery.js";////默认提供的jquery(如果外部没有使用jquery的话)
	var ajaxUrl="/static/web/config.ini";
	$.ajax({
		type : 'post',
		url : ajaxUrl,
		dataType : 'json',
		contentType : 'application/json',
		async:false,
		success : function(data) {
			config=data;
			if(!skin){
				skin=data.defaultSkin;
				setCookie("skin",skin);
			}
			var headJs=data.headjs;
			var headCss=data.headcss;
			var script=[];
			var cssFile=[];
			for(var i=0;i<headJs.length;i++){
				script.push("/skin/js/"+headJs[i]);
				if(requireJquery){
					script.push(defaultJqueryFile);
				}
			}
			for(var i=0;i<headCss.length;i++){
				cssFile.push("/skin/"+skin+"/"+headCss[i]);
			}
			include({        
			    cssFiles:cssFile,//加载css文件    
			    scripts:script,//加载js文件
			    fun:function(){
			    	//回调函数
			    }
			});
		},
		error : function() {
		}
	});
}
var include = function(options) {
	JSLoader.call.include(options);
};

/********************************************文件动态加载工具**************************************************************/
/*
 *JS文件动态加载工具(动态加载CSS和JS)
 */
var JSLoader = {
	
	//浏览器判断
	browser : {
		ie : /msie/.test(window.navigator.userAgent.toLowerCase()),
		moz : /gecko/.test(window.navigator.userAgent.toLowerCase()),
		opera : /opera/.test(window.navigator.userAgent.toLowerCase()),
		safari : /safari/.test(window.navigator.userAgent.toLowerCase())
	},
	
	//具体方法
	call : (function() {
		
		/**
		 * 判断要加载的文件是否存在
		 */
		function hasFile(tag, url) {
			var contains = false;
			var files = document.getElementsByTagName(tag);
			var type = tag == "script" ? "src" : "href";
			for ( var i = 0, len = files.length; i < len; i++) {
				if (files[i].getAttribute(type) == url) {
					contains = true;
					break;
				}
			}
			return contains;
		}
		
		/**
		 * 文件加载方法
		 */
		function loadFile(element, callback, parent) {
			var p = parent && parent != undefined ? parent : "head";
			
			if (callback) 
            { 
                element.onload = element.onreadystatechange = function(){ 
                    if (element.readyState && element.readyState != 'loaded' && element.readyState != 'complete'){ 
                        return; 
                    } 
                    element.onreadystatechange = element.onload = null; 
                    callback(); 
                }; 
            } 

            document.getElementsByTagName(p)[0].appendChild(element);

		}
		
		/**
		 * 加载CSS文件，异步，添加完毕直接执行方法，不同步
		 */
		function loadCssFile(files, callback) {
			if(files && (files.length > 0)){
				var urls = files && typeof (files) == "string" ? [ files ] : files;
				for ( var i = 0, len = urls.length; i < len; i++) {
					var cssFile = document.createElement("link");
		            cssFile.setAttribute('rel', 'stylesheet');
		            cssFile.setAttribute('type', 'text/css');
		            cssFile.setAttribute('href', urls[i]);
		            if (!hasFile("link", urls[i])) {
		                document.getElementsByTagName("head")[0].appendChild(cssFile);
		            }
				}
			}
			callback();
			
            
		}
			
		/**
		 * 加载JS文件
		 */
		function loadScript(files, callback, parent) {
			if(files && (files.length > 0)){
    			var urls = files && typeof (files) == "string" ? [ files ] : files;
                for ( var i = 0, len = urls.length; i < len; i++) {
                    var script = document.createElement("script");
                    script.setAttribute('charset', 'utf-8');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', urls[i]);
                    if (!hasFile("script", urls[i])) {
                        loadFile(script, callback, parent);
                    }
                }
			}else{
                callback();
			}
		}
		
		/**
		 * 加载CSS文件和JS文件(先加载CSS再加载JS)
		 */
		function includeFile(options) {
			loadCssFile(options.cssFiles, function() {
				loadScript(options.scripts, options.fun, "head");
			});
		}

		return {
			include : includeFile
		};

	})()
};