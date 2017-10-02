/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global nlapiGetCache */
// @module SiteSettings
// Pre-processes the SiteSettings to be used on the site
define(
	'SiteSettings.Model'
,	[	'SC.Model'
	,	'underscore'
	]
,	function (
		SCModel
	,	_
	)
{
	'use strict';

	// @class SiteSettings Pre-processes the SiteSettings to be used on the site. For performance reasons it 
	// adds a cache layer using netsuite's application cache. Cache use the siteid in the keyword to support multi sites. 
	// Cache douration can be configured in cacheTtl property. Some properties like touchpoints, siteid, languages and currencies are never cached. 
	// @extends SCModel
	return SCModel.extend({

		name: 'SiteSettings'

		// @property {nlobjCache} cache
	,	cache: nlapiGetCache('Application')

		// @property {Number} cacheTtl cache duration time in seconds - by default 2 hours - this value can be between 5 mins and 2 hours
	,	cacheTtl: SC.Configuration.cache.siteSettings

		// @method get the site settings. Notice that can be cached @returns { ShoppingSession.SiteSettings}
	,	get: function ()
		{
			var basic_settings = session.getSiteSettings(['siteid', 'touchpoints']);

			// cache name contains the siteid so each site has its own cache.
			var settings = this.cache.get('siteSettings-' + basic_settings.siteid);

			if (!settings || !this.cacheTtl) {

				var i
				,	countries
				,	shipToCountries;

				settings = session.getSiteSettings();

				// 'settings' is a global variable and contains session.getSiteSettings()
				if (settings.shipallcountries === 'F')
				{
					if (settings.shiptocountries)
					{
						shipToCountries = {};

						for (i = 0; i < settings.shiptocountries.length; i++)
						{
							shipToCountries[settings.shiptocountries[i]] = true;
						}
					}
				}

				// Get all available countries.
				var allCountries = session.getCountries();

				if (shipToCountries)
				{
					// Remove countries that are not in the shipping countries
					countries = {};

					for (i = 0; i < allCountries.length; i++)
					{
						if (shipToCountries[allCountries[i].code])
						{
							countries[allCountries[i].code] = allCountries[i];
						}
					}
				}
				else
				{
					countries = {};

					for (i = 0; i < allCountries.length; i++)
					{
						countries[allCountries[i].code] = allCountries[i];
					}
				}

				// Get all the states for countries.
				var allStates = session.getStates();

				if (allStates)
				{
					for (i = 0; i < allStates.length; i++)
					{
						if (countries[allStates[i].countrycode])
						{
							countries[allStates[i].countrycode].states = allStates[i].states;
						}
					}
				}

				// Adds extra information to the site settings
				settings.countries = countries;
				settings.phoneformat = context.getPreference('phoneformat');
				settings.minpasswordlength = context.getPreference('minpasswordlength');
				settings.campaignsubscriptions = context.getFeature('CAMPAIGNSUBSCRIPTIONS');
				settings.analytics.confpagetrackinghtml = _.escape(settings.analytics.confpagetrackinghtml);

				// Other settings that come in window object
				settings.groupseparator = window.groupseparator;
				settings.decimalseparator = window.decimalseparator;
				settings.negativeprefix = window.negativeprefix;
				settings.negativesuffix = window.negativesuffix;
				settings.dateformat = window.dateformat;
				settings.longdateformat = window.longdateformat;
				settings.isMultiShippingRoutesEnabled = context.getSetting('FEATURE', 'MULTISHIPTO') === 'T' && SC.Configuration.isMultiShippingEnabled;

				this.cache.put('siteSettings-' + settings.siteid, JSON.stringify(settings), this.cacheTtl);
			}
			else
			{
				settings = JSON.parse(settings);
			}

			// never cache the following:
			settings.is_logged_in = session.isLoggedIn();
			settings.touchpoints = basic_settings.touchpoints;
			settings.shopperCurrency = session.getShopperCurrency();

			// delete unused fields
			delete settings.entrypoints;

			return settings;
		}
	});
});