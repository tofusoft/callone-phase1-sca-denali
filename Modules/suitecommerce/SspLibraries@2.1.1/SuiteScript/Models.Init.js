/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Init.js
// -------
// Global variables to be used accross models
// This is the head of combined file Model.js

/* exported container, session, settings, customer, context, order */
var container = nlapiGetWebContainer()
,	session = container.getShoppingSession()
//,	settings = session.getSiteSettings()
,	customer = session.getCustomer()
,	context = nlapiGetContext()
,	order = session.getOrder();

define('Models.Init', function ()
{
	// TODO: (migrate) analyze strategy here
});