define('Facets.BrowseCategories.View', [
    'Categories',
    'Facets.CategoryFacet.Helper',
    'Backbone.CollectionView',
    'Facets.FacetedNavigationItemCategory.View',
    'Facets.CategoryCell.View',
    'facets_category_browse.tpl',
    'facets_category_cell_list_row.tpl',

    'Backbone',
    'Backbone.CompositeView',
    'underscore',
    'jQuery'
], function FacetsBrowseCategoriesView(
    Categories,
    FacetsCategoryFacetHelper,
    BackboneCollectionView,
    FacetsHierarchicalFacetedNavigationItem,
    FacetsCategoryCellView,
    facets_category_browse_tpl,
    facets_category_cell_list_row,
    Backbone,
    BackboneCompositeView,
    _,
    jQuery
) {
    'use strict';

    // @class Facets.BrowseCategories.View View that handles the item list
    // @extends Backbone.View
    return Backbone.View.extend({

        template: facets_category_browse_tpl,

        initialize: function initialize() {
            BackboneCompositeView.add(this);

            this.translator = this.options.translator;
            this.category = this.translator && this.translator.getCategory();
            this.categoryPath = this.translator && this.translator.getCategoryPath();

            this.hasThirdLevelCategories = _.every(this.category.categories, function every(subCategory) {
                return _.size(subCategory.categories) > 0;
            });

            this.facets = [];
            this.facets.push(FacetsCategoryFacetHelper.getFromPathForFacet(this.categoryPath));


        },

        // @method getBreadcrumbPages
        getBreadcrumbPages: function getBreadcrumbPages() {
            var breadcrumb = [];
            _.each(this.translator.getCategoryPath(), function each(cat) {
                breadcrumb.push({
                    href: cat.url,
                    text: _(cat.name).translate()
                });
            });
            return breadcrumb;
        },

        childViews: {
            'Facets.CategoryCellList': function FacetsCategoryCellList() {
                return new BackboneCollectionView({
                    childView: FacetsCategoryCellView,
                    collection: this.model.get('categories'),
                    viewsPerRow: 4,
                    rowTemplate: facets_category_cell_list_row
                });
            },
            'Facets.FacetedNavigation.Item.Category': function (options)
            {
                var facetConfig = this.translator.getFacetConfig(options.facetId);
                var constructorOptions = {
                        model: new Backbone.Model(this.facets[0].values),
                        translator: this.translator
                    };

                return new FacetsHierarchicalFacetedNavigationItem(constructorOptions);
            }
        },

        // @method getTitle @returns {String}
        getTitle: function getTitle() {
            var title = this.model.get('pageTitle') || this.model.get('name');

            // Update the meta tag 'twitter:title'
            this.setMetaTwitterTitle(title);

            return title;
        },

        getMetaKeywords: function getMetaKeywords() {
            // searchkeywords is for alternative search keywords
            // that customers might use to find this item using your Web store's internal search
            // they are not for the meta keywords
            // return this.model.get('_keywords');

            return this.getMetaTags().filter('[name="keywords"]').attr('content') || '';
        },

        // @method getMetaTags @return {Array<HTMLElement>}
        getMetaTags: function getMetaTags() {
            var model = this.categoryModel || new Backbone.Model();

            return jQuery('<head/>').html(
                jQuery.trim(
                    model.get('metataghtml')
                )
            ).children('meta');
        },

        // @method getMetaDescription @return {String}
        getMetaDescription: function getMetaDescription() {
            return this.getMetaTags().filter('[name="description"]').attr('content') || '';
        },
        // @method setMetaTwitterTitle @param {String} title
        setMetaTwitterTitle: function setMetaTwitterTitle(title) {
            var seoTwitterTitle = jQuery('meta[name="twitter:title"]');
            if (seoTwitterTitle) {
                seoTwitterTitle.attr('content', title);
            }
        },

        // @method getContext @returns {Facets.BrowseCategories.View.Context}
        getContext: function getContext() {
            // @class Facets.BrowseCategories.View.Context
            return {
                // @property {String} categoryItemid
                categoryItemId: this.model.get('name'),
                image: this.model.get('image'),
                description: this.model.get('description'),
                model: this.model
            };
        }
    });
});