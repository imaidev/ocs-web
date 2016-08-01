(function($) {
	$.fn.commonHelp=function(helpId,relHidden,where,options,callBack){
		
		var opts = $.extend({}, $.fn.commonHelp.defaults, options);
		
		var $this=$(this);
		
		$this.each(function(){
			$(this).append("<div class='arrow'></div><div class='result'><div class='content'></div></div>");
			var $input=$(this).find("input.text");
			if(!$input.attr("name")){
				$input.attr("name",Math.floor(Math.random()*10000000));
			}
		})
		
		if(where!=""){
			where="&"+where;
		}
		
		
		$.ajax({
			type:'post',
			dataType:'json',
			url:'v6pubCommonHelpCmd.cmd?method=queryPubCommonHelp',
			data:{helpId:helpId},
			success:function(base){

				var resultBox=ResultBox($this,helpId,relHidden,where,opts,callBack,base);
				resultBox.init();
				
				var helpList=HelpList(resultBox,$this,helpId,where,opts,base);
				if(!window.commonHelpDomReady){
					helpList.domInit();
				}
				
				$(".arrow",$this).click(function(){
					var page=1;
					var loadi=layer.load(0);
					helpList.setLastResult();
					helpList.getData(page,function(count){
						Pagination(count,helpList);//初始化分页控制按钮
						ResultSearch(helpList);
						helpList.layerShow();
						layer.close(loadi);
					});
				})
				
				$this.find("input.text").chAutoComplete(resultBox,helpId,relHidden,where,opts,base)
			}
		})
		return $this;
		
	}
	/**
	 * 默认参数
	 */
	$.fn.commonHelp.defaults={
			multiSelect:true
		}
	/**
	 *快捷结果
	**/
	var ResultBox=function(box,helpId,relHidden,where,opts,callBack,base){
		
		var container=$(".result",box),
		$helpText=$(".text",box),
		$relHidden=$(relHidden),
		idStr=$relHidden.val(),
		idArr=[],
		resultArr=[],
		t;	
		
		function showAndHide(){
			if(resultArr.length>0){
				container.show();
				t=setTimeout(function(){
					container.hide();
				},2000)
			}
		}

		function setHelpText(n){
			if(n==0){
				$helpText.val("");
			}else{
				$helpText.val("已选中"+n+"个结果");
			}
		}

		function addItems(items){
			if(items.length==0){
				clearResults();
			}
			for(var i=0;i<items.length;i++){
				var itemData=items[i];
				var itemId=itemData[sName(base.idField)];
				if(idArr.in_array(itemId)==false){
					resultArr.push(itemData);
					idArr.push(itemId);
					idStr=idArr.join(",");
					$relHidden.val(idStr);
					var html="";
					html+="<div class='item' itemId='"+itemData[sName(base.idField)]+"'>";
					html+="<span class='item-text'>"+itemData[sName(base.codeField)]+"#"+itemData[sName(base.nameField)]+"</span>";
					html+="<div class='remove'></div>";
					html+="</div>";
					$(".content",container).append($(html).data("data",itemData));
					setHelpText(idArr.length);
				}
			}
			showAndHide();
			if(callBack){
				callBack(resultArr);
			}
			
		}
		
		function deleteItem(itemData){
			var itemId=itemData[sName(base.idField)];
			for(var i=0;i<idArr.length;i++){
				if(itemId==idArr[i]){
					idArr.splice(i,1);
					resultArr.splice(i,1);
					idStr=idArr.join(",");
					$relHidden.val(idStr);
					$(".item[itemId='"+itemId+"']",container).remove();
					setHelpText(idArr.length);
				}
			}
			if(callBack){
				callBack(resultArr);
			}
		}
		
		function clearResults(){
			resultArr=[];
			idArr=[];
			idStr="";
			$relHidden.val("");
			container.hide().find(".content").html("");
			setHelpText(0);
		}
		
		
		var Events={
			remove:function(){
				$(container).on("click",".remove",function(){
					var $item=$(this).closest(".item");
					var itemData=$item.data("data");
					deleteItem(itemData);
				})
			},
			hover:function(){
				box.hover(function() {
					clearTimeout(t);
					if(resultArr.length>0){
						if($helpText.val().indexOf("已选中")>-1){
							container.show();
						}
					}
				},function(){
					t=setTimeout(function(){
						container.hide();
					},500)
				});
			},
			keyDown:function(){
				$helpText.keyup(function(){
					if($helpText.val().length>0){
							container.hide();
					}
				})
			},
			helpText:function(){
				$helpText.focus(function() {
					var $this=$(this);
					if ($this.val().indexOf("已选中")>-1) {
						$this.val("").addClass("active");
					}
				});
				$helpText.blur(function() {
					var $this=$(this);
					if($this.val()==""){
						setHelpText(idArr.length);
					}
					$this.removeClass("active");
				});
			}
			
			
		}
		return {
			init:function(){
				for(one in Events){
					Events[one]();
				}
				if(idStr==""){
					if(callBack){
						callBack(resultArr);
					}
					return ;
				}
				$.ajax({
					type:'post',
					dataType:'json',
					url:'v6pubCommonHelpCmd.cmd?method=queryDataById'+where,
					data:{helpId:helpId,idStr:idStr},
					beforeSend:function(){},
					success:function(obj){
						addItems(obj);
					}
				})
			},
			show:function(){
				showAndHide();
			},
			hide:function(){
				container.hide();
			},
			addItems:function(items){
				addItems(items);
			},
			deleteItems:function(itemData){
				deleteOneItem(itemData);
			},
			clearResults:function(){
				clearResults();
			},
			getResultArr:function(){
				return resultArr;
			},
			getIdArr:function(){
				return idArr;
			},
			getIdStr:function(){
				return idStr;
			}
		}
	}
	
	/**
	 *弹出框
	**/
	var HelpList=function(resultBox,box,helpId,where,opts,base){
		var helplistlayer;
		var Events={
			itemRemove:function(){
				$("#helplist .result").on("click",".remove",function(){
					var item=$(this).closest(".item");
					var itemId=item.attr("itemId");
					item.remove();
					$("#"+itemId,"#helplist").attr("checked",false);
					layer.autoArea(helplistlayer);
				})
			},
			clear:function(){
				$("#helplist .title .clear").click(function(event){
					$("#helplist .result").html("");
					$("#helplist .checkbox").attr("checked",false);
					layer.autoArea(helplistlayer);
				})
			},
			close:function(){
				$("#helplist .title .close").click(function(e){   
					layer.close(helplistlayer);
					$("#helplist").unbind().find("*").unbind();
				})
			},
			confirm:function(){
				$("#helplist .title .confirm").click(function(event){
					var datas=[];
					var items=$("#helplist .result .item");
					for(var i=0;i<items.length;i++){
						var item=items[i];
						datas.push($(item).data("data"));
					}
					resultBox.clearResults();
					resultBox.addItems(datas);
					layer.close(helplistlayer);
					$("#helplist").unbind().find("*").unbind();
				})
			
			},
			searchText:function(){
				var vdefault = "按名称或编码查询";
				var $searchText=$('#helplist .search-text').val(vdefault).removeClass("active");
				$searchText.focus(function() {
					if ($(this).val() == vdefault) {
						$(this).val("").addClass("active");
					}
				});
				$searchText.blur(function() {
					if ($(this).val()== "") {
						$(this).val(vdefault).removeClass("active");
					}
				});
			}
			
		}
		
		function initTableHead(){
			var showName=base.showName;
			var showNameArr=showName.split(",");
			var tHeadStr="<tr>";
			tHeadStr+="<th>选择</th>";
			for(var i=0;i<showNameArr.length;i++){
				var confArr=showNameArr[i].split("#");
				tHeadStr+="<th orderBy='"+confArr[0]+"'>"+confArr[1]+"</th>";
			}
			tHeadStr+="</tr>";
			$("#helplist thead").html(tHeadStr);
			
			var helpTitle=base.helpTitle;
			$("#helplist .title .text").text(helpTitle);
		}
		function initTableBody(datas){
			var tBodyStr="";
			var idArr=[];
			$("#helplist .result .item").each(function(){
				idArr.push($(this).attr("itemId"));
			})
			var showNameArr=base.showName.split(",");
			for(var i=0;i<datas.length;i++){
				var checked="";
				var id=datas[i][sName(base.idField)];
				if(idArr.in_array(id)){
					checked="checked"
				}
				tBodyStr+="<tr>";
				tBodyStr+="<td>";
				if(opts.multiSelect){
					tBodyStr+="<input id='"+id+"' "+checked+" type='checkbox' name='sunzhen' class='checkbox' original='true' index='"+i+"'/>";
				}else{
					tBodyStr+="<input id='"+id+"' "+checked+" type='radio' name='sunzhen' class='checkbox' original='true' index='"+i+"'/>";
				}
				
				tBodyStr+="</td>";
				for(var j=0;j<showNameArr.length;j++){
					tBodyStr+="<td>"+datas[i][sName(showNameArr[j].split("#")[0])]+"</td>";
				}
			}
			$("#helplist tbody")
			.html(tBodyStr)
			.find(".checkbox").each(function(i){
				var $this=$(this)
				var index=$this.attr("index");
				$this.data("data",datas[index]);
				
			})
		}
		function addOneItem(item){
			var html="<div class='item' itemId='"+item[sName(base.idField)]+"'>";
			var text=item[sName(base.codeField)]+"#"+item[sName(base.nameField)];
			html+="<span class='item-text' title='"+text+"'>"+text+"</span>";
			html+="<div class='remove'></div>";
			html+="</div>";
			if(opts.multiSelect==false){
				$("#helplist .result .item").remove();
			}
			$("#helplist .result ").append($(html).data("data",item))
		}
		return {
			domInit:function(){
				var html="<div id='helplist'>";
				html+="<div class='title'>";
				html+="<div class='text'>选择帮助</div>";
				html+="<div class='close'>&nbsp;&nbsp;&nbsp;</div>";
				html+="<button class='topFunButton clear' type='button'>清除</button>";
				html+="<button class='topFunButton confirm' type='button'>确定</button>";
				html+="</div>";
				html+="<div class='search'>";
				html+="<input type='text' class='search-text' value='' />";
				html+="</div>";
				html+="<div class='content'>";
				html+="<div class='result'>";
				html+="<div style='clear:both'></div>";
				html+="</div>";
				html+="<table>";
				html+="<thead>";
				html+="</thead>";
				html+="<tbody>";
				html+="</tbody>";
				html+="</table>";
				html+="</div>";
				html+="</div>";
				
				window.commonHelpDomReady=true;
				
				$("body").append(html);
			},
			getData:function(page,refCallBack,q){
				var firstRow=page*10-10;
				var maxRow=10;
				var count=0;
				$.ajax({
					type:'post',
					dataType:'json',
					url:'v6pubCommonHelpCmd.cmd?method=queryTableData'+where+(q==undefined||q==""?"":"&q="+q),
					data:{helpId:helpId,firstRow:firstRow,maxRow:maxRow},
					beforeSend:function(){},
					success:function(obj){
						initTableHead();
						initTableBody(obj.datas);
						count=obj.count;
						if(refCallBack){
							refCallBack(count);
						}
						
					},
					complete:function(){
						$("#helplist tr").slice(1).each(function(){
							var p = this;
							$(this).children().slice(1).click(function(){
								$($(p).children()[0]).children().each(function(){
									if(this.type=="checkbox"||this.type=="radio"){	
										$(this).click();
										if($.browser.version<9){
											$(this).change()
										}
									}
								});
							});
						});
						$("#helplist .checkbox").change(function(){
							var $this=$(this);
							var itemId=$this.attr("id");
							if($this.attr("checked")){
								addOneItem($this.data("data"));
							}else{
								$("#helplist .result .item[itemId='"+itemId+"']").remove();
							}
							layer.autoArea(helplistlayer);
						})
						layer.autoArea(helplistlayer);
					}
				})
			},
			setLastResult:function(){
				$("#helplist .result").html("");
				var resultArr=resultBox.getResultArr();
				for(var i=0;i<resultArr.length;i++){
					addOneItem(resultArr[i]);
				}
			},
			layerShow:function(){
				helplistlayer = $.layer({
					type: 1,
					title: false,
					closeBtn: false,
					border : [5, 0.5, '#666', true],
					offset: ['50px',''],
					move: ['.title .text', true],
					area: ['620px','auto'],
					page: {
						dom: '#helplist'
					}
				})
				
				for(var one in Events){
					Events[one]();
				}
			}
		}
	}
	
	var Pagination=function(count,helpList){
		$("#helplist .pagination").remove();
		var html="";
		html+="<div class='pagination'>";
		html+="<a href='#' class='last' data-action='last'>&raquo;</a>";
		html+="<a href='#' class='next' data-action='next'>&rsaquo;</a>";
		html+="<input type='text' readonly='readonly' />";				
		html+="<a href='#' class='previous' data-action='previous'>&lsaquo;</a>";
		html+="<a href='#' class='first' data-action='first'>&laquo;</a>";
		html+="</div>";
		$("#helplist>.content").append(html);
		var $target=$("#helplist .pagination");
		var maxPage=Math.ceil(count/10);
		$target.jqPagination({
			max_page:maxPage,
			paged:function(page){
				helpList.getData(page);
			}
		});
	}
	
	var ResultSearch=function(helpList){
		var timer;
		$('#helplist .search-text').keyup(function(){
			clearTimeout(timer);
			var $this=$(this);
			var text=encodeURIComponent($this.val());
			timer=setTimeout(function(){
				helpList.getData(1,function(count){
					Pagination(count,helpList)
				},text);
			},600);
		})
	}
	
	function sName(fName){
		return fName.indexOf(".")>-1?fName.split(".")[1]:fName;
	}
	
	Array.prototype.in_array = function(e){
		for(i=0;i<this.length;i++){
			if(this[i] == e){
				return true;
			}
		}
		return false;
	}
	if(!Array.indexOf){
	    Array.prototype.indexOf = function(obj){
	        for(var i=0; i<this.length; i++){
	            if(this[i]==obj){
	                return i;
	            }
	        }
	        return -1;
	    }
	}
})(jQuery);

/**
 * 联想功能
 */
(function ($) {
	$.fn.chAutoComplete=function(resultBox,helpId,relHidden,where,options,base){
		var a=base.codeField;
		var defaults = {
				max: 12, 
				minChars: 1,
				width: 250, 
				scrollHeight: 300,
				matchContains: true,
				autoFill: false,
				multiSelect:false,
				formatItem: function (row, i, max) {
	                return  row[sName(base.codeField)]+"#"+row[sName(base.nameField)];
	            }
		};
		
		var opts = $.extend({},defaults, options); 
		var url="v6pubCommonHelpCmd.cmd?method=autoComplete";
		url+="&helpId="+helpId;
		url+=where;
		
		$(this).unautocomplete().autocomplete(url, opts)
		.result(function (event, row, formatted) {    
			if(opts.multiSelect){
				resultBox.addItems(row);
			}else{
				resultBox.clearResults();
				resultBox.addItems([row]);
			}
		});	
		
		function sName(fName){
			return fName.indexOf(".")>-1?fName.split(".")[1]:fName;
		}
	}
})(jQuery);

/**
 * 分页组件
 */
(function ($) {
	
	$.jqPagination = function (el, options) {
	
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
	
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;
		
		// get input jQuery object
		base.$input = base.$el.find('input');

		// Add a reverse reference to the DOM object
		base.$el.data("jqPagination", base);

		base.init = function () {

			base.options = $.extend({}, $.jqPagination.defaultOptions, options);
			
			// if the user hasn't provided a max page number in the options try and find
			// the data attribute for it, if that cannot be found, use one as a max page number
			
			if (base.options.max_page === null) {
			
				if (base.$input.data('max-page') !== undefined) {
					base.options.max_page = base.$input.data('max-page');
				} else {
					base.options.max_page = 1;
				}
				
			}
			
			// if the current-page data attribute is specified this takes priority
			// over the options passed in, so long as it's a number
			
			if (base.$input.data('current-page') !== undefined && base.isNumber(base.$input.data('current-page'))) {
				base.options.current_page = base.$input.data('current-page');
			}
			
			// remove the readonly attribute as JavaScript must be working by now ;-)
			base.$input.removeAttr('readonly');
			
			// set the initial input value
			// pass true to prevent paged callback form being fired
			
			base.updateInput(true);

			
			 //***************
			// BIND EVENTS
			
			base.$input.on('focus.jqPagination mouseup.jqPagination', function (event) {

				// if event === focus, select all text...
				if (event.type === 'focus') {

					var current_page	= parseInt(base.options.current_page, 10);

					$(this).val(current_page).select();

				}
			
				// if event === mouse up, return false. Fixes Chrome bug
				if (event.type === 'mouseup') {
					return false;
				}
				
			});
			
			base.$input.on('blur.jqPagination keydown.jqPagination', function (event) {
				
				var $self			= $(this),
					current_page	= parseInt(base.options.current_page, 10);
				
				// if the user hits escape revert the input back to the original value
				if (event.keyCode === 27) {
					$self.val(current_page);
					$self.blur();
				}
				
				// if the user hits enter, trigger blur event but DO NOT set the page value
				if (event.keyCode === 13) {
					$self.blur();
				}

				// only set the page is the event is focusout.. aka blur
				if (event.type === 'blur') {
					base.setPage($self.val());
				}
				
			});
			
			base.$el.on('click.jqPagination', 'a', function (event) {
			
				var $self = $(this);

				// we don't want to do anything if we've clicked a disabled link
				// return false so we stop normal link action btu also drop out of this event
				
				if ($self.hasClass('disabled')) {
					return false;
				}

				// for mac + windows (read: other), maintain the cmd + ctrl click for new tab
				if (!event.metaKey && !event.ctrlKey) {
					event.preventDefault();
					base.setPage($self.data('action'));
				}
				
			});
			
		};
		
		base.setPage = function (page, prevent_paged) {
			
			// return current_page value if getting instead of setting
			if (page === undefined) {
				return base.options.current_page;
			}
		
			var current_page	= parseInt(base.options.current_page, 10),
				max_page		= parseInt(base.options.max_page, 10);
							
			if (isNaN(parseInt(page, 10))) {
				
				switch (page) {
				
					case 'first':
						page = 1;
						break;
						
					case 'prev':
					case 'previous':
						page = current_page - 1;
						break;
						
					case 'next':
						page = current_page + 1;
						break;
						
					case 'last':
						page = max_page;
						break;
						
				}
				
			}
			
			page = parseInt(page, 10);
			
			// reject any invalid page requests
			if (isNaN(page) || page < 1 || page > max_page) {

				// update the input element
				base.setInputValue(current_page);
				
				return false;
				
			}
			
			// update current page options
			base.options.current_page = page;
			base.$input.data('current-page', page);
			
			// update the input element
			base.updateInput( prevent_paged );
			
		};
		
		base.setMaxPage = function (max_page, prevent_paged) {
			
			// return the max_page value if getting instead of setting
			if (max_page === undefined) {
				return base.options.max_page;
			}

			// ignore if max_page is not a number
			if (!base.isNumber(max_page)) {
				console.error('jqPagination: max_page is not a number');
				return false;
			}
			
			// ignore if max_page is less than the current_page
			if (max_page < base.options.current_page) {
				console.error('jqPagination: max_page lower than current_page');
				return false;
			}
			
			// set max_page options
			base.options.max_page = max_page;
			base.$input.data('max-page', max_page);
				
			// update the input element
			base.updateInput( prevent_paged );
			
		};
		
		// ATTN this isn't really the correct name is it?
		base.updateInput = function (prevent_paged) {
			
			var current_page = parseInt(base.options.current_page, 10);
							
			// set the input value
			base.setInputValue(current_page);
			
			// set the link href attributes
			base.setLinks(current_page);
			
			// we may want to prevent the paged callback from being fired
			if (prevent_paged !== true) {

				// fire the callback function with the current page
				base.options.paged(current_page);
			
			}
			
		};
		
		base.setInputValue = function (page) {
		
			var page_string	= base.options.page_string,
				max_page	= base.options.max_page;
	
			// this looks horrible :-(
			page_string = page_string
				.replace("{current_page}", page)
				.replace("{max_page}", max_page);
			
			base.$input.val(page_string);
		
		};
		
		base.isNumber = function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};
		
		base.setLinks = function (page) {
			
			var link_string		= base.options.link_string,
				current_page	= parseInt(base.options.current_page, 10),
				max_page		= parseInt(base.options.max_page, 10);
			
			if (link_string !== '') {
				
				// set initial page numbers + make sure the page numbers aren't out of range
					
				var previous = current_page - 1;
				if (previous < 1) {
					previous = 1;
				}
				
				var next = current_page + 1;
				if (next > max_page) {
					next = max_page;
				}
				
				// apply each page number to the link string, set it back to the element href attribute
				base.$el.find('a.first').attr('href', link_string.replace('{page_number}', '1'));
				base.$el.find('a.prev, a.previous').attr('href', link_string.replace('{page_number}', previous));
				base.$el.find('a.next').attr('href', link_string.replace('{page_number}', next));
				base.$el.find('a.last').attr('href', link_string.replace('{page_number}', max_page));
				
			}

			// set disable class on appropriate links
			base.$el.find('a').removeClass('disabled');

			if (current_page === max_page) {
				base.$el.find('.next, .last').addClass('disabled');
			}

			if (current_page === 1) {
				base.$el.find('.previous, .first').addClass('disabled');
			}

		};
		
		base.callMethod = function (method, key, value) {

			switch (method.toLowerCase()) {

				case 'option':

					// set default object to trigger the paged event (legacy opperation)
					var options = {'trigger': true},
					result = false;

					// if the key passed in is an object
					if($.isPlainObject(key) && !value){
						$.extend(options, key)
					}
					else{ // make the key value pair part of the default object
						options[key] = value;
					}

					var prevent_paged = (options.trigger === false);

					// if max_page property is set call setMaxPage
					if(options.max_page !== undefined){
						result = base.setMaxPage(options.max_page, prevent_paged);
					}

					// if current_page property is set call setPage
					if(options.current_page !== undefined){
						result = base.setPage(options.current_page, prevent_paged);
					}

					// if we've not got a result fire an error and return false
					if( result === false ) console.error('jqPagination: cannot get / set option ' + key);
					return result;
					
					break;

				case 'destroy':

					base.$el
						.off('.jqPagination')
						.find('*')
							.off('.jqPagination');

					break;

				default:

					// the function name must not exist
					console.error('jqPagination: method "' + method + '" does not exist');
					return false;

			}

		};

		// Run initializer
		base.init();
		
	};

	$.jqPagination.defaultOptions = {
		current_page	: 1,
		link_string		: '',
		max_page		: null,
		page_string		: '当前页: {current_page}   总页数:{max_page}',
		paged			: function () {}
	};

	$.fn.jqPagination = function () {

		// get any function parameters
		var self = this,
			args = Array.prototype.slice.call(arguments),
			result = false;

		// if the first argument is a string call the desired function
		// note: we can only do this to a single element, and not a collection of elements

		if (typeof args[0] === 'string') {

			// if we're dealing with multiple elements, set for all
			$.each(self, function(){
				var $plugin = $(this).data('jqPagination');

				result = $plugin.callMethod(args[0], args[1], args[2]);
			});

			return result;
		}

		// if we're not dealing with a method, initialise plugin
		self.each(function () {
			(new $.jqPagination(this, args[0]));
		});
		
	};

})(jQuery);

//polyfill, provide a fallback if the console doesn't exist
if (!console) {

	var console	= {},
		func	= function () { return false; };

	console.log		= func;
	console.info	= func;
	console.warn	= func;
	console.error	= func;

}

