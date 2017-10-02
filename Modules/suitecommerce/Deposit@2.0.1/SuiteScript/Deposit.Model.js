/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Deposit.Model.js
// ----------------
//
define(
	'Deposit.Model'
,	['SC.Model', 'Utils']
,	function (SCModel, Utils)
{
	'use strict';

	return SCModel.extend({

		name: 'Deposit'

	,	get: function (id)
		{
			var deposit = nlapiLoadRecord('customerdeposit', id)
			,	result = {};

			this.createRecord(deposit, result);
			this.setInvoices(deposit, result);
			this.setPaymentMethod(deposit, result);

			return result;
		}

	,	createRecord: function (record, result)
		{
			result.internalid = record.getId();
			result.tranid = record.getFieldValue('tranid');
			result.payment = Utils.toCurrency(record.getFieldValue('payment'));
			result.payment_formatted = Utils.formatCurrency(record.getFieldValue('payment'));
			result.trandate = record.getFieldValue('trandate');
			result.status = record.getFieldValue('status');
			result.memo = record.getFieldValue('memo');
		}

	,	setInvoices: function (record, result)
		{
			result.invoices = [];
			var invoicesTotal = 0;

			for (var i = 1; i <= record.getLineItemCount('apply'); i++)
			{
				var invoice = {
						line: i
					,	invoice_id: record.getLineItemValue('apply', 'id2', i)
					,	deposit_id: record.getLineItemValue('apply', 'id', i)

					,	type: record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(record.getLineItemValue('apply', 'total', i))

					,	invoicedate: record.getLineItemValue('apply', 'applydate', i)
					,	depositdate: record.getLineItemValue('apply', 'depositdate', i)

					,	currency: record.getLineItemValue('apply', 'currency', i)
					,	amount: Utils.toCurrency(record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(record.getLineItemValue('apply', 'amount', i))
					,	due: Utils.toCurrency(record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(record.getLineItemValue('apply', 'due', i))
					,	refnum: record.getLineItemValue('apply', 'refnum', i)
				};

				invoicesTotal += invoice.amount;
				result.invoices.push(invoice);
			}

			result.paid = Utils.toCurrency(invoicesTotal);
			result.paid_formatted = Utils.formatCurrency(invoicesTotal);
			result.remaining = Utils.toCurrency(result.payment - result.paid);
			result.remaining_formatted = Utils.formatCurrency(result.remaining);
		}

	,	setPaymentMethod: function (record, result)
		{
			var paymentmethod = {
				type: record.getFieldValue('paymethtype')
			,	primary: true
			};

			if (paymentmethod.type === 'creditcard')
			{
				paymentmethod.creditcard = {
					ccnumber: record.getFieldValue('ccnumber')
				,	ccexpiredate: record.getFieldValue('ccexpiredate')
				,	ccname: record.getFieldValue('ccname')
				,	paymentmethod: {
						ispaypal: 'F'
					,	name: record.getFieldText('paymentmethod')
					,	creditcard: 'T'
					,	internalid: record.getFieldValue('paymentmethod')
					}
				};
			}

			if (record.getFieldValue('ccstreet'))
			{
				paymentmethod.ccstreet = record.getFieldValue('ccstreet');
			}

			if (record.getFieldValue('cczipcode'))
			{
				paymentmethod.cczipcode = record.getFieldValue('cczipcode');
			}

			if (record.getFieldValue('terms'))
			{
				paymentmethod.type = 'invoice';

				paymentmethod.purchasenumber = record.getFieldValue('otherrefnum');

				paymentmethod.paymentterms = {
						internalid: record.getFieldValue('terms')
					,	name: record.getFieldText('terms')
				};
			}

			result.paymentmethods = [paymentmethod];
		}
	});
});