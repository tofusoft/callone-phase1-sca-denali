/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// PrintStatement.Service.ss
// ----------------
// Service to manage print requests
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{
		//Only can get, modify, update or delete an address if you are logged in
		if (session.isLoggedIn())
		{
			var method = request.getMethod()
			,	data = JSON.parse(request.getBody() || '{}');

			switch (method)
			{
				case 'POST':
					if (context.getPermission('TRAN_STATEMENT') === 2)
					{
						Application.sendContent({'url': require('PrintStatement.Model').getUrl(data)});
					}
					else
					{
						Application.sendError(forbiddenError);
					}
				break;

				default:
					// methodNotAllowedError is defined in ssp library commons.js
					Application.sendError(methodNotAllowedError);
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