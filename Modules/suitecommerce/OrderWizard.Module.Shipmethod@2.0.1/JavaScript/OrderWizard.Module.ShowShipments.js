/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard.Module.Shipmethod
define(
	'OrderWizard.Module.ShowShipments'
,	[	'Wizard.Module'
	,	'Address.Details.View'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'ItemViews.Cell.Navigable.View'

	,	'order_wizard_showshipments_module.tpl'

	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		WizardModule
	,	AddressDetailsView
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	ItemViewsCellNavigableView

	,	order_wizard_showshipments_module_tpl

	,	_
	,	jQuery
	)
{
	'use strict';
	//@class OrderWizard.Module.ShowShipments @extends Wizard.Module
	return WizardModule.extend({

		//@property {Function} template
		template: order_wizard_showshipments_module_tpl

		//@property {Array} errors
	,	errors: ['ERR_NOT_SET_SHIPPING_METHODS', 'ERR_NOT_SET_SHIPPING_ADDRESS']

	,	shipMethodIsRequire: {
			errorMessage: _('Please select a shipping method').translate()
		,	errorCode: 'ERR_NOT_SET_SHIPPING_METHODS'
		}

	,	shipAddressIsRequire: {
			errorMessage: _('Please select a shipping address').translate()
		,	errorCode: 'ERR_NOT_SET_SHIPPING_ADDRESS'
		}

		//@property {Object} events
	,	events: {
			'change [data-action="change-delivery-options"]': 'changeDeliveryOptions'
		}
		//@method render
	,	render: function ()
		{
			this.application = this.wizard.application;
			this.profile = this.wizard.options.profile;
			this.options.application = this.wizard.application;

			this._render();
		}

	,	initialize: function ()
		{
			var self = this;
			
			WizardModule.prototype.initialize.apply(this, arguments);
			this.wizard.model.on('ismultishiptoUpdated', function ()
			{
				self.render();
			});
			
			this.wizard.model.on('promocodeUpdated', function ()
			{
				self.render();
			});
			
			BackboneCompositeView.add(this);
		}

	,	isActive: function ()
		{
			return !this.model.get('ismultishipto');
		}

	,	isValid: function ()
		{
			if (this.model.shippingAddressIsRequired())
			{
				if (!this.model.get('shipmethod'))
				{
					return jQuery.Deferred().reject(this.shipMethodIsRequire);
				}
				else if (!this.model.get('shipaddress'))
				{
					return jQuery.Deferred().reject(this.shipAddressIsRequire);
				}
			}

			return jQuery.Deferred().resolve();
		}

		//@method changeDeliveryOptions
	,	changeDeliveryOptions: function (e)
		{
			var value = this.$(e.target).val()
			,	self = this;

			this.model.set('shipmethod', value);
			this.step.disableNavButtons();
			this.model.save().always(function ()
			{
				self.render();
				self.step.enableNavButtons();
			});
		}
		//@property {Object} childViews
	,	childViews: {
				'Shipping.Address': function ()
				{
					return new AddressDetailsView({
							hideActions: true
						,	hideDefaults: true
						,	manage: 'shipaddress'
						,	model: this.profile.get('addresses').get(this.model.get('shipaddress'))
					});
				}
			,	'Items.Collection': function ()
				{
					return new BackboneCollectionView({
							collection: this.model.get('lines')
						,	childView: ItemViewsCellNavigableView
						,	viewsPerRow: 1
						,	childViewOptions: {
								navigable: !this.options.hide_item_link

							,	detail1Title: _('Qty:').translate()
							,	detail1: 'quantity'

							,	detail2Title: _('Unit price').translate()
							,	detail2: 'rate_formatted'

							,	detail3Title: _('Amount:').translate()
							,	detail3: 'amount_formatted'
							}
					});
				}
		}

		//@method getContext @returns OrderWizard.Module.ShowShipments.Context
	,	getContext: function ()
		{
			var self = this
			,	lines = this.model.get('lines')
			,	item_count = _.countItems(lines)
			,	selected_shipmethod = this.model.get('shipmethods').findWhere({internalid: this.model.get('shipmethod')})
			,	shipping_methods = this.model.get('shipmethods').map(function (shipmethod)
				{
					return {
							name: shipmethod.get('name')
						,	rate_formatted: shipmethod.get('rate_formatted')
						,	internalid: shipmethod.get('internalid')
						,	isActive: shipmethod.get('internalid') === self.model.get('shipmethod')
					};
				});

			//@class OrderWizard.Module.ShowShipments.Context
			return {
					//@property {LiveOrder.Model} model
					model: this.model
					//@property {Boolean} showShippingInformation Indicate if the shipmethod select should be shown or not. Used when in SST all items are non shippable
				,	showShippingInformation: !!this.model.shippingAddressIsRequired()
					//@property {Boolean} showShippingAddress
				,	showShippingAddress: !!this.profile.get('addresses').get(this.model.get('shipaddress'))
					//@property {String} editUrl
				,	editUrl: this.options.edit_url
					//@property {Boolean} showEditButton
				,	showEditButton: !!this.options.edit_url
					//@property {Boolean} showOpenedAccordion
				,	showOpenedAccordion:  _.isDesktopDevice()
					//@property {Boolean}
				,	showSelectedShipmethod: !!selected_shipmethod
					//@property {Object} selectedShipmethod
				,	selectedShipmethod: selected_shipmethod
					//@property {Array} shippingMethods
				,	shippingMethods: shipping_methods
					//@property {Orderline.Collection} lines
				,	lines: lines
					//@property {Boolean} itemCountGreaterThan1
				,	itemCountGreaterThan1: item_count > 1
					//@property {Number} itemCount
				,	itemCount: item_count
					//@property {Boolean} collapseElements
				,	collapseElements: this.application.getConfig('collapseElements', false)
					//@property {Boolean} showEditCartButton
				,	showEditCartButton: !this.options.hide_edit_cart_button

			};
		}
	});
});