define('BackInStockNotification.SiteConfiguration', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function BackInStockNotificationSiteConfiguration(SCModel, SearchHelper, _) {
    'use strict';

    return SCModel.extend({
        record: 'customrecord_ef_bs_config',
        name: 'BackInStockNotification.SiteConfiguration',

        columns: {
            'internalid': {
                fieldName: 'internalid'
            },
            'isinactive': {
                fieldName: 'isinactive'
            },
            'website': {
                fieldName: 'custrecord_ef_bs_c_website'
            },
            'sender': {
                fieldName: 'custrecord_ef_bs_c_sender'
            },
            'template': {
                fieldName: 'custrecord_ef_bs_c_tpl'
            },
            'translations': {
                fieldName: 'custrecord_ef_bs_c_translations'
            }
        },

        filters: [{
            fieldName: 'isinactive',
            operator: 'is',
            value1: 'F'
        }],

        getByWebsite: function getByWebsite(internalid) {
            var Search = new SearchHelper(this.record, this.filters, this.columns)
                .addFilter({
                    fieldName: this.columns.website.fieldName,
                    operator: 'is',
                    value1: internalid
                })
                .addFilter({
                    fieldName: this.columns.isinactive.fieldName,
                    operator: 'is',
                    value1: 'F'
                })
                .search();

            return Search.getResult();
        },

        list: function list() {
            var Search = new SearchHelper(this.record, this.filters, this.columns)
                .addFilter({
                    fieldName: this.columns.isinactive.fieldName,
                    operator: 'is',
                    value1: 'F'
                })
                .search();

            return Search.getResults();
        },

        getTemplates: function getTemplates(config) {
            var tplFile;
            // not in use
            // var tplBody;
            var tplFunct;
            var translationsFile;
            var translationsJSON;

            if (config.template) {
                tplFile = nlapiLoadFile(config.template);
                if (tplFile) {
                    tplFunct = _.template(tplFile.getValue());
                }
            }

            if (config.translations) {
                translationsFile = nlapiLoadFile(config.translations);

                if (translationsFile) {
                    try {
                        translationsJSON = JSON.parse(translationsFile.getValue());
                    } catch (e) {
                        nlapiLogExecution('ERROR', 'Parse Translations JSON Error', e);
                    }
                }
            }

            return {
                translations: translationsJSON,
                templateFunction: tplFunct
            };
        }
    });
});
