define('Facets.Browse.View.Categories', [
    'Facets.Browse.View',
    'Facets.FacetedNavigation.View',
    'Facets.Browse.CategoryHeading.View',
    'Backbone.CompositeView',
    'Categories',
    'LiveOrder.Model',
    'Backbone',
    'underscore',
    'jQuery',
    'Facets.CategoryCell.View'

], function FacetsBrowseViewCategories(
    FacetsBrowse,
    FacetsFacetedNavigationView,
    FacetsBrowseCategoryHeadingView,
    BackboneCompositeView,
    Categories,
    LiveOrderModel,
    Backbone,
    _,
    jQuery
) {
    'use strict';

    var statuses = window.statuses = {};
    var collapsable_elements = window.collapsable_elements = {};

    FacetsBrowse.prototype.installPlugin('postContext', {
        name: 'categoriesContext',
        priority: 10,
        execute: function execute(context, view) {
            _.extend(context, {
                hasCategory: view.categoryModel && !view.categoryModel.isNew(),
                categoryName: view.categoryModel.get('pageTitle')
            });
        }
    });

    FacetsBrowse.prototype.childViews['Facets.Browse.CategoryHeading'] = function FacetsBrowsseCategoryHeading() {
        return new FacetsBrowseCategoryHeadingView({
            model: this.categoryModel
        });
    };

    FacetsBrowse.prototype.childViews['Facets.FacetedNavigation'] = function FacetsFacetedNavigation(options) {
        var exclude = _.map((options.excludeFacets || '').split(','), function map(facetIdToExclude) {
            return jQuery.trim( facetIdToExclude );
        });
        // Custom
        var hasCategories = !!(this.categoryModel.get('categories'));
        var hasItems = this.model.get('items').length;
        var hasFacets = hasItems && this.model.get('facets').length;
        var	appliedFacets = this.translator.cloneWithoutFacetId('category').facets;
        var	hasAppliedFacets = appliedFacets.length;

        return new FacetsFacetedNavigationView({
            // CUSTOM
            category: this.getCategory(),
            categoryPath: this.getCategoryPath(),

            categoryItemId: this.categoryModel && !this.categoryModel.isNew() && this.categoryModel.get('name'),
            clearAllFacetsLink: this.translator.cloneWithoutFacets().getUrl(),
            hasCategories: hasCategories,
            hasItems: hasItems,

            // facets box is removed if don't find items
            hasFacets: hasFacets,

            hasCategoriesAndFacets: hasCategories && hasFacets,

            // Categories are not a real facet, so lets remove those
            appliedFacets: appliedFacets,

            hasFacetsOrAppliedFacets: hasFacets || hasAppliedFacets,

            translatorUrl: this.translator.getUrl(),

            translatorConfig: this.options.translatorConfig,
            facets: _.filter(this.model.get('facets'), function filter(facet) {
                return !_.contains(exclude, facet.id);
            }),
            totalProducts: this.model.get('total'),
            keywords: this.translator.getOptionValue('keywords')
        });
    };


    _.extend(FacetsBrowse.prototype, {
        // @Overrides Facets.Browse.View.initialize
        initialize: function initialize(options) {
            BackboneCompositeView.add(this);

            this.statuses = statuses;
            this.collapsable_elements = collapsable_elements;
            this.translator = options.translator;
            this.application = options.application;

            // custom
            this.categoryModel = options.categoryModel;
            this.category = this.translator.getCategory();
            this.categoryPath = this.translator.getCategoryPath();

            this.cart = LiveOrderModel.getInstance();

            this.collapsable_elements['facet-header'] = this.collapsable_elements['facet-header'] || {
                selector: 'this.collapsable_elements["facet-header"]',
                collapsed: false
            };


        },

        getCategoryPath: function getCategoryPath() {
            return this.translator.getCategoryPath();
        },

        getCategory: function getCategory() {
            return this.category;
        },

        // @Overrides Facets.Browse.View.getBreadcrumbPages
        getBreadcrumbPages: function getBreadcrumbPages() {
            var breadcrumb = [];

            if (this.getCategory()) {
                _.each(this.getCategoryPath(), function each(cat) {
                    breadcrumb.push({
                        href: cat.url,
                        text: _(cat.name).translate()
                    });
                });
            } else if (this.translator.getOptionValue('keywords')) {
                breadcrumb.push({
                    href: '#',
                    text: _('Search Results').translate()
                });
            } else {
                breadcrumb.push({
                    href: '#',
                    text: _('Shop').translate()
                });
            }

            return breadcrumb;
        },

        formatFacetTitle: function formatFacetTitle(facet) {
            var defaults = {
                range: '$(2): $(0) to $(1)',
                multi: '$(1): $(0)',
                single: '$(1): $(0)'
            };
            var buffer = [];
            var value;

            // Page Title from category model CUSTOM
            if (facet.id === 'category' && this.categoryModel) {
                // we search for a category title starting from the last category of the branch
                return this.categoryModel.get('pageTitle');
            }

            if (!facet.config.titleToken) {
                facet.config.titleToken = defaults[facet.config.behavior] || defaults.single;
            }

            if (_.isFunction(facet.config.titleToken)) {
                return facet.config.titleToken(facet);
            } else if (facet.config.behavior === 'range') {
                return _(facet.config.titleToken).translate(facet.value.to, facet.value.from, facet.config.name);
            } else if (facet.config.behavior === 'multi') {
                _.each(facet.value, function each(val) {
                    buffer.push(val);
                });
                return _(facet.config.titleToken).translate(buffer.join(', '), facet.config.name);
            }
            // else { commented out for eslint
            value = this.translator.getLabelForValue(facet.config.id, facet.value);
            return _(facet.config.titleToken).translate(value, facet.config.name);
            // }
        },
        // @Custom Facets.Browse.View.formatFacetTitle
        getMetaKeywords: function getMetaKeywords() {
            // searchkeywords is for alternative search keywords that customers
            // might use to find this item using your Web store's internal search
            // they are not for the meta keywords
            // return this.model.get('_keywords');
            return this.getMetaTags().filter('[name="keywords"]').attr('content') || '';
        },

        // @method getMetaTags @return {Array<HTMLElement>}
        // @Custom Facets.Browse.View.formatFacetTitle
        getMetaTags: function getMetaTags() {
            return jQuery('<head/>').html(
                jQuery.trim(this.categoryModel && this.categoryModel.get('metataghtml') || '')
            ).children('meta');
        },

        // @method getMetaDescription @return {String}
        // @Custom Facets.Browse.View.formatFacetTitle
        getMetaDescription: function getMetaDescription() {
            return this.getMetaTags().filter('[name="description"]').attr('content') || '';
        }
    });
});