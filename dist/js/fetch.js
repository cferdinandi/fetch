/*! fetch v2.0.0 | (c) 2019 Chris Ferdinandi | LicenseRef-See included LICENSE.md License | https://github.com/cferdinandi/fetch | Includes code from: https://gist.github.com/gitgrimbo/6451492, http://photoswipe.com, https://github.com/cferdinandi/right-height, https://github.com/cferdinandi/houdini */
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
		return pets.reduce((function (filters, pet) {

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
			breeds.split(', ').forEach((function (breed) {
				if (filters.breeds.indexOf(breed) < 0) {
					filters.breeds.push(breed);
				}
			}));

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

		}), {sizes: [], ages: [], genders: [], species: [], breeds: [], other: []});
	};

	var getFilterFields = function (pets, settings) {

		// Get filters for pets
		var filters = getFilterValues(pets);

		// Order filter values
		filters.species.sort();
		filters.breeds.sort();
		filters.other.sort();

		// Setup markup string
		var html = '';

		html += '<h2>Sizes</h2>' + filters.sizes.map((function (size) {
			return '<li><label><input type="checkbox"> ' + size + '</label></li>';
		}));


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

	var renderPets = function (target, pets, settings) {
		console.log(pets);
		target.classList.add('fetch-all-pets');
		var filters = getFilterFields(pets, settings);
		target.innerHTML =
			'<div class="fetch-filters">' +
				'<p>coming soon...</p>' +
			'</div>' +
			'<div class="fetch-pet-listings">' +
				'<div class="fetch-row">' +
					pets.map((function (pet) {
						var environment = getEvironment(pet.environment);
						var html =
							'<div class="fetch-grid">' +
								'<a href="' + pet.url + '">' +
									(pet.photos.length > 0 ? '<div><img class="fetch-img" alt="A photo of ' + pet.name + '" src="' + getImgURL(pet.photos[0]) + '"></div>' : '') +
									'<h2>' + pet.name + '</h2>' +
								'</a>' +
								'<p class="fetch-all-pets-summary">' + pet.size + ', ' + pet.age + ', ' + pet.gender + '</p>' +
								'<p class="fetch-all-pets-breeds">' + getBreeds(pet.breeds) + '</p>' +
								(environment ? '<p class="fetch-all-pets-environment">' + environment + '</p>' : '') +
								(pet.attributes.special_needs ? '<p class="fetch-all-pets-special-needs">Special Needs</p>' : '') +
							'</div>';
						return html;
					})).join('') +
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
		}).then((function (resp) {
			if (resp.ok) {
				return resp.json();
			} else {
				return Promise.reject(resp);
			}
		})).then((function (data) {
			var allPets = pets.concat(data.animals);
			if (data.pagination.current_page < data.pagination.total_pages) {
				makeCall(target, credentials, settings, key, parseFloat(data.pagination.current_page) + 1, allPets);
			} else {
				savePets(allPets, key);
				renderPets(target, allPets, settings);
			}
		}));
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
			}).then((function (resp) {
				if (resp.ok) {
					return resp.json();
				} else {
					return Promise.reject(resp);
				}
			})).then((function (data) {
				credentials.token = data.access_token;
				credentials.tokenType = data.token_type;
				makeCall(target, credentials, settings, key);
			})).catch((function (err) {
				console.log('something went wrong', err);
			}));
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

		};

		init();

	};


	//
	// Return the Constructor
	//

	return Constructor;

})();