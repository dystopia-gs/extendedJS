function model(ns) {
	this.Base = Class.extend({
		_this: undefined,
		init: function (obj, cpFn) {
			for (var k in obj) {
				if (Object.prototype.hasOwnProperty(obj, k)) {
					if (!cpFn && typeof obj[k] !== 'function') {
						this[k] = obj[k];
					} else {
						this[k] = obj[k];
					}
				}
			}
			this._this = this;
		}
	});

	this.Model = Base.extend({
		name: undefined,
		original: undefined,
		fields: undefined,
		proto: undefined,
		methods: undefined,
		create: function (obj) {
			if(obj && obj != null) {
				var o = new this.proto(); 
				with (this) {
					if (fields) {
						for (var i = 0, len = fields.length; i < len; i++) {
							var k = fields[i].name,
								t = fields[i].type;

							if (Object.prototype.hasOwnProperty(obj, k)) {
								var tmp = obj[k];

								if (t === 'wcfdate') {
									o[k] = new Date(parseInt(tmp.replace("/Date(", "").replace(")/", ""), 10));
								} else if (typeof t === 'object') && t instanceof Model) {
									if (Object.prototype.toString(tmp) === '[object Array]') {
										o[k] = [];
										for (var j = 0, plen = tmp.length; j < plen; j++) o[k].push(t.create(tmp[j]));
									} else {
										o[k] = t.create(tmp);
									}
								} else {
									o[k] = tmp;
								}
							}
						}
					}
					//original = _.clone(o);
				}
			}
			return o;
		},
		init: function (args) {
			this._super(args, true);
			if (this.methods) {
				this.proto = function () { };
				this.proto.prototype = Object.create(this.methods);
			}
		}
	});

}