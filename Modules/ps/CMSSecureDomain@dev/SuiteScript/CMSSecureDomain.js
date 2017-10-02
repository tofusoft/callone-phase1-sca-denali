define('CMSSecureDomain', [
    'underscore',
    'Application'
], function CMSSecureDomain(
    _,
    Application
) {

    'use strict';

    _.extend(Application, {

        getEnvironment: _.wrap(Application.getEnvironment, function(fn) {
            var useCms = SC.Configuration.useCMS;
            var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));
            SC.Configuration.useCMS = useCms;
            result.useCMS = useCms;
            return result;
        })

    });
});