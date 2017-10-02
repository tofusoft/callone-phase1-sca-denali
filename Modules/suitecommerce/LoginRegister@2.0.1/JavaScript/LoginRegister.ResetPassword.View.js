/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module LoginRegister
define('LoginRegister.ResetPassword.View'
,	[	'login_register_reset_password.tpl'

	,	'Account.ResetPassword.Model'
	,	'GlobalViews.Message.View'
	,	'Backbone.FormView'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		reset_password_tpl

	,	AccountResetPasswordModel
	,	GlobalViewsMessageView
	,	BackboneFormView

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class LoginRegister.ResetPassword.View implements the reset-password experience UI @extend Backbone.View
	return Backbone.View.extend({

		template: reset_password_tpl

	,	title: _('Reset Password').translate()

	,	events: {
			'submit form': 'saveForm'
		}

	,	bindings: {
			'[name="password"]': 'password'
		,	'[name="confirm_password"]': 'confirm_password'
		}

	,	initialize: function ()
		{
			this.model = new AccountResetPasswordModel();
			this.email = unescape(_.parseUrlOptions(location.search).e);
			this.model.set('params', {'e':this.email, 'dt':_.parseUrlOptions(location.search).dt, 'cb':_.parseUrlOptions(location.search).cb});
			this.model.on('save', _.bind(this.showSuccess, this));

			BackboneFormView.add(this);
		}

		// @method showSuccess
	,	showSuccess: function()
		{
			var global_view_message = new GlobalViewsMessageView({
					message: _('Your password has been reset.').translate()
				,	type: 'success'
			});

			this.$('form').empty().html(global_view_message.render().$el.html());
		}

		// @method getContext @return LoginRegister.ResetPassword.View.Context
	,	getContext: function ()
		{
			//@class LoginRegister.ResetPassword.View.Context
			return {
				//@property {String} email
				email: this.email || ''
			};
		}
	});
});