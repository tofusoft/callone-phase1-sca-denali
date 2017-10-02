/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemViews
define(
	'ItemViews.Price.View'
,	[	'item_views_price.tpl'

	,	'Backbone'
	]
,	function(
		item_views_price_tpl

	,	Backbone
	)
{
	'use strict';

	// @class ItemViews.Price.View @extends Backbone.View
	return Backbone.View.extend({

		template: item_views_price_tpl


		// @method getContext @returns {ItemViews.Price.View.Context}
	,	getContext: function ()
		{
			var price = this.model.getPrice()
			,	is_price_range = !!(price.min && price.max)
			,	showComparePrice = false;

			if(this.options.linePrice && this.options.linePriceFormatted)
			{
				price.price = this.options.linePrice;
				price.price_formatted = this.options.linePriceFormatted;
			}

			if (!this.options.hideComparePrice)
			{
				showComparePrice = (is_price_range) ? price.max.price < price.compare_price : price.price < price.compare_price;
			}

			//@class ItemViews.Price.View.Context
			return {
				// @property {Boolean} isPriceRange
				isPriceRange: is_price_range
				// @property {Boolean} showComparePrice
			,	showComparePrice: showComparePrice
				// @property {Boolean} isInStock
			,	isInStock: this.model.getStockInfo().isInStock

				// @property {BackBone.Model} model
			,	model: this.model

				// @property {String} currencyCode
			,	currencyCode: SC.getSessionInfo('currency') ? SC.getSessionInfo('currency').code : ''

				// @property {String} priceFormatted
			,	priceFormatted: (price.price_formatted) ? price.price_formatted : ''
				// @property {String} comparePriceFormatted
			,	comparePriceFormatted: (price.compare_price_formatted) ? price.compare_price_formatted : ''
				// @property {String} minPriceFormatted
			,	minPriceFormatted: (price.min) ? price.min.price_formatted : ''
				// @property {String} maxPriceFormatted
			,	maxPriceFormatted: (price.max) ? price.max.price_formatted : ''

				// @property {Number} price
			,	price: (price.price) ? price.price : 0
				// @property {Number} comparePrice
			,	comparePrice: (price.compare_price) ? price.compare_price : 0
				// @property {Number} minPrice
			,	minPrice: (price.min) ? price.min.price : 0
				// @property {Number} maxPrice
			,	maxPrice: (price.max) ? price.max.price : 0
			};
		}
	});
});