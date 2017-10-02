/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define(
	'Footer.Simplified.View'
,	[
		'SC.Configuration'
	,	'GlobalViews.BackToTop.View'

	,	'footer_simplified.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	]
,	function(
		Configuration
	,	GlobalViewsBackToTopView

	,	footer_simplified_tpl

	,	Backbone
	,	BackboneCompositeView
	)
{
	'use strict';

	// @class Footer.Simplified.View @extends Backbone.View
	return Backbone.View.extend({
		//@property {Function} template
		template: footer_simplified_tpl
		//@method initialize
	,	initialize: function (options)
		{
			this.application = options.application;

			BackboneCompositeView.add(this);

			this.application.getLayout().on('afterAppendToDom', function()
			{
				// after appended to DOM, we add the footer height as the content bottom padding, so the footer doesn't go on top of the content
				var footer_height = this.$el.find('#site-footer').height();
				if (footer_height)
				{
					this.$el.find('#content').css('padding-bottom', footer_height);
				}
			}); 
		}
		//@property {Object} childViews
	,	childViews: {
			'Global.BackToTop': function()
			{
				return new GlobalViewsBackToTopView();
			}
		}
	});
});
