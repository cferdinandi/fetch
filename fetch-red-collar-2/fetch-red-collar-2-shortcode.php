<?php

/**
 * Add a shortcode for fetch.js
 */

function fetch2_shortcode( $fetch, $content = '' ) {

	// Get user options
	// $fetch = shortcode_atts(array(

	// 	// API credentials
	// 	'key' => null,
	// 	'secret' => null,
	// 	'shelter' => null,

	// ), $atts);

	$id = wp_hash_password( implode('', $fetch) );

	$markup = '<div data-fetch="' . $id . '">' . $content . '</div>';

	$init =
		'<script>' .
			';(function (window, document, undefined) {' .
				'"use strict";' .
				'/*! Credits: https://github.com/filamentgroup/loadJS, https://github.com/filamentgroup/loadCSS */' .
				'var loadCSS=function(e,n,t){var r,a=window,i=a.document,l=i.createElement("link");if(n)r=n;else{var o=(i.body||i.getElementsByTagName("head")[0]).childNodes;r=o[o.length-1]}var d=i.styleSheets;l.rel="stylesheet",l.href=e,l.media="only x",r.parentNode.insertBefore(l,n?r:r.nextSibling);var f=function(e){for(var n=l.href,t=d.length;t--;)if(d[t].href===n)return e();setTimeout(function(){f(e)})};return l.onloadcssdefined=f,f(function(){l.media=t||"all"}),l};' .
				'var loadJS=function(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o};' .
				'loadCSS("' . plugins_url( '/css/fetch2.css', __FILE__ ) . '");' .
				'loadJS("' . plugins_url( '/js/fetch2.js', __FILE__ ) . '", function(){' .
					'var pets = new Fetch(\'[data-fetch="' . $id . '"]\', {' .
						'key: "' . $fetch['key'] . '",' .
						'secret: "' . $fetch['secret'] . '",' .
						'shelter: "' . $fetch['shelter'] . '"' .
					'}, {' .
						( isset( $fetch['status'] ) ? 'status: "' . $fetch['status'] . '",' : '' ) .
						( isset( $fetch['limit'] ) ? 'limit: "' . intval($fetch['limit']) . '",' : '' ) .
						( isset( $fetch['showfilters'] ) ? 'showFilters: "' . ($fetch['showfilters'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filtersizes'] ) ? 'filterSizes: "' . ($fetch['filtersizes'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filterages'] ) ? 'filterAges: "' . ($fetch['filterages'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filtergenders'] ) ? 'filterGenders: "' . ($fetch['filtergenders'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filterspecies'] ) ? 'filterSpecies: "' . ($fetch['filterspecies'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filterbreeds'] ) ? 'filterBreeds: "' . ($fetch['filterbreeds'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filterother'] ) ? 'filterOther: "' . ($fetch['filterother'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['filterbuttontext'] ) ? 'filterButtonText: "' . $fetch['filterbuttontext'] . '",' : '' ) .
						( isset( $fetch['filterbuttonclass'] ) ? 'filterButtonClass: "' . $fetch['filterbuttonclass'] . '",' : '' ) .
						( isset( $fetch['noimage'] ) ? 'noImage: "' . $fetch['noimage'] . '",' : '' ) .
						( isset( $fetch['specialneeds'] ) ? 'specialNeeds: "' . $fetch['specialneeds'] . '",' : '' ) .
						( isset( $fetch['nodogs'] ) ? 'noDogs: "' . $fetch['nodogs'] . '",' : '' ) .
						( isset( $fetch['nocats'] ) ? 'noCats: "' . $fetch['nocats'] . '",' : '' ) .
						( isset( $fetch['nokids'] ) ? 'noKids: "' . $fetch['nokids'] . '",' : '' ) .
						( isset( $fetch['nodogscatskids'] ) ? 'noDogsCatsKids: "' . $fetch['nodogscatskids'] . '",' : '' ) .
						( isset( $fetch['nodogscats'] ) ? 'noDogsCats: "' . $fetch['nodogscats'] . '",' : '' ) .
						( isset( $fetch['nodogskids'] ) ? 'noDogsKids: "' . $fetch['nodogskids'] . '",' : '' ) .
						( isset( $fetch['nocatskids'] ) ? 'noCatsKids: "' . $fetch['nocatskids'] . '",' : '' ) .
						( isset( $fetch['narrowlayout'] ) ? 'narrowLayout: "' . ($fetch['narrowlayout'] === 'true' ? true : false) . '",' : '' ) .
						( isset( $fetch['onespecies'] ) ? 'oneSpecies: "' . $fetch['onespecies'] . '",' : '' ) .
						( isset( $fetch['newtab'] ) ? 'newTab: "' . ($fetch['newtab'] === 'true' ? true : false) . '",' : '' ) .
					'});' .
				'});' .
			'})(window, document);' .
		'</script>';

	return $markup . $init;

}
add_shortcode( 'fetch2', 'fetch2_shortcode' );