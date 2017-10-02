/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Receipt.js
// -----------------
// Defines the Receipt module (Model, Collection, Views, Router)
define('Receipt'
,	[	'Receipt.Router'

	,	'underscore'
	,	'Utils'
	]
,	function (
		Router

	,	_
	)
{
	'use strict';

	return	{
		MenuItems: {
			parent: 'orders'
		,	id: 'receiptshistory'
		,	name: _('Receipts').translate()
		,	url: 'receiptshistory'
		,	index: 3
		,	permission: 'transactions.tranFind.1,transactions.tranSalesOrd.1'
		}

	,	mountToApp:  function (application)
		{
			return new Router(application);
		}
	};
});