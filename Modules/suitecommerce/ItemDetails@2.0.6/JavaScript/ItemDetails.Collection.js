/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemDetails 
define(
	'ItemDetails.Collection'
,	[
		'Backbone.CachedCollection'
	,	'ItemDetails.Model'
	,	'Session'

	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCachedCollection
	,	ItemDetailsModel
	,	Session
	
	,	_
	)
{
	'use strict';

	//@class ItemDetails.Collection @extends Backbone.BackboneCachedCollection
	return BackboneCachedCollection.extend({

		url: function()
		{
			var url = _.addParamsToUrl(
				'/api/items'
			,	_.extend(
					{}
				,	this.searchApiMasterOptions
				,	Session.getSearchApiParams()
				)
			);

			return url;
		}

	,	model: ItemDetailsModel

		// http://backbonejs.org/#Model-parse
	,	parse: function (response)
		{
			// NOTE: Compact is used to filter null values from response
			return _.compact(response.items) || null;
		}
	});
});
