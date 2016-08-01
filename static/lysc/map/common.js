String.prototype.replaceAll = function(sFind,sRep) {
  return this.replace(new RegExp(sFind,"gm"),sRep);
};

String.prototype.trim= function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

/**
* 对Date的扩展，将 Date 转化为指定格式的String
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
* eg:
* (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
* (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
* (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
* (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
* (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
*/
Date.prototype.pattern=function(fmt) {
    var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "\u65e5",
    "1" : "\u4e00",
    "2" : "\u4e8c",
    "3" : "\u4e09",
    "4" : "\u56db",
    "5" : "\u4e94",
    "6" : "\u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
*	action：服务端请求
*   showid：将服务端的返回结果显示在页面中的元素内
*   bpath：jquery.js路径前缀，用于区分页面预览和页面访问
*   callback：当showid为空时，调用该方法处理服务端返回结果
*   formid：提交表单的id
*   async：true--ajax异步调用服务端，false--ajax同步调用服务端，为空时默认为true
*/
//var $j;
function _GetAndShowData(action, showid, bpath, callback, formid, async) {
	if(!async) {async = true;}
	if(typeof(jQuery) == 'undefined') {
		var script,head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
		script = document.createElement("script");
		script.async = "async";
		script.src = bpath + "/_cp/js/jquery-1.7.1.min.js";
		script.onload = script.onreadystatechange = function(_, isAbort) {
			if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
//				$j=jQuery.noConflict();
				script.onload = script.onreadystatechange = null;
				if(!isAbort) {
					_GetAndShowDyncData(action, showid, callback, formid, async);
				}
			}
		};
		head.insertBefore(script, head.firstChild);
	} else {
//		$j=jQuery.noConflict();
		_GetAndShowDyncData(action, showid, callback, formid, async);
	}
}

function _GetAndShowDyncData(action, showid, callback, formid, async) {
	var queryParaSplit = "&";
	if(action.indexOf("?") == -1) {
		queryParaSplit = "?";
	}
	
	var formPara = "";
	if(formid) {
//		formPara = queryParaSplit + $j('#' + formid).serialize();
		formPara = queryParaSplit + $('#' + formid).serialize();
	}
	
	$.ajax({
//	$j.ajax({
        type: "Get",
        async: async,
        url: action + formPara,
        cache: false,
        error: function () { },
        jsonp: "callback",
        dataType: "jsonp",
        success: function (json) {
        	if(json && json.data) {
				if(showid && showid.length > 0) {
					_SetInnerHTML(showid, decodeURIComponent(json.data));
				} else if(callback && callback.length > 0) {
					callback(json.data);
				}
			}
        }
    });
}

//执行innerHTML中的js
var global_html_pool = [];
var global_script_pool = [];
var global_script_src_pool = [];
var global_lock_pool = [];
var innerhtml_lock = null;
var document_buffer = "";

function _SetInnerHTML(obj_id, html, time) {
    if (innerhtml_lock === null) {
        innerhtml_lock = obj_id;
    }
    else if (typeof(time) == "undefined") {
        global_lock_pool[obj_id + "_html"] = html;
        window.setTimeout("_SetInnerHTML('" + obj_id + "', global_lock_pool['" + obj_id + "_html']);", 10);
        return;
    }
    else if (innerhtml_lock != obj_id) {
        global_lock_pool[obj_id + "_html"] = html;
        window.setTimeout("_SetInnerHTML('" + obj_id + "', global_lock_pool['" + obj_id + "_html'], " + time + ");", 10);
        return;
    }

    function get_script_id() {
        return "script_" + (new Date()).getTime().toString(36)
          + Math.floor(Math.random() * 100000000).toString(36);
    }

    document_buffer = "";

    document.write = function (str) {
        document_buffer += str;
    }
    document.writeln = function (str) {
        document_buffer += str + "\n";
    }

    global_html_pool = [];

    var scripts = [];
    html = html.split(/<\/script>/i);
    for (var i = 0; i < html.length; i=i+1) {
        global_html_pool[i] = html[i].replace(/<script[\s\S]*$/ig, "");
        scripts[i] = {text: '', src: '' };
        scripts[i].text = html[i].substr(global_html_pool[i].length);
        scripts[i].src = scripts[i].text.substr(0, scripts[i].text.indexOf('>') + 1);
        scripts[i].src = scripts[i].src.match(/src\s*=\s*(\"([^\"]*)\"|\'([^\']*)\'|([^\s]*)[\s>])/i);
        if (scripts[i].src) {
            if (scripts[i].src[2]) {
                scripts[i].src = scripts[i].src[2];
            }
            else if (scripts[i].src[3]) {
                scripts[i].src = scripts[i].src[3];
            }
            else if (scripts[i].src[4]) {
                scripts[i].src = scripts[i].src[4];
            }
            else {
                scripts[i].src = "";
            }
            scripts[i].text = "";
        }
        else {
            scripts[i].src = "";
            scripts[i].text = scripts[i].text.substr(scripts[i].text.indexOf('>') + 1);
            scripts[i].text = scripts[i].text.replace(/^\s*<\!--\s*/g, "");
        }
    }

    var s;
    if (typeof(time) == "undefined") {
        s = 0;
    }
    else {
        s = time;
    }

    var script, add_script, remove_script;

    for (var i = 0; i < scripts.length; i=i+1) {
        var add_html = "document_buffer += global_html_pool[" + i + "];\n";
        add_html += "document.getElementById('" + obj_id + "').innerHTML = document_buffer;\n";
        script = document.createElement("script");
        if (scripts[i].src) {
            script.src = scripts[i].src;
            if (typeof(global_script_src_pool[script.src]) == "undefined") {
                global_script_src_pool[script.src] = true;
                s += 10;
            }
            else {
                s += 10;
            }
        }
        else {
            script.text = scripts[i].text;
            s += 10;
        }
        script.defer = true;
        script.type =  "text/javascript";
        script.id = get_script_id();
        global_script_pool[script.id] = script;
        add_script = add_html;
        add_script += "document.getElementsByTagName('head').item(0)";
        add_script += ".appendChild(global_script_pool['" + script.id + "']);\n";
        window.setTimeout(add_script, s);
        remove_script = "document.getElementsByTagName('head').item(0)";
        remove_script += ".removeChild(document.getElementById('" + script.id + "'));\n";
        remove_script += "delete global_script_pool['" + script.id + "'];\n";
        window.setTimeout(remove_script, s);
    }

    var end_script = "if (document_buffer.match(/<\\/script>/i)) {\n";
    end_script += "_SetInnerHTML('" + obj_id + "', document_buffer, " + s + ");\n";
    end_script += "}\n";
    end_script += "else {\n";
    end_script += "document.getElementById('" + obj_id + "').innerHTML = document_buffer;\n";
    end_script += "innerhtml_lock = null;\n";
    end_script += "}";
    window.setTimeout(end_script, s);
}

function _GetRequestQueryString() {
	var url = location.search;
	if (url.indexOf("?") != -1) {
		return url.substr(1); 
	}
	return "";
}