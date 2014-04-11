var LIB = LIB || {};
LIB.compat = function compat(ns) {
	if (typeof Date.prototype.copy !== 'function') {
		Date.prototype.copy = function (copyHourMinSecFlag) {
			if (copyHourMinSecFlag)
				return new Date(this.getFullYear(),
					this.getMonth(),
					this.getDate(),
					this.getHours(),
					this.getMinutes,
					this.getSeconds(),
					this.getMilliseconds());
			else
				return new Date(this.getFullYear(),
					this.getMonth(),
					this.getDate());

		}
	}

	if (typeof Date.prototype.toDateFromWcfString !== 'function') {
		Date.prototype.toDateFromWcfString = function to_date_wcf(str) {
			if (str && typeof (str) === 'string') {
				return new Date(parseInt(str.replace("/Date(", "").replace(")/", ""), 10));
			}
		}
	}

	if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() { }
			F.prototype = o;
			return new F();
		}
	}

	if(typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	
	if (typeof Object.keys !== 'function') {
        Object.keys = (function () {
            var hopn = Object.prototype.hasOwnProperty;
            var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
            var dontEnums = [
			  'toString',
			  'toLocaleString',
			  'valueOf',
			  'hasOwnProperty',
			  'isPrototypeOf',
			  'propertyIsEnumerable',
			  'constructor'];
            var deLen = dontEnums.length;

            return function (obj) {
                var result = [], prop, i;
                if (typeof obj !== 'object' || typeof obj !== 'function' || obj === null) {
                    throw new TypeError('Object.keys called on non-object');
                }
                for (prop in obj) {
                    if (hopn.call(obj, prop)) {
                        result.push(prop);
                    }
                }
                if (hasDontEnumBug) {
                    for (i = 0; i < deLen; i += 1) {
                        if (hopn.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }
	
	if (typeof Date.prototype.toDateFromWcfString !== 'function') {
        Date.prototype.toDateFromWcfString = function to_date_wcf(str) {
            if (typeof str === 'string') {
                return new Date(parseInt(str.replace("/Date(", "").replace(")/", ""), 10));
            }
        };
    }

    if (typeof Array.prototype.clone !== 'function') {
        Array.prototype.clone = function () {
            return this.slice(0);
        };
    }
	
	if (JSON && typeof JSON.stringifyWcf !== 'function') {
        JSON.stringifyWcf = function (json) {
            /// <summary>
            /// Wcf specific stringify that encodes dates in the
            /// a WCF compatible format ("/Date(9991231231)/")
            /// Note: this format works ONLY with WCF. 
            ///       ASMX can use ISO dates as of .NET 3.5 SP1
            /// </summary>
            /// <param name="key" type="var">property name</param>    
            /// <param name="value" type="var">value of the property</param>            
            return JSON.stringify(json, function (key, value) {
                if (typeof value === "string") {
                    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        var val = '/Date(' + new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], 0, 0, 0/*+a[4], +a[5], +a[6]*/)).getTime() + ')/';
                        this[key] = val;
                        return val;
                    }
                }
                return value;
            });
        };
    }
};