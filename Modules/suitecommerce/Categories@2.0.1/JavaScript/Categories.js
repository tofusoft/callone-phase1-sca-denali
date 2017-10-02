/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Categories.js
// -------------
// Utility Class to handle the Categories tree
define('Categories'
,	[	'underscore'
	,	'jQuery'
	]
,	function (
		_
	,	jQuery
	)
{
	'use strict';

	return {

		tree: {}

		// Categories.reset:
		// Refreshes the tree
	,	reset: function (tree)
		{
			this.tree = tree;
		}

		// Categories.getTree:
		// Returns a deep copy of the category tree
	,	getTree: function ()
		{
			return jQuery.extend(true, {}, this.tree);
		}

		// Categories.getBranchLineFromPath:
		// given a path retuns the branch that fullfil that path,
	,	getBranchLineFromPath: function (path)
		{
			var tokens = path && path.split('/') || [];

			if (tokens.length && tokens[0] === '')
			{
				tokens.shift();
			}

			return this.getBranchLineFromArray(tokens);
		}

		// Categories.getBranchLineFromArray:
		// given an array of categories it retuns the branch that fullfil that array.
		// Array will be walked from start to bottom and the expectation is that its in the correct order
	,	getBranchLineFromArray: function (array)
		{
			var branch = []
			,	slice = {categories: this.tree};

			for (var i = 0; i < array.length; i++)
			{
				var current_token = array[i];

				if (slice.categories && slice.categories[current_token])
				{
					branch.push(slice.categories[current_token]);
					slice = slice.categories[current_token];
				}
				else
				{
					break;
				}
			}

			return branch;
		}

		// Categories.getTopLevelCategoriesUrlComponent
		// returns the id of the top level categories
	,	getTopLevelCategoriesUrlComponent: function ()
		{
			return _.pluck(_.values(this.tree), 'urlcomponent');
		}

	,	makeNavigationTab: function (categories, memo)
		{
			var result = []
			,	self = this;

			_.each(categories, function (category)
			{
				var href = (memo ? memo + '/' : '') + category.urlcomponent

				,	tab = {
						href: '/' + href
					,	text: category.itemid
					,	data:
						{
							hashtag: '#' + href
						,	touchpoint: 'home'
						}
					};

				if (category.categories)
				{
					tab.categories = self.makeNavigationTab(category.categories, href);
				}

				result.push(tab);
			});

			return result;
		}

	,	addToNavigationTabs: function (application)
		{
			var tabs = this.makeNavigationTab(this.getTree());

			application.Configuration.navigationTabs = _.union(application.Configuration.navigationTabs, tabs);

			return;
		}

	,	mountToApp: function (application)
		{

			if (application.getConfig('modulesConfig.Categories.addToNavigationTabs'))
			{
				this.addToNavigationTabs(application);
			}
		}
	};
});
