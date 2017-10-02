/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderHistory
define('OrderHistory.Model'
,	[	'Order.Model'
	,	'OrderFulfillment.Collection'
	,	'ReturnAuthorization.Collection'
	,	'Receipt.Collection'
	,	'OrderLine.Collection'
	]
,	function (
		OrderModel
	,	OrderFulfillmentsCollection
	,	ReturnAuthorizationCollection
	,	ReceiptCollection
	,	OrderLineCollection
	)
{
	'use strict';

	//@class OrderHistory.Model Model for showing information about past orders @extend Order.Model
	return OrderModel.extend({
		//@property {String} urlRoot
		urlRoot: 'services/OrderHistory.Service.ss'
		//@property {Object} defaults
	,	defaults: {
			//@property {String} internalid This value is present when retrieving a list of this model
			//@property {String} date This value is present when retrieving a list of this model
			'date': ''
			//@property {String} order_numberThis value is present when retrieving a list of this model
		,	'order_number': ''
			//@property {String} status This value is present when retrieving a list of this model
		,	'status': ''

			//@property {OrderHistory.Model.Summary} summary This value is present when retrieving a list of this model
		,	'summary': {}
			//@class OrderHistory.Model.Summary
				//@property {Number} subtotal
				//@property {String} subtotal_formatted

				//@property {Number} taxtotal
				//@property {String} taxtotal_formatted

				//@property {Number} tax2total
				//@property {String} tax2total_formatted

				//@property {Number} shippingcost
				//@property {String} shippingcost_formatted

				//@property {Number} handlingcost
				//@property {String} handlingcost_formatted

				//@property {Number} estimatedshipping
				//@property {String} estimatedshipping_formatted

				//@property {Number} taxonshipping
				//@property {String} taxonshipping_formatted

				//@property {Number} discounttotal
				//@property {String} discounttotal_formatted

				//@property {Number} taxondiscount
				//@property {String} taxondiscount_formatted

				//@property {Number} discountrate
				//@property {String} discountrate_formatted

				//@property {Number} discountedsubtotal
				//@property {String} discountedsubtotal_formatted

				//@property {Number} giftcertapplied
				//@property {String} giftcertapplied_formatted

				//@property {Number} total This value is present when retrieving a list of this model
				//@property {String} total_formatted This value is present when retrieving a list of this model

			//@class OrderHistory.Model

			//@property {CurrencyProperty} currency This value is present when retrieving a list of this model
		,	'currency': null
			//@class CurrencyProperty
				//@property {String} internalid
				//@property {String} name

			//@class OrderHistory.Model

			//@property {Array<String>} trackingnumbers Each string is a number stringified. This value is present when retrieving a list of this model
		,	'trackingnumbers': null
			//@property {String} type This value is present when retrieving a list of this model
		,	'type': ''

			//@property {String} trantype
		,	'trantype': ''
			//@property {String} purchasenumber
		,	'purchasenumber': ''
			//@property {String?} dueDate
		,	'dueDate': null
			//@property {Number} amountDue
		,	'amountDue': null
			//@property {String} amountDue_formatted
		,	'amountDue_formatted': ''
			//@property {String} memo
		,	'memo': ''
			//@property {String} isReturnable
		,	'isReturnable': ''
		}
		
		//@method initialize
	,	initialize: function (attributes)
		{
			// call the initialize of the parent object, equivalent to super()
			OrderModel.prototype.initialize.apply(this, arguments);

			this.on('change:fulfillments', function (model, fulfillments)
			{
				model.set('fulfillments', new OrderFulfillmentsCollection(fulfillments), {silent: true});
			});
			this.trigger('change:fulfillments', this, attributes && attributes.fulfillments || []);

			this.on('change:unfulfillments', function (model, unfulfillments)
			{
				model.set('unfulfillments', new OrderLineCollection(unfulfillments), {silent: true});
			});
			this.trigger('change:unfulfillments', this, attributes && attributes.unfulfillments || []);

			this.on('change:receipts', function (model, receipts)
			{
				model.set('receipts', new ReceiptCollection(receipts), {silent: true});
			});
			this.trigger('change:receipts', this, attributes && attributes.receipts || []);

			this.on('change:returnauthorizations', function (model, returnauthorizations)
			{
				model.set('returnauthorizations', new ReturnAuthorizationCollection(returnauthorizations), {silent: true});
			});
			this.trigger('change:returnauthorizations', this, attributes && attributes.returnauthorizations || []);
		}
	});
});
