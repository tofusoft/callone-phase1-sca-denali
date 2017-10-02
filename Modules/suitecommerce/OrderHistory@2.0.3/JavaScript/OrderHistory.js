/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderHistory
// Implements the experience of seeing all the customer Orders experience, this is the 'Order History' experience in MyAccount. Includes the Order module (Model, Collection, Views, Router)
define('OrderHistory'
,	[	
		'OrderHistory.Router'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Router
	,	_
	)
{
	'use strict';

	// @class OrderHistory @extends ApplicationModule
	return	{
		// @property {MenuItem} MenuItems
		MenuItems: {
			id: 'orders'
		,	name: _('Orders').translate()
		,	index: 1
		,	children: [{
				id: 'ordershistory'
			,	name: _('Order History').translate()
			,	url: 'ordershistory'
			,	index: 1
			,	permission: 'transactions.tranFind.1,transactions.tranSalesOrd.1'
			}]
		}
		// @method mountToApp
	,	mountToApp: function (application)
		{
			return new Router(application);
		}
	};
});
