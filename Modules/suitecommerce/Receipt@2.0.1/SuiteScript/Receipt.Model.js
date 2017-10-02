/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Receipt.Model.js
// ----------
// Handles fetching receipts
define(
	'Receipt.Model'
,	['OrderHistory.Model', 'Receipt.List', 'Application', 'Utils']
,	function (OrderHistoryModel, ReceiptList, Application, Utils)
{
	'use strict';

	return OrderHistoryModel.extend({

		name: 'Receipt'

	,	_getReceiptType: ReceiptList._getReceiptType

		// gets all the user's receipts
	,	list: ReceiptList.list

	,	setAdjustments: function (receipt, result)
		{
			result.payments = [];
			result.credit_memos = [];
			result.deposit_applications = [];

			var isMultiCurrency = context.getFeature('MULTICURRENCY')
			,	amount_field = isMultiCurrency ? 'appliedtoforeignamount' : 'appliedtolinkamount'
			,	filters = [
					new nlobjSearchFilter('appliedtotransaction', null, 'is', receipt.getId())
				,	new nlobjSearchFilter('type', null, 'anyof', ['CustCred', 'DepAppl', 'CustPymt'])
				]
			,	columns = [
					new nlobjSearchColumn('total')
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('status')
				,	new nlobjSearchColumn('trandate')
				,	new nlobjSearchColumn('appliedtotransaction')
				,	new nlobjSearchColumn('amountremaining')
				,	new nlobjSearchColumn('amountpaid')
				,	new nlobjSearchColumn('amount')
				,	new nlobjSearchColumn('type')
				,	new nlobjSearchColumn(amount_field)
				]
			,	searchresults = nlapiSearchRecord('transaction', null, filters, columns);

			if (searchresults)
			{
				_.each(searchresults, function (payout)
				{
					var array = (payout.getValue('type') === 'CustPymt') ? result.payments :
								(payout.getValue('type') === 'CustCred') ? result.credit_memos :
								(payout.getValue('type') === 'DepAppl') ? result.deposit_applications : null;

					if (array)
					{
						var internal_id = payout.getId()
						,	duplicated_item = _.findWhere(array, {internalid: internal_id});

						if (!duplicated_item)
						{
							array.push({
								internalid: internal_id
							,	tranid: payout.getValue('tranid')
							,	appliedtoforeignamount : Utils.toCurrency(payout.getValue(amount_field))
							,	appliedtoforeignamount_formatted : Utils.formatCurrency(payout.getValue(amount_field))
							});
						}
						else
						{
							duplicated_item.appliedtoforeignamount += Utils.toCurrency(payout.getValue(amount_field));
							duplicated_item.appliedtoforeignamount_formatted = Utils.formatCurrency(duplicated_item.appliedtoforeignamount);
						}
					}
				});
			}
		}

	,	setSalesRep: function (receipt, result)
		{
			var salesrep_id = receipt.getFieldValue('salesrep')
			,	salesrep_name = receipt.getFieldText('salesrep');

			if (salesrep_id)
			{
				result.salesrep = {
					name: salesrep_name
				,	internalid: salesrep_id
				};

				var filters = [
					new nlobjSearchFilter('internalid', null, 'is', receipt.getId())
				,	new nlobjSearchFilter('internalid', 'salesrep', 'is', 'salesrep')
				]

				,	columns = [
						new nlobjSearchColumn('duedate')
					,	new nlobjSearchColumn('salesrep')
					,	new nlobjSearchColumn('email','salesrep')
					,	new nlobjSearchColumn('entityid','salesrep')
					,	new nlobjSearchColumn('mobilephone','salesrep')
					,	new nlobjSearchColumn('fax','salesrep')
				];

				var search_results = nlapiSearchRecord('invoice', null, filters, columns);

				if (search_results)
				{
					var invoice = search_results[0];
					result.salesrep.phone = invoice.getValue('phone','salesrep');
					result.salesrep.email = invoice.getValue('email','salesrep');
					result.salesrep.fullname = invoice.getValue('entityid','salesrep');
					result.salesrep.mobilephone = invoice.getText('mobilephone','salesrep');
					result.salesrep.fax = invoice.getValue('fax','salesrep');
				}
			}
		}

	,	get: function (id, type)
		{
			// get the transaction header
			var filters = [
					new nlobjSearchFilter('mainline', null, 'is', 'T')
				,	new nlobjSearchFilter('type', null, 'anyof', this._getReceiptType(type))
				,	new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
				,	new nlobjSearchFilter('internalid', null, 'is', id)
				]
			,	columns = [
					new nlobjSearchColumn('status')
				,	new nlobjSearchColumn('createdfrom')
				,	new nlobjSearchColumn('total')
				,	new nlobjSearchColumn('taxtotal')
				]

			,	mainline = Application.getAllSearchResults('transaction', filters, columns);

			if (!mainline[0])
			{
				throw forbiddenError;
			}

			var	receipt = nlapiLoadRecord(mainline[0].getRecordType(), id)
			,	result = this.createResult(receipt);

			this.setAddresses(receipt, result);
			this.setLines(receipt, result);
			this.setPaymentMethod(receipt, result);

			if (type === 'invoice')
			{
				this.setAdjustments(receipt, result);
				this.setSalesRep(receipt, result);
			}

			result.promocode = receipt.getFieldValue('promocode') ? {
				internalid: receipt.getFieldValue('promocode')
			,	name: receipt.getFieldText('promocode')
			,	code: receipt.getFieldText('couponcode')
			} : null;

			result.lines = _.reject(result.lines, function (line)
			{
				return line.quantity === 0;
			});

			result.status = mainline[0].getText(columns[0]);
			result.internal_status = mainline[0].getValue(columns[0]);

			result.createdfrom = {
				id: mainline[0].getValue(columns[1])
			,	name: mainline[0].getText(columns[1])
			};

			result.summary.total = Utils.toCurrency(mainline[0].getValue('total'));
			result.summary.total_formatted = Utils.formatCurrency(mainline[0].getValue('total'));
			result.summary.taxtotal = Utils.toCurrency(mainline[0].getValue('taxtotal'));
			result.summary.taxtotal_formatted = Utils.formatCurrency(mainline[0].getValue('taxtotal'));

			// convert the obejcts to arrays
			result.addresses = _.values(result.addresses);
			result.lines = _.values(result.lines);

			this.setReturnAuthorizations(result, receipt);

			if (result.createdfrom && result.createdfrom.id)
			{
				this.setFulfillments(result.createdfrom.id, result);
			}

			return result;
		}
	});
});