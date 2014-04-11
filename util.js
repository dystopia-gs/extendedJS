var LIB = LIB || {};

LIB.util = function util(ns) {
	ns.pageInit = function pageInit(context, initialization_events) {
		var sys = window.Sys,
			i = 0,
			len = (ns.isArray(initialization_events) ? initialization_events.length : 0);

		if (typeof context !== 'boolean' && context) {
			if (sys) {
				for (; i < len; i += 1) {
					sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(initialization_events[i]);
				}
			} else {
				(function ($) { 
					for (; i < len; i += 1) { 
						initialization_events[i].call(context); 
					}
				})(jQuery);
			}
		}
	};
	
	ns.namespace = function namespace(space) {
		var current, chain, chainLength, i = 1;

		if (space && space.length && space.length > 0) {
			chain = space.split('.');
			chainLength = chain.length;
			if (chainLength > 0) {
				window[chain[0]] = window[chain[0]] || {};
				current = window[chain[0]];
				for (; i < chainLength; i += 1) {
					current[chain[i]] = current[chain[i]] || {};
					current = current[chain[i]];
				}
			}
		}

		return current;
	}
	
	ns.initPrototype = function initPrototype(fn) {
		fn.prototype = Object.create(null);
		fn.prototype.constructor = fn;
	};
	
	ns.create = function create() {
		var args = ns.toArray(arguments),
			fnArgs = args.pop(),
			fn = args.pop();
			
		ns.initPrototype(fn);
		
		return new fn(fnArgs);
	};
	
	//copy own object properties from src object -> defaults -> dest object
	//dest, def, src
	ns.extend = function extend() {
		var args = ns.toArray(arguments), 
			len = args.length,
			hop = Object.prototype.hasOwnProperty;

		for(var i = 1; i < len; i += 1) {
			for(var k in args[i]) {
				if(hop.call(args[i], k)) {
					args[0][k] = args[i][k];
				}
			}
		}
		
		return args[0];
	};
	
	ns.mixin = function mixin() {
		var objects = ns.toArray(arguments),
			len = objects.length,
			i = 0,
			base = Object.create(null);
		
		for(; i < len; i += 1) {
			for(var k in objects[i]) {
				if(ns.has(objects[i], k)) {
					base[k] = objects[i][k];
				}
			}
		}
		
		return base;
	};
	
	//prototype inheritance
	ns.inherit = function inherit(child, parent) {
		var c;
		if(ns.isObject(child) && ns.isObject(parent)) {
			c = child.prototype;
			
			c = Object.create(parent.prototype);
			c.constructor = child;
		}else{
			throw new TypeError('Object(s) required.');
		}
	};
	
	ns.normalizeArgs = function normalizeArgs() {
		var args = ns.toArray(arguments);
		
		return args;
	};
	
	ns.has = function has(o, prop) {
		return Object.prototype.hasOwnProperty.call(o, prop);
	};
	
	ns.toArray = function toArray(coll) {
		return Array.prototype.slice.call(coll);
	};
	
	ns.isArray = function isArray(val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	};
	
	ns.isObject = function isObject(val) {
		return typeof val === 'object';
	};
	
	ns.isFunction = function isFunction(val) {
		return typeof val === 'function';
	};
	
	ns.isString = function isString(val) {
		return typeof val === 'string';
	};
	
	ns.isNumber = function isNumber(val) {
		return typeof val === 'number';
	};
	
	ns.isUndefined = function isUndefined(val) {
		return typeof val === 'undefined';
	};
	
	ns.isEmptyObject = function isEmptyObject(val) {
		if(ns.isObject(val)) {
			return Object.keys(val).length > 0;	
		}
		
		return false;
	};
	
	ns.parseBoolean = function parseBoolean(val) {
		if (ns.isString(val)) {
			val = val.trim();
			if (/^[0-9]+$/g.test(val))
				return (parseInt(val) !== 0);
			val = val.toLowerCase();
			if (val === 'true' || val === 'false')
				return (val === 'true');
		} else if (ns.isNumber(val)) {
			return (val !== 0);
		}
		return;
	};
	
	ns.observer = function() {
		this.events = Object.create(null);
	};

	ns.observer.prototype = {
		observe: function observe(event, action, context) {
			if(!ns.has(this.events, event)) {
				this.events[event] = [];			
			}	
			
			this.events[event].push({ action: action, context: context || this});
		},
		trigger: function trigger(event, data) {
			var e;
			if(ns.has(this.events, event)) {
				for(var i = 0, len = this.events[event].length; i < len; i += 1) {
					e = this.events[event][i];					
					e.action.call(e.context, data);
				}
			}
		},
		clear: function clear(event) {
			if(ns.has(this.events, event)) {
				this.events[event] = [];
			}
		},
		constructor: ns.observer
	};
	
	ns.ajaxConfig = 
					{
						base: {
							async: true,
							xhrFields: 	{ withCredentials: true },
							processData: true,
							beforeSend: function(xhr) {
								/*$.support.cors = true;
								xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
								xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
								xhr.setRequestHeader('Access-Control-Allow-Headers', 'Authorization');*/
							},
							cache: false,
							context: null,
							crossDomain: false
						},
						get: {
							type: 'GET'				
						},
						post: {
							type: 'POST'				
						},
						cross: {
							type: 'GET',
							dataType: 'jsonp',
							contentType: 'application/json; charset=utf-8',
							crossDomain: true,
							data: Object.create(null, { 'callback': { value: 'callback' }})
						},
						xml: {
							dataType: 'xml',
							contentType: 'application/xml; charset=utf-8'
						},
						json: {
							dataType: 'json',
							contentType: 'application/json; charset=utf-8'
						}
					};
};