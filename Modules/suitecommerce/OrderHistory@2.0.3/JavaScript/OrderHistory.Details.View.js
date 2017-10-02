/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.Details.View'
,	[
		'ReturnAuthorization.GetReturnableLines'
	,	'GlobalViews.FormatPaymentMethod.View'
	,	'Backbone.CollectionView'
	,	'Address.Details.View'
	,	'ItemViews.Cell.Actionable.View'
	,	'OrderHistory.Item.Actions.View'
	,	'ItemViews.Item.QuantityAmount.View'
	,	'OrderHistory.ReturnAutorization.View'
	,	'OrderHistory.ShippingGroup.View'
	,	'GlobalViews.Message.View'
	,	'Backbone.CompositeView'

	,	'order_history_details.tpl'
	,	'order_history_details_shipped_items.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Tracker'
	,	'LiveOrder.Model'
	]
,	function (
		ReturnLinesCalculator
	,	GlobalViewsFormatPaymentMethodView
	,	BackboneCollectionView
	,	AddressView
	,	ItemViewsCellActionableView
	,	OrderHistoryItemActionsView
	,	ItemViewsItemQuantityAmountView
	,	OrderHistoryReturnAutorizationView
	,	OrderHistoryShippingGroupView
	,	GlobalViewsMessageView
	,	BackboneCompositeView

	,	order_history_details_tpl
	,	order_history_details_shipped_items_tpl

	,	Backbone
	,	_
	,	jQuery
	,	Tracker
	,	LiveOrderModel
	)
{
	'use strict';

	//@class OrderHistory.Details.View @extend Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: order_history_details_tpl

		//@property {String} title
	,	title: _('Order Details').translate()

		//@property {String} page_header
	,	page_header: _('Order Details').translate()

		//@property {Object} attributes
	,	attributes: {
			'class': 'OrderDetailsView'
		}

		//@property {Object} events
	,	events: {
			'click [data-action="add-to-cart"]': 'addToCart'
		,	'click [data-action="go-to-returns"] a': 'goToReturns'
		}

		//@method getReturnAuthorizations
	,	getReturnAuthorizations: function ()
		{
			var return_authorizations = this.model.get('returnauthorizations')
			,	total_lines = 0;

			return_authorizations.each(function (return_authorization)
			{
				total_lines += return_authorization.get('lines') ? return_authorization.get('lines').length : 0;
			});

			return_authorizations.totalLines = total_lines;

			return return_authorizations;
		}
		//@method getNonShippableItems
	,	getNonShippableItems: function ()
		{

			var self = this;
			if (!this.non_shippable)
			{
				this.non_shippable = [];

				this.model.get('lines').each(function (line)
				{
					if (!line.get('isfulfillable'))
					{
						self.non_shippable.push(line);
					}
				});
			}
			return this.non_shippable;
		}
		//@method getFulfillmentAddresses
	,	getFulfillmentAddresses: function ()
		{
			var self = this;
			if (!this.fulfillmentAddresses)
			{
				this.fulfillmentAddresses = [];
				var ordershipaddress = this.model.get('shipaddress') && this.model.get('addresses').get(this.model.get('shipaddress')) ? this.model.get('shipaddress') : null;

				// For single ship-to, we need all  the fulfillments in a single accordion
				if (ordershipaddress)
				{
					self.fulfillmentAddresses.push(ordershipaddress);
				}
				else
				{
					this.model.get('fulfillments').each(function (fulfillment)
					{
						self.fulfillmentAddresses.push(fulfillment.get('shipaddress'));
					});
					this.fulfillmentAddresses = _.uniq(this.fulfillmentAddresses);
				}
			}
			return this.fulfillmentAddresses;
		}
		//@method getFulfillments
	,	getFulfillments: function (address)
		{

			var fulfillments = []
			,	self = this;

			this.model.get('fulfillments').each(function (fulfillment)
			{
				//For single ship-to, ignore the fact that the fulfillment must match the address, we show all fulfillments in the same accordion
				if ((self.model.get('shipaddress') || fulfillment.get('shipaddress') === address) && !fulfillment.get('is_pending'))
				{
					fulfillments.push(fulfillment);
				}
			});
			return fulfillments;
		}
		//@method getUnfulfilled
	,	getUnfulfilled: function ()
		{
			return this.model.get('unfulfillments');
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'ordershistory';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
						text: _('Order History').translate()
					,	href: '/ordershistory'
				}
			, 	{
						text: '#' + this.model.get('order_number')
					,	href :'/ordershistory/view/' + this.model.get('id')
				}
			];
		}

		//@method render
	,	render: function ()
		{
			this.paymentmethod = this.model.get('paymentmethods') && this.model.get('paymentmethods').findWhere({primary: true});
			this.billaddress = this.model.get('addresses').get(this.model.get('billaddress'));
			this.shipaddress = this.model.get('addresses').get(this.model.get('shipaddress'));

			Backbone.View.prototype.render.apply(this, arguments);
		}
		//@method trackEventReorder
	,	trackEventReorder: function (item)
		{
			item && Tracker.getInstance().trackEvent({
				category: 'Reorder'
			,	action: 'button'
			,	label: item.get('_url') + item.getQueryString()
			,	value: 1
			});
		}
		//@method addToCart
	,	addToCart: function (e)
		{
			e.preventDefault();

			var	self = this
			,	line_id = this.$(e.target).data('line-id')
			,	$form = this.$(e.target).closest('[data-type="order-item"]')
			,	$alert_placeholder = $form.find('[data-type=alert-placeholder]')
			,	quantity = this.$(e.target).data('partial-quantity') || this.$(e.target).data('item-quantity')
			,	selected_line = this.model.get('lines').get(line_id)
			,	item_to_cart = selected_line.get('item');

			item_to_cart.set('quantity', quantity);
			item_to_cart.setOptionsArray(selected_line.get('options'), true);

			LiveOrderModel.getInstance().addItem(item_to_cart).done(function ()
			{
				self.trackEventReorder(item_to_cart);

				var message = quantity > 1 ? 
					_('$(0) Items successfully added to <a href="#" data-touchpoint="viewcart">your cart</a><br/>').translate(quantity) :
					_('Item successfully added to <a href="#" data-touchpoint="viewcart">your cart</a></br>').translate();

				var alert = new GlobalViewsMessageView({
						message: message
					,	type: 'success'
					,	closable: true
				});

				alert.show($alert_placeholder, 6000);
			});

		}

		//@method goToReturns scroll the page up to the order's return
	,   goToReturns: function (e)
		{
			e.preventDefault();

			var $return_authorizations_header = this.$('[data-target="#returns-authorizations"]').first();
			this.$('#returns-authorizations').first().collapse('show');

			jQuery('html, body').animate({
				scrollTop: $return_authorizations_header.offset().top
			}, 500);
		}
		//@method initialize
	,   initialize: function (options)
		{
			this.application = options.application;

			BackboneCompositeView.add(this);
		}

		//@method isReturnable indicates if the order accepts returns or not
	,	isReturnable: function ()
		{
			var returnable_calculator = new ReturnLinesCalculator(this.model);

			return this.model.get('isReturnable') && returnable_calculator.calculateLines().validLines.length;
		}
		//@property {Object} childViews
	,	childViews: {
			'FormatPaymentMethod': function()
			{
				return new GlobalViewsFormatPaymentMethodView({model: this.paymentmethod});
			}

		,	'Billing.Address.View': function ()
			{
				return new AddressView({
					model: this.billaddress
				,	hideDefaults: true
				,	hideActions: true
				});
			}
		,	'Shipping.Address.View': function ()
			{
				return new AddressView({
					model: this.shipaddress
				,	hideDefaults: true
				,	hideActions: true
				});
			}

		,	'NonShippableItems': function ()
			{
				return new BackboneCollectionView({
					collection: this.getNonShippableItems()
				,	childView: ItemViewsCellActionableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true
					,	application: this.application
					,	SummaryView: ItemViewsItemQuantityAmountView
					,	ActionsView: OrderHistoryItemActionsView
					}
				});
			}

		,	'UnfulfilledItems': function ()
			{
				return new BackboneCollectionView({
					collection: this.getUnfulfilled()
				,	childView: ItemViewsCellActionableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true
					,	application: this.application
					,	SummaryView: ItemViewsItemQuantityAmountView
					,	ActionsView: OrderHistoryItemActionsView
					,	hideComparePrice: true
					,	useLinePrice: true
					}
				});
			}

		,	'ReturnAutorization': function ()
			{
				return new BackboneCollectionView({
					collection: this.getReturnAuthorizations()
				,	childView: OrderHistoryReturnAutorizationView
				,	viewsPerRow: 1

				});
			}

		,	'ShippingGroups': function ()
			{
				var self = this
				,	collection = _.map(this.getFulfillmentAddresses(),  function (fulfillment_address_id)
					{
						var fulfillments = self.getFulfillments(fulfillment_address_id)
						,	shipping_address = self.model.get('addresses').get(fulfillment_address_id);

						fulfillments = _.map(fulfillments, function (fulfillment)
						{
							var shipmethod = fulfillment.get('shipmethod');

							if (shipmethod && shipmethod.internalid && self.model.get('shipmethods')._byId[shipmethod.internalid])
							{
								fulfillment.set('shipmethod', self.model.get('shipmethods')._byId[shipmethod.internalid]);
							}
							else
							{
								fulfillment.set('shipmethod', new Backbone.Model(shipmethod));
							}


							var lines = _.map(fulfillment.get('lines'), function (fulfillment_line)
							{
								var line = self.model.get('lines').get(fulfillment_line.line_id);

								if (line)
								{
									return {
										item: line.get('item')
									,	id: line.id
									,	options: line.get('options')
									,	partial_quantity: fulfillment_line.partial_quantity
									,	quantity: fulfillment_line.quantity
									,	rate: fulfillment_line.rate || line.get('rate')
									,	rate_formatted: fulfillment_line.rate_formatted || line.get('rate_formatted')
									,	amount: fulfillment_line.amount || line.get('amount')
									,	amount_formatted: fulfillment_line.amount_formatted || line.get('amount_formatted')
									,	total: line.get('total')
									,	total_formatted: line.get('total_formatted')
									,	discount: line.get('discount')
									,	discount_formatted: line.get('discount_formatted')
									,	reorder: line.get('item').get('_isPurchasable')
									,	type: line.get('type')
									};
								}
							});

							fulfillment.set('lines', _.compact(lines));

							return fulfillment;
						});

						return {
								fulfillments: fulfillments
							,	shippingAddress: shipping_address
							,	showOrderShipAddress: !!self.model.get('shipaddress')
							,	id: fulfillment_address_id

						};
					});


				return new BackboneCollectionView({
					collection: collection
				,	childView: OrderHistoryShippingGroupView
				,	cellTemplate: order_history_details_shipped_items_tpl
				,	viewsPerRow: 1
				,	childViewOptions:
					{
						application: this.application
					}
				});
			}
		}

		//@method getContext @returns OrderHistory.Details.View.Context
	,	getContext: function()
		{
			var lines = this.model.get('lines')
			,	self = this
			,	return_authorizations = this.getReturnAuthorizations()
			,	any_line_purchasable = lines.any(function (line)
				{
					return line.get('item').get('_isPurchasable');
				})
			,	all_gift_certificates = lines.all(function (line)
				{
					return line.get('item').get('itemtype') === 'GiftCert';
				})
			,	non_shippable_items = this.getNonShippableItems()
			,	unfulfilled = this.getUnfulfilled()
			,	is_basic = self.application.getConfig('isBasic')
			,	payment_transactions = this.model.get('receipts').map(function (record)
				{
					var is_invoice = record.get('recordtype') === 'CustInvc'
					,	hide_link = is_basic && is_invoice
					,	link = '';

					if (is_invoice)
					{
						link = is_basic ? undefined : ('invoices/' + record.get('internalid'));
					}
					else
					{
						link = '/receiptshistory/view/' + record.get('internalid');
					}


					record.set('showLink', !hide_link);
					record.set('link', link);
					record.set('isInvoice', is_invoice);
					record.set('dataType', is_invoice && !is_basic ? 'invoice' : 'receipt');

					return record;
				})
			,	order_ship_method = this.model.get('shipmethod')
			,	delivery_method_name = '';


			if (order_ship_method && this.model.get('shipmethods')._byId[order_ship_method])
			{
				delivery_method_name = this.model.get('shipmethods')._byId[order_ship_method].getFormattedShipmethod();
			}
			else if (order_ship_method && order_ship_method.name)
			{
				delivery_method_name = order_ship_method.name;
			}
			//@class OrderHistory.Details.View.Context
			return {
					//@property {OrderHistory.Model} model
					model : this.model
					//@property {Boolean} showNonShippableItems
				,	showNonShippableItems: !!non_shippable_items.length
					//@property {Array} nonShippableItems
				,	nonShippableItems: non_shippable_items
					//@property {Boolean} nonShippableItemsLengthGreaterThan1
				,	nonShippableItemsLengthGreaterThan1: non_shippable_items.length > 1
					//@property {Array} fulfillmentAddresses
				,	fulfillmentAddresses: this.getFulfillmentAddresses()
					//@property {Array} unfulfilledItems
				,	unfulfilledItems: unfulfilled
					//@property {Boolean} showUnfulfilledItems
				,	showUnfulfilledItems: !!unfulfilled.length
					//@property {Boolean} unfulfilledItemsLengthGreaterThan1
				,	unfulfilledItemsLengthGreaterThan1: unfulfilled.length > 1
					//@property {OrderLine.Collection} lines
				,	lines: lines
					//@property {Boolean} collapseElements
				,	collapseElements: this.application.getConfig('collapseElements')
					//@property {String} pdfUrl
				,	pdfUrl: _.getDownloadPdfUrl({
						asset: 'order-details'
					,	id: this.model.get('internalid')
					})
					//@property {Address.Model} billAddress
				,	billAddress: this.model.get('billaddress') ? this.model.get('addresses').get(this.model.get('billaddress'))  : null
					//@property {Boolean} showOrderShipAddress
				,	showOrderShipAddress: !!this.model.get('shipaddress')
					//@property {Address.Model} orderShipaddress
				,	orderShipaddress: this.model.get('shipaddress') ? this.model.get('addresses').get(this.model.get('shipaddress')) : null
					//@property {Boolean} showReturnAuthorizations
				,	showReturnAuthorizations: !!return_authorizations.length
					//@property {Object} returnAuthorizations
				,	returnAuthorizations: return_authorizations
					//@property {Boolean} çshowReorderAllItemsButton
				,	showReorderAllItemsButton: any_line_purchasable && !all_gift_certificates
					//@property {Boolean} showRequestReturnButton
				,	showRequestReturnButton: !!this.isReturnable()
					//@property {Boolean} showPaymentTransactions
				,	showPaymentTransactions: !!payment_transactions.length
					//@property {Boolean} paymentTransactions
				,	paymentTransactions: payment_transactions
					//@property {Array} showSummaryDiscount
				,	showSummaryDiscount: !!this.model.get('summary').discounttotal
					//@property {Boolean} showSummaryShippingCost
				,	showSummaryShippingCost: !!this.model.get('summary').shippingcost
					//@property {Boolean} showSummaryHandlingCost
				,	showSummaryHandlingCost: !!this.model.get('summary').handlingcost
					//@property {Boolean} showSummaryGiftCertificateTotal
				,	showSummaryGiftCertificateTotal: !!this.model.get('summary').giftcertapplied
					//@property {Boolean} showSummaryPromocode
				,	showSummaryPromocode: !!this.model.get('promocode')
					//@property {String} deliveryMethodName
				,	deliveryMethodName: delivery_method_name || ''
					//@property {Boolean} showDeliveryMethod
				,	showDeliveryMethod: !!delivery_method_name

			};
		}

	});

});
