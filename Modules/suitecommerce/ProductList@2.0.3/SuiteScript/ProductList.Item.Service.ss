/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// ProductList.Item.Service.ss
// ----------------
// Service to manage product list items requests
function service (request)
{
	'use strict';

	var Application = require('Application')
	,	ProductListItem = require('ProductList.Item.Model');

	try
	{
		var context = nlapiGetContext()
		,	role = context.getRoleId()
		,	method = request.getMethod()
		,	data = JSON.parse(request.getBody() || '{}')
		,	id = request.getParameter('internalid') ? request.getParameter('internalid') : data.internalid
		,	product_list_id = request.getParameter('productlistid') ? request.getParameter('productlistid') : data.productlistid
		,	user = nlapiGetUser();

		// This is to ensure customers can't query other customer's product lists.
		if (role !== 'shopper' && role !== 'customer_center')
		{
			user = parseInt(request.getParameter('user') || (data.productList && data.productList.owner) || user, 10);
		}

		switch (method)
		{
			case 'GET':
				Application.sendContent(id ? ProductListItem.get(user, id) : ProductListItem.search(user, product_list_id, true, {
						sort: request.getParameter('sort') ? request.getParameter('sort') : data.sort // Column name
					,	order: request.getParameter('order') ? request.getParameter('order') : data.order // Sort direction
					,	page: request.getParameter('page') || -1
				}));
			break;

			case 'POST':
				Application.sendContent(ProductListItem.create(user, data), {'status': 201});
			break;

			case 'PUT':
				ProductListItem.update(user, id, data);
				Application.sendContent(ProductListItem.get(user, id));
			break;

			case 'DELETE':
				ProductListItem.delete(user, id);
				Application.sendContent({'status': 'ok'});
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