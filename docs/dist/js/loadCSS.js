/*! Fetch v1.0.2 | (c) 2017 Chris Ferdinandi | MIT License | https://cferdinandi@bitbucket.org/cferdinandi/fetch.git | Open Source Credits: https://gist.github.com/gitgrimbo/6451492, http://photoswipe.com, https://github.com/cferdinandi/right-height, https://github.com/cferdinandi/houdini */
var loadCSS=function(e,n,t){var r,a=window,i=a.document,l=i.createElement("link");if(n)r=n;else{var o=(i.body||i.getElementsByTagName("head")[0]).childNodes;r=o[o.length-1]}var d=i.styleSheets;l.rel="stylesheet",l.href=e,l.media="only x",r.parentNode.insertBefore(l,n?r:r.nextSibling);var f=function(e){for(var n=l.href,t=d.length;t--;)if(d[t].href===n)return e();setTimeout(function(){f(e)})};return l.onloadcssdefined=f,f(function(){l.media=t||"all"}),l};