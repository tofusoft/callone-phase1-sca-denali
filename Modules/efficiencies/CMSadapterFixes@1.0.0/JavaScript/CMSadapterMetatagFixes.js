define('CMSadapterMetatagFixes', [
    'CMSadapter',
    'underscore',
    'Backbone',
    'jQuery'
], function CMSadapterMetatagFixes(
    CMSadapter,
    _,
    Backbone,
    jQuery
) {
    'use strict';

    // Remove when Mount Blanc is released
    CMSadapter.enhancePage = function enhancePage(view, layout, page)
    {
        var $head = jQuery('head');

        // first, initialize head tags if they are not present
        $head
            .not(':has(title)').append('<title/>').end()
            .not(':has(link[rel="canonical"])').append('<link rel="canonical"/>').end()
            .not(':has(meta[name="keywords"])').append('<meta name="keywords"/>').end()
            .not(':has(meta[name="description"])').append('<meta name="description"/>').end();

        view.title = (page && page.get('page_title')) || view.getTitle();
        view.metaDescription = (page && page.get('meta_description')) || view.getMetaDescription();
        view.metaKeywords = (page && page.get('meta_keywords')) || view.getMetaKeywords();


        // set title in DOM
        var title = view.getTitle();

        if (title)
        {
            document.title = title;
        }

        // Sets the text of the title element if we are in the server
        // we only do it on the server side due to an issue modifying
        // the title tag on IE :(
        if (SC.ENVIRONMENT.jsEnvironment === 'server')
        {
            $head.find('title').text(title);
        }

        // meta keywords and meta description. We aren't adding the tags but reusing existing ones
        $head
            .find('meta[name="description"]').attr('content', view.getMetaDescription()).end()
            .find('meta[name="keywords"]').attr('content', view.getMetaKeywords()).end();

        $head
            .find('link[rel="canonical"]').attr('href', view.getCanonical()).end()
            // we remove any existing next/prev tags every time
            // a page is rendered in case the previous view was paginated
            .find('link[rel="next"], link[rel="prev"]').remove();

        // if the current page is paginated
        // set prev/next link rel
        this.setLinkRel('prev', view.getRelPrev(), $head);
        this.setLinkRel('next', view.getRelNext(), $head);

        // addition to head. Heads up! Each element added is stored and when the view is destroyed we remove these
        // elements from the DOM. If not the head will be polluted each time the user navigates.
        var additionToHead = page && page.get('addition_to_head');

        view.enhancedNodes = [];

        if (additionToHead && jQuery.trim(additionToHead + ''))
        {
            var $additionToHead = jQuery(additionToHead);
            $additionToHead.each(function ()
            {
                var $node = jQuery(this);
                $head.append($node);
                view.enhancedNodes.push($node);
            });
        }

        view.destroy = _.wrap(view.destroy, function(fn)
        {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(this, args);
            Backbone.View.prototype.render.apply(this, args);
            _.each(this.enhancedNodes, function ($node)
            {
                $node.remove();
            });
        });
    };
});