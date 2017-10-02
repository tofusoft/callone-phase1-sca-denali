define('ItemDetails.View.Categories', [
    'underscore',
    'ItemDetails.View',
    'Categories'
], function ItemDetailsViewCategories(
    _,
    View,
    Categories
) {
    'use strict';

    // Extensions to the ItemDetails View to improve category handling. Breadcrumb

    _.extend(View.prototype, {

        getCategory: function getCategory() {
            return this.options.categoryPath && this.options.categoryPath[this.options.categoryPath.length - 1];
        },
        getCategoryPath: function getCategoryPath() {
            return this.options.categoryPath;
        },
        getCanonical: _.wrap(View.prototype.getCanonical, function wrap(fn) {
            var canonical;
            if (this.application.getConfig('modulesConfig.Categories.categoryOnProductURL')) {
                canonical = window.location.protocol + '//' + window.location.hostname + '/';
                canonical += this.model.get('_defaultUrl');
            } else {
                canonical = fn.apply(this, _.toArray(arguments).slice(1));
            }
            return canonical;
        }),
        getBreadcrumbPages: function getBreadcrumbPages() {
            var breadcrumb = [];
            var categoryPath;
            var finalValue;

            // From defaultcategory_detail
            var defaultcategoryDetail = this.model.get('defaultcategory_detail');
            var defaultcategoryPath = _.compact(_.pluck(defaultcategoryDetail, 'url')).join('/');
            var defaultCategoryBreadcrumbPath = Categories.getBranchLineFromFacetPath(defaultcategoryPath);

            // End from defaultacategory detalis


            // Try getting category from values
            var facets = this.model.get('facets');
            var categoryFacet = _.findWhere(facets, {id: 'category'});
            var walker = categoryFacet.values && categoryFacet.values[0];

            var firstFacetBreadcrumbPath;

            while (walker) {
                finalValue = walker;
                walker = walker.values[0];
            }
            firstFacetBreadcrumbPath = finalValue && Categories.getBranchLineFromFacetPath(finalValue.id);


            // CategoryPath is SiteBuilder URL case;
            if (this.application.getConfig('modulesConfig.Categories.categoryOnProductURL')) {
                categoryPath = this.getCategoryPath();
            } else {
                if (_.size(defaultCategoryBreadcrumbPath)) {
                    categoryPath = defaultCategoryBreadcrumbPath;
                } else if (firstFacetBreadcrumbPath) {
                    categoryPath = firstFacetBreadcrumbPath;
                } else {
                    categoryPath = [];
                }
            }

            _.each(categoryPath, function each(category) {
                breadcrumb.push({
                    href: category.url,
                    text: category.name
                });
            });

            breadcrumb.push({
                href: this.model.get('_url'),
                text: this.model.get('_name')
            });

            return breadcrumb;
        }
    });
});