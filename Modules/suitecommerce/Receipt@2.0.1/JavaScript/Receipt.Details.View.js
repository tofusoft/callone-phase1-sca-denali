/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Receipt
define(
	'Receipt.Details.View'
,	[	'OrderHistory.Details.View'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'GlobalViews.FormatPaymentMethod.View'
	,	'Address.Details.View'
	,	'ItemViews.Cell.Actionable.View'
	,	'Receipt.Details.Item.Summary.View'
	,	'Receipt.Details.Item.Actions.View'
	,	'LiveOrder.Model'
	,	'GlobalViews.Message.View'
	
	,	'receipt_details.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		OrderHistoryDetailsView
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	GlobalViewsFormatPaymentMethodView
	,	AddressView
	,	ItemViewsActionableView
	,	ReceiptDetailsItemSummaryView
	,	ReceiptDetailsItemActionsView
	,	LiveOrderModel
	,	GlobalViewsMessageView

	,	receipt_details_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	//@class Receipt.Details.View Views for receipt's details #extend Backbone.View
	return OrderHistoryDetailsView.extend({

		template: receipt_details_tpl

	,	title: _('Receipt Details').translate()

	,	attributes: {'class': 'OrderDetailsView'}

	,	events:{
			'click [data-action="addToCart"]': 'addToCart'
		}

	,	initialize: function (options)
		{
			this.application = options.application;
			BackboneCompositeView.add(this);
		}

	,	addToCart: function(event)
		{
			var target = jQuery(event.currentTarget)
			,	line = this.model.get('lines').get(target.data('line-id'))
			,	quantity = target.data('partial-quantity') || target.data('item-quantity')
			,	placeholder = target.closest('[data-type="order-item"]').find('[data-type="alert-placeholder"]')
			,	item_to_cart = line.get('item');

			item_to_cart.set('quantity', quantity);
			item_to_cart.setOptionsArray(line.get('options'), true);

			LiveOrderModel.getInstance().addItem(item_to_cart).done(function ()
			{
				var message = quantity > 1 ? 
					_('$(0) Items successfully added to <a href="#" data-touchpoint="viewcart">your cart</a><br/>').translate(quantity) :
					_('Item successfully added to <a href="#" data-touchpoint="viewcart">your cart</a></br>').translate();

				var alert = new GlobalViewsMessageView({
						message: message
					,	type: 'success'
					,	closable: true
				});

				alert.show(placeholder, 6000);
			});
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'receiptshistory';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
					text: _('Receipts').translate()
				,	href: '/receiptshistory'
				}
			,	{
					text: _('Receipt #$(0)').translate(this.model.get('order_number'))
				,	path: '/receiptshistory/view/' + this.model.get('id')
				}
			];
		}

	,	render: function ()
		{
			this.title = _('Receipt Details').translate();
			this.billaddress = this.model.get('addresses').get(this.model.get('billaddress'));
			this.paymentmethod = this.model.get('paymentmethods') && this.model.get('paymentmethods').findWhere({primary: true});

			Backbone.View.prototype.render.apply(this, arguments);
		}
	,	childViews: {
			'FormatPaymentMethod': function()
			{
				return new GlobalViewsFormatPaymentMethodView({model: this.paymentmethod});
			}
		,	'Address.View': function ()
			{
				return new AddressView({
					model: this.billaddress
				,	hideDefaults: true
				,	hideActions: true
				});
			}
		,	'Item.Details.Line': function ()
			{
				return new BackboneCollectionView({
					collection: this.model.get('lines')
				,	childView: ItemViewsActionableView
				,	childViewOptions:
					{
						SummaryView: ReceiptDetailsItemSummaryView
					,	ActionsView: ReceiptDetailsItemActionsView
					,	application: this.application
					,	navigable: true
					}
				});
			}
		}


		//@method getContext @return Receipt.Details.View.Context
	,	getContext: function ()
		{
			var	lines = this.model.get('lines').models;

			//@class Receipt.Details.View.Context
			return {
				//@property {Receipt.Model} model
				model: this.model
				//@property {Number} orderNumber
			,	orderNumber: this.model.get('order_number')
				//@property {String} date
			,	date: this.model.get('date')
				//@property {String} status
			,	status: this.model.get('status')
				//@property {Boolean} showPaymentMethod
			,	showPaymentMethod: !!this.paymentmethod
				//@property {Boolean} showBillingAddress
			,	showBillingAddress: !!this.billaddress
				//@property {String} subTotalFormatted
			,	subTotalFormatted: this.model.get('summary').subtotal_formatted
				//@property {Boolean} showDiscountTotal
			,	showDiscountTotal: !!(parseFloat(this.model.get('summary').discounttotal))
				//@property {String} discountTotalFormatted
			,	discountTotalFormatted: this.model.get('summary').discounttotal_formatted
				//@property {Boolean} showShippingCost
			,	showShippingCost: !!(parseFloat(this.model.get('summary').shippingcost))
				//@property {String} shippingCostFormatted
			,	shippingCostFormatted: this.model.get('summary').shippingcost_formatted
				//@property {Boolean} showHandlingCost
			,	showHandlingCost: !!(parseFloat(this.model.get('summary').handlingcost))
				//@property {String} handlingCostFormatted
			,	handlingCostFormatted: this.model.get('summary').handlingcost_formatted
				//@property {Boolean} showPromocode
			,	showPromocode: !!this.model.get('promocode')
				//@property {String} promocode
			,	promocode: this.model.get('promocode') && this.model.get('promocode').code
				//@property {String} taxTotalFormatted
			,	taxTotalFormatted: this.model.get('summary').taxtotal_formatted
				//@property {String} totalFormatted
			,	totalFormatted: this.model.get('summary').total_formatted
				//@property {String} downloadPDFURL
			,	pdfUrl: _.getDownloadPdfUrl({
					asset: 'receipt-details'
				,	trantype: this.model.get('trantype')
				,	label: encodeURIComponent(this.model.get('type_name'))
				,	id: this.model.get('internalid')
				})
				//@property {Boolean} showLines
			,	showLines: !!(lines && lines.length)
				//@property {Boolean} isLinesLengthGreaterThan1
			,	isLinesLengthGreaterThan1: !!(lines && lines.length > 1)
				//@property {Number} linesLength
			,	linesLength: lines ? lines.length : 0
				//@property {Boolean} showCollapsedItems
			,	showCollapsedItems: this.application.getConfig('collapseElements')
			};
		}
	});

});