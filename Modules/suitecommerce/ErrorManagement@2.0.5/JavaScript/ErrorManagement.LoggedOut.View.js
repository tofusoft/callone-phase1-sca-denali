/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ErrorManagement
define(
	'ErrorManagement.LoggedOut.View'
,	[
		'error_management_logged_out.tpl'

	,	'Backbone'
	,	'underscore'
	
	,	'Utils'
	]
,	function (
		error_management_logged_out_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class ErrorManagement.LoggedOut.View @extends Backbone.View
	return Backbone.View.extend({

		template: error_management_logged_out_tpl
	,	title : _('Logged out').translate()
	
	,	initialize: function()
		{
			this.labels = {
				title: 'You have been logged out'
			,	explanation: 'Your session expired or someone else logged in another device with your account. You must log in again to continue.'
			,	login: 'Log in'
			};
			_.each(this.labels, function(val, label, labels)
			{
				labels[label] = _(val).translate();
			});
		}
	,	showError: function()
		{
		}

		// @method getContext @returns {ErrorManagement.LoggedOut.View.Context}
	,	getContext: function()
		{
			// @class ErrorManagement.LoggedOut.View.Context
			return {
				// @property {Object} labels 
				labels: this.labels
			};
		}

	});
});