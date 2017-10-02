define('EF.UE.DuplicateCustomerManagemet.Registration', [
    'DuplicateCustomerManagement.Customer',
    'DuplicateCustomerManagement.Configuration',
    'underscore'
],
function EFUEDuplicateCustomerManagemetRegistration(
    DCMCustomer,
    DuplicateCustomerManagementConfiguration,
    _
) {
    'use strict';

    var dups;

    /* Private */
    function onCreate(newRecord) {
        var context = nlapiGetContext();
        var executionContext = context.getExecutionContext();
        var registrationData;

        // Prevent executing the script if not on WEBSTORE && SCA with SSP_Lib that says "enable this"
        if (executionContext !== 'webstore' || context.getSessionObject('EF_DCM_UE_RUN') !== 'T') {
            return true;
        }

        // If module is enabled by config
        if (DuplicateCustomerManagementConfiguration.enabled) {
            // If we are on webstore, or it was specified that this should run not only on webstore but everywhere

            registrationData = {};

            /*
                JSON.parse(JSON.stringify(newRecord) has all the info that netsuite defaulted for the customer
                registration. Includes, still in JSON, not netsuite format (see booleans), fields like campaigns,
                giveaccess, credit hold override.
                And all the properties that get defaulted when creating a customer
            */
            _.each(JSON.parse(JSON.stringify(newRecord)), function eachParsedNewRecord(value, key) {
                var tempValue = value.internalid || value;
                if (_.isBoolean(tempValue)) {
                    // For some reason, here we had true booleans. And we need netsuite bools.
                    tempValue = (tempValue === true ? 'T' : 'F');
                }
                registrationData[key] = tempValue;
            });

            // Guest Shoppers cannot be checked against duplicates, when registered they usually have no e-mail
            // Paypal Express shoppers arrive to the checkout with email, but no access,
            // and they also shouldn't be tested against duplicates.
            // Conversion of guests to people with access has a NATIVE duplication check. GO FIGURE!
            if (!registrationData.email || registrationData.giveaccess === 'F') {
                return false;
            }

            dups = DCMCustomer.getDuplicated(registrationData);
            if (dups && dups.length) {
                throw nlapiCreateError('-100', DuplicateCustomerManagementConfiguration.errorMessage, true);
            }
        }
    }

    /* Public */
    function beforeSubmit(type) {
        var record = nlapiGetNewRecord();

        switch (type.toString()) {
        case 'create':
            onCreate(record);
            break;
        default:
            break;
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
