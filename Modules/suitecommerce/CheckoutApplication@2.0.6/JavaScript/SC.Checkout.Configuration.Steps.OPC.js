/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CheckoutApplication
// @class SC.Checkout.Configuration.Steps.OPC
// The configuration steps so the Checkout wizard shows the One Page Checkout experience
define(
	'SC.Checkout.Configuration.Steps.OPC'
,	[
		'underscore'
	,	'Utils'
	,	'OrderWizard.Module.MultiShipTo.EnableLink'
	,	'OrderWizard.Module.CartSummary'
	,	'OrderWizard.Module.Address.Shipping'
	,	'OrderWizard.Module.PaymentMethod.GiftCertificates'
	,	'OrderWizard.Module.PaymentMethod.Selector'
	,	'OrderWizard.Module.Address.Billing'
	,	'OrderWizard.Module.RegisterEmail'
	,	'OrderWizard.Module.ShowPayments'
	,	'OrderWizard.Module.SubmitButton'
	,	'OrderWizard.Module.TermsAndConditions'
	,	'OrderWizard.Module.Confirmation'
	,	'OrderWizard.Module.RegisterGuest'

	,	'OrderWizard.Module.Title'
	,	'OrderWizard.Module.MultiShipTo.Select.Addresses.Shipping'
 	,	'OrderWizard.Module.MultiShipTo.Package.Creation'
 	,	'OrderWizard.Module.MultiShipTo.Package.List'
 	,	'OrderWizard.Module.NonShippableItems'
 	,	'OrderWizard.Module.MultiShipTo.Shipmethod'
 	,	'OrderWizard.Module.Shipmethod'
 	,	'OrderWizard.Module.ShowShipments'
	,	'Header.View'
 	,	'Tracker'
	]
,	function (
		_
	,	Utils
	,	OrderWizardModuleMultiShipToEnableLink
	,	OrderWizardModuleCartSummary
	,	OrderWizardModuleAddressShipping
	,	OrderWizardModulePaymentMethodGiftCertificates
	,	OrderWizardModulePaymentMethodSelector
	,	OrderWizardModuleAddressBilling
	,	OrderWizardModuleRegisterEmail
	,	OrderWizardModuleShowPayments
	,	OrderWizardModuleSubmitButton
	,	OrderWizardModuleTermsAndConditions
	,	OrderWizardModuleConfirmation
	,	OrderWizardModuleRegisterGuest

	,	OrderWizardModuleTitle
	,	OrderWizardModuleMultiShipToSelectAddressesShipping
 	,	OrderWizardModuleMultiShipToPackageCreation
 	,	OrderWizardModuleMultiShipToPackageList
 	,	OrderWizardModuleNonShippableItems
 	,	OrderWizardModuleMultiShipToShipmethod
 	,	OrderWizardModuleShipmethod
 	,	OrderWizardModuleShowShipments
	,	HeaderView
 	,	Tracker
	)
{
	'use strict';

	var address_opc_options = {
			title: _('Enter Shipping Address').translate()
		,	hide_title: true
		}
	,	delivery_method_opc_options = {
			is_read_only: false
		,	hide_title: true
		,	hide_items: true
		}
	,	mst_delivery_options = 	{
			is_read_only: false
		,	show_edit_address_url: false
		,	hide_accordion: true
		,	collapse_items: true
		}

	,	show_shipment_options = {
			edit_url: '/opc'
		,	show_edit_address_url: true
		,	hide_title: true
		,	is_read_only: false
		,	show_combo: true
		,	show_edit_button: true
		,	hide_item_link: true
		}

	,	show_mst_shipment_options = {
			edit_url: '/opc'
		,	show_edit_address_url: true
		,	hide_title: true
		,	edit_shipment_url: 'shipping/addressPackages'
		,	edit_shipment_address_url: 'shipping/selectAddress'
		,	is_read_only: false
		,	show_combo: true
		,	show_edit_button: true
		,	hide_item_link: true
		}
	,	show_shipment_confirmation_options = 	{
			show_combo: true
		,	hide_items: false
		,	hide_item_link: false
		}
	,	cart_summary_options = {
			exclude_on_skip_step: true
		,	show_promocode_form: true
		,	show_edit_cart: true
		,	allow_remove_promocode: true
		,	hide_continue_button: true
		,	hide_cart_terms: true
		,	container: '#wizard-step-content-right'
		,	hideSummaryItems: function ()
			{
				return this.wizard.isMultiShipTo();
			}
		};

	return [
		{
			name: _('Checkout Information').translate()
		,	steps: [
				{
					url: 'opc'
				,	continueButtonLabel: _('Continue').translate()
				,	isActive: function ()
					{
						return !this.wizard.isMultiShipTo();
					}
				,	hideSecondContinueButtonOnPhone: false
				,	bottomMessage: _('You will have an opportunity to review your order on the next step.').translate()
				,	bottomMessageClass: 'payment-wizard-edit-amount-layout-text-right'
				,	modules: [
							[OrderWizardModuleTitle, {title: _('Shipping Address').translate(), exclude_on_skip_step: true, isActive: function() {return this.wizard.model.shippingAddressIsRequired();}}]
						,	OrderWizardModuleMultiShipToEnableLink
						,	[OrderWizardModuleAddressShipping, address_opc_options]

						,	[OrderWizardModuleTitle, {title: _('Delivery Method').translate(), exclude_on_skip_step: true, isActive: function() {return this.wizard.model.shippingAddressIsRequired();}}]
						,	[OrderWizardModuleShipmethod, delivery_method_opc_options]

						,	[OrderWizardModuleTitle, {title: _('Payment').translate()}]
						,	[OrderWizardModulePaymentMethodGiftCertificates]
						,	[OrderWizardModulePaymentMethodSelector]
						,	[OrderWizardModuleAddressBilling, {title: _('Billing Address').translate(), enable_same_as: function () { return !this.wizard.model.get('ismultishipto') && this.wizard.model.shippingAddressIsRequired();}}]

						,	OrderWizardModuleRegisterEmail
						,	[OrderWizardModuleCartSummary, cart_summary_options]
					]
				}
			]
		}

	,	{
			name: _('Shipping Address').translate()
		,	steps: [
				{
					name: _('Enter Shipping Address').translate()
				,	url: 'shipping/selectAddress'
				,	isActive: function ()
					{
						return this.wizard.isMultiShipTo();
					}
				,	modules: [
						[OrderWizardModuleMultiShipToEnableLink, {exclude_on_skip_step: true}]
					, 	[OrderWizardModuleMultiShipToSelectAddressesShipping, {edit_addresses_url: 'shipping/selectAddress' }]
					,	[OrderWizardModuleCartSummary, cart_summary_options]
					]
				}
			]
		}

	,	{
			name: _('Set shipments').translate()
		,	steps: [
				{
					name: _('Set shipments').translate()
				,	isActive: function ()
					{
						return this.wizard.isMultiShipTo();
					}
				,	url: 'shipping/addressPackages'
				,	modules: [
						OrderWizardModuleMultiShipToEnableLink
					,	[OrderWizardModuleMultiShipToPackageCreation, {edit_addresses_url: 'shipping/selectAddress'}]
					,	OrderWizardModuleMultiShipToPackageList
					,	OrderWizardModuleNonShippableItems
					,	[OrderWizardModuleCartSummary, cart_summary_options]
					]
				}
			]
		}

	,	{
			name: _('Delivery Method').translate()
		,	steps: [
				{
					name: _('Choose delivery method').translate()
				,	url: 'shipping/packages'
				,	isActive: function ()
					{
						return this.wizard.isMultiShipTo();
					}
				,	modules: [
						[OrderWizardModuleMultiShipToShipmethod, mst_delivery_options]
					,	[OrderWizardModuleNonShippableItems, mst_delivery_options]
					,	[OrderWizardModuleCartSummary, cart_summary_options]
					]
				}
			]
		}


	,	{
			name: _('Payment').translate()
		,	steps: [
				{
					name: _('Choose Payment Method').translate()
				,	url: 'billing'
				,	bottomMessage: _('You will have an opportunity to review your order on the next step.').translate()
				,	bottomMessageClass: 'payment-wizard-edit-amount-layout-text-right'
				,	isActive: function ()
					{
						return this.wizard.isMultiShipTo();
					}
				,	modules: [
						OrderWizardModulePaymentMethodGiftCertificates
					,	OrderWizardModulePaymentMethodSelector
					,	[	OrderWizardModuleAddressBilling
						,	{
								enable_same_as: function () { return !this.wizard.isMultiShipTo();}
							,	title: _('Enter Billing Address').translate()
							,	select_shipping_address_url: 'shipping/selectAddress'
							}
						]
					,	OrderWizardModuleRegisterEmail
					,	[OrderWizardModuleCartSummary, cart_summary_options]
					]
				}
			]
		}

	,	{
			name: _('Review').translate()
		,	steps: [
				{
					name: _('Review Your Order').translate()
				,	url: 'review'
				,	continueButtonLabel: _('Place Order').translate()
				,	modules: [

						[OrderWizardModuleTermsAndConditions, {className: 'order-wizard-termsandconditions-module-top'}]
					,	[OrderWizardModuleSubmitButton, {className: 'order-wizard-submitbutton-module-top'}]

					,	[OrderWizardModuleShowShipments, show_shipment_options]
					,	[OrderWizardModuleMultiShipToShipmethod, show_mst_shipment_options]
					,	[OrderWizardModuleNonShippableItems, show_shipment_options]

					,	[	OrderWizardModuleShowPayments
						,	{
								edit_url_billing: function ()
								{
									if (this.wizard.isMultiShipTo())
									{
										return '/billing';
									}
									else
									{
										return '/opc';
									}
								}
							}
						]

					,	[OrderWizardModuleTermsAndConditions, {className: 'order-wizard-termsandconditions-module-default'}]
					,	[OrderWizardModuleCartSummary, _.extend(_.clone(cart_summary_options), {hideSummaryItems: true, hide_continue_button: false, hide_cart_terms: false})]
					,	[OrderWizardModuleTermsAndConditions, {className: 'order-wizard-termsandconditions-module-bottom', container: '#wizard-step-content-right'}]

					]
				,	save: function()
					{
						_.first(this.moduleInstances).trigger('change_label_continue', _('Processing...').translate());

						var self = this
						,	submit_opreation = this.wizard.model.submit();

						submit_opreation.always(function ()
						{
							_.first(self.moduleInstances).trigger('change_label_continue', _('Place Order').translate());
						});

						return submit_opreation;
					}
				}
			,	{
					url: 'confirmation'
				,	hideContinueButton: true
				,	hideBackButton: true
				,	hideBreadcrumb: true
				,	headerView: HeaderView
				,	modules: [
						[OrderWizardModuleConfirmation, {additional_confirmation_message: _('You will receive an email with this confirmation in a few minutes.').translate()}]
					,	[OrderWizardModuleRegisterGuest]

					,	[OrderWizardModuleShowShipments, _.extend(_.clone(show_shipment_confirmation_options), {hide_edit_cart_button: true})]
					,	[OrderWizardModuleMultiShipToShipmethod, show_shipment_confirmation_options]
					,	[OrderWizardModuleNonShippableItems, show_shipment_confirmation_options]

					,	[OrderWizardModuleShowPayments]

					,	[OrderWizardModuleCartSummary, _.extend(_.clone(cart_summary_options), {hideSummaryItems: true, show_promocode_form: false, allow_remove_promocode: false, isConfirmation: true})]
					]
				,	present: function ()
					{
						Tracker.getInstance().trackTransaction(this.wizard.model);
					}
				}
			]
		}
	];
});
