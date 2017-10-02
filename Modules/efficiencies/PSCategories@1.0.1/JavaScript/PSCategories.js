define('PSCategories', [
    'Categories',
    'SC.Configuration',
    'underscore',
    // Extensions over Reference sources
    'ItemKeyMapping.ItemURL',
    'ItemDetails.Router.Categories',
    'ItemDetails.View.Categories'

], function PSCategories(
    Categories,
    Configuration,
    _,

    ItemKeyMapping,
    ItemDetailsRouter
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var defaults = {
                addToNavigationTabs: false,
                classLevels: [
                    // 'header-menu-level1-anchor', as we are appending as child, we won't use level1
                    'header-menu-level2-anchor',
                    'header-menu-level3-anchor'
                ],
                method: 'child',
                parentIndex: 2,
                categoryOnProductURL: false,
                levelsOnMenu: 2
            };

            _.extend(defaults, SC.ENVIRONMENT.published.PSCategories_config);

            Categories.reset(
                (SC.ENVIRONMENT.published &&
                SC.ENVIRONMENT.published.PSCategories &&
                SC.ENVIRONMENT.published.PSCategories.categories) || {}
            );

            Categories.resetRoot(SC.ENVIRONMENT.published.PSCategories);

            application.on('afterModulesLoaded', function afterModulesLoaded() {
                var configuration = application.getConfig('modulesConfig').Categories ||
                    ( application.getConfig('modulesConfig').Categories = {} );

                _.defaults(configuration, defaults);

                ItemKeyMapping.mountToApp(application);
                Categories.mountToApp(application);
                ItemDetailsRouter.mountToApp(application);
            });
        }
    };
});
