define('CMSadapterFixes',	[
    'CMSadapter.Model',
    'Configuration',
    'Application',
    'underscore'
], function CMSSandboxFix(
    CMSAdapterModel,
    Configuration,
    Application,
    _
) {
    'use strict';

    _.extend(Application, {
        getEnvironment: _.wrap(Application.getEnvironment, function getEnvironmentCMSFixes(fn) {
            var useCms = Configuration.useCMS;
            var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));
            Configuration.useCMS = useCms;
            result.useCMS = useCms;
            return result;
        })
    });

    _.extend(CMSAdapterModel, {

        getPages: function getPages() {
            var cmsRequestT0 = new Date().getTime();
            var cmsPagesHeader = {'Accept': 'application/json' };
            var isSecure = request.getURL().indexOf('https:') === 0;
            var currentDomainMatch = request.getURL().match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var currentDomain = currentDomainMatch && currentDomainMatch[0];

            var environmentSubDomain;
            var cmsPagesUrl;
            var cmsPagesResponse;
            var cmsPagesResponseBody;
            var data;
            var errorFlag = false;

            switch (nlapiGetContext().getEnvironment().toString()) {
            case 'INTERNAL':
                // Internal domains usually don't have a proper domain configured
                environmentSubDomain = '.f';
                cmsPagesUrl = 'https://system' + environmentSubDomain +
                    '.netsuite.com/';
                break;
            default:
                // SANDBOX/BETA/PRODUCTION
                cmsPagesUrl = currentDomain;
            }

            // Avoid landing pages on secure domain.
            if (!isSecure) {
                cmsPagesUrl += 'api/cms/pages?site_id=' + session.getSiteSettings(['siteid']).siteid +
                    '&c=' + nlapiGetContext().getCompany() + '&{}';
                try {
                    cmsPagesResponse = nlapiRequestURL(cmsPagesUrl, null, cmsPagesHeader);
                    cmsPagesResponseBody = JSON.parse(cmsPagesResponse.getBody());
                } catch (e) {
                    errorFlag = true;
                }
            } else {
                cmsPagesResponseBody = [];
            }

            data = {
                /* jshint -W106 */
                _debug_requestTime: (new Date().getTime()) - cmsRequestT0,
                _request_done: !isSecure,
                _error: errorFlag,
                /* jshint +W106 */
                pages: cmsPagesResponseBody
            };

            return data;
        }
    });
});
