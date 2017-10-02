define('ResolveAssetUrlHandlebarsAddOn', [
    'Handlebars',
    'ResolveAssetUrlUtils'
], function HandlebarsAddOns(
    Handlebars,
    Utils
) {
    'use strict';

    var Module = {
        validateParamBoolean: function validateUseLocalParam(param) {
            return (typeof param === 'boolean') ? param : false;
        }
    };

    Handlebars.registerHelper('absoluteUrl', function registerHelper(file, useLocalParam) {
        var useLocal = Module.validateParamBoolean(useLocalParam);
        return Utils.getAbsoluteUrl(file, useLocal);
    });

    Handlebars.registerHelper('hostingRootUrl', function registerHelper(file, useLocalParam) {
        var useLocal = Module.validateParamBoolean(useLocalParam);
        return Utils.getHostingRootUrl(file, useLocal);
    });

    return Module;
});