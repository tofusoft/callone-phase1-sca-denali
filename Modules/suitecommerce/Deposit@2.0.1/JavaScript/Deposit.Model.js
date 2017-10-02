/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Deposit
define('Deposit.Model'
,	[	'OrderPaymentmethod.Collection'
	,	'Invoice.Collection'

	,	'Backbone'
	]
,	function (
		OrderPaymentmethodCollection
	,	InvoiceCollection

	,	Backbone
	)
{
	'use strict';

	//@class Deposit.Model @extend Backbone.Model
	return Backbone.Model.extend({

			urlRoot: 'services/Deposit.Service.ss'

		,	initialize: function (attributes)
			{
				this.on('change:paymentmethods', function (model, paymentmethods)
				{
					model.set('paymentmethods', new OrderPaymentmethodCollection(paymentmethods), {silent: true});
				});

				this.trigger('change:paymentmethods', this, attributes && attributes.paymentmethod || []);

				this.on('change:invoices', function (model, invoices)
				{
					model.set('invoices', new InvoiceCollection(invoices), { silent: true });
				});

				this.trigger('change:invoices', this, attributes && attributes.invoices || []);

				if (!this.get('type'))
				{
					this.set('type', 'Deposit');
				}
			}
	});
});
