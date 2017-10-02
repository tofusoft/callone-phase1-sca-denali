/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CreditMemo
define('CreditMemo.Collection'
,	[	
		'CreditMemo.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';

	// @class CreditMemo.Collection @extends Backbone.Collection
	return Backbone.Collection.extend({

		model: Model

	,	url: 'services/CreditMemo.Service.ss'

	,	parse: function (result)
		{
			return result.records;
		}
		// @method comparator @param {CreditMemo.Model} item
	,	comparator: function (item)
		{
			var date = item.get('trandate');
			if (date instanceof Date)
			{
				return date.getTime();
			}
			else if (typeof date === 'number')
			{
				return date;
			}
			else if (typeof date === 'string')
			{
				return Date.parse(date);
			}
		}
	});
});
