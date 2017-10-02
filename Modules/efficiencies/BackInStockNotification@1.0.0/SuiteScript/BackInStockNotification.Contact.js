/*
Basic contact operations:
Get contacts by customer
Find if a customer already has a contact with an email
Add a contact to a customer if there is no already one with that email.
Add a contact
 */
define('BackInStockNotification.Contact', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function BackInStockNotificationContact(SCModel, SearchHelper, _) {
    'use strict';

    return SCModel.extend({
        record: 'contact',
        name: 'BackInStockNotification.Contact',

        filters: {
            base: [{
                fieldName: 'isinactive',
                operator: 'is',
                value1: 'F'
            }]
        },

        columns: {
            internalid: {
                fieldName: 'internalid'
            },
            firstname: {
                fieldName: 'firstname'
            },
            lastname: {
                fieldName: 'lastname'
            },
            email: {
                fieldName: 'email'
            },
            company: {
                fieldName: 'company'
            }
        },

        fieldsets: {
            basic: []
        },

        getByCustomer: function getByCustomer(customerId) {
            var search = new SearchHelper(this.record, this.filters.base, this.columns, this.fieldsets.basic);

            search.addFilter({
                fieldName: 'company',
                operator: 'anyof',
                value1: customerId
            });

            return search.search().getResults();
        },

        customerHasContactEmail: function customerHasContactEmail(customerId, contactEmail) {
            var search = new SearchHelper(this.record, this.filters.base, this.columns, this.fieldsets.basic);

            search.addFilter({
                fieldName: 'company',
                operator: 'anyof',
                value1: customerId
            });

            search.addFilter({
                fieldName: 'email',
                operator: 'is',
                value1: contactEmail
            });

            return search.search().getResults();
        },

        addIfNotExists: function addIfNotExists(data) {
            var search = new SearchHelper(this.record, this.filters.base, this.columns, this.fieldsets.basic);
            var results;

            search.addFilter({
                fieldName: 'company',
                operator: 'anyof',
                value1: data.company
            });

            search.addFilter({
                fieldName: 'email',
                operator: 'is',
                value1: data.email
            });

            results = search.search().getResults();

            if (!results || results.length === 0) {
                this.mantainContact(data);
            }
        },

        mantainContact: function mantainContact(data) {
            var contact;
            var isEdit = !!data.internalid;
            var contactId;

            if (isEdit) {
                contact = nlapiLoadRecord('contact', data.internalid);
            } else {
                contact = nlapiCreateRecord('contact');
                contact.setFieldValue('entityid', data.firstname + ' ' + data.lastname);
            }

            _.each(data, function eachData(value, key) {
                contact.setFieldValue(key, value);
            });


            contactId = nlapiSubmitRecord(contact);

            if (!isEdit) {
                nlapiAttachRecord('contact', contactId, 'customer', data.company);
            }

            return contactId;
        }
    });
});
