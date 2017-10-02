/*
Register customer Functionality
*/

define('BackInStockNotification.Customer', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function BackInStockNotificationCustomer(SCModel, SearchHelper, _) {
    'use strict';

    return SCModel.extend({
        record: 'customer',
        name: 'BackInStockNotification.Customer',

        columns: {
            internalid: {
                fieldName: 'internalid'
            },
            email: {
                fieldName: 'email'
            },
            isinactive: {
                fieldName: 'isinactive'
            },
            language: {
                fieldName: 'language'
            },
            currency: {
                fieldName: 'currency'
            },
            giveaccess: {
                fieldName: 'giveaccess'
            },
            subsidiary: {
                fieldName: 'subsidiary'
            }
        },

        fieldsets: {
            duplicated: [
                'internalid',
                'email',
                'isinactive',
                'language',
                'currency'
            ]
        },

        filters: {
            base: [{
                fieldName: 'isinactive',
                operator: 'is',
                value1: 'F'
            }]
        },

        mantainCustomer: function mantainCustomer(data, type) {
            var customer;
            var customerType = type || 'customer';
            var isEdit = !!data.internalid;

            if (!isEdit) {
                customer = nlapiCreateRecord(customerType);
            } else {
                customer = nlapiLoadRecord(customerType, data.internalid);
            }

            _.each(data, function eachData(value, key) {
                customer.setFieldValue(key, value);
            });

            return nlapiSubmitRecord(customer);
        }
    });
});
