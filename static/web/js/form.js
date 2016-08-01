var config ={};
//初始化全局变量
$.fn.initConfig = function(){
//	var ajaxUrl="/skin/config.ini";
//	$.ajax({
//		type : 'post',
//		url : ajaxUrl,
//		dataType : 'json',
//		contentType : 'application/json',
//		async:false,
//		success : function(data) {
//			config =data;
//		},
//		error : function() {
//		}
//	});
	
};

(function($) {
	/*
	 * jQuery UI Datepicker 1.8.18
	 *
	 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * http://docs.jquery.com/UI/Datepicker
	 *
	 * Depends:
	 *	jquery.ui.core.js
	 */
		$.extend($.ui, {
			datepicker: {
				version: "1.8.18"
			}
		});

		var PROP_NAME = 'datepicker';
		var dpuuid = new Date().getTime();
		var instActive;
        var ifCreatDatepicker=0;

		/*
	 * Date picker manager. Use the singleton instance of this class, $.datepicker,
	 * to interact with the date picker. Settings for (groups of) date pickers are
	 * maintained in an instance object, allowing multiple different settings on the
	 * same page.
	 */

		function Datepicker() {
			this.debug = false; // Change this to true to start debugging
			this._curInst = null; // The current instance in use
			this._keyEvent = false; // If the last event was a key event
			this._disabledInputs = []; // List of date picker inputs that have been
			// disabled
			this._datepickerShowing = false; // True if the popup picker is showing ,
			// false if not
			this._inDialog = false; // True if showing within a "dialog", false if not
			this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker
			// division
			this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker
			// class
			this._appendClass = 'ui-datepicker-append'; // The name of the append marker
			// class
			this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger
			// marker class
			this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker
			// class
			this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled
			// covering marker class
			this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the
			// unselectable cell
			// marker class
			this._currentClass = 'ui-datepicker-current-day'; // The name of the
			// current day marker
			// class
			this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the
			// day hover marker
			// class
			this.regional = []; // Available regional settings, indexed by language code
			this.regional[''] = {
				closeText: '关闭',
				clearTime: '清除',
				prevText: '&#x3c;上月',
				nextText: '下月&#x3e;',
				currentText: '今天',
				monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				monthNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
				dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
				dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
				weekHeader: '周'
			};
			this._defaults = { // Global defaults for all the date picker instances
				showOn: 'focus',
				// 'focus' for popup on focus,
				// 'button' for trigger button, or 'both' for either
				showAnim: 'fadeIn',
				// Name of jQuery animation for popup
				showOptions: {},
				// Options for enhanced animations
				defaultDate: null,
				// Used when field is blank: actual date,
				// +/-number for offset from today, null for today
				appendText: '',
				// Display text following the input box, e.g. showing
				// the format
				buttonText: '...',
				// Text for trigger button
				buttonImage: '',
				// URL for trigger button image
				buttonImageOnly: false,
				// True if the image appears alone, false if it
				// appears on a button
				hideIfNoPrevNext: false,
				// True to hide next/previous month links
				// if not applicable, false to just disable them
				navigationAsDateFormat: false,
				// True if date formatting applied to
				// prev/today/next links
				gotoCurrent: false,
				// True if today link goes back to current selection
				// instead
				changeMonth: true,
				// True if month can be selected directly, false if
				// only prev/next
				changeYear: true,
				// True if year can be selected directly, false if
				// only prev/next
				yearRange: 'c-5:c+1',
				// Range of years to display in drop-down,
				// either relative to today's year (-nn:+nn), relative to currently
				// displayed year
				// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above
				// (nnnn:-n)
				showOtherMonths: true,
				// True to show dates in other months, false to
				// leave blank
				selectOtherMonths: true,
				// True to allow selection of dates in other
				// months, false for unselectable
				showWeek: false,
				// True to show week of the year, false to not show
				// it
				calculateWeek: this.iso8601Week,
				// How to calculate the week of the
				// year,
				// takes a Date and returns the number of the week for it
				shortYearCutoff: '+10',
				// Short year values < this are in the current
				// century,
				// > this are in the previous century,
				// string value starting with '+' for current year + value
				minDate: null,
				// The earliest selectable date, or null for no limit
				maxDate: null,
				// The latest selectable date, or null for no limit
				duration: 'fast',
				// Duration of display/closure
				beforeShowDay: null,
				// Function that takes a date and returns an
				// array with
				// [0] = true if selectable, false if not, [1] = custom CSS class
				// name(s) or '',
				// [2] = cell title (optional), e.g. $.datepicker.noWeekends
				beforeShow: null,
				// Function that takes an input field and
				// returns a set of custom settings for the date picker
				onSelect: null,
				// Define a callback function when a date is selected
				onChangeMonthYear: null,
				// Define a callback function when the month
				// or year is changed
				onClose: null,
				// Define a callback function when the datepicker is
				// closed
				numberOfMonths: 1,
				// Number of months to show at a time
				showCurrentAtPos: 0,
				// The position in multipe months at which to
				// show the current month (starting at 0)
				stepMonths: 1,
				// Number of months to step back/forward
				stepBigMonths: 12,
				// Number of months to step back/forward for the big
				// links
				altField: '',
				// Selector for an alternate field to store selected
				// dates into
				altFormat: 'yymmdd',
				// The date format to use for the alternate
				// field
				constrainInput: true,
				// The input is constrained by the current date
				// format
				showButtonPanel: true,
				// True to show button panel, false to not show
				// it
				autoSize: false,
				// True to size the input for the date format, false
				// to leave as is
				disabled: false,
				dateFormat: 'yymmdd',
				// default:yy-mm-dd
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: true,
				yearSuffix: '',
				timePicker: false

			};
			$.extend(this._defaults, this.regional['']);
			this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
		}

		$.extend(Datepicker.prototype, {
			/*
		 * Class name added to elements to indicate already configured with a date
		 * picker.
		 */
			markerClassName: 'hasDatepicker',

			// Keep track of the maximum number of rows displayed (see #7043)
			maxRows: 4,

			/* Debug logging (if enabled). */
			log: function() {
				if (this.debug) console.log.apply('', arguments);
			},

			// TODO rename to "widget" when switching to widget factory
			_widgetDatepicker: function() {
				return this.dpDiv;
			},

			/*
		 * Override the default settings for all instances of the date picker.
		 * @param settings object - the new settings to use as defaults (anonymous
		 * object) @return the manager object
		 */
			setDefaults: function(settings) {
				extendRemove(this._defaults, settings || {});
				return this;
			},

			/*
		 * Attach the date picker to a jQuery selection. @param target element - the
		 * target input field or division or span @param settings object - the new
		 * settings to use for this date picker instance (anonymous)
		 */
			_attachDatepicker: function(target, settings) {
				// check for settings on the control itself - in namespace 'date:'
				var inlineSettings = null;
				for (var attrName in this._defaults) {
					var attrValue = target.getAttribute('date:' + attrName);
					if (attrValue) {
						inlineSettings = inlineSettings || {};
						try {
							inlineSettings[attrName] = eval(attrValue);
						} catch(err) {
							inlineSettings[attrName] = attrValue;
						}
					}
				}
				var nodeName = target.nodeName.toLowerCase();
				var inline = (nodeName == 'div' || nodeName == 'span');
				if (!target.id) {
					this.uuid += 1;
					target.id = 'dp' + this.uuid;
				}
				var inst = this._newInst($(target), inline);
				inst.settings = $.extend({},
				settings || {},
				inlineSettings || {});
				if (nodeName == 'input') {
					this._connectDatepicker(target, inst);
				} else if (inline) {
					this._inlineDatepicker(target, inst);
				}
			},

			/* Create a new instance object. */
			_newInst: function(target, inline) {
				var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape
				// jQuery
				// meta
				// chars
				// add by zhaowj 增加时分秒
				return {
					id: id,
					input: target,
					// associated target
					selectedDay: 0,
					selectedMonth: 0,
					selectedYear: 0,
					selectedHour: 0,
					selectedMinutes: 0,
					selectedSeconds: 0,
					// current
					startyear: 2010,
					endyear: 2019,
					currentyear: new Date().getFullYear(),
					istenyearschema: 0,
					// selection
					drawMonth: 0,
					drawYear: 0,
					// month being drawn
					inline: inline,
					// is datepicker inline or not
					dpDiv: (!inline ? this.dpDiv: // presentation div
					bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))
				};
			},

			/* Attach the date picker to an input field. */
			_connectDatepicker: function(target, inst) {
				var input = $(target);
				inst.append = $([]);
				inst.trigger = $([]);
				if (input.hasClass(this.markerClassName)) return;
				this._attachments(input, inst);
				input.addClass(this.markerClassName).addClass("dateImg").keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",
				function(event, key, value) {
					inst.settings[key] = value;
				}).bind("getData.datepicker",
				function(event, key) {
					return this._get(inst, key);
				});
				this._autoSize(inst);
				$.data(target, PROP_NAME, inst);
				// If disabled option is true, disable the datepicker once it has been
				// attached to the input (see ticket #5665)
				if (inst.settings.disabled) {
					this._disableDatepicker(target);
				}
			},

			/* Make attachments based on settings. */
			_attachments: function(input, inst) {
				var appendText = this._get(inst, 'appendText');
				var isRTL = this._get(inst, 'isRTL');
				if (inst.append) inst.append.remove();
				if (appendText) {
					inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
					input[isRTL ? 'before': 'after'](inst.append);
				}
				input.unbind('focus', this._showDatepicker);
				if (inst.trigger) inst.trigger.remove();
				var showOn = this._get(inst, 'showOn');
				if (showOn == 'focus' || showOn == 'both') // pop-up date picker when
				// in the marked field
				input.focus(this._showDatepicker);
				if (showOn == 'button' || showOn == 'both') { // pop-up date picker
					// when button clicked
					var buttonText = this._get(inst, 'buttonText');
					var buttonImage = this._get(inst, 'buttonImage');
					inst.trigger = $(this._get(inst, 'buttonImageOnly') ? $('<img/>').addClass(this._triggerClass).attr({
						src: buttonImage,
						alt: buttonText,
						title: buttonText
					}) : $('<button type="button"></button>').addClass(this._triggerClass).html(buttonImage == '' ? buttonText: $('<img/>').attr({
						src: buttonImage,
						alt: buttonText,
						title: buttonText
					})));
					input[isRTL ? 'before': 'after'](inst.trigger);
					inst.trigger.click(function() {
						if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0]) $.datepicker._hideDatepicker();
						else if ($.datepicker._datepickerShowing && $.datepicker._lastInput != input[0]) {
							$.datepicker._hideDatepicker();
							$.datepicker._showDatepicker(input[0]);
						} else $.datepicker._showDatepicker(input[0]);
						return false;
					});
				}
			},

			/* Apply the maximum length for the date format. */
			_autoSize: function(inst) {
				if (this._get(inst, 'autoSize') && !inst.inline) {
					var date = new Date(2009, 12 - 1, 20); // Ensure double digits
					var dateFormat = this._get(inst, 'dateFormat');
					if (dateFormat.match(/[DM]/)) {
						var findMax = function(names) {
							var max = 0;
							var maxI = 0;
							for (var i = 0; i < names.length; i++) {
								if (names[i].length > max) {
									max = names[i].length;
									maxI = i;
								}
							}
							return maxI;
						};
						date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ? 'monthNames': 'monthNamesShort'))));
						date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ? 'dayNames': 'dayNamesShort'))) + 20 - date.getDay());
					}
					inst.input.attr('size', this._formatDate(inst, date).length);
				}
			},

			/* Attach an inline date picker to a div. */
			_inlineDatepicker: function(target, inst) {
				var divSpan = $(target);
				if (divSpan.hasClass(this.markerClassName)) return;
				divSpan.addClass(this.markerClassName).append(inst.dpDiv).bind("setData.datepicker",
				function(event, key, value) {
					inst.settings[key] = value;
				}).bind("getData.datepicker",
				function(event, key) {
					return this._get(inst, key);
				});
				$.data(target, PROP_NAME, inst);
				this._setDate(inst, this._getDefaultDate(inst), true);
				this._updateDatepicker(inst);
				this._updateAlternate(inst);
				// If disabled option is true, disable the datepicker before showing it
				// (see ticket #5665)
				if (inst.settings.disabled) {
					this._disableDatepicker(target);
				}
				// Set display:block in place of inst.dpDiv.show() which won't work on
				// disconnected elements
				// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a
				// detached div has zero height
				inst.dpDiv.css("display", "block");
			},

			/*
		 * Pop-up the date picker in a "dialog" box. @param input element - ignored
		 * @param date string or Date - the initial date to display @param onSelect
		 * function - the function to call when a date is selected @param settings
		 * object - update the dialog date picker instance's settings (anonymous
		 * object) @param pos int[2] - coordinates for the dialog's position within
		 * the screen or event - with x/y coordinates or leave empty for default
		 * (screen centre) @return the manager object
		 */
			_dialogDatepicker: function(input, date, onSelect, settings, pos) {
				var inst = this._dialogInst; // internal instance
				if (!inst) {
					this.uuid += 1;
					var id = 'dp' + this.uuid;
					this._dialogInput = $('<input type="text" id="' + id + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
					this._dialogInput.keydown(this._doKeyDown);
					$('body').append(this._dialogInput);
					inst = this._dialogInst = this._newInst(this._dialogInput, false);
					inst.settings = {};
					$.data(this._dialogInput[0], PROP_NAME, inst);
				}
				extendRemove(inst.settings, settings || {});
				date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
				this._dialogInput.val(date);

				this._pos = (pos ? (pos.length ? pos: [pos.pageX, pos.pageY]) : null);
				if (!this._pos) {
					var browserWidth = document.documentElement.clientWidth;
					var browserHeight = document.documentElement.clientHeight;
					var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
					var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
					this._pos = // should use actual width/height below
					[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
				}

				// move input on screen for focus, but hidden behind dialog
				this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
				inst.settings.onSelect = onSelect;
				this._inDialog = true;
				this.dpDiv.addClass(this._dialogClass);
				this._showDatepicker(this._dialogInput[0]);
				if ($.blockUI) $.blockUI(this.dpDiv);
				$.data(this._dialogInput[0], PROP_NAME, inst);
				return this;
			},

			/*
		 * Detach a datepicker from its control. @param target element - the target
		 * input field or division or span
		 */
			_destroyDatepicker: function(target) {
				var $target = $(target);
				var inst = $.data(target, PROP_NAME);
				if (!$target.hasClass(this.markerClassName)) {
					return;
				}
				var nodeName = target.nodeName.toLowerCase();
				$.removeData(target, PROP_NAME);
				if (nodeName == 'input') {
					inst.append.remove();
					inst.trigger.remove();
					$target.removeClass(this.markerClassName).unbind('focus', this._showDatepicker).unbind('keydown', this._doKeyDown).unbind('keypress', this._doKeyPress).unbind('keyup', this._doKeyUp);
				} else if (nodeName == 'div' || nodeName == 'span') $target.removeClass(this.markerClassName).empty();
			},

			/*
		 * Enable the date picker to a jQuery selection. @param target element - the
		 * target input field or division or span
		 */
			_enableDatepicker: function(target) {
				var $target = $(target);
				var inst = $.data(target, PROP_NAME);
				if (!$target.hasClass(this.markerClassName)) {
					return;
				}
				var nodeName = target.nodeName.toLowerCase();
				if (nodeName == 'input') {
					target.disabled = false;
					inst.trigger.filter('button').each(function() {
						this.disabled = false;
					}).end().filter('img').css({
						opacity: '1.0',
						cursor: ''
					});
				} else if (nodeName == 'div' || nodeName == 'span') {
					var inline = $target.children('.' + this._inlineClass);
					inline.children().removeClass('ui-state-disabled');
					inline.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled");
				}
				this._disabledInputs = $.map(this._disabledInputs,
				function(value) {
					return (value == target ? null: value);
				}); // delete
				// entry
			},

			/*
		 * Disable the date picker to a jQuery selection. @param target element -
		 * the target input field or division or span
		 */
			_disableDatepicker: function(target) {
				var $target = $(target);
				var inst = $.data(target, PROP_NAME);
				if (!$target.hasClass(this.markerClassName)) {
					return;
				}
				var nodeName = target.nodeName.toLowerCase();
				if (nodeName == 'input') {
					target.disabled = true;
					inst.trigger.filter('button').each(function() {
						this.disabled = true;
					}).end().filter('img').css({
						opacity: '0.5',
						cursor: 'default'
					});
				} else if (nodeName == 'div' || nodeName == 'span') {
					var inline = $target.children('.' + this._inlineClass);
					inline.children().addClass('ui-state-disabled');
					inline.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled");
				}
				this._disabledInputs = $.map(this._disabledInputs,
				function(value) {
					return (value == target ? null: value);
				}); // delete
				// entry
				this._disabledInputs[this._disabledInputs.length] = target;
			},

			/*
		 * Is the first field in a jQuery collection disabled as a datepicker?
		 * @param target element - the target input field or division or span
		 * @return boolean - true if disabled, false if enabled
		 */
			_isDisabledDatepicker: function(target) {
				if (!target) {
					return false;
				}
				for (var i = 0; i < this._disabledInputs.length; i++) {
					if (this._disabledInputs[i] == target) return true;
				}
				return false;
			},

			/*
		 * Retrieve the instance data for the target control. @param target element -
		 * the target input field or division or span @return object - the
		 * associated instance data @throws error if a jQuery problem getting data
		 */
			_getInst: function(target) {
				try {
					return $.data(target, PROP_NAME);
				} catch(err) {
					throw 'Missing instance data for this datepicker';
				}
			},

			/*
		 * Update or retrieve the settings for a date picker attached to an input
		 * field or division. @param target element - the target input field or
		 * division or span @param name object - the new settings to update or
		 * string - the name of the setting to change or retrieve, when retrieving
		 * also 'all' for all instance settings or 'defaults' for all global
		 * defaults @param value any - the new value for the setting (omit if above
		 * is an object or to retrieve a value)
		 */
			_optionDatepicker: function(target, name, value) {
				var inst = this._getInst(target);
				if (arguments.length == 2 && typeof name == 'string') {
					return (name == 'defaults' ? $.extend({},
					$.datepicker._defaults) : (inst ? (name == 'all' ? $.extend({},
					inst.settings) : this._get(inst, name)) : null));
				}
				var settings = name || {};
				if (typeof name == 'string') {
					settings = {};
					settings[name] = value;
				}
				if (inst) {
					if (this._curInst == inst) {
						this._hideDatepicker();
					}
					var date = this._getDateDatepicker(target, true);
					var minDate = this._getMinMaxDate(inst, 'min');
					var maxDate = this._getMinMaxDate(inst, 'max');
					extendRemove(inst.settings, settings);
					// reformat the old minDate/maxDate values if dateFormat changes and
					// a new minDate/maxDate isn't provided
					if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined) inst.settings.minDate = this._formatDate(inst, minDate);
					if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined) inst.settings.maxDate = this._formatDate(inst, maxDate);
					this._attachments($(target), inst);
					this._autoSize(inst);
					this._setDate(inst, date);
					this._updateAlternate(inst);
					this._updateDatepicker(inst);
				}
			},

			// change method deprecated
			_changeDatepicker: function(target, name, value) {
				this._optionDatepicker(target, name, value);
			},

			/*
		 * Redraw the date picker attached to an input field or division. @param
		 * target element - the target input field or division or span
		 */
			_refreshDatepicker: function(target) {
				var inst = this._getInst(target);
				if (inst) {
					this._updateDatepicker(inst);
				}
			},

			/*
		 * Set the dates for a jQuery selection. @param target element - the target
		 * input field or division or span @param date Date - the new date
		 */
			_setDateDatepicker: function(target, date) {
				var inst = this._getInst(target);
				if (inst) {
					this._setDate(inst, date);
					this._updateDatepicker(inst);
					this._updateAlternate(inst);
				}
			},

			/*
		 * Get the date(s) for the first entry in a jQuery selection. @param target
		 * element - the target input field or division or span @param noDefault
		 * boolean - true if no default date is to be used @return Date - the
		 * current date
		 */
			_getDateDatepicker: function(target, noDefault) {
				var inst = this._getInst(target);
				if (inst && !inst.inline) this._setDateFromField(inst, noDefault);
				return (inst ? this._getDate(inst) : null);
			},

			/* Handle keystrokes. */
			_doKeyDown: function(event) {
				var inst = $.datepicker._getInst(event.target);
				var handled = true;
				var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
				inst._keyEvent = true;
				if ($.datepicker._datepickerShowing) switch (event.keyCode) {
				case 9:
					$.datepicker._hideDatepicker();
					handled = false;
					break; // hide on tab out
					// add by zhaowj 修改选择器
				case 13:
					var sel = $('td.' + $.datepicker._dayOverClass, inst.dpDiv);
					if (sel[0]) $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
					var onSelect = $.datepicker._get(inst, 'onSelect');
					if (onSelect) {
						var dateStr = $.datepicker._formatDate(inst);

						// trigger custom callback
						onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
					} else $.datepicker._hideDatepicker();
					return false; // don't submit the form
					break; // select the value on enter
				case 27:
					$.datepicker._hideDatepicker();
					break; // hide on escape
				case 33:
					$.datepicker._adjustDate(event.target, (event.ctrlKey ? -$.datepicker._get(inst, 'stepBigMonths') : -$.datepicker._get(inst, 'stepMonths')), 'M');
					break; // previous month/year on page up/+ ctrl
				case 34:
					$.datepicker._adjustDate(event.target, (event.ctrlKey ? +$.datepicker._get(inst, 'stepBigMonths') : +$.datepicker._get(inst, 'stepMonths')), 'M');
					break; // next month/year on page down/+ ctrl
				case 35:
					if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
					handled = event.ctrlKey || event.metaKey;
					break; // clear on ctrl or command +end
				case 36:
					if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
					handled = event.ctrlKey || event.metaKey;
					break; // current on ctrl or command +home
				case 37:
					if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
					handled = event.ctrlKey || event.metaKey;
					// -1 day on ctrl or command +left
					if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ? -$.datepicker._get(inst, 'stepBigMonths') : -$.datepicker._get(inst, 'stepMonths')), 'M');
					// next month/year on alt +left on Mac
					break;
				case 38:
					if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
					handled = event.ctrlKey || event.metaKey;
					break; // -1 week on ctrl or command +up
				case 39:
					if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
					handled = event.ctrlKey || event.metaKey;
					// +1 day on ctrl or command +right
					if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ? +$.datepicker._get(inst, 'stepBigMonths') : +$.datepicker._get(inst, 'stepMonths')), 'M');
					// next month/year on alt +right
					break;
				case 40:
					if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
					handled = event.ctrlKey || event.metaKey;
					break; // +1 week on ctrl or command +down
				default:
					handled = false;
				} else if (event.keyCode == 36 && event.ctrlKey) // display the date
				// picker on ctrl+home
				$.datepicker._showDatepicker(this);
				else {
					handled = false;
				}
				if (handled) {
					event.preventDefault();
					event.stopPropagation();
				}
			},

			/* Filter entered characters - based on date format. */
			_doKeyPress: function(event) {
				var inst = $.datepicker._getInst(event.target);
				if ($.datepicker._get(inst, 'constrainInput')) {
					var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
					var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode: event.charCode);
					return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
				}
			},

			/* Synchronise manual entry and field/alternate field. */
			_doKeyUp: function(event) {
				var inst = $.datepicker._getInst(event.target);
				if (inst.input.val() != inst.lastVal) {
					try {
						var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'), (inst.input ? inst.input.val() : null), $.datepicker._getFormatConfig(inst));
						if (date) { // only if valid
							$.datepicker._setDateFromField(inst);
							$.datepicker._updateAlternate(inst);
							$.datepicker._updateDatepicker(inst);
						}
					} catch(event) {
						$.datepicker.log(event);
					}
				}
				return true;
			},

			/*
		 * Pop-up the date picker for a given input field. If false returned from
		 * beforeShow event handler do not show. @param input element - the input
		 * field attached to the date picker or event - if triggered by focus
		 */
			_showDatepicker: function(input) {
				input = input.target || input;
				if (input.nodeName.toLowerCase() != 'input') // find from
				// button/image trigger
				input = $('input', input.parentNode)[0];
				if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already
				// here
				return;
				var inst = $.datepicker._getInst(input);
				if ($.datepicker._curInst && $.datepicker._curInst != inst) {
					$.datepicker._curInst.dpDiv.stop(true, true);
					if (inst && $.datepicker._datepickerShowing) {
						$.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
					}
				}
				var beforeShow = $.datepicker._get(inst, 'beforeShow');
				var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
				if (beforeShowSettings === false) {
					// false
					return;
				}
				extendRemove(inst.settings, beforeShowSettings);
				inst.lastVal = null;
				$.datepicker._lastInput = input;
				$.datepicker._setDateFromField(inst);
				if ($.datepicker._inDialog) // hide cursor
				input.value = '';
				if (!$.datepicker._pos) { // position below input
					$.datepicker._pos = $.datepicker._findPos(input);
					$.datepicker._pos[1] += input.offsetHeight; // add the height
				}
				var isFixed = false;
				$(input).parents().each(function() {
					isFixed |= $(this).css('position') == 'fixed';
					return ! isFixed;
				});
				if (isFixed && $.browser.opera) { // correction for Opera when fixed
					// and scrolled
					$.datepicker._pos[0] -= document.documentElement.scrollLeft;
					$.datepicker._pos[1] -= document.documentElement.scrollTop;
				}
				var offset = {
					left: $.datepicker._pos[0],
					top: $.datepicker._pos[1]
				};
				$.datepicker._pos = null;
				// to avoid flashes on Firefox
				inst.dpDiv.empty();
				// determine sizing offscreen
				inst.dpDiv.css({
					position: 'absolute',
					display: 'block',
					top: '-1000px'
				});
				$.datepicker._updateDatepicker(inst);
				// fix width for dynamic number of date pickers
				// and adjust position before showing
				offset = $.datepicker._checkOffset(inst, offset, isFixed);
				inst.dpDiv.css({
					position: ($.datepicker._inDialog && $.blockUI ? 'static': (isFixed ? 'fixed': 'absolute')),
					display: 'none',
					left: offset.left + 'px',
					top: offset.top + 'px'
				});
				// 设置层级901，在grid组件之上（grid 层级90）
				inst.dpDiv.css("z-index", "100");
				if (!inst.inline) {
					var showAnim = $.datepicker._get(inst, 'showAnim');
					var duration = $.datepicker._get(inst, 'duration');
					var postProcess = function() {
						var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6-
						// only
						if ( !! cover.length) {
							var borders = $.datepicker._getBorders(inst.dpDiv);
							cover.css({
								left: -borders[0],
								top: -borders[1],
								width: inst.dpDiv.outerWidth(),
								height: inst.dpDiv.outerHeight()
							});
						}
					};
					// inst.dpDiv.zIndex($(input).zIndex()+1);
					$.datepicker._datepickerShowing = true;
					if ($.effects && $.effects[showAnim]) inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
					else inst.dpDiv[showAnim || 'show']((showAnim ? duration: null), postProcess);
					if (!showAnim || !duration) postProcess();
					if (inst.input.is(':visible') && !inst.input.is(':disabled')) inst.input.focus();
					$.datepicker._curInst = inst;
				}
				// add by zhaowj 初始化时间
				if (inst.settings.timePicker == true) {
					$initTimeInput();
				}

			},

			/* Generate the date picker content. */
			_updateDatepicker: function(inst) {
				var self = this;
				self.maxRows = 4; // Reset the max number of rows being displayed (see
				// #7043)
				var borders = $.datepicker._getBorders(inst.dpDiv);
				instActive = inst; // for delegate hover events
				inst.dpDiv.empty().append(this._generateHTML(inst));
				var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
				if ( !! cover.length) { // avoid call to outerXXXX() when not in IE6
					cover.css({
						left: -borders[0],
						top: -borders[1],
						width: inst.dpDiv.outerWidth(),
						height: inst.dpDiv.outerHeight()
					})
				}
				inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
				var numMonths = this._getNumberOfMonths(inst);
				var cols = numMonths[1];
				var width = 17;
				inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
				if (cols > 1) inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
				inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add': 'remove') + 'Class']('ui-datepicker-multi');
				inst.dpDiv[(this._get(inst, 'isRTL') ? 'add': 'remove') + 'Class']('ui-datepicker-rtl');
				if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
				// #6694 - don't focus the input if it's already focused
				// this breaks the change event in IE
				inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
				// 解决ie点击今天会再次弹出日期框的bug
				// inst.input.focus();
				// deffered render of the years select (to avoid flashes on Firefox)
				if (inst.yearshtml) {
					var origyearshtml = inst.yearshtml;
					setTimeout(function() {
						// assure that inst.yearshtml didn't change.
						if (origyearshtml === inst.yearshtml && inst.yearshtml) {
							inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
						}
						origyearshtml = inst.yearshtml = null;
					},
					0);
				}
			},

			/*
		 * Retrieve the size of left and top borders for an element. @param elem
		 * (jQuery object) the element of interest @return (number[2]) the left and
		 * top borders
		 */
			_getBorders: function(elem) {
				var convert = function(value) {
					return {
						thin: 1,
						medium: 2,
						thick: 3
					} [value] || value;
				};
				return [parseFloat(convert(elem.css('border-left-width'))), parseFloat(convert(elem.css('border-top-width')))];
			},

			/* Check positioning to remain on screen. */
			_checkOffset: function(inst, offset, isFixed) {
				var dpWidth = inst.dpDiv.outerWidth();
				var dpHeight = inst.dpDiv.outerHeight();
				var inputWidth = inst.input ? inst.input.outerWidth() : 0;
				var inputHeight = inst.input ? inst.input.outerHeight() : 0;
				var viewWidth = document.documentElement.clientWidth + $(document).scrollLeft();
				var viewHeight = document.documentElement.clientHeight + $(document).scrollTop();

				offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
				offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
				offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

				// now check if datepicker is showing outside window viewport - move to
				// a better place if so.
				offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ? Math.abs(offset.left + dpWidth - viewWidth) : 0);
				offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ? Math.abs(dpHeight + inputHeight) : 0);

				return offset;
			},

			/* Find an object's position on the screen. */
			_findPos: function(obj) {
				var inst = this._getInst(obj);
				var isRTL = this._get(inst, 'isRTL');
				while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
					obj = obj[isRTL ? 'previousSibling': 'nextSibling'];
				}
				var position = $(obj).offset();
				return [position.left, position.top];
			},

			/*
		 * Hide the date picker from view. @param input element - the input field
		 * attached to the date picker
		 */
			_clearDatepicker: function(id) { // 清除方法
				var target = $(id);
				target[0].value = "";
				var inst = this._getInst(target[0]);
				target[0].value = "";
				if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
					inst.selectedDay = inst.currentDay;
					inst.drawMonth = inst.selectedMonth = inst.currentMonth;
					inst.drawYear = inst.selectedYear = inst.currentYear;
				} else {
					var date = new Date();
					inst.selectedDay = date.getDate();
					inst.drawMonth = inst.selectedMonth = date.getMonth();
					inst.drawYear = inst.selectedYear = date.getFullYear();
				}

				target.focus(); // 让日期框再次弹出
				target.blur(); // 失去焦点解决弹出后关不掉的bug
				this._notifyChange(inst);
				this._adjustDate(target);
				var e = jQuery.Event("keydown"); // 模拟一个键盘事件
				e.keyCode = 8; // keyCode=13是回车
				target.trigger(e);
			},
			_hideDatepicker: function(input) {
				var inst = this._curInst;
				if (!inst || (input && inst != $.data(input, PROP_NAME))) return;
				if (this._datepickerShowing) {
					var showAnim = this._get(inst, 'showAnim');
					var duration = this._get(inst, 'duration');
					var self = this;
					var postProcess = function() {
						$.datepicker._tidyDialog(inst);
						self._curInst = null;
					};
					if ($.effects && $.effects[showAnim]) inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
					else inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp': (showAnim == 'fadeIn' ? 'fadeOut': 'hide'))]((showAnim ? duration: null), postProcess);
					if (!showAnim) postProcess();
					this._datepickerShowing = false;
					var onClose = this._get(inst, 'onClose');
					if (onClose) onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ''), inst]);
					this._lastInput = null;
					if (this._inDialog) {
						this._dialogInput.css({
							position: 'absolute',
							left: '0',
							top: '-100px'
						});
						if ($.blockUI) {
							$.unblockUI();
							$('body').append(this.dpDiv);
						}
					}
					this._inDialog = false;
				}
			},

			/* Tidy up after a dialog display. */
			_tidyDialog: function(inst) {
				inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
			},

			/* Close date picker if clicked elsewhere. */
			_checkExternalClick: function(event) {
				if (!$.datepicker._curInst) return;

				var $target = $(event.target),
				inst = $.datepicker._getInst($target[0]);

				if ((($target[0].id != $.datepicker._mainDivId && $target.parents('#' + $.datepicker._mainDivId).length == 0 && !$target.hasClass($.datepicker.markerClassName) && !$target.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))) || ($target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != inst)) $.datepicker._hideDatepicker();
			},

			/* Adjust one of the date sub-fields. */
			_adjustDate: function(id, offset, period) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				if (this._isDisabledDatepicker(target[0])) {
					return;
				}
				this._adjustInstDate(inst, offset + (period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo
				// positioning
				period);
				this._updateDatepicker(inst);
				// add by zhaowj 初始化 日期输入框
				if (inst.settings.timePicker == true) {
					$initTimeInput();
				}
			},
			/* Adjust one of the date sub-fields. */
			_adjustYear: function(id, offset, period) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				if (offset == "-1") {
					if (inst.startyear > 1900) {
						inst.startyear -= 10;
						inst.endyear -= 10;
					}
				} else {
					if (inst.startyear < 2099) {
						inst.startyear += 10;
						inst.endyear += 10;
					}
				}
				this._updateDatepicker(inst);
				// add by zhaowj 初始化 日期输入框
				if (inst.settings.timePicker == true) {
					$initTimeInput();
				}
			},
			_adjustYearmonth: function(id, offset, period) {
				//debugger;
				var target = $(id);
				var inst = this._getInst(target[0]);
				if (offset == "-10") {
					if (inst.startyear > 1900) {
						inst.startyear -= 10;
						inst.endyear -= 10;
					}
				}
				if (offset == "-1") {
					if (inst.startyear > 1900) {
						inst.currentyear -= 1;
						//inst.endyear-=1;
					}
				} else {
					if (offset == "10") {
						if (inst.startyear < 2099) {
							inst.startyear += 10;
							inst.endyear += 10;
						}
					}
					if (offset == "1") {
						if (inst.startyear < 2099) {
							inst.currentyear += 1;
							//inst.endyear+=1;
						}
					}

				}
				this._updateDatepicker(inst);
				// add by zhaowj 初始化 日期输入框
				if (inst.settings.timePicker == true) {
					$initTimeInput();
				}
			},
			/* Action for current link. */
			_gotoToday: function(id) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
					inst.selectedDay = inst.currentDay;
					inst.drawMonth = inst.selectedMonth = inst.currentMonth;
					inst.drawYear = inst.selectedYear = inst.currentYear;
				} else {
					var date = new Date();
					inst.selectedDay = date.getDate();
					inst.drawMonth = inst.selectedMonth = date.getMonth();
					inst.drawYear = inst.selectedYear = date.getFullYear();
				}
				this._notifyChange(inst);
				this._adjustDate(target);

				var e = jQuery.Event("keydown"); // 模拟一个键盘事件
				e.keyCode = 13; // keyCode=13是回车
				target.trigger(e);
			},

			/* Action for selecting a new month/year. */
			_selectMonthYear: function(id, select, period) {

				var target = $(id);
				var inst = this._getInst(target[0]);
				inst['selected' + (period == 'M' ? 'Month': 'Year')] = inst['draw' + (period == 'M' ? 'Month': 'Year')] = parseInt(select.options[select.selectedIndex].value, 10);
				this._notifyChange(inst);
				this._adjustDate(target);
			},
			_selectMonthYear2: function(id, ul, period, event) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				inst['selected' + (period == 'M' ? 'Month': 'Year')] = inst['draw' + (period == 'M' ? 'Month': 'Year')] = parseInt($(event.srcElement || event.target).val());
				this._notifyChange(inst);
				this._adjustDate(target);
			},
			/* Action for selecting a day. */
			// add by zhaowj 修改方法，增加时分秒的支持
			_selectDay: function(id, month, year, td) {
				//debugger
				var target = $(id);
				if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
					return;
				}
				var inst = this._getInst(target[0]);
				if (inst.settings.timePicker != true && inst.settings.yearmonth == true) {
					inst.selectedYear = inst.currentYear = year;
					this._selectDate(id, year);
				} else if (inst.settings.timePicker != true && inst.settings.year == true) {
					inst.selectedYear = inst.currentYear = year;
					this._selectDate(id, year);
				} else {
					inst.selectedDay = inst.currentDay = $('a', td).html();
					inst.selectedMonth = inst.currentMonth = month;
					inst.selectedYear = inst.currentYear = year;
					inst.selectedHour = $("#date_hour").val();
					inst.selectedMinutes = $("#date_minutes").val();
					inst.selectedSeconds = $("#date_seconds").val();

					/**
				 * modify by zhaowj begin
				 */
					var year = inst.currentYear;
					var month = inst.currentMonth;
					var day = inst.currentDay;
					var hour = $("#date_hour").val();
					hour = $.trim(hour);
					var minutes = $("#date_minutes").val();
					minutes = $.trim(minutes);
					var seconds = $("#date_seconds").val();
					seconds = $.trim(seconds);
					if (hour == "") {
						hour = "00";
						inst.selectedHour = "00";
					}
					if (minutes == "") {
						minutes = "00";
						inst.selectedMinutes = "00";
					}
					if (seconds == "") {
						seconds = "00";
						inst.selectedSeconds = "00";
					}
					if (isNaN(hour) || isNaN(minutes)) {
						alert("时间格式不正确！");
						return;
					}

					if (hour >= 24) {
						hour = 23;
					}

					if (minutes >= 60) {
						minutes = 59;
					}

					if (seconds >= 60) {
						seconds = 59;
					}
					if (hour.length == 1) {
						hour = "0" + hour;
					}

					if (minutes.length == 1) {
						minutes = "0" + minutes;
					}
					if (seconds.length == 1) {
						seconds = "0" + seconds;
					}
					// this._selectDate(id, dateStr);
					this._selectDate(id, this._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear, hour, minutes, seconds));
				}

				/**
			 * modify by zhaowj end
			 */
			},

			/* Erase the input field and hide the date picker. */
			_clearDate: function(id) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				this._selectDate(target, '');
			},

			/* Update the input field with the selected date. */
			_selectDate: function(id, dateStr) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				dateStr = (dateStr != null ? dateStr: this._formatDate(inst));
				if (inst.input) inst.input.val(dateStr);
				this._updateAlternate(inst);
				var onSelect = this._get(inst, 'onSelect');
				if (onSelect) onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]); // trigger
				// custom
				// callback
				else if (inst.input) inst.input.trigger('change'); // fire the change event
				if (inst.inline) this._updateDatepicker(inst);
				else {
					this._hideDatepicker();
					this._lastInput = inst.input[0];
					if (typeof(inst.input[0]) != 'object') inst.input.focus(); // restore focus
					this._lastInput = null;
				}
			},

			/* Update any alternate field to synchronise with the main field. */
			_updateAlternate: function(inst) {
				var altField = this._get(inst, 'altField');
				if (altField.indexOf(".") > 0) {
					var alts = altField.split(".");
					altField = alts[0] + "\\." + alts[1];
					altField.toString();
					if (altField.indexOf("[") > 0) {
						alts = altField.split("[");
						altField = alts[0] + "\\[" + alts[1];
						altField.toString();
					}
					if (altField.indexOf("]") > 0) {
						alts = altField.split("]");
						altField = alts[0] + "\\]" + alts[1];
						altField.toString();
					}

				}
				if (altField) { // update alternate field too
					if (inst.settings.yearmonth == true || inst.settings.year == true) {

						var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
						$(altField).each(function() {
							$(this).val(inst.currentYear);
						});
					} else {
						var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
						var date = this._getDate(inst);
						var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
						$(altField).each(function() {
							$(this).val(dateStr);
						});
					}
				}
			},

			/*
		 * Set as beforeShowDay function to prevent selection of weekends. @param
		 * date Date - the date to customise @return [boolean, string] - is this
		 * date selectable?, what is its CSS class?
		 */
			noWeekends: function(date) {
				var day = date.getDay();
				return [(day > 0 && day < 6), ''];
			},

			/*
		 * Set as calculateWeek to determine the week of the year based on the ISO
		 * 8601 definition. @param date Date - the date to get the week for @return
		 * number - the number of the week within the year that contains this date
		 */
			iso8601Week: function(date) {
				var checkDate = new Date(date.getTime());
				// Find Thursday of this week starting on Monday
				checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
				var time = checkDate.getTime();
				checkDate.setMonth(0); // Compare with Jan 1
				checkDate.setDate(1);
				return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
			},

			/*
		 * Parse a string value into a date object. See formatDate below for the
		 * possible formats.
		 * 
		 * @param format string - the expected format of the date @param value
		 * string - the date in the above format @param settings Object - attributes
		 * include: shortYearCutoff number - the cutoff year for determining the
		 * century (optional) dayNamesShort string[7] - abbreviated names of the
		 * days from Sunday (optional) dayNames string[7] - names of the days from
		 * Sunday (optional) monthNamesShort string[12] - abbreviated names of the
		 * months (optional) monthNames string[12] - names of the months (optional)
		 * @return Date - the extracted date value or null if value is blank
		 */
			parseDate: function(format, value, settings) {
				if (format == null || value == null) throw 'Invalid arguments';
				value = (typeof value == 'object' ? value.toString() : value + '');
				if (value == '') return null;
				var shortYearCutoff = (settings ? settings.shortYearCutoff: null) || this._defaults.shortYearCutoff;
				shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff: new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
				var dayNamesShort = (settings ? settings.dayNamesShort: null) || this._defaults.dayNamesShort;
				var dayNames = (settings ? settings.dayNames: null) || this._defaults.dayNames;
				var monthNamesShort = (settings ? settings.monthNamesShort: null) || this._defaults.monthNamesShort;
				var monthNames = (settings ? settings.monthNames: null) || this._defaults.monthNames;
				var year = -1;
				var month = -1;
				var day = -1;
				var doy = -1;
				var literal = false;
				// Check whether a format character is doubled
				var lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
					if (matches) iFormat++;
					return matches;
				};
				// Extract a number from the string value
				var getNumber = function(match) {
					var isDoubled = lookAhead(match);
					var size = (match == '@' ? 14 : (match == '!' ? 20 : (match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
					var digits = new RegExp('^\\d{1,' + size + '}');
					var num = value.substring(iValue).match(digits);
					if (!num) throw 'Missing number at position ' + iValue;
					iValue += num[0].length;
					return parseInt(num[0], 10);
				};
				// Extract a name from the string value and convert to an index
				var getName = function(match, shortNames, longNames) {
					var names = $.map(lookAhead(match) ? longNames: shortNames,
					function(v, k) {
						return [[k, v]];
					}).sort(function(a, b) {
						return - (a[1].length - b[1].length);
					});
					var index = -1;
					$.each(names,
					function(i, pair) {
						var name = pair[1];
						if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
							index = pair[0];
							iValue += name.length;
							return false;
						}
					});
					if (index != -1) return index + 1;
					else throw 'Unknown name at position ' + iValue;
				};
				// Confirm that a literal character matches the string value
				var checkLiteral = function() {
					if (value.charAt(iValue) != format.charAt(iFormat)) throw 'Unexpected literal at position ' + iValue;
					iValue++;
				};
				var iValue = 0;
				for (var iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) if (format.charAt(iFormat) == "'" && !lookAhead("'")) literal = false;
					else checkLiteral();
					else switch (format.charAt(iFormat)) {
						// add by zhaowj去掉'M'支持
					case 'd':
						day = getNumber('d');
						break;
					case 'D':
						getName('D', dayNamesShort, dayNames);
						break;
					case 'o':
						doy = getNumber('o');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'y':
						year = getNumber('y');
						break;
					case '@':
						var date = new Date(getNumber('@'));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case '!':
						var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'")) checkLiteral();
						else literal = true;
						break;
					default:
						checkLiteral();
					}
				}
				if (iValue < value.length) {
					throw "Extra/unparsed characters found in date: " + value.substring(iValue);
				}
				if (year == -1) year = new Date().getFullYear();
				else if (year < 100) year += new Date().getFullYear() - new Date().getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100);
				if (doy > -1) {
					month = 1;
					day = doy;
					do {
						var dim = this._getDaysInMonth(year, month - 1);
						if (day <= dim) break;
						month++;
						day -= dim;
					} while ( true );
				}
				var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
				if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day) throw 'Invalid date'; // E.g. 31/02/00
				return date;
			},

			/* Standard date formats. */
			ATOM: 'yy-mm-dd',
			// RFC 3339 (ISO 8601)
			COOKIE: 'D, dd M yy',
			ISO_8601: 'yy-mm-dd',
			RFC_822: 'D, d M y',
			RFC_850: 'DD, dd-M-y',
			RFC_1036: 'D, d M y',
			RFC_1123: 'D, d M yy',
			RFC_2822: 'D, d M yy',
			RSS: 'D, d M y',
			// RFC 822
			TICKS: '!',
			TIMESTAMP: '@',
			W3C: 'yy-mm-dd',
			// ISO 8601
			_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

			/*
		 * Format a date object into a string value. The format can be combinations
		 * of the following: d - day of month (no leading zero) dd - day of month
		 * (two digit) o - day of year (no leading zeros) oo - day of year (three
		 * digit) D - day name short DD - day name long m - month of year (no
		 * leading zero) mm - month of year (two digit) M - month name short MM -
		 * month name long y - year (two digit) yy - year (four digit) @ - Unix
		 * timestamp (ms since 01/01/1970) ! - Windows ticks (100ns since
		 * 01/01/0001) '...' - literal text '' - single quote
		 * 
		 * @param format string - the desired format of the date @param date Date -
		 * the date value to format @param settings Object - attributes include:
		 * dayNamesShort string[7] - abbreviated names of the days from Sunday
		 * (optional) dayNames string[7] - names of the days from Sunday (optional)
		 * monthNamesShort string[12] - abbreviated names of the months (optional)
		 * monthNames string[12] - names of the months (optional) @return string -
		 * the date in the above format
		 */
			formatDate: function(format, date, settings) {
				if (!date) return '';
				var dayNamesShort = (settings ? settings.dayNamesShort: null) || this._defaults.dayNamesShort;
				var dayNames = (settings ? settings.dayNames: null) || this._defaults.dayNames;
				var monthNamesShort = (settings ? settings.monthNamesShort: null) || this._defaults.monthNamesShort;
				var monthNames = (settings ? settings.monthNames: null) || this._defaults.monthNames;
				// Check whether a format character is doubled
				var lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
					if (matches) iFormat++;
					return matches;
				};
				// Format a number, with leading zero if necessary
				var formatNumber = function(match, value, len) {
					var num = '' + value;
					if (lookAhead(match)) while (num.length < len) num = '0' + num;
					return num;
				};
				// Format a name, short or long as requested
				var formatName = function(match, value, shortNames, longNames) {
					return (lookAhead(match) ? longNames[value] : shortNames[value]);
				};
				var output = '';
				var literal = false;
				if (date) for (var iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) if (format.charAt(iFormat) == "'" && !lookAhead("'")) literal = false;
					else output += format.charAt(iFormat);
					else switch (format.charAt(iFormat)) {
					case 'h':
						output += formatNumber('h', date.getHours(), 2);
						break;
					case 'M':
						output += formatNumber('M', date.getMinutes(), 2);
						break;
					case 's':
						output += formatNumber('s', date.getSeconds(), 2);
						break;
					case 'd':
						output += formatNumber('d', date.getDate(), 2);
						break;
					case 'D':
						output += formatName('D', date.getDay(), dayNamesShort, dayNames);
						break;
					case 'o':
						output += formatNumber('o', Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
						break;
					case 'm':
						output += formatNumber('m', date.getMonth() + 1, 2);
						break;
					case 'y':
						output += (lookAhead('y') ? date.getFullYear() : (date.getYear() % 100 < 10 ? '0': '') + date.getYear() % 100);
						break;
					case '@':
						output += date.getTime();
						break;
					case '!':
						output += date.getTime() * 10000 + this._ticksTo1970;
						break;
					case "'":
						if (lookAhead("'")) output += "'";
						else literal = true;
						break;
					default:
						output += format.charAt(iFormat);
					}
				}
				return output;
			},

			/* Extract all possible characters from the date format. */
			_possibleChars: function(format) {
				var chars = '';
				var literal = false;
				// Check whether a format character is doubled
				var lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
					if (matches) iFormat++;
					return matches;
				};
				for (var iFormat = 0; iFormat < format.length; iFormat++) if (literal) if (format.charAt(iFormat) == "'" && !lookAhead("'")) literal = false;
				else chars += format.charAt(iFormat);
				else switch (format.charAt(iFormat)) {
				case 'd':
				case 'm':
				case 'y':
				case '@':
					chars += '0123456789';
					break;
				case 'D':
				case 'M':
					return null; // Accept anything
				case "'":
					if (lookAhead("'")) chars += "'";
					else literal = true;
					break;
				default:
					chars += format.charAt(iFormat);
				}
				return chars;
			},

			/* Get a setting value, defaulting if necessary. */
			_get: function(inst, name) {
				return inst.settings[name] !== undefined ? inst.settings[name] : this._defaults[name];
			},

			/* Parse existing date and initialise date picker. */
			_setDateFromField: function(inst, noDefault) {
				if (inst.input.val() == inst.lastVal) {
					return;
				}
				var dateFormat = this._get(inst, 'dateFormat');
				var dates = inst.lastVal = inst.input ? inst.input.val() : null;
				var date, defaultDate;
				date = defaultDate = this._getDefaultDate(inst);
				var settings = this._getFormatConfig(inst);
				try {
					date = this.parseDate(dateFormat, dates, settings) || defaultDate;
				} catch(event) {
					this.log(event);
					dates = (noDefault ? '': dates);
				}
				inst.selectedDay = date.getDate();
				inst.drawMonth = inst.selectedMonth = date.getMonth();
				inst.drawYear = inst.selectedYear = date.getFullYear();
				inst.currentDay = (dates ? date.getDate() : 0);
				inst.currentMonth = (dates ? date.getMonth() : 0);
				inst.currentYear = (dates ? date.getFullYear() : 0);
				this._adjustInstDate(inst);
			},

			/* Retrieve the default date shown on opening. */
			_getDefaultDate: function(inst) {
				return this._restrictMinMax(inst, this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
			},

			/* A date may be specified as an exact value or a relative one. */
			_determineDate: function(inst, date, defaultDate) {
				var offsetNumeric = function(offset) {
					var date = new Date();
					date.setDate(date.getDate() + offset);
					return date;
				};
				var offsetString = function(offset) {
					try {
						return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'), offset, $.datepicker._getFormatConfig(inst));
					} catch(e) {
						// Ignore
					}
					var date = (offset.toLowerCase().match(/^c/) ? $.datepicker._getDate(inst) : null) || new Date();
					var year = date.getFullYear();
					var month = date.getMonth();
					var day = date.getDate();
					var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
					var matches = pattern.exec(offset);
					while (matches) {
						switch (matches[2] || 'd') {
						case 'd':
						case 'D':
							day += parseInt(matches[1], 10);
							break;
						case 'w':
						case 'W':
							day += parseInt(matches[1], 10) * 7;
							break;
						case 'm':
						case 'M':
							month += parseInt(matches[1], 10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						case 'y':
						case 'Y':
							year += parseInt(matches[1], 10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						}
						matches = pattern.exec(offset);
					}
					return new Date(year, month, day);
				};
				var newDate = (date == null || date === '' ? defaultDate: (typeof date == 'string' ? offsetString(date) : (typeof date == 'number' ? (isNaN(date) ? defaultDate: offsetNumeric(date)) : new Date(date.getTime()))));
				newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate: newDate);
				if (newDate) {
					newDate.setHours(0);
					newDate.setMinutes(0);
					newDate.setSeconds(0);
					newDate.setMilliseconds(0);
				}
				return this._daylightSavingAdjust(newDate);
			},

			/*
		 * Handle switch to/from daylight saving. Hours may be non-zero on daylight
		 * saving cut-over: > 12 when midnight changeover, but then cannot generate
		 * midnight datetime, so jump to 1AM, otherwise reset. @param date (Date)
		 * the date to check @return (Date) the corrected date
		 */
			_daylightSavingAdjust: function(date) {
				if (!date) return null;
				date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
				return date;
			},

			/* Set the date(s) directly. */
			_setDate: function(inst, date, noChange) {
				var clear = !date;
				var origMonth = inst.selectedMonth;
				var origYear = inst.selectedYear;
				var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
				inst.selectedDay = inst.currentDay = newDate.getDate();
				inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
				inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
				if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange) this._notifyChange(inst);
				this._adjustInstDate(inst);
				if (inst.input) {
					inst.input.val(clear ? '': this._formatDate(inst));
				}
			},

			/* Retrieve the date(s) directly. */
			// modify by zhaowj
			_getDate: function(inst) {
				var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null: new Date(inst.currentYear, inst.currentMonth, inst.currentDay, inst.selectedHour, inst.selectedMinutes, inst.selectedSeconds));
				return startDate;
			},

			/* Generate the HTML for the current state of the date picker. */
			// modify by zhaowj
			_generateHTML: function(inst) {
				//debugger;
				if (inst.settings.timePicker != true && inst.settings.yearmonth == true) {

					var cornerClass = ' ui-corner-all';
					var now = new Date();
					var year = now.getFullYear();
					var month = now.getMonth() + 1;

					var today = new Date();
					today = this._daylightSavingAdjust(new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear
					// time
					var isRTL = this._get(inst, 'isRTL');
					var showButtonPanel = this._get(inst, 'showButtonPanel');
					var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
					var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
					var numMonths = this._getNumberOfMonths(inst);
					var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
					if (inst.istenyearschema == "1") {
						var stepMonths = 10
					} else {
						var stepMonths = 1
					}
					var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
					var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) : new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
					var minDate = this._getMinMaxDate(inst, 'min');
					var maxDate = this._getMinMaxDate(inst, 'max');
					var drawMonth = inst.drawMonth - showCurrentAtPos;
					var drawYear = inst.drawYear;
					if (drawMonth < 0) {
						drawMonth += 12;
						drawYear--;
					}
					if (maxDate) {
						var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
						maxDraw = (minDate && maxDraw < minDate ? minDate: maxDraw);
						while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
							drawMonth--;
							if (drawMonth < 0) {
								drawMonth = 11;
								drawYear--;
							}
						}
					}
					inst.drawMonth = drawMonth;
					inst.drawYear = drawYear;
					var prevText = this._get(inst, 'prevText');
					prevText = (!navigationAsDateFormat ? prevText: this.formatDate(prevText, this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)), this._getFormatConfig(inst)));
					var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._adjustYearmonth(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' + ' title="前一年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'e': 'w') + '">' + prevText + '</span></a>': (hideIfNoPrevNext ? '': '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="前十年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'e': 'w') + '">' + prevText + '</span></a>'));
					var nextText = this._get(inst, 'nextText');
					nextText = (!navigationAsDateFormat ? nextText: this.formatDate(nextText, this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)), this._getFormatConfig(inst)));
					var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._adjustYearmonth(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' + ' title="后一年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'w': 'e') + '">' + nextText + '</span></a>': (hideIfNoPrevNext ? '': '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="后十年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'w': 'e') + '">' + nextText + '</span></a>'));
					var currentText = this._get(inst, 'currentText');
					var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate: today);
					currentText = (!navigationAsDateFormat ? currentText: this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
					var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._clearDatepicker(\'#' + inst.id + '\');">清除</button><button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>': '');
					var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls: '') + (isRTL ? '': controls) + '</div>': '';
					var firstDay = parseInt(this._get(inst, 'firstDay'), 10);
					firstDay = (isNaN(firstDay) ? 0 : firstDay);
					var showWeek = this._get(inst, 'showWeek');
					var dayNames = this._get(inst, 'dayNames');
					var dayNamesShort = this._get(inst, 'dayNamesShort');
					var dayNamesMin = this._get(inst, 'dayNamesMin');
					var monthNames = this._get(inst, 'monthNames');
					var monthNamesShort = this._get(inst, 'monthNamesShort');
					var beforeShowDay = this._get(inst, 'beforeShowDay');
					var showOtherMonths = this._get(inst, 'showOtherMonths');
					var selectOtherMonths = this._get(inst, 'selectOtherMonths');
					var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
					var defaultDate = this._getDefaultDate(inst);
					var html = '';
					for (var row = 0; row < numMonths[0]; row++) {
						var group = '';
						this.maxRows = 4;
						for (var col = 0; col < numMonths[1]; col++) {
							var cornerClass = ' ui-corner-all';
							var calender = '';

							calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' + (/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next: prev) : '') + (/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev: next) : '') + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw
							// month
							// headers
							'</div><table id="ui-datepicker-calendar-year' + inst.istenyearschema + 'month" class="ui-datepicker-calendar datepicker_yearMonth_table">';
							calender += '<tbody>';
							for (var dRow = 0; dRow < 3; dRow++) { // create
								// date
								// picker
								// rows
								calender += '<tr>';
								if (inst.istenyearschema == 0) {
									var tbody = '<td><span>' + (1 + dRow * 4) + '</span>月</td><td><span>' + (2 + dRow * 4) + '</span>月</td><td><span>' + (3 + dRow * 4) + '</span>月</td><td><span>' + (4 + dRow * 4) + '</span>月</td>';
								} else {
									var tbody = '<td><span>' + (inst.startyear - 1 + dRow * 4) + '</span>年</td><td><span>' + (inst.startyear + dRow * 4) + '</span>年</td><td><span>' + (inst.startyear + 1 + dRow * 4) + '</span>年</td><td><span>' + (inst.startyear + 2 + dRow * 4) + '</span>年</td>';
								}
								calender += tbody + '</tr>';
							}
							calender += '</tbody></table>';
							group += calender;
						}
						html += group;
					}
					html += buttonPanel + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !inst.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>': '');
					inst._keyEvent = false;
					$("#ui-datepicker-calendar-year1month tr td").die().live("click",
					function() {
						inst.currentyear = parseInt($(this).children().text());
						inst.istenyearschema = 0;
						$.datepicker._updateDatepicker(inst);

					});
					$("#ui-datepicker-calendar-year0month tr td").die().live("click",
					function() {
						var yearmonth = "";
						var month = $(this).children().text();
						if (month.length == 1) {
							yearmonth = inst.currentyear + "0" + $(this).children().text();
						} else {
							yearmonth = inst.currentyear + $(this).children().text();
						}
						$.datepicker._selectDay("#" + inst.id, "", yearmonth, this);
					});
					return html;

				}
				if (inst.settings.timePicker != true && inst.settings.year == true) {
					var cornerClass = ' ui-corner-all';
					var now = new Date();
					var year = now.getFullYear();
					var month = now.getMonth() + 1;

					var today = new Date();
					today = this._daylightSavingAdjust(new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear
					// time
					var isRTL = this._get(inst, 'isRTL');
					var showButtonPanel = this._get(inst, 'showButtonPanel');
					var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
					var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
					var numMonths = this._getNumberOfMonths(inst);
					var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
					var stepMonths = this._get(inst, 'stepMonths');
					var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
					var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) : new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
					var minDate = this._getMinMaxDate(inst, 'min');
					var maxDate = this._getMinMaxDate(inst, 'max');
					var drawMonth = inst.drawMonth - showCurrentAtPos;
					var drawYear = inst.drawYear;
					if (drawMonth < 0) {
						drawMonth += 12;
						drawYear--;
					}
					if (maxDate) {
						var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
						maxDraw = (minDate && maxDraw < minDate ? minDate: maxDraw);
						while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
							drawMonth--;
							if (drawMonth < 0) {
								drawMonth = 11;
								drawYear--;
							}
						}
					}
					inst.drawMonth = drawMonth;
					inst.drawYear = drawYear;
					var prevText = this._get(inst, 'prevText');
					prevText = (!navigationAsDateFormat ? prevText: this.formatDate(prevText, this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)), this._getFormatConfig(inst)));
					var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._adjustYear(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' + ' title="前十年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'e': 'w') + '">' + prevText + '</span></a>': (hideIfNoPrevNext ? '': '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="前十年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'e': 'w') + '">' + prevText + '</span></a>'));
					var nextText = this._get(inst, 'nextText');
					nextText = (!navigationAsDateFormat ? nextText: this.formatDate(nextText, this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)), this._getFormatConfig(inst)));
					var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._adjustYear(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' + ' title="后十年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'w': 'e') + '">' + nextText + '</span></a>': (hideIfNoPrevNext ? '': '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="后十年"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'w': 'e') + '">' + nextText + '</span></a>'));
					var currentText = this._get(inst, 'currentText');
					var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate: today);
					currentText = (!navigationAsDateFormat ? currentText: this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
					var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._clearDatepicker(\'#' + inst.id + '\');">清除</button><button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>': '');
					var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls: '') + (isRTL ? '': controls) + '</div>': '';
					var firstDay = parseInt(this._get(inst, 'firstDay'), 10);
					firstDay = (isNaN(firstDay) ? 0 : firstDay);
					var showWeek = this._get(inst, 'showWeek');
					var dayNames = this._get(inst, 'dayNames');
					var dayNamesShort = this._get(inst, 'dayNamesShort');
					var dayNamesMin = this._get(inst, 'dayNamesMin');
					var monthNames = this._get(inst, 'monthNames');
					var monthNamesShort = this._get(inst, 'monthNamesShort');
					var beforeShowDay = this._get(inst, 'beforeShowDay');
					var showOtherMonths = this._get(inst, 'showOtherMonths');
					var selectOtherMonths = this._get(inst, 'selectOtherMonths');
					var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
					var defaultDate = this._getDefaultDate(inst);
					var html = '';
					for (var row = 0; row < numMonths[0]; row++) {
						var group = '';
						this.maxRows = 4;
						for (var col = 0; col < numMonths[1]; col++) {
							var cornerClass = ' ui-corner-all';
							var calender = '';

							calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' + (/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next: prev) : '') + (/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev: next) : '') + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw
							// month
							// headers
							'</div><table id="ui-datepicker-calendar-year" class="ui-datepicker-calendar datepicker_year_table">';
							calender += '<tbody>';
							for (var dRow = 0; dRow < 3; dRow++) { // create
								// date
								// picker
								// rows
								calender += '<tr>';

								var tbody = '<td><span>' + (inst.startyear - 1 + dRow * 4) + '</span></td><td><span>' + (inst.startyear + dRow * 4) + '</span></td><td><span>' + (inst.startyear + 1 + dRow * 4) + '</span></td><td><span>' + (inst.startyear + 2 + dRow * 4) + '</span></td>';

								calender += tbody + '</tr>';
							}
							calender += '</tbody></table>';
							group += calender;
						}
						html += group;
					}
					html += buttonPanel + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !inst.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>': '');
					inst._keyEvent = false;
					$("#ui-datepicker-calendar-year tr td span").unbind("click");
					$("#ui-datepicker-calendar-year tr td span").die().live("click",
					function() {
						$.datepicker._selectDay("#" + inst.id, "", $(this).text(), this);

					});

					return html;

				} else {
					var today = new Date();
					today = this._daylightSavingAdjust(new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear
					// time
					var isRTL = this._get(inst, 'isRTL');
					var showButtonPanel = this._get(inst, 'showButtonPanel');
					var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
					var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
					var numMonths = this._getNumberOfMonths(inst);
					var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
					var stepMonths = this._get(inst, 'stepMonths');
					var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
					var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) : new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
					var minDate = this._getMinMaxDate(inst, 'min');
					var maxDate = this._getMinMaxDate(inst, 'max');
					var drawMonth = inst.drawMonth - showCurrentAtPos;
					var drawYear = inst.drawYear;
					if (drawMonth < 0) {
						drawMonth += 12;
						drawYear--;
					}
					if (maxDate) {
						var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
						maxDraw = (minDate && maxDraw < minDate ? minDate: maxDraw);
						while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
							drawMonth--;
							if (drawMonth < 0) {
								drawMonth = 11;
								drawYear--;
							}
						}
					}
					inst.drawMonth = drawMonth;
					inst.drawYear = drawYear;
					var prevText = this._get(inst, 'prevText');
					prevText = (!navigationAsDateFormat ? prevText: this.formatDate(prevText, this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)), this._getFormatConfig(inst)));
					var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._adjustDate(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' + ' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'e': 'w') + '">' + prevText + '</span></a>': (hideIfNoPrevNext ? '': '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'e': 'w') + '">' + prevText + '</span></a>'));
					var nextText = this._get(inst, 'nextText');
					nextText = (!navigationAsDateFormat ? nextText: this.formatDate(nextText, this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)), this._getFormatConfig(inst)));
					var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._adjustDate(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' + ' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'w': 'e') + '">' + nextText + '</span></a>': (hideIfNoPrevNext ? '': '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + (isRTL ? 'w': 'e') + '">' + nextText + '</span></a>'));
					var currentText = this._get(inst, 'currentText');
					var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate: today);
					currentText = (!navigationAsDateFormat ? currentText: this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
					var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._clearDatepicker(\'#' + inst.id + '\');">清除</button><button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>': '');
					var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls: '') + (this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._gotoToday(\'#' + inst.id + '\');"' + '>' + currentText + '</button>': '') + (isRTL ? '': controls) + '</div>': '';
					var firstDay = parseInt(this._get(inst, 'firstDay'), 10);
					firstDay = (isNaN(firstDay) ? 0 : firstDay);
					var showWeek = this._get(inst, 'showWeek');
					var dayNames = this._get(inst, 'dayNames');
					var dayNamesShort = this._get(inst, 'dayNamesShort');
					var dayNamesMin = this._get(inst, 'dayNamesMin');
					var monthNames = this._get(inst, 'monthNames');
					var monthNamesShort = this._get(inst, 'monthNamesShort');
					var beforeShowDay = this._get(inst, 'beforeShowDay');
					var showOtherMonths = this._get(inst, 'showOtherMonths');
					var selectOtherMonths = this._get(inst, 'selectOtherMonths');
					var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
					var defaultDate = this._getDefaultDate(inst);
					var html = '';
					for (var row = 0; row < numMonths[0]; row++) {
						var group = '';
						this.maxRows = 4;
						for (var col = 0; col < numMonths[1]; col++) {
							var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
							var cornerClass = ' ui-corner-all';
							var calender = '';
							if (isMultiMonth) {
								calender += '<div class="ui-datepicker-group';
								if (numMonths[1] > 1) switch (col) {
								case 0:
									calender += ' ui-datepicker-group-first';
									cornerClass = ' ui-corner-' + (isRTL ? 'right': 'left');
									break;
								case numMonths[1] - 1 : calender += ' ui-datepicker-group-last';
									cornerClass = ' ui-corner-' + (isRTL ? 'left': 'right');
									break;
								default:
									calender += ' ui-datepicker-group-middle';
									cornerClass = '';
									break;
								}
								calender += '">';
							}
							if (inst.settings.timePicker == true) {
								calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' + (/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next: prev) : '') + (/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev: next) : '') + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw
								// month
								// headers
								'<table><tr><td align="center">' + 
								'<input type="text" style="width:20px;line-height:20px;height:20px;" value="" id="date_hour" maxlength="2"> &nbsp:' + 
								'<input type="text" style="width:20px;line-height:20px;height:20px;" value="" id="date_minutes" maxlength="2"> &nbsp:' + 
								'<input type="text" style="width:20px;line-height:20px;height:20px;" value="" id="date_seconds" maxlength="2"></td></tr></table></div>' + 
								'<div id="timepicker-hour" class="timepicker-hour" style="z-index:92;display:none;">' + 
								'<table class="datepicker_houre_table">' + 
								'<tr><td><span>0</span></td><td><span>1</span></td><td><span>2</span></td>' + 
								'<td><span>3</span></td><td><span>4</span></td><td><span>5</span></td></tr>' + 
								'<tr><td><span>6</span></td><td><span>7</span></td><td><span>8</span></td>' + 
								'<td><span>9</span></td><td><span>10</span></td><td><span>11</span></td></tr>' + 
								'<tr><td><span>12</span></td><td><span>13</span></td><td><span>14</span></td>' + 
								'<td><span>15</span></td><td><span>16</span></td><td><span>17</span></td></tr>' + 
								'<tr><td><span>18</span></td><td><span>19</span></td><td><span>20</span></td>' + 
								'<td><span>21</span></td><td><span>22</span></td><td><span>23</span></td></tr>' + 
								'</table></div>' + 
								'<div id="timepicker-minutes" class="timepicker-hour" style="z-index:92;display:none;">' + 
								'<table class="datepicker_minute_table">' + 
								'<tr><td><span>0</span></td><td><span>1</span></td><td><span>2</span></td>' + 
								'<td><span>3</span></td><td><span>4</span></td><td><span>5</span></td>' + 
								'<td><span>6</span></td><td><span>7</span></td><td><span>8</span></td>' + 
								'<td><span>9</span></td></tr>' +
								'<tr><td><span>10</span></td><td><span>11</span></td><td><span>12</span></td>' + 
								'<td><span>13</span></td><td><span>14</span></td><td><span>15</span></td>' + 
								'<td><span>16</span></td><td><span>17</span></td><td><span>18</span></td>' + 
								'<td><span>19</span></td></tr>' + 
								'<tr><td><span>20</span></td><td><span>21</span></td><td><span>22</span></td>' + 
								'<td><span>23</span></td><td><span>24</span></td><td><span>25</span></td>' + 
								'<td><span>26</span></td><td><span>27</span></td><td><span>28</span></td>' + 
								'<td><span>29</span></td></tr>' + 
								'<tr><td><span>30</span></td><td><span>31</span></td><td><span>32</span></td>' + 
								'<td><span>33</span></td><td><span>34</span></td><td><span>35</span></td>' + 
								'<td><span>36</span></td><td><span>37</span></td><td><span>38</span></td>' + 
								'<td><span>39</span></td></tr>' + 
								'<tr><td><span>40</span></td><td><span>41</span></td><td><span>42</span></td>' + 
								'<td><span>43</span></td><td><span>44</span></td><td><span>45</span></td>' + 
								'<td><span>46</span></td><td><span>47</span></td><td><span>48</span></td>' + 
								'<td><span>49</span></td></tr>' + 
								'<tr><td><span>50</span></td><td><span>51</span></td><td><span>52</span></td>' + 
								'<td><span>53</span></td><td><span>54</span></td><td><span>55</span></td>' + 
								'<td><span>56</span></td><td><span>57</span></td><td><span>58</span></td>' + 
								'<td><span>59</span></td></tr>' + 
								'</table></div>' + 
								'<div id="timepicker-seconds" class="timepicker-hour" style="z-index:92;display:none;">' + 
								'<table class="datepicker_second_table">' + 
								'<tr><td><span>0</span></td><td><span>1</span></td><td><span>2</span></td>' + 
								'<td><span>3</span></td><td><span>4</span></td><td><span>5</span></td>' + 
								'<td><span>6</span></td><td><span>7</span></td><td><span>8</span></td>' + 
								'<td><span>9</span></td></tr>' +
								'<tr><td><span>10</span></td><td><span>11</span></td><td><span>12</span></td>' + 
								'<td><span>13</span></td><td><span>14</span></td><td><span>15</span></td>' + 
								'<td><span>16</span></td><td><span>17</span></td><td><span>18</span></td>' + 
								'<td><span>19</span></td></tr>' + 
								'<tr><td><span>20</span></td><td><span>21</span></td><td><span>22</span></td>' + 
								'<td><span>23</span></td><td><span>24</span></td><td><span>25</span></td>' + 
								'<td><span>26</span></td><td><span>27</span></td><td><span>28</span></td>' + 
								'<td><span>29</span></td></tr>' + 
								'<tr><td><span>30</span></td><td><span>31</span></td><td><span>32</span></td>' + 
								'<td><span>33</span></td><td><span>34</span></td><td><span>35</span></td>' + 
								'<td><span>36</span></td><td><span>37</span></td><td><span>38</span></td>' + 
								'<td><span>39</span></td></tr>' + 
								'<tr><td><span>40</span></td><td><span>41</span></td><td><span>42</span></td>' + 
								'<td><span>43</span></td><td><span>44</span></td><td><span>45</span></td>' + 
								'<td><span>46</span></td><td><span>47</span></td><td><span>48</span></td>' + 
								'<td><span>49</span></td></tr>' + 
								'<tr><td><span>50</span></td><td><span>51</span></td><td><span>52</span></td>' + 
								'<td><span>53</span></td><td><span>54</span></td><td><span>55</span></td>' + 
								'<td><span>56</span></td><td><span>57</span></td><td><span>58</span></td>' + 
								'<td><span>59</span></td></tr>' + 
								'</table></div>' + 
								'<table class="ui-datepicker-calendar"><thead>' + 
								'<tr>';
								$("#date_hour").live("focus",
								function() {
									$("#timepicker-minutes,#timepicker-seconds").hide();
									$("#timepicker-hour").show();
									$("#timepicker-hour table tr td").live("click",
									function() {
										$("#date_hour").val(($(this).text()));
										$("#timepicker-hour").hide();
									});

								});
								$("#date_minutes").live("focus",
								function() {
									$("#timepicker-hour,#timepicker-seconds").hide();
									$("#timepicker-minutes").show();
									$("#timepicker-minutes table tr td").live("click",
									function() {
										$("#date_minutes").val(($(this).text()));
										$("#timepicker-minutes").hide();
									});
								});
								$("#date_seconds").live("focus",
								function() {
									$("#timepicker-hour,#timepicker-minutes").hide();
									$("#timepicker-seconds").show();
									$("#timepicker-seconds table tr td").live("click",
									function() {
										$("#date_seconds").val(($(this).text()));
										$("#timepicker-seconds").hide();
									});
								});
								$("#date_hour,#date_minutes,#date_seconds").live("focusout",
								function() {
									$("#timepicker-hour,#timepicker-minutes,#timepicker-seconds").fadeOut(200);
								});

							} else {
								calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' + (/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next: prev) : '') + (/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev: next) : '') + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw
								// month
								// headers
								'</div><table class="ui-datepicker-calendar"><thead>' + '<tr>';
							}
							var thead = (showWeek ? '<th class="ui-datepicker-week-col">' + this._get(inst, 'weekHeader') + '</th>': '');
							for (var dow = 0; dow < 7; dow++) { // days of the week
								var day = (dow + firstDay) % 7;
								thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"': '') + '>' + '<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
							}
							calender += thead + '</tr></thead><tbody>';
							var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
							if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth) inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
							var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
							var curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate
							// the
							// number
							// of
							// rows
							// to
							// generate
							var numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows: curRows: curRows); // If
							// multiple
							// months,
							// use
							// the
							// higher
							// number
							// of
							// rows
							// (see
							// #7043)
							this.maxRows = numRows;
							var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
							for (var dRow = 0; dRow < numRows; dRow++) { // create
								// date
								// picker
								// rows
								calender += '<tr>';
								var tbody = (!showWeek ? '': '<td class="ui-datepicker-week-col">' + this._get(inst, 'calculateWeek')(printDate) + '</td>');
								for (var dow = 0; dow < 7; dow++) { // create date
									// picker days
									var daySettings = (beforeShowDay ? beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
									var otherMonth = (printDate.getMonth() != drawMonth);
									var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
									tbody += '<td class="' + ((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end': '') + // highlight
									// weekends
									(otherMonth ? ' ui-datepicker-other-month': '') + // highlight
									// days
									// from
									// other
									// months
									((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user
									// pressed
									// key
									(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
									// or defaultDate is current printedDate and
									// defaultDate is selectedDate
									' ' + this._dayOverClass: '') + // highlight
									// selected
									// day
									(unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') + // highlight
									// unselectable
									// days
									(otherMonth && !showOtherMonths ? '': ' ' + daySettings[1] + // highlight
									// custom
									// dates
									(printDate.getTime() == currentDate.getTime() ? ' ' + this._currentClass: '') + // highlight
									// selected
									// day
									(printDate.getTime() == today.getTime() ? ' ui-datepicker-today': '')) + '"' + // highlight
									// today
									// (if
									// different)
									((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"': '') + // cell
									// title
									(unselectable ? '': ' onclick="DP_jQuery_' + dpuuid + '.datepicker._selectDay(\'#' + inst.id + '\',' + printDate.getMonth() + ',' + printDate.getFullYear() + ', this);return false;"') + '>' + // actions
									(otherMonth && !showOtherMonths ? '&#xa0;': // display
									// for
									// other
									// months
									(unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>': '<a class="ui-state-default' + (printDate.getTime() == today.getTime() ? ' ui-state-highlight': '') + (printDate.getTime() == currentDate.getTime() ? ' ui-state-active': '') + // highlight
									// selected
									// day
									(otherMonth ? ' ui-priority-secondary': '') + // distinguish
									// dates
									// from
									// other
									// months
									'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display
									// selectable
									// date
									printDate.setDate(printDate.getDate() + 1);
									printDate = this._daylightSavingAdjust(printDate);
								}
								calender += tbody + '</tr>';
							}
							drawMonth++;
							if (drawMonth > 11) {
								drawMonth = 0;
								drawYear++;
							}
							calender += '</tbody></table>' + (isMultiMonth ? '</div>' + ((numMonths[0] > 0 && col == numMonths[1] - 1) ? '<div class="ui-datepicker-row-break"></div>': '') : '');
							group += calender;
						}
						html += group;
					}
					html += buttonPanel + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !inst.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>': '');
					inst._keyEvent = false;
					return html;
				}

			},

			/* Generate the month and year header. */
			_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort) {
				if (inst.settings.timePicker != true && inst.settings.yearmonth == true) {
					var html = '<div class="ui-datepicker-title">';
					//inst.settings.startyear='2010';
					if (inst.istenyearschema == "0") {
						html += '<span id="datepicker_currentyear">' + inst.currentyear + '</span>';

					} else {
						html += '<span id="datepicker_startyear">' + inst.startyear + '</span>-<span id="datepicker_endyear">' + inst.endyear + '</span>';

					}
					html += '</div>';
					$("#datepicker_currentyear").die().live("click",
					function() {
						inst.istenyearschema = 1;
						$.datepicker._updateDatepicker(inst);

					});
					return html;
				} else if (inst.settings.timePicker != true && inst.settings.year == true) {
					var html = '<div class="ui-datepicker-title">';
					//inst.settings.startyear='2010';
					html += '<span id="datepicker_startyear">' + inst.startyear + '</span>-<span id="datepicker_endyear">' + inst.endyear + '</span>';
					html += '</div>';
					return html;
				} else {
					var changeMonth = this._get(inst, 'changeMonth');
					var changeYear = this._get(inst, 'changeYear');
					var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
					var html = '<div class="ui-datepicker-title">';
					var monthHtml = '';
					// month selection
					if (secondary || !changeMonth) monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
					else {
						var inMinYear = (minDate && minDate.getFullYear() == drawYear);
						var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
						monthHtml += '<input readonly="readonly" class="ui-datepicker-month-input" type="text" value=' + monthNamesShort[drawMonth] + '  onclick="$.datepicker._showMonthSelect()"/>'
						/*monthHtml += '<label><select style="float:left;" class="ui-datepicker-month" ' +
						'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
					 	'>';
					for (var month = 0; month < 12; month++) {
						if ((!inMinYear || month >= minDate.getMonth()) &&
								(!inMaxYear || month <= maxDate.getMonth()))
							monthHtml += '<option value="' + month + '"' +
								(month == drawMonth ? ' selected="selected"' : '') +
								'>' + monthNamesShort[month] + '</option>';
					}
					monthHtml += '</select></label>';*/
						monthHtml += '<ul style="float:left;" class="ui-datepicker-month-ul" ' + 'onclick="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear2(\'#' + inst.id + '\', this, \'M\',event);" ' + '>';
						for (var month = 0; month < 12; month++) {
							if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) monthHtml += '<li class="ui-datepicker-month-li"  value="' + month + '"' + (month == drawMonth ? ' selected="selected"': '') + '>' + monthNamesShort[month] + '</li>';
						}
						monthHtml += '</ul>';
					}
					if (!showMonthAfterYear) html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;': '');
					// year selection
					if (!inst.yearshtml) {
						inst.yearshtml = '';
						if (secondary || !changeYear) html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
						else {
							// determine range of years to display
							var years = this._get(inst, 'yearRange').split(':');
							var thisYear = new Date().getFullYear();
							var determineYear = function(value) {
								var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) : (value.match(/[+-].*/) ? thisYear + parseInt(value, 10) : parseInt(value, 10)));
								return (isNaN(year) ? thisYear: year);
							};
							var year = determineYear(years[0]);
							var endYear = Math.max(year, determineYear(years[1] || ''));
							year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
							endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
							inst.yearshtml += '<input readonly="readonly" type="text" onclick="$.datepicker._showYearSelect(' + drawYear + ',event)" value=' + (year + 5) + '  class="ui-datepicker-year-input">';
							/*inst.yearshtml += '<select style="float:left;" onclick="$.datepicker._showYearSelect('+drawYear+')" class="ui-datepicker-year" ' +
							'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
							'>';
						for (; year <= endYear; year++) {
							inst.yearshtml += '<option value="' + year + '"' +
								(year == drawYear ? ' selected="selected"' : '') +
								'>' + year + '</option>';
						}
						inst.yearshtml += '</select>';*/
							//	inst.yearshtml += '<span style="display:inline-block;width:50px;height:22px;font-size:10px;float:left;">所有年份</span>';
							inst.yearshtml += '<ul class="ui-datepicker-year-ul"' + 'onclick="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear2(\'#' + inst.id + '\', this, \'Y\',event);" ' + '>';
							year = 1900;
							endYear = 2050;
							for (; year <= endYear; year++) {
								inst.yearshtml += '<li class="ui-datepicker-year-li" value="' + year + '"' + (year == drawYear ? ' selected="selected"': '') + '>' + year + '</li>';
							}
							inst.yearshtml += '</ul>';
							html += inst.yearshtml;
							inst.yearshtml = null;
						}
					}
					html += this._get(inst, 'yearSuffix');
					if (showMonthAfterYear) html += (secondary || !(changeMonth && changeYear) ? '&#xa0;': '') + monthHtml;
					html += '</div>'; // Close datepicker_header
					return html;

				}

			},
			_showYearSelect: function(drawYear, event) {
				$(event.srcElement || event.target).blur();
				var multiYearSelect = $("ul.ui-datepicker-year-ul");
				var scrollHeight = (drawYear - 1900) * 15;
				//$("li[selected='selected']",multiYearSelect)
				if (multiYearSelect.css("display") === "none") {
					multiYearSelect.css("display", "block");
					multiYearSelect.scrollTop(scrollHeight);

				} else {
					multiYearSelect.css("display", "none");
				}

				multiYearSelect.live('focusout',
				function() {
					$("ul.ui-datepicker-year-ul").css("display", "none")
				});

				/*multiYearSelect.blur(function(){
				$(this).css("display","none");
			})*/

			},
			_showMonthSelect: function(dpuuid) {
				var multiMonthSelect = $("ul.ui-datepicker-month-ul");
				if (multiMonthSelect.css("display") === "block") {
					multiMonthSelect.css("display", "none");
				} else {
					multiMonthSelect.css("display", "block");
				}

			},

			/* Adjust one of the date sub-fields. */
			_adjustInstDate: function(inst, offset, period) {
				var year = inst.drawYear + (period == 'Y' ? offset: 0);
				var month = inst.drawMonth + (period == 'M' ? offset: 0);
				var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period == 'D' ? offset: 0);
				var date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));
				inst.selectedDay = date.getDate();
				inst.drawMonth = inst.selectedMonth = date.getMonth();
				inst.drawYear = inst.selectedYear = date.getFullYear();
				if (period == 'M' || period == 'Y') this._notifyChange(inst);
			},

			/* Ensure a date is within any min/max bounds. */
			_restrictMinMax: function(inst, date) {
				var minDate = this._getMinMaxDate(inst, 'min');
				var maxDate = this._getMinMaxDate(inst, 'max');
				var newDate = (minDate && date < minDate ? minDate: date);
				newDate = (maxDate && newDate > maxDate ? maxDate: newDate);
				return newDate;
			},

			/* Notify change of month/year. */
			_notifyChange: function(inst) {
				var onChange = this._get(inst, 'onChangeMonthYear');
				if (onChange) onChange.apply((inst.input ? inst.input[0] : null), [inst.selectedYear, inst.selectedMonth + 1, inst]);
			},

			/* Determine the number of months to show. */
			_getNumberOfMonths: function(inst) {
				var numMonths = this._get(inst, 'numberOfMonths');
				return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
			},

			/* Determine the current maximum date - ensure no time components are set. */
			_getMinMaxDate: function(inst, minMax) {
				return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
			},

			/* Find the number of days in a given month. */
			_getDaysInMonth: function(year, month) {
				return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
			},

			/* Find the day of the week of the first of a month. */
			_getFirstDayOfMonth: function(year, month) {
				return new Date(year, month, 1).getDay();
			},

			/* Determines if we should allow a "next/prev" month display change. */
			_canAdjustMonth: function(inst, offset, curYear, curMonth) {
				var numMonths = this._getNumberOfMonths(inst);
				var date = this._daylightSavingAdjust(new Date(curYear, curMonth + (offset < 0 ? offset: numMonths[0] * numMonths[1]), 1));
				if (offset < 0) date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
				return this._isInRange(inst, date);
			},

			/* Is the given date in the accepted range? */
			_isInRange: function(inst, date) {
				var minDate = this._getMinMaxDate(inst, 'min');
				var maxDate = this._getMinMaxDate(inst, 'max');
				return ((!minDate || date.getTime() >= minDate.getTime()) && (!maxDate || date.getTime() <= maxDate.getTime()));
			},

			/* Provide the configuration settings for formatting/parsing. */
			_getFormatConfig: function(inst) {
				var shortYearCutoff = this._get(inst, 'shortYearCutoff');
				shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff: new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
				return {
					shortYearCutoff: shortYearCutoff,
					dayNamesShort: this._get(inst, 'dayNamesShort'),
					dayNames: this._get(inst, 'dayNames'),
					monthNamesShort: this._get(inst, 'monthNamesShort'),
					monthNames: this._get(inst, 'monthNames')
				};
			},

			/* Format the given date for display. */
			// modify by zhaowj
			_formatDate: function(inst, day, month, year, hour, min, sec) {
				if (!day) {
					inst.currentDay = inst.selectedDay;
					inst.currentMonth = inst.selectedMonth;
					inst.currentYear = inst.selectedYear;
				}
				var date = (day ? (typeof day == 'object' ? day: new Date(year, month, day, hour, min, sec)) : new Date(inst.currentYear, inst.currentMonth, inst.currentDay, hour, min, sec));
				return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
			}
		});

		/*
	 * Bind hover events for datepicker elements. Done via delegate so the binding
	 * only occurs once in the lifetime of the parent div. Global instActive, set by
	 * _updateDatepicker allows the handlers to find their way back to the active
	 * picker.
	 */
		function bindHover(dpDiv) {
			var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
			return dpDiv.bind('mouseout',
			function(event) {
				var elem = $(event.target).closest(selector);
				if (!elem.length) {
					return;
				}
				elem.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover");
			}).bind('mouseover',
			function(event) {
				var elem = $(event.target).closest(selector);
				if ($.datepicker._isDisabledDatepicker(instActive.inline ? dpDiv.parent()[0] : instActive.input[0]) || !elem.length) {
					return;
				}
				elem.parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
				elem.addClass('ui-state-hover');
				if (elem.hasClass('ui-datepicker-prev')) elem.addClass('ui-datepicker-prev-hover');
				if (elem.hasClass('ui-datepicker-next')) elem.addClass('ui-datepicker-next-hover');
			});
		}

		/* jQuery extend now ignores nulls! */
		function extendRemove(target, props) {
			$.extend(target, props);
			for (var name in props) if (props[name] == null || props[name] == undefined) target[name] = props[name];
			return target;
		};

		/* Determine whether an object is an array. */
		function isArray(a) {
			return (a && (($.browser.safari && typeof a == 'object' && a.length) || (a.constructor && a.constructor.toString().match(/\Array\(\)/))));
		};

		/*
	 * Invoke the datepicker functionality. @param options string - a command,
	 * optionally followed by additional parameters or Object - settings for
	 * attaching new datepicker functionality @return jQuery object
	 */
		$.fn.datepicker = function(options) {
			if(ifCreatDatepicker==0){
			  $.datepicker = new Datepicker(); // singleton instance
			  $.datepicker.initialized = false;
			  $.datepicker.uuid = new Date().getTime()+Math.random();
			  $.datepicker.version = "1.8.18";
			  ifCreatDatepicker=1;
			}

			/* Verify an empty collection wasn't passed - Fixes #6976 */
			if (!this.length) {
				return this;
			}

			/* Initialise the date picker. */
			if (!$.datepicker.initialized) {
				$(document).mousedown($.datepicker._checkExternalClick).find('body').append($.datepicker.dpDiv);
				$.datepicker.initialized = true;
			}

			var otherArgs = Array.prototype.slice.call(arguments, 1);
			if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget')) return $.datepicker['_' + options + 'Datepicker'].apply($.datepicker, [this[0]].concat(otherArgs));
			if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string') return $.datepicker['_' + options + 'Datepicker'].apply($.datepicker, [this[0]].concat(otherArgs));

			$(this).each(function() {
				$(this).after('<input type="hidden" name="" id="" value=""/>');
				var changeMonth = $(this).attr('changeMonth');
				if (changeMonth != null || changeMonth !== undefined) {

	}
				var $next = $(this).next();
				$next.attr('name', $(this).attr('name'));
				$next.attr('id', $(this).attr('name') + '_altField');
				if (options == null || options == undefined) {
					options = {};
				}
				options.altField = '#' + $next.attr('id');
				var nextVal = $(this).val();
				var reg = new RegExp("-", "g"); // altFormat format yymmdd
				nextVal = nextVal.replace(reg, "");
				$next.val(nextVal);
				$(this).removeAttr('name');
				$(this).bind("blur",
				function() {
					var text = $(this).val();
					text = text.replace(reg, "");
					text = text.replace(/\s+/g, "");
					text = text.replace(/\:+/g, "");
					if (text == undefined || text == null) {
						return;
					} else {
						$next.val(text);
					}
				});
			});
			return this.each(function() {
				typeof options == 'string' ? $.datepicker['_' + options + 'Datepicker'].apply($.datepicker, [this].concat(otherArgs)) : $.datepicker._attachDatepicker(this, options);
			});
		};
		
		// Workaround for #4055
		// Add another global to avoid noConflict issues with inline event handlers
		window['DP_jQuery_' + dpuuid] = $;
		// add by zhaowj 增加时分秒支持
		function $initTimeInput() {
			/**
		 * add by zhaowj 初始化时间
		 */
			var now = new Date();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			$("#date_hour").val(hour);
			$("#date_minutes").val(minute);
			$("#date_seconds").val(second);
			/**
		 * add by zhaowj end
		 */
		}

	})(jQuery);
//editgrid
(function($) {
	var cloneRow =new Array();
	var validateCurtInput;
	var listName;
	var $t =new Array();
	var $clonetablehead =new Array();
	var settings = jQuery.extend({
		headerrowsize : 2,
		highlightrow : true,
		highlightclass : "highlight"
	}, {});
	$.fn.fixtableheader = function() {
		var $tbl = this;
		listName = $tbl.attr("listName");
		if(!listName){
			listName="editgridlist";
		};
		$('tbody tr', $tbl).hide();
		var tw=$tbl.width();
		var arrayWidth=[];
		var arrayThWidth=[];
		var arrayIsPercentow=[];
		$("tbody tr:hidden",$tbl).css('display',''); 
		//计算th的宽度	
		
		if(!$tbl.attr("largedata")){
	        $('thead tr th',$tbl).each(function(){
	        	var display=$(this).css("display");
	        	if(display!="none"){
	        	var thn=$('th', $(this).parent()).index(this);
	        	var thw=this.style.width||this.width;
	        	var isPercentow=thw.substring(thw.length-1,thw.length);
	        	if(isPercentow=="%"){
	        		arrayIsPercentow[thn]=1;
					var rt=thw.substring(0,thw.length-1)/100;
					var thwidth=tw*rt+"px";
					var tdwidth=tw*rt;
					arrayThWidth[thn]=tdwidth;
					var inputwidth = (tw*rt-4);
					$(this).attr("width",thwidth);
					$(this).attr("style","width:"+thwidth);
					$(this).attr("_inputWidth",inputwidth);
					arrayWidth[thn]=inputwidth+"px";	
	        	}else{
	        		arrayIsPercentow[thn]=0;
	        		var thwd="";
					if(thw.indexOf("px")>0){
						thwd=thw.substring(0,thw.length-2);
					}else{
						thwd=thw;
					}
					arrayThWidth[thn]=thwd;
					var thwdh=thwd+"px";
					var tdwdh=thwd+"px";
					var inputwidth = thwd-4;
					arrayWidth[thn]=inputwidth+"px";
					$(this).attr("width",thwidth);
					$(this).attr("style","width:"+thwidth);
					$(this).attr("_inputWidth",inputwidth);
	        	}
	        	}
	        	
	        });
			// 将th 宽度赋值给input,支持百分比
			var tri;
			for(i=0;i<$('tbody tr', $tbl).size();i++){
			 tri=$('tbody tr', $tbl).get(i);    
			$('td', tri).each(function() { 
			var display=$(this).css("display");
			if(display!="none"){
				var iconWidth="";
				var n = $('td', $(this).parent()).index(this);
				var th = $('th:eq(' + n + ')', $tbl).get(0);
				var display=th.style.display;
				var tdwidth=arrayThWidth[n];
				var inputwidth =arrayWidth[n];	
				$(this).width(tdwidth);
				$(":input",this).attr("style","width:"+inputwidth);
				if($(":input[type='text']",this).hasClass("help")&&($(":input",this).attr("type")!="hidden")){
				var inputTextHelp=$(":input[type='text']",this);
				var inputHelpWidth=($(th).attr("_inputWidth")-25)+"px";
	                       if(inputTextHelp.parent().attr("class")!="inputHelpDiv"&&inputTextHelp.attr("type")=="text"&&inputTextHelp.css("display")!="none"){
	                    	   inputTextHelp.attr("style","width:"+inputHelpWidth);
			               var inputHeight=inputTextHelp.height();
			               inputHeight=inputHeight+"px";
			               var inputOnclick=inputTextHelp.attr("onclick");
			               var inputMarginLeft=inputTextHelp.css("margin-left");
			               inputTextHelp.removeAttr("onclick");
			               inputTextHelp.wrap("<div class=\"inputHelpDiv\"  style=\"width:"+inputHelpWidth+";height:"+inputHeight+";margin-left:"+inputMarginLeft+";\" title="+$(':input',this).val()+"></div>");  
			               inputTextHelp.after("<div class=\"helpImg\" onclick=\""+inputOnclick+"\" style=\"left:"+inputHelpWidth+";\"></div>" );
		          	}
	          }
			
				}
				
			});
			}
		}else{
		$('select',$tbl).attr("original","true");
		$('input.help',$tbl).each(function(){
				 if($(this).parent().attr("class")!="inputHelpDiv"&&$(this).css("display")!="none"&&$(this).attr("type")=="text"){
				       var divMaginLeft=$(this).css("margin-left");
				       var inputHeight=$(this).height();
				       var helpImgDivHei=-inputHeight+"px";
				       var inputOnclick=$(this).attr("onclick");
				       $(this).parent("td").css("text-align","left");
				       $(this).removeAttr("onclick");
				       $(this).wrap("<div class=\"grid_help\"  style=\"width:98%;height:"+inputHeight+"px"+";\" title="+$(this).val()+" ></div>"); 
				       var inputWidth=$(this).parent('.grid_help').width();
					   var helpImgLeftWidth=(inputWidth-16)+"px";
					   $(this).after("<div class=\"helpImg\" onclick=\""+inputOnclick+"\" style=\"left:"+helpImgLeftWidth+";\"></div>" );
					}
				
			});
			$(window).resize(function(){
				var inputHelpDiv=$('.grid_help',$tbl);
			    var inputTdWid=inputHelpDiv.width();
			    inputTdWid=(inputTdWid-16)+"px";
			    inputHelpDiv.each(function(){
			    	$(this).children('.helpImg').css("left",inputTdWid);
			    })
			});
		};	
		
		
		$tbl.addClass('editgrid');
		$('tbody tr:odd', $tbl).addClass('erow');// 奇数行
		//给第一个可见列每个td增加class
		/*var allEditgridTr=$('tbody tr ',$tbl);
	    allEditgridTr.each(function(){
			$('td:visible:first',this).addClass('firstVisibleColumn');
		})*/
		//给第一个课件th增加class
        /*$('thead tr th:visible:first', $tbl).addClass('firstVisibleColumn');*/
		var fixedHeader = $tbl.attr("fixedGridHeader");
		//if(fixedHeader!=undefined){                     //判断是否浮动表头
		   $tbl.editgridFixedHeader();
		//}
		$tbl.attr("edit", true);

	}
	/**
	 * 默认的配置项
	 */
	var config = {
		selectText : true,
		isSum:false
	};

	/**
	 * 假如table还没有被转为grid就先延迟加载
	 */
	var delayEditGrid = function(tables) {
		var delayArray = [];
		$.each(tables, function(index, table) {
			if (table.grid) {
				editableGrid(table);// 调用Edit模式将table转为Edit模式
			} else {
				delayArray.push(table);// 还没有将table转为table，延迟加载一会儿,先放到延迟加载数组里面
			}
		});
		if (delayArray.length > 0) {
			setTimeout(function() {
				delayEditGrid(delayArray);// 延迟加载
			}, 10);
		}
	};
	/**
	 * 初始化通用帮助列
	 * 
	 * @param trsEl
	 * @returns
	 */
	var initHelpColumn = function(trsEl) {

	};
	/**
	 * 初始化日期列，所有日期组件公用一个
	 * 
	 * @param trsEl
	 * @returns
	 */
	var initDateColumn = function(trsEl) {

	};
	/**
	 * 获取下一个可编辑的编辑器
	 * 
	 * @param curCell
	 * @returns
	 */
	var nextEditableCell = function(curCell) {
		var curTr, nextTr, curTd, nextTd, nextEditor;
		curTd = curCell.nodeName.toLowerCase() === "td" ? curCell : $(curCell)
				.parents("td:first")[0];
		curTd = !!curTd ? curTd : $(curCell).find("td:first")[0];
		if (!curTd)
			return false;
		nextTd = curTd.nextSibling;
		if(nextTd != null) {
			while(nextTd.nodeType == 8) {
				nextTd = nextTd.nextSibling;
				if(nextTd == null)
					break;
			}
		}
		nextTd = nextTd ? (nextTd.nodeType == 3 ? curTd.nextElementSibling
				: nextTd) : nextTd;
		validateCurtInput=validate(curTd);
		if(!validateCurtInput){
			return;
		}
		if (nextTd) {
			nextEditor = $(nextTd).find(
					"input:visible,select:visible,textarea:visible,button:visible");
			if (nextEditor = isEditable(nextEditor)) {
				return nextEditor;
			} else {// 不存在可编辑的element就递归调用
				return nextEditableCell(nextTd);
			}
		} else {
			curTr = curTd.parentNode;
			nextTr = curTr.nextSibling;
			nextTr = nextTr ? (nextTr.nodeType == 3 ? curTr.nextElementSibling
					: nextTr) : nextTr;
			if (nextTr) {
				nextTd = nextTr.cells[0];
				nextEditor = $(nextTd).find(
						"input:visible,select:visible,textarea:visible,button:visible");
				if (nextEditor = isEditable(nextEditor)) {
					return nextEditor;
				} else {// 不存在可编辑的element就递归调用
					return nextEditableCell(nextTd);
				}
			} else {
				return false;// 这就是最后一个单元格不作处理
			}
		}
		
	};
	/**
	 * 获取左侧可编辑的编辑器
	 * 
	 * @param curCell
	 * @returns
	 */
	var previousEditableCell = function(curCell) {
		var curTr, previousTr, curTd, previousTd, previousEditor;
		curTd = curCell.nodeName.toLowerCase() === "td" ? curCell : $(curCell)
				.parents("td:first")[0];
		curTd = !!curTd ? curTd : $(curCell).find("td:first")[0];
		if (!curTd)
			return false;
		previousTd = curTd.previousSibling;
		if(previousTd != null) {
			while(previousTd.nodeType == 8) {
				previousTd = previousTd.previousSibling;
				if(previousTd == null)
					break;
			}
		}
		previousTd = previousTd ? (previousTd.nodeType == 3 ? previousTd.previousSibling
				: previousTd) : previousTd;
		validateCurtInput=validate(curTd);
		if(!validateCurtInput){
			return;
		}
		if (previousTd) {
			previousEditor = $(previousTd).find(
					"input:visible,select:visible,textarea:visible,button:visible");
			if (previousEditor = isEditable(previousEditor)) {
				return previousEditor;
			} else {// 不存在可编辑的element就递归调用
				return previousEditableCell(previousTd);
			}
		} else {
			curTr = curTd.parentNode;
			var curTrChiledLength=$(curTr).children().length;//获取一个tr中td的个数
			previousTr = curTr.previousSibling;
			previousTr = previousTr ? (previousTr.nodeType == 3 ? previousTr.previousSibling
					: previousTr) : previousTr;
			if (previousTr) {
				previousTd = previousTr.cells[curTrChiledLength-1];
				previousEditor = $(previousTd).find(
						"input:visible,select:visible,textarea:visible,button:visible");
				if (previousEditor = isEditable(previousEditor)) {
					return previousEditor;
				} else {// 不存在可编辑的element就递归调用
					return previousEditableCell(previousTd);
				}
			} else {
				return false;// 这就是最后一个单元格不作处理
			}
		}
		
	}
	/**
	 * 获取上侧可编辑的编辑器
	 * 
	 * @param curCell
	 * @returns
	 */
	var upEditableCell = function(curCell) {
		var curTr, upTr, curTd, upTd, upEditor;
		if(curCell.tagName==undefined){
			return;
		};
		curTd = curCell.nodeName.toLowerCase() === "td" ? curCell : $(curCell)
				.parents("td:first")[0];
		curTd = !!curTd ? curTd : $(curCell).find("td:first")[0];
		if (!curTd)
			return false;
		curTr = curTd.parentNode;
		upTr = curTr.previousSibling;
		//过滤掉文本节点
		upTr = upTr ? (upTr.nodeType == 3 ? upTr.previousSibling 
				: upTr) : upTr;
		var curIdIndex=$(curTd).index();
		upTd = $(upTr).children().eq(curIdIndex);
		validateCurtInput=validate(curTd);
		if(!validateCurtInput){
			return;
		}
		upEditor = $(upTd).find(
					"input:visible,select:visible,textarea:visible,button:visible");
			if (upEditor = isEditable(upEditor)) {
				return upEditor;
			} else {// 不存在可编辑的element就递归调用
				return upEditableCell(upTd);
			}
		return
	}
	
	/**
	 * 获取下侧可编辑的编辑器
	 * 
	 * @param curCell
	 * @returns
	 */
	var downEditableCell = function(curCell) {
		var curTr,downTr, curTd, downTd, downEditor;
		if(curCell.tagName==undefined){
			return;
		};
		curTd = curCell.nodeName.toLowerCase() === "td" ? curCell : $(curCell)
				.parents("td:first")[0];
		curTd = !!curTd ? curTd : $(curCell).find("td:first")[0];
		if (!curTd)
			return false;
		curTr = curTd.parentNode;
		downTr = curTr.nextSibling;
		downTr = downTr ? (downTr.nodeType == 3 ? downTr.nextSibling
				: downTr) : downTr;
		var curIdIndex=$(curTd).index();
		downTd = $(downTr).children().eq(curIdIndex);
		validateCurtInput=validate(curTd);
		if(!validateCurtInput){
			return;
		}
		downEditor = $(downTd).find(
					"input:visible,select:visible,textarea:visible,button:visible");
		if (downEditor = isEditable(downEditor)) {
				return downEditor;
		} else {// 不存在可编辑的element就递归调用
				return downEditableCell(downTd);
		}
		return;		
	}
	/**
	 * 判断元素是否可编辑
	 * 
	 * @param curCell
	 * @returns
	 */
	var isEditable = function(editors) {
		for ( var i = 0, len = editors.length; i < len; i++) {
			var ele = editors[i];
			var nodeName = ele.nodeName.toLowerCase(), type = ele
					.getAttribute("type"), disabled, editable, readonly;
			if (nodeName == "input"
					&& (type == "button" || type == "image" || type == "reset" || type == "submit")) {
				return false;
			}
			disabled = ele.getAttribute("disabled");
			if (disabled == true || disabled == "disabled"
					|| disabled == "true") {
				return false;
			}
			readonly = ele.getAttribute("readonly");
			if (readonly == true || readonly == "readonly"
					|| readonly == "true") {
				return false;
			}
			editable = ele.getAttribute("editable");
			if (editable === "false") {
				return false;
			}
			return ele;
		}
		return false;
	};
	/**
	 * 选中编辑器中的文字
	 * 
	 * @param curCell
	 * @returns
	 */
	var selectText = function(editor, start, end) {
		var v = $(editor).val();
		var doFocus = false;
		if (typeof v == "string" && v.length > 0) {
			start = start === undefined ? 0 : start;
			end = end === undefined ? v.length : end;
			var d = editor;
			if (d.setSelectionRange) {
				d.setSelectionRange(start, end);
			} else if (d.createTextRange) {
				var range = d.createTextRange();
				range.moveStart("character", start);
				range.moveEnd("character", end - v.length);
				range.select();
			}
			doFocus = $.browser.gecko || $.browser.opera;
		} else {
			doFocus = true;
		}
		if (doFocus) {
			editor.focus();
		}
	};
	/**
	 * 初始化键盘事件
	 * 
	 * @param editors
	 * @returns
	 */
	var initKeyboardEvents = function(table) {
		var grid = $(table);
		grid.on("keydown", function(event) {
			
			switch(event.which){
			case 13: 
				   var nextEditor = nextEditableCell(event.target);
				   if (!validateCurtInput){
					return;
				   }else{
					if (nextEditor) {
						nextEditor.focus();
						if (config.selectText) {
							selectText(nextEditor);
						}
					} else {// 没有下一个编辑器
						grid.addRow();
						nextEditor = nextEditableCell(event.target);
						nextEditor.focus();
					}	
				    }
		        	return false;		
			case 38:              //up
			       var upEditor = upEditableCell(event.target);
			       if (!validateCurtInput){
					return;
				   }else{
					if (upEditor) {
						upEditor.focus();
						/*if (config.selectText) {
							selectText(upEditor);								      
						}*/
					}
				    }
			break; 
			case 37:        // left
				var previousEditor = previousEditableCell(event.target);
				  if (!validateCurtInput){
						return;
					   }else{
						if (previousEditor) {
							
							previousEditor.focus();
							/*if (config.selectText) {
								selectText(previousEditor);								      
							}*/
						}
					    }
				break;
			case 39:             //right
				var nextEditor = nextEditableCell(event.target);
			    if (!validateCurtInput){
					return;
				   }else{
					if (nextEditor) {
						nextEditor.focus();
						/*if (config.selectText) {
							selectText(nextEditor);
						}*/
					}
				    }
			        break;
			case 40: // down
				 var downEditor = downEditableCell(event.target);
			       if (!validateCurtInput){
					return;
				   }else{
					if (downEditor) {
						downEditor.focus();
						/*if (config.selectText) {
							selectText(upEditor);								      
						}*/
					}
				    }
			break; 
				
				break;	
			}
		});
	};
	/**
	 * @param table
	 * @returns
	 */
	var editableGrid = function(table) {
		var editors = $(table).find("td div>*");
		// 先将table每个单元格转为编辑的模式，因为已经要求开发人员写了input和select，
		// 所以这里就需要专门针对通用帮助，日期组件做处理

		// 然后初始化键盘事件
		initKeyboardEvents(table);
		// 还有什么？？

		// 最后为dom增加一个标志表明已经editable了
		table.editgrid = true;

	};
	/**
	 * 增加行方法
	 * 
	 * @param index
	 *            增加行的索引，增加行时处理name，增加行时处理下拉和日期组件
	 */
	$.fn.addRow = function() {
		var editgridid = $(this).attr("id");
		var multi =$t[editgridid].attr("multiSelected")=="true"||$t[editgridid].attr("multi")=="true"
		var fixdiv=$("div[id*='editgridfixbox']");
		var length="";
		if(fixdiv.length>1){
			var edittable = $("table[edit1]");
			length=$("tbody tr",edittable).length;
			
		}else{
			 length=$("tbody tr",this).length;
			   
		}
		if(this.attr("listName")){
			var listname = this.attr("listName");
		}else{
			var listname = "editgridlist";
		}
			var clone = cloneRow[listname].clone(true).removeAttr('id');
			clone.find("td div>*").val(null);
			$(clone).find("input").val("");
			$(clone).find("select").val("");
			$(clone).find("select").removeAttr('id');
			$(clone).find("select").removeAttr('sel');
			$(":input", clone).each(function(i) {
				var inputname = $(this).attr("name");
				if(inputname!=null){

					if(inputname.indexOf(".")>0){
						var names = inputname.split(".");
						var javabean = "";
						var beanproperty = "";					
						  var indx=names[0].indexOf("[");
							if(indx>0){
								javabean = names[0].substring(0, indx);	
							}else{
								javabean = names[0];
							}
							
							beanproperty = names[1];
							var namecopy = javabean + "[" + length + "]" + "." + beanproperty;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
					}else{
						var namecopy =listname+"["+length+"]."+inputname;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
						
					}	
				
				}
	
				
			});
			clone.removeAttr('style');
			clone.attr("editgrid-add", true);
			clone.attr("index", length);
			if(fixdiv.length>1){
				var edittable1 = $("table[edit1]");
				var th1length = $("th",edittable1).length;
				
				var clone1 = clone.clone(true);
				var clone2 = clone.clone(true);
				var tr3= $('td:gt('+(th1length-1)+')',clone1).remove();
				var tr4= $('td:lt('+th1length+')',clone2).remove();
				var cls=edittable1.find("tbody tr:last").attr("class");
				if(cls){
					if(cls.indexOf("erow")>-1){
						clone1.attr("class", "");
						clone2.attr("class", "");	
					}else{
						clone1.attr("class", "erow");
						clone2.attr("class", "erow");
					}
				}else{
					clone1.attr("class", "erow");
					clone2.attr("class", "erow");
				}
				edittable1.append(clone1);
				var edittable2 = $("table[edit2]");
				
				edittable2.append(clone2);
				 setDivHeight();
				 fixCountRow();
					// 对外部组件的支持
				   $(':input',clone1).jNice();
				   $(':input',clone2).jNice();
				   $('select',clone1).each(function(){
							 $(this).multiselect();   
					});
					$('select',clone2).each(function(){
							 $(this).multiselect();	 
					});
					$(".dateImg",clone1).each(function(){
						$(this).datepicker();
					});
					$(".dateImg",clone2).each(function(){
						$(this).datepicker();
					});
			}else{
				var editgridid = $(this).attr("id");
				 var cls=$(this).find("tbody tr:last").attr("class");
					if(cls){
						if(cls.indexOf("erow")>-1){
							clone.attr("class", "");
						}else{
							clone.attr("class", "erow");
						}
					}else{
						clone.attr("class", "erow");
					}
				// $(clone).find("input[type='text']").removeAttr("id");
				$($t[editgridid]).append(clone);
				$($t[editgridid]).countRow();
				// 对外部组件的支持
				$(':input',clone).jNice();
				$('select',clone).each(function(){
						 $(this).multiselect();   
				});
				$(".dateImg",clone).each(function(){
					$(this).datepicker();
				});
			}
	
		return this;
	};
	/**
	 * 删除行方法
	 * 
	 * @param index
	 *            删除行的索引，重置删除行以后的所有行name
	 */
	$.fn.removeRow = function() {
		var editgridid = $(this).attr("id");
		var fixdiv=$("div[id*='editgridfixbox']");
		var length="";
		var index1="";
	    if(fixdiv.length>1){
			var row=this.getSelected();		
			index1=row.index();
			var table1=$("table[edit1]");
			var table2=$("table[edit2]");
			$('tbody tr:eq('+index1+')',table1).remove();
			$('tbody tr:eq('+index1+')',table2).remove();
			length=$("tbody tr",table1).length;
			if(index1>=0){	
				setIndex(table1,index1,length); 
				setIndex(table2,index1,length);  			
				}
			$('tbody tr',$t[editgridid]).removeClass("erow");
			$('tbody tr:odd:visible',$t[editgridid]).attr("class", "erow");// 奇数行
			 setDivHeight();
			 fixCountRow();
		}else{
			var row=this.getSelected();
			index1=row.index();
			row.remove();
			length=$("tbody tr",this).length;
			var table=$t[editgridid];
			if(index1>=0){					
				setIndex(table,index1,length); 			
				}
			$('tbody tr',this).removeClass("erow");
			$('tbody tr:odd:visible',this).attr("class", "erow");// 奇数行
			this.countRow();
		}
		this.putValue();
		return this;
	};
	/**
	 * 计算行数
	 * 
	 * 
	 */
	$.fn.countRow = function() {
		var row = $(this).find("tbody tr:visible");
		var rowcount = row.size();
		$("input[name='org.loushang.web.taglib.util.GRIDLENGTH']").attr(
				"value", rowcount);
	};
	setDivHeight = function(){
		var edittable1 = $("table[edit1]");
		var th = edittable1.outerHeight(true);
		var scrW = 16;
		var ch = th+scrW;
		var p1 = $('#editgridfixbox1');
		var p = $('#editgridfixbox');
		var p2 = $('#editgridfixbox2');
		 p1.css({ height: th});
		 p.css({height: th});
		 p2.css({height: ch+1});
	}
	//固定列计算行数
	fixCountRow = function(){
		var table=$("table[edit2]");
		var row = table.find("tbody tr:visible");
		var rowcount = row.size();
		$("input[name='org.loushang.web.taglib.util.GRIDLENGTH']").attr(
				"value", rowcount);
	};
	
	setIndex =function(table,index1,length){
		var editgridid = $(table).attr("id");
		var multi =$t[editgridid].attr("multiSelected")=="true"||$t[editgridid].attr("multi")=="true"
		for(j=index1;j<length;j++){
			 tri=$('tbody tr:eq('+j+')',table);
			 $(tri).attr("index",j);
			 $(":input", tri).each(function(i) {
					var inputname = $(this).attr("name");
					if(inputname!=null){
						if($(this).attr("index")!="true"||multi){
							if(inputname.indexOf(".")>0){
								var names = inputname.split(".");
								var javabean = "";
								var beanproperty = "";
	                            var indx=names[0].indexOf("[");
									if(indx>0){
										javabean = names[0].substring(0, indx);	
									}else{
										javabean = names[0];
									}
									
									beanproperty = names[1];
					              var namecopy = javabean + "[" +  j + "]" + "." + beanproperty;
					              $(this).removeAttr('name');
					              $(this).prop({
									name : namecopy
								});	
							}else{
								var namecopy =listName+"["+j+"]."+inputname;
								$(this).removeAttr('name');
								$(this).prop({
									name : namecopy
								});	
							}	
						}
					}							
				});
		}
	};
	
	/**
	 * 删除行方法
	 * 
	 * @param filed
	 *            要获取的值得列名
	 * @param index
	 *            要获取哪一行的值的索引
	 */
	$.fn.getValue = function(field, index) {
		var tr = $($t[editgridid]).find("tbody tr:visible").eq(index);
		var editor = tr.find("td [name=" + field + "]");
		return editor.val();
	};
	/**
	 * 得到选择行
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.getSelected = function() {
		var trcount=$('.selected',this);		
		return trcount;
	};
	/*获取合计行对象*/
	$.fn.getEditgridSumTr = function(){
		var tableSumTr = $("tfoot tr",this);
		return  tableSumTr;
	}
	getFixSelected = function(){
		var table = $("table[edit2]");
        var trcount=$('.selected',table);
		
		return trcount;
	};
	/**
	 * 合计行功能-创建dom
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.creatDom =function(){
		if(this.attr("listName")){
			var listname = this.attr("listName");
		}else{
			var listname = "editgridlist";
		}
		var tr=cloneRow[listName].clone();
		tr.removeAttr("");
		tr.attr("sum",true);
		tr.attr("class","sum");
		$('td',tr).empty();
		var $tbl=this;
		var tw=$tbl.width();
		$('td', tr).each(function() { 
			var n = $('td', $(this).parent()).index(this);
			var th = $('th:eq(' + n + ')', $tbl).get(0);
			var thw=th.style.width||th.width;
			var isPercentow=thw.substring(thw.length-1,thw.length);
			var display=th.style.display;
			if(display!="none"){
				if(isPercentow=="%"){
					var rt=thw.substring(0,thw.length-1)/100;
					var thwidth=tw*rt+"px";
					$(this).attr("style","width:"+thwidth);
				}else{
					if(thw.indexOf("px")>0){
						$(this).attr("style","width:"+thw);	
					}else{
						$(this).attr("style","width:"+thw+"px");
					}
					
				}		
			}						
		});
		
		$('tbody',$tbl)
		.after(tr);
		$("tr[sum]:not(tfoot > tr[sum])").wrap("<tfoot></tfoot>");
	};
	/**
	 * 合计行功能-将value放入DOM
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.putValue = function() {
		var sums =new Array();
		var th=$('thead th',this);
		var thi;
		var suminfo;
		if(this.attr("listName")){
			var listname = this.attr("listName");
		}else{
			var listname = "editgridlist";
		}
		for(var i=0;i<th.size();i++){
			 thi=th.eq(i);
			 if(thi.attr("isSum")=="true"){
				 var sumname=thi.attr("sumName");
				 var precision=thi.attr("precision"); //开发人员定义保留位数
				 var n=thi.index();
				 sums[n]=this.amount(n);
				// sums[n]=sums[n].toString();
				 if(precision==undefined){ 
					 sums[n]=sums[n].toFixed(2);
					 }
				 else{
					 sums[n]=sums[n].toFixed(precision); 	 
				 }			
				 if(sumname){
					 suminfo=sumname+":"+sums[n];
				 }else{
					 suminfo=sums[n];
				 }
				var editgrid = $(".editgrid"+listname+"");
				 var trsum=$("tr[sum]",this);
				 var trsum2=$("tr[sum]",editgrid);
				 $('td:eq('+n+')',trsum).text(suminfo);
				 $('td:eq('+n+')',trsum2).text(suminfo);
				}
		      }
		 if($("th:visible",this).first().attr("isSum")!="true"){    //如果第一列不需要isSum自动给第一列合计栏加“合计：”
				$('td:visible',$("tr[sum]")).first().text('合计');			
			}
		var sumTr=$("tfoot tr",this);
		//$(this).fixedEditgridFoot();	
		/*alert(sumTr.html());
		var floatSumTable="<table class=\"floatSumEditgrid\"><tfoot><tr>"+sumTr.html()+"</tr></tfoot></table>";
			  //  alert(floatSumTable);
		$(this).after(floatSumTable);*/
	 }
	//表头悬浮,支持固定列
	$.fn.editgridFixedHeader = function(){
		var fixdiv=$("div[id*='editgridfixbox']");
		if(this.attr("listName")){
			var listname = this.attr("listName");
		}else{
			var listname = "editgridlist";
		}
		$("table[id=fixedtableheader"+listname+"]").remove();
			var $tbl = this;
			var $tblhfixed = $tbl.find("thead");
			var headerelement = "th";
			if ($tblhfixed.find(headerelement).length > 0) {
				$clonetablehead[listname] =$tbl.clone().empty();
				var $clonedTable = $clonetablehead[listname];
				$clonedTable.removeAttr("edit1");
				$clonedTable.removeAttr("edit2");
				var fixedheaderdiv =$("<div id='fixedheaderdiv"+listname+"'></div>");
				var fixedheaderdiv2 =$("<div id='fixedheaderdiv2"+listname+"'></div>");
				if(fixdiv.length>1){
					$clonedTable.attr("id", "fixedtable"+ $tbl.attr('fixheader')+listname);
				}else{
					$clonedTable.attr("id", "fixedtableheader"+listname+"");
				}
				
				var tblwidth ="";
				if($clonedTable.attr('id')=="fixedtableheader2"+listname+""){
					tblwidth = $("#editgridfixbox2"+listname+"").width();

				}else{
					tblwidth = $tbl.outerWidth();
				}

				$clonedTable.css({
					"position" : "fixed",
					"top" : "0",
					"left" : $tbl.offset().left
				}).append($tblhfixed.clone()).width(tblwidth).hide().appendTo(
						$("body"));
				if($clonedTable.attr('id')=="fixedtableheader2"+listname+""){
					
					
					
					fixedheaderdiv2.css({
						    background: 'white',
					        width: $tbl.outerWidth(),
					        position:'absolute',
					        left : -$tbl.offset().left,
					        height:'30px',
					        border: '0px',
					        overflow:'hidden',
					        margin: '0 0 0 0',
					        padding: '0 0 0 0'
					    });
					fixedheaderdiv2.append($clonedTable);
					fixedheaderdiv.append(fixedheaderdiv2);
					fixedheaderdiv.css({
						 "background": "white",
						"position" : "fixed",
						"top" : "0",
						"left" : $tbl.offset().left,
						"width":tblwidth,
						"height":"30px",
						"overflow": "hidden"
					}).hide().appendTo($("body"));
					
					
				}
				if (settings.highlightrow)
					
					$("tr:gt(" + (settings.headerrowsize - 1) + ")", $tbl).hover(
							
							function() {
								$(this).addClass(settings.highlightclass);
							}, function() {
								$(this).removeClass(settings.highlightclass);
							});
				$(window.top)
						.scroll(
								function() {
										if($clonedTable.attr('id')=="fixedtableheader2"+listname+""){
											$clonedTable.css({
												"position" : "relative",
												"top" : "0",
												"width":tblwidth,
												"z-index" : 90,
												"left" : $tbl.offset().left
												- $(window.top).scrollLeft()
											});
										}else{
											if(top!=window){
												var offtop = "";
												var win = window;
												do {
													var top1 = $(win.frameElement).offset().top;
													offtop = parseInt(top1 + offtop);
													win = win.parent;
												} while (top != win);
												var sctop = $(window.top).scrollTop();
												var wheight = $(window.top).height();
												var scbot = wheight + sctop;
												var itop = sctop-offtop;
												var elmtop = $clonedTable.offset().top+ offtop;
												$clonedTable.css({
													"position" : "fixed",
													"top" : itop + "px",
													"width":tblwidth,
													"z-index" : 90,
													"left" : $tbl.offset().left
													- $(window.top).scrollLeft()
												});
												
											}else{
												$clonedTable.css({
													"position" : "fixed",
													"top" : "0px",
													"z-index" : 90,
													"width":tblwidth,
													"left" : $tbl.offset().left
															- $(window.top).scrollLeft()
												});
											}

										}
									
										
									var sctop1 = $(window.top).scrollTop();
									var elmtop1 = $tblhfixed.offset().top;
									if(top!=window){
										if (sctop1 > elmtop1+offtop
												&& sctop1 <= (elmtop1 +offtop +$tbl.height() - $tblhfixed
														.height())){
											$clonedTable.show();
										     fixedheaderdiv.show();
										}
											
										
										else{
											$clonedTable.hide();
											 fixedheaderdiv.hide();	
										}
									}else{
										if (sctop1 > elmtop1
												&& sctop1 <= (elmtop1 + $tbl.height() - $tblhfixed
														.height())){
											$clonedTable.show();
										     fixedheaderdiv.show();
										}
											
										
										else{
											$clonedTable.hide();
											 fixedheaderdiv.hide();	
										}
									}

									
								});

				$("#editgridfixbox2"+listname+"").scroll(function(){
					$("#fixedtableheader2"+listname+"").css({
						"left" : $tbl.offset().left,
						"width":"100%"
					});
				});
			}
		

	};
	/**
	 * 合计行功能-加法计算
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.amount = function(index) {
		var sum=0;
		var tds=new Array();
		var trs=$('tbody',this);
		var num=parseInt(index)+1;
		var tds=$("tr td:nth-child("+num+")",trs);

		$(":input",tds).each(function(i){
			var value=$(this).val();
			if(value==""){
				value=0;
			}
				sum=parseFloat(sum)+parseFloat(value);
			});
		return sum;
	};
	
	/**
	 * 对校验支持
	 * 
	 * @param 调用editgrid触发该方法
	 */
	var validate = function(curTd){
		var v=$(":input",curTd).attr("validate");
		if(v!=undefined){
			return eval(v);
		}else{
			return true;}
	}
	
	
	/**
	 * 克隆行方法,同时初始化tbody所有输入域 name,form提交后台根据name向java bean或者map放入数据
	 * 
	 * @param 调用editgrid触发该方法
	 */
	$.fn.cloneRow = function() {
		var row=$(this).find("tbody tr:first");
		var col = $(this).find("thead th[index='true']");
		var rows=$("tbody tr",this);
		var colindex = col.index();
		if(colindex>=0){
			for(i=0;i<rows.size();i++){
				var rowi =rows.get(i);
				var tdi =$('td:eq('+colindex+')',rowi);
				$(":input",tdi).attr("index","true");
			}
		}
		cloneRow[listName]=row.clone(true);
		var editgridid = $(this).attr("id");
		var multi =$t[editgridid].attr("multiSelected")=="true"||$t[editgridid].attr("multi")=="true";
		for(l=0;l<rows.size();l++){
			var rowl=rows.get(l);
			$(rowl).attr("editgrid-add",true);
			$(rowl).attr("index",l);
			$(":input",rowl).each(function(i) {
				var inputname = $(this).attr("name");
				if(inputname!=null){
					if(inputname.indexOf(".")>0){
						var names = inputname.split(".");
						var javabean = "";
						var beanproperty = "";					
						  var indx=names[0].indexOf("[");
							if(indx>0){
								javabean = names[0].substring(0, indx);	
							}else{
								javabean = names[0];
							}
							
							beanproperty = names[1];
							var namecopy = javabean + "[" + l + "]" + "." + beanproperty;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
					}else{
						var namecopy =listName+"["+l+"]."+inputname;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
						
					}	
				}	
			
			});
		}
	
		$(this)
				.after(
						"<input type='hidden' name='org.loushang.web.taglib.util.GRIDLENGTH' value=''>");
	
	};
	//将一个table转化成editgrid
	$.fn.table2Editgrid = function(){
		$("tbody tr[editgrid-add!='true']", this).bind({
			click:function(){
				 $(this).addClass("selected");					
					$(this).siblings().removeClass('selected');
				},
			focusin:function(){
				 $(this).addClass("selected");
					
					$(this).siblings().removeClass('selected');
				}
		});
		$("tbody tr[editgrid-add!='true']", this).find(":input").bind({
			focusin:function(){
				$(this).addClass("focus");
				//$(this).siblings().removeClass("focus");
			},
			focusout:function(){
				$(this).removeClass("focus");
			}
			
		});
		var editgridrows = $("tbody tr[editgrid-add]",this);
		var editgridrowslength = editgridrows.length;
		var rows=$("tbody tr[editgrid-add!='true']",this);
		for(l=editgridrowslength;l<rows.size();l++){
			var rowl=rows.get(l);
			$(rowl).attr("editgrid-add",true);
			$(":input",rowl).each(function(i) {
				var inputname = $(this).attr("name");
				if(inputname!=null){
					if(inputname.indexOf(".")>0){
						var names = inputname.split(".");
						var javabean = "";
						var beanproperty = "";					
						  var indx=names[0].indexOf("[");
							if(indx>0){
								javabean = names[0].substring(0, indx);	
							}else{
								javabean = names[0];
							}
							
							beanproperty = names[1];
							var namecopy = javabean + "[" + l + "]" + "." + beanproperty;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
					}else{
						var namecopy =listName+"["+l+"]."+inputname;
						$(this).removeAttr('name');
						$(this).prop({
							name : namecopy
						});	
						
					}	
				}	
			});
			// 对外部组件的支持
			$('select',rowl).each(function(){
					 $(this).multiselect();
			});
			$(".dateImg",rowl).each(function(){
				$(this).datepicker();
			});
		}
		this.countRow();

	};
	/**
	 * eidtGrid选中行表单提交功能,选中editgrid和整个表单提交 
	 * eidtGrid选中行表单提交功能,选中editgrid提交 带参数
	 * @returns form
	 */
	$.fn.formSubmit = function(cfg){
	
		if(cfg){
			if(cfg.isAllFormSubmit=="false"||cfg.isAllFormSubmit==false){
				var form = $("form").clone().empty();
			}
		}else{
			var form = $("form").clone();
			$("table.editgrid",form).remove();
		}
		var editgridform = $("form");
		if(editgridform.attr("id")){
			var formid = form.attr("id","editgrid"+editgridform.attr("id"));
		}else{
			var formid = form.attr("id","editgridform");	
		}
		
		form.css("display","none");
		editgridform.before(form);
		var hiddenform = $(formid);
		hiddenform.append($("<table></table>"));
		var trs = $("tbody tr",this);
		var copyTrs = new Array();
		//debugger;
		for(var i=0;i<trs.size();i++){
			var tr = trs[i];
			var radioOrcheckbox=$("td:first",tr).find("input[type='radio'],input[type='checkbox']");
			if(radioOrcheckbox.length=="1"&&radioOrcheckbox[0].checked){
				copyTrs[i]=$(tr).clone();
			}
			
		}
         for(var j=0;j<copyTrs.length;j++){
        	 $("table",hiddenform).append(copyTrs[j]);
         }
		return hiddenform[0];
	};
	/**
	 * 将eidtGrid可编辑
	 * 
	 * @param cfg
	 * @returns
	 */
	$.fn.editgrid = function(cfg) {
			this.each(function(){
					var editgridid = $(this).attr("id");
					if(editgridid){
						$t[editgridid] = $('#'+editgridid);	
					}else{
						$t[editgridid]=$(this);
					}
				
					var col = $t[editgridid].find("thead th[index='true']");
					var colindex = col.index();
					if($t[editgridid].attr("multiSelected")=="true"||$t[editgridid].attr("multi")=="true"){
						if(colindex>=0){
							var $t1 = $t[editgridid];
							/*
							var thDiv = document.createElement('div');
							var th = $('th:eq(' + colindex + ')', $t1)[0];
							var thw = th.style.width||th.width;
							var isPercentow=thw.substring(thw.length-1,thw.length);
							var tw = $($t1).width();
							if(isPercentow=="%"){
								var rt=thw.substring(0,thw.length-1)/100;
								var thwidth=tw*rt+"px";
							}else{
								var thwidth = thw;
							}
							$(thDiv).css({
								textAlign : th.align,
								width : thwidth,
								cursor: 'pointer'
							});
							if (th.innerHTML == '') {
								th.innerHTML = '&nbsp;';
							}
							thDiv.innerHTML = th.innerHTML;
							th.innerHTML = "";
							$(th).append(thDiv);
							*/							
							 col.live('mousedown',function(e){
								  var clickObj=(e.target || e.srcElement);
								  var trs = $('tbody tr', $t1);					  
								  if(clickObj.tagName.toLowerCase()=="th"){
									    if($("input[type='checkbox']",col).length>0){  
									      if(col.find(":input")[0].checked!=true){ 
								               $('tbody tr', $t1).addClass("selected");
								               for(i=0;i<trs.length;i++){
									                var tri = trs[i];
									                $("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
									                $("td",tri).eq(colindex).find(":input")[0].checked = true;    
								               }
								               col.find("span.jNiceCheckbox").addClass("jNiceChecked");
								               col.find(":input")[0].checked = true;
									       }else{
										    $('tbody tr', $t1).removeClass("selected");
										    for(i=0;i<trs.length;i++){
											  var tri = trs[i];
											  $("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
											  $("td",tri).eq(colindex).find(":input").attr("checked",false);									 
										    }
										    col.find("span.jNiceCheckbox").removeClass("jNiceChecked");
								            col.find(":input").attr("checked",false);
									      }
									    }else{
									    	if($(clickObj).hasClass("editgridIndexThchecked")){
											    $('tbody tr', $t1).removeClass("selected");
											    for(i=0;i<trs.length;i++){
												  var tri = trs[i];
												  $("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
												  $("td",tri).eq(colindex).find(":input").attr("checked",false);
											    }
											    $(clickObj).removeClass("editgridIndexThchecked");
									    	}else{
									    		$('tbody tr', $t1).addClass("selected");
									            for(i=0;i<trs.length;i++){
										                var tri = trs[i];
										                $("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
										                $("td",tri).eq(colindex).find(":input")[0].checked = true;
									            }
									            $(clickObj).addClass("editgridIndexThchecked");	
									    	}
									    	
									    }
									
								  }else{
									if($(clickObj).hasClass('jNiceCheckbox')){
										$(clickObj).one('click',function(){
											if($(clickObj).hasClass("jNiceChecked")){
												 $('tbody tr', $t1).addClass("selected");
										           for(i=0;i<trs.length;i++){
											              var tri = trs[i];
											              $("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
											              $("td",tri).eq(colindex).find(":input")[0].checked = true;
											              col.find("span.jNiceCheckbox").addClass("jNiceChecked");
											              col.find(":input")[0].checked = true;
										          }
											}else{
												$('tbody tr', $t1).removeClass("selected");
												for(i=0;i<trs.length;i++){
													var tri = trs[i];
													$("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
													$("td",tri).eq(colindex).find(":input").attr("checked",false);
													col.find("span.jNiceCheckbox").removeClass("jNiceChecked");
										            col.find(":input")[0].checked = false;
												}
											}
										})	
										
									}else if($(clickObj).attr("type")=="checkbox"){
										if(!clickObj.checked){
											$('tbody tr', $t1).addClass("selected");
											$('tbody tr', $t1).each(function(){
												$(this).eq(colindex).find(":input")[0].checked = true;
											})
										}else{
											$('tbody tr', $t1).removeClass("selected");
											$('tbody tr', $t1).each(function(){
												$(this).eq(colindex).find(":input").attr("checked",false);
											})
											
										}	
									}
								}
							});							  																																																																																																													
						/*	col.toggle(function(){
								var trs = $('tbody tr', $t1);
								$('tbody tr', $t1).addClass("selected");
								for(i=0;i<trs.length;i++){
									var tri = trs[i];
									$("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
									$("td",tri).eq(colindex).find(":input")[0].checked = true;
								}
							},
							function(){
								var trs = $('tbody tr', $t1);
								$('tbody tr', $t1).removeClass("selected");
								for(i=0;i<trs.length;i++){
									var tri = trs[i];
									$("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
									$("td",tri).eq(colindex).find(":input")[0].checked = false;
								}
							});*/
							$('tbody', $t1).live({
								mousedown:function(e){
									var clickObj=(e.target || e.srcElement);
									   if(clickObj.tagName.toLowerCase()!="td"){	
										var clickTd=$(clickObj).parents('td').eq(0);
									   }else{
										var clickTd=$(clickObj);  
									   }
									   var clickTr=$(clickObj).parents('tr').eq(0);
										if($(clickObj).hasClass('jNiceCheckbox')&&((clickTd.index())==colindex)){
											$(clickObj).one('click',function(){
												if($(clickObj).hasClass("jNiceChecked")){
													clickTr.addClass("selected");
												}else{
													clickTr.removeClass("selected");
												}
											})	
										}else if(clickObj.tagName.toLowerCase()=="input"&&$(clickObj).attr("type")=="checkbox"&&((clickTd.index())==colindex)){
												if(!clickObj.checked){
													clickTr.addClass("selected");
												}else{
													clickTr.removeClass("selected");
												}	
												e.stopPropagation();			
										}else{
											clickTr.addClass("selected");
											$("td",clickTr).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
											$("td",clickTr).eq(colindex).find(":input[type='checkbox']")[0].checked = true;
											clickTr.siblings().each(function(){
												var $thisTRtd=$(this);
												//alert($("td",$thisTRtd).eq(colindex).html());
												$("td",$thisTRtd).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
												$("td",$thisTRtd).eq(colindex).find(":input[type='checkbox']").attr("checked",false);
											})
											clickTr.siblings().removeClass('selected');
										}
									},
								focusin:function(e){}	
							});	
						}
					}else{
						var $t2 = $t[editgridid];
						if(colindex>=0){
							$('tbody tr', $t[editgridid]).live({
								mousedown:function(){
									 $(this).addClass("selected");
									 $("td",this).eq(colindex).find("span").addClass("jNiceChecked");	
									 $("td",this).eq(colindex).find("span").siblings().checked=true;
										$(this).siblings().removeClass('selected');
										$(this).siblings().find("span").removeClass("jNiceChecked");	
										$(this).siblings().find("span").siblings().removeAttr("checked");
									},
								focusin:function(){
									 $(this).addClass("selected");
									 $("td",this).eq(colindex).find("span").trigger("click");	
										$(this).siblings().removeClass('selected');
								}
							});	
						}else{
							$('tbody tr', $t[editgridid]).live({
								mousedown:function(){
									 $(this).addClass("selected");
										$(this).siblings().removeClass('selected');
									},
								focusin:function(){
									 $(this).addClass("selected");
										$(this).siblings().removeClass('selected');
								}
							});
						}
					}

                     /*
					$('tbody tr', $t[editgridid]).find(":input").bind({
						focusin:function(){
							$(this).addClass("focus");
							//$(this).siblings().removeClass("focus");
						},
						focusout:function(){
							$(this).removeClass("focus");
						}
						
					});
					*/
					if($t[editgridid].attr("isSum")=="true"){
						config.isSum=true;
					}else{
						config.isSum=false;
					}
					if($t[editgridid].attr("isFixedLastTr")=="true"){
						config.isFixedLastTr=true;
					}else{
						config.isFixedLastTr=false;
					}
					if (cfg) {// 拷贝配置参数
						$.extend(config, cfg);
					}
					if(config.isSum){
						var $table =$t[editgridid];
						if(config.isFixedLastTr){
							 $(":input",$table).bind("keyup", function(event){
								 if (event.keyCode=="13"){
									 $($table).fixedEditgridLastTr();
									 }
								});		
						}
					var th=$('thead th',$table);
					var thi;
					//合计功能绑定事件
					for(var i=0;i<th.size();i++){
						 thi=th.eq(i);
			     if(thi.attr("isSum")=="true"){
							 var n=thi.index();
							 var num=parseInt(n)+1;
							 var trs=$('tbody',$table);
							 var tds=$("tr td:nth-child("+num+")",trs); 
							 $(":input",tds).bind("change", function(){
								 $table.putValue();
								});
							}
					      }
					}
					var delayArray = [];
					$t[editgridid].fixtableheader();
						if (true) {
							editableGrid($t[editgridid]);// 调用Edit模式将table转为Edit模式
						} else {
							delayArray.push($t[editgridid]);
							;// 还没有将table转为table，延迟加载一会儿,先放到延迟加载数组里面
						}
					if (delayArray.length > 0) {
						setTimeout(function() {
							delayEditGrid(delayArray);// 延迟加载
						}, 10);
					}
					$t[editgridid].cloneRow();
					var fixdiv=$("div[id*='editgridfixbox']");
					if(fixdiv.length>1){
						fixCountRow();	
					}else{
						$t[editgridid].countRow();
					}		
					if(config.isSum){
						$t[editgridid].creatDom();
						$t[editgridid].putValue();	
					}
					return $t[editgridid];		
			});	


		// 事件绑定，添加样式
									
	}; // end editgrid	
})(jQuery);

/*
 * Flexigrid for jQuery -  v1.1
 *
 * Copyright (c) 2008 Paulo P. Marinas (code.google.com/p/flexigrid/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
(function($) {
	$.addFlex = function(t, cfg) {
		var config = {
				striped : true, // apply odd even stripes
				novstripe : false,
				minwidth : 30, // min width of columns
				minheight : 80, // min height of columns
				nowrap : true,
				title : false,
				minColToggle : 1, // minimum allowed column to be hidden
				showToggleBtn : true, // show or hide column toggle popup
				onDragCol : false,
				onToggleCol : false,
				multi: false,
				hideShow: false,
				drag:true,
				sns:0,
				ubaServer:0
			};
		if($(t).attr("striped")=="false"){
        	config.striped=false;
        }else{
        	config.striped=true;
        }
        if($(t).attr("hideShow")=="true"){
        	config.hideShow=true;
        }else{
        	config.hideShow=false;
        }
        if($(t).attr("multi")=="true"){
        	config.multi=true;
        }else{
        	config.multi=false;
        }
        if($(t).attr("drag")=="false"){
        	config.drag=false;
        }else{
        	config.drag=true;
        }
        if($(t).attr("fixedHeight")){
        	config.fixedHeight=$(t).attr("fixedHeight");
        }else{
        	config.fixedHeight="auto";
        } 
        
        //ie9表格有bug过滤掉空格,回车,制表符
        if(navigator.userAgent.indexOf("MSIE")>0) {
      	  if(navigator.userAgent.indexOf("MSIE 9.0")>0)  
            { // alert("ie9");  
              var re = />\s+/g;
              $(t).html($(t).html().replace(re,">"));//过滤掉table中的空格回车tab符
            }   
      	};
      	 
		//支持宽度设置百分比
		var tw=$(t).width();
		var thone=0;
		var isPixel;
		var comhelpwidth=0;
		var comhelp=$(t).attr("comhelp");
		var dragFunction=$(t).attr("dragFunction");//获取是否支持拖拽		
		var flexigridWidth=0;
		$('thead th',t).each(function(){
			var oth=this.style.width||this.width;
			var isPercentow=oth.substring(oth.length-1,oth.length);
			if(isPercentow=="%"){
				var rt=oth.substring(0,oth.length-1);
				flexigridWidth=flexigridWidth+parseInt(rt);
				
				}	
		});
		
		var flexigridThead=$("thead",$(t)).clone();
        var flexigridFixedHead = document.createElement('div');
        var flexigridFixedTable =  document.createElement('table');
        $(flexigridFixedTable).addClass("flexigridHeadDiv");
        $(flexigridFixedTable).html(flexigridThead);
        $(flexigridFixedTable).width("100%");
        $(flexigridFixedTable).css("table-layout","auto");
        $(flexigridFixedHead).addClass("fixedFlexigridHead");
        $(flexigridFixedHead).append(flexigridFixedTable);
		//如果各列的和加起来不超过百分之百换算为百分之百 ，超过百分之百则按照开发人员自定义的内容来
		if(flexigridWidth<=100){
		  $('thead th',t).each(function(){
			   var oth=this.style.width||this.width;
			   oth=oth.substring(0,oth.length-1);
			   oth=parseInt((oth/flexigridWidth)*100);
			   oth=oth+"%";	
			   $(this).width(oth);
		   });
		  $(t).css("width","100%");
		  
		  $(flexigridFixedHead).width($(t).width());
			 $(flexigridFixedHead).css("left",$(t).clientX);
			 $(window).resize(function(){  	
	        	 $(flexigridFixedHead).width($(t).width());
	    		 $(flexigridFixedHead).css("left",$(t).offset().left);
	         });
			 $(window).scroll(function(){
				if($(window).scrollTop()>$(t).offset().top&&$(window).scrollTop()<($(t).height()+$(t).offset().top)){
					$(flexigridFixedHead).css("display","block");
				}else{
					$(flexigridFixedHead).css("display","none");
				}	
		      });
		}else{
			$(t).width(flexigridWidth+"%");
			$(t).css("table-layout","auto");
		}
		
        	
	    if(dragFunction=="true"){                //判断是否支持拖拽
	    	$(t).css("table-layout","auto");
		 if(comhelp){
			$('thead th',t).each(function(){
			 var _thWidth=$(this).attr("width");
			 $(this).attr("_width",_thWidth);
			 if($(this).css("display")!="none"){  //处理表格宽度时不计算隐藏列
				var oth=this.style.width||this.width;
				if(oth.indexOf("px")>0){
					var ow=oth.substring(0,oth.length-2);
				}else{
					var ow=oth;
				}
				var isPercentow=ow.substring(ow.length-1,ow.length);
				if(isPercentow=="%"){
				var rt=ow.substring(0,ow.length-1)/100;
				var thwidth = parseInt(tw*rt);
				comhelpwidth =parseInt(comhelpwidth)+thwidth;
				}
				else{
					comhelpwidth =parseInt(comhelpwidth)+parseInt(ow);
					};
			 }
			});	
		}else{
			$('thead th',t).each(function(){
				 var _thWidth=$(this).attr("width");
				 $(this).attr("_width",_thWidth);	
		     if($(this).css("display")!="none"){	//处理表格宽度时不计算隐藏列
			    var ow=this.style.width||this.width;
			    var isPercentow=ow.substring(ow.length-1,ow.length);
			    if(isPercentow=="%"){
			    var rt=ow.substring(0,ow.length-1)/100;
			    thone=thone+rt;
			    }
			    else{
			    	isPixel=true;
				  };	
		       }
			});
		}	
		if(thone==1||isPixel!=true||comhelp){
			
			var weighting = thone/1;
			if(comhelp){
				weighting =comhelpwidth/tw;
			}
			$('thead th',t).each(function(){
				 var _thWidth=$(this).attr("width");
				 $(this).attr("_width",_thWidth);
				var thborderWidth = $(this).outerWidth()-$(this).width();
				var oth=this.style.width||this.width;
				if(oth.indexOf("px")>0){
					var ow=oth.substring(0,oth.length-2);
				}else{
					var ow=oth;
				}
				var owidth=ow/weighting-thborderWidth;
				var isPercentow=ow.substring(ow.length-1,ow.length);
				if(isPercentow=="%"){
				var rt=ow.substring(0,ow.length-1)/100;
				var thwidth = parseInt(tw*rt/weighting)-thborderWidth;
				$(this).attr('width',thwidth);
				this.style.width="";    
				}
				else{
					$(this).attr('width',owidth);
					this.style.width="";
					};
			});
		
			}else{
			$('thead th',t).each(function(){
				 var _thWidth=$(this).attr("width");
				 $(this).attr("_width",_thWidth);
				var thborderWidth = $(this).outerWidth()-$(this).width();
				var oth=this.style.width||this.width;
				if(oth.indexOf("px")>0){
					var ow=oth.substring(0,oth.length-2);
				}else{
					var ow=oth;
				}
				var owidth=ow-thborderWidth;
				var isPercentow=ow.substring(ow.length-1,ow.length);
				if(isPercentow=="%"){
				var rt=ow.substring(0,ow.length-1)/100;
				var thwidth = parseInt(tw*rt)-thborderWidth;
				$(this).attr('width',thwidth);
				this.style.width="";    
				}
				else{
					$(this).attr('width',owidth);
					this.style.width="";
					};
			});
		 }
	 }

		if (t.grid)                               
			return false; // return if already exist
		p = $.extend(config, cfg);
		// alert(navigator.userAgent);
		// alert($.browser.msie);
		$(t).show() // show if hidden              
		.attr({
			cellPadding : 0,
			cellSpacing : 0,
			border : 0
		}) // remove padding and spacing
		.removeAttr('width'); // remove width properties
		// create grid class

		var g = {
			hset : {},
			//重新计算div的宽度
			reDivWidth : function(){
			//	var tw=$(t).width();
				if($(t).attr("id")){
					g.gDiv.id = 'flexigrid'+$(t).attr("id");
				}
				var tw=$('#'+g.gDiv.id).width();
				var thAllPercent=0;
				$('thead tr:first th:visible', g.hDiv).each(function() {
					 var contAllWd = $(this).attr("_width");
					 var isPercentow=contAllWd.substring(contAllWd.length-1,contAllWd.length);
					  if(isPercentow=="%"){
					    contAllWd=contAllWd.substring(0,contAllWd.length-1);
					    contAllWd=contAllWd*0.01;
					    thAllPercent+=contAllWd;
					  }
				});
				$('thead tr:first th:visible', g.hDiv).each(function() {
					   var cdpos = $(this).attr("_width");
					   var isPercentow=cdpos.substring(cdpos.length-1,cdpos.length);
					   if(isPercentow=="%")
					     {
						   cdpos=cdpos.substring(0,cdpos.length-1);
					       if($(this).attr("_width")!="none"){
						       var divWidthTd=parseInt((tw*cdpos*0.01)/thAllPercent-1)+"px";
						       $(this).children().width(divWidthTd);	
					       }
					     }
				});
				$('tbody tr td', g.bDiv).each(function() {
						var n = $('thead tr:first th:visible', g.hDiv).index(this);
					//	var cdpos = parseInt($(this).width());
						var n = $('td', $(this).parent()).index(this);
						var pth = $('th:eq(' + n + ')', g.hDiv).get(0);// 获取td对应的表头的th
						var pthborder = $(pth).outerWidth()-$(pth).width();
						var tdborderWidth = $(this).outerWidth()-$(this).width();
						var tdDivWidth = $('div:first', pth)[0].style.width;
						if(tdDivWidth.indexOf("px")>0){
							var tdDivwd = parseInt(tdDivWidth.substring(0,tdDivWidth.length-2))+pthborder;
						}else{
							var tdDivwd = parseInt(tdDivWidth)+pthborder;
						}
						var divWidthTd=tdDivwd-parseInt(tdborderWidth)+"px";
						$(this).children().width(divWidthTd);	
					});	
					
			},	
			// 重新计算列宽拖动条的位置(top和left)
			rePosDrag : function() {
				var cdleft = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft > 0)
					cdleft -= Math.floor(p.cgwidth / 2);       
				// 修改top
				$(g.cDrag).css({                                
					top : g.hDiv.offsetTop + 1
				});
				// 修改left
				var cdpad = this.cdpad;
				$('div', g.cDrag).hide();
				$('thead tr:first th:visible', this.hDiv).each(function() {
					var n = $('thead tr:first th:visible', g.hDiv).index(this);
					var cdpos = parseInt($(this).width());
					var thborderWidth = $(this).outerWidth()-$(this).width();
					if (cdleft == 0)
						cdleft -= Math.floor(p.cgwidth / 2);
					if($.browser.mozilla){
						cdpos = cdpos + cdleft + cdpad;
					}else{
						cdpos = cdpos + cdleft + cdpad+thborderWidth;
					}
					if (isNaN(cdpos)) {
						cdpos = 0;
					}
					$('div:eq(' + n + ')', g.cDrag).css({
						'left' : cdpos + 'px'
					}).show();
					cdleft = cdpos;
				});
			},

			// 重新计算高度
			fixHeight : function(newH) {
				// 设置bDiv的高度属性，因为1、ie9下出横向滚动条时，bDiv的高度会拉长；2、ie6、ie7下出横向滚动条时会同时出纵向滚动条
				if ($.browser.msie
						&& ($.browser.version < 8 || $.browser.version >= 9)) {
					var bdiv=$(g.bDiv)[0];
					var btable = $(g.bDiv).find("table:first");
					if(bdiv.scrollHeight>bdiv.clientHeight){
						$(g.bDiv).height(btable.outerHeight(true) + 20);// 'true',表示计算margin;'20'，预留出滚动条的位置	
					}	
				}
			},
			dragStart : function(dragtype, e, obj) { // default drag function
				// start
				if (dragtype == 'colresize') {// 改变列的宽度
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					var n = $('div', this.cDrag).index(obj);
					var ow = $('th:visible div:eq(' + n + ')', this.hDiv)
							.width();
					$(obj).addClass('dragging').siblings().hide();
					$(obj).prev().addClass('dragging').show();
					this.colresize = {
						startX : e.pageX,
						ol : parseInt(obj.style.left),
						ow : ow,
						n : n
					};
					$('body').css('cursor', 'col-resize');
				}
				$('body').noSelect();
			},
			dragMove : function(e) {
				if (this.colresize) {// 改变列的宽度
					var n = this.colresize.n;
					var diff = e.pageX - this.colresize.startX;
					var nleft = this.colresize.ol + diff;
					var nw = this.colresize.ow + diff;
					if (nw > p.minwidth) {
						$('div:eq(' + n + ')', this.cDrag).css('left', nleft);
						this.colresize.nw = nw;
					}
				} else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver');
					if (e.pageX > this.hset.right || e.pageX < this.hset.left
							|| e.pageY > this.hset.bottom
							|| e.pageY < this.hset.top) {
						// this.dragEnd();
						$('body').css('cursor', 'move');
					} else {
						$('body').css('cursor', 'pointer');
					}
					$(this.colCopy).css({
						top : e.pageY + 10,
						left : e.pageX + 20,
						display : 'block'
					});
				}
			},

			dragEnd : function() {
				if (this.colresize) {
					var n = this.colresize.n;
					var nw = this.colresize.nw;
					$('th:visible div:eq(' + n + ')', this.hDiv).css('width',
							nw);
					$('tr', this.bDiv).each(
							function() {
								$('td:visible div:eq(' + n + ')', this).css(
										'width', nw);
							});
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					$('div:eq(' + n + ')', this.cDrag).siblings().show();
					$('.dragging', this.cDrag).removeClass('dragging');
					this.rePosDrag();
					this.fixHeight();
					this.colresize = false;
				} else if (this.colCopy) {
					$(this.colCopy).remove();
					if (this.dcolt != null) {
						if (this.dcoln > this.dcolt)
							$('th:eq(' + this.dcolt + ')', this.hDiv).before(
									this.dcol);
						else
							$('th:eq(' + this.dcolt + ')', this.hDiv).after(
									this.dcol);
						this.switchCol(this.dcoln, this.dcolt);
						$(this.cdropleft).remove();
						$(this.cdropright).remove();
						this.rePosDrag();
						if (p.onDragCol) {
							p.onDragCol(this.dcoln, this.dcolt);
						}
					}
					this.dcol = null;
					this.hset = null;
					this.dcoln = null;
					this.dcolt = null;
					this.colCopy = null;
					$('.thMove', this.hDiv).removeClass('thMove');
					$(this.cDrag).show();
				}
				$('body').css('cursor', 'default');
				$('body').noSelect(false);
			},

			// 控制某一列隐藏或显示
			toggleCol : function(cid, visible) {
				var ncol = $("th[axis='col" + cid + "']", this.hDiv)[0];// 表头上的列
				var n = $('thead th', g.hDiv).index(ncol);
      			var cb = $('input[value=' + cid + ']', g.nDiv)[0];// 下拉菜单上的复选框
				//var cb = $('<span class="jNiceCheckbox jNiceChecked"></span>', g.nDiv);
				//var cb = $(g.nDiv).find('.jNiceCheckbox').siblings()[0];
				if (visible == null) {
					visible = ncol.hidden;
				}
				if ($('input:checked', g.nDiv).length < p.minColToggle
						&& !visible) {
					return false;
				}
				if (visible) {
					ncol.hidden = false;
					$(ncol).show();
					
				//	$('input:checkbox',g.nDiv).siblings().addClass('jNiceChecked');
					cb.checked = true;
				} else {
					ncol.hidden = true;
					$(ncol).hide();
				//	$('input:checkbox',g.nDiv).siblings().removeClass('jNiceChecked');
					cb.checked = false;
				}

				// 隐藏表体中对应的列
				$('tbody tr', t).each(function() {
					if (visible) {
						$('td:eq(' + n + ')', this).show();
					} else {
						$('td:eq(' + n + ')', this).hide();
					}
				});

				this.rePosDrag();

				// 调用回调函数
				if (p.onToggleCol) {
					p.onToggleCol(cid, visible);
				}
				return visible;
			},

			// 拖动列的顺序
			switchCol : function(cdrag, cdrop) { // switch columns
				$('tbody tr', t).each(
						function() {
							if (cdrag > cdrop)
								$('td:eq(' + cdrop + ')', this).before(
										$('td:eq(' + cdrag + ')', this));
							else
								$('td:eq(' + cdrop + ')', this).after(
										$('td:eq(' + cdrag + ')', this));
						});
				// switch order in nDiv
				if (cdrag > cdrop) {
					$('tr:eq(' + cdrop + ')', this.nDiv).before(
							$('tr:eq(' + cdrag + ')', this.nDiv));
				} else {
					$('tr:eq(' + cdrop + ')', this.nDiv).after(
							$('tr:eq(' + cdrag + ')', this.nDiv));
				}
				if ($.browser.msie && $.browser.version < 7.0) {
					$('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},

			scroll : function() {
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				this.rePosDrag();
			},

			// 每个td里增加一个新的div包住原来td的内容
			addCellProp : function() {			
				if(dragFunction=="true"){ 
				$('tbody tr td', g.bDiv).each(function() {
					//alert($('div:first', pth)[0].style.width);
					$(this).hover(function(){                     //绑定hover时间，给内容不为空的td增加title
						var thisTdText=$(this).text();
						thisTdText=thisTdText.replace(/\s+/g,"");
						if(thisTdText!=""){
							if($(this).attr("title")==undefined)
							   {
							   $(this).attr("title",thisTdText);
							   }
						}   
					});
			            //判断是否支持拖拽
					var tdDiv = document.createElement('div');
					var n = $('td', $(this).parent()).index(this);
					var pth = $('th:eq(' + n + ')', g.hDiv).get(0);// 获取td对应的表头的th
					var pthborder = $(pth).outerWidth()-$(pth).width();
					var tdborderWidth = $(this).outerWidth()-$(this).width();
					var tdDivWidth = $('div:first', pth)[0].style.width;
					if(tdDivWidth.indexOf("px")>0){
						var tdDivwd = parseInt(tdDivWidth.substring(0,tdDivWidth.length-2))+pthborder;
					}else{
						var tdDivwd = parseInt(tdDivWidth)+pthborder;
					}
					if (pth != null) {
						if (p.sortname == $(pth).attr('abbr') && p.sortname) {
							this.className = 'sorted';
						}
						$(tdDiv).css({
							textAlign : pth.align,
							width : tdDivwd-parseInt(tdborderWidth)+"px"
						});
						if (pth.hidden) {
							$(this).css('display', 'none');
						}
					}
					if (p.nowrap == false) {
						$(tdDiv).css('white-space', 'normal');
					}
					if (this.innerHTML == '') {
						this.innerHTML = '&nbsp;';
					}
					tdDiv.innerHTML = this.innerHTML;
					var prnt = $(this).parent()[0];
					var pid = false;
					if (prnt.id) {
						pid = prnt.id.substr(3);
					}
					if (pth != null) {
						if (pth.process)
							pth.process(tdDiv, pid);
					}
					$(this).empty().append(tdDiv).removeAttr('width'); // wrap
					// content
				});
				}else{
					$(t).delegate("td","hover",function(){
						var thisTdText=$(this).text();
						thisTdText=thisTdText.replace(/\s+/g,"");
						if(thisTdText!=""){
							if($(this).attr("title")==undefined){
							   $(this).attr("title",thisTdText);
							}
						} 
					});		
				}
			},

			// 获取单元格属性：长宽高、坐标
			getCellDim : function(obj) {
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {
					ht : ht,
					wt : wt,
					top : top,
					left : left,
					pdl : pdl,
					pdt : pdt,
					pht : pht,
					pwt : pwt
				};
			},

			// 给表格行(tr)增加附加属性、样式、事件
			addRowProp : function() {
				if(dragFunction=="true"){
					var col = $(g.hDiv).find("thead th[index='true']");		
				}else{
					var col = $(g.bDiv).find("thead th[index='true']");
				};
				var colindex = col.index();
					if (!(p.multi)){
						$('tbody tr', g.bDiv).each(function() {
						if(colindex>=0){
							$(this).bind({
								mousedown:function(e){
										var obj = (e.target || e.srcElement);
										$(this).addClass('trSelected');	
										$("td",this).eq(colindex).find("span").trigger("click");
										$(this).siblings().removeClass('trSelected');	
										if (obj.href || obj.type)
											return true;
								}
							});	
						}else{
							$(this).bind({
								mousedown:function(e){
										var obj = (e.target || e.srcElement);
										$(this).addClass('trSelected');	
										$(this).siblings().removeClass('trSelected');	
										if (obj.href || obj.type)
											return true;
								}
							});	
						}
						});
					}else{
						if(colindex>=0){
							col.css({
								cursor: 'pointer'
							});
							if($(":input",col).length>0){
							  col.live('mousedown',function(e){
								  var clickObj=(e.target || e.srcElement);
								  var trs = $('tbody tr', g.bDiv);
								  if(clickObj.tagName.toLowerCase()=="th"){
									
									    if(col.find(":input")[0].checked!=true){ 
								             $('tbody tr', g.bDiv).addClass("trSelected");
								             for(i=0;i<trs.length;i++){
									                var tri = trs[i];
									                $("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
									                $("td",tri).eq(colindex).find(":input")[0].checked = true;
									                col.find("span.jNiceCheckbox").addClass("jNiceChecked");
									                col.find(":input")[0].checked = true;
								            }
									     }else{
										  $('tbody tr', g.bDiv).removeClass("trSelected");
										  for(i=0;i<trs.length;i++){
											  var tri = trs[i];
											  $("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
											  $("td",tri).eq(colindex).find(":input")[0].checked = false;
											  col.find("span.jNiceCheckbox").removeClass("jNiceChecked");
								              col.find(":input")[0].checked = false;
										  }
									    }
									
								  }else{
									if($(clickObj).hasClass('jNiceCheckbox')){
										$(clickObj).one('click',function(){
											if($(clickObj).hasClass("jNiceChecked")){
												 $('tbody tr', g.bDiv).addClass("trSelected");
										           for(i=0;i<trs.length;i++){
											              var tri = trs[i];
											              $("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
											              $("td",tri).eq(colindex).find(":input")[0].checked = true;
											              col.find("span.jNiceCheckbox").addClass("jNiceChecked");
											              col.find(":input")[0].checked = true;
										          }
											}else{
												$('tbody tr', g.bDiv).removeClass("trSelected");
												for(i=0;i<trs.length;i++){
													var tri = trs[i];
													$("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
													$("td",tri).eq(colindex).find(":input")[0].checked = false;
													col.find("span.jNiceCheckbox").removeClass("jNiceChecked");
										            col.find(":input")[0].checked = false;
												}
											}
										})	
										
									}	
								}
							});
							}else{
								
									col.toggle(function(){
								var trs = $('tbody tr', g.bDiv);
								$('tbody tr', g.bDiv).addClass("trSelected");
								for(i=0;i<trs.length;i++){
									var tri = trs[i];
									$("td",tri).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
									$("td",tri).eq(colindex).find(":input")[0].checked = true;
								}
							},
							function(){
								var trs = $('tbody tr', g.bDiv);
								$('tbody tr', g.bDiv).removeClass("trSelected");
								for(i=0;i<trs.length;i++){
									var tri = trs[i];
									$("td",tri).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
									$("td",tri).eq(colindex).find(":input")[0].checked = false;
								}
							});
								
								
							}
							if(comhelp!="true"){
							$('tbody', g.bDiv).live({
								mousedown:function(e){
								var clickObj=(e.target || e.srcElement);
								   if(clickObj.tagName.toLowerCase()!="td"){	
									var clickTd=$(clickObj).parents('td').eq(0);
								   }else{
									var clickTd=$(clickObj);  
								   }
								   var clickTr=$(clickObj).parents('tr').eq(0);
									if($(clickObj).hasClass('jNiceCheckbox')&&((clickTd.index())==colindex)){
										$(clickObj).one('click',function(){
											if($(clickObj).hasClass("jNiceChecked")){
												clickTr.addClass("trSelected");
											}else{
												clickTr.removeClass("trSelected");
											}
										})	
									}else{
										clickTr.addClass("trSelected");
										$("td",clickTr).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
										$("td",clickTr).eq(colindex).find(":input[type='checkbox']")[0].checked = true;
										clickTr.siblings().each(function(){
											var $thisTRtd=$(this);
											//alert($("td",$thisTRtd).eq(colindex).html());
											$("td",$thisTRtd).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
											$("td",$thisTRtd).eq(colindex).find(":input[type='checkbox']")[0].checked = false;
										})
										clickTr.siblings().removeClass('trSelected');
									}
								},
								focusin:function(e){
									var clickObj=(e.target || e.srcElement);
									   if(clickObj.tagName.toLowerCase()!="td"){	
										var clickTd=$(clickObj).parents('td').eq(0);
									   }else{
										var clickTd=$(clickObj);  
									   }
									   var clickTr=$(clickObj).parents('tr').eq(0);
										if($(clickObj).hasClass('jNiceCheckbox')&&((clickTd.index())==colindex)){
											$(clickObj).one('click',function(){
												if($(clickObj).hasClass("jNiceChecked")){
													clickTr.addClass("trSelected");
												}else{
													clickTr.removeClass("trSelected");
												}
											})	
										}else{
											clickTr.addClass("trSelected");
											$("td",clickTr).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
											$("td",clickTr).eq(colindex).find(":input[type='checkbox']")[0].checked = true;
											clickTr.siblings().each(function(){
												var $thisTRtd=$(this);
												//alert($("td",$thisTRtd).eq(colindex).html());
												$("td",$thisTRtd).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
												$("td",$thisTRtd).eq(colindex).find(":input[type='checkbox']")[0].checked = false;
											})
											clickTr.siblings().removeClass('trSelected');
										}
									}
									
							})
							}else{
								$('tbody', g.bDiv).live({
									mousedown:function(e){
									var clickObj=(e.target || e.srcElement);
									   if(clickObj.tagName.toLowerCase()!="td"){	
										var clickTd=$(clickObj).parents('td').eq(0);
									   }else{
										var clickTd=$(clickObj);  
									   }
									   var clickTr=$(clickObj).parents('tr').eq(0);
										if($(clickObj).hasClass('jNiceCheckbox')&&((clickTd.index())==colindex)){
											$(clickObj).one('click',function(){
												if($(clickObj).hasClass("jNiceChecked")){
													clickTr.addClass("trSelected");
												}else{
													clickTr.removeClass("trSelected");
												}
											})	
										}else{
											clickTr.toggleClass("trSelected");
											if(clickTr.hasClass("trSelected")){
											   $("td",clickTr).eq(colindex).find("span.jNiceCheckbox").addClass("jNiceChecked");
											   $("td",clickTr).eq(colindex).find(":input[type='checkbox']")[0].checked = true;
											}else{
											   $("td",clickTr).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
											   $("td",clickTr).eq(colindex).find(":input[type='checkbox']")[0].checked = false;
											}
										//	clickTr.siblings().each(function(){
										//		var $thisTRtd=$(this);
										//		//alert($("td",$thisTRtd).eq(colindex).html());
										//		$("td",$thisTRtd).eq(colindex).find("span.jNiceCheckbox").removeClass("jNiceChecked");
										//		$("td",$thisTRtd).eq(colindex).find(":input[type='checkbox']")[0].checked = false;
										//	})
										//	clickTr.siblings().removeClass('trSelected');
										}
									}		
								})	
							}
						}else{
							$('tbody', g.bDiv).delegate("tr","click",function(e){	
										var obj = (e.target || e.srcElement);
										 if(obj.tagName.toLowerCase()!="tr"){	
											 var clickTr=$(obj).parents('tr').eq(0);
											 clickTr.toggleClass('trSelected');	
										 }else{
											 $(this).toggleClass('trSelected');		
										 }
										 if (obj.href || obj.type)
												return true;
							});
						}
					}
					$('tbody tr', g.bDiv).each(function() {
					//if ($.browser.msie && $.browser.version < 7.0) {// ie6，鼠标移动变色
						$(this).hover(function() {
							$(this).addClass('trOver');
						}, function() {
							$(this).removeClass('trOver');
						});
					//}
					})
			},
			pager : 0
		};

		// init divs
		g.gDiv = document.createElement('div'); // create global container
		// //根div
		// g.mDiv = document.createElement('div'); //create title container
		// //title头
		g.hDiv = document.createElement('div'); // create header
		// container//表头、列标题
		g.bDiv = document.createElement('div'); // create body container //表体、数据
		// g.vDiv = document.createElement('div'); //create grip
		// g.rDiv = document.createElement('div'); //create horizontal resizer
		g.cDrag = document.createElement('div'); // create column drag//列宽拖拽条
		g.nDiv = document.createElement('div'); // create column show/hide
		// popup//菜单“隐藏/显示哪些列”
		g.nBtn = document.createElement('div'); // create column show/hide
		// button//图标按钮，点了后可以显示“用于隐藏显示哪些列的菜单”
		// g.iDiv = document.createElement('div'); //create editable layer
		// g.tDiv = document.createElement('div'); // create toolbar
		// g.sDiv = document.createElement('div');
		// g.pDiv = document.createElement('div'); //create pager
		// container//翻页工具条div
		
		
		$(t).before(flexigridFixedHead);
        
		g.hTable = document.createElement('table');
		// 顶层div
		g.gDiv.className = 'flexigrid';
		if(config.fixedHeight!="auto"){
			$(g.gDiv).addClass('flexigridFixedHeight');
			$(g.gDiv).css("height",config.fixedHeight);
			$(g.bDiv).addClass("bDivFixedHeight");
		}
		if($(t).attr("id")){
			g.gDiv.id = 'flexigrid'+$(t).attr("id");
		}
		if ($.browser.msie) {
			$(g.gDiv).addClass('ie');
		}
		/*
		 * if (p.width != 'auto') { g.gDiv.style.width = p.width + 'px'; }
		 */
		$(t).before(g.gDiv);// ??
		
		     $(g.gDiv).append(t);// ??
		
		// 表头div
		g.hDiv.className = 'hDiv';
		g.hDiv.id = g.gDiv.id+'hDiv';
		$(t).before(g.hDiv);// ??
		g.hTable.cellPadding = 0;
		g.hTable.cellSpacing = 0;
		
		if(dragFunction=="true"){
		$(g.hDiv).append('<div class="hDivBox"></div>');
		$('div', g.hDiv).append(g.hTable);
		};
		var thead = $("thead:first", t).get(0);
		if(dragFunction=="true"){
		if (thead)
			$(g.hTable).append(thead);
     	thead = null;
		}
		if (!p.colmodel)
			var ci = 0;
		$('thead tr:first th', g.hDiv)
				.each(
						function() {
							var thdiv = document.createElement('div');
							if (this.hidden) {
								$(this).hide();
							}
							if (!p.colmodel) {
								$(this).attr('axis', 'col' + ci++);
							}
							$(thdiv).css({
								textAlign : this.align,
								width : this.width + 'px'
							});
							thdiv.innerHTML = this.innerHTML;
							if(dragFunction=="true"){
								$(this)
								.empty()
								.append(thdiv)
								.removeAttr('width');
							};
							$(this)
								//	.empty()
								//	.append(thdiv)
								//.removeAttr('width')  jlj 
									.mousedown(function(e) {
										g.dragStart('colMove', e, this);
									})
									.hover(
											function() {
												if (!g.colresize
														&& !$(this).hasClass(
																'thMove')
														&& !g.colCopy) {
													$(this).addClass('thOver');
												}
												if ($(this).attr('abbr') != p.sortname
														&& !g.colCopy
														&& !g.colresize
														&& $(this).attr('abbr')) {
													$('div', this).addClass(
															's' + p.sortorder);
												} else if ($(this).attr('abbr') == p.sortname
														&& !g.colCopy
														&& !g.colresize
														&& $(this).attr('abbr')) {
													var no = (p.sortorder == 'asc') ? 'desc'
															: 'asc';
													$('div', this).removeClass(
															's' + p.sortorder)
															.addClass('s' + no);
												}
												if (g.colCopy) {
													var n = $('th', g.hDiv)
															.index(this);
													if (n == g.dcoln) {
														return false;
													}
													if (n < g.dcoln) {
														$(this).append(
																g.cdropleft);
													} else {
														$(this).append(
																g.cdropright);
													}
													g.dcolt = n;
												} else if (!g.colresize) {
													var nv = $('th:visible',
															g.hDiv).index(this);
													var onl = parseInt($(
															'div:eq(' + nv
																	+ ')',
															g.cDrag)
															.css('left'));
													var nw = jQuery(g.nBtn)
															.outerWidth();
													var nl = onl
															- nw
															+ Math
																	.floor(p.cgwidth / 2);
													$(g.nDiv).hide();
													$(g.nBtn).hide();

													var top = $(window.top)
															.scrollTop()
															- g.gDiv.offsetTop;
													if (top < 0)
														top = 0;
													$(g.nBtn).css({
														'left' : nl,
														top : top
													}).show();

													var ndw = parseInt($(g.nDiv)
															.width());
													var top2 = top
															+ $(g.nBtn)
																	.height();
													$(g.nDiv).css({
														top : top2
													});
													if ((nl + ndw) > $(g.gDiv)
															.width()) {
														$(g.nDiv).css('left',
																onl - ndw + 1);
													} else {
														$(g.nDiv).css('left',
																nl);
													}
													if ($(this).hasClass(
															'sorted')) {
														$(g.nBtn).addClass(
																'srtd');
													} else {
														$(g.nBtn).removeClass(
																'srtd');
													}
												}
											},
											function() {
												$(this).removeClass('thOver');
												if ($(this).attr('abbr') != p.sortname) {
													$('div', this).removeClass(
															's' + p.sortorder);
												} else if ($(this).attr('abbr') == p.sortname) {
													var no = (p.sortorder == 'asc') ? 'desc'
															: 'asc';
													$('div', this).addClass(
															's' + p.sortorder)
															.removeClass(
																	's' + no);
												}
												if (g.colCopy) {
													$(g.cdropleft).remove();
													$(g.cdropright).remove();
													g.dcolt = null;
												}
											}); // wrap content
						});
		$('thead  th:has(a)', $(t)).each(function(){
			$(this).hover(function(){
				$(this).addClass("thLinkOver");	
			},function(){
				$(this).removeClass("thLinkOver");	
			})
		});
		
		$('thead  th', $(t)).each(function(){
			$(this).hover(function(){
				$(this).addClass('thOver');
			},function(){
				$(this).removeClass("thOver");	
			})
		});
		
       
		// 表体
//	if(dragFunction=="true"){             //判断是否支持拖拽
		g.bDiv.className = 'bDiv';
		g.bDiv.id = g.gDiv.id+'bDiv';
		if(config.fixedHeight!="auto"){
			$(g.bDiv).addClass("bDivFixedHeight");
		}
		$(t).before(g.bDiv);

		$(g.bDiv).scroll(function(e) {
			g.scroll();
		}).append(t);
//	}   
		
		g.addCellProp();
		g.addRowProp();

		// 用于改变列宽的div条
		if(dragFunction=="true"){  
		var cdcol = $('thead tr:first th:first', g.hDiv).get(0);
		if (cdcol != null) {
			g.cDrag.className = 'cDrag';
			g.cdpad = 0;// 合计左右边框
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth'))) ? 0
					: parseInt($('div', cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth'))) ? 0
					: parseInt($('div', cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft'))) ? 0
					: parseInt($('div', cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight'))) ? 0
					: parseInt($('div', cdcol).css('paddingRight')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0
					: parseInt($(cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0
					: parseInt($(cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0
					: parseInt($(cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0
					: parseInt($(cdcol).css('paddingRight')));
			$(g.bDiv).before(g.cDrag);
			var cdheight = $(g.bDiv).height();
			var hdheight = $(g.hDiv).height();
			$(g.cDrag).css({
				top : -hdheight + 'px'
			});
			if(p.drag){
				$('thead tr:first th', g.hDiv).each(function() {
					var cgDiv = document.createElement('div');
					$(g.cDrag).append(cgDiv);
					if (!p.cgwidth) {
						p.cgwidth = $(cgDiv).width();
					}
					$(cgDiv).css({
						height : cdheight + hdheight
					}).mousedown(function(e) {
						g.dragStart('colresize', e, this);
					});
					if ($.browser.msie && $.browser.version < 7.0) {
						g.fixHeight($(g.gDiv).height());
						$(cgDiv).hover(function() {
							g.fixHeight();
							$(this).addClass('dragging');
						}, function() {
							if (!g.colresize)
								$(this).removeClass('dragging');
						});
					}
				});	
			}
	
		}
		}

		// 条纹样式(隔行换颜色)
		if (p.striped) {
			$('tbody tr', g.bDiv).removeClass('erow');
			$('tbody tr:odd', g.bDiv).addClass('erow');// 奇数行
		}

		// setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';

		// 列的控制按钮和控制菜单
		var gh = $(g.bDiv).height();
		var gtop = g.bDiv.offsetTop;
		if ($('th', g.hDiv).length) {
			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css({
				marginBottom : (gh * -1),
				display : 'none',
				top : gtop
			}).noSelect();
			var cn = 0;
			$('th div', g.hDiv).each(
					function() {
						var kcol = $("th[axis='col" + cn + "']", g.hDiv)[0];
						var chk = 'checked="checked"';
						if (kcol.style.display == 'none') {
							chk = '';
						}
						$('tbody', g.nDiv).append(
								'<tr><td class="ndcol1"><input type="checkbox" '
										+ chk + ' class="togCol" value="' + cn
										+ '" /></td><td class="ndcol2">'
										+ this.innerHTML + '</td></tr>');
						cn++;
					});
			if ($.browser.msie && $.browser.version < 7.0)
				$('tr', g.nDiv).hover(function() {
					$(this).addClass('ndcolover');
				}, function() {
					$(this).removeClass('ndcolover');
				});
			$('td.ndcol2', g.nDiv).click(
					function() {
				
						if ($('input:checked', g.nDiv).length <= p.minColToggle
								&& $(this).prev().find('input')[0].checked)
							return false;
						return g.toggleCol($(this).prev().find('input').val());
					});
			$('input.togCol', g.nDiv).click(
			
					function() {
						if ($('input:checked', g.nDiv).length < p.minColToggle
								&& this.checked == false)
							return false;
						$(this).parent().next().trigger('click');
					});
			$(g.gDiv).prepend(g.nDiv);
			if(p.hideShow){
				$(g.nBtn).addClass('nBtn').html('<div></div>').attr('title',
				'Hide/Show Columns').click(function() {
			$(g.nDiv).toggle();
			return true;
		});	
			}

			if (p.showToggleBtn) {
				$(g.gDiv).prepend(g.nBtn);
			}
		}

		// add flexigrid events
		$(g.bDiv).hover(function() {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		}, function() {
			if (g.multisel) {
				g.multisel = false;
			}
		});
		$(g.gDiv).hover(function() {
		}, function() {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		});
		// add document events
		$(document).mousemove(function(e) {
			g.dragMove(e);
		}).mouseup(function(e) {
			g.dragEnd();
		}).hover(function() {
		}, function() {
			g.dragEnd();
		});
		// browser adjustments
		if ($.browser.msie && $.browser.version < 7.0) {
			$('.hDiv,.bDiv', g.gDiv).css({
				width : '100%'
			});
			$(g.gDiv).addClass('ie6');
			if (p.width != 'auto') {
				$(g.gDiv).addClass('ie6fullwidthbug');
			}
		}
		g.rePosDrag();
		g.fixHeight();
		// make grid functions accessible
		t.p = p;
		t.grid = g;      
		var fixedHeader = $('table',g.bDiv).attr("fixedGridHeader");
		if(config.fixedHeight!="auto"){
			//固定表头
			var grid = $('#'+g.gDiv.id);
			$(g.bDiv).css("height",config.fixedHeight);
			var fixedHeadFlexigridHeight=$("thead",g.bDiv).css("height");
			var fixedHeadFlexigridWidht=$("thead",g.bDiv).css("width");
			$(g.bDiv).css("top","-"+fixedHeadFlexigridHeight);
			var fixedHeadFlexigrid = $("thead",g.bDiv).clone(true);
			var flxedHdadFlexigridObj=$("<div class=\"fixedHeadFlexigridHeightDiv\"><table style=\"width:"+fixedHeadFlexigridWidht+";height:"+fixedHeadFlexigridHeight+"\"><thead>"+fixedHeadFlexigrid.html()+"<thead></table></div>");
			$(g.bDiv).before(flxedHdadFlexigridObj);
			//alert(grid.html());
			/*$(g.gDiv,grid).scroll(function(){
				fixedFlexigridHead(g.gDiv.id);
			});
			$(window.top).scroll(function(){
				fixedFlexigridHead(g.gDiv.id);
			});
			fixedFlexigridHead=function(id1){
				
				if(top!=window){
					var grid = $('#'+id1);
					$('#'+id1+'hDiv').css({
						"position" : "fixed",
						"z-index"  : "90",
						"left" : grid.offset().left,
						"top"  :grid.offset().top,
						"width" : grid.width()-16

					});	
					$('#'+id1+'bDiv').css({
						"position" : "relative",
						"top" : $('#'+id1+'hDiv').height()
					});
				}else{
					var grid = $('#'+id1);
					$('#'+id1+'hDiv').css({
						"position" : "fixed",
						"z-index"  : "90",
						"left" : grid.offset().left,
						"top"  : grid.offset().top-$(window.top).scrollTop(),
						"width" : grid.width()-16

					});	
					$('#'+id1+'bDiv').css({
						"position" : "relative",
						"top" : $('#'+id1+'hDiv').height()
					});
				}
			};*/
		}else if(fixedHeader!=undefined){                 //判断是否浮动表头
			// 浮动表头
			$(window.top)
					.scroll(
							function() {
								var sctop = $(window.top).scrollTop();
								var elmtop = $(g.gDiv).offset().top;
	                            if(top!=window){
	                            	var offtop = "";
	                    			var win = window;
	                    			do {
	                    				var top1 = $(win.frameElement).offset().top;
	                    				offtop = parseInt(top1 + offtop);
	                    				win = win.parent;
	                    			} while (top != win);
	    							if (sctop > elmtop+offtop
	    									&& sctop <= (elmtop +offtop+ $(g.gDiv).height() - $(
	    											g.hDiv).height())) {
	    									$(g.hDiv)
	    											.css(
	    													{
	    														"position" : "fixed",
	    														"top" : sctop-offtop+"px",
	    														"z-index" : 90,
	    														"width" : $(g.gDiv)
	    																.width(),
	    														"left" : $(g.bDiv)
	    																.offset().left
	    																- $(window)
	    																		.scrollLeft()
	    													});
	    									
	    							} else {
	    								$(g.hDiv).css({
	    									"position" : "relative",
	    									"top" : 0,
	    									"left" : 0
	    								});
	    							}
	                            }else{
	    							if (sctop > elmtop
	    									&& sctop <= (elmtop + $(g.gDiv).height() - $(
	    											g.hDiv).height())) {
	    								if (jQuery.browser.msie
	    										&& jQuery.browser.version == "6.0")
	    									$(g.hDiv).css({
	    										"position" : "absolute",
	    										"top" : $(window.top).scrollTop(),
	    										"z-index" : 90,
	    										"left" : $(g.bDiv).offset().left
	    									});
	    								else {
	    									$(g.hDiv)
	    											.css(
	    													{
	    														"position" : "fixed",
	    														"top" : "0",
	    														"z-index" : 90,
	    														"width" : $(g.gDiv)
	    																.width(),
	    														"left" : $(g.bDiv)
	    																.offset().left
	    																- $(window)
	    																		.scrollLeft()
	    													});
	    									
	    								}
	    							} else {
	    								$(g.hDiv).css({
	    									"position" : "relative",
	    									"top" : 0,
	    									"left" : 0
	    								});
	    							}
	                            }

								g.hDiv.scrollLeft = g.bDiv.scrollLeft;
							});
			$(window).resize(function(){
				g.reDivWidth();
				g.rePosDrag();
               
			});
			
		}



		return t;
	};

	var docloaded = false;
	$(document).ready(function() {
		docloaded = true;
	});

	$.fn.flexigrid = function(cfg) {
		return this.each(function() {
			if (!docloaded) {
				$(this).hide();
				var t = this;
				$(document).ready(function() {
					$.addFlex(t, cfg);
				});
			} else {
				$.addFlex(this, cfg);
			}
		});
	}; // end flexigrid
	$.fn.gettrSelected = function() {
		var trcount=$('.trSelected',this);
		
		return trcount;

	}
	//重新计算高度
	$.fn.fixHeight = function() {
		var grid = $(".flexigrid.ie");
		if ($.browser.msie
				&& ($.browser.version < 8 || $.browser.version >= 9)) {
			$(grid).each(function(){
				var btable = $(".bDiv",this).find("table:first");
		//		$(".bDiv",this).height(btable.outerHeight(true) + 20);            感觉没用先注释掉测试一下
			});
			
		}	
	}
	//隔行换色
	$.fn.stripedColors = function(){
		$('tbody tr', this).removeClass('erow');
		$('tbody tr:odd', this).addClass('erow');	
	}
	$.fn.gettrValues = function() {
		var trs=$('.trSelected',this);
		var trsval =new Array();
		if(trs.length=="1"){
			var td=new Array();
			$(trs).find("td").each(function(i){
				td[i]=$(this).text();			
			});
			trsval =td;
		}else{
			for (var j=0;j<trs.length;j++){
				var td=new Array();
				$(trs[j]).find("td").each(function(i){
					td[i]=$(this).text();			
				});
				trsval[j] = td;	
			}
		}
	
		return trsval;
	}
	$.fn.flexToggleCol = function(cid, visible) { // function to reload grid
		return this.each(function() {
			if (this.grid)
				this.grid.toggleCol(cid, visible);
		});
	}; // end flexToggleCol

	// 禁止选中文本
	$.fn.noSelect = function(p) { // no select plugin by me :-)
		var prevent = (p == null) ? true : p;
		if (prevent) {
			return this.each(function() {
				if ($.browser.msie || $.browser.safari)
					$(this).bind('selectstart', function() {
						return false;
					});
				else if ($.browser.mozilla) {
					$(this).css('MozUserSelect', 'none');
					$('body').trigger('focus');
				} else if ($.browser.opera)
					$(this).bind('mousedown', function() {
						return false;
					});
				else
					$(this).attr('unselectable', 'on');
			});
		} else {
			return this.each(function() {
				if ($.browser.msie || $.browser.safari)
					$(this).unbind('selectstart');
				else if ($.browser.mozilla)
					$(this).css('MozUserSelect', 'inherit');
				else if ($.browser.opera)
					$(this).unbind('mousedown');
				else
					$(this).removeAttr('unselectable', 'on');
			});
		}
	}; // end noSelect
	
})(jQuery);

//this is initLinkPopup
(function($){	
	$.ajaxSetup ({cache: false});
	//begin item custom employee link popup div   init:$($(window).load(function(){$.fn.initLinkPopup();})); 
	$.fn.initLinkPopup=function(){
		$("body").append("<div class='floatWindowOuter'></div>");
		var $linkpopup = $(".floatWindowOuter");
		var $curLink = null;
		var linkPopupFlag = false;
		var timeId;
		var delay=500;//悬浮 n秒后显示
		var linkpopupwidth;
		var linkpopupheight;
		var linkpopuptext;
		var linkpopupstyle1="<div class='floatWindow'><div class='floatWindowUn'><div class='floatWindowBody'></div></div><div class='floatWindowUnArrow' ></div></div>";			
		$("u.employee,u.item,u.cust").live( {mouseenter: function() {
					var link = $(this);
					timeId = setTimeout(function() {
						$curLink = link;
						  //ajax
						  $.ajaxSetup({cache: false}); 
						  $linkpopup.append("<div class='floatWindow'><div class='floatWindowOnArrow' ></div><div class='floatWindowOn'><div class='floatWindowBody'>正在加载 ...</div></div></div>");
						  $linkpopup.css("display", "block");
						  var floatUrl="../floatBoxCmd.cmd?method=getInfo";
						  if(link.attr("m")=="no"){
							  floatUrl="floatBoxCmd.cmd?method=getInfo";
						  }
						  $(".floatWindowBody").load(floatUrl,{"randomval" : (new Date).getTime(),"code":$curLink.attr('code'),"type":$curLink.attr('class')},
						  function(){
							//添加附加内容
							try{    //捕获当没有附加内容时候的异常
								var extendsHtml;
								if(link.hasClass("cust")){
									extendsHtml = getCustExtendsHTML($curLink.attr('code'));
								}else if(link.hasClass("item")){
									extendsHtml = getItemExtendsHTML($curLink.attr('code'));
								}else if(link.hasClass("employee")){
									extendsHtml = getEmployeeExtendsHTML($curLink.attr('code'));
								}
								if(extendsHtml!=""){
									$(".content-con").append('<div class="spliter"><hr/></div>')
									.append($('<div id="foo-link"></div>').append(extendsHtml));
								}
							}catch(e){};
						  	linkpopupheight=$linkpopup.height();
						  	linkpopupwidth=$linkpopup.width();
						  	linkpopuptext=$(".floatWindowBody").html();			
						    var offset = link.offset();
						    //判断浮动应该在链接的上边还是下边
						   	if((offset.top+linkpopupheight-$(document).scrollTop()+10)>$(window).height()){
						  		$(".floatWindow").remove();
						  		$linkpopup.append(linkpopupstyle1);
						  	 	$(".floatWindowBody").html(linkpopuptext);
						  	 	offset.top = offset.top - link.height()-$linkpopup.height()+10;
						  	}else{
						  		offset.top = offset.top + link.height();
						  	}
						   	//判断浮动靠左还是靠右
						   	if((offset.left+linkpopupwidth-$(document).scrollLeft()+10)>$(window).width()){
						   		//如果靠右，箭头同样需要放到右边
						  	 	$(".floatWindowOnArrow").css("left",$linkpopup.width()-40+'px');
						  	 	$(".floatWindowUnArrow").css("left",$linkpopup.width()-40+'px');
						  	 	offset.left = offset.left + link.width()-$linkpopup.width()+5;
						  	}
							$linkpopup.offset(offset);
						  });					 
					  	 	$linkpopup.css("display", "block");	
					},delay);
			  },mouseleave:function(){
				  clearTimeout(timeId);
				  linkPopupFlag=true;
				  setTimeout(linkPopupDisappear,200);
			  }
			 
		});
		function linkPopupDisappear(){
			if(linkPopupFlag){
				$linkpopup.css("display","none");
				$(".floatWindow").remove();
			}				  
		}
		$linkpopup.hover(function(){
			linkPopupFlag=false;			  
		  },function(){
			  linkPopupFlag=true;
			  linkPopupDisappear();
		  });
	};
	//end item custom employee link popup div
	
	
	/**
	  * jQuery TAH Plugin  autoheight
	  * Using for Textarea-Auto-Height
	  * @Version: 0.4
	  * @Update: December 13, 2011
	  * @Author: Phoetry (http://phoetry.me)
	  * @Url: http://phoetry.me/archives/tah.html
	  **/
$.fn.autoHeight=function(opt){
	opt=$.extend({
		moreSpace:10,
		maxHeight:600,
		animateDur:200
	},opt);
	return this.each(function(i,t){
		if(!$.nodeName(t,'textarea'))return;
		var ta=$(t).css({resize:'none',overflowY:'hidden'}),
			_ta=ta.clone().attr({id:'',name:'',tabIndex:-1}).css(function(css){
				$.each('width0fontSize0fontFamily0lineHeight0wordWrap0wordBreak0whiteSpace0letterSpacing'.split(0),function(i,t){css[t]=ta.css(t)});
				return $.extend(css,{
					width:ta.width()*1.5,
					position:'absolute',
					left:-9e5,
					height:0
				});
			}({})),
			valCur,stCur,stCache,defHeight=ta.height(),
			autoHeight=function(){
				(stCur=Math.max(defHeight,_ta.val(valCur=ta.val()).scrollTop(9e5).scrollTop())+(valCur&&opt.moreSpace))==stCache?0:
				(stCache=stCur)<opt.maxHeight?ta.stop().animate({height:stCur},opt.animateDur):ta.css('overflowY','auto');
			};
		ta.after(_ta).bind('blur focus input change propertychange keydown',autoHeight);
	});
};

/*
 * jNice
 * version: 1.0 (11.26.08)
 * by Sean Mooney (sean@whitespace-creative.com) 
 * Examples at: http://www.whitespace-creative.com/jquery/jnice/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * To Use: place in the head 
 *  <link href="inc/style/jNice.css" rel="stylesheet" type="text/css" />
 *  <script type="text/javascript" src="inc/js/jquery.jNice.js"></script>
 *
 * And apply the jNice class to the form you want to style
 *
 * To Do: Add textareas, Add File upload
 *
 ******************************************** */



$.fn.jNice = function(){
	$('input:checkbox').each(CheckAdd);
	$('input:radio').not('[id^="ui-multiselect"]').each(RadioAdd);

	var self = this;
	var safari = $.browser.safari; /* We need to check for safari to fix the input:text problem */
	/* Apply document listener */
	$(document).mousedown(checkExternalClick);
};/* End the Plugin */
var RadioAdd = function(){
if( $(this).attr("original")==undefined){
	var radioWrapClass=$(this).parent().attr('class');
	if(radioWrapClass!=undefined){
	if(radioWrapClass.indexOf("jNiceWrapper")!=-1)//防止下拉框jquery.multiselect.js refresh时重复包装  它refresh时会重新调用$.fn.jNice进行重新渲染，这时如果不判断会重复包装
		return;
	}
	var $input = $(this).addClass('jNiceHidden').wrap('<span class="jNiceWrapper"></span>');
	var $wrapper = $input.parent();
	var $a = $("<span class=\"jNiceRadio\" ></span>");
	$wrapper.prepend($a);
	if($input.attr('disable')!='disable'){
		/* Click Handler */
		var callBack= $(this).attr("onclick");
		$a.click(function(){
				//var $input = $(this).addClass('jNiceChecked').siblings('input').attr('checked',true);
				var $input = $(this).addClass('jNiceChecked').siblings();
				//$input.attr('checked',true);
				/* uncheck all others of same name */
				$('input:radio[name="'+ $input.attr('name') +'"]').not($input).each(function(){
					$(this).attr('checked',false).siblings('.jNiceRadio').removeClass('jNiceChecked');
					this.checked = false;
				});
				var inputDom = $input[0];
				inputDom.checked=true;
				$(this).siblings().trigger("onchange");
				if(callBack) eval(callBack);
				return false;
		});		
	}else{
		$a.css('opacity','0.3');
	}
	/* set the default state */
	if (this.checked){ $a.addClass('jNiceChecked'); }	
	var sel = $(this).attr("sel");
	if(sel!=undefined&&sel!=""){
		setUnAll(this.name);
		var selArr = sel.split(",");
		setSel(selArr,this.name);
	}
}	
};

var CheckAdd = function(){
if( $(this).attr("original")==undefined){
	var checkWrapClass=$(this).parent().attr('class');
	if(checkWrapClass!=undefined){
	    if(checkWrapClass.indexOf("jNiceWrapper")!=-1)//防止下拉框jquery.multiselect.js refresh时重复包装  它refresh时会重新调用$.fn.jNice进行重新渲染，这时如果不判断会重复包装
			return;
		}
	var $input = $(this).addClass('jNiceHidden').wrap('<span class="jNiceWrapper"></span>');
	var $wrapper = $input.parent().append("<span class=\"jNiceCheckbox\"></span>");
	var $a = $wrapper.find('.jNiceCheckbox');
	/* Click Handler */
	if($input.attr('disable')!='disable'){
		var callBack= $(this).attr("onclick");
		$a.click(function(){
			var $a = $(this);
			var input = $a.siblings()[0];
			//$a.nextSibling();
		//	var input = $a.siblings('input')[0];
			var checkBoxClass=$a.attr("class");
			if (checkBoxClass.indexOf("jNiceChecked")!=-1){
				input.checked = false;
				$a.removeClass('jNiceChecked');
			}
			else {
				input.checked = true;
				$a.addClass('jNiceChecked');
			}
			$(this).siblings().trigger("onchange");
			if(callBack) eval(callBack);
			return false;
	});
//	$input.click(function(){
//		if(this.checked){ $a.addClass('jNiceChecked'); 	}
//		else { $a.removeClass('jNiceChecked'); }
//	}).focus(function(){ $a.addClass('jNiceFocus'); }).blur(function(){ $a.removeClass('jNiceFocus'); });
	}else{
		$a.css('opacity','0.3');
	}

	/* set the default state */
	if (this.checked){$('.jNiceCheckbox', $wrapper).addClass('jNiceChecked');}
	
	var sel = $(this).attr("sel");
	if(sel!=undefined&&sel!=""){
		setUnAll(this.name);
		var selArr = sel.split(",");
		setSel(selArr,this.name);
	}
}
};

var SelectHide = function(){
		$('.jNiceSelectWrapper ul:visible').hide();
};

	/* Check for an external click */
var checkExternalClick = function(event) {
	if ($(event.target).parents('.jNiceSelectWrapper').length === 0) { SelectHide(); }
};

//window.onload = $.fn.jNice();
/* Automatically apply to any forms with class jNice */
 
/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, boss:true, undef:true, curly:true, browser:true, jquery:true */
/*
 * jQuery MultiSelect UI Widget 1.12
 * Copyright (c) 2011 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/
//渲染前给下拉框排序
/*$(function(){	
	$("select").each(function(){	
  if($(this).attr("original")==undefined){
//	alert($(this).children(':first').val());
	var selectOrder = $(this).attr("order");
    if(selectOrder!="false"){    
		if($(this).children(':first').val()=="")                    //如果是分组的下拉框不做处理
		{			
		}else
		{		
//		alert( $(this).children(':first').text());
		 var firstOption= $(this).children(':first').val();
		 var optionVal=[];	
		 var optionTest=[];		 
		 $(this).children().each(function(i){
			 optionVal[i]=$(this).val();
			 optionTest[i]=$(this).text();
		 })	
		 for (var i = 0; i < optionVal.length; i++) {                  //数组冒泡排序从小到大排序
				for (var j = 0; j < optionVal.length; j++) {
					var val;
					var text;
					if (optionVal[i] < optionVal[j]) {  
						val = optionVal[j];
						optionVal[j] = optionVal[i];
						optionVal[i] = val;						
						text=optionTest[j];
						optionTest[j]=optionTest[i];
						optionTest[i]=text;
					}
				}
			}		 
		  var optionHtmls='';
		  for(var i=0;i<optionVal.length;i++){
	          optionHtmls+='<option value="'+optionVal[i]+'" >'+optionTest[i]+'</option>';

	          }
		  $(this).html('');
          $(this).append(optionHtmls);
		}
      }
	}
   })
	
})
*/
var multiselectID = 0;
$.widget("ech.multiselect", {
	
	// default options
	options: {
		header: true,
		height: 175,
		minWidth: 147,  //default is 225
		classes: '',
		checkAllText: 'Check all',
		uncheckAllText: 'Uncheck all',
		noneSelectedText: 'Select options',
		selectedText: '# selected',
		selectedList: 1, //fengfeng modefied 20120605 ,default is 0, change to 1
		show: '',
		hide: '',
		autoOpen: false,
		multiple: true,//the value is depended by seletct's tag multiple="multiple"
		position: {},
		scroll:true
	},

	_create: function(){	
		var selectOriginal= this.element.attr("original");
		if(selectOriginal!=undefined){
			return;
		}
		var el = this.element.hide(),
			o = this.options;
		
//		el.parent().each(
//				function(){
//					$(this).attr('multiple','multiple');
//					console.log($(this).html());
//				}
//			);
		
		//fengfeng add 20120605 begin to support select tag's sel property, when init multiselect, sel property's value(split by ',') option will be selected.
		el.find("option").each(
			function(){
				var sel = $(this).parent().attr('sel');
				if(sel != undefined || sel != null) {
					sel=sel.split(',');
					for(var i=0;i<sel.length;i++)
						if($(this).val()==sel[i]){
							$(this).attr('selected','selected');
						}
				}
		
				//
				var seltag = $(this).parent();
				if(seltag[0].tagName=="OPTGROUP"){
					seltag = seltag.parent();
				}
				if(seltag.attr('multiple')!=undefined ||seltag.attr('multiple')!=null)
				{
					o.multiple = true;
					//seltag.attr('multiple','multiple');
				}else{
					o.multiple = false;
					o.header = false;
				}
				//console.log(seltag[0].outerHTML);
			}
		);
		if(el[0].tagName=="SELECT"){
			var seltag = el;
			if(seltag[0].tagName=="OPTGROUP"){
				seltag = seltag.parent();
			}
			if(seltag.attr('multiple')!=undefined ||seltag.attr('multiple')!=null)
			{
				o.multiple = true;
				//seltag.attr('multiple','multiple');
			}else{
				o.multiple = false;
				o.header = false;
			}
			

			// insert by sunwq
//			header
//			height
//			minWidth
//			checkAllText
//			uncheckAllText
//			noneSelectedText
//			selectedText
//			selectedList
//			autoOpen
 //			position
//			show
//			hide
//			scroll
			
			var header = seltag.attr('header');
			if(header!=undefined ||header!=null){
				if(header=="true"){
					o.header=true;
				}else	if(header=="false"){
					o.header=false;
				}else{
					o.header=header;
				}
			}
			var height = seltag.attr('height');
			if(height!=undefined ||height!=null){
				o.height=height;
			}
			
		/*	var num =$("option",seltag).length;
			var hei = seltag.height();
			if(num*hei<seltag.attr('height')){
				seltag.attr('scroll',false);
			}
		
		*/	
			
			var width=seltag.attr('width');
			if(width!=undefined ||width!=null){
				o.minWidth=width;
			}
			var checkAllText = seltag.attr('checkAllText');
			if(checkAllText!=undefined ||checkAllText!=null){
				o.checkAllText=checkAllText;
			}
			var uncheckAllText = seltag.attr('uncheckAllText');
			if(uncheckAllText!=undefined ||uncheckAllText!=null){
				o.uncheckAllText=uncheckAllText;
			}
			var noneSelectedText = seltag.attr('noneSelectedText');
			if(noneSelectedText!=undefined ||noneSelectedText!=null){
				o.noneSelectedText=noneSelectedText;
			}
			var selectedText = seltag.attr('selectedText');
			if(selectedText!=undefined ||selectedText!=null){
				o.selectedText=selectedText;
			}
			var selectedList = seltag.attr('selectedList');
			if(selectedList!=undefined ||selectedList!=null){
				o.selectedList=selectedList;
			}
			var autoOpen=seltag.attr('autoOpen');
			if(autoOpen!=undefined ||autoOpen!=null){
				o.autoOpen=autoOpen;
			}
			var position=seltag.attr('position');
			if(position!=undefined ||position!=null){
				o.position=position;
			}
			var show=seltag.attr('show');
			if(show!=undefined ||show!=null){
				o.show=show;
			}
			
			var hide=seltag.attr('hide');
			if(hide!=undefined ||hide!=null){
				o.hide=hide;
			}
			var scroll=seltag.attr('scroll');
			if(scroll!=undefined ||scroll!=null){
				o.scroll=scroll;
			}

			
			
			
		}
		//fengfeng add 20120605 end 
		
		this.speed = $.fx.speeds._default; // default speed for effects
		this._isOpen = false; // assume no
	
		var 
			button = (this.button = $('<button type="button"><span class="ui-icon ui-icon-triangle-2-n-s"></span></button>'))
				.addClass('ui-multiselect ui-widget ui-widget-select-header ui-corner-all')
				.addClass( o.classes )
				.attr({ 'title':el.attr('title'), 'aria-haspopup':true, 'tabIndex':el.attr('tabIndex') })
				.insertAfter( el ),
			
			buttonlabel = (this.buttonlabel = $('<span />'))
				.html( o.noneSelectedText )
				.appendTo( button ),
				
			menu = (this.menu = $('<div />'))
				.addClass('ui-multiselect-menu ui-widget ui-widget-content ui-corner-all')
				.addClass( o.classes )
				.appendTo( document.body ),
				
			header = (this.header = $('<div />'))
				.addClass('ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix')
				.appendTo( menu ),
				
			headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
				.addClass('ui-helper-reset')
				.html(function(){
					if( o.header === true ){
						return '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + o.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + o.uncheckAllText + '</span></a></li>';
					} else if(typeof o.header === "string"){
						return '<li>' + o.header + '</li>';
					} else {
						return '';
					}
				})
				.append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>')
				.appendTo( header ),
			
			checkboxContainer = (this.checkboxContainer = $('<ul />'))
				.addClass('ui-multiselect-checkboxes ui-helper-reset')
				.appendTo( menu );
		
		// perform event bindings
		this._bindEvents();
		
		// build menu
		this.refresh( true );
		
		// some addl. logic for single selects
		if( !o.multiple ){
			menu.addClass('ui-multiselect-single');
		}
	},
	
	_init: function(){
		if( this.options.header === false ){
			this.header.hide();
		}
		if( !this.options.multiple ){
			this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').hide();
		}
		if( this.options.autoOpen ){
			this.open();
		}
		if( this.element.is(':disabled') ){
			this.disable();
		}
	},
	
	refresh: function( init ){
		var el = this.element,
			o = this.options,
			menu = this.menu,
			checkboxContainer = this.checkboxContainer,
			optgroups = [],
			html = "",
			id = el.attr('id') || multiselectID++; // unique ID for the label & option tags
		
		// build items
		el.find('option').each(function( i ){
			var $this = $(this), 
				parent = this.parentNode,
				title = this.innerHTML,
				description = this.title,
				value = this.value,
				inputID = 'ui-multiselect-' + (this.id || id + '-option-' + i),
				isDisabled = this.disabled,
				isSelected = this.selected,
				labelClasses = [ 'ui-corner-all' ],
				optLabel;
			
			
			
			// is this an optgroup?
			if( parent.tagName === 'OPTGROUP' ){
				optLabel = parent.getAttribute( 'label' );
				
				// has this optgroup been added already?
				if( $.inArray(optLabel, optgroups) === -1 ){
					html += '<li class="ui-multiselect-optgroup-label"><a href="#">' + optLabel + '</a></li>';
					optgroups.push( optLabel );
				}
			}
		
			if( isDisabled ){
				labelClasses.push( 'ui-state-disabled' );
			}

			// browsers automatically select the first option
			// by default with single selects
			if( isSelected && !o.multiple ){
				labelClasses.push( 'ui-select-state-active' );
			}
			
			html += '<li class="' + (isDisabled ? 'ui-multiselect-disabled' : '') + '">';
			
			// create the label
			html += '<label for="' + inputID + '" title="' + description + '" class="' + labelClasses.join(' ') + '">';
			html += '<input id="' + inputID + '" name="multiselect_' + id + '" type="' + (o.multiple ? "checkbox" : "radio") + '" value="' + value + '" title="' + title + '"';

			// pre-selected?
			if( isSelected ){
				html += ' checked="checked"';
				html += ' aria-selected="true"';
			}

			// disabled?
			if( isDisabled ){
				html += ' disabled="disabled"';
				html += ' aria-disabled="true"';
			}

			// add the title and close everything off
			html += ' /><span>' + title + '</span></label></li>';
		});
		
		
		// insert into the DOM
		checkboxContainer.html( html );

		// cache some moar useful elements
		this.labels = menu.find('label');
		this.inputs = this.labels.children('input');
		
		// set widths
		this._setButtonWidth();
		this._setMenuWidth();
		
		// remember default value
		this.button[0].defaultValue = this.update();
		
		// broadcast refresh event; useful for widgets
		if( !init ){
			this._trigger('refresh');
		}
		
		//fengfeng add begin 20120522 because dynamic add \update\del need refresh multiselect,and the checkbox also need to call jNice to init.
		try{
			$.fn.jNice();
		}catch(e){
		}
	},
	
	// updates the button text. call refresh() to rebuild
	update: function(){
		var o = this.options,
			$inputs = this.inputs,
			$checked = $inputs.filter(':checked'),
			numChecked = $checked.length,
			value;
		
		if( numChecked === 0 ){
			value = o.noneSelectedText;
		} else {
			if(o.selectedText==true||o.selectedText=="true"){
				value = selectedText(this, numChecked, $inputs.length, $checked.get());
			} else if( /\d/.test(o.selectedList) && o.selectedList > 0 && numChecked <= o.selectedList){
				//fengfeng add 20120521 begin   toggle the jquery.jNice.js's checkbox render WebCtrl to make the image checkbox to toggle checked( the image checkbox is <span class="jNiceCheckbox jNiceChecked"></span>)
				var imageCheckbox = $checked.siblings('span .jNiceCheckbox');
				if(imageCheckbox.length==0 ){
					value = $checked.map(function(){ return $(this).next().html(); }).get().join(', ');
				}else{
					value = $checked.map(function(){ return $(this).parent().next().html(); }).get().join(', ');
				}
				//value = $checked.map(function(){ return $(this).next().html(); }).get().join(', ');
				//fengfeng add 20120521 end 
			} else {
				value = o.selectedText.replace('#', numChecked).replace('#', $inputs.length);
			}
		}
		
		this.buttonlabel.html( value );
		return value;
	},
	
	// binds events
	_bindEvents: function(){
		var self = this, button = this.button;

		function clickHandler(){
			self[ self._isOpen ? 'close' : 'open' ]();
			return false;
		}
		
		// webkit doesn't like it when you click on the span :(
		button
			.find('span')
			.bind('click.multiselect', clickHandler);
		
		// button events
		button.bind({
			click: clickHandler,
			keypress: function( e ){
				switch(e.which){
					case 27: // esc
					case 38: // up
					case 37: // left
						self.close();
						break;
					case 39: // right
					case 40: // down
						self.open();
						break;
				}
			},
//			mouseenter: function(){
//				if( !button.hasClass('ui-state-disabled') ){
//					$(this).addClass('ui-select-state-hover');
//				}
//			},
//			mouseleave: function(){
//				$(this).removeClass('ui-select-state-hover');
//			},
			focus: function(){
				if( !button.hasClass('ui-state-disabled') ){
					$(this).addClass('ui-select-state-focus');
				}
			},
			blur: function(){
				$(this).removeClass('ui-select-state-focus');
			}
		});

		// header links
		this.header
			.delegate('a', 'click.multiselect', function( e ){
				// close link
				if( $(this).hasClass('ui-multiselect-close') ){
					self.close();
			
				// check all / uncheck all
				} else {
					self[ $(this).hasClass('ui-multiselect-all') ? 'checkAll' : 'uncheckAll' ]();
				}
				//如果值为空，创建一个用来form提交的隐藏域
				if(self.element.val()==null&&$(".multiselect_form_input").length==0){
					var valNullInput="<input class='multiselect_form_input' type='hidden' name="+self.element.attr("name")+" value=''/>"
					self.element.after(valNullInput);
				}else if(self.element.val()!=null&&$(".multiselect_form_input").length>0){
					$(".multiselect_form_input").remove();	
				}
				e.preventDefault();
			});
		
		// optgroup label toggle support
		this.menu
			.delegate('li.ui-multiselect-optgroup-label a', 'click.multiselect', function( e ){
				e.preventDefault();
				
				var $this = $(this),
					$inputs = $this.parent().nextUntil('li.ui-multiselect-optgroup-label').find('input:visible:not(:disabled)'),
					nodes = $inputs.get(),
					label = $this.parent().text();

				// trigger event and bail if the return is false
				if( self._trigger('beforeoptgrouptoggle', e, { inputs:nodes, label:label }) === false ){
					return;
				}
				
				// toggle inputs
				self._toggleChecked(
					$inputs.filter(':checked').length !== $inputs.length,
					$inputs
				);

				self._trigger('optgrouptoggle', e, {
				    inputs: nodes,
				    label: label,
				    checked: nodes[0].checked
				});
			})
			.delegate('label', 'mouseenter.multiselect', function(){
				if( !$(this).hasClass('ui-state-disabled') ){
					self.labels.removeClass('ui-select-state-hover');
					$(this).addClass('ui-select-state-hover').find('input').focus();
				}
			})
			.delegate('label', 'keydown.multiselect', function( e ){
				e.preventDefault();
				
				switch(e.which){
					case 9: // tab
					case 27: // esc
						self.close();
						break;
					case 38: // up
					case 40: // down
					case 37: // left
					case 39: // right
						self._traverse(e.which, this);
						break;
					case 13: // enter
						$(this).find('input')[0].click();
						break;
				}
			})
			.delegate('input[type="checkbox"], input[type="radio"]', 'click.multiselect', function( e ){
				var $this = $(this),
					val = this.value,
					checked = this.checked,
					tags = self.element.find('option');
				
				// bail if this input is disabled or the event is cancelled
				if( this.disabled || self._trigger('click', e, { value: val, text: this.title, checked: checked }) === false ){
					e.preventDefault();
					return;
				} 

				// make sure the input has focus. otherwise, the esc key
				// won't close the menu after clicking an item.
				$this.focus();
				
				// toggle aria state
				$this.attr('aria-selected', checked);
				
				// change state on the original option tags
				tags.each(function(){
					if( this.value === val ){
						this.selected = checked;
					} else if( !self.options.multiple ){
						this.selected = false;
					}
				});
				
				// some additional single select-specific logic
				if( !self.options.multiple ){
					self.labels.removeClass('ui-select-state-active');
					$this.closest('label').toggleClass('ui-select-state-active', checked );
					
					// close menu
					self.close();
				}

				// fire change on the select box
				self.element.trigger("change");
				
				//fengfeng add 20120521 begin   toggle the jquery.jNice.js's checkbox render WebCtrl to make the image checkbox to toggle checked( the image checkbox is <span class="jNiceCheckbox jNiceChecked"></span>)
				var imageCheckbox = $(this).siblings('span .jNiceCheckbox');
				if(imageCheckbox!=undefined ){
					if ($this.attr('aria-selected')!='true'){
						imageCheckbox.removeClass('jNiceChecked');
					}
					else {
						imageCheckbox.addClass('jNiceChecked');
					}		
				}				
				//fengfeng add 20120521 end   toggle the jquery.jNice.js's checkbox render WebCtrl
				
				
				// setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
				// http://bugs.jquery.com/ticket/3827 
				//如果值为空，创建一个用来form提交的隐藏域
				if(self.element.val()==null){
					var valNullInput="<input class='multiselect_form_input' type='hidden' name="+self.element.attr("name")+" value=''/>"
					self.element.after(valNullInput);
				}else if($(".multiselect_form_input")){
					$(".multiselect_form_input").remove();	
				}
				setTimeout($.proxy(self.update, self), 10);
			});
		
		

		// close each widget when clicking on any other element/anywhere else on the page
		$(document).bind('mousedown.multiselect', function( e ){
			if(self._isOpen && !$.contains(self.menu[0], e.target) && !$.contains(self.button[0], e.target) && e.target !== self.button[0]){
				self.close();
			}
		});

		// deal with form resets.  the problem here is that buttons aren't
		// restored to their defaultValue prop on form reset, and the reset
		// handler fires before the form is actually reset.  delaying it a bit
		// gives the form inputs time to clear.
		$(this.element[0].form).bind('reset.multiselect', function(){
			setTimeout($.proxy(self.refresh, self), 10);
		});
	},

	// set button width
	_setButtonWidth: function(){
		var width = this.element.outerWidth(),
			o = this.options;
			
		if( /\d/.test(o.minWidth) && width < o.minWidth){
			width = o.minWidth;
		}
		
		// set widths
		this.button.width( width );
	},
	
	// set menu width
	_setMenuWidth: function(){
		var m = this.menu,
			width = this.button.outerWidth()-
				parseInt(m.css('padding-left'),10)-
				parseInt(m.css('padding-right'),10)-
				parseInt(m.css('border-right-width'),10)-
				parseInt(m.css('border-left-width'),10);
				
		m.width( width || this.button.outerWidth() );
	},
	
	// move up or down within the menu
	_traverse: function( which, start ){
		var $start = $(start),
			moveToLast = which === 38 || which === 37,
			
			// select the first li that isn't an optgroup label / disabled
			$next = $start.parent()[moveToLast ? 'prevAll' : 'nextAll']('li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)')[ moveToLast ? 'last' : 'first']();
		
		// if at the first/last element
		if( !$next.length ){
			var $container = this.menu.find('ul').last();
			
			// move to the first/last
			this.menu.find('label')[ moveToLast ? 'last' : 'first' ]().trigger('mouseover');
			
			// set scroll position
			$container.scrollTop( moveToLast ? $container.height() : 0 );
			
		} else {
			$next.find('label').trigger('mouseover');
		}
	},

	// This is an internal function to toggle the checked property and
	// other related attributes of a checkbox.
	//
	// The context of this function should be a checkbox; do not proxy it.
	_toggleState: function( prop, flag ){
		return function(){
			if( !this.disabled ) {
				this[ prop ] = flag;
			}

			if( flag ){
				this.setAttribute('aria-selected', true);
			} else {
				this.removeAttribute('aria-selected');
			}
			
			//fengfeng add 20120521 begin   toggle the jquery.jNice.js's checkbox render WebCtrl to make the image checkbox to toggle checked( the image checkbox is <span class="jNiceCheckbox jNiceChecked"></span>)
			var imageCheckbox = $(this).siblings('span .jNiceCheckbox');
			if(imageCheckbox!=undefined ){
				if ($(this).attr('aria-selected')!='true'){
					imageCheckbox.removeClass('jNiceChecked');
				}
				else {
					imageCheckbox.addClass('jNiceChecked');
				}	
			}					
			//fengfeng add 20120521 end   toggle the jquery.jNice.js's checkbox render WebCtrl
		};
	},

	_toggleChecked: function( flag, group ){
		var $inputs = (group && group.length) ?  group : this.inputs,
			self = this;

		// toggle state on inputs
		$inputs.each(this._toggleState('checked', flag));

		// give the first input focus
		$inputs.eq(0).focus();
		
		// update button text
		this.update();
		
		// gather an array of the values that actually changed
		var values = $inputs.map(function(){
			return this.value;
		}).get();

		// toggle state on original option tags
		this.element
			.find('option')
			.each(function(){
				if( !this.disabled && $.inArray(this.value, values) > -1 ){
					self._toggleState('selected', flag).call( this );
				}
			});

		// trigger the change event on the select
		if( $inputs.length ) {
			this.element.trigger("change");
		}
	},

	_toggleDisabled: function( flag ){
		this.button
			.attr({ 'disabled':flag, 'aria-disabled':flag })[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');
		
		var inputs = this.menu.find('input');
		var key = "ech-multiselect-disabled";

		if(flag) {
			// remember which elements this widget disabled (not pre-disabled)
			// elements, so that they can be restored if the widget is re-enabled.
			inputs = inputs.filter(':enabled')
				.data(key, true)
		} else {
			inputs = inputs.filter(function() {
				return $.data(this, key) === true;
			}).removeData(key);
		}

		//fengfeng removed begin 20120521 because it's not use
		inputs
			.attr({ 'disabled':flag, 'arial-disabled':flag });
			//.parent()[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');
		//fengfeng removed end 20120521

		this.element
			.attr({ 'disabled':flag, 'aria-disabled':flag });
	},
	
	// open the menu
	open: function( e ){
		//fengfeng add 20120521 begin   toggle the jquery.jNice.js's checkbox render WebCtrl to make the image checkbox to toggle checked( the image checkbox is <span class="jNiceCheckbox jNiceChecked"></span>)
		var $imageCtrl = $('.ui-multiselect-menu .jNiceCheckbox');
		
		$imageCtrl.unbind('click');//when reopen list menu click event will bind several times, unbind to prevent it
		$imageCtrl.click( function( e ){
				//$this is input , not imageCtrl:<span class="jNiceCheckbox"></span>
				//$(this) is imageCheckbox
				var $this = $(this).siblings(),
					val = this.value,
					checked = this.checked,
					tags = self.element.find('option');
				
				// bail if this input is disabled or the event is cancelled
				var imageCheckbox = $(this);
				if(imageCheckbox!=undefined ){
					val = $this.val();
					var cls=imageCheckbox.attr("class");
					if (cls.indexOf("jNiceChecked")>1){
						//$this.attr('aria-selected','true');
						checked = true;
					}else {
						//$this.attr('aria-selected','false');
						checked = false;
					}
				}
				
				
				//
				if( $this.attr('disabled')=='disabled' || self._trigger('click', e, { value: val, text: $this.attr('title'), checked: checked }) === false ){
					e.preventDefault();				
					//fengfeng add to 瓒呭嚭閫夋嫨鏈�ぇ涓暟鍚庯紝杩斿洖false锛岃繖鏃秙electbox浠嶇劧鐐瑰嚮鍙互缁х画閫夋嫨锛屽疄闄呮病鏈夐�涓紝鍙槸澶栬鍙樹簡锛岃繖閲岃鎭㈠閫変腑鍓嶇殑澶栬
					var imageCheckbox = $(this);
					if(imageCheckbox!=undefined ){
						if ($this.attr('aria-selected')!='true'){
							imageCheckbox.removeClass('jNiceChecked');
							$this[0].checked=false;
							$this.attr('aria-selected','false');
						}
						else {
							//imageCheckbox.addClass('jNiceChecked');
						}		
					}
					return;
				}
				
				// make sure the input has focus. otherwise, the esc key
				// won't close the menu after clicking an item.
				$this.focus();
				
				// toggle aria state
				$this.attr('aria-selected', checked);
				
				// change state on the original option tags
				tags.each(function(){
					if( this.value === val ){
						this.selected = checked;
					} else if( !self.options.multiple ){
						this.selected = false;
					}
				});
				
				// some additional single select-specific logic
				if( !self.options.multiple ){
					self.labels.removeClass('ui-select-state-active');
					$this.closest('label').toggleClass('ui-select-state-active', checked );
					
					// close menu
					self.close();
				}

				// fire change on the select box
				self.element.trigger("change");
				
				// setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
				// http://bugs.jquery.com/ticket/3827 
				setTimeout($.proxy(self.update, self), 10);
				
			});

		var $input = $imageCtrl.siblings();
		$input.each(function(){
			if( $(this).attr('disabled')=='disabled') 
				disableSelBox( $(this).attr('id'));
		
		});
		
		//fengfeng add 20120521 end
		
		var self = this,
			button = this.button,
			menu = this.menu,
			speed = this.speed,
			o = this.options;
		
		// bail if the multiselectopen event returns false, this widget is disabled, or is already open 
		if( this._trigger('beforeopen') === false || button.hasClass('ui-state-disabled') || this._isOpen ){
			return;
		}
		
		var $container = menu.find('ul').last(),
			effect = o.show,
			pos = button.offset();
		
		// figure out opening effects/speeds
		if( $.isArray(o.show) ){
			effect = o.show[0];
			speed = o.show[1] || self.speed;
		}
		
		// set the scroll of the checkbox container
		if(o.scroll&&menu.outerHeight()>o.height){
			$container.scrollTop(0).height(o.height);
		}
		
		// position and show menu
		if( $.ui.position && !$.isEmptyObject(o.position) ){
			o.position.of = o.position.of || button;
			
			menu
				.show()
				.position( o.position )
				.hide()
				.show( effect, speed );
		
		// if position utility is not available...
		} else {
			var offtop = "";
           if(top!=window){
			var win = window;
			do {
				var top1 = $(win.frameElement).offset().top;
				offtop = parseInt(top1 + offtop);
				win = win.parent;
			} while (top != win);  
           }
            //var sctop = $(window.top).scrollTop();
			//var wheight = $(window.top).height();
			var sctop = $(window).scrollTop()+ $(window.top).scrollTop();
			var wheight = $(window).height();
		//	if(pos.top + button.outerHeight()+menu.outerHeight()+offtop>sctop+wheight){
			if(pos.top + button.outerHeight()+menu.outerHeight()>sctop+wheight){
				menu.css({ 
					top: pos.top-menu.outerHeight(),
					left: pos.left
				}).show( effect, speed );
			}else{
				menu.css({ 
					top: pos.top + button.outerHeight(),
					left: pos.left
				}).show( effect, speed );
			}
		
		}
		
		// select the first option
		// triggering both mouseover and mouseover because 1.4.2+ has a bug where triggering mouseover
		// will actually trigger mouseenter.  the mouseenter trigger is there for when it's eventually fixed
		this.labels.eq(0).trigger('mouseover').trigger('mouseenter').find('input').trigger('focus');
		
		button.addClass('ui-select-state-active');
		this._isOpen = true;
		this._trigger('open');
	},
	
	// close the menu
	close: function(){
		if(this._trigger('beforeclose') === false){
			return;
		}
	
		var o = this.options, effect = o.hide, speed = this.speed;
		
		// figure out opening effects/speeds
		if( $.isArray(o.hide) ){
			effect = o.hide[0];
			speed = o.hide[1] || this.speed;
		}
	
		this.menu.hide(effect, speed);
		this.button.removeClass('ui-select-state-active').trigger('blur').trigger('mouseleave');
		this._isOpen = false;
		this._trigger('close');
	},

	enable: function(){
		this._toggleDisabled(false);
	},
	
	disable: function(){
		this._toggleDisabled(true);
	},
	
	checkAll: function( e ){
		this._toggleChecked(true);
		this._trigger('checkAll');
	},
	
	uncheckAll: function(){
		this._toggleChecked(false);
		this._trigger('uncheckAll');
	},
	
	getChecked: function(){
		return this.menu.find('input').filter(':checked');
	},
	
	destroy: function(){
		// remove classes + data
		$.Widget.prototype.destroy.call( this );
		
		this.button.remove();
		this.menu.remove();
		this.element.show();
		
		return this;
	},
	
	isOpen: function(){
		return this._isOpen;
	},
	
	widget: function(){
		return this.menu;
	},

	getButton: function(){
	  return this.button;
  },
	
	// react to option changes after initialization
	_setOption: function( key, value ){
		var menu = this.menu;
		
		switch(key){
			case 'header':
				menu.find('div.ui-multiselect-header')[ value ? 'show' : 'hide' ]();
				break;
			case 'checkAllText':
				menu.find('a.ui-multiselect-all span').eq(-1).text(value);
				break;
			case 'uncheckAllText':
				menu.find('a.ui-multiselect-none span').eq(-1).text(value);
				break;
			case 'height':
				menu.find('ul').last().height( parseInt(value,10) );
				break;
			case 'minWidth':
				this.options[ key ] = parseInt(value,10);
				this._setButtonWidth();
				this._setMenuWidth();
				break;
			case 'selectedText':
			case 'selectedList':
			case 'noneSelectedText':
				this.options[key] = value; // these all needs to update immediately for the update() call
				this.update();
				break;
			case 'classes':
				menu.add(this.button).removeClass(this.options.classes).addClass(value);
				break;
			case 'multiple':
				menu.toggleClass('ui-multiselect-single', !value);
				this.options.multiple = value;
				this.element[0].multiple = value;
				this.refresh();
		}
		
		$.Widget.prototype._setOption.apply( this, arguments );
	}
});

//fengfeng add begin 20120516  chinese l18n
$.extend($.ech.multiselect.prototype.options, {
	checkAllText: '全选',
	uncheckAllText: '清空',
	noneSelectedText: '请选择',
	selectedText: '# 已选择'
});
//fengfeng add end 20120516 
//fengfeng add begin 20120516  include jquery.multiselect.filter.js's content
var rEscape = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;
$.widget("ech.multiselectfilter", {	
	options: {
		label: "Filter:",
		width: null, /* override default width set in css file (px). null will inherit */
		placeholder: "Enter keywords",
		autoReset: false
	},	
	_create: function(){
		var self = this,
			opts = this.options,
			instance = (this.instance = $(this.element).data("multiselect")),
			
			// store header; add filter class so the close/check all/uncheck all links can be positioned correctly
			header = (this.header = instance.menu.find(".ui-multiselect-header").addClass("ui-multiselect-hasfilter")),
			
			// wrapper elem
			wrapper = (this.wrapper = $('<div class="ui-multiselect-filter">'+(opts.label.length ? opts.label : '')+'<input placeholder="'+opts.placeholder+'" type="search"' + (/\d/.test(opts.width) ? 'style="width:'+opts.width+'px"' : '') + ' /></div>').prependTo( this.header ));

		// reference to the actual inputs
		this.inputs = instance.menu.find('input[type="checkbox"], input[type="radio"]');
		
		// build the input box
		this.input = wrapper
		.find("input")
		.bind({
			keydown: function( e ){
				// prevent the enter key from submitting the form / closing the widget
				if( e.which === 13 ){
					e.preventDefault();
				}
			},
			keyup: $.proxy(self._handler, self),
			click: $.proxy(self._handler, self)
		});
		
		// cache input values for searching
		this.updateCache();
		
		// rewrite internal _toggleChecked fn so that when checkAll/uncheckAll is fired,
		// only the currently filtered elements are checked
		instance._toggleChecked = function(flag, group){
			var $inputs = (group && group.length) ?
					group :
					this.labels.find('input'),
				
				_self = this,

				// do not include hidden elems if the menu isn't open.
				selector = self.instance._isOpen ?
					":disabled, :hidden" :
					":disabled";

			$inputs = $inputs.not( selector ).each(this._toggleState('checked', flag));
			
			// update text
			this.update();
			
			// figure out which option tags need to be selected
			var values = $inputs.map(function(){
				return this.value;
			}).get();
			
			// select option tags
			this.element
				.find('option')
				.filter(function(){
					if( !this.disabled && $.inArray(this.value, values) > -1 ){
						_self._toggleState('selected', flag).call( this );
					}
				});
		};
		
		// rebuild cache when multiselect is updated
		var doc = $(document).bind("multiselectrefresh", function(){
			self.updateCache();
			self._handler();
		});

		// automatically reset the widget on close?
		if(this.options.autoReset) {
			doc.bind("multiselectclose", $.proxy(this._reset, this));
		}
	},
	
	// thx for the logic here ben alman
	_handler: function( e ){
		var term = $.trim( this.input[0].value.toLowerCase() ),
		
			// speed up lookups
			rows = this.rows, inputs = this.inputs, cache = this.cache;
		
		if( !term ){
			rows.show();
		} else {
			rows.hide();
			
			var regex = new RegExp(term.replace(rEscape, "\\$&"), 'gi');
			
			this._trigger( "filter", e, $.map(cache, function(v, i){
				if( v.search(regex) !== -1 ){
					rows.eq(i).show();
					return inputs.get(i);
				}
				
				return null;
			}));
		}

		// show/hide optgroups
		this.instance.menu.find(".ui-multiselect-optgroup-label").each(function(){
			var $this = $(this);
			var isVisible = $this.nextUntil('.ui-multiselect-optgroup-label').filter(function(){
			  return $.css(this, "display") !== 'none';
			}).length;
			
			$this[ isVisible ? 'show' : 'hide' ]();
		});
	},

	_reset: function() {
		this.input.val('').trigger('keyup');
	},
	
	updateCache: function(){
		// each list item
		this.rows = this.instance.menu.find(".ui-multiselect-checkboxes li:not(.ui-multiselect-optgroup-label)");
		
		// cache
		this.cache = this.element.children().map(function(){
			var self = $(this);
			
			// account for optgroups
			if( this.tagName.toLowerCase() === "optgroup" ){
				self = self.children();
			}
			
			return self.map(function(){
				return this.innerHTML.toLowerCase();
			}).get();
		}).get();
	},
	
	widget: function(){
		return this.wrapper;
	},
	
	destroy: function(){
		$.Widget.prototype.destroy.call( this );
		this.input.val('').trigger("keyup");
		this.wrapper.remove();
	}
});
//fengfeng add end 20120516 include jquery.multiselect.filter.js's content

	$.alerts = {
		alert: function(message, title, callback) {
			var index=layer.alert(message,'0',title,function(){
				if(callback){
					callback();
				}
				layer.close(index);
			});
		},
		success: function(message, title, callback) {
			layer.msg(message,2,1,callback);
		},
		error: function(message, title, callback) {
			layer.alert(message, 8, title, callback);
		},
		//function(conMsg, conYes, conTit, conNo)
		confirm: function(message, title, callback) {
			layer.confirm(message,function(index){
				if(callback){
					callback(true);
				}
				layer.close(index);
				
			},"提示",function(index){
				if(callback){
					callback(false);
				}
				layer.close(index);
			});
		},
			
		prompt: function(message, value, title, callback) {
			var parms={
				title:value
			}
			var index=layer.prompt(parms,function(val){
				if(callback){
					callback(val);
				}
				layer.close(index);
			});
		}
		
	}
	
	// Shortuct functions
	jAlert = function(message,  callback) {
		$.alerts.alert(message,"提示",  callback);
	};
	jSuccess = function(message ,callback) {
		$.alerts.success(message,"",  callback);
	};
	jError = function(message,  callback) {
		$.alerts.error(message, "错误", callback);
	};
	
	jConfirm = function(message, callback) {
		$.alerts.confirm(message,"",callback)
	};
	jPrompt = function(message, value, callback) {
		$.alerts.prompt(message, value,"", callback);
	};
})(jQuery);

/*针对radio和checkbox的---已失控方法开始*/
//只要input的value值符合selArrayVal数组枚举的值，会被选中
//selArrayVal:要初始化选中的input的value数组。如果groupName不传，页面内全局范围内的初始化赋值，不分组，页内所有同value的input都会被选中
//groupName:即input的name属性   同name的为一组，不必须，如果传了，只查找该group内部的单选和复选，使其被选中。用于整个页面内不同组但存在value值相同的选择框，这样可以多次调用该方法，传入不同的组号，进行分别初始化。单选和复选都收该组号约束。
function setSel(selArrayVal,groupName){
	var selector;
	if(groupName===undefined) 
		selector='input:checkbox,input:radio';
	else 
		selector='input:checkbox[name='+groupName+'],input:radio[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		var i=0;
		for(i;i<selArrayVal.length;i++){
			if (inputCtrl.val()==selArrayVal[i]) { 
				if(inputCtrl.attr('type')=='radio'){
					$('input:radio[name="'+ inputCtrl.attr("name") +'"]').each(function(){
						$(this).attr('checked',false).siblings('.jNiceRadio').removeClass('jNiceChecked');
						this.checked = false;
					});

				}
				this.checked = true;
				imageCtrl.addClass('jNiceChecked');
			} 				
		}
	}
	);

}; 
//设置不选中状态，用法同setSel
function setUnSel(selArrayVal,groupName){
	var selector;
	if(groupName===undefined) 
		selector='input:checkbox,input:radio';
	else 
		selector='input:checkbox[name='+groupName+'],input:radio[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		var i=0;
		for(i;i<selArrayVal.length;i++){
			if (inputCtrl.val()==selArrayVal[i]) { 
				this.checked = false;
				imageCtrl.removeClass('jNiceChecked');
			} 				
		}
	}
	);

};
//设置不选中状态 all
function setUnAll(groupName){
	var selector;
	if(groupName===undefined) 
		selector='input:checkbox,input:radio';
	else 
		selector='input:checkbox[name='+groupName+'],input:radio[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		this.checked = false;
		imageCtrl.removeClass('jNiceChecked');
	}
	);

};
//设置某选项启用
function enableSelBox(inputId){
	$('#'+inputId).each(function() {
		if($(this).attr("disable")!="disable"){
			return;
		};
		var inputDom = this;
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		imageCtrl.css('opacity','1');
		this.disable = false;
		//imageCtrl.removeClass('jNiceChecked');
			/* Click Handler */
		imageCtrl.click(function(){
				if(inputCtrl.attr('type')=='radio'){
					/* uncheck all others of same name */
					$('input:radio[name="'+ inputCtrl.attr('name') +'"]').each(function(){
						$(this).attr('checked',false).siblings('.jNiceRadio').removeClass('jNiceChecked');
						this.checked = false;
					});
					inputDom.checked=true;
					imageCtrl.addClass('jNiceChecked');
				}else{
					
					if (inputDom.checked===true){
						inputDom.checked = false;
						imageCtrl.removeClass('jNiceChecked');
					}
					else {
						inputDom.checked = true;
						imageCtrl.addClass('jNiceChecked');
					}
				}
				$(this).siblings().trigger("onchange");

					return false;
			});
			
			
		}
	);

};
//设置某选项禁用
function disableSelBox(inputId){
	$('#'+inputId).each(function() { 
		var inputDom = this;
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		$(this).attr("disable","disable");
		//imageCtrl.removeClass('jNiceChecked');
			/* unbind Click Handler */
		imageCtrl.unbind('click');	
		imageCtrl.css('opacity','0.3');
		}
	);

};
//单选，多选选中方法
function checkAll(groupName) { 
	var selector ='input:checkbox[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		this.checked = true;
		imageCtrl.addClass('jNiceChecked');
	});
}
//单选，多选取消选中方法
function clearAll(groupName) { 
	var selector ='input:checkbox[name='+groupName+']';
	$(selector).each(function() { 
		var inputCtrl = $(this);
		var imageCtrl = inputCtrl.siblings();
		this.checked = false;
		imageCtrl.removeClass('jNiceChecked');
	});
}
/*针对radio和checkbox的---已失控方法结束*/
/**
 * SUBMODAL v1.4
 * Used for displaying DHTML only popups instead of using buggy modal windows.
 *
 * By Seth Banks (webmaster at subimage dot com)
 * http://www.subimage.com/
 *
 * Contributions by:
 * 	Eric Angel - tab index code
 * 	Scott - hiding/showing selects for IE users
 *	Todd Huss - inserting modal dynamically and anchor classes
 *
 * Up to date code can be found at http://www.subimage.com/dhtml/subModal
 * 
 *
 * This code is free for you to use anywhere, just keep this comment block.
 */
// Popup code
var gPopupMask = null;
var gPopupContainer = null;
var gPopFrame = null;
var gShadowBox = null;
var gReturnFunc;
var gCloseReturn;
var gPopupIsShown = false;
var gHideSelects = false;
var gpopBodyBox = null;
var gTitleName = "&nbsp;";
var gDefaultLogin = "";//loading.html
var gTabIndexes = new Array();
// Pre-defined list of tags we want to disable/enable tabbing into
var gTabbableTags = new Array("A","BUTTON","TEXTAREA","INPUT","IFRAME");	

// If using Mozilla or Firefox, use Tab-key trap.
if (!document.all) {
	document.onkeypress = keyDownHandler;
}
/**
 * Initializes popup code on load.	
 */
var bIE = false;
function initPopUp() {
//	var ua = navigator.userAgent.toLowerCase();  
//	var s;  
//	if(s = ua.match(/msie ([\d.]+)/)) 	bIE=true;

	// Add the HTML to the body
	theBody = document.getElementsByTagName('BODY')[0];
	popmask = document.createElement('div');
	popmask.id = 'popupMask';
	popcont = document.createElement('div');
	popcont.id = 'popupContainer';
	try{
		popcont.style='position: relative;clear: both;';//除ie7以外  ie8、9   safria  chrome Firefox 都支持
	}catch(err){
		popcont.setAttribute('style','position: relative;clear: both;');//ie7支持
	}
	popcont.innerHTML = '' +
        '<DIV class="x-window x-window-plain x-window-dlg" id="ext-comp-1001" style="DISPLAY: block; Z-INDEX: 9003;  VISIBILITY: visible;WIDTH: 300px; POSITION: absolute; TOP: 116px;LEFT: 354px;">'+
            '<DIV class="x-window-tl">'+
                '<DIV class="x-window-tr">'+
                    '<DIV class="x-window-tc">'+
                        '<DIV class="x-window-header x-unselectable x-window-draggable" id="ext-gen15" style="MozUserSelect: none; KhtmlUserSelect: none" unselectable="on" >'+
                            '<DIV class="x-tool x-tool-close " id="ext-gen59" onclick="hidePopWin(false);" style="DISPLAY: block">'+
                                '&nbsp;'+
                            '</DIV>'+
                            '<SPAN class="x-window-header-text" id="x-window-title">'+
                                'Address'+
                            '</SPAN>'+
                        '</DIV>'+
                    '</DIV>'+
                '</DIV>'+
            '</DIV>'+
            '<DIV class="x-window-bwrap" id="ext-gen16">'+
                '<DIV class="x-window-ml">'+
                    '<DIV class="x-window-mr">'+
                        '<DIV class="x-window-mc">'+
'<!-- Start-->'+
		'<div id="popBodyBox">'+
		'</div>'+
'<!-- End-->'+
                        '</DIV>'+
                    '</DIV>'+
                '</DIV>'+
                '<DIV class="x-window-bl">'+
                    '<DIV class="x-window-br">'+
                        '<DIV class="x-window-bc">'+
                            '<DIV class="x-window-footer" id="ext-gen18"></DIV>'+
                        '</DIV>'+
                    '</DIV>'+
                '</DIV>'+
            '</DIV>'+
        '</DIV>';
		
	theBody.appendChild(popmask);
	//theBody.appendChild(popcont);
	var maskchild  = document.createElement('div');
	maskchild.id = 'maskid';

	popmask.appendChild(maskchild);
	maskchild.appendChild(popcont);
	
	gPopupMask = document.getElementById("popupMask");
	gPopupContainer = document.getElementById("ext-comp-1001");
	gShadowBox = document.getElementById("ShadowBox");	
	
	gpopBodyBox= document.getElementById("popBodyBox");	
	
	// check to see if this is IE version 6 or lower. hide select boxes if so
	// maybe they'll fix this in version 7?
	var brsVersion = parseInt(window.navigator.appVersion.charAt(0), 10);
	if (brsVersion <= 6 && window.navigator.userAgent.indexOf("MSIE") > -1) {
		gHideSelects = true;
	}
	gPopupContainer.style.display = "none";
	// Add onclick handlers to 'a' elements of class submodal or submodal-width-heigh
	
//	 if( element.attachEvent ){
//
//		    //为IE以及IE内核的浏览器（1）
//
//		   }else if( element.addEventListener){
//
//		     //为FF以及NS内核的浏览器（2）
//
//		   }
		draggable(document.getElementById('ext-comp-1001'));
}

//setting input param
function setInParam(inParam) {
	gPopFrame.inParam = inParam;
}
 /**
	* @argument width - int in pixels
	* @argument height - int in pixels
	* @argument url - url to display
	* @argument returnFunc - function to call when returning true from the window.
	* @argument showCloseBox - show the close box - default true
	*/

function showPopWin(Title,url, width, height, returnFunc, showCloseBox,showScrolling,closeReturn) {
	$(".help").blur();
	//动态插入iframe
	var scrolling = "auto";	
	//modify by zhaowj 优化帮助框内存
	if(!document.getElementById("popupFrame")){
		var iframestring = '<iframe  style="width:100%;height:100%;background-color:transparent;" scrolling="'+scrolling+'" frameborder="0" allowtransparency="true" id="popupFrame" name="popupFrame" width="100%" height="100%"></iframe>';
		gpopBodyBox.innerHTML = iframestring;
		gPopFrame = document.getElementById("popupFrame");
		width = width;    	
	}	
	// show or hide the window close widget
	document.getElementById("x-window-title").innerHTML = Title;  //放在判断外面解决了通用帮助无法命名的问题
	if (showCloseBox == null || showCloseBox == true) {
		document.getElementById("ext-gen59").style.display = "block";
	} else {
		document.getElementById("ext-gen59").style.display = "none";
	}
	gPopupIsShown = true;
	disableTabIndexes();
	gPopupMask.style.display = "block";
	gPopupContainer.style.display = "block";
	
	centerPopWin(width, height);

	gPopupContainer.style.width = width + "px";
	gPopFrame.style.height = height+"px";

	setMaskSize();
	
	gPopFrame.src = url;
	
	gReturnFunc = returnFunc;
	gCloseReturn = closeReturn;
	// for IE
	if (gHideSelects == true) {
		hideSelectBoxes();
	}
			
	window.setTimeout("setPopTitle();", 600);
}

//
var gi = 0;
function centerPopWin(width, height) {
	if (gPopupIsShown == true) {
		if (width == null || isNaN(width)) {
			width = gPopupContainer.offsetWidth;
		}
		if (height == null) {
			height = gPopupContainer.offsetHeight;
		}
		
		//var theBody = document.documentElement;
		var theBody = document.getElementsByTagName("BODY")[0];
		theBody.style.overflow = "hidden";
		
		var scTop = parseInt(theBody.scrollTop,10);
		var scLeft = parseInt(theBody.scrollLeft,10);
		gPopupMask.style.top = 0 + "px";
		gPopupMask.style.left = 0 + "px";
		setMaskSize();
		
		//fengfeng remove  begin
		//var fullHeight = getViewportHeight();
		//var fullWidth = getViewportWidth();
		
		//gPopupContainer.style.top = (scTop + ((fullHeight - (height)) / 2)) + "px";
		//gPopupContainer.style.left =  (scLeft + ((fullWidth - width) / 2)) + "px";
		//fengfeng remove  end
		
		//fengfeng add begin 因为上面remove的计算不对，是bug，在同浏览器下弹窗并不总是居中
		if (document.compatMode == "BackCompat") {
       // cWidth = document.body.clientWidth;
       // cHeight = document.body.clientHeight;
       // sWidth = document.body.scrollWidth;
       // sHeight = document.body.scrollHeight;
       // sLeft = document.body.scrollLeft;
        //sTop = document.body.scrollTop;
			gPopupContainer.style.top =  ((document.body.clientHeight-height) / 2)+ "px";
			gPopupContainer.style.left =  ((document.body.clientWidth-width) / 2) + "px";
		} else { //document.compatMode == \"CSS1Compat\"        //默认的兼容模式
       // cWidth = document.documentElement.clientWidth;
        //cHeight = document.documentElement.clientHeight;
       // sWidth = document.documentElement.scrollWidth;
       // sHeight = document.documentElement.scrollHeight;
       		var sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
        	var sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
//        	if (window.navigator.appName == "Microsoft Internet Explorer" && document.documentMode && document.documentMode==8){ // IE8
//        	       gPopupContainer.style.top = (sTop + ((document.documentElement.clientHeight-height) / 2)) -document.body.clientHeight + "px"; 
//        	        }else  
        	gPopupContainer.style.top =  ((document.documentElement.clientHeight-height) / 2-20) + "px";		
			gPopupContainer.style.left =  ((document.documentElement.clientWidth-width) / 2) + "px";
		}
		//fengfeng add end		
	}
}
//addEvent(window, "resize", centerPopWin);

window.onscroll = centerPopWin;

/**
 * Sets the size of the popup mask.
 *
 */
function setMaskSize() {
	var theBody = document.getElementsByTagName("BODY")[0];
			
	var fullHeight = getViewportHeight();
	var fullWidth = getViewportWidth();
	
	// Determine what's bigger, scrollHeight or fullHeight / width
	if (fullHeight > theBody.scrollHeight) {
		popHeight = fullHeight;
	} else {
		popHeight = theBody.scrollHeight;
	}
	
	if (fullWidth > theBody.scrollWidth) {
		popWidth = fullWidth;
	} else {
		popWidth = theBody.scrollWidth;
	}
	gPopupMask.style.height = popHeight + "px";
	gPopupMask.style.width = popWidth + "px";
	
}

/**
 * @argument callReturnFunc - bool - determines if we call the return function specified
 * @argument returnVal - anything - return value 
 */
function hidePopWin(callReturnFunc) {
	gPopupIsShown = false;
	var theBody = document.getElementsByTagName("BODY")[0];
	theBody.style.overflow = "";
	restoreTabIndexes();
	if (gPopupMask == null) {
		return;
	}
	gPopupMask.style.display = "none";
	gPopupContainer.style.display = "none";
	if (callReturnFunc == true && gReturnFunc != null) {
		if(window.frames["popupFrame"].returnVal == undefined )
			gReturnFunc(window.document.getElementById("popupFrame").contentWindow.returnVal);//回调  原页面  兼容火狐
		else 
			gReturnFunc(window.frames["popupFrame"].returnVal);//回调  原页面  除火狐外都支持
			
	}
	if(callReturnFunc == false && gCloseReturn != null){
		gCloseReturn();
		
	}
	if(gPopFrame){
		gPopFrame.src = gDefaultLogin;
		giframe = gPopFrame.contentWindow;
		try{
			giframe.document.write('');
	    }catch(e){};
	
	}
	// display all select boxes
	if (gHideSelects == true) {
		displaySelectBoxes();
	}
}

/**
 * Sets the popup title based on the title of the html document it contains.
 * Uses a timeout to keep checking until the title is valid.
 */
function setPopTitle() {
	return;
	if (window.frames["popupFrame"].document.title == null) {
		window.setTimeout("setPopTitle();", 10);
	} else {
		document.getElementById("popupTitle").innerHTML = window.frames["popupFrame"].document.title;
	}
}

// Tab key trap. iff popup is shown and key was [TAB], suppress it.
// @argument e - event - keyboard event that caused this function to be called.
function keyDownHandler(e) {
    if (gPopupIsShown && e.keyCode == 9)  return false;
}

// For IE.  Go through predefined tags and disable tabbing into them.
function disableTabIndexes() {
	if (document.all) {
		var i = 0;
		for (var j = 0; j < gTabbableTags.length; j++) {
			var tagElements = document.getElementsByTagName(gTabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				gTabIndexes[i] = tagElements[k].tabIndex;
				tagElements[k].tabIndex="-1";
				i++;
			}
		}
	}
}

// For IE. Restore tab-indexes.
function restoreTabIndexes() {
	if (document.all) {
		var i = 0;
		for (var j = 0; j < gTabbableTags.length; j++) {
			var tagElements = document.getElementsByTagName(gTabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				tagElements[k].tabIndex = gTabIndexes[i];
				tagElements[k].tabEnabled = true;
				i++;
			}
		}
	}
}


/**
* Hides all drop down form select boxes on the screen so they do not appear above the mask layer.
* IE has a problem with wanted select form tags to always be the topmost z-index or layer
*
* Thanks for the code Scott!
*/
function hideSelectBoxes() {
	for(var i = 0; i < document.forms.length; i++) {
		for(var e = 0; e < document.forms[i].length; e++){
			if(document.forms[i].elements[e].tagName == "SELECT") {
				document.forms[i].elements[e].style.visibility="hidden";
			}
		}
	}
}

/**
* Makes all drop down form select boxes on the screen visible so they do not reappear after the dialog is closed.
* IE has a problem with wanted select form tags to always be the topmost z-index or layer
*/
function displaySelectBoxes() {
	for(var i = 0; i < document.forms.length; i++) {
		for(var e = 0; e < document.forms[i].length; e++){
			if(document.forms[i].elements[e].tagName == "SELECT") {
			document.forms[i].elements[e].style.visibility="visible";
			}
		}
	}
}


//非ie内核拖动操作
function addListener(element, type, callback, capture) {
    if (element.addEventListener) {
        element.addEventListener(type, callback, capture);
    } else {
        element.attachEvent("on" + type, callback);
    }
}
function draggable(element) {
//	if (window.navigator.appName == "Microsoft Internet Explorer" && document.documentMode && document.documentMode==8){  
//		return;
//	}
    var dragging = null;

    addListener(element, "mousedown", function(e) {
        var e = window.event || e;
        dragging = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            startX: parseInt(element.style.left),
            startY: parseInt(element.style.top)
        };
        if (element.setCapture) element.setCapture(); 
    });
   
    addListener(element, "losecapture", function() {
        dragging = null;
        if (element.releaseCapture) element.releaseCapture(); 
    });

    addListener(document, "mouseup", function() {
        dragging = null;
        if (element.releaseCapture) element.releaseCapture(); 
    }, true);

    var dragTarget = element.setCapture ? element : document;
    
    addListener(dragTarget, "mousemove", function(e) {
        if (!dragging) return;
    
        var e = window.event || e;
        var top = dragging.startY + (e.clientY - dragging.mouseY);
        var left = dragging.startX + (e.clientX - dragging.mouseX);
    
        element.style.top = (Math.max(0, top)) + "px";
        element.style.left = (Math.max(0, left)) + "px";
    }, true); 
};
//拖拽 end


//common.js的内容
/**
 * COMMON DHTML FUNCTIONS
 * These are handy functions I use all the time.
 *
 * By Seth Banks (webmaster at subimage dot com)
 * http://www.subimage.com/
 *
 * Up to date code can be found at http://www.subimage.com/dhtml/
 *
 * This code is free for you to use anywhere, just keep this comment block.
 */

/**
 * X-browser event handler attachment and detachment
 * TH: Switched first true to false per http://www.onlinetools.org/articles/unobtrusivejavascript/chapter4.html
 *
 * @argument obj - the object to attach event to
 * @argument evType - name of the event - DONT ADD "on", pass only "mouseover", etc
 * @argument fn - function to call
 */
function addEvent(obj, evType, fn){
 if (obj.addEventListener){
    obj.addEventListener(evType, fn, false);
    return true;
 } else if (obj.attachEvent){
    var r = obj.attachEvent("on"+evType, fn);
    return r;
 } else {
    return false;
 }
}
function removeEvent(obj, evType, fn, useCapture){
  if (obj.removeEventListener){
    obj.removeEventListener(evType, fn, useCapture);
    return true;
  } else if (obj.detachEvent){
    var r = obj.detachEvent("on"+evType, fn);
    return r;
  } else {
    alert("Handler could not be removed");
  }
}

/**
 * Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
 *
 * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
 *
 * Gets the full width/height because it's different for most browsers.
 */
function getViewportHeight() {
	if (window.innerHeight!=window.undefined) return window.innerHeight;
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight; 
	return window.undefined; 
}
function getViewportWidth() {
	if (window.innerWidth!=window.undefined) return window.innerWidth; 
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth; 
	if (document.body) return document.body.clientWidth; 
	return window.undefined; 
}

//begin loading ctrl
function showLoading(objId)
{
	 
		var img = $("#"+objId+" img");
		var parentObj=$("#"+objId);
		
 		if(img.length==0){
			$("#"+objId).append('<a   href= "#a " class ="loadingImg"  style="border: 0px none; position: absolute; top: '+(parentObj.offset().top+parentObj.height()/2-16)+'px; left: '+(parentObj.offset().left+parentObj.width()/2-16)+'px; background-color:transparent; width: 32px; height: 32px; z-index: 1001; " />');
			//遮盖层
			$("#"+objId).append('<div   style="border: 0px none; position: absolute; top: '+parentObj.offset().top+'px; left: '+parentObj.offset().left+'px; background-color:transparent; width: '+parentObj.width()+'px; height:'+parentObj.height()+'px; z-index: 1000; ">');
 		}	
	 
}
//detachloading img
function detachLoading(objId)
{
	var img = $("#"+objId+" a");
	var div = $("#"+objId+" div");
	if(img.length>0)
		{
		img.detach();
		div.detach();
		}
		
}
//end loading ctrl


//multiselect 动态赋值。
function refreshMultiselected(el,value){
	if(value != undefined || value != null) {
		value=value.split(',');
	var opt = el.find("option").each(function(index,element)
          { 
				var v = $(element); 
				for(var i=0;i<value.length;i++)
					if(v.val()==value[i]){
						v.attr('selected','selected');
					}
          }
  );
	el.multiselect('refresh');
	}
}

//整型验证
function isInt(str) {
    if (str == "")
        return true;
    if (/^(\-?)(\d+)$/.test(str))
        return true;
    else
        return false;
}
$(document).ready(function(){
//begin moreQueryCase area open or close
	var moreQueryCaseIconState='open';//open or close default:open
	var heightOfQueryTableContainer;
	$moreQueryCaseIcon = $("a[class^='moreQueryCaseIcon']");
	var tagState = $moreQueryCaseIcon.attr('state');
	if(tagState=='close')  moreQueryCaseIconState = 'close';
	var trNumVisableWhenClose = 0;   //默认展开的行数
	var tagNum = $moreQueryCaseIcon.attr('trNumVisableWhenClose');
	if(tagNum != null && tagNum!=undefined ){
	    if (isInt(tagNum) && tagNum>=0)
	    {
	    	trNumVisableWhenClose = tagNum;
	    }
	}
	var trTotalNum = $(".queryTable tr").length;
	if(trNumVisableWhenClose>=trTotalNum){
		var $iconDiv = $moreQueryCaseIcon.parent();
		if($iconDiv!=null && $iconDiv!=undefined)
			$moreQueryCaseIcon.parent().remove();
		else
			$moreQueryCaseIcon.remove();
		return;
	}
		
	var s = trNumVisableWhenClose-1;
	if(s<0) s=".queryTable tr";
	else s=".queryTable tr:gt("+s+")";
	
//	var $moreQueryCaseIconContainerHeight= $(".moreQueryCaseIconContainer").height();
	
	var queryTableContain=$(".queryTableContainer");
	var heightTr=0;
	for(var j=0;j<tagNum;j++){
		heightTr=heightTr+parseInt($(".queryTable tbody tr",queryTableContain).eq(j).height());
	};
	if(moreQueryCaseIconState!='open'){
		heightOfQueryTableContainer = queryTableContain.height();
		//var heightTr = trNumVisableWhenClose/trTotalNum*(heightOfQueryTableContainer);
		$(".queryTableContainer").height(heightTr);
		//$(s).css("display","none");//gt(n)第n行之后的所有行  s=".queryTable tr:gt(n)";
		$moreQueryCaseIcon.attr("class","moreQueryCaseIconClose");
		moreQueryCaseIconState='close';
	}else{
		$(".queryTableContainer").height(heightOfQueryTableContainer);
		$(".queryTable tr:visible").css("display","table-row");
		$moreQueryCaseIcon.attr("class","moreQueryCaseIconOpen");
		moreQueryCaseIconState='open';
	}
	
	function funHide(){
		var speed=5;
		var heightOfQueryTableContainer = parseInt($(".queryTableContainer").height())-1;
		var heightTr = trNumVisableWhenClose/trTotalNum*heightOfQueryTableContainer;
		var ypos=parseInt(heightOfQueryTableContainer);
		ypos -= (ypos-1)/speed;
		
		if(ypos <= heightTr){
			clearTimeout(hideTimer);
			return;
		}
		$(".queryTableContainer").height(ypos);
		var hideTimer = setTimeout("funHide()",5);
	}

	function funShow(){
		var speed=5;
		var heightOfQueryTableContainer = parseInt($(".queryTableContainer").height())-1;
		var heightTr = trNumVisableWhenClose/trTotalNum*heightOfQueryTableContainer;
		var ypos = parseInt(heightTr);
		ypos += speed;
		if(ypos > heightOfQueryTableContainer){
			clearTimeout(hideTimer);
			return;
		}
		$(".queryTableContainer").height(ypos);
		var hideTimer = setTimeout("funShow()",5);
	}	
	$moreQueryCaseIcon.click(
			function(){
				if(moreQueryCaseIconState=='open'){
					heightOfQueryTableContainer = $(".queryTableContainer").height();
					//var heightTr = trNumVisableWhenClose/trTotalNum*(heightOfQueryTableContainer);
					$(".queryTableContainer").height(heightTr);
					
					//$(s).css("display","none");//gt(n)第n行之后的所有行  s=".queryTable tr:gt(n)";
					//funHide();
					$(this).attr("class","moreQueryCaseIconClose");
					moreQueryCaseIconState='close';
				}else{
					$(".queryTableContainer").height(heightOfQueryTableContainer);
					//funShow();
					$(".queryTable tr:visible").css("display","table-row");
					
					$(this).attr("class","moreQueryCaseIconOpen");
					moreQueryCaseIconState='open';
				}			
			}
	);
//end moreQueryCase area open or close
}); 

;(function($) {
	
	$.fn.extend({
		autocomplete: function(urlOrData, options) {
			var isUrl = typeof urlOrData == "string";
			options = $.extend({}, $.Autocompleter.defaults, {
				url: isUrl ? urlOrData : null,
				data: isUrl ? null : urlOrData,
				delay: isUrl ? $.Autocompleter.defaults.delay : 10,
				max: options && !options.scroll ? 10 : 150
			}, options);
			
			// if highlight is set to false, replace it with a do-nothing function
			options.highlight = options.highlight || function(value) { return value; };
			
			// if the formatMatch option is not specified, then use formatItem for backwards compatibility
			options.formatMatch = options.formatMatch || options.formatItem;
			
			options.parse=isUrl?options.parse:null;

			return this.each(function() {
				new $.Autocompleter(this, options);
			});
		},
		result: function(handler) {
			return this.bind("result", handler);
		},
		search: function(handler) {
			return this.trigger("search", [handler]);
		},
		flushCache: function() {
			return this.trigger("flushCache");
		},
		setOptions: function(options){
			return this.trigger("setOptions", [options]);
		},
		unautocomplete: function() {
			return this.trigger("unautocomplete");
		}
	});

	$.Autocompleter = function(input, options) {

		var KEY = {
			UP: 38,
			DOWN: 40,
			DEL: 46,
			TAB: 9,
			RETURN: 13,
			ESC: 27,
			COMMA: 188,
			PAGEUP: 33,
			PAGEDOWN: 34,
			BACKSPACE: 8
		};

		// Create $ object for input element
		var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

		var timeout;
		var previousValue = "";
		var hasFocus = 0;
		var lastKeyPressCode;
		var config = {
			mouseDownOnSelect: false
		};
		var select = $.Autocompleter.Select(options, input, selectCurrent, config);
		
		var blockSubmit;
		
		var multiResult=[];
		
		// prevent form submit in opera when selecting with return key
		$.browser.opera && $(input.form).bind("submit.autocomplete", function() {
			if (blockSubmit) {
				blockSubmit = false;
				return false;
			}
		});
		
		// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
		$input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) {
			// a keypress means the input has focus
			// avoids issue where input had focus before the autocomplete was applied
			hasFocus = 1;
			// track last key pressed
			lastKeyPressCode = event.keyCode;
			switch(event.keyCode) {
			
				case KEY.UP:
					event.preventDefault();
					if ( select.visible() ) {
						select.prev();
					} else {
						onChange(0, true);
					}
					break;
					
				case KEY.DOWN:
					event.preventDefault();
					if ( select.visible() ) {
						select.next();
					} else {
						onChange(0, true);
					}
					break;
					
				case KEY.PAGEUP:
					event.preventDefault();
					if ( select.visible() ) {
						select.pageUp();
					} else {
						onChange(0, true);
					}
					break;
					
				case KEY.PAGEDOWN:
					event.preventDefault();
					if ( select.visible() ) {
						select.pageDown();
					} else {
						onChange(0, true);
					}
					break;
				
				// matches also semicolon
				case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
				case KEY.TAB:
				case KEY.RETURN:
				 /*	注释掉回车事件
				  * if( selectCurrent() ) {
						// stop default to prevent a form submit, Opera needs special handling
						event.preventDefault();
						blockSubmit = true;
						return false;
					} */
					break;
					
				case KEY.ESC:
					select.hide();
					break;
					
				default:
					clearTimeout(timeout);
					timeout = setTimeout(onChange, options.delay);
					break;
			}
		}).focus(function(){
			// track whether the field has focus, we shouldn't process any
			// results if the field no longer has focus
			hasFocus++;
		}).blur(function() {
			hasFocus = 0;
			if (!config.mouseDownOnSelect) {
				hideResults();
			}
		}).click(function() {
			// show select when clicking in a focused field
			if ( hasFocus++ > 1 && !select.visible() ) {
				onChange(0, true);
			}
		}).bind("search", function() {
			// TODO why not just specifying both arguments?
			var fn = (arguments.length > 1) ? arguments[1] : null;
			function findValueCallback(q, data) {
				var result;
				if( data && data.length ) {
					for (var i=0; i < data.length; i++) {
						if( data[i].result.toLowerCase() == q.toLowerCase() ) {
							result = data[i];
							break;
						}
					}
				}
				if( typeof fn == "function" ) fn(result);
				else $input.trigger("result", result && [result.data, result.value]);
			}
			$.each(trimWords($input.val()), function(i, value) {
				request(value, findValueCallback, findValueCallback);
			});
		}).bind("setOptions", function() {
			$.extend(options, arguments[1]);
		}).bind("unautocomplete", function() {
			select.unbind();
			$input.unbind();
			$(input.form).unbind(".autocomplete");
		});
		
		
		var inputName=$input.attr("name");
		$(".ac-ok-"+inputName).live("click",function(){
			hideResultsNow();
			$input.trigger("result", [multiResult]);
		})
		$(".ac-close-"+inputName).live("click",function(){
			hideResultsNow();
		})
		
		
		function selectCurrent(index) {
			var selected = select.selected();
			if( !selected )
				return false;
			
			var v = selected.result;
			previousValue = v;
			
			if ( options.multiple ) {
				var words = trimWords($input.val());
				if ( words.length > 1 ) {
					var seperator = options.multipleSeparator.length;
					var cursorAt = $(input).selection().start;
					var wordAt, progress = 0;
					$.each(words, function(i, word) {
						progress += word.length;
						if (cursorAt <= progress) {
							wordAt = i;
							return false;
						}
						progress += seperator;
					});
					words[wordAt] = v;
					// TODO this should set the cursor to the right position, but it gets overriden somewhere
					//$.Autocompleter.Selection(input, progress + seperator, progress + seperator);
					v = words.join( options.multipleSeparator );
				}
				v += options.multipleSeparator;
			}
			if(options.multiSelect){
				multiResult=selected;
			}else{
				hideResultsNow();
				$input.trigger("result", [selected.data]);
			}
			
			return true;
		}
		
		function onChange(crap, skipPrevCheck) {
			multiResult=[];
			
			if( lastKeyPressCode == KEY.DEL ) {
				select.hide();
				return;
			}
			
			var currentValue = $input.val();
			
			if ( !skipPrevCheck && currentValue == previousValue )
				return;
			
			previousValue = currentValue;
			
			currentValue = lastWord(currentValue);
			if ( currentValue.length >= options.minChars) {
				$input.addClass(options.loadingClass);
				if (!options.matchCase)
					currentValue = currentValue.toLowerCase();
				request(currentValue, receiveData, hideResultsNow);
			} else {
				stopLoading();
				select.hide();
			}
		};
		
		function trimWords(value) {
			if (!value)
				return [""];
			if (!options.multiple)
				return [$.trim(value)];
			return $.map(value.split(options.multipleSeparator), function(word) {
				return $.trim(value).length ? $.trim(word) : null;
			});
		}
		
		function lastWord(value) {
			if ( !options.multiple )
				return value;
			var words = trimWords(value);
			if (words.length == 1) 
				return words[0];
			var cursorAt = $(input).selection().start;
			if (cursorAt == value.length) {
				words = trimWords(value)
			} else {
				words = trimWords(value.replace(value.substring(cursorAt), ""));
			}
			return words[words.length - 1];
		}
		
		// fills in the input box w/the first match (assumed to be the best match)
		// q: the term entered
		// sValue: the first matching result
		function autoFill(q, sValue){
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			// if the last user key pressed was backspace, don't autofill
			if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
				// fill in the value (keep the case the user has typed)
				$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
				// select the portion of the value not typed by the user (so the next character will erase)
				$(input).selection(previousValue.length, previousValue.length + sValue.length);
			}
		};

		function hideResults() {
			clearTimeout(timeout);
			timeout = setTimeout(hideResultsNow, 200);
		};

		function hideResultsNow() {
			var wasVisible = select.visible();
			select.hide();
			clearTimeout(timeout);
			stopLoading();
			if (options.mustMatch) {
				// call search and run callback
				$input.search(
					function (result){
						// if no value found, clear the input box
						if( !result ) {
							if (options.multiple) {
								var words = trimWords($input.val()).slice(0, -1);
								$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
							}
							else {
								$input.val( "" );
								$input.trigger("result", null);
							}
						}
					}
				);
			}
		};

		function receiveData(q, data) {
			if ( data && data.length && hasFocus ) {
				stopLoading();
				select.display(data, q);
				autoFill(q, data[0].value);
				select.show();
			} else {
				hideResultsNow();
			}
		};

		function request(term, success, failure) {
			if (!options.matchCase){
				term = term.toLowerCase();
			}
			if((typeof options.url == "string") && (options.url.length > 0) ){
				
				var extraParams = {
					timestamp: +new Date()
				};
				$.each(options.extraParams, function(key, param) {
					extraParams[key] = typeof param == "function" ? param() : param;
				});
				
				$.ajax({
					// try to leverage ajaxQueue plugin to abort previous requests
					mode: "abort",
					// limit abortion to this input
					port: "autocomplete" + input.name,
					dataType: options.dataType,
					url: options.url,
					data: $.extend({
						q: encodeURI(lastWord(term)),
						limit: options.max
					}, extraParams),
					success: function(data) {
						var parsed = options.parse && options.parse(data) || parse(data);
						success(term, parsed);
					}
				});
			} else {
				// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
				select.emptyList();
				failure(term);
			}
		};
		
		function parse(data) {
			var parsed = [];
			var rows = data.split("\n");
			for (var i=0; i < rows.length; i++) {
				var row = $.trim(rows[i]);
				if (row) {
					row = row.split("|");
					parsed[parsed.length] = {
						data: row,
						value: row[0],
						result: options.formatResult && options.formatResult(row, row[0]) || row[0]
					};
				}
			}
			return parsed;
		};

		function stopLoading() {
			$input.removeClass(options.loadingClass);
		};

	};

	$.Autocompleter.defaults = {
		inputClass: "ac_input",
		resultsClass: "ac_results",
		loadingClass: "ac_loading",
		minChars: 1,
		delay: 400,
		matchCase: false,
		matchSubset: false,
		matchContains: false,
		cacheLength: 10,
		max: 100,
		mustMatch: false,
		extraParams: {},
		selectFirst: true,
		formatItem: function(row) { return row[0]; },
		formatMatch: null,
		autoFill: false,
		width: 0,
		multiple: false,
		multipleSeparator: ", ",
		multiSelect:false,//控制是否多选
		highlight: function(value, term) {
			return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
		},
	    scroll: true,
	    scrollHeight: 180,
	    parse:function(data){
	    	var json=eval("("+data+")");
	    	return $.map(json,function(row){
	    		return {
	    			data: row
	    		}
	    	})
	    }
	};


	$.Autocompleter.Select = function (options, input, select, config) {
		var CLASSES = {
			ACTIVE: "ac_active",
			HOVER:"ac_over"
		};
		
		var listItems,
			active = -1,
			data,
			term = "",
			needsInit = true,
			element,
			btns,
			list;
		
		// Create results
		function init() {
			if (!needsInit)
				return;
			element = $("<div/>")
			.hide()
			.addClass(options.resultsClass)
			.css("position", "absolute")
			.appendTo(document.body);
		
			list = $("<ul/>").appendTo(element).mouseover( function(event) {
				if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
					active = $("li", list).removeClass(CLASSES.HOVER).index(target(event));
				    $(target(event)).addClass(CLASSES.HOVER);           
		        }
			})
			.mouseout(function(){
				$("li", list).removeClass(CLASSES.HOVER);
			})
			.click(function(event) {
				if(options.multiSelect){
					$(target(event)).toggleClass(CLASSES.ACTIVE);
					select($(target(event)).index());
				}else{
					$(target(event)).addClass(CLASSES.ACTIVE);
					select();
					// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
					input.focus();
				}
				
				return false;
			}).mousedown(function() {
				config.mouseDownOnSelect = true;
			}).mouseup(function() {
				config.mouseDownOnSelect = false;
			});
			
			if(options.multiSelect){
				var inputName=$(input).attr("name");
				btns=$("<div class='buttonRightContainer'></div>")
				.css("position","absolute")
				.append("<input class='dataConButton ac-ok-"+inputName+"'  type='button' value='确定'/>")
				.append("<input class='dataConButton ac-close-"+inputName+"'  type='button' value='关闭'/>")
				.appendTo(document.body);
			}
			
			if( options.width > 0 )
				element.css("width", options.width);
				
			needsInit = false;
		} 
		
		function target(event) {
			var element = event.target;
			while(element && element.tagName != "LI")
				element = element.parentNode;
			// more fun with IE, sometimes event.target is empty, just ignore it then
			if(!element)
				return [];
			return element;
		}

		function moveSelect(step) {
			listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
			movePosition(step);
	        var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
	        if(options.scroll) {
	            var offset = 0;
	            listItems.slice(0, active).each(function() {
					offset += this.offsetHeight;
				});
	            if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
	                list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
	            } else if(offset < list.scrollTop()) {
	                list.scrollTop(offset);
	            }
	        }
		};
		
		function movePosition(step) {
			active += step;
			if (active < 0) {
				active = listItems.size() - 1;
			} else if (active >= listItems.size()) {
				active = 0;
			}
		}
		
		function limitNumberOfItems(available) {
			return options.max && options.max < available
				? options.max
				: available;
		}
		
		function fillList() {
			list.empty();
			var max = limitNumberOfItems(data.length);
			for (var i=0; i < max; i++) {
				if (!data[i])
					continue;
				var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
				if ( formatted === false )
					continue;
				var li = $("<li/>").html( options.highlight(formatted, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0];
				$.data(li, "ac_data", data[i]);
			}
			listItems = list.find("li");
			if ( options.selectFirst ) {
				if(!options.multiSelect){
					listItems.slice(0, 1).addClass(CLASSES.HOVER);
					active = 0;
				}
				
			}
			// apply bgiframe if available
			if ( $.fn.bgiframe )
				list.bgiframe();
		}
		
		return {
			display: function(d, q) {
				init();
				data = d;
				term = q;
				fillList();
			},
			next: function() {
				moveSelect(1);
			},
			prev: function() {
				moveSelect(-1);
			},
			pageUp: function() {
				if (active != 0 && active - 8 < 0) {
					moveSelect( -active );
				} else {
					moveSelect(-8);
				}
			},
			pageDown: function() {
				if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
					moveSelect( listItems.size() - 1 - active );
				} else {
					moveSelect(8);
				}
			},
			hide: function() {
				element && element.hide();
				btns && btns.hide();
				listItems && listItems.removeClass(CLASSES.ACTIVE);
				active = -1;
			},
			visible : function() {
				return element && element.is(":visible");
			},
			current: function() {
				return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
			},
			show: function() {
				var offset = $(input).offset();
				element.css({
					width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
					top: offset.top + input.offsetHeight,
					left: offset.left
				}).show();
	            if(options.scroll) {
	                list.scrollTop(0);
	                list.css({
						maxHeight: options.scrollHeight,
						overflow: 'auto'
					});
					
	                if($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
						var listHeight = 0;
						listItems.each(function() {
							listHeight += this.offsetHeight;
						});
						var scrollbarsVisible = listHeight > options.scrollHeight;
	                    list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );
						if (!scrollbarsVisible) {
							// IE doesn't recalculate width when scrollbar disappears
							listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
						}
	                }
	            }
	            if(options.multiSelect){
	            	var listHeight=$(list).height();
	            	var listWidth=$(list).width();
	            	var btnsWidth=$(btns).width();
	            	btns.css({
	            		"top":listHeight+ offset.top + $(input).height()-10,
	            		"left":offset.left+(listWidth-btnsWidth)
	            	}).show();
	            }
			},
			selected: function() {
				var selected;
				if(options.multiSelect){
					selected = listItems.filter("." + CLASSES.ACTIVE);
					var resultArr=[];
					for(var i=0;i<selected.length;i++){
						resultArr.push($.data(selected[i], "ac_data").data);
					}
					return resultArr;
				}else{
					selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
					return selected && selected.length && $.data(selected[0], "ac_data");
				}
			},
			emptyList: function (){
				list && list.empty();
			},
			unbind: function() {
				element && element.remove();
			}
		};
	};

	$.fn.selection = function(start, end) {
		if (start !== undefined) {
			return this.each(function() {
				if( this.createTextRange ){
					var selRange = this.createTextRange();
					if (end === undefined || start == end) {
						selRange.move("character", start);
						selRange.select();
					} else {
						selRange.collapse(true);
						selRange.moveStart("character", start);
						selRange.moveEnd("character", end);
						selRange.select();
					}
				} else if( this.setSelectionRange ){
					this.setSelectionRange(start, end);
				} else if( this.selectionStart ){
					this.selectionStart = start;
					this.selectionEnd = end;
				}
			});
		}
		var field = this[0];
		if ( field.createTextRange ) {
			var range = document.selection.createRange(),
				orig = field.value,
				teststring = "<->",
				textLength = range.text.length;
			range.text = teststring;
			var caretAt = field.value.indexOf(teststring);
			field.value = orig;
			this.selection(caretAt, caretAt + textLength);
			return {
				start: caretAt,
				end: caretAt + textLength
			}
		} else if( field.selectionStart !== undefined ){
			return {
				start: field.selectionStart,
				end: field.selectionEnd
			}
		}
	};

	})(jQuery);
(function($) {
	$.fn.inputAcHelp=function(helpId,parms,options,callback){
		var defaults = {
				max: 12, 
				minChars: 1,
				width: 250, 
				scrollHeight: 300,
				matchContains: true,
				autoFill: false,
				multiSelect:false,
				formatItem: function (row, i, max) {
	                return  row.KEY+"#"+row.VALUE;
	            }
		};
		var opts = $.extend({},defaults, options); 
		var url="autocomplete.cmd?method=commonHelp";
		url+="&helpId="+helpId;
		for(key in parms){
			url+="&"+key+"="+parms[key];
		}
		
		$(this).unautocomplete().autocomplete(url, opts)
		.result(function (event, row, formatted) {    
			callback(row)
		});				
	}
})(jQuery);

function findValue(li) {
	if( li == null ) return ;

	// if coming from an AJAX call, let's use the CityId as the value
	var sValue = li.selectValue
	if( !!li.extra ) 
		Value = li.extra[0] ;

	//alert("The value you selected was: " + sValue);
}

function selectItem(li) {
	findValue(li);
}

function formatItem(row) {
	return row[0] + " (id: " + row[1] + ")";
}

function lookupAjax(){
	var oSuggest = $("#CityAjax")[0].autocompleter;

	oSuggest.findValue();

	return false;
}

function lookupLocal(){
	var oSuggest = $("#CityLocal")[0].autocompleter;

	oSuggest.findValue();

	return false;
}
//tab 
function switchTab(tabCount,ProTag, ProBox) {
	if(tabCount <=1){
		return;
	}
    for (i = 1; i < tabCount+1; i++) {
        if ("tab" + i == ProTag) {
            document.getElementById(ProTag).getElementsByTagName("a")[0].className = "on";
        } else {
            document.getElementById("tab" + i).getElementsByTagName("a")[0].className = "";
        }
        if ("con" + i == ProBox) {
            document.getElementById(ProBox).style.display = "";
        } else {
            document.getElementById("con" + i).style.display = "none";
        }
    }
}
//end tab

/*五星点评 js*/
var sMax;	// 最大数量的星星即最大评分值
var holder; // 鼠标停留的评分控件
var preSet; // 保存了评分值（通过单击来进行评分）
var rated; //是否评分过，并保存了结果（注意此值一旦设为空，就不能再评分）

// 鼠标停留事件
function rating(num){
	sMax = 0;	// 默认值为0
	for(n=0; n<num.parentNode.childNodes.length; n++){
		if(num.parentNode.childNodes[n].nodeName == "A"){
			sMax++;	
		}
	}
	
	if(!rated){
		s = num.id.replace("_", ''); // 获取选中的星星的索引，这里使用_1,_2,_3,_4,_5来做为评分控件的ID，当然也有其他的方式。
		a = 0;
		for(i=1; i<=sMax; i++){		
			if(i<=s){
				document.getElementById("_"+i).className = "on";
				document.getElementById("rateStatus").innerHTML = num.title;	
				holder = a+1;
				a++;
			}else{
				document.getElementById("_"+i).className = "";
			}
		}
	}
}

// 离开事件
function off(me){
	if(!rated){
		if(!preSet){	
			for(i=1; i<=sMax; i++){		
				document.getElementById("_"+i).className = "";
				document.getElementById("rateStatus").innerHTML = me.parentNode.title;
			}
		}else{
			rating(preSet);
		}
	}
}

// 点击进行评分
function rateIt(me){
	if(!rated){
		document.getElementById("rateStatus").innerHTML = me.title;//document.getElementById("ratingSaved").innerHTML + " :: "+
		preSet = me;
		//rated=1;  //设为1以后，就变成了最终结果，不能再修改评分结果
		sendRate(me);
		rating(me);
	}
}
/*end五星点评 js*/
(function($){
	$.showShareDialog=function(cfg){
		var config = {
				message :"",
				title : "", 
				url : "",
				width : 600, 
				height : 300, 
				returnFunc : "",
				showCloseBox : false,
				showScrolling : false 
			};
		p = $.extend(config, cfg);
		var scrolling = "no";
		if (p.showScrolling!=null&&p.showScrolling==true)
		  scrolling = "auto";
		var iframestring = '<iframe   style="width:100%;height:100%;background-color:transparent;" scrolling="'+scrolling+'" frameborder="0" allowtransparency="true" id="showShareDialog" name="showShareDialog" width="100%" height="100%"></iframe>';
		gpopBodyBox.innerHTML = iframestring;
		gPopFrame = document.getElementById("showShareDialog");	
		width = p.width+30;
		document.getElementById("x-window-title").innerHTML = p.message;
		if (p.showCloseBox == null || p.showCloseBox == true) {
			document.getElementById("ext-gen59").style.display = "block";
		} else {
			document.getElementById("ext-gen59").style.display = "none";
		}
		//gPopupIsShown = true;
		//disableTabIndexes();
		gPopupMask.style.display = "block";
		gPopupContainer.style.display = "block";		
		centerPopWin(p.width, p.height);
		gPopupContainer.style.width = p.width + "px";
		gPopFrame.style.height = p.height+"px";
		//setMaskSize();	
		gPopFrame.src = p.url;
		//gReturnFunc = p.returnFunc;
		// for IE

	};	
})(jQuery);

/*-----绑定到$.fn上的方法----*/
//页面加载中
$.fn.initLoading = function(){
	var height=0;
	if(document.documentElement.clientHeight>document.body.clientWidth){
	    	height=document.documentElement.clientHeight;
	}else{
	    	height=document.body.clientWidth;	
	}
	var width=0;
	if(document.documentElement.clientWidth>document.body.clientWidth){
		width=document.documentElement.clientWidth;
    }else{
    	width=document.body.clientWidth;	
    }
	  
	var body=$("body"); 
	var initBodyDiv = document.createElement('div');
	initBodyDiv.id = 'initBodyDiv';
	$(initBodyDiv).css({
	  "height":height,
	  "width":width,
	  "display":"block"
	})
    body.append($(initBodyDiv));  
	var bodyOffTop=body.offset().top+document.documentElement.clientHeight/2;
	var bodyOffLeft=body.offset().left+body.width()/2;
	$(initBodyDiv).append('<div id="initloada" class="initLoadingBox" style=" top: '+(bodyOffTop-25)+'px; left: '+(bodyOffLeft-90)+'px;"></div>');
    $('.initLoadingBox').append('<a   href= "#a " class ="loadingImg jsLoadingImg"  style=" " ></a>');
    $('.initLoadingBox').append('<div class="initloadText">加载中，请稍候...</div>')
		//$(initBodyDiv).append('<div  id="initloaddiv" style="border: 0px none; position: absolute; top: '+body.offset().top+'px; left: '+body.offset().left+'px; background-color:white; width: '+body.width()+'px; height:'+body.height()+'px; z-index: 10000; ">');
	   
}
//页面加载结束
$.fn.detachLoading = function()
{   
	var img = $("#initloada");
    var div = $("#initBodyDiv");  
    if(img.length>0)
	{
	img.detach();
	div.detach();
	}
}
//禁用按钮
$.fn.disableButton=function(){
	$(this).attr("disabled",true);
	$(this).css("opacity","0.5");
};
//启用按钮
$.fn.enableButton=function(){
	$(this).attr("disabled",false);
	$(this).css("opacity","1");
};
var buttonTextArray = new Array();
var buttonTextArrayContent=0;
var obj=new Image();
obj.src="/ocs-web/static/web/skin2/loading/buttonLoading.gif";
//点击按钮正在加载中
$.fn.buttonIsLoading=function(){
	var nowButton= $(this);
	if(nowButton.attr("loadingButtonCount")!=undefined){
		return;
	}
	 nowButton.attr("disabled",true);
	 nowButton.css("opacity","0.5");
	 var buttonStyle = nowButton.get(0).tagName;                //用来判断是input标签还吃button标签
	 if(buttonStyle=="INPUT"){
	    buttonTextArray[buttonTextArrayContent]= nowButton.val();
	    nowButton.val("Loading...");
	 }else{
	    buttonTextArray[buttonTextArrayContent]= nowButton.text();
	    nowButton.text("Loading...");  
	 }
	 nowButton.attr("loadingButtonCount",buttonTextArrayContent);
	 buttonTextArrayContent +=1;
     nowButton.after(obj);
	 nowButton.next('img').addClass("v6_buttonLoading") ;	
};
//点击按钮加载结束
$.fn.buttonFinishLoading=function(){
	  var stopLoadingButtonCount=$(this).attr("loadingButtonCount");
	  $(this).removeAttr("loadingButtonCount");
	  var buttonStyle = $(this).get(0).tagName;                    //用来判断是input标签还是button标签
	  if(buttonStyle=="INPUT"){
	     $(this).val(buttonTextArray[stopLoadingButtonCount]);
	  }else{
	     $(this).text(buttonTextArray[stopLoadingButtonCount]);  
	  }
	  $(this).attr("disabled",false);
	  $(this).css("opacity","1");
	  $(this).next(".v6_buttonLoading").remove();
};
//公用可调用方法
var publicCallFun ={
		//分享微博弹出窗口
		shareBlog:function(data){
			 //var blogHidden=document.getElementById("cooperationBlog");
			  $("#blogContent").remove();
			  $("#blogShelter").remove();
			   var theBody = document.getElementsByTagName('BODY')[0];
			   var blogContent = document.createElement('div');
			   blogContent.id = 'blogContent';
			   var blogShelter = document.createElement('div');
			   blogShelter.id='blogShelter';
			   theBody.appendChild(blogShelter);
			   theBody.appendChild(blogContent);
			  // gPopupMask = document.getElementById("popupMask");
			   var iframeing="<iframe src=\""+config.snsUrl+"index.php?app=weibo&mod=Cross&act=psWeibo&weiboContent="+data+"\" width=\"550px\" height=\"350px\" scrolling=\"no\"border=\"0\" frameborder=\"0\" allowtransparency=\"true\"></iframe>";
			   $("#blogContent").html(iframeing);	
			   $("#blogContent").css("width","550px");
			   $("#blogContent").css("height","350px");
			   var bodyWidth=document.documentElement.clientWidth;
			   var bodyHeight=document.documentElement.clientHeight;
			   $("#blogContent").css("left",(bodyWidth-550)/2+"px");
			   $("#blogContent").css("top",(bodyHeight-350)/2+"px");
		      $("#blogShelter").css("width",bodyWidth+"px");
		      $("#blogShelter").css("height",bodyHeight+"px");			
		}	
}
//内部方法
var internalFun ={
		//把input框渲染为help帮助框
		inputPaddingDiv:function(){
			$('input.help').each(function(){
				 if((!$(this).siblings().hasClass('helpImg'))&&$(this).parent().attr("class")!="inputHelpDiv"&&$(this).css("display")!="none"&&$(this).attr("type")=="text"&&$(this).parent().attr("class")!="grid_help"){
				       var inputWidth=$(this).width();
				       $(this).width(inputWidth-20);
				       var divWidth=(inputWidth-20)+"px";
				       var divMaginLeft=$(this).css("margin-left");
				       var inputHeight=$(this).height();
				       inputHeight=inputHeight+"px";
				       var inputOnclick=$(this).attr("onclick");
				       $(this).removeAttr("onclick");
					   $(this).wrap("<div class=\"inputHelpDiv\"  style=\"width:"+divWidth+";height:"+inputHeight+";\" title="+$(this).val()+" ></div>");
					   $(this).after("<div class=\"inputRightHelpDiv\" onclick=\""+inputOnclick+"\"  style=\"height:"+inputHeight+";top:-"+inputHeight+";left:"+divWidth+"\" ></div>");
					}		
			})	
		},
        //明细页面给标题增加左右两道横线
        doubleHead:function(){
        	$doubleTitle=$(".doubleTitle");
        	$doubleTitle.each(function(i){
        		 $(this).before("<a class=\"doubleTitle_Head\"></a>");
        		 $(this).after("<a class=\"doubleTitle_End\"></a>");
        	});
        },
        //明细页面的样式
        detailJsp:function(){
        	$('.detailTable').each(function(){
        		$("tr:odd",this).addClass("odd"); 
        	});
        		$('.foldDetail').each(function(){
        		$("tr:odd",this).addClass("odd"); 
        	});
        	$('.insertTable').each(function(){
        	   $("tr:even",this).addClass("even"); 
        	});
        	$('.table-main').each(function(){
        	   $("tbody tr:odd td",this).addClass("odd"); 
        	});        	  
        },
        //创建隐藏域记录title
        createHiddenInputForTitle:function(){       	
        	var title = document.title;
        	if(!title){
        		title ="返回上一页";
        	}
        	var input = $("<input type='hidden' name='hiddenInputForTitle' value='"+title+"'/>");
        	$("form").append(input);	
        },
        /*分享微博的另一种方式
		 * 按照约定在页面写一个id为cooperationBlog的div，当内容非空时自动发微博
		 * 配置文件中sns的值用来决定知否具有该功能
		 */
		elementForShareBlog:function(){
			if(config.sns==1){
				  var blogHidden=document.getElementById("cooperationBlog");
				  if(blogHidden){
				     var shareContent=$("#cooperationBlog").val();
				     if(shareContent!=""){
				    	 publicCallFun.shareBlog(shareContent);	
				     }
				  }	
			 }
		},
		floatPubButton:function(){
			if(config.floatPubButton==1){
		     try{
				var buttonRightContainerObj = $(".buttonRightContainer:first");
				var buttonContainerObj = $(".buttonContainer:first");
				if(buttonRightContainerObj.length!=1){
					buttonRightContainerObj=$("<div class='buttonRightContainer'><div>");
					buttonRightContainerObj.appendTo($("body"));
				}
				if(buttonContainerObj.length!=1){
					buttonContainerObj=$("<div class='buttonContainer'><div>");
					buttonContainerObj.appendTo($("body"));
				}
				var buttonRightContainerTop = buttonRightContainerObj.offset().top+buttonRightContainerObj.height();
				var buttonContainerObjTop = buttonContainerObj.offset().top+buttonContainerObj.height();
				var fixedButtonDiv; //用于清除定时执行
				var divBodyObj = $(".divBody");
				}catch(e){};
				//顶部按钮区的浮动
				window.onscroll=function(){
						if(buttonRightContainerObj.attr("isFixed")!="false"&&buttonContainerObj.attr("isFixed")!="false"){
						       var buttonRightContainerWid = buttonRightContainerObj.width();
						       var buttonContainerWid = buttonContainerObj.width();
						       var buttonFixHeight = buttonRightContainerObj.height();
						       buttonRightContainerObj.width(buttonRightContainerWid);
						       buttonContainerObj.width(buttonContainerWid);
						       var srcollDiatance=null;
						        if (document.documentElement && document.documentElement.scrollTop) {
							        srcollDiatance = document.documentElement.scrollTop;
							        }
							        else if (document.body) {
							        srcollDiatance = document.body.scrollTop;
							        }
						  	    if(srcollDiatance<buttonRightContainerTop){
						  	        buttonRightContainerObj.css({
								    	 "position":"relative",
								    	 "top":"",
								    	 "background-color":""
								     });
						  	        buttonContainerObj.css({"position":"fixed",
						    		  "position":"relative",
							    	  "top":""
			                        });
						  	    	$(".divBody").css({
								    	 "padding-bottom":""
								     })
							     }else if(srcollDiatance<buttonContainerObjTop){
							    	 buttonRightContainerObj.css({"position":"fixed",
									                            "top":(document.documentElement.clientHeight-50)+"px",
									                            "z-index":"10",
									                            "background-color":"#e3efe9"
									                            });	
							    	 buttonContainerObj.css({"position":"fixed",
							    		  "position":"relative",
								    	  "top":""							    	 
				                     });	
							    	 if($(".buttonRightContainer").length>0){
							    		 $(".divBody").css({
								    	    "padding-bottom":"35px"
								       })
							         }
							     }else if(srcollDiatance>buttonContainerObjTop){
							    	 buttonRightContainerObj.css({"position":"fixed",
				                            "top":(document.documentElement.clientHeight-50)+"px",
				                            "z-index":"10",
				                            "background-color":"#e3efe9"
				                            });	
							    	 buttonContainerObj.css({"position":"fixed",
				                            "top":(document.documentElement.clientHeight-70)+"px",
				                            "z-index":"10"
				                            });	
							    	 $(".divBody").css({
								    	 "padding-bottom":"50px"
								     })
						  	    }
						  }
				   }
			}
		},
		//判断是否部署了gis
		gisButtonFun:function(){
			if(config.gisServer==0){
				 $gisButton=$(".gisButton");
				 $gisButton.css("display","none");	
			}		
		}
}
$(document).ready(function(){
//	$.fn.initLoading();
//	$.fn.initConfig();//读配置文件
	$('table.flexigrid').flexigrid();//渲染flexigrid
	$('table.editgrid').editgrid();//渲染editgrid
	$(".dateImg").each(function(){//如果所有datepicker一起初始化,必须each循环,如果单个,可以直接调datepicker初始化
		$(this).datepicker();//渲染日期
	});
	$("select").each(function() {
		 $(this).multiselect();//渲染下拉框
	});
	$.fn.jNice();//渲染radio和checkbox
	$.fn.initLinkPopup();	
	checkMbuttonFunction();//渲染按钮
	unfold()//折叠明细
//	$.fn.detachLoading();
	//内部方法调用
	for(var i in internalFun){
		internalFun[i]();
	}	
});

/*已经失控的方法开始*/
//按钮渲染方法
function checkMbuttonFunction(){
	/*第一套样式下的baseButton*/
	$MBaseButton=$(".baseButton");
	$MBaseButton.each(function(i){				
	if($(this).css('display')!='none'){
		var tagName = $(this).get(0).tagName;
		 var textValue="a";
	     var event = $(this).attr("onclick");
	     var id=$(this).attr("id");
	     if(id==undefined){
	    	 id="";
	     }
	     var arrowbuttonHtml="";			  			    
		 if (tagName=="INPUT") {					 
			 textValue=$(this).val();
		  }
		 else {		 
			 textValue=$(this).text();
		}
		 if(event!=undefined || event !=null){			
			 arrowbuttonHtml="<span class='baseButton'  onclick="+event+" id="+id+"><span class=\"baseButtonHead\"></span><span class=\"baseButtonBody\">"+textValue+"</span><span class=\"baseButtonRoot\"></span></span>";						
		 }
		 else {
			 arrowbuttonHtml="<span class='baseButton' id="+id+" ><span class=\"baseButtonHead\"></span><span class=\"baseButtonBody\">"+textValue+"</span><span class=\"baseButtonRoot\"></span></span>";							
		}				 
		 $(this).before(arrowbuttonHtml);
		 $(this).remove();
	 }
   });	
	$(".baseButton").hover(
		function()
		{
		$(this).children(".baseButtonHead").attr("class","baseButtonHeadHover");
		$(this).children(".baseButtonBody").attr("class","baseButtonBodyHover");
		$(this).children(".baseButtonRoot").attr("class","baseButtonRootHover");
		},
		function()
		{
			$(this).children(".baseButtonHeadHover").attr("class","baseButtonHead");
			$(this).children(".baseButtonBodyHover").attr("class","baseButtonBody");
			$(this).children(".baseButtonRootHover").attr("class","baseButtonRoot");						
		}				
	);
	 /*右下角有icon的蓝色边框y按钮*/
	 $MBluebuttonRightIConBody=$(".topAssistButton");			 
	 $MBluebuttonRightIConBody.each(function(i)
   {  
	 if($(this).css('display')!='none'){ 
		 var tagName = $(this).get(0).tagName;
		 var textValue="";		 
         var event = $(this).attr("onclick");
         var id=$(this).attr("id");
	     if(id==undefined){
	    	 id="";
	     }
	     var arrowbuttonHtml="";			     
         if (tagName=="INPUT") {
			 textValue=$(this).val();
		  }
		 else {
			  textValue=$(this).text();
		 }		         
		 if(event!=undefined || event !=null){ 
			 arrowbuttonHtml="<span class=\"topAssistButton\" id="+id+"><span class=\"topFunButtonHead\"></span><span class=\"topAssistButtonBody\" onclick="+event+">"+textValue+"</span><span class=\"topAssistButtonRoot\"></span></span>";						
		 }
		 else {
			 arrowbuttonHtml="<span class=\"topAssistButton\" id="+id+"><span class=\"topFunButtonHead\"></span><span class=\"topAssistButtonBody\">"+textValue+"</span><span class=\"topAssistButtonRoot\"></span></span>";
				
		}
		 
		 $(this).before(arrowbuttonHtml);
		 $(this).remove();				 	
	 }
   });			 
	  $currentMBluebuttonRightIConBodyn=$(".topAssistButton");			  
	  $currentMBluebuttonRightIConBodyn.hover(
				function(){	
					 $(this).children(".topFunButtonHead").attr("class","topFunButtonHeadHover");
					 $(this).children(".topAssistButtonBody").attr("class","topAssistButtonBodyHover");
					 $(this).children(".topAssistButtonRoot").attr("class","topAssistButtonRootHover");
//			              $(this).css("background-image","url(\"/skin/skin1/button/blueButton_body2.png\")");		
//			              $(this).next(".MBluebuttonRightIConRoot").css("background-image","url(\"/skin/skin1/button/rightButton_end2.png\")");
//					
				},
				function(){
					 $(this).children(".topFunButtonHeadHover").attr("class","topFunButtonHead");
					 $(this).children(".topAssistButtonBodyHover").attr("class","topAssistButtonBody");
					 $(this).children(".topAssistButtonRootHover").attr("class","topAssistButtonRoot");
					 
//				           $(this).css("background-image","url(\"/skin/skin1/button/blueButton_body.png\")");
//				           $(this).next(".MBluebuttonRightIConRoot").css("background-image","url(\"/skin/skin1/button/rightButton_end.png\")");
//				       	
						}
			);			  
	  $currentMBluebuttonRightIConBodyn.live('mousedown',function(){
		     $(this).children(".topFunButtonHeadHover").attr("class","topFunButtonHeadClick");
			 $(this).children(".topAssistButtonBodyHover").attr("class","topAssistButtonBodyClick");
			 $(this).children(".topAssistButtonRootHover").attr("class","topAssistButtonRootClick");
	  });
	  $currentMBluebuttonRightIConBodyn.live('mouseup',function(){
		     $(this).children(".topFunButtonHeadClick").attr("class","topFunButtonHead");
			 $(this).children(".topAssistButtonBodyClick").attr("class","topAssistButtonBody");
			 $(this).children(".topAssistButtonRootClick").attr("class","topAssistButtonRoot");
	  });
	  $currentMBluebuttonRightIConBodyn.live('mouseleave',function(){
		     $(this).children(".topFunButtonHeadClick").attr("class","topFunButtonHead");
			 $(this).children(".topAssistButtonBodyClick").attr("class","topAssistButtonBody");
			 $(this).children(".topAssistButtonRootClick").attr("class","topAssistButtonRoot");
	  });						  
	  //author zhaowj添加向右箭头按钮开始
	  $rightFirstTopOrderButton = $(".topOrderButton:first");
	  $rightNotFirstTopOrderButton = $(".topOrderButton:not(:first)");  
	  $(".topOrderButton").each(function(){                             
		  if($(".topOrderButton:first").css('display')=='none'){  //循环如果第一个按钮是隐藏的，下一个按钮变为第一个。
			  $(this).remove();
		  }
		  $rightFirstTopOrderButton = $(".topOrderButton:first");
		  $rightNotFirstTopOrderButton = $(".topOrderButton:not(:first)");  
	  })		 						 
	 $width=$(".topOrderButton:first").text().length;
	 $(".topOrderButton").each(function(i){            //计算汉字的个数
		if($width<$(this).next().text().length){
			$width =$(this).next().text().length;
			 }				
	 });
	 $width=$width*12;  
	 $rightFirstTopOrderButton.each(function(i)
   {   if($(this).css('display')!='none'){
		 var tagName = $(this).get(0).tagName;
		 var textValue="";
	     var event = $(this).attr("onclick");
	     var id=$(this).attr("id");
	     if(id==undefined){
	    	 id="";
	     }
	     var arrowbuttonHtml="";			     			    
		 if (tagName=="INPUT") {					 
			 textValue=$(this).val();
		  }
		 else {					 
			 textValue=$(this).text();
		}
		 if(event!=undefined || event !=null){
				
			 arrowbuttonHtml="<span class='topOrderButton'  onclick="+event+" id="+id+"><span class=\"rightFirstTopOrderButtonHead\"></span><span class=\"topOrderButtonBody\">"+textValue+"</span><span class=\"topOrderButtonRoot\"></span></span>";						
		 }
		 else {
			 arrowbuttonHtml="<span class=\"topOrderButton\" id="+id+"><span class=\"rightFirstTopOrderButtonHead\"></span><span class=\"topOrderButtonBody\">"+textValue+"</span><span class=\"topOrderButtonRoot\"></span></span>";							
		}
		 $(this).before(arrowbuttonHtml);
		 $(this).remove();
    }	 			
   });
	 $rightNotFirstTopOrderButton.each(function(i)
			   {   if($(this).css('display')!='none'){
					 var tagName = $(this).get(0).tagName;
					 var textValue="";
				     var event = $(this).attr("onclick");
				     var id=$(this).attr("id");
				     if(id==undefined){
				    	 id="";
				     }
				     var arrowbuttonHtml="";						    						    
					 if (tagName=="INPUT") {								 
						 textValue=$(this).val();
					  }
					 else {								 
						 textValue=$(this).text();								 
					}						
					 if(event!=undefined || event !=null){								
						 arrowbuttonHtml="<span class='topOrderButton'  onclick="+event+" id="+id+" ><span class=\"topOrderButtonHead\"></span><span class=\"topOrderButtonBody\">"+textValue+"</span><span class=\"topOrderButtonRoot\"></span></span>";							
					 }
					 else {
						 arrowbuttonHtml="<span class=\"topOrderButton\" id="+id+" ><span class=\"topOrderButtonHead\"></span><span class=\"topOrderButtonBody\">"+textValue+"</span><span class=\"topOrderButtonRoot\"></span></span>";										
					}
					 $(this).before(arrowbuttonHtml);
					 $(this).remove();						
			   }
			   });
	 $(".topOrderButton:first").hover(function(){
		             $(this).children(".rightFirstTopOrderButtonHead").attr("class","rightFirstTopOrderButtonHeadHover");
					 $(this).children(".topOrderButtonBody").attr("class","topOrderButtonBodyHover");
					 $(this).children(".topOrderButtonRoot").attr("class","topOrderButtonRootHover");
	 },function(){
		            $(this).children(".rightFirstTopOrderButtonHeadHover").attr("class","rightFirstTopOrderButtonHead");
		            $(this).children(".topOrderButtonBodyHover").attr("class","topOrderButtonBody");
		            $(this).children(".topOrderButtonRootHover").attr("class","topOrderButtonRoot");
	 }			 			 			 
	 )
	 $(".topOrderButton").each(function(i){
		$(this).children(".topOrderButtonBody").css("width",$width+"px");
	 })
	 $(".topOrderButton:not(:first)").hover(function(){
		  $(this).children(".topOrderButtonHead").attr("class","topOrderButtonHeadHover");
		  $(this).children(".topOrderButtonBody").attr("class","topOrderButtonBodyHover");
		  $(this).children(".topOrderButtonRoot").attr("class","topOrderButtonRootHover");
	 },function(){
		  $(this).children(".topOrderButtonHeadHover").attr("class","topOrderButtonHead");
		  $(this).children(".topOrderButtonBodyHover").attr("class","topOrderButtonBody");
		  $(this).children(".topOrderButtonRootHover").attr("class","topOrderButtonRoot");
	 })						 
	 $(".topOrderButton:first").mousedown(function(){
		 $(this).children(".rightFirstTopOrderButtonHeadHover").attr("class","rightFirstTopOrderButtonHeadClick");
		 $(this).children(".topOrderButtonBodyHover").attr("class","topOrderButtonBodyClick");
		 $(this).children(".topOrderButtonRootHover").attr("class","topOrderButtonRootClick");
		 });
	 $(".topOrderButton:not(:first)").mousedown(function(){
		 $(this).children(".topOrderButtonHeadHover").attr("class","topOrderButtonHeadClick");
		 $(this).children(".topOrderButtonBodyHover").attr("class","topOrderButtonBodyClick");
		 $(this).children(".topOrderButtonRootHover").attr("class","topOrderButtonRootClick");				
		 });
	//author zhaowj添加向右箭头按钮结束				
}
//关闭窗口
function closeBlogDialog(){	
	$("#blogContent").remove();
	$("#blogShelter").remove();
}
//折叠明细页展开收起
function unfold(){
 	  $foldTitle=$(".foldIcon");
      //初始化各块明细内容
 	  $foldTitle.each(function(i)
    {     $fold=$(this).parent().text();
          var isUnfold=$(this).attr("unfold");
 		 $foldContentView=$(this).parent();
 		 $("<a class=\"fold_head\"></a><div class=\"fold\">"+$fold+"</div>").appendTo($foldContentView);
 		 $(this).before("<a class=\"fold_end\"></a>");
 		 $(this).after("<a class=\"fold_Body\"></a>");
 		 $(this).siblings("label").html("");
 		 if(isUnfold=="yes")
 			{
 			 $(this).attr("class","unfoldIcon");
 			 $(this).parent().next(".foldContent").css({
 				 "visibility":"visible",
 				 "position":"static"
 			 });            //让内容可见
 			 var hei=$(this).parent().next(".foldContent").attr("height");
 			 $(this).parent().next(".foldContent").animate({height:"+hei+"},0);
 			 $('.help',$(this).parent().next(".foldContent")).css("visibility","visible");  //初始化若为展开，显示帮助图标
 			}
 		else
 			{
 			 $(this).attr("class","foldIcon");
 			 $(this).parent().next(".foldContent").css({
 				"visibility":"hidden",
 				"position":"absolute"
 			 });              //隐藏内容
 			 $(this).parent().next(".foldContent").animate({height:"0px"},0);
 			 $('.help',$(this).parent().next(".foldContent")).css("visibility","hidden");  //初始化若为关闭，隐藏帮助图标
 			}
    });
    //展开关闭的点击事件
    $foldTitle.click(
 			function(){
 	           var is=$(this).attr("unfold");
 				if(is=="yes"){
 					$(this).attr("class","foldIcon");
 					$(this).attr("unfold","no");
 					$(this).parent().next(".foldContent").animate({height:"0px"});
 					$(this).parent().next(".foldContent").css({
 						"visibility":"hidden",
 		 				"position":"absolute"
 		 			 });             //隐藏内容
 				}else{
 					$(this).attr("class","unfoldIcon");
 					$(this).attr("unfold","yes");
 					//$(this).parent().next(".foldContent").animate({height:"150px"});
 					var foldContent = $(this).parent().next(".foldContent");
 					var foldContentSubTable = foldContent.children();
 					var chilerenNumber = foldContentSubTable.length;
 					var childrenHeight="";
 					if(chilerenNumber==1){
 						childrenHeight = (foldContentSubTable.height()+24)+"px";
 						foldContent.animate({height:childrenHeight});	
 					}else if(chilerenNumber>1){
 						for(var i=0;i<chilerenNumber;i++){
 							childrenHeight+=foldContentSubTable.height();
 						}
 						foldContent.animate({height:(childrenHeight+24)+"px"});	
 					}
 					
 					$(this).parent().next(".foldContent").css({
 						"visibility":"visible",
 		 				"position":"static"
 		 			 });             //让内容可见
 				}			
 			}
 	     ) 	
}
/*已经失控的方法结束*/
addEvent(window, "load", initPopUp);



/**************************************************************

 @Name: layer v1.7.1 弹层组件开发版
 @Author: 贤心
 @Date: 2014-02-23
 @Blog: http://sentsin.com
 @微博：http://weibo.com/SentsinXu
 @QQ群：218604143(layer组件群2)
 @Copyright: Sentsin Xu(贤心)
 @官网说明：http://sentsin.com/jquery/layer
 @赞助layer: https://me.alipay.com/sentsin
		
 *************************************************************/

;!function(window, undefined){		
"use strict";

var pathType = true, //是否采用自动获取绝对路径。false：将采用下述变量中的配置
pathUrl = 'lily/lib/layer/', //上述变量为false才有效，当前layerjs所在目录(不用填写host，相对站点的根目录即可)。

$, win, ready = {
    hosts: (function(){
        var dk = location.href.match(/\:\d+/);
        dk = dk ? dk[0] : '';
        return 'http://' + document.domain + dk + '/';
    }()),
    
    getPath: function(){
        var js = document.scripts || $('script'), jsPath = js[js.length - 1].src;
        if(pathType){
            return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
        } else {
            return this.hosts + pathUrl;
        } 
    }
};

//默认内置方法。
window.layer = {
    v : '1.7.1', //版本号
    ie6: !-[1,] && !window.XMLHttpRequest,
    index: 0,
    path: ready.getPath(),
    
    //载入模块
    use: function(module, callback){
        var i = 0, head = $('head')[0];
        var module = module.replace(/\s/g, '');
        var iscss = /\.css$/.test(module);
        var node = document.createElement(iscss ? 'link' : 'script');
        var id = module.replace(/\.|\//g, '');
        if(iscss){
            node.setAttribute('type', 'text/css');
            node.setAttribute('rel', 'stylesheet');
        }
        node.setAttribute((iscss ? 'href' : 'src'), layer.path + module);
        node.setAttribute('id', id);
        if(!$('#'+ id)[0]){
            head.appendChild(node);
        }
        $(node).ready(function(){
            callback && callback();
        });
    },
    
    ready: function(callback){
        return layer.use('skin/layer.css', callback);
    }, 
    
    //普通对话框，类似系统默认的alert()
    alert: function(alertMsg, alertType, alertTit, alertYes){
        return $.layer({
            dialog : {msg : alertMsg, type : alertType, yes : alertYes},
            title : alertTit,
            area: ['auto', 'auto']
        });
    }, 
    
    //询问框，类似系统默认的confirm()
    confirm: function(conMsg, conYes, conTit, conNo){ 
        return $.layer({
            dialog : {msg : conMsg, type : 4, btns : 2, yes : conYes, no : conNo},
            title : conTit||"提示"
        }); 
    },
    
     //普通消息框，一般用于行为成功后的提醒,默认两秒自动关闭
    msg: function(msgText, msgTime, parme, callback){
        var icon, conf = {title: false, closeBtn: false};
        (msgText == '' || msgText == undefined) && (msgText = '&nbsp;');
        msgTime === undefined && (msgTime = 2);
        if(typeof parme === 'number'){
            icon = parme;
        } else {
            parme = parme || {};
            icon = parme.type;
            conf.success = function(){layer.shift(parme.rate)};
            conf.shade = parme.shade;
        }
        conf.time = msgTime;
        conf.dialog = {msg: msgText, type: icon};
        conf.end = typeof parme === 'function' ? parme : callback;
        return $.layer(conf);	
    }, 
    
    //加载层快捷引用
    load: function(parme, loadIcon){
        if(typeof parme === 'string'){
            return this.msg(parme, 0, 16);
        } else {
            return $.layer({
                time: parme,
                loading: {type : loadIcon},
                bgcolor: !loadIcon ? '' : '#fff',
                shade: [0.1, '#000', !loadIcon ? false : true],
                border :[7,0.3, '#000', (loadIcon === 3 || !loadIcon) ? false : true],
                type : 3,
                title : ['',false],
                closeBtn : [0 , false]
            });
        }
    }, 
    
    //tips层快捷引用
    tips: function(html, follow, parme, maxWidth, guide, style){
        var conf = {type: 4, shade: false, success: function(layerE){
            if(!this.closeBtn){
                layerE.find('.xubox_tips').css({'padding-right': 10});
            }
        }, bgcolor:'', tips:{msg: html, follow: follow}};
        parme = parme || {};
        conf.time = parme.time || parme;
        conf.closeBtn = parme.closeBtn || false
        conf.maxWidth = parme.maxWidth || maxWidth;
        conf.tips.guide = parme.guide || guide;
        conf.tips.style = parme.style || style;
        return $.layer(conf);
    },
    prompt:function(parme, yes, no){
    	var log = {}, parme = parme || {}, conf = {
            area: ['auto', 'auto'],
            offset: [parme.top || '200px', ''],
            title: parme.title || '信息',
            dialog: {
                btns: 2,
                type: -1,
                msg: '<input type="'+ function(){
                    if(parme.type === 1){ //密码
                        return 'password';
                    } else if(parme.type === 2) {
                        return 'file';
                    } else {
                        return 'text';
                    }
                }() +'" class="xubox_prompt xubox_form" id="xubox_prompt" value="" />',
                yes: function(index){
                    var val = log.prompt.val();
                    yes && yes(val);
                    if(val === ''){
                        log.prompt.focus();
                    } else {
                        layer.close(index);
                    }
                }, no: no
            }, success: function(){
                log.prompt = $('#xubox_prompt');
            }
        };
        if(parme.type === 3){
            conf.dialog.msg = '<textarea class="xubox_prompt xubox_form xubox_formArea" id="xubox_prompt"></textarea>'
        }
        return $.layer(conf);
    },
    tab:function(parme){
        var log = {}, parme = parme || {}, data = parme.data || [], conf = {
            type: 1,
            border: [0],
            area: ['auto', 'auto'],
            title: false,
            shade : parme.shade,
            move: ['.xubox_tabmove', true],
            closeBtn: false,
            page: {html: '<div class="xubox_tab" style="'+ function(){
                    parme.area = parme.area || [];
                    return 'width:'+ (parme.area[0] || '500px') +'; height:'+ (parme.area[1] || '300px') +'">';
                }()
                +'<span class="xubox_tabmove"></span>'
                +'<div class="xubox_tabtit">'
                +function(){
                    var len = data.length, ii = 1, str = '';
                    if(len > 0){
                        str = '<span class="xubox_tabnow">'+ data[0].title +'</span>';
                        for(; ii < len; ii++){
                            str += '<span>'+ data[ii].title +'</span>';
                        }
                    }
                    
                    return str;
                }() +'</div>'
                +'<ul class="xubox_tab_main">'+ function(){
                    var len = data.length, ii = 1, str = '';
                    if(len > 0){
                        str = '<li class="xubox_tabli xubox_tab_layer">'+ (data[0].content || '请配置content') +'</li>';
                        for(; ii < len; ii++){
                            str += '<li class="xubox_tabli">'+ (data[ii].content || '请配置content') +'</li>';
                        }
                    }
                    return str;
                }() +'</ul>'
                +'<span class="xubox_tabclose" title="关闭">X</span>'
                +'</div>'
            }, success: function(layerE){
                //切换事件
                var btn = $('.xubox_tabtit').children(), main = $('.xubox_tab_main').children(), close = $('.xubox_tabclose');
                btn.on('click', function(){
                    var othis = $(this), index = othis.index();
                    othis.addClass('xubox_tabnow').siblings().removeClass('xubox_tabnow');
                    main.eq(index).show().siblings().hide();
                });
                //关闭层
                close.on('click', function(){
                    layer.close(layerE.attr('times'));
                });
            }
        };
        return $.layer(conf);
    }
};

var Class = function(setings){	
    var config = this.config;
    layer.index++;
    this.index = layer.index;
    this.config = $.extend({} , config , setings);
    this.config.dialog = $.extend({}, config.dialog , setings.dialog);
    this.config.page = $.extend({}, config.page , setings.page);
    this.config.iframe = $.extend({}, config.iframe , setings.iframe);	
    this.config.loading = $.extend({}, config.loading , setings.loading);
    this.config.tips = $.extend({}, config.tips , setings.tips);
    this.creat();
};

Class.pt = Class.prototype;

//默认配置
Class.pt.config = {
    type: 0,
    shade: [0.3 , '#000' , true],
    shadeClose: false,
    fix: false,
    move: ['.xubox_title' , true],
    moveOut: false,
    title: ['信息' , true],
    offset: ['200px' , '50%'],
    area: ['310px' , 'auto'],
    closeBtn: [0 , true],
    time: 0,
    bgcolor: '#fff',
    border: [8 , 0.3 , '#000', true],
    zIndex: 19891014, 
    maxWidth: 400,
    dialog: {btns : 1, btn : ['确定','取消'], type : 3, msg : '', yes : function(index){ layer.close(index);}, no : function(index){ layer.close(index);}
    },
    page: {dom: '#xulayer', html: '', url: ''},
    iframe: {src: 'www.baidu.com'},
    loading: {type: 0},
    tips: {msg: '', follow: '', guide: 0, isGuide: true, style: ['background-color:#FF9900; color:#fff;', '#FF9900']},
    success: function(layer){}, //创建成功后的回调
    close: function(index){ layer.close(index);}, //右上角关闭回调
    end: function(){} //终极销毁回调
};



Class.pt.type = ['dialog', 'page', 'iframe', 'loading', 'tips'];

//容器
Class.pt.space = function(html){
    var html = html || '', times = this.index, config = this.config, dialog = config.dialog, dom = this.dom,
    ico = dialog.type === -1 ? '' : '<span class="xubox_msg xulayer_png32 xubox_msgico xubox_msgtype' + dialog.type + '"></span>',
    frame = [
    '<div class="xubox_dialog">'+ ico +'<span class="xubox_msg xubox_text" style="'+ (ico ? '' : 'padding-left:20px') +'">' + dialog.msg + '</span></div>',	
    '<div class="xubox_page">'+ html +'</div>',
    '<iframe allowtransparency="true" id="'+ dom.ifr +''+ times +'" name="'+ dom.ifr +''+ times +'" onload="$(this).removeClass(\'xubox_load\');" class="'+ dom.ifr +'" frameborder="0" src="' + config.iframe.src + '"></iframe>',				
    '<span class="xubox_loading xubox_loading_'+ config.loading.type +'"></span>',
    '<div class="xubox_tips" style="'+ config.tips.style[0] +'"><div class="xubox_tipsMsg">'+ config.tips.msg +'</div><i class="layerTipsG"></i></div>'
    ],
    shade = '' , border = '', zIndex = config.zIndex + times,
    shadeStyle = 'z-index:'+ zIndex +'; background-color:'+ config.shade[1] +'; opacity:'+ config.shade[0] +'; filter:alpha(opacity='+ config.shade[0]*100 +');';

    config.shade[2] && (shade = '<div times="'+ times +'" id="xubox_shade' + times + '" class="xubox_shade" style="'+ shadeStyle +'"></div>');	

    config.zIndex = zIndex;
    var title = '', closebtn = '', borderStyle = "z-index:"+ (zIndex-1) +";  background-color: "+ config.border[2] +"; opacity:"+ config.border[1] +"; filter:alpha(opacity="+ config.border[1]*100 +"); top:-"+ config.border[0] +"px; left:-"+ config.border[0] +"px;";

    config.border[3] && (border = '<div id="xubox_border'+ times +'" class="xubox_border" style="'+ borderStyle +'"></div>');
    config.closeBtn[1] && (closebtn = '<a class="xubox_close xulayer_png32 xubox_close' + config.closeBtn[0] +'" href="javascript:;"></a>');
    config.title[1] && (title = '<h2 class="xubox_title"><em>' + config.title[0] + '</em></h2>')
    var boxhtml = '<div times="'+ times +'" showtime="'+ config.time +'" style="z-index:'+ zIndex +'" id="'+ dom.lay +''+ times 
    +'" class="'+ dom.lay +'">'	
    + '<div style="background-color:'+ config.bgcolor +'; z-index:'+ zIndex +'" class="xubox_main">'
    + frame[config.type]
    + title
    + closebtn
    + '<span class="xubox_botton"></span>'
    + '</div>'+ border + '</div>';
    return [shade , boxhtml];
};

//缓存字符
Class.pt.dom = {
    lay: 'xubox_layer',
    ifr: 'xubox_iframe'
};

//创建骨架
Class.pt.creat = function(){
    var that = this , space = '', config = this.config, dialog = config.dialog, title = that.config.title, dom = that.dom, times = that.index;;

    title.constructor === Array || (that.config.title = [title, true]);
    title === false && (that.config.title = [title, false]);

    var page = config.page, body = $("body"), setSpace = function(html){
        var html = html || ''
        space = that.space(html);
        body.append(space[0]);
    };

    switch(config.type){
        case 1:
            if(page.html !== ''){
                setSpace('<div class="xuboxPageHtml">'+ page.html +'</div>');
                body.append(space[1]);
            }else if(page.url !== ''){
                setSpace('<div class="xuboxPageHtml" id="xuboxPageHtml'+ times +'">'+ page.html +'</div>');
                body.append(space[1]);
                $.get(page.url, function(datas){
                    $('#xuboxPageHtml'+ times).html(datas.toString());
                    page.ok && page.ok(datas);
                });
            }else{
                if($(page.dom).parents('.xubox_page').length == 0){
                    setSpace();
                    $(page.dom).show().wrap(space[1]);
                }else{
                    return;	
                }
            }
        break;
        case 2:
            setSpace();
            body.append(space[1]);
        break;
        case 3:
            config.title = ['', false];
            config.area = ['auto', 'auto']; 
            config.closeBtn = ['', false];
            $('.xubox_loading')[0] && layer.close($('.xubox_loading').parents('.'+dom.lay).attr('times'));
            setSpace();
            body.append(space[1]);
        break;
        case 4:
            config.title = ['', false];
            config.area = ['auto', 'auto'];
            config.fix = false;
            config.border = false;
            $('.xubox_tips')[0] && layer.close($('.xubox_tips').parents('.'+dom.lay).attr('times'));
            setSpace();
            body.append(space[1]);
            $('#'+ dom.lay + times).find('.xubox_close').css({top: 6, right: 7});
        break;		
        default: 
            config.title[1] || (config.area = ['auto','auto']);
            $('.xubox_dialog')[0] && layer.close($('.xubox_dialog').parents('.'+dom.lay).attr('times'));
            setSpace();
            body.append(space[1]);
        break;
    };
    
    this.layerS = $('#xubox_shade' + times);
    this.layerB = $('#xubox_border' + times);
    this.layerE = $('#'+ dom.lay + times);

    var layerE = this.layerE;
    this.layerMian = layerE.find('.xubox_main');
    this.layerTitle = layerE.find('.xubox_title');
    this.layerText = layerE.find('.xubox_text');
    this.layerPage = layerE.find('.xubox_page');
    this.layerBtn = layerE.find('.xubox_botton');

    //设置layer面积坐标等数据 
    if(config.offset[1].indexOf("px") != -1){
        var _left = parseInt(config.offset[1]);
    }else{
        if(config.offset[1] == '50%'){
            var _left =  config.offset[1];
        }else{
            var _left =  parseInt(config.offset[1])/100 * win.width();
        }
    };
    layerE.css({left: _left + config.border[0], width: config.area[0], height: config.area[1]});
    
    var pst= window==parent ? 0 : $(parent).scrollTop();//获取父页面的滚动条位置
    config.fix ? layerE.css({top: parseInt(config.offset[0]) + config.border[0]}) : layerE.css({top: parseInt(config.offset[0]) + win.scrollTop() + config.border[0] + pst, position: 'absolute'});	

    //配置按钮
    if(config.title[1] && (config.type !== 3 || config.type !== 4)){
        var confbtn = config.type === 0 ? dialog : config;
        confbtn.btn = config.btn || dialog.btn;
        switch(confbtn.btns){
            case 0:
                that.layerBtn.html('').hide();
            break;
            case 1:
                that.layerBtn.html('<a href="javascript:;" class="xubox_yes xubox_botton1">'+ confbtn.btn[0] +'</a>');
            break;
            case 2:
                that.layerBtn.html('<a href="javascript:;" class="xubox_yes xubox_botton2">'+ confbtn.btn[0] +'</a>' + '<a href="javascript:;" class="xubox_no xubox_botton3">'+ confbtn.btn[1] + '</a>');
            break;                
        }
    }

    if(layerE.css('left') === 'auto'){
        layerE.hide();
        setTimeout(function(){
            layerE.show();
            that.set(times);
        }, 500);
    }else{
        that.set(times);
    }
    config.time <= 0 || that.autoclose();
    this.callback();
};

//初始化骨架
Class.pt.set = function(times){
    var that = this, layerE = that.layerE, config = that.config, dialog = config.dialog, page = config.page, loading = config.loading, dom = that.dom;
    that.autoArea(times);
    if(config.title[1]){
        layer.ie6 && that.layerTitle.css({width : layerE.outerWidth()});	
    }else{
        config.type != 4 && layerE.find('.xubox_close').addClass('xubox_close1');
    };

    layerE.attr({'type' :  that.type[config.type]});

    switch(config.type){
        case 1: 	
            layerE.find(page.dom).addClass('layer_pageContent');
            config.shade[2] && layerE.css({zIndex: config.zIndex + 1});
            config.title[1] && that.layerPage.css({top: that.layerTitle.outerHeight()});
        break;
        
        case 2:
            var iframe = layerE.find('.'+ dom.ifr), heg = layerE.height();
            iframe.addClass('xubox_load').css({width: layerE.width()});
            config.title[1] ? iframe.css({top: that.layerTitle.height(), height: heg - that.layerTitle.height()}) : iframe.css({top: 0, height : heg});
            layer.ie6 && iframe.attr('src', config.iframe.src);
        break;
        
        case 3:
        break;
        case 4 :
            var layArea = [0, layerE.outerHeight()], fow = $(config.tips.follow), fowo = {
                width: fow.outerWidth(),
                height: fow.outerHeight(),
                top: fow.offset().top,
                left: fow.offset().left
            }, tipsG = layerE.find('.layerTipsG');

            config.tips.isGuide || tipsG.remove();
            layerE.outerWidth() > config.maxWidth && layerE.width(config.maxWidth);
            
            fowo.tipColor = config.tips.style[1];
            layArea[0] = layerE.outerWidth();
            
            //辨别tips的方位
            fowo.where = [function(){ //上
                fowo.tipLeft = fowo.left;
                fowo.tipTop = fowo.top - layArea[1] - 10;
                tipsG.removeClass('layerTipsB').addClass('layerTipsT').css({'border-right-color': fowo.tipColor});   
            }, function(){ //右
                fowo.tipLeft = fowo.left + fowo.width + 10;
                fowo.tipTop = fowo.top;
                tipsG.removeClass('layerTipsL').addClass('layerTipsR').css({'border-bottom-color': fowo.tipColor}); 
            }, function(){ //下
                fowo.tipLeft = fowo.left;
                fowo.tipTop = fowo.top + fowo.height + 10;
                tipsG.removeClass('layerTipsT').addClass('layerTipsB').css({'border-right-color': fowo.tipColor});
            }, function(){ //左
                fowo.tipLeft = fowo.left - layArea[0] + 10;
                fowo.tipTop = fowo.top;
                tipsG.removeClass('layerTipsR').addClass('layerTipsL').css({'border-bottom-color': fowo.tipColor});
            }];
            fowo.where[config.tips.guide]();
            
            /* 8*2为小三角形占据的空间 */
            if(config.tips.guide === 0){
                fowo.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && fowo.where[2]();
            } else if (config.tips.guide === 1){
                win.width() - (fowo.left + fowo.width + layArea[0] + 8*2) > 0 || fowo.where[3]()
            } else if (config.tips.guide === 2){
                (fowo.top - win.scrollTop() + fowo.height + layArea[1] + 8*2) - win.height() > 0 && fowo.where[0]();
            } else if (config.tips.guide === 3){
               layArea[0] + 8*2 - fowo.left > 0 && fowo.where[1]()
            }
            layerE.css({left: fowo.tipLeft, top: fowo.tipTop});
        break;
        
        default:
            that.layerMian.css({'background-color': '#fff'});
            if(config.title[1]){
                that.layerText.css({paddingTop: 18 + that.layerTitle.outerHeight()});
            }else{
                layerE.find('.xubox_msgico').css({top: 8});
                that.layerText.css({marginTop : 11});	
            }
        break;
    };
    
    config.fadeIn && layerE.css({opacity: 0}).animate({opacity: 1}, config.fadeIn);
    that.move();
};

//自适应宽高
Class.pt.autoArea = function(times){
    
    var that = this, layerE = that.layerE, config = that.config, page = config.page,
    layerMian = that.layerMian, layerBtn = that.layerBtn, layerText = that.layerText,
    layerPage = that.layerPage, layerB = that.layerB, titHeight, outHeight, btnHeight = 0, 
    load = $(".xubox_loading");
    if(config.area[0] === 'auto' && layerMian.outerWidth() >= config.maxWidth){	
        layerE.css({width : config.maxWidth});
    }
    config.title[1] ? titHeight = that.layerTitle.innerHeight() : titHeight = 0;
    switch(config.type){
        case 0:
            var aBtn = layerBtn.find('a');
            outHeight =  layerText.outerHeight() + 20;
            if(aBtn.length > 0){
                btnHeight = aBtn.outerHeight() +  20;
            }
        break;
        case 1:
            outHeight = $(page.dom).outerHeight();
            config.area[0] === 'auto' && layerE.css({width : layerPage.outerWidth()});
            if(page.html !== '' || page.url !== ''){
                outHeight = layerPage.outerHeight();
            }
        break;
        case 3:
            outHeight = load.outerHeight(); 
            layerMian.css({width: load.width()});
        break;
    };
    (config.area[1] === 'auto') && layerMian.css({height: titHeight + outHeight + btnHeight});
    layerB.css({width: layerE.outerWidth() + 2*config.border[0] , height: layerE.outerHeight() + 2*config.border[0]});
    (layer.ie6 && config.area[0] != 'auto') && layerMian.css({width : layerE.outerWidth()});
    (config.offset[1] === '50%' || config.offset[1] == '') && (config.type !== 4) ? layerE.css({marginLeft : -layerE.outerWidth()/2}) : layerE.css({marginLeft : 0});
};

//拖拽层
Class.pt.move = function(){
    var that = this, config = this.config, dom = that.dom, conf = {
        setY: 0,
        moveLayer: function(){
            if(parseInt(conf.layerE.css('margin-left')) == 0){
                var lefts = parseInt(conf.move.css('left'));
            }else{
                var lefts = parseInt(conf.move.css('left')) + (-parseInt(conf.layerE.css('margin-left')))
            }
            if(conf.layerE.css('position') !== 'fixed'){
                lefts = lefts - conf.layerE.parent().offset().left;
                conf.setY = 0
            }
            conf.layerE.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
        }
    };
    
    config.move[1] && that.layerE.find(config.move[0]).attr('move','ok');
    config.move[1] ? that.layerE.find(config.move[0]).css({cursor: 'move'}) : that.layerE.find(config.move[0]).css({cursor: 'auto'});
    
    $(config.move[0]).on('mousedown', function(M){	
        M.preventDefault();
        if($(this).attr('move') === 'ok'){
            conf.ismove = true;
            conf.layerE = $(this).parents('.'+ dom.lay);
            var xx = conf.layerE.offset().left, yy = conf.layerE.offset().top, ww = conf.layerE.width() - 6, hh = conf.layerE.height() - 6;
            if(!$('#xubox_moves')[0]){
                $('body').append('<div id="xubox_moves" class="xubox_moves" style="left:'+ xx +'px; top:'+ yy +'px; width:'+ ww +'px; height:'+ hh +'px; z-index:2147483584"></div>');
            }
            conf.move = $('#xubox_moves');
            config.moveType && conf.move.css({opacity: 0});
           
            conf.moveX = M.pageX - conf.move.position().left;
            conf.moveY = M.pageY - conf.move.position().top;
            conf.layerE.css('position') !== 'fixed' || (conf.setY = win.scrollTop());
        }
    });
    
    $(document).mousemove(function(M){			
        if(conf.ismove){
            var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
            M.preventDefault();

            //控制元素不被拖出窗口外
            if(!config.moveOut){
                conf.setY = win.scrollTop();
                var setRig = win.width() - conf.move.outerWidth() - config.border[0], setTop = config.border[0] + conf.setY;               
                offsetX < config.border[0] && (offsetX = config.border[0]);
                offsetX > setRig && (offsetX = setRig); 
                offsetY < setTop && (offsetY = setTop);
                offsetY > win.height() - conf.move.outerHeight() - config.border[0] + conf.setY && (offsetY = win.height() - conf.move.outerHeight() - config.border[0] + conf.setY);
            }
            
            conf.move.css({left: offsetX, top: offsetY});	
            config.moveType && conf.moveLayer();
            
            offsetX = null;
            offsetY = null;
            setRig = null;
            setTop = null
        }					  						   
    }).mouseup(function(){
        try{
            if(conf.ismove){
                conf.moveLayer();
                conf.move.remove();
            }
            conf.ismove = false;
        }catch(e){
            conf.ismove = false;
        }
        config.moveEnd && config.moveEnd();
    });
};

//自动关闭layer
Class.pt.autoclose = function(){
    var that = this, time = this.config.time, maxLoad = function(){
        time--;
        if(time === 0){
            layer.close(that.index);
            clearInterval(that.autotime);
        }
    };
    this.autotime = setInterval(maxLoad , 1000);
};

ready.config = {
    end : {}
};

Class.pt.callback = function(){
    var that = this, layerE = that.layerE, config = that.config, dialog = config.dialog;
    that.openLayer();
    that.config.success(layerE);
    layer.ie6 && that.IE6();

    layerE.find('.xubox_close').off('click').on('click', function(e){
        e.preventDefault();
        config.close(that.index);
    });
    
    layerE.find('.xubox_yes').off('click').on('click',function(e){
        e.preventDefault();
        config.yes ? config.yes(that.index) : dialog.yes(that.index);
    });
    
    layerE.find('.xubox_no').off('click').on('click',function(e){
        e.preventDefault();
        config.no ? config.no(that.index) : dialog.no(that.index);
    });
    
    this.layerS.off('click').on('click', function(e){
        e.preventDefault();
        that.config.shadeClose && layer.close(that.index);
    });
    
    ready.config.end[that.index] = config.end;
};

Class.pt.IE6 = function(){
    var that = this, layerE = that.layerE, select = $('select'), dom = that.dom;
    var _ieTop =  layerE.offset().top;	
    //ie6的固定与相对定位
    if(that.config.fix){
        var ie6Fix = function(){
            layerE.css({top : $(document).scrollTop() + _ieTop});
        };	
    }else{
        var ie6Fix = function(){
            layerE.css({top : _ieTop});	
        };
    }
    ie6Fix();
    win.scroll(ie6Fix);

    //隐藏select
    $.each(select, function(index , value){
        var sthis = $(this);
        if(!sthis.parents('.'+dom.lay)[0]){
            sthis.css('display') == 'none' || sthis.attr({'layer' : '1'}).hide();
        }
        sthis = null;
    });

    //恢复select
    that.reselect = function(){
        $.each(select, function(index , value){
            var sthis = $(this);
            if(!sthis.parents('.'+dom.lay)[0]){
                (sthis.attr('layer') == 1 && $('.'+dom.lay).length < 1) && sthis.removeAttr('layer').show(); 
            }
            sthis = null;
        });
    }; 
};

//给layer对象拓展方法
Class.pt.openLayer = function(){
    var that = this, dom = that.dom;

    //自适应宽高
    layer.autoArea = function(index){
        return that.autoArea(index);
    };

    //获取layer当前索引
    layer.getIndex = function(selector){
        return $(selector).parents('.'+dom.lay).attr('times');	
    };

    //获取子iframe的DOM
    layer.getChildFrame = function(selector, index){
        index = index || $('.'+ dom.ifr).parents('.'+dom.lay).attr('times');
        return $('#'+ dom.lay + index).find('.'+ dom.ifr).contents().find(selector);	
    };

    //得到当前iframe层的索引，子iframe时使用
    layer.getFrameIndex = function(name){
        return $(name ? '#'+ name : '.'+ dom.ifr).parents('.'+dom.lay).attr('times');
    };

    //iframe层自适应宽高
    layer.iframeAuto = function(index){
        index = index || $('.'+ dom.ifr).parents('.'+dom.lay).attr('times');
        var heg = this.getChildFrame('body', index).outerHeight(),
        lbox = $('#'+ dom.lay + index), tit = lbox.find('.xubox_title'), titHt = 0;
        !tit || (titHt = tit.height());
        lbox.css({height: heg + titHt});
        var bs = -parseInt($('#xubox_border'+ index).css('top'));
        $('#xubox_border'+ index).css({height: heg + 2*bs + titHt});
        $('#'+ dom.ifr + index).css({height: heg});
    };

    //关闭layer
    layer.close = function(index){
        var layerNow = $('#'+ dom.lay + index), shadeNow = $('#xubox_moves, #xubox_shade' + index);
        if(layerNow.attr('type') == that.type[1]){
            if(layerNow.find('.xuboxPageHtml')[0]){
                layerNow.remove();
            }else{
                layerNow.find('.xubox_close,.xubox_botton,.xubox_title,.xubox_border').remove();
                for(var i = 0 ; i < 3 ; i++){
                    layerNow.find('.layer_pageContent').unwrap().hide();
                }
            }
        }else{
            document.all && layerNow.find('#'+ dom.ifr + index).remove();
            layerNow.remove();
        }
        shadeNow.remove();
        layer.ie6 && that.reselect();
        typeof ready.config.end[index] === 'function' && ready.config.end[index]();
        delete ready.config.end[index];
    };

    //关闭加载层
    layer.loadClose = function(){
        var parent = $('.xubox_loading').parents('.'+dom.lay),
        index = parent.attr('times');
        layer.close(index);
    };

    //出场内置动画
    layer.shift = function(type, rate){
        var config = that.config, iE6 = layer.ie6, layerE = that.layerE, cutWth = 0, ww = win.width(), wh = win.height();
        (config.offset[1] == '50%' || config.offset[1] == '') ? cutWth = layerE.outerWidth()/2 : cutWth = layerE.outerWidth();
        var anim = {
            t: {top : config.border[0]},
            b: {top : wh - layerE.outerHeight() - config.border[0]},
            cl: cutWth + config.border[0],
            ct: -layerE.outerHeight(),
            cr: ww - cutWth - config.border[0],
            fn: function(){
                iE6 && that.IE6();	
            }
        };
        switch(type){
            case 'left-top':
                layerE.css({left: anim.cl, top: anim.ct}).animate(anim.t, rate, anim.fn);
            break; 
            case 'top':
                layerE.css({top: anim.ct}).animate(anim.t, rate, anim.fn);
            break;
            case 'right-top':
                layerE.css({left: anim.cr, top: anim.ct}).animate(anim.t, rate, anim.fn);
            break;
            case 'right-bottom':
                layerE.css({left: anim.cr, top: wh}).animate(anim.b, rate, anim.fn);
            break;
            case 'bottom':
                layerE.css({top: wh}).animate(anim.b, rate, anim.fn);
            break;
            case 'left-bottom':
                layerE.css({left: anim.cl, top: wh}).animate(anim.b, rate, anim.fn);
            break;
            case 'left':
                layerE.css({left: -layerE.outerWidth(), marginLeft:0}).animate({left:anim.t.top}, rate, anim.fn);
            break;
            
        };	
    };

    //初始化拖拽元素
    layer.setMove = function(){
        return that.move();
    };

    //给指定层重置属性
    layer.area = function(index, options){
        var nowobect = [$('#'+ dom.lay + index), $('#xubox_border'+ index)],
        type = nowobect[0].attr('type'), main = nowobect[0].find('.xubox_main'),
        title = nowobect[0].find('.xubox_title');
        if(type === that.type[1] || type === that.type[2]){
            nowobect[0].css(options);
            main.css({height: options.height});
            if(type === that.type[2]){
                var iframe = nowobect[0].find('iframe');
                iframe.css({width: options.width, height: title ? options.height - title.outerHeight() : options.height});
            }
            if(nowobect[0].css('margin-left') !== '0px') {
                options.hasOwnProperty('top') && nowobect[0].css({top: options.top - (nowobect[1][0] && parseInt(nowobect[1].css('top')))});
                options.hasOwnProperty('left') && nowobect[0].css({left: options.left + nowobect[0].outerWidth()/2 - (nowobect[1][0] && parseInt(nowobect[1].css('left')))})
                nowobect[0].css({marginLeft : -nowobect[0].outerWidth()/2});
            }
            if(nowobect[1][0]){
                nowobect[1].css({
                    width: parseFloat(options.width) - 2*parseInt(nowobect[1].css('left')), 
                    height: parseFloat(options.height) - 2*parseInt(nowobect[1].css('top'))
                });
            }
        }
    };

    //关闭所有层
    layer.closeAll = function(){
        var layerObj = $('.'+dom.lay);
        $.each(layerObj, function(){
            var i = $(this).attr('times');
            layer.close(i);
        });
    };
    
    //关闭tips层
    layer.closeTips = function(){
        var tips = $('.xubox_tips');
        if(tips[0]){
            layer.close(tips.parents('.xubox_layer').attr('times'));
        }
    };
    
    //重置iframe url
    layer.iframeSrc = function(index, url){
        $('#'+ dom.lay + index).find('iframe').attr('src', url);
    };

    //置顶当前窗口
    layer.zIndex = that.config.zIndex;
    layer.setTop = function(layerNow){
        var setZindex = function(){
            layer.zIndex++;
            layerNow.css('z-index', layer.zIndex + 1);
        };
        layer.zIndex = parseInt(layerNow[0].style.zIndex);
        layerNow.on('mousedown', setZindex);
        return layer.zIndex;
    };
};

//主入口
ready.run = function(){
    $ = jQuery; 
    win = $(window);
    $.layer = function(deliver){
        var o = new Class(deliver);
        return o.index;
    };
};

ready.run();

}(window);