define('Backbone.PluginInstaller', [
    'PluginContainer',
    'Backbone',
    'underscore',
    'Backbone.View.render'

], function BackbonePluginInstaller(
    PluginContainer,
    Backbone,
    _
) {
    'use strict';
    var installPlugin = {
        installPlugin: function installPlugin(container, plugin) {
            if (!this[container]) {
                this[container] = new PluginContainer();
            }
            this[container].install(plugin);
        }
    };
    _.extend(Backbone.Model.prototype, installPlugin);
    _.extend(Backbone.View.prototype, installPlugin);
    _.extend(Backbone.Router.prototype, installPlugin);
});