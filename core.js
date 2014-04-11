var EJS = Object.create(null);

(function() {	
		var _args = Array.prototype.slice.call(arguments),
			_libs = _args.pop(),
			_rnms = _args.pop(),
			_init = function() {
				console.log('initializing');
			},
			_hops = Object.prototype.hasOwnProperty;

		_rnms.modules = Object.create(null);
		
		for(var k in _libs) {
			if(_hops.call(_libs, k)) {
				_rnms.modules[k] = _libs[k];
			}
		}
		
		function module() {
			var args = Array.prototype.slice.call(arguments),
				fnNS = args.pop(),
				mods = args.pop(),
				name = args.pop(),
				ns = Object.create(null);
				
			for(var i=0, len=mods.length; i < len; i += 1) {
				this.modules[mods[i]](ns);				
			}
				
			this.modules[name] = fnNS;			
			this.modules[name].dep = mods;
			
			fnNS(ns);
			
			return this;
		}

		_rnms.module = module;		
})(EJS, LIB);

EJS.module('bootstrap', ['compat','util', 'base'], function(ns) {
	for(var k in ns) {
		console.log(k + '    ' + ns[k]);
	}
});