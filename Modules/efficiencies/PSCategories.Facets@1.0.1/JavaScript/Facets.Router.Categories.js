define('Facets.Router.Categories', [
    'Facets.CategoryFacet.Helper',
    'Facets.Model',
    'Facets.Router',
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
            if (this.isCategoryPage(translator)) {
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
                var unaliasedUrl;
                var data = facetsResponse[0];

                if (data.corrections && data.corrections.length > 0) {
                    unaliasedUrl = self.unaliasUrl(url, data.corrections);

                    if (SC.ENVIRONMENT.jsEnvironment === 'server') {
                        nsglobal.statusCode = 301;
                        nsglobal.location = '/' + unaliasedUrl;
                    } else {
                        Backbone.history.navigate('#' + unaliasedUrl, {trigger: true});
                    }
                } else {
                    translator.setLabelsFromFacets(model.get('facets') || []);
                    view.showContent();
                }
            });
        },
        // @Overrides Facets.Views.isCategoryPage
        isCategoryPage: function isCategoryPage(translator) {
            var currentFacets = translator.getAllFacets();
            var categories = translator.getCategoryPath();

            return (currentFacets.length === 1 &&
                currentFacets[0].id === 'category' &&
                categories &&
                CategoryHelper.showCategoryPage(categories)
            );
        },

        // @Overrides Facets.Router.showCategoryPage
        showCategoryPage: function showCategoryPage(translator) {
            var model = new CategoryModel();
            var view = new BrowseCategoriesView({
                translator: translator,
                translatorConfig: this.translatorConfig,
                application: this.application,
                model: model
            });
            var category = translator.getCategory();

            model.fetch({
                data: {
                    internalid: category.internalid
                }
            }).done(function done() {
                view.showContent();
            });
        },

        // @Custom Facets.Router.showProductPage
        showProductPage: function showProductPage(translator, url) {
            // modulesMountToAppResult[3] gives the itemDetails Router :(
            console.log('aaaaa',this.application.modules);
            console.log('aaaaa',this.application.modulesMountToAppResult);
            this.application.modulesMountToAppResult[4].productDetailsByCategory(url, translator.getCategoryPath());
        }
    });

    return Router;
});