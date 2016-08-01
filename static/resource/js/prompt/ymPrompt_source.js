/** 
 * ymPrompt.js ��Ϣ��ʾ���
 * @author netman8410@163.com
 */
//<meta http-equiv="X-UA-Compatible" content="IE=7" />  IE8͸���Ƚ������
(function() {
	if (window.ymPrompt) return;
	window.ymPrompt = {
		version: '4.0',
		pubDate: '2009-02-03',
		apply: function(o, c, d) {
			if (d) ymPrompt.apply(o, d);
			if (o && c && typeof c == 'object') for (var p in c) o[p] = c[p];
			return o;
		},
		eventList: []
	};
	/*��ʼ������Ľӿڣ���ֹ�ⲿ����ʧ�ܡ�_initFn:�����ʼ���ô���Ĳ���*/
	var initFn = ['getPage', 'resizeWin', 'doHandler', 'close', 'setDefaultCfg','show'], _initFn = {},t;
	while(t=initFn.shift()) ymPrompt[t] = eval('0,function(){_initFn.'+t+'=arguments}');

	/*����Ϊ���ú������*/
	var useIframe = /MSIE (\d)\./.test(navigator.userAgent) && parseInt(RegExp.$1) < 7; //�Ƿ���Ҫ��iframe������
	var $ = function(id) {
		return document.getElementById(id)
	}; //��ȡԪ��
	var $height = function(obj) {
		return parseInt(obj.style.height) || obj.offsetHeight
	}; //��ȡԪ�ظ߶�
	var addEvent = (function() {
		return new Function('env','fn','obj',['obj=obj||document;', window.attachEvent ? "obj.attachEvent('on'+env,fn)": 'obj.addEventListener(env,fn,false)', ';ymPrompt.eventList.push([env,fn,obj])'].join(''))
	})(); //�¼���
	var detachEvent = (function() {
		return new Function('env','fn','obj',['obj=obj||document;', window.attachEvent ? "obj.detachEvent('on'+env,fn)": 'obj.removeEventListener(env,fn,false)'].join(''))
	})(); //ȡ���¼���
	//ΪԪ�ص��ض���ʽ�����趨ֵ
	var setStyle = function(el, n, v) {
		if (!el) return;
		if (typeof n == 'object') {
			for (var i in n) setStyle(el, i, n[i]);
			return;
		}
		/*dom�����dom����*/
		if (el instanceof Array || /htmlcollection|nodelist/i.test(''+el)) {
			for (var i = el.length - 1; i >= 0; i--) setStyle(el[i], n, v);
			return;
		}
		el.style[n] = v;
	};
	/*----------------��ҵ���йصĹ��ú���-----------------*/
	var btnIndex = 0, btnCache, seed = 0; //��ǰ����İ�ť������ǰ���ڵİ�ť��id����
	/*������ť*/
	var defaultBtn=function(){return {OK:[curCfg.okTxt, 'ok'], CANCEL:[curCfg.cancelTxt, 'cancel']}};
	var mkBtn = function(txt, sign, autoClose, id) {
		if (!txt) return;
		if (txt instanceof Array) {
			/*��Ч��ťɾ��*/
			var item,t=[];
			while(txt.length) (item=txt.shift())&&t[t.push(mkBtn.apply(null, defaultBtn()[item]||item))-1]||t.pop();
			return t;
		}
		id = id || 'ymPrompt_btn_' + seed++;
		autoClose = typeof autoClose == 'undefined' ? 'undefined': !!autoClose;
		return {
			id: id,
			html: "<input type='button' id='" + id + "' onclick='ymPrompt.doHandler(\"" + sign + "\"," + autoClose + ")' style='cursor:pointer' class='btnStyle handler' value='" + txt + "' />"
		};
	}
	/*��ɰ�ť��ϵ�html*/
	var joinBtn = function(btn) {
		if (!btn) return btnCache = '';
		if (! (btn instanceof Array)) btn = [btn];
		if(!btn.length) return btnCache='';
		btnCache = btn.concat();
		var html=[];
		while(btn.length) html.push(btn.shift().html);
		return html.join('&nbsp;&nbsp;');
	}
	/*Ĭ����ʾ���ü��û���ǰ����*/
	var dftCfg = {
		titleBar: true,
		fixPosition: false,
		dragOut: true,
		autoClose: true,
		showMask: true,
		maskAlphaColor: '#000',	//����͸��ɫ
		maskAlpha: 0.1,		//����͸����
		title: '����',		//��Ϣ�����
		message: '����',	//��Ϣ��ť
		width: 300,
		height: 185,
		winPos: 'c',
		iframe: false,
		btn: null,
		closeTxt: '�ر�',
		okTxt:' ȷ �� ',
		cancelTxt:' ȡ �� ',
		icoCls: '',
		handler: function() {} //�ص��¼�
	},curCfg = {};
	/*��ʼ����*/
	(function() {
		if (!document.body || typeof document.body != 'object') return addEvent('load', arguments.callee, window); //�ȴ�ҳ��������
		var rootEl = document.compatMode == 'CSS1Compat' ? document.documentElement: document.body; //���html Doctype��ȡhtml��ڵ㣬�Լ��ݷ�xhtml��ҳ��
		/*���洰�ڶ�λ��Ϣ*/
		var saveWinInfo = function() {
			ymPrompt.apply(dragVar, {
				offX: ym_win.offsetLeft-rootEl.scrollLeft,	//�����������Ļ��λ�Ʋ�
				offY: ym_win.offsetTop-rootEl.scrollTop
			});
		};
		/*-------------------------��������html-------------------*/
		var maskStyle = 'position:absolute;top:0;left:0;display:none;text-align:center';
		var div = document.createElement('div');
		div.innerHTML = [
		/*����*/
		"<div id='maskLevel' style=\'" + maskStyle + ';z-index:10000;\'></div>', useIframe ? ("<iframe id='maskIframe' style='" + maskStyle + ";z-index:9999;filter:alpha(opacity=0);opacity:0'></iframe>") : '',
		/*����*/
		"<div id='ym-window' style='position:absolute;z-index:10001;display:none'>", useIframe ? "<iframe style='width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1'></iframe>": '', "<div class='ym-tl' id='ym-tl'><div class='ym-tr'><div class='ym-tc' style='cursor:move;'><div class='ym-header-text'></div><div class='ym-header-tools'></div></div></div></div>", "<div class='ym-ml' id='ym-ml'><div class='ym-mr'><div class='ym-mc'><div class='ym-body'></div></div></div></div>", "<div class='ym-ml' id='ym-btnl'><div class='ym-mr'><div class='ym-btn'></div></div></div>", "<div class='ym-bl' id='ym-bl'><div class='ym-br'><div class='ym-bc'></div></div></div>", "</div>"].join('');
		document.body.appendChild(div),div = null;

		var dragVar = {};
		/*mask��window*/
		var maskLevel = $('maskLevel');
		var maskIframe = $('maskIframe');
		var ym_win = $('ym-window');
		/*header*/
		var ym_headbox = $('ym-tl');
		var ym_head = ym_headbox.firstChild.firstChild;
		var ym_hText = ym_head.firstChild;
		var ym_hTool = ym_hText.nextSibling;
		/*content*/
		var ym_body = $('ym-ml').firstChild.firstChild.firstChild;
		/*button*/
		var ym_btn = $('ym-btnl');
		var ym_btnContent = ym_btn.firstChild.firstChild;
		/*bottom*/
		var ym_bottom = $('ym-bl');
		/*���¼�*/
		var mEvent=function(e) { 
			e = e || window.event;
			var sLeft = dragVar.offX + (e.x||e.pageX);
			var sTop = dragVar.offY + (e.y||e.pageY);

			if (!curCfg.dragOut) {
				var sl = rootEl.scrollLeft,st = rootEl.scrollTop;
				sLeft = Math.min(Math.max(sLeft, sl), rootEl.clientWidth - ym_win.offsetWidth + sl);
				sTop = Math.min(Math.max(sTop, st), rootEl.clientHeight - ym_win.offsetHeight + st);
			}
			try{setStyle(ym_win, {
				left: sLeft + "px",
				top: sTop + "px"
			});}catch(e){}
		};	//mousemove�¼�
		var uEvent=function() {
			var bindEl=ym_head.releaseCapture&&ym_head;
			detachEvent("mousemove",mEvent,bindEl);
			detachEvent("mouseup",uEvent,bindEl);
			saveWinInfo();
			bindEl&&(detachEvent("losecapture",uEvent,bindEl),bindEl.releaseCapture());
		};	//mouseup�¼�
		addEvent('mousedown',function(e) {
			e = e || window.event;
			ymPrompt.apply(dragVar, {
				offX: ym_win.offsetLeft-(e.x||e.pageX),	//����뵯��������Ͻǵ�λ�Ʋ�
				offY: ym_win.offsetTop-(e.y||e.pageY)
			});
			var bindEl=ym_head.setCapture&&ym_head;
			addEvent("mousemove",mEvent,bindEl);
			addEvent("mouseup",uEvent,bindEl);
			bindEl&&(addEvent("losecapture",uEvent,bindEl),bindEl.setCapture());
		},ym_head);
		
		/*���̼���*/
		var keydownEvent=function(e) {
			var e = e || event;
			if(e.keyCode==27) destroy();//esc��
			if(btnCache){
				var l = btnCache.length,nofocus;
				/*tab��/���ҷ�����л�����*/
				document.activeElement.id!=btnCache[btnIndex].id && (nofocus=true);
				if (e.keyCode == 9 || e.keyCode == 39) nofocus&&(btnIndex=-1),$(btnCache[++btnIndex == l ? (--btnIndex) : btnIndex].id).focus();
				if (e.keyCode == 37) nofocus&&(btnIndex=l),$(btnCache[--btnIndex < 0 ? (++btnIndex) : btnIndex].id).focus();
				if (e.keyCode == 13) return true;
			}
			/*�������м��̲�������ˢ�µ�*/
			if ((e.keyCode > 110 && e.keyCode < 123) || e.keyCode == 9 || e.keyCode == 13) {
				try {
					e.returnValue=!(e.cancelBubble = true);
					e.keyCode = 0;
				} catch(ex) {
					try {
						e.stopPropagation();
						e.preventDefault();
					} catch(e) {}
				}
			}
		};
		/*ҳ������������ڹ���*/
		var scrollEvent=function(){
			setStyle(ym_win, {
				left: (dragVar.offX + rootEl.scrollLeft) + 'px',
				top: (dragVar.offY + rootEl.scrollTop) + 'px'
			});
		};
		maskLevel.oncontextmenu = ym_win.onselectstart = ym_win.oncontextmenu = function() {return false}; //��ֹ�Ҽ�
		/*���¼������ֵĴ�С*/
		var _resizeMask=function(){
			setStyle([maskLevel, maskIframe], {
				width: rootEl.scrollWidth + 'px',
				height: rootEl.scrollHeight + 'px',
				display:''
			});
		};
		var resizeMask=function(){
			setStyle([maskLevel, maskIframe], 'display', 'none');	//������
			/*IE�±������ӳٲ�����ȷ����*/
			!+'\v1'?setTimeout(_resizeMask,0):_resizeMask();
		}
		/*�ɰ����ʾ����,state:true��ʾ,false���أ�Ĭ��Ϊtrue*/
		var maskVisible = function(visible) {
			if (!curCfg.showMask) return;
			setStyle([maskLevel, maskIframe], 'display', 'none');	//������
			(visible === false?detachEvent:addEvent)("resize",resizeMask,window);
			if (visible === false) return;
			setStyle(maskLevel, {
				background: curCfg.maskAlphaColor,
				filter: 'alpha(opacity=' + (curCfg.maskAlpha * 100) + ')',
				opacity: curCfg.maskAlpha
			});
			resizeMask();
			
		}; 
		var getPos=function(f){
			var pos=[rootEl.clientWidth - ym_win.offsetWidth, rootEl.clientHeight - ym_win.offsetHeight, rootEl.scrollLeft, rootEl.scrollTop];
			var arr=f.replace(/\{(\d)\}/g,function(s,s1){return pos[s1]}).split(',');
			return [eval(arr[0]),eval(arr[1])];
		}
		var posMap = {
			c: '{0}/2+{2},{1}/2+{3}',
			l: '{2},{1}/2+{3}',
			r: '{0}+{2},{1}/2+{3}',
			t: '{0}/2+{2},{3}',
			b: '{0}/2,{1}+{3}',
			lt: '{2},{3}',
			lb: '{2},{1}+{3}',
			rb: '{0}+{2},{1}+{3}',
			rt: '{0}+{2},{3}'
		}
		var SetWinSize = function(w, h) {
			if (!ym_win || ym_win.style.display == 'none') return;
			curCfg.height = parseInt(h) || dftCfg.height;
			curCfg.width = parseInt(w) || dftCfg.width;
			setStyle(ym_win, {
				left: 0,
				top: 0,
				width: curCfg.width + 'px',
				height: curCfg.height + 'px'
			});
			var pos = posMap[curCfg.winPos];
			pos = pos ? getPos(pos) : curCfg.winPos; //֧���Զ������
			if(!(pos instanceof Array))pos=getPos(posMap['c']);
			setStyle(ym_win, {
				top: pos[1] + 'px',
				left: pos[0] + 'px'
			});
			saveWinInfo();	//���浱ǰ����λ����Ϣ
			setStyle(ym_body, 'height', curCfg.height - $height(ym_headbox) - $height(ym_btn) - $height(ym_bottom) + 'px'); //�趨������ĸ߶�
		};
		var _obj=[];	//IE�пɼ��objԪ��
		var winVisible = function(visible) {
			var fn=visible===false?detachEvent:addEvent;
			if (curCfg.fixPosition) fn("scroll", scrollEvent, window);
			fn("keydown", keydownEvent);
			if (visible === false) {
				setStyle(ym_win, 'display', 'none');
				setStyle(_obj, 'visibility', 'visible');
				_obj=[];
				return ;
			}
			for(var o=document.getElementsByTagName('object'),i=o.length-1;i>-1;i--) o[i].style.visibility!='hidden'&&_obj.push(o[i])&&(o[i].style.visibility='hidden');
			setStyle([ym_hText, ym_hTool], 'display', curCfg.titleBar ? '': 'none');
			ym_head.className = 'ym-tc' + (curCfg.titleBar ? '': ' ym-ttc');
			ym_hText.innerHTML = curCfg.title; //����
			ym_hTool.innerHTML = "<div class='ymPrompt_close' title='"+curCfg.closeTxt+"' onclick='ymPrompt.doHandler(\"close\")'>&nbsp;</div>";
			ym_body.innerHTML = !curCfg.iframe ? ('<div class="ym-content">' + curCfg.message + '</div>') : "<iframe width='100%' height='100%' border='0' frameborder='0' src='" + curCfg.message + "'></iframe>"; //����
			ym_body.className = "ym-body " + curCfg.icoCls; //ͼ������
			setStyle(ym_btn, 'display', (ym_btnContent.innerHTML = joinBtn(mkBtn(curCfg.btn))) ? '': 'none'); //û�а�ť������
			setStyle(ym_win, 'display', '');
			SetWinSize(curCfg.width, curCfg.height);
			btnCache && $(btnCache[btnIndex = 0].id).focus(); //��һ����ť��ȡ����
		}; //��ʼ��
		var init = function() {
			maskVisible();
			winVisible();
		}; //���
		var destroy = function() {
			maskVisible(false);
			winVisible(false);
		};
		ymPrompt.apply(ymPrompt, {
			close: destroy,
			getPage: function() {
				return ym_body.firstChild.tagName.toLowerCase() == 'iframe' ? ym_body.firstChild: null
			},
			/*��ʾ��Ϣ��,fargs:�������ã��Ḳ��args�е�����*/
			show: function(args, fargs) {
				/*֧�����ֲ����뷽ʽ:(1)JSON��ʽ (2)���������*/
				var a = Array.prototype.slice.call(args, 0),
				o = {};
				if (typeof a[0] != 'object') {
					var cfg = ['message', 'width', 'height', 'title', 'handler', 'maskAlphaColor', 'maskAlpha', 'iframe', 'icoCls', 'btn', 'autoClose', 'fixPosition', 'dragOut', 'titleBar', 'showMask', 'winPos'];
					for (var i = 0,l = a.length; i < l; i++) if (a[i]) o[cfg[i]] = a[i];
				} else {
					o = a[0];
				}
				ymPrompt.apply(curCfg, ymPrompt.apply({},o, fargs), ymPrompt.setDefaultCfg()); //�Ȼ�ԭĬ������
				/*����curCfg�е���Чֵ(null/undefined)��ΪĬ��ֵ*/
				for(var i in curCfg) curCfg[i]=curCfg[i]!=null?curCfg[i]:ymPrompt.cfg[i];
				init();
			},
			doHandler: function(sign, autoClose) {
				if (typeof autoClose == 'undefined' ? curCfg.autoClose: autoClose) destroy();
				eval(curCfg.handler)(sign);
			},
			resizeWin: SetWinSize,
			/*�趨Ĭ������*/
			setDefaultCfg: function(cfg) {
				return ymPrompt.cfg = ymPrompt.apply({},
				cfg, ymPrompt.apply({},
				ymPrompt.cfg, dftCfg));
			}
		});
		ymPrompt.setDefaultCfg(); //��ʼ��Ĭ������
		/*ִ���û���ʼ��ʱ�ĵ���*/
		for (var i in _initFn) ymPrompt[i].apply(null, _initFn[i]);
		/*ȡ���¼���*/
		addEvent('unload',function() {
			while(ymPrompt.eventList.length) detachEvent.apply(null, ymPrompt.eventList.shift());
		},window);
	})();
})(); //����Ϣ�����ͬ����
ymPrompt.apply(ymPrompt, {
	alert: function() {
		ymPrompt.show(arguments, {
			icoCls: 'ymPrompt_alert',
			btn: ['OK']
		});
	},
	succeedInfo: function() {
		ymPrompt.show(arguments, {
			icoCls: 'ymPrompt_succeed',
			btn: ['OK']
		});
	},
	errorInfo: function() {
		ymPrompt.show(arguments, {
			icoCls: 'ymPrompt_error',
			btn: ['OK']
		});
	},
	confirmInfo: function() {
		ymPrompt.show(arguments, {
			icoCls: 'ymPrompt_confirm',
			btn: ['OK','CANCEL']
		});
	},
	win: function() {
		ymPrompt.show(arguments);
	}
});
