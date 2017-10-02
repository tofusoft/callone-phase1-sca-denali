define('BackInStockNotification.Views.Subscribe', [

    'back_in_stock_notification_subscribe.tpl',

    'BackInStockNotification.Model',

    'Backbone',
    'Backbone.FormView',
    'jQuery',
    'underscore'
],
function BackInStockNotificationViewsSubscribe(

    backInStockNotificationSubscribeTemplate,

    Model,

    Backbone,
    BackboneFormView,
    $,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: backInStockNotificationSubscribeTemplate,

        events: {
            'click [data-action="show-bis-control"]': 'toggleBisControl',
            'submit form': 'saveTheForm'
        },

        bindings: {
            '[name="firstname"]': 'firstname',
            '[name="lastname"]': 'lastname',
            '[name="email"]': 'email'
        },

        initialize: function initialize(options) {
            this.itemModel = options.itemModel;
            this.application = options.application;
            $(document).on('click', this.outsideClickEvent);
            this.setNewModel();

            BackboneFormView.add(this);
        },

        setNewModel: function setNewModel() {
            this.model = new Model();
            this.model.set('item', this.itemModel);
        },

        outsideClickEvent: function outsideClickEvent(event) {
            var $target = $(event.target);
            var $dropDownMenu = $('div[data-type="bis-control"]');
            var clickOnDropDownMenu = $target
                .closest('section[data-type="backinstocknotification-control-placeholder"]').length ||
                $target.is($dropDownMenu);

            if (!clickOnDropDownMenu) {
                if ($dropDownMenu.is(':visible')) {
                    $dropDownMenu.slideUp();
                }
            }
        },

        toggleBisControl: function toggleBisControl() {
            // Check if the user is logged in
            var $control = this.$('[data-type="bis-control"]');
            if ($control.is(':visible')) {
                $control.slideUp();
            } else {
                $control.slideDown();
            }
        },

        render: function render() {
            // if the control is currently visible then we remember that !
            this.isVisible = this.$('[data-type="bis-control"]').is(':visible');
            Backbone.View.prototype.render.apply(this);
        },

        // shouldRender: function shouldRender() {
        // },

        destroy: function destroy() {
            $(document).off('click', this.outsideClickEvent);
            Backbone.View.prototype.destroy.apply(this);
        },

        // I called saveTheForm this method because the add method of the Backbone.FormView class overwrites
        // the saveForm method of the view (see the initialize method above)
        saveTheForm: function saveTheForm(e) {
            var self = this;
            var promise = BackboneFormView.saveForm.apply(this, arguments);

            e.preventDefault();
            this.$('[data-confirm-bin-message]').empty();

            return promise && promise.then(function promiseSuccessCallback() {
                self.setNewModel();
                self.render();
                self.showMessage(_('Success!!').translate(), 'success');
                self.$('[data-type="bis-control"]').delay(1000).slideUp();
                self.$('form').get(0).reset();
            }, function promiseErrorCallback(jqXhr) {
                jqXhr.preventDefault = true;
                self.showMessage(jqXhr.responseJSON.errorMessage, 'error');
            });
        },

        showMessage: function showMessage(message, type) {
            var $confirmationMessage = this.$('[data-confirm-bin-message]')
                [type === 'success' ? 'removeClass' : 'addClass']('back-in-stock-notification-message-error')
                [type === 'success' ? 'addClass' : 'removeClass']('back-in-stock-notification-message-success');

            // this.confirm_message = message;
            $confirmationMessage.text(message).show();

            this.hideConfirmationMessage($confirmationMessage);
        },

        hideConfirmationMessage: function hideConfirmationMessage($confirmationMessage) {
            setTimeout(function fadeOutConfirmationMessage() {
                $confirmationMessage.fadeOut(1000);
            }, 3000);
        },

        getSelectedProduct: function getSelectedProduct() {
            var selectedOptions;
            if (this.itemModel.getPosibleOptions().length) {
                selectedOptions = this.itemModel.getSelectedMatrixChilds();

                if (selectedOptions.length === 1) {
                    return selectedOptions[0].get('internalid').toString();
                }
            }

            return this.itemModel.get('_id').toString();
        },

        getContext: function getContext() {
            return {
                selectedProduct: this.getSelectedProduct(),
                isVisible: this.isVisible ? 'style="display: block"' : ''
            };
        }
    });
});
