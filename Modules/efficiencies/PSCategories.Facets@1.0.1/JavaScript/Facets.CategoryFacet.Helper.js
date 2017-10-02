define('Facets.CategoryFacet.Helper', [
    'Categories',
    'underscore'
], function FacetsCategoryFacetHelper(
    Categories,
    _
) {
    'use strict';

    return {
        showCategoryPage: function showCategoryPage(categoryPath) {
            var currentCategory = categoryPath[categoryPath.length - 1];
            var oneLevel = false;
            var twoLevels = false;
            if (_.size(currentCategory.categories)) {
                oneLevel = true;
                twoLevels = _.any(currentCategory.categories, function any(children) {
                    return _.size(children.categories) > 0;
                });
            } else {
                twoLevels = false;
            }

            return twoLevels || (oneLevel && categoryPath.length === 1);
        },
        getFromPathForFacet: function getFromPathForFacet(categoryPath) {
            return this.getCategoryFacet(this.getCategoryListFromPath(categoryPath));
        },
        getCategoryListFromPath: function getCategoryListFromPath(categoryPath) {
            var categoriesList;
            var categoryLevel;
            var currentCategory;
            var currentCategoryHasChildren;
            var offset = 2; // go to my grandParent, and from there grab my uncles and parent

            if (!categoryPath || categoryPath.length === 0) return [];


            categoryLevel = categoryPath.length;
            currentCategory = categoryPath[categoryLevel - 1];
            currentCategoryHasChildren = currentCategory && _.size(currentCategory.categories ) > 0;

            if (!currentCategory) return [];

            if (currentCategoryHasChildren) {
                offset--; // go to my parent, show my brothers and me, and our children
            }

            if (offset >= categoryLevel) {
                categoriesList = categoryPath[0].categories;
            } else {
                categoriesList = categoryPath[categoryLevel - offset - 1].categories;
            }

            return categoriesList;
        },

        getCategoryFacet: function getCategoryFacet(categoriesList) {
            var facet = {
                configuration: {
                    behavior: 'single',
                    id: 'category',
                    name: '',
                    uncollapsible: true,
                    hideHeading: true
                },
                values: {
                    id: 'category',
                    values: []
                }
            };

            _.each(categoriesList, function each(subCategory) {
                var val = {
                    label: subCategory.name,
                    url: subCategory.facetUrl,
                    image: subCategory.thumbnail,
                    id: subCategory.facetUrl
                };

                if (_.size(subCategory.categories) > 0) {
                    val.values = [];

                    _.each(subCategory.categories, function eachThirdLevel(thirdLevel) {
                        val.values.push({
                            label: thirdLevel.name,
                            url: thirdLevel.facetUrl,
                            image: thirdLevel.thumbnail,
                            id: thirdLevel.facetUrl
                        });
                    });
                }
                facet.values.values.push(val);
            });

            return facet;
        }
    };
});