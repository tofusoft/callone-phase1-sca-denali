define('BackInStockNotification.PlugToViewHelper', [], function BackInStockNotificationPlugToViewHelper() {
    'use strict';

    // This is a helper to plug the BIS button without edditing the template. It's not needed, if you want to put
    // the control in other place by editing the template, you can do it.
    // Or you can code the inject on view function of your preference.
    // The example appends it AFTER the product list control
    return {

        injectOnView: function injectOnView(view, configuration) {
            if (configuration.injectOnViewFunction) {
                configuration.injectOnViewFunction(view);
            } else {
                view.$('.item-details-actions')
                    .after('<section class="back-in-stock-notification-placeholder" data-type="backinstocknotification-control-placeholder" />');
            }
        },
        mountToApp: function mountToApp(application, configuration) {
            var self = this;
            application.getLayout().on('afterAppendView', function afterAppendView(view) {
                if (view && view.model && view.model.getPosibleOptions) {
                    if (configuration.injectOnViewMode === 'code') {
                        self.injectOnView(view, configuration);
                    }
                }
            });
        }
    };
});
