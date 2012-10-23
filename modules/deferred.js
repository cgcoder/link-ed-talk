var fs = require('fs');

var deferrer = {
	newDeferred: function(asyncFunc, errFunc) {
	
		return {
			funcChain: new Array(asyncFunc)
				, lastFunc: null
				, errFunc: errFunc
				
				, start: function() {
					this._next.apply(this, arguments);
				
				return this;
			}
		
		, _next: function() {
			if (this.funcChain.length > 0) {
				func = this.funcChain.splice(0, 1);
				this.lastFunc = func[0];
				
				args = new Array();
				args.push(this);
				
				for(i = 0; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				
				func[0].apply(this, args);
			}
			return this;
		}
		
		, _current: function() {
			if (this.lastFunc) {
				func = this.lastFunc;
				
				args = new Array();
				args.push(this);
				
				for(i = 0; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				
				func.apply(this, args);
			}
			return this;
		}
		
		, accept: function() {
			this._next.apply(this, arguments);
			return this;
		}
		
		, reject: function() {
			args = new Array();
			args.push(this);
		
			for(i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			
			this.errFunc.apply(this, args);
			return this;
		}
		
		, again: function() {
			args = new Array();
			args.push(this);
			
			for(i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			
			this._current.apply(this, arguments);
		}
		
		, chain: function(func) {
				this.funcChain.push(func);
				return this;
			}
		};
	}
};

/*
// example demonstrating the use of deferred..
// d shows example of chaining async calls.
// d2 shows example of looping async calls.
d = deferrer.newDeferred(
	function(_d, file) {
		fs.readFile(file, 'utf-8', function(err, content) {
			if (err) {
				_d.reject('d:\\temp.txt', err);
			} else {
				_d.accept(content);
			}
		});
	}, 
	function(_d, file, err) {
		console.log('err reading ' + file + ' details: ' + err);
	}
).chain(function(_d, content) {
	setTimeout(function() {
	_d.accept(content);
}, 2000);
}).chain(function(_d, content) {
	console.log(content);
	_d.accept(content);
}).chain(function(_d, content) {
	_d.reject('d:\\temp.txt', 'error');
});

d.start('d:\\temp.txt');

d2 = deferrer.newDeferred(
	function(_d, cnt, sum) {
		setTimeout(function() {
		console.log(cnt);
		sum = sum + cnt;
		cnt = cnt - 1;
		if (cnt >= 0) {
			_d.again(cnt, sum);
		} else {
			_d.accept(sum);
		}
	}, 1000);
}, 
function(_d, err) {
	console.log('err reading ' + _d.ctx + ' details: ' + err);
}).chain(function(_d, sum) {
	console.log('sum is ' +  sum);
});

d2.start(10, 0);
*/