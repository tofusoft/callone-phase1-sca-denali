/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList.DisplayFull.View'
	,	[
			'product_list_display_full.tpl'
		,	'ItemViews.Price.View'
		,	'ItemViews.Stock.View'
		,	'GlobalViews.StarRating.View'
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
			product_list_display_full_tpl
		,	ItemViewsPriceView
		,	ItemViewsStockView
		,	GlobalViewsStarRatingView
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

	// @class ProductList.DisplayFull.View @extends Backbone.View
	return Backbone.View.extend({

		template: product_list_display_full_tpl

	,	initialize: function (options)
		{
			this.options = options;
			this.item = options.model;
			this.application = options.application;
			BackboneCompositeView.add(this);
		}

	,	childViews:
		{
			'ItemViews.Price': function ()
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
		,	'ItemViews.Stock': function ()
			{
				return new ItemViewsStockView({model:this.item.get('itemDetails')});
			}
		,	'GlobalViews.StarRating': function ()
			{
				return new GlobalViewsStarRatingView({model:this.item.get('itemDetails')});
			}
		,	'ProductList.DetailsMinQuantity': function ()
			{
				return new ProductListDetailsMinQuantityView({model:this.item});
			}
		}

		// @method getContext @return {ProductList.DisplayFull.View.Context}
	,	getContext: function()
		{
			var item = this.item
		,	options = this.options
		,	product = item.get('item')
		,	priority = item.get('priority')
		,	itemDetails = item.get('itemDetails')
		,	thumbnail = itemDetails.get('_thumbnail')
		,	description = item.get('description');

			// @class ProductList.DisplayFull.View.Context
			return {
				// @property {String} itemId
				itemId : item.get('internalid')
				// @property {Boolean} isChecked
			,	isChecked : item.get('checked')
				// @property {Integer} quantity
			,	quantity : item.get('quantity')
				// @property {String} description
			,	description : description
				// @property {Boolean} hasDescription
			,	hasDescription : !!description
				// @property {Boolean} showEdit
			,	showEdit : options && options.show_edit_action
				// @property {Boolean} showMoveAction
			,	showMoveAction : options && options.show_move_action
				// @property {Boolean} showAddedOn
			,	showAddedOn : !options || !options.hide_added_on
				// @property {String} itemDetailsId
			,	itemDetailsId : itemDetails.get('internalid')
				// @property {String} itemDetailsUrl
			,	itemDetailsUrl : _(itemDetails.get('_url')).fixUrl()
				// @property {String} thumbnailAlt
			,	thumbnailAlt : thumbnail.altimagetext
				// @property {String} thumbnailResized
			,	thumbnailResized : this.application.resizeImage(thumbnail.url, 'thumbnail')
				// @property {Boolean} isAvailableForCart
			,	isAvailableForCart : product.ispurchasable && item.fulfillsMinimumQuantityRequirement()
				// @property {Boolean} showRating
			,	showRating : !options || !options.hide_rating
				// @property {Boolean} showCheckbox
			,	showCheckbox : !options || !options.hide_checkbox
				// @property {String} productName
			,	productName : item.getProductName() || item.get('name')
				// @property {String} priorityName
			,	priorityName : priority.name
				// @property {String} itemCreatedDate
			,	itemCreatedDate : item.get('createddate')
				// @property {String} linkAttributes
			,	linkAttributes: itemDetails.get('_linkAttributes')
			};
		}
	});
});