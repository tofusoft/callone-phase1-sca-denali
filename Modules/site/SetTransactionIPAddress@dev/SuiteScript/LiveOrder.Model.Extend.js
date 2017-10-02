/**
 * Created by bbenzano on 4/22/2016.
 */
define(
'LiveOrder.Model.Extend',
[
    'Application',
    'underscore',
    'Utils'
],
function (Application, _, Utils) {

    'use strict';

    Application.on('before:LiveOrder.submit', function (Model, requestData) {
        var data = Model.get();
        try {
            data.options = data.options || {};
            data.options.custbody_ip_address = request.getHeader('NS-Client-IP');

            order.setCustomFieldValues(data.options);
        }catch (e){
            nlapiLogExecution('ERROR', 'Error setting IP Address', e);
        }
    });
});