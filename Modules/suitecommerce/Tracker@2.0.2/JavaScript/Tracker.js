/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Tracker
define('Tracker'
,	[	'Singleton'
	,	'underscore'
	]
,	function (
		Singleton
	,	_
	)
{
	'use strict';


	var Tracker = function ()
	{
		// Place holder for tracking modules.
		// When creating your own tracker module, be sure to push it to this array.
		this.trackers = [];
	};

	Tracker.prototype.track = function (method)
	{
		var self = this
			// Each method could be called with different type of parameters.
			// So we pass them all what ever they are.
		,	parameters = Array.prototype.slice.call(arguments, 1);

		_.each(this.trackers, function (tracker)
		{
			// Only call the method if it exists, the context is the application.
			tracker[method] && tracker[method].apply(self, parameters);
		});

		return this;
	};

	Tracker.prototype.trackPageview = function (url)
	{
		return this.track('trackPageview', url);
	};

	Tracker.prototype.trackEvent = function (event)
	{
		var GoogleUniversalAnalytics = null
		,	has_universal_analytics = false;

		this.track('trackEvent', event);

		if (event.callback)
		{
			GoogleUniversalAnalytics = require('GoogleUniversalAnalytics');

			has_universal_analytics = _.find(this.trackers, function (tracker)
			{
				return tracker === GoogleUniversalAnalytics;
			});
			// GoogleUniversalAnalytics has an asynchronous callback.
			// So we only call the non async ones if UniversalAnalytics is not there.
			!has_universal_analytics && event.callback();
		}

		return this;
	};

	Tracker.prototype.trackTransaction = function (transaction)
	{
		return this.track('trackTransaction', transaction);
	};

	Tracker.prototype.addCrossDomainParameters = function (url)
	{
		_.each(this.trackers, function (tracker)
		{
			if (tracker.addCrossDomainParameters)
			{
				url = tracker.addCrossDomainParameters(url);
			}
		});

		return url;
	};

	return _.extend(Tracker, Singleton);
});

//@class TrackEvent
//@property {String} category
//@property {String} action
//@property {String} label
//@property {Number} value
//@property {Function} callback
//@property {String?} page