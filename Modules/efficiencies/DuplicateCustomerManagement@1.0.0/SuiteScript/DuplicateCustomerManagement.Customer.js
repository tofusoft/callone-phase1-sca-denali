define('DuplicateCustomerManagement.Customer', [
    'SC.Model',
    'DuplicateCustomerManagement.Configuration',
    'SearchHelper',
    'underscore'
], function DuplicateCustomerManagementCustomer(
    SCModel,
    DuplicateCustomerManagementConfiguration,
    SearchHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        record: 'customer',
        name: 'DCMCustomer',

        columns: {
            internalid: {
                fieldName: 'internalid'
            },
            giveaccess: {
                fieldName: 'giveaccess'
            }
        },

        /*
         data: user to register data
         ignoreKeys: (optional) to avoid in specific case

         DuplicateCustomerManagementConfiguration.duplicate_criteria
         */
        getDuplicated: function getDuplicated(data, ignoreKeys) {
            var context = nlapiGetContext();
            var columns;
            var Search;
            var self;

            // Protect us from getting nasty undefined errors
            if (DuplicateCustomerManagementConfiguration.criteria.subsidiary && !context.getFeature('SUBSIDIARIES')) {
                delete DuplicateCustomerManagementConfiguration.criteria.subsidiary;
            }

            // Protect us from getting nasty undefined errors
            if (DuplicateCustomerManagementConfiguration.criteria.language && !context.getFeature('MULTILANGUAGE')) {
                delete DuplicateCustomerManagementConfiguration.criteria.language;
            }

            // Protect us from getting nasty undefined column errors
            if (DuplicateCustomerManagementConfiguration.criteria.currency && context.getFeature('MULTICURRENCY')) {
                delete DuplicateCustomerManagementConfiguration.criteria.currency;
            }

            // add all criteria columns - just for debug purposes.
            // if search column and search field don't match for a field, this can be a problem
            columns = _.clone(this.columns);

            _.each(DuplicateCustomerManagementConfiguration.criteria, function eachCriteria(value, key) {
                columns[key] = {
                    fieldName: key
                };
            });

            Search = new SearchHelper(this.record, null, columns);
            self = this;

            _.each(DuplicateCustomerManagementConfiguration.criteria, function eachCriteria2(value, key) {
                if (!_.contains(ignoreKeys, key)) {
                    // Check for the SAME value as the new registered user
                    if (value.type === 'same') {
                        Search.addFilter({
                            fieldName: key,
                            operator: 'is',
                            value1: data[key]
                        });
                    }

                    // Check for the value specified on the configuration
                    if (value.type === 'value') {
                        Search.addFilter({
                            fieldName: key,
                            operator: 'is',
                            value1: value.value
                        });
                    }
                }
            });

            // Duplicate email registration by default MUST check for giveaccess.
            // But we can use this module as a dependency for others, and then perhaps we don't need to check for dups.
            if (ignoreKeys && !_.contains(ignoreKeys, 'giveaccess')) {
                Search.addFilter({
                    fieldName: self.columns.giveaccess.fieldName,
                    operator: 'is',
                    value1: 'T'
                });
            }

            Search.setSort('createdat').setSortOrder('asc');

            return Search.search().getResults();
        }
    });
});
