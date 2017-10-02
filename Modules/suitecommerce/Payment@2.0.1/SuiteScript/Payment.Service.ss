/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
function service (request)
{
	'use strict';

	var Application;

	try
	{
		Application = require('Application');

		if (session.isLoggedIn())
		{
			var method = request.getMethod()
			,	id = request.getParameter('internalid')
			,	Payment = require('Payment.Model')
			,	permissions = Application.getPermissions().transactions;

			if (permissions.tranCustPymt > 0)
			{
				switch (method)
				{
					case 'GET':
						Application.sendContent(Payment.get(id));
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
