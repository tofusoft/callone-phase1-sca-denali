/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@modules Receipt
define(
	'Receipt.List.View'
,	[	'ListHeader.View'
	,	'RecordViews.View'
	,	'SC.Configuration'

	,	'receipt_list.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		ListHeaderView
	,	RecordViewsView
	,	Configuration

	,	receipt_list_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	,	jQuery
	)
{
	'use strict';

	//@class Receipt.List.View @extend Backbone.View
	return Backbone.View.extend({
		template: receipt_list_tpl

	,	title: _('Receipts').translate()

	,	page_header: _('Receipts').translate()

	,	initialize: function (options)
		{
			this.application = options.application;
			this.collection = options.collection;

			var isoDate = _.dateToString(new Date())
			,	self = this;

			this.rangeFilterOptions = {
				fromMin: '1800-01-02'
			,	fromMax: isoDate
			,	toMin: '1800-01-02'
			,	toMax: isoDate
			};

			this.listenCollection();

			// manages sorting and filtering of the collection
			this.listHeader = new ListHeaderView({
				view: this
			,   avoidFirstFetch: true
			,	application : options.application
			,	collection: this.collection
			,	sorts: this.sortOptions
			,	rangeFilter: 'date'
			,	rangeFilterLabel: _('From').translate()
			});

			this.on('afterViewRender', function ()
			{
				self.collection.on('sync reset', jQuery.proxy(self, 'render'));
			});

			BackboneCompositeView.add(this);
		}

	,	listenCollection: function ()
		{
			this.setLoading(true);

			this.collection.on({
				request: jQuery.proxy(this, 'setLoading', true)
			,	reset: jQuery.proxy(this, 'setLoading', false)
			});
		}

	,	setLoading: function (bool)
		{
			this.isLoading = bool;
		}
	
		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'receiptshistory';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {
				text: _('Receipts').translate()
			,	href: '/receiptshistory'
			};
		}

		// Array of default sort options
		// sorts only apply on the current collection
		// which might be a filtered version of the original
	,	sortOptions: [
			{
				value: 'date'
			,	name: _('Sort By Date').translate()
			,	sort: function ()
				{
					return this.sortBy(function (receipt)
					{
						return [receipt.get('tranDateInMilliseconds'), receipt.get('tranid')];
					});
				}
			}
		,	{
				value: 'number'
			,	name: _('Sort By Number').translate()
			,	sort: function ()
				{
					return this.sortBy(function (receipt)
					{
						return parseInt(receipt.get('tranid'), 10);
					});
				}
			}
		,	{
				value: 'amount'
			,	name: _('Sort By Amount').translate()
			,	sort: function ()
				{
					return this.sortBy(function (receipt)
					{
						return receipt.get('summary').total;
					});
				}
			}
		]

	,	childViews: {
			'Receipt.List.Item': function ()
			{
				var records_collection = new Backbone.Collection(this.collection.map(function (receipt)
				{
					return new Backbone.Model({
						touchpoint: 'customercenter'
					,	title: _('Receipt #$(0)').translate(receipt.get('order_number'))
					,	detailsURL: '/receiptshistory/view/' + receipt.id

					,	id: receipt.id
					,	internalid: receipt.id

					,	columns: [
							{
								label: _('Date:').translate()
							,	type: 'date'
							,	name: 'creation-date'
							,	value: receipt.get('date')
							}
						,	{
								label: _('Amount:').translate()
							,	type: 'currency'
							,	name: 'amount'
							,	value: receipt.get('summary').total_formatted
							}
						,	{
								label: _('Status:').translate()
							,	type: 'status'
							,	name: 'status'
							,	value: _.isObject(receipt.get('status')) ? receipt.get('status').name : receipt.get('status')
							}
						]

					});
				}));

				return new BackboneCollectionView({
					childView: RecordViewsView
				,	collection: records_collection
				,	viewsPerRow: 1
				});
			}
		,	'List.Header': function ()
			{
				return this.listHeader;
			}
		}

		//@method getContext @return Receipt.List.View.Context
	,	getContext: function ()
		{
			//@class Receipt.List.View.Context
			return {
				//@property {String} pageHeader
				pageHeader: this.page_header
				//@property {Boolean} areItemsToShow
			,	areItemsToShow: !!this.collection.models.length
				//@property {Boolean} isLoading
			,	isLoading: this.isLoading
				//@property {Boolean} showBackToAccount
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
			};
		}
	});
});