define('Newsletter.SignUp.View', [
    'newsletter_signup.tpl',
    'Newsletter.SignUp.Model',
    'Backbone',
    'Backbone.FormView',
    'underscore'
], function NewsletterSignUpView(
    newsletterSignUpTemplate,
    Model,
    Backbone,
    BackboneFormView,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: newsletterSignUpTemplate,

        events: {
            'submit form': 'saveTheForm'
        },

        initialize: function initialize() {
            this.model = new Model();
            BackboneFormView.add(this);
        },

        saveTheForm: function saveTheForm(e) {
            var self = this;
            var promise = BackboneFormView.saveForm.apply(this, arguments);

            e.preventDefault();

            return promise && promise.then(function promiseSuccessCallback(data) {
                if (data.successMessage) {
                    self.showMessage(data.successMessage, 'success');
                    self.$('form').get(0).reset();
                } else {
                    self.showMessage('Error occurred, please try again.', 'error');
                }
            }, function promiseErrorCallback(jqXhr) {
                jqXhr.preventDefault = true;
                self.showMessage(jqXhr.responseJSON.errorMessage, 'error');
            });
        },

        showMessage: function showMessage(message, type) {
            var $message = this.$('.message').removeClass('hide message-success message-error');
            if (type === 'success') {
                $message.addClass('message-success');
            } else {
                $message.addClass('message-error');
            }
            $message.text(message).fadeIn(400).delay(3000).fadeOut();
        }
    });
});
