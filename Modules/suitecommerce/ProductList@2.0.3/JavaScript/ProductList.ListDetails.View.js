/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.ListDetails.View'
	,	[
			'product_list_list_details.tpl'

		,	'underscore'
		,	'Backbone'
		,	'Backbone.View'
		,	'Backbone.View.render'
		]
	,	function(
			product_list_list_details_tpl

		,	_
		,	Backbone
		)
{
	'use strict';

	// @class ProductList.ListDetails.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_list_list_details_tpl

		// @method getContext @return {ProductList.ListDetails.View.Context}
	,	getContext: function()
		{
			var list = this.options.model
			,	items = list.get('items')
			,	outOfStockItems = list.getOutOfStockItems()
			,	minimumQuantityItems = list.getNotPurchasableItemsDueToMinimumQuantity()
			,	last_product_item = _.sortBy(items.models, function (it)
				{
					return new Date(it.get('created'));
				}).reverse()[0]
			,	list_description = list.get('description')

				// @class ProductList.ListDetails.View.Context
			,	result = {
					// @property {Boolean} isChecked
					isChecked: list.get('checked')
					// @property {String} internalId
				,	internalId: list.get('internalid')
					// @property {Boolean} isAvailableForCart
				,	isAvailableForCart: list.canBeAddedToCart()
					// @property {String} templateId
				,	templateId: list.get('templateid')
					// @property {Boolean} isTypePredefined
				,	isTypePredefined: list.get('type').name === 'predefined'
					// @property {String} listName
				,	listName: list.get('name')
					// @property {Boolean} hasItems
				,	hasItems:  items.length && items.length > 0
					// @property {Integer} itemsLength
				,	itemsLength:  items.length
					// @property {Boolean} hasOneItem
				,	hasOneItem: items.length === 1
					// @property {Boolean} hasLastItem
				,	hasLastItem: false
					// @property {String} lastProductItemUrl
				,	lastProductItemUrl: null
					// @property {String} lastItemDisplayName
				,	lastItemDisplayName: null
					// @property {Boolean} hasOutOfStockItems
				,	hasOutOfStockItems: outOfStockItems.length > 0
					// @property {Boolean} hasMinimumQuantityItems
				,	hasMinimumQuantityItems: minimumQuantityItems.length > 0
					// @property {String} lastModifiedDate
				,	lastModifiedDate: list.get('lastmodifieddate')
					// @property {String} listDescription
				,	listDescription: list_description
					// @property {String} hasListDescription
				,	hasListDescription: list_description && list_description.length > 0
					// @property {Boolean} isListPrivate
				,	isListPrivate: list.get('scope').name === 'private'
			};

			if (last_product_item)
			{
				result.hasLastItem = !!last_product_item.get('item');
				result.lastProductItemUrl = last_product_item.get('itemDetails').get('_linkAttributes');
				result.lastItemDisplayName = last_product_item.get('item').displayname;
			}
			return result;
		}
	});
});