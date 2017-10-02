define('Category.Model', [
    'Backbone.CachedCollection',
    'Backbone.CachedModel',
    'Utils',
    'underscore'
], function CategoryModel(
    CachedCollection,
    CachedModel,
    Utils,
    _
) {
    'use strict';

    var Collection;
    var Model = CachedModel.extend({
        url: Utils.getAbsoluteUrl('services/PSCategories.Service.ss'),
        initialize: function initialize() {
            this.on('change:categories', function onChangeCategories(model, categories) {
                model.set('categories', new Collection(_.values(categories)), {silent: true});
            });
        }
    });

    Collection = CachedCollection.extend({
        url: Utils.getAbsoluteUrl('services/PSCategories.Service.ss'),
        model: Model
    });

    return Model;
});
