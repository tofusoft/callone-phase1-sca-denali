/* Model that leverages the concept of an item in backend and in frontend
There are a series of processes that an item goes through before being exposed on a website.
Sadly all that transformations, that mean associations between the item properties
and the website properties, are not available in an Schedule Script Context
So we have to recreate all that logic by ourselves.
Meaning chosing the correct price to show (from the webstore pricelevel)
and regenerating the path to the image folder, or the correct item url
 */
define('BackInStockNotification.Item', [
    'SC.Model',
    'RecordHelper',
    'BackInStockNotification.FormatCurrency',
    'underscore'
], function BackInStockNotificationItem(SCModel, RecordHelper, formatCurrency, _) {
    'use strict';

    return SCModel.extend({
        record: 'item',
        name: 'BackInStockNotification.Item',

        mapping: {
            'InvtPart': [
                'inventoryitem'
            ],
            'Kit': [
                'kititem'
            ]
        },

        fields: {
            // basic fields exposed. Add your custom fields here!
            internalid: {
                fieldName: 'internalid'
            },
            itemid: {
                fieldName: 'itemid'
            },
            type: {
                fieldName: 'type'
            },
            itemtype: {
                fieldName: 'itemtype'
            },
            matrixtype: {
                fieldName: 'matrixtype'
            },
            parent: {
                fieldName: 'parent'
            },
            urlcomponent: {
                fieldName: 'urlcomponent'
            }
        },

        // Returns a collection of items with the items iformation
        // the 'items' parameter is an array of objects {id,type}
        // Almost same code as the reference implementation preloadItems
        preloadItems: function preloadItems(items, context) {
            var self = this;
            var itemsById = {};
            var parentsById = {};
            var itemsDetails;
            var parentsDetails;

            this.context = this.context || context;

            this.preloadedItems = this.preloadedItems || {};

            _.each(items, function eachItems(item) {
                var isInCorrectItem = !item.id || !item.type || item.type === 'Discount';
                if (!isInCorrectItem && !self.preloadedItems[item.id]) {
                    itemsById[item.id] = {
                        internalid: item.id + '',
                        itemtype: item.type
                    };
                }
            });

            if (!_.size(itemsById)) {
                return this.preloadedItems;
            }

            itemsDetails = this.getItemFieldValues(itemsById);

            // Generates a map by id for easy access. Notice that for disabled items the array element can be null
            _.each(itemsDetails, function eachItemDetails(item) {
                if (item && typeof item.itemid !== 'undefined') {
                    if (item.matrixtype === 'CHILD') {
                        parentsById[item.parent] = {
                            internalid: item.parent + '',
                            itemtype: item.itemtype
                        };
                    }

                    self.preloadedItems[item.internalid] = item;
                }
            });

            if (_.size(parentsById)) {
                parentsDetails = this.getItemFieldValues(parentsById);

                _.each(parentsDetails, function parentsParentDetails(item) {
                    if (item && typeof item.itemid !== 'undefined') {
                        self.preloadedItems[item.internalid] = item;
                    }
                });
            }

            // Adds the parent inforamtion to the child
            _.each(this.preloadedItems, function eachPreloadItems(item) {
                if (item && item.matrixtype === 'CHILD') {
                    item.matrix_parent = self.preloadedItems[item.parent];
                }
            });

            return this.preloadedItems;
        },

        get: function get(id, type, context) {
            this.context = this.context || context;
            this.preloadedItems = this.preloadedItems || {};

            if (!this.preloadedItems[id]) {
                this.preloadItems([{
                    id: id,
                    type: type
                }], context);
            }

            return this.preloadedItems[id];
        },

        set: function set(item) {
            this.preloadedItems = this.preloadedItems || {};

            if (item.internalid) {
                this.preloadedItems[item.internalid] = item;
            }
        },

        // This is where for all items that we grabbed, we post-process information
        // with context and append it to the response
        getItemFieldValues: function getItemFieldValues(itemsById) {
            var self = this;
            // not in use
            // var item_ids = _.values(itemsById);
            var search = new RecordHelper(this.record, this.fields);
            var results = search.search(_.map(itemsById, function mapItems(item) {
                return {
                    id: item.internalid,
                    type: self.mapping[item.itemtype]
                };
            })).getResults();

            _.each(results, function eachResults(result) {
                var currentRecord = search.getRecord(result.internalid);
                _.extend(result, {
                    urlcomponent: self._urlcomponent(currentRecord),
                    price: self._price(currentRecord),
                    translations: self._texts(currentRecord),
                    images: self._images(currentRecord),
                    itemoptions: self._itemOptions(currentRecord)
                });
            });

            return results;
        },

        // Urlcomponent needs to use the website
        _urlcomponent: function _urlcomponent(record) {
            var urlcomponent = record.getFieldValue('urlcomponent');
            if (urlcomponent) {
                return this.context.domain.fulldomain + urlcomponent;
            }
            return null;
        },

        /*
        ItemOptions are not easily exposed!
        This is a nasty workaround to get itemoptions and their values, that might be translated!
        We need to load the custitem and custoption, and for that we need field id's.
        For that we have to use a custom record with "getSelectOptions" to cheat to give us scriptid for fields!
        */
        _itemOptions: function _itemOptions(itemRecord) {
            var self = this;
            var itemOptions = [];
            var optionsTexts;
            var optionsValues;
            var i;
            var itemOptionRecord;
            var langTranslations;
            var extendedValue;
            var itemFieldRecord;

            // function used inside a for statement below
            function eachKeysToTranslate(key) {
                if (itemOptionRecord.getLineItemValue('translations', key, i) !== null) {
                    langTranslations[key] = itemOptionRecord.getLineItemValue('translations', key, i);
                }
            }

            // function used inside a for statement below
            function eachContextLanguages(lang) {
                extendedValue.translations[lang.locale] = itemFieldRecord
                    .getLineItemValue('customvalue', 'value_sname_' + lang.locale, i);
            }

            if (itemRecord.getFieldValue('matrixtype') === 'CHILD') {
                optionsTexts = itemRecord.getFieldTexts('itemoptions');
                optionsValues = itemRecord.getFieldValues('itemoptions');

                _.each(optionsTexts, function eachOptionsTexts(option, index) {
                    // BEWARE: Once you do a getSelectOptions, it doesn't seem possible to reuse it,
                    // that's why the creation is inside the each.
                    var helper = nlapiCreateRecord('customrecord_ef_bs_helper', {
                        recordmode: 'dynamic'
                    });
                    var helperField = helper.getField('custrecord_ef_bs_h_field');
                    var candidates = helperField.getSelectOptions(option, 'is');

                    // We're selecting by NAME, so we might have XXX "Name" matches.
                    // Now we have to iterate through them, to find the correct one
                    _.each(candidates, function eachCandidates(candidate) {
                        var candidateScriptId = helper.getFieldValue('custrecord_ef_bs_h_field_scriptid').toLowerCase();
                        var itemOptionScriptId = optionsValues[index].toLowerCase();

                        helper.setFieldValue('custrecord_ef_bs_h_field', candidate.id);

                        if (candidateScriptId === itemOptionScriptId) {
                            itemOptions.push({
                                internalid: optionsValues[index].toLowerCase(),
                                label: option,
                                scriptid: candidate.id,
                                index: index
                            });
                        }
                    });
                });

                _.each(itemOptions, function eachItemOptions(option) {
                    // not in use
                    // var onlineLanguages = self.context.languages;
                    var defaultLanguage = self.context.defaultLanguage;
                    var translations = {};
                    var languageCount;
                    var keysToTranslate = [
                        'label'
                    ];
                    var defaultLangKeys = {};
                    var locale;
                    var sourceFrom;
                    var valueCount;

                    itemOptionRecord = nlapiLoadRecord('itemoptioncustomfield', option.scriptid);
                    languageCount = itemOptionRecord.getLineItemCount('translations');

                    _.each(keysToTranslate, function eachKeyToTranslate(key) {
                        defaultLangKeys[key] = itemOptionRecord.getFieldValue(key);
                    });

                    translations[defaultLanguage.locale] = defaultLangKeys;

                    for (i = 1; i <= languageCount; i++) {
                        locale = itemOptionRecord.getLineItemValue('translations', 'locale', i);

                        if (_.findWhere(self.context.languages, {
                            locale: locale
                        })) {
                            langTranslations = {};

                            _.each(keysToTranslate, eachKeysToTranslate);

                            langTranslations =
                                translations[locale] = _.defaults(langTranslations, defaultLangKeys);
                        }
                    }

                    sourceFrom = itemOptionRecord.getFieldValue('sourcefrom').toLowerCase();

                    _.extend(option, defaultLanguage, {
                        translations: translations,
                        sourcefrom: sourceFrom,
                        sourcelistid: itemOptionRecord.getFieldValue('sourcefromrecordtype'),
                        value: {
                            internalid: itemRecord.getFieldValue('matrixoption' + sourceFrom),
                            label: itemRecord.getFieldValue('matrixoption' + sourceFrom + '_display')
                        }
                    });

                    itemFieldRecord = nlapiLoadRecord('customlist', option.sourcelistid);
                    valueCount = itemFieldRecord.getLineItemCount('customvalue');

                    for (i = 1; i <= valueCount; i++) {
                        if (itemFieldRecord.getLineItemValue('customvalue', 'valueid', i) === option.value.internalid) {
                            extendedValue = {
                                translations: {}
                            };

                            _.extend(extendedValue, {
                                label: itemFieldRecord.getLineItemValue('customvalue', 'value', i),
                                internalid: itemFieldRecord.getLineItemValue('customvalue', 'valueid', i),
                                abbr: itemFieldRecord.getLineItemValue('customvalue', 'abbreviation', i)
                            });

                            _.each(self.context.languages, eachContextLanguages);

                            // UGHHHHH!!!!!
                            extendedValue.translations[self.context.defaultLanguage.locale] = itemFieldRecord
                                .getLineItemValue('customvalue', 'value', i);

                            if (extendedValue.internalid) {
                                option.value = extendedValue;
                            }
                        }
                    }
                });
            }

            return itemOptions;
        },

        // images need their full path
        // TODO: use a resizeid
        _images: function _images(itemRecord) {
            var images = [];
            var imageCount = itemRecord.getLineItemCount('itemimages');
            var i;

            for (i = 1; i <= imageCount; i++) {
                images.push({
                    internalid: itemRecord.getLineItemValue('itemimages', 'nkey', i),
                    alt: itemRecord.getLineItemValue('itemimages', 'altTagCaption', i),
                    name: itemRecord.getLineItemValue('itemimages', 'name', i),
                    url: this.context && this.context.imageurlbase +
                        itemRecord.getLineItemValue('itemimages', 'name', i)
                });
            }

            return images;
        },

        // Texts: we need all translatable fields to become translated in every
        // language that is available on the website
        _texts: function _texts(itemRecord) {
            // not in use
            // var onlineLanguages;
            var defaultLanguage;
            var translations;
            var languageCount;
            var keysToTranslate;
            var defaultLangKeys;
            var i;
            var locale;
            var langTranslations;

            // function used inside a for statement below
            function eachKeysToTranslate2(key) {
                if (itemRecord.getLineItemValue('translations', key, i) !== null) {
                    langTranslations[key] = itemRecord.getLineItemValue('translations', key, i);
                }
            }

            if (this.context && this.context.languages && this.context.defaultLanguage) {
                // not in use
                // onlineLanguages = this.context.languages;
                defaultLanguage = this.context.defaultLanguage;
                translations = {};
                languageCount = itemRecord.getLineItemCount('translations');
                keysToTranslate = [
                    'displayname',
                    'featureddescription',
                    'nopricemessage',
                    'outofstockmessage',
                    'pagetitle',
                    'salesdescription',
                    'storedescription',
                    'storedisplayname',
                    'storedetaileddescription'
                ];
                defaultLangKeys = {};

                _.each(keysToTranslate, function eachKeysToTranslate(key) {
                    defaultLangKeys[key] = itemRecord.getFieldValue(key);
                });

                translations[defaultLanguage.locale] = defaultLangKeys;

                for (i = 1; i <= languageCount; i++) {
                    locale = itemRecord.getLineItemValue('translations', 'locale', i);

                    if (_.findWhere(this.context.languages, {
                        locale: locale
                    })) {
                        langTranslations = {};

                        _.each(keysToTranslate, eachKeysToTranslate2);

                        langTranslations =
                            translations[locale] = _.defaults(langTranslations, defaultLangKeys);
                    }
                }

                return translations;
            }
        },

        /* Price is really tricky to grab, as you can have many scenarios
        The most simple one, is you don't have multicurrency, pricelevels(multiprice) or quantity pricing.
        Then you can have combinations of these features on or off
        In case you have pricelevels, we should grab the one configured as website pricelevel on the website record.
        In case you have quantity pricing, we need to grab the price for the first step (qty 0)
        In case you have multicurrency, we need to grab currencies for all exposed languages
         */
        _price: function _price(itemRecord) {
            var nsContext = nlapiGetContext();
            var isMultiCurrency = nsContext.getFeature('MULTICURRENCY');
            var isMultiPrice = nsContext.getFeature('MULTPRICE');
            var hasQuantityPricing = nsContext.getFeature('QUANTITYPRICING');
            var prices;
            var pricesByCurrency = {};
            var useDefaultCurrency = !isMultiCurrency && !isMultiPrice && !hasQuantityPricing && this.context &&
                this.context.defaultCurrency;
            var context;
            var currencies;
            var webstorePriceLevelIndex;
            var currency;
            var tmp;
            var currentPriceLevel;

            if (useDefaultCurrency) {
                // TODO: test this
                prices = {
                    price: itemRecord.getFieldValue('rate'),
                    price_formatted: formatCurrency(
                        itemRecord.getFieldValue('rate'),
                        this.context.defaultCurrency.symbol,
                        this.context.defaultCurrency.locale_metadata
                    )
                };
            } else {
                if (this.context && this.context.currencies) {
                    context = this.context;
                    currencies = this.context.currencies;

                    if (isMultiCurrency) {
                        _.each(currencies, function eachCurrencies(currentCurrency) {
                            // WE NEED TO SEARCH FOR THE CORRECT LINE OF THE PRICELEVEL,
                            // TO PASS IT TO "GETLINEITEMMATRIXVALUE" grrrr
                            // var pricelevelCount = itemRecord.getLineItemCount('price' + currentCurrency.internalid);

                            webstorePriceLevelIndex = 1;
                            currentPriceLevel = itemRecord.getLineItemValue('price' + currentCurrency.internalid,
                                'pricelevel', webstorePriceLevelIndex);

                            while (currentPriceLevel != context.onlinepricelevel) {
                                webstorePriceLevelIndex++;
                                currentPriceLevel = itemRecord.getLineItemValue('price' + currentCurrency.internalid,
                                    'pricelevel', webstorePriceLevelIndex);
                            }

                            // pricelevel 5, qty 0
                            tmp = itemRecord.getLineItemMatrixValue('price' + currentCurrency.internalid,
                                'price', webstorePriceLevelIndex, 1);

                            pricesByCurrency[currentCurrency.internalid] = {
                                price: tmp,
                                price_formatted: formatCurrency(
                                    tmp,
                                    currentCurrency.displaysymbol,
                                    currentCurrency.locale_metadata
                                )
                            };
                        });
                    } else {
                        // TODO: test this. Need an acct without multicurrency
                        // Currency 0
                        currency = this.context.currencies[0];
                        // var pricelevelCount = itemRecord.getLineItemCount('price');
                        webstorePriceLevelIndex = 1;
                        currentPriceLevel = itemRecord.getLineItemValue('price', 'pricelevel', webstorePriceLevelIndex);

                        while (currentPriceLevel != context.onlinepricelevel) {
                            webstorePriceLevelIndex++;
                            currentPriceLevel = itemRecord.getLineItemValue('price', 'pricelevel',
                                webstorePriceLevelIndex);
                        }

                        // pricelevel 5, qty 0
                        tmp = itemRecord.getLineItemMatrixValue('price', 'price', webstorePriceLevelIndex, 1);
                        prices = {
                            price: tmp,
                            price_formatted: formatCurrency(tmp, currency.displaysymbol, currency.locale_metadata)
                        };
                    }
                }
            }

            return prices || pricesByCurrency;
        },

        reset: function reset() {
            delete this.preloadedItems;
        }
    });
});
