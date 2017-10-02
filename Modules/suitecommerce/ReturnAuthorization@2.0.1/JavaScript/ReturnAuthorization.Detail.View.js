/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReturnAuthorization
define('ReturnAuthorization.Detail.View'
,	[	'ReturnAuthorization.Cancel.View'
	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'
	,	'ItemViews.Cell.Navigable.View'
	,	'SC.Configuration'

	,	'return_authorization_detail.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		CancelView
	,	BackboneCollectionView
	,	BackboneCompositeView
	,	ItemViewsCellNavigableView
	,	Configuration

	,	return_authorization_detail_tpl

	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';

	//@class ReturnAuthorization.Detail.View @extend Backbone.View
	return Backbone.View.extend({

		template: return_authorization_detail_tpl

	,	title: _('Return Details').translate()

	,	events: {
			'click [data-action="cancel"]': 'cancel'
		}

	,	attributes: {
			'class': 'ReturnAuthorizationDetail'
		}

	,	initialize: function (options)
		{
			this.application = options.application;
			BackboneCompositeView.add(this);
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'returns';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
					text: _('Returns').translate()
				,	href: '/returns'
				}
			,	{
					text: _('Return #$(0)').translate(this.model.get('tranid'))
				,	href: '/returns'
				}
			];
		}

	,	getRecordProperties: function()
		{
			var created_from = this.model.get('createdfrom')
			,	is_basic = this.application.getConfig('isBasic')
			,	properties = {
					record_url: ''
				,	record_label: _.translate('Invoice')
			};

			//site builder basic does not support invoice link
			if (!created_from || (is_basic && created_from.type === 'CustInvc'))
			{
				return properties;
			}

			switch(created_from.type)
			{
				case 'SalesOrd':
					properties.record_url = '/ordershistory/view/' + created_from.internalid;
					properties.record_label = _.translate('Order');
					break;

				case 'CashSale':
					properties.record_url = '/receiptshistory/view/' + created_from.internalid;
					properties.record_label = _.translate('Receipt');
					break;

				default: 
					properties.record_url = '/invoices/' + created_from.internalid;
					properties.record_label = _.translate('Invoice');
			}

			return properties;
		}

	,	cancel: function ()
		{
			new CancelView({
				application: this.application
			,	model: this.model
			}).showInModal('returns');

			this.model.once('sync', jQuery.proxy(this, 'redirect'));
		}

	,	redirect: function ()
		{
			Backbone.history.navigate('returns?cancel=' + this.model.get('internalid'), {trigger: true});
		}

	,	childViews: {
			'Items.Collection': function ()
			{
				return new BackboneCollectionView({
					collection: this.model.get('lines')
				,	childView: ItemViewsCellNavigableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true

					,	detail1Title: _('Qty:').translate()
					,	detail1: 'quantity'

					,	detail2Title: _('Reason').translate()
					,	detail2: 'reason'

					,	detail3Title: _('Amount:').translate()
					,	detail3: 'amount_formatted'
					}
				});
			}
		}

		//@method getContext @return ReturnAuthorization.Detail.View.Context
	,	getContext: function ()
		{
			var summary = this.model.get('summary')
			,	record_properties = this.getRecordProperties()
			,	lines_length = this. model.get('lines').length;

			//@class ReturnAuthorization.Detail.View.Context
			return {
				//@property {String} pageHeader
				pageHeader:  _('Return request <span class="strong-text return-number">#$(0)</span>').translate(this.model.get('tranid'))
				//@property {String} totalFormatted
			,	totalFormatted: summary.total_formatted
				//@property {String} taxTotalFormatted
			,	taxTotalFormatted: summary.taxtotal_formatted
				//@property {String} shippingAmountFormatted
			,	shippingAmountFormatted: summary.shippingamount_formatted
				//@property {String} createdFromURL
			,	createdFromURL: record_properties.record_url
				//@property {String} createdFromURL
			,	downloadPDFURL: _.getDownloadPdfUrl({
					asset: 'return-details'
				,	id: this.model.get('internalid')
				})
				//@property {Boolean} isCancelable
			,	isCancelable: this.model.get('isCancelable')
				//@property {Boolean} showCreatedFrom
			,	showCreatedFrom: !!this.model.get('createdfrom')
				//@property {String} createdFromLabel
			,	createdFromLabel: record_properties.record_label
				//@property {String} createdFromTranId
			,	createdFromTranId: this.model.get('createdfrom').tranid
				//@property {String} date
			,	date: this.model.get('date')
				//@property {String} status
			,	status: this.model.get('status').label
				//@property {Boolean} isElementCollapsed
			,	isElementCollapsed: Configuration.get('collapseElements')
				//@property {Number} linesLength
			,	linesLength: lines_length
				//@property {String} status
			,	comment: this.model.get('comment')
				//@property {Boolean} showOpenedAccordion
			,	showOpenedAccordion:  _.isTabletDevice() || _.isDesktopDevice()
				//@property {Boolean} linesLengthGreaterThan1
			,	linesLengthGreaterThan1: lines_length > 1
			};
		}
	});
});