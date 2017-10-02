/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
// ProductList.Item.Model.js
// -----------------------
// Model for handling Product Lists (CRUD)
define('ProductList.Item.Model'
,	[	'ItemDetails.Model'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		ItemDetailsModel
	,	_
	,	Backbone
	)
{
	'use strict';

	function validateLength (value, name)
	{
		var max_length = 300;

		if (value && value.length > max_length)
		{
			return _('$(0) must be at most $(1) characters').translate(name, max_length);
		}
	}

	// @class ProductList.Item.Model @extends Backbone.Model
	return Backbone.Model.extend(
	{
		urlRoot: _.getAbsoluteUrl('services/ProductList.Item.Service.ss')

	,	defaults : {
			priority : {id: '2', name: 'medium'}
		,	options: ''
		}

		// Name is required
	,	validation: {
				name: { required: true, msg: _('Name is required').translate() }
			,	description: { fn: validateLength }
		}

		// redefine url to avoid possible cache problems from browser
	,	url: function ()
		{
			var base_url = Backbone.Model.prototype.url.apply(this, arguments)
			,	product_list = this.get('productList')
			,	url_params = {
					t: new Date().getTime()
			};

			if (product_list && product_list.owner)
			{
				url_params.user = product_list.owner;
			}

			return _.addParamsToUrl(base_url, url_params);
		}

	,	initialize: function (data)
		{
			this.item = data && data.item;

			if (this.item && this.item.matrix_parent && this.item.itemoptions_detail)
			{
				this.item.itemoptions_detail.fields = this.item.matrix_parent.itemoptions_detail.fields;
				this.item.matrixchilditems_detail = this.item.matrix_parent.matrixchilditems_detail;
			}

			var itemDetailModel = new ItemDetailsModel(this.item);

			itemDetailModel.setOptionsArray(this.getOptionsArray(), true);
			itemDetailModel.set('quantity', this.get('quantity'));

			this.set('itemDetails', itemDetailModel);
		}

		// @method getOptionsArray Returns options as an array. This is the way ItemDetailModel expects when initialized. @return {Array<Object>}
	,	getOptionsArray: function ()
		{
			// Iterate on the stored Product List Item options and create an id/value object compatible with the existing options renderer...
			var option_values = []
			,	selected_options = this.get('options');

			_.each(selected_options, function(value, key) {
				option_values.push({id: key, value: value.value, displayvalue: value.displayvalue});
			});

			return option_values;
		}

		// @method getProductName Copied from SC.Application('Shopping').Configuration.itemKeyMapping._name
	,	getProductName: function ()
		{
			if (!this.get('item'))
			{
				return null;
			}
			var item = this.get('item');

			// If its a matrix child it will use the name of the parent
			if (item && item.matrix_parent && item.matrix_parent.internalid)
			{
				return item.matrix_parent.storedisplayname2 || item.matrix_parent.displayname;
			}

			// Otherways return its own name
			return item.storedisplayname2 || item.displayname;
		}

		// @method isSelectionCompleteForEdit We need to check if mandatory options are set. No matrix option checking is required for editing a Product List Item. @returns {Boolean}
	,	isSelectionCompleteForEdit: function ()
		{
			var item_details = this.get('itemDetails')
			,	posible_options = item_details.getPosibleOptions();

			for (var i = 0; i < posible_options.length; i++)
			{
				var posible_option = posible_options[i];

				if (posible_option.isMandatory && !item_details.getOption(posible_option.cartOptionId))
				{
					return false;
				}
			}

			return true;
		}

		// @method fulfillsMinimumQuantityRequirement Returns true if a product can be purchased due to minimum quantity requirements. @returns {Boolean}
	,	fulfillsMinimumQuantityRequirement: function ()
		{
			var item_minimum_quantity = this.get('item').minimumquantity;

			if (!item_minimum_quantity)
			{
				return true;
			}

			return parseInt(item_minimum_quantity, 10) <= parseInt(this.get('quantity'), 10);
		}

		// @method getItemForCart Gets the ItemDetailsModel for the cart options_details should be passed together with options values, 
		// otherwise they will not be validated and not set!!!
		// @return {internalid:String,quantity:Number,options:Object,options:Object}
	,	getItemForCart: function (id, qty, options_details, options)
		{
			return new ItemDetailsModel({
				internalid: id
			,	quantity: qty
			,	_optionsDetails: options_details
			,	options: options
			});
		}
	});
});
