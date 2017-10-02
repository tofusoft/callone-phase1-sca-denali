/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ReorderItems.Model.js
// ----------
// Handles fetching of ordered items
define(
	'ReorderItems.Model'
,	['SC.Model', 'Application', 'StoreItem.Model', 'Utils']
,	function (SCModel, Application, StoreItem, Utils)
{
	'use strict';

	// @class ReorderItems.Model Defines the model used by the ReorderItems.Service.ss service
	// @extends SCModel
	return SCModel.extend({

		//@property {String} name
		name: 'OrderItem'

		//@method search
		//@param {String} order_id
		//@param {String} query
		//@param {Object} query_filters
		//@return {Array<ReorderItems.Model.Attributes>}
	,	search: function (order_id, query, query_filters)
		{
			var filters = [
					new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
				,	new nlobjSearchFilter('quantity', null, 'greaterthan', 0)
				,	new nlobjSearchFilter('mainline', null, 'is', 'F')
				,	new nlobjSearchFilter('cogs', null, 'is', 'F')
				,	new nlobjSearchFilter('taxline', null, 'is', 'F')
				,	new nlobjSearchFilter('shipping', null, 'is', 'F')
				,	new nlobjSearchFilter('transactiondiscount', null, 'is', 'F')
				,	new nlobjSearchFilter('isonline', 'item', 'is', 'T')
				,	new nlobjSearchFilter('isinactive', 'item', 'is', 'F')
				,   new nlobjSearchFilter('type', 'item', 'noneof', 'GiftCert')
				]

			,	columns = [
					new nlobjSearchColumn('internalid', 'item', 'group')
				,	new nlobjSearchColumn('type', 'item', 'group')
				,	new nlobjSearchColumn('parent', 'item', 'group')
				,	new nlobjSearchColumn('options', null, 'group')
				// to sort by price we fetch the max onlinecustomerprice
				,	new nlobjSearchColumn('onlinecustomerprice', 'item', 'max')
				// to sort by recently purchased we grab the last date the item was purchased
				,	new nlobjSearchColumn('trandate', null, 'max')
				// to sort by frequently purchased we count the number of orders which contains an item
				,	new nlobjSearchColumn('internalid', null, 'count')
				]

			,	item_name =  new nlobjSearchColumn('formulatext','item', 'group');

			// when sorting by name, if the item has displayname we sort by that field, if not we sort by itemid
			item_name.setFormula('case when LENGTH({item.storedisplayname}) > 0 then {item.storedisplayname} else (case when LENGTH({item.displayname}) > 0 then {item.displayname} else {item.itemid} end) end');

			columns.push(item_name);

			// if the site is multisite we add the siteid to the search filter
			Application.addFilterItem(filters);
			Application.addFilterSite(filters);

			// show only items from one order
			if (order_id)
			{
				filters.push(new nlobjSearchFilter('internalid', null, 'is', order_id));
				columns.push(new nlobjSearchColumn('tranid', null, 'group'));
			}

			if (query_filters.date.from && query_filters.date.to)
			{
				var offset = new Date().getTimezoneOffset() * 60 * 1000;
				filters.push(new nlobjSearchFilter('trandate', null, 'within', new Date(parseInt(query_filters.date.from, 10) + offset), new Date(parseInt(query_filters.date.to, 10) + offset)));
			}

			if (query)
			{
				filters.push(
					new nlobjSearchFilter('itemid', 'item', 'contains', query).setLeftParens(true).setOr(true)
				,	new nlobjSearchFilter('displayname', 'item', 'contains', query).setRightParens(true)
				);
			}

			// select field to sort by
			switch (query_filters.sort)
			{
				// sort by name
				case 'name':
					item_name.setSort(query_filters.order > 0);
				break;

				// sort by price
				case 'price':
					columns[4].setSort(query_filters.order > 0);
				break;

				// sort by recently purchased
				case 'date':
					columns[5].setSort(query_filters.order > 0);
				break;

				// sort by frequenlty purchased
				case 'quantity':
					columns[6].setSort(query_filters.order > 0);
				break;

				default:
					columns[6].setSort(true);
				break;
			}
			// fetch items
			var result = Application.getPaginatedSearchResults({
					record_type: 'salesorder'
				,	filters: filters
				,	columns: columns
				,	page: query_filters.page
				,	column_count: new nlobjSearchColumn('formulatext', null, 'count').setFormula('CONCAT({item}, {options})')
				})
			// prepare an item collection, this will be used to preload item's details
			,	items_info = _.map(result.records, function (line)
				{
					return {
						id: line.getValue('internalid', 'item', 'group')
					,	type: line.getValue('type', 'item', 'group')
					};
				});

			if (items_info.length)
			{
				// preload order's items information
				StoreItem.preloadItems(items_info);

				result.records = _.map(result.records, function (line)
				{
					// prepare the collection for the frontend
					//@class ReorderItems.Model.Attributes
					return {
							//@property {StoreItem} item
							item: StoreItem.get( line.getValue('internalid', 'item', 'group'), line.getValue('type', 'item', 'group') )
							//@property {String} tranid
						,	tranid: line.getValue('tranid', null, 'group') ||  null
							//@property {Array<Utils.ItemOptionsObject>} options 
						,	options: Utils.getItemOptionsObject( line.getValue('options', null, 'group') )
							//@property {String} trandate
						,	trandate: line.getValue('trandate', null, 'max')
					};
					//@class ReorderItems.Model
				});
			}

			return result;
		}
	});
});

