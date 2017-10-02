function service() {
    'use strict';

    var method;
    var data;
    var url;
    var Application = require('Application');
    var NewsletterSignUpConfig = require('Newsletter.SignUp.Configuration');

    try {
        method = request.getMethod();

        if (method === 'POST') {
            data = JSON.parse(request.getBody());

            data.email = escape(data.email);
            data.firstname = 'NSFirstName';
            data.lastname = 'NSLastName';

            url = 'https://' + NewsletterSignUpConfig.domain + '/app/site/crm/externalleadpage.nl?compid=' +
                nlapiGetContext().getCompany() + '&formid=' + NewsletterSignUpConfig.formId + '&h=' +
                NewsletterSignUpConfig.hash + '&globalsubscriptionstatus=1';

            nlapiRequestURL(url, data);

            return Application.sendContent({
                successMessage: 'Thanks for signing up for our newsletter!'
            });
        }

        return Application.sendError(methodNotAllowedError);
    } catch(ex) {
        return Application.sendError(ex);
    }
}
