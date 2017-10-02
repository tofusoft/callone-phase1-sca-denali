define('BackInStockNotification.Website', [
    'SC.Model',
    'SearchHelper',
    'BackInStockNotification.Currency',
    'BackInStockNotification.Configuration',
    'underscore'
], function BackInStockNotificationWebsite(
    SCModel,
    SearchHelper,
    BackInStockNotificationCurrencyModel,
    BackInStockNotificationConfig,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'BackInStockNotification.Website',

        get: function get(websiteId) {
            var context = nlapiGetContext();
            var record = nlapiLoadRecord('website', websiteId);
            var website = {
                onlinepricelevel: record.getFieldValue('onlinepricelevel'),
                languages: [],
                currencies: [],
                imagedomain: record.getFieldValue('imagedomain'),
                imageurlbase: 'http://' + record.getFieldValue('imagedomain') + this.getFullImagePath(record),
                displayname: record.getFieldValue('displayname'),
                createcustomersascompanies: record.getFieldValue('createcustomersascompanies')
            };
            var companyConfiguration = null;
            var multiLanguageEnabled = context.getSetting('FEATURE', 'MULTILANGUAGE') === 'T';
            var languageCount;
            var i;
            var line;
            var locale;
            var multiCurrencyEnabled;
            var currencyCount;
            var displaySymbol;

            // LANGUAGE HANDLING
            if (multiLanguageEnabled) {
                languageCount = record.getLineItemCount('sitelanguage');

                for (i = 1; i <= languageCount; i++) {
                    line = {
                        internalid: record.getLineItemValue('sitelanguage', 'internalid', i),
                        locale: record.getLineItemValue('sitelanguage', 'locale', i),
                        isonline: record.getLineItemValue('sitelanguage', 'isonline', i) === 'T',
                        isdefault: record.getLineItemValue('sitelanguage', 'isdefault', i) === 'T'
                    };

                    if (line.isonline) {
                        website.languages.push(line);
                    }
                }
            } else {
                companyConfiguration = companyConfiguration || nlapiLoadConfiguration('companyinformation');

                locale = companyConfiguration.getFieldValue('locale');

                website.languages.push({
                    internalid: 1,
                    isdefault: true,
                    isonline: true,
                    locale: locale
                });
            }
            // END OF LANGUAGE HANDLING

            // CURRENCY HANDLING
            multiCurrencyEnabled = context.getSetting('FEATURE', 'MULTICURRENCY') === 'T';

            if (multiCurrencyEnabled) {
                currencyCount = record.getLineItemCount('sitecurrency');

                for (i = 1; i <= currencyCount; i++) {
                    line = {
                        internalid: record.getLineItemValue('sitecurrency', 'currency', i),
                        isdefault: record.getLineItemValue('sitecurrency', 'isdefault', i) === 'T',
                        isonline: record.getLineItemValue('sitecurrency', 'isonline', i) === 'T'
                    };

                    if (line.isonline) {
                        website.currencies.push(line);
                    }
                }

                website.currencies = BackInStockNotificationCurrencyModel.list(
                    _.pluck(website.currencies, 'internalid'), true);
            } else {
                companyConfiguration = companyConfiguration || nlapiLoadConfiguration('companyinformation');
                displaySymbol = companyConfiguration.getFieldValue('displaysymbol');

                website.currencies.push({
                    internalid: 1,
                    isdefault: true,
                    isonline: true,
                    symbol: displaySymbol,
                    displaysymbol: displaySymbol,
                    locale_metadata: BackInStockNotificationConfig.localecurrency_metadata[0]
                });
            }
            // END OF CURRENCY HANDLING

            website.defaultLanguage = _.findWhere(website.languages, {
                isdefault: true
            });

            website.defaultCurrency = _.findWhere(website.currencies, {
                isdefault: true
            });

            website.domain = this.getPrimaryDomain(record);

            return website;
        },

        getPrimaryDomain: function getPrimaryDomain(record) {
            // For every link on our emails, we need a DOMAIN.
            // If we have a primary domain, use that. If not, use the first of the website record.
            var countDomains = record.getLineItemCount('shoppingdomain');
            var domain;
            var i;

            for (i = 1; i <= countDomains; i++) {
                if (record.getLineItemValue('shoppingdomain', 'isprimary', i) === 'T') {
                    domain = {
                        fulldomain: 'http://' + record.getLineItemValue('shoppingdomain', 'domain', i) + '/',
                        domain: record.getLineItemValue('shoppingdomain', 'domain', i),
                        hostingroot: record.getLineItemValue('shoppingdomain', 'hostingroot', i),
                        isprimary: record.getLineItemValue('shoppingdomain', 'isprimary', i) === 'T'
                    };
                }
            }

            // IF we don't have a primary domain, we should be reading the first one of the domains configured
            if (!domain) {
                domain = {
                    fulldomain: 'http://' + record.getLineItemValue('shoppingdomain', 'domain', 1) + '/',
                    domain: record.getLineItemValue('shoppingdomain', 'domain', 1),
                    hostingroot: record.getLineItemValue('shoppingdomain', 'hostingroot', 1),
                    isprimary: record.getLineItemValue('shoppingdomain', 'isprimary', 1) === 'T'
                };
            }

            return domain;
        },

        getFullImagePath: function getFullImagePath(record) {
            // This algorithm that looks for the path to the image folder, will only work
            // if the image folder is under "Web Hosting Files"
            // If not, i'm not sure what would happen
            var imageFolderId = record.getFieldValue('imagefolder');
            var pathToImages = '/';
            var folderData;

            while (imageFolderId.indexOf('-') === -1) {
                folderData = nlapiLookupField('folder', imageFolderId, [
                    'internalid',
                    'name',
                    'parent',
                    'externalid',
                    'group',
                    'class'
                ]);
                imageFolderId = folderData.parent.toString();
                // grandpa shouldn't be "Web Hosting Files"
                if (folderData.parent.indexOf('-') === -1) {
                    pathToImages = '/' + folderData.name + pathToImages;
                }
            }
            return pathToImages;
        }
    });
});
