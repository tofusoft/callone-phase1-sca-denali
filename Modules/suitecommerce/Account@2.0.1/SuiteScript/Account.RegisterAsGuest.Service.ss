/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.RegisterAsGuest.Service.ss
// ----------------
// Service to manage addresses requests
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		var method = request.getMethod()
		,	data = JSON.parse(request.getBody() || '{}')
		,	Account = require('Account.Model');

		switch (method)
		{
			case 'POST':
				//Handles the login and send the response
				Application.sendContent(Account.registerAsGuest(data));
			break;

			default:
				// methodNotAllowedError is defined in ssp library commons.js
				Application.sendError(methodNotAllowedError);
		}
	}
	catch (e)
	{
		Application.sendError(e);
	}
}