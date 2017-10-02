/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*global SC:false, _:false*/
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, unused:true, curly:true, browser:true, quotmark:single, maxerr:50, laxcomma:true, expr:true*/

// Configuration-Bikes.js
// ----------------------
(function (Shopping) {
	'use strict';
	
	// Maping table for Color Options
	// Keys are the ids of the colors
	// Values are the css color or object to be displayed
	// Used to display color filters and color options
	var bike_color_map = {
		'Black': 'black'
	,	'Blue': 'blue'
	,	'Gray': 'gray'
	,	'Green': 'green' 
	,	'Red': 'red'
	,	'Silver Black': '#333'
	,	'Violet': 'violet'
	,	'White': 'white'
	,	'Chrome': '#F5F5F5'
	,	'Silver': 'silver'
	,	'Super Black': { type: 'image', src: 'img/ajax-loader.gif', width: 22, height: 22 }
	};

	_.extend(Shopping.Configuration, {

		// Application Setup
		siteName: 'Mr. White Bikes'
	,	logoUrl: 'http://www.picgifs.com/food-and-drinks/food-and-drinks/shopping-cart/food-and-drinks-shopping-cart-961853.gif'
		
	,	tracking: {
			trackPageview: true
		,	google: {
				propertyID: 'UA-34213649-2'
			,	domainName: 'demo.uylabs.com'
			}
		}

		// Facet View
	,	facets: [
			{
				id: 'custitem_bike_brands'
			,	name: 'Brand'
			,	max: 10
			,	behavior: 'single'
			,	url: 'brand'
			,	priority: 10
			,	uncollapsible: true
			}
		/*
		,	{
				id: 'category'
			,	name: 'Category'
			,	max: 10
			,	behavior: 'single'
			,	url: ''
			,	macro: 'facetCategories'
			,	priority: 11
			,	uncollapsible: true
			}
		*/
		,	{
				id: 'custitem_bike_type'
			,	name: 'Style'
			,	max: 10
			,	behavior: 'multi'
			,	url: 'style'
			,	priority: 9
			,	uncollapsible: true
			}
		,	{
				id: 'custitem_bike_colors'
			,	name: 'Color'
			,	max: 5
			,	behavior: 'multi'
			,	url: 'color'
			,	priority: 8
			,	colors: bike_color_map
			,	macro: 'facetColor'
			}
		,	{
				id: 'custitem_gt_matrix_colors'
			,	name: 'GT Colors'
			,	max: 5
			,	behavior: 'multi'
			,	url: 'gt-colors'
			,	macro: 'facetColor'
			,	priority: 6
			,	colors: bike_color_map
			}
		,	{
				id: 'custitem_matrix_tire_size'
			,	name: 'Matrix Tire Size'
			,	max: 5
			,	behavior: 'multi'
			,	url: 'mtire'
			,	priority: 2
			}
		,	{
				id: 'custitem_tire_size'
			,	name: 'Tire Size'
			,	max: 5
			,	behavior: 'multi'
			,	url: 'tire'
			,	priority: 2
			,	macro: 'facetColor'
			,	colors: {
					'16': 'red'
				,	'18': 'blue'
				,	'20': 'green'
				,	'24': 'gray'
				,	'26': 'black'
				}
			}
		,	{
				id: 'onlinecustomerprice'
			,	name: 'Price'
			,	url: 'price'
			,	priority: 0
			,	max: 5
			,	behavior: 'range'
			,	macro: 'facetRange'
			,	step: 50
			,	uncollapsible: true
			,	parser: function (value)
				{
					return _.formatCurrency(value);
				}
			}
		]



		// settings for displaying each of the item options in the Detailed Page
	,   itemOptions: [
			{
				cartOptionId: 'custcol1'
			,	itemOptionId: 'custitem1'
			}
		,	{
				cartOptionId: 'custcol_matrix_tire_size'
			,	itemOptionId: 'custitem_matrix_tire_size'
			,	showSelectorInList: true
			,	label: 'Tire Size'
			,	url: 'tire-size'
			}
		,	{
				itemOptionId: 'custitem_gt_matrix_colors'
			,	cartOptionId: 'custcol_gt_matrix_colors'
			,	label: 'Color'
			,	url: 'gtcolor'
			,	colors: bike_color_map
			,	macros: {
					selector: 'itemDetailsOptionColor'
				,	selected: 'shoppingCartOptionColor'
				}
			}
		,	{
				cartOptionId: 'custcol_bike_color'
			,	label: 'Color'
			,	url: 'color'
			,	colors: bike_color_map
			,	macros: {
					selector: 'itemDetailsOptionColor'
				,	selected: 'shoppingCartOptionColor'
				}
			}
		,	{
				itemOptionId: 'custitem_rim_color'
			,	cartOptionId: 'custcol_rim_color'
			,	showSelectorInList: true
			,	label: 'Rim Color'
			,	colors: bike_color_map
			,	url: 'rim-color'
			,	macros: {
					selector: 'itemDetailsOptionColor'
				,	selected: 'shoppingCartOptionColor'	
				}
			}
		,	{
				cartOptionId: 'custcol_engrave'
			,	label: 'Engraved'
			,	url: 'engraved'
			}
		,	{
				cartOptionId: 'GIFTCERTFROM'
			,	url: 'from'
			}
		,	{
				cartOptionId: 'GIFTCERTRECIPIENTNAME'
			,	url: 'to'
			}
		,	{
				cartOptionId: 'GIFTCERTRECIPIENTEMAIL'
			,	url: 'to-email'
			}
		,	{
				cartOptionId: 'GIFTCERTMESSAGE'
			,	label: 'Message'
			,	url: 'message'
			}
		]

	,	navigationTabs: [
			{text: 'Home', href: '/'}
		,	{text: 'Shop', href: '/search'}
		,	{
				text: 'Brand'
			,	categories: [
					{text: 'Voodoo', href: '/brand/Voodoo'}
				,	{
						text: 'Trek'
					,	href: '/brand/Trek'
					,	categories: [
							{text: 'Jump', href: 'brand/Trek/style/Jump'}
						,	{text: 'Race', href: 'brand/Trek/style/Race'}
						,	{
								text: 'Freestyle'
							,	href: 'brand/Trek/style/Freestyle'
							,	categories: [
									{text: 'Red', href: 'brand/Trek/color/Red/style/Freestyle'}
								,	{text: 'White', href: 'brand/Trek/color/White/style/Freestyle'}
								,	{text: 'Green', href: 'brand/Trek/color/Green/style/Freestyle'}
								,	{text: 'Blue', href: 'brand/Trek/color/Blue/style/Freestyle'}
								]
							}
						]
					}
				,	{text: 'GT', href: '/brand/GT'}
				]
			}
		]

	,	multiImageOption: 'custcol_rim_color'

	,	itemDetails: [
			{ name: 'Details', contentFromKey: 'storedetaileddescription', opened: true }
		,	{ name: 'Specs', contentFromKey: 'custitem_bike_specs' }
		]
		
		///////////////////////////////////////
		//// Product Reviews Configuration ////
		///////////////////////////////////////
	,	productReviews: {
			maxRate: 5
		,	computeOverall: true
		,	reviewMacro: 'productReviewsItem'
		,	loginRequired: false
		,	filterOptions: [
				{ id: 'all', name: 'All Reviews', params: { }, isDefault: true }
			,	{ id: '5star', name: '5 Star Reviews', params: { rating: 5 } }
			,	{ id: '4star', name: '4 Star Reviews', params: { rating: 4 } }
			,	{ id: '3star', name: '3 Star Reviews', params: { rating: 3 } }
			,	{ id: '2star', name: '2 Star Reviews', params: { rating: 2 } }
			,	{ id: '1star', name: '1 Star Reviews', params: { rating: 1 } }
			]
		,	sortOptions: [
				{id: 'date', name: _('By Date').translate(), params: {order: 'created_on:ASC'}, isDefault: true}
			,	{id: 'rating', name: _('By Rating').translate(), params: {order: 'rating:ASC'}}
			]
		}
		
		// Social Sharing Services
		// -----------------------
		// Setup for bla bla
	,	socialSharingIconsMacro: 'socialSharingIcons'
		
		// Pinterest
	,	pinterest: {
			enable: true
		,	popupOptions: {
				status: 'no'
			,	resizable: 'yes'
			,	scrollbars: 'yes'
			,	personalbar: 'no'
			,	directories: 'no'
			,	location: 'no'
			,	toolbar: 'no'
			,	menubar: 'no'
			,	width: '632'
			,	height: '270'
			,	left: '0'
			,	top: '0'
			}
		}

	,	facebook: {
			enable: true
		,	appId: '237518639652564'
		,	pluginOptions: {
				'send': 'false'
			,	'layout': 'button_count'
			,	'width': '450'
			,	'show-faces': 'false'
			}
		}
		
		// Twitter
	,	twitter: {
			enable: true
		,	popupOptions: {
				status: 'no'
			,	resizable: 'yes'
			,	scrollbars: 'yes'
			,	personalbar: 'no'
			,	directories: 'no'
			,	location: 'no'
			,	toolbar: 'no'
			,	menubar: 'no'
			,	width: '632'
			,	height: '250'
			,	left: '0'
			,	top: '0'
			}
		,	via: '@juansanuy'
		}
		
	,	googlePlus: {
			enable: true
		,	popupOptions: {
				menubar: 'no'
			,	toolbar: 'no'
			,	resizable: 'yes'
			,	scrollbars: 'yes'
			,	height: '600'
			,	width: '600'
			}
		}
		
	,	addThis: {
			enable: true
		,	pubId: 'ra-50abc2544eed5fa5'
		,	toolboxClass: 'addthis_default_style addthis_toolbox addthis_button_compact'
		,	servicesToShow: {
				pinterest: 'Pinterest'
			,	facebook: 'Facebook'
			,	google_plusone: ''
			,	print: 'Print'
			,	email: 'Email'
			,	expanded: 'More'
			}
		,	options: {   // For reference for this options go to http://support.addthis.com/customer/portal/articles/381263-addthis-client-api#configuration-ui
				username: 'juansanuy'
			,	data_track_addressbar: true
			// ,	services_exclude: '',
			// ,	services_compact: '',
			// ,	services_expanded: '',
			// ,	services_custom: '',
			// ,	ui_click: '',
			// ,	ui_delay: '',
			// ,	ui_hover_direction: '',
			// ,	ui_language: '',
			// ,	ui_offset_top: '',
			// ,	ui_offset_left: '',
			// ,	ui_header_color: '',
			// ,	ui_header_background: '',
			// ,	ui_cobrand: '',
			// ,	ui_use_css: '',
			// ,	ui_use_addressbook: '',
			// ,	ui_508_compliant: '',
			// ,	data_track_clickback: '',
			// ,	data_ga_tracker: '',
			}
		}
		
		// used for social sharing
	,	openGraphMapping: {

			title: function (layout)
			{
				return layout.currentView && layout.currentView.title ? layout.currentView.title : 'Mister Wite Bikes!';
			}

		,	type: function (layout)
			{
				var $social_type = layout.$('[data-type="social-type"]');
				return $social_type.length ? $social_type.text() : undefined;
			}

		,	url: function ()
			{
				return window.location.href;
			}

		,	image: function (layout)
			{
				var $social_image = layout.$('[data-type=social-image]');
				return $social_image.length ? $social_image.get(0).src : 'not found?';
			}

		,	site_name: function ()
			{
				return Shopping.Configuration.siteName;
			}

		,	description: function (layout)
			{
				var $social_description = layout.$('[data-type=social-description]');
				return $social_description.length ? $social_description.text() : undefined;
			}
		}
	});
	
	// Calculates the width of the device, it will try to use the real screen size.
	var screen_width = window.screen ? window.screen.availWidth : window.outerWidth || window.innerWidth;
	
	// Phone Specific
	if (screen_width < 768)
	{
		_.extend(Shopping.Configuration, {
			
			itemsDisplayOptions: [{
				id: 'table'
			,	name: 'Table'
			,	macro: 'itemCellTable'
			,	columns: 2
			,	icon: 'icon-th-large'
			,	isDefault: true
			}]
			
		,	sortOptions: [{
				id: 'relevance:asc'
			,	name: 'Relevance'
			,	isDefault: true
			}]
		});
	}
	// Tablet Specific
	else if (screen_width >= 768 && screen_width < 980)
	{
		_.extend(Shopping.Configuration, {
			
			itemsDisplayOptions: [
				{ id: 'list', name: 'List', macro: 'itemCellList', columns: 1, icon: 'icon-th-list' , isDefault: true }
			,	{ id: 'table', name: 'Table', macro: 'itemCellTable', columns: 2, icon: 'icon-th-large' }
			]
			
		,	sortOptions: [
				{ id: 'relevance:asc', name: 'Relevance', isDefault: true }
			,   { id: 'onlinecustomerprice:asc', name: 'Price, Low to High'}
			,   { id: 'onlinecustomerprice:desc', name: 'Price, High to Low '}
			]
		});
	}
	// Desktop Specific
	else
	{
		_.extend(Shopping.Configuration, {});
	}
	
	function itemImageFlatten (images)
	{
		return _.flatten(_.map(images, function (item)
		{
			if (_.isArray(item))
			{
				return item;
			}

			if ('url' in item && 'altimagetext' in item)
			{
				return [item];
			}

			return itemImageFlatten(item);
		}));
	}

	// _.extend(Shopping.Configuration.itemKeyMapping,
	// {
	// 	_thumbnail: function (item)
	// 	{
	// 		var item_images_detail = item.get('_itemImagesDetail');

	// 		if (item_images_detail.thumbnail)
	// 		{
	// 			return item_images_detail.thumbnail;
	// 		}

	// 		var thumbnail = item.get('storedisplaythumbnail');
	// 		thumbnail = thumbnail ? SC.ENVIRONMENT.rootUrl +'bike_picks/'+ thumbnail : itemImageFlatten(item_images_detail)[0];

	// 		return {
	// 			url: thumbnail || Shopping.Configuration.imageNotAvailable
	// 		,	altimagetext: item.get('_name')
	// 		};
	// 	}
	// });
	
})(SC.Application('Shopping'));
