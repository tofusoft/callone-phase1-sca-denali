/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Payment.js
// -------
// Defines the model used by the payment.ss service
// @module Payment
define(
	'Payment.Model'
,	['SC.Model', 'Utils']
,	function (SCModel, Utils)
{
	'use strict';

	// @class Payment.Model
	// Defines the model used by the payment.ss service
	// @extends SCModel
	return SCModel.extend({

		name: 'Payment'

		// @method get
		// @param {String} id 
		// @returns {Payment.Model.Attributes}
	,	get: function (id)
		{
			var customer_payment = nlapiLoadRecord('customerpayment', id);

			return this.createResult(customer_payment);
		}

		// @method setPaymentMethod
		// Binds customer payment method to customer payment object to return.
		// @returns undefined
	,	setPaymentMethod: function (customer_payment, result)
		{
			result.paymentmethods = [];
			
			return Utils.setPaymentMethodToResult(customer_payment, result);
		}
		
		// @method createResult
		// @param {Object} customer_payment NetSuite record
		// @returns {Payment.Model.Attributes}
	,	createResult: function (customer_payment)
		{
			// @class Payment.Model.Attributes
			var result = {};

			//@property {String} internalid		
			result.internalid = customer_payment.getId();

			//@property {String} type
			result.type =  customer_payment.getRecordType();
			
			//@property {String} tranid
			result.tranid = customer_payment.getFieldValue('tranid');
			
			//@property {String} autoapply
			result.autoapply = customer_payment.getFieldValue('autoapply');
			
			//@property {String} trandate
			result.trandate = customer_payment.getFieldValue('trandate');
			
			//@property {String} status
			result.status = customer_payment.getFieldValue('status');

			//@property {Number} payment
			result.payment = Utils.toCurrency(customer_payment.getFieldValue('payment'));
			
			//@property {String} payment_formatted
			result.payment_formatted = Utils.formatCurrency(customer_payment.getFieldValue('payment'));
			
			//@property {String} lastmodifieddate
			result.lastmodifieddate = customer_payment.getFieldValue('lastmodifieddate');
			
			//@property {Number} balance
			result.balance = Utils.toCurrency(customer_payment.getFieldValue('balance'));
			
			//@property {Number} balance_formatted
			result.balance_formatted = Utils.formatCurrency(customer_payment.getFieldValue('balance'));

			// @property {Array<Object>} paymentMethods
			this.setPaymentMethod(customer_payment, result);

			// @property {Array<Object>} invoices
			this.setInvoices(customer_payment, result);

			// @class Payment.Model
			return result;
		}

		// @method setInvoices
		// Binds invoices to customer payment object to return
		// @param {Object} customer_payment NetSuite record
		// @param {Payment.Model.Attributes} result
		// @returns invoices {Object}
	,	setInvoices: function(customer_payment, result)
		{
			result.invoices = [];

			for (var i = 1; i <= customer_payment.getLineItemCount('apply') ; i++)
			{
				var apply = customer_payment.getLineItemValue('apply', 'apply', i) === 'T';

				if (apply)
				{
					var invoice = {

						internalid: customer_payment.getLineItemValue('apply', 'internalid', i)
					,	type: customer_payment.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'total', i))
					,	apply: apply
					,	applydate: customer_payment.getLineItemValue('apply', 'applydate', i)
					,	currency: customer_payment.getLineItemValue('apply', 'currency', i)
					,	disc: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'disc', i))
					,	disc_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'disc', i))
					,	amount: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'amount', i))
					,	due: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'due', i))
					,	refnum: customer_payment.getLineItemValue('apply', 'refnum', i)
					};

					result.invoices.push(invoice);

				}
			}

			return result;
		}
	});
});
