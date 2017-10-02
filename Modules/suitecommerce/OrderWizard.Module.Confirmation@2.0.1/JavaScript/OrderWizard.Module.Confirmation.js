/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard.Module.Confirmation
define(
	'OrderWizard.Module.Confirmation'
,	[
		'SC.Configuration'
	,	'Wizard.Module'

	,	'order_wizard_confirmation_module.tpl'

	,	'Backbone'
	,	'Utils'
	]
,	function (
		Configuration
	,	WizardModule

	,	order_wizard_confirmation_module_tpl

	,	Backbone
	,	Utils
	)
{
	'use strict';

	// @class OrderWizard.Module.Confirmation @extends Wizard.Module
	return WizardModule.extend({

		template: order_wizard_confirmation_module_tpl

	,	className: 'OrderWizard.Module.Confirmation'

	,	render: function()
		{
			var confirmation = this.model.get('confirmation')
				// store current order id in the hash so it is available even when the checkout process ends.
			,	newHash = Utils.addParamsToUrl(Backbone.history.fragment, {
					last_order_id: confirmation.internalid
				});

			this.confirmationNumber = confirmation.confirmationnumber;
			this.orderId = confirmation.internalid;

			Backbone.history.navigate(newHash, {
				trigger: false
			});

			this._render();
		}

		// @method getContext @return OrderWizard.Module.Confirmation.Context
	,	getContext: function()
		{
			var continueURL = '/'
			,	touchpoint = true;

			if(Configuration.get('siteSettings.iswsdk') && Configuration.get('siteSettings.wsdkcancelcarturl'))
			{
				continueURL = Configuration.get('siteSettings.wsdkcancelcarturl');
				touchpoint = false;
			}

			// @class OrderWizard.Module.Confirmation.Context
			return {
				// @property {String} continueURL 
				continueURL: continueURL
				// @property {Boolean} isGuestAndCustomerCenter
			,	isGuestAndCustomerCenter: !!(this.wizard.profileModel.get('isGuest') === 'F' && Configuration.get('siteSettings.touchpoints.customercenter'))
				// @property {String} additionalConfirmationMessage
			,	additionalConfirmationMessage: this.options.additional_confirmation_message
				// @property {Boolean} touchPoint
			,	touchPoint: touchpoint
				// @property {String} confirmationNumber
			,	confirmationNumber: this.confirmationNumber
				// @property {Number} orderId
			,	orderId: this.orderId
			};
		}
	});
});