/**
* Currencies are searchable but the field displaysimbol (that contains $ or Euro sign for example) is not a column.
* So we have to load records.
* Also, there is the problem with currency-locales,
* the way the currency gets written in native locale (see config for details).
* Locale is not a record in ns, so we have to merge the config by hand.
*/
define('BackInStockNotification.Currency', [
    'SC.Model',
    'BackInStockNotification.Configuration',
    'RecordHelper',
    'underscore'
],
function BackInStockNotificationCurrencyModel(
    SCModel,
    BackInStockNotificationConfig,
    RecordHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'BackInStockNotification.Currency',
        record: 'currency',
        fields: {
            symbol: {
                fieldName: 'symbol'
            },
            displaysymbol: {
                fieldName: 'displaysymbol'
            }
        },
        get: function get(id) {
            var search = new RecordHelper(this.record, this.fields);
            return search.get(id).getResult();
        },
        list: function list(ids, appendLocaleInfo) {
            // Had to be done by LOAD RECORD because of displaysymbol access :( (Not available on searches)
            var search = new RecordHelper(this.record, this.fields);
            var results = search.search(ids).getResults();

            // Locale info had to be appended by hand as there is no way to get the relationship
            // between the locale and the currency.
            // However, i'm 80% sure behind the curtains, there is a relatinship and that's what
            // is taken into account on the website
            // in order to show prices with commas or periods
            // Also locale is not even a record on NS
            if (appendLocaleInfo) {
                _.each(results, function eachResults(result) {
                    // var j = result;
                    // var cmd = cmd || BackInStockNotificationConfig.localeCurrencyMetadata;
                    var conf = _.findWhere(BackInStockNotificationConfig.localeCurrencyMetadata, {
                        currency: result.internalid
                    });
                    if (conf) {
                        result.localeCurrencyMetadata = conf.localeCurrencyMetadata;
                    }
                });
            }
            return results;
        }
    });
});
