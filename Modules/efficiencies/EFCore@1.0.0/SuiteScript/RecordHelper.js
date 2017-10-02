/**
* Same concept as SearchHelper but for records that sadly have to be loaded whole to get correct info.
* Try to avoid it's use.
*/
define('RecordHelper', function RecordHelperDefine() {
    'use strict';

    function RecordHelper(record, fields, fieldset) {
        this.setRecord(record);
        this.setFields(fields);
        this.setFieldset(fieldset);
    }

    RecordHelper.prototype.setFieldset = function setFieldset(fieldset) {
        this._fieldset = require('underscore').clone(fieldset);
        return this;
    };

    RecordHelper.prototype.setFields = function setFields(value) {
        this._fields = require('underscore').clone(value);
        return this;
    };

    RecordHelper.prototype.addField = function addField(value) {
        this._fields = this._fields || [];
        this._fields.push(value);
        return this;
    };

    RecordHelper.prototype.setRecord = function setRecord(value) {
        this._record = value;
        return this;
    };

    RecordHelper.prototype.getResult = function getResult() {
        return this._lastResult && this._lastResult.length === 1 && this._lastResult[0];
    };

    RecordHelper.prototype.getResults = function getResults() {
        return this._lastResult;
    };

    RecordHelper.prototype._mapResult = function _mapResult(list) {
        var self = this;
        var _ = require('underscore');
        var props = _.clone(this._fields);

        return (list && list.length && _.map(list, function mapList(record) {
            var ret = _.reduce(props, function reduceProps(o, v, k) {
                var values;
                var ids;
                var names;

                // Not in fieldset, move along
                if (self._fieldset && !_.contains(self._fieldset, k)) {
                    return o;
                }

                switch (v.type) {
                case 'listrecordToObject':
                case 'file':
                case 'object':
                    o[k] = {
                        internalid: record.getFieldValue(v.fieldName),
                        name: record.getFieldText(v.fieldName)
                    };

                    break;

                case 'objects':
                    values = [];
                    ids = record.getFieldValues(v.fieldName);
                    names = record.getFieldTexts(v.fieldName);

                    _.each(ids, function eachIds(anId, index) {
                        values.push({
                            internalid: ids[index],
                            name: names[index]
                        });
                    });
                    o[k] = values;

                    break;

                case 'getText':
                case 'text':
                    o[k] = record.getFieldText(v.fieldName);

                    break;

                case 'getTexts':
                case 'texts':
                    o[k] = record.getFieldTexts(v.fieldName);

                    break;

                case 'getValues':
                case 'values':
                    o[k] = record.getFieldValues(v.fieldName);

                    break;

                // case 'getValue':
                default:
                    o[k] = record.getFieldValue(v.fieldName);

                    break;
                }

                if (v.applyFunction) {
                    o[k] = v.applyFunction(record, v, k);
                }

                return o;
            }, {});

            ret.internalid = record.getId() + '';

            return ret;
        })) || [];
    };

    RecordHelper.prototype.get = function get(id) {
        this.search([id]);
    };

    RecordHelper.prototype.getRecord = function getRecord(id) {
        return this._lastResultRecords[id];
    };

    RecordHelper.prototype.search = function search(ids) {
        var self = this;
        var results = [];
        var _ = require('underscore');

        this._lastResultRecords = [];

        _.each(ids, function eachIds(id) {
            var temp;
            if (_.isObject(id)) {
                temp = nlapiLoadRecord(id.type, id.id);
            } else {
                // Cheating for "subclasses" like items heh.
                temp = nlapiLoadRecord(self._record, id);
            }
            results.push(temp);
            self._lastResultRecords[temp.getId()] = temp;
        });

        this._lastResult = this._mapResult(results);

        return this;
    };

    return RecordHelper;
});
