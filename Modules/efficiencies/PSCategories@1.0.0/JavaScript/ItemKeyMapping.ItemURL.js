define('ItemKeyMapping.ItemURL', [
    'underscore',
    'Utils',
    'UrlHelper',
    'SC.Configuration'
], function ItemKeyMappingItemURL(
    _,
    Utils,
    UrlHelper,
    Configuration
) {
    'use strict';
    // Checked
    function getKeyMappers(application, moduleConfiguration) {
        return {
            _defaultUrl: function _defaultUrl(item) {
                var matrixParent = item.get('_matrixParent');
                if (matrixParent && matrixParent.get('internalid')) {
                    return item.get('_matrixParent').get('_defaultUrl');
                }
                return item.get('urlcomponent') ?
                    '/' + item.get('urlcomponent') :
                    '/product/' + item.get('internalid');
            },


            _url: function _url(item) {
                var matrixParent = item.get('_matrixParent');
                var params = '';
                var childItem;
                var isCategorizable = application.getLayout() &&
                        application.getLayout().currentView &&
                        application.getLayout().currentView.getCategory;
                var category;
                var categoryUrl;

                // If this item is a child of a matrix return the URL of the parent
                if (matrixParent && matrixParent.get('internalid')) {
                    childItem = matrixParent.get('_matrixChilds').get(item.id);
                    if (childItem) {
                        _.each(matrixParent.getPosibleOptions(), function each(option) {
                            params += (params.length ? '&' : '?') +
                                option.url + '=' + childItem.get(option.itemOptionId);
                        });
                    }

                    return item.get('_matrixParent').get('_url') + params;
                } else if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD') {
                    // if its a standard version we need to send it to the canonical URL
                    return item.get('canonicalurl');
                }

                // Other ways it will use the URL component or a default /product/ID
                // If we are on a category page, it means this items are
                // childs of the category so let's append that to the url.
                if (moduleConfiguration.categoryOnProductURL) {
                    category = item.category || (isCategorizable && application.getLayout().currentView.getCategory());
                    categoryUrl = category && category.url || '';

                    return categoryUrl + (item.get('urlcomponent') ? '/' +
                        item.get('urlcomponent') : '/product/' + item.get('internalid'));
                }

                return item.get('urlcomponent') ?
                    '/' + item.get('urlcomponent') :
                    '/product/' + item.get('internalid');
            }
        };
    }

    return {
        mountToApp: function mountToApp(application) {
            var moduleConfiguration = application.getConfig('modulesConfig.Categories');

            if (moduleConfiguration.categoryOnProductURL) {
                console.warn('Category on product url experimental feature ON');
                Configuration.itemKeyMapping = Configuration.itemKeyMapping || {};
                _.extend(Configuration.itemKeyMapping, getKeyMappers(application, moduleConfiguration));
            }
        }
    };
});