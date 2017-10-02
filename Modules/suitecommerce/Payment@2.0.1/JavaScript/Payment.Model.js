/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Payment
define('Payment.Model'
,	[	'Invoice.Collection'
	,	'Deposit'
	,	'CreditMemo.Collection'
	,	'OrderPaymentmethod.Collection'

	,	'jQuery'
	,	'Backbone'
	]
,	function (
		InvoiceCollection
	,	Deposit
	,	CreditMemoCollection
	,	OrderPaymentmethodCollection

	,	jQuery
	,	Backbone
	)
{
	'use strict';

	// @class Payment.Model @extends Backbone.Model
	return Backbone.Model.extend({

		urlRoot: 'services/payment.ss'

	,	parse: function (result)
		{
			result.paymentmethods = new OrderPaymentmethodCollection(result.paymentmethods);
			return result;
		}

	,	initialize: function ()
		{
			this.reset();
		}

		// @method reset
	,	reset: function ()
		{
			this.set({
				payment: 0
			,	tranid: null
			,	invoices_total: 0
			,	deposits_total: 0
			,	creditmemos_total: 0
			,	invoices: this.get('invoices') ? this.get('invoices').reset() : new InvoiceCollection()
			,	deposits: new Deposit.Collection()
			,	creditmemos: new CreditMemoCollection()
			,	paymentmethods: this.get('paymentmethods') || new OrderPaymentmethodCollection()
			});

			this.get('invoices').on('reset add remove', jQuery.proxy(this, 'distributePaymentsFIFO'));
			this.get('deposits').on('reset add remove', jQuery.proxy(this, 'distributePaymentsFIFO'));
			this.get('creditmemos').on('reset add remove', jQuery.proxy(this, 'distributePaymentsFIFO'));
		}

		// @method normalizeDate @param {Date} @returns {Date}
	,	normalizeDate: function (date)
		{
			if (!date)
			{
				return;
			}
			else if (date instanceof Date)
			{
				return date.getTime();
			}
			else if (typeof date === 'string')
			{
				// TODO: Consider company's date format here
				return Date.parse(date);
			}
			else if (typeof date === 'number')
			{
				return date;
			}
		}

		/*
		@method distributePaymentsFIFO 
		Distributes deposits then credit memos in order by date (first in first out)
		This way the maximum amount of oldest deposit allowed will cover the oldest
		invoice. Then the next deposit and so on. If no more deposits are available
		for that invoice, credit memos will be considered in the same fashion and so on.
		If memos and deposits do not cover the total amount to be paid of all
		invoices, then it will put that amount in the remaining attribute.

		Assumes that amounts are in the same currency and that they do not exceed
		the amounts stored in the records (they are possible) and that rounding issues
		will not arise from substraction and addition operations and that entities
		appear only once (unique ids on each)
		*/
	,	distributePaymentsFIFO: function ()
		{
			// First thing is to order everything by date and initialize parameters
			var	self = this
			,	invoices = new InvoiceCollection(this.get('invoices').sortBy(function (item)
				{
					return self.normalizeDate(item.get('duedate'));
				}))
			,	deposits = this.get('deposits')
			,	credit_memos = this.get('creditmemos')
			,	invoice_amount = 'payment'
			,	deposit_amount = 'amountremaining'
			,	credit_memo_amount = 'amountremaining'
			,	invoices_total = 0
			,	deposits_total = 0
			,	creditmemos_total = 0;

			invoices.each(function (invoice)
			{
				invoice.set('remaining', invoice.get(invoice_amount));
				invoices_total += invoice.get(invoice_amount);
			});

			deposits.each(function (deposit)
			{
				deposit.set('apply', []);
				deposit.set('remaining', deposit.get(deposit_amount));
			});

			credit_memos.each(function (credit_memo)
			{
				credit_memo.set('apply', []);
				credit_memo.set('remaining', credit_memo.get(credit_memo_amount));
			});

			//Then apply remaining deposits to complete
			deposits.each(function (deposit)
			{
				if (deposit.get('remaining') > 0)
				{
					invoices.each(function (invoice)
					{
						var amount = Math.min(invoice.get('remaining'), deposit.get('remaining'));

						if (amount > 0)
						{
							deposit.get('apply').push({
								amount: amount
							,	invoice: invoice.get('internalid')
							,	refnum: invoice.get('tranid')
							});

							deposits_total += amount;

							invoice.set('remaining', invoice.get('remaining') - amount);
							deposit.set('remaining', deposit.get('remaining') - amount);
						}
					});
				}
			});

			//Now try to apply credit memos
			credit_memos.each(function (credit_memo)
			{
				if (credit_memo.get('remaining') > 0)
				{
					invoices.each(function (invoice)
					{
						var amount = Math.min(invoice.get('remaining'), credit_memo.get('remaining'));

						if (amount > 0)
						{
							credit_memo.get('apply').push({
								amount: amount
							,	invoice: invoice.get('internalid')
							,	refnum: invoice.get('tranid')
							});

							creditmemos_total += amount;

							invoice.set('remaining',invoice.get('remaining') - amount);
							credit_memo.set('remaining',credit_memo.get('remaining') - amount);
						}
					});
				}
			});

			this.set('invoices_total', invoices_total);
			this.set('deposits_total', deposits_total);
			this.set('creditmemos_total', creditmemos_total);
			this.set('payment', invoices_total - (deposits_total + creditmemos_total));

			this.trigger('changeApply');
		}
	});
});
