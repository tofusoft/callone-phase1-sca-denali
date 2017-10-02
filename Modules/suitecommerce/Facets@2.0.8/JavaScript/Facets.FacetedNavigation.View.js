/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.FacetedNavigation.View'
,	[
		'Facets.Helper'
	,	'Facets.FacetedNavigationItem.View'

	,	'facets_faceted_navigation.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	]
,	function(
		FacetsHelper
	,	FacetsFacetedNavigationItemView

	,	facets_faceted_navigation_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	)
{
	'use strict';

	// @class Facets.FacetedNavigation.View @extends Backbone.View
	return Backbone.View.extend({

		template: facets_faceted_navigation_tpl

	,	initialize: function (options)
		{
			BackboneCompositeView.add(this);

			this.categoryItemId = options.categoryItemId;
			this.clearAllFacetsLink = options.clearAllFacetsLink;
			this.hasCategories = options.hasCategories;
			this.hasItems = options.hasItems;
			this.hasFacets = options.hasFacets;
			this.hasCategoriesAndFacets = options.hasCategoriesAndFacets;
			this.appliedFacets = options.appliedFacets;
			this.hasFacetsOrAppliedFacets = options.hasFacetsOrAppliedFacets;

			this.keywords = options.keywords;
			this.totalProducts = options.totalProducts;
		}

	,	childViews:
		{
			'Facets.FacetedNavigationItems': function()
			{
				var translator = FacetsHelper.parseUrl(this.options.translatorUrl, this.options.translatorConfig)
				,	ordered_facets = this.options.facets && this.options.facets.sort(function (a, b) {
					// Default Prioriry is 0
					return (translator.getFacetConfig(b.id).priority || 0) - (translator.getFacetConfig(a.id).priority || 0);
				});

				return new BackboneCollectionView({
					childView: FacetsFacetedNavigationItemView
				,	viewsPerRow: 1
				,	collection: new Backbone.Collection(ordered_facets)
				,	childViewOptions: {
						translator: translator
					}
				});
			}
		}

		// @method getContext @returns {Facets.FacetedNavigation.View.Context}
	,	getContext: function ()
		{
			// @class Facets.FacetedNavigation.View.Context
			return {

				// @property {Number} total
				totalProducts: this.totalProducts

				// @property {Boolean} isTotalProductsOne
			,	isTotalProductsOne: this.totalProducts === 1

				// @property {String} keywords
			,	keywords: this.keywords

				// @property {String} categoryItemId
			,	categoryItemId: this.categoryItemId

				// @property {String} clearAllFacetsLink
			,	clearAllFacetsLink: this.clearAllFacetsLink

				// @property {Boolean} hasCategories
			,	hasCategories: this.hasCategories

				// @property {Boolean} hasItems
			,	hasItems: this.hasItems

				// @property {Boolean} hasFacets
			,	hasFacets: this.hasFacets

				// @property {Boolean} hasCategoriesAndFacets
			,	hasCategoriesAndFacets: this.hasCategoriesAndFacets

				// @property {Array} appliedFacets
			,	appliedFacets: this.appliedFacets

				// @property {Boolean} hasAppliedFacets
			,	hasAppliedFacets: this.appliedFacets && this.appliedFacets.length > 0

				// @property {Array} hasFacetsOrAppliedFacets
			,	hasFacetsOrAppliedFacets: this.hasFacetsOrAppliedFacets
			};
			// @class Facets.FacetedNavigation.View
		}
	});
});