/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReturnAuthorization
define('ReturnAuthorization.Router'
,	[	'ReturnAuthorization.Model'
	,	'ReturnAuthorization.Collection'
	,	'ReturnAuthorization.Detail.View'
	,	'ReturnAuthorization.List.View'
	,	'ReturnAuthorization.Form.View'
	,	'ReturnAuthorization.Confirmation.View'
	,	'AjaxRequestsKiller'

	,	'underscore'
	,	'jQuery'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		Model
	,	Collection
	,	ReturnAuthorizationDetailView
	,	ReturnAuthorizationListView
	,	ReturnAuthorizationFormView
	,	ReturnAuthorizationConfirmationView
	,	AjaxRequestsKiller
	,	_
	,	jQuery
	,	Backbone
	)
{
	'use strict';

	//@class ReturnAuthorization.Router @extend Backbone.Router
	return Backbone.Router.extend({

		routes: {
			'returns': 'list'
		,	'returns?:options': 'list'
		,	'returns/:id': 'details'
		,	'returns/:id?:options': 'details'
		,	'returns/new/:type/:id': 'form'
		,	'returns/new/:id': 'confirmation'
		}

	,	initialize: function (application)
		{
			this.application = application;
		}

	,	list: function (options)
		{
			var parameters = _.parseUrlOptions(options)

			,	collection = new Collection()

			,	view = new ReturnAuthorizationListView({
					application: this.application
				,	collection: collection
				,	page: parameters.page
				});

			if (parameters.cancel)
			{
				view.message = _('Good! Your request was successfully cancelled.').translate();
				Backbone.history.navigate(_.removeUrlParameter(Backbone.history.fragment, 'cancel'), {replace: true});
			}

			collection.on('reset', jQuery.proxy(view, 'showContent', 'returns'));

			view.showContent('returns');
		}

	,	details: function (id)
		{
			var model = new Model({
					internalid: id
				})

			,	view = new ReturnAuthorizationDetailView({
					application: this.application
				,	model: model
				});

			model.fetch({
				killerId: AjaxRequestsKiller.getKillerId()
			}).then(jQuery.proxy(view, 'showContent', 'returns'));
		}

	,	form: function (type, id)
		{
			var created_from = this.getCreatedFrom(type, id)

			,	application = this.application

			,	model = new Model()

			,	view = new ReturnAuthorizationFormView({
					application: application
				,	model: model
				,	createdFromModel: created_from
				});

			created_from.fetch({
				killerId: AjaxRequestsKiller.getKillerId()
			}).then(jQuery.proxy(view, 'showContent'));

			model.on('save', function ()
			{
				new ReturnAuthorizationConfirmationView({
					application: application
				,	model: model
				}).showContent('returns');

				Backbone.history.navigate('/returns/new/' + model.get('internalid'), {trigger: false});
			});
		}

	,	confirmation: function (id)
		{
			var model = new Model({
					internalid: id
				})

			,	view = new ReturnAuthorizationConfirmationView({
					application: this.application
				,	model: model
				});

			model.fetch({
				killerId: AjaxRequestsKiller.getKillerId()
			}).then(jQuery.proxy(view, 'showContent', 'returns'));
		}

	,	getCreatedFrom: function (type, id)
		{
			var Model = null;

			if (type === 'invoice')
			{
				Model = require('Invoice.Model');
			}
			else if (type === 'order')
			{
				Model = require('OrderHistory.Model');
			}

			return new Model({
				internalid: id
			});
		}
	});
});