/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Receipt.List'
,	['Application', 'Utils']
,	function (Application, Utils)
{
	'use strict';
	var receiptList = {

		_getReceiptType: function (type)
		{
			var receipt_type = ['CustInvc', 'CashSale'];

			if (type === 'invoice')
			{
				receipt_type = ['CustInvc'];
			}
			else if (type === 'cashsale')
			{
				receipt_type = ['CashSale'];
			}

			return receipt_type;
		}

	,	_getReceiptStatus: function (type, status)
		{
			if (type === 'CustInvc')
			{
				status = receiptList._getInvoiceStatus(status);
			}
			else if (type === 'CashSale')
			{
				status = receiptList._getCashSaleStatus(status);
			}

			return type + ':' + status;
		}

	,	_getCashSaleStatus: function (status)
		{
			var response = null;

			switch (status)
			{
				case 'unapproved':
					response = 'A';
				break;

				case 'notdeposited':
					response = 'B';
				break;

				case 'deposited':
					response = 'C';
				break;
			}

			return response;
		}

	,	_getInvoiceStatus: function (status)
		{
			var response = null;

			switch (status)
			{
				case 'open':
					response = 'A';
				break;

				case 'paid':
					response = 'B';
				break;
			}

			return response;
		}

	,	list: function (options)
		{
			options = options || {};

			var reciept_type = receiptList._getReceiptType(options.type)
			,	isMultiCurrency = context.getFeature('MULTICURRENCY')
			,	amount_field = isMultiCurrency ? 'fxamount' : 'amount'
			,	filters = [
					new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
				,	new nlobjSearchFilter('mainline', null, 'is', 'T')
				,	new nlobjSearchFilter('type', null, 'anyof', reciept_type)
				]

			,	columns = [
					new nlobjSearchColumn('internalid').setSort(true)
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('trandate').setSort(true)
				,	new nlobjSearchColumn('status')
				,	new nlobjSearchColumn('type')
				,	new nlobjSearchColumn('closedate')
				,	new nlobjSearchColumn('mainline')
				,	new nlobjSearchColumn('duedate')
				,	new nlobjSearchColumn(amount_field)
				]
			,	amount_remaining;

			if (isMultiCurrency)
			{
				amount_remaining = new nlobjSearchColumn('formulanumeric').setFormula('{amountremaining} / {exchangerate}');
			}
			else
			{
				amount_remaining = new nlobjSearchColumn('amountremaining');
			}

			columns.push(amount_remaining);

			// if the store has multiple currencies we add the currency column to the query
			if (isMultiCurrency)
			{
				columns.push(new nlobjSearchColumn('currency'));
			}

			// if the site is multisite we add the siteid to the search filter
			Application.addFilterSite(filters);

			if (options.status)
			{
				filters.push(
					new nlobjSearchFilter('status', null, 'anyof', _.map(reciept_type, function (type)
					{
						return receiptList._getReceiptStatus(type, options.status);
					}))
				);
			}

			if (options.orderid)
			{
				filters.push(new nlobjSearchFilter('createdfrom', null, 'anyof', options.orderid));
			}

			if (options.internalid)
			{
				filters.push(new nlobjSearchFilter('internalid', null, 'anyof', options.internalid));
			}

			var results = Application.getAllSearchResults(options.type === 'invoice' ? 'invoice' : 'transaction', filters, columns)
			,	now = new Date().getTime();


			return _.map(results || [], function (record)
			{

				var due_date = record.getValue('duedate')
				,	close_date = record.getValue('closedate')
				,	tran_date = record.getValue('trandate')
				,	due_in_milliseconds = new Date(due_date).getTime() - now
				,	total = Utils.toCurrency(record.getValue(amount_field))
				,	total_formatted = Utils.formatCurrency(record.getValue(amount_field));

				return {
					internalid: record.getId()
				,	tranid: record.getValue('tranid')
				,	order_number: record.getValue('tranid') // Legacy attribute
				,	date: tran_date // Legacy attribute
				,	summary: { // Legacy attribute
						total: total
					,	total_formatted: total_formatted
					}
				,	total: total
				,	total_formatted: total_formatted
				,	recordtype: record.getValue('type')
				,	mainline: record.getValue('mainline')
				,	amountremaining: Utils.toCurrency(record.getValue(amount_remaining))
				,	amountremaining_formatted: Utils.formatCurrency(record.getValue(amount_remaining))
				,	closedate: close_date
				,	closedateInMilliseconds: new Date(close_date).getTime()
				,	trandate: tran_date
				,	tranDateInMilliseconds: new Date(tran_date).getTime()
				,	duedate: due_date
				,	dueinmilliseconds: due_in_milliseconds
				,	isOverdue: due_in_milliseconds <= 0 && ((-1 * due_in_milliseconds) / 1000 / 60 / 60 / 24) >= 1
				,	status: {
						internalid: record.getValue('status')
					,	name: record.getText('status')
					}
				,	currency: isMultiCurrency ? {
						internalid: record.getValue('currency')
					,	name: record.getText('currency')
					} : null
				};
			});
		}
	};

	return receiptList;
});