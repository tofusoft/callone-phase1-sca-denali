/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderHistory.Model.js
// ----------
// Handles fetching orders
define(
	'OrderHistory.Model'
,	[	'Application'
	,	'Utils'
	,	'SC.Model'
	,	'StoreItem.Model'
	,	'ReturnAuthorization.Model'
	,	'Receipt.List'

	,	'underscore'
	]
,	function (
		Application
	,	Utils
	,	SCModel
	,	StoreItem
	,	ReturnAuthorization
	,	ReceiptList

	,	_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'OrderHistory'

	,	list: function (data)
		{
			data = data || {};
			// if the store has multiple currencies we add the currency column to the query
			var	isMultiCurrency = context.getFeature('MULTICURRENCY')
			,	total_field = isMultiCurrency ? 'fxamount' : 'total'
			,	filters = [
					new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
				,	new nlobjSearchFilter('mainline', null, 'is', 'T')
				]
			,	columns = [
					new nlobjSearchColumn('internalid')
				,	new nlobjSearchColumn('trackingnumbers')
				,	new nlobjSearchColumn('trandate')
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('status')
				,	new nlobjSearchColumn(total_field)
				];

			if (isMultiCurrency)
			{
				columns.push(new nlobjSearchColumn('currency'));
			}

			// if the site is multisite we add the siteid to the search filter
			Application.addFilterSite(filters);

			if (data.from && data.to)
			{
				var offset = new Date().getTimezoneOffset() * 60 * 1000;

				filters.push(new nlobjSearchFilter('trandate', null, 'within', new Date(parseInt(data.from, 10) + offset), new Date(parseInt(data.to, 10) + offset)));
			}

			switch (data.sort)
			{
				case 'number':
					columns[3].setSort(data.order > 0);
				break;

				case 'amount':
					columns[5].setSort(data.order > 0);
				break;

				default: //Date
					columns[2].setSort(data.order > 0);
			}

			var result = Application.getPaginatedSearchResults({
					record_type: 'salesorder'
				,	filters: filters
				,	columns: columns
				,	page: data.page || 1
				,	results_per_page : data.results_per_page
				});

			result.records = _.map(result.records || [], function (record)
			{
				return {
					internalid: record.getValue('internalid')
				,	date: record.getValue('trandate')
				,	order_number: record.getValue('tranid')
				,	status: record.getText('status')
				,	summary: {
						total: Utils.toCurrency(record.getValue(total_field))
					,	total_formatted: Utils.formatCurrency(record.getValue(total_field))
					}
					// we might need to change that to the default currency
				,	currency: isMultiCurrency ? {internalid: record.getValue('currency'), name: record.getText('currency')} : null
					// Normalizes tracking number's values
				,	trackingnumbers: record.getValue('trackingnumbers') ? record.getValue('trackingnumbers').split('<BR>') : null
				,	type: record.getRecordType()
				};
			});

			return result;
		}

	,	get: function (id)
		{
			var placed_order = nlapiLoadRecord('salesorder', id)
			,	result = this.createResult(placed_order);

			this.setAddresses(placed_order, result);
			this.setShippingMethods(placed_order, result);
			this.setLines(placed_order, result);
			this.setFulfillments(id, result);
			this.setUnFulfillments(result);
			this.setPaymentMethod(placed_order, result);
			this.setReceipts(result, placed_order);
			this.setReturnAuthorizations(result, placed_order);

			result.promocode = (placed_order.getFieldValue('promocode')) ? {
				internalid: placed_order.getFieldValue('promocode')
			,	name: placed_order.getFieldText('promocode')
			,	code: placed_order.getFieldText('couponcode')
			} : null;

			// convert the obejcts to arrays
			result.addresses = _.values(result.addresses);
			result.shipmethods = _.values(result.shipmethods);
			result.lines = _.values(result.lines);
			result.receipts = _.values(result.receipts);

			return result;
		}

	,	setPaymentMethod: function (placed_order, result)
		{
			return Utils.setPaymentMethodToResult(placed_order, result);
		}

	,	createResult: function (placed_order)
		{
			return {
				internalid: placed_order.getId()
			,	type: placed_order.getRecordType()
			,	trantype: placed_order.getFieldValue('type')
			,	order_number: placed_order.getFieldValue('tranid')
			,	purchasenumber: placed_order.getFieldValue('otherrefnum')
			,	dueDate: placed_order.getFieldValue('duedate')
			,	amountDue: Utils.toCurrency(placed_order.getFieldValue('amountremainingtotalbox'))
			,	amountDue_formatted: Utils.formatCurrency(placed_order.getFieldValue('amountremainingtotalbox'))
			,	memo: placed_order.getFieldValue('memo')
			,   date: placed_order.getFieldValue('trandate')
			,   status: placed_order.getFieldValue('status')
			,	isReturnable: this.isReturnable(placed_order)
			,	summary: {
					subtotal: Utils.toCurrency(placed_order.getFieldValue('subtotal'))
				,	subtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('subtotal'))

				,	taxtotal: Utils.toCurrency(placed_order.getFieldValue('taxtotal'))
				,	taxtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('taxtotal'))

				,	tax2total: Utils.toCurrency(0)
				,	tax2total_formatted: Utils.formatCurrency(0)

				,	shippingcost: Utils.toCurrency(placed_order.getFieldValue('shippingcost'))
				,	shippingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('shippingcost'))

				,	handlingcost: Utils.toCurrency(placed_order.getFieldValue('althandlingcost'))
				,	handlingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('althandlingcost'))

				,	estimatedshipping: 0
				,	estimatedshipping_formatted: Utils.formatCurrency(0)

				,	taxonshipping: Utils.toCurrency(0)
				,	taxonshipping_formatted: Utils.formatCurrency(0)

				,	discounttotal: Utils.toCurrency(placed_order.getFieldValue('discounttotal'))
				,	discounttotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('discounttotal'))

				,	taxondiscount: Utils.toCurrency(0)
				,	taxondiscount_formatted: Utils.formatCurrency(0)

				,	discountrate: Utils.toCurrency(0)
				,	discountrate_formatted: Utils.formatCurrency(0)

				,	discountedsubtotal: Utils.toCurrency(0)
				,	discountedsubtotal_formatted: Utils.formatCurrency(0)

				,	giftcertapplied: Utils.toCurrency(placed_order.getFieldValue('giftcertapplied'))
				,	giftcertapplied_formatted: Utils.formatCurrency(placed_order.getFieldValue('giftcertapplied'))

				,	total: Utils.toCurrency(placed_order.getFieldValue('total'))
				,	total_formatted: Utils.formatCurrency(placed_order.getFieldValue('total'))
				}

			,	currency: context.getFeature('MULTICURRENCY') ?
				{
					internalid: placed_order.getFieldValue('currency')
				,	name: placed_order.getFieldValue('currencyname')
				} : null
			};
		}

	,	isReturnable: function (placed_order)
		{
			var status_id = placed_order.getFieldValue('statusRef');
			return status_id !== 'pendingFulfillment' && status_id !== 'pendingApproval' && status_id !== 'closed';
		}

	,	setFulfillments: function (createdfrom, result)
		{
			var self = this

			,	filters = [
					new nlobjSearchFilter('createdfrom', null, 'is', createdfrom)
				,	new nlobjSearchFilter('cogs', null, 'is', 'F')
				,	new nlobjSearchFilter('shipping', null, 'is', 'F')
				,	new nlobjSearchFilter('shiprecvstatusline', null, 'is', 'F')
				]

			,	columns = [
					new nlobjSearchColumn('quantity')
				,	new nlobjSearchColumn('item')
				,	new nlobjSearchColumn('shipaddress')
				,	new nlobjSearchColumn('shipmethod')
				,	new nlobjSearchColumn('shipto')
				,	new nlobjSearchColumn('trackingnumbers')
				,	new nlobjSearchColumn('trandate')
				,	new nlobjSearchColumn('status')

					// Ship Address
				,	new nlobjSearchColumn('shipaddress')
				,	new nlobjSearchColumn('shipaddress1')
				,	new nlobjSearchColumn('shipaddress2')
				,	new nlobjSearchColumn('shipaddressee')
				,	new nlobjSearchColumn('shipattention')
				,	new nlobjSearchColumn('shipcity')
				,	new nlobjSearchColumn('shipcountry')
				,	new nlobjSearchColumn('shipstate')
				,	new nlobjSearchColumn('shipzip')
				]

			,	fulfillments = Application.getAllSearchResults('itemfulfillment', filters, columns)

			,	fulfillment_id = [];

			result.fulfillments = {};

			fulfillments.forEach(function (ffline)
			{
				if (ffline.getValue('status') === 'shipped')
				{
					var shipaddress = self.addAddress({
						internalid: ffline.getValue('shipaddress')
					,	country: ffline.getValue('shipcountry')
					,	state: ffline.getValue('shipstate')
					,	city: ffline.getValue('shipcity')
					,	zip: ffline.getValue('shipzip')
					,	addr1: ffline.getValue('shipaddress1')
					,	addr2: ffline.getValue('shipaddress2')
					,	attention: ffline.getValue('shipattention')
					,	addressee: ffline.getValue('shipaddressee')
					}, result);

					result.fulfillments[ffline.getId()] = result.fulfillments[ffline.getId()] || {
						internalid: ffline.getId()
					,	shipaddress: shipaddress
					,	shipmethod: {
							internalid : ffline.getValue('shipmethod')
						,	name : ffline.getText('shipmethod')
						}
					,	date: ffline.getValue('trandate')
					,	trackingnumbers: ffline.getValue('trackingnumbers') ? ffline.getValue('trackingnumbers').split('<BR>') : null
					,	lines: []
					};

					result.fulfillments[ffline.getId()].lines.push({
						item_id: ffline.getValue('item')
					,	quantity: ffline.getValue('quantity')
					,	rate: 0
					,	rate_formatted: Utils.formatCurrency(0)
					});

					fulfillment_id.push(ffline.getId());
				}
			});

			if (fulfillment_id.length)
			{
				filters = [
					new nlobjSearchFilter('internalid', null, 'anyof', createdfrom)
				,	new nlobjSearchFilter('fulfillingtransaction', null, 'anyof', fulfillment_id)
				];

				columns = [
					new nlobjSearchColumn('line')
				,	new nlobjSearchColumn('item')
				,	new nlobjSearchColumn('rate')
				,	new nlobjSearchColumn('fulfillingtransaction')
				];

				Application.getAllSearchResults('salesorder', filters, columns).forEach(function (line)
				{
					var foundline = _.find(result.fulfillments[line.getValue('fulfillingtransaction')].lines, function (ffline)
					{
						return ffline.item_id === line.getValue('item') && !ffline.line_id;
					});

					foundline.line_id = result.internalid + '_' + line.getValue('line');
					foundline.rate = parseFloat(line.getValue('rate'));
					foundline.rate_formatted = Utils.formatCurrency(foundline.rate);
					foundline.amount = foundline.rate * foundline.quantity;
					foundline.amount_formatted = Utils.formatCurrency(foundline.amount);
					delete foundline.item_id;
				});
			}

			result.fulfillments = _.values(result.fulfillments);
		}

	,	setUnFulfillments: function (result)
		{
			result.unfulfillments = [];

			result.lines.forEach(function (line)
			{
				if (line.isfulfillable)
				{
					var quantity_total = parseInt(line.quantity, 10)
					,	quantity = quantity_total;

					result.fulfillments.forEach(function (fulfillment)
					{
						fulfillment.lines.forEach(function (fulfillment_line)
						{
							if (line.internalid === fulfillment_line.line_id)
							{
								quantity -= fulfillment_line.quantity;
							}
						});
					});

					if (quantity > 0)
					{
						var line_copy = _.clone(line);
						line_copy.quantity_total = quantity_total;
						line_copy.quantity = quantity;
						line_copy.amount = line_copy.rate * quantity;
						line_copy.amount_formatted = Utils.formatCurrency(line_copy.amount);
						result.unfulfillments.push(line_copy);
					}
				}
			});
		}

	,	setLines: function (placed_order, result)
		{
			result.lines = {};
			var items_to_preload = []
			,	amount;

			for (var i = 1; i <= placed_order.getLineItemCount('item'); i++) {

				if (placed_order.getLineItemValue('item', 'itemtype', i) === 'Discount' && placed_order.getLineItemValue('item', 'discline', i))
				{
					var discline = placed_order.getLineItemValue('item', 'discline', i);

					amount = Math.abs(parseFloat(placed_order.getLineItemValue('item', 'amount', i)));

					result.lines[discline].discount = (result.lines[discline].discount) ? result.lines[discline].discount + amount : amount;
					result.lines[discline].total = result.lines[discline].amount + result.lines[discline].tax_amount - result.lines[discline].discount;
				}
				else
				{
					var rate = Utils.toCurrency(placed_order.getLineItemValue('item', 'rate', i))
					,	item_id = placed_order.getLineItemValue('item', 'item', i)
					,	item_type = placed_order.getLineItemValue('item', 'itemtype', i);

					amount = Utils.toCurrency(placed_order.getLineItemValue('item', 'amount', i));

					var	tax_amount = Utils.toCurrency(placed_order.getLineItemValue('item', 'tax1amt', i)) || 0
					,	total = amount + tax_amount;

					result.lines[placed_order.getLineItemValue('item', 'line', i)] = {
						internalid: placed_order.getLineItemValue('item', 'id', i)
					,   quantity: parseInt(placed_order.getLineItemValue('item', 'quantity', i), 10)

					,   rate: rate

					,   amount: amount

					,	tax_amount: tax_amount
					,	tax_rate: placed_order.getLineItemValue('item', 'taxrate1', i)
					,	tax_code: placed_order.getLineItemValue('item', 'taxcode_display', i)
					,	isfulfillable: placed_order.getLineItemValue('item', 'fulfillable', i) === 'T'

					,	discount: 0

					,	total: total

					,	item: item_id
					,	type: item_type
					,   options: Utils.getItemOptionsObject(placed_order.getLineItemValue('item', 'options', i))
					,   shipaddress: placed_order.getLineItemValue('item', 'shipaddress', i) ? result.listAddresseByIdTmp[placed_order.getLineItemValue('item', 'shipaddress', i)] : null
					,   shipmethod:  placed_order.getLineItemValue('item', 'shipmethod', i) || null
					};

					items_to_preload[item_id] = {
						id: item_id
					,	type: item_type
					};
				}

			}

			// Preloads info about the item
			this.store_item = StoreItem;

			items_to_preload = _.values(items_to_preload);

			this.store_item.preloadItems(items_to_preload);

			// The api wont bring disabled items so we need to query them directly
			var items_to_query = []
			,	self = this;

			_.each(result.lines, function (line)
			{
				if (line.item)
				{
					var item = self.store_item.get(line.item, line.type);
					if (!item || typeof item.itemid === 'undefined')
					{
						items_to_query.push(line.item);
					}
				}
			});

			if (items_to_query.length > 0)
			{
				var filters = [
						new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
					,	new nlobjSearchFilter('internalid', null, 'is', result.internalid)
					,	new nlobjSearchFilter('internalid', 'item', 'anyof', items_to_query)
					]

				,	columns = [
						new nlobjSearchColumn('internalid', 'item')
					,	new nlobjSearchColumn('type', 'item')
					,	new nlobjSearchColumn('parent', 'item')
					,	new nlobjSearchColumn('displayname', 'item')
					,	new nlobjSearchColumn('storedisplayname', 'item')
					,	new nlobjSearchColumn('itemid', 'item')
					]

				,	inactive_items_search = Application.getAllSearchResults('transaction', filters, columns);

				_.each(inactive_items_search, function (item)
				{
					var inactive_item = {
						internalid: item.getValue('internalid', 'item')
					,	type: item.getValue('type', 'item')
					,	displayname: item.getValue('displayname', 'item')
					,	storedisplayname: item.getValue('storedisplayname', 'item')
					,	itemid: item.getValue('itemid', 'item')
					};

					self.store_item.set(inactive_item);
				});
			}

			result.lines = _.values(result.lines);

			_.each(result.lines, function (line)
			{
				line.rate_formatted = Utils.formatCurrency(line.rate);
				line.amount_formatted = Utils.formatCurrency(line.amount);
				line.tax_amount_formatted = Utils.formatCurrency(line.tax_amount);
				line.discount_formatted = Utils.formatCurrency(line.discount);
				line.total_formatted = Utils.formatCurrency(line.total);
				line.item = self.store_item.get(line.item, line.type);
			});

			// remove the temporary address list by id
			delete result.listAddresseByIdTmp;
		}

	,	setShippingMethods: function (placed_order, result)
		{
			result.shipmethods = {};

			if (placed_order.getLineItemCount('shipgroup') <= 0)
			{
				result.shipmethods[placed_order.getFieldValue('shipmethod')] = {
					internalid: placed_order.getFieldValue('shipmethod')
				,	name: placed_order.getFieldText('shipmethod')
				,	rate: Utils.toCurrency(placed_order.getFieldValue('shipping_rate'))
				,	rate_formatted: Utils.formatCurrency(placed_order.getFieldValue('shipping_rate'))
				,	shipcarrier: placed_order.getFieldValue('carrier')
				};
			}

			for (var i = 1; i <= placed_order.getLineItemCount('shipgroup') ; i++)
			{
				result.shipmethods[placed_order.getLineItemValue('shipgroup', 'shippingmethodref', i)] = {
					internalid: placed_order.getLineItemValue('shipgroup', 'shippingmethodref', i)
				,    name: placed_order.getLineItemValue('shipgroup', 'shippingmethod', i)
				,    rate: Utils.toCurrency(placed_order.getLineItemValue('shipgroup', 'shippingrate', i))
				,    rate_formatted: Utils.formatCurrency(placed_order.getLineItemValue('shipgroup', 'shippingrate', i))
				,    shipcarrier: placed_order.getLineItemValue('shipgroup', 'shippingcarrier', i)
				};

			}

			result.shipmethod = placed_order.getFieldValue('shipmethod');
		}

	,	addAddress: function (address, result)
		{
			result.addresses = result.addresses || {};

			address.fullname = (address.attention) ? address.attention : address.addressee;
			address.company = (address.attention) ? address.addressee : null;

			delete address.attention;
			delete address.addressee;

			address.internalid =	(address.country || '')  + '-' +
									(address.state || '') + '-' +
									(address.city || '') + '-' +
									(address.zip || '') + '-' +
									(address.addr1 || '') + '-' +
									(address.addr2 || '') + '-' +
									(address.fullname || '') + '-' +
									(address.company || '');

			address.internalid = address.internalid.replace(/\s/g, '-');

			if (!result.addresses[address.internalid])
			{
				result.addresses[address.internalid] = address;
			}

			return address.internalid;
		}

	,	setAddresses: function (placed_order, result)
		{
			result.addresses = {};
			result.listAddresseByIdTmp ={};
			for (var i = 1; i <= placed_order.getLineItemCount('iladdrbook') ; i++)
			{
				// Adds all the addresses in the address book
				result.listAddresseByIdTmp[placed_order.getLineItemValue('iladdrbook', 'iladdrinternalid', i)] = this.addAddress({
					internalid: placed_order.getLineItemValue('iladdrbook', 'iladdrshipaddr', i)
				,	country: placed_order.getLineItemValue('iladdrbook', 'iladdrshipcountry', i)
				,	state: placed_order.getLineItemValue('iladdrbook', 'iladdrshipstate', i)
				,	city: placed_order.getLineItemValue('iladdrbook', 'iladdrshipcity', i)
				,	zip: placed_order.getLineItemValue('iladdrbook', 'iladdrshipzip', i)
				,	addr1: placed_order.getLineItemValue('iladdrbook', 'iladdrshipaddr1', i)
				,	addr2: placed_order.getLineItemValue('iladdrbook', 'iladdrshipaddr2', i)
				,	attention: placed_order.getLineItemValue('iladdrbook', 'iladdrshipattention', i)
				,	addressee: placed_order.getLineItemValue('iladdrbook', 'iladdrshipaddressee', i)
				}, result);
			}

			// Adds Bill Address
			result.billaddress = this.addAddress({
				internalid: placed_order.getFieldValue('billaddress')
			,	country: placed_order.getFieldValue('billcountry')
			,	state: placed_order.getFieldValue('billstate')
			,	city: placed_order.getFieldValue('billcity')
			,	zip: placed_order.getFieldValue('billzip')
			,	addr1: placed_order.getFieldValue('billaddr1')
			,	addr2: placed_order.getFieldValue('billaddr2')
			,	attention: placed_order.getFieldValue('billattention')
			,	addressee: placed_order.getFieldValue('billaddressee')
			}, result);

			// Adds Shipping Address
			result.shipaddress = (placed_order.getFieldValue('shipaddress')) ? this.addAddress({
				internalid: placed_order.getFieldValue('shipaddress')
			,	country: placed_order.getFieldValue('shipcountry')
			,	state: placed_order.getFieldValue('shipstate')
			,	city: placed_order.getFieldValue('shipcity')
			,	zip: placed_order.getFieldValue('shipzip')
			,	addr1: placed_order.getFieldValue('shipaddr1')
			,	addr2: placed_order.getFieldValue('shipaddr2')
			,	attention: placed_order.getFieldValue('shipattention')
			,	addressee: placed_order.getFieldValue('shipaddressee')
			}, result) : null;
		}

	,	setReceipts: function (result)
		{
			result.receipts = ReceiptList.list({
				orderid: result.internalid
			});

			return this;
		}

	,	setReturnAuthorizations: function (result)
		{
			result.returnauthorizations = ReturnAuthorization.list({
				createdfrom: result.internalid
			});

			return this;
		}
	});
});