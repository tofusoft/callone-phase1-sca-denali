/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module CustomerPayment
define('CustomerPayment.Model'
,	[	'OrderPaymentmethod.Collection'
	,	'Backbone'
	]
,	function (
		OrderPaymentmethodCollection
	,	Backbone
	)
{
	'use strict';

	//@class CustomerPayment.Model @extend Backbone.Model
	return Backbone.Model.extend({
			
		//@property {String} urlRoot
		urlRoot: 'services/Payment.Service.ss'

		// @method initialize
	,	initialize: function (attributes)
		{
			this.on('change:paymentmethods', function (model, paymentmethods)
			{
				model.set('paymentmethods', new OrderPaymentmethodCollection(paymentmethods), {silent: true});
			});

			this.trigger('change:paymentmethods', this, attributes && attributes.paymentmethod || []);
		}
	});
});
