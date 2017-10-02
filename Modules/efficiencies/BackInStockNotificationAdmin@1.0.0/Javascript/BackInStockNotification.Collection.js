define('BackInStockNotification.Collection', [

    'BackInStockNotification.Model',

    'Backbone',
    'underscore'

], function BackInStockNotificationCollection(
    Model,

    Backbone,
    _
) {
    'use strict';

    return Backbone.Collection.extend({
        model: Model,

        url: _.getAbsoluteUrl('services/BackInStockNotification.Service.ss'),

        update: function bisCollectionUpdate(options) {
            var filter = options.filter || {};

            this.fetch({
                data: {
                    filter: filter.value,
                    sort: options.sort.value,
                    order: options.order,
                    page: options.page
                },
                reset: true,
                killerId: options.killerId
            });
        },
        parse: function bisCollectionParse(response) {
            this.totalRecordsFound = response.totalRecordsFound;
            this.recordsPerPage = response.recordsPerPage;

            return response.records;
        }
    });
});
