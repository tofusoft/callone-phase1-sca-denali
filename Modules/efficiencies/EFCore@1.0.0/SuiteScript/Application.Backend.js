/*
    © 2015 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

/* exported forbiddenError, unauthorizedError, notFoundError, methodNotAllowedError, invalidItemsFieldsAdvancedName */
/* jshint -W079 */

// Default error objects

// @class globals

// @class unauthorizedError @extends Application.Error
var unauthorizedError = {
    // @property {Number} status
    status: 401,
    // @property {String} code
    code: 'ERR_USER_NOT_LOGGED_IN',
    // @property {String} message
    message: 'Not logged In'
};


// @class forbiddenError @extends Application.Error
var forbiddenError = {
    // @property {Number} status
    status: 403,
    // @property {String} code
    code: 'ERR_INSUFFICIENT_PERMISSIONS',
    // @property {String} message
    message: 'Insufficient permissions'
};

// @class notFoundError @extends Application.Error
var notFoundError = {
    // @property {Number} status
    status: 404,
    // @property {String} code
    code: 'ERR_RECORD_NOT_FOUND',
    // @property {String} message
    message: 'Not found'
};

// @class methodNotAllowedError @extends Application.Error
var methodNotAllowedError = {
    // @property {Number} status
    status: 405,
    // @property {String} code
    code: 'ERR_METHOD_NOT_ALLOWED',
    // @property {String} message
    message: 'Sorry, you are not allowed to perform this action.'
};

// @class invalidItemsFieldsAdvancedName @extends Application.Error
var invalidItemsFieldsAdvancedName = {
    // @property {Number} status
    status: 500,
    // @property {String} code
    code: 'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME',
    // @property {String} message
    message: 'Please check if the fieldset is created.'
};

// This stands for SuiteCommerce
var SC = {};

define('Application.Backend', [
    'underscore',
    'Events',
    'Configuration',
    'Console'
], function ApplicationFn(
    _,
    Events
) {
    'use strict';

    // @class Application @extends Events
    // The Application object contains high level functions to interact with low level suitescript and Commerce API
    // like obtaining all the context environment information, sending http responses,
    // defining http errors, searching with paginated results, etc.
    var Application = _.extend({

        init: function init() {},

        // @method getPermissions @return {transactions: Object, lists: Object}
        getPermissions: function getPermissions() {
            var context = nlapiGetContext();

            return {
                transactions: {
                    tranCashSale: context.getPermission('TRAN_CASHSALE'),
                    tranCustCred: context.getPermission('TRAN_CUSTCRED'),
                    tranCustDep: context.getPermission('TRAN_CUSTDEP'),
                    tranCustPymt: context.getPermission('TRAN_CUSTPYMT'),
                    tranStatement: context.getPermission('TRAN_STATEMENT'),
                    tranCustInvc: context.getPermission('TRAN_CUSTINVC'),
                    tranItemShip: context.getPermission('TRAN_ITEMSHIP'),
                    tranSalesOrd: context.getPermission('TRAN_SALESORD'),
                    tranEstimate: context.getPermission('TRAN_ESTIMATE'),
                    tranRtnAuth: context.getPermission('TRAN_RTNAUTH'),
                    tranDepAppl: context.getPermission('TRAN_DEPAPPL'),
                    tranSalesOrdFulfill: context.getPermission('TRAN_SALESORDFULFILL'),
                    tranFind: context.getPermission('TRAN_FIND')
                },
                lists: {
                    regtAcctRec: context.getPermission('REGT_ACCTREC'),
                    regtNonPosting: context.getPermission('REGT_NONPOSTING'),
                    listCase: context.getPermission('LIST_CASE'),
                    listContact: context.getPermission('LIST_CONTACT'),
                    listCustJob: context.getPermission('LIST_CUSTJOB'),
                    listCompany: context.getPermission('LIST_COMPANY'),
                    listIssue: context.getPermission('LIST_ISSUE'),
                    listCustProfile: context.getPermission('LIST_CUSTPROFILE'),
                    listExport: context.getPermission('LIST_EXPORT'),
                    listFind: context.getPermission('LIST_FIND'),
                    listCrmMessage: context.getPermission('LIST_CRMMESSAGE')
                }
            };
        },

        // SERVICES

        // @method sendContent writes the given content in the request object using the right headers, and content type
        // @param {String} content
        // @param {Object} options
        sendContent: function sendContent(content, options) {
            // Default options
            var theOptions = _.extend({
                status: 200,
                cache: false
            }, options || {});
            // The content type will be here
            var contentType = false;
            var responseContent;

            // Triggers an event for you to know that there is content being sent
            Application.trigger('before:Application.sendContent', content, theOptions);

            // We set a custom status
            response.setHeader('Custom-Header-Status', parseInt(theOptions.status, 10).toString());

            // If its a complex object we transform it into an string
            if (_.isArray(content) || _.isObject(content)) {
                contentType = 'JSON';
                responseContent = JSON.stringify(content);
            }

            // If you set a jsonp callback this will honor it
            if (request.getParameter('jsonp_callback')) {
                contentType = 'JAVASCRIPT';
                responseContent = request.getParameter('jsonp_callback') + '(' + content + ');';
            }

            // Set the response chache option
            if (theOptions.cache) {
                response.setCDNCacheable(theOptions.cache);
            }

            // Content type was set so we send it
            contentType && response.setContentType(contentType);

            response.write(responseContent);

            Application.trigger('after:Application.sendContent', responseContent, theOptions);
        },

        // @method processError builds an error object suitable to send back in the http response.
        // @param {nlobjError|Application.Error}
        // @returns {errorStatusCode:Number,errorCode:String,errorMessage:String} an error object
        // suitable to send back in the http response.
        processError: function processError(e) {
            var status = 500;
            var code = 'ERR_UNEXPECTED';
            var message = 'error';
            var error;
            var content;

            if (e instanceof nlobjError) {
                code = e.getCode();
                message = e.getDetails();
            } else if (_.isObject(e) && !_.isUndefined(e.status)) {
                status = e.status;
                code = e.code;
                message = e.message;
            } else {
                error = nlapiCreateError(e);
                code = error.getCode();
                message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
            }

            if (status === 500 && code === 'INSUFFICIENT_PERMISSION') {
                status = forbiddenError.status;
                code = forbiddenError.code;
                message = forbiddenError.message;
            }

            content = {
                errorStatusCode: parseInt(status, 10).toString(),
                errorCode: code,
                errorMessage: message
            };

            if (e.errorDetails) {
                content.errorDetails = e.errorDetails;
            }

            return content;
        },


        // @method sendError process the error and then writes it in the http response
        // @param {nlobjError|Application.Error}
        sendError: function sendError(e) {
            var content;
            var contentType;

            // @event before:Application.sendError
            Application.trigger('before:Application.sendError', e);

            content = Application.processError(e);
            contentType = 'JSON';

            response.setHeader('Custom-Header-Status', content.errorStatusCode);

            if (request.getParameter('jsonp_callback')) {
                contentType = 'JAVASCRIPT';
                content = request.getParameter('jsonp_callback') + '(' + JSON.stringify(content) + ');';
            } else {
                content = JSON.stringify(content);
            }

            response.setContentType(contentType);

            response.write(content);

            // @event before:Application.sendError
            Application.trigger('after:Application.sendError', e);
        },

        // SEARCHES

        // @method getPaginatedSearchResults
        // @param {page:Number,columns:Array<nlobjSearchColumn>,filters:Array<nlobjSearchFilter>,
        // record_type:String,results_per_page:Number} options
        // @returns {records:Array<nlobjSearchResult>,totalRecordsFound:Number,page:Number}
        getPaginatedSearchResults: function getPaginatedSearchResults(options) {
            var theOptions = options || {};
            var resultsPerPage = theOptions.results_per_page || SC.Configuration.results_per_page;
            var page = theOptions.page || 1;
            var columns = theOptions.columns || [];
            var filters = theOptions.filters || [];
            var recordType = theOptions.record_type;
            var rangeStart = (page * resultsPerPage) - resultsPerPage;
            var rangeEnd = page * resultsPerPage;
            var doRealCount = _.any(columns, function anyColumn(column) {
                return column.getSummary();
            });
            var result = {
                page: page,
                recordsPerPage: resultsPerPage,
                records: []
            };
            var columnCount;
            var countResult;
            var search;

            if (!doRealCount || theOptions.column_count) {
                columnCount = theOptions.column_count || new nlobjSearchColumn('internalid', null, 'count');
                countResult = nlapiSearchRecord(recordType, null, filters, [columnCount]);

                result.totalRecordsFound = parseInt(countResult[0].getValue(columnCount), 10);
            }

            if (doRealCount || (result.totalRecordsFound > 0 && result.totalRecordsFound > rangeStart)) {
                search = nlapiCreateSearch(recordType, filters, columns).runSearch();
                result.records = search.getResults(rangeStart, rangeEnd);

                if (doRealCount && !theOptions.column_count) {
                    result.totalRecordsFound = search.getResults(0, 1000).length;
                }
            }

            return result;
        },

        // @method getAllSearchResults
        // @param {String} recordType
        // @param {Array<nlobjSearchFilter>} filters
        // @param {Array<nlobjSearchColumn>} columns
        // @return {Array<nlobjSearchResult>}
        getAllSearchResults: function getAllSearchResults(recordType, filters, columns) {
            var search = nlapiCreateSearch(recordType, filters, columns);
            var searchRan = search.runSearch();
            var bolStop = false;
            var intMaxReg = 1000;
            var intMinReg = 0;
            var result = [];
            var context = nlapiGetContext();
            var extras;

            search.setIsPublic(true);

            searchRan = search.runSearch();

            while (!bolStop && context.getRemainingUsage() > 10) {
                // First loop get 1000 rows (from 0 to 1000), the second loop starts at 1001 to 2000
                // gets another 1000 rows and the same for the next loops
                extras = searchRan.getResults(intMinReg, intMaxReg);

                result = Application.searchUnion(result, extras);
                intMinReg = intMaxReg;
                intMaxReg += 1000;
                // If the execution reach the the last result set stop the execution
                if (extras.length < 1000) {
                    bolStop = true;
                }
            }

            return result;
        },

        // TODO: implement the below code for backend
        //
        // // @method addFilterSite @param adds filters to current search filters so it matches given site ids.
        // // @param {Array<String>} filters
        // addFilterSite: function(filters) {
        //     var search_filter_array = this.getSearchFilterArray();

        //     search_filter_array.length && filters.push(new nlobjSearchFilter('website', null, 'anyof', search_filter_array));
        // },

        // // @method addFilterSite @param adds filters to current search filters so it matches given website item ids.
        // // @param {Array<String>} filters
        // addFilterItem: function(filters) {
        //     var search_filter_array = this.getSearchFilterArray();

        //     search_filter_array.length && filters.push(new nlobjSearchFilter('website', 'item', 'anyof', search_filter_array));
        // },

        // // @method getSearchFilterArray @return {Array<String>} current record search filters array taking in account multi site feature
        // getSearchFilterArray: function() {
        //     var context = nlapiGetContext(),
        //         site_id = session.getSiteSettings(['siteid']).siteid,
        //         filter_site = SC.Configuration.filter_site,
        //         search_filter_array = [];

        //     // Validate if: MULTISITE, site_id, filter_site and also if filter_site is different of 'all'
        //     if (context.getFeature('MULTISITE') && site_id && filter_site && 'all' !== filter_site) {
        //         search_filter_array = filter_site instanceof Array ? filter_site : [];
        //         search_filter_array.push(site_id, '@NONE@');
        //     }

        //     return _.uniq(search_filter_array);
        // },

        // @method searchUnion utility method for unite two arrays @param {Array} target @param {Array} array
        searchUnion: function searchUnion(target, array) {
            return target.concat(array); // TODO: use _.union
        }

    }, Events);

    return Application;
});

// @class Application.Error a high level error object that can be processed and
// written in the response using processError and sendError methods
