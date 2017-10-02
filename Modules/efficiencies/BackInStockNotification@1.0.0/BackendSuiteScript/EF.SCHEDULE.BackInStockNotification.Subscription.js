define('EF.SCHEDULE.BackInStockNotification.Subscription', [

    'BackInStockNotification.Customer',
    'BackInStockNotification.Contact',
    'BackInStockNotification',
    'BackInStockNotification.SiteConfiguration',
    'BackInStockNotification.Website',
    'BackInStockNotification.Item',
    'BackInStockNotification.ItemKeyMapping',
    'BackInStockNotification.Configuration',
    'DuplicateCustomerManagement.Customer',

    'underscore'

], function EFSCHEDULEBackInStockNotificationSubscription(

    BackInStockNotificationCustomer,
    ContactModel,
    BackInStockNotificationModel,
    BackInStockNotificationConfigurationModel,
    BackInStockNotificationWebsiteModel,
    BackendStoreItemModel,
    itemKeyMapper,
    BackInStockNotificationConfig,
    DuplicateCustomerManagementCustomer,
    _

) {
    'use strict';

    var RESULTS_PER_SEARCH = 200;
    var GOVERNANCE_THRESHOLD = 200;

    // TODO: Review IS GUEST case when on shopflow.
    function maintainCustomers(record) {
        var customerId = record.customer;
        var customerData;
        var mainEmail;
        var isPerson;
        var newEmail;
        var contactData;
        // var contact;
        var data;
        var customers;

        // CASE A: User was logged in.
        if (customerId) {
            // IF IT'S A RECOGNIZED CUSTOMER
            customerData = nlapiLookupField('customer', customerId, ['email', 'isperson']);
            mainEmail = customerData.email.trim().toLowerCase();
            isPerson = customerData.isperson === 'T';
            newEmail = record.email.trim().toLowerCase();

            // Houston, we have a new contact;
            // CASE A.1 (Email does not match registered user's mail)
            if (mainEmail !== newEmail && !isPerson) {
                contactData = {
                    company: record.customer,
                    firstname: record.firstname,
                    lastname: record.lastname,
                    email: record.email,
                    subsidiary: record.subsidiary,
                    language: record.language
                };

                // contacts = ContactModel.getByCustomer(customerId),
                // contact = ContactModel.addIfNotExists(contactData);

                ContactModel.addIfNotExists(contactData);
            }

            nlapiSubmitField(BackInStockNotificationModel.record, record.internalid, [
                BackInStockNotificationModel.columns.processed.fieldName
            ], [
                'T'
            ]);
        } else {
            // CASE B: User wasnt recognized.
            data = {
                isinactive: 'F',
                email: record.email,
                firstname: record.firstname,
                lastname: record.lastname,
                subsidiary: record.subsidiary,
                currency: record.currency,
                weblead: 'T',
                // The TEXT of locale, is the KEY of Language. Go figure!
                language: record.language,
                leadsource: BackInStockNotificationConfig.leadsourceId
            };

            customers = DuplicateCustomerManagementCustomer.getDuplicated(data, ['giveaccess']);

            if (customers.length > 0) {
                // Associate this to the first possible customer
                nlapiSubmitField(BackInStockNotificationModel.record, record.internalid, [
                    BackInStockNotificationModel.columns.customer.fieldName,
                    BackInStockNotificationModel.columns.processed.fieldName
                ], [
                    customers[0].internalid,
                    'T'
                ]);
            } else {
                // Register Lead!
                customerId = BackInStockNotificationCustomer.mantainCustomer(data, 'lead');

                nlapiSubmitField(BackInStockNotificationModel.record, record.internalid, [
                    BackInStockNotificationModel.columns.customer.fieldName,
                    BackInStockNotificationModel.columns.processed.fieldName
                ], [
                    customerId,
                    'T'
                ]);
            }
        }
    }

    function translate(dictionary, text) {
        var textToTranslate;
        var args;
        var result;

        if (!text) {
            return '';
        }

        textToTranslate = text.toString();
        // Turns the arguments object into an array
        args = Array.prototype.slice.call(arguments);

        // Checks the translation table
        result = dictionary && dictionary[textToTranslate] ? dictionary[textToTranslate] : textToTranslate;

        if (args.length && result) {
            // Mixes in inline variables
            result = result.format.apply(result, args.slice(2));
        }

        return result;
    }

    (function stringFormat() {
        String.prototype.format = function format() {
            var args = arguments;

            return this.replace(/\$\((\d+)\)/g, function replaceString(match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        };
    })();

    function sendEmail(configuration, templateResources, data, website, item) {
        var subject;
        var rec = {
            entity: data.customer,
            record: data.internalid,
            recordtype: BackInStockNotificationModel.record
        };
        var emailText = '';
        // Some magic to pass to the template
        var dataObjs = {
            itemAttributes: _.partial(itemKeyMapper, {
                language: data.language,
                currency: data.currency
            }, item),
            translate: _.partial(translate, templateResources.translations[data.language]),
            configuration: configuration,
            backinstocknotification: data,
            website: website,
            item: item
        };

        emailText = templateResources.templateFunction(dataObjs);
        subject = emailText.match(/<title>([^<]+)<\/title>/)[1];

        nlapiSendEmail(configuration.sender, data.email, subject, emailText, null, null, rec);

        BackInStockNotificationModel.markAsSent(data.internalid);
    }

    function checkGovernance(context) {
        var state;

        if (context.getRemainingUsage() < GOVERNANCE_THRESHOLD) {
            BackendStoreItemModel.reset();

            state = nlapiYieldScript();

            if (state.status === 'FAILURE') {
                nlapiLogExecution('ERROR', 'Failed to yield script, exiting: Reason = ' + state.reason +
                    ' / Size = ' + state.size);
                throw nlapiCreateError('YIELD_SCRIPT_ERROR', 'Failed to yield script');
            } else if (state.status === 'RESUME') {
                nlapiLogExecution('AUDIT', 'Resuming script because of ' + state.reason + '.  Size = ' + state.size);
            } else {
                nlapiLogExecution('AUDIT', 'STATE' + JSON.stringify(state) + '.  Size = ' + state.size);
            }
            // state.status will never be SUCCESS because a success would imply a yield has occurred.
            // The equivalent response would be yield
        }
    }

    /* Public */
    function main() {
        var lines;
        var emailLines;
        var isNotLastTimeLines;
        var isNotLastTimeEmailLines;

        var i;
        var j;
        var k;
        var customersCounter = 0;
        var emailsCounter = 0;
        var context = nlapiGetContext();
        var websiteBackInStockSites;
        var line;
        var config;
        var websiteRecord;
        var templateFiles;
        var emailLine;
        var item;

        nlapiLogExecution('DEBUG', '--- BEGIN ---', '--- BEGIN ---');

        // First grab our pending lead creation work
        do {
            checkGovernance(context);
            lines = BackInStockNotificationModel.getNotProcessedLines(0, RESULTS_PER_SEARCH);
            isNotLastTimeLines = lines.length === RESULTS_PER_SEARCH;

            for (i = 0; i < lines.length; i++) {
                customersCounter++;
                line = lines[i];
                checkGovernance(context);
                maintainCustomers(line);
            }
        } while (isNotLastTimeLines);

        nlapiLogExecution('DEBUG', 'Customers Processed', customersCounter);

        lines = null;

        // Then for each website configured to send BIS, get the job done
        websiteBackInStockSites = BackInStockNotificationConfigurationModel.list();

        for (j = 0; j < websiteBackInStockSites.length; j++) {
            checkGovernance(context);

            config = websiteBackInStockSites[j];
            websiteRecord = BackInStockNotificationWebsiteModel.get(config.website);
            templateFiles = BackInStockNotificationConfigurationModel.getTemplates(config);

            // this is needed because items have different attributes depending on website, so cache shouldn't apply;
            BackendStoreItemModel.reset();

            do {
                emailLines = BackInStockNotificationModel.getPendingEmails(config.website, 0, RESULTS_PER_SEARCH);
                isNotLastTimeEmailLines = emailLines.length === RESULTS_PER_SEARCH;

                for (k = 0; k < emailLines.length; k++) {
                    checkGovernance(context);
                    emailsCounter++;
                    emailLine = emailLines[k];

                    item = BackendStoreItemModel.get(emailLine.item, emailLine.itemType, websiteRecord);

                    sendEmail(config, templateFiles, emailLine, websiteRecord, item);
                }
            } while (isNotLastTimeEmailLines);
        }

        nlapiLogExecution('DEBUG', 'Emails Sent:', emailsCounter);
        nlapiLogExecution('DEBUG', '--- END ---', '--- END ---');
    }

    return {
        main: main
    };
});
