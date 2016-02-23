<?php

	/**
	 * Add a shortcode for fetch.js
	 */


	function fetch_load_scripts_and_styles() {
	    wp_register_style( 'fetch-styles', plugins_url( '/dist/css/fetch.css', __FILE__ ) );
	    wp_register_script( 'fetch-scripts', plugins_url( '/dist/js/fetch.js', __FILE__ ) );
	}
	add_action( 'wp_enqueue_scripts', 'fetch_load_scripts_and_styles' );

	function fetch_shortcode( $atts, $content = '' ) {

		// Get user options
		$fetch = shortcode_atts(array(

			// API Defaults
			'key' => null,
			'shelter' => null,
			'count' => null,

			// Template info
			'allpetstitle' => null,
			'allpetstext' => null,
			'adoptionformlink' => null,
			'adoptionformtext' => null,
			'adoptionformclass' => null,
			'showfilters' => null,
			'filteranimals' => null,
			'filtersizes' => null,
			'filterages' => null,
			'filtergenders' => null,
			'filterbreeds' => null,
			'filterstoggleclass' => null,
			'hassidebar' => null,

			// Miscellaneous
			'loading' => null,
			'nopet' => null,

			// Pet photos
			'noimage' => null,

			// Animal Text
			'animalunknown' => null,

			// Size Text
			'sizeunknown' => null,
			'sizes' => null,
			'sizem' => null,
			'sizel' => null,
			'sizexl' => null,

			// Age Text
			'ageunknown' => null,
			'agebaby' => null,
			'ageyoung' => null,
			'ageadult' => null,
			'agesenior' => null,

			// Gender Text
			'genderunknown' => null,
			'genderm' => null,
			'genderf' => null,

			// Options Text
			'optionsspecialneeds' => null,
			'optionsnodogs' => null,
			'optionsnocats' => null,
			'optionsnokids' => null,
			'optionsnoclaws' => null,
			'optionshasshot' => null,
			'optionshousebroken' => null,
			'optionsaltered' => null,

			// Multi-Option Text
			'optionsnodogscatskids' => null,
			'optionsnodogscats' => null,
			'optionsnodogskids' => null,
			'optionsnocatskids' => null,

		), $atts);


		$markup = '<div class="fetch-container">' . $content . '</div>';

		$init =
			'<script>' .
				';(function (window, document, undefined) {' .
					'"use strict";' .
					'/*! Credits: https://github.com/filamentgroup/loadJS, https://github.com/filamentgroup/loadCSS */' .
					'var loadCSS=function(e,n,t){var r,a=window,i=a.document,l=i.createElement("link");if(n)r=n;else{var o=(i.body||i.getElementsByTagName("head")[0]).childNodes;r=o[o.length-1]}var d=i.styleSheets;l.rel="stylesheet",l.href=e,l.media="only x",r.parentNode.insertBefore(l,n?r:r.nextSibling);var f=function(e){for(var n=l.href,t=d.length;t--;)if(d[t].href===n)return e();setTimeout(function(){f(e)})};return l.onloadcssdefined=f,f(function(){l.media=t||"all"}),l};' .
					'var loadJS=function(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o};' .
					'loadCSS("' . plugins_url( '/dist/css/fetch.css', __FILE__ ) . '");' .
					'loadJS("' . plugins_url( '/dist/js/fetch.js', __FILE__ ) . '", function(){' .
						'fetch.init({' .

							// API Defaults
							'key: "' . $fetch['key'] . '",' .
							'shelter: "' . $fetch['shelter'] . '",' .
							( is_null( $fetch['count'] ) ? '' : 'count: ' . $fetch['count '] . ',' ) .

							// Template info
							( is_null( $fetch['allpetstitle'] ) ? '' : 'allPetsTitle: "' . $fetch['allpetstitle'] . '",' ) .
							( is_null( $fetch['allpetstext'] ) ? '' : 'allPetsText: "' . $fetch['allpetstext'] . '",' ) .
							( is_null( $fetch['adoptionformlink'] ) ? '' : 'adoptionFormLink: "' . $fetch['adoptionformlink'] . '",' ) .
							( is_null( $fetch['adoptionformtext'] ) ? '' : 'adoptionFormText: "' . $fetch['adoptionformtext'] . '",' ) .
							( is_null( $fetch['adoptionformclass'] ) ? '' : 'adoptionFormClass: "' . $fetch['adoptionformclass'] . '",' ) .
							( is_null( $fetch['showfilters'] ) ? '' : 'showFilters: ' . $fetch['showfilters'] . ',' ) .
							( is_null( $fetch['filteranimals'] ) ? '' : 'filterAnimals: ' . $fetch['filteranimals'] . ',' ) .
							( is_null( $fetch['filtersizes'] ) ? '' : 'filterSizes: ' . $fetch['filtersizes'] . ',' ) .
							( is_null( $fetch['filterages'] ) ? '' : 'filterAges: ' . $fetch['filterages'] . ',' ) .
							( is_null( $fetch['filtergenders'] ) ? '' : 'filterGenders: ' . $fetch['filtergenders'] . ',' ) .
							( is_null( $fetch['filterbreeds'] ) ? '' : 'filterBreeds: ' . $fetch['filterbreeds'] . ',' ) .
							( is_null( $fetch['filterstoggleclass'] ) ? '' : 'filtersToggleClass: "' . $fetch['filterstoggleclass'] . '",' ) .
							( is_null( $fetch['hassidebar'] ) ? '' : 'hasSidebar: ' . $fetch['hassidebar'] . ',' ) .

							// Miscellaneous
							( is_null( $fetch['loading'] ) ? '' : 'loading: "' . $fetch['loading'] . '",' ) .
							( is_null( $fetch['nopet'] ) ? '' : 'noPet: "' . $fetch['nopet'] . '",' ) .

							// Pet photos
							( is_null( $fetch['noimage'] ) ? '' : 'noImage: "' . $fetch['noimage'] . '",' ) .

							// Animal Text
							( is_null( $fetch['animalunknown'] ) ? '' : 'animalUnknown: "' . $fetch['animalunknown'] . '",' ) .

							// Size Text
							( is_null( $fetch['sizeunknown'] ) ? '' : 'sizeUnknown: "' . $fetch['sizeunknown'] . '",' ) .
							( is_null( $fetch['sizes'] ) ? '' : 'sizeS: "' . $fetch['sizes'] . '",' ) .
							( is_null( $fetch['sizem'] ) ? '' : 'sizeM: "' . $fetch['sizem'] . '",' ) .
							( is_null( $fetch['sizel'] ) ? '' : 'sizeL: "' . $fetch['sizel'] . '",' ) .
							( is_null( $fetch['sizexl'] ) ? '' : 'sizeXL: "' . $fetch['sizexl'] . '",' ) .

							// Age Text
							( is_null( $fetch['ageunknown'] ) ? '' : 'ageUnknown: "' . $fetch['ageunknown'] . '",' ) .
							( is_null( $fetch['agebaby'] ) ? '' : 'ageBaby: "' . $fetch['agebaby'] . '",' ) .
							( is_null( $fetch['ageyoung'] ) ? '' : 'ageYoung: "' . $fetch['ageyoung'] . '",' ) .
							( is_null( $fetch['ageadult'] ) ? '' : 'ageAdult: "' . $fetch['ageadult'] . '",' ) .
							( is_null( $fetch['agesenior'] ) ? '' : 'ageSenior: "' . $fetch['agesenior'] . '",' ) .

							// Gender Text
							( is_null( $fetch['genderunknown'] ) ? '' : 'genderUnknown: "' . $fetch['genderunknown'] . '",' ) .
							( is_null( $fetch['genderm'] ) ? '' : 'genderM: "' . $fetch['genderm'] . '",' ) .
							( is_null( $fetch['genderf'] ) ? '' : 'genderF: "' . $fetch['genderf'] . '",' ) .

							// Options Text
							( is_null( $fetch['optionsspecialneeds'] ) ? '' : 'optionsSpecialNeeds: "' . $fetch['optionsspecialneeds'] . '",' ) .
							( is_null( $fetch['optionsnodogs'] ) ? '' : 'optionsNoDogs: "' . $fetch['optionsnodogs'] . '",' ) .
							( is_null( $fetch['optionsnocats'] ) ? '' : 'optionsNoCats: "' . $fetch['optionsnocats'] . '",' ) .
							( is_null( $fetch['optionsnokids'] ) ? '' : 'optionsNoKids: "' . $fetch['optionsnokids'] . '",' ) .
							( is_null( $fetch['optionsnoclaws'] ) ? '' : 'optionsNoClaws: "' . $fetch['optionsnoclaws'] . '",' ) .
							( is_null( $fetch['optionshasshot'] ) ? '' : 'optionsHasShot: "' . $fetch['optionshasshot'] . '",' ) .
							( is_null( $fetch['optionshousebroken'] ) ? '' : 'optionsHousebroken: "' . $fetch['optionshousebroken'] . '",' ) .
							( is_null( $fetch['optionsaltered'] ) ? '' : 'optionsAltered: "' . $fetch['optionsaltered'] . '",' ) .

							// Multi-Option Text
							( is_null( $fetch['optionsnodogscatskids'] ) ? '' : 'optionsNoDogsCatsKids: "' . $fetch['optionsnodogscatskids'] . '",' ) .
							( is_null( $fetch['optionsnodogscats'] ) ? '' : 'optionsNoDogsCats: "' . $fetch['optionsnodogscats'] . '",' ) .
							( is_null( $fetch['optionsnodogskids'] ) ? '' : 'optionsNoDogsKids: "' . $fetch['optionsnodogskids'] . '",' ) .
							( is_null( $fetch['optionsnocatskids'] ) ? '' : 'optionsNoCatsKids: "' . $fetch['optionsnocatskids'] . '",' ) .

						'});' .
					'});' .
				'})(window, document);' .
			'</script>';

		return $markup . $init;

	}
	add_shortcode( 'fetch', 'fetch_shortcode' );