/*! Fetch v3.0.0 | (c) 2022 Chris Ferdinandi | LicenseRef-See included LICENSE.md License | https://github.com/cferdinandi/fetch */
var Fetch=function(){"use strict";Element.prototype.closest||(Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(this))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null});var e="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==e&&e||{},t="URLSearchParams"in e,r="Symbol"in e&&"iterator"in Symbol,n="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),o="FormData"in e,i="ArrayBuffer"in e;if(i)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],a=ArrayBuffer.isView||function(e){return e&&s.indexOf(Object.prototype.toString.call(e))>-1};function c(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e)||""===e)throw new TypeError('Invalid character in header field name: "'+e+'"');return e.toLowerCase()}function l(e){return"string"!=typeof e&&(e=String(e)),e}function f(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return r&&(t[Symbol.iterator]=function(){return t}),t}function u(e){this.map={},e instanceof u?e.forEach((function(e,t){this.append(t,e)}),this):Array.isArray(e)?e.forEach((function(e){this.append(e[0],e[1])}),this):e&&Object.getOwnPropertyNames(e).forEach((function(t){this.append(t,e[t])}),this)}function h(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function d(e){return new Promise((function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}}))}function p(e){var t=new FileReader,r=d(t);return t.readAsArrayBuffer(e),r}function y(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function m(){return this.bodyUsed=!1,this._initBody=function(e){var r;this.bodyUsed=this.bodyUsed,this._bodyInit=e,e?"string"==typeof e?this._bodyText=e:n&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:o&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:t&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():i&&n&&((r=e)&&DataView.prototype.isPrototypeOf(r))?(this._bodyArrayBuffer=y(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):i&&(ArrayBuffer.prototype.isPrototypeOf(e)||a(e))?this._bodyArrayBuffer=y(e):this._bodyText=e=Object.prototype.toString.call(e):this._bodyText="",this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},n&&(this.blob=function(){var e=h(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){if(this._bodyArrayBuffer){var e=h(this);return e||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}return this.blob().then(p)}),this.text=function(){var e,t,r,n=h(this);if(n)return n;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,r=d(t),t.readAsText(e),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),r=new Array(t.length),n=0;n<t.length;n++)r[n]=String.fromCharCode(t[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},o&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}u.prototype.append=function(e,t){e=c(e),t=l(t);var r=this.map[e];this.map[e]=r?r+", "+t:t},u.prototype.delete=function(e){delete this.map[c(e)]},u.prototype.get=function(e){return e=c(e),this.has(e)?this.map[e]:null},u.prototype.has=function(e){return this.map.hasOwnProperty(c(e))},u.prototype.set=function(e,t){this.map[c(e)]=l(t)},u.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)},u.prototype.keys=function(){var e=[];return this.forEach((function(t,r){e.push(r)})),f(e)},u.prototype.values=function(){var e=[];return this.forEach((function(t){e.push(t)})),f(e)},u.prototype.entries=function(){var e=[];return this.forEach((function(t,r){e.push([r,t])})),f(e)},r&&(u.prototype[Symbol.iterator]=u.prototype.entries);var b=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function g(t,r){if(!(this instanceof g))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var n,o,i=(r=r||{}).body;if(t instanceof g){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,r.headers||(this.headers=new u(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,i||null==t._bodyInit||(i=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=r.credentials||this.credentials||"same-origin",!r.headers&&this.headers||(this.headers=new u(r.headers)),this.method=(n=r.method||this.method||"GET",o=n.toUpperCase(),b.indexOf(o)>-1?o:n),this.mode=r.mode||this.mode||null,this.signal=r.signal||this.signal||function(){if("AbortController"in e)return(new AbortController).signal}(),this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&i)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(i),!("GET"!==this.method&&"HEAD"!==this.method||"no-store"!==r.cache&&"no-cache"!==r.cache)){var s=/([?&])_=[^&]*/;if(s.test(this.url))this.url=this.url.replace(s,"$1_="+(new Date).getTime());else{this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}}function v(e){var t=new FormData;return e.trim().split("&").forEach((function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");t.append(decodeURIComponent(n),decodeURIComponent(o))}})),t}function w(e,t){if(!(this instanceof w))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText=void 0===t.statusText?"":""+t.statusText,this.headers=new u(t.headers),this.url=t.url||"",this._initBody(e)}g.prototype.clone=function(){return new g(this,{body:this._bodyInit})},m.call(g.prototype),m.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new u(this.headers),url:this.url})},w.error=function(){var e=new w(null,{status:0,statusText:""});return e.type="error",e};var _=[301,302,303,307,308];w.redirect=function(e,t){if(-1===_.indexOf(t))throw new RangeError("Invalid status code");return new w(null,{status:t,headers:{location:e}})};var A=e.DOMException;try{new A}catch(e){(A=function(e,t){this.message=e,this.name=t;var r=Error(e);this.stack=r.stack}).prototype=Object.create(Error.prototype),A.prototype.constructor=A}function T(t,r){return new Promise((function(o,s){var a=new g(t,r);if(a.signal&&a.signal.aborted)return s(new A("Aborted","AbortError"));var c=new XMLHttpRequest;function f(){c.abort()}c.onload=function(){var e,t,r={status:c.status,statusText:c.statusText,headers:(e=c.getAllResponseHeaders()||"",t=new u,e.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(e){return 0===e.indexOf("\n")?e.substr(1,e.length):e})).forEach((function(e){var r=e.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();t.append(n,o)}})),t)};r.url="responseURL"in c?c.responseURL:r.headers.get("X-Request-URL");var n="response"in c?c.response:c.responseText;setTimeout((function(){o(new w(n,r))}),0)},c.onerror=function(){setTimeout((function(){s(new TypeError("Network request failed"))}),0)},c.ontimeout=function(){setTimeout((function(){s(new TypeError("Network request failed"))}),0)},c.onabort=function(){setTimeout((function(){s(new A("Aborted","AbortError"))}),0)},c.open(a.method,function(t){try{return""===t&&e.location.href?e.location.href:t}catch(e){return t}}(a.url),!0),"include"===a.credentials?c.withCredentials=!0:"omit"===a.credentials&&(c.withCredentials=!1),"responseType"in c&&(n?c.responseType="blob":i&&a.headers.get("Content-Type")&&-1!==a.headers.get("Content-Type").indexOf("application/octet-stream")&&(c.responseType="arraybuffer")),!r||"object"!=typeof r.headers||r.headers instanceof u?a.headers.forEach((function(e,t){c.setRequestHeader(t,e)})):Object.getOwnPropertyNames(r.headers).forEach((function(e){c.setRequestHeader(e,l(r.headers[e]))})),a.signal&&(a.signal.addEventListener("abort",f),c.onreadystatechange=function(){4===c.readyState&&a.signal.removeEventListener("abort",f)}),c.send(void 0===a._bodyInit?null:a._bodyInit)}))}function E(e){var t=this.constructor;return this.then((function(r){return t.resolve(e()).then((function(){return r}))}),(function(r){return t.resolve(e()).then((function(){return t.reject(r)}))}))}T.polyfill=!0,e.fetch||(e.fetch=T,e.Headers=u,e.Request=g,e.Response=w),"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e,t){if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(e),n=1;n<arguments.length;n++){var o=arguments[n];if(null!=o)for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[i]=o[i])}return r},writable:!0,configurable:!0});var S=setTimeout;function O(e){return Boolean(e&&void 0!==e.length)}function x(){}function B(e){if(!(this instanceof B))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],k(e,this)}function j(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,B._immediateFn((function(){var r=1===e._state?t.onFulfilled:t.onRejected;if(null!==r){var n;try{n=r(e._value)}catch(e){return void D(t.promise,e)}P(t.promise,n)}else(1===e._state?P:D)(t.promise,e._value)}))):e._deferreds.push(t)}function P(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var r=t.then;if(t instanceof B)return e._state=3,e._value=t,void C(e);if("function"==typeof r)return void k((n=r,o=t,function(){n.apply(o,arguments)}),e)}e._state=1,e._value=t,C(e)}catch(t){D(e,t)}var n,o}function D(e,t){e._state=2,e._value=t,C(e)}function C(e){2===e._state&&0===e._deferreds.length&&B._immediateFn((function(){e._handled||B._unhandledRejectionFn(e._value)}));for(var t=0,r=e._deferreds.length;t<r;t++)j(e,e._deferreds[t]);e._deferreds=null}function N(e,t,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=r}function k(e,t){var r=!1;try{e((function(e){r||(r=!0,P(t,e))}),(function(e){r||(r=!0,D(t,e))}))}catch(e){if(r)return;r=!0,D(t,e)}}B.prototype.catch=function(e){return this.then(null,e)},B.prototype.then=function(e,t){var r=new this.constructor(x);return j(this,new N(e,t,r)),r},B.prototype.finally=E,B.all=function(e){return new B((function(t,r){if(!O(e))return r(new TypeError("Promise.all accepts an array"));var n=Array.prototype.slice.call(e);if(0===n.length)return t([]);var o=n.length;function i(e,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var a=s.then;if("function"==typeof a)return void a.call(s,(function(t){i(e,t)}),r)}n[e]=s,0==--o&&t(n)}catch(e){r(e)}}for(var s=0;s<n.length;s++)i(s,n[s])}))},B.resolve=function(e){return e&&"object"==typeof e&&e.constructor===B?e:new B((function(t){t(e)}))},B.reject=function(e){return new B((function(t,r){r(e)}))},B.race=function(e){return new B((function(t,r){if(!O(e))return r(new TypeError("Promise.race accepts an array"));for(var n=0,o=e.length;n<o;n++)B.resolve(e[n]).then(t,r)}))},B._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){S(e,0)},B._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},"Promise"in window?window.Promise.prototype.finally||(window.Promise.prototype.finally=E):window.Promise=B;var F={status:"adoptable",limit:0,showFilters:!0,filterName:!0,filterSizes:!0,filterAges:!0,filterGenders:!0,filterSpecies:!0,filterBreeds:!0,filterOther:!0,showToggleAll:!0,toggleAllText:"Select All Breeds",filterButtonText:"Filter Results",filterButtonClass:"",noImage:"",specialNeeds:"Special Needs",noDogs:"No Dogs",noCats:"No Cats",noKids:"No Kids",noDogsCatsKids:"No Dogs/Cats/Kids",noDogsCats:"No Dogs/Cats",noDogsKids:"No Dogs/Kids",noCatsKids:"No Cats/Kids",labelFilterName:"Search by Name",labelButtonName:"Search",labelClearName:"Clear Search",narrowLayout:!1,oneSpecies:!1,newTab:!1},I=function(e){return Array.prototype.slice.call(e)},L=function(e){return e.showFilters&&(e.filterAnimals||e.filterSizes||e.filterAges||e.filterGenders||e.filterBreeds||e.filterOther)},U=function(e){var t=sessionStorage.getItem("fetchPets_"+e);if(t)return JSON.parse(t)},R=function(e){return e&&e.pets&&e.timestamp&&e.timestamp+36e5>(new Date).getTime()},q=function(e){return e.secondary?[e.primary,e.secondary].join(", "):e.primary},z=function(e,t){return"fetch-filter-"+e+"-"+t.replace(/[^a-z]+/gi,"-")},K=function(e,t,r){if(!L(t))return"";var n=function(e){e.species.sort(),e.breeds.sort(),e.other.sort();var t=["Small","Medium","Large","Extra Large"];return t.forEach((function(r){e.sizes.indexOf(r)<0&&t.splice(t.indexOf(r),1)})),e.sizes=t,e}(function(e,t){return e.reduce((function(e,r){return e.sizes.indexOf(r.size)<0&&e.sizes.push(r.size),e.ages.indexOf(r.age)<0&&e.ages.push(r.age),e.genders.indexOf(r.gender)<0&&e.genders.push(r.gender),e.species.indexOf(r.species)<0&&e.species.push(r.species),q(r.breeds).split(", ").forEach((function(t){e.breeds.indexOf(t)<0&&e.breeds.push(t)})),!1===r.environment.cats&&e.other.indexOf("No Cats")<0&&e.other.push(t.noCats),!1===r.environment.dogs&&e.other.indexOf("No Dogs")<0&&e.other.push(t.noDogs),!1===r.environment.children&&e.other.indexOf("No Kids")<0&&e.other.push(t.noKids),r.attributes.special_needs&&e.other.indexOf("Special Needs")<0&&e.other.push(t.specialNeeds),e}),{sizes:[],ages:[],genders:[],species:[],breeds:[],other:[]})}(e,t)),o=function(e){var t=sessionStorage.getItem("fetchFilters_"+e);return t?JSON.parse(t):null}(r);return'<div class="fetch-filters"><div class="fetch-filter-fields" tabindex="-1">'+["filterSpecies","filterSizes","filterAges","filterGenders","filterBreeds","filterOther"].map((function(e){if(!t[e])return"";var r=e.replace("filter","").toLowerCase(),i='<div class="fetch-filter-section" id="fetch-filter-section-'+r+'"><h2 class="fetch-filter-heading">'+r+'</h2><div class="fetch-filter-checkboxes">'+function(e,t,r){return"breeds"===e&&t.showToggleAll?'<label for="select-all-breeds"><input type="checkbox" id="select-all-breeds" data-fetch-select-all '+(!r||r.toggleAll?"checked":"")+"> "+t.toggleAllText+"</label>":""}(r,t,o)+n[r].map((function(e){var t=z(r,e),n='<label for="'+t+'"><input type="checkbox" id="'+t+'" data-fetch-filter=".'+t+'" data-fetch-filter-type="'+r+'" '+(function(e,t,r){return!(r&&r.breeds&&r.filters)||("breeds"===t?r.breeds.indexOf(e)>-1:r.filters.indexOf(e)<0)}(t,r,o)?"checked":"")+"> "+e+"</label>";return n})).join("")+"</div></div>";return i})).join("")+'</div><button class="fetch-filter-button '+t.filterButtonClass+'" data-fetch-show-filters aria-pressed="false">'+t.filterButtonText+"</button></div>"},H=function(e,t,r,n,o){if(e.classList.add("fetch-loaded"),e.innerHTML=function(e){var t="";return e.filterName&&(t='<form class="fetch-filter-section-name" data-fetch-search-name><label for="fetch-filter-name-field">'+e.labelFilterName+'</label><input type="text" id="fetch-filter-name-field" data-fetch-filter-name>&nbsp;<button>'+e.labelButtonName+'</button><div data-fetch-name-status aria-live="polite"></div></form><p><a data-fetch-clear-search-name role="button" href="#">'+e.labelClearName+"</a></p>"),t}(r)+K(t,r,n)+'<div class="fetch-pet-listings"><div class="fetch-row">'+t.map((function(e){if(r.oneSpecies&&e.species!==r.oneSpecies)return"";var t=function(e,t){return!1===e.cats&&!1===e.dogs&&!1===e.children?t.noDogsCatsKids:!1===e.cats&&!1===e.dogs?t.noDogsCats:!1===e.cats&&!1===e.children?t.noCatsKids:!1===e.dogs&&!1===e.children?t.noDogsKids:!1===e.cats?t.noCats:0==e.dogs?t.noDogs:!1===e.children?t.noKids:void 0}(e.environment,r),n=q(e.breeds),o='<div class="fetch-pet '+function(e,t,r){var n=[];return n.push(z("sizes",e.size)),n.push(z("ages",e.age)),n.push(z("genders",e.gender)),n.push(z("species",e.species)),t.split(", ").forEach((function(e){n.push(z("breeds",e))})),!1===e.environment.cats&&n.push(z("other",r.noCats)),!1===e.environment.dogs&&n.push(z("other",r.noDogs)),!1===e.environment.children&&n.push(z("other",r.noKids)),e.attributes.special_needs&&n.push(z("other",r.specialNeeds)),n.join(" ")}(e,n,r)+'"><a class="fetch-pet-link" '+(r.newTab?'target="_blank"':"")+' href="'+e.url+'">'+(e.photos.length>0||r.noImage.length>0?'<div><img class="fetch-img" alt="A photo of '+e.name+'" src="'+function(e,t){return e.large?e.large:e.medium?e.medium:e.full?e.full:e.small?e.small:t.noImage.length>0?t.noImage:""}(e.photos[0],r)+'"></div>':"")+'<h3 class="fetch-pet-heading">'+e.name+'</h3></a><p class="fetch-all-pets-summary">'+e.size+", "+e.age+", "+e.gender+'</p><p class="fetch-all-pets-breeds">'+n+"</p>"+(t?'<p class="fetch-all-pets-environment">'+t+"</p>":"")+(e.attributes.special_needs?'<p class="fetch-all-pets-special-needs">'+r.specialNeeds+"</p>":"")+"</div>";return o})).join("")+'</div><p>Powered by <a href="https://fetch.gomakethings.com">the Fetch plugin</a>.</p></div>',L(r)&&M(e,n,r),o){let t=e.querySelector("[data-fetch-filter-name]"),r=e.querySelector("[data-fetch-name-status]");t&&t.removeAttribute("data-fetch-searching"),r&&(r.textContent="")}},G=function(e,t,r,n,o,i,s){return s=s||[],fetch("https://api.petfinder.com/v2/animals/?organization="+t.shelter+"&limit=100&status="+r.status+(o?"&name="+o:"")+(i?"&page="+i:""),{headers:{Authorization:t.tokenType+" "+t.token,"Content-Type":"application/x-www-form-urlencoded"}}).then((function(e){return e.ok?e.json():Promise.reject(e)})).then((function(i){var a=s.concat(i.animals);(r.limit<1||a.length<=r.limit)&&i.pagination.current_page<i.pagination.total_pages?G(e,t,r,n,o,parseFloat(i.pagination.current_page)+1,a):(r.limit&&(a=a.slice(0,r.limit)),function(e,t,r){r||sessionStorage.setItem("fetchPets_"+t,JSON.stringify({pets:e,timestamp:(new Date).getTime()}))}(a,n,o),H(e,a,r,n,o))}))},M=function(e,t,r){var n=I(e.querySelectorAll('[data-fetch-filter-type="breeds"]:checked')),o=I(e.querySelectorAll('[data-fetch-filter]:not([data-fetch-filter-type="breeds"]):not(:checked)')),i={breeds:[],filters:[],toggleAll:!0};r.filterBreeds?(I(e.querySelectorAll(".fetch-pet")).forEach((function(e){e.setAttribute("hidden","")})),n.forEach((function(t){I(e.querySelectorAll(t.getAttribute("data-fetch-filter"))).forEach((function(e){e.removeAttribute("hidden")})),i.breeds.push(t.id)}))):I(e.querySelectorAll(".fetch-pet[hidden]")).forEach((function(e){e.removeAttribute("hidden","")})),o.forEach((function(t){I(e.querySelectorAll(t.getAttribute("data-fetch-filter"))).forEach((function(e){e.setAttribute("hidden","")})),i.filters.push(t.id)}));var s=e.querySelector("[data-fetch-select-all]");s&&s.checked||(i.toggleAll=!1),function(e,t){sessionStorage.setItem("fetchFilters_"+e,JSON.stringify(t))}(t,i)};return function(e,t,r){var n=document.querySelector(e);if(n){if(!(t&&t.shelter&&t.key&&t.secret))return console.error("Fetch requires a shelter ID, API key, and API secret.");var o,i,s=Object.assign(F,r),a=window.btoa(t.shelter+JSON.stringify(r)),c=function(t){if(t.target.closest(e+" [data-fetch-filter]"))M(n,a,s);else{var r=t.target.closest(e+" [data-fetch-select-all]");if(r)!function(e,t,r,n){I(e.querySelectorAll('[data-fetch-filter-type="breeds"]')).forEach((function(e){e.checked=t})),M(e,r,n)}(n,r.checked,a,s);else{var o=t.target.closest(e+" [data-fetch-show-filters]");o&&function(e,t){var r=e.querySelector(".fetch-filter-fields");r&&("true"===t.getAttribute("aria-pressed")?(t.setAttribute("aria-pressed","false"),r.classList.remove("fetch-is-visible")):(t.setAttribute("aria-pressed","true"),r.classList.add("fetch-is-visible"),r.focus()))}(n,o)}}},l=function(t){if(!t.target.closest(e+" [data-fetch-search-name]"))return;if(t.preventDefault(),t.target.hasAttribute("data-fetch-searching"))return;let r=t.target.querySelector("[data-fetch-filter-name]");if(!r)return;let n=t.target.querySelector("[data-fetch-name-status]");n&&(n.textContent="Searching..."),t.target.setAttribute("data-fetch-searching",""),u(r.value)},f=function(t){if(!t.target.closest(e+" [data-fetch-clear-search-name]"))return;t.preventDefault();let r=document.querySelector(e+" [data-fetch-search-name]");if(r){r.reset();var o=U(a);R(o)?H(n,o.pets,s,a):u()}},u=function(e){return fetch("https://api.petfinder.com/v2/oauth2/token",{method:"POST",body:"grant_type=client_credentials&client_id="+t.key+"&client_secret="+t.secret,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then((function(e){return e.ok?e.json():Promise.reject(e)})).then((function(r){t.token=r.access_token,t.tokenType=r.token_type,G(n,t,s,a,e)})).catch((function(e){console.log("something went wrong",e)}))};o=U(a),i=L(s),R(o)?H(n,o.pets,s,a):u(),i&&document.addEventListener("click",c),s.filterName&&(document.addEventListener("submit",l),document.addEventListener("click",f)),!i||s.narrowLayout?n.classList.add("fetch-narrow-layout"):n.classList.add("fetch-wide-layout")}}}();