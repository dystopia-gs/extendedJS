EJS.module('dom', ['util','ui'], function(ns) {
	ns.bindSelect = function bindSelect(el, url, config, queryDTO) {
		var ajaxSettings = [], i, len;
		
		if(ns.isString(el)) {
			el = document.getElementById(el);
		}
		
		this.domEl 	= el;
		this.url 	= url;

		for(i = 0, len = config.length; i < len; i += 1) {
			ajaxSettings.push(ns.ajaxConfig[config[i]]);
		}
		
		this.config = ns.mixin.apply(null, ajaxSettings);
		
		this.config.url = this.url;
		this.config.context = this;
		this.config.success = this.success;
		
		this.dto = queryDTO;
	};
	
	ns.bindSelect.prototype = {
		textFieldName: 'Key',
		valueFieldName: 'Value',
		firstItem: (function() { 
			return Object.create(null, 
								 { 'Key': { value: '' }, 
								   'Value': { value: '' } }); 
		}).call(this),
		refresh: function() {
			this.config.data = this.dto();

			return $.ajax(this.config);
		},
		success: function(data) {
			ns.populateSelect(this.domEl, data, this.firstItem);
		},
		insert: function(item, idx) {
			var idx = idx || (this.firstItem ? 1 : 0),
				cnt = 0,
				el = this.domEl,
				ptr = (el.hasChildNodes()) ? el.firstChild : null,
				option;
			
			if(ptr != null) {
				while(cnt < idx) {
					ptr = ptr.nextSiblingElement;
					cnt += 1;
				}
			}
			
			if(ptr != null) {
				option = document.createElement('option');
				option.text = item.text;
				option.value = item.value;
				el.insertBefore(option, ptr);
			}
		},
		clear: function() {
			var el = this.domEl;
			
			while(el.hasChildNodes()) {
				el.removeChild(el.lastChild);
			}
		},
		text: function text(text) {
			if(!ns.isEmptyObject(text)) {
				ns.optionText(this.domEl, text);
			} else {
				return this.domEl[this.domEl.selectedIndex].text;
			}
		},
		val: function val(value) {
			if(!ns.isEmptyObject(value)) {
				ns.optionValue(this.domEl, value);
			} else {
				return this.domEl[this.domEl.selectedIndex].value;
			}
		},
		constructor: ns.bindSelect
	};
	
	ns.populateSelect = function populateSelect(el, items, firstItem) {
		var df, i, option;
		
		if(ns.isString(el)) {
			el = document.getElementById(el);
		}

		if(!ns.isArray(items)) {
			throw {
				name: 'populateSelect',
				message: 'items must be an array'
			};
		}
		
		while(el.hasChildNodes()) {
			el.removeChild(el.lastChild);
		}
		
		df = document.createDocumentFragment();
		
		if(firstItem) {
			option = document.createElement('option');
			option.text = firstItem.text || firstItem.Value || '';
			option.value = firstItem.Key || firstItem.value || '';
			df.appendChild(option);
		}
		
		for(i = 0; i < items.length; i += 1) {
			option = document.createElement('option');
			option.text = items[i].text || items[i].Value || '';
			option.value = items[i].Key || items[i].value || '';
			df.appendChild(option);
		}
		
		el.appendChild(df);
	};
	
	ns.optionValue = function optionValue(el, value) {
		var i, len, options, compareTo = value;
		
		if(ns.isString(el)) {
			el = document.getElementById(el);
		}

		if(ns.isUndefined(value)) {
			options = ns.toArray(el);
			
			for(i = 0, len = options.length; i < len; i += 1) {
				if(options[i].value == compareTo) {
					el.selectedIndex = i;
					i = len;
				}
			}
		} else {
			return el[el.selectedIndex].value;
		}
	};
	
	ns.optionText = function optionText(el, value) {
		var i, len, options, compareTo = value.toLowerCase();
		
		if(ns.isString(el)) {
			el = document.getElementById(el);
		}

		if(ns.isUndefined(value)) {
			options = ns.toArray(el);
			
			for(i = 0, len = options.length; i < len; i += 1) {
				if(ns.isString(options[i].text) && options[i].text.length > 0 && options[i].text.toLowerCase() == compareTo) {
					el.selectedIndex = i;
					i = len;
				}
			}
		} else {
			return el[el.selectedIndex].text;
		}
	};
	
	ns.toUL = function toUL(arr, formatTextFn) {
		var ul, li, df;
		
		if(ns.isArray(arr)) {
			ul = document.createElement('ul');
			df = document.createDocumentFragment();
			
			for(var i = 0, len = arr.length; i < len; i++){
				li = document.createElement('li');
				li.innerHTML = formatTextFn(arr[i]);
				df.appendChild(li);
			}
	
			ul.appendChild(df);
		}
		
		return ul;
	};
});