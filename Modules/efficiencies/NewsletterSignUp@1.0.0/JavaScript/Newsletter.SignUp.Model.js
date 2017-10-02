define('Newsletter.SignUp.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function NewsletterSignUpModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        url: _.getAbsoluteUrl('services/NewsletterSignUp.Service.ss'),
        validation: {
            email: {
                required: true,
                msg: _('Email address is required').translate(),
                pattern: 'email'
            }
        }
    });
});
