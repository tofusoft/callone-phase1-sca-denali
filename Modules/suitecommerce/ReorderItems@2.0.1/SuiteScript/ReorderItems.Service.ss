/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// ReorderItems.Service.ss
// ----------------
// Service to manage order items requests
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{
		// Only can get a order item if you are logged in
		if (session.isLoggedIn())
		{
			var permissions = Application.getPermissions().transactions;
			
			if (permissions.tranSalesOrd > 0 && permissions.tranFind > 0)
			{
				var method = request.getMethod()
				//  ReorderItems model is defined on ssp library Models.js
				,	ReorderItems = require('ReorderItems.Model');

				switch (method)
				{
					case 'GET':
						//Call the search function defined on ssp_libraries/models/ReorderItems.js and send the respose
						Application.sendContent(ReorderItems.search(
							request.getParameter('order_id')
						,	request.getParameter('query')
						,	{
								date : {
									from: request.getParameter('from')
								,	to: request.getParameter('to')
								}
							,	page: request.getParameter('page') || 1
							,	sort : request.getParameter('sort')
							,	order: request.getParameter('order')
							}
						));
					break;

					default:
						//  methodNotAllowedError is defined in ssp library commons.js
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