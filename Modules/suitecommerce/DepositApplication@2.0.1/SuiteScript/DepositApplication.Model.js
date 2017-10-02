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
	'DepositApplication.Model'
,	['SC.Model', 'Utils']
,	function (SCModel, Utils)
{
	'use strict';

	return SCModel.extend({

		name: 'DepositApplication'

	,	get: function (id)
		{
			var record = nlapiLoadRecord('depositapplication', id)
			,	result = {};

			this.createResult(record, result);
			this.setInvoices(record, result);

			return result;
		}

	,	createResult: function(record, result)
		{
			result.internalid = record.getId();
			result.tranid = record.getFieldValue('tranid');
			result.total = Utils.toCurrency(record.getFieldValue('total'));
			result.total_formatted = Utils.formatCurrency(record.getFieldValue('total'));

			result.deposit =
			{
				internalid: record.getFieldValue('deposit')
			,	name: record.getFieldText('deposit')
			};

			result.depositdate = record.getFieldValue('depositdate');
			result.trandate = record.getFieldValue('trandate');
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
	});
});