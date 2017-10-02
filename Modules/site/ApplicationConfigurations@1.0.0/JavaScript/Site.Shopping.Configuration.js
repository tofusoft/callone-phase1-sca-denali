define('Site.Shopping.Configuration', [
    'SC.Shopping.Configuration',
    'Site.Global.Configuration',

    'facets_faceted_navigation_item_range.tpl',
    'facets_faceted_navigation_item_color.tpl',

    'underscore',
    'Utils'
], function SiteCheckoutConfiguration(ShoppingConfiguration,
                                      GlobalConfiguration,
                                      facetsFacetedNavigationItemRangeTemplate,
                                      facetsFacetedNavigationItemColorTemplate,
                                      _) {
    'use strict';

    ShoppingConfiguration.lightColors.push('White');

    var SiteApplicationConfiguration = {
        tracking: {
            // [Google Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
            googleUniversalAnalytics: {
                propertyID: 'UA-55341241-1'
                ,	domainName: ''
            }
            // [Google Analytics](https://developers.google.com/analytics/devguides/collection/gajs/)
            ,	google: {
                propertyID: ''
                ,	domainName: ''
            }
            // [Google AdWords](https://support.google.com/adwords/answer/1722054/)
            ,	googleAdWordsConversion: {
                id: 0
                ,	value: 0
                ,	label: ''
            }
        },
        itemDetails: [
            { name: 'Details', contentFromKey: 'storedetaileddescription', opened: true },
            { name: 'Specifications', contentFromKey: 'custitem_webstore_specifications' },
            { name: "What's in the Box", contentFromKey: 'custitem_webstore_witb' }
        ],
        facets: [{
            id: 'category',
            name: _('Category').translate(),
            priority: 10,
            behavior: 'hierarchical',
            uncollapsible: true,
            titleToken: '$(0)',
            titleSeparator: ', ',
            showHeading: false
        }, {
            id: 'onlinecustomerprice',
            name: _('Price').translate(),
            priority: 23,
            behavior: 'range',
            macro: 'facetRange',
            template: facetsFacetedNavigationItemRangeTemplate,
            uncollapsible: true,
            titleToken: 'Price $(1) - $(0)',
            titleSeparator: ', ',
            parser: function parser(value) {
                return _.formatCurrency(value);
            }
        }, {
            // this is for the case that onlinecustomerprice is not available in the account
            id: 'pricelevel5',
            name: _('Price').translate(),
            priority: 22,
            behavior: 'range',
            macro: 'facetRange',
            template: facetsFacetedNavigationItemRangeTemplate,
            uncollapsible: true,
            titleToken: 'Price $(1) - $(0)',
            titleSeparator: ', ',
            parser: function parser(value) {
                return _.formatCurrency(value);
            }
        },
            {
                // update the custom field id to match with the correct one
                id: 'custitem_color',
                priority: 10,
                name: _('Color').translate(),
                template: facetsFacetedNavigationItemColorTemplate,
                colors: GlobalConfiguration.colors,
                uncollapsible: true
            },
            {
                // update the custom field id to match with the correct one
                id: 'App_usage',
                priority: 10,
                name: _('Application Usage').translate()
            },
            {
                id: 'color',
                priority: 21,
                name: _('Color').translate(),
                max: 5
            },
            {
                id: 'condition',
                priority: 21,
                name: _('Condition').translate(),
                max: 5
            },
            {
                id: 'earpiece_design',
                priority: 21,
                name: _('Earpiece Design').translate(),
                max: 5
            },
            {
                id: 'earpiece_type',
                priority: 21,
                name: _('Earpiece Type').translate(),
                max: 5
            },
            {
                id: 'effective_resolution',
                priority: 21,
                name: _('Effective Resolution').translate(),
                max: 5
            },
            {
                id: 'features',
                priority: 21,
                name: _('Features').translate(),
                max: 5
            },
            {
                id: 'product_type',
                priority: 21,
                name: _('Product Type').translate(),
                max: 5
            },
            {
                id: 'brand',
                priority: 20,
                name: _('Brand').translate(),
                max: 5
            },
            {
                id: 'op_supported',
                priority: 20,
                name: _('Operating System').translate(),
                max: 5
            },
            {
                id: 'height',
                priority: 19,
                name: _('Height').translate(),
                max: 5
            },
            {
                id: 'product_family',
                priority: 19,
                name: _('Product Family').translate(),
                max: 5
            },
            {
                id: 'screen_size',
                priority: 19,
                name: _('Screen Size').translate(),
                max: 5
            },
            {
                id: 'store_capacity',
                priority: 18,
                name: _('Storage Capacity').translate(),
                max: 5
            },
            {
                id: 'width',
                priority: 17,
                name: _('Width').translate(),
                max: 5
            },
            {
                id: 'connectivity',
                priority: 16,
                name: _('Connectivity').translate(),
                max: 5
            },
            {
                id: 'length',
                priority: 15,
                name: _('Length').translate(),
                max: 5
            },
            {
                id: 'material',
                priority: 15,
                name: _('Material').translate(),
                max: 5
            },
            {
                id: 'max_resolution',
                priority: 15,
                name: _('Max Resolution').translate(),
                max: 5
            },
            {
                id: 'media_supported',
                priority: 15,
                name: _('Media Supported').translate(),
                max: 5
            },
            {
                id: 'processor_speed',
                priority: 15,
                name: _('Processor Speed').translate(),
                max: 5
            },
            {
                id: 'processor',
                priority: 15,
                name: _('Processor').translate(),
                max: 5
            },
            {
                id: 'memory',
                priority: 15,
                name: _('Memory').translate(),
                max: 5
            },
            {
                id: 'language_supported',
                priority: 15,
                name: _('Language Supported').translate(),
                max: 5
            },
            {
                id: 'curent_offers',
                priority: 15,
                name: _('Curent Offers').translate(),
                max: 5
            },
            {
                id: 'style',
                priority: 15,
                name: _('Style').translate(),
                max: 5
            },
            {
                id: 'upcoming',
                priority: 15,
                name: _('Upcoming').translate(),
                max: 5
            },
            {
                id: 'cable_type',
                priority: 15,
                name: _('Cable Type').translate(),
                max: 5
            },
            {
                id: 'form_factor',
                priority: 15,
                name: _('Form Factor').translate(),
                max: 5,
                url:'pruebaaaaaa'
            },
            {
                id: 'license_pricing',
                priority: 15,
                name: _('License Pricing').translate(),
                max: 5
            }
        ]
    };

    ShoppingConfiguration.facetsSeoLimits.numberOfFacetsGroups = 0;

    _.extend(ShoppingConfiguration, GlobalConfiguration, SiteApplicationConfiguration);


    return {
        mountToApp: function mountToApp(application) {
            _.extend(application.Configuration, ShoppingConfiguration);
        }
    };
});