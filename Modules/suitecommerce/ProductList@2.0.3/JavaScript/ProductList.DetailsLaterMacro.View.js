/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.DetailsLaterMacro.View'
	,	[
			'product_list_details_later_macro.tpl'
		,	'ItemViews.Price.View'
		,	'ItemViews.Stock.View'
		,	'ProductList.DetailsMinQuantity.View'
		,	'Backbone.CompositeView'
		,	'Backbone.CollectionView'
		,	'ItemViews.SelectedOption.View'
		,	'item_views_cell_actionable_selected_options_cell.tpl'

		,	'underscore'
		,	'Backbone'
		,	'Backbone.View'
		,	'Backbone.View.render'
		]
	,	function(
			product_list_details_later_macro_tpl
		,	ItemViewsPriceView
		,	ItemViewsStockView
		,	ProductListDetailsMinQuantityView
		,	BackboneCompositeView
		,	BackboneCollectionView
		,	ItemViewsSelectedOptionView
		,	item_views_cell_actionable_selected_options_cell_tpl

		,	_
		,	Backbone
		)
{
	'use strict';

	// @class ProductList.DetailsLaterMacro.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_list_details_later_macro_tpl

	,	initialize: function (options)
		{
			// this.item = options.item;
			this.item = this.model;
			this.options = options;
			this.application = options.application;
			BackboneCompositeView.add(this);
		}

	,	childViews:
		{
			'ItemViews.Price': function()
			{
				return new ItemViewsPriceView({model:this.item.get('itemDetails')});
			}
		,	'Item.SelectedOptions': function ()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(this.item.get('itemDetails').getPosibleOptions())
				,	childView: ItemViewsSelectedOptionView
				,	cellTemplate: item_views_cell_actionable_selected_options_cell_tpl
				,	viewsPerRow: 1
				,	childViewOptions: {
						cartLine: this.item
					}
				});
			}
		,	'ItemViews.Stock': function()
			{
				return new ItemViewsStockView({model:this.item.get('itemDetails')});
			}
		,	'ProductList.DetailsMinQuantity': function()
			{
				return new ProductListDetailsMinQuantityView({model:this.item});
			}
		}

		// @method getContext @return {ProductList.DetailsLaterMacro.View.Context}
	,	getContext: function()
		{
			var item = this.item
			,	options = this.options
			,	product = item.get('item')
			,	itemDetails = item.get('itemDetails')
			,	thumbnail = itemDetails.get('_thumbnail');

			return {
				// @class ProductList.DetailsLaterMacro.View.Context
				// @property {String} thumbnailUrl
				thumbnailUrl : this.application.resizeImage(thumbnail.url, 'thumbnail')
				// @property {Integer} quantity
			,	quantity : item.get('quantity')
				// @property {String} thumbnailAlt
			,	thumbnailAlt : thumbnail.altimagetext
				// @property {String} itemId
			,	itemId : item.get('internalid')
				// @property {Boolean} canBeAddedToCart
			,	canBeAddedToCart : product.ispurchasable && item.fulfillsMinimumQuantityRequirement()
				// @property {String} itemDetailsId
			,	itemDetailsId : itemDetails.get('internalid')
				// @property {String} itemDetailsUrl
			,	itemDetailsUrl : _(item.get('itemDetails').get('_url')).fixUrl()
				// @property {String} productName
			,	productName : item.getProductName() || item.get('name')
				// @property {Boolean} isGiftCertificate
			,	isGiftCertificate : product.itemtype === 'GiftCert'
				// @property {Boolean} name
			,	showActions : !options || !options.hide_actions
			};
		}
	});
});