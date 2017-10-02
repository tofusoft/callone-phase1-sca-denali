/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define('Facets.Collection', 
	[
		'Backbone.CachedCollection'
	,	'Facets.Model'
	]
,	function (
		BackboneCachedCollection
	,	FacetsModel
	)
{
	'use strict';
	// @class Facets.Collection @extends {Backbone.CachedCollection}
	return  BackboneCachedCollection.extend({
		
		url: '/api/items'
	
	,	model: FacetsModel
		
	,	parse: function (response)
		{
			return [response];
		}
		
	});
});
