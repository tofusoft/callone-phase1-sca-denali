/* global Application:false */
function service(request) {
    'use strict';

    var method;
    var id;
    var data;
    var Application = require('Application');
    var BackInStockNotification;
    var listHeaderData;
    var resultId;

    try {
        method = request.getMethod();
        id = request.getParameter('internalid');
        data = JSON.parse(request.getBody() || '{}');
        BackInStockNotification = require('BackInStockNotification');

        switch (method) {

        case 'GET':
            if (id) {
                Application.sendContent(BackInStockNotification.get(id));
            } else {
                listHeaderData = {
                    order: request.getParameter('order'),
                    sort: request.getParameter('sort'),
                    page: request.getParameter('page')
                };
                Application.sendContent(BackInStockNotification.list(listHeaderData));
            }

            break;

        case 'POST':
            resultId = BackInStockNotification.post(data);
            Application.sendContent(BackInStockNotification.get(resultId, true));

            break;

        case 'DELETE':
            BackInStockNotification.delete(id);
            Application.sendContent({
                status: 'ok'
            });

            break;

        default:
            return Application.sendError(methodNotAllowedError);
        }
    } catch(e) {
        Application.sendError(e);
    }
}
