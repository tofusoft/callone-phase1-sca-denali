define('BackInStockNotification', [

    'BackInStockNotification.Model',
    'BackInStockNotification.Views.Subscribe',
    'BackInStockNotification.PlugToViewHelper',

    'underscore',
    'jQuery'

], function BackInStockNotification(

    Model,
    SubscribeView,
    Helper,

    _,
    $
) {
    'use strict';

    return {

        applyBackInStockControl: function applyBackInStockControl(
            view,
            $containers,
            model,
            application,
            configuration
        ) {
            // function that applies the component only if it accomplish conditions
            // needed of Item Type, and child selected if matrix
            var childs = model.getSelectedMatrixChilds();
            var type = model.get('itemtype');
            var stockInfo;
            var itemModel;

            if (_.contains(configuration.stockeableItemTypes, type) && model.getSelectedMatrixChilds().length <= 1) {
                itemModel = childs.length === 1 ? childs[0] : model;
                stockInfo = itemModel.getStockInfo();
                // TODO: validate quantityavailable. Document Fields Needed showOutOfStockMessage,
                // isInStock y itemtype. QTYAV?
                if (stockInfo.showOutOfStockMessage && !stockInfo.isInStock) {
                    $containers.each(function containersEach() {
                        var $this = $(this);
                        var form = new SubscribeView({
                            application: application,
                            itemModel: itemModel,
                            configuration: configuration
                        });
                        $this.append(form.$el);
                        form.render();

                        // This is for cleanup on the following view. This sucks on reference implmeentation
                        view.application.getLayout().once('beforeAppendView', function beforeAppendViewCallback() {
                            form.destroy();
                        });
                    });
                }
            }
        },

        afterAppendViewListener: function afterAppendViewListener(application, configuration, view) {
            // If it's an item model, apply the control
            if (view && view.model && view.model.getPosibleOptions) {
                this.applyBackInStockControl(
                    view,
                    view.$('[data-type="backinstocknotification-control-placeholder"]:empty'),
                    view.model,
                    application,
                    configuration
                );
            }
        },

        mountToApp: function mountToApp(application) {
            var config = application.Configuration;
            var bisConfig;

            config.BackInStockNotification = config.BackInStockNotification || {};
            _.extend(config.BackInStockNotification, SC.ENVIRONMENT.published.BackInStockNotificationConfig);
            _.defaults(config.BackInStockNotification, {
                // or 'template'
                injectOnViewMode: 'code',
                moduleOn: true
            });
            bisConfig = config.BackInStockNotification;

            if (bisConfig.moduleOn) {
                if (bisConfig.injectOnViewMode === 'code') {
                    Helper.mountToApp(application, bisConfig);
                }

                application.getLayout().on('afterAppendView', _.bind(
                    _.partial(this.afterAppendViewListener, application, bisConfig),
                    this
                ));
            }
        }
    };
});
