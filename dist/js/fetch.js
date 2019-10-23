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

	/**
	 * Get the value of a query string from a URL
	 * @param  {String} field The field to get the value of
	 * @return {String}       The value
	 */
	var getQueryString = function (field) {
		var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
		var string = reg.exec(window.location.href);
		return string ? string[1] : null;
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
		return pets && pets.pets && pets.timestamp && pets.timestamp + 3600000 < new Date().getTime();
	};

	var getPetFromID = function (pets, petID) {
		petID = parseFloat(petID);
		var match = pets.filter((function (pet) {
			return pet.id === petID;
		}));
		if (match.length > 0) return match[0];
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

	var getEvironment = function (env) {
		if (env.cats === false && env.dogs === false && env.children === false) return 'No Cats/Dogs/Kids';
		if (env.cats === false && env.dogs === false) return 'No Cats/Dogs';
		if (env.cats === false && env.children === false) return 'No Cats/Kids';
		if (env.dogs === false && env.children === false) return 'No Dogs/Kids';
		if (env.cats === false) return 'No Cats';
		if (env.dogs == false) return 'No Dogs';
		if (env.children === false) return 'No Kids';
	};

	var renderAllPets = function (target, pets, settings) {
		console.log(pets);
		target.classList.add('fetch-all-pets');
		target.innerHTML =
			'<div class="fetch-filters">' +
				'<h2>Filters</h2>' +
				'<p>coming soon...</p>' +
			'</div>' +
			'<div class="fetch-pet-listings">' +
				'<h1>Our Pets</h1>' +
				'<div class="fetch-row">' +
					pets.map((function (pet) {
						var environment = getEvironment(pet.environment);
						var html =
							'<div class="fetch-grid">' +
								'<a href="?petID=' + pet.id + '">' +
									(pet.photos.length > 0 ? '<figure><img class="fetch-img fetch-all-pets-img" alt="A photo of ' + pet.name + '" src="' + getImgURL(pet.photos[0]) + '"></figure>' : '') +
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
				'<p>Powered by <a href="https://fetch.gomakethings.com">the Fetch plugin</a>.</p>';
			'</div>';
	};

	var getPetPhotos = function (photos, name) {
		if (photos.length < 1) return '';
		return '<div class="fetch-pet-photos">' + photos.map((function (photo) {
			var url = getImgURL(photo);
			return '<a class="fetch-pet-photo" href="' + url + '"><img class="fetch-img" alt="A photograph of ' + name + '" src="' + url + '"></a>';
		})).join('') + '</div>';
	};

	var renderPet = function (petID, target, pets, settings) {
		var pet = getPetFromID(pets, petID);
		var environment = getEvironment(pet.environment);
		console.log(pet);
		target.classList.add('fetch-one-pet');

		target.innerHTML =
			'<h1>' + pet.name + '</h1>' +
			getPetPhotos(pet.photos, pet.name) +
			'<ul class="fetch-pet-summary">' +
				'<li><strong>Size:</strong> ' + pet.size + '</li>' +
				'<li><strong>Age:</strong> ' + pet.age + '</li>' +
				'<li><strong>Gender:</strong> ' + pet.gender + '</li>' +
				'<li><strong>Breeds:</strong> ' + getBreeds(pet.breeds) + '</li>' +
			'</ul>' +
			(environment ? '<p class="fetch-pet-environment">' + environment + '</p>' : '') +
			(pet.attributes.special_needs ? '<p class="fetch-pet-special-needs">Special Needs</p>' : '') +
			'<p class="fetch-pet-adoption-form"><a href="">Fill out an adoption form</a></p>' +
			'<div class="fetch-pet-description">' +
				pet.description +
			'</div>';
	};

	var renderPets = function (target, pets, settings) {
		var petID = getQueryString('petID');
		if (petID) {
			renderPet(petID, target, pets, settings);
		} else {
			renderAllPets(target, pets, settings);
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