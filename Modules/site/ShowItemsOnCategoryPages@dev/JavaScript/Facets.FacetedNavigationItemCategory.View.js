define('Facets.FacetedNavigationItemCategory.View', [
    'facets_faceted_navigation_item_category.tpl',
    'Backbone',
    'Backbone.CompositeView',
    'underscore'
], function FacetsFacetedNavigationItemCategoryViewConstructor(
    facets_faceted_navigation_item_tpl,
    Backbone,
    BackboneCompositeView,
    _
) {
    'use strict';

    // @class Facets.FacetedNavigationItem.View @extends Backbone.View
    var FacetsFacetedNavigationItemCategoryView = Backbone.View.extend({
        template: facets_faceted_navigation_item_tpl,
        initialize: function initialize() {
            BackboneCompositeView.add(this);
            this.facetId = this.model.get('url') || this.model.get('id');
            this.facet_config = this.options.translator.getFacetConfig(this.facetId);

            if (!this.model.get('level')) {
                this.model.set('level', 1);
            }

        },
        childViews: {
            'Facets.HierarchicalFacetedNavigationItem.Item': function FacetsHierarchicalFacetedNavigationItemItem(options) {
                var self = this;
                var original_values = _.isArray(this.model.get('values')) ? this.model.get('values') : [this.model.get('values')];
                var childValues = _.findWhere(original_values, {id: options.facetValue}).values;

                childValues = _.map(childValues, function(child)
                {
                    child.isChildOfActive = true;
                    return child;
                });

                var facet_config = this.facet_config;
                var constructorOptions = {
                    model: new Backbone.Model({
                        url: this.model.get('url'),
                        id: this.model.get('id'),
                        values: childValues,
                        level: this.model.get('level') + 1
                    }),
                    translator: this.options.translator
                };

                return new FacetsFacetedNavigationItemCategoryView(constructorOptions);
            }
        },
        // @method getContext @return {Facets.FacetedNavigationItem.View.Context}
        getContext: function ()
        {
            var facet_id = this.facetId;
            var translator = this.options.translator;
            var facet_config = this.facet_config;
            var values = [];
            var max_items;
            var self = this;
            var display_values;
            var show_facet;
            var context;
            // fixes the selected items
            var selected_values = this.options.translator.getFacetValue(facet_id) || [];
            var original_values = _.isArray(this.model.get('values')) ? this.model.get('values') : [this.model.get('values')];

            selected_values = _.isArray(selected_values) ? selected_values : [selected_values];

            // Prepares the values for display


            _.each(original_values, function each(value)
            {
                console.log(value);
                if (value.url !== '') {
                    value.isActive = _.contains(selected_values, value.url);
                    value.link = translator.cloneForFacetId(facet_id, value.url).getUrl();
                    value.displayName = value.label || value.url || _('(none)').translate();

                    if(value.values){
                        value.hasChildren = true;
                        console.log(value);
                        _.each(value.values, function(childValues)
                        {
                            if (_.contains(selected_values, childValues.url)) {
                                value.isParentOfActive = true;
                                value.displayChildren = true;
                            }

                        });
                    }
                    value.isBranchActive = (value.isActive || value.isParentOfActive || value.isChildOfActive);
                    value.showChildren = value.isBranchActive && value.hasChildren;

                    value.level = self.model.get('level');
                    values.push(value);
                }
            });

            max_items = facet_config.max || values.length;
            display_values = _.first(values, max_items);

            show_facet = !!values.length;

            facet_config.uncollapsible = false;

            // @class Facets.FacetedNavigationItem.View.Context
            context = {
                // @property {String} htmlId
                htmlId: _.uniqueId('facetCategory_'),
                // @property {String} facetId
                facetId: facet_id,
                // @property {Boolean} showFacet
                showFacet: show_facet,
                // @property {Boolean} showHeading
                showHeading: this.model.get('level') === 1 && (_.isBoolean(facet_config.showHeading) ? facet_config.showHeading : true),
                // @property {Boolean} isUncollapsible
                isUncollapsible: !!facet_config.uncollapsible,
                // @property {Boolean} isCollapsed
                isCollapsed: !this.facet_config.uncollapsible && this.facet_config.collapsed,
                // @property {String} facetDisplayName
                facetDisplayName: facet_config.name || facet_id,
                // @property {Array<Object>} values
                values: values,
                // @property {Array<Object>} displayValues
                displayValues: display_values
            };

            // @class Facets.FacetedNavigationItem.View
            return context;
        }
    });
    return FacetsFacetedNavigationItemCategoryView;
});