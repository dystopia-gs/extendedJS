var LIB = LIB || {};
LIB.base = function base(ns) {
	ns.Class = function Class() {};
	(function (Class) {
		var DEF_CONSTRUCTOR = 'init';
		var isFn = function (fn) {
			return (typeof fn === 'function');
		};
		//Class = function () { };
		Class.extend = function (proto) {
			var e = function (r) {
				if (r != isFn && isFn(this.init)) this.init.apply(this, arguments);
			};
			var ms = function (fn, sfn) {
				return function () {
					var _tsuper = this._super;
					this._super = sfn;
					var _ret = fn.apply(this, arguments);
					this._super = _tsuper;
					return _ret;
				};
			};
			e.prototype = new this(isFn);
			for (var k in proto) {
				if (isFn(proto[k])) {
					e.prototype[k] = !isFn(e.prototype[k]) ? proto[k] : ms(proto[k], e.prototype[k]);
				} else {
					e.prototype[k] = proto[k];
				}
			}
			e.prototype.constructor = e;
			e.extend = this.extend;
			return e;
		};
	})(ns.Class);
};