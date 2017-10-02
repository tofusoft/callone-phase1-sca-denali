/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module TransactionHistory
define('TransactionHistory.Model'
,	[	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		_
	,	Backbone
	)
{
	'use strict';

	//@class TransactionHistory.Model @extend Backbone.Model
	return Backbone.Model.extend({

		urlRoot: 'services/TransactionHistory.Service.ss'

		//@method getTypeLabel @return {String}
	,	getTypeLabel: function ()
		{
			var type = this.get('recordtype');

			if (type === 'creditmemo')
			{
				type = _('Credit Memo').translate();
			}
			else if (type === 'customerpayment')
			{
				type = _('Payment').translate();
			}
			else if (type === 'customerdeposit')
			{
				type = _('Deposit').translate();
			}
			else if (type === 'depositapplication')
			{
				type = _('Deposit Application').translate();
			}
			else if (type === 'invoice')
			{
				type = _('Invoice').translate();
			}
			else if (type === 'returnauthorization')
			{
				type = _('Return Authorization').translate();
			}

			return type;
		}

		//@method getTypeUrl @return {String}
	,	getTypeUrl: function ()
		{
			var type = this.get('recordtype')
			,	record_root_url = 'transactionhistory/' + type;

			if (type === 'invoice')
			{
				record_root_url = 'invoices';
			}
			else if (type === 'returnauthorization')
			{
				record_root_url = 'returns';
			}

			return record_root_url + '/' + this.get('internalid');
		}
	});
});