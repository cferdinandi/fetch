var Fetch = (function () {

	'use strict';

	//
	// Variables
	//

	// Default settings
	var defaults = {
		status: 'adoptable',
		status1: 'adoptable',
		status2: 'adoptable',
		status3: 'adoptable',
		status4: 'adoptable',
		status5: 'adoptable',
		status6: 'adoptable',
		status7: 'adoptable',
		status8: 'adoptable',
		status9: 'adoptable',
		status10: 'adoptable',
		status11: 'adoptable',
		status12: 'adoptable',
		status13: 'adoptable',
		status14: 'adoptable'
	};

	//
	// Methods
	//

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
		return pets && pets.pets && pets.timestamp && pets.timestamp + 3600000 < new Date().getTime();
	};

	var getImgURL = function (imgs, size) {
		if (size && imgs[size]) return imgs[size];
		if (imgs['large']) return imgs['large'];
		if (imgs['full']) return imgs['full'];
		if (imgs['medium']) return imgs['medium'];
		if (imgs['small']) return imgs['small'];
		return '';
	};

	var getBreeds = function (breeds) {
		if (breeds.secondary) {
			return [breeds.primary, breeds.secondary].join(', ');
		}
		return breeds.primary;
	};

	var getFilterValues = function (pets) {
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
				filters.other.push('No Cats');
			}
			if (pet.environment.dogs === false && filters.other.indexOf('No Dogs') < 0) {
				filters.other.push('No Dogs');
			}
			if (pet.environment.children === false && filters.other.indexOf('No Kids') < 0) {
				filters.other.push('No Kids');
			}
			if (pet.attributes.special_needs && filters.other.indexOf('Special Needs') < 0) {
				filters.other.push('Special Needs');
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
		return 'fetch-filter-' + type + '-' + item.replace(' ', '-');
	};

	var getFilterFields = function (pets, settings) {

		// Get filters for pets
		var filters = sortFilterValues(getFilterValues(pets));
		var filterTypes = ['sizes', 'ages', 'genders', 'species', 'breeds', 'other'];

		// Setup markup string
		return filterTypes.map(function (type) {
			var html =
				'<h2 class="fetch-filter-heading">' + type + '</h2>' +
				filters[type].map(function (item) {
					var prop = classify(type, item);
					var field =
						'<label for="' + prop + '">' +
							'<input type="checkbox" id="' + prop + '" data-fetch-filter=".' + prop + '" checked> ' +
							item +
						'</label>';
					return field;
				}).join('');
			return html;
		}).join('');

	};

	var getEvironment = function (env) {
		if (env.cats === false && env.dogs === false && env.children === false) return 'No Cats/Dogs/Kids';
		if (env.cats === false && env.dogs === false) return 'No Cats/Dogs';
		if (env.cats === false && env.children === false) return 'No Cats/Kids';
		if (env.dogs === false && env.children === false) return 'No Dogs/Kids';
		if (env.cats === false) return 'No Cats';
		if (env.dogs == false) return 'No Dogs';
		if (env.children === false) return 'No Kids';
	};

	var getPetClasses = function (pet, breeds) {

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
			classes.push(classify('other', 'No Cats'));
		}
		if (pet.environment.dogs === false) {
			classes.push(classify('other', 'No Dogs'));
		}
		if (pet.environment.children === false) {
			classes.push(classify('other', 'No Kids'));
		}
		if (pet.attributes.special_needs) {
			classes.push(classify('other', 'Special Needs'));
		}

		return classes.join(' ');

	};

	var renderPets = function (target, pets, settings) {
		console.log(pets);
		target.classList.add('fetch-loaded');
		target.innerHTML =
			'<div class="fetch-filters">' +
				getFilterFields(pets, settings) +
			'</div>' +
			'<div class="fetch-pet-listings">' +
				'<div class="fetch-row">' +
					pets.map(function (pet) {
						var environment = getEvironment(pet.environment);
						var breeds = getBreeds(pet.breeds);
						var html =
							'<div class="fetch-grid ' + getPetClasses(pet, breeds) + '">' +
								'<a href="' + pet.url + '">' +
									(pet.photos.length > 0 ? '<div><img class="fetch-img" alt="A photo of ' + pet.name + '" src="' + getImgURL(pet.photos[0]) + '"></div>' : '') +
									'<h3>' + pet.name + '</h3>' +
								'</a>' +
								'<p class="fetch-all-pets-summary">' + pet.size + ', ' + pet.age + ', ' + pet.gender + '</p>' +
								'<p class="fetch-all-pets-breeds">' + breeds + '</p>' +
								(environment ? '<p class="fetch-all-pets-environment">' + environment + '</p>' : '') +
								(pet.attributes.special_needs ? '<p class="fetch-all-pets-special-needs">Special Needs</p>' : '') +
							'</div>';
						return html;
					}).join('') +
				'</div>' +
				'<p>Powered by <a href="https://fetch.gomakethings.com">the Fetch plugin</a>.</p>' +
			'</div>';
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
			if (data.pagination.current_page < data.pagination.total_pages) {
				makeCall(target, credentials, settings, key, parseFloat(data.pagination.current_page) + 1, allPets);
			} else {
				savePets(allPets, key);
				renderPets(target, allPets, settings);
			}
		});
	};

	var filterPets = function (selector) {



	};

	/**
	 * Create the Constructor object
	 */
	var Constructor = function (selector, credentials, options) {

		var target = document.querySelector(selector);
		if (!target) {
			return console.error('Please provide a valid selector.');
		}

		// Make sure all required info is provided
		if (!credentials || !credentials.shelter || !credentials.key || !credentials.secret) {
			return console.error('Fetch requires a shelter ID, API key, and API secret.');
		}

		// Merge options into defaults
		var settings = Object.assign(defaults, options);
		var key = window.btoa(credentials.shelter + JSON.stringify(options));


		var handleFilters = function (event) {

			// Check the checkbox
			var checkbox = event.target.closest(selector + ' [data-fetch-filter]');
			if (!checkbox) return;

			filterPets(selector);

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

			if (pets && pets.timestamp + 3600000 < new Date().getTime()) {
				renderPets(target, pets.pets, settings);
				return;
			}

			getFromAPI();
			document.addEventListener('click', handleFilters);

		};

		init();

	};


	//
	// Return the Constructor
	//

	return Constructor;

})();