{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a class="site-search-item-results" data-hashtag="{{model._url}}" data-touchpoint="home">
    <div class="site-search-item-results-image">
        <img data-loader="false" class="typeahead-image" src="{{resizeImage model._thumbnail.url 'thumbnail'}}" alt="{{model._thumbnail.altimagetext}}">
    </div>
    <div class="site-search-item-results-content">
        <div class="site-search-item-results-title">
            {{highlightKeyword model._name query}}
        </div>
        <div data-view="Global.StarRating"></div>
    </div>
</a>