/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.List.View'
,	[	'ItemDetails.Model'
	,	'SC.Configuration'
	,	'GlobalViews.Pagination.View'
	,	'GlobalViews.ShowingCurrent.View'
	,	'TrackingServices'
	,	'ListHeader.View'
	,	'ReturnAuthorization.GetReturnableLines'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'OrderHistory.List.Tracking.Number.View'
	,	'RecordViews.Actionable.View'
	,	'Handlebars'

	,	'order_history_list.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		ItemDetailsModel
	,	Configuration
	,	GlobalViewsPaginationView
	,	GlobalViewsShowingCurrentView
	,	TrackingServices
	,	ListHeaderView
	,	ReturnLinesCalculator
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	OrderHistoryListTrackingNumberView
	,	RecordViewsActionableView
	,	Handlebars

	,	order_history_list_tpl

	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';

	//@class OrderHistory.List.View view list of orders @extend Backbone.View
	return  Backbone.View.extend({
		//@property {Function} template
		template: order_history_list_tpl
		//@property {String} title
	,	title: _('Order History').translate()
		//@property {String} className
	,	className: 'OrderListView'
		//@property {String} page_header
	,	page_header: _('Order History').translate()
		//@property {Object} attributes
	,	attributes: {
			'class': 'OrderListView'
		}
		//@property {Object} events
	,	events: {
			'click [data-action="navigate"]': 'navigateToOrder'
		}
		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'ordershistory';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {
					text: this.title
				,	href: '/ordershistory'
			};
		}
		//@method initialize
	,	initialize: function (options)
		{
			this.application = options.application;

			this.collection = options.collection;

			var isoDate = _.dateToString(new Date());

			this.rangeFilterOptions = {
				fromMin: '1800-01-02'
			,	fromMax: isoDate
			,	toMin: '1800-01-02'
			,	toMax: isoDate
			};

			this.listenCollection();

			// Manages sorting and filtering of the collection
			this.listHeader = new ListHeaderView({
				view: this
			,	application: this.application
			,	collection: this.collection
			,	sorts: this.sortOptions
			,	rangeFilter: 'date'
			,	rangeFilterLabel: _('From').translate()
			,	hidePagination: true
			});

			BackboneCompositeView.add(this);
		}
		//@method navigateToOrder
	,	navigateToOrder: function (e)
		{
			//ignore clicks on anchors and buttons
			if (_.isTargetActionable(e))
			{
				return;
			}

			if (!jQuery(e.target).closest('[data-type="accordion"]').length)
			{
				var order_id = jQuery(e.target).closest('[data-id]').data('id');
				Backbone.history.navigate('#ordershistory/view/' + order_id, {trigger:true});
			}
		}
		//@method listenCollection
	,	listenCollection: function ()
		{
			this.setLoading(true);

			this.collection.on({
				request: jQuery.proxy(this, 'setLoading', true)
			,	reset: jQuery.proxy(this, 'setLoading', false)
			});
		}
		//@method setLoading
	,	setLoading: function (value)
		{
			this.isLoading = value;
		}
		//@property {Array} sortOptions
		// Array of default sort options
		// sorts only apply on the current collection
		// which might be a filtered version of the original
	,	sortOptions: [
			{
				value: 'date'
			,	name: _('Sort By Date').translate()
			,	selected: true
			}
		,	{
				value: 'number'
			,	name: _('Sort By Number').translate()
			}
		,	{
				value: 'amount'
			,	name: _('Sort By Amount').translate()
			}
		]
		//@property {Object} childViews
	,	childViews: {
			'ListHeader': function ()
			{
				return this.listHeader;
			}
		,	'GlobalViews.Pagination': function ()
			{
				return new GlobalViewsPaginationView(_.extend({
					totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
				}, Configuration.defaultPaginationSettings));
			}
		,	'GlobalViews.ShowCurrentPage': function ()
			{
				return new GlobalViewsShowingCurrentView({
					items_per_page: this.collection.recordsPerPage
		 		,	total_items: this.collection.totalRecordsFound
				,	total_pages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
				});
			}
		,	'Order.History.Results': function ()
			{
				var records_collection = new Backbone.Collection(this.collection.map(function (order)
					{
						var model = new Backbone.Model({
							touchpoint: 'customercenter'
						,	title: new Handlebars.SafeString(_('Order #<span class="tranid">$(0)</span>').translate(order.get('order_number')))
						,	detailsURL: '/ordershistory/view/' + order.id

						,	id: order.id
						,	internalid: order.id

						,	trackingNumbers: order.get('trackingnumbers')

						,	columns: [
								{
									label: _('Date:').translate()
								,	type: 'date'
								,	name: 'date'
								,	value: order.get('date')
								}
							,	{
									label: _('Amount:').translate()
								,	type: 'currency'
								,	name: 'amount'
								,	value: order.get('summary').total_formatted
								}
							,	{
									label: _('Status:').translate()
								,	type: 'status'
								,	name: 'status'
								,	value: order.get('status')
								}
							]

						});

						return model;
					}));

				return new BackboneCollectionView({
					childView: RecordViewsActionableView
				,	collection: records_collection
				,	viewsPerRow: 1
				,	childViewOptions: {
						actionView: OrderHistoryListTrackingNumberView
					,	actionOptions: {
							showContentOnEmpty: true
						,	contentClass: ''
						,	collapseElements: true
						}
					}
				});
			}
		}

		//@method getContext @return OrderHistory.List.View.Context
	,	getContext: function ()
		{
			//@class OrderHistory.List.View.Context
			return {
				//@property {String} pageHeader
				pageHeader: this.page_header
				//@property {Boolean} collectionLengthGreaterThan0
			,	collectionLengthGreaterThan0: this.collection.length > 0
				//@property {Boolean} isLoading
			,	isLoading: this.isLoading
				// @property {Boolean} showPagination
			,	showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage)
				// @property {Boolean} showCurrentPage
			,	showCurrentPage: this.options.showCurrentPage
				//@property {Boolean} showBackToAccount
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
			};
		}
	});

});