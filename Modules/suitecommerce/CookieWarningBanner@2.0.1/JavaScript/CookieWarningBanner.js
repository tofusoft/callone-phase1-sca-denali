/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CookieWarningBanner
// Handles the display of the banner to be displayed warning the customers about the site's use of cookies
define(
	'CookieWarningBanner'
,	[
		'SC.Configuration'

	,	'GlobalViews.Message.View'

	,	'jQuery'
	,	'jquery.cookie'
	]
,	function (
		Configuration

	,	GlobalViewsMessageView

	,	jQuery
	)
{
	'use strict';

	// @class CookieWarningBanner this module will listen to layout's afterRender and preppend itself.
	// @extends ApplicationModule
	return {
		mountToApp: function (application)
		{
			var cookie_message = ''
			,	$cookie_message_element = ''
			,	Layout = application.getLayout()
			,	cookie_warning_settings = Configuration.get('cookieWarningBanner')
				// The cookie policy is set up in the backend
			,	cookie_warning_policy = Configuration.get('siteSettings.cookiepolicy')
			,	show_cookie_warning_banner = Configuration.get('siteSettings.showcookieconsentbanner') === 'T';

			jQuery.cookie.json = true;

			// If we need to show the banner and it hasn't been closed
			if (show_cookie_warning_banner && !(cookie_warning_settings.saveInCookie && jQuery.cookie('isCookieWarningClosed')))
			{
				cookie_message = cookie_warning_settings.message;

				// if there's a file
				if (cookie_warning_policy)
				{
					cookie_message += ' <a href="https://system.netsuite.com' + cookie_warning_policy +
						'" data-toggle="show-in-modal" data-page-header="' + cookie_warning_settings.anchorText +
						'">' + cookie_warning_settings.anchorText + '</a>';
				}

				var global_view_message = new GlobalViewsMessageView({
						message: cookie_message
					,	type: 'info'
					,	closable: cookie_warning_settings.closable
				});

				// html for the message
				$cookie_message_element = jQuery(
					global_view_message.render().$el.html()
				);

				Layout.on('afterCompositeViewRender', function ()
				{
					// We prepend the html to the view
					Layout.$('[data-type=message-placeholder]').prepend(global_view_message.render().$el);

					global_view_message.$('[data-action="close-message"]').on('click', function ()
					{
						if (cookie_warning_settings.saveInCookie)
						{
							jQuery.cookie('isCookieWarningClosed', true);
						}
					});
				});
			}
		}
	};
});
