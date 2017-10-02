define('SearchHelper', [
    'underscore'
], function SearchHelperDefine(
    _
) {
    'use strict';

    var SearchHelper = function SearchHelper(
        record,
        filters,
        columns,
        fieldset,
        resultsPerPage,
        page,
        sort,
        sortOrder
    ) {
        this.setRecord(record);
        this.setFilters(filters);
        this.setColumns(columns);
        this.setFieldset(fieldset);
        this.setResultsPerPage(resultsPerPage);
        this.setPage(page);
        this.setSort(sort);
        this.setSortOrder(sortOrder);
    };

    SearchHelper.prototype.setSort = function setSort(sort) {
        this._sortField = sort;
        return this;
    };

    SearchHelper.prototype.setSortOrder = function setSortOrder(sortOrder) {
        this._sortOrder = sortOrder;
        return this;
    };

    SearchHelper.prototype.setResultsPerPage = function setResultsPerPage(resultsPerPage) {
        this.resultsPerPage = resultsPerPage;
        return this;
    };

    SearchHelper.prototype.setPage = function setPage(page) {
        this.page = page;
        return this;
    };

    SearchHelper.prototype.setFieldset = function setFieldset(fieldset) {
        this._fieldset = _.clone(fieldset);
        return this;
    };

    SearchHelper.prototype.setColumns = function setColumns(value) {
        this._columns = _.clone(value);
        return this;
    };

    SearchHelper.prototype.setFilters = function setFilters(value) {
        this._filters = _.clone(value);
        return this;
    };

    SearchHelper.prototype.addFilter = function addFilter(value) {
        this._filters = this._filters || [];
        this._filters.push(value);
        return this;
    };

    SearchHelper.prototype.addColumn = function addColumn(value) {
        this._columns = this._columns || [];
        this._columns.push(value);
        return this;
    };

    SearchHelper.prototype.setRecord = function setRecord(value) {
        this._record = value;
        return this;
    };

    SearchHelper.prototype.getResult = function getResult() {
        return this._lastResult && this._lastResult.length === 1 && this._lastResult[0];
    };

    SearchHelper.prototype.getResults = function getResults() {
        return this._lastResult;
    };

    SearchHelper.prototype.getResultsForListHeader = function getResultsForListHeader() {
        return {
            page: this.page,
            recordsPerPage: this.resultsPerPage,
            records: this._lastResult,
            totalRecordsFound: this.totalRecordsFound,
            order: this._sortOrder === 'desc' ? -1 : 1,
            sort: this._sortField
        };
    };

    SearchHelper.prototype.getColumns = function getColumns() {
        var self = this;
        return _.compact(_.map(this._columns, function mapColumn(v, k) {
            // fieldset column limit
            var column;
            if (self._fieldset && !_.contains(self._fieldset, k)) {
                return null;
            }

            column = new nlobjSearchColumn(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);

            if (v.sort || self._sortField === k) {
                if (v.sort) {
                    column.setSort(v.sort === 'desc');
                } else if (self._sortField === k) {
                    column.setSort(self._sortOrder === 'desc');
                }
            }
            if (v.formula) {
                column.setFormula(v.formula);
            }
            return column;
        }));
    };

    SearchHelper.prototype._mapResult = function _mapResult(list) {
        var self = this;
        var props = _.clone(this._columns);

        return (list && list.length && _.map(list, function mapResult(line) {
            return _.reduce(props, function reduce(o, v, k) {
                // Not in fieldset, move along
                if (self._fieldset && !_.contains(self._fieldset, k)) {
                    return o;
                }

                switch (v.type) {
                case 'listrecordToObject':
                case 'file':
                case 'object':
                    o[k] = {
                        internalid: line.getValue(
                            v.fieldName,
                            v.joinKey ? v.joinKey : null,
                            v.summary ? v.summary : null
                        ),
                        name: line.getText(
                            v.fieldName,
                            v.joinKey ? v.joinKey : null,
                            v.summary ? v.summary : null
                        )
                    };

                    break;
                case 'getText':
                case 'text':
                    o[k] = line.getText(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
                    break;

                // case 'getValue':
                default:
                    o[k] = line.getValue(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
                    break;
                }

                if (v.applyFunction) {
                    o[k] = v.applyFunction(line, v, k);
                }

                return o;
            }, {});
        })) || [];
    };

    SearchHelper.prototype.getFilters = function getFilters() {
        return _.map(this._filters || [], function mapFilters(f) {
            var filter = new nlobjSearchFilter(
                f.fieldName,
                f.joinKey ? f.joinKey : null,
                f.operator,
                f.value1 ? f.value1 : null,
                f.value2 ? f.value2 : null
            );

            if (f.summary) {
                filter.setSummaryType(f.summary);
            }
            return filter;
        }) || [];
    };

    SearchHelper.prototype.searchRange = function searchRange(from, to) {
        var search = nlapiCreateSearch(this._record, this.getFilters(), this.getColumns());
        var results = search.runSearch();
        this._lastResult = this._mapResult(results.getResults(from, to));

        return this;
    };

    SearchHelper.prototype.search = function search() {
        var columns = this.getColumns();
        var filters = this.getFilters();
        var results;

        if (!this.resultsPerPage) {
            this._lastResult = this._mapResult(this._getAllSearchResults(this._record, filters, columns));
        } else {
            this.page = this.page || 1;
            results = this._getPaginatedSearchResults(
                this._record,
                filters,
                columns,
                this.resultsPerPage,
                this.page
            );
            this._lastResult = this._mapResult(results.records);
            this.totalRecordsFound = results.totalRecordsFound;
        }

        return this;
    };

    SearchHelper.prototype._searchUnion = function _searchUnion(target, array) {
        return target.concat(array);
    };

    SearchHelper.prototype._getPaginatedSearchResults = function _getPaginatedSearchResults(
        recordType,
        filters,
        columns,
        resultsPerPage,
        page,
        columnCount
    ) {
        var rangeStart = (page * resultsPerPage) - resultsPerPage;
        var rangeEnd = page * resultsPerPage;
        var doRealCount = _.any(columns, function doRealCount(column) {
            return column.getSummary();
        });
        var result = {
            page: page,
            recordsPerPage: resultsPerPage,
            records: []
        };
        var _columnCount;
        var countResult;
        var search;

        if (!doRealCount || columnCount) {
            _columnCount = columnCount || new nlobjSearchColumn('internalid', null, 'count');
            countResult = nlapiSearchRecord(recordType, null, filters, [_columnCount]);

            result.totalRecordsFound = parseInt(countResult[0].getValue(_columnCount), 10);
        }

        if (doRealCount || (result.totalRecordsFound > 0 && result.totalRecordsFound > rangeStart)) {
            search = nlapiCreateSearch(recordType, filters, columns).runSearch();
            result.records = search.getResults(rangeStart, rangeEnd);

            if (doRealCount && !columnCount) {
                result.totalRecordsFound = search.getResults(0, 1000).length;
            }
        }

        return result;
    };
    SearchHelper.prototype._getAllSearchResults = function _getAllSearchResults(recordType, filters, columns) {
        var search = nlapiCreateSearch(recordType, filters, columns);
        var searchRan;
        var bolStop = false;
        var intMaxReg = 1000;
        var intMinReg = 0;
        var result = [];
        var extras;

        search.setIsPublic(true);
        searchRan = search.runSearch();

        while (!bolStop && nlapiGetContext().getRemainingUsage() > 10) {
            // First loop get 1000 rows (from 0 to 1000), the second loop starts at 1001
            // to 2000 gets another 1000 rows and the same for the next loops
            extras = searchRan.getResults(intMinReg, intMaxReg);

            result = this._searchUnion(result, extras);
            intMinReg = intMaxReg;
            intMaxReg += 1000;
            // If the execution reach the the last result set stop the execution
            if (extras.length < 1000) {
                bolStop = true;
            }
        }

        return result;
    };

    return SearchHelper;
});


