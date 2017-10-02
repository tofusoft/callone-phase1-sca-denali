define('ItemDetails.Router.Categories', [
    'ItemDetails.Router',
    'AjaxRequestsKiller',
    'underscore',
    'Backbone'
], function(
    Router,
    AjaxRequestsKiller,
    _,
    Backbone
) {
    'use strict';


    function extendRouter(router) {
        _.extend(router.prototype, {
            productDetailsByCategory: function productDetailsByCategory(pUrl, categoryPath) {
                var category = categoryPath[categoryPath.length - 1];
                var categoryUrl = category && category.url;
                var options = null;
                var url = pUrl.replace(categoryUrl, '');

                if (url[0] === '/') {
                    url = url.substr(1);
                }

                if (!url) {
                    return;
                }

                // if there are any options in the URL
                if (~url.indexOf('?')) {
                    options = SC.Utils.parseUrlOptions(url);
                    url = url.split('?')[0];
                }

                // Now go grab the data and show it
                if (options) {
                    this.productDetails({url: url}, pUrl, options, categoryPath);
                } else {
                    this.productDetails({url: url}, pUrl, null, categoryPath);
                }
            },
            productDetails: function productDetails(apiQuery, baseUrl, options, categoryPath) {
                var application = this.application;
                var model = new this.Model();
                // we create a new instance of the ProductDetailed View
                var	view = new this.View({
                    model: model,
                    baseUrl: baseUrl,
                    application: this.application,
                    categoryPath: categoryPath
                });

                // Decodes URL options
                _.each(options, function each(value, name) {
                    options[name] = decodeURIComponent(value);
                });

                model.application = this.application;
                model.fetch({
                    data: apiQuery,
                    killerId: AjaxRequestsKiller.getKillerId(),
                    pageGeneratorPreload: true
                }).then(
                    // Success function
                    function success(data, result, jqXhr) {
                        if (!model.isNew()) {
                            // once the item is fully loaded we set its options
                            model.parseQueryStringOptions(options);

                            if (!(options && options.quantity)) {
                                model.set('quantity', model.get('_minimumQuantity'));
                            }

                            if (apiQuery.id && model.get('urlcomponent') && SC.ENVIRONMENT.jsEnvironment === 'server') {
                                nsglobal.statusCode = 301;
                                nsglobal.location = model.get('_url') + model.getQueryString();
                            }

                            if (data.corrections && data.corrections.length > 0) {
                                if (model.get('urlcomponent') && SC.ENVIRONMENT.jsEnvironment === 'server') {
                                    nsglobal.statusCode = 301;
                                    nsglobal.location = '/' + data.corrections[0].url + model.getQueryString();
                                } else {
                                    Backbone.history.navigate(
                                        '#' + data.corrections[0].url + model.getQueryString(),
                                        {trigger: true}
                                    );
                                }
                            }

                            // we first prepare the view
                            view.prepareViewToBeShown();

                            // then we show the content
                            view.showContent(options);
                        } else if (jqXhr.status >= 500) {
                            application.getLayout().internalError();
                        } else {
                            // We just show the 404 page
                            application.getLayout().notFound();
                        }
                    },
                    // Error function
                    function error(jqXhr) {
                        // this will stop the ErrorManagment module to process this error
                        // as we are taking care of it
                        try {
                            jqXhr.preventDefault = true;
                        } catch (e) {
                            // preventDefault could be read-only!
                            // console.log(e.message);
                        }

                        if (jqXhr.status >= 500) {
                            application.getLayout().internalError();
                        } else {
                            // We just show the 404 page
                            application.getLayout().notFound();
                        }
                    }
                );
            }
        });
    }

    return {
        mountToApp: function mountToApp(application) {
            var moduleConfiguration = application.getConfig('modulesConfig.Categories');
            if (moduleConfiguration.categoryOnProductURL) {
                console.warn('Category on product url experimental feature ON');
                extendRouter(Router);
            }
        }
    };
});