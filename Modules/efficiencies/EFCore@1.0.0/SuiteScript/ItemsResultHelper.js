/**
 * Created by pzignani on 21/10/2014.
 * Given a search result from SearchHelper, with an item property, an item column, an item property,
 * and the item type property,
 * grabs the results and appends ITEMS (order-fieldset complete items, in frontend expected format)
 * Record: is the record from where the search comes from
 * RecordItemColumn: the column name where the item is linked
 * ResultItemProperty: on the results, the property id where the itemid resides
 * ResultItemTypeProperty: on the results, the property id where the item type resides
 */
define('ItemsResultHelper', function ItemsResultHelperDefine() {
    'use strict';

    function ItemsResultHelper(record, recordItemColumn, resultItemProperty, resultItemTypeProperty) {
        this.record = record;
        this.recordItemColumn = recordItemColumn;
        this.resultItemProperty = resultItemProperty;
        this.resultItemTypeProperty = resultItemTypeProperty;
    }

    ItemsResultHelper.prototype.processResults = function processResults(results) {
        var self = this;
        var storeItemModel = require('StoreItem.Model');
        var itemsToPreload = [];
        var _ = require('underscore');

        _.each(results, function eachResults(result) {
            itemsToPreload.push({
                id: result[self.resultItemProperty],
                type: result[self.resultItemTypeProperty]
            });
        });

        storeItemModel.preloadItems(itemsToPreload);

        _.each(results, function eachResults(result) {
            var itemStored = storeItemModel.get(result[self.resultItemProperty], result[self.resultItemTypeProperty]);
            var itemsToQuery = [];


            if (!itemStored || typeof itemStored.itemid === 'undefined') {
                itemsToQuery.push({
                    id: result[self.resultItemProperty],
                    type: result[self.resultItemTypeProperty]
                });
            } else {
                _.extend(result, {
                    item: itemStored
                });
                delete result.itemType;
            }
        });
    };

    return ItemsResultHelper;
});
