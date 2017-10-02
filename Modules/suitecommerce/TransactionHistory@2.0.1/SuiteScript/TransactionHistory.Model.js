/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// TransactionHistory.Model.js
// ----------------
//
define(
	'TransactionHistory.Model'
,	['SC.Model', 'Application', 'Utils']
,	function (SCModel, Application, Utils)
{
	'use strict';

	return SCModel.extend({
		name: 'TransactionHistory'

	,	search: function (data)
		{
			var types = ['CustCred', 'CustDep', 'DepAppl', 'CustPymt', 'CustInvc', 'RtnAuth']

			,	amount_field = context.getFeature('MULTICURRENCY') ? 'fxamount' : 'amount'

			,	filters = [
					new nlobjSearchFilter('mainline', null, 'is', 'T')
				]

			,	columns = [
					new nlobjSearchColumn('trandate')
				,	new nlobjSearchColumn('internalid')
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('status')
				,	new nlobjSearchColumn('total')
				,	new nlobjSearchColumn(amount_field)
				];

			switch (data.filter)
			{
				case 'creditmemo':
					types = ['CustCred'];
				break;

				case 'customerpayment':
					types = ['CustPymt'];
				break;

				case 'customerdeposit':
					types = ['CustDep'];
				break;

				case 'depositapplication':
					types = ['DepAppl'];
				break;

				case 'invoice':
					types = ['CustInvc'];
				break;

				case 'returnauthorization':
					types = ['RtnAuth'];
				break;
			}

			filters.push(new nlobjSearchFilter('type', null, 'anyof', types));

			if (data.from && data.to)
			{
				var offset = new Date().getTimezoneOffset() * 60 * 1000;

				filters.push(new nlobjSearchFilter('trandate', null, 'within', new Date(parseInt(data.from, 10) + offset), new Date(parseInt(data.to, 10) + offset)));
			}

			// if the site is multisite we add the siteid to the search filter
			Application.addFilterSite(filters);

			switch (data.sort)
			{
				case 'number':
					columns[2].setSort(data.order >= 0);
				break;

				case 'amount':
					columns[5].setSort(data.order >= 0);
				break;

				default:
					columns[0].setSort(data.order > 0);
					columns[1].setSort(data.order > 0);
			}

			var result = Application.getPaginatedSearchResults({
					record_type: 'transaction'
				,	filters: filters
				,	columns: columns
				,	page: data.page
				});

			result.records = _.map(result.records, function (record)
			{
				return {
					recordtype: record.getRecordType()
				,	internalid: record.getValue('internalid')
				,	tranid: record.getValue('tranid')
				,	trandate: record.getValue('trandate')
				,	status: record.getText('status')
				,	amount: Utils.toCurrency(record.getValue(amount_field))
				,	amount_formatted: Utils.formatCurrency(record.getValue(amount_field))
				};
			});

			return result;
		}
	});
});