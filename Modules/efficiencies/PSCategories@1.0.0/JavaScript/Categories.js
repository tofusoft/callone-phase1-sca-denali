define('Categories', [
    'underscore',
    'jQuery',
    'SC.Configuration'
], function Categories(_,
                       jQuery,
                       Configuration) {
    'use strict';

    var siteBuilderFind = function siteBuilderFind(pSlice, secondUrlcomponent, branch) {
        var childCategs = _.keys(pSlice.categories);
        var i;

        if (pSlice.urlcomponent === secondUrlcomponent) {
            return true;
        }
        if (pSlice.categories && childCategs.length) {
            for (i = 0; i < childCategs.length; i++) {
                if (siteBuilderFind(
                        pSlice.categories[childCategs[i]], secondUrlcomponent)
                ) {
                    branch.push(pSlice.categories[childCategs[i]]);
                    return true;
                }
            }
        }
        return false;
    };


    return {
        tree: {},

        // Categories.reset:
        // Refreshes the tree
        reset: function reset(tree) {
            this.tree = tree;
        },
        resetRoot: function resetRoot(tree) {
            if (tree) {
                this.root = _.clone(tree);
                delete this.root.categories;
            }
        },
        // Categories.getTree:
        // Returns a deep copy of the category tree
        getTree: function getTree() {
            return jQuery.extend(true, {}, this.tree);
        },

        getBranchLineFromFacetPath: function getBranchLineFromFacetPath(path) {
            var tokens = path && path.split('/') || [];

            if (tokens.length && tokens[0] === '') {
                tokens.shift();
            }

            if (tokens.length && tokens[0] === this.root.urlcomponent) {
                tokens.shift();
            }

            if (tokens.length && tokens[tokens.length - 1] === '') {
                tokens.pop();
            }

            return this.getBranchLineFromArray(tokens);
        },

        // Categories.getBranchLineFromPath:
        // given a path retuns the branch that fullfil that path,
        getBranchLineFromPath: function getBranchLineFromPath(path) {
            var tokens = path && path.split('/') || [];

            if (tokens.length && tokens[0] === '') {
                tokens.shift();
            }

            if (tokens.length && tokens[tokens.length - 1] === '') {
                tokens.pop();
            }

            return this.getBranchLineFromArray(tokens);
        },
        // Categories.getBranchLineFromArray:
        // given an array of categories it retuns the branch that fullfil that array.
        // Array will be walked from start to bottom
        // and the expectation is that its in the correct order
        getBranchLineFromArray: function getBranchLineFromArray(array) {
            var branch = [];
            var slice = {categories: this.tree};
            var j;
            var currentToken;


            if (this.configuration.siteBuilderUrls) {
                console.warn('SiteBuilderURL Experimental Feature ON');
                if (slice.categories[array[0]]) {
                    // first level
                    if (array[1]) {
                        siteBuilderFind(slice.categories[array[0]], array[1], branch);
                    }

                    branch.push(slice.categories[array[0]]);
                    branch.reverse();
                }
            } else {
                for (j = 0; j < array.length; j++) {
                    currentToken = array[j];

                    if (slice.categories && slice.categories[currentToken]) {
                        branch.push(slice.categories[currentToken]);
                        slice = slice.categories[currentToken];
                    } else {
                        break;
                    }
                }
            }

            return branch;
        },

        // Categories.getTopLevelCategoriesUrlComponent
        // returns the id of the top level categories
        getTopLevelCategoriesUrlComponent: function getTopLevelCategoriesUrlComponent() {
            return _.pluck(_.values(this.tree), 'urlcomponent');
        },

        makeNavigationData: function makeNavigationData(categories, pLevel) {
            var result = [];
            var self = this;
            var level = pLevel || 0;


            _.each(categories, function navigationDataCategory(category) {
                var tab;
                var classLevel = pLevel;

                tab = {
                    href: category.url,
                    text: category.name,
                    'class': self.configuration.classLevels[classLevel],
                    data: {
                        hashtag: '#' + category.url,
                        touchpoint: 'home'
                    }
                };

                if (category.categories && self.configuration.levelsOnMenu > level + 1) {
                    tab.categories = self.makeNavigationData(category.categories, level + 1);
                }
                result.push(tab);
            });

            return result;
        },
        addToNavigationData: function addToNavigationData() {
            var tabs = this.makeNavigationData(this.getTree(), 0);
            var method = this.configuration.method;
            var originalTabs = Configuration.navigationData;
            var navigationTabs;

            switch (method) {
                case 'prepend':
                    navigationTabs = _.union(tabs, originalTabs);
                    break;
                case 'child':
                    navigationTabs = originalTabs;
                    navigationTabs[this.configuration.parentIndex].categories = tabs;
                    break;
                case 'merge':
                    navigationTabs = originalTabs;
                    Array.prototype.splice.apply(navigationTabs, [this.configuration.mergeIndex, 0].concat(tabs));
                    break;
                // case 'append':
                default:
                    navigationTabs = _.union(originalTabs, tabs);
                    break;
            }

            Configuration.navigationData = navigationTabs;
        },
        mountToApp: function mountToApp(application) {
            this.configuration = application.getConfig('modulesConfig.Categories');

            if (this.configuration.addToNavigationTabs) {
                this.addToNavigationData(application);
            }
        }
    };
});
