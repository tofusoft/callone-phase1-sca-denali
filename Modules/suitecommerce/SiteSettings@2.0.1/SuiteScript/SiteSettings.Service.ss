/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// SiteSettings.Service.ss
// ----------------
// Service to manage sitesettings requests
function service (request)
{
	'use strict';
	
	var Application = require('Application');
	
	try
	{
		switch (request.getMethod())
		{
			case 'GET':
				Application.sendContent(require('SiteSettings.Model').get());
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