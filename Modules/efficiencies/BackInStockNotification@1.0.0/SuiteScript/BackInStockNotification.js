define('BackInStockNotification', [
    'SC.Model',
    'SearchHelper',
    'BackInStockNotification.Location',
    'BackInStockNotification.Configuration',
	'ItemsResultHelper',
    'Application',
    'underscore'
],
function BackInStokNotification(
    SCModel,
    SearchHelper,
    BackInStockNotificationLocation,
    BackInStockNotificationConfig,
	ItemsResultHelper,
    Application,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'BackInStockNotification',
        record: 'customrecord_ef_bs_suscription',

        fieldsets: {
            basic: [
                'internalid',
                'item',
                'itemType',
                'itemName',
                'firstname',
                'lastname',
                'email',
                'created'
            ]
        },

        filters: [{
            fieldName: 'isinactive',
            operator: 'is',
            value1: 'F'
        }, {
            fieldName: 'custrecord_ef_bs_s_sent',
            operator: 'is',
            value1: 'F'
        }, {
            fieldName: 'isinactive',
            joinKey: 'custrecord_ef_bs_s_item',
            operator: 'is',
            value1: 'F'
        }, {
            fieldName: 'isonline',
            joinKey: 'custrecord_ef_bs_s_item',
            operator: 'is',
            value1: 'T'
        }],

        columns: {
            internalid: {
                fieldName: 'internalid'
            },
            created: {
                fieldName: 'created'
            },
            website: {
                fieldName: 'custrecord_ef_bs_s_website'
            },
            customer: {
                fieldName: 'custrecord_ef_bs_s_customer'
            },
            item: {
                fieldName: 'custrecord_ef_bs_s_item'
            },
            itemName: {
                fieldName: 'formulatext',
                join: 'custrecord_ef_bs_s_item',
                formula: 'case when LENGTH({custrecord_ef_bs_s_item.displayname}) > 0 then ' +
                    '{custrecord_ef_bs_s_item.displayname} else {custrecord_ef_bs_s_item.itemid} end'
            },
            itemType: {
                fieldName: 'type',
                joinKey: 'custrecord_ef_bs_s_item'
            },
            firstname: {
                fieldName: 'custrecord_ef_bs_s_firstname'
            },
            lastname: {
                fieldName: 'custrecord_ef_bs_s_lastname'
            },
            isinactive: {
                fieldName: 'isinactive'
            },
            sent: {
                fieldName: 'custrecord_ef_bs_s_sent'
            },
            email: {
                fieldName: 'custrecord_ef_bs_s_email'
            },
            dateSent: {
                fieldName: 'custrecord_ef_bs_s_date_sent'
            },
            subsidiary: {
                fieldName: 'custrecord_ef_bs_s_subsidiary'
            },
            currency: {
                fieldName: 'custrecord_ef_bs_s_currency'
            },
            locale: {
                fieldName: 'custrecord_ef_bs_s_locale'
            },
            language: {
                fieldName: 'custrecord_ef_bs_s_language',
                type: 'getText'
            },
            processed: {
                fieldName: 'custrecord_ef_bs_s_processed'
            }
        },

        list: function list(listHeaderData) {
            // Used from the MyAccount BIS admin panel
            var filters = _.clone(this.filters);
            var Search;
            var results;
            var ItemResultHelper;

            filters.push({
                fieldName: this.columns.customer.fieldName,
                operator: 'is',
                value1: nlapiGetUser() + ''
            });

            filters.push({
                fieldName: this.columns.website.fieldName,
                operator: 'is',
                value1: session.getSiteSettings(['siteid']).siteid
            });

            Search = new SearchHelper(
                this.record,
                filters,
                this.columns,
                this.fieldsets.basic,
                BackInStockNotificationConfig.resultsPerPage,
                listHeaderData.page,
                listHeaderData.sort,
                parseInt(listHeaderData.order, 10) === -1 ? 'desc' : 'asc'
            ).search();

            results = Search.getResultsForListHeader();

            // append item results
            ItemResultHelper = new ItemsResultHelper(this.record, this.columns.item, 'item', 'itemType');
            ItemResultHelper.processResults(results.records);
            return results;
        },

        // Delete BISN from admin panel
        delete: function deleteRecord(id) {
            if (this.get(id)) {
                return nlapiDeleteRecord(this.record, id);
            }
        },

        // Back in stock get one, using searches
        get: function get(id, avoidFilteringByUser) {
            var filters = _.clone(this.filters);
            var Search;
            var result;
            if (!avoidFilteringByUser) {
                filters.push({
                    fieldName: this.columns.customer.fieldName,
                    operator: 'is',
                    value1: nlapiGetUser() + ''
                });
            }
            filters.push({
                fieldName: this.columns.internalid.fieldName,
                operator: 'is',
                value1: id
            });
            filters.push({
                fieldName: this.columns.website.fieldName,
                operator: 'is',
                value1: session.getSiteSettings(['siteid']).siteid
            });

            Search = new SearchHelper(this.record, filters, this.columns, this.fieldsets.basic).search();
            result = Search.getResult();
            if (!result) {
                throw notFoundError;
            }
            return result;
        },

        // Create bis
        post: function post(data) {
            var record = nlapiCreateRecord(this.record);
            var userId = nlapiGetUser();
            var Environment;

            record.setFieldValue(this.columns.website.fieldName, session.getSiteSettings(['siteid']).siteid);

            if (userId) {
                record.setFieldValue(this.columns.customer.fieldName, userId + '');
            }

            record.setFieldValue(this.columns.processed.fieldName, 'F');
            record.setFieldValue(this.columns.firstname.fieldName, data.firstname);
            record.setFieldValue(this.columns.lastname.fieldName, data.lastname);
            record.setFieldValue(this.columns.email.fieldName, data.email);
            record.setFieldValue(this.columns.item.fieldName, data.item);
            record.setFieldValue(this.columns.subsidiary.fieldName, session.getShopperSubsidiary());
            record.setFieldValue(this.columns.currency.fieldName, session.getShopperCurrency().internalid);

            Environment = Application.getEnvironment(session, request);
            record.setFieldText(this.columns.locale.fieldName, Environment.currentLanguage.locale);
            record.setFieldValue(this.columns.language.fieldName, Environment.currentLanguage.languagename);

            return nlapiSubmitRecord(record);
        },

        /* Used from UE context to see if this combination of data (email,item,site) already registered to the BIS */
        alreadySubscribed: function alreadySubscribed(email, item, site) {
            var search = new SearchHelper()
                .setRecord(this.record)
                .setColumns({})
                .setFilters([{
                    fieldName: this.columns.isinactive.fieldName,
                    operator: 'is',
                    value1: 'F'
                }, {
                    fieldName: this.columns.sent.fieldName,
                    operator: 'is',
                    value1: 'F'
                }])
                .addFilter({
                    fieldName: this.columns.email.fieldName,
                    operator: 'is',
                    value1: email
                })
                .addFilter({
                    fieldName: this.columns.website.fieldName,
                    operator: 'is',
                    value1: site
                })
                .addFilter({
                    fieldName: this.columns.item.fieldName,
                    operator: 'is',
                    value1: item
                })
                .search();
            var results = search.getResults();

            return results && results.length > 0;
        },

        // A "page" of back in stock records that their customer is not already "resolved". Meaning that it was not yet
        // analized if they needed a new lead, or they go to a current one, or they were logged
        getNotProcessedLines: function getNotProcessedLines(from, to) {
            var search = new SearchHelper()
                .setRecord(this.record)
                .setColumns(this.columns)
                .setSort('created')
                .setSortOrder('asc')
                .setFilters([{
                    fieldName: this.columns.isinactive.fieldName,
                    operator: 'is',
                    value1: 'F'
                }, {
                    fieldName: this.columns.processed.fieldName,
                    operator: 'is',
                    value1: 'F'
                }]);

            return search.searchRange(from, to).getResults();
        },

        // get a page of BIS notifications, for a website, that are ready to be sent
        getPendingEmails: function getPendingEmails(website, from, to) {
            // TODO: see what happens without "multiple locations" feature

            // We have to get the list of locations that have stock available for webstore
            // otherwise the item will still be out of stock in the website
            // even if we have stock on backend
            // This cannot be achieved just with a join

            var isLocationsActivated = nlapiGetContext().getFeature('locations');
            var qtyAvailableFieldName = isLocationsActivated ? 'locationquantityavailable' : 'quantityavailable';
            var locations;
            var locationIds;

            var filters = [{
                fieldName: 'isinactive',
                operator: 'is',
                value1: 'F'
            }, {
                // not sent
                fieldName: 'custrecord_ef_bs_s_sent',
                operator: 'is',
                value1: 'F'
            }, {
                // but already processed
                fieldName: 'custrecord_ef_bs_s_processed',
                operator: 'is',
                value1: 'T'
            }, {
                // item online
                fieldName: 'isinactive',
                joinKey: 'custrecord_ef_bs_s_item',
                operator: 'is',
                value1: 'F'
            }, {
                // item online
                fieldName: 'isonline',
                joinKey: 'custrecord_ef_bs_s_item',
                operator: 'is',
                value1: 'T'
            }, {
                // with stock more than 0
                fieldName: qtyAvailableFieldName,
                joinKey: 'custrecord_ef_bs_s_item',
                operator: 'greaterthan',
                summary: 'sum',
                value1: '0'
            }];

            var columns = JSON.parse(JSON.stringify(this.columns)); // Deep clone
            var search;

            if (isLocationsActivated) {
                locations = BackInStockNotificationLocation.getWebstoreAvailableLocations();
                locationIds = _.map(locations, function mapLocation(location) {
                    return location.internalid;
                });

                filters.push({
                    // and on a web location
                    fieldName: 'inventorylocation',
                    joinKey: 'custrecord_ef_bs_s_item',
                    operator: 'anyof',
                    value1: locationIds
                });
            }

            // we're grouping by everything
            _.each(columns, function eachColumns(column) {
                column.summary = 'group';
            });

            _.extend(columns, {
                webstoreQty: {
                    fieldName: qtyAvailableFieldName,
                    joinKey: 'custrecord_ef_bs_s_item',
                    summary: 'sum'
                }
            });
            // Except for the quantity, that has to be added

            search = new SearchHelper()
                .setRecord(this.record)
                .setColumns(columns)
                .setFilters(filters)
                // sort by item, to use item "cache" as loading an item is expensive
                .setSort(this.columns.item.fieldName)
                .setSortOrder('asc');

            return search.searchRange(from, to).getResults();
        },

        markAsSent: function markAsSent(internalid) {
            // Mark sent and mark date sent
            nlapiSubmitField(this.record, internalid, [
                this.columns.sent.fieldName,
                this.columns.dateSent.fieldName
            ], [
                'T',
                nlapiDateToString(new Date(), 'datetimetz')
            ]);
        }
    });
});
