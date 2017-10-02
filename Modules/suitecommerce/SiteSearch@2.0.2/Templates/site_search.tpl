{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="site-search">
    <div class="site-search-content">
        <form class="site-search-content-form" method="GET" action="/search" data-action="search">
            <div class="site-search-content-input">
                <input data-type="site-search" class="site-search-input typeahead" placeholder="{{translate 'Search for products'}}" type="search" name="keywords" autocomplete="off" maxlength="{{maxLength}}"/>
                <i class="site-search-input-icon"></i>
                <a class="site-search-input-reset"><i class="site-search-input-reset-icon"></i></a>
            </div>
            <button class="site-search-button-submit" type="submit">{{translate 'Go'}}</button>
            <a href="#" class="site-search-button-close" data-action="hide-sitesearch">{{translate 'Close'}}</a>
        </form>
    </div>
</div>