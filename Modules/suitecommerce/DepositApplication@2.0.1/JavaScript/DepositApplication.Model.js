/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module DepositApplication
define('DepositApplication.Model'
,	[	'Invoice.Collection'
	,	'Backbone'
	]
,	function (
		InvoiceCollection
	,	Backbone
	)
{
	'use strict';

	//@class DepositApplication.Model @extend Backbone.Model
	return Backbone.Model.extend({

		urlRoot: 'services/DepositApplication.Service.ss'

	,	initialize: function (attributes)
		{
			this.on('change:invoices', function (model, invoices)
			{
				model.set('invoices', new InvoiceCollection(invoices), { silent: true });
			});

			this.trigger('change:invoices', this, attributes && attributes.invoices || []);
		}
	});
});
