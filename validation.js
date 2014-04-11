EJS.module('validation', ['util'], function(ns) {
	//config
	ns.validator = function validator() {
		var args = ns.toArray(arguments),
			conf = args.pop();
	
		this.config = Object.create(null);
		
		ns.extend(this.config, conf);
		
		this.messages = [];
		this.types = {
			string: {
				validate: function(value) {
					var val = value;
					
					if(ns.isString(val)) {
						val = val.trim();
						
						return value.length > 0;
					}
					
					return false;
				}
			},
			email: {
				validate: function(value) {
					var val = value,
						reg = /[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}/gi;
					
					if(ns.isString(val)) {
						val = val.trim();
						
						return val.length > 0 && reg.test(val);
					}
					
					return false;
				}
			},
			phone: {
				validate: function(value) {
					var val = value,
						reg = /[^0-9]/g;
						
					if(ns.isString(val)) {
						val = val.trim();
						val = val.replace(reg, '');
						
						return val.length > 0 && val.length < 10;
					}
					
					return false;
				} 
			}
		};
	};
	
	ns.initPrototype(ns.validator);
	
	ns.validator.prototype.validate = function(data) {
		var msg, 
			type, 
			checker, 
			res_ok;
		
		this.messages = [];
		
		for(var k in data) {
			if(ns.has(data, k)) {
				type = this.config[k];
				checker = this.types[type];
				
				if(!type) {
					continue;
				}
				
				if(!checker) {
					throw {
						name: 'ValidationError',
						message: 'No handler to validate type ' + type
					};
				}
				
				res_ok = checker.validate(data[k]);
				
				if(!res_ok) {
					this.messages.push({ property: k, text: '[' + k + '] is required.' });
				}				
			}
		}
		
		this.messages = this.messages.reverse();
		
		return !this.hasErrors();
	};
		
	ns.validator.prototype.hasErrors = function hasErrors() {
		return this.messages.length > 0;
	};
	
	ns.validator.prototype.clear = function clear() {
		this.messages = [];
	};
});