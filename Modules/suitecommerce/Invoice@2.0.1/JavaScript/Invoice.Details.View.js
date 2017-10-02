/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Invoice
define('Invoice.Details.View'
,	[	'ReturnAuthorization.GetReturnableLines'
	,	'LivePayment.Model'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'Address.Details.View'
	,	'ItemViews.Cell.Navigable.View'
	
	,	'invoice_details.tpl'
	
	,	'Backbone'
	,	'underscore'
	]
, 	function (
		ReturnLinesCalculator
	,	LivePaymentModel
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	AddressDetailsView
	,	ItemViewsCellNavigableView

	,	invoice_details_tpl

	,	Backbone
	,	_
	)
{
	'use strict';
	//@class Invoice.Details.View @extends Backbone.View
	return Backbone.View.extend({
		
		//@property {Function} template
		template: invoice_details_tpl

	,	title: _('Invoice Details').translate()

		//@property {Object} events
	,	events: {
			'click [data-type="make-a-payment"]' : 'makeAPayment'
		}

		//@method initialize
	,   initialize: function (options)
		{
			this.application = options.application;
			this.navSource = options.referer === 'paidinvoices' ? '/paid-invoices' : '/invoices';
			BackboneCompositeView.add(this);
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'invoices';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
					text: _('Invoices').translate()
				,	href: this.navSource
				}
			,	{
					text: _('Invoice #$(0)').translate(this.model.get('order_number'))
				,	href: '/invoices/view/' + this.model.get('internalid')
				}
			];
		}
		//@method makeAPayment Mark the current invoice as selected (check) and start the payment wizard
	,	makeAPayment: function ()
		{
			LivePaymentModel.getInstance().selectInvoice(this.model.id);
		}

		//@method isReturnable Calculate based on the fulfillments and returns made, if the invoice accepts returns
	,	isReturnable: function ()
		{
			var returnable_calculator = new ReturnLinesCalculator(this.model, {notConsiderFulfillments: true});
			return returnable_calculator.calculateLines().validLines.length;
		}
		//@property {Object} childViews
	,	childViews: {
				'Billing.Address': function ()
				{
					return new AddressDetailsView({
							model: this.model.get('addresses').get(this.model.get('billaddress'))
						,	hideDefaults: true
						,	showSelect: false
						,	hideActions: true
					});
				}

			,	'Items.Collection': function ()
				{
					return new BackboneCollectionView({
							collection: this.model.get('lines')
						,	childView: ItemViewsCellNavigableView
						,	viewsPerRow: 1
						,	childViewOptions: {
								navigable: true

							,	detail1Title: _('Qty:').translate()
							,	detail1: 'quantity'

							,	detail2Title: _('Unit price').translate()
							,	detail2: 'rate_formatted'

							,	detail3Title: _('Amount:').translate()
							,	detail3: 'amount_formatted'
							}
					});
				}
		}

		//@method getContext @returns Invoice.Details.View.Context
	,	getContext: function ()
		{
			var payments = this.model.get('payments')
			,	credit_memos = this.model.get('credit_memos')
			,	deposit_applications = this.model.get('deposit_applications')
			,	show_adjustments = (payments && payments.length) || (credit_memos && credit_memos.length) || (deposit_applications && deposit_applications.length)
			,	is_open = this.model.get('internal_status') === 'open'
			,	paymentmethod = this.model.get('paymentmethods') && this.model.get('paymentmethods').findWhere({primary: true})
			,	lines = this.model.get('lines');

			//@class Invoice.Details.View.Context
			return {
					//@property {Invoice.Model} model
					model: this.model
					//@property {String} makeAPaymentPermissions
				,	makeAPaymentPermissions: 'transactions.tranCustPymt.2, transactions.tranCustInvc.1'
					//@property {Boolean} showInModal
				,	showInModal: !!this.inModal
					//@property {String} donwloadPdfUrl
				,	donwloadPdfUrl: _.getDownloadPdfUrl({asset:'invoice-details', 'id': this.model.get('internalid')})
					//@property {String} pageTitle 
				,	pageTitle: _('Invoice <span class="strong-text">#$(0)</span>').translate(this.model.get('order_number'))
					//@property {Boolean} isOpen
				,	isOpen: is_open
					//@property {Boolean} showCreatedFrom
				,	showCreatedFrom: !!(this.model.get('createdfrom') && this.model.get('createdfrom').id)
					//@property {Boolean} showDueDate
				,	showDueDate: !!this.model.get('dueDate')
					//@property {Boolean} showSaleRep
				,	showSaleRep: !!this.model.get('salesrep')
					//@property {Boolean} showSaleRepPhone
				,	showSaleRepPhone: !!(this.model.get('salesrep') && this.model.get('salesrep').phone)
					//@property {Boolean} showSaleRepName
				,	showSaleRepEmail: !!(this.model.get('salesrep') && this.model.get('salesrep').email)
					//@property {String} siteName
				,	siteName: this.application.getConfig('siteSettings.displayname')
					//@property {Boolean} showMemo
				,	showMemo: !!this.model.get('memo')
					//@property {Boolean} showTerms
				,	showTerms: !!(paymentmethod && paymentmethod.get('paymentterms'))
					//@property {String} termsName
				,	termsName: paymentmethod && paymentmethod.get('paymentterms') && paymentmethod.get('paymentterms').name || ''
					//@property {Boolean} showGiftcerticate
				,	showGiftcerticate: !!this.model.get('summary').giftcertapplied
					//@property {Boolean} showAdjustments
				,	showAdjustments: show_adjustments
					//@property {Boolean} showRequestReturnButton
				,	showRequestReturnButton: !!this.isReturnable()
					//@property {Boolean}
				,	showMakeAPaymentButton: !!(is_open && !this.inModal)
					//@property {Boolean} showBillingAddress
				,	showBillingAddress: !!this.model.get('addresses').get(this.model.get('billaddress'))
					//@property {Array} payments
				,	payments: payments
					//property {Boolean} showPayments
				,	showPayments: !!payments.length
					//@property {Array} payments
				,	creditMemos: credit_memos
					//property {Boolean} showCreditMemos
				,	showCreditMemos: !!credit_memos.length 
					//@property {Array} depositApplications
				,	depositApplications: deposit_applications
					//property {Boolean} showCreditMemos
				,	showDepositApplications: !!deposit_applications.length
					//@property {Boolean} showLines
				,	showLines: !!lines.length
					//@property {Boolean} linesLengthGreaterThan1
				,	linesLengthGreaterThan1: lines.length > 1
					//@property {OrderLine.Collection} lines
				,	lines: lines

			};
		}
	});
});
