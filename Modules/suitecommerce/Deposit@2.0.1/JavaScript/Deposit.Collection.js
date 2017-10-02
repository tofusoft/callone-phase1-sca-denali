/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Deposit
define('Deposit.Collection'
,	[	'Deposit.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';

	//@class Deposit.Collection @extend Backbone.Collection
	return Backbone.Collection.extend({

		model: Model

	,	url: 'services/Deposit.Service.ss'

	,	parse: function (result)
		{
			return result.records;
		}
	,	comparator: function (item)
		{
			var date = item.get('datecreated');
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
