/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.Router'
,	[	'OrderHistory.List.View'
	,	'OrderHistory.Details.View'
	,	'OrderHistory.Model'
	,	'OrderHistory.Collection'
	,	'AjaxRequestsKiller'
	,	'Backbone'	
	]
,	function (
		OrderHistoryListView
	,	OrderHistoryDetailsView
	,	OrderHistoryModel
	,	OrderHistoryCollection
	,	AjaxRequestsKiller
	,	Backbone
	)
{

	'use strict';

	//@class OrderHistory.Router Router for handling orders @extend Backbone.Router
	return Backbone.Router.extend({
		//@property {Object} routes
		routes: {
			'ordershistory': 'ordersHistory'
		,	'ordershistory?:options': 'ordersHistory'
		,	'ordershistory/view/:id': 'orderDetails'
		}
		//@method initialize
	,	initialize: function (application)
		{
			this.application = application;
		}

		//@method ordersHistory list orders @param {Object} options
	,	ordersHistory: function (options)
		{
			options = (options) ? SC.Utils.parseUrlOptions(options) : {page: 1};

			options.page = options.page || 1;

			var collection = new OrderHistoryCollection()
			,	view = new OrderHistoryListView({
					application: this.application
				,	page: options.page
				,	collection: collection
				});

			collection.on('reset', view.showContent, view);

			view.showContent();
		}

		//@method orderDetails view order's detail @param {String} id
	,	orderDetails: function (id)
		{
			var model = new OrderHistoryModel({internalid: id})
			,	view = new OrderHistoryDetailsView({
					application: this.application
				,	id: id
				,	model: model
				});

			model
				.on('change', view.showContent, view)
				.fetch({
					killerId: AjaxRequestsKiller.getKillerId()
				});
		}
	});
});