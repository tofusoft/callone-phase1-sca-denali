define('BackInStockNotification.Location', [
    'SC.Model',
    'SearchHelper',
    'underscore'
],
function BackInStockNotificationLocation(
    SCModel,
    SearchHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'BackInStockNotification.Location',
        record: 'location',

        fieldsets: {
            basic: [
                'internalid',
                'name',
                'makeinventoryavailablestore'
            ]
        },

        filters: [{
            fieldName: 'isinactive',
            operator: 'is',
            value1: 'F'
        }],

        columns: {
            internalid: {
                fieldName: 'internalid'
            },
            makeinventoryavailablestore: {
                fieldName: 'makeinventoryavailablestore'
            },
            name: {
                fieldName: 'name'
            }
        },

        getWebstoreAvailableLocations: function getWebstoreAvailableLocations() {
            // get all the locations that expose stock to the webstore
            var filters = _.clone(this.filters);
            var Search;

            filters.push({
                fieldName: 'makeinventoryavailablestore',
                operator: 'is',
                value1: 'T'
            });

            Search = new SearchHelper(
                this.record,
                filters,
                this.columns
            ).search();

            return Search.getResults();
        }
    });
});
