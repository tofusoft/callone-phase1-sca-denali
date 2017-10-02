/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.ShippingGroup.View'
,	[	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'ItemViews.Cell.Navigable.View'
	,	'Address.Details.View'
	,	'OrderHistory.Fulfillment.View'
	,	'order_history_shipping_group.tpl'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCompositeView
	,	BackboneCollectionView
	,	ItemViewsCellNavigableView
	,	AddressView
	,	OrderHistoryFulfillmentView
	,	order_history_shipping_group_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class OrderHistory.ReturnAutorization.View @extend Backbone.View
	return Backbone.View.extend({
		//@property  {Function} template
		template: order_history_shipping_group_tpl
		//@method initialize
	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}
		//@property {Object} childViews
	,	childViews: {

			'Shipping.Address': function()
			{
				return new AddressView({
					model: this.model.get('shippingAddress')
				,	hideDefaults: true
				,	hideActions: true
				});
			}

		,	'Fullfillments.Collection': function ()
			{
				return new BackboneCollectionView({
						collection: this.model.get('fulfillments')
					,	childView: OrderHistoryFulfillmentView
					,	viewsPerRow: 1
					,	childViewOptions: {
							application: this.options.application
						}
				});
			}
		}

		//@method getContext @return OrderHistory.ReturnAutorization.View.Context
	,	getContext: function ()
		{
			var lines_length = 0;
			
			_.each(this.model.get('fulfillments'), function (fulfillment)
			{
				lines_length += fulfillment.get('lines').length;
			});

			//@class OrderHistory.ReturnAutorization.View.Context
			return {
					//@property {Model} model
					model: this.model
					//@property {Boolean} showShipAddress
				,	showShipAddress: !this.model.get('showOrderShipAddress')
					//@property {Boolean} showLines
				,	showLines: !!lines_length
					//@property {Number} linesLength
				,	linesLength: lines_length
					//@property {Boolean} linesLengthGreaterThan1
				,	linesLengthGreaterThan1: lines_length > 1
					//@property {Boolean} collapseElements
				,	collapseElements: this.options.application.getConfig('collapseElements')
					//@property {String} targetId
				,	targetId: 'products-ship-' + this.model.get('id').replace(/[^0-9a-zA-Z]/g, '-')
			};

		}
	});

});