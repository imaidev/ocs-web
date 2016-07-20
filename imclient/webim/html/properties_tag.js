
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

