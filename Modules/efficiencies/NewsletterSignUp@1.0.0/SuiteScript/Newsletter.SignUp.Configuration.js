/**
 * Created by pzignani on 01/10/2014.
 */
define('Newsletter.SignUp.Configuration', [
    'Configuration',
    'underscore'
], function NewsletterSignUpConfiguration(
    Configuration,
    _
) {
    'use strict';

    var newsletterSignUpConfiguration = {
        domain: 'forms.sandbox.netsuite.com',
        formId: '8',
        hash: '9ec8ceb73478dcf98d20'
    };

    _.extend(newsletterSignUpConfiguration, {
        get: function get() {
            return this;
        }
    });

    Configuration.publish.push({
        key: 'NewsletterSignUpConfig',
        model: 'Newsletter.SignUp.Configuration',
        call: 'get'
    });

    return newsletterSignUpConfiguration;
});
