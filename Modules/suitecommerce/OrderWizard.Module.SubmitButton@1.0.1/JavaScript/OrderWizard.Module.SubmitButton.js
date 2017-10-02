/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @Module OrderWizard.Module.SubmitButton
define(
	'OrderWizard.Module.SubmitButton'
,	[
		'Wizard.Module'
	,	'order_wizard_submitbutton_module.tpl'

	]
,	function (

		WizardModule
	,	order_wizard_submitbutton_module_tpl

	)
{
	'use strict';

	// @class OrderWizard.Module.SubmitButton @extends WizardModule
	return WizardModule.extend({

		template: order_wizard_submitbutton_module_tpl

	,	render: function ()
		{
			this._render();
			this.trigger('ready', true);
		}

		// @method getContext @return OrderWizard.Module.SubmitButton.Context
	,	getContext: function()
		{
			// @class OrderWizard.Module.SubmitButton.Context
			return {};
		}
	});
});