EJS.module('ui', ['util'], function(ns) {
	ns.typeAhead = function (o) {
        var args 				= ns.toArray(arguments)[0],
			_url 				= o.url,
			_param 				= o.param,
			_el 				= o.el,
			_hf 				= 'hf_' + _el,
			_selectFn 			= o.selectFn,
			_liTextFn 			= o.liTextFn,
			_err 				= o.err,
			_data               = o.data,
			_map                = o.map,
			_config 			= {
				base: {
					async: true,
					dataType: 'json',
					xhrFields: 	{ withCredentials: true },
					processData: true,
					contentType: 'application/json; charset=utf-8',
					beforeSend: function(xhr) {
						/*$.support.cors = true;
						xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
						xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
						xhr.setRequestHeader('Access-Control-Allow-Headers', 'Authorization');*/
					},
					cache: false,
					context: null
				},
				get: {
					type: 'GET',
					crossDomain: false
				},
				post: {
					type: 'POST',
					crossDomain: false
				},
				cross: {
					type: 'GET',
					dataType: 'jsonp',
					jsonp: 'callback',
					jsonpCallback: 'callback',
					crossDomain: true,
					data: Object.create(null, { 'callback': { value: 'callback' }})
				},
				yql: {
					
				}
			},
			_type = _config[o.type],
			_defaultType = _config['cross'],
			_responseObject = o.responseObject,
			_resp,
			_ctlScope,
			_load = function () {		
			    var auto = $('#' + _el).autocomplete({					
			        source: function (request, response) {
						var options = Object.create(null);
						
						_ctlScope = this;
						
						_data[_param]=request.term;
						
						ns.extend(options, _config.base, _type || _defaultType);							
						ns.extend(options, {
							url: _url,
							data: _data,
							context: _ctlScope,
							success: function (data) { 
								_resp = _responseObject(data);
								
								if(_resp) {
									response(_resp);
								}
							},
							error: function (XMLHttpRequest, textStatus, errorThrown) {
								if (_err) {
									var len = _err.length;

									for (var i = 0; i < len; i++)
										$('#' + _err[i]).html(XMLHttpRequest.responseText);
								}
							}
						});
						
						$('<div class="loading"></div>').appendTo(_ctlScope.element);
			            $.ajax(options);
			        },
			        minLength: 2,
					open: function() {
						var el = _ctlScope.element,
							offsets = el.offset();
						
						_ctlScope.menu.element.removeClass('hidden');
						_ctlScope.menu.element.css({ 'left': offsets.left, 'top': offsets.top + el.height() });
					},
			        select: function (event, ui) {
			            var el = $('#' + _hf);
						
						if(el.length > 0) {
							el.val(ui.item.value);
						}
						
			            if (_selectFn) _selectFn.call(_ctlScope, event, ui, $('#' + _el));
						
						_ctlScope.menu.element.addClass('hidden');
						
						return false;
			        },
					response: function(event, ui) {
						if(this.previousElementSibling != null) {
							if(this.previousElementSibling.getAttribute('role') === 'status') {
								this.previousElementSibling.remove();
							}
						}
						
						ui.content = $.map(ui.content, function(val, i) {
							return _map(val);
						});
						
						_ctlScope.menu.element.offset().left = _ctlScope.element.offset().left;
					}
			    });
				
				auto.data('ui-autocomplete')._renderMenu = function(ul, items) {
					var self = this;
					
					$.each( items, function( index, item ) {
						self._renderItem( ul, item );
					});
				};
				
				auto.data('ui-autocomplete')._renderItem = function (ul, item) {
			        return $('<li></li>').data('ui-autocomplete-item', item)
                                             .append('<a href="#">' + _liTextFn.call(_ctlScope, item) + '</a>')
                                             .appendTo(ul);
			    };
				
				auto.data('ui-autocomplete').menu.options.selected = function(event, ui) {
					$(this).focus();
				};
			};

        return {
            Bind: _load,
			Params: _data
        };
    };

	ns.domMediator = function domMediator() {
	
	};
	
	ns.viewModel = function viewModel(o) {		
		Object.defineProperty(this, 'scope', { value: o.scope, enumerable: false, writable: false, configurable: false });

		ns.observer.call(this);
		
		var _init = function init() {
			var inputs = this.scope.domElement.getElementsByTagName('input'),
				selects = this.scope.domElement.getElementsByTagName('select'),
				cur,
				self = this, i, len, id, input;
			
			for(i = 0, len = inputs.length; i < len; i += 1) {
				input = inputs[i];
				id = input.id;
				
				this[id] = Object.create(null);

				Object.defineProperty(this[id], 'value', {
					set: (function() { 
						var i = id, domEl = input;
						
						return function(v) {
							if(v !== domEl.value) {
								domEl.value = v;
							}
							
							if(v !== this._value) {
								this._value = v;
								self.trigger('change', Object.create(null, { 'id': { value: i }, 'value': { value: v }, 'domEl': { value: domEl }}));
							}
						};
					})(),	
					get: function() { return this._value; }
				});
				
				this[id].value = input.value;				
			}
			
			$(this.scope.domElement).on('keyup', 'input', function(e) {
				var id = e.target.id,
					model = self[id];
					
					model.value = $(this).val();	
			});
					
			for(i = 0, len = selects.length; i < len; i += 1) {
				input 	= selects[i];
				id 		= input.id;
				
				this[id] 		= Object.create(null);
				
				Object.defineProperty(this[id], 'value', {
					set: (function() { 
						var i = id, domEl = input;
							
						return function(v) {
							if(v !== ns.optionValue(domEl)) {
								ns.optionValue(domEl, v);
							}
							
							if(v !== this._value) {
								this._value = v;
								self.trigger('change', Object.create(null, { 'id': { value: i }, 'value': { value: v }, 'domEl': { value: domEl }}));
							}
						};
					})(),	
					get: function() { return this._value; }
				});
				
				this[id].value 	= (input.selectedIndex > -1) ? input[input.selectedIndex].value : '';				
			}
			
			$(this.scope.domElement).on('change', 'select', function(e) {
				var el = e.target, 
					id = el.id, 
					property = self[id];
				
				property.value = el[el.selectedIndex].value;
			});
		};
		
		_init.call(this);
	};
	
	ns.viewModel.prototype = Object.create(ns.observer.prototype);
	ns.viewModel.prototype.constructor = ns.viewModel;
	
	ns.viewModel.prototype.flattenModel = function flattenModel() {
		var props = Object.keys(this),
			obj = Object.create(null);
		
		for(var i = 0, len = props.length; i < len; i += 1){
			obj[props[i]] = this[props[i]].value; 
		}
		
		return obj;
	};
	
	ns.viewModel.prototype.clear = function clear() {
		var k, self = this;
		
		Object.keys(self).forEach(function(i) {
			self[i].value = '';
		});
	};
	
	ns.viewModel.prototype.copy = function copy(flatObject, ignoreProperties) {
		var _self = this;
		
		if(ns.isObject(flatObject)) {
			Object.keys(flatObject).forEach(function(key) {
				if(!(key in ignoreProperties)) {
					_self[key].value = flatObject[key];
				}
			});
		}
	};
	
	ns.controller = function controller(name, fn) { 
		var _els = document.getElementsByTagName('div'),
			_attr,
			_el,
			_self = this;
		
		for(var i = 0, len = _els.length; i < len; i += 1) {
			_attr = _els[i].getAttribute('data-controller')
			if(_attr) {
				if(_attr === name) {
					_el = _els[i];
					i = len;
				}
			}
		}

		_self.domElement = _el;
		_self.model 		= new  ns.viewModel({ tag: _el.id, scope: _self });	
		
		fn(_self);
	};
	
	ns.initPrototype(ns.controller);
});