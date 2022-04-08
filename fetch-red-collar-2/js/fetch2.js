/*! Fetch v2.2.0 | (c) 2022 Chris Ferdinandi | LicenseRef-See included LICENSE.md License | https://github.com/cferdinandi/fetch */
var Fetch = (function () {
	'use strict';

	/**
	 * Element.closest() polyfill
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
	 */
	if (!Element.prototype.closest) {
		if (!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
		}
		Element.prototype.closest = function (s) {
			var el = this;
			var ancestor = this;
			if (!document.documentElement.contains(el)) return null;
			do {
				if (ancestor.matches(s)) return ancestor;
				ancestor = ancestor.parentElement;
			} while (ancestor !== null);
			return null;
		};
	}

	/**
	 * Fetch Polyfill
	 * https://github.com/github/fetch
	 * (c) GitHub, Inc., MIT License
	 */

	 var global =
	   (typeof globalThis !== 'undefined' && globalThis) ||
	   (typeof self !== 'undefined' && self) ||
	   (typeof global !== 'undefined' && global) ||
	   {};

	 var support = {
	   searchParams: 'URLSearchParams' in global,
	   iterable: 'Symbol' in global && 'iterator' in Symbol,
	   blob:
	     'FileReader' in global &&
	     'Blob' in global &&
	     (function() {
	       try {
	         new Blob();
	         return true
	       } catch (e) {
	         return false
	       }
	     })(),
	   formData: 'FormData' in global,
	   arrayBuffer: 'ArrayBuffer' in global
	 };

	 function isDataView(obj) {
	   return obj && DataView.prototype.isPrototypeOf(obj)
	 }

	 if (support.arrayBuffer) {
	   var viewClasses = [
	     '[object Int8Array]',
	     '[object Uint8Array]',
	     '[object Uint8ClampedArray]',
	     '[object Int16Array]',
	     '[object Uint16Array]',
	     '[object Int32Array]',
	     '[object Uint32Array]',
	     '[object Float32Array]',
	     '[object Float64Array]'
	   ];

	   var isArrayBufferView =
	     ArrayBuffer.isView ||
	     function(obj) {
	       return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	     };
	 }

	 function normalizeName(name) {
	   if (typeof name !== 'string') {
	     name = String(name);
	   }
	   if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
	     throw new TypeError('Invalid character in header field name: "' + name + '"')
	   }
	   return name.toLowerCase()
	 }

	 function normalizeValue(value) {
	   if (typeof value !== 'string') {
	     value = String(value);
	   }
	   return value
	 }

	 // Build a destructive iterator for the value list
	 function iteratorFor(items) {
	   var iterator = {
	     next: function() {
	       var value = items.shift();
	       return {done: value === undefined, value: value}
	     }
	   };

	   if (support.iterable) {
	     iterator[Symbol.iterator] = function() {
	       return iterator
	     };
	   }

	   return iterator
	 }

	 function Headers(headers) {
	   this.map = {};

	   if (headers instanceof Headers) {
	     headers.forEach(function(value, name) {
	       this.append(name, value);
	     }, this);
	   } else if (Array.isArray(headers)) {
	     headers.forEach(function(header) {
	       this.append(header[0], header[1]);
	     }, this);
	   } else if (headers) {
	     Object.getOwnPropertyNames(headers).forEach(function(name) {
	       this.append(name, headers[name]);
	     }, this);
	   }
	 }

	 Headers.prototype.append = function(name, value) {
	   name = normalizeName(name);
	   value = normalizeValue(value);
	   var oldValue = this.map[name];
	   this.map[name] = oldValue ? oldValue + ', ' + value : value;
	 };

	 Headers.prototype['delete'] = function(name) {
	   delete this.map[normalizeName(name)];
	 };

	 Headers.prototype.get = function(name) {
	   name = normalizeName(name);
	   return this.has(name) ? this.map[name] : null
	 };

	 Headers.prototype.has = function(name) {
	   return this.map.hasOwnProperty(normalizeName(name))
	 };

	 Headers.prototype.set = function(name, value) {
	   this.map[normalizeName(name)] = normalizeValue(value);
	 };

	 Headers.prototype.forEach = function(callback, thisArg) {
	   for (var name in this.map) {
	     if (this.map.hasOwnProperty(name)) {
	       callback.call(thisArg, this.map[name], name, this);
	     }
	   }
	 };

	 Headers.prototype.keys = function() {
	   var items = [];
	   this.forEach(function(value, name) {
	     items.push(name);
	   });
	   return iteratorFor(items)
	 };

	 Headers.prototype.values = function() {
	   var items = [];
	   this.forEach(function(value) {
	     items.push(value);
	   });
	   return iteratorFor(items)
	 };

	 Headers.prototype.entries = function() {
	   var items = [];
	   this.forEach(function(value, name) {
	     items.push([name, value]);
	   });
	   return iteratorFor(items)
	 };

	 if (support.iterable) {
	   Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	 }

	 function consumed(body) {
	   if (body.bodyUsed) {
	     return Promise.reject(new TypeError('Already read'))
	   }
	   body.bodyUsed = true;
	 }

	 function fileReaderReady(reader) {
	   return new Promise(function(resolve, reject) {
	     reader.onload = function() {
	       resolve(reader.result);
	     };
	     reader.onerror = function() {
	       reject(reader.error);
	     };
	   })
	 }

	 function readBlobAsArrayBuffer(blob) {
	   var reader = new FileReader();
	   var promise = fileReaderReady(reader);
	   reader.readAsArrayBuffer(blob);
	   return promise
	 }

	 function readBlobAsText(blob) {
	   var reader = new FileReader();
	   var promise = fileReaderReady(reader);
	   reader.readAsText(blob);
	   return promise
	 }

	 function readArrayBufferAsText(buf) {
	   var view = new Uint8Array(buf);
	   var chars = new Array(view.length);

	   for (var i = 0; i < view.length; i++) {
	     chars[i] = String.fromCharCode(view[i]);
	   }
	   return chars.join('')
	 }

	 function bufferClone(buf) {
	   if (buf.slice) {
	     return buf.slice(0)
	   } else {
	     var view = new Uint8Array(buf.byteLength);
	     view.set(new Uint8Array(buf));
	     return view.buffer
	   }
	 }

	 function Body() {
	   this.bodyUsed = false;

	   this._initBody = function(body) {
	     /*
	       fetch-mock wraps the Response object in an ES6 Proxy to
	       provide useful test harness features such as flush. However, on
	       ES5 browsers without fetch or Proxy support pollyfills must be used;
	       the proxy-pollyfill is unable to proxy an attribute unless it exists
	       on the object before the Proxy is created. This change ensures
	       Response.bodyUsed exists on the instance, while maintaining the
	       semantic of setting Request.bodyUsed in the constructor before
	       _initBody is called.
	     */
	     this.bodyUsed = this.bodyUsed;
	     this._bodyInit = body;
	     if (!body) {
	       this._bodyText = '';
	     } else if (typeof body === 'string') {
	       this._bodyText = body;
	     } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	       this._bodyBlob = body;
	     } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	       this._bodyFormData = body;
	     } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	       this._bodyText = body.toString();
	     } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	       this._bodyArrayBuffer = bufferClone(body.buffer);
	       // IE 10-11 can't handle a DataView body.
	       this._bodyInit = new Blob([this._bodyArrayBuffer]);
	     } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	       this._bodyArrayBuffer = bufferClone(body);
	     } else {
	       this._bodyText = body = Object.prototype.toString.call(body);
	     }

	     if (!this.headers.get('content-type')) {
	       if (typeof body === 'string') {
	         this.headers.set('content-type', 'text/plain;charset=UTF-8');
	       } else if (this._bodyBlob && this._bodyBlob.type) {
	         this.headers.set('content-type', this._bodyBlob.type);
	       } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	         this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	       }
	     }
	   };

	   if (support.blob) {
	     this.blob = function() {
	       var rejected = consumed(this);
	       if (rejected) {
	         return rejected
	       }

	       if (this._bodyBlob) {
	         return Promise.resolve(this._bodyBlob)
	       } else if (this._bodyArrayBuffer) {
	         return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	       } else if (this._bodyFormData) {
	         throw new Error('could not read FormData body as blob')
	       } else {
	         return Promise.resolve(new Blob([this._bodyText]))
	       }
	     };

	     this.arrayBuffer = function() {
	       if (this._bodyArrayBuffer) {
	         var isConsumed = consumed(this);
	         if (isConsumed) {
	           return isConsumed
	         }
	         if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
	           return Promise.resolve(
	             this._bodyArrayBuffer.buffer.slice(
	               this._bodyArrayBuffer.byteOffset,
	               this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
	             )
	           )
	         } else {
	           return Promise.resolve(this._bodyArrayBuffer)
	         }
	       } else {
	         return this.blob().then(readBlobAsArrayBuffer)
	       }
	     };
	   }

	   this.text = function() {
	     var rejected = consumed(this);
	     if (rejected) {
	       return rejected
	     }

	     if (this._bodyBlob) {
	       return readBlobAsText(this._bodyBlob)
	     } else if (this._bodyArrayBuffer) {
	       return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	     } else if (this._bodyFormData) {
	       throw new Error('could not read FormData body as text')
	     } else {
	       return Promise.resolve(this._bodyText)
	     }
	   };

	   if (support.formData) {
	     this.formData = function() {
	       return this.text().then(decode)
	     };
	   }

	   this.json = function() {
	     return this.text().then(JSON.parse)
	   };

	   return this
	 }

	 // HTTP methods whose capitalization should be normalized
	 var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	 function normalizeMethod(method) {
	   var upcased = method.toUpperCase();
	   return methods.indexOf(upcased) > -1 ? upcased : method
	 }

	 function Request(input, options) {
	   if (!(this instanceof Request)) {
	     throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	   }

	   options = options || {};
	   var body = options.body;

	   if (input instanceof Request) {
	     if (input.bodyUsed) {
	       throw new TypeError('Already read')
	     }
	     this.url = input.url;
	     this.credentials = input.credentials;
	     if (!options.headers) {
	       this.headers = new Headers(input.headers);
	     }
	     this.method = input.method;
	     this.mode = input.mode;
	     this.signal = input.signal;
	     if (!body && input._bodyInit != null) {
	       body = input._bodyInit;
	       input.bodyUsed = true;
	     }
	   } else {
	     this.url = String(input);
	   }

	   this.credentials = options.credentials || this.credentials || 'same-origin';
	   if (options.headers || !this.headers) {
	     this.headers = new Headers(options.headers);
	   }
	   this.method = normalizeMethod(options.method || this.method || 'GET');
	   this.mode = options.mode || this.mode || null;
	   this.signal = options.signal || this.signal || (function () {
	     if ('AbortController' in global) {
	       var ctrl = new AbortController();
	       return ctrl.signal;
	     }
	   }());
	   this.referrer = null;

	   if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	     throw new TypeError('Body not allowed for GET or HEAD requests')
	   }
	   this._initBody(body);

	   if (this.method === 'GET' || this.method === 'HEAD') {
	     if (options.cache === 'no-store' || options.cache === 'no-cache') {
	       // Search for a '_' parameter in the query string
	       var reParamSearch = /([?&])_=[^&]*/;
	       if (reParamSearch.test(this.url)) {
	         // If it already exists then set the value with the current time
	         this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
	       } else {
	         // Otherwise add a new '_' parameter to the end with the current time
	         var reQueryString = /\?/;
	         this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
	       }
	     }
	   }
	 }

	 Request.prototype.clone = function() {
	   return new Request(this, {body: this._bodyInit})
	 };

	 function decode(body) {
	   var form = new FormData();
	   body
	     .trim()
	     .split('&')
	     .forEach(function(bytes) {
	       if (bytes) {
	         var split = bytes.split('=');
	         var name = split.shift().replace(/\+/g, ' ');
	         var value = split.join('=').replace(/\+/g, ' ');
	         form.append(decodeURIComponent(name), decodeURIComponent(value));
	       }
	     });
	   return form
	 }

	 function parseHeaders(rawHeaders) {
	   var headers = new Headers();
	   // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	   // https://tools.ietf.org/html/rfc7230#section-3.2
	   var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	   // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
	   // https://github.com/github/fetch/issues/748
	   // https://github.com/zloirock/core-js/issues/751
	   preProcessedHeaders
	     .split('\r')
	     .map(function(header) {
	       return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
	     })
	     .forEach(function(line) {
	       var parts = line.split(':');
	       var key = parts.shift().trim();
	       if (key) {
	         var value = parts.join(':').trim();
	         headers.append(key, value);
	       }
	     });
	   return headers
	 }

	 Body.call(Request.prototype);

	 function Response(bodyInit, options) {
	   if (!(this instanceof Response)) {
	     throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	   }
	   if (!options) {
	     options = {};
	   }

	   this.type = 'default';
	   this.status = options.status === undefined ? 200 : options.status;
	   this.ok = this.status >= 200 && this.status < 300;
	   this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
	   this.headers = new Headers(options.headers);
	   this.url = options.url || '';
	   this._initBody(bodyInit);
	 }

	 Body.call(Response.prototype);

	 Response.prototype.clone = function() {
	   return new Response(this._bodyInit, {
	     status: this.status,
	     statusText: this.statusText,
	     headers: new Headers(this.headers),
	     url: this.url
	   })
	 };

	 Response.error = function() {
	   var response = new Response(null, {status: 0, statusText: ''});
	   response.type = 'error';
	   return response
	 };

	 var redirectStatuses = [301, 302, 303, 307, 308];

	 Response.redirect = function(url, status) {
	   if (redirectStatuses.indexOf(status) === -1) {
	     throw new RangeError('Invalid status code')
	   }

	   return new Response(null, {status: status, headers: {location: url}})
	 };

	 var DOMException = global.DOMException;
	 try {
	   new DOMException();
	 } catch (err) {
	   DOMException = function(message, name) {
	     this.message = message;
	     this.name = name;
	     var error = Error(message);
	     this.stack = error.stack;
	   };
	   DOMException.prototype = Object.create(Error.prototype);
	   DOMException.prototype.constructor = DOMException;
	 }

	 function fetch$1(input, init) {
	   return new Promise(function(resolve, reject) {
	     var request = new Request(input, init);

	     if (request.signal && request.signal.aborted) {
	       return reject(new DOMException('Aborted', 'AbortError'))
	     }

	     var xhr = new XMLHttpRequest();

	     function abortXhr() {
	       xhr.abort();
	     }

	     xhr.onload = function() {
	       var options = {
	         status: xhr.status,
	         statusText: xhr.statusText,
	         headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	       };
	       options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	       var body = 'response' in xhr ? xhr.response : xhr.responseText;
	       setTimeout(function() {
	         resolve(new Response(body, options));
	       }, 0);
	     };

	     xhr.onerror = function() {
	       setTimeout(function() {
	         reject(new TypeError('Network request failed'));
	       }, 0);
	     };

	     xhr.ontimeout = function() {
	       setTimeout(function() {
	         reject(new TypeError('Network request failed'));
	       }, 0);
	     };

	     xhr.onabort = function() {
	       setTimeout(function() {
	         reject(new DOMException('Aborted', 'AbortError'));
	       }, 0);
	     };

	     function fixUrl(url) {
	       try {
	         return url === '' && global.location.href ? global.location.href : url
	       } catch (e) {
	         return url
	       }
	     }

	     xhr.open(request.method, fixUrl(request.url), true);

	     if (request.credentials === 'include') {
	       xhr.withCredentials = true;
	     } else if (request.credentials === 'omit') {
	       xhr.withCredentials = false;
	     }

	     if ('responseType' in xhr) {
	       if (support.blob) {
	         xhr.responseType = 'blob';
	       } else if (
	         support.arrayBuffer &&
	         request.headers.get('Content-Type') &&
	         request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
	       ) {
	         xhr.responseType = 'arraybuffer';
	       }
	     }

	     if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
	       Object.getOwnPropertyNames(init.headers).forEach(function(name) {
	         xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
	       });
	     } else {
	       request.headers.forEach(function(value, name) {
	         xhr.setRequestHeader(name, value);
	       });
	     }

	     if (request.signal) {
	       request.signal.addEventListener('abort', abortXhr);

	       xhr.onreadystatechange = function() {
	         // DONE (success or failure)
	         if (xhr.readyState === 4) {
	           request.signal.removeEventListener('abort', abortXhr);
	         }
	       };
	     }

	     xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	   })
	 }

	 fetch$1.polyfill = true;

	 if (!global.fetch) {
	   global.fetch = fetch$1;
	   global.Headers = Headers;
	   global.Request = Request;
	   global.Response = Response;
	 }

	/**
	 * Object.assign() polyfill
	 */
	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if (typeof Object.assign != 'function') {
		// Must be writable: true, enumerable: false, configurable: true
		Object.defineProperty(Object, "assign", {
			value: function assign(target, varArgs) { // .length of function is 2
				if (target == null) { // TypeError if undefined or null
					throw new TypeError('Cannot convert undefined or null to object');
				}

				var to = Object(target);

				for (var index = 1; index < arguments.length; index++) {
					var nextSource = arguments[index];

					if (nextSource != null) { // Skip over if undefined or null
						for (var nextKey in nextSource) {
							// Avoid bugs when hasOwnProperty is shadowed
							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
								to[nextKey] = nextSource[nextKey];
							}
						}
					}
				}
				return to;
			},
			writable: true,
			configurable: true
		});
	}

	/**
	 * Promise Polyfill
	 * https://github.com/taylorhakes/promise-polyfill
	 * (c) Taylor Hakes, MIT License
	 */


	/**
	 * @this {Promise}
	 */
	function finallyConstructor(callback) {
	  var constructor = this.constructor;
	  return this.then(
	    function(value) {
	      // @ts-ignore
	      return constructor.resolve(callback()).then(function() {
	        return value;
	      });
	    },
	    function(reason) {
	      // @ts-ignore
	      return constructor.resolve(callback()).then(function() {
	        // @ts-ignore
	        return constructor.reject(reason);
	      });
	    }
	  );
	}

	// Store setTimeout reference so promise-polyfill will be unaffected by
	// other code modifying setTimeout (like sinon.useFakeTimers())
	var setTimeoutFunc = setTimeout;

	function isArray(x) {
	  return Boolean(x && typeof x.length !== 'undefined');
	}

	function noop() {}

	// Polyfill for Function.prototype.bind
	function bind(fn, thisArg) {
	  return function() {
	    fn.apply(thisArg, arguments);
	  };
	}

	/**
	 * @constructor
	 * @param {Function} fn
	 */
	function Promise$1(fn) {
	  if (!(this instanceof Promise$1))
	    throw new TypeError('Promises must be constructed via new');
	  if (typeof fn !== 'function') throw new TypeError('not a function');
	  /** @type {!number} */
	  this._state = 0;
	  /** @type {!boolean} */
	  this._handled = false;
	  /** @type {Promise|undefined} */
	  this._value = undefined;
	  /** @type {!Array<!Function>} */
	  this._deferreds = [];

	  doResolve(fn, this);
	}

	function handle(self, deferred) {
	  while (self._state === 3) {
	    self = self._value;
	  }
	  if (self._state === 0) {
	    self._deferreds.push(deferred);
	    return;
	  }
	  self._handled = true;
	  Promise$1._immediateFn(function() {
	    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
	    if (cb === null) {
	      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
	      return;
	    }
	    var ret;
	    try {
	      ret = cb(self._value);
	    } catch (e) {
	      reject(deferred.promise, e);
	      return;
	    }
	    resolve(deferred.promise, ret);
	  });
	}

	function resolve(self, newValue) {
	  try {
	    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	    if (newValue === self)
	      throw new TypeError('A promise cannot be resolved with itself.');
	    if (
	      newValue &&
	      (typeof newValue === 'object' || typeof newValue === 'function')
	    ) {
	      var then = newValue.then;
	      if (newValue instanceof Promise$1) {
	        self._state = 3;
	        self._value = newValue;
	        finale(self);
	        return;
	      } else if (typeof then === 'function') {
	        doResolve(bind(then, newValue), self);
	        return;
	      }
	    }
	    self._state = 1;
	    self._value = newValue;
	    finale(self);
	  } catch (e) {
	    reject(self, e);
	  }
	}

	function reject(self, newValue) {
	  self._state = 2;
	  self._value = newValue;
	  finale(self);
	}

	function finale(self) {
	  if (self._state === 2 && self._deferreds.length === 0) {
	    Promise$1._immediateFn(function() {
	      if (!self._handled) {
	        Promise$1._unhandledRejectionFn(self._value);
	      }
	    });
	  }

	  for (var i = 0, len = self._deferreds.length; i < len; i++) {
	    handle(self, self._deferreds[i]);
	  }
	  self._deferreds = null;
	}

	/**
	 * @constructor
	 */
	function Handler(onFulfilled, onRejected, promise) {
	  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	  this.promise = promise;
	}

	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, self) {
	  var done = false;
	  try {
	    fn(
	      function(value) {
	        if (done) return;
	        done = true;
	        resolve(self, value);
	      },
	      function(reason) {
	        if (done) return;
	        done = true;
	        reject(self, reason);
	      }
	    );
	  } catch (ex) {
	    if (done) return;
	    done = true;
	    reject(self, ex);
	  }
	}

	Promise$1.prototype['catch'] = function(onRejected) {
	  return this.then(null, onRejected);
	};

	Promise$1.prototype.then = function(onFulfilled, onRejected) {
	  // @ts-ignore
	  var prom = new this.constructor(noop);

	  handle(this, new Handler(onFulfilled, onRejected, prom));
	  return prom;
	};

	Promise$1.prototype['finally'] = finallyConstructor;

	Promise$1.all = function(arr) {
	  return new Promise$1(function(resolve, reject) {
	    if (!isArray(arr)) {
	      return reject(new TypeError('Promise.all accepts an array'));
	    }

	    var args = Array.prototype.slice.call(arr);
	    if (args.length === 0) return resolve([]);
	    var remaining = args.length;

	    function res(i, val) {
	      try {
	        if (val && (typeof val === 'object' || typeof val === 'function')) {
	          var then = val.then;
	          if (typeof then === 'function') {
	            then.call(
	              val,
	              function(val) {
	                res(i, val);
	              },
	              reject
	            );
	            return;
	          }
	        }
	        args[i] = val;
	        if (--remaining === 0) {
	          resolve(args);
	        }
	      } catch (ex) {
	        reject(ex);
	      }
	    }

	    for (var i = 0; i < args.length; i++) {
	      res(i, args[i]);
	    }
	  });
	};

	Promise$1.resolve = function(value) {
	  if (value && typeof value === 'object' && value.constructor === Promise$1) {
	    return value;
	  }

	  return new Promise$1(function(resolve) {
	    resolve(value);
	  });
	};

	Promise$1.reject = function(value) {
	  return new Promise$1(function(resolve, reject) {
	    reject(value);
	  });
	};

	Promise$1.race = function(arr) {
	  return new Promise$1(function(resolve, reject) {
	    if (!isArray(arr)) {
	      return reject(new TypeError('Promise.race accepts an array'));
	    }

	    for (var i = 0, len = arr.length; i < len; i++) {
	      Promise$1.resolve(arr[i]).then(resolve, reject);
	    }
	  });
	};

	// Use polyfill for setImmediate for performance gains
	Promise$1._immediateFn =
	  // @ts-ignore
	  (typeof setImmediate === 'function' &&
	    function(fn) {
	      // @ts-ignore
	      setImmediate(fn);
	    }) ||
	  function(fn) {
	    setTimeoutFunc(fn, 0);
	  };

	Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
	  if (typeof console !== 'undefined' && console) {
	    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
	  }
	};

	if (!('Promise' in window)) {
	  window.Promise = Promise$1;
	} else if (!window.Promise.prototype['finally']) {
	  window.Promise.prototype['finally'] = finallyConstructor;
	}

	//
	// Variables
	//

	// Default settings
	var defaults = {

		// Status
		status: 'adoptable',
		limit: 0,

		// Filters
		showFilters: true,
		filterSizes: true,
		filterAges: true,
		filterGenders: true,
		filterSpecies: true,
		filterBreeds: true,
		filterOther: true,

		// Toggle all breeds
		showToggleAll: true,
		toggleAllText: 'Select All Breeds',

		// Filter toggle button
		filterButtonText: 'Filter Results',
		filterButtonClass: '',

		// Pet photos
		noImage: '',

		// Other
		specialNeeds: 'Special Needs',
		noDogs: 'No Dogs',
		noCats: 'No Cats',
		noKids: 'No Kids',
		noDogsCatsKids: 'No Dogs/Cats/Kids',
		noDogsCats: 'No Dogs/Cats',
		noDogsKids: 'No Dogs/Kids',
		noCatsKids: 'No Cats/Kids',

		// Force narrow layout
		narrowLayout: false,

		// Restrict to one species
		oneSpecies: false,

		// Open pets in new tab
		newTab: false,

	};

	//
	// Methods
	//

	var toArray = function (nodeList) {
		return Array.prototype.slice.call(nodeList);
	};

	var hasFilters = function (settings) {
		return settings.showFilters && (settings.filterAnimals || settings.filterSizes || settings.filterAges || settings.filterGenders || settings.filterBreeds || settings.filterOther);
	};

	var saveFilterStates = function (key, ids) {
		sessionStorage.setItem('fetchFilters_' + key, JSON.stringify(ids));
	};

	var getFilterStates = function (key) {
		var saved = sessionStorage.getItem('fetchFilters_' + key);
		return saved ? JSON.parse(saved) : null;
	};

	var savePets = function (pets, key) {
		sessionStorage.setItem('fetchPets_' + key, JSON.stringify({
			pets: pets,
			timestamp: new Date().getTime()
		}));
	};

	var loadPets = function (key) {
		var pets = sessionStorage.getItem('fetchPets_' + key);
		if (pets) return JSON.parse(pets);
	};

	var isFresh = function (pets) {
		return pets && pets.pets && pets.timestamp && pets.timestamp + 3600000 > new Date().getTime();
	};

	var getImgURL = function (imgs, settings) {
		if (imgs.large) return imgs.large;
		if (imgs.medium) return imgs.medium;
		if (imgs.full) return imgs.full;
		if (imgs.small) return imgs.small;
		if (settings.noImage.length > 0) return settings.noImage;
		return '';
	};

	var getBreeds = function (breeds) {
		if (breeds.secondary) {
			return [breeds.primary, breeds.secondary].join(', ');
		}
		return breeds.primary;
	};

	var getFilterValues = function (pets, settings) {
		return pets.reduce(function (filters, pet) {

			// Add pet size
			if (filters.sizes.indexOf(pet.size) < 0) {
				filters.sizes.push(pet.size);
			}

			// Add pet age
			if (filters.ages.indexOf(pet.age) < 0) {
				filters.ages.push(pet.age);
			}

			// Add pet gender
			if (filters.genders.indexOf(pet.gender) < 0) {
				filters.genders.push(pet.gender);
			}

			// Add pet species
			if (filters.species.indexOf(pet.species) < 0) {
				filters.species.push(pet.species);
			}

			// Add pet breeds
			var breeds = getBreeds(pet.breeds);
			breeds.split(', ').forEach(function (breed) {
				if (filters.breeds.indexOf(breed) < 0) {
					filters.breeds.push(breed);
				}
			});

			// Add other pet details
			if (pet.environment.cats === false && filters.other.indexOf('No Cats') < 0) {
				filters.other.push(settings.noCats);
			}
			if (pet.environment.dogs === false && filters.other.indexOf('No Dogs') < 0) {
				filters.other.push(settings.noDogs);
			}
			if (pet.environment.children === false && filters.other.indexOf('No Kids') < 0) {
				filters.other.push(settings.noKids);
			}
			if (pet.attributes.special_needs && filters.other.indexOf('Special Needs') < 0) {
				filters.other.push(settings.specialNeeds);
			}

			return filters;

		}, {sizes: [], ages: [], genders: [], species: [], breeds: [], other: []});
	};

	var sortFilterValues = function (filters) {

		// Alphabetically sort
		filters.species.sort();
		filters.breeds.sort();
		filters.other.sort();

		// Sort sizes
		var sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
		sizes.forEach(function (size) {
			if (filters.sizes.indexOf(size) < 0) {
				sizes.splice(sizes.indexOf(size), 1);
			}
		});
		filters.sizes = sizes;

		return filters;

	};

	var classify = function (type, item) {
		return 'fetch-filter-' + type + '-' + item.replace(/[^a-z]+/gi, '-');
	};

	var createSelectAll = function (type, settings, states) {
		if (type !== 'breeds' || !settings.showToggleAll) return '';
		var html =
			'<label for="select-all-breeds">' +
				'<input type="checkbox" id="select-all-breeds" data-fetch-select-all ' + (!states || states.toggleAll ? 'checked' : '')  + '> ' +
				settings.toggleAllText +
			'</label>';
		return html;
	};

	var isChecked = function (prop, type, states) {
		if (!states || !states.breeds || !states.filters) return true;
		if (type === 'breeds') {
			return states.breeds.indexOf(prop) > -1;
		} else {
			return states.filters.indexOf(prop) < 0;
		}
	};

	var getFilterFields = function (pets, settings, key) {

		// Return nothing if filters disabled
		if (!hasFilters(settings)) return '';

		// Get filters for pets
		var filters = sortFilterValues(getFilterValues(pets, settings));
		var filterTypes = ['filterSpecies', 'filterSizes', 'filterAges', 'filterGenders', 'filterBreeds', 'filterOther'];
		var filterStates = getFilterStates(key);

		// Setup markup string
		return '<div class="fetch-filters">' +
			'<div class="fetch-filter-fields" tabindex="-1">' +
				filterTypes.map(function (setting) {

					// Make sure filter enabled
					if (!settings[setting]) return '';

					// Get type from filter name
					var type = setting.replace('filter', '').toLowerCase();

					// Generate HTML
					var html =
						'<div class="fetch-filter-section" id="fetch-filter-section-' + type + '">' +
							'<h2 class="fetch-filter-heading">' + type + '</h2>' +
							'<div class="fetch-filter-checkboxes">' +
								createSelectAll(type, settings, filterStates) +
								filters[type].map(function (item) {
									var prop = classify(type, item);
									var field =
										'<label for="' + prop + '">' +
											'<input type="checkbox" id="' + prop + '" data-fetch-filter=".' + prop + '" data-fetch-filter-type="' + type + '" ' + (isChecked(prop, type, filterStates) ? 'checked' : '') + '> ' +
											item +
										'</label>';
									return field;
								}).join('') +
							'</div>' +
						'</div>';

					return html;

				}).join('') +
			'</div>' +
			'<button class="fetch-filter-button ' + settings.filterButtonClass + '" data-fetch-show-filters aria-pressed="false">' + settings.filterButtonText + '</button>' +
		'</div>';

	};

	var getEvironment = function (env, settings) {
		if (env.cats === false && env.dogs === false && env.children === false) return settings.noDogsCatsKids;
		if (env.cats === false && env.dogs === false) return settings.noDogsCats;
		if (env.cats === false && env.children === false) return settings.noCatsKids;
		if (env.dogs === false && env.children === false) return settings.noDogsKids;
		if (env.cats === false) return settings.noCats;
		if (env.dogs == false) return settings.noDogs;
		if (env.children === false) return settings.noKids;
	};

	var getPetClasses = function (pet, breeds, settings) {

		// Setup classes array
		var classes = [];

		// General details
		classes.push(classify('sizes', pet.size));
		classes.push(classify('ages', pet.age));
		classes.push(classify('genders', pet.gender));
		classes.push(classify('species', pet.species));

		// Breeds
		breeds.split(', ').forEach(function (breed) {
			classes.push(classify('breeds', breed));
		});

		// Add other pet details
		if (pet.environment.cats === false) {
			classes.push(classify('other', settings.noCats));
		}
		if (pet.environment.dogs === false) {
			classes.push(classify('other', settings.noDogs));
		}
		if (pet.environment.children === false) {
			classes.push(classify('other', settings.noKids));
		}
		if (pet.attributes.special_needs) {
			classes.push(classify('other', settings.specialNeeds));
		}

		return classes.join(' ');

	};

	var renderPets = function (target, pets, settings, key) {

		// Add class
		target.classList.add('fetch-loaded');

		// Render HTML
		target.innerHTML =
			getFilterFields(pets, settings, key) +
			'<div class="fetch-pet-listings">' +
				'<div class="fetch-row">' +
					pets.map(function (pet) {

						// If should only show one species
						if (settings.oneSpecies && pet.species !== settings.oneSpecies) return '';

						// Variables
						var environment = getEvironment(pet.environment, settings);
						var breeds = getBreeds(pet.breeds);


						var html =
							'<div class="fetch-pet ' + getPetClasses(pet, breeds, settings) + '">' +
								'<a class="fetch-pet-link" ' + (settings.newTab ? 'target="_blank"' : '') + ' href="' + pet.url + '">' +
									(pet.photos.length > 0 || settings.noImage.length > 0 ? '<div><img class="fetch-img" alt="A photo of ' + pet.name + '" src="' + getImgURL(pet.photos[0], settings) + '"></div>' : '') +
									'<h3 class="fetch-pet-heading">' + pet.name + '</h3>' +
								'</a>' +
								'<p class="fetch-all-pets-summary">' + pet.size + ', ' + pet.age + ', ' + pet.gender + '</p>' +
								'<p class="fetch-all-pets-breeds">' + breeds + '</p>' +
								(environment ? '<p class="fetch-all-pets-environment">' + environment + '</p>' : '') +
								(pet.attributes.special_needs ? '<p class="fetch-all-pets-special-needs">' + settings.specialNeeds + '</p>' : '') +
							'</div>';
						return html;
					}).join('') +
				'</div>' +
				'<p>Powered by <a href="https://fetch.gomakethings.com">the Fetch plugin</a>.</p>' +
			'</div>';

		// Filter pets
		if (hasFilters(settings)) {
			filterPets(target, key, settings);
		}

	};

	/**
	 * Get pet data and render into the UI
	 * @return {Promise} The fetch() Promise object
	 */
	var makeCall = function (target, credentials, settings, key, page, pets) {
		pets = pets ? pets : [];
		return fetch('https://api.petfinder.com/v2/animals/?organization=' + credentials.shelter + '&limit=100&status=' + settings.status + (page ? '&page=' + page : ''), {
			headers: {
				'Authorization': credentials.tokenType + ' ' + credentials.token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function (resp) {
			if (resp.ok) {
				return resp.json();
			} else {
				return Promise.reject(resp);
			}
		}).then(function (data) {
			var allPets = pets.concat(data.animals);
			if ((settings.limit < 1 || allPets.length <= settings.limit) && data.pagination.current_page < data.pagination.total_pages) {
				makeCall(target, credentials, settings, key, parseFloat(data.pagination.current_page) + 1, allPets);
			} else {
				if (settings.limit) {
					allPets = allPets.slice(0, settings.limit);
				}
				savePets(allPets, key);
				renderPets(target, allPets, settings, key);
			}
		});
	};

	var filterPets = function (target, key, settings) {

		// Get filters
		var breeds = toArray(target.querySelectorAll('[data-fetch-filter-type="breeds"]:checked'));
		var filters = toArray(target.querySelectorAll('[data-fetch-filter]:not([data-fetch-filter-type="breeds"]):not(:checked)'));
		var ids = {
			breeds: [],
			filters: [],
			toggleAll: true
		};

		// If breeds filters enabled, hide all pets and show matches
		// Otherwise, show any hidden pets
		if (settings.filterBreeds) {

			// Hide all pets
			toArray(target.querySelectorAll('.fetch-pet')).forEach(function (pet) {
				pet.setAttribute('hidden', '');
			});

			// Show any with matching breeds
			breeds.forEach(function (breed) {
				toArray(target.querySelectorAll(breed.getAttribute('data-fetch-filter'))).forEach(function (pet) {
					pet.removeAttribute('hidden');
				});
				ids.breeds.push(breed.id);
			});

		} else {
			// Hide all pets
			toArray(target.querySelectorAll('.fetch-pet[hidden]')).forEach(function (pet) {
				pet.removeAttribute('hidden', '');
			});
		}

		// Hide unmatched pet attributes
		filters.forEach(function (filter) {
			toArray(target.querySelectorAll(filter.getAttribute('data-fetch-filter'))).forEach(function (pet) {
				pet.setAttribute('hidden', '');
			});
			ids.filters.push(filter.id);
		});

		var toggleAll = target.querySelector('[data-fetch-select-all]');
		if (!toggleAll || !toggleAll.checked) {
			ids.toggleAll = false;
		}


		// Save filter states for page reloads
		saveFilterStates(key, ids);

	};

	var toggleAllFilters = function (target, checked, key, settings) {

		// Get the content
		toArray(target.querySelectorAll('[data-fetch-filter-type="breeds"]')).forEach(function (filter) {
			filter.checked = checked;
		});

		// Filter all pets
		filterPets(target, key, settings);

	};

	var showFilters = function (target, toggle) {

		// Get the filters
		var filters = target.querySelector('.fetch-filter-fields');
		if (!filters) return;

		// Hide or show filters
		if (toggle.getAttribute('aria-pressed') === 'true') {
			toggle.setAttribute('aria-pressed', 'false');
			filters.classList.remove('fetch-is-visible');
		} else {
			toggle.setAttribute('aria-pressed', 'true');
			filters.classList.add('fetch-is-visible');
			filters.focus();
		}

	};

	/**
	 * Create the Constructor object
	 */
	var Constructor = function (selector, credentials, options) {

		var target = document.querySelector(selector);
		if (!target) return;

		// Make sure all required info is provided
		if (!credentials || !credentials.shelter || !credentials.key || !credentials.secret) {
			return console.error('Fetch requires a shelter ID, API key, and API secret.');
		}

		// Merge options into defaults
		var settings = Object.assign(defaults, options);
		var key = window.btoa(credentials.shelter + JSON.stringify(options));


		var handleFilters = function (event) {

			// If a filter was checked
			if (event.target.closest(selector + ' [data-fetch-filter]')) {
				filterPets(target, key, settings);
				return;
			}

			// If toggle all checkboxes
			var toggle = event.target.closest(selector + ' [data-fetch-select-all]');
			if (toggle) {
				toggleAllFilters(target, toggle.checked, key, settings);
				return;
			}

			// If show filters
			var show = event.target.closest(selector + ' [data-fetch-show-filters]');
			if (show) {
				showFilters(target, show);
				return;
			}

		};


		/**
		 * Get OAuth credentials
		 * @return {Promise} The fetch() Promise object
		 */
		var getFromAPI = function () {
			return fetch('https://api.petfinder.com/v2/oauth2/token', {
				method: 'POST',
				body: 'grant_type=client_credentials&client_id=' + credentials.key + '&client_secret=' + credentials.secret,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (resp) {
				if (resp.ok) {
					return resp.json();
				} else {
					return Promise.reject(resp);
				}
			}).then(function (data) {
				credentials.token = data.access_token;
				credentials.tokenType = data.token_type;
				makeCall(target, credentials, settings, key);
			}).catch(function (err) {
				console.log('something went wrong', err);
			});
		};

		/**
		 * Get a token and fetch pets
		 */
		var init = function () {

			var pets = loadPets(key);
			var filters = hasFilters(settings);

			if (isFresh(pets)) {
				renderPets(target, pets.pets, settings, key);
			} else {
				getFromAPI();
			}

			if (filters) {
				document.addEventListener('click', handleFilters);
			}

			if (!filters || settings.narrowLayout) {
				target.classList.add('fetch-narrow-layout');
			} else {
				target.classList.add('fetch-wide-layout');
			}

		};

		init();

	};

	return Constructor;

})();
