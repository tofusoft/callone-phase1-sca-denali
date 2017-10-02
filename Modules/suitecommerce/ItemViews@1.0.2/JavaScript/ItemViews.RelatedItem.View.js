/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define(
	'ItemViews.RelatedItem.View'
,	[	'ItemViews.Price.View'
	,	'GlobalViews.StarRating.View'
	,	'Backbone.CompositeView'

	,	'item_views_related_item.tpl'

	,	'Backbone'
	]
,	function (
		ItemViewsPriceView
	,	GlobalViewsStarRatingView
	,	BackboneCompositeView

	,	item_views_related_item_tpl

	,	Backbone
	)
{
	'use strict';

	// @class ItemViews.RelatedItem.View Responsible for rendering an item details. The idea is that the item rendered is related to another one in the same page
	// @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_related_item_tpl

		//@method initialize Configure the initial params of the view instance @param {Item} options.item
	,	initialize: function (options)
		{
			this.item = options.model;
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Item.Price': function ()
			{
				return new ItemViewsPriceView({model: this.item});
			}
		,	'Global.StarRating': function ()
			{
				return new GlobalViewsStarRatingView({
					model: this.item
				,	showRatingCount: false
				});
			}
		}

		//@method getContext @returns {ItemViews.RelatedItem.View.Context}
	,	getContext: function ()
		{
			//@class ItemViews.RelatedItem.View.Context
			return {
				//@property {Boolean} showRating
				showRating: SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled
				//@property {String} itemURL itemName
			,	itemURL: this.item.get('_url')
				//@property {String} itemURL itemName
			,	linkAttributes: this.item.get('_linkAttributes')
				//@property {String} itemName
			,	itemName: this.item.get('_name') || this.item.Name
				//@property {String} thumbnailURL
			,	thumbnailURL: this.item.get('_thumbnail').url
				//@property {String} thumbnailURL
			,	thumbnailAltImageText: this.item.get('_thumbnail').altimagetext
			};
		}
	});
});
