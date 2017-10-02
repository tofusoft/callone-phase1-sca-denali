/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Receipt.Service.ss
// ----------------
// Service to manage receipts requests
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		// Only can get a receipt if you are logged in
		if (session.isLoggedIn())
		{
			var method = request.getMethod()
			,	id = request.getParameter('internalid')
			,	status = request.getParameter('status')
			,	type = request.getParameter('type')
				// Receipts model is defined on ssp library Models.js
			,	Receipt = require('Receipt.Model')
			,	permissions = Application.getPermissions().transactions;

			if ( ( type === 'invoice' && permissions.tranFind > 0 && permissions.tranCustInvc > 0 )
			||   ( type !== 'invoice' && permissions.tranFind > 0 && permissions.tranSalesOrd > 0 ) )
			{
				switch (method)
				{
					case 'GET':
						// If the id exist, sends the response of Receipt.get(id), else send (Receipt.list(options) || [])
						Application.sendContent(id ? Receipt.get(id, type) : Receipt.list({
							type: type
						,	status: status
						}));

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
