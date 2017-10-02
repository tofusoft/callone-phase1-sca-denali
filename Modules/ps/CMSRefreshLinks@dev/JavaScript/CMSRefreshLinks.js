
//Add to element: data-cms-refresh

define('CMSRefreshLinks', [
    'jQuery'
], function(
    jQuery
) {
    'use strict';

    var Module = {

        refreshAttr: 'data-cms-refresh',

        refreshCmsAreas: function refreshLinks() {
            if(typeof CMS !== 'undefined') {
                CMS.trigger('adapter:page:changed');
            }
        },

        mountToApp: function mountToApp(application) {
            var layout = application.getLayout();

            layout.mouseUp.install({
                name: 'mouseDownRefreshCmsAreas',
                priority: 30,
                execute: function (e) {
                    setTimeout(function timeout() {
                        if(jQuery('html').hasClass('ns_is-admin') && jQuery(e.currentTarget).is('[' + Module.refreshAttr + ']')) {
                            Module.refreshCmsAreas();
                        }
                    }, 0);
                }
            });
        }
    };

    return Module;
});