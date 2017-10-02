define('BackInStockNotificationAdministrator', [

    'BackInStockNotification.Router',
    'BackInStockNotification.Views.List',
    'BackInStockNotification.Model',
    'BackInStockNotification.Collection',

    'underscore'
], function BackInStockNotificationAdministrator(
    Router,
    ListView,
    Model,
    Collection,
    _
) {
    'use strict';

    return {

        MenuItems: {
            parent: 'settings',
            id: 'backinstocknotification',
            name: _('Back In Stock Subscriptions').translate(),
            url: 'backinstocknotification',
            index: 6
        },

        Router: Router,

        Model: Model,

        Collection: Collection,

        ListView: ListView,

        mountToApp: function mountToApp(application) {
            var config = application.Configuration;

            config.BackInStockNotification = config.BackInStockNotification || {};
            _.extend(config.BackInStockNotification, SC.ENVIRONMENT.published.BackInStockNotificationConfig);
            _.defaults(config.BackInStockNotification, {
                // or 'template'
                injectOnViewMode: 'code',
                moduleOn: true
            });
            return new Router(application);
        }
    };
});
