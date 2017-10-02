define('Facets.Browse.CategoryHeading.View', [
    'Backbone',
    'facets_browse_category_heading.tpl'
    // 'underscore'
], function FacetBrowseCategoryHeading(
    Backbone,
    facetsBrowseCategoryHeadingTpl
    // _
) {
    'use strict';
    return Backbone.View.extend({
        template: facetsBrowseCategoryHeadingTpl,
        getContext: function getContext() {
            return {
                pageTitle: this.model.get('title') || this.model.get('name'),
                image: this.model.get('image'),
                description: this.model.get('description'),
                hasImageAndDescription: this.model.get('image') && this.model.get('description')
            };
        }
    });
});