/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.DetailsLater.View'
	,	[
			'product_list_details_later.tpl'
		,	'ProductList.DetailsLaterMacro.View'
		,	'ProductList.Details.View'
		,	'ProductList.Deletion.View'
		,	'LiveOrder.Model'
		
		,	'Backbone.CollectionView'
		,	'Backbone.CompositeView'

		,	'products_detail_later_cell.tpl'
		,	'backbone_collection_view_row.tpl'		

		,	'underscore'
		,	'jQuery'
		,	'Backbone'
		,	'Backbone.View'
		,	'Backbone.View.render'
		]
	,	function(
			product_list_details_later_tpl
		,	ProductListDetailsLaterMacroView
		,	ProductListDetailsView
		,	ProductListDeletionView
		,	LiveOrderModel

		,	BackboneCollectionView
		,	BackboneCompositeView

		,	products_detail_later_cell_tpl
		,	backbone_collection_view_row_tpl		

		,	_
		,	jQuery		
		,	Backbone
		)
{
	'use strict';

	// @class ProductList.DetailsLater.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_list_details_later_tpl

	,	events: {
			// items events
			'click [data-action="add-to-cart"]' : 'addItemToCartHandler'
		,	'click [data-action="delete-item"]' : 'askDeleteListItem'
		,	'change [data-action="change-quantity"]': 'updateItemQuantity'
		,	'keyup [data-action="change-quantity"]': 'updateItemQuantity'
		,	'click [data-ui-action="add"]' : 'addQuantity'
		,	'click [data-ui-action="minus"]' : 'subQuantity'
		}

	,	initialize: function(options)
		{
			this.options = options;
			this.application = options.application;
			this.cart = LiveOrderModel.getInstance();
			this.addToCartCallback = options.addToCartCallback;

			BackboneCompositeView.add(this);
		}

	,	childViews:
		{
			'ProductList.DetailsLater.Collection': function()
			{
				return new BackboneCollectionView({
					collection: this.model.get('items').models
				,	childView: ProductListDetailsLaterMacroView
				,	viewsPerRow: 4
				,	cellTemplate: products_detail_later_cell_tpl
				,	rowTemplate: backbone_collection_view_row_tpl
				,	childViewOptions: {
						application: this.application
					}
				});
			}
		}

		// @method getContext @return {ProductList.DetailsLater.View.Context}
	,	getContext: function()
		{
			var items = this.model.get('items')
			,	type = this.model.get('type').name
			,	itemsLength = items.length;

			return {
				// @class ProductList.DetailsLater.View.Context
				// @property {Integer} itemsLength
				itemsLength : itemsLength
				// @property {Boolean} name
			,	name : this.model.get('name')
				// @property {Boolean} isLaterOrPredefined
			,	isLaterOrPredefined : type === 'predefined' || type === 'later'
				// @property {Boolean} hasItems
			,	hasItems : itemsLength > 0
				// @property {Boolean} hasModel
			,	hasModel : !!this.model
				// @property {Boolean} isEmpty
			,	isEmpty : itemsLength === 0
				// @property {Boolean} hasOneItem
			,	hasOneItem : itemsLength === 1
				// @property {Boolean} hasMoreThanOneItem
			,	hasMoreThanOneItem : itemsLength > 1
			};
		}

		// @method addItemToCartHandler Add a particular item into the cart
	,	addItemToCartHandler : function (e)
		{
			e.stopPropagation();
			e.preventDefault();

			var self = this
			,	selected_product_list_item_id = self.$(e.target).closest('article').data('id')
			,	selected_product_list_item = self.model.get('items').findWhere({
					internalid: selected_product_list_item_id.toString()
				})
			,	selected_item = selected_product_list_item.get('item')
			,	selected_item_internalid = selected_item.internalid
			,	item_detail = selected_product_list_item.getItemForCart(selected_item_internalid, selected_product_list_item.get('quantity'), selected_item.itemoptions_detail, selected_product_list_item.getOptionsArray())
			,	add_to_cart_promise = this.addItemToCart(item_detail)
			,	whole_promise = jQuery.when(add_to_cart_promise, this.deleteListItem(selected_product_list_item)).then(jQuery.proxy(this, 'executeAddToCartCallback'));
			
			if (whole_promise)
			{
				this.disableElementsOnPromise(whole_promise, 'article[data-item-id="' + selected_item_internalid + '"] a, article[data-item-id="' + selected_item_internalid + '"] button');
			}
		}

		// @method executeAddToCartCallback
	,	executeAddToCartCallback: function ()
		{
			if (!this.addToCartCallback)
			{
				return;
			}

			this.addToCartCallback();
		}

		// @method addQuantity Increase the product's Quantity by 1
		// @param {HTMLEvent} e 
	,	addQuantity: function (e)
		{
			e.preventDefault();

			var $element = jQuery(e.target)
			,	oldValue = $element.parent().find('input').val()
			,	newVal = parseFloat(oldValue) + 1;

			var input = $element.parent().find('input');

			input.val(newVal);
			input.trigger('change');
		}

		// @method subQuantity Decreases the product's Quantity by 1
		// @param {HTMLEvent} e
	,	subQuantity: function (e)
		{
			e.preventDefault();

			var $element = jQuery(e.target)
			,	oldValue = $element.parent().find('input').val()
			,	newVal = parseFloat(oldValue) - 1;

			newVal = Math.max(1, newVal);

			var input = $element.parent().find('input');

			input.val(newVal);
			input.trigger('change');
		}

		// @method askDeleteListItem opens a confirmation dialog for deleting an item from the Saved for Later list.
		// @param {HTMLEvent} e
	,	askDeleteListItem : function (e)
		{
			e.stopPropagation();

			this.deleteConfirmationView = new ProductListDeletionView({
				application: this.application
			,	parentView: this
			,	target: e.target
			,	title: _('Delete selected items').translate()
			,	body: _('Are you sure you want to remove selected items?').translate()
			,	confirmLabel: _('Yes').translate()
			,	confirm_delete_method: 'deleteListItemHandler'
			});

			this.application.getLayout().showInModal(this.deleteConfirmationView);
		}

		// @method deleteListItemHandler deletes a single item from the Saved for Later list.
		// @param {HTMLEvent} e
	,	deleteListItemHandler: function (target)
		{
			var self = this
			,	itemid = jQuery(target).closest('article').data('id')
			,	product_list_item = this.model.get('items').findWhere({
					internalid: itemid + ''
				})
			,	success = function ()
			{
				if (self.application.getLayout().updateMenuItemsUI)
				{
					self.application.getLayout().updateMenuItemsUI();
				}

				self.deleteConfirmationView.$containerModal.modal('hide');
				self.render();
				self.showConfirmationMessage(_('The item was removed from your product list').translate(), true);
			};

			self.model.get('items').remove(product_list_item);		
			self.deleteListItem(product_list_item, success);
		}

	,	addItemToCart: ProductListDetailsView.prototype.addItemToCart		

	,	deleteListItem: ProductListDetailsView.prototype.deleteListItem

	,	disableElementsOnPromise: ProductListDetailsView.prototype.disableElementsOnPromise

	,	updateItemQuantity : ProductListDetailsView.prototype.updateItemQuantity

	,	updateItemQuantityHelper: ProductListDetailsView.prototype.updateItemQuantityHelper
	});
});