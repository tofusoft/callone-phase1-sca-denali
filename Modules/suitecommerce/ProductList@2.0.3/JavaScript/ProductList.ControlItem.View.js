/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.ControlItem.View'
	,	[
			'product_list_control_item.tpl'
		,	'jQuery'
		,	'Backbone'
		,	'Backbone.View'
		,	'Backbone.View.render'
		]
	,	function(
			product_list_control_item_tpl
		,	jQuery
		,	Backbone
		)
{
	'use strict';

	// @class ProductList.ControlItem.View @extends Backbone.View
	return Backbone.View.extend({

		tagName: 'li'

	,	template: product_list_control_item_tpl

	,	events: {
			'click [data-action="product-list-item"]' : 'pListItemHandler'
		}

	,	initialize: function (options)
		{
			this.model = options.model;
			this.product = options.product;
			this.application = options.application;
			this.parentView = options.parentView;
		}

		// @method checked Determines if an item is checked if the item belongs the list
		// Whilst on move mode, returns always false @return {Boolean}
	,	checked: function ()
		{
			return this.parentView.mode !== 'move' ? this.model.checked(this.parentView.getProductId(this.product), this.parentView.getItemOptions(this.product.itemOptions)) : false;
		}

		// @method pListItemHandler dispatch mouse event - if move mode enabled, move the item, if not, an item is added/removed from a list
	,	pListItemHandler: function (e)
		{
			var self = this
			,	checkbox = jQuery(e.target);

			if (self.parentView.mode === 'move')
			{
				self.moveProduct();
			}
			else
			{
				self.addRemoveProduct(checkbox);
			}
		}

		// @method moveProduct Moves an item to another list
	,	moveProduct: function ()
		{
			this.parentView.moveProductHandler(this.model);
		}

		// @method addRemoveProduct Adds/removes an item from a list @param {jQuery} checkbox
	,	addRemoveProduct: function ($checkbox)
		{
			if ($checkbox.is(':checked'))
			{
				// add to list
				this.parentView.addItemToList(this.product, this.model);
			}
			else
			{
				// remove from list
				this.removeItemFromList(this.product);
			}
		}

		// @method removeItemFromList Remove a product list item from the product list @param {ItemDetails.Model} product
	,	removeItemFromList: function (product)
		{
			var self = this
			,	product_id = this.parentView.getProductId(product)
			,	product_item = self.model.get('items').find(function (item)
				{
					return parseInt(item.get('item').internalid, 10) === parseInt(product_id, 10);
				});

			if (product_item)
			{
				product_item.set('productList', {
					id: self.model.get('internalid')
				,	owner: self.model.get('owner').id
				});
				this.model.get('items').remove(product_item);

				product_item.destroy().done(function ()
				{
					self.model.collection.trigger('changed');
					self.parentView.render();
					self.parentView.hideConfirmationMessage();
				});
			}
			else
			{
				self.parentView.render();
			}
		}


		// @method getContext @return {ProductList.ControlItem.View.Context}
	,	getContext: function()
		{
			return {
				// @class ProductList.ControlItem.View.Context
				// @property {Boolean} isMoving
				isMoving: this.parentView.mode === 'move'
				// @property {Boolean} isChecked
			,	isChecked: this.checked()
				// @property {Boolean} isTypePredefined
			,	isTypePredefined: this.model.get('type').name === 'predefined'
				// @property {String} itemName
			,	itemName: this.model.get('name')
				// @property {String} listId
			,	listId: this.model.get('internalid')
			};
		}
	});
});