(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.fetch = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var fetch = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'classList' in document.createElement('_'); // Feature test
	var settings;

	// Default settings
	var defaults = {

		// API Defaults
		key: null,
		shelter: null,
		count: 25,

		// Template info
		allPetsTitle: 'Our Pets',
		allPetsText: '',
		adoptionFormLink: null,
		adoptionFormText: 'Fill out an adoption form',
		adoptionFormClass: '',
		showFilters: true,
		filterAnimals: true,
		filterSizes: true,
		filterAges: true,
		filterGenders: true,
		filterBreeds: true,
		filtersToggleClass: '',
		hasSidebar: false,

		// Selectors
		selectorContent: '.fetch-container',
		selectorAppMain: '[data-petfinder="main"]',
		selectorAppAside: '[data-petfinder="aside"]',
		selectorRightHeight: '[data-right-height]',

		// Class Hooks
		initClass: 'js-fetch',
		allClass: 'js-fetch-all-pets',
		oneClass: 'js-fetch-one-pet',
		hasSidebarClass: 'js-fetch-has-sidebar',

		// Miscellaneous
		titlePrefix: '{{name}} | ',
		loading: 'Fetching the latest pet info...',
		noPet: '<div>Sorry, but this pet is no longer available. <a href="{{url.all}}">View available pets.</a></div>',

		// Pet photos
		noImage: '',

		// Animal Text
		animalUnknown: 'Not Known',

		// Breeds Text
		breedDelimiter: ', ',

		// Size Text
		sizeUnknown: 'Not Known',
		sizeS: 'Small',
		sizeM: 'Medium',
		sizeL: 'Large',
		sizeXL: 'Extra Large',

		// Age Text
		ageUnknown: 'Not Known',
		ageBaby: 'Baby',
		ageYoung: 'Young',
		ageAdult: 'Adult',
		ageSenior: 'Senior',

		// Gender Text
		genderUnknown: 'Not Known',
		genderM: 'Male',
		genderF: 'Female',

		// Options Text
		optionsSpecialNeeds: 'Special Needs',
		optionsNoDogs: 'No Dogs',
		optionsNoCats: 'No Cats',
		optionsNoKids: 'No Kids',
		optionsNoClaws: 'No Claws',
		optionsHasShot: 'Has hots',
		optionsHousebroken: 'Housebroken',
		optionsAltered: 'Spayed/Neutered',

		// Multi-Option Text
		optionsNoDogsCatsKids: 'No Dogs/Cats/Kids',
		optionsNoDogsCats: 'No Dogs/Cats',
		optionsNoDogsKids: 'No Dogs/Kids',
		optionsNoCatsKids: 'No Cats/Kids',

		// Callbacks
		callback: function () {
			renderGrid();
			renderHeader();
			renderOptions();
			renderPhotoSwipe();
			initPhotoSwipeFromDOM( '[data-photoswipe]' );
			initRightHeight({ selector: settings.selectorRightHeight });
			petfinderSort.init({
				initClass: 'js-fetch-sort'
			});
			houdini.init();
		},

	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Create layout templates
	 * @private
	 * @return {Object} The templates
	 */
	var createTemplates = function () {

		var templates = {
			allPets:
				'<article class="fetch-grid-dynamic fetch-text-center {{classes}}" data-right-height-content>' +
					'<header>' +
						'<a href="{{url.pet}}">' +
							'<figure><img class="fetch-img-photo fetch-img-limit-height" src="{{photo.1.medium}}"></figure>' +
							'<h2 class="fetch-all-pets-heading fetch-no-padding-top fetch-no-margin-top fetch-no-padding-bottom fetch-no-margin-bottom">{{name}}</h2>' +
						'</a>' +
					'</header>' +
					'<aside class="fetch-text-small">' +
						'<p>' +
							'{{size}}, {{age}}, {{gender}}<br>' +
							'<span class="fetch-text-muted">{{breeds}}</span>' +
							'<span class="fetch-text-muted" data-fetch-options-multi="{{options.multi}}"></span>' +
							'<span class="fetch-text-muted" data-fetch-options-special-needs="{{options.specialNeeds}}"></span>' +
						'</p>' +
					'</aside>' +
				'</article>',
			onePet:
				'<article>' +
					'<header>' +
						'<h1 class="fetch-no-margin-bottom fetch-no-padding-bottom">{{name}}</h1>' +
						'<aside><p><a href="{{url.all}}">&larr; Back to All Pets</a></p></aside>' +
					'</header>' +
					'<div data-fetch-images="{{name}}" data-fetch-img-1="{{photo.1.large}}" data-fetch-img-2="{{photo.2.large}}" data-fetch-img-3="{{photo.3.large}}"></div>' +
					'<p data-fetch-options-multi="{{options.multi}}" data-fetch-options-special-needs="{{options.specialNeeds}}">' +
						'<strong>Size:</strong> {{size}}' +
						'<br><strong>Age:</strong> {{age}}' +
						'<br><strong>Gender:</strong> {{gender}}' +
						'<br><strong>Breeds:</strong> {{breeds}}' +
					'</p>' +
					( settings.adoptionFormLink ? '<p><a class="' + settings.adoptionFormClass + '" href="' + settings.adoptionFormLink + '">' + settings.adoptionFormText + '</a></p>' : '' ) +
					'<div>{{description}}</div>' +
				'</article>',
			asideAllPets:
				'<div class="fetch-filters" id="fetch-filters">' +
					( settings.showFilters && settings.filterAnimals ? '<div><h2>Animals</h2>{{checkbox.animals}}</div>' : '' ) +
					( settings.showFilters && settings.filterSizes ? '<div><h2>Size</h2>{{checkbox.sizes}}</div>' : '' ) +
					( settings.showFilters && settings.filterAges ? '<div><h2>Age</h2>{{checkbox.ages}}</div>' : '' ) +
					( settings.showFilters && settings.filterGenders ? '<div><h2>Gender</h2>{{checkbox.genders}}</div>' : '' ) +
					( settings.showFilters && settings.filterBreeds ? '<div><h2>Breeds</h2>{{checkbox.breeds.toggle}}</div>' : '' ) +
				'</div>' +
				( settings.showFilters ? '<p class="fetch-filters-toggle"><button class="' + settings.filtersToggleClass + '" data-collapse="#fetch-filters">Filter Results</button></p>' : '' ),
		};

		return templates;

	};

	/**
	 * Render the basic layout
	 * @private
	 */
	var renderLayout = function () {

		// Get content
		var content = document.querySelector( settings.selectorContent );
		if ( !content ) return;

		// Add grid wrapper
		content.innerHTML =
			'<div class="fetch-margin-bottom" data-petfinder="aside"></div>' +
			'<div class="fetch-margin-bottom" data-petfinder="main" data-right-height>' +
				content.innerHTML +
			'</div>' +
			'<p id="fetch-powered-by"><em>Powered by <a rel="nofollow" href="https://www.petfinder.com/">Petfinder</a> using the <a href="http://fetch.gomakethings.com">Fetch plugin</a>.</em></p>';

	};

	/**
	 * @todo Render the markup for the grid
	 * @private
	 */
	var renderGrid = function () {

		// Variables
		var content = document.querySelector( settings.selectorContent );
		var main = content.querySelector( settings.selectorAppMain );
		var aside = content.querySelector( settings.selectorAppAside );
		var poweredBy = content.querySelector( '#fetch-powered-by' );

		// Sanity check
		if ( !main || !aside ) return;

		// If is the "All Pets" page
		if ( document.documentElement.classList.contains( settings.allClass ) ) {

			// Add row to main content
			main.innerHTML = '<div class="fetch-row">' + main.innerHTML + '</div>';

			// Don't reduce content size if page has no filters or a sidebar
			if ( !settings.showFilters || settings.hasSidebar ) return;

			// Add grid structure
			content.classList.add( 'fetch-row' );
			main.classList.add( 'fetch-grid-three-fourths' );
			aside.classList.add( 'fetch-grid-fourth' );
			poweredBy.classList.add( 'fetch-grid-full' );

			return;

		}

		// If is an individual pet profile
		if ( settings.hasSidebar ) return; // Don't reduce content size if page has a sidebar
		content.classList.add( 'fetch-container-small' );
		content.classList.add( 'fetch-float-center' );

	};

	/**
	 * Render the header content on the "All Pets" page
	 * @private
	 */
	var renderHeader = function () {

		// Only run on "All Pets" page
		if ( !document.documentElement.classList.contains( settings.allClass ) ) return;

		// Get container
		var pets = document.querySelector( settings.selectorAppMain );
		if ( !pets ) return;

		// Render header
		pets.innerHTML = '<header><h1>' + settings.allPetsTitle + '</h1><div class="fetch-margin-bottom">' + settings.allPetsText + '</div></header>' + pets.innerHTML;

	};

	/**
	 * Get pet options from data attributes and render markup
	 * @private
	 */
	var renderOptions = function () {

		// Get DOM elements
		var options = document.querySelectorAll( '[data-fetch-options-multi]' );
		var specialNeeds = document.querySelectorAll( '[data-fetch-options-special-needs]' );
		var i, len, option, need;

		// Options
		for ( i = 0, len = options.length; i < len; i ++ ) {
			option = options[i].getAttribute( 'data-fetch-options-multi' );
			if ( !option ) continue;
			options[i].innerHTML += '<br><em class="fetch-text-muted1">' + option + '</em>';
		}

		// Special needs
		for ( i = 0, len = specialNeeds.length; i < len; i ++ ) {
			need = specialNeeds[i].getAttribute( 'data-fetch-options-special-needs' );
			if ( !need ) continue;
			specialNeeds[i].innerHTML += '<br><em class="fetch-text-muted1">' + need + '</em>';
		}

	};

	/**
	 * Extra images from data attributes and render PhotoSwipe markup
	 * @private
	 */
	var renderPhotoSwipe = function () {

		// Only run on individual pet profiles
		if ( !document.documentElement.classList.contains( settings.oneClass ) ) return;

		// Get image container
		var images = document.querySelector( '[data-fetch-images]' );
		if ( !images ) return;

		// Get images
		var name = images.getAttribute( 'data-fetch-images' );
		var img1 = images.getAttribute( 'data-fetch-img-1' );
		var img2 = images.getAttribute( 'data-fetch-img-2' );
		var img3 = images.getAttribute( 'data-fetch-img-3' );

		var gallery =
			'<div data-photoswipe data-pswp-uid="0" class="fetch-row fetch-row-start-xsmall fetch-text-center fetch-margin-bottom-small">' +
				( img1 ? '<a class="fetch-grid-third" data-size href="' + img1 + '" ><img class="fetch-img-photo fetch-img-limit-height" alt="A photo of ' + name + '" src="' + img1 + '"></a>' : '' ) +
				( img2 ? '<a class="fetch-grid-third" data-size href="' + img2 + '" ><img class="fetch-img-photo fetch-img-limit-height" alt="A photo of ' + name + '" src="' + img2 + '"></a>' : '' ) +
				( img3 ? '<a class="fetch-grid-third" data-size href="' + img3 + '" ><img class="fetch-img-photo fetch-img-limit-height" alt="A photo of ' + name + '" src="' + img3 + '"></a>' : '' ) +
			'</div>' +
			'<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">' +
				'<div class="pswp__bg"></div>' +
				'<div class="pswp__scroll-wrap">' +
					'<div class="pswp__container">' +
						'<div class="pswp__item"></div>' +
						'<div class="pswp__item"></div>' +
						'<div class="pswp__item"></div>' +
					'</div>' +
					'<div class="pswp__ui pswp__ui--hidden">' +
						'<div class="pswp__top-bar">' +
							'<div class="pswp__counter"></div>' +
							'<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>' +
							'<button class="pswp__button pswp__button--share" title="Share"></button>' +
							'<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>' +
							'<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>' +
							'<div class="pswp__preloader">' +
								'<div class="pswp__preloader__icn">' +
								'<div class="pswp__preloader__cut">' +
									'<div class="pswp__preloader__donut"></div>' +
								'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">' +
							'<div class="pswp__share-tooltip"></div>' +
						'</div>' +
						'<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>' +
						'<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>' +
						'<div class="pswp__caption">' +
							'<div class="pswp__caption__center"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		images.innerHTML = gallery;

		imagesLoaded(images, function () {
			var sizes = images.querySelectorAll( '[data-size]' );
			for ( var i = 0, len = sizes.length; i < len; i++ ) {
				var img = sizes[i].querySelector( 'img' );
				if ( !img ) continue;
				sizes[i].setAttribute( 'data-size', img.naturalWidth + 'x' + img.naturalHeight );
			}
		});

	};

	/**
	 * Initialize RightHeight after images are loaded
	 * @private
	 */
	var initRightHeight = function () {
		var rh = document.querySelector( settings.selectorRightHeight );
		if ( !rh ) return;
		imagesLoaded(rh, function () {
			rightHeight.init({
				selector: settings.selectorRightHeight,
			});
		});
	};

	/**
	 * Initialize PhotoSwipe
	 * @private
	 * @param  {String} gallerySelector Selector for the image gallery
	 */
	var initPhotoSwipeFromDOM = function(gallerySelector) {

		var parseThumbnailElements = function(el) {
			var thumbElements = el.childNodes,
				numNodes = thumbElements.length,
				items = [],
				el,
				childElements,
				thumbnailEl,
				size,
				item;

			for(var i = 0; i < numNodes; i++) {
				el = thumbElements[i];

				// include only element nodes
				if(el.nodeType !== 1) {
					continue;
				}

				childElements = el.children;

				size = el.getAttribute('data-size').split('x');

				// create slide object
				item = {
					src: el.getAttribute('href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10),
					author: el.getAttribute('data-author')
				};

				item.el = el; // save link to element for getThumbBoundsFn

				if(childElements.length > 0) {
					item.msrc = childElements[0].getAttribute('src'); // thumbnail url
					if(childElements.length > 1) {
						item.title = childElements[1].innerHTML; // caption (contents of figure)
					}
				}

				var mediumSrc = el.getAttribute('data-med');
				if(mediumSrc) {
					size = el.getAttribute('data-med-size').split('x');
					// "medium-sized" image
					item.m = {
						src: mediumSrc,
						w: parseInt(size[0], 10),
						h: parseInt(size[1], 10)
					};
				}

				// original image
				item.o = {
					src: item.src,
					w: item.w,
					h: item.h
				};

				items.push(item);
			}

			return items;
		};

		// find nearest parent element
		var closest = function closest(el, fn) {
			return el && ( fn(el) ? el : closest(el.parentNode, fn) );
		};

		var onThumbnailsClick = function(e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			var clickedListItem = closest(eTarget, function(el) {
				return el.tagName === 'A';
			});

			if(!clickedListItem) {
				return;
			}

			var clickedGallery = clickedListItem.parentNode;

			var childNodes = clickedListItem.parentNode.childNodes,
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;

			for (var i = 0; i < numChildNodes; i++) {
				if(childNodes[i].nodeType !== 1) {
					continue;
				}

				if(childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}

			if(index >= 0) {
				openPhotoSwipe( index, clickedGallery );
			}
			return false;
		};

		var photoswipeParseHash = function() {
			var hash = window.location.hash.substring(1),
			params = {};

			if(hash.length < 5) { // pid=1
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if(!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
				if(pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if(params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		};

		var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
				gallery,
				options,
				items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {

				galleryUID: galleryElement.getAttribute('data-pswp-uid'),

				getThumbBoundsFn: function(index) {
					// See Options->getThumbBoundsFn section of docs for more info
					var thumbnail = items[index].el.children[0],
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = thumbnail.getBoundingClientRect();

					return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
				},

				addCaptionHTMLFn: function(item, captionEl, isFake) {
					if(!item.title) {
						captionEl.children[0].innerText = '';
						return false;
					}
					captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
					return true;
				}

			};


			if(fromURL) {
				if(options.galleryPIDs) {
					// parse real index when custom PIDs are used
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for(var j = 0; j < items.length; j++) {
						if(items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if( isNaN(options.index) ) {
				return;
			}



			var radios = document.getElementsByName('gallery-style');
			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
					if(radios[i].id == 'radio-all-controls') {

					} else if(radios[i].id == 'radio-minimal-black') {
						options.mainClass = 'pswp--minimal--dark';
						options.barsSize = {top:0,bottom:0};
						options.captionEl = false;
						options.fullscreenEl = false;
						options.shareEl = false;
						options.bgOpacity = 0.85;
						options.tapToClose = true;
						options.tapToToggleControls = false;
					}
					break;
				}
			}

			if(disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

			// see: http://photoswipe.com/documentation/responsive-images.html
			var realViewportWidth,
				useLargeImages = false,
				firstResize = true,
				imageSrcWillChange;

			gallery.listen('beforeResize', function() {

				var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
				dpiRatio = Math.min(dpiRatio, 2.5);
				realViewportWidth = gallery.viewportSize.x * dpiRatio;


				if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
					if(!useLargeImages) {
						useLargeImages = true;
						imageSrcWillChange = true;
					}

				} else {
					if(useLargeImages) {
						useLargeImages = false;
						imageSrcWillChange = true;
					}
				}

				if(imageSrcWillChange && !firstResize) {
					gallery.invalidateCurrItems();
				}

				if(firstResize) {
					firstResize = false;
				}

				imageSrcWillChange = false;

			});

			gallery.listen('gettingData', function(index, item) {
				if( useLargeImages || !('m' in item) ) {
					item.src = item.o.src;
					item.w = item.o.w;
					item.h = item.o.h;
				} else {
					item.src = item.m.src;
					item.w = item.m.w;
					item.h = item.m.h;
				}
			});

			gallery.init();
		};

		var galleryElements = document.querySelectorAll( gallerySelector );
		if ( galleryElements.length > 0 ) {
			imagesLoaded(galleryElements[0], function () {

				// select all gallery elements
				for(var i = 0, l = galleryElements.length; i < l; i++) {
					galleryElements[i].setAttribute('data-pswp-uid', i+1);
					galleryElements[i].onclick = onThumbnailsClick;
				}

			});
		}
	};

	/**
	 * Initialize Plugin
	 * @public
	 * @param {Object} options User settings
	 */
	fetch.init = function ( options ) {

		// Feature test
		if ( !supports ) return;

		// Merge user options with defaults
		settings = extend( defaults, options || {} );

		// If API key or shelter ID are not provided, end init and log error
		if ( !settings.key || !settings.shelter ) {
			console.log( 'You must provide a Petfinder API key and shelter ID to fetch pets from Petfinder' );
			return;
		}

		// If all filters are false, set "showFilters" to false
		if (
			!settings.filterAnimals &&
			!settings.filterSizes &&
			!settings.filterAges &&
			!settings.filterGenders &&
			!settings.filterBreeds ) {
				settings.showFilters = false;
		}

		// Get templates
		var templates = createTemplates();
		settings.templates = extend( settings.templates, { allPets: templates.allPets, onePet: templates.onePet, asideAllPets: templates.asideAllPets, } );

		// Render the basic layout markup
		renderLayout();

		// If page has sidebar, add special class
		if ( settings.hasSidebar ) {
			document.documentElement.classList.add( settings.hasSidebarClass );
		}

		// Init petfinderAPI4everybody
		petfinderAPI.init(settings);

	};


	//
	// Public APIs
	//

	return fetch;

});