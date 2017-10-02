/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.Menu.View'
, [
		'Profile.Model'
	,	'SC.Configuration'
	,	'Header.Profile.View'
	,	'Header.Menu.MyAccount.View'
	,	'GlobalViews.HostSelector.View'
	,	'GlobalViews.CurrencySelector.View'
	
	,	'header_menu.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'underscore'
	,	'jQuery.sidebarMenu'
	]
,	function(
		ProfileModel
	,	Configuration
	,	HeaderProfileView
	,	HeaderMenuMyAccountView
	,	GlobalViewsHostSelectorView
	,	GlobalViewsCurrencySelectorView

	,	header_menu

	,	Backbone
	,	BackboneCompositeView
	,	_
		
	)
{
	'use strict';

	// @class Header.Sidebar.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_menu

	,	initialize: function ()
		{
			var self = this;
			BackboneCompositeView.add(this);

			ProfileModel.getPromise().done(function () {
				self.render();
			});
		}

	,	childViews: {

			'Header.Profile': function ()
			{
				return new HeaderProfileView({
					showMyAccountMenu: false
				,	application: this.options.application
				});
			}
		,	'Header.Menu.MyAccount': function () 
			{
				return new HeaderMenuMyAccountView(this.options);
			}
		,	'Global.HostSelector': function ()
			{
				return new GlobalViewsHostSelectorView();
			}
		,	'Global.CurrencySelector': function ()
			{
				return new GlobalViewsCurrencySelectorView();
			}
		}

	,	render: function()
		{
			Backbone.View.prototype.render.apply(this, arguments);
			this.$('[data-type="header-sidebar-menu"]').sidebarMenu();
		}

		// @method getContext @return {Header.Sidebar.View.Context}
	,	getContext: function()
		{
			var profile = ProfileModel.getInstance()
			,	is_loading = !_.getPathFromObject(Configuration, 'performance.waitForUserProfile', true) && ProfileModel.getPromise().state() !== 'resolved'
			,	is_loged_in = profile.get('isLoggedIn') === 'T' && profile.get('isGuest') === 'F'
			,	environment = SC.ENVIRONMENT
			,	show_languages = environment.availableHosts && environment.availableHosts.length > 1
			,	show_currencies = environment.availableCurrencies && environment.availableCurrencies.length > 1 && !Configuration.notShowCurrencySelector;


			// @class Header.Sidebar.View.Context
			return {
				// @property {Array<NavigationData>} navigationItems
				categories: Configuration.navigationData || []

				// @property {Boolean} showExtendedMenu
			,	showExtendedMenu: !is_loading && is_loged_in
				// @property {Boolean} showLanguages
			,	showLanguages: show_languages
				// @property {Boolean} showCurrencies
			,	showCurrencies: show_currencies
				
			};
		}
	});

});