/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CreditMemo
define(
	'CreditMemo.Model'
,	[	'OrderLine.Collection'
	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		OrderLineCollection
	,	_
	,	Backbone
	)
{
	'use strict';

	//@method validateAmountRemaining. Validates the entered amount.
	function validateAmountRemaining(value, name, form)
	{
		if (isNaN(parseFloat(value)))
		{
			return _('The amount to apply is not a valid number').translate();
		}

		if (value <= 0)
		{
			return _('The amount to apply has to be positive').translate();
		}

		if (value > form.remaining)
		{
			return _('The amount to apply cannot exceed the remaining').translate();
		}

		if (form.orderTotal < 0)
		{
			return _('The amount to apply cannot exceed the remaining order total').translate();
		}
	}

	//@class CreditMemo.Model stores the data of a credit memo and validates it @extends Backbone.Model
	return Backbone.Model.extend({

		//@property {String} internalid
		//@property {String} tranid
		//@property {Number} subtotal
		//@property {String} subtotal_formatted
		//@property {Number} discount
		//@property {String} discount_formatted
		//@property {Number} taxtotal
		//@property {String} taxtotal_formatted
		//@property {Number} shippingcost
		//@property {String} shippingcost_formatted
		//@property {Number} total
		//@property {String} total_formatted
		//@property {Number} amountpaid
		//@property {String} amountpaid_formatted
		//@property {Number} amountremaining
		//@property {String} amountremaining_formatted
		//@property {String} trandate
		//@property {String} status		
		//@property {String} memo
		//@property {Array<CreditMemo.Model.Invoice>} invoices
			//@class CreditMemo.Model.Invoice
				//@property {String} internalid
				//@property {String} type
				//@property {Number} total
				//@property {String} total_formatted
				//@property {Boolean} apply
				//@property {String} applydate
				//@property {Number} currency					
				//@property {Number} amount
				//@property {String} amount_formatted
				//@property {Boolean} due
				//@property {String} due_formatted
				//@property {String} refnum
			//@class CreditMemo.Model
		//@property {Array<CreditMemo.Model.Line>} lines
			//@class CreditMemo.Model.Line
				//@property {Number} quantity
				//@property {Array<CreditMemo.Model.Line.Option>} options
					//@class CreditMemo.Model.Line.Option
						//@property {String} id
						//@property {String} name
						//@property {String} value
						//@property {String} displayvalue
						//@property {String} mandatory
					//@class CreditMemo.Model
				//@property {String} item
				//@property {String} type
				//@property {Number} amount
				//@property {Number} amount_formatted
				//@property {Number} rate
				//@property {Number} rate_formatted
			//@class CreditMemo.Model

		//@property {String} urlRoot
		urlRoot: 'services/CreditMemo.Service.ss'

		//@property validation. Backbone.Validation attribute used for validating the form before submit.
	,	validation: {
			amount: {
				fn: validateAmountRemaining
			}
		}

		// @method initialize
	,	initialize: function (attributes)
		{
			this.on('change:lines', function (model, lines)
			{
				model.set('lines', new OrderLineCollection(lines), {silent: true});
			});

			this.trigger('change:lines', this, attributes && attributes.items || []);
		}
	});
});
