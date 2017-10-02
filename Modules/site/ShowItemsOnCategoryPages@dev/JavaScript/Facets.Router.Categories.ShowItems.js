define('Facets.Router.Categories.ShowItems', [
    'Facets.CategoryFacet.Helper',
    'Facets.Model',
    'Facets.Router.Categories',
    'Facets.Helper',
    'Facets.BrowseCategories.View',
    'Facets.Browse.View',
    'Category.Model',
    'ItemDetails.Router',
    'AjaxRequestsKiller',
    'Backbone',
    'underscore',
    'jQuery'
], function FacetsRouterCategories(
    CategoryHelper,
    Model,
    Router,
    Helper,
    BrowseCategoriesView,
    BrowseView,
    CategoryModel,
    ItemDetailsRouter,
    AjaxRequestsKiller,
    Backbone,
    _,
    jQuery
) {
    'use strict';

    _.extend(Router.prototype, {
        facetLoading: function facetLoading() {
            // Creates a translator
            var translator = Helper.parseUrl(Backbone.history.fragment, this.translatorConfig);
            var url = Backbone.history.fragment;
            var category;
            var categoryModel;
            var categoryPromise;
            var model;
            var view;
            var self = this;


            // Addition for /categ/categ2/product url's
            if (translator.isProduct()) {
                return this.showProductPage(translator, url);
            }

            // Should we show the category Page?
            if (this.isHomeCategoryPage(translator)) {
             return this.showCategoryPage(translator);
             }

            // Fetch category service parallel to the API request for items
            category = translator.getCategory();
            categoryModel = new CategoryModel();
            categoryPromise = jQuery.Deferred();

            if (category) {
                categoryPromise = categoryModel.fetch({
                    data: {
                        internalid: category.internalid
                    }
                });
            } else {
                categoryPromise.resolve();
            }

            // Model
            model = new Model();
            // and View
            view = new BrowseView({
                translator: translator,
                translatorConfig: this.translatorConfig,
                application: this.application,
                model: model,
                categoryModel: categoryModel
            });

            jQuery.when(categoryPromise, model.fetch({
                data: translator.getApiParams(),
                killerId: AjaxRequestsKiller.getKillerId(),
                pageGeneratorPreload: true
            })).then(function when(categoriesResponse, facetsResponse) {
                var data = facetsResponse[0];

                if (data.corrections && data.corrections.length > 0) {
                    var unaliased_url = self.unaliasUrl(url, data.corrections);

                    if (SC.ENVIRONMENT.jsEnvironment === 'server') {
                        nsglobal.statusCode = 301;
                        nsglobal.location = '/' + unaliased_url;
                    } else {
                        Backbone.history.navigate('#' + unaliased_url, {trigger: true});
                    }
                } else {
                    translator.setLabelsFromFacets(model.get('facets') || []);
                    view.showContent();
                }
            });
        },

        isHomeCategoryPage: function(translator) {
            var current_facets = translator.getAllFacets();
            var categories = translator.getCategoryPath();

            return (current_facets.length === 1 &&
            current_facets[0].id === 'category' &&
            categories &&
            current_facets[0].value == 'Homepage/Products/' &&
            CategoryHelper.showCategoryPage(categories)
            );
        }
    });

    return Router;
});