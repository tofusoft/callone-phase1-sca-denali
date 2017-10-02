/*
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define('QS.Header.View', [
    'Header.View',
    'Backbone.CompositeView',
    'underscore'
],
function QSHeaderView(
    HeaderView,
    BackboneCompositeView,
    _
) {
    'use strict';

    HeaderView.prototype.initialize = function initialize() {
        var self = this;
        BackboneCompositeView.add(this);

        this.render = _(this.render).wrap(function wrapFn(originalRender) {
            originalRender.apply(self, Array.prototype.slice.call(arguments, 1));
            // in QS the site search is always visible, the next code is not needed anymore
            // Backbone.history.on('all', function() {
            //     self.verifyShowSiteSearch();
            // });
        });
    };
});
