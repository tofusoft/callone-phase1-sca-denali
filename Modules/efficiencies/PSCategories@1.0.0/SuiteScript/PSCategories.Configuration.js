define('PSCategories.Configuration', [
    'Configuration'
], function PSCategoriesConfiguration(
    GlobalConfiguration
) {
    'use strict';

    GlobalConfiguration.publish.push({
        key: 'PSCategories',
        model: 'PSCategories.Model',
        call: 'getForBootstraping'
    });

    GlobalConfiguration.publish.push({
        key: 'PSCategories_config',
        model: 'PSCategories.Model',
        call: 'getConfig'
    });

    return {
        chunkSize: 60000,
        secureCategories: true,
        secureTTL: 2 * 60 * 60,
        unsecureTTL: 2 * 60 * 60,
        siteBuilderCategoryPaths: false
    };
});
