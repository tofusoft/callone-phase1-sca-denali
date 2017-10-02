define('Site.Facets', [
    'SC.Configuration',
    'Session',
    'Backbone',
    'jQuery',
    'underscore'
], function (
    Configuration,
    Session,
    Backbone,
    jQuery,
    _
) {
    'use strict';

    var charMappingNS = {
        '-': '~',
        '&amp;': '-AND-',
        '&': '-AND-',
        ' ': '-',
        "'": '-', // standard
        '%': '-PCT-', // extended
        '/': '-SLASH-',
        '\\': '-BACK-',
        '#': '-HASH-',
        '<': '-LT-',
        '>': '-GT-'
    };

    function replaceAll(str, mapObj) {
        var re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
        return str.replace(re, function (matched) {
            return mapObj[matched.toLowerCase()];
        });
    }

    if(Configuration.masterFacets){
        if(!_.find(Configuration.masterFacets, function(masterFacet){
            return masterFacet.facetId === 'custitem_sc_available_at';
        })) {
            Configuration.masterFacets.push({
                facetId: 'custitem_sc_available_at',
                hideFromSearch: true,
                onlyHideFromSearch: false,
                facetValue: function facetValue() {
                    return replaceAll('CallOne Online', charMappingNS);
                }
            });
        }
    } else {
        _.extend(Configuration, {
            masterFacets: [
                {
                    facetId: 'custitem_sc_available_at',
                    hideFromSearch: true,
                    onlyHideFromSearch: false,
                    facetValue: function facetValue() {
                        return replaceAll('CallOne Online', charMappingNS);
                    }
                }
            ]
        });
    }

    _.extend(Session, {
        getSearchApiParams: _.wrap(Session.getSearchApiParams, function (fn) {
            var searchApiParams = fn.apply(this, _.toArray(arguments).slice(1));
            var masterFacets = Configuration.masterFacets;
            var facetValue;
            _.each(masterFacets, function (masterFacet) {
                var facetId = masterFacet.facetId;
                if (!masterFacet.onlyHideFromSearch) {
                    if (masterFacet.facetValue()) {
                        // Get URL Component
                        facetValue = encodeURI(encodeURI(masterFacet.facetValue()));

                        if (!searchApiParams.custitem_sc_available_at) {
                            if (facetValue) {
                                searchApiParams[facetId] = facetValue;
                            }
                        }
                    }
                }
                if (masterFacet.hideFromSearch || masterFacet.onlyHideFromSearch) {
                    // if()
                    _.extend(searchApiParams, {
                        'facet.exclude': searchApiParams['facet.exclude'] ?
                        searchApiParams['facet.exclude'] + ',' + facetId : facetId
                    });
                }
            });
            _.extend(searchApiParams, {
                'facet.exclude': searchApiParams['facet.exclude'] + ',custitem_sc_available_at'
            });
            return searchApiParams;
        })
    });
});
