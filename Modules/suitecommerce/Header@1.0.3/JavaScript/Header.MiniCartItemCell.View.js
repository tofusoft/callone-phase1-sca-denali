/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.MiniCartItemCell.View'
,	[
		'SC.Configuration'
	,	'ItemViews.SelectedOption.View'

	,	'header_mini_cart_item_cell.tpl'

	,	'underscore'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'Utils'
	]
,	function(
		Configuration
	,	ItemViewsSelectedOptionView

	,	header_mini_cart_item_cell_tpl

	,	_
	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	)
{
	'use strict';

	// @class Header.MiniCart.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_mini_cart_item_cell_tpl

	,	initialize: function()
		{
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Item.SelectedOptions': function ()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(this.model.get('item').getPosibleOptions())
				,	childView: ItemViewsSelectedOptionView
				,	viewsPerRow: 1
				,	childViewOptions: {
						cartLine: this.model
					}
				});
			}
		}

		// @method getContext @return {Header.MiniCart.View.Context}
	,	getContext: function()
		{
			// @class Header.MiniCart.View.Context
			return {
				line: this.model
				//@property {Number} itemId
			,	itemId: this.model.get('item').id
				//@property {String} itemType
			,	itemType: this.model.get('item').get('itemtype')
				//@property {String} linkAttributes
			,	linkAttributes: this.model.get('item').get('_linkAttributes')
			};
		}
	});
});