/*! fetch2 v2.1.3 | (c) 2020 Chris Ferdinandi | LicenseRef-See included LICENSE.md License | https://github.com/cferdinandi/fetch */
Element.prototype.closest||(Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(this))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null}),"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e,t){"use strict";if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(e),n=1;n<arguments.length;n++){var o=arguments[n];if(null!=o)for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[i]=o[i])}return r},writable:!0,configurable:!0}),(function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t():"function"==typeof define&&define.amd?define(t):t()})(0,(function(){"use strict";function e(e){var t=this.constructor;return this.then((function(r){return t.resolve(e()).then((function(){return r}))}),(function(r){return t.resolve(e()).then((function(){return t.reject(r)}))}))}var t=setTimeout;function r(e){return Boolean(e&&void 0!==e.length)}function n(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],f(e,this)}function i(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn((function(){var r=1===e._state?t.onFulfilled:t.onRejected;if(null!==r){var n;try{n=r(e._value)}catch(e){return void a(t.promise,e)}s(t.promise,n)}else(1===e._state?s:a)(t.promise,e._value)}))):e._deferreds.push(t)}function s(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var r=t.then;if(t instanceof o)return e._state=3,e._value=t,void c(e);if("function"==typeof r)return void f((n=r,i=t,function(){n.apply(i,arguments)}),e)}e._state=1,e._value=t,c(e)}catch(t){a(e,t)}var n,i}function a(e,t){e._state=2,e._value=t,c(e)}function c(e){2===e._state&&0===e._deferreds.length&&o._immediateFn((function(){e._handled||o._unhandledRejectionFn(e._value)}));for(var t=0,r=e._deferreds.length;t<r;t++)i(e,e._deferreds[t]);e._deferreds=null}function l(e,t,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=r}function f(e,t){var r=!1;try{e((function(e){r||(r=!0,s(t,e))}),(function(e){r||(r=!0,a(t,e))}))}catch(e){if(r)return;r=!0,a(t,e)}}o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var r=new this.constructor(n);return i(this,new l(e,t,r)),r},o.prototype.finally=e,o.all=function(e){return new o(function(t,n){if(!r(e))return n(new TypeError("Promise.all accepts an array"));var o=Array.prototype.slice.call(e);if(0===o.length)return t([]);var i=o.length;function s(e,r){try{if(r&&("object"==typeof r||"function"==typeof r)){var a=r.then;if("function"==typeof a)return void a.call(r,(function(t){s(e,t)}),n)}o[e]=r,0==--i&&t(o)}catch(e){n(e)}}for(var a=0;a<o.length;a++)s(a,o[a])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(t){t(e)})},o.reject=function(e){return new o(function(t,r){r(e)})},o.race=function(e){return new o(function(t,n){if(!r(e))return n(new TypeError("Promise.race accepts an array"));for(var i=0,s=e.length;i<s;i++)o.resolve(e[i]).then(t,n)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){t(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var u=(function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")})();"Promise"in u?u.Promise.prototype.finally||(u.Promise.prototype.finally=e):u.Promise=o})),(function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.WHATWGFetch={})})(this,(function(e){"use strict";var t={searchParams:"URLSearchParams"in self,iterable:"Symbol"in self&&"iterator"in Symbol,blob:"FileReader"in self&&"Blob"in self&&(function(){try{return new Blob,!0}catch(e){return!1}})(),formData:"FormData"in self,arrayBuffer:"ArrayBuffer"in self};if(t.arrayBuffer)var r=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],n=ArrayBuffer.isView||function(e){return e&&r.indexOf(Object.prototype.toString.call(e))>-1};function o(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function i(e){return"string"!=typeof e&&(e=String(e)),e}function s(e){var r={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return t.iterable&&(r[Symbol.iterator]=function(){return r}),r}function a(e){this.map={},e instanceof a?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function c(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function l(e){return new Promise(function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}})}function f(e){var t=new FileReader,r=l(t);return t.readAsArrayBuffer(e),r}function u(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function d(){return this.bodyUsed=!1,this._initBody=function(e){var r;this._bodyInit=e,e?"string"==typeof e?this._bodyText=e:t.blob&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:t.formData&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():t.arrayBuffer&&t.blob&&((r=e)&&DataView.prototype.isPrototypeOf(r))?(this._bodyArrayBuffer=u(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):t.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(e)||n(e))?this._bodyArrayBuffer=u(e):this._bodyText=e=Object.prototype.toString.call(e):this._bodyText="",this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},t.blob&&(this.blob=function(){var e=c(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?c(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(f)}),this.text=function(){var e,t,r,n=c(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=l(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},t.formData&&(this.formData=function(){return this.text().then(y)}),this.json=function(){return this.text().then(JSON.parse)},this}a.prototype.append=function(e,t){e=o(e),t=i(t);var r=this.map[e];this.map[e]=r?r+", "+t:t},a.prototype.delete=function(e){delete this.map[o(e)]},a.prototype.get=function(e){return e=o(e),this.has(e)?this.map[e]:null},a.prototype.has=function(e){return this.map.hasOwnProperty(o(e))},a.prototype.set=function(e,t){this.map[o(e)]=i(t)},a.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},a.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),s(e)},a.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),s(e)},a.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),s(e)},t.iterable&&(a.prototype[Symbol.iterator]=a.prototype.entries);var h=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function p(e,t){var r,n,o=(t=t||{}).body;if(e instanceof p){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new a(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"same-origin",!t.headers&&this.headers||(this.headers=new a(t.headers)),this.method=(r=t.method||this.method||"GET",n=r.toUpperCase(),h.indexOf(n)>-1?n:r),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function y(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(o))}})),t}function b(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new a(t.headers),this.url=t.url||"",this._initBody(e)}p.prototype.clone=function(){return new p(this,{body:this._bodyInit})},d.call(p.prototype),d.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new a(this.headers),url:this.url})},b.error=function(){var e=new b(null,{status:0,statusText:""});return e.type="error",e};var m=[301,302,303,307,308];b.redirect=function(e,t){if(-1===m.indexOf(t))throw new RangeError("Invalid status code");return new b(null,{status:t,headers:{location:e}})},e.DOMException=self.DOMException;try{new e.DOMException}catch(t){e.DOMException=function(e,t){this.message=e,this.name=t;var r=Error(e);this.stack=r.stack},e.DOMException.prototype=Object.create(Error.prototype),e.DOMException.prototype.constructor=e.DOMException}function g(r,n){return new Promise(function(o,i){var s=new p(r,n);if(s.signal&&s.signal.aborted)return i(new e.DOMException("Aborted","AbortError"));var c=new XMLHttpRequest;function l(){c.abort()}c.onload=function(){var e,t,r={status:c.status,statusText:c.statusText,headers:(e=c.getAllResponseHeaders()||"",t=new a,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();t.append(n,o)}})),t)};r.url="responseURL"in c?c.responseURL:r.headers.get("X-Request-URL");var n="response"in c?c.response:c.responseText;o(new b(n,r))},c.onerror=function(){i(new TypeError("Network request failed"))},c.ontimeout=function(){i(new TypeError("Network request failed"))},c.onabort=function(){i(new e.DOMException("Aborted","AbortError"))},c.open(s.method,s.url,!0),"include"===s.credentials?c.withCredentials=!0:"omit"===s.credentials&&(c.withCredentials=!1),"responseType"in c&&t.blob&&(c.responseType="blob"),s.headers.forEach((function(e,t){c.setRequestHeader(t,e)})),s.signal&&(s.signal.addEventListener("abort",l),c.onreadystatechange=function(){4===c.readyState&&s.signal.removeEventListener("abort",l)}),c.send(void 0===s._bodyInit?null:s._bodyInit)})}g.polyfill=!0,self.fetch||(self.fetch=g,self.Headers=a,self.Request=p,self.Response=b),e.Headers=a,e.Request=p,e.Response=b,e.fetch=g,Object.defineProperty(e,"__esModule",{value:!0})}));var Fetch=(function(){"use strict";var e={status:"adoptable",limit:0,showFilters:!0,filterSizes:!0,filterAges:!0,filterGenders:!0,filterSpecies:!0,filterBreeds:!0,filterOther:!0,showToggleAll:!0,toggleAllText:"Select All Breeds",filterButtonText:"Filter Results",filterButtonClass:"",noImage:"",specialNeeds:"Special Needs",noDogs:"No Dogs",noCats:"No Cats",noKids:"No Kids",noDogsCatsKids:"No Dogs/Cats/Kids",noDogsCats:"No Dogs/Cats",noDogsKids:"No Dogs/Kids",noCatsKids:"No Cats/Kids",narrowLayout:!1,oneSpecies:!1,newTab:!1},t=function(e){return Array.prototype.slice.call(e)},r=function(e){return e.showFilters&&(e.filterAnimals||e.filterSizes||e.filterAges||e.filterGenders||e.filterBreeds||e.filterOther)},n=function(e){return e.secondary?[e.primary,e.secondary].join(", "):e.primary},o=function(e,t){return"fetch-filter-"+e+"-"+t.replace(/[^a-z]+/gi,"-")},i=function(e,t,i){if(!r(t))return"";var s=(function(e){e.species.sort(),e.breeds.sort(),e.other.sort();var t=["Small","Medium","Large","Extra Large"];return t.forEach((function(r){e.sizes.indexOf(r)<0&&t.splice(t.indexOf(r),1)})),e.sizes=t,e})(function(e,t){return e.reduce((function(e,r){return e.sizes.indexOf(r.size)<0&&e.sizes.push(r.size),e.ages.indexOf(r.age)<0&&e.ages.push(r.age),e.genders.indexOf(r.gender)<0&&e.genders.push(r.gender),e.species.indexOf(r.species)<0&&e.species.push(r.species),n(r.breeds).split(", ").forEach((function(t){e.breeds.indexOf(t)<0&&e.breeds.push(t)})),!1===r.environment.cats&&e.other.indexOf("No Cats")<0&&e.other.push(t.noCats),!1===r.environment.dogs&&e.other.indexOf("No Dogs")<0&&e.other.push(t.noDogs),!1===r.environment.children&&e.other.indexOf("No Kids")<0&&e.other.push(t.noKids),r.attributes.special_needs&&e.other.indexOf("Special Needs")<0&&e.other.push(t.specialNeeds),e}),{sizes:[],ages:[],genders:[],species:[],breeds:[],other:[]})}(e,t)),a=(function(e){var t=sessionStorage.getItem("fetchFilters_"+e);return t?JSON.parse(t):null})(i);return'<div class="fetch-filters"><div class="fetch-filter-fields" tabindex="-1">'+["filterSpecies","filterSizes","filterAges","filterGenders","filterBreeds","filterOther"].map((function(e){if(!t[e])return"";var r=e.replace("filter","").toLowerCase();return'<div class="fetch-filter-section" id="fetch-filter-section-'+r+'"><h2 class="fetch-filter-heading">'+r+'</h2><div class="fetch-filter-checkboxes">'+(function(e,t,r){return"breeds"===e&&t.showToggleAll?'<label for="select-all-breeds"><input type="checkbox" id="select-all-breeds" data-fetch-select-all '+(!r||r.toggleAll?"checked":"")+"> "+t.toggleAllText+"</label>":""})(r,t,a)+s[r].map((function(e){var t=o(r,e);return'<label for="'+t+'"><input type="checkbox" id="'+t+'" data-fetch-filter=".'+t+'" data-fetch-filter-type="'+r+'" '+(function(e,t,r){return!(r&&r.breeds&&r.filters)||("breeds"===t?r.breeds.indexOf(e)>-1:r.filters.indexOf(e)<0)}(t,r,a)?"checked":"")+"> "+e+"</label>"})).join("")+"</div></div>"})).join("")+'</div><button class="fetch-filter-button '+t.filterButtonClass+'" data-fetch-show-filters aria-pressed="false">'+t.filterButtonText+"</button></div>"},s=function(e,t,s,a){e.classList.add("fetch-loaded"),e.innerHTML=i(t,s,a)+'<div class="fetch-pet-listings"><div class="fetch-row">'+t.map((function(e){if(s.oneSpecies&&e.species!==s.oneSpecies)return"";var t=(function(e,t){return!1===e.cats&&!1===e.dogs&&!1===e.children?t.noDogsCatsKids:!1===e.cats&&!1===e.dogs?t.noDogsCats:!1===e.cats&&!1===e.children?t.noCatsKids:!1===e.dogs&&!1===e.children?t.noDogsKids:!1===e.cats?t.noCats:0==e.dogs?t.noDogs:!1===e.children?t.noKids:void 0})(e.environment,s),r=n(e.breeds);return'<div class="fetch-pet '+(function(e,t,r){var n=[];return n.push(o("sizes",e.size)),n.push(o("ages",e.age)),n.push(o("genders",e.gender)),n.push(o("species",e.species)),t.split(", ").forEach((function(e){n.push(o("breeds",e))})),!1===e.environment.cats&&n.push(o("other",r.noCats)),!1===e.environment.dogs&&n.push(o("other",r.noDogs)),!1===e.environment.children&&n.push(o("other",r.noKids)),e.attributes.special_needs&&n.push(o("other",r.specialNeeds)),n.join(" ")})(e,r,s)+'"><a class="fetch-pet-link" '+(s.newTab?'target="_blank"':"")+' href="'+e.url+'">'+(e.photos.length>0||s.noImage.length>0?'<div><img class="fetch-img" alt="A photo of '+e.name+'" src="'+(function(e,t){return e.large?e.large:e.medium?e.medium:e.full?e.full:e.small?e.small:t.noImage.length>0?t.noImage:""})(e.photos[0],s)+'"></div>':"")+'<h3 class="fetch-pet-heading">'+e.name+'</h3></a><p class="fetch-all-pets-summary">'+e.size+", "+e.age+", "+e.gender+'</p><p class="fetch-all-pets-breeds">'+r+"</p>"+(t?'<p class="fetch-all-pets-environment">'+t+"</p>":"")+(e.attributes.special_needs?'<p class="fetch-all-pets-special-needs">'+s.specialNeeds+"</p>":"")+"</div>"})).join("")+'</div><p>Powered by <a href="https://fetch.gomakethings.com">the Fetch plugin</a>.</p></div>',r(s)&&c(e,a,s)},a=function(e,t,r,n,o,i){return i=i||[],fetch("https://api.petfinder.com/v2/animals/?organization="+t.shelter+"&limit=100&status="+r.status+(o?"&page="+o:""),{headers:{Authorization:t.tokenType+" "+t.token,"Content-Type":"application/x-www-form-urlencoded"}}).then((function(e){return e.ok?e.json():Promise.reject(e)})).then((function(o){var c=i.concat(o.animals);(r.limit<1||c.length<=r.limit)&&o.pagination.current_page<o.pagination.total_pages?a(e,t,r,n,parseFloat(o.pagination.current_page)+1,c):(r.limit&&(c=c.slice(0,r.limit)),(function(e,t){sessionStorage.setItem("fetchPets_"+t,JSON.stringify({pets:e,timestamp:(new Date).getTime()}))})(c,n),s(e,c,r,n))}))},c=function(e,r,n){var o=t(e.querySelectorAll('[data-fetch-filter-type="breeds"]:checked')),i=t(e.querySelectorAll('[data-fetch-filter]:not([data-fetch-filter-type="breeds"]):not(:checked)')),s={breeds:[],filters:[],toggleAll:!0};n.filterBreeds?(t(e.querySelectorAll(".fetch-pet")).forEach((function(e){e.setAttribute("hidden","")})),o.forEach((function(r){t(e.querySelectorAll(r.getAttribute("data-fetch-filter"))).forEach((function(e){e.removeAttribute("hidden")})),s.breeds.push(r.id)}))):t(e.querySelectorAll(".fetch-pet[hidden]")).forEach((function(e){e.removeAttribute("hidden","")})),i.forEach((function(r){t(e.querySelectorAll(r.getAttribute("data-fetch-filter"))).forEach((function(e){e.setAttribute("hidden","")})),s.filters.push(r.id)}));var a=e.querySelector("[data-fetch-select-all]");a&&a.checked||(s.toggleAll=!1),(function(e,t){sessionStorage.setItem("fetchFilters_"+e,JSON.stringify(t))})(r,s)};return function(n,o,i){var l=document.querySelector(n);if(l){if(!(o&&o.shelter&&o.key&&o.secret))return console.error("Fetch requires a shelter ID, API key, and API secret.");var f,u,d=Object.assign(e,i),h=window.btoa(o.shelter+JSON.stringify(i)),p=function(e){if(e.target.closest(n+" [data-fetch-filter]"))c(l,h,d);else{var r=e.target.closest(n+" [data-fetch-select-all]");if(r)!(function(e,r,n,o){t(e.querySelectorAll('[data-fetch-filter-type="breeds"]')).forEach((function(e){e.checked=r})),c(e,n,o)})(l,r.checked,h,d);else{var o=e.target.closest(n+" [data-fetch-show-filters]");o&&(function(e,t){var r=e.querySelector(".fetch-filter-fields");r&&("true"===t.getAttribute("aria-pressed")?(t.setAttribute("aria-pressed","false"),r.classList.remove("fetch-is-visible")):(t.setAttribute("aria-pressed","true"),r.classList.add("fetch-is-visible"),r.focus()))})(l,o)}}};f=(function(e){var t=sessionStorage.getItem("fetchPets_"+e);if(t)return JSON.parse(t)})(h),u=r(d),(function(e){return e&&e.pets&&e.timestamp&&e.timestamp+36e5>(new Date).getTime()})(f)?s(l,f.pets,d,h):fetch("https://api.petfinder.com/v2/oauth2/token",{method:"POST",body:"grant_type=client_credentials&client_id="+o.key+"&client_secret="+o.secret,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then((function(e){return e.ok?e.json():Promise.reject(e)})).then((function(e){o.token=e.access_token,o.tokenType=e.token_type,a(l,o,d,h)})).catch((function(e){console.log("something went wrong",e)})),u&&document.addEventListener("click",p),!u||d.narrowLayout?l.classList.add("fetch-narrow-layout"):l.classList.add("fetch-wide-layout")}}})();