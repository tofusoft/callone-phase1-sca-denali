define('BackInStockNotification.Views.List.Details', [

    'backinstocknotification_list_details.tpl',

    'underscore',
    'Backbone'
], function BackInStockNotificationViewsListDetails(
    backInStockNotificationListDetailsTemplate,
    _,
    Backbone
) {
    'use strict';

    return Backbone.View.extend({

        template: backInStockNotificationListDetailsTemplate,

        getContext: function getContext() {
            var line = this.options.model;
            var item = line.get('item');

            return {
                created: line.get('created'),
                itemName: item.get('_name'),
                itemPrice: _.formatCurrency(item.get('_price')),
                firstName: line.get('firstname'),
                lastName: line.get('lastname'),
                email: line.get('email'),
                internalId: line.get('internalid')
            };
        }
    });
});
