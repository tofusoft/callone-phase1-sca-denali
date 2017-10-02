define('DuplicateCustomerManagement.Configuration', [
    'Configuration',
    'underscore'
], function BackInStockNotificationConfiguration(
    Configuration,
    _
) {
    'use strict';

    var duplicateCustomerManagementConfiguration = {
        enabled: true,
        errorMessage: 'There is already an account with this email address. If you are sure that it is your email' +
                      'address, <a data-hashtag="#forgot-password" data-touchpoint="login" href="">click here</a> ' +
                      'to retrieve your password.',
        criteria: {
            email: {
                // Users with same email
                type: 'same'
            },
            subsidiary: {
                // Check only on same subsidiary
                type: 'same'
            },
            isinactive: {
                // check only between active users
                type: 'value',
                value: 'F'
            }
        }
    };

    _.extend(duplicateCustomerManagementConfiguration, {
        get: function get() {
            return this;
        }
    });

    Configuration.publish.push({
        key: 'DuplicateCustomerManagementConfig',
        model: 'DuplicateCustomerManagement.Configuration',
        call: 'get'
    });

    return duplicateCustomerManagementConfiguration;
});
