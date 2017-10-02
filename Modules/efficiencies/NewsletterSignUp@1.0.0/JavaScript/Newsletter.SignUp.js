define('Newsletter.SignUp', [
    'Newsletter.SignUp.View',
    'Footer.Simplified.View',
    'Footer.View',
    'underscore'
], function NewsletterSignUp(
    NewsletterSignUpView,
    FooterSimplifiedView,
    FooterView,
    _
) {
    'use strict';

    // console.log(FooterSimplifiedView.prototype.childViews);

    _.extend(FooterSimplifiedView.prototype.childViews, {
        'Newsletter.SignUp': function NewsletterSignUpViewFn() {
            return new NewsletterSignUpView();
        }
    });

    _.extend(FooterView.prototype.childViews, {
        'Newsletter.SignUp': function NewsletterSignUpViewFn() {
            return new NewsletterSignUpView();
        }
    });
});
