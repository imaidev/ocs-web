//密码强度
	function checkRepetition(pLen,str) {
	    var res = "";
	 for (var i=0; i<str.length ; i++ ) 
	 {
	     var repeated=true;
	     
	     for (var j=0;j < pLen && (j+i+pLen) < str.length;j++){
	         repeated=repeated && (str.charAt(j+i)==str.charAt(j+i+pLen));
	         }
	     if (j<pLen){repeated=false;}
	     if (repeated) {
	         i+=pLen-1;
	         repeated=false;
	     }
	     else {
	         res+=str.charAt(i);
	     }
	 }
	 return res;
	    }

	function testPassWordStrength(password){
	        var score = 0; 
	    
	    //password < 6
	    if (password.length < 6 ) { return 0; }
	    
	    //password == user name登录名允许使用汉字，所以去掉该评分标准
	    //if (password.toLowerCase()==username.toLowerCase()){return 1;}
	    
	    //password length
	    score += password.length *6;
	    score += (checkRepetition(1,password).length - password.length ) * 1;
	    score += (checkRepetition(2,password).length - password.length ) * 1;
	    score += (checkRepetition(3,password).length - password.length ) * 1;
	    score += (checkRepetition(4,password).length - password.length ) * 1;
	    score += (checkRepetition(5,password).length - password.length ) * 1;
	    score += (checkRepetition(6,password).length - password.length ) * 1;
	    //password has 3 numbers
	    if (password.match(/(.*[0-9].*[0-9].*[0-9])/)){ score += 5;} 
	    
	    //password has 2 symbols
	    if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){ score += 5 ;}
	    
	    //password has Upper and Lower chars
	    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){  score += 10;} 
	    
	    //password has number and chars
	    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){  score += 15;} 
	    //
	    //password has number and symbol
	    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)){  score += 15;} 
	    
	    //password has char and symbol
	    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)){score += 15;}
	    
	    //password is just a numbers or chars
	    if (password.match(/^\w+$/) || password.match(/^\d+$/) ){ score -= 10;}
	    
	    //verifying 0 < score < 100
	    if ( score < 0 ){ return 0;} 
	    else if (score < 34 ){ return 1;} 
	    else if (score < 68 ){return 2;}
	    else if ( score < 100 ){  return 3;} 
	    else if ( score > 100 ){  return 4;} 
	}
