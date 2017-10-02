/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global CMS: false */
// @module CMSadapter
define('CMSadapter'
,	[	'jQuery'
	,	'underscore'
	,	'Backbone'
	,	'CMSadapterImpl'
	,	'CMSadapter.Page.Router'
	,	'CMSadapter.Page.Collection'
	,	'SC.Configuration'
	]
,	function (
		jQuery
	,	_
	,	Backbone
	,	CMSadapterImpl
	,	PageRouter
	,	PageCollection
	,	Configuration
	)
{
	'use strict';

	// @class CMSadapter responsible of starting both the adapter implementation and cms landing pages router.
	// Assumes cms.js is already loaded
	// @extend ApplicationModule
	return {

		mountToApp: function (application)
		{
			if (Configuration.get('useCMS'))
			{
				var router = this.initPageRouter(application);

				var self = this;

				// instantiate and expose it:
				if (typeof CMS === 'undefined')
				{
					Backbone.Events.on('cms:load', function ()
					{
						var adapter = self.initAdapter(application, router);
						application.cmsAdapter = adapter;
	 				});
				}
				else
				{
					var adapter = this.initAdapter(application, router);
					application.cmsAdapter = adapter;
				}

				var layout = application.getLayout()
				,	show_content_wrapper = function (fn, view)
					{
						var promise = jQuery.Deferred();
						var args = arguments;
						var page = router.getPageForFragment(Backbone.history.fragment, true);

						// Calls the original function with all the parameters (slice to exclude fn)
						fn.apply(layout, Array.prototype.slice.call(args, 1)).done(function ()
						{
							// once the original function is done this reads the attributes of the view and
							// sets title, metas and adds banners
							self.enhancePage(view, layout, page);

							//only after enhancing the view we resolve the promise
							promise.resolveWith(this, arguments);
						});

						return promise;
					};

				// Wraps the layout.showContent and Layout.showInModal methods
				// This make sure that every time you try to show content in the
				// application the page will be enhanced by setting title, header, meta tags and banners
				layout.showContent = _.wrap(layout.showContent, show_content_wrapper);
				layout.showInModal = _.wrap(layout.showInModal, show_content_wrapper);
			}
		}

	,	enhancePage: function(view, layout, page)
		{
			var $head = jQuery('head');

			// first, initialize head tags if they are not present
			$head
				.not(':has(title)').append('<title/>').end()
				.not(':has(link[rel="canonical"])').append('<link rel="canonical"/>').end()
				.not(':has(meta[name="keywords"])').append('<meta name="keywords"/>').end()
				.not(':has(meta[name="description"])').append('<meta name="description"/>').end();

			if (page)
			{
				// set title in DOM
				var title = page.get('page_title');
				this.title = title;
				if (title)
				{
					document.title = title;
				}

				// Sets the text of the title element if we are in the server
				// we only do it on the server side due to an issue modifying
				// the title tag on IE :(
				if (SC.ENVIRONMENT.jsEnvironment === 'server')
				{
					$head.find('title').text(title);
				}

				// meta keywords and meta description. We aren't adding the tags but reusing existing ones
				$head
					.find('meta[name="description"]').attr('content', page.get('meta_description') || '').end()
					.find('meta[name="keywords"]').attr('content', page.get('meta_keywords') || '').end();
			}

			$head
				.find('link[rel="canonical"]').attr('href', view.getCanonical()).end()
				// we remove any existing next/prev tags every time
				// a page is rendered in case the previous view was paginated
				.find('link[rel="next"], link[rel="prev"]').remove();

			// if the current page is paginated
			// set prev/next link rel
			this.setLinkRel('prev', view.getRelPrev(), $head);
			this.setLinkRel('next', view.getRelNext(), $head);

			// addition to head. Heads up! Each element added is stored and when the view is destroyed we remove these
			// elements from the DOM. If not the head will be polluted each time the user navigates.
			var additionToHead = page && page.get('addition_to_head');

			view.enhancedNodes = [];

			if (additionToHead && jQuery.trim(additionToHead + ''))
			{
				var $additionToHead = jQuery(additionToHead);
				$additionToHead.each(function ()
				{
					var $node = jQuery(this);
					$head.append($node);
					view.enhancedNodes.push($node);
				});
			}

			view.destroy = _.wrap(view.destroy, function(fn)
			{
				var args = Array.prototype.slice.call(arguments, 1);
				fn.apply(this, args);
				Backbone.View.prototype.render.apply(this, args);
				_.each(this.enhancedNodes, function ($node)
				{
					$node.remove();
				});
			});
		}

	,	setLinkRel: function (rel, link, $head)
		{
			link && jQuery('<link />', {
				rel: rel
			,	href: link
			}).appendTo($head);
		}

		// @method initAdapter
		// Heads up! CMS global variable should be already available since we start the
		// shopping application after cms.js is loaded, see SC.Shopping.Starter.js
	,	initAdapter: function(application, landingRouter)
		{
			if (typeof CMS === 'undefined')
			{
				console.log('Error: CMS global variable not found - CMS adapter not initialized');
				return;
			}

			var adapter = new CMSadapterImpl(application, CMS, landingRouter);

			// start listening
			adapter.init();

			return adapter;
		}

		// @method initPageRouter instantiate the landing pages router using bootstrapped data.
	,	initPageRouter: function(application)
		{
			if(!SC.ENVIRONMENT.CMS || !SC.ENVIRONMENT.CMS.pages)
			{
				console.log('Error: CMS landing pages data not found in SC.ENVIRONMENT.CMS.pages. Router not initialized');
				return;
			}

			var collection = new PageCollection(SC.ENVIRONMENT.CMS.pages.pages || []);
			var router = new PageRouter(application, collection);
			return router;
		}
	};
});
