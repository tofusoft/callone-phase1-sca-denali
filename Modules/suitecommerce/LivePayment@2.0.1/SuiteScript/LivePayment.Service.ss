/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// LivePayment.Service.ss
// ----------------
// Service to manage cart items requests
function service (request)
{
	'use strict';
	
	var Application = require('Application');

	try
	{
		// If we are not in the checkout OR we are logged in
		// When on store, login in is not required
		// when on checkout, login is required
		if (session.isLoggedIn())
		{
			var method = request.getMethod()
				// Live payment model is defined on ssp library Models.js
			,	LivePayment = require('LivePayment.Model')
			,	permissions = Application.getPermissions().transactions
			,	data = JSON.parse(request.getBody() || '{}');

			if (permissions.tranCustPymt > 1 && permissions.tranCustInvc > 0)
			{
				switch (method)
				{
					case 'GET':
						Application.sendContent(LivePayment.get());
					break;

					case 'POST':
						Application.sendContent(LivePayment.submit(data));
					break;

					default:
						// methodNotAllowedError is defined in ssp library commons.js
						Application.sendError(methodNotAllowedError);
				}
			}
			else
			{
				Application.sendError(forbiddenError);
			}
		}
		else
		{
			// unauthorizedError is defined in ssp library commons.js
			Application.sendError(unauthorizedError);
		}
	}
	catch (e)
	{
		Application.sendError(e);
	}
}
