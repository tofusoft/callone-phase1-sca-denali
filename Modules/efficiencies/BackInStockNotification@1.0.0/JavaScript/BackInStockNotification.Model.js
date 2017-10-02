define('BackInStockNotification.Model', [

    'ItemDetails.Model',

    'Backbone',
    'underscore'

], function BackInStockNotificationModel(ItemModel, Backbone, _) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl('services/BackInStockNotification.Service.ss'),
        validation: {
            email: {
                required: true,
                msg: _('Email is required').translate(),
                pattern: 'email'
            },
            firstname: {
                required: true,
                msg: _('First Name is required').translate()
            },
            lastname: {
                required: true,
                msg: _('Last Name is required').translate()
            }
        },
        parse: function bisModelParse(response) {
            response.item = new ItemModel(response.item, {
                parse: true
            });
            return response;
        },
        destroy: _.wrap(Backbone.Model.prototype.destroy, function wrapDestroyFn(fn) {
            // Workaround for an issue with backbone url's + collections "modelOptions"
            this.url = Backbone.Model.prototype.url;
            return fn.apply(this, _.toArray(arguments).slice(1));
        })
    });
});
