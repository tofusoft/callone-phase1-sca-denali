/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// placed-order.ss
// ----------------
// Service to manage orders requests
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{
		//Only can get an order if you are logged in
		if (session.isLoggedIn())
		{
			var method = request.getMethod()
			,	id = request.getParameter('internalid')
			//  Order model is defined on ssp library Models.js
			,	OrderHistory = require('OrderHistory.Model')
			,	permissions = Application.getPermissions().transactions;
			
			if (permissions.tranSalesOrd > 0 && permissions.tranFind > 0)
			{
				switch (method)
				{
					case 'GET':
						
						//If the id exist, sends the response of Order.get(id), else sends the response of (Order.list(options) || [])

						if (id)
						{
							Application.sendContent(OrderHistory.get(id));
						}
						else
						{
							Application.sendContent(OrderHistory.list({
								filter: request.getParameter('filter')
							,	order: request.getParameter('order')
							,	sort: request.getParameter('sort')
							,	from: request.getParameter('from')
							,	to: request.getParameter('to')
							,	page: request.getParameter('page') || 1
							,	results_per_page: request.getParameter('results_per_page')
							}));
						}


					break;

					default: 
						// methodNotAllowedError is defined in ssp library commons.js
						Application.sendError(methodNotAllowedError);
				}
			}
			else
			{
				// forbiddenError is defined in ssp library commons.js
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