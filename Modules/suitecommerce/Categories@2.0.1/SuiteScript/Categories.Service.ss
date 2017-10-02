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
	
	var Application = require('Application');
	
	try
	{
		var method = request.getMethod()
		,	root_id = request.getParameter('rootId')
		,	Categories = require('Categories.Model');
		
		switch (method)
		{
			case 'GET':
				Application.sendContent(Categories.get(root_id));
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