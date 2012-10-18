/*
 * my utils
 */


/**
 * cookieString: cookie string in the format session_key=session_value
 */
exports.parseCookieString = function(cookieString) {
	console.log(cookieString);
	
	idx = cookieString.indexOf('=');
	
	return cookieString.substring(idx + 1).trim();
}

