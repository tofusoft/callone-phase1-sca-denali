/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.Menu.MyAccount.View'
,	[
		'SC.Configuration'
	,	'header_menu_myaccount.tpl'
	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'ProductList.Utils'
	]
,	function(
		Configuration
	,	header_menu_myaccount_tpl
	,	Backbone
	,	_
	,	jQuery
	,	ProductListUtils
	)
{
	'use strict';

	// @class Header.Profile.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_menu_myaccount_tpl

	,	initialize: function()
		{
			this.productListModule = ProductListUtils(this.options.application);

			this.isProductListEnabled = this.productListModule.isProductListEnabled();

			if (this.isProductListEnabled)
			{
				this.productListsPromise = this.productListModule.getProductListsPromise();

				this.product_list_collection = this.productListModule.getProductLists();
				
				var self = this;

				this.debounced_render = _.debounce(_.bind(this.render, this), 250);

				this.productListsPromise.done(function ()
				{
					self.debounced_render();
				});
				
				this.product_list_collection.on('add remove', this.debounced_render);
			}
			else
			{
				this.productListsPromise = jQuery.Deferred();
			}
		}

	,	destroy: function()
		{
			if (this.product_list_collection)
			{
				this.product_list_collection.off('add remove', this.debounced_render);
			}

			this._destroy();
		}


		// @method getContext @return {Header.Profile.View.Context}
	,	getContext: function()
		{
			
			if (this.product_list_collection)
			{	
				this.product_list_collection.each(function (product_list)
				{
					var url = 'wishlist/' + (product_list.get('internalid') || 'tmpl_' + product_list.get('templateid'));
					product_list.set('url', url, {silent: true}); 
				}); 
			}
			

			// @class Header.Profile.View.Context
			return {
				// @property {Boolean} isProductListsEnabled
				isProductListsEnabled: !!this.isProductListEnabled

				// @property {Boolean} isSingleList
			,	isSingleList: !!this.productListModule.isSingleList()

				// @property {Boolean} isCaseModuleEnabled
			,	isCaseModuleEnabled: Configuration.cases && Configuration.cases.config && Configuration.cases.enabled

				// @property {Boolean} productListsReady
			,	productListsReady: this.productListsPromise.state() === 'resolved'	

				// @property {ProductList.Collection|Array} productLists
			,	productLists: this.product_list_collection || []
			};
		}
	});

});