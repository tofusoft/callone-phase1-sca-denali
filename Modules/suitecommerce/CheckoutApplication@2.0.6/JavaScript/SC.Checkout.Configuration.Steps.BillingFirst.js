/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CheckoutApplication
// @class SCA.Checkout.Configuration.Steps.BillingFirst
// The configuration steps so the Checkout wizard shows the Billing First Flow experience
define(
	'SC.Checkout.Configuration.Steps.BillingFirst'
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

	var mst_delivery_options = 	{
			is_read_only: false
		,	show_edit_address_url: false
		,	hide_accordion: true
		,	collapse_items: true
		}

	,	show_shipment_options = {
			edit_url: '/shipping/address'
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
			name: _('Billing Address').translate()
		,	steps: [
				{
					name: _('Enter Billing Address').translate()
				,	url: 'billing/address'
				,	isActive: function ()
					{
						return !this.wizard.isMultiShipTo();
					}
				,	modules: [
						[OrderWizardModuleMultiShipToEnableLink, {exclude_on_skip_step: true}]
					,	OrderWizardModuleAddressBilling
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
				,	getName: function()
					{
						if (this.wizard.options.profile.get('addresses').length)
						{
							return _('Choose Shipping Address').translate();
						}
						else
						{
							return _('Enter Shipping Address').translate();
						}
					}
				,	url: 'shipping/address'
				,	isActive: function ()
					{
						return !this.wizard.isMultiShipTo();
					}
				,	modules: [
						[OrderWizardModuleMultiShipToEnableLink, {exclude_on_skip_step: true}]
					,	[OrderWizardModuleAddressBilling, {edit_url: '/billing/address', title: _('Billing Address').translate(), isActive: function() { return this.wizard.model.shippingAddressIsRequired(); }}]
					,	[OrderWizardModuleAddressShipping, {enable_same_as: true, title: _('Shipping Address').translate()}]
					,	[OrderWizardModuleCartSummary, cart_summary_options]
					]
				}
			]
		}
	,	{
			name: _('Shipping method').translate()
		,	steps: [
				{
					name: _('Choose delivery method').translate()
				,	url: 'shipping/method'
				,	isActive: function ()
					{
						return !this.wizard.isMultiShipTo();
					}
				,	modules: [
						[OrderWizardModuleAddressShipping, {edit_url: '/shipping/address'}]
					,	OrderWizardModuleShipmethod
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
						[OrderWizardModuleMultiShipToEnableLink, {change_url: 'shipping/address'}]
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
				,	modules: [
						OrderWizardModulePaymentMethodGiftCertificates
					,	OrderWizardModulePaymentMethodSelector
					,	[	OrderWizardModuleAddressBilling
						,	{
								enable_same_as: function () { return !this.wizard.isMultiShipTo() && this.wizard.model.shippingAddressIsRequired();}
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
					,	[OrderWizardModuleMultiShipToShipmethod, show_shipment_options]
					,	[OrderWizardModuleNonShippableItems, show_shipment_options]

					,	[OrderWizardModuleShowPayments, {edit_url_billing: '/billing', edit_url_address: '/billing'}]

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
