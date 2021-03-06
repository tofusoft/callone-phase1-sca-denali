/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Merchandising
define('Merchandising.ItemCollection'
,	[	'ItemDetails.Collection'
	,	'Session'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ItemDetailsCollection
	,	Session
	,	_
	)
{
	'use strict';

	// @class Merchandising.ItemCollection Item collection used for the merchandising zone
	// we declare a new version of the ItemDetailsCollection
	// to make sure the urlRoot doesn't get overridden
	// @extends ItemDetails.Collection
	return ItemDetailsCollection.extend({

		url: function ()
		{
			return _.addParamsToUrl(
				'/api/items'
			,	_.extend(
					{}
				,	this.searchApiMasterOptions
				,	Session.getSearchApiParams()
				)
			);
		}
	});
});



