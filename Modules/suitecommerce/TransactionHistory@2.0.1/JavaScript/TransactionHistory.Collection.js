/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module TransactionHistory
define('TransactionHistory.Collection'
,	[	'TransactionHistory.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone)
{
	'use strict';

	//@class TransactionHistory.Collection @extend Backbone.Collection
	return Backbone.Collection.extend({

		model: Model

	,	url: 'services/TransactionHistory.Service.ss'

	,	parse: function (response)
		{
			this.totalRecordsFound = response.totalRecordsFound;
			this.recordsPerPage = response.recordsPerPage;

			return response.records;
		}

	,	update: function (options)
		{
			var range = options.range || {};

			this.fetch({
				data: {
					filter: options.filter.value
				,	sort: options.sort.value
				,	order: options.order
				,	from: range.from ? new Date(range.from.replace(/-/g,'/')).getTime() : null
				,	to: range.to ? new Date(range.to.replace(/-/g,'/')).getTime() : null
				,	page: options.page
				}
			,	reset: true
			,	killerId: options.killerId
			});
		}
	});
});