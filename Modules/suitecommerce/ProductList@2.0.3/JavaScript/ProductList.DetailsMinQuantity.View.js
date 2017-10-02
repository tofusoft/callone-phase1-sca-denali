/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.DetailsMinQuantity.View'
	,	[
			'product_list_details_min_quantity.tpl'
		,	'Backbone'
		,	'Backbone.View'
		,	'Backbone.View.render'
		]
	,	function(
			product_list_details_min_quantity_tpl
		,	Backbone
		)
{
	'use strict';

	// @class ProductList.DetailsMinQuantity.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_list_details_min_quantity_tpl

	,	initialize: function(options)
		{
			this.options = options;
			this.item = options.model;
		}


		// @method getContext @return {ProductList.DetailsMinQuantity.View.Context}
	,	getContext: function()
		{
			var item_details = this.item.get('itemDetails');
			return {
				// @class ProductList.DetailsMinQuantity.View.Context
				// @property {Boolean} fulfillsMinQuantityRequirements
				fulfillsMinQuantityRequirements: this.item.fulfillsMinimumQuantityRequirement()
				// @property {Number} minimumQuantity
			,	minimumQuantity: item_details.get('minimumquantity')
				// @property {Number} quantity
			,	quantity: this.item.get('quantity')
				// @property {String} id
			,	id: this.item.get('internalid')
			};
		}
	});
});