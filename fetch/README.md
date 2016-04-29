# Fetch
- [Getting Started](#getting-started)
- [Getting started with WordPress](#getting-started-with-wordpress)
- [Options and Settings](#options-and-settings)
- [Examples](#examples)
- [Support](#support)

## Getting started

### 1. Include Fetch on your site

Unzip `fetch.zip`. You need to include two files on your site: `fetch.js` and `fetch.css`. How you do this will vary depending on which CMS (NationBuilder, Weebly, Squarespace, etc.) you use.

```lang-markup
<link rel="stylesheet" type="text/css" href="fetch.css">
<script src="fetch.js"></script>
```

### 2. Add the markup to your page

On the page where you want your Petfinder listings to appear, add a `<div>` with the `.fetch-container` class. You should include a message for people who's browsers aren't supported by Fetch&mdash;ideally a link to your listings on Petfinder.

```lang-markup
<div class="fetch-container">
    Anything you want to display if Fetch isn't supported by the visitor's browser.
</div>
```

### 3. Initialize Fetch

In the footer of your page, after the content, initialize Fetch. There's only three things you need to include:

1. Your Petfinder API key
2. Your Shelter ID
3. The number of pets to display (if your organization has more than 25 pets)

```lang-markup
<script>
    fetch.init({
        key: "YOUR API KEY",
        shelter: "YOUR SHELTER ID",
        count: 25,
    });
</script>
```

And that's it, you're done. Nice work!

***Note:*** *If you don't have one already, you'll need to [create a Petfinder API key here](https://www.petfinder.com/developers/api-key).*

### An example

```lang-markup
<link rel="stylesheet" type="text/css" href="fetch.css">
<script src="fetch.js"></script>

<div class="fetch-container">
    <a href="http://awos.petfinder.com/shelters/AA11.html">View our pets on Petfinder.</a>
</div>

<script>
    fetch.init({
        key: "7zQqMRcGFeznhF3BgyH9",
        shelter: "AA11",
        count: 25,
    });
</script>
```

## Getting started with WordPress

If you're using WordPress, getting started with Fetch is even easier.

1. From the WordPress Dashboard, upload `fetch.zip` under `Plugins` > `Add New` > `Upload Plugin`.
2. Activate Fetch in the Dashboard under `Plugins`.
3. On the page where you want your Petfinder listings to appear, use the <code>[[fetch][/fetch]]</code> shortcode, passing in your API key and shelter ID (and number of pets if greater than 25):

    ```lang-markup
    [[fetch key="YOUR API KEY" shelter="YOUR SHELTER ID" count="25"]Anything you want to display if Fetch isn't supported by the visitor's browser.[/fetch]]
    ```

### A WordPress Example

<pre><code class="lang-markup">[[fetch key="7zQqMRcGFeznhF3BgyH9" shelter="AA11"  count="25"]&lt;a href="http://awos.petfinder.com/shelters/AA11.html"&gt;View our pets on Petfinder.&lt;/a&gt;[/fetch]]</code></pre>

## Options and Settings

You can update Fetch defaults and options using `fetch.init()` or the WordPress shortcode.

### Options with `fetch.init();`

These are the defaults. You only need to include the ones you want to change.

```lang-javascript
fetch.init({
	// API Defaults
	key: null, // Your Petfinder API key
	shelter: null, // Your shelter ID
	count: 25, // The number of pets to display (must be larger than)

	// Template info
	allPetsTitle: 'Our Pets', // Header for the "All Pets" page
	allPetsText: '', // Optional text to display on the "All Pets" page
	adoptionFormLink: null, // The URL of your adoption form
	adoptionFormText: 'Fill out an adoption form', // Text for your adoption form link
	adoptionFormClass: '', // CSS classes for your adoption form link
	showFilters: true, // Display filters to hide and show pets by categories
	filterAnimals: true, // Display animal filters
	filterSizes: true, // Display size filters
	filterAges: true, // Display age filters
	filterGenders: true, // Display gender filters
	filterBreeds: true, // Display breed filters
	filtersToggleClass: '', // CSS class for the button that toggles filter visibility on smaller screens
	hasSidebar: false, // Set to true for a special layout on narrow pages

	// Miscellaneous
	loading: 'Fetching the latest pet info...', // What to display while retrieving data from Petfinder
	noPet: '<div>Sorry, but this pet is no longer available. <a href="{{url.all}}">View available pets.</a></div>', // What to display if a pet is no longer listed in Petfinder ({{url.all}} is replaced with a link to the "All Pets" view)

	// Pet photos
	noImage: '', // An image to show if no image is available for a pet

	// Animal Text
	animalUnknown: 'Not Known', // Text to use if animal type is unknown

	// Size Text
	sizeUnknown: 'Not Known', // Text to display if size is unknown
	sizeS: 'Small', // Text to display for small pets
	sizeM: 'Medium', // Text to display for medium pets
	sizeL: 'Large', // Text to display for large pets
	sizeXL: 'Extra Large', // Text to display for extra large pets

	// Age Text
	ageUnknown: 'Not Known', // Text to display when age is unknown
	ageBaby: 'Baby', // Text to display for baby pets
	ageYoung: 'Young', // Text to display for young pets
	ageAdult: 'Adult', // Text to display for adult pets
	ageSenior: 'Senior', // Text to display for senior pets

	// Gender Text
	genderUnknown: 'Not Known', // Text to display when gender is unknown
	genderM: 'Male', // Text to display for male pets
	genderF: 'Female', // Text to display for female pets

	// Options Text
	optionsSpecialNeeds: 'Special Needs', // Text to display for pets with special needs
	optionsNoDogs: 'No Dogs', // Text to display for pets that aren't good with dogs
	optionsNoCats: 'No Cats', // Text to display for pets that aren't good with cats
	optionsNoKids: 'No Kids', // Text to display for pets that aren't good with kids

	// Multi-Option Text
	optionsNoDogsCatsKids: 'No Dogs/Cats/Kids', // Text to display for pets that aren't good with dogs, cats, or kids
	optionsNoDogsCats: 'No Dogs/Cats', // Text to display for pets that aren't good with dogs or cats
	optionsNoDogsKids: 'No Dogs/Kids',  // Text to display for pets that aren't good with dogs or kids
	optionsNoCatsKids: 'No Cats/Kids', // Text to display for pets that aren't good with cats or kids
});
```

### Options with the WordPress shortcode

You would add these to the `[[fetch][/fetch]]` shortcode. These are the defaults. You only need to include the ones you want to change.

**Example:**

```lang-markup
[[fetch key="7zQqMRcGFeznhF3BgyH9" shelter="AA11" allpetstitle="Our Dogs" showfilters="false"][/fetch]]
```

```lang-php
// API Defaults
key="null" // Your Petfinder API key
shelter="null" // Your shelter ID
count="25" // The number of pets to display (must be larger than)

// Template info
allpetstitle="Our Pets" // Header for the "All Pets" page
allpetstext="" // Optional text to display on the "All Pets" page
adoptionformlink="null" // The URL of your adoption form
adoptionformtext="Fill out an adoption form" // Text for your adoption form link
adoptionformclass="" // CSS classes for your adoption form link
showfilters="true" // Display filters to hide and show pets by categories
filteranimals="true" // Display animal filters
filtersizes="true" // Display size filters
filterages="true" // Display age filters
filtergenders="true" // Display gender filters
filterbreeds="true" // Display breed filters
filterstoggleclass="" // CSS class for the button that toggles filter visibility on smaller screens
hassidebar="false" // Set to true for a special layout on narrow pages

// Miscellaneous
loading="Fetching the latest pet info..." // What to display while retrieving data from Petfinder
nopet="<div>Sorry but this pet is no longer available. <a href="{{url.all}}">View available pets.</a></div>" // What to display if a pet is no longer listed in Petfinder ({{url.all}} is replaced with a link to the "All Pets" view)

// Pet photos
noimage="" // An image to show if no image is available for a pet

// Animal Text
animalunknown="Not Known" // Text to use if animal type is unknown

// Size Text
sizeunknown="Not Known" // Text to display if size is unknown
sizes="Small" // Text to display for small pets
sizem="Medium" // Text to display for medium pets
sizel="Large" // Text to display for large pets
sizexl="Extra Large" // Text to display for extra large pets

// Age Text
ageunknown="Not Known" // Text to display when age is unknown
agebaby="Baby" // Text to display for baby pets
ageyoung="Young" // Text to display for young pets
ageadult="Adult" // Text to display for adult pets
agesenior="Senior" // Text to display for senior pets

// Gender Text
genderunknown="Not Known" // Text to display when gender is unknown
genderm="null" // Text to display for male pets
genderf="null" // Text to display for female pets

// Options Text
optionsspecialneeds="Special Needs" // Text to display for pets with special needs
optionsnodogs="No Dogs" // Text to display for pets that aren't good with dogs
optionsnocats="No Cats" // Text to display for pets that aren't good with cats
optionsnokids="No Kids" // Text to display for pets that aren't good with kids

// Multi-Option Text
optionsnodogscatskids="No Dogs/Cats/Kids" // Text to display for pets that aren't good with dogs" cats" or kids
optionsnodogscats="No Dogs/Cats" // Text to display for pets that aren't good with dogs or cats
optionsnodogskids="No Dogs/Kids"  // Text to display for pets that aren't good with dogs or kids
optionsnocatskids="No Cats/Kids" // Text to display for pets that aren't good with cats or kids
```

## Examples

To see working examples, [check out the demos](http://localhost:8888/fetch/wordpress/demos/).

## Support

Please [use the issue tracker](https://github.com/cferdinandi/fetch/blob/master/README.md) to report a bug or ask a question.