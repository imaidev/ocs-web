(function( $ ) {
	
	$.fn.extend({
		/**
		 * 实现基于jQuery的node方法，用于获取标签中node-type为对应值的标签
		 * @param str
		 * @returns
		 */
		node: function(str) {
			return this.find("*[node-type=" + str + "]");
		},
		/**
		 * 给可输入文本的控件增加提示文字
		 * 用法：$(express).ui_prompt(option);
		 * 
		 * @param option {
		 *	prompt：提示文字	//也可在控件上增加data-prompt属性 
		 * }
		 */
		ui_prompt: function(option) {
			this.each( function() {
				var thisTag = $(this);
				
				var opt = new Object();
				$.copyValue(option, opt);
				
				thisTag.unbind("focusin");
				thisTag.unbind("focusout");
				if(thisTag.attr("value") === thisTag.attr("data-prompt")) {
					thisTag.attr("value", "");
				}
				if(opt.prompt) {
					thisTag.attr("data-prompt", opt.prompt);
				}
				
				thisTag.bind("focusin", function(e) {
					if(thisTag.attr("value") === thisTag.attr("data-prompt")) {
						thisTag.attr("value", "");
					}
					thisTag.removeClass("ui_prompt_font");
				});
				var focusout = function(e) {
					if(!thisTag.attr("value")){
						thisTag.addClass("ui_prompt_font");
						thisTag.attr("value", thisTag.attr("data-prompt"));
					}
				};
				thisTag.bind("focusout", focusout);
				
				focusout();
			});
			return this;
		}
	});
	
	$.extend({
		copyValue: function(source, target) {
			for(var s in source) {
				target[s] = source[s];
			}
		},
		jsonStringify: function(str) {
			return JSON.stringify(str);
		},
		dateFormat: function(date, format) {
			var o = { 
				"M+" : date.getMonth()+1, //month 
				"d+" : date.getDate(), //day 
				"h+" : date.getHours(), //hour 
				"m+" : date.getMinutes(), //minute 
				"s+" : date.getSeconds(), //second 
				"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
				"S" : date.getMilliseconds() //millisecond 
			};

			if(/(y+)/.test(format)) { 
				format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			} 

			for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
			} 
			return format; 
		},
		limiter: function(limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html( limit - chars );
            }
            setCount($(this)[0], elem);
        }
	});
	
})(jQuery);
/*
if(!Array.indexOf){
	Array.prototype.indexOf = function(Object){
		for(var i = 0;i<this.length;i++){
			if(this[i] == Object){
				return i;
			}
		}
		return -1;
	};
}*//**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: data.results[0]
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());function getCurPos(_textarea){
 
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
}var IM_CONFIG = {
	DEFAULT_ICON: "images/untitled.png"
};

var L = {
	onlineLabel:properties.webimconst_online_friends,
	myfriendLabel:properties.webimconst_my_friends,
	userOfflineBusy:properties.webimconst_other_busy,
	searchLabel:properties.webimconst_find_contact,
	searchNoneLabel:properties.webimconst_nofind_contact,
	failedLabel: properties.webimconst_nosend_msg,
	defaultName: properties.webimconst_user,
	hasMessageLabel: properties.webimconst_new_msg,
	noneNickName:properties.webimconst_anonymous_user,
	serviceLabel:properties.webimconst_service_foryou,
	pingServiceLabel:properties.webimconst_service_scoring,
	serviceSendLabel:properties.webimconst_sent_score,
	noneServiceLabel:properties.webimconst_nofree_service,
	historyLabel:properties.webimconst_chat_log,
	serviceLabel: "%s",
	salemanLabel: properties.webimconst_mymanager
};

var E = {
	
	INIT_USER_INFO:"wbim_init_user_info",
	GET_USER_INFO:"wbim_get_user_info",
	
	OPEN_LIST:"wbim_event_openlist",
	CLOSE_LIST:"wbim_event_closelist",
	
	OPEN_CHATBOX:"wbim_event_openchatbox",
	CLOSE_CHATBOX:"wbim_event_closechatbox",
	HIDE_CHATBOX:"wbim_event_hidechatbox",
	ADD_CHAT_USER:"wbim_event_addchatuser",
	
	CURRENT_USER:"wbim_event_currentuser",
	
	SET_USER_STATUS:"wbim_event_setUserStatus",
	SET_SERVICE_STATUS:"wbim_event_setServiceStatus",
	SELF_STATUS_CHANGE:"wbim_event_selfstatuschange1",
	ONLINES:"wbim_event_onlines",
	
	ON_SEND_MESSAGE:"wbim_event_sendmessage",
	ON_ACCEPT_MESSAGE:"wbim_event_acceptmessage",
	ON_SEND_CONTROL:"wbim_event_sendcontrol",
	DO_NOT_CONTROL:"wbim_event_donotcontrol",
	
	GET_CHAT_INFO:"wbim_event_getchatinfo",
	HAS_MESSAGE:"wbim_event_hasmessage",
	ADD_MULMESSAGE:"wbim_event_addmulmessage",
	ADD_HISTORYMESSAGE:"wbim_event_addhistorymessage",
	
	OPEN_SYSTEM_MESSAGE:"wbim_event_openSysMsg",
	CLOSE_SYSTEM_MESSAGE:"wbim_event_closeSysMsg",
	CHANGE_SYSTEM_MESSAGE:"wbim_event_changeSysMsg",
	SHOW_SYSTEM_TIP:"wbim_event_showSysMsgTip",
	CANCEL_SYSTEM_TIP:"wbim_event_cancelSysMsgTip"
};

var F = {
		FILE_START_STR:"file-start",
		FILE_IMG_STR:"file-start&type=image&id=",
		FILE_DOC_STR:"file-start&type=doc&id=",
		FILE_NAME_STR:"&name=",
		FILE_END_STR:"file-end",

		FILE_IMG_REP:/file-start&type=image&id=/,
		FILE_FILE_REP:/file-start&type=doc&id=/,
		
		FILE_IMG_RES:/file-start&type=image&path=/,
		FILE_FILE_RES:/file-start&type=doc&path=/
};function RobotMap() {
	this.elements = new Array();

	// 获取Map元素个数
	this.size = function() {
		return this.elements.length;
	},

	// 判断Map是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	},

	// 删除Map所有元素
	this.clear = function() {
		this.elements = new Array();
	},

	// 向Map中增加元素（key, value)
	this.put = function(_key, _value) {
		if (this.containsKey(_key) == true) {
			if (this.containsValue(_value)) {
				if (this.remove(_key) == true) {
					this.elements.push({
								key : _key,
								value : _value
							});
				}
			} else {
				this.elements.push({
							key : _key,
							value : _value
						});
			}
		} else {
			this.elements.push({
						key : _key,
						value : _value
					});
		}
	},

	// 删除指定key的元素，成功返回true，失败返回false
	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 获取指定key的元素值value，失败返回null
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	},

	// 获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	},

	// 判断Map中是否含有指定key的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 判断Map中是否含有指定value的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 获取Map中所有key的数组（array）
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	},

	// 获取Map中所有value的数组（array）
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	};
}/**
 * 用户设置在线状态、切换好友与群组、获取最近联系人等操作
 */
var WebIMList = function() {
	
};

(function( $ ) {
	/**
	 * 好友列表界面操作
	 */
	WebIMList.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		isOpen: false,
		status: 1,
		tabIndex:0,
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			this.webim = webim;
			this.ptag = this.webim.tag;
			if(this.ptag.node){
				this.tag = this.ptag.node("wbim_list_expand");
			}
			
			this.listenerTagEvent();
			this.listener();
		},
		
		/**
		 * 处理列表内部事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			
			var wbimListTag = this.tag.find(".wbim_list_tab");
			var wbimListBox = this.tag.find(".wbim_list_box");
			wbimListTag.find("li").removeClass("curr").eq(0).addClass("curr");//默认切换到好友列表
			// 列表切换（好友、群组、最近联系人）
			wbimListTag.find("li").click(function(e) {
				//获取当前选中标签的索引
				$this.tabIndex = -1;
				$.each(wbimListTag.find("li"), function(i, atag) {
					if(atag == e.currentTarget) {
						$this.tabIndex = i;
						return false;
					}
				});
				showWbimList($this);
			});
			
			//显示好友列表
			var showWbimList = function($this){
				//标签页
				wbimListTag.find("ul").css("display","block");
                wbimListTag.find("li").removeClass("curr").eq($this.tabIndex).addClass("curr");
                //中间内容
                wbimListBox.find(".wbim_list_friend").css("display", "none").eq($this.tabIndex).css("display", "");
                
                
                if($this.tabIndex == 1){//最近联系人
                	$this.webim.getNearFriends();
                }
			};
			
			// 用户在线状态设置
			var status = this.tag.node("status_manager");
			var status_arrow = this.tag.node("wbim_status_tit_arrow");
			status.hover(function(e) {
				$(e.currentTarget).find("ul").css("display", "block");
				status.parent().addClass("wbim_tit_lf_hover");
				
				if(status_arrow){
					status_arrow.removeClass("wbim_status_tit_arrow");
                    status_arrow.addClass("wbim_status_tit_arrow_hover");
				}
			}, function(e) {
				$(e.currentTarget).find("ul").css("display", "none");
				status.parent().removeClass("wbim_tit_lf_hover");
				
				if(status_arrow){
                    status_arrow.removeClass("wbim_status_tit_arrow_hover");
                    status_arrow.addClass("wbim_status_tit_arrow");
                }
			});
			// 用户选择在线状态
			status.find("ul li").click(function(e, s) {
				var $target = $(e.currentTarget);
				
				//断网情况下不可以设置状态
				if(!$this.webim.isConnected){
					$target.parent().css("display", "none");
//					$this.tag.node("status_manager").parent().removeClass("wbim_tit_lf_hover");
				    return;
				}
				
				
				var value = $target.attr("data-status");
				if($this.status != value) {
				
					var type = $this.webim.getUserStatusStyle(value);
					
					var h = $target.find("a").clone();
					h.node("wbim_status_label").addClass("txt");
					var tit = status.node("wbim_status_tit");
					tit.empty();
					tit.append(h.html());
					
					//$this.webim.setUserStatusStyle(tit, type);
					$target.parent().css("display", "none");
					
					status.find("ul li").removeClass("wbim_status_selected");
					$target.addClass("wbim_status_selected");
					
					$this.status = value;
					$this.trigger(E.SELF_STATUS_CHANGE, {status: value, cla:type, s: s});
					
				}
			});
			
			// 监听最小化按钮点击
			this.tag.node("wbim_icon_mini").click(function(e) {
				$this.hideIMListBox();
			});
			// 监听关闭按钮点击
			this.tag.node("wbim_clicknone").click(function(e) {
				$this.hideIMListBox();
			});
			// 监听列表头部点击
			this.tag.node("wbim_titin").click(function(e) {
				if(e.target == e.currentTarget) {
					$this.hideIMListBox();
				}
			});
			
			var friendlist = this.tag.node("wbim_list_friendlist");
			var nearlist = this.tag.node("wbim_list_nearlist");
			
			// 监听其他用户状态改变
			this.tag.on("listSetUserStatus", function(e, data){
				var type = $this.webim.getUserStatusStyle(data);
				var user = friendlist.find("li[uid=" + data.uid + "]");
				$this.webim.setUserStatusStyle(user, type);
				user = nearlist.find("li[uid=" + data.uid + "]");
				$this.webim.setUserStatusStyle(user, type);
				
				$this.listSort();
			})
			.on("listSetServiceStatus", function(e, data) {
				var service = friendlist.find("li[data-value="+data.value+"]");
				var type = $this.webim.getUserStatusStyle(data.status);
				$this.webim.setUserStatusStyle(service, type);
				
				$this.listSort();
			})
			.on("showSearchList", function(e) {
				wbimListTag.find("ul").css("display", "none");
				wbimListBox.find(".wbim_list_friend").css("display", "none");
				wbimListBox.node("wbim_list_searchlist").css("display", "block");
			})
			.on("hideSearchList", function(e) {
				wbimListTag.find("ul").css("display", "block");
				wbimListTag.find(".curr a").trigger("click");
			});
			
			// 搜索好友
			var search = this.tag.find("#wbim_search");
			search.ui_prompt({prompt:L.searchLabel});
			var searching = function(e) {
				var str = search.val();
				if(str) {
					var arr = $this.webim.getSearchFriends(str);
					$this.setSearchFriends(arr);
				} else {
//					$this.setSearchFriends(null);
					showWbimList($this);
				}
			};
			search.keyup(function(e) {
				searching(e);
			});
		},
		
		/**
		 * 将当前用户状态设置为离线(断网时调用)
		 */
		changeStatusLeaveLine:function(){
			var tit = this.tag.node("status_manager").node("wbim_status_tit");
            tit.empty();
            tit.append("<span class='wbim_status_offline'></span><span class='wbim_status_label txt' node-type='wbim_status_label'>"+properties.webimlist_offline+"</span>");
		    this.status = "3";
		},
		
		/**
		 * 显示好友列表
		 */
		showIMListBox: function(s) {
			this.tag.css("display", "block");;
			this.isOpen = true;
			
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
		},
		/**
		 * 隐藏好友列表
		 */
		hideIMListBox: function(s) {
			this.tag.css("display", "none");;
			this.isOpen = false;
			
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
		},
		/**
		 * 设置用户的好友
		 * @param data
		 */
		setFriends: function(data) {
			var $this = this;
			
			var str = '<div class="wbim_list_group">';
			var hf = false;
			$.each(data, function(i, obj) {
				str += '<div class="wbim_list_group_tit wbim_open" data-open="false" data-type="'+obj.type+'" title="' + obj.gname + '">' + obj.gname + ' [ <span node-type="wbim_onlinecount" title="' + L.onlineLabel + '">0</span> ]</div>';
				str += '<ul style="display:block">';
				$.each(obj.gmember, function(j, obj2) {
					str += $this.getLiTag(obj2);
					hf = true;
				});
				str += '</ul>';
			});
			
			str += '</div>';
			
			// 没有好友
			if(!hf) return;
			
			var friendlist = this.tag.node("wbim_list_friendlist");
			friendlist.empty();
			friendlist.append(str);
			
			this.listSort();
			
			// 好友分组操作
			friendlist.find(".wbim_list_group_tit").click(function(e) {
				var $target = $(e.currentTarget);
				var $list = $target.next();
				var open = $target.attr("data-open");
				if(open == "true") {
					$target.removeClass("wbim_open");
					$target.addClass("wbim_close");
					$list.css("display", "none");
					$target.attr("data-open", "false");
				} else if(open == "false") {
					$target.addClass("wbim_open");
					$target.removeClass("wbim_close");
					$list.css("display", "block");
					$target.attr("data-open", "true");
					
					$this.webim.checkService();
				}
				
			});
			
			// 监听点击某个好友，打开聊天窗口
			friendlist.find("li").click(function(e) {
				$this.openChatBoxHandler($this,$(e.currentTarget));
			});
		},
		/**
		 * 设置群
		 * @param data
		 */
		setGroups: function(data) {
			var $this = this;
			var groupList = this.tag.node("wbim_list_grouplist");
			if(data && (data.length>0)){
				var str = '<div class="wbim_list_group">';
				str += '<ul>';
				$.each(data, function(i, obj) {
					str += '<li id="' +obj.gid+ '" title="' +obj.gname+'" data-icon="' +obj.icon+ '" gmember="' +obj.gmember+ '">'
					+'<div class="wbim_userhead"><img src="' + obj.icon + '"><span style="display:none;" class="wbim_icon_msg_s"></span><span node-type="wbim_status"></span></div>'
					+ '<div class="wbim_username">' + obj.gname + '</div></li>';
				});
				str += '</ul>';
				str += '</div>';
				
				groupList.empty();
				groupList.append(str);
				
				// 监听点击打开聊天窗口
				groupList.find("li").click(function(e) {
					var $target = $(e.currentTarget);
					var data = {uid: $target.attr("uid"), uname:$target.attr("uname"),
								icon: $target.attr("icon"),way:"group",gmember:"gmember"};
					$this.trigger(E.OPEN_CHATBOX, data);
				});
			}
		},
		/**
		 * 设置最近联系好友
		 * @param data
		 */
		setNearFriends: function(data) {
			var nearlist = this.tag.node("wbim_list_nearlist");
			if(data.length > 0) {
				this.createFriendList(data, nearlist);
			}
		},
		/**
		 * 设置搜索出的好友
		 * @param data
		 */
		setSearchFriends: function(data) {
			var $this = this;
			var searchlist = this.tag.node("wbim_list_searchlist");
			if(data) {
				if(data.length > 0) {
					this.createFriendList(data, searchlist);
				} else {
					searchlist.empty();
					searchlist.append('<p class="noresult_warn"><p class="warn_icon"/>' + L.searchNoneLabel + '</p>');
					searchlist.parent().bind("click", function(e) {
						searchlist.parent().unbind("click");
						$this.innerTrigger("hideSearchList");
					});
				}
				$this.innerTrigger("showSearchList");
			} else {
				$this.innerTrigger("hideSearchList");
			}
		},
		createFriendList: function(data, parentTag) {
			var $this = this;
			
			var str = '<div class="wbim_list_group">';
			str += '<ul>';
			$.each(data, function(j, s) {
				var user = $this.webim.getFriend(s.uid);
				if(!user)
					user = s;
				str += $this.getLiTag(user);
			});
			str += '</ul>';
			str += '</div>';
			
			parentTag.empty();
			parentTag.append(str);
			
			// 点击好友打开聊天窗口
			parentTag.find("li").click(function(e) {
				$this.openChatBoxHandler($this,$(e.currentTarget));
			});
		},
		
		/**
		 * 从点击的li获取数据打开聊天框
		 */
		openChatBoxHandler:function($this,$target){
			
                var skill = $target.attr("data-skill");//技能，区分客服与普通用户
                
                //在线客服和普通用户
                if($this.webim.isService(skill)) {
                    var obj = {name: $target.attr("data-name"),
                            type: $target.attr("data-type"),
                            value: $target.attr("data-value"),
                            icon: $target.attr("data-icon"),
                            skill: $target.attr("data-skill")};
                    $this.webim.getService(obj);
                } else {
                    var data = {
                       icon:$target.attr("icon"),
                       uid:$target.attr("uid"),
                       uname:$target.attr("uname"),
                       skill:$this.webim.getDefaultSkill($target.attr("skill"))
                    };
                    $this.trigger(E.OPEN_CHATBOX, data);
                }
		},
		
		/**
		 * 获取好友列表中单项的HTML代码
		 * @param data
		 * @returns {String}
		 */
		getLiTag: function(data) {
			var str = "";
			if(data.tag == "service") {
				
				//默认是在线客服
				if(isEmpty(data.skill)){
				    data.skill = "2";
				}
				
				//将在线客服的默认状态统一设为不在线
				data.status = 3;
				
				//将智能机器人设置为在线
				if(this.webim.isRobot(data.skill)){
					data.status = 1;
//					data.uname = "小city";
				}
				
				//组装数据
                str = ' tagtype="'+data.tag+'" data-name="'+data.uname+'" data-value="'+data.uid+'" data-type="'+data.type+'" data-skill="'+data.skill+'" data-icon="' + data.icon;
			}
			
			var status_style = this.webim.getUserStatusStyle(data);
			
			return '<li uid="' + data.uid + '" '+str+'" uname="' + data.uname + '" data-status="'+data.status
			+ '" skill="' + data.skill
			+ '" icon="' + data.icon+'" class="" data-sort="' + status_style + '">'
			+ '<div class="wbim_userhead"><img src="' + data.icon + '"><span style="display:none;" class="wbim_icon_msg_s"></span><span node-type="wbim_status" class="' + status_style + '"></span></div>'
			+ '<div class="wbim_username">' + data.uname + '</div></li>';
		},
		/**
		 * 好友列表排序
		 */
		listSort: function() {
			var friendlist = this.tag.node("wbim_list_friendlist");
			
			var alll = 0;
			var onnn = 0;
			var groups = friendlist.find("ul");
			$.each(groups, function(i, ul) {
				var $ul = $(ul);
				var $group = $ul.prev();
				var onlines = $ul.find("li[data-sort=wbim_status_online]");
				var busys = $ul.find("li[data-sort=wbim_status_busy]");
				var offlines = $ul.find("li[data-sort=wbim_status_offline]");
				$ul.prepend(busys);
				$ul.prepend(onlines);
				
				var on = onlines.length + busys.length;
				var len = on + offlines.length;
				$group.node("wbim_onlinecount").text(on + "/" + len);
				
				onnn += on;
				alll += len;
			});
			
			var data = new Object();
			data.on = onnn;
			data.all = alll;
			this.trigger(E.ONLINES, data);
		},
		/**
		 * 获取当前界面的显示状态
		 * @returns {___data0}
		 */
		getViewStatus: function() {
			var data = new Object();
			data.isOpen = this.isOpen;
			data.status = this.status;
			return data;
		},
		/**
		 * 设置当前界面的显示状态
		 * @param data
		 */
		setViewStatus: function(data) {
			if(data.isOpen)
				this.showIMListBox(E.DO_NOT_CONTROL);
			else
				this.hideIMListBox(E.DO_NOT_CONTROL);
			
			var status = this.tag.node("status_manager");
			status.find("ul li[data-status=" + data.status + "]").trigger("click", E.DO_NOT_CONTROL);
		},
		/**
		 * 监听外部操作事件
		 */
		listener: function() {
			var $this = this;
			this.ptag.on(E.OPEN_LIST, function(e, data) {
				$this.showIMListBox();
			}).on(E.CLOSE_LIST, function(e, data) {
				$this.hideIMListBox();
			}).on(E.SET_USER_STATUS, function(e, data) {
				$this.innerTrigger("listSetUserStatus", data);
			}).on(E.SELF_STATUS_CHANGE, function(e, data) {
				var status = $this.tag.node("status_manager");
				status.find("ul li[data-status=" + data.status + "]").trigger("click", data.s);
			}).on(E.SET_SERVICE_STATUS, function(e, data) {
				$this.innerTrigger("listSetServiceStatus", data);
			});
		},
		/**
		 * 触发外部操作事件，供其他组件监听
		 * @param type
		 * @param data
		 */
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		/**
		 * 触发内部操作事件
		 * @param type
		 * @param data
		 */
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		}
	};
	
})(jQuery);var WebIMChatbox = function() {
	
};

(function( $ ) {
	/**
	 * 聊天窗口界面操作
	 */
	WebIMChatbox.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		users: null,			// 当前聊天的所有用户
		currentUser: null,		// 正在聊天的用户（打开的聊天窗口正与该用户聊天）
		sendKey: "entry",		// 发送按钮快捷键
		isOpen: false,
		historySize: 40,
		historyIsShow: false,
		upImgSwf:null,//文件上传swf
		voiceEnabled:true,//默认开启声音提示
		
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			var $this = this;
			this.webim = webim;
			this.ptag = this.webim.tag;
			this.tag = this.ptag.node("wbim_chat_box");
			
			this.users = new Array();
			//监听内部事件
			this.listenerTagEvent();
			//监听外部事件
			this.listener();
			//加载图片上传swf
			this.createFileUpLoad();
			//显示“测试版”
			this.createTextVersionTitle();
			
			//默认最大化
			this.trigger(E.OPEN_LIST);
			
			//增加刷新按钮
			//this.createRefreshBtn();
		},
		/**
		 * 监听内部处理事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			
			//监听拖拽事件
            dragHandler("wbim_chat_box_head","wbim_chat_box");
			
			// 监听最小化按钮点击
			var iconMini = this.tag.node("wbim_icon_mini");
			iconMini.click(function(e) {
				$this.hideIMChatBox();
			});
			// 监听聊天窗口顶部点击
			var titin = this.tag.node("wbim_titin");
			titin.click(function(e) {
				if(e.target == e.currentTarget) {
					$this.hideIMChatBox();
				}
			});
			var btmin = this.tag.node("wbim_chat_btmin");
			btmin.click(function(e) {
				if(e.target == e.currentTarget) {
					$this.hideIMChatBox();
				}
			});
			// 监听关闭按钮点击
			var iconClose = this.tag.node("wbim_icon_close");
			iconClose.click(function(e) {
				$this.trigger(E.CLOSE_CHATBOX);
			});
			// 监听结束会话按钮
			var btnClose = this.tag.node("wbim_btn_close");
			btnClose.click(function(e) {
				if($this.currentUser) {
					if($this.webim.isService($this.currentUser.skill)) {
						$this.showPingView($this.currentUser.uid);
					}else {
						$this.removeUser($this.currentUser.uid, true);
					}
				}
			});
			// 监听结束会话按钮
			var btnConfirm = this.tag.node("wbim_btn_confirm");
			btnConfirm.click(function(e) {
				
				var pingView = $this.tag.node("wbim_ping_box");
				var uid = pingView.attr("uid");
				var score = pingView.find(":radio:checked").val();
				
				pingView.find(":radio:checked").val(2);
				$this.hidePingView(E.DO_NOT_CONTROL);
				
				$this.webim.sendCloseService(uid, score);
				
				$this.removeUser(uid, true);
			});
			
			var singleUser = this.tag.node("wbim_single_user");
			var singleUserName = singleUser.node("wbim_tit_lf_user_name");
			
			var group = this.tag.node("wbim_group");
			
			var chatList = this.tag.node("wbim_chat_list");
			var friendList = this.tag.node("wbim_chat_friend_list");
			var friendsList = this.tag.node("wbim_list_friendlist");
			
			// 发送按钮
			var sendBtn = this.tag.node("wbim_btn_publish");
			var sendMsg = this.tag.node("wbim_chat_input_ta");
			var sendLength = this.tag.node("wbim_tips_char");
			
			// 聊天窗口左侧列表
			var chatLf = this.tag.node("wbim_chat_lf");
			
			// 聊天窗口顶部提示
			var chatTips = this.tag.node("wbim_chat_tips");
			
			// 聊天表情
			var faceView = this.tag.node("wbim_face_box");
			var faceATag = faceView.node("wbim_face_list").find("a");
			
			//声音提示
			var voiceTag = this.tag.node("wbim_icon_voice");
			var voiceITag = voiceTag.find("i");
			
			// 打分邀请按钮
			var pingBtn = this.tag.node("wbim_icon_ping");
			// 常用语（快捷回复）
			var quickBtn = this.tag.node("wbim_icon_quick");
			var quickView = this.tag.node("wbim_quick_box");
			// 订单查询
			//var quickSearch = this.tag.node("wbim_icon_chaxun");
			
			// 聊天记录按钮
			var historyBtn = this.tag.node("wbim_history");
			// 聊天记录界面
			var historyView = this.tag.node("wbim_history_box");
			var historyList = this.tag.node("wbim_history_con");
			
			var historyNext = historyView.node("wbim_history_next");
			var historyPrev = historyView.node("wbim_history_prev");
			var historyRefresh = historyView.node("wbim_history_refresh");
			var historyMax = historyView.node("wbim_history_max");
			var historyII = historyView.find("#wbim_history_ii");
			var historyIIBtn = historyView.node("wbim_history_query_btn");
			
			//声音提示与禁止
			voiceTag.click(function(e){
				if($this.voiceEnabled){
					voiceITag.removeClass("wbim_icon_voice");
					voiceITag.addClass("wbim_icon_voice_dis");
					$this.voiceEnabled = false;
				}else{
					voiceITag.removeClass("wbim_icon_voice_dis");
					voiceITag.addClass("wbim_icon_voice");
					$this.voiceEnabled = true;
				}
			});
			
			/**
			 * 清除消息内容
			 */
			var clearMessage = function() {
				sendMsg.val("");//清空发送框
				sendLength.text("200");//字符限制
				setFileUpTool("none");//文件传送栏
			};
			
			/**
			 * 发送消息
			 * @param e：事件
			 * @param msg:消息内容
			 */
			var onSendMessage = function(e, msg) {
				//消息内容判断
				msg = checkSendMsgLength(msg);
				if(!msg){
				    return;
				}
				
				//组装消息内容
				var date = new Date();
				var data = {
					isSelf:true,//默认是自己发的消息
					way: $this.currentUser.way,//发送方式(group代表群聊，默认私聊)
					uid: $this.currentUser.uid,//消息接收者id。聊天框是以对方id为标记的，便于查找对方的聊天框界面
					uname: $this.currentUser.uname,//消息接收者昵称
					date: $.dateFormat(date, "yyyy-MM-dd"),//日期
					time: $.dateFormat(date, "hh:mm:ss"),//时间
					content: msg//内容
				};
				
				//显示在消息接收框
				$this.innerTrigger("addMessage", data);
				
				//发送给聊天服务器
				if($this.webim.isConnected) {    
					//当前对话人信息
					sendChatMsg({
						"to": $this.currentUser.uid,
						"to_name": $this.currentUser.uname,
						"msg": msg,
						"vendId": WEB_IM_CONFIG.vendId,
						"itemId": WEB_IM_CONFIG.itemId
					});
					clearMessage();
					
					$this.trigger(E.ON_SEND_MESSAGE, {user: $this.currentUser, content: msg});
				} else {
					$this.innerTrigger("showBoxTips", {content:L.failedLabel});
				}
			};
			
			/**
			 * 消息内容是否超出限制
			 */
			var sendMsgBgTimeId = "";
			var checkSendMsgLength = function(msg){
				//默认获取发送框里的文字，快捷回复是可以传过来msg的
				if(!msg || (msg.length == 0)){
				    msg = sendMsg.val();
				}
				
				//大于200字进行提示
				if(msg && (msg.length > 200)){
					if(sendMsgBgTimeId == ""){
                    	sendMsgBgTimeId = setInterval(function(){setSendMsgBgHander();},200);
					}
                    return false;
				}
				
				//上传的附件
                var fileMsg = $("#fileUpTextId").val();//上传的文件
                if(fileMsg && (fileMsg.length>0)){
                    msg = $.trim(msg + fileMsg);
                }
                
                //判断
                if(!msg && (msg.length <= 0)){
                    if(sendMsgBgTimeId == ""){
                    	sendMsgBgTimeId = setInterval(function(){setSendMsgBgHander();},200);
					}
                    return false;
                }
                
                return msg;
                
			};
			/**
			 * 输入框闪动警告
			 */
			var setSendMsgIndex = 0;
			var setSendMsgBgHander = function(){
			     if(setSendMsgIndex % 2 == 0){
                  sendMsg.css("background-color","#FFFFFF");
                }else{
                  sendMsg.css("background-color","#FA8072");
                }
                setSendMsgIndex ++;
                
                if(setSendMsgIndex >= 5){
                	setSendMsgIndex = 0;
                    clearInterval(sendMsgBgTimeId);
                    sendMsgBgTimeId = "";
                }
			};
			
			
			var current = $.dateFormat(new Date(), "yyyy-MM-dd");
			var getTimeFormat = function(m) {
				var str = "";
				if(m.date != current) {
					str += m.date + " ";
				}
				str += m.time;
				return str;
			};
			
			/**
			 * 打开与客服聊天框后的友好提示语
			 */
			var showWelcome = function(uid){
				var dl = chatList.find("dl[uid=" + uid + "]");
				var newContent = properties.welcome.replace(/%s/, $this.currentUser.uname);
					
				if ($this.webim.isService($this.currentUser.skill) || $this.webim.isRobot($this.currentUser.skill)) {
					var data = {
						type : "3600",
						user_id: $this.currentUser.uid
					};
					var date = new Date();
					var welcom_data = {
							dd_id : "welcome_id",
							isSelf : false,//客服消息
							uname : $this.currentUser.uname,//消息接收者昵称
							uid : $this.currentUser.uid,
							date : $.dateFormat(date, "yyyy-MM-dd"),//日期
							time : $.dateFormat(date, "hh:mm:ss"),//时间
							content : newContent//内容
						};
					$.ajax({
						url : WEB_IM_CONFIG.imUrL + "sendOperate",
						data : {
							data : JSON.stringify(data)
						},
						dataType : WEB_IM_CONFIG.ajaxDataType,
						jsonp : WEB_IM_CONFIG.ajaxJsonp,
						type : "post",
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							$("#welcome_id").remove();
							dl.append(getChatContent(welcom_data));
							chatList.scrollTop(9999999);
						},
						success : function(data) {
							if (!data) {
								return;
							}
							if (typeof (data) === "string") {
								data = JSON.parse(data);
							}
							if (data.welcomeInfo) {
								newContent = data.welcomeInfo;
							}
							welcom_data.content = newContent;
							$("#welcome_id").remove();
							dl.append(getChatContent(welcom_data));
							chatList.scrollTop(9999999);
						}
					});
				}
				
			};

			/**
			 * 增加与某个用户的聊天
			 */
			this.tag.on("addUser", function(e, data) {
				//显示聊天内容
				var dl = '<dl uid="' + data.uid + '" style="display:none;" data-hasmsg="false"></dl>';
				chatList.append(dl);
				
				//多个用户时
				if(!data.icon || (data.icon == "undefined")){
					data.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
				}
				var li = '<li node-type="wbim_list_user" uid="' + data.uid + '" title="' + data.uname + '" skill="'+ data.skill +'" class="wbim_offline">'
					 + '<div class="wbim_userhead"><img node-type="wbim_userhead" src="'+ (data.icon ? data.icon:"") + '"><span node-type="wbim_status" class="' + $this.webim.getUserStatusStyle(data) + '"></span></div>'
					 + '<div node-type="wbim_username" class="wbim_username">' + data.uname + '</div>'
					 + '<a node-type="wbim_icon_close_s" class="wbim_icon_close_s" />' 
					 + '</li>';
				friendList.append(li);
				
				if(data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			})
			.on("removeUser", function(e, data) {			// 移除与某个用户的聊天
				chatList.find("dl[uid=" + data.uid + "]").remove();
				var li = friendList.find("li[uid=" + data.uid + "]").remove();
				var h = friendList.height();
				var top = friendList.position().top;
				if(top < 0) {
					friendList.css("top", top + 32);
					friendList.css("height",h - 32);
				}
				if(data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
				
				//移除侧边栏信息
				$("#baseInfo_" + data.uid).remove();
				$("#orderInfo_" + data.uid).remove();
			})
			

			/**
			 * 设置新的聊天用户
			 */
			.on("setCurrentUser", function(e, data) {		// 当前聊天用户改变
				
				chatList.find("dl").css("display", "none");
				friendList.find("li").removeClass("wbim_active");
				
				if(data) {
					
					var uname = data.uname;
					
					//顶部对话人的昵称
					
					//客服的昵称显示为：与XXX咨询中...
					if($this.webim.isService(data.skill) || $this.webim.isRobot(data.skill)) {
						uname = L.serviceLabel.replace(/%s/, uname);
						singleUserName = singleUser.node("wbim_tit_lf_service_name");
						$("#wbim_tit_lf_user_name_id").css("display","none");
						$("#wbim_tit_lf_service_name_id").css("display","block");
					}else{//普通用户直接显示昵称
						singleUserName = singleUser.node("wbim_tit_lf_user_name");
						$("#wbim_tit_lf_service_name_id").css("display","none");
						$("#wbim_tit_lf_user_name_id").css("display","block");
					}
					
					//第二套皮肤打开的聊天对话框左上角显示人物头像
					if(WEB_IM_CONFIG.skin == "3"){
					   var headIcon = '<div class="wbim_userhead" style="margin-right:6px;"><img node-type="wbim_userhead" src="' 
                        + (data.icon ? data.icon:"") + '"><span node-type="wbim_status" class="' 
                        + $this.webim.getUserStatusStyle(data) + '"></span></div>';
                        singleUser.find(".txt .wbim_userhead").remove();
                        singleUser.find(".txt").prepend(headIcon);
					}
					
					uname = uname + (WEB_IM_CONFIG.appendUId?"("+data.uid+")":"");
					singleUserName.attr("title", uname).html(uname);
					
					//设置在线状态
					var u = friendList.find("li[uid=" + data.uid + "]");
					var s = u.node("wbim_status");
					var c = s.attr("class");
					$this.webim.setUserStatusStyle(singleUser, c);
					
					//显示聊天记录
					var chat = chatList.find("dl[uid=" + data.uid + "]");
					var h = chat.css("display", "block").height();
					friendList.find("li[uid=" + data.uid + "]").addClass("wbim_active");
					chatList.scrollTop(9999999);
					
					if(c == "wbim_status_offline" || c == "wbim_status_busy") {
						$this.innerTrigger("showBoxTips", {content: L.userOfflineBusy});
					} else {
						$this.innerTrigger("hideBoxTips");
					}
					$this.innerTrigger("unactiveChatbox", data);
					
					if(chat.attr("data-hasmsg") == "false") {
						$this.trigger(E.GET_CHAT_INFO, data);
						chat.attr("data-hasmsg", "true");
					}
					
					showWelcome(data.uid);
					
					if(WEB_IM_CONFIG.showSideBar == 1){ //设置默认侧边栏
						$this.webim.changeSideBar(data.uid);
					} else if(WEB_IM_CONFIG.showSideBar == 2){ //自定义侧边栏
						$this.webim.setSideBarNew(data.uid);
					}
				}
				
				//清空发送框
				clearMessage();
				
				if(data && data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			})
			.on("showUserList", function(e) {		// 显示左侧的用户列表
				//$this.tag.addClass("wbim_chat_box_s");
				//控制侧边栏能正常显示的宽度
				if(chatLf.css("display") == "none"){
					$(".wbim_chat_box_s").width($(".wbim_chat_box_s").width() + 120);
				}
				chatLf.css("display", "block");
			})
			.on("hideUserList", function(e) {		// 隐藏左侧的用户列表
				//$this.tag.removeClass("wbim_chat_box_s");
				if(chatLf.css("display") == "block"){
					$(".wbim_chat_box_s").width($(".wbim_chat_box_s").width() - 120);
				}
				chatLf.css("display", "none");
			})
			.on("addMessage", function(e, data) {	// 显示用户发的消息
				var dl = chatList.find("dl[uid=" + data.uid + "]");
				if(dl[0]) {
//					var msg = '<dd class="' + (data.isSelf ? 'wbim_msgr' : 'wbim_msgl') + '">'
//							+ '<div class="wbim_msgpos"><div class="msg_time">' + data.time + '</div>'
//							+ '<div class="msg_box"><p class="txt">' + replaceFace(data.content) + '</p></div>'
//							+ '<div class="msg_arr"></div></div></dd>';
					
					if(data.isSelf){
						data.uname = $this.webim.userInfo.uname;
						data.uid = $this.webim.userInfo.uid;
					}
					dl.append(getChatContent(data));
					
					chatList.scrollTop(9999999);
				}
			})
			//显示多条消息
			.on("addMulMessage", function(e, data) {
				var dl = chatList.find("dl[uid=" + data.uid + "]");
				
				if(dl[0]) {
					var msg = "";
					for(var i=0; i < data.messages.length; i++) {
						var m = data.messages[i];
//						msg = '<dd class="' + (m.isSelf ? 'wbim_msgr' : 'wbim_msgl') + '">'
//						+ '<div class="wbim_msgpos"><div class="msg_time">' + getTimeFormat(m) + '</div>'
//						+ '<div class="msg_box"><p class="txt">' + replaceFace(m.content) + '</p></div>'
//						+ '<div class="msg_arr"></div></div></dd>' + msg;
						
						msg = getChatContent(m) + msg;
					}
					
					dl.append(msg);
					
					showWelcome(data.uid);
				}
			})
			.on("boxSetUserStatus", function(e, data){	// 用户在线状态改变
				var type = $this.webim.getUserStatusStyle(data);
				var user = friendList.find("li[uid=" + data.uid + "]");
				// 设置左侧列表的用户状态
				$this.webim.setUserStatusStyle(user, type);
				
				if($this.currentUser && $this.currentUser.uid == data.uid) {
					// 设置当前正在聊天的用户状态
					$this.webim.setUserStatusStyle(singleUser, type);
					// 显示当前聊天用户是否在线的提示
					
					if(type == "wbim_status_offline" || type == "wbim_status_busy") {
						$this.innerTrigger("showBoxTips", {content: L.userOfflineBusy});
					} else {
						$this.innerTrigger("hideBoxTips");
					}
				}
			})
			.on("showBoxTips", function(e, data) {
				chatTips.css("display", "block");
				chatTips.node("wbim_chat_tips_content").text(data.content);
			})
			.on("hideBoxTips", function(e){
				chatTips.css("display", "none");
				chatTips.node("wbim_chat_tips_content").empty();
			})
			.on("activeChatbox", function(e, data) {
				if($this.currentUser && $this.currentUser.uid == data.uid) return;
				
				var uli = friendList.find("li[uid=" + data.uid + "]");
				
				var i = 0;
				var timeout = function() {
					var t = setTimeout(function() {
						if(i%2 == 0) {
							uli.addClass("wbim_highlight");
						} else {
							uli.removeClass("wbim_highlight");
						}
						i++;
						if(i < 7) {
							timeout();
						}
					}, 500);
					uli.attr("data-timeout", t);
				};
				timeout();
			})
			.on("unactiveChatbox", function(e, data) {
				var uli = friendList.find("li[uid=" + data.uid + "]");
				uli.removeClass("wbim_highlight");
				
				var timeout = uli.attr("data-timeout");
				if(timeout) {
					clearTimeout(timeout);
				}
			})
			.on("showChatHistoryView", function(e, data) {
				var user = $this.getUser(data.uid);
				if(user) {
					historyView.node("wbim_history_tit_lf").text(L.historyLabel.replace(/%s/, user.uname));
					historyView.attr("data-current", user.uid);
					historyView.css("display", "block");
					$this.historyIsShow = true;
					
					var chatlist = historyList.find("div[uid="+user.uid+"]");
					if(!chatlist[0]) {
						var dl = '<div uid="' + user.uid + '" isload="false" class="wbim_chat_history_list wbim_chat_list"></div>';
						historyList.append(dl);
						chatlist = historyList.find("div[uid="+user.uid+"]");
					}
					
					historyList.find(".wbim_chat_history_list").css("display", "none");
					chatlist.css("display", "block");
					
//					if(chatlist.attr("isload") == "false") {
//						$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: user.uid, start: 0, size: $this.historySize});
//					} else {
//						refreshBtns();
//					}
					
					$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: user.uid, start: 0, size: $this.historySize});
					/*
					if(!data || data.s != E.DO_NOT_CONTROL) {
						$this.trigger(E.ON_SEND_CONTROL);
					}*/
				}
			})
			.on("hideChatHistoryView", function(e, data) {
				historyView.css("display", "none");
				if(!data || data.s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
				$this.historyIsShow = false;
			})
			.on("addChatHistoryMessage", function(e, data) {
				var uid = data.uid;
				var index = (data.start / data.size) + 1;
				var msgs = data.messages;
				
				if(!msgs || msgs.length<= 0) {
					showWelcome(uid);
					return;
				}
				
				var chatlist = historyList.find("div[uid="+uid+"]");
				var currentPage = chatlist.find("dl[data-index="+index+"]");
				
				var oldindex = parseInt(chatlist.attr("data-index"));
				
				chatlist.attr("data-index", index);
				chatlist.attr("data-count", data.count);
				chatlist.attr("data-max", data.max);
				
				var dl = '<dl data-index="' + index + '">';
				var msg = "";
				for(var i=0; i < msgs.length; i++) {
					var m = msgs[i];
//					msg = '<dd class="' + (m.isSelf ? 'wbim_msgr' : 'wbim_msgl') + '">'
//					+ '<div class="wbim_msgpos"><div class="msg_time">' + getTimeFormat(m) + '</div>'
//					+ '<div class="msg_box"><p class="txt">' + replaceFace(m.content) + '</p></div>'
//					+ '<div class="msg_arr"></div></div></dd>' + msg;
					
					msg = getChatContent(m) + msg;
				}
				dl += msg;
				dl += "</dl>";
				
				if(currentPage[0]) {
					currentPage.replaceWith(dl);
				} else {
					chatlist.append(dl);
					currentPage = chatlist.find("dl[data-index="+index+"]");
				}
				
				chatlist.attr("isload", "true");
		//		chatlist.find("dl").css("display", "none");
				currentPage.css("display", "block");
				
				refreshBtns();
				
				if(!oldindex) oldindex = -1;
				if(oldindex == -1 || oldindex < index){
					chatlist.scrollTop(9999999);
				}else{
					chatlist.scrollTop(0);
				}
					
				showWelcome(uid);
			});
			
			// 左侧用户列表点击
			friendList.click(function(e){
				var target = $(e.target);
				var nt = target.attr("node-type");
				// 是否点击的是关闭按钮
				if(nt == "wbim_icon_close_s") {
					var li = target.parent();
					var id = li.attr("uid");
					$this.removeUser(id, true);
					return;
				}
				// 切换正在聊天的用户
				var par = target.parents("li");
				if(par[0]) {
					var id = par.attr("uid");
					var user = $this.getUser(id);
					var user2 = $this.webim.getFriend(id);
					if(!user) user = user2;
					if(user && user2){
						user.uname = user2.uname;
						user.skill = user2.skill;
						user.icon = user2.icon;
					}
					$this.setCurrentUser(user);
				}
			});
			
			// 左侧用户列表上下箭头
			var friendbox = this.tag.node("wbim_chat_friend_box");
			chatLf.node("wbim_scrolltop").click(function(e) {
				var ph = friendbox.height();
				var h = friendList.height();
				var top = friendList.position().top;
				if(top < 0) {
					friendList.css("top", top + 32);
					friendList.css("height",h - 32);
				}
			});
			chatLf.node("wbim_scrollbtm").click(function(e) {
				var ph = friendbox.height();
				var h = friendList.height();
				var top = friendList.position().top;
				var length = friendList[0].children.length;
				if((h + top >= ph)&&(h<=420+(length-13-1)*32)) {
					friendList.css("top", top - 32);
					friendList.css("height",h + 32);
				}
			});
			
			// 检查用户输入的字符
			var checkInput = function(e) {
				var code = e.keyCode || e.which || e.charCode;
				var l = 200 - sendMsg.val().length;
				
				if(l > 0) {
					sendLength.text(l);
				} else {
					sendLength.html("<span style='color:red'>" + l + "</span>");
					
//					if(l <= -50) {
//						if(code > 31 && code < 127) {
//                            sendMsg.val(sendMsg.val().substring(0, 200));
//                        }
//					}
					
				}
				return true;
			};
			
			//发送按钮监听
			sendBtn.click(onSendMessage);
			
			
			// 监听输入消息时鼠标按下事件
			sendMsg.on("keydown", function(e) {
				var code = e.keyCode || e.which || e.charCode;
				if(code == 13) {
					if($this.sendKey == "entry" || e.ctrlKey) {
						onSendMessage();
						e.preventDefault();
						return false;
					}
				}
				return checkInput(e);
			}).keyup(function(e) {
				return checkInput(e);
			});
			
			// 选择发送快捷键
			var choosea = this.tag.node("wbim_btn_choose_a");
			var chooseItem = this.tag.node("wbim_btn_choose");
			choosea.on("click", function(e){
				chooseItem.css("display", "block");
				if(e.stopPropagation) e.stopPropagation();
				else e.cancelBubble = true;
			});
			$(document.body).on("click", function(e) {
				chooseItem.css("display", "none");
			});
			// 选择按entry键发送
			chooseItem.node("wbim_enter_send").on("click", function(e, s) {
				$this.sendKey = "entry";
				chooseItem.find("li.curr").removeClass("curr");
				chooseItem.node("wbim_enter_send_li").addClass("curr");
				if(s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			});
			// 选择按ctrl+entry键发送
			chooseItem.node("wbim_ctrlenter_send").on("click", function(e, s) {
				$this.sendKey = "entry+ctrl";
				chooseItem.find("li.curr").removeClass("curr");
				chooseItem.node("wbim_ctrlenter_send_li").addClass("curr");
				if(s != E.DO_NOT_CONTROL) {
					$this.trigger(E.ON_SEND_CONTROL);
				}
			});
			
			// 聊天窗口上方的提示信息关闭
			chatTips.node("wbim_icon_close_s").click(function(e) {
				$this.innerTrigger("hideBoxTips");
			});
			
			// 聊天表情
			var getImgInfo = function(aTag) {
				$aTag = $(aTag);
				var img = $aTag.find("img");
				if(!img[0]) return null;
				
				var obj = {
					img: img,
					url: img.attr("imgsrc"),
					title: $aTag.attr("title")
				};
				return obj;
			};
			var getImgInfoByTitle = function(t) {
				return getImgInfo(faceView.node("wbim_face_list").find("a[title='" + t + "']"));
			};
			
			// 表情替换
			var replaceFace = function(msg) {
				var rep = /\[[^\[]+\]/g;
				var arr = msg.match(rep);//rep.match(msg);
				if(!arr) return msg;
				for(var i=0; i<arr.length; i++) {
					var str = arr[i];
					var obj = getImgInfoByTitle(str);
					if(obj) {
						if(!obj.img.attr("src")) {
							obj.img.attr("src", WEB_IM_CONFIG.project_address + obj.url);
						}
						msg = msg.replace(str, obj.img[0].outerHTML);
					}
				}
				return msg;
			};
			
/*****************************************解析消息内容 开始*********************************************************/
			/**
			 * 解析聊天消息
			 * 对文件和图片进行特殊化处理
			 */
			var getChatContent = function(data){
				var chatContent = replaceFace(data.content);
				if(F.FILE_IMG_REP.test(chatContent)){//图片
					var id=getFileId(F.FILE_IMG_STR,chatContent);
					var name=getFileName(chatContent);
					var imgURL = WEB_IM_CONFIG.rc_url + "image?photo_id=" + id;//+ "&photo_size="
					var imgContent = "<div><p class='lr'><span class='picsbox_n'>"
					+	"<a>"
					+		"<img onload='imgLoadHandler(event)' style='width:120px' onclick='enlargeImgClick(event)' name='"+name+"' src='"+imgURL+"'/>"
					+	"</a>"
					+	"<i></i></span>"
					+"</p></div>";
					
					chatContent = properties.webimchatbox_share_pic;
					chatContent = getMsgView(F.FILE_IMG_STR,chatContent,imgContent,id,name);
				}else if(F.FILE_FILE_REP.test(chatContent)){//文件
					var id=getFileId(F.FILE_DOC_STR,chatContent);
					var name=getFileName(chatContent);
					var fileContent = "<span class='picsbox'><em class='wbim_icon_b_txt' title='"+properties.webimchatbox_file+"'/>"+properties.webimchatbox_share_file+"</span>"
					+"<span class='infos'>"+name+"<br>"+"</span><span class='pos'>"
					+(data.isSelf ? "" : "<a href='"+WEB_IM_CONFIG.rc_url+"doc?doc_id="+id+"' target='_blank'>"+properties.webimchatbox_download+"</a>")+"</span>";
					
					chatContent = properties.webimchatbox_share_file + (data.isSelf?"":properties.webimchatbox_downloadview);
					chatContent = getMsgView(F.FILE_DOC_STR,chatContent,fileContent,id,name);
				}else if(F.FILE_IMG_RES.test(chatContent)){//新版资源中心图片
					var path=getFileId("file-start&type=image&path=",chatContent);
					var name=getFileName(chatContent);
					var imgContent = "<div><p class='lr'><span class='picsbox_n'>"
					+	"<a>"
					+		"<img onload='imgLoadHandler(event)' style='width:120px' onclick='enlargeImgClick(event)' name='"+name+"' src='"+path+"'/>"
					+	"</a>"
					+	"<i></i></span>"
					+"</p></div>";
					chatContent = properties.webimchatbox_share_pic;
					chatContent = getMsgView("file-start&type=image&path=",chatContent,imgContent,path,name);
				}else if(F.FILE_FILE_RES.test(chatContent)){//新版资源中心文件
					var path=getFileId("file-start&type=doc&path=",chatContent);
					var name=getFileName(chatContent);
					var fileContent = "<span class='picsbox'><em class='wbim_icon_b_txt' title='"+properties.webimchatbox_file+"'/>"+properties.webimchatbox_share_file+"</span>"
						+"<span class='infos'>"+name+"<br>"+"</span><span class='pos'>"
						+(data.isSelf ? "" : "<a href='"+path+"' target='_blank'>"+properties.webimchatbox_download+"</a>")+"</span>";
					chatContent = properties.webimchatbox_share_file + (data.isSelf?"":properties.webimchatbox_downloadview);
					chatContent = getMsgView("file-start&type=doc&path=",chatContent,fileContent,path,name);
				}
				
				//发送者昵称和时间
				var uname0 = data.uname + (WEB_IM_CONFIG.appendUId?"("+data.uid+")":"");
				var chatUserName = '<div class="' + (data.isSelf?"self_name":"other_name") + '">' + 
				(WEB_IM_CONFIG.showUserName?(uname0 +"&nbsp;&nbsp;"):"") + data.date + "&nbsp;" + data.time + '</div>';
				//wbim_msgr
				return '<dd id="'+data.dd_id+'" class="' + (data.isSelf ? 'wbim_msgl' : 'wbim_msgl') + '">'
				+ '<div class="wbim_msgpos">' + chatUserName
				+ '<div class="msg_box">'+hasUrl(chatContent)+'</div>'
				+ '<div class="msg_arr"></div></div></dd>';
				
				//航购网聊天内容增加气泡样式
			/*	return '<dd id="'+data.dd_id+'" class="' + (data.isSelf ? 'wbim_msgl wbim_msgl_my' : 'wbim_msgl') + '">'
				+ '<div class="wbim_msgpos">' + chatUserName
				+ (data.isSelf ? '<div class="msg_box msg_box_qp msg_box_my">' : '<div class="msg_box msg_box_qp msg_box_other">')+hasUrl(chatContent)+'</div>'
				+ '<div class="msg_arr"></div></div></dd>';*/

				
			};
			
			var getFileNameStr = function(name,type,isSelf){
			     return "#"+(isSelf?properties.webimchatbox_share:"")+type+":"+name;
			};
			
			
			//字符串中如果包含链接，加上<a>标签
			var hasUrl = function(content){
				var reg = /(^|[^"'(=])((http|https|ftp)\:\/\/[\.\-\_\/a-zA-Z0-9\~\?\%\#\=\@\:\&\;\*\+]+\b[\?\#\/\*]*)/g;
				var re = new RegExp(reg);
				return content.replace(re, "<a target=\"_blank\" href=\" $& \"> $& </a>");
			};
			
			
			/**
			 * 生成显示的消息内容的样式
			 * @param fileStr:文件开头标示(图像或者文件)
			 * @param fileHtml:上传的文件html
			 * @param chatContent:消息内容
			 * @param id:文件id
			 * @param name:文件名
			 */
			var getMsgView = function(fileStr,chatContent,fileHtml,id,name){
//				chatContent = chatContent.replace(fileStr+id+F.FILE_NAME_STR+name+F.FILE_END_STR,"");
				chatContent = "<p class='txt'>"+chatContent+"</p>"
				   + "<p class='line'/>"
				   + "<p class='lr' node-key='" +new Date().getTime()+ "'>"
				   + fileHtml
				   + "</p>";
				return chatContent;
			};
			
			/**
			 * 计算上传的文件的id
			 */
			var getFileId = function(idStr,str){
				return str.substring(str.indexOf(idStr)+idStr.length,str.indexOf(F.FILE_NAME_STR));
			};
			
			/**
			 * 计算上传的文件的名称
			 */
			var getFileName = function(str){
				return str.substring(str.indexOf(F.FILE_NAME_STR)+F.FILE_NAME_STR.length,str.indexOf(F.FILE_END_STR));
			};
			
			/*****************************************解析消息内容 完毕*********************************************************/
			
			
			//
			this.tag.node("wbim_icon_face").click(function(e) {
				faceView.css("display", "block");
				$.each(faceATag, function(i, aTag) {
					var obj = getImgInfo(aTag);
					if(!obj.img.attr("src")) {
						obj.img.attr("src", WEB_IM_CONFIG.project_address + obj.url);
					}
				});
			});
			faceView.node("wbim_icon_face_close").click(function(e) {
				faceView.css("display", "none");
			});
			
			// 聊天表情点击
			faceATag.click(function(e) {
				var obj = getImgInfo(e.currentTarget);
				if(obj) {
					sendMsg.focus();
					insertStrToTextarea(sendMsg[0], obj.title);
				}
			});
			
			var spetxt = this.tag.node("spetxt");
			//发送之后，隐藏快捷回复框
			sendMsg.focus(function(e) {
				faceView.css("display", "none");
				quickView.css("display", "none");
				
				if($.trim(sendMsg.val())){
				    sendLength.val(200 - sendMsg.val().length);
				}
			});
			
			// 常用语（快捷回复）点击
			quickBtn.click(function(e) {
				var data = {
					type : "3601",
					user_id : $this.webim.userInfo.uid
				};
				$.ajax({
					url : WEB_IM_CONFIG.imUrL + "sendOperate",
					data : {
						data : JSON.stringify(data)
					},
					dataType : WEB_IM_CONFIG.ajaxDataType,
					jsonp : WEB_IM_CONFIG.ajaxJsonp,
					type : "post",
					error : function(XMLHttpRequest, textStatus, errorThrown) {

					},
					success : function(data) {
						if (!data) {
							return;
						}
						if (typeof (data) === "string") {
							data = JSON.parse(data);
						}
						if (data.usualList) {
							var dataList = data.usualList;
							var innerContent = "<ul>";
							for ( var i = 0; i < dataList.length; i++) {
								innerContent += "<li><a>" + dataList[i].CONTENT + "</a></li>";
							}
							innerContent += "</ul>";
							$(".wbim_quick_con").html(innerContent);
							quickView.node("wbim_quick_con").find("ul a").click(function(e) {
								var txt = $(e.currentTarget).text();
								quickView.css("display", "none");
								onSendMessage(e, txt);
							});
						}
					}
				});
				quickView.css("display", "block");
			});
			quickView.node("wbim_icon_quick_close").click(function(e) {
				quickView.css("display", "none");
			});
			
			
			//订单查询
			/*quickSearch.click(function(e){
				window.open(WEB_IM_CONFIG.order_search);
			});*/
			
			// 打分邀请点击
			pingBtn.click(function(e) {
				// 自己是客服时
				if($this.webim.isService($this.webim.userInfo.skill)){
					$this.webim.sendServiceAppraise($this.currentUser.uid);
				}
			});
			var pingView = this.tag.node("wbim_ping_box");
			pingView.node("wbim_icon_ping_close").click(function(e) {
				$this.hidePingView();
			});
			
			// 聊天记录按钮点击
			historyBtn.click(function(e) {
//				alert("点击聊天记录！");
				$this.innerTrigger("showChatHistoryView", {uid: $this.currentUser.uid});
			});
			historyView.node("wbim_icon_history_close").click(function(e) {
				$this.innerTrigger("hideChatHistoryView");
			});
			
			// 聊天记录分页请求
			var requestPage = function(isNext, i) {
				var uid = historyView.attr("data-current");
				var chatlist = historyList.find("div[uid="+uid+"]");
				var index = parseInt(chatlist.attr("data-index"));
				var count = parseInt(chatlist.attr("data-count"));
				
				var p = count - i + 1;
				if(!p){
					p = isNext ? index + 1 : index - 1;
				}	
				
				if(p == index) return;
				
				if(p > 0 && p <= count) {
					var page = chatlist.find("dl[data-index="+p+"]");
					if(page[0]) {
						chatlist.find("dl").css("display", "none");
						page.css("display", "block");
						
						var oldindex = parseInt(chatlist.attr("data-index"));
						chatlist.attr("data-index", p);
						refreshBtns();
						
						if(!oldindex) oldindex = -1;
						if(oldindex == -1 || oldindex < p)
							chatlist.scrollTop(9999999);
						else
							chatlist.scrollTop(0);
					} else {
						$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: uid, start: (p-1)*$this.historySize, size: $this.historySize});
					}
				}
			};
			// 聊天记录刷新底部按钮
			var refreshBtns = function() {
				var uid = historyView.attr("data-current");
				var chatlist = historyList.find("div[uid="+uid+"]");
				var index = parseInt(chatlist.attr("data-index"));
				var count = parseInt(chatlist.attr("data-count"));
				
				historyMax.text(count);
				historyII.val(count - index + 1);
				historyPrev.css("visibility", index <= 1 ? "hidden" : "visible");
				historyNext.css("visibility", index >= count ? "hidden" : "visible");
			};
			// 上一页（实际处理为下一页）
			historyNext.click(function(e) {
				requestPage(true);
			});
			// 下一页（实际处理为上一页）
			historyPrev.click(function(e) {
				requestPage(false);
			});
			historyII.change(function(e) {
				var i = parseInt(historyII.val());
				if(i)requestPage(false, i);
			});
			//确定，进行请求聊天记录
			historyIIBtn.click(function(e){
			     var i = parseInt(historyII.val());
                 if(i)requestPage(false, i);
			});
			
			// 聊天记录刷新
			historyRefresh.click(function(e) {
				var uid = historyView.attr("data-current");
				var chatlist = historyList.find("div[uid="+uid+"]");
				chatlist.empty();
				
				$this.trigger(E.GET_CHAT_INFO, {isHistory: true, uid: uid, start: 0, size: $this.historySize});
			});
		},
		
		createView: function() {
			var $this = this;
			
			// 自己是客服时
			if($this.webim.isService($this.webim.userInfo.skill)){
				this.tag.node("wbim_icon_ping").css("display", "block");
				this.tag.node("wbim_icon_quick").css("display", "block");
				/*this.tag.node("wbim_icon_chaxun").css("display", "block");*/
			}
		},
		
		/**
		 * 显示聊天窗口
		 */
		showIMChatBox: function(s) {
			this.tag.css("display", "block");
			this.isOpen = true;
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
			
			var chatList = this.tag.node("wbim_chat_list");
			chatList.scrollTop(9999999);
		},
		/**
		 * 隐藏聊天窗口
		 */
		hideIMChatBox: function(s) {
			this.tag.css("display", "none");
			this.isOpen = false;
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
				this.trigger(E.HIDE_CHATBOX);
			}
		},
		
		/**
		 * 显示给客服评分框
		 */
		showPingView: function(uid, s) {
			var user = this.getUser(uid);
			if(user) {
				var pingView = this.tag.node("wbim_ping_box");
				pingView.attr("uid", user.uid);
				//pingView.node("wbim_ping_tit_lf").text(L.pingServiceLabel.replace(/%s/, user.uname));
				pingView.node("wbim_ping_tit_lf").text(L.pingServiceLabel.replace(/%s/, ""));
				
				pingView.css("display", "block");
				if(s != E.DO_NOT_CONTROL) {
					this.trigger(E.ON_SEND_CONTROL);
				}
			}
		},
		
		/**
		 * 隐藏给客服评分框
		 */
		hidePingView: function(s) {
			this.tag.node("wbim_ping_box").css("display", "none");
			if(s != E.DO_NOT_CONTROL) {
				this.trigger(E.ON_SEND_CONTROL);
			}
		},
		isGroupWay:function(obj){
			return (obj.way == "group");
		},
		/**
		 * 增加聊天用户，打开用户窗体
		 * @param id
		 */
		addUser: function(user, setuser, s) {
//			if(typeof(user) == "string") {
//				user = this.webim.getFriend(user.uid);
//				if(!user)
//					user = {uid: user.uid, uname: L.noneNickName, isfriend: "false"};
//				else
//					user.isfriend = "true";
//			} else {
				var tmpuser = this.webim.getFriend(user.uid);
				if(tmpuser && (!this.isGroupWay(user))) {
					user.uname = tmpuser.uname;
					user.icon = tmpuser.icon;
					user.status = tmpuser.status;
					user.isfriend = "true";
				} else {
					user.isfriend = "false";
				}
				
//			}
			
			if(user) {
				user.s = s;
				if(!this.getUser(user.uid)) {
					this.users.push(user);
					this.innerTrigger("addUser", user);
				}
				if(setuser)
					this.setCurrentUser(user);
				
				//用户窗体列表
				if(this.users.length > 1) {
					this.innerTrigger("showUserList");
				}
				
				//设置侧边栏信息
				var $this = this;
				if(WEB_IM_CONFIG.showSideBar == 0){ //隐藏侧边栏
					$('#wbim_chat_box').find('div[class="im-right-sidebar"]').css("display", "none");
				} else if(WEB_IM_CONFIG.showSideBar == 1){ //默认侧边栏
					IM.call("2510", {
							itemId: user.itemId,
							vendId: user.vendId,
							uid: user.uid,
							uname: user.uname,
							skill: "" + $this.webim.getDefaultSkill(user.skill)
						},
						$this.webim.setSideBar,
						$this.webim
					);
				} else if(WEB_IM_CONFIG.showSideBar == 2){ //自定义侧边栏
					$this.webim.setSideBarNew(user.uid);
				}
			}
		},
		/**
		 * 移除聊天用户
		 * @param id
		 */
		removeUser: function(id, setuser, s) {
			var user = null;
			for(var i=0; i < this.users.length; i++) {
				var f = this.users[i];
				if(f.uid == id) {
					user = f;
					user.s = s;
					this.users.splice(i, 1);
					this.innerTrigger("removeUser", f);
					break;
				}
			}
			
			if(this.users.length == 0) {
				// 已没有聊天用户，关闭聊天窗口
				this.innerTrigger("hideUserList");
				this.tag.node("wbim_history_box").css("display", "none");
				this.historyIsShow = false;
				
				if(setuser) {
					this.setCurrentUser(null);
					this.trigger(E.CLOSE_CHATBOX);
				}
			} else if(this.currentUser && this.currentUser.uid == id) {
				// 当前聊天用户设为第一个用户
				if(setuser) {
					this.setCurrentUser(this.users[0]);
				}
			}
		},
		/**
		 * 检测是否跟某用户聊天
		 * @param id
		 * @returns {Boolean}
		 */
		getUser: function(id, list) {
			var l = list;
			if(!l) l = this.users;
			for(var i=0; i < l.length; i++) {
				var f = l[i];
				if(f.uid == id) {
					return f;
				}
			}
			return null;
		},
		/**
		 * 设置当前聊天用户
		 * @param user
		 */
		setCurrentUser: function(user, s) {
			if(!this.currentUser && !user) return;
			if(this.currentUser && user && this.currentUser.uid == user.uid) return;
			
			this.currentUser = user;
			if(user)
				user.s = s;
			this.innerTrigger("setCurrentUser", user);
			
			if(this.historyIsShow && user) {
				this.innerTrigger("showChatHistoryView", {uid: user.uid});
			}
			
			this.trigger(E.CURRENT_USER, user);
		},
		
		/**
		 * 获取当前界面的显示状态
		 * @returns {___data0}
		 */
		getViewStatus: function() {
			var data = new Object();
			var str = "";
			for(var i=0; i < this.users.length; i++) {
				var user = this.users[i];
				str += user.uid + "|" + user.uname + "|" + user.skill + "|" + user.status;
				if(user.isfriend == "false") {
					str += "|" + user.icon; 
				}
				str += ",";
			}
			data.users = str;
			if(this.currentUser)
				data.current = this.currentUser.uid;
			data.sendKey = this.sendKey;
			data.isOpen = this.isOpen;
			var pingView = this.tag.node("wbim_ping_box");
			data.ping = {uid: pingView.attr("uid"), pingcss: pingView.css("display")};
			return data;
		},
		
		/**
		 * 设置当前界面的显示状态
		 * @param data
		 */
		setViewStatus: function(data) {
			
			if(data.ping){
				if(data.ping.pingcss == "block")
					this.showPingView(data.ping.uid, E.DO_NOT_CONTROL);
				else
					this.hidePingView(E.DO_NOT_CONTROL);
			}
			
			var ids = data.users.split(",");
			var arr = new Array();
			var current;
			for(var i=0; i<ids.length; i++) {
				if(!ids[i]) continue;
				
				var tmpu = ids[i].split("|");
				var user = this.webim.getFriend(tmpu[0]);
				if(!user)
					user = {uid:tmpu[0], uname:tmpu[1], skill:tmpu[2], status: tmpu[3], icon: tmpu[4]};
				else {
					if(tmpu.length > 2 && tmpu[2]) {
						user.skill = tmpu[2];
					}
				}
				
				this.addUser(user, false, E.DO_NOT_CONTROL);
				arr.push(user);
				
				if(user.uid == data.current)
					current = user;
			}
			for(var i=0; i<this.users.length; i++) {
				var u = this.users[i];
				if(!this.getUser(u.uid, arr)) {
					this.removeUser(u.uid, false, E.DO_NOT_CONTROL);
				}
			}
			
			this.setCurrentUser(current, E.DO_NOT_CONTROL);
			
			if(data.isOpen)
				this.showIMChatBox(E.DO_NOT_CONTROL);
			else
				this.hideIMChatBox(E.DO_NOT_CONTROL);
			
			if(data.sendKey != this.sendKey) {
				var chooseItem = this.tag.node("wbim_btn_choose");
				if(data.sendKey == "entry")
					chooseItem.node("wbim_enter_send").trigger("click", E.DO_NOT_CONTROL);
				else
					chooseItem.node("wbim_ctrlenter_send").trigger("click", E.DO_NOT_CONTROL);
			}
		},
		
		getHasMessage: function() {
			var friendList = this.tag.node("wbim_chat_friend_list");
			var uli = friendList.find("li.wbim_highlight");
			return uli.length > 0;
		},
		
		/**
		 * 测试版提示标题
		 */
		createTextVersionTitle:function(){
			if(WEB_IM_CONFIG.testVersionTitle){
			     var str = "<div class='wbim_tit_lf'><p style='padding-top:4px'/>" +WEB_IM_CONFIG.testVersionTitle+ "</p></div>";
                 $("#wbim_titin_id").append($(str));
			}
		},
		
		createRefreshBtn:function(){
		    //var titin = this.tag.node("wbim_titin");
		    //$("#wbim_titin_id").append("<div class='wbim_icon_tips'></div>");
		},
		
		/**
		 * 监听外部事件
		 */
		listener: function() {
			var $this = this;
			this.ptag.on(E.OPEN_CHATBOX, function(e, data) {
				
				//机器人
				if(data && $this.webim.isRobot(data.skill)){
					$this.webim.openRobotBox(data);
				    return;
				}
				
				if(data) {
					var b = data.isShow;
					if(b !== "false") b = true;
					$this.addUser(data, b);
				} else {
					if(!$this.currentUser && $this.users && $this.users.length > 0) {
						$this.setCurrentUser($this.users[0]);
					}
				}
				if($this.users && $this.users.length > 0) {
					$this.showIMChatBox();
				}
			}).on(E.CLOSE_CHATBOX, function(e, data) {
				if(data) {
					$this.removeUser(data.uid, true);
				} else {
					$this.hideIMChatBox();
					$this.trigger(E.HIDE_CHATBOX);
				}
			}).on(E.ADD_CHAT_USER, function(e, data) {
				$this.addUser(data, data.isShow);
			}).on(E.SET_USER_STATUS, function(e, data) {
				$this.innerTrigger("boxSetUserStatus", data);
			}).on(E.ON_ACCEPT_MESSAGE, function(e, data) {
				if(!$this.getUser(data.uid)) {
					$this.addUser(data);
				} else {
					$this.innerTrigger("addMessage", data);
				}
			}).on(E.HAS_MESSAGE, function(e, data) {
				$this.innerTrigger("activeChatbox", data);
			}).on(E.ADD_MULMESSAGE, function(e, data) {
				$this.innerTrigger("addMulMessage", data);
			}).on(E.ADD_HISTORYMESSAGE, function(e, data) {
				$this.innerTrigger("addChatHistoryMessage", data);
			});
		},
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		},
		
		
		/**
		 * 加载文件上传swf
		 */
		createFileUpLoad:function(){
			//不显示图片和文件
			if(!WEB_IM_CONFIG.sendImg){
				this.tag.node("wbim_icon_img").css("display","none");
				this.tag.node("wbim_icon_doc").css("display","none");
				return;
			}
			//创建文件上传div(注意：需要创建两个div，里面的那个被swf覆盖掉)
			var div = $("<div id='imgUpLoadDiv' class='fileUpLoadOfFlash'/>");
			div.append($("<div id='imgUpLoad'>"));
			$(".wbim_chat_rt").append(div);
			//swf参数
			var lparams = {
				allowfullscreen:"true",
				allowscriptaccess:"always",
				wmode:"transparent",
//				wmode:"opaque",
				quality:"high",
				scale:"noScale",
				menu:"false"
			};
			
			//参数
			var flashVars = new Object();
			flashVars.uid = this.webim.userInfo.uid;//用户id
			flashVars.fileUpError = "fileUpError";//上传失败回调
			
			flashVars.url = Channel_CONFIG.rc_url + "upload";//资源中心地址
			if(flashVars.url.indexOf("DocCenterService")>-1){//老版资源中心
				flashVars.swfUrl = WEB_IM_CONFIG.project_address + "images/imgUpLoad.swf";
				flashVars.fileUpComplete = "fileUpComplete";//上传成功回调
			}else{//新版资源中心
				flashVars.swfUrl = WEB_IM_CONFIG.project_address+"newimgupload/imgUpLoad.swf";
				flashVars.url =  Channel_CONFIG.rc_url;
				flashVars.dir ="im";
				flashVars.fileUpComplete = "fileUpCompleteNew";//上传成功回调
			}
			swfobject.embedSWF(flashVars.swfUrl, 
					"imgUpLoad", "96px", "20px", "9.0.124", 
					null, flashVars, lparams,{id:"IMG_UP_LOAD",name:"IMG_UP_LOAD"});
			//注册事件
			//删除上传的文件
			$("#deleteFileId").click(function(){
				setFileUpTool("none");
			});
			
			
			// 设置swf全局变量，用于方法回调
			upImgSwf = $("#IMG_UP_LOAD")[0];
			return;
			if(typeof upImgSwf == "undefined") {
				var tip = [];
				tip.push("<p>"+properties.webimchatbox_nofound_swf+"</p>");
				tip.push("<p><a href='http://get.adobe.com/cn/flashplayer/'>http://get.adobe.com/cn/flashplayer/</a></p>");
				tip.push("<p>"+properties.webimchatbox_nouse_flash+"</p>");
				alert(tip.join(""));
			}
		}
	};
})(jQuery);



/**
 * 文件上传过程中
 */
function fileUpLoading(){
	$(".wbim_icon_s_photo").css("display","none");//文件默认图片
	$(".icon_ing").css("display","block");
	$(".wbim_chat_input_tips").css("display","block");
	
	$("#webimBtnSendDivId").removeClass("wbim_btn_send");
	$("#webimBtnSendDivId").addClass("wbim_btn_send wbim_btn_send_disable");
	$("#upFileNameId").html(properties.webimchatbox_uploading+"...");
	$("#webimBtnSendId").attr("disabled", true);
//	setFileUpToolCSS("none","上传中...");
}


/**
 * 文件上传成功
 * @param file:上传的文件对象
 */
function fileUpComplete(file){
//	alert("上传的图片名称:"+file.name+",服务器返回的id:"+file.id);
	setFileUpTool("block",file.name);
	var data = F.FILE_START_STR + "&type=" + file.type + "&id=" + file.id + "&name=" + file.name + F.FILE_END_STR;
	$("#fileUpTextId").val(data);
}

function fileUpCompleteNew(file){
	setFileUpTool("block",file.name);
	var data = F.FILE_START_STR+"&type="+ file.type + "&path="+file.path+"&name="+ file.name + F.FILE_END_STR;
	$("#fileUpTextId").val(data);
}

/**
 * 文件上传出错
 * @param msg
 */
function fileUpError(msg){
	showAlert(msg,properties.webimchatbox_prompt,true);
	setFileUpTool("none");
}

/**
 * 提供给外部的设置文件上传的一栏css设置
 * @param disp
 */
function setFileUpToolCSS(disp){
	$(".wbim_icon_s_photo").css("display",disp);//文件默认图片
	$("#upFileNameId").html("");//文件名
	$("#fileUpTextId").val("");//清空存储文件路径的隐藏框
//	$("#vdiskId").css("display",disp);//查看微盘
	$("#deleteFileId").css("display",disp);//删除
	$(".icon_ing").css("display","none");//进度条
}

/**
 * 图片加载完毕修改滚动条
 * @param {} event
 */
function imgLoadHandler(event){
	 $(".wbim_chat_list").scrollTop(9999999);
}

/**
 * 点击图片进行放大
 * @param event 点击的图片
 */
function enlargeImgClick(event){
	 event = (window.event || event);
	 var srcEle = (event.target || event.srcElement);
	 //名字
	 $("#wbim_ptit_id").html(srcEle.name);
	 //加载原图
	 /*alert(srcEle.src.lastIndexOf("&"));
	 var src = srcEle.src.substring(0,srcEle.src.lastIndexOf("&"));*/
	 var src = srcEle.src;
	 var img = $("<img src='" + src +"'>");
	 img.on("load",scaleImgLoadHandler);
	 
	 //添加
	 $(".wbim_pic_zone").empty();
	 $(".wbim_pic_zone").append(img);
	 $(".wbim_pic_zone").css("display","block");
	 $(".wbim_picview_box").css("display","block"); 
};

/**
 * 放大的图片加载完毕
 */
function scaleImgLoadHandler(){
	$(this).off("load",scaleImgLoadHandler);
	var width = this.width;
	var height = this.height;
	
	if(width > 900 || height > 500){
		width = 900;
		height = 500;
		$(".wbim_picview_box").css("top", "-50px");
	} else {
		if(width < 500 || height > 300){
			width = 500;
			height = 300;
		}
		$(".wbim_picview_box").css("top", "0px");
	}
	
	$(".wbim_picview_box").width(width + "px");
	$(".wbim_picview_box").height(height + 26 + "px");
	$(".wbim_pic_zone").width(width + "px");
	$(".wbim_pic_zone").height(height + "px");
	$(".wbim_picview_box").css("right", (document.body.clientWidth - width) / 2 + "px");
	
	//设置图片的位置
	var imgLeft = (width - this.width) / 2;
	var imgTop = (height - this.height) / 2;
	$(this).css("left", imgLeft < 0 ? 0 : imgLeft);
	$(this).css("top", imgTop > 0 ? imgTop : 0);
}


/**
 * 点击关闭图片缩放的界面
 */
function closeImgZone(){
	$(".wbim_pic_zone").empty();
	$(".wbim_picview_box").css("display","none"); 
}

/**
 * 统一设置文件上传工具条
 * @param disp：工具条显示与否
 * @param fileName:上传的文件名
 */
function setFileUpTool(disp,fileName){
	if(!fileName)fileName="";
	setFileUpToolCSS(disp,fileName);
	$("#upFileNameId").html(fileName);//文件名
	
	$("#webimBtnSendId").removeAttr("disabled");
	$("#webimBtnSendDivId").removeClass("wbim_btn_send wbim_btn_send_disable");
	$("#webimBtnSendDivId").addClass("wbim_btn_send");
	
	try{
		if(upImgSwf){
			if(disp=="block"){//文件上传后显示“删除”按钮，并屏蔽鼠标事件
				$(".wbim_chat_input_tips").css("display","block");
				upImgSwf.btnUnEnable();
			}else{
				$(".wbim_chat_input_tips").css("display","none");
				upImgSwf.btnEnable();
			}
		}
	}catch(e){}
}var WebIMBar = function() {
	
};

(function( $ ) {
	/**
	 * 最小化的聊天状态栏
	 */
	WebIMBar.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		isOpen: false,
		settimeout: 0,
		systimeout: 0,
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			var $this = this;
			this.webim = webim;
			this.ptag = this.webim.tag;
			this.tag = this.ptag.node("wbim_min_box_col");
			
			this.listenerTagEvent();
			this.listener();
		},
		/**
		 * 监听内部事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			// 监听打开聊天窗口事件
			this.tag.node("wbim_min_chat").click(function(e) {
				$this.trigger(E.OPEN_CHATBOX);
			});
			// 监听好友列表窗口事件
			this.tag.node("wbim_min_friend").click(function(e){
				$this.trigger(E.OPEN_LIST);
			});
			
			this.tag.node("wbim_sys_btn").click(function(e) {
				$this.trigger(E.CHANGE_SYSTEM_MESSAGE);
				return false;
			});
			this.tag.node("wbim_sys_btncon").click(function(e) {
				return false;
			});
		},
		/**
		 * 获取当前界面的显示状态
		 * @returns {___data0}
		 */
		getViewStatus: function() {
			var data = new Object();
			data.isOpen = this.isOpen;
			return data;
		},
		/**
		 * 设置当前界面的显示状态
		 * @param data
		 */
		setViewStatus: function(data) {
			if(!data.isOpen) {
				this.tag.removeClass("wbim_min_box_col3");
				this.tag.addClass("wbim_min_box_col2");
			} else {
				this.tag.removeClass("wbim_min_box_col2");
				this.tag.addClass("wbim_min_box_col3");
			}
		},
		showMinBox: function(b) {
			this.tag.removeClass("wbim_min_box_col2");
			this.tag.addClass("wbim_min_box_col3");
			this.isOpen = true;
			if(b) {
				this.unactiveMinBox();
			}
		},
		hideMinBox: function() {
			this.tag.removeClass("wbim_min_box_col3");
			this.tag.addClass("wbim_min_box_col2");
			this.isOpen = false;
		},
		activeMinBox: function() {
			var $this = this;
			
			if($this.webim && $this.webim.imChatbox && $this.webim.imChatbox.isOpen){
				return;
			}
			
			$this.tag.node("wbim_min_tipbar").html(L.hasMessageLabel);
			var minchat = $this.tag.node("wbim_min_chat");
			
			var i = 0;
			var timeout = function() {
				$this.settimeout = setTimeout(function() {
					if(i%2 == 0) {
						minchat.addClass("wbim_min_chat_msg");
					} else {
						minchat.removeClass("wbim_min_chat_msg");
					}
					i++;
					if(i < 7) {
						timeout();
					}
				}, 500);
			};
			timeout();
			
			this.tag.node("wbim_min_tipbar").css("display", "inline");
			this.tag.node("wbim_min_chatuserbar").css("display", "none");
		},
		unactiveMinBox: function() {
			var minchat = this.tag.node("wbim_min_chat");
			minchat.removeClass("wbim_min_chat_msg");
			clearTimeout(this.settimeout);
			
			this.tag.node("wbim_min_tipbar").css("display", "none");
			this.tag.node("wbim_min_chatuserbar").css("display", "inline");
		},
		activeSysIcon: function() {
			var $this = this;
			if(this.systimeout != 0) return;
			var sysbtn = this.tag.node("wbim_btn_sysmsg");
			var i = 0;
			var timeout = function() {
				$this.systimeout = setTimeout(function() {
					if(i%2 == 0) {
						sysbtn.css("visibility", "visible");
					} else {
						sysbtn.css("visibility", "hidden");
					}
					
					timeout();
				}, 500);
				i++;
			};
			timeout();
		},
		unactiveSysIcon: function() {
			var sysbtn = this.tag.node("wbim_btn_sysmsg");
			sysbtn.css("visibility", "visible");
			clearTimeout(this.systimeout);
			this.systimeout = 0;
		},
		/**
		 * 监听外部事件
		 */
		listener: function() {
			var $this = this;
			this.ptag.on(E.OPEN_CHATBOX, function(e, data) {
				if(data && $this.webim.isRobot(data.skill))return;
				$this.showMinBox(true);
			}).on(E.HIDE_CHATBOX, function(e, data) {
				if(!$this.webim.imChatbox.getHasMessage()) {
					$this.unactiveMinBox();
				}
			}).on(E.CLOSE_CHATBOX, function(e, data) {
				$this.hideMinBox();
			}).on(E.CURRENT_USER, function(e, data) {
				if(data) {
					$this.tag.node("wbim_min_nick").text(data.uname);
				}
			}).on(E.SELF_STATUS_CHANGE, function(e, data) {
				var box = $this.tag.node("wbim_statusbox");
				box.empty();
				box.append('<span class="' + data.cla + '" style="float:left;"></span>');
			}).on(E.ONLINES, function(e, data) {
				var n = $this.tag.node("wbim_online_count");
				n.text(data.on + "/" + data.all);
			}).on(E.HAS_MESSAGE, function(e, data) {
				$this.showMinBox();
				$this.activeMinBox();
			}).on(E.SHOW_SYSTEM_TIP, function(e) {
				$this.activeSysIcon();
			}).on(E.CANCEL_SYSTEM_TIP, function(e) {
				$this.unactiveSysIcon();
			});
		},
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		}
	};
	
})(jQuery);var WebIMSystemMessage = function() {
	
};

(function( $ ) {
	/**
	 * 聊天窗口界面操作
	 */
	WebIMSystemMessage.prototype = {
		tag: null,
		webim: null,
		ptag: null,
		isShow: false,
		/**
		 * 初始化
		 * @param webim
		 */
		init: function(webim) {
			var $this = this;
			this.webim = webim;
			this.ptag = this.webim.tag;
			this.tag = this.ptag.node("wbim_sys_msg");
			
			this.listenerTagEvent();
			this.listener();
		},
		/**
		 * 监听内部处理事件
		 */
		listenerTagEvent: function() {
			var $this = this;
			
			$this.tag.node("wbim_icon_sys_close").click(function(e) {
				$this.hideSystemMessage();
			});
		},
		addSystemMessage: function(data) {
			//系统提示框
			var sysList = this.tag.node("wbim_sys_con");
			var sysDl = this.tag.node("wbim_sys_dl");
			var msg = '<dd class="wbim_sysmsgl">'
			+ '<div class="msg_box"><p class="txt">' + data.msg + '</p></div>'
			+ '</dd>';
			sysDl.append(msg);
			sysList.scrollTop(9999999);
			
			//闪动的喇叭
			if(!this.isShow) {
				this.trigger(E.SHOW_SYSTEM_TIP);
			}
		},
		
		showSystemMessage: function() {
			this.tag.css("display", "block");
			this.isShow = true;
			var sysList = this.tag.node("wbim_sys_con");
			sysList.scrollTop(9999999);
			
			this.trigger(E.CANCEL_SYSTEM_TIP);
		},
		hideSystemMessage: function() {
			this.tag.css("display", "none");
			this.isShow = false;
		},
		
		listener : function() {
			var $this = this;
			$this.ptag.on(E.OPEN_SYSTEM_MESSAGE, function(e, data) {
				$this.showSystemMessage();
			}).on(E.CLOSE_SYSTEM_MESSAGE, function(e, data) {
				$this.hideSystemMessage();
			}).on(E.CHANGE_SYSTEM_MESSAGE, function(e) {
				if($this.isShow) {
					$this.hideSystemMessage();
				} else {
					$this.showSystemMessage();
				}
			});
		},
		trigger: function(type, data) {
			this.ptag.trigger(type, data);
		},
		innerTrigger: function(type, data) {
			this.tag.trigger(type, data);
		}
	};
})(jQuery);/**
 * 用户界面逻辑代理代码
 * 
 */
function createWebIM(callback) {
	var webim = WebIM.newInstance();

	var serviceInfo = null;

	var get_userinfo_success = false;// 获取用户基本信息成功
	var socket_connec_success = false;// 连接socket服务器成功

	// ---------------------监听socket服务-------------------------
	// 有用户退出
	receiveLogout(function(data) {
		webim.setUserStatus({
			uid : data.user_id,
			uname : data.user_name,
			status : 3
		});
	});

	// 单个用户聊天消息
	receiveChatMsg(function(data) {
		if (!data.self_send) {
			webim.setMessage(data);
		}
	});

	// 获取用户好友状态，获取状态的同时获取最近联系人
	receiveFriendsStatus(function(data) {
		// 所有在线的好友
		webim.setOnlines(data.result_status);
		// 最近联系人
		getRecentContact();
	});

	// 消息中心推送的命令
	WebIMPushMsg(function(data) {
		data.msg = data.content;
		webim.pushMessage(data);
	});

	// 有用户修改在线状态
	receiveChangeRedisStatus(function(data) {
		var self = data;
		if (webim.userInfo.uid == self.user_id) {
			if (!data.self_send) {
				if (data.ext) {
					webim.setControl(data.ext);
				} else {
					webim.setUserStatus({
						uid : data.user_id,
						uname : data.user_name,
						status : data.status
					});
				}
			}
		} else {
			webim.setUserStatus({
				uid : data.user_id,
				uname : data.user_name,
				status : data.status
			});
		}

		webim.checkService();
	});

	// 获取在线客服
	receiveGetOnlineCustomerService(function(data) {
		if (data.result_status && data.result_status.length > 0) {
			var user = data.result_status[0];
			if (user && serviceInfo)
				user.user_name = serviceInfo.name;
			serviceInfo = null;
			webim.setOpenChatBox(user);
		} else {
			showAlert(L.noneServiceLabel);
		}
	});

	// 获取所有的在线客服
	receiveGetAllOnlineCustomerService(function(data) {
		if (data.result_status && data.result_status.length > 0) {
			webim.setServiceStatus(data.result_status);
		}
	});

	// 自定义监听事件
	getImclient(function(imclient) {
		imclient.on('2502', function(e, data) {
			webim.imChatbox.showPingView(data.user_id, E.DO_NOT_CONTROL);
		});
	});

	// ---------------------发起和监听rest服务-------------------------
	var dataType = WEB_IM_CONFIG.ajaxDataType;
	var jsonp = WEB_IM_CONFIG.ajaxJsonp;

	// 公用的ajax方法
	function ajaxForIm(url, callback, data) {
		$.ajax({
			url : url,
			data : data,
			dataType : dataType,
			jsonp : jsonp,
			type : "post",
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// alert("err:"+textStatus+",readyState:"+XMLHttpRequest.readyState+",errorThrown"+errorThrown);
			},
			success : function(data) {
				if (typeof (eval(callback)) == "function") {
					callback(data);
				}
			}
		});
	}

	// 获取最近联系人
	function getRecentContact() {
		var data = {
			type : "2300",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			page_start : "0",
			page_size : "20"
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getRecentContactCallback, {
					data : JSON.stringify(data)
				});
	}

	function getRecentContactCallback(data) {
		webim.setNearFriends(data);
	}

	// 获取未读消息数
	function getUnreadMsgCount() {
		var data = {
			type : "2401",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getUnreadMsgCountCallback, {
					data : JSON.stringify(data)
				});
	}

	function getUnreadMsgCountCallback(data) {
		webim.setOfflineMessage(data);
	}

	// 获取聊天记录
	function getChatRecord(data) {
		var data = {
			type : "2402",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : {
				to_id : data.uid,
				start : "" + data.start,
				size : "" + data.size
			}
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate", getChatRecordCallback, {
			data : JSON.stringify(data)
		});
	}

	function getChatRecordCallback(data) {
		if (data.result_message) {
			webim.setUserMessage(data);
		}
	}

	// 获取在线客服
	function getOnlineService(data) {
		var data = {
			type : "2500",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			user_name: webim.userInfo.uname,
			query_ext : data
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getOnlineServiceCallback, {
					data : JSON.stringify(data)
				});
	}

	function getOnlineServiceCallback(data) {
		if (data.result_status && data.result_status.length > 0) {
			var user = data.result_status[0];
			if (user && serviceInfo)
				user.user_name = serviceInfo.name;
			serviceInfo = null;
			user.itemId = WEB_IM_CONFIG.itemId;
			user.vendId = WEB_IM_CONFIG.vendId;
			webim.setOpenChatBox(user);
		} else {
			showAlert(L.noneServiceLabel);
		}
	}

	// 结束聊天
	function endChat(data) {
		var data = {
			type : "2501",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : {
				serviceId : data.sid,
				score : data.score
			}
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate", "", {
			data : JSON.stringify(data)
		});
	}

	// 获取所有在线客服
	function getALLOnlineService(data) {
		var data = {
			type : "2503",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : data
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate",
				getALLOnlineServiceCallback, {
					data : JSON.stringify(data)
				});
	}

	function getALLOnlineServiceCallback(data) {
		webim.setServiceStatus(data);
	}

	// 客服用户申请打分，普通用户收到打分界面
	function CallScore(data) {
		var data = {
			type : "2502",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			query_ext : data
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendOperate", "", {
			data : JSON.stringify(data)
		});
	}

	// 如果是更新扩展信息，判断是否是更新扩展信息的最近联系人，如果是，更新数据库中的消息为已读
	function getChangeStatus(data) {
		var data = {
			type : "0200",
			app_id : webim.userInfo.app_id,
			user_id : webim.userInfo.uid,
			ext : data.ext
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "changeStatus", "", {
			data : JSON.stringify(data)
		});
	}

	// 保存聊天记录
	function saveChatRecord(data) {
		var data = {
			type : "1101",
			app_id : webim.userInfo.app_id,
			from : webim.userInfo.uid,
			to : data.to,
			from_name : webim.userInfo.uname,
			to_name : data.to_name,
			msg : data.msg
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendMessage", "", {
			data : JSON.stringify(data)
		});
	}

	// 保存最近联系人
	function saveOrUpdateRecentContact(data) {
		var data = {
			type : "1102",
			app_id : webim.userInfo.app_id,
			from : webim.userInfo.uid,
			to : data.to,
			from_name : webim.userInfo.uname,
			to_name : data.to_name,
			msg : data.msg
		};
		ajaxForIm(WEB_IM_CONFIG.imUrL + "sendMessage", "", {
			data : JSON.stringify(data)
		});
	}

	// //收到推送的消息，显示在左下角聊天框
	// imclient.on('3100', function(e, data) {
	// webim.pushMessage(data);
	// });
	//		
	// //收到推送的消息，不显示在聊天框，纯命令
	// imclient.on('3200', function(e, data) {
	// XSM3.swfMain.receiveMsg(data);
	// });
	//		   

	/**
	 * 监听初始化用户基本信息完毕，获取成功之后登陆聊天服务器 回调函数中返回用户基本信息数据
	 * 
	 * @param function:登陆聊天服务器
	 */
	webim.on(E.INIT_USER_INFO, function(e, data) {
		get_userinfo_success = true;
		getInfoFromInit(initIm);
	});

	var initIm = function(data) {
		webim.isConnected = true;
		var self = data;
		if (!webim || !webim.userInfo || !self)
			return;
		if (webim.userInfo.uid == self.user_id) {// 自己登陆，显示聊天框

			if (self.self_send) {

				webim.initView();
				IM.webim = webim;
				if (self.ext) {
					webim.setControl(self.ext);
				}
				webim.setUserStatus({
					uid : self.user_id,
					uname : self.user_name,
					status : self.status
				});

				var str = webim.getFriendsID();

				// 获取好友在线状态
				sendFriendsStatus(str);

				// 获取未读消息的记录数
				getUnreadMsgCount();

				// 检查客服是否在线
				webim.checkService();

				// 回调
				callback({
					code : 1,
					webim : webim,
					func : getOnlineService
				});
			}
		} else {
			webim.setUserStatus({
				uid : self.user_id,
				uname : self.user_name,
				status : self.status
			});
		}
	};

	/**
	 * 监听获取用户信息，获取后初始化好友状态
	 */
	webim.on(E.GET_USER_INFO, function(e, data) {
		webim.setFriends(webim.friends);// 好友列表
		webim.setGroups(webim.groups);// 群组列表
		sendFriendsStatus(webim.getFriendsID());// 获取好友在线状态
		webim.checkService();// 检查客服是否在线
	});

	// 发送窗口状态
	webim.on("sendcontrol", function(e, data) {
		data.eventName = "sendcontrol";
		sendChangeRedisStatus(data);

		var ext = data.ext;
		if (ext) {
			var tempExt = ext.split(",");
			if (tempExt[0] && tempExt[0] == webim.imChatbox.currentUser.uid) {
				getChangeStatus(data);
			}
		}

	});

	// 发送用户在线状态
	webim.on("sendstatus", function(e, data) {
		data.eventName = "sendstatus";
		sendChangeRedisStatus(data);
	});

	// 获取与某个用户的聊天记录
	webim.on("getchatinfo", function(e, data) {
		getChatRecord(data);
	});

	// 最近联系人
	webim.on("getNearFriendsEvent", function(e, data) {
		getRecentContact();
	});

	webim.on("onservice", function(e, data) {
		var extinfo = new Object();
		var type = data.type;

		if (type == "mfr")
			type = "com";
		if (type)
			extinfo.ext_type = type + "_id";
		if (data.value)
			extinfo.ext_value = data.value;

		extinfo.user_skill = '2';
		extinfo.user_status = '1';

		serviceInfo = data;

		// 获取在线客服
		sendGetOnlineCustomerService(extinfo);
	});
	webim.on("closeservice", function(e, data) {
		// 关闭在线客服
		endChat(data);
	});
	webim.on("appraiseservice", function(e, data) {
		// 客服发送评价提示
		CallScore({
			customer : data.uid
		});
	});
	webim.on("checkservice", function(e, data) {
		var extinfo = new Object();
		extinfo.ext_type = "";
		extinfo.ext_value = "";

		if (!data.list)
			return;

		var list = data.list;
		for ( var i = 0; i < list.length; i++) {
			var user = list[i];
			if (webim.isService(user.skill)) {
				var type = user.type;
				if (type == "mfr")
					type = "com";
				extinfo.ext_type += type + "_id";
				extinfo.ext_value += user.uid;
				if (i != list.length - 1) {
					extinfo.ext_type += ",";
					extinfo.ext_value += ",";
				}
			}
		}

		extinfo.user_skill = '2';
		extinfo.user_status = '1';

		// 获取在线客服
		sendGetAllOnlineCustomerService(extinfo);
	});

	// 发送普通私聊消息
	webim.on("sendmessage", function(e, data) {
		// 保存聊天记录
		saveChatRecord(data);
		// 保存最近联系人
		saveOrUpdateRecentContact(data);
	});
}

/**
 * 打开一个聊天窗口
 * 
 * @param data
 *            {user_id, user_name, user_skill, status, user_type}
 */
function webim_openChatBox(data) {
	var webim = WebIM.getInstance();
	if (webim) {
		webim.setOpenChatBox(data);
	}
}

/**
 * 接受flash发出的命令
 * 
 * @param data
 */
function webim_sendCommand(data) {
	var webim = WebIM.getInstance();
	if (webim) {
		switch (data.type) {
		case "push":
			webim.pushMessage(data);
			break;
		}
	}
}/**
 * 获取某个用户的在线状态，将用户头像存储到指定容器内
 * @param uid:用户id
 * @param containerId:外部容器的id，如果没有传这个值，就默认将头像添加到引用这个方法的地方
 */

var onLineStatus = 1;
var offLineStatus = 0;

/**
 * 初始化所有状态检测逻辑，刷新需要打开的窗体
 */
function initCheckUserStatus(){
	
	//遍历内存待获取的状态
	var keys = UserMap.keys();
	if(keys && (keys.length>0)){
		var friend_list = "";
		for(var i=0;i<keys.length;i++){
			var uid = keys[i];
			if(isEmptyStr(uid)){
				friend_list += uid + ",";
				var udata = UserMap.get(uid);
				if(udata){
					if(udata.openChat == "true")IM.webim.setOpenChatBox(udata);//打开待要打开的窗体
				}
			}
		}
		
		//获取所有缓存中的用户状态，进行头像刷新
		if(isEmptyStr(friend_list)){
			friend_list = friend_list.substr(0,friend_list.lastIndexOf(","));
//			IM.imclient.sendOperate(IM.imclient.newOperate('2201',{friend_list:friend_list}));
			sendGetUserStatus(friend_list);
		}
	}
	
	receiveGetUserStatus(function(e,data){
		if(data){
			if (data && data.result_status){
				for (var i = 0; i < data.length; i++) {
                    setUserStatus(data[i].user_id,onLineStatus);
                }
			}
		}
	});
	
	
	//监听人物上线通知
//	IM.imclient.on('2201',function(e,data){
//		if(data){
//			
//			if (data && data.result_status){
//				for (var i = 0; i < data.length; i++) {
//                    setUserStatus(data[i].user_id,onLineStatus);
//                }
//			}
//		}
//	});
	
	//监听人物改变状态通知
//	IM.imclient.on('0200',function(e,data){
//		if(data){
//			setUserStatus(data.user_id,data.status);
//		}
//	});
	//监听窗口状态的方法。-----客服
    receiveChangeRedisStatus(function(data){
    	if(data){
			setUserStatus(data.user_id,data.status);
		}
    });
    	
}

/**
 * 设置用户在线状态
 * @return
 */
function setUserStatus(userId,userStatus){
	if(userStatus == onLineStatus){
		$("#"+userId+HEAD_STATUS_Str).removeClass(offLineClass);
		$("#"+userId+HEAD_STATUS_Str).addClass(onLineClass);
	}else{
		$("#"+userId+HEAD_STATUS_Str).removeClass(onLineClass);
		$("#"+userId+HEAD_STATUS_Str).addClass(offLineClass);
	}
	if(data){
		var data = UserMap.get(userId);
		if(data){
			data.status = userStatus;
			UserMap.set(userId,data);
		}
	}
}


/**
 * 创建人物头像图标图标
 * @param online
 * @param divId
 */
function showHeadIconByPos(online,divId){
	var class_status = "wbim_head_offline";
	if(online){
		class_status = "wbim_head_inline";
	}
	var span = $("<span class='wbim_head_status a'><a href='#' class="+class_status+"/></span>");
	return span;
}

 /**
  * 判断字符串是否为空
  * @param str
  * @return
  */
function isEmptyStr(str){
	return (str && (str.length > 0));
}

/**
 * 测试
 * @param online
 */
function testShowHead(){
	for(var i=0;i<10;i++){
		var spanId = 'headTD' + i;
		$("#mytable").append("<tr><td width='100' class='row'>"+i+"号客服</td><td class='row'>2012-11-02</td></td>" +
				"<td class='row'>1515313752"+i+"</td><td id='"+ spanId +"' class='row'/></tr>");
		var bo=false;
		if(!(i%2)){
			bo=true;
		}
		showHeadIcon(bo,spanId);
	}
}(function($) {
	$.fn.jqDrag = function(h) {
		return i(this, h, 'd');
	};
	$.fn.jqResize = function(h) {
		return i(this, h, 'r');
	};
	$.jqDnR = {
		dnr : {},
		e : 0,
		drag : function(v) {
			E.css('cursor', 'move');
			if (M.k == 'd') {
				E.css({
					left : (M.X + v.pageX - M.pX) < 0
							? 0
							: (M.X + v.pageX - M.pX) < document.documentElement.clientWidth - M.W
									? (M.X + v.pageX - M.pX)
									: document.documentElement.clientWidth
											- M.W,
					top : (M.Y + v.pageY - M.pY) < 0
							? 0
							: (M.Y + v.pageY - M.pY) < document.documentElement.clientHeight
									- M.H
									? (M.Y + v.pageY - M.pY)
									: document.documentElement.clientHeight
											- M.H
				});
			} else {
				E.css({
							width : Math.max(v.pageX - M.pX + M.W, 0),
							height : Math.max(v.pageY - M.pY + M.H, 0)
						});
				return false;
			}
		},

		stop : function() {
			E.css('cursor','auto');
			E.css('opacity', 1);
			$(document).unbind('mousemove', J.drag).unbind('mouseup', J.stop);
		}
	};
	var J = $.jqDnR, M = J.dnr, E = J.e, i = function(e, h, k) {
		return e.each(function() {
					h = (h) ? $(h, e) : e;
					h.bind('mousedown', {
								e : e,
								k : k
							}, function(v) {
								var d = v.data, p = {};
								E = d.e;
								if (E.css('position') != 'relative') {
									try {
										E.position(p);
									} catch (e) {
									}
								}
								M = {
									X : p.left || f('left') || 0,
									Y : p.top || f('top') || 0,
									W : f('width') || E[0].scrollWidth || 0,
									H : f('height') || E[0].scrollHeight || 0,
									pX : v.pageX,
									pY : v.pageY,
									k : d.k,
									o : E.css('opacity')
								};
								E.css({
											opacity : 0.8
										});
								$(document).mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
								return false;
							});
				});
	}, f = function(k) {
		return parseInt(E.css(k)) || false;
	};
})(jQuery);/**
 * 智能机器人界面配置
 * @type 
 */
var ROBOT_CONFIG = {
	width:800,
	height:500,
	header_height:45,
	inputpanel_height:100,
	attach_box_width:220,
	
	MAX_INPUT_COUNT:120
};

var Robot = function() {
    
};

(function( $ ) {
	Robot.prototype = {
		
		robot:null,
		header:null,
		chat_box:null,
		attach_box:null,
		
		chatpanel:null,
		inputpanel:null,
		input_text:null,
		input_count:null,
		
		max_btn:null,//最大化按钮
		box_status:0,//0：最大化；1：中；2：最小化
		
		currentUser:null,//当前用户
		
		ext_hot:null,
		ext_about:null,
		ext_hot_box:null,
        ext_about_box:null,
		
		init:function(){
			
		},
		
		openBox:function(user){
			this.currentUser = user;
			var robot = "<div class='robot' id='robot_" + user.uid + "' name='robot_" + user.uid + "'>";
            $("body").append(robot);
            this.initBox();
            //加载机器人欢迎语
            this.showRobotWelcom(user.uid);
		},
		
		showRobotWelcom: function(uid){
			IM.call("3600",
				{serviceId: uid},
				this.showWelcom,
				this
			);
		},
		
		showWelcom: function(data){
			var date = new Date();
			var welInfo = {
				from: this.currentUser.uid,
                from_name: this.currentUser.uname,
                chat_date: $.dateFormat(date, "yyyy-MM-dd"),
                chat_time: $.dateFormat(date, "hh:mm:ss"),
                msg: WEB_IM_CONFIG.welcome.replace(/%s/, $this.currentUser.uname)
			};
			if(data && data.welcomeInfo){
				welInfo.msg = data.welcomeInfo;
			}
			this.pushRobotMessage(welInfo);
		},
		
		initBox:function(){
			var $this = this;
			$this.robot = $("div[id=robot_"+$this.currentUser.uid+"]");
			$this.robot.append(sb);
			$this.header = $this.robot.node("header");
			$this.chat_box = $this.robot.node("chat_box");
			$this.max_btn = $this.robot.node("max_btn");
			
			$this.attach_box = $this.robot.node("attach_box");
			$this.ext_hot = $this.robot.node("ext_hot");
            $this.ext_about = $this.robot.node("ext_about");
            $this.ext_hot_box = $this.robot.node("ext_hot_box");
            $this.ext_about_box = $this.robot.node("ext_about_box");
			
			$this.initHeader();//初始化header
			$this.initChatBox();//初始化聊天框
			$this.initListener();//初始化监听
		//	IM.imclient.sendOperate(IM.imclient.newOperate("4200",{uid:this.currentUser.uid}));//获取热门问题
		},
		
		/**
		 * 初始化header
		 */
        initHeader:function(){
            this.header.node("head").attr("src",this.currentUser.icon);
            this.header.node("title").html(this.currentUser.uname);
            this.header.node("welcome").html(properties.robot_iam+this.currentUser.uname + properties.robot_online_advice);
        	this.robot.jqDrag('.header');
//			$this.robot.jqDrag('.header').jqResize('.drag_icon');
        },
		
		
		/**
		 * 初始化聊天框
		 */
		initChatBox:function(){
			var $this = this;
			$this.chatpanel = $this.robot.node("chatpanel");
            $this.inputpanel = $this.robot.node("inputpanel");
            $this.input_text = $this.robot.node("input_text");
            $this.input_count = $this.robot.node("input_count");
            
            //聊天框内容容器
            var dl = '<div name="chat_list"><dl uid="' + $this.currentUser.uid + '"></dl></div>';
            $this.chatpanel.append(dl);
            
            //调整样式
            $this.initRobotBoxSize();
            
//            $this.input_text.attr("maxlength",ROBOT_CONFIG.MAX_INPUT_COUNT);
            $this.input_count.html(ROBOT_CONFIG.MAX_INPUT_COUNT);//输入框最多输入字数
		},
		
		/**
		 * 初始化整体大小
		 */
		initRobotBoxSize:function(){
            var $this = this;
            var top = 0;
            var left = 0;
            var width = 0;//总宽度
            var heigt = 0;//总高度
            
            if($this.box_status == 0){//最大化
            	top = 0;
            	left = 0;
            	width = $(window).width();
            	height = $(window).height();
            	$this.robot.css("border","0");
            	$this.robot.css("border-radius","0");
            	$this.max_btn.removeClass("robot_icon_max");
            	$this.max_btn.addClass("robot_icon_mid");
        	}else if($this.box_status == 1){
                width = ROBOT_CONFIG.width;
                height = ROBOT_CONFIG.height-2;
                top = ($(window).height() - height)/2;
                left = ($(window).width() - width)/2;
                $this.robot.css("border","1px solid #36648B");
                $this.robot.css("border-radius","4px");
                $this.robot.css("-moz-border-radius","4px");
                $this.robot.css("-webkit-border-radius","4px");
                $this.max_btn.removeClass("robot_icon_mid");
                $this.max_btn.addClass("robot_icon_max");
            }
            
            //总大小
            var headerHeight = ROBOT_CONFIG.header_height;
            $this.robot.width(width);
            $this.robot.height(height);
            $this.robot.css("top",top);
            $this.robot.css("left",left);
            $this.robot.css("position","fixed");
            $this.header.width(width);
            $this.header.height(headerHeight);
            
            //输入框
            var inputWidth = width - ROBOT_CONFIG.attach_box_width;//输入框宽度
            var inputHeight = ROBOT_CONFIG.inputpanel_height - 10;//输入框高度
            $this.inputpanel.width(inputWidth);
            $this.inputpanel.height(inputHeight);
            $this.input_text.width(inputWidth - 2);
            $this.input_text.height(inputHeight - 32);
            
            //聊天框
            var chatHeight = height - headerHeight - inputHeight - 1;//聊天框高度
            $this.chatpanel.width(width);
            $this.chatpanel.height(chatHeight);
            $this.chatpanel.css("top",headerHeight);
            
            //显示内容
            var chat_list = $this.chatpanel.find("div[name=chat_list]");
            chat_list.width(width - ROBOT_CONFIG.attach_box_width);
            chat_list.height(chatHeight);
            chat_list.css("float","left");
            chat_list.css("margin-top","5px");
            chat_list.css("overflow-x","hidden");
            chat_list.css("overflow-y","auto");
            
            
            //右侧，相关问题和热门问题
            $this.attach_box.width(ROBOT_CONFIG.attach_box_width);
            $this.attach_box.height(height - headerHeight - 1);
            $this.attach_box.css("top",headerHeight);
            $this.attach_box.css("margin-left","-220px");
            
            var extHeight = (height - headerHeight - 78) / 2;
            if($this.ext_hot_box.css("display") == "none"){
            	$this.ext_about_box.height(extHeight * 2);
            }else{
            	$this.ext_hot_box.height(extHeight);
            	$this.ext_about_box.height(extHeight);
            }
            
            $this.ext_hot.height("100%");
            $this.ext_about.height("100%");
        },
		
        
        /**
         * 初始化监听
         */
        initListener:function(){
        	$this = this;
        	var uid = $this.currentUser.uid;
        	//关闭
        	$this.robot.node("close_btn").click(function(e) {
                IM.webim.robotMap.remove(uid);
                $this.robot.remove();
                
                $this.robot = null;
                $this.attach_box = null;
                $this.chat_box = null;
                $this.chatpanel = null;
                $this.ext_about = null;
                $this.ext_hot = null;
                $this.header = null;
                $this.input_count = null;
                $this.input_text = null;
                $this.inputpanel = null;
                $this.max_btn = null;
            });
            //最大化
            $this.robot.node("max_btn").click(function(e) {
            	if($this.box_status == 0){
            		$this.box_status = 1;
            		$.jqDnR.stop();
            	}else{
            		$this.box_status = 0;
            	}
                $this.initRobotBoxSize($this);
            });
            //发送按钮
            $this.robot.node("send_btn").click(function(e) {
                $this.sendMessage();
            });
            //输入框
            $this.input_text.on("keydown", function(e) {
                var code = e.keyCode || e.which || e.charCode;
                if(code == 13) {
                    $this.sendMessage();
                    e.preventDefault();
                    return false;
                }
                $this.checkInput(e);
            }).keyup(function(e) {
                $this.checkInput(e);
            });
            //展开热门信息
            $this.robot.node("ext_hot_head").click(function(e) {
                $this.showExtHotBox();
            });
            //展开相关问题
            $this.robot.node("ext_about_head").click(function(e) {
                $this.showExtAboutBox();
            });
            //窗口拉伸
            window.onresize = function(){
            	if($this.box_status == 0 && $this.robot){
            		$this.initRobotBoxSize($this);
            	}
            };
            //转人工客服
        	$this.robot.node("service_btn").click(function(e) {
        		//请求人工客服
        		IM_engin.doStart("", "1");
        		//关闭机器人
                $this.robot.node("close_btn").click();
            });
        },
        
        /**
         * 检查用户输入的字符
         */ 
        checkInput : function(e) {
            var l = ROBOT_CONFIG.MAX_INPUT_COUNT - this.input_text.val().length;
            if(l >= 0) {
                this.input_count.html(l);
            }else{
            	this.input_count.html("<span style='color:red'>" + l + "</span>");
            }
            return true;
        },
        
        /**
         * 发送消息
         */
        sendMessage : function() {
            $this = this;
            var msg = $this.checkSendMsgLength();
            if(!msg)return;
                
            //显示在消息接收框
            var date = new Date();
            var chat_msg = {
            	isSelf:true,
                uid : $this.currentUser.uid,
                uname:IM.webim.userInfo.uname,
                date: $.dateFormat(date, "yyyy-MM-dd"),//日期
                time: $.dateFormat(date, "hh:mm:ss"),//时间
                msg : msg
            };
            $this.showChatContent(chat_msg);
            
            //发送给聊天服务器
            IM.call("4100", {
            		robotId: $this.currentUser.uid,
            		robotName: $this.currentUser.uname,
            		question: msg
				},
				$this.pushRobotMessage,
				$this
			);
            
            //清除发送框文字
            $this.input_text.val("");//清空发送框
            $this.input_count.html(ROBOT_CONFIG.MAX_INPUT_COUNT);//字符限制
        },
        
        //机器人推送的答案
        pushRobotMessage:function(data){
        	// 组装消息内容
            var msg = {
                isSelf : false,
                uid : data.from,
                uname : data.from_name,
                time : data.chat_time,
                date : data.chat_date,
                msg : data.msg
            };
            
            //显示在消息接收框
            this.showChatContent(msg);
        },
        
        //机器人推送的热门问题
        pushHotMessage:function(data){
        	$this = this;
        	$this.getExtContent($this.ext_hot,data);
//        	slideup.init($this.ext_hot.find("ul"));//热门问题跑马灯效果
        },
        
        //机器人推送的相关问题
        pushAboutMessage : function(data){
            $this = this;
            $this.getExtContent($this.ext_about,data);
            $this.showExtAboutBox();
        },
        
        //显示热门问题
        showExtHotBox : function(){
        	$this = this;
            var height = ($this.robot.height() - $this.header.height() - 78)/2;
            $this.ext_about_box.animate({height:height},300);
            $this.ext_hot_box.animate({height:height},300);
        },
        
        //显示相关问题
        showExtAboutBox : function(){
            $this = this;
            var height = $this.ext_about.height() + $this.ext_hot.height();
//            $this.ext_hot.find("ul").children().stop();
            $this.ext_hot_box.animate({height:0},300);
            $this.ext_about_box.animate({height:height},300);
        },
        
        //创建热门问题和热门问题内容
        getExtContent : function(ext_box,data){
        	//移除之前的
        	ext_box.find("li").unbind();
            ext_box.find("ul").children().remove();
            
            //显示新的
        	var str = "";
            var list = data.result_message;
            if(list && (list.length > 0)){
                for (var i = 0; i < list.length; i++) {
                    str += "<div><li><a href='#' title='" + list[i].msg + "'>" + list[i].msg + "</a></li></div>";
                }
                $this = this;
	            ext_box.find("ul").append(str);
	            
	            //点击后直接提问
	            ext_box.find("li").bind('click', function(e) {
	                $this.input_text.val($(this).text());
	                $this.sendMessage();
	                e.preventDefault();
                    return false;
	            });
            }else{
                str += "<p style='text-align:center;'>"+properties.robot_norelated_issues;
                ext_box.find("ul").append(str);
            }
        },
        
        
        /**
         * 显示消息内容
         */
        showChatContent : function(data){
            var chatUserName = '<div class="' + (data.isSelf?"self_name":"other_name") + '">' + 
            (data.uname + "&nbsp;&nbsp;") + data.date + "&nbsp;" + data.time + '</div>';
            
            var str = '<dd class="robot_msgl">'
            + '<div class="robot_msgpos">' + chatUserName
            + '<div class="msg_box">' + data.msg+'</div>'
            + '</div></dd>';
            
            this.chatpanel.find("dl[uid=" + data.uid + "]").append(str);
            this.chatpanel.find("div[name=chat_list]").scrollTop(9999999);
        },
        
        /**
	     * 消息内容是否超出限制
	     */
	    sendMsgBgTimeId : null,
	    setSendMsgIndex : 0,
	    checkSendMsgLength : function(){
	    	$this = this;
	    	var msg = $this.input_text.val();
	        if(!msg || (msg && (msg.length > ROBOT_CONFIG.MAX_INPUT_COUNT))){
	        	if(!sendMsgBgTimeId){
		            this.sendMsgBgTimeId = setInterval(function(){
		            	if($this.setSendMsgIndex % 2 == 0){
				            $this.input_text.css("background-color","#FFFFFF");
				        }else{
				            $this.input_text.css("background-color","#FA8072");
				        }
				        $this.setSendMsgIndex ++;
				        
				        if($this.setSendMsgIndex >= 5){
				            $this.setSendMsgIndex = 0;
				            clearInterval($this.sendMsgBgTimeId);
				            sendMsgBgTimeId = null;
				        }
		            },200);
	        	}
	            return false;
	        }
	        return msg;
	    }
   };
})(jQuery);


    /**
     * 获取单例对象
     * @type 
     */
    var _globalRobot = null;
    Robot.newInstance = function() {
        if (_globalRobot == null)
            _globalRobot = new Robot();
        return _globalRobot;
    };
    Robot.getInstance = function() {
        return _globalRobot;
    };

    /**
     * 跑马灯效果
     * @type 
     */
    var slideup = {
    	init : function(ticker){
            slideup.animator(ticker.children(":first"));
            ticker.mouseenter(function() {
            	ticker.children().stop();
            });
            ticker.mouseleave(function() {
            	slideup.animator(ticker.children(":first"));
            });
    	},
    	
    	animator : function(currentItem){
    		var distance = currentItem.height();
                duration = (distance + parseInt(currentItem.css("marginTop"))) / 0.015;
                currentItem.animate({marginTop : -distance}, duration, "linear", function() {
                            currentItem.appendTo(currentItem.parent()).css("marginTop", 0);
                            slideup.animator(currentItem.parent().children(":first"));
                });
    	}
    };/**
 * 侧边栏界面配置
 * @type
 */
 
 /********右侧tab切换js*********/
function ChangeDiv(menuName, indexes, divName, divCount){
	for(i = 0; i < divCount; i++){
		var menu = document.getElementById(menuName + i);
		var con = document.getElementById(divName + i);
		menu.className = i == indexes ? "current" : "";
		con.style.display = i == indexes ? "block" : "none";
	}
}
//var sideBar = {
//	//
//};

var webim_tag3 = '';
webim_tag3 += '<div id="wbim_box" class="wbim_box">';
webim_tag3 += '	<div node-type="wbim_list_expand" class="wbim_list_expand">';
webim_tag3 += '		';
webim_tag3 += '		<!-- 右侧在线状态、好友列表等 -->';
webim_tag3 += '		<div>';
webim_tag3 += '		  <!-- 顶部在线状态、搜索等  -->';
webim_tag3 += '			<div class="wbim_tit" node-type="wbim_titin" id="wbim_titin_id">';
webim_tag3 += '					<!-- 在线状态 -->';
webim_tag3 += '					<div class="wbim_tit_lf">';
webim_tag3 += '						<div node-type="status_manager" class="tit">';
webim_tag3 += '						  <!-- 当前状态 -->';
webim_tag3 += '							<span node-type="wbim_status_tit">';
webim_tag3 += '								 <span class="wbim_status_online"/>';
webim_tag3 += '								 <span class="txt">%{webimtag3_online}</span>';
webim_tag3 += '						    </span>';
webim_tag3 += '						  <!-- 下拉箭头 -->';
webim_tag3 += '						    <span node-type="wbim_status_tit_arrow" class="wbim_status_tit_arrow"/>';
webim_tag3 += '						  <!-- 下拉列表 -->';
webim_tag3 += '						    <ul node-type="wbim_status_list">';
webim_tag3 += '                                <li data-status="1" class="wbim_status_selected">';
webim_tag3 += '                                    <a href="javascript:void(0)"><span class="wbim_status_online"></span>';
webim_tag3 += '                                        <span class="wbim_status_label" node-type="wbim_status_label">%{webimtag3_online}</span>';
webim_tag3 += '                                    </a>';
webim_tag3 += '                                </li>';
webim_tag3 += '                                <li data-status="2">';
webim_tag3 += '                                    <a href="javascript:void(0)"><span class="wbim_status_busy"></span>';
webim_tag3 += '                                        <span class="wbim_status_label" node-type="wbim_status_label">%{webimtag3_bebusy}</span>';
webim_tag3 += '                                    </a>';
webim_tag3 += '                                </li>';
webim_tag3 += '                            </ul>';
webim_tag3 += '						</div>';
webim_tag3 += '					</div>';
webim_tag3 += '					';
webim_tag3 += '					<!-- 搜索 -->';
webim_tag3 += '					<div class="wbim_list_up">';
webim_tag3 += '					   <input id="wbim_search" type="text" /><!-- 搜索框 -->';
webim_tag3 += '					   <div class="wbim_list_srch_icon" /><!-- 图标 -->';
webim_tag3 += '		            </div>';
webim_tag3 += '					';
webim_tag3 += '					<!-- 最小化 -->';
webim_tag3 += '					<a node-type="wbim_icon_mini" title="%{webimtag3_mini}" class="wbim_icon_mini" href="javascript:;"></a>';
webim_tag3 += '			</div>';
webim_tag3 += '			<!-- <div class="wbim_line"></div>  -->';
webim_tag3 += '			';
webim_tag3 += '			<!-- 好友、群聊、最近联系人标签 -->';
webim_tag3 += '			<div class="wbim_list_tab">';
webim_tag3 += '				<ul>';
webim_tag3 += '					<li title="%{webimtag3_mycontact_person}">';
webim_tag3 += '						%{webimtag3_mycontact_person}';
webim_tag3 += '					</li>';
webim_tag3 += '					<!--  ';
webim_tag3 += '					<li>';
webim_tag3 += '						<a title="%{webimtag3_group}" href="javascript:;"><span><em class="wbim_tab_group"></em></span></a>';
webim_tag3 += '					</li>';
webim_tag3 += '					-->';
webim_tag3 += '					<li title="%{webimtag3_recent_contact}">';
webim_tag3 += '						%{webimtag3_recent_contact}';
webim_tag3 += '					</li>';
webim_tag3 += '				</ul>';
webim_tag3 += '			</div>';
webim_tag3 += '			<div style="position:absolute;top:74px;left:2px;width:180px;height:31px;background-color:white;z-index:1;display:none;overflow:hidden;" class="wbim_float_group_tit"></div>';
webim_tag3 += '			<div class="wbim_list_box">';
webim_tag3 += '				<div node-type="wbim_list_friendlist" class="wbim_list_friend">';
webim_tag3 += '					<div class="wbim_list_nof"><span class="wbim_icon_tips"></span>%{webimtag3_notget_friends}</div>';
webim_tag3 += '				</div>';
webim_tag3 += '				<!-- ';
webim_tag3 += '				<div node-type="wbim_list_grouplist" class="wbim_list_friend" style="display: none;">';
webim_tag3 += '					<div class="wbim_list_nof"><span class="wbim_icon_tips"></span>%{webimtag3_notjoin_group}</div>';
webim_tag3 += '				</div>';
webim_tag3 += '				-->';
webim_tag3 += '				<div node-type="wbim_list_nearlist" class="wbim_list_friend" style="display: none;">';
webim_tag3 += '					<div class="wbim_list_nof"><span class="wbim_icon_tips"></span>%{webimtag3_norecent_contact}</div>';
webim_tag3 += '				</div>';
webim_tag3 += '				<div node-type="wbim_list_searchlist" class="wbim_list_friend" style="display: none;">';
webim_tag3 += '					<div class="wbim_list_nof"><span class="wbim_icon_tips"></span>%{webimtag3_nomatching_contact}</div>';
webim_tag3 += '				</div>';
webim_tag3 += '			</div>';
webim_tag3 += '			';
webim_tag3 += '			<!-- 底部收起按钮 -->';
webim_tag3 += '			<div class="wbim_list_pos"><a node-type="wbim_clicknone" href="javascript:;" class="wbim_clicknone"><span class="wbim_icon_arrd"></span></a>';
webim_tag3 += '                <!-- <div title="%{webimtag3_send_privateletter}" class="wbim_send_con"><a href="javascript:;" hidefocus="true" class="wbim_send_pmsg"><span class="wbim_btn_pmsg"></span></a></div> -->';
webim_tag3 += '            </div>';
webim_tag3 += '		</div>';
webim_tag3 += '	</div>';
webim_tag3 += '	<div id="wbim_chat_box" node-type="wbim_chat_box" class="wbim_chat_box wbim_chat_box_s">';
webim_tag3 += '		<div node-type="wbim_chat_con">';
webim_tag3 += '			<div id="wbim_chat_box_head" node-type="wbim_tit" class="wbim_tit">';
webim_tag3 += '			 <!-- 九宫格背景 ';
webim_tag3 += '			    <div class="wbim_tit_bg">';
webim_tag3 += '				    <div class="wbim_tit_bg_left"/>';
webim_tag3 += '	                <div class="wbim_tit_bg_middle"/>';
webim_tag3 += '	                <div class="wbim_tit_bg_right"/>';
webim_tag3 += '			    </div>';
webim_tag3 += '			 -->';
webim_tag3 += '			 <!-- 对方昵称和关闭按钮 -->';
webim_tag3 += '				<div node-type="wbim_titin" class="wbim_titin">';
webim_tag3 += '					<div class="wbim_tit_lf">';
webim_tag3 += '						<!-- 私聊  -->';
webim_tag3 += '						<p node-type="wbim_single_user" >';
webim_tag3 += '							<!-- 普通用户 -->';
webim_tag3 += '                            <span id="wbim_tit_lf_user_name_id" class="txt">';
webim_tag3 += '                                <a node-type="wbim_tit_lf_user_name" title="">&nbsp;</a>';
webim_tag3 += '                            </span>';
webim_tag3 += '                            <!-- 在线客服 -->';
webim_tag3 += '                            <span id="wbim_tit_lf_service_name_id" class="txt">';
webim_tag3 += '                                %{webimtag3_and}&nbsp;<label node-type="wbim_tit_lf_service_name" title="">&nbsp;</label>&nbsp;%{webimtag3_dialoguing}...';
webim_tag3 += '                            </span>';
webim_tag3 += '						</p>';
webim_tag3 += '						<!-- 群聊  -->';
webim_tag3 += '						<p node-type="wbim_group" style="display:none;">';
webim_tag3 += '							<span class="wbim_icon_group_tit"></span>';
webim_tag3 += '							<span class="txt">';
webim_tag3 += '								<a node-type="wbim_tit_lf_gname" target="_blank"></a>';
webim_tag3 += '								<em class="txtg">%{webimtag3_online_contact}(<a target="_blank" node-type="group_num" title="%{webimtag3_view_online}">';
webim_tag3 += '									</a>)';
webim_tag3 += '								</em>';
webim_tag3 += '							</span>';
webim_tag3 += '						</p>';
webim_tag3 += '					</div>';
webim_tag3 += '					';
webim_tag3 += '					<!-- 关闭聊天框 -->';
webim_tag3 += '					<div class="wbim_tit_rf">';
webim_tag3 += '					   <a node-type="wbim_btn_close" title="%{webimtag3_close}" hidefocus="true" class="wbim_icon_close" href="javascript:;"></a>';
webim_tag3 += '						<a node-type="wbim_icon_mini" title="%{webimtag3_mini}" hidefocus="true" class="wbim_icon_mini" href="javascript:;"></a>';
webim_tag3 += '					</div>';
webim_tag3 += '				</div>';
webim_tag3 += '			</div>';
webim_tag3 += '			';
webim_tag3 += '			<!-- 左侧好友列表 -->';
webim_tag3 += '			<div node-type="wbim_chat_lf" style="display:none;" class="wbim_chat_lf">';
webim_tag3 += '				<a href="javascript:;" node-type="wbim_scrolltop" class="wbim_scrolltop_n"></a>';
webim_tag3 += '				<div node-type="wbim_chat_friend_box" class="wbim_chat_friend_box">';
webim_tag3 += '					<ul id="wbim_chat_friend_list" node-type="wbim_chat_friend_list" class="wbim_chat_friend_list">';
webim_tag3 += '					</ul>';
webim_tag3 += '				</div>';
webim_tag3 += '				<a href="javascript:;" node-type="wbim_scrollbtm" class="wbim_scrollbtm_n"></a>';
webim_tag3 += '			</div>';
webim_tag3 += '			';
webim_tag3 += '			<div class="wbim_chat_rt">';
webim_tag3 += '			<div class="wbim_chat_up">';
webim_tag3 += '			 <!-- 对方不在线提醒 -->';
webim_tag3 += '                <div node-type="wbim_chat_tips" class="wbim_chat_tips" style="display: none;">';
webim_tag3 += '                    <span class="wbim_icon_tips"></span>';
webim_tag3 += '                    <span node-type="wbim_chat_tips_content" class="wbim_chat_tips_content"></span>';
webim_tag3 += '                    <a class="wbim_icon_close_s" node-type="wbim_icon_close_s" href="javascript:;" hidefocus="true"></a>';
webim_tag3 += '                </div>';
webim_tag3 += '			 <!-- 消息接收框 -->';
webim_tag3 += '				<div node-type="wbim_chat_list" class="wbim_chat_list"></div>';
webim_tag3 += '			</div>';
webim_tag3 += '';
webim_tag3 += '				<!-- 中间一栏(表情、上传图片和上传文件等) -->';
webim_tag3 += '				<div node-type="wbim_chat_toolbar" class="wbim_chat_toolbar">';
webim_tag3 += '					<div node-type="wbim_chat_toolbarin" class="wbim_chat_toolbarin">';
webim_tag3 += '					';
webim_tag3 += '						<!-- 基本表情 -->';
webim_tag3 += '						<div node-type="wbim_face" class="wbim_face">';
webim_tag3 += '							<a  node-type="wbim_icon_face" title="%{webimtag3_general_expression}"> ';
webim_tag3 += '								<i class="wbim_icon_face"/>%{webimtag3_expression}';
webim_tag3 += '							</a>';
webim_tag3 += '							<div node-type="wbim_face_box" style="display:none;" class="wbim_face_box">';
webim_tag3 += '								<div class="wbim_face_tit">';
webim_tag3 += '									<!-- <div class="wbim_face_arr" style="top:221px;left:8px;"></div> -->';
webim_tag3 += '									<div class="wbim_face_tit_lf">%{webimtag3_chat_expression}</div>';
webim_tag3 += '									<a node-type="wbim_icon_face_close" class="wbim_icon_close"/>';
webim_tag3 += '								</div>';
webim_tag3 += '								<div class="wbim_face_con">';
webim_tag3 += '									<ul node-type="wbim_face_list" class="wbim_face_list">';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_smile}]"><img imgsrc="images/face/1.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_pie}]"><img imgsrc="images/face/2.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_color}]"><img imgsrc="images/face/3.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_frighten}]"><img imgsrc="images/face/4.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_complacent}]"><img imgsrc="images/face/5.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_shed_tears}]"><img imgsrc="images/face/6.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_pudency}]"><img imgsrc="images/face/7.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_shutup}]"><img imgsrc="images/face/8.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_sleep}]"><img imgsrc="images/face/9.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_cry}]"><img imgsrc="images/face/10.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_embarrassed}]"><img imgsrc="images/face/11.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_angry}]"><img imgsrc="images/face/12.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_naughty}]"><img imgsrc="images/face/13.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_bared_teeth}]"><img imgsrc="images/face/14.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_surprised}]"><img imgsrc="images/face/15.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_sorry}]"><img imgsrc="images/face/16.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_cool}]"><img imgsrc="images/face/17.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_cold_sweat}]"><img imgsrc="images/face/18.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_crazy}]"><img imgsrc="images/face/19.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_spit}]"><img imgsrc="images/face/20.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_laughing}]"><img imgsrc="images/face/21.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_lovely}]"><img imgsrc="images/face/22.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_roll_eyes}]"><img imgsrc="images/face/23.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_arrogant}]"><img imgsrc="images/face/24.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_hungry}]"><img imgsrc="images/face/25.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_tired}]"><img imgsrc="images/face/26.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_terrified}]"><img imgsrc="images/face/27.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_perspire}]"><img imgsrc="images/face/28.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_gelasmus}]"><img imgsrc="images/face/29.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_soldier}]"><img imgsrc="images/face/30.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_struggle}]"><img imgsrc="images/face/31.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_curse}]"><img imgsrc="images/face/32.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_doubt}]"><img imgsrc="images/face/33.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_hush}]"><img imgsrc="images/face/34.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_giddy}]"><img imgsrc="images/face/35.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_torture}]"><img imgsrc="images/face/36.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_decline}]"><img imgsrc="images/face/37.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_skeleton}]"><img imgsrc="images/face/38.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_beat}]"><img imgsrc="images/face/39.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_bye}]"><img imgsrc="images/face/40.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_sweat}]"><img imgsrc="images/face/41.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_pull_nose}]"><img imgsrc="images/face/42.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_applause}]"><img imgsrc="images/face/43.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_big_qiu}]"><img imgsrc="images/face/44.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_bad_smile}]"><img imgsrc="images/face/45.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_zuo_hengheng}]"><img imgsrc="images/face/46.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_you_hengheng}]"><img imgsrc="images/face/47.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_yawn}]"><img imgsrc="images/face/48.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_despise}]"><img imgsrc="images/face/49.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_grievance}]"><img imgsrc="images/face/50.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_gonna_cry}]"><img imgsrc="images/face/51.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_sinister}]"><img imgsrc="images/face/52.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_kiss}]"><img imgsrc="images/face/53.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_stupefied}]"><img imgsrc="images/face/54.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_poor}]"><img imgsrc="images/face/55.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_strong}]"><img imgsrc="images/face/56.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_weak}]"><img imgsrc="images/face/57.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_ok}]"><img imgsrc="images/face/58.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_handshake}]"><img imgsrc="images/face/59.gif"></a></li>';
webim_tag3 += '										<li><a href="javascript:;" title="[%{webimtag3_victory}]"><img imgsrc="images/face/60.gif"></a></li>';
webim_tag3 += '									</ul>';
webim_tag3 += '									<div class="tsina_loading cter">';
webim_tag3 += '										<span class="tsina_ico_ldg"></span>';
webim_tag3 += '									</div>';
webim_tag3 += '								</div>';
webim_tag3 += '							</div>';
webim_tag3 += '						</div>';
webim_tag3 += '						';
webim_tag3 += '						<!-- 上传图片 -->';
webim_tag3 += '						<div class="wbim_face" title="%{webimtag3_upload_pic}">';
webim_tag3 += '							<a hidefocus="true" node-type="wbim_icon_img"> ';
webim_tag3 += '								<i class="wbim_icon_img"/>%{webimtag3_pic}';
webim_tag3 += '							</a>';
webim_tag3 += '						</div>';
webim_tag3 += '						';
webim_tag3 += '						<!-- 上传文件 -->';
webim_tag3 += '						<div class="wbim_face" title="%{webimtag3_upload_file}">';
webim_tag3 += '							<a hidefocus="true" node-type="wbim_icon_doc"> ';
webim_tag3 += '								<i class="wbim_icon_doc"/>%{webimtag3_file}';
webim_tag3 += '							</a>';
webim_tag3 += '						</div>';
webim_tag3 += '						';
webim_tag3 += '						<!-- 提示音 -->';
webim_tag3 += '						<div class="wbim_face" title="%{webimtag3_sound_cue}">';
webim_tag3 += '							<a  node-type="wbim_icon_voice"> ';
webim_tag3 += '								<i class="wbim_icon_voice"/>%{webimtag3_sound_cue}';
webim_tag3 += '							</a>';
webim_tag3 += '						</div>';
webim_tag3 += '						';
webim_tag3 += '						<!-- 常用语 -->';
webim_tag3 += '						<div node-type="wbim_quick" class="wbim_face">';
webim_tag3 += '							<a title="%{webimtag3_common_language}" style="display: none;" node-type="wbim_icon_quick">';
webim_tag3 += '							     <i class="wbim_icon_quick"/>%{webimtag3_common_language}';
webim_tag3 += '							</a>';
webim_tag3 += '							<div node-type="wbim_quick_box" style="display: none;" class="wbim_quick_box">';
webim_tag3 += '								<div class="wbim_quick_tit">';
webim_tag3 += '									<div node-type="wbim_quick_tit_lf" class="wbim_quick_tit_lf">%{webimtag3_common_language}</div>';
webim_tag3 += '									<a node-type="wbim_icon_quick_close" class="wbim_icon_close"/>';
webim_tag3 += '								</div>';
webim_tag3 += '								<div node-type="wbim_quick_con" class="wbim_quick_con">';
webim_tag3 += '								</div>';
webim_tag3 += '							</div>';
webim_tag3 += '						</div>';
webim_tag3 += '						';
webim_tag3 += '						<!-- 打分邀请 -->';
webim_tag3 += '						<div node-type="wbim_ping" class="wbim_face">';
webim_tag3 += '							<a title="%{webimtag3_scoring_invitation}" style="display: none;" node-type="wbim_icon_ping">';
webim_tag3 += '							     <i class="wbim_icon_ping"/>%{webimtag3_invitation_score}';
webim_tag3 += '							</a>';
webim_tag3 += '							<div node-type="wbim_ping_box" style="display: none;" class="wbim_ping_box">';
webim_tag3 += '								<div class="wbim_ping_tit">';
webim_tag3 += '									<div node-type="wbim_ping_tit_lf" class="wbim_ping_tit_lf">%{webimtag3_service_score}</div>';
webim_tag3 += '									<a node-type="wbim_icon_ping_close" class="wbim_icon_close"/>';
webim_tag3 += '								</div>';
webim_tag3 += '								<div class="wbim_ping_con">';
webim_tag3 += '									<ul>';
webim_tag3 += '										<li>';
webim_tag3 += '											<input type="radio" name="pingscore" value="1" id="wbim_ping_bumanyi">';
webim_tag3 += '											<label for="wbim_ping_bumanyi">&nbsp;%{webimtag3_dissatisfied}</label>';
webim_tag3 += '										</li>';
webim_tag3 += '										<li>';
webim_tag3 += '											<input type="radio" name="pingscore" value="2" checked="checked" id="wbim_ping_manyi">';
webim_tag3 += '											<label for="wbim_ping_manyi">&nbsp;%{webimtag3_satisfied}</label>';
webim_tag3 += '										</li>';
webim_tag3 += '										<li>';
webim_tag3 += '											<input type="radio" name="pingscore" value="3" id="wbim_ping_fcmanyi">';
webim_tag3 += '											<label for="wbim_ping_fcmanyi">&nbsp;%{webimtag3_very_satisfied}</label>';
webim_tag3 += '										</li>';
webim_tag3 += '									</ul>';
webim_tag3 += '									<p class="wbim_ping_close">';
webim_tag3 += '										<a title="%{webimtag3_confirm}" class="wbim_btn_confirm" node-type="wbim_btn_confirm">%{webimtag3_confirm}</a>';
webim_tag3 += '									</p>';
webim_tag3 += '								</div>';
webim_tag3 += '							</div>';
webim_tag3 += '						</div>';
webim_tag3 += '						';
webim_tag3 += '						<!-- 订单查询 -->';
webim_tag3 += '						<div node-type="wbim_chaxun" class="wbim_face">';
webim_tag3 += '							<a title="%{webimtag3_order_query}" style="display: none;" node-type="wbim_icon_chaxun">';
webim_tag3 += '							     <i class="wbim_list_srch_icon"/>%{webimtag3_order_query}';
webim_tag3 += '							</a>';
webim_tag3 += '						</div>';
webim_tag3 += '						 ';
webim_tag3 += '						<!-- 聊天记录 -->';
webim_tag3 += '						<div node-type="wbim_history_cont"> ';
webim_tag3 += '							<!-- 聊天记录按钮 -->';
webim_tag3 += '							<a title="%{webimtag3_dialogue_log}" node-type="wbim_history" class="wbim_history">';
webim_tag3 += '								<i class="wbim_icon_chatdoc" />%{webimtag3_dialogue_log}';
webim_tag3 += '							</a>';
webim_tag3 += '							<!-- 聊天记录窗体 -->';
webim_tag3 += '							<div node-type="wbim_history_box" class="wbim_history_box" style="display: none;z-index:1000;">';
webim_tag3 += '								<div class="wbim_history_tit">';
webim_tag3 += '									<!-- <div class="wbim_face_arr" style="top:221px;left:8px;"></div> -->';
webim_tag3 += '									<div class="wbim_history_tit_lf" node-type="wbim_history_tit_lf"/>';
webim_tag3 += '									<a node-type="wbim_icon_history_close" href="javascript:;" class="wbim_icon_close"/>';
webim_tag3 += '								</div>';
webim_tag3 += '								<div node-type="wbim_history_con"/>';
webim_tag3 += '								<div class="wbim_history_btns">';
webim_tag3 += '									<p style="float:left;">';
webim_tag3 += '										<a node-type="wbim_history_refresh" href="javascript:void(0)">%{webimtag3_refresh}</a>';
webim_tag3 += '									</p>';
webim_tag3 += '									<p style="float: right;">';
webim_tag3 += '										<a node-type="wbim_history_next" href="javascript:void(0)">%{webimtag3_previous_page}</a>';
webim_tag3 += '										<a node-type="wbim_history_prev" href="javascript:void(0)">%{webimtag3_next_page}</a>';
webim_tag3 += '										<span class="wbim_history_ii">';
webim_tag3 += '											<input type="text" id="wbim_history_ii" value="0"/>';
webim_tag3 += '										</span>';
webim_tag3 += '										<span>/</span>';
webim_tag3 += '										<span node-type="wbim_history_max">0</span>';
webim_tag3 += '										<a node-type="wbim_history_query_btn" href="javascript:void(0)">%{webimtag3_confirm}</a>';
webim_tag3 += '									</p>';
webim_tag3 += '								</div>';
webim_tag3 += '							</div>';
webim_tag3 += '						</div> ';
webim_tag3 += '						<!---->  ';
webim_tag3 += '						';
webim_tag3 += '					</div>';
webim_tag3 += '				</div>';
webim_tag3 += '';
webim_tag3 += '				<!-- 输入框、删除上上传的文件按钮等 -->';
webim_tag3 += '				<div style="margin-top:1px;" node-type="wbim_chat_input" class="wbim_chat_input wbim_chat_input_dis">';
webim_tag3 += '					<!-- 删除上上传的文件按钮  -->';
webim_tag3 += '					<div node-type="root" class="wbim_chat_input_tips" style="display: none;">';
webim_tag3 += '						<div style="display: none;" node-type="wbim_tips_pic" class="wbim_tips_pos_n">';
webim_tag3 += '							<div class="wbim_tips_pic_n"><a href="javascript:;">';
webim_tag3 += '								<a href="javascript:;">';
webim_tag3 += '									<img style="cursor:pointer" action-type="wbim_img_preview" node-type="img_preview">';
webim_tag3 += '								</a>';
webim_tag3 += '							</div>';
webim_tag3 += '							<span class="wbim_p_arr"/>';
webim_tag3 += '						</div>';
webim_tag3 += '						<div id="fls" node-type="fl" class="fl">';
webim_tag3 += '							<span class="icon_ing" style="display:none;"/>';
webim_tag3 += '							<span class="wbim_icon_s_photo" style="display:none;"/>';
webim_tag3 += '							<p id="upFileNameId"/>';
webim_tag3 += '						</div>';
webim_tag3 += '						<div node-type="fr" class="fr">';
webim_tag3 += '							<a id="vdiskId" href="http://vdisk.weibo.com/file/list#3" target="_blank" class="links" style="display:none;" suda-uatrack="key=tblog_webim_behavior&amp;value=view_vdisk" node-type="vdisk">%{webimtag3_mymicro_disk}</a>';
webim_tag3 += '							<a id="deleteFileId" style="display:none;" node-type="deleteFile" class="links">%{webimtag3_delete}</a>';
webim_tag3 += '						</div>';
webim_tag3 += '					</div>';
webim_tag3 += '					<!-- 输入框 -->';
webim_tag3 += '					<textarea node-type="wbim_chat_input_ta"/>';
webim_tag3 += '					<textarea id="fileUpTextId" style="display:none;"/>';
webim_tag3 += '				</div>';
webim_tag3 += '				';
webim_tag3 += '				<!-- 最底下一栏(结束对话、发送等) -->';
webim_tag3 += '				<div node-type="wbim_chat_btm" class="wbim_chat_btm">';
webim_tag3 += '					<div node-type="wbim_chat_btmin" class="wbim_chat_btmin">';
webim_tag3 += '						<p class="wbim_tips_char">';
webim_tag3 += '						      %{webimtag3_input}<span style="font-size:22px" node-type="wbim_tips_char">200</span>%{webimtag3_word}';
webim_tag3 += '						</p>';
webim_tag3 += '						<div class="wbim_chat_btm_rt">';
webim_tag3 += '							<div node-type="wbim_btn_send" id="webimBtnSendDivId" class="wbim_btn_send wbim_btn_send_disable"><a id="webimBtnSendId" class="wbim_btn_publish" node-type="wbim_btn_publish">%{webimtag3_send}</a>';
webim_tag3 += '								<div class="wbim_btn_choose">';
webim_tag3 += '									<a class="wbim_btn_choose_a" node-type="wbim_btn_choose_a">%{webimtag3_choice}</a>';
webim_tag3 += '									<ul node-type="wbim_btn_choose" style="display: none;">';
webim_tag3 += '										<li node-type="wbim_enter_send_li" class="curr"><span><i></i></span><em><a node-type="wbim_enter_send" href="javascript:;">%{webimtag3_enter}</a></em></li>';
webim_tag3 += '										<li class="line"><span></span><em></em></li>';
webim_tag3 += '										<li class="" node-type="wbim_ctrlenter_send_li"><span><i></i></span><em><a node-type="wbim_ctrlenter_send" href="javascript:;">%{webimtag3_ctrl_enter}</a></em></li>';
webim_tag3 += '									</ul>';
webim_tag3 += '								</div>';
webim_tag3 += '							</div>';
webim_tag3 += '						</div>';
webim_tag3 += '					</div>';
webim_tag3 += '				</div>';
webim_tag3 += '		</div>';
webim_tag3 += '		';
webim_tag3 += '		<div id="im_sidebar_container" style="float:left;">';
webim_tag3 += '			<div class="im-right-sidebar">';
webim_tag3 += '		  		<div class="im-shop-service">';
webim_tag3 += '		 	  		 <ul id="im-tab" class="im-tab">';
webim_tag3 += '		 	  			  <li class="current" id="im-tab-li_0" onclick="ChangeDiv(\'im-tab-li_\',\'0\',\'id_\',2)"><span>%{webimtag3_archives_info}</span></li>';
webim_tag3 += '		 	  			  <li id="im-tab-li_1" onclick="ChangeDiv(\'im-tab-li_\',\'1\',\'id_\',2)"><span>%{webimtag3_order_info}</span></li>';
webim_tag3 += '		  	  		 </ul>';
webim_tag3 += '		 	  	 	 <div id="im-tab-contents" class="im-tab-contents">';
webim_tag3 += '		 	   			<div id="id_0" class="im-tab-content">';
webim_tag3 += '							<!----档案信息：im-product-info---->';
webim_tag3 += '		 	   				<div class="im-product-info marginT10 marginLR10" id="sidebar_baseInfo"></div>';
webim_tag3 += '		 	   			</div>';
webim_tag3 += '		 	   			<div id="id_1" class="im-tab-content" style="display:none;">';
webim_tag3 += '							<!----订单信息-im-shop-info---->';
webim_tag3 += '		 	   				<div class="im-shop-info marginT10 marginLR10" id="sidebar_orderInfo"></div>';
webim_tag3 += '		 	   			</div>';
webim_tag3 += '		  	 	     </div>';
webim_tag3 += '		 		 </div>';
webim_tag3 += '			</div>';
webim_tag3 += '		</div>';
webim_tag3 += '';
webim_tag3 += '	</div>';
webim_tag3 += '    </div>';
webim_tag3 += '	';
webim_tag3 += '	';
webim_tag3 += '	<div node-type="wbim_min_box_col" class="wbim_min_box_col2" style="position: absolute; bottom: 0px; right: 0px;z-index:1;">';
webim_tag3 += '		<div class="wbim_min_box">';
webim_tag3 += '			';
webim_tag3 += '			<!-- 打开的聊天框最小化  -->';
webim_tag3 += '			<div node-type="wbim_min_chat" class="wbim_min_chat"><span class="wbim_icon_msg"></span><span node-type="wbim_min_tipbar" style="display:none;">%{webimtag3_new_msg}</span><span node-type="wbim_min_chatuserbar"><span class="wbim_min_text_pre" style="display: inline;">%{webimtag3_and} </span><span node-type="wbim_min_nick" class="wbim_min_nick">&nbsp;</span><span class="line"></span><span class="wbim_min_text">%{webimtag3_dialoguing}</span></span></div>';
webim_tag3 += '		    <!-- 分割线 -->';
webim_tag3 += '		    <div class="wbim_min_line wbim_min_linefor3"></div>';
webim_tag3 += '		    <!-- 最小化图标 -->';
webim_tag3 += '		    <div node-type="wbim_min_friend" class="wbim_min_friend">';
webim_tag3 += '                <div node-type="wbim_sys_btncon" class="wbim_sys_btncon" title="%{webimtag3_sys_msg}"><a node-type="wbim_sys_btn" class="wbim_btn_sysbtn" href="javascript:;"><span node-type="wbim_btn_sysmsg" class="wbim_btn_sysmsg"></span></a></div>';
webim_tag3 += '                <p node-type="wbim_statusbox" class="statusbox"><span class="wbim_status_online" style="float:left;"></span></p>';
webim_tag3 += '                %{webimtag3_dialogue} [ <span node-type="wbim_online_count" class="wbim_online_count" title="%{webimtag3_online_contact}">0</span> ]';
webim_tag3 += '            </div>';
webim_tag3 += '            ';
webim_tag3 += '		</div>';
webim_tag3 += '	</div>';
webim_tag3 += '	<div node-type="wbim_sys_msg" style="display: none;" class="wbim_sys_msg">';
webim_tag3 += '		<div class="wbim_sys_tit">';
webim_tag3 += '			<div class="wbim_sys_tit_lf" node-type="wbim_sys_tit_lf">%{webimtag3_sys_msg}</div>';
webim_tag3 += '			<a node-type="wbim_icon_sys_close" style="float:right;" href="javascript:;" class="wbim_icon_close"></a>';
webim_tag3 += '		</div>';
webim_tag3 += '		<div class="wbim_sys_con" node-type="wbim_sys_con">';
webim_tag3 += '			<dl node-type="wbim_sys_dl"></dl>';
webim_tag3 += '		</div>';
webim_tag3 += '	</div>';
webim_tag3 += '	<div class="wbim_picview_box" node-type="wbim_tips_pos" style="bottom: auto; position: absolute; z-index: 1200; right: 300px; background-color: rgb(243, 243, 243); display: none;">';
webim_tag3 += '		<div class="wbim_img_con">';
webim_tag3 += '			<div class="wbim_pic_bar" node-type="wbim_pic_bar">';
webim_tag3 += '				<!-- ';
webim_tag3 += '				<div class="wbim_p_ctrl">';
webim_tag3 += '					<a class="wbim_plft" node-type="turn_left" title="向左转" href="javascript:void(0)" hidefocus="true"></a>';
webim_tag3 += '					<span class="wbim_vline">|</span>';
webim_tag3 += '					<a class="wbim_prgt" node-type="turn_right" title="向右转" href="javascript:void(0)" hidefocus="true"></a>';
webim_tag3 += '				</div>';
webim_tag3 += '				-->';
webim_tag3 += '				<div class="wbim_ptit">';
webim_tag3 += '						<span id="wbim_ptit_id"></span>';
webim_tag3 += '				</div>';
webim_tag3 += '				<a class="wbim_pic_bar_cls" node-type="wbim_icon_close_s" title="%{webimtag3_close}" href="javascript:closeImgZone();" hidefocus="true"></a>';
webim_tag3 += '			</div>';
webim_tag3 += '			<div id="wbim_pic_zoneId" class="wbim_pic_zone" />';
webim_tag3 += '		</div>';
webim_tag3 += '	</div>';
webim_tag3 += '	<!-- ';
webim_tag3 += '		<div style="position: absolute; z-index: 1500; overflow: hidden; width: 95px; height: 18px; bottom: 119px; right: 360px;">';
webim_tag3 += '			<embed id="swf_8575" width="95" height="18" flashvars="swfid=1747004125&maxSumSize=50&maxFileSize=50&maxFileNum=1&multiSelect=0&uploadAPI=http%3A%2F%2Fupload.api.weibo.com%2F2%2Fmss%2Fupload.json%3Fsource%3D209678993%26tuid%3D1887188824&initFun=STK.wbim.ui.Upload.initFun&sucFun=STK.wbim.ui.Upload.sucFun&errFun=STK.wbim.ui.Upload.errFun&beginFun=STK.wbim.ui.Upload.beginFun&areaInfo=0-40|10-40&fExt=*.jpg;*.gif;*.jpeg;*.png|*&fExtDec=选择图片|选择文件" data="upload.swf" wmode="transparent" bgcolor="" allowscriptaccess="always" allowfullscreen="true" scale="noScale" menu="false" type="application/x-shockwave-flash" src="http://service.weibo.com/staticjs/tools/upload.swf?v=ef8070fdd05ab2a8">';
webim_tag3 += '		</div>';
webim_tag3 += '	-->';
webim_tag3 += '	 ';
webim_tag3 += '</div>';
var sb="<!-- 顶部 -->";
 sb=sb+"      <div class=\"header\" node-type=\"header\">";
 sb=sb+"        <div class=\"appinfo\">";
 sb=sb+"          <div class=\"header_box\"><img node-type=\"head\"></div>";
 sb=sb+"          <h1><a node-type=\"title\" href=\"#\"></a></h1>";
 sb=sb+"          <p class=\"welcomemsg\" node-type=\"welcome\"></p>";
 sb=sb+"        </div>";
 sb=sb+"        <a title=\"%{robottag_close}\" class=\"robot_icon_close\" node-type=\"close_btn\"></a>";
 sb=sb+"        <a title=\"%{robottag_adjust_window}\" node-type=\"max_btn\"></a>";
 sb=sb+"        <a title=\"%{robottag_manual_work}\" class=\"robot_icon_service\" node-type=\"service_btn\"></a>";
 sb=sb+"      </div>";
 sb=sb+"        ";
 sb=sb+"      <!-- 内容-->";
 sb=sb+"      <div class=\"robot_chat_layout\">";
 sb=sb+"      ";
 sb=sb+"        <!-- 聊天框 -->";
 sb=sb+"        <div class=\"chat_box\" node-type=\"chat_box\">";
 sb=sb+"          <div class=\"main_wrap\">";
 sb=sb+"            <!--聊天面板-->";
 sb=sb+"            <div class=\"chatpanel\" node-type=\"chatpanel\"></div>";
 sb=sb+"            <!--输入面板-->";
 sb=sb+"            <div class=\"inputpanel\" node-type=\"inputpanel\">";
 sb=sb+"              <textarea class=\"input_text\" type=\"text\" node-type=\"input_text\" placeholder=\"%{robottag_describe_problem}\"/>";
 sb=sb+"              <div class=\"input_count_box\">";
 sb=sb+"                <i class=\"ask_icon\"></i>%{robottag_enter}<em node-type=\"input_count\">30</em>%{robottag_word}";
 sb=sb+"              </div>";
 sb=sb+"              <a class=\"robot_icon_send\" node-type=\"send_btn\"></a>";
 sb=sb+"            </div>";
 sb=sb+"          </div>";
 sb=sb+"        </div>";
 sb=sb+"        ";
 sb=sb+"        <!-- 右侧 -->";
 sb=sb+"        <div class=\"col_sub appside\" node-type=\"attach_box\">";
 sb=sb+"          <div class=\"skin_side\">";
 sb=sb+"                <!--热点问题-->";
 sb=sb+"                <div class=\"box\">";
 sb=sb+"                  <div class=\"hd hdext\" node-type=\"ext_hot_head\"><h3>%{robottag_hot_issues}</h3></div>";
 sb=sb+"                  <div class=\"bd\" node-type=\"ext_hot_box\"><div class=\"exthot\" node-type=\"ext_hot\"><ul></ul></div></div>";
 sb=sb+"                </div>";
 sb=sb+"                <!--相关内容-->";
 sb=sb+"                <div class=\"box\">";
 sb=sb+"                  <div class=\"hd\" node-type=\"ext_about_head\"><h3>%{robottag_related_issues}</h3></div>";
 sb=sb+"                  <div class=\"bd extabout\" node-type=\"ext_about_box\"><div class=\"exthot\" node-type=\"ext_about\">";
 sb=sb+"                  	<ul><p style='text-align:center;'>%{robottag_norelated_issues}</p></ul>";
 sb=sb+"                  </div></div>";
 sb=sb+"                </div>";
 sb=sb+"         </div>";
 sb=sb+"       </div>";
 sb=sb+"       ";
 sb=sb+"       <!-- <div class=\"drag_icon\" name=\"drag_icon\"></div> -->";
 sb=sb+"    </div>";
webim_tag3 = propReplace(webim_tag3);
sb = propReplace(sb);

function propReplace(str){
	var pattern = /%{\w+}/g;
	var keys = str.match(pattern);
	for(var i = 0; i < keys.length; i++){
		var key = keys[i];
		key = key.substring(2, key.indexOf('}'));
		key = $.trim(key);
		str = str.replace(keys[i], properties[key]);
	}
	return str;
}

var WebIM = function() {
	this.init();
};

(function($) {

	WebIM.prototype = {
		eventDispatcher : null,
		tag : null,
		imList : null,
		imChatbox : null,
		imSysMsg : null,
		friends : null,
		nearList : null,
		groups : null,
		onlines : null,
		userInfo : null,
		statusTimer : null,
		isConnected : false,
		isLoaded : false,
		isCreated : false,
		session : null,

		robotMap : null,

		// 新消息提示控件
		soundControl : null,

		/**
		 * 初始化
		 */
		init : function() {
			this.eventDispatcher = $(this);
			var $this = this;

			// 获取页面展示的html的版本
			var temp = "";
			if (WEB_IM_CONFIG.skin == "1") {
				temp = webim_tag1;
			} else if (WEB_IM_CONFIG.skin == "2") {
				temp = webim_tag2;
			} else if (WEB_IM_CONFIG.skin == "3") {
				temp = webim_tag3;
			} else if (WEB_IM_CONFIG.skin == "4") {
				temp = webim_tag4;
			}

			// 显示
			$("body").append('<div id="wbim_box_container"></div><div id="newMessageDIV" style="display:none"></div>');

			// 发送声音设置
			if ($.browser.msie && ($.browser.version == '8.0' || $.browser.version == '7.0' || $.browser.version == '6.0')) {
				$('#newMessageDIV').html(
						'<embed id="soundControl" src="' + WEB_IM_CONFIG.project_address
								+ 'sound/msg.wav" width="0" height="0" autostart="false"></embed>');
			} else {
				// IE9+,Firefox,Chrome均支持<audio/>
				$('#newMessageDIV').html(
						'<audio id="soundControl" preload="auto"><source src="' + WEB_IM_CONFIG.project_address
								+ 'sound/msg.mp3" type="audio/mp3"><source src="' + WEB_IM_CONFIG.project_address
								+ 'sound/msg.wav" type="audio/wav"/></audio>');
			}
			
			$('#wbim_box_container').html(temp);

			// 获取用户数据
			WEB_IM_CONFIG.openTest ? $this.testGetUserInfo(E.INIT_USER_INFO) : $this.getUserInfo(E.INIT_USER_INFO);
		},

		/**
		 * 初始化界面 应在登录聊天服务器成功后初始化界面
		 */
		initView : function() {
			var $this = this;

			if ($this.isCreated)
				return;

			$this.tag = $("#wbim_box");
			$this.tag.css("display", "block");

			$this.imList = new WebIMList();
			$this.imList.init($this);

			$this.imChatbox = new WebIMChatbox();
			$this.imChatbox.init($this);

			$this.imBar = new WebIMBar();
			$this.imBar.init($this);

			$this.imSysMsg = new WebIMSystemMessage();
			$this.imSysMsg.init($this);

			// 初始化机器人界面
			$this.robotMap = new RobotMap();

			$this.listenerTagEvent();
			$this.listener();

			$this.isCreated = true;

			// 好友列表
			$this.setFriends($this.friends);
			// 群组列表
			$this.setGroups($this.groups);

			$this.imChatbox.createView();

			// 获取声音提示控件对象
			$this.soundControl = document.getElementById("soundControl");
		},
		/**
		 * 监听内部事件
		 */
		listenerTagEvent : function() {

			var $this = this;
		},
		listener : function() {
			var $this = this;
			this.tag.on(E.SELF_STATUS_CHANGE, function(e, data, s) {
				if (s != E.DO_NOT_CONTROL && data.s != E.DO_NOT_CONTROL) {
					$this.sendUserStatus(data);
				}
			}).on(E.ON_SEND_MESSAGE, function(e, data, s) {
				if (s != E.DO_NOT_CONTROL) {
					$this.sendMessage(data);
				}
			}).on(E.ON_SEND_CONTROL, function(e, data, s) {
				if (s != E.DO_NOT_CONTROL) {
					$this.sendControl();
				}
			})
			// 获取聊天记录
			.on(E.GET_CHAT_INFO, function(e, data) {
				if (data.isHistory) {// 查看聊天记录
					$this.trigger("getchatinfo", {
						uid : data.uid,
						start : data.start,
						size : data.size
					});
				} else {// 打开与某个用户的聊天界面，显示最近30条的聊天内容
					$this.trigger("getchatinfo", {
						uid : data.uid,
						start : 0,
						size : 30
					});
				}
			});
		},
		/**
		 * 监听外部事件
		 * 
		 * @param type
		 * @param data
		 */
		innerTrigger : function(type, data, s) {
			data.s = s;
			if (this.tag)
				this.tag.trigger(type, data, s);
		},
		/**
		 * 根据ID获取好友信息
		 * 
		 * @param id
		 * @returns
		 */
		getFriend : function(id) {
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				if (g.gmember) {
					for ( var j = 0; j < g.gmember.length; j++) {
						var f = g.gmember[j];
						if (f.uid == id) {
							return f;
						}
					}
				}
			}
			return null;
		},
		/**
		 * 根据ID获取用户是否在线
		 * 
		 * @param id
		 * @returns {Boolean}
		 */
		getIsOnline : function(id) {
			for ( var i = 0; i < this.onlines.length; i++) {
				var f = this.onlines[i];
				if (f.uid == id) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 通过关键字查询好友
		 */
		getSearchFriends : function(key) {
			var arr = new Array();
			if (!this.friends)
				return arr;
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				if (g.gmember) {
					for ( var j = 0; j < g.gmember.length; j++) {
						var f = g.gmember[j];
						if (f.uname.indexOf(key) != -1) {
							arr.push(f);
						}
					}
				}
			}
			return arr;
		},
		/**
		 * 获取用户状态对应的class名称
		 * 
		 * @param data
		 * @returns {String}
		 */
		getUserStatusStyle : function(data) {
			var status;
			if (typeof (data) === "string" || typeof (data) === "number") {
				status = data;
			} else {
				status = data.status;
			}
			status = parseInt(status);
			switch (status) {
			case 1:
				return "wbim_status_online";// 在线
				break;
			case 2:
				return "wbim_status_busy";// 繁忙
				break;
			case 3:
				return "wbim_status_offline";// 离线
				break;
			}
			return "wbim_status_offline";
		},
		/**
		 * 设置用户状态对应标记的class样式
		 * 
		 * @param tag
		 * @param status
		 */
		setUserStatusStyle : function(tag, status) {
			var s = [ "wbim_status_online", "wbim_status_offline", "wbim_status_busy" ];
			var node = tag.node("wbim_status");
			for ( var i = 0; i < s.length; i++) {
				if (s[i] == status) {
					node.addClass(status);
					tag.attr("data-sort", status);
				} else
					node.removeClass(s[i]);
			}
		},
		/**
		 * 设置好友列表
		 * 
		 * @param data
		 */
		setFriends : function(data) {
			this.imList.setFriends(data);
		},

		/**
		 * 设置群
		 */
		setGroups : function(data) {
			this.imList.setGroups(data);
		},

		/**
		 * 获取最近联系人
		 */
		getNearFriends : function() {
			this.trigger("getNearFriendsEvent");
		},

		/**
		 * 设置最近联系人
		 * 
		 * @param data
		 */
		setNearFriends : function(data) {
			this.nearList = [];
			var arr = new Array();
			for ( var i = 0; i < data.length; i++) {
				arr[i] = {
					uid : data[i].user_id,
					uname : data[i].user_name,
					status : data[i].status,
					skill : data[i].user_skill
				};
				
				this.nearList.push(arr[i]);

				var user = this.getFriend(arr[i].uid);
				if (user) {
					arr[i].icon = user.icon;
				} else {
					arr[i].icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
				}
			}
			this.imList.setNearFriends(arr);
		},
		setOnlines : function(data) {
			// if (data && (data.length > 0)) {
			// var users = data.split(",");
			// if (users) {
			// for (var i = 0; i < users.length; i++) {
			// var user = this.getFriend(users[i]);
			// if (user) {
			// user.status = "1";
			// this.innerTrigger(E.SET_USER_STATUS, user);
			// }
			// }
			// }
			// }
			//
			// return;
			var arr = data;
			if (typeof (data) == "string") {
				arr = data.split(",");
			}
			if (!arr)
				return;

			for ( var i = 0; i < arr.length; i++) {
				var u = arr[i];
				var s = 1;
				if (typeof (u) != "string") {
					s = u.status;
					u = u.user_id;
				}
				var user = this.getFriend(u);
				if (user) {
					user.status = s;
					this.innerTrigger(E.SET_USER_STATUS, user);
				}
			}
		},

		/**
		 * 将所有用户设为离线
		 */
		setAllUsersOffline : function() {
			// 将好友设为离线
			if (this.friends && (this.friends.length > 0)) {
				for ( var i = 0; i < this.friends.length; i++) {
					this.setUserOfflineHandler(this.friends[i].gmember);
				}
			}
			// 将最近联系人设为离线
			this.setUserOfflineHandler(this.nearList);
		},

		/**
		 * 将用户在线状态设为离线的具体操作
		 */
		setUserOfflineHandler : function(list) {
			if (list && (list.length > 0)) {
				for ( var i = 0; i < list.length; i++) {
					var user = list[i];
					user.status = "3";
					this.innerTrigger(E.SET_USER_STATUS, user);
				}
			}
		},

		/**
		 * 设置用户状态（好友）
		 * 
		 * @param data
		 */
		setUserStatus : function(data) {
			if (data.uid == this.userInfo.uid) {
				// 设置自己的状态
				if (this.imList.status != data.status) {
					var type = this.getUserStatusStyle(data.status);
					this.innerTrigger(E.SELF_STATUS_CHANGE, {
						status : data.status,
						cla : type,
						s : E.DO_NOT_CONTROL
					}, E.DO_NOT_CONTROL);
				}
			} else {
				// 设置好友的状态
				/*
				 * var user = this.getFriend(data.uid); 
				 * if(user) { 
				 * user.status = data.status; 
				 * this.innerTrigger(E.SET_USER_STATUS, user); 
				 * }
				 */
				this.innerTrigger(E.SET_USER_STATUS, data);
			}
		},
		/**
		 * 设置其他用户发来的消息
		 * 
		 * @param data
		 */
		setMessage : function(data) {
			// 组装消息内容
			var msg = {
				isSelf : false,
				uid : data.from,
				uname : data.from_name,
				time : data.chat_time,
				date : data.chat_date,
				content : data.msg,
				msg_status : data.msg_status,
				msg_type : data.msg_type,
				itemId: data.itemId,
				vendId: data.vendId
			};

			// 接收到自己发的消息
			if (data.from == this.userInfo.uid) {
				msg.isSelf = true;
				msg.uid = data.to;
				msg.uname = data.to_name;
			}

			// 从好友列表中获取昵称和头像
			var user = this.getFriend(msg.uid);
			if (user) {
				msg.uname = user.uname;
				msg.status = user.status;
				msg.icon = user.icon;
			}
			if (!msg.icon) {
				msg.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
			}

			// 派发
			this.innerTrigger(E.ON_ACCEPT_MESSAGE, msg);

			// 有新消息，播放提示音
			if (this.imChatbox.voiceEnabled) {
				if (this.soundControl != null) {
					this.soundControl.play();
				}
			}

			if (!msg.isSelf) {
				this.innerTrigger(E.HAS_MESSAGE, msg);
			}
		},

		/**
		 * 设置离线消息
		 */
		setOfflineMessage : function(data) {
			for ( var i = 0; i < data.length; i++) {
				var user = data[i];
				var obj = {
					uid : user.from,
					uname : user.from_name,
					count : parseInt(user.msg_status)
				};
				this.innerTrigger(E.ADD_CHAT_USER, obj);
				this.innerTrigger(E.HAS_MESSAGE, obj);
			}
		},
		/**
		 * 获取与某用户的聊天记录 data:Message:Array
		 */
		setUserMessage : function(data) {
			var chats = data.result_message;
			var user = {
				messages : []
			};
			if (chats.length > 0) {
				user.uid = chats[0].from;
				user.uname = chats[0].from_name;
				if (this.userInfo.uid == user.uid) {
					user.uid = chats[0].to;
					user.uname = chats[0].to_name;
				}
				var arr = new Array();
				for ( var i = 0; i < chats.length; i++) {
					var m = chats[i];
					var msg = {
						isSelf : (m.from == this.userInfo.uid),
						// uid:user.uid,
						// uname:user.uname,
						uid : m.from,
						uname : m.from_name,
						date : m.chat_date,
						time : m.chat_time,
						content : m.msg,
						msg_status : m.msg_status
					};
					arr.push(msg);
				}
				user.messages = arr;
			}

			// 分页信息，服务器端放到了user_id字段下
			var str = data.user_id;
			var arr = str.split(",");

			user.start = parseInt(arr[0]);
			user.size = parseInt(arr[1]);
			user.max = parseInt(arr[2]);
			user.count = parseInt((user.max - 1) / user.size + 1);

			if (user.size == 30) {
				this.innerTrigger(E.ADD_MULMESSAGE, user);
			} else {
				this.innerTrigger(E.ADD_HISTORYMESSAGE, user);
			}
		},
		/**
		 * 设置用户在其他页面所做的操作信息
		 * 
		 * @param data
		 */
		setControl : function(data) {
			var i = data.indexOf(",");
			var str = data.substr(i + 1);
			var obj = $.parseJSON(str);
			this.imList.setViewStatus(obj.list);
			this.imChatbox.setViewStatus(obj.box);
			this.imBar.setViewStatus(obj.bar);
		},
		/**
		 * 打开与一个用户的聊天窗口
		 */
		setOpenChatBox : function(data) {
			if (this.isService(data.user_skill) && data.type) {// 在线客服
				var obj = {
					name : data.user_name,
					type : data.type,
					value : data.user_id
				};
				this.getService(obj);
			} else {
				this.innerTrigger(E.OPEN_CHATBOX, {
					uid : data.user_id,
					uname : data.user_name,
					skill : data.user_skill,
					status : data.status,
					type : data.user_type,
					itemId: data.itemId,
					vendId: data.vendId
				});
			}
		},
		
		//设置侧边栏内容
		setSideBar: function(data){
			var uid = data.result_status[0].user_id;
			var id = "baseInfo_" + uid;
			var orderId = "orderInfo_" + uid;
			
			if(document.getElementById(id)){
				$("#" + id).empty();
			} else {
				$("#sidebar_baseInfo").append('<div id="' + id + '"></div>');
			}
			
			if(document.getElementById(orderId)){
				$("#" + orderId).empty();
			} else {
				$("#sidebar_orderInfo").append('<div id="' + orderId + '"></div>');
			}
			
			//对方信息
			if(data.personInfo){
				
				data.personInfo.userId = data.personInfo.userId.replace("_0_", ":");
				data.personInfo.userId = data.personInfo.userId.replace("_at_","@");
				data.personInfo.userId =data.personInfo.userId.replace("_dt_",".");
				
				//个人信息
				var userType = "";
				var skill = data.personInfo.userSkill;
				if(skill == 1){
					if(data.personInfo.userName == properties.webim_visitor){
						userType = properties.webim_visitor;
					} else {
						userType = properties.webim_buyers;
					}
				} else if(skill == 2){
					userType = properties.webim_customer_service;
				}
				
				var t = '<div class="marginT10">'
					+ '<p class="marginT5">'+properties.webim_account_number+'：' + data.personInfo.userId + '</p>'
					+ '<p class="marginT5">'+properties.webim_nickname+'：' + data.personInfo.userName + '</p>'
					+ '<p class="marginT5">'+properties.webim_type+'：' + userType  + '</p>'
					+ '</div>';
				$("#" + id).append(t);
			} else if(data.vendInfo){
				var postStr = data.vendInfo.POST_NUM;
				if(postStr==undefined || postStr ==null || postStr=="null"){
					postStr = "";
				}
				//店铺信息
				var t = '<div class="marginT10">'
					+ '<p class="marginT5">'+properties.webim_company_name+'：' + data.vendInfo.COM_NAME + '</p>'
					+ '<p class="marginT5">'+properties.webim_scopeof_business+'：' + data.vendInfo.MAIN_ITEM + '</p>'
					+ '<p class="marginT5">'+properties.webim_address+'：' + data.vendInfo.ADDR + '</p>'
					+ '<p class="marginT5">'+properties.webim_zipcode+'：' + postStr + '</p>'
					+ '<p class="marginT5">'+properties.webim_telephone+'：' + data.vendInfo.COM_TEL + '</p>'
					+ '</div>';
				$("#" + id).append(t);
			} else if(data.activeInfo && data.activeInfo.length > 0){
				//商城促销活动信息
				var t = '<div class="marginT10">';
				for(var i = 0; i < data.activeInfo.length; i++){
					t += '<p class="marginT5"><a href="/ecweb/' + data.activeInfo[i].COM_NAME + '/notice/showNoticeInfo.htm?NOTICE_ID=' + data.activeInfo[i].NOTICE_ID + '" target="_blank">' + data.activeInfo[i].NOTICE_TITLE + '</a></p>';
				}
				t += '</div>';
				$("#" + id).append(t);
			}
			
			//商品信息
			if(data.itemInfo){
				var t = '<div class="marginT20">';
					if(Channel_CONFIG.rc_url.indexOf("DocCenterService")>-1){
						t = t + '<p align="center"><img src="/DocCenterService/' + data.itemInfo.IMG_URL + '&photo_size=150"/></p>';
					}else{
						t = t + '<p align="center"><img src="' +getResCutPath(data.itemInfo.IMG_URL,'150x150')+'"/></p>';
					}
					
					t = t + '<p>' + data.itemInfo.ITEM_TITLE + '</p>'
					+ '<p align="center"><font color="990000">' + data.itemInfo.PRICE + '</font>&nbsp;'+properties.webim_unit+'</p>'
					+ '</div>';
				$("#" + id).append(t);
			}
			
			//订单信息
			if(data.orderInfo && data.orderInfo.length > 0){
				for(var i = 0; i < data.orderInfo.length; i++){
					var photoid=data.orderInfo[i].IMG_URL;
					if (photoid == null || photoid == undefined) {
						photoid = "image?photo_id=-1";
					}
					var t = '<div class="marginT5">';
						if(Channel_CONFIG.rc_url.indexOf("DocCenterService")>-1){
							t = t + '<p align="center"><img src="/DocCenterService/' + photoid + '&photo_size=150"/></p>';
						}else{
							t = t + '<p align="center"><img src="' +getResCutPath(photoid,'150x150')+'"/></p>';
						}
						
						t = t + '<p>'+properties.webim_order_number+'：' + data.orderInfo[i].CO_NUM + '</p>'
						+ '<p>'+properties.webim_order_time+'：' + data.orderInfo[i].CRT_TIME + '</p>'
						+ '<P>'+properties.webim_order_money+'：<font color="990000">' + data.orderInfo[i].AMT_SUM + '</font> '+properties.webim_unit+'</P>'
						+ '</div>';
					$("#" + orderId).append(t);
				}
			}
		},
		
		//切换默认侧边栏用户
		changeSideBar : function(uid) {
			$("#sidebar_baseInfo").children().each(function(){
				if(this.id == "baseInfo_" + uid){
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			$("#sidebar_orderInfo").children().each(function(){
				if(this.id == "orderInfo_" + uid){
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		},
		
		//自定义侧边栏
		setSideBarNew : function(uid) {
			uid = Channel.uidDecode(uid);
			var custom_siderbar = '<iframe style="border:0px; width:282px; height:462px;" src="' + WEB_IM_CONFIG.sideBar_url + '?userId=' + uid + '"></iframe>';
			$('#im_sidebar_container').html(custom_siderbar);
		},
		
		setServiceStatus : function(list) {
			for ( var i = 0; i < list.length; i++) {
				var data = list[i];
				var type = data.user_type.split("_id");
				type = type[0];
				this.innerTrigger(E.SET_SERVICE_STATUS, {
					type : type,
					value : data.ext,
					status : data.user_id ? "1" : "3"
				});
			}
		},

		/**
		 * 向服务器发送当前用户状态
		 * 
		 * @param data
		 */
		sendUserStatus : function(data) {
			this.trigger("sendstatus", data);
		},

		/**
		 * 向服务器发送与其他用户的聊天消息
		 * 
		 * @param data
		 */
		sendMessage : function(data) {
			var obj = {
				to : data.user.uid,
				to_name : data.user.uname,
				msg : data.content
			};
			this.trigger("sendmessage", obj);
		},

		/**
		 * 向服务器发送操作信息
		 * 
		 * @param data
		 */
		sendControl : function() {
			var $this = this;
			if ($this.statusTimer) {
				clearTimeout($this.statusTimer);
			}
			$this.statusTimer = setTimeout(function() {
				var c = new Object();
				c.list = $this.imList.getViewStatus();
				c.box = $this.imChatbox.getViewStatus();
				c.bar = $this.imBar.getViewStatus();
				var str = $.jsonStringify(c);
				var cu = "";
				if ($this.imChatbox.currentUser) {
					cu += $this.imChatbox.currentUser.uid;
				}
				cu += "," + str;
				$this.trigger("sendcontrol", {
					ext : cu
				});
			}, 50);
		},

		pushMessage : function(data) {
			// alert("接收到推送消息：" + data.msg);
			this.imSysMsg.addSystemMessage(data);
		},

		getService : function(obj) {
			this.trigger("onservice", obj);
		},
		sendCloseService : function(sid, score) {
			this.trigger("closeservice", {
				sid : sid,
				score : score
			});
		},
		sendServiceAppraise : function(uid) {
			if (this.isConnected) {
				this.trigger("appraiseservice", {
					uid : uid
				});
				showAlert(L.serviceSendLabel);
			}
		},

		checkService : function() {
			this.trigger("checkservice", {
				list : this.getServiceList()
			});
		},

		/**
		 * 从用户数据中心获取用户基本信息
		 */
		getUserInfo : function(trigger_event) {
			try {
				var $this = this;

				getCurrentUserInfo(function(data) {
					$this.userInfo = data;
					$this.getFriendsInfo(trigger_event);
				});
			} catch (e) {
				// alert("获取当前用户信息失败"+e);
			}
		},
		/**
		 * 获取好友数据
		 */
		getFriendsInfo : function(trigger_event) {
			var $this = this;
			try {
				var data = {
					type : "2900",
					user_id : $this.userInfo.uid
				};
				$.ajax({
					url : WEB_IM_CONFIG.imUrL + "sendOperate",
					data : {
						data : JSON.stringify(data)
					},
					dataType : WEB_IM_CONFIG.ajaxDataType,
					jsonp : WEB_IM_CONFIG.ajaxJsonp,
					type : "post",
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						alert("err:" + textStatus + ",readyState:" + XMLHttpRequest.readyState + ",errorThrown" + errorThrown);
					},
					success : function(data) {
						if (!data) {
							return;
						}

						if (typeof (data) === "string") {
							data = JSON.parse(data);
						}

						if (!data.friends) {
							$this.friends = [];
						} else {
							for(var i = 0; i < data.friends.length; i++){
								var friend = data.friends[i];
								if (friend.id == "-1" && friend.gname == "默认") {
									friend.gname = properties.webim_default_group;
									break;
								}
							}
							$this.friends = data.friends;
						}

						// 设置分组
						if (!data.groups) {
							$this.groups = [];
						} else {
							$this.groups = data.groups;
						}

						// 设置用户技能
						$this.userInfo.skill = $this.getUserSkill($this.userInfo.skill);

						if ($this.session && WEB_IM_CONFIG.useUserId) {
							$this.userInfo.weibo_uid = '' + $this.userInfo.uid;
							$this.userInfo.uid = $this.userInfo.userId;
							if (!$this.userInfo.uid && $this.session) {
								$this.userInfo.uid = $this.session.userId;
							}
						}

						$this.userInfo.userId = '' + $this.userInfo.userId;
						$this.userInfo.uid = '' + $this.userInfo.uid;
						$this.userInfo.user_type = '' + $this.userInfo.user_type;

						// 应用id，默认是1(0:icity;1:新商盟)
						if (!$this.userInfo.app_id) {
							$this.userInfo.app_id = "ecweb";
						}
						$this.userInfo.app_id = $this.userInfo.app_id;

						// 获取小头像
						if ($this.userInfo.figure) {
							$this.userInfo.icon = $this.userInfo.figure.small;
						}

						// 如果无头像则设置默认头像
						if (!$this.userInfo.icon || $this.userInfo.icon == "") {
							$this.userInfo.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
						}

						if ($this.friends) {
							for ( var i = 0; i < $this.friends.length; i++) {
								var g = $this.friends[i];
								if (g.gmember) {
									for ( var j = 0; j < g.gmember.length; j++) {
										var u = g.gmember[j];
										if (u.figure) {
											u.icon = u.figure.small;
										}
										if (!u.icon || u.icon == "") {
											u.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
										} else {
											u.icon += "&photo_size=30";
										}

										if ($this.session && WEB_IM_CONFIG.useUserId) {
											u.weibo_uid = '' + u.uid;
											if (u.userId) {
												u.uid = u.userId;
											}
										}

										u.uid = '' + u.uid;
										u.userId = '' + u.userId;
										u.tag = g.type;
									}
								} else {
									g.gmember = [];
								}
							}
						}

						$this.trigger(trigger_event);
					}
				});

			} catch (e) {
				alert(properties.webim_getfriends_failure + e);
			}
		},

		testGetFriendsInfo : function(trigger_event) {
			var $this = this;
			var flag = WEB_IM_CONFIG.isCustomer;

			if (flag == "3") {
				// var jsonURL = WEB_IM_CONFIG.project_address + "js/userinfo1.json";
				var jsonURL = WEB_IM_CONFIG.project_address + "../test/friendsinfo2.json";
			} else if (flag == "0") {
				// var jsonURL = WEB_IM_CONFIG.project_address + "js/userinfo.json";
				var jsonURL = WEB_IM_CONFIG.project_address + "../test/friendsinfo3.json";
			} else if (flag == "4") {
				var jsonURL = "friendsinfo4.json";
			} else {
				// var jsonURL = WEB_IM_CONFIG.project_address + "js/userinfo.json";
				var jsonURL = WEB_IM_CONFIG.project_address + "../test/friendsinfo1.json";
			}

			try {
				$.ajax({
					url : jsonURL,
					dataType : "json",
					type : "get",
					error : function(data) {
						// alert("userinfo.json加载失败!");
					},
					success : function(data) {
						if (!data) {
							alert(properties.webim_notget_user);
							return;
						}
						// alert("加载成功！");
						if (typeof (data) === "string") {
							data = JSON.parse(data);
						}
						// $this.userInfo = data.userinfo;

						if (!data.friends) {
							$this.friends = [];
						} else {
							$this.friends = data.friends;
						}

						// 设置分组
						if (!data.groups) {
							$this.groups = [];
						} else {
							$this.groups = data.groups;
						}

						// 设置用户技能
						$this.userInfo.skill = $this.getUserSkill($this.userInfo.skill);

						if ($this.session && WEB_IM_CONFIG.useUserId) {
							$this.userInfo.weibo_uid = '' + $this.userInfo.uid;
							$this.userInfo.uid = $this.userInfo.userId;
							if (!$this.userInfo.uid && $this.session) {
								$this.userInfo.uid = $this.session.userId;
							}
						}

						$this.userInfo.userId = '' + $this.userInfo.userId;
						$this.userInfo.uid = '' + $this.userInfo.uid;
						$this.userInfo.user_type = '' + $this.userInfo.user_type;
						if (!$this.userInfo.app_id)
							$this.userInfo.app_id = "iop";
						$this.userInfo.app_id = '' + $this.userInfo.app_id;

						if ($this.userInfo.figure) {
							$this.userInfo.icon = $this.userInfo.figure.small;
						}
						// 如果无头像则设置默认头像
						if (!$this.userInfo.icon || $this.userInfo.icon == "") {
							$this.userInfo.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
						}
						if ($this.friends) {
							for ( var i = 0; i < $this.friends.length; i++) {
								var g = $this.friends[i];
								if (g.gmember) {
									for ( var j = 0; j < g.gmember.length; j++) {
										var u = g.gmember[j];
										if (u.figure) {
											u.icon = u.figure.small;
										}
										if (!u.icon || u.icon == "") {
											u.icon = WEB_IM_CONFIG.project_address + IM_CONFIG.DEFAULT_ICON;
										}

										if ($this.session && WEB_IM_CONFIG.useUserId) {
											u.weibo_uid = '' + u.uid;
											if (u.userId) {
												u.uid = u.userId;
											}
										}

										u.uid = '' + u.uid;
										u.userId = '' + u.userId;
										u.tag = g.type;
									}
								} else {
									g.gmember = [];
								}
							}
						}

						$this.trigger(trigger_event);
					}
				});
			} catch (e) {
				// alert("获取好友信息失败"+e);
			}

		},

		/**
		 * 测试专用---从用户数据中心获取用户基本信息
		 */
		testGetUserInfo : function(trigger_event) {

			var $this = this;

			getCurrentUserInfo(function(data) {
				$this.userInfo = data;
				$this.testGetFriendsInfo(trigger_event);
			});
		},

		/**
		 * 计算用户的skill值，新商盟传的是true，icity传的是1、2、3。为了统一，将true设置为2，默认为1
		 */
		getUserSkill : function(skill) {
			if (skill == "1")
				return "1";
			if (skill == "2")
				return "2";
			if (skill == "3")
				return "3";
			if (skill)
				return "2";
			return "1";
		},

		/**
		 * 判断用户是否是客服
		 */
		isService : function(skill) {
			if (skill == "2") {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 设置默认skill
		 */
		getDefaultSkill : function(skill) {
			if (!skill || (skill == "undefined") || (skill.length == 0)) {
				return "1";
			}
			return skill;
		},

		getFriendsID : function() {
			var str = "";
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				var l = g.gmember.length;
				for ( var j = 0; j < l; j++) {
					var f = g.gmember[j];
					if (!this.isRobot(f.skill)) {
						if (f.uid) {
							str += f.uid + ",";
						}
					}
				}
			}
			if (str)
				return str.substring(0, str.length - 1);
			return "";
		},

		getServiceList : function() {
			for ( var i = 0; i < this.friends.length; i++) {
				var g = this.friends[i];
				if (g.type == "service") {
					return g.gmember;
				}
			}
		},

		/** *******************************机器人相关***************************** */
		/**
		 * 判断用户是否是机器人
		 */
		isRobot : function(skill) {
			if (skill == "3") {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * 打开与机器人聊天对话框
		 */
		openRobotBox : function(user) {
			var robot = this.robotMap.get(user.uid);
			if (!robot) {
				robot = new Robot();
				robot.openBox(user);
				this.robotMap.put(user.uid, robot);
			}
		},

		// 收到机器人推送来的聊天答案
		pushRobotMessage : function(data) {
			var robot = this.robotMap.get(data.from);
			if (robot)
				robot.pushRobotMessage(data);
		},

		// 收到机器人推送来的热门问题
		pushHotMessage : function(data) {
			var robot = this.robotMap.get(data.user_id);
			if (robot)
				robot.pushHotMessage(data);
		},

		// 收到机器人推送来的相关问题
		pushAboutMessage : function(data) {
			var robot = this.robotMap.get(data.user_id);
			if (robot)
				robot.pushAboutMessage(data);
		},

		/** ************************************************************ */
		on : function(eventName, func, scope) {
			if (this.eventDispatcher && this.eventDispatcher.on) {
				this.eventDispatcher.on.apply(this.eventDispatcher, arguments);
			}
		},
		off : function(eventName, func, scope) {
			if (this.eventDispatcher && this.eventDispatcher.off) {
				this.eventDispatcher.off.apply(this.eventDispatcher, arguments);
			}
		},
		trigger : function(eventName, args) {
			if (this.eventDispatcher && this.eventDispatcher.trigger) {
				this.eventDispatcher.trigger.apply(this.eventDispatcher, arguments);
			}
		}
	};

})(jQuery);

var _globalWebIM = null;
WebIM.newInstance = function() {
	if (_globalWebIM == null)
		_globalWebIM = new WebIM();
	return _globalWebIM;
};
WebIM.getInstance = function() {
	return _globalWebIM;
};/**
 * 获取某种尺寸的图片路径
 * 如果路径为空和size 都为空，则返回默认图片原图路径。
 * 			如果size不为空，返回指定size尺寸的默认图片路径
 * @param path
 *            原图路径
 * @param size
 *            尺寸，比如100x100
 */

function getResCutPath(path, size) {
	//默认图片路径
	var defaultRes = "/res/default/default.png";
	
	if (null == path || "" == path) {
		if (size != "null" && size != "" && size != undefined && size != null) {
			defaultRes = "/res/default/" + size + "/default.png";
		}
		return defaultRes;
	}
	//大小为空，则返回原图
	if (size == "null" || size == "" || size == undefined || size == null) {
		return path;
	}
	
	var pos = path.lastIndexOf("/");
	return path.substring(0, pos + 1) + size + path.substring(pos);
}
