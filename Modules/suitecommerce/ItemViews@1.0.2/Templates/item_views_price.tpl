{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-views-price">
	{{#if isPriceRange}}
		<span class="item-views-price-range" itemprop="offers" itemscope itemtype="http://schema.org/AggregateOffer">
			<meta itemprop="priceCurrency" content="{{currencyCode}}"/>
			<!-- Price Range -->
			<span class="item-views-price-lead">
				{{translate '<span itemprop="lowPrice" data-rate="$(0)" >$(1)</span> to <span itemprop="highPrice" data-rate="$(2)">$(3)</span>' minPrice minPriceFormatted maxPrice maxPriceFormatted}}
			</span>
			{{#if showComparePrice}}
				<small class="item-views-price-old">
					{{comparePriceFormatted}}
				</small>
			{{/if}}
			<link itemprop="availability" href="{{#if isInStock}}http://schema.org/InStock{{else}}http://schema.org/OutOfStock{{/if}}"/>
		</span>

	{{else}}
		<span class="item-views-price-exact" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
			<meta itemprop="priceCurrency" content="{{currencyCode}}"/>
			<!-- Single -->
			<span class="item-views-price-lead" itemprop="price" data-rate="{{price}}">{{priceFormatted}}</span>
			{{#if showComparePrice}}
				<small class="item-views-price-old">
					{{comparePriceFormatted}}
				</small>
			{{/if}}
			<link itemprop="availability" href="{{#if isInStock}}http://schema.org/InStock{{else}}http://schema.org/OutOfStock{{/if}}"/>
		</span>
	{{/if}}
</div>