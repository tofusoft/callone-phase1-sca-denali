/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.View'
,	[
		'SC.Configuration'
	,	'Profile.Model'
	,	'Header.Logo.View'
	,	'Header.MiniCart.View'
	,	'Header.MiniCartSummary.View'
	,	'Header.Profile.View'
	,	'Header.Menu.View'
	,	'GlobalViews.HostSelector.View'
	,	'GlobalViews.CurrencySelector.View'
	,	'SiteSearch.View'

	,	'header.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'underscore'
	,	'Utils'
	]
,	function(
		Configuration
	,	ProfileModel
	,	HeaderLogoView
	,	HeaderMiniCartView
	,	HeaderMiniCartSummaryView
	,	HeaderProfileView
	,	HeaderMenuView
	,	GlobalViewsHostSelectorView
	,	GlobalViewsCurrencySelectorView
	,	SiteSearchView

	,	header_tpl

	,	jQuery
	,	Backbone
	,	BackboneCompositeView
	,	_
	)
{
	'use strict';

	// @class Header.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_tpl

	,	events: {
			'click [data-action="show-sitesearch"]': 'showSiteSearch'
		,	'click [data-action="header-sidebar-show"]' : 'showSidebar'
		,	'click [data-action="header-sidebar-hide"]': 'hideSidebar'
		,	'click [data-type="header-sidebar-menu"]': 'hideSidebar'
		,	'click .header-menu-settings-dropdown': 'preventClose'
		}

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
			var self = this;

			this.render = _(this.render).wrap(function(original_render)
			{
				original_render.apply(self, Array.prototype.slice.call(arguments, 1));
				Backbone.history.on('all', function()
				{
					self.verifyShowSiteSearch();
				});
			});
		}

		// @method verifyShowSiteSearch expand the site search only if hash===home and (phone or tablet)
	,	verifyShowSiteSearch: function ()
		{
			var hash = Backbone.history.getFragment() || '';
			hash = hash.indexOf('?') === -1 ? hash : hash.substring(0, hash.indexOf('?'));
			var is_home = hash === '' || hash === '/';
			if (_.getDeviceType() !== 'desktop' && is_home)
			{
				this.showSiteSearch(null, true);
			}
			else
			{
				this.childViewInstances.SiteSearch.hideSiteSearch();
			}
		}

		// @method showSiteSearch
	,	showSiteSearch: function (ev, dontFocus)
		{
			ev && ev.preventDefault();

			this.$('.header-menu-search-link').toggleClass('active');
			this.$('.header-menu-searchmobile-link').toggleClass('active');
			var self = this;

			this.$('.site-search').stop(true, false).slideToggle(0, function ()
			{
				self.$('.site-search-input-reset').hide();
				self.$('.site-search-input').val('');
				if (!dontFocus)
				{
					self.$('.site-search-input').focus();
				}
			});
		}

		// @method showMiniCart
	,	showMiniCart: function ()
		{
			this.$('[data-type="mini-cart"]').parent().addClass('open');
		}

		// @method showSidebar
	,	showSidebar: function ()
		{
			jQuery('#main').addClass('header-sidebar-opened');
		}

		// @method hideSidebar
	,	hideSidebar: function(e)
		{
			if(e.target.tagName === 'A')
			{
				if(this.activeLink)
				{
					this.activeLink.removeClass('active');
				}
				this.activeLink = jQuery(e.target);
				this.activeLink.addClass('active');
			}
			jQuery('#main').removeClass('header-sidebar-opened');
		}

	,	preventClose: function(event)
		{
			event.stopPropagation();
		}

	,	childViews: {
			'Header.MiniCart': function()
			{
				return new HeaderMiniCartView();
			}
		,	'Header.MiniCartSummary': function()
			{
				return new HeaderMiniCartSummaryView();
			}
		,	'Header.Profile': function()
			{
				var header_profile_view_options = _.extend({
					showMyAccountMenu: true
				,	application: this.options.application
				}, this.options.headerProfileViewOptions || {});

				return new HeaderProfileView(header_profile_view_options);
			}
		,	'Header.Logo': function()
			{
				return new HeaderLogoView(this.options);
			}
		,	'Header.Menu': function()
			{
				var header_view_options = _.extend({
					application: this.options.application
				}, this.options.headerProfileViewOptions || {});

				return new HeaderMenuView(header_view_options);
			}
		,	'Global.HostSelector': function()
			{
				return new GlobalViewsHostSelectorView();
			}
		,	'Global.CurrencySelector': function()
			{
				return new GlobalViewsCurrencySelectorView();
			}
		,	'SiteSearch': function()
			{
				return new SiteSearchView();
			}
		}

		// @method getContext @return {Header.View.Context}
	,	getContext: function()
		{
			var environment = SC.ENVIRONMENT
			,	show_languages = environment.availableHosts && environment.availableHosts.length > 1
			,	show_currencies = environment.availableCurrencies && environment.availableCurrencies.length > 1 && !Configuration.notShowCurrencySelector;

			// @class Header.View.Context
			return {
				// @property {Profile.Model} profileModel
				profileModel: ProfileModel.getInstance()
				// @property {Boolean} showLanguages
			,	showLanguages: show_languages
				// @property {Boolean} showCurrencies
			,	showCurrencies: show_currencies
				// @property {Boolean} showLanguagesOrCurrencies
			,	showLanguagesOrCurrencies: show_languages || show_currencies
				// @property {Boolean} showLanguagesAndCurrencies
			,	showLanguagesAndCurrencies: show_languages && show_currencies
				// @property {Boolean} isHomeTouchpoint
			,	isHomeTouchpoint: Configuration.currentTouchpoint === 'home'
				// @property {String} cartTouchPoint
			,	cartTouchPoint: Configuration.modulesConfig.Cart && Configuration.modulesConfig.Cart.startRouter ? Configuration.currentTouchpoint : 'viewcart'
			// @class Header.View
			};
		}
	});

});
