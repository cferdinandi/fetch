var Fetch = (function () {

	'use strict';

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
		var filterTypes = ['filterSizes', 'filterAges', 'filterGenders', 'filterSpecies', 'filterBreeds', 'filterOther'];
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
						'<div clas="fetch-filter-section">' +
							'<h2 class="fetch-filter-heading">' + type + '</h2>' +
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
		if (env.dogs === false && env.children === false) return stetings.noDogsKids;
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


	//
	// Return the Constructor
	//

	return Constructor;

})();