/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SC
// @class SC.Configuration
// All of the applications configurable defaults

define(
	'SC.Configuration'
,	[

		'item_views_option_tile.tpl'
	,	'item_views_option_text.tpl'
	,	'item_views_selected_option.tpl'

	,	'underscore'
	,	'Utils'
	]

,	function (

		item_views_option_tile_tpl
	,	item_views_option_text_tpl
	,	item_views_selected_option_tpl

	,	_
	)
{

	'use strict';

	var navigationDummyCategories = [
		{
			text: _('Jeans').translate()
		,	href: '/search'
		,	'class': 'header-menu-level3-anchor'
		,	data: {
				touchpoint: 'home'
				, hashtag: '#search'
			}
		},
		{
			text: _('Sweaters').translate()
		,	href: '/search'
		,	'class': 'header-menu-level3-anchor'
		,	data: {
				touchpoint: 'home'
			,	hashtag: '#search'
			}
		},
		{
			text: _('Cardigan').translate()
		,	href: '/search'
		,	'class': 'header-menu-level3-anchor'
		,	data: {
				touchpoint: 'home'
			,	hashtag: '#search'
			}
		},
		{
			text: _('Active').translate()
		,	href: '/search'
		,	'class': 'header-menu-level3-anchor'
		,	data: {
				touchpoint: 'home'
			,	hashtag: '#search'
			}
		},
		{
			text: _('Shoes').translate()
		,	href: '/search'
		,	'class': 'header-menu-level3-anchor'
		,	data: {
				touchpoint: 'home'
			,	hashtag: '#search'
			}
		}
	];


	var Configuration = {


		// @property {Object} searchPrefs Search preferences
		searchPrefs:
		{
			// @property {Number} searchPrefs.maxLength Search preferences. keyword maximum string length - user won't be able to write more than 'maxLength' chars in the search box
			maxLength: 40

			// @property {Function} searchPrefs.keywordsFormatter Search preferences. Keyword formatter function will format the text entered by the user in the search box. This default implementation will remove invalid keyword characters like *()+-="
		,	keywordsFormatter: function (keywords)
			{
				if (keywords === '||')
				{
					return '';
				}

				var anyLocationRegex = /[\(\)\[\]\{\~\}\!\"\:\/]{1}/g // characters that cannot appear at any location
				,	beginingRegex = /^[\*\-\+]{1}/g // characters that cannot appear at the begining
				,	replaceWith = ''; // replacement for invalid chars

				return keywords.replace(anyLocationRegex, replaceWith).replace(beginingRegex, replaceWith);
			}
		}

		// @property {String} imageNotAvailable url for the not available image
	,	imageNotAvailable: _.getAbsoluteUrl('img/no_image_available.jpeg')

	,	templates: {
			itemOptions: {
				// each apply to specific item option types
				selectorByType:	{
					select: item_views_option_tile_tpl
				,	'default': item_views_option_text_tpl
				}
				// for rendering selected options in the shopping cart
			,	selectedByType: {
					'default': item_views_selected_option_tpl
				}
			}
		}

		// @class SCA.Shopping.Configuration
		// @property {Array<Object>} footerNavigation links that goes in the footer
	,	footerNavigation: [
			{text: 'Link a', href:'#'}
		,	{text: 'Link b', href:'#'}
		,	{text: 'Link c', href:'#'}
		]

		// @property {closable:Boolean,saveInCookie:Boolean,anchorText:String,message:String} cookieWarningBanner
		// settings for the cookie warning message (mandatory for UK stores)
	,	cookieWarningBanner: {
			closable: true
		,	saveInCookie: true
		,	anchorText: _('Learn More').translate()
		,	message: _('To provide a better shopping experience, our website uses cookies. Continuing use of the site implies consent.').translate()
		}

		// @class SCA.Shopping.Configuration
		// @property {betweenFacetNameAndValue:String,betweenDifferentFacets:String,betweenDifferentFacetsValues:String,betweenRangeFacetsValues:String,betweenFacetsAndOptions:String,betweenOptionNameAndValue:String,betweenDifferentOptions:String}
	,	facetDelimiters: {
			betweenFacetNameAndValue: '/'
		,	betweenDifferentFacets: '/'
		,	betweenDifferentFacetsValues: ','
		,	betweenRangeFacetsValues: 'to'
		,	betweenFacetsAndOptions: '?'
		,	betweenOptionNameAndValue: '='
		,	betweenDifferentOptions: '&'
		}
		// Output example: /brand/GT/style/Race,Street?display=table

		// eg: a different set of delimiters
		/*
		,	facetDelimiters: {
				betweenFacetNameAndValue: '-'
			,	betweenDifferentFacets: '/'
			,	betweenDifferentFacetsValues: '|'
			,	betweenRangeFacetsValues: '>'
			,	betweenFacetsAndOptions: '~'
			,	betweenOptionNameAndValue: '/'
			,	betweenDifferentOptions: '/'
		}
		*/
		// Output example: brand-GT/style-Race|Street~display/table

		// @param {Object} searchApiMasterOptions options to be passed when querying the Search API
	,	searchApiMasterOptions: {

			Facets: {
				include: 'facets'
			,	fieldset: 'search'
			}

		,	itemDetails: {
				include: 'facets'
			,	fieldset: 'details'
			}

		,	relatedItems: {
				fieldset: 'relateditems_details'
			}

		,	correlatedItems: {
				fieldset: 'correlateditems_details'
			}

			// don't remove, get extended
		,	merchandisingZone: {}

		,	typeAhead: {
				fieldset: 'typeahead'
			}
		}


		// @property {String} logoUrl header will show an image with the url you set here
	,	logoUrl: _.getAbsoluteUrl('img/SCA_Logo.png')

		// @property {String} defaultSearchUrl
	,	defaultSearchUrl: 'search'

		// @property {Boolean} isSearchGlobal setting it to false will search in the current results
		// if on facet list page
	,	isSearchGlobal: true

		// @property {#obj(minLength: Number, maxResults: Number, macro: String, sort: String)} typeahead Typeahead Settings
	,	typeahead: {
			minLength: 3
		,	maxResults: 4
		,	macro: 'typeahead'
		,	sort: 'relevance:asc'
		}

		// @property {Array<NavigationData>} NavigationData array of links used to construct navigation. (maxi menu and sidebar)
		// @class NavigationData
	,	navigationData: [
			{
				// @property {String} text
				text: _('Home').translate()
				// @property {String} href
			,	href: '/'
				// @property {String} class
			,	'class': 'header-menu-home-anchor'
				// @property {touchpoint:String,hashtag:String} data
			,	data: {
					touchpoint: 'home'
				,	hashtag: '#/'
				}
			}
		,
			{
				text: _('Shop').translate()
			,	href: '/search'
			,	'class': 'header-menu-shop-anchor'
			,	data: {
					touchpoint: 'home'
				,	hashtag: '#/search'
				}
			}
		,
		{
			text: _('Categories').translate()
		,	href: '/search'
		,	'class': 'header-menu-level1-anchor'
			// @property {Array<NavigationData>} categories
		,	categories: [
				{
					text: _('Men').translate()
				,	href: '/search'
				,	'class': 'header-menu-level2-anchor'
				,	categories: navigationDummyCategories
				}
			,	{
					text: _('Woman').translate()
				,	href: '/search'
				,	'class': 'header-menu-level2-anchor'
				,	categories: navigationDummyCategories
				}
			,	{
					text: _('Child').translate()
				,	href: '/search'
				,	'class': 'header-menu-level2-anchor'
				,	categories: navigationDummyCategories
				}
			,	{
					text: _('Other').translate()
				,	href: '/search'
				,	'class': 'header-menu-level2-anchor'
				,	categories: navigationDummyCategories
				}
			]
		}
	,	{
			text: _('Other title').translate()
			,	href: '/search'
			,	'class': 'header-menu-level1-anchor'
			,	categories: [
					{
						text: _('Men').translate()
					,	href: '/search'
					,	'class': 'header-menu-level2-anchor'
					,	categories: navigationDummyCategories
					}
				,	{
						text: _('Woman').translate()
					,	href: '/search'
					,	'class': 'header-menu-level2-anchor'
					,	categories: navigationDummyCategories
					}
				,	{
						text: _('Child').translate()
					,	href: '/search'
					,	'class': 'header-menu-level2-anchor'
					,	categories: navigationDummyCategories
					}
				,	{
						text: _('Other').translate()
					,	href: '/search'
					,	'class': 'header-menu-level2-anchor'
					,	categories: navigationDummyCategories
					}
				]
            }
		]

		// @property {Object} imageSizeMapping map of image custom image sizes
		// usefull to be customized for smaller screens
	,	imageSizeMapping: {
			thumbnail: 'thumbnail' // 175 * 175
		,	main: 'main' // 600 * 600
		,	tinythumb: 'tinythumb' // 50 * 50
		,	zoom: 'zoom' // 1200 * 1200
		,	fullscreen: 'fullscreen' // 1600 * 1600
		, homeslider: 'homeslider' // 200 * 220
		, homecell: 'homecell' // 125 * 125
		}

		// @property {Object} When showing your credit cards, which icons should we use
	,	creditCardIcons: {
			'VISA': 'img/visa.png'
		,	'Discover': 'img/discover.png'
		,	'Master Card': 'img/master.png'
		,	'Maestro': 'img/maestro.png'
		,	'American Express': 'img/american.png'
		}

	,	bxSliderDefaults: {
			minSlides: 2
		,	slideWidth: 228
		,	maxSlides: 5
		,	forceStart: true
		,	pager: false
		,	touchEnabled:true
		,	nextText: '<a class="item-details-carousel-next"><span class="control-text">' + _('next').translate() + '</span> <i class="carousel-next-arrow"></i></a>'
		,	prevText: '<a class="item-details-carousel-prev"><i class="carousel-prev-arrow"></i> <span class="control-text">' + _('prev').translate() + '</span></a>'
		,	controls: true
		,	preloadImages: 'all'
		}

	,	siteSettings: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings || {}

	,	get: function (path, defaultValue)
		{
			return _.getPathFromObject(this, path, defaultValue);
		}

	,	getRegistrationType: function ()
		{
			if (Configuration.get('siteSettings.registration.registrationmandatory') === 'T')
			{
				// no login, no register, checkout as guest only
				return 'disabled';
			}
			else
			{
				if (Configuration.get('siteSettings.registration.registrationoptional') === 'T')
				{
					// login, register, guest
					return 'optional';
				}
				else
				{
					if (Configuration.get('siteSettings.registration.registrationallowed') === 'T')
					{
						// login, register, no guest
						return 'required';
					}
					else
					{
						// login, no register, no guest
						return 'existing';
					}
				}
			}
		}
	};

	// Append Product Lists configuration
	_.extend(Configuration, {
		product_lists: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.PRODUCTLISTS_CONFIG
	});

	// Append Cases configuration
	_.extend(Configuration, {
		cases: {
			config: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.CASES_CONFIG
		,	enabled: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled
		}
	});

	_.extend(Configuration, {
		useCMS: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.useCMS
	});
	
	// Append Bronto Integration configuration
	_.extend(Configuration, {
		bronto: {
			accountId: ''
		}
	});

	return Configuration;
});
