/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Receipt.Router.js
// -----------------------
// Router for handling receipts
define('Receipt.Router'
,	[	'Receipt.List.View'
	,	'Receipt.Details.View'
	,	'AjaxRequestsKiller'
	,	'Receipt.Model'
	,	'Receipt.Collection'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		ReceiptListView
	,	ReceiptDetailsView
	,	AjaxRequestsKiller
	,	Model
	,	Collection

	,	Backbone
	,	_
	)
{
	'use strict';

	return Backbone.Router.extend({

		routes: {
			'receiptshistory/view/:id': 'receiptDetails'
		,	'receiptshistory': 'receiptsHistory'
		,	'receiptshistory?:options': 'receiptsHistory'
		}

	,	initialize: function (application)
		{
			this.application = application;
		}

		// list receipts history
	,	receiptsHistory: function ()
		{
			var collection = new Collection()
			,	view = new ReceiptListView({
					application: this.application
				,	collection: collection
				});


			collection
				.fetch({
					data: { type: 'cashsale' }
				,	reset: true
				,	killerId: AjaxRequestsKiller.getKillerId()
				}).done(_.bind(view.showContent, view));
		}

		// view receipt's detail
	,	receiptDetails: function (id)
		{
			var model = new Model({ internalid: id })
			,	view = new ReceiptDetailsView({
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