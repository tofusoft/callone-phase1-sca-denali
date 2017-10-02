/* exported service */
function service(request) {
    'use strict';

    var Application = require('Application');
    var method = request.getMethod();
    var internalid = request.getParameter('internalid');
    var levels = request.getParameter('levels');
    var PSCategories = require('PSCategories.Model');

    try {
        switch (method) {

        case 'GET':
            if (!internalid) {
                throw methodNotAllowedError;
            }

            Application.sendContent(PSCategories.list(internalid, levels));
            break;

        default:
            Application.sendError(methodNotAllowedError);

        }
    } catch (e) {
        Application.sendError(e);
    }
}
