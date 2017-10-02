/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReturnAuthorization
define('ReturnAuthorization'
,	[	'ReturnAuthorization.Router'

	,	'underscore'
	,	'Utils'
	]
,	function (
		Router

	,	_
	)
{
	'use strict';

	// Defines the Return Authorization module (Model, Collection, Views, Router)
	return	{
		MenuItems: {
			parent: 'orders'
		,	id: 'returns'
		,	name: _('Returns').translate()
		,	url: 'returns'
		,	index: 2
		,	permission: 'transactions.tranFind.1,transactions.tranRtnAuth.1'
		}

	,	mountToApp: function (application)
		{
			return new Router(application);
		}
	};
});
