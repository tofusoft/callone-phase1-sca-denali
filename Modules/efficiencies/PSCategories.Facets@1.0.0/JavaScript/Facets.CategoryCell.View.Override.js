define('Facets.CategoryCell.View', [
    'facets_category_cell.tpl',
    'Backbone'
], function FacetsCategoryCellView(
    facets_category_cell_tpl,
	Backbone
) {
    'use strict';

	// @class Facets.CategoryCell.View @extends Backbone.View
    return Backbone.View.extend({
        template: facets_category_cell_tpl,
		// @method getContext @return Facets.CategoryCell.View.Context
        getContext: function getContext() {
            return {
                // @property {String} label
                label: this.model.get('name'),

                // @property {String} name
                url: this.model.get('url'),

				// @property {String} image
                image: this.model.get('thumbnail'),

				// @proerty {String} briefDescription
                briefDescription: this.model.get('briefDescription')
            };
        }
    });
});