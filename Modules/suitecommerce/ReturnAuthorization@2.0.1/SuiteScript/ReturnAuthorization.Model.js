/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ReturnAuthorization.Model.js
// ----------------
//
define(
	'ReturnAuthorization.Model'
,	['SC.Model', 'Utils', 'Application', 'StoreItem.Model']
,	function (SCModel, Utils, Application, StoreItem)
{
	'use strict';

	// @class ReturnAuthorization.Model Defines the model used by the ReturnAuthorization.Service.ss service
	// @extends SCModel
	return SCModel.extend({

		//@property {String} name
		name: 'ReturnAuthorization'

		//@property {Object} validation
	,	validation: {}

		//@method get 
		//@param id
		//@return {ReturnAuthorization.Model.Attributes}
	,	get: function (id)
		{
			var is_multicurrency = context.getFeature('MULTICURRENCY')
			,	amount_field = is_multicurrency ? 'fxamount' : 'amount'

			,	filters = [
					new nlobjSearchFilter('internalid', null, 'is', id)
				]

			,	columns = [
					// Basic info
					new nlobjSearchColumn('mainline')
				,	new nlobjSearchColumn('trandate')
				,	new nlobjSearchColumn('status')
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('memo')

					// Summary
				,	new nlobjSearchColumn('total')
				,	new nlobjSearchColumn('taxtotal')
				,	new nlobjSearchColumn('shippingamount')

					// Created from
				,	new nlobjSearchColumn('internalid', 'createdfrom')
				,	new nlobjSearchColumn('tranid', 'createdfrom')
				,	new nlobjSearchColumn('type', 'createdfrom')

					// Items
				,	new nlobjSearchColumn('internalid', 'item')
				,	new nlobjSearchColumn('type', 'item')
				,	new nlobjSearchColumn('quantity')
				,	new nlobjSearchColumn('options')
				,	new nlobjSearchColumn(amount_field)
				,	new nlobjSearchColumn('rate')
				];

			if (is_multicurrency)
			{
				columns.push(new nlobjSearchColumn('currency'));
			}

			var return_authorizations = Application.getAllSearchResults('returnauthorization', filters, columns)
			,	main_return_authorization = _.find(return_authorizations, function (return_authorization)
				{
					return return_authorization.getValue('mainline') === '*';
				});

			//@class ReturnAuthorization.Model.Attributes
			return {
				//@property {String} internalid
				internalid: main_return_authorization.getId()
				//@property {String} type The type of the ReturnAuthorization
			,	type: main_return_authorization.getRecordType()

				//@property {String} date The date of the ReturnAuthorization
			,	date: main_return_authorization.getValue('trandate')
				//@property {String} tranid The id of the ReturnAuthorization
			,	tranid: main_return_authorization.getValue('tranid')
				//@property {String} comment A comment for explaining the return
			,	comment: main_return_authorization.getValue('memo')

				//@property {ReturnAuthorization.Model.Attributes.Status} status The status of the ReturnAuthorization
				//@class ReturnAuthorization.Model.Attributes.Status
			,	status: {
					//@property {String} id The id of the status
					id: main_return_authorization.getValue('status')
					//@property {String} lable Description of the status
				,	label: main_return_authorization.getText('status')
				}
				//@class ReturnAuthorization.Model.Attributes

				//@property {Boolean} isCancelable Indicates if the ReturnAuthorization can be canceled
			,	isCancelable: this.isCancelable(main_return_authorization)
				//@property {ReturnAuthorization.Model.Attributes.CreatedFrom} createdfrom The Transaction from where was created
			,	createdfrom: this.getCreatedFrom(return_authorizations)
				//@property {ReturnAuthorization.Model.Attributes.Summary} summary Summary of the ReturnAuthorization
			,	summary: this.getSummary(main_return_authorization)
				//@propertyarray {Array<StoreItem.Model.Attributes>} lines The list of items to return
			,	lines: this.getLines(return_authorizations)
			};
			//@class ReturnAuthorization.Model
		}

		//@method isCancelable
		//@param record
		//@return {Boolean}
	,	isCancelable: function (record)
		{
			return record.getValue('status') === 'pendingApproval';
		}

		//@method getCreatedFrom
		//@param records
		//@return {ReturnAuthorization.Model.Attributes.CreatedFrom}
	,	getCreatedFrom: function (records)
		{
			var created_from = _.find(records, function (return_authorization)
			{
				return return_authorization.getValue('internalid', 'createdfrom');
			});

			if (created_from)
			{
				//@class ReturnAuthorization.Model.Attributes.CreatedFrom
				return {
					//@property {String} internalid
					internalid: created_from.getValue('internalid', 'createdfrom')
					//@property {String} tranid
				,	tranid: created_from.getValue('tranid', 'createdfrom')
					//@property {String} type
				,	type: created_from.getValue('type', 'createdfrom')
				};
				//@class ReturnAuthorization.Model
			}
		}

		//@method getLines
		//@param records
		//@return {Array<StoreItem.Model.Attributes>}
	,	getLines: function (records)
		{
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

		//@method getSummary
		//@param record
		//@return {ReturnAuthorization.Model.Attributes.Summary}
	,	getSummary: function (record)
		{
			var total =  Math.abs(record.getValue('total'))
			,	taxtotal =  Math.abs(record.getValue('taxtotal'))
			,	shipping =  Math.abs(record.getValue('shippingamount'));

			//@class ReturnAuthorization.Model.Attributes.Summary
			return {
				//@property {Number} total
				total: Utils.toCurrency(total)
				//@property {String} total_formatted
			,	total_formatted: Utils.formatCurrency(total)

				//@property {Number} taxtotal
			,	taxtotal: Utils.toCurrency(taxtotal)
				//@property {String} taxtotal_formatted
			,	taxtotal_formatted: Utils.formatCurrency(taxtotal)

				//@property {Number} shippingamount
			,	shippingamount: Utils.toCurrency(shipping)
				//@property {String} shippingamount_formatted
			,	shippingamount_formatted: Utils.formatCurrency(shipping)

				//@property {ReturnAuthorization.Model.Attributes.Summary.Currency} currency
				//@class ReturnAuthorization.Model.Attributes.Summary.Currency
			,	currency: context.getFeature('MULTICURRENCY') ? {
					//@property {String} internalid
					internalid: record.getValue('currency')
					//@property {String} name
				,	name: record.getText('currency')
				} : null
			};
			//@class ReturnAuthorization.Model
		}

		//@method update
		//@param id
		//@param data
		//@param headers
	,	update: function (id, data, headers)
		{
			if (data.status === 'cancelled')
			{
				nlapiRequestURL(SC.Configuration.returnAuthorizations.cancelUrlRoot + '/app/accounting/transactions/returnauthmanager.nl?type=cancel&id=' + id, null, headers);
			}
		}

		//@method create
		//@param data
		//@return {Number}
	,	create: function (data)
		{
			var return_authorization = nlapiTransformRecord(data.type, data.id, 'returnauthorization');

			this.setLines(return_authorization, data.lines);

			return_authorization.setFieldValue('memo', data.comments);

			return nlapiSubmitRecord(return_authorization);
		}

		//@method findLine
		//@param line_id
		//@param lines
		//@return {StoreItem.Model.Attributes}
	,	findLine: function (line_id, lines)
		{
			return _.findWhere(lines, {
				id: line_id
			});
		}

		//@method setLines
		//@param return_authorization
		//@param lines
		//@return {ReturnAuthorization.Model}
	,	setLines: function (return_authorization, lines)
		{
			var line_count = return_authorization.getLineItemCount('item')
			,	add_line = true
			,	i = 1;

			while (add_line && i <= line_count)
			{
				add_line = this.findLine(return_authorization.getLineItemValue('item', 'id', i), lines);

				if (add_line)
				{
					return_authorization.setLineItemValue('item', 'quantity', i, add_line.quantity);
					return_authorization.setLineItemValue('item', 'description', i, add_line.reason);
				}
				else
				{
					return_authorization.removeLineItem('item', i);
				}

				i++;
			}

			return !add_line ? this.setLines(return_authorization, lines) : this;
		}

		//@method list
		//@param {Object} data
		//@return {Object}
	,	list: function (data)
		{
			var is_multicurrency = context.getFeature('MULTICURRENCY')

			,	amount_field = is_multicurrency ? 'fxamount' : 'amount'

			,	filters = [
					new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
				]

			,	columns = [
					new nlobjSearchColumn('internalid', 'item')
				,	new nlobjSearchColumn('type', 'item')
				,	new nlobjSearchColumn('parent', 'item')
				,	new nlobjSearchColumn('displayname', 'item')
				,	new nlobjSearchColumn('storedisplayname', 'item')
				,	new nlobjSearchColumn('internalid')
				,	new nlobjSearchColumn('taxtotal')
				,	new nlobjSearchColumn('rate')
				,	new nlobjSearchColumn('total')
				,	new nlobjSearchColumn('mainline')
				,	new nlobjSearchColumn('trandate')
				,	new nlobjSearchColumn('internalid')
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('status')
				,	new nlobjSearchColumn('options')
				,	new nlobjSearchColumn('linesequencenumber').setSort()
				,	new nlobjSearchColumn(amount_field)
				,	new nlobjSearchColumn('quantity')
				]

			,	return_authorizations = null;

			if (data.createdfrom)
			{
				filters.push(new nlobjSearchFilter('createdfrom', null, 'anyof', data.createdfrom));
			}

			this.setDateFromTo(data.from, data.to, filters);

			switch (data.sort)
			{
				case 'number':
					columns[12].setSort(data.order > 0);
				break;

				default:
					columns[10].setSort(data.order > 0);
					columns[11].setSort(data.order > 0);
			}

			if (is_multicurrency)
			{
				columns.push(new nlobjSearchColumn('currency'));
			}

			if (data.page)
			{
				filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));

				return_authorizations = Application.getPaginatedSearchResults({
					record_type: 'returnauthorization'
				,	filters: filters
				,	columns: columns
				,	page: data.page
				});

				return_authorizations.records = _.map(return_authorizations.records, function (record)
				{
					var total =  Math.abs(record.getValue('total'));
					return {
						internalid: record.getId()
					,	status: record.getText('status')
					,	tranid: record.getValue('tranid')
					,	date: record.getValue('trandate')

					,	summary: {
							total: Utils.toCurrency(total)
						,	total_formatted: Utils.formatCurrency(total)
						}

					,	currency: is_multicurrency ? {
							internalid: record.getValue('currency')
						,	name: record.getText('currency')
						} : null
					};
				});
			}
			else
			{
				return_authorizations = this.parseResults(Application.getAllSearchResults('returnauthorization', filters, columns));
				_.each(return_authorizations, this.toAbsoluteValues);
			}

			return return_authorizations;
		}


	,	toAbsoluteValues: function(return_authorization)
		{
			_.each(return_authorization.lines, function(return_authorization_line)
			{
				if(return_authorization_line.amount)
				{
					return_authorization_line.amount = Math.abs(return_authorization_line.amount);
					return_authorization_line.amount_formatted =  Utils.formatCurrency(return_authorization_line.amount);
				}

				if(return_authorization_line.tax_amount)
				{
					return_authorization_line.tax_amount = Math.abs(return_authorization_line.tax_amount);
					return_authorization_line.tax_amount_formatted = Utils.formatCurrency(return_authorization_line.tax_amount);
				}

				if(return_authorization_line.total)
				{
					return_authorization_line.total = Math.abs(return_authorization_line.total);
					return_authorization_line.total_formatted = Utils.formatCurrency(return_authorization_line.total);	
				}
			});
		}

		//@method setDateFromTo
		//@param {String} from
		//@param {String} to
		//@param {Array} filters
	,	setDateFromTo: function (from, to, filters)
		{
			if (from)
			{
				filters.push(new nlobjSearchFilter('trandate', null, 'onorafter', this.setDateInt(from), null));
			}

			if (to)
			{
				filters.push(new nlobjSearchFilter('trandate', null, 'onorbefore', this.setDateInt(to), null));
			}
		}

		//@method setDateInt
		//@param {String} date
		//@return {Date}
	,	setDateInt: function (date)
		{
			var offset = new Date().getTimezoneOffset() * 60 * 1000;

			return new Date(parseInt(date, 10) + offset);
		}

		//@method parseResults
		//@param {Array} return_authorizations
		//@return {Array}
	,	parseResults: function (return_authorizations)
		{
			var return_address = context.getPreference('returnaddresstext')
			,	is_multicurrency = context.getFeature('MULTICURRENCY')
			,	amount_field = is_multicurrency ? 'fxamount' : 'amount'
			,	return_authorization_id = 0
			,	current_return = null
			,	grouped_result = {};

			// the query returns the transaction headers mixed with the lines so we have to group the returns authorization
			_.each(return_authorizations, function (returnauthorization)
			{
				return_authorization_id = returnauthorization.getId();
				// create the return authorization
				if (!grouped_result[return_authorization_id])
				{
					grouped_result[return_authorization_id] = {lines: []};
				}

				current_return = grouped_result[return_authorization_id];

				// asterisk means true
				if (returnauthorization.getValue('mainline') === '*' || !current_return.internalid)
				{
					// if it's the mainline we add some fields
					_.extend(current_return, {
						internalid: returnauthorization.getValue('internalid')
					,	status: returnauthorization.getText('status')
					,	date: returnauthorization.getValue('trandate')
					,	summary: {
							total: Utils.toCurrency(returnauthorization.getValue('total'))
						,	total_formatted: Utils.formatCurrency(returnauthorization.getValue('total'))
						}
					,	type: 'returnauthorization'
					,	tranid: returnauthorization.getValue('tranid')
					,	currency: is_multicurrency ? {
							internalid: returnauthorization.getValue('currency')
						,	name: returnauthorization.getText('currency')
						} : null
					});

					// it the autorizhation is approved, add the return's information
					if (returnauthorization.getValue('status') !== 'pendingApproval')
					{
						current_return.order_number = returnauthorization.getValue('tranid');
						current_return.return_address = return_address;
					}
				}

				if (returnauthorization.getValue('mainline') !== '*')
				{
					// if it's a line, we add it to the lines collection of the return authorization
					current_return.lines.push({
						internalid: returnauthorization.getValue('internalid') + '_' + returnauthorization.getValue('linesequencenumber')
					,	quantity: Math.abs(returnauthorization.getValue('quantity'))
					,	rate: Utils.toCurrency(returnauthorization.getValue('rate'))
					,	rate_formatted: Utils.formatCurrency(returnauthorization.getValue('rate'))
					,	amount: Utils.toCurrency(returnauthorization.getValue(amount_field))
					,	amount_formatted: Utils.formatCurrency(returnauthorization.getValue(amount_field))
					,	tax_amount: Utils.toCurrency(returnauthorization.getValue('taxtotal'))
					,	tax_amount_formatted: Utils.formatCurrency(returnauthorization.getValue('taxtotal'))
					,	total: Utils.toCurrency(returnauthorization.getValue('total'))
					,	total_formatted: Utils.formatCurrency(returnauthorization.getValue('total'))

					,	options: Utils.getItemOptionsObject(returnauthorization.getValue('options'))
						// add item information to order's line, the storeitem collection was preloaded in the getOrderLines function
					,	item: StoreItem.get(
							returnauthorization.getValue('internalid', 'item')
						,	returnauthorization.getValue('type', 'item')
						)
					});
				}
			});

			return _.values(grouped_result);
		}
	});
});