/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define(
	'Footer.View'
,	[
		'SC.Configuration'
	,	'GlobalViews.BackToTop.View'

	,	'footer.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'jQuery'
	]
,	function (
		Configuration
	,	GlobalViewsBackToTopView

	,	footer_tpl

	,	Backbone
	,	BackboneCompositeView
	,	jQuery
	)
{
	'use strict';

	// @class Footer.View @extends Backbone.View
	return Backbone.View.extend({

		template: footer_tpl

	,	initialize: function (options)
		{
			/*'#main-container'*/
			this.application = options.application;

			BackboneCompositeView.add(this);

			//after appended to DOM, we add the footer height as the content bottom padding, so the footer doesn't go on top of the content
			//wrap it in a setTimeout because if not, calling height() can take >150 ms in slow devices - forces the browser to re-compute the layout.
			this.application.getLayout().on('afterAppendToDom', function ()
			{
				var headerMargin = 25;

				setTimeout(function ()
				{
					// TODO REMOVE this HARDCODED Ids!, this parameters should be pass in by each specific layout, for this the header and footer SHOULD BE removed from the
					// ApplicationSkeleton.Layout as this is generic and should not have any concrete view
					var contentHeight = jQuery(window).innerHeight() - jQuery('#site-header')[0].offsetHeight - headerMargin - jQuery('#site-footer')[0].offsetHeight;
  					jQuery('#main-container').css('min-height', contentHeight);
				},10);
			});

		}

	,	childViews: {
			'Global.BackToTop': function ()
			{
				return new GlobalViewsBackToTopView();
			}
		}

		// @method getContext @return {Footer.View.Context}
	,	getContext: function ()
		{
			// @class Footer.View.Context
			return {
				// @property {Boolean} showLanguages
				showFooterNavigationLinks: Configuration.footerNavigation
				// @property {Array<Object>} footerNavigationLinks - the object contains the properties name:String, href:String
			,	footerNavigationLinks: Configuration.footerNavigation || []
			};
			// @class Footer.View
		}
	});
});