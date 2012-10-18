exports.filter = function(arr, filterFunc) {
	newArr = new Array();
	
	for(var i = 0; i < arr.length; i++) {
		if (filterFunc(arr[i])) {
			newArr.push(arr[i]);
		}
	}
	
	return newArr;
};

exports.forEach = function(arr, func) {
	newArr = new Array();
	
	for(var i = 0; i < arr.length; i++) {
		newArr.push(func(arr[i]));
	}
	
	return newArr;
};

exports.onEach = function(arr, func) {
	for(var i = 0; i < arr.length; i++) {
		func(arr[i], i == arr.length - 1);
	}
};