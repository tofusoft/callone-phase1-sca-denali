define('Facets.FacetedNavigation.Categories', [
    'Categories',
    'Facets.FacetedNavigation.View',
    'Backbone.CompositeView',
    'Facets.CategoryFacet.Helper',
    'Facets.Helper',
    'Facets.FacetedNavigationItemCategory.View',
    'Backbone'
], function(
    Categories,
    FacetsFacetedNavigationView,
    BackboneCompositeView,
    CategoryFacetHelper,
    FacetsHelper,
    FacetesFacetedNavigationItemCategory,
    Backbone

) {
    'use strict';

    FacetsFacetedNavigationView.prototype.initialize = function initialize(options) {
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
        this.category = options.category;
        this.categoryPath = options.categoryPath;

        this.categoryFacet = CategoryFacetHelper.getFromPathForFacet(this.categoryPath);
    };

    FacetsFacetedNavigationView.prototype.childViews['Facets.FacetedCategories.Item'] =
        function FacetsFacetedNavigation() {
            var translator = FacetsHelper.parseUrl(this.options.translatorUrl, this.options.translatorConfig);
            var constructorOptions = {
                model: new Backbone.Model( this.categoryFacet.values),
                translator: translator
            };
            return new FacetesFacetedNavigationItemCategory(constructorOptions);
        };
});