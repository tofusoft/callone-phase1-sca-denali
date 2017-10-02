/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SiteSearch
define(
	'SiteSearch.Item.View'
,	[
		'SC.Configuration'
	,	'GlobalViews.StarRating.View'

	,	'site_search_item.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	]
,	function(
		Configuration
	,	GlobalViewsStarRatingView

	,	site_search_item_tpl

	,	Backbone
	,	BackboneCompositeView
	)
{
	'use strict';

	// @class SiteSearch.Item.View @extends Backbone.View
	return Backbone.View.extend({

		template: site_search_item_tpl

	,	initialize: function()
		{
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Global.StarRating': function()
			{
				return new GlobalViewsStarRatingView({
					model: this.model
				,	showRatingCount: false
				});
			}		
		}


		// @method getContext @returns {SiteSearch.Item.View.Context}
	,	getContext: function()
		{
			// @class SiteSearch.Item.View.Context
			return {
				// @property {SiteSearch.Model} model
				model: this.model
				// @property {String} query
			,	query: this.options.query
			};
		}
	});
});
