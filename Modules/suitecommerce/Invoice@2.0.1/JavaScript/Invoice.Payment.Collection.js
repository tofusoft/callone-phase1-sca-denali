/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Invoice
define('Invoice.Payment.Collection'
,	[	'Invoice.Payment.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';
	//@class Invoice.Payment.Collection @extends Backbone.Collection
	return Backbone.Collection.extend({
		//@property {Invoice.Payment.Model} model
		model: Model

	});
});
