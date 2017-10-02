/**
 * Created by pzignani on 01/10/2014.
 */
define('BackInStockNotification.Configuration', [
    'Configuration',
    'underscore'
], function BackInStockNotificationConfiguration(
    Configuration,
    _
) {
    'use strict';

    var backInStockNotificationConfiguration = {
        leadsourceId: -6, // LeadSource of automatically registered leads
        resultsPerPage: 10, // Results per page on the MyAccount admin interface
        stockeableItemTypes: ['InvtPart'], // Item types that you can subscribe to

        // Localecurrency_metadata is tricky. For each currency there is a default locale asociated
        // This is the locale that the frontend uses for showing correct format.
        // It does NOT use the locale passed for currencies.
        // We are commiting the same mistake to be consistent
        // So for each currency, you need to think the locale of the country it comes from, and how they set up pricing
        // formats diferent examples: -$10.000,00 and ($10,000.00)
        localeCurrencyMetadata: [{
            currency: '1',
            // name: 'Dollars',
            localeMetadata: {
                groupseparator: ',',
                decimalseparator: '.',
                negativeprefix: '(',
                negativesuffix: ')'
            }
        }, {
            currency: '5',
            // name: 'UYP',
            localeMetadata: {
                groupseparator: '.',
                decimalseparator: ',',
                negativeprefix: '-',
                negativesuffix: ''
            }
        }]
    };

    _.extend(backInStockNotificationConfiguration, {
        get: function get() {
            return this;
        }
    });

    Configuration.publish.push({
        key: 'BackInStockNotificationConfig',
        model: 'BackInStockNotification.Configuration',
        call: 'get'
    });

    return backInStockNotificationConfiguration;
});
