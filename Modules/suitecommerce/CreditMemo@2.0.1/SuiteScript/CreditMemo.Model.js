/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module CreditMemo
define('CreditMemo.Model'
,	[	'SC.Model'
	,	'StoreItem.Model'
	,	'Application'
	,	'underscore'
	,	'Utils'
	]
,	function (
		SCModel
	,	StoreItem
	,	Application
	,	_
	,	Utils
	)
{
	'use strict';

	//@class CreditMemo.Model @extend SCModel
	return SCModel.extend({
		name: 'CreditMemo'

	,	get: function (id)
		{
			var creditmemo = nlapiLoadRecord('creditmemo', id)
			,	result = {};

			this.createRecord(creditmemo, result);
			this.setInvoices(creditmemo, result);
			this.getLines(creditmemo, result);

			return result;
		}

	,	createRecord: function(record, result)
		{
			result.internalid = record.getId();
			result.tranid = record.getFieldValue('tranid');

			result.subtotal = Utils.toCurrency(record.getFieldValue('subtotal'));
			result.subtotal_formatted = Utils.formatCurrency(record.getFieldValue('subtotal'));
			result.discount = Utils.toCurrency(record.getFieldValue('discounttotal'));
			result.discount_formatted = Utils.formatCurrency(record.getFieldValue('discounttotal'));
			result.taxtotal = Utils.toCurrency(record.getFieldValue('taxtotal'));
			result.taxtotal_formatted = Utils.formatCurrency(record.getFieldValue('taxtotal'));
			result.shippingcost = Utils.toCurrency(record.getFieldValue('shippingcost'));
			result.shippingcost_formatted = Utils.formatCurrency(record.getFieldValue('shippingcost'));
			result.total = Utils.toCurrency(record.getFieldValue('total'));
			result.total_formatted = Utils.formatCurrency(record.getFieldValue('total'));
			result.amountpaid = Utils.toCurrency(record.getFieldValue('amountpaid'));
			result.amountpaid_formatted = Utils.formatCurrency(record.getFieldValue('amountpaid'));
			result.amountremaining = Utils.toCurrency(record.getFieldValue('amountremaining'));
			result.amountremaining_formatted = Utils.formatCurrency(record.getFieldValue('amountremaining'));

			result.trandate = record.getFieldValue('trandate');
			result.status = record.getFieldValue('status');
			result.memo = record.getFieldValue('memo');
		}

	,	setInvoices: function(record, result)
		{
			result.invoices = [];

			for (var i = 1; i <= record.getLineItemCount('apply'); i++)
			{
				var invoice = {
						line: i
					,	internalid: record.getLineItemValue('apply', 'internalid', i)
					,	type: record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(record.getLineItemValue('apply', 'total', i))
					,	apply: record.getLineItemValue('apply', 'apply', i) === 'T'
					,	applydate: record.getLineItemValue('apply', 'applydate', i)
					,	currency: record.getLineItemValue('apply', 'currency', i)

					,	amount: Utils.toCurrency(record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(record.getLineItemValue('apply', 'amount', i))
					,	due: Utils.toCurrency(record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(record.getLineItemValue('apply', 'due', i))
					,	refnum: record.getLineItemValue('apply', 'refnum', i)
				};

				result.invoices.push(invoice);
			}
		}

	,	getLines: function (record, result)
		{
			var result_lines = []
			,	items_to_query = []
			,	items_to_preload = {}
			,	loaded_lines = [];

			for (var i = 1; i <= record.getLineItemCount('item'); i++)
			{
				var amount = record.getLineItemValue('item', 'amount', i)
				,	rate = record.getLineItemValue('item', 'rate', i)
				,	item_id = record.getLineItemValue('item', 'item', i)
				,	item_type = record.getLineItemValue('item', 'itemtype', i);

				items_to_preload[item_id] = {
					id: item_id
				,	type: item_type
				};

				result_lines.push({
					// As we are returning the item, the quantity is negative
					// don't want to show that to the customer.
					quantity: Math.abs(record.getLineItemValue('item', 'quantity', i))
				,	options: Utils.getItemOptionsObject(record.getLineItemValue('item', 'options', i))

				,	item: item_id
				,	type: item_type

				,	amount: Utils.toCurrency(amount)
				,	amount_formatted: Utils.formatCurrency(amount)

				,	rate: Utils.toCurrency(rate)
				,	rate_formatted: Utils.formatCurrency(rate)
				});
			}

			items_to_preload = _.values(items_to_preload);
			StoreItem.preloadItems(items_to_preload);


			_.each(result_lines, function (line)
			{
				if (line.item)
				{
					var item = StoreItem.get(line.item, line.type);
					if (!item || typeof item.itemid === 'undefined')
					{
						items_to_query.push(line.item);
					}
				}
			});

			if (items_to_query.length > 0)
			{
				var filters = [
						new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
					,	new nlobjSearchFilter('internalid', 'item', 'anyof', items_to_query)
					]

				,	columns = [
						new nlobjSearchColumn('internalid', 'item')
					,	new nlobjSearchColumn('type', 'item')
					,	new nlobjSearchColumn('parent', 'item')
					,	new nlobjSearchColumn('displayname', 'item')
					,	new nlobjSearchColumn('storedisplayname', 'item')
					,	new nlobjSearchColumn('itemid', 'item')
					]

				,	inactive_items_search = Application.getAllSearchResults('transaction', filters, columns);

				_.each(inactive_items_search, function (item)
				{
					var inactive_item = {
						internalid: item.getValue('internalid', 'item')
					,	type: item.getValue('type', 'item')
					,	displayname: item.getValue('displayname', 'item')
					,	storedisplayname: item.getValue('storedisplayname', 'item')
					,	itemid: item.getValue('itemid', 'item')
					};

					StoreItem.set(inactive_item);
				});
			}

			_.each(result_lines, function (line)
			{
				line.item = StoreItem.get(line.item, line.type);
			});

			result.lines = result_lines;
		}

	});
});