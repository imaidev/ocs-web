
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
			document.getElementsByTagName(p)[0].appendChild(element);
			if (callback) {
				if (JSLoader.browser.ie) {//IE
					element.onreadystatechange = function() {
						if (this.readyState == 'loaded' || this.readyState == 'complete') {
							callback();
						}
					};
				} else if (JSLoader.browser.moz) {
					element.onload = function() {
						callback();
					};
				} else {
					callback();
				}
			}
		}
		
		/**
		 * 加载CSS文件
		 */
		function loadCssFile(files, callback) {
			var urls = files && typeof (files) == "string" ? [ files ] : files;
			for ( var i = 0, len = urls.length; i < len; i++) {
				var cssFile = document.createElement("link");
				cssFile.setAttribute('rel', 'stylesheet');
				cssFile.setAttribute('type', 'text/css');
				cssFile.setAttribute('href', urls[i]);
				if (!hasFile("link", urls[i])) {
					loadFile(cssFile, callback);
				}
			}

		}
			
		/**
		 * 加载JS文件
		 */
		function loadScript(files, callback, parent) {
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

		}
		
		/**
		 * 加载CSS文件和JS文件(先加载CSS再加载JS)
		 */
		function includeFile(options) {
			loadCssFile(options.cssFiles, function() {
				loadScript(options.scripts, options.fun, "body");
			});
		}

		return {
			include : includeFile
		};

	})()
};

/*
 * 供外部调用接口
 * include({cssFiles:[], scripts:[]})
 */
var include = function(options) {
	JSLoader.call.include(options);
};
