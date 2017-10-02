/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
// ProductList.Item.Collection.js
// -----------------------
// Product List collection
define('ProductList.Item.Collection'
,	[	'ProductList.Item.Model'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		Model

	,	_
	,	Backbone
	)
{
	'use strict';

	// @class ProductList.Item.Collection @extends Backbone.Collection
	return Backbone.Collection.extend({

		model: Model

	,	url: _.getAbsoluteUrl('services/ProductList.Item.Service.ss')

	,	initialize: function(options)
		{
			this.options = options;
		}

		// @method update custom method called by ListHeader view it receives the currently applied filter, currently applied sort and currently applied order
	,	update: function (options)
		{
			this.fetch({
				data: {
					productlistid: this.productListId
				,	internalid: null
				,	sort: options.sort.value
				,	order: options.order
				,	page: options.page
				}
			,	reset: true
			,	killerId: options.killerId
			});
		}
	});
});