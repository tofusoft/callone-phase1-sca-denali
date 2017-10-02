define('Site.Global.Configuration', [
    'SC.Configuration',

    'item_views_option_color.tpl',
    'item_views_selected_option_color.tpl',
    'item_views_option.tpl',

    'underscore'
], function SiteGlobalConfiguration(Configuration,
                                    itemViewsOptionColorTemplate,
                                    itemViewsSelectedOptionColorTemplate,
                                    hide_item_option) {
    'use strict';

    var colors = {
        'black': '#212121',
        'Black': '#212121',
        'gray': '#9c9c9c',
        'Gray': '#9c9c9c',
        'grey': '#9c9c9c',
        'Grey': '#9c9c9c',
        'white': '#ffffff',
        'White': '#ffffff',
        'brown': '#804d3b',
        'Brown': '#804d3b',
        'beige': '#eedcbe',
        'Beige': '#eedcbe',
        'blue': '#0f5da3',
        'Blue': '#0f5da3',
        'light-blue': '#8fdeec',
        'Light-blue': '#8fdeec',
        'purple': '#9b4a97 ',
        'Purple': '#9b4a97 ',
        'lilac': '#ceadd0',
        'Lilac': '#ceadd0',
        'red': '#f63440',
        'Red': '#f63440',
        'pink': '#ffa5c1',
        'Pink': '#ffa5c1',
        'orange': '#ff5200',
        'Orange': '#ff5200',
        'peach': '#ffcc8c',
        'Peach': '#ffcc8c',
        'yellow': '#ffde00',
        'Yellow': '#ffde00',
        'light-yellow': '#ffee7a',
        'Light-yellow': '#ffee7a',
        'green': '#00af43',
        'Green': '#00af43',
        'lime': '#c3d600',
        'Lime': '#c3d600',
        'teal': '#00ab95',
        'Teal': '#00ab95',
        'aqua': '#28e1c5',
        'Aqua': '#28e1c5',
        'burgandy': '#9c0633',
        'Burgandy': '#9c0633',
        'navy': '#002d5d',
        'Navy': '#002d5d',
        'cyan': '#66FFFF',
        'Cyan': '#66FFFF',
        'multi': '#111111',
        'Multi': '#111111'
    };

    Configuration.modulesConfig = Configuration.modulesConfig || {};
    Configuration.modulesConfig.Categories = {};

    /* Add your global config here. It will be merged in the specific app config, not here */
    _.extend(Configuration, {
        logoUrl: _.getAbsoluteUrl('img/logo.png')
    });
    return {
        colors: colors,
        itemOptions: [
            {
                // update the name of the custcol here in order to get this working correctly
                cartOptionId: 'custcol1',
                label: 'Color',
                url: 'color',
                colors: colors,
                showSelectorInList: true,
                templates: {
                    selector: itemViewsOptionColorTemplate,
                    // 'shoppingCartOptionColor'
                    selected: itemViewsSelectedOptionColorTemplate
                }
            },
            {
                cartOptionId: 'custcol_ava_udf1',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_ava_item',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_ava_taxcodemapping',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_ava_udf2',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_ava_incomeaccount',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_ava_upccode',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_ava_pickup',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            },
            {
                cartOptionId: 'custcol_cps_ariba_line_number',
                templates: {
                    selector: hide_item_option,
                    selected: hide_item_option
                }
            }
        ],

        navigationData: [
            {
                text: _('Products').translate(),
                href: '/#',
                'class': 'header-menu-level1-anchor',
                detailed: true,
                categories: [
                    {
                        text: _('Headsets').translate(),
                        href: '/#',
                        'class': 'ps-headsets',
                        'id': 'ps-headsets',
                        categories: [""]
                    },
                    {
                        text: _('Communication Devices').translate(),
                        href: '/#',
                        'class': 'ps-communications',
                        'id': 'ps-communications',
                        categories: [""]
                    },
                    {
                        text: _('Computers').translate(),
                        href: '/#',
                        'class': 'ps-computers',
                        'id': 'ps-computers',
                        categories: [""]
                    },
                    {
                        text: _('Electronics').translate(),
                        href: '/#',
                        'class': 'ps-electronics',
                        'id': 'ps-electronics',
                        categories: [""]
                    },
                    {
                        text: _('Video Gaming').translate(),
                        href: '/#',
                        'class': 'ps-video',
                        'id': 'ps-video',
                        categories: [""]
                    },
                    {
                        text: _('Printing and Scanning').translate(),
                        href: '/#',
                        'class': 'ps-printing',
                        'id': 'ps-printing',
                        categories: [""]
                    }
                ]
            },
            {
                text: _('Brands').translate(),
                href: '/search',
                'class': 'header-menu-level1-anchor',
                detailed: false,
                categories: [
                    {
                        text: _('test 1').translate(),
                        href: '/#',
                        'class': 'ps-test-brands-1'
                    },
                    {
                        text: _('test 2').translate(),
                        href: '/#',
                        'class': 'ps-test-brands-2'
                    },
                    {
                        text: _('test 3').translate(),
                        href: '/#',
                        'class': 'ps-test-brands-3'
                    },
                    {
                        text: _('test 4').translate(),
                        href: '/#',
                        'class': 'ps-test-brands-4'
                    }
                ]
            },
            {
                text: _('Deals').translate(),
                href: '/#',
                'class': 'header-menu-level1-anchor',
                detailed: false,
                categories: [
                    {
                        text: _('test 1').translate(),
                        href: '/#',
                        'class': 'ps-test-deals-1'
                    },
                    {
                        text: _('test 2').translate(),
                        href: '/#',
                        'class': 'ps-test-deals-2'
                    },
                    {
                        text: _('test 3').translate(),
                        href: '/#',
                        'class': 'ps-test-deals-3'
                    },
                    {
                        text: _('test 4').translate(),
                        href: '/#',
                        'class': 'ps-test-deals-4'
                    }
                ]
            }
        ]
    };
});