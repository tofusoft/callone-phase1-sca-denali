define('BackInStockNotification.Router', [
    'BackInStockNotification.Collection',
    'BackInStockNotification.Model',
    'BackInStockNotification.Views.List',

    'Backbone'
], function BackInStockNotificationRouter(
    Collection,
    Model,
    ListView,

    Backbone
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'backinstocknotification': 'list',
            'backinstocknotification?:options': 'list',
            'backinstocknotification/:id': 'details'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        list: function list(options) {
            var listOptions = (options) ? SC.Utils.parseUrlOptions(options) : {page: 1};
            var collection = new Collection();
            var view;
            var self = this;

            listOptions.page = listOptions.page || 1;

            collection.fetch({
                data: listOptions
            }).done(function collectionFetch() {
                view = new ListView({
                    application: self.application,
                    page: listOptions.page,
                    collection: collection
                });
                view.showContent();
                collection.on('sync', view.showContent, view);
            });
        }
    });
});
