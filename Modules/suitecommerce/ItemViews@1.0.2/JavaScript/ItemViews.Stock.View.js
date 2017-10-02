/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemViews
define(
	'ItemViews.Stock.View'
,	[	'item_views_stock.tpl'

	,	'Backbone'
	]
,	function(
		item_views_stock_tpl

	,	Backbone
	)
{
	'use strict';

	// @class ItemViews.Stock.View @extends Backbone.View
	return Backbone.View.extend({

		template: item_views_stock_tpl
	
		// @method getContext @returns {ItemViews.Stock.View.Context}
	,	getContext: function ()
		{
			var stock_info = this.model.getStockInfo();

			//@class ItemViews.Stock.View.Context
			return {
					showOutOfStockMessage: !!(!stock_info.isInStock && stock_info.showOutOfStockMessage)
				,	showStockDescription: !!(stock_info.showStockDescription && stock_info.stockDescription)
				,	stockInfo: stock_info
				,	model: this.model
				,	showInStockMessage: !(!stock_info.isInStock && stock_info.showOutOfStockMessage) && !!stock_info.showInStockMessage
			};
		}
	});
});