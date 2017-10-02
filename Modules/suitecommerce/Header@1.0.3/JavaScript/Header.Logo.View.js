/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.Logo.View'
,	[
		'SC.Configuration'
	,	'header_logo.tpl'
	,	'Backbone'
	]
,	function(
		Configuration
	,	header_logo_tpl
	,	Backbone
	)
{
	'use strict';

	// @class Header.Logo.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_logo_tpl

		// @method getContext @return {Header.Logo.View.Context}
	,	getContext: function()
		{
			// @class Header.Logo.View.Context
			return {
				// @property {String} logoUrl 
				logoUrl: Configuration.logoUrl
				// @property {String} headerLinkHref 
			,	headerLinkHref: this.options.headerLinkHref || '/'
				// @property {String} headerLinkTouchPoint 
			,	headerLinkTouchPoint: this.options.headerLinkTouchPoint || 'home'
				// @property {String} headerLinkHashtag 
			,	headerLinkHashtag: this.options.headerLinkHashtag || '#'
				// @property {String} headerLinkTitle 	
			,	headerLinkTitle: this.options.headerLinkTitle || SC.ENVIRONMENT.siteSettings.displayname
			};
		}
	});

});