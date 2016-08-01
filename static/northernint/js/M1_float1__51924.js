/*****
鎬ц兘鏇村ソ鐨刯s鍔ㄧ敾瀹炵幇鏂瑰紡鈥斺€攔equestAnimationFrame
鍦ㄦ墍鏈夋祻瑙堝櫒涓婁娇鐢╮equestAnimationFrame鍜宑ancelAnimationFrame
*****/
var lastTime = 0;
var prefixes = 'webkit moz ms o'.split(' '); //鍚勬祻瑙堝櫒鍓嶇紑
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;
var prefix;
//閫氳繃閬嶅巻鍚勬祻瑙堝櫒鍓嶇紑锛屾潵寰楀埌requestAnimationFrame鍜宑ancelAnimationFrame鍦ㄥ綋鍓嶆祻瑙堝櫒鐨勫疄鐜板舰寮�
for( var i = 0; i < prefixes.length; i++ ) {
    if ( requestAnimationFrame && cancelAnimationFrame ) {
      break;
    }
    prefix = prefixes[i];
    requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
    cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
}
//濡傛灉褰撳墠娴忚鍣ㄤ笉鏀寔requestAnimationFrame鍜宑ancelAnimationFrame锛屽垯浼氶€€鍒皊etTimeout
if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime();
      //涓轰簡浣縮etTimteout鐨勫敖鍙兘鐨勬帴杩戞瘡绉�60甯х殑鏁堟灉
      var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ); 
      var id = window.setTimeout( function() {
        callback( currTime + timeToCall );
      }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };
    
    cancelAnimationFrame = function( id ) {
      window.clearTimeout( id );
    };
}
//寰楀埌鍏煎鍚勬祻瑙堝櫒鐨凙PI
window.requestAnimationFrame = requestAnimationFrame; 
window.cancelAnimationFrame = cancelAnimationFrame;


var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1
	var x11 = y = 0;
	var xin = true;
	var yin = true;
	var step  = 1;
	var delay = 25;
	var obj = document.getElementById("floatAds"); 
	var it = undefined;
	function floatADM(){ 
		var L = 0;
		/******/
		if(isChrome){
			var T = 0; 
		}else{
			var T = (document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop); 
		}
		var R = document.body.clientWidth-obj.offsetWidth; 
		var B = T + ((document.body.clientHeight > document.documentElement.clientHeight)?document.documentElement.clientHeight:document.body.clientHeight) - obj.offsetHeight;
		obj.style.left = x11 + document.body.scrollLeft+"px"; 
		obj.style.top = y + document.body.scrollTop+"px"; 
		x11 =x11 + step*(xin?1:-1); 
			if (x11 < L)
			{
				xin = true; x11 = L;
			}
			if (x11 > R)
			{
				xin = false; x11 = R;
			}
			y = y + step * (yin?1:-1);
			if (y < T)
			{
				yin = true; y = T; 
			}
			if (y > B)
			{
				yin = false; y = B; 
			}
			it = window.requestAnimationFrame(floatADM);
	}
	//var itl = setInterval("floatADM()", delay);
	it = window.requestAnimationFrame(floatADM);
	obj.onmouseover = function(){ 
		window.cancelAnimationFrame(it);
		//clearInterval(itl) 
	}
	obj.onmouseout  = function(){ 
		//itl = setInterval("floatADM()", delay) 
		it=window.requestAnimationFrame(floatADM);
	}