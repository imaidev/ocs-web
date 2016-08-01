(function($) {
// autocomplete 自动完成搜索 
jQuery.autoselect = function(input, options) {
	// Create a link to self
	var me = this;
	aObj = input.nextSibling;
	aObj = aObj ? (aObj.nodeType == 3 ? aObj.nextElementSibling
			: aObj) : aObj;
	// Create jQuery object for input element
	var $input = $(input).attr("autoselect", "off");
	var pos = findPos(input);
	var hiddenInput = document.createElement("input");
	$(hiddenInput).hide().attr("name",$(input).attr("name")).css({'top':pos.y+"px",'left':pos.x+"px",'position':'absolute'});
	$(input).removeAttr("name").after(hiddenInput);
	// Apply inputClass if necessary
	if (options.inputClass) $input.addClass(options.inputClass);
	// Create results
	var results = document.createElement("div");
	// Create jQuery object for results
	var $results = $(results);
	$results.hover(function(){},function(){
		$results.hide();
	})
	$results.hide().addClass(options.resultsClass).css("position", "absolute");
	if( options.width > 0 ) $results.css("width", options.width);
    
	// Add to body element
	$("body").append(results);

	input.autocompleter = me;
   
	var timeout = null;
	var prev = "";
	var active = -1;
	var cache = {};
	var keyb = false;
	var hasFocus = false;
	var lastKeyPressCode = null;
	var key1 = [],value1 = [],j = 0;
	var stMatchSets = {};
	var allSelectValue='';
	var allSelectKey='';
	var arrowShowData=[];
	$(input).bind('click',function(){
		allSelectValue='';
		allSelectKey='';
	});
	// flush cache
	function flushCache(){
		cache = {};
		cache.data = {};
		cache.length = 0;

	};
	// flush cache
	flushCache();
	Array.prototype.indexOf=function(s){
        var ntype=typeof testZi;
        for(var i=0;i<this.length;i++){
                if(s===this[i]){
                                return i;
                }
        }
        return -1
};
	if( (typeof options.url == "string") && (options.url.length > 0) ){
		$.ajax({
			type : 'post',
			url : options.url,
			dataType : 'json',
			contentType : 'application/json',
			success : function(data) {
				if(!options.data){
					options.data = [];
				}
				options.data = options.data.concat(data);
				initdataindex(options.data);
			},
			error : function() {
			}
		});
	// if there's been no data found, remove the loading class
	} else{
		initdataindex(options.data);
	}
	function initdataindex(allData) {	
		if( allData != null ){
		var sFirstChar = "",sFirstKey = "" ,row = [];

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( typeof options.url != "string" ) options.cacheLength = 1;
        // loop through the array and create a lookup structure
		for( var i=0; i < allData.length; i++ ){
			// if row is a string, make an array otherwise just reference the array
			row =  allData[i];
            for(var r in row){
            	key1[j] = r;
            	value1[j] = row[r];
            	if(typeof value1[j]=="object"){
            		initdataindex(value1[j]);
				}else{
            	var jsonobj = {};
            	jsonobj[r] = row[r];
				if( value1[j].length > 0 ){
					// get the first character
					arrowShowData[key1[j]]=value1[j];
					sFirstChar = value1[j].substring(0, 1).toLowerCase();
					sFirstKey = key1[j].substring(0, 1).toLowerCase();
					// if no lookup array for this character exists, look it up now
					if( !stMatchSets[sFirstChar] ){ stMatchSets[sFirstChar] = [];}
					if( !stMatchSets[sFirstKey] ){ stMatchSets[sFirstKey] = [];}
					// if the match is a string
					stMatchSets[sFirstChar].push(jsonobj);
					stMatchSets[sFirstKey].push(jsonobj);	
				}
				j++;
				}
				
            }
		}

		// add the data items to the cache
		for( var k in stMatchSets ){
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			addToCache(k, stMatchSets[k]);
		}

	}
		};

	$input
	.keydown(function(e) {
		// track last key pressed
		lastKeyPressCode = e.keyCode;
		switch(e.keyCode) {
			case 38: // up
				e.preventDefault();
				moveSelect(-1);
				break;
			case 40: // down
				e.preventDefault();
				moveSelect(1);
				break;
			case 9:  // tab
			case 13: // return
				if( selectCurrent() ){
					// make sure to blur off the current field
					$input.get(0).blur();
					e.preventDefault();
					$results.hide();
				}
				break;
			default:
				active = -1;
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(function(){onChange();}, options.delay);
				break;
		}
	})
	.focus(function(){
		// track whether the field has focus, we shouldn't process any results if the field no longer has focus
		hasFocus = true;
	})
	/*.blur(function() {
		// track whether the field has focus
		hasFocus = false;
		hideResults();
	})*/;

	//hideResultsNow();

	function onChange() {
		// ignore if the following keys are pressed: [del] [shift] [capslock]
		if( lastKeyPressCode == 46 || (lastKeyPressCode > 8 && lastKeyPressCode < 32) ) return $results.hide();
		var v = $input.val();
		var index1=value1.indexOf(v);
		/*if(index1!="-1"){
			$(hiddenInput).val(key1[index1]);
		}else{
			$(hiddenInput).val(v);
		}*/
		if (v == prev) return;
		prev = v;
		if (v.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			requestData(v);
		} else {
			$input.removeClass(options.loadingClass);
			$results.hide();
		}
	};

 	function moveSelect(step) {
 		
		var lis = $("li", results);
		if (!lis) return;

		active += step;

		if (active < 0) {
			active = 0;
		} else if (active >= lis.size()) {
			active = lis.size() - 1;
		}

		lis.removeClass("ac_over");

		$(lis[active]).addClass("ac_over");

	};

	function selectCurrent() {
		var li = $("li.ac_over", results)[0];
		if (!li) {
			var $li = $("li", results);
			if (options.selectOnly) {
				if ($li.length == 1) li = $li[0];
			} else if (options.selectFirst) {
				li = $li[0];
			}
		}
		if (li) {
			selectItem(li);
			return true;
		} else {
			return false;
		}
	};

	function selectItem(li) {
		if (!li) {
			li = document.createElement("li");
			li.extra = [];
			li.selectValue = "";
		}
		var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
		input.lastSelected = v;
		prev = v;
		//$results.html("");
		$input.val(v);
		//hideResultsNow();
		if (options.onItemSelect) setTimeout(function() { options.onItemSelect(li) }, 1);
		var v = $input.val();
		var index1=value1.indexOf(v);
		if(index1!="-1"){
			$(hiddenInput).val(key1[index1]);
		}else{
			$(hiddenInput).val(v);
		}
	};

	function multiSelectItem(li,isAdd){
		if (!li) {
			li = document.createElement("li");
			li.extra = [];
			li.selectValue = "";
		}
		var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
		input.lastSelected = v;
		var index1=value1.indexOf(input.lastSelected);
		prev = v;
		if(isAdd==1){
		   if(allSelectValue==""){
			   allSelectValue=input.lastSelected;
			   allSelectKey=key1[index1];
		   }else{
               allSelectValue=allSelectValue+","+input.lastSelected;
               allSelectKey=allSelectKey+","+key1[index1];
		   }
		}else{
		  var allSelectValueMap = allSelectValue.split(",");
		  var allSelectKeyMap = allSelectKey.split(",");
		  for(var m=0,n=allSelectValueMap.length;m<n;m++){
			  if(input.lastSelected==allSelectValueMap[m]){
				  allSelectValueMap[m]=""; 
				  allSelectKeyMap[m]="";
			  }
		  }
		  allSelectValue=  allSelectValueMap.join(''); 
		  allSelectKey=allSelectKeyMap.join('');
		}
	    $input.val(allSelectValue);
	    $(hiddenInput).val(allSelectKey);
		if (options.onItemSelect) setTimeout(function() { options.onItemSelect(li) }, 1);
	/*	if(index1!="-1"){
				if(isAdd==1){
					   if(allSelectKey==""){
						   allSelectKey=key1[index1];
					   }else{
						   allSelectKey=allSelectKey+","+key1[index1];
					   }
					}else{
					  var allSelectKeyMap = allSelectKey.split(",");
					  for(var m=0,n=allSelectKeyMap.length;m<n;m++){
						  if(key1[index1]==allSelectKeyMap[m]){
							  allSelectKeyMap[m]=""; 
						  }
					  }
					  allSelectKey =  allSelectKeyMap.join(''); 
					}
			$(hiddenInput).val(allSelectKey);
		}else{
			$(hiddenInput).val(v);
		}*/
	}

	// selects a portion of the input string
	function createSelection(start, end){
		// get a reference to the input element
		var field = $input.get(0);
		if( field.createTextRange ){
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if( field.setSelectionRange ){
			field.setSelectionRange(start, end);
		} else {
			if( field.selectionStart ){
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	};

	// fills in the input box w/the first match (assumed to be the best match)
	function autoFill(sValue){
		// if the last user key pressed was backspace, don't autofill
		if( lastKeyPressCode != 8 ){
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(prev.length));
			// select the portion of the value not typed by the user (so the next character will erase)
			createSelection(prev.length, sValue.length);
		}
	};

	function showResults() {
		// get the position of the input field right now (in case the DOM is shifted)
		var pos = findPos(input);
		// either use the specified width, or autocalculate based on form element
		var iWidth = (options.width > 0) ? options.width : $($input).outerWidth();
		// reposition
		$results.css({
			'width': parseInt(iWidth-2) + "px",
			'top': (pos.y + input.offsetHeight) + "px",
			'left': pos.x + "px",
			'z-index':'99',
			'overflow':'auto'
		}).show();
	};

	function hideResults() {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		if (timeout) clearTimeout(timeout);
		$input.removeClass(options.loadingClass);
		if ($results.is(":visible")) {
			$results.hide();
		}
		if (options.mustMatch) {
			var v = $input.val();
			if (v != input.lastSelected) {
				selectItem(null);
			}
		}
	};

	function receiveData(q, data) {
		if (data) {
			$input.removeClass(options.loadingClass);
			results.innerHTML = "";

			// if the field no longer has focus or if there are no matches, do not display the drop down
			if( !hasFocus || data.length == 0 ) return hideResultsNow();

//			if ($.browser.msie) {
//				// we put a styled iframe behind the calendar so HTML SELECT elements don't show through
//				$results.append(document.createElement('iframe'));
//			}
			results.appendChild(dataToDom(data));
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			if( options.autoFill && ($input.val().toLowerCase() == q.toLowerCase()) ) autoFill(data[0]);
			showResults();
		} else {
			hideResultsNow();
		}
	};

	function parseData(data) {
		if (!data) return null;
		var parsed = [];
		var rows = data.split(options.lineSeparator);
		for (var i=0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				parsed[parsed.length] = row.split(options.cellSeparator);
			}
		}
		return parsed;
	};
    function arrowToDom(data){
		var ul = document.createElement("ul");
		var num = data.length;
		var rowdata="";
		// limited results to a max number
		//if( (options.maxItemsToShow > 0) && (options.maxItemsToShow < num) ) num = options.maxItemsToShow;
		for (var i=0; i < num; i++) {
			
			var row = data[i];
			if (!row) continue;
			rowdata = row;
			var li = document.createElement("li");
			if (li.formatItem) {
				li.innerHTML = options.formatItem(row, i, num);
				li.selectValue = rowdata;
			} else {
				li.innerHTML = rowdata;
				li.selectValue = rowdata;
			}
			var extra = null;
			if (row.length > 1) {
				extra = [];
				for (var j=1; j < row.length; j++) {
					extra[extra.length] = row[j];
				}
			}
			if(options.isMulti){
				//var span = document.createElement("span");
				//$(span).attr("asLi",rowdata);
				$(li).addClass('auto_select_checkbox');
				//li.appendChild(span);	
				li.extra = extra;
				ul.appendChild(li);
				$(li).hover(
					function() { 
						$("li", ul).removeClass("ac_over"); 
					    $(this).addClass("ac_over"); 
					    //active = $("li", ul).indexOf($(this).get(0)); 
					    },
					function() { $(this).removeClass("ac_over"); }
				).click(function(e) { 
					if($(this).hasClass("ac_selected_li")){
					   $(this).removeClass("ac_selected_li");
					   e.preventDefault(); 
						e.stopPropagation(); 
						multiSelectItem(this,-1);
					}else{
					   $(this).addClass("ac_selected_li");
					   e.preventDefault(); 
						e.stopPropagation(); 
						multiSelectItem(this,1);
					}
					});
			}else{
			   li.extra = extra;
			   ul.appendChild(li);
			   $(li).hover(
				 function() { 
					 $("li", ul).removeClass("ac_over"); 
				     $(this).addClass("ac_over"); 
				     //active = $("li", ul).indexOf($(this).get(0)); 
				     },
				 function() { $(this).removeClass("ac_over"); }
			   ).click(function(e) { e.preventDefault(); e.stopPropagation(); selectItem(this) });
			}
		}
		return ul;	
    }
	function dataToDom(data) {
		var ul = document.createElement("ul");
		var num = data.length;
		var rowdata="";
		// limited results to a max number
		if( (options.maxItemsToShow > 0) && (options.maxItemsToShow < num) ) num = options.maxItemsToShow;
		for (var i=0; i < num; i++) {
			var row = data[i];
			if (!row) continue;
			for( var r in row){
				rowdata = row[r];
			}
			var li = document.createElement("li");
			if (li.formatItem) {
				li.innerHTML = options.formatItem(row, i, num);
				li.selectValue = rowdata;
			} else {
				li.innerHTML = rowdata;
				li.selectValue = rowdata;
			}
			var extra = null;
			if (row.length > 1) {
				extra = [];
				for (var j=1; j < row.length; j++) {
					extra[extra.length] = row[j];
				}
			}
			if(options.isMulti){
				//var span = document.createElement("span");
				//$(span).attr("asLi",rowdata);
				$(li).addClass('auto_select_checkbox');
				//li.appendChild(span);	
				li.extra = extra;
				ul.appendChild(li);
				$(li).hover(
					function() { 
						$("li", ul).removeClass("ac_over"); 
					    $(this).addClass("ac_over"); 
					    //active = $("li", ul).indexOf($(this).get(0)); 
					    },
					function() { $(this).removeClass("ac_over"); }
				).click(function(e) { 
					if($(this).hasClass("ac_selected_li")){
					   $(this).removeClass("ac_selected_li");
					   e.preventDefault(); 
						e.stopPropagation(); 
						multiSelectItem(this,-1);
					}else{
					   $(this).addClass("ac_selected_li");
					   e.preventDefault(); 
						e.stopPropagation(); 
						multiSelectItem(this,1);
					}
					});
			}else{
			   li.extra = extra;
			   ul.appendChild(li);
			   $(li).hover(
				 function() { 
					 $("li", ul).removeClass("ac_over"); 
				     $(this).addClass("ac_over"); 
				     //active = $("li", ul).indexOf($(this).get(0)); 
				     },
				 function() { $(this).removeClass("ac_over"); }
			   ).click(function(e) { e.preventDefault(); e.stopPropagation(); selectItem(this) });
			}
		}
		return ul;
	};

	function requestData(q) {
		if (!options.matchCase) q = q.toLowerCase();
		var data = options.cacheLength ? loadFromCache(q) : null;
		// recieve the cached data
		if (data) {
			receiveData(q, data);
		// if an AJAX url has been supplied, try loading the data now
		} 
		//ajax 一次请求所有数据，不做多次查询，此处功能关闭
		else if( (typeof options.url == "string") && (options.url.length > 0) ){
			$.get(makeUrl(q), function(data) {
				data = parseData(data);
				addToCache(q, data);
				receiveData(q, data);
			});
		// if there's been no data found, remove the loading class
		} 
		else {
			$input.removeClass(options.loadingClass);
		}
	};

	function makeUrl(q) {
		var url = options.url + "?q=" + encodeURI(q);
		for (var i in options.extraParams) {
			url += "&" + i + "=" + encodeURI(options.extraParams[i]);
		}
		return url;
	};

	function loadFromCache(q) {
		if (!q) return null;
		if (cache.data[q]) return cache.data[q];
		if (options.matchSubset) {
			for (var i = q.length - 1; i >= options.minChars; i--) {
				
				var qs = q.substr(0, i);
				var c = cache.data[qs];
				if (c) {
					var csub = [];
					for (var j = 0; j < c.length; j++) {
						var x = c[j];
						if (matchSubset(x, q)) {
							csub[csub.length] = x;
						}
					}
					return csub;
				}
			}
		}
		return null;
	};

	function matchSubset(s, sub) {
		if (!options.matchCase)
		for (var a in s){
			var i = a.indexOf(sub);
			var si = s[a].toLowerCase().indexOf(sub);
			if (i != -1) return true;
			if(si != -1) return true;
			return false;
		}	

	};

	this.flushCache = function() {
		flushCache();
	};

	this.setExtraParams = function(p) {
		options.extraParams = p;
	};

	this.findValue = function(){
		var q = $input.val();

		if (!options.matchCase) q = q.toLowerCase();
		var data = options.cacheLength ? loadFromCache(q) : null;
		if (data) {
			findValueCallback(q, data);
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			$.get(makeUrl(q), function(data) {
				data = parseData(data)
				addToCache(q, data);
				findValueCallback(q, data);
			});
		} else {
			// no matches
			findValueCallback(q, null);
		}
	}

	function findValueCallback(q, data){
		if (data) $input.removeClass(options.loadingClass);

		var num = (data) ? data.length : 0;
		var li = null;

		for (var i=0; i < num; i++) {
			var row = data[i];

			if( row[0].toLowerCase() == q.toLowerCase() ){
				li = document.createElement("li");
				if (options.formatItem) {
					li.innerHTML = options.formatItem(row, i, num);
					li.selectValue = row[0];
				} else {
					li.innerHTML = row[0];
					li.selectValue = row[0];
				}
				var extra = null;
				if( row.length > 1 ){
					extra = [];
					for (var j=1; j < row.length; j++) {
						extra[extra.length] = row[j];
					}
				}
				li.extra = extra;
			}
		}

		if( options.onFindValue ) setTimeout(function() { options.onFindValue(li) }, 1);
	}

	function addToCache(q, data) {
		if (!data || !q || !options.cacheLength) return;
		if (!cache.length || cache.length > options.cacheLength) {
			flushCache();
			cache.length++;
		} else if (!cache[q]) {
			cache.length++;
		}
		cache.data[q] = data;
	};
	function addKeyToCache(q, data) {
		if (!data || !q || !options.cacheLength) return;
		if (!cache.length || cache.length > options.cacheLength) {
			flushCache();
			cache.length++;
		} else if (!cache[q]) {
			cache.length++;
		}
		cache.key[q] = data;
	};

	function findPos(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {x:curleft,y:curtop};
	};
	$(aObj).bind('click',function(){
		results.innerHTML = "";
		//alert(arrowShowData.join(''));
		results.appendChild(arrowToDom(arrowShowData));
		showResults();
	})
	
	
}
jQuery.fn.autoselect = function(options) {
	// Make sure options exists
	options = options || {};
	// Set url as option
	options.url = options.url;
	// set some bulk local data
	options.data = ((typeof options.data == "object") && (options.data.constructor == Array)) ? options.data : null;
	// Set default values for required options
	options.inputClass = options.inputClass || "ac_input";
	options.resultsClass = options.resultsClass || "ac_results";
	options.lineSeparator = options.lineSeparator || "\n";
	options.cellSeparator = options.cellSeparator || "|";
	options.minChars = options.minChars || 1;
	options.delay = options.delay || 10;
	options.matchCase = options.matchCase || 0;
	options.matchSubset = options.matchSubset || 1;
	options.matchContains = options.matchContains || 0;
	options.cacheLength = options.cacheLength || 1;
	options.mustMatch = options.mustMatch || 0;
	options.extraParams = options.extraParams || {};
	options.loadingClass = options.loadingClass || "ac_loading";
	options.selectFirst = options.selectFirst || false;
	options.selectOnly = options.selectOnly || false;
	options.maxItemsToShow = options.maxItemsToShow || 10;
	options.autoFill = options.autoFill || false;
	options.width = parseInt(options.width, 10) || 0;
	options.isSelect = options.isMulti || false;
	this.each(function() {
			var input;
			var autoselect=1; //带下拉
			var autoinput=0;  //只是输入框
		    if(this.tagName.toLowerCase()=="label"){
		    	$(this).width($('input.autoSelect',$(this)).width()+$('a.autoSelect',$(this)).width());
		    	$(this).height($('input.autoSelect',$(this)).height());
		    	$('a.autoSelect',$(this)).css('left',$('input.autoSelect',$(this)).width());
		    	input = $('input.autoSelect',$(this)).get(0);
		    	
		    }else if(this.tagName.toLowerCase()=="input"){
		    	input=this;
		    }  	
		    new jQuery.autoselect(input, options);		    
	});

	// Don't break the chain
	return this;
}
})(jQuery);