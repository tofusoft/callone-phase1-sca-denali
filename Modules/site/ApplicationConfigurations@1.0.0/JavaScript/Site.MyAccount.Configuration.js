define('Site.MyAccount.Configuration', [
    'SC.MyAccount.Configuration',
    'Site.Global.Configuration',
    'underscore'
], function SiteCheckoutConfiguration(
    MyAccountConfiguration,
    GlobalConfiguration,
    _
) {
    'use strict';

    var SiteApplicationConfiguration = {
        hi: 'true',
        tracking: {
            // [Google Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
            googleUniversalAnalytics: {
                propertyID: 'UA-55341241-1'
                ,	domainName: ''
            }
            // [Google Analytics](https://developers.google.com/analytics/devguides/collection/gajs/)
            ,	google: {
                propertyID: ''
                ,	domainName: ''
            }
            // [Google AdWords](https://support.google.com/adwords/answer/1722054/)
            ,	googleAdWordsConversion: {
                id: 0
                ,	value: 0
                ,	label: ''
            }
        },
    };

    _.extend(MyAccountConfiguration, GlobalConfiguration, SiteApplicationConfiguration);


    return {
        mountToApp: function mountToApp(application) {
            _.extend(application.Configuration, MyAccountConfiguration);
        }
    };
});