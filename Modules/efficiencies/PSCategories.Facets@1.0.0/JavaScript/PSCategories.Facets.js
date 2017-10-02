define('PSCategories.Facets', [
    'underscore',
    'Facets.Translator.Categories',
    'Facets.Browse.View.Categories',
    'Facets.Router.Categories',
    'Facets.FacetedNavigation.Categories'
], function PSCategoriesFacets(
    _
) {
    'use strict';


    return {
        mountToApp: function mountToApp(application) {
            var configuration = application.getConfig();
            var categoryFacet = _.findWhere(configuration.facets, {id: 'category'});
            if (!categoryFacet) {
                configuration.facets.push({
                    id: 'category',
                    name: _('Category').translate(),
                    priority: 10,
                    behavior: 'hierarchical',
                    uncollapsible: true,
                    titleToken: '$(0)',
                    titleSeparator: ', ',
                    showHeading: false
                });
                // This is opinionated
                // configuration.facetsSeoLimits.numberOfFacetsGroups = 0;
            }
        }
    };
});
