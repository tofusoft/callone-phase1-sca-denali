/*
 avoid people registering twice or more

*/
define('EF.UE.BackInStockNotification.Subscription', [
    'BackInStockNotification'
], function UEBackInStockNotificationSubscription(BackInStockNotification) {
    'use strict';

    /* Private */
    function onCreate(newRecord) {
        var email = newRecord.getFieldValue(BackInStockNotification.columns.email.fieldName);
        var item = newRecord.getFieldValue(BackInStockNotification.columns.item.fieldName);
        var website = newRecord.getFieldValue(BackInStockNotification.columns.website.fieldName);
        // avoid people registering twice or more
        if (BackInStockNotification.alreadySubscribed(email, item, website)) {
            throw nlapiCreateError('-100', 'Duplicated Subscription', true);
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
