/*! fetch v0.2.0 | (c) 2016 Chris Ferdinandi | MIT License | https://cferdinandi@bitbucket.org/cferdinandi/fetch.git | Open Source Credits: https://gist.github.com/gitgrimbo/6451492, http://photoswipe.com, https://github.com/cferdinandi/right-height, https://github.com/cferdinandi/houdini */
function loadJS(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o}