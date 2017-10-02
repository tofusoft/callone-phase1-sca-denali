/**
 * Created by bbenzano on 12/22/2015.
 */
define(
    'ReturnAuthorizationFix.Model'
    ,	['ReturnAuthorization.Model', 'SC.Model', 'Utils', 'Application', 'StoreItem.Model', 'underscore']
    ,	function (ReturnAuthorizationModel, SCModel, Utils, Application, StoreItem, _)
    {
        _.extend(ReturnAuthorizationModel, {

            getLines: function (records) {
                var result_lines = [],
                    items_to_query = [],
                    items_to_preload = {},
                    amount_field = context.getFeature('MULTICURRENCY') ? 'fxamount' : 'amount'

                    , main_return_authorization = _.find(records, function (return_authorization) {
                        return return_authorization.getValue('mainline') === '*';
                    })

                    , loaded_lines = _.filter(records, function (line) {
                        // Sales Tax Group have negative internal ids
                        return parseInt(line.getValue('internalid', 'item'), 10) > 0;
                    });

                _.each(loaded_lines, function (record) {
                    var amount = Math.abs(record.getValue(amount_field)),
                        rate = record.getValue('rate'),
                        item_id = record.getValue('internalid', 'item'),
                        item_type = record.getValue('type', 'item');

                    items_to_preload[item_id] = {
                        id: item_id,
                        type: item_type
                    };

                    result_lines.push({
                        // As we are returning the item, the quantity is negative
                        // don't want to show that to the customer.
                        quantity: Math.abs(record.getValue('quantity')),
                        options: Utils.getItemOptionsObject(record.getValue('options'))

                        ,
                        item: item_id,
                        type: item_type

                        ,
                        reason: record.getValue('memo')

                        ,
                        amount: Utils.toCurrency(amount),
                        amount_formatted: Utils.formatCurrency(amount)

                        ,
                        rate: Utils.toCurrency(rate),
                        rate_formatted: Utils.formatCurrency(rate)
                    });
                });

                items_to_preload = _.filter(_.values(items_to_preload), function (item) {
                    return ['InvtPart', 'NonInvtPart', 'Kit'].indexOf(item.type) != -1
                });
                StoreItem.preloadItems(items_to_preload);

                _.each(result_lines, function (line) {
                    if (line.item) {
                        var item;
                        try {
                            item = StoreItem.get(line.item, line.type);
                        } catch (e) {
                        }

                        if (!item || typeof item.itemid === 'undefined') {
                            items_to_query.push(line.item);
                        }
                    }
                });

                if (items_to_query.length > 0) {
                    var filters = [
                        new nlobjSearchFilter('entity', null, 'is', nlapiGetUser()), new nlobjSearchFilter('internalid', null, 'is', main_return_authorization.getId()), new nlobjSearchFilter('internalid', 'item', 'anyof', items_to_query)
                    ]

                        , columns = [
                        new nlobjSearchColumn('internalid', 'item'), new nlobjSearchColumn('type', 'item'), new nlobjSearchColumn('parent', 'item'), new nlobjSearchColumn('displayname', 'item'), new nlobjSearchColumn('storedisplayname', 'item'), new nlobjSearchColumn('itemid', 'item')
                    ]

                        , inactive_items_search = Application.getAllSearchResults('transaction', filters, columns);

                    _.each(inactive_items_search, function (item) {
                        var inactive_item = {
                            internalid: item.getValue('internalid', 'item'),
                            type: item.getValue('type', 'item'),
                            displayname: item.getValue('displayname', 'item'),
                            storedisplayname: item.getValue('storedisplayname', 'item'),
                            itemid: item.getValue('itemid', 'item')
                        };

                        StoreItem.set(inactive_item);
                    });
                }

                _.each(result_lines, function (line) {
                    line.item = StoreItem.get(line.item, line.type);
                });

                return result_lines;
            }
        });
    });