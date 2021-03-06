/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.ItemListSortSelector.View'
,	[		
		'facets_item_list_sort_selector.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function(
		facets_item_list_sort_selector_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class Facets.ItemListSortSelector.View @extends Backbone.View
	return Backbone.View.extend({

		template: facets_item_list_sort_selector_tpl

		// @method getContext @returns {Facets.ItemListSortSelector.View.Context}
	,	getContext: function ()
		{
			var option_items = this.options.options
			,	translator = this.options.translator
			,	processed_option_items = [];

			_.each(option_items, function(option_item) {
				var processed_option_item = {
					configOptionUrl: translator.cloneForOptions({order: option_item.id, page: 1}).getUrl()
				,	isSelected: translator.getOptionValue('order') === option_item.id ? 'selected' : ''
				,	name: option_item.name
				,	className: option_item.id.replace(':','-')
				};

				processed_option_items.push(processed_option_item);
			});

			// @class Facets.ItemListSortSelector.View.Context
			return {	
				// @property {Array} options			
				options: processed_option_items
			};
		}
	});
});