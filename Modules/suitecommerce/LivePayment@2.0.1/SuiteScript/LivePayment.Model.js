/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global customer,stringtodate */
// LivePayment.js
// -------
// Defines the model used by the LivePayment.Service.ss service
define(
	'LivePayment.Model'
,	['SC.Model', 'Payment.Model', 'Application', 'bignumber', 'Utils']
,	function (SCModel, Payment, Application, BigNumber, Utils)
{
	'use strict';

	return SCModel.extend({
		name: 'LivePayment'

	,	create: function()
		{
			var customer_payment = nlapiCreateRecord('customerpayment');

			customer_payment.setFieldValue('customer', nlapiGetUser());
			customer_payment.setFieldValue('autoapply', 'F');

			return customer_payment;
		}

	,	get: function()
		{
			try
			{
				var customer_payment = this.create();
				return this.createResult(customer_payment);
			}
			catch (e)
			{

				if (e instanceof nlobjError && e.getCode() === 'INSUFFICIENT_PERMISSION')
				{
					return {};
				}
				else
				{
					throw e;
				}
			}
		}

	,	setPaymentMethod: function (customer_payment, result)
		{
			result.paymentmethods = [];

			return Utils.setPaymentMethodToResult(customer_payment, result);
		}

	,	createResult: function (customer_payment)
		{
			var result = {};

			result.internalid = customer_payment.getId();
			result.type =  customer_payment.getRecordType();
			result.tranid = customer_payment.getFieldValue('tranid');
			result.autoapply = customer_payment.getFieldValue('autoapply');
			result.trandate = customer_payment.getFieldValue('trandate');
			result.status = customer_payment.getFieldValue('status');
			result.payment = Utils.toCurrency(customer_payment.getFieldValue('payment'));
			result.payment_formatted = Utils.formatCurrency(customer_payment.getFieldValue('payment'));
			result.lastmodifieddate = customer_payment.getFieldValue('lastmodifieddate');
			result.balance = Utils.toCurrency(customer_payment.getFieldValue('balance'));
			result.balance_formatted = Utils.formatCurrency(customer_payment.getFieldValue('balance'));

			this.setPaymentMethod(customer_payment, result);
			this.setInvoices(customer_payment, result);
			this.setCredits(customer_payment, result);
			this.setDeposits(customer_payment, result);

			return result;
		}

	,	setInvoices: function(customer_payment, result)
		{
			result.invoices = [];

			var invoice_ids_to_search = [];

			for (var i = 1; i <= customer_payment.getLineItemCount('apply'); i++)
			{
				var invoice = {
						internalid: customer_payment.getLineItemValue('apply', 'internalid', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'total', i))
					,	apply: customer_payment.getLineItemValue('apply', 'apply', i) === 'T'
					,	applydate: customer_payment.getLineItemValue('apply', 'applydate', i)
					,	currency: customer_payment.getLineItemValue('apply', 'currency', i)
					,	discamt: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'discamt', i))
					,	discamt_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'discamt', i))
					,	disc: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'disc', i))
					,	disc_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'disc', i))
					,	discdate: customer_payment.getLineItemValue('apply', 'discdate', i)
					,	amount: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'amount', i))
					,	due: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'due', i))
					,	refnum: customer_payment.getLineItemValue('apply', 'refnum', i)
				};

				result.invoices.push(invoice);
				invoice_ids_to_search.push(invoice.internalid);
			}

			// Invoices are expanded with the missing fields (the ones required by front end)
			if (result.invoices.length)
			{
				var filters = [
						new nlobjSearchFilter('mainline', null, 'is', 'T')
					,	new nlobjSearchFilter('internalid', null, 'anyof', invoice_ids_to_search)
					]
				,	columns = [
						new nlobjSearchColumn('duedate')
					,	new nlobjSearchColumn('trandate')
					,	new nlobjSearchColumn('internalid')
					]
				,	now = new Date().getTime()
				,	invoices_expanded = Application.getAllSearchResults('invoice', filters, columns);

				_.each(result.invoices, function(invoice)
				{
					var selected_invoice =_.find(invoices_expanded, function (expaded_invoice_filter)
						{
							return expaded_invoice_filter.getValue('internalid') === invoice.internalid;
						})
					,	due_date = selected_invoice.getValue('duedate')
					,	due_in_milliseconds = new Date(due_date).getTime() - now;

					invoice.discountapplies = (invoice.due === invoice.total) && (invoice.discdate && stringtodate(invoice.discdate) >= new Date());
					invoice.duewithdiscount = BigNumber(invoice.due).minus(invoice.discountapplies ? invoice.discamt : 0).toNumber();
					invoice.duewithdiscount_formatted = Utils.formatCurrency(invoice.duewithdiscount);
					invoice.discount = invoice.discamt && invoice.total ? BigNumber(invoice.discamt).div(invoice.total).times(100).round(2).toNumber() : 0;
					invoice.discount_formatted = invoice.discount + '%';

					var	amount = BigNumber(invoice.due).minus(invoice.discountapplies ? invoice.discamt : 0).toNumber();

					invoice.trandate = selected_invoice.getValue('trandate');
					invoice.duedate = due_date;
					invoice.dueinmilliseconds = due_in_milliseconds;
					invoice.amount = amount;
					invoice.amount_formatted = Utils.formatCurrency(amount);
					invoice.isOverdue = due_in_milliseconds <= 0 && ((-1 * due_in_milliseconds) / 1000 / 60 / 60 / 24) >= 1;
				});
			}

			return result;
		}

	,	setCredits: function(customer_payment, result)
		{
			result.credits = [];
			result.creditmemosremaining = 0;

			for (var i = 1; i <= customer_payment.getLineItemCount('credit') ; i++)
			{
				var creditmemo = {
						internalid: customer_payment.getLineItemValue('credit', 'internalid', i)
					,	type: customer_payment.getLineItemValue('credit', 'type', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('credit', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('credit', 'total', i))
					,	apply: customer_payment.getLineItemValue('credit', 'apply', i) === 'T'
					,	currency: customer_payment.getLineItemValue('apply', 'currency', i)
					,	remaining: Utils.toCurrency(customer_payment.getLineItemValue('credit', 'due', i))
					,	remaining_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('credit', 'due', i))
					,	amount: Utils.toCurrency(customer_payment.getLineItemValue('credit', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('credit', 'amount', i))
					,	refnum: customer_payment.getLineItemValue('credit', 'refnum', i)
				};

				result.creditmemosremaining = BigNumber(creditmemo.remaining).plus(result.creditmemosremaining).toNumber();
				result.credits.push(creditmemo);
			}

			result.creditmemosremaining_formatted = Utils.formatCurrency(result.creditmemosremaining);

			return result;
		}

	,	setDeposits: function(customer_payment, result)
		{
			result.deposits = [];

			result.depositsremaining = 0;

			for (var i = 1; i <= customer_payment.getLineItemCount('deposit') ; i++)
			{
				var deposit = {
						internalid: customer_payment.getLineItemValue('deposit', 'doc', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('deposit', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('deposit', 'total', i))
					,	apply: customer_payment.getLineItemValue('deposit', 'apply', i) === 'T'
					,	currency: customer_payment.getLineItemValue('deposit', 'currency', i)
					,	depositdate: customer_payment.getLineItemValue('deposit', 'depositdate', i)
					,	remaining: Utils.toCurrency(customer_payment.getLineItemValue('deposit', 'remaining', i))
					,	remaining_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('deposit', 'remaining', i))
					,	amount: Utils.toCurrency(customer_payment.getLineItemValue('deposit', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('deposit', 'amount', i))
					,	refnum: customer_payment.getLineItemValue('deposit', 'refnum', i)
					};

				result.depositsremaining = BigNumber(deposit.remaining).plus(result.depositsremaining).toNumber();
				result.deposits.push(deposit);
			}

			result.depositsremaining_formatted = Utils.formatCurrency(result.depositsremaining);

			return result;
		}

	,	update: function (payment_record, data)
		{
			var self = this
			,	invoices = data.invoices
			,	credits = data.credits
			,	deposits = data.deposits
			,	credit_card = data.paymentmethods && data.paymentmethods[0] && data.paymentmethods[0].creditcard;

			// invoices

			for (var i = 1; i <= payment_record.getLineItemCount('apply'); i++)
			{
				var invoice = _.findWhere(invoices, {
					internalid: payment_record.getLineItemValue('apply', 'internalid', i)
				});

				if (invoice && invoice.apply)
				{
					payment_record.setLineItemValue('apply', 'apply', i, 'T');
					payment_record.setLineItemValue('apply', 'amount', i, invoice.amount);

					invoice.due = payment_record.getLineItemValue('apply', 'due', i);
					invoice.total = payment_record.getLineItemValue('apply', 'total', i);
					invoice.discdate = payment_record.getLineItemValue('apply', 'discdate', i);
					invoice.discamt = payment_record.getLineItemValue('apply', 'discamt', i);
					invoice.discountapplies = (invoice.due === invoice.total) && (invoice.discdate && stringtodate(invoice.discdate) >= new Date());
					invoice.duewithdiscount = BigNumber(invoice.due).minus(invoice.discountapplies ? invoice.discamt : 0).toNumber();

					if (self._isPayFull(invoice) && invoice.discountapplies && invoice.discamt)
					{
						payment_record.setLineItemValue('apply', 'disc', i, invoice.discamt);
					}
				}
			}

			// deposits

			for (i = 1; i <= payment_record.getLineItemCount('deposit'); i++)
			{
				var deposit = _.findWhere(deposits, {
					internalid: payment_record.getLineItemValue('deposit', 'doc', i)
				});

				if (deposit && deposit.apply)
				{
					payment_record.setLineItemValue('deposit', 'apply', i, 'T');
					payment_record.setLineItemValue('deposit', 'amount', i, deposit.amount);
				}
			}

			// credits

			for (i = 1; i <= payment_record.getLineItemCount('credit'); i++)
			{
				var credit = _.findWhere(credits, {
					internalid: payment_record.getLineItemValue('credit', 'internalid', i)
				});

				if (credit && credit.apply)
				{
					payment_record.setLineItemValue('credit', 'apply', i, 'T');
					payment_record.setLineItemValue('credit', 'amount', i, credit.amount);
				}
			}

			if (data.payment && credit_card && data.billaddress)
			{
				var selected_address = customer.getAddress(data.billaddress);

				if (selected_address)
				{
					customer.updateAddress({
						internalid: selected_address.internalid
					,	addressee: selected_address.addressee
					,	defaultbilling : 'T'
					});

					payment_record.setFieldValue('ccstreet', selected_address.addr1);
					payment_record.setFieldValue('cczipcode', selected_address.zip);
				}

				customer.updateCreditCard({
					internalid: credit_card.internalid
				,	ccdefault : 'T'
				});

				payment_record.setFieldValue('paymentmethod', credit_card.paymentmethod.internalid);

				if (credit_card.ccsecuritycode)
				{
					payment_record.setFieldValue('ccsecuritycode', credit_card.ccsecuritycode);
				}

				payment_record.setFieldValue('payment', data.payment);

			}

			return payment_record;

		}

	,	_isPayFull: function (invoice)
		{
			if (invoice.discountapplies)
			{
				return invoice.amount === invoice.duewithdiscount;
			}
			else
			{
				return invoice.amount === invoice.due;
			}
		}

	,	submit: function (data)
		{
			// update record
			var payment_record = this.update(this.create(), data)
			// save record.
			,	payment_record_id = nlapiSubmitRecord(payment_record)
			// create new record to next payment.
			,	new_payment_record = this.get();

			if (payment_record_id !== '0')
			{
				// send confirmation
				new_payment_record.confirmation = _.extend(data, Payment.get(payment_record_id));
			}
			else
			{
				data.internalid = '0';
				new_payment_record.confirmation = data;
			}

			return new_payment_record;
		}
	});
});