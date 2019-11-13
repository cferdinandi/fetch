<?php

/**
 * Add a shortcode for fetch.js
 */

function fetch2_shortcode( $atts, $content = '' ) {

	// Get user options
	$fetch = shortcode_atts(array(

		// API credentials
		'key' => null,
		'secret' => null,
		'shelter' => null,

	), $atts);

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
						( in_array( 'status', $fetch ) ? 'status: "' . $fetch['status'] . '",' : '' ) .
						( in_array( 'showfilters', $fetch ) ? 'showFilters: "' . $fetch['showfilters'] . '",' : '' ) .
						( in_array( 'filtersizes', $fetch ) ? 'filterSizes: "' . $fetch['filtersizes'] . '",' : '' ) .
						( in_array( 'filterages', $fetch ) ? 'filterAges: "' . $fetch['filterages'] . '",' : '' ) .
						( in_array( 'filtergenders', $fetch ) ? 'filterGenders: "' . $fetch['filtergenders'] . '",' : '' ) .
						( in_array( 'filterspecies', $fetch ) ? 'filterSpecies: "' . $fetch['filterspecies'] . '",' : '' ) .
						( in_array( 'filterbreeds', $fetch ) ? 'filterBreeds: "' . $fetch['filterbreeds'] . '",' : '' ) .
						( in_array( 'filterother', $fetch ) ? 'filterOther: "' . $fetch['filterother'] . '",' : '' ) .
						( in_array( 'filterbuttontext', $fetch ) ? 'filterButtonText: "' . $fetch['filterbuttontext'] . '",' : '' ) .
						( in_array( 'filterbuttonclass', $fetch ) ? 'filterButtonClass: "' . $fetch['filterbuttonclass'] . '",' : '' ) .
						( in_array( 'noimage', $fetch ) ? 'noImage: "' . $fetch['noimage'] . '",' : '' ) .
						( in_array( 'specialneeds', $fetch ) ? 'specialNeeds: "' . $fetch['specialneeds'] . '",' : '' ) .
						( in_array( 'nodogs', $fetch ) ? 'noDogs: "' . $fetch['nodogs'] . '",' : '' ) .
						( in_array( 'nocats', $fetch ) ? 'noCats: "' . $fetch['nocats'] . '",' : '' ) .
						( in_array( 'nokids', $fetch ) ? 'noKids: "' . $fetch['nokids'] . '",' : '' ) .
						( in_array( 'nodogscatskids', $fetch ) ? 'noDogsCatsKids: "' . $fetch['nodogscatskids'] . '",' : '' ) .
						( in_array( 'nodogscats', $fetch ) ? 'noDogsCats: "' . $fetch['nodogscats'] . '",' : '' ) .
						( in_array( 'nodogskids', $fetch ) ? 'noDogsKids: "' . $fetch['nodogskids'] . '",' : '' ) .
						( in_array( 'nocatskids', $fetch ) ? 'noCatsKids: "' . $fetch['nocatskids'] . '",' : '' ) .
						( in_array( 'narrowlayout', $fetch ) ? 'narrowLayout: "' . $fetch['narrowlayout'] . '",' : '' ) .
						( in_array( 'onespecies', $fetch ) ? 'oneSpecies: "' . $fetch['onespecies'] . '",' : '' ) .
						( in_array( 'newtab', $fetch ) ? 'newTab: "' . $fetch['newtab'] . '",' : '' ) .
					'});' .
				'});' .
			'})(window, document);' .
		'</script>';

	return $markup . $init;

}
add_shortcode( 'fetch2', 'fetch2_shortcode' );