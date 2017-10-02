/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SiteSearch
define(
	'SiteSearch.View'
,	[
		'SC.Configuration'
	,	'SiteSearch.Utils'
	,	'SiteSearch.Model'
	,	'SiteSearch.Item.View'
	,	'Facets.Translator'
	,	'Session'

	,	'site_search.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	]
,	function(
		Configuration
	,	SiteSearchUtils
	,	SiteSearchModel
	,	SiteSearchItemView
	,	Translator
	,	Session

	,	site_search_tpl

	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';

	// currentSearchOptions() - Returns current search options formatted as query params.
	function currentSearchOptions ()
	{
		var newOptions = []
		,	currentOptions = SC.Utils.parseUrlOptions(window.location.href);

		_.each(currentOptions, function (value, key)
		{
			var lowerCaseKey = key.toLowerCase();

			if (lowerCaseKey === 'order' || lowerCaseKey === 'show' ||  lowerCaseKey === 'display')
			{
				newOptions.push(lowerCaseKey + '=' + value);
			}
		});

		var newOptionsStr = newOptions.join('&');

		if (newOptionsStr.length > 0)
		{
			newOptionsStr = '&' + newOptionsStr;
		}

		return newOptionsStr;
	}

	//@class SiteSearch.View.Options
	var options = {
			//@property {Number} minLength
			minLength: Configuration.typeahead.minLength
			//@property {Number} items
		,	items: Configuration.typeahead.maxResults + 1
			//@property {String} minLength
		,	macro: Configuration.typeahead.macro
			//@property {Number} limit
		,	limit: Configuration.typeahead.maxResults
			//@property {String} sort
		,	sort: Configuration.typeahead.sort
			//@property {Array} labels
		,	labels: []
			//@property {Object} results
		,	results: {}
			//@property {SiteSearch.Model} model
		,	model: new SiteSearchModel()
			//@property {String} seeAllLabel
		,	seeAllLabel: _('See all results').translate()
			//@property {String} noResultsLabel
		,	noResultsLabel: _('No results').translate()
			//@property {String} searchingLabel
		,	searchingLabel: _('Searching...').translate()
			//@property {String} query
		,	query: ''
			//@property {Boolean} ajaxDone
		,	ajaxDone: false
	};

	// @class SiteSearch.View @extends Backbone.View
	return Backbone.View.extend({

		template: site_search_tpl

	,	events: {
			'submit [data-action="search"]': 'searchEventHandler'
		,	'click [data-action="hide-sitesearch"]': 'hideSiteSearch'
		,	'keyup [data-type="site-search"]': 'showReset'
		}

	,	initialize: function()
		{
			var self = this;

			var typeaheadOptions = {
				highlight: Configuration.typeahead.highlight || true
			,	minLength: Configuration.typeahead.minLength
			};

			options.view = this;

			this.on('afterViewRender', function ()
			{
				self.$searchElement = self.$('[data-type="site-search"]');
				// after the layout has be rendered, we initialize the plugin
				if (SC.ENVIRONMENT.jsEnvironment !== 'server')
				{
					options.$searchElement = self.$searchElement.typeahead(typeaheadOptions, self.typeaheadDataset)
						.on('typeahead:selected', _.bind(self.selectedItem, self));


					var drop = options.$searchElement.data('ttTypeahead').dropdown;
					drop.$menu
						.off('click.tt', '.tt-suggestion')
						.on('click.tt', '.tt-suggestion', _.bind(function ($e)
							{
								$e.preventDefault();
								$e.stopPropagation();
								drop.trigger('suggestionClicked', jQuery($e.currentTarget));
							}, drop));
				}
			});

		}

		// @method searchEventHandler Call on submit of the Search form @param {HTMLEvent} e
	,	searchEventHandler: function (e)
		{
			e.preventDefault();

			var search_term = jQuery.trim(this.$searchElement.val());

			if (search_term.length < 1)
			{
				return;
			}

			this.$searchElement.data('ttTypeahead').close();
			this.search(search_term);
			this.$searchElement.typeahead('val', '');
			this.hideSiteSearch();
		}

		// @method seeAllEventHandler @param {HTMLEvent} e @param {Object} typeahead
	,	seeAllEventHandler: function (e, typeahead)
		{
			this.search(typeahead.query);
		}

		// @method focusEventHandler
	,	focusEventHandler: function ()
		{
			this.$searchElement.typeahead('open');
		}

		// @method hideSiteSearch Handle the 'close' button on mobile
	,	hideSiteSearch: function()
		{
			this.$('.site-search .tt-input').blur();
			this.$('.site-search').slideUp();
		}


		// @method search @param {String} keywords
	,	search: function (keywords)
		{
			var currentView = this.currentView;

			keywords = SiteSearchUtils.formatKeywords(keywords);

			if (_.getPathFromObject(Configuration, 'isSearchGlobal') || !(currentView && currentView.options.translator instanceof Translator))
			{
				var search_url = _.getPathFromObject(Configuration, 'defaultSearchUrl')
				,	delimiters = _.getPathFromObject(Configuration, 'facetDelimiters')
				,	keywordsDelimited = delimiters ? delimiters.betweenFacetsAndOptions + 'keywords' + delimiters.betweenOptionNameAndValue : '?keywords=';

				// If we are not in Shopping we have to redirect to it
				if (_.getPathFromObject(Configuration, 'currentTouchpoint') !== 'home')
				{
					window.location.href = Session.get('touchpoints.home') + '#' + search_url + keywordsDelimited + keywords;
				}
				// Else we stay in the same app
				else
				{
					// We navigate to the default search url passing the keywords
					Backbone.history.navigate(search_url + keywordsDelimited + keywords + currentSearchOptions(), {trigger: true});
				}

			}
			// if search is not global and we are on the Browse Facet View
			// we might want to use the search to narrow the current list of items
			else
			{
				Backbone.history.navigate(currentView.options.translator.cloneForOption('keywords', keywords).getUrl(), {trigger: true});
			}
		}

		//@method selectedItem @param {HTMLEvent}e @param {String} itemid
	,	selectedItem: function (e, itemid)
		{
			e.preventDefault();
			var item = options.results[itemid];

			if (item)
			{
				this.hideSiteSearch();
				var path = item.get('_url');

				if (_.getPathFromObject(Configuration, 'currentTouchpoint') !== 'home')
				{
					window.location.href = Session.get('touchpoints.home') + '#' + path;
				}
				else
				{
					Backbone.history.navigate(path, {trigger: true});
				}
			}
			else
			{
				if (jQuery(e.currentTarget).parent().find('.no-results').size())
				{
					return false;
				}
				else
				{
					options.view.search(itemid.replace('see-all-', ''));
				}
			}

			options.$searchElement.typeahead('val', '');
			this.hideSiteSearch();
		}

		// @class SiteSearch.View.TypeaheadDataset
		// methods to customize the user experience of the typeahead
		// http://twitter.github.com/bootstrap/javascript.html#typeahead
		// (important to read the source code of the plugin to fully understand)
	,	typeaheadDataset: {
			// @method source trims de query, adds the 'see-all' label, fetches the data from the model,
			// waits until the user stops writing and pre-process it @param {String} query @param {Function} process
			source: _.debounce(function (query, process)
			{
				options.ajaxDone = false;
				options.results = {};
				options.query = SiteSearchUtils.formatKeywords(query);

				// if the character length from the query is over the min length
				if (options.query.length >= options.minLength)
				{
					options.labels = ['see-all-' + options.query];
					process(options.labels);
					options.$searchElement.data('ttTypeahead').dropdown.moveCursorDown();
				}

				// silent = true makes it invisible to any listener that is waiting for the data to load
				// http://backbonejs.org/#Model-fetch
				// We can use jQuery's .done, as the fetch method returns a promise
				// http://api.jquery.com/deferred.done/
				options.model.fetch(
					{
						data: {
							q: jQuery.trim(options.query)
						,	sort: options.sort
						,	limit: options.limit
						,	offset: 0
						}
					,	killerId: _.uniqueId('ajax_killer_')
					}
				,	{
						silent: true
					}
				).done(function ()
				{
					options.ajaxDone = true;
					options.labels = ['see-all-' + options.query];

					options.model.get('items').each(function (item)
					{
						// In some ocasions the search term may not be in the itemid
						options.results[item.get('_id') + options.query] = item;
						options.labels.push(item.get('_id') + options.query);
					});

					process(options.labels);
					options.$searchElement.data('ttTypeahead').dropdown.moveCursorDown();
					// self.$element.trigger('processed', self);
				});
			}, 500)

			//@method displayKey @param{String}itemid
		,	displayKey : function (itemid)
			{
				var item = options.results[itemid];
				return item ? item.get('_name') : itemid.replace('see-all-', '');
				// return '';
			}

			// @property {Object<String,Function>} templates
			// methods to generate the html used in the dropdown box bellow the search input
		,	templates:
			{
				suggestion: function (itemid)
				{
					var template = ''
					,	item = options.results[itemid];

					if (item)
					{
						// if we have macro, and the macro exists, we use that for the html
						// otherwise we just highlith the keyword in the item id
						// _.highlightKeyword is in file Utils.js
						var site_search_item = new SiteSearchItemView({model: item, query: this.query});
						site_search_item.render();
						template = site_search_item.$el;
					}
					else
					{
						if (_.size(options.results))
						{
							// 'See All Results' label
							template = '<div class="tt-dropdown-menu-shadow-fix"></div><div class="all-results">' + options.seeAllLabel + '<span class="hide">' + _(options.query).escape() + '</span></div>';
						}
						else if (options.ajaxDone)
						{
							template = '<div class="tt-dropdown-menu-shadow-fix"></div><div class="no-results">' + options.noResultsLabel + '<span class="hide">' + _(options.query).escape() + '</span></div>';
						}
						else
						{
							template = '<div class="tt-dropdown-menu-shadow-fix"></div><div class="searching">' + options.searchingLabel + '<span class="hide">' + _(options.query).escape() + '</span></div>';
						}
					}

					return template;
				}
			}
		}
		// @class SiteSearch.View

		// @method getContext @returns {SiteSearch.View.Context}
	,	getContext: function()
		{
			// @class SiteSearch.View.Context
			return {
				// @property {Number} maxLength
				maxLength: Configuration.searchPrefs.maxLength || 0
			};
		}
	,	showReset: function()
		{
			var self = this;
			this.$('.site-search-input').keyup(function()
			{
				if (self.$(this).val().length !==0)
				{
					self.$('.site-search-input-reset').show();
				}
				else
				{
					self.$('.site-search-input-reset').hide();
				}
			});
			this.$('.site-search-input').keydown(function(e)
			{
				if (e.keyCode === 27)
				{
					self.$(this).val('');
					self.$('.site-search-input-reset').hide();
				}
			});
			this.$('.site-search-input-reset').click(function()
			{
				self.$('.site-search-input-reset').hide();
				self.$('.site-search-input').val('');
			});
		}
	});

});
