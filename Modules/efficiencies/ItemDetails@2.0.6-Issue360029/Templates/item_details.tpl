{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-details">
	<div data-cms-area="item_details_banner" data-cms-area-filters="page_type"></div>

	<header class="item-details-header">
		<div id="banner-content-top" class="item-details-banner-top"></div>
	</header>
	<div class="item-details-divider-desktop"></div>
	<article class="item-details-content" itemscope itemtype="http://schema.org/Product">
		<meta itemprop="url" content="{{model._url}}">
		<div id="banner-details-top" class="item-details-banner-top-details"></div>

		<section class="item-details-main-content">
			<div class="item-details-content-header">
				<h1 class="item-details-content-header-title" itemprop="name">{{model._pageHeader}}</h1>
				{{#if showReviews}}
				<div class="item-details-rating-header" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">
					<div class="item-details-rating-header-rating" data-view="Global.StarRating"></div>
				</div>
				{{/if}}
				<div data-cms-area="item_info" data-cms-area-filters="path"></div>
			</div>

			<div class="item-details-divider"></div>

			<div class="item-details-image-gallery-container">
				<div id="banner-image-top" class="content-banner banner-image-top"></div>
				<div data-view="ItemDetails.ImageGallery"></div>
				<div id="banner-image-bottom" class="content-banner banner-image-bottom"></div>
			</div>

			<div class="item-details-divider"></div>

			<div class="item-details-main">

				<section class="item-details-info">
					<div id="banner-summary-bottom" class="item-details-banner-summary-bottom"></div>

					<div class="item-details-price">
						<div data-view="Item.Price"></div>
					</div>

					<div class="item-details-sku-container">
						<span class="item-details-sku">
							{{translate 'SKU: #'}}
						</span>
						<span class="item-details-sku-value" itemprop="sku">
							{{sku}}
						</span>
					</div>
					<div data-view="Item.Stock"></div>
				</section>

				{{#if showRequiredReference}}
					<div class="item-details-text-required-reference-container">
						<small>Required <span class="item-details-text-required-reference">*</span></small>
					</div>
				{{/if}}

				<section class="item-details-options">
					{{#if isItemProperlyConfigured}}
						{{#if hasAvailableOptions}}
							<button class="item-details-options-pusher" data-type="sc-pusher" data-target="item-details-options"> {{#if isReadyForCart}}{{ translate 'Options' }}{{else}}{{ translate 'Select options' }}{{/if}} {{#if hasSelectedOptions}}:{{/if}} <i></i>
								{{#each selectedOptions}}
									{{#if @first}}
										<span> {{ label }} </span>
									{{else}}
										<span> , {{ label }} </span>
									{{/if}}
								{{/each}}
							</button>
						{{/if}}

						<div class="item-details-options-content" data-action="pushable" data-id="item-details-options">

							<div class="item-details-options-content-price" data-view="Item.Price"></div>

							<div class="item-details-options-content-stock"  data-view="Item.Stock"></div>

							<div data-view="ItemDetails.Options"></div>
						</div>
					{{else}}
						<div class="alert alert-error">
							{{translate '<b>Warning</b>: This item is not properly configured, please contact your administrator.'}}
						</div>

					{{/if}}
				</section>

				{{#if isItemProperlyConfigured}}
					<section class="item-details-actions">

						<form action="#" class="item-details-add-to-cart-form" data-validation="control-group">
							{{#if showQuantity}}
								<input type="hidden" name="quantity" id="quantity" value="1">
							{{else}}
								<div class="item-details-options-quantity" data-validation="control">
									<label for="quantity" class="item-details-options-quantity-title">
										{{translate 'Quantity'}}
									</label>

									<button class="item-details-quantity-remove" data-action="minus" {{#if isMinusButtonDisabled}}disabled{{/if}}>-</button>
									<input type="number" name="quantity" id="quantity" class="item-details-quantity-value" value="{{quantity}}" min="1">
									<button class="item-details-quantity-add" data-action="plus">+</button>

									{{#if showMinimumQuantity}}
										<small class="item-details-options-quantity-title-help">
											{{translate '(Minimum of $(0) required)' minQuantity}}
										</small>
									{{/if}}
								</div>
							{{/if}}

							{{#unless isReadyForCart}}
								{{#if showSelectOptionMessage}}
									<p class="item-details-add-to-cart-help">
										<i class="item-details-add-to-cart-help-icon"></i>
										<span class="item-details-add-to-cart-help-text">{{translate 'Please select options before adding to cart'}}</span>
									</p>
								{{/if}}
							{{/unless}}
							<div class="item-details-actions-container">
								<div class="item-details-add-to-cart">
									<button data-type="add-to-cart" data-action="sticky" class="item-details-add-to-cart-button" {{#unless isReadyForCart}}disabled{{/unless}}>
										{{translate 'Add to Cart'}}
									</button>
								</div>
								<div class="item-details-add-to-wishlist" data-type="product-lists-control" {{#unless isReadyForWishList}} data-disabledbutton="true"{{/unless}}>
								</div>
							</div>
						</form>


						<div data-type="alert-placeholder"></div>

					</section>
				{{/if}}
				<div class="item-details-main-bottom-banner">
					<div data-view="SocialSharing.Flyout"></div>
					<div id="banner-summary-bottom" class="item-details-banner-summary-bottom"></div>
				</div>
			<div id="banner-details-bottom" class="item-details-banner-details-bottom" data-cms-area="item_info_bottom" data-cms-area-filters="page_type"></div>
			</div>
		</section>

        <section class="item-details-more-info-content">
            <!-- Nav tabs -->
            {{#if showDetails}}
                <ul class="item-details-tab-title" role="tablist">
                    {{#each details}}
                        <li role="presentation" class="{{#if @first}}active{{/if}}"><a data-target="#item-details-info-{{ @index }}" role="tab" data-toggle="tab">{{ name }}</a></li>
                    {{/each}}
                    {{#if showReviews}}
                        <li role="presentation"><a data-target="#item-details-info-reviews" role="tab" data-toggle="tab">{{ translate 'Reviews' }}</a></li>
                    {{/if}}
                </ul>

                <!-- Tab panes -->
                <div class="tab-content">
                    {{#if showReviews}}
                        <div role="tabpanel" class="tab-pane" id="item-details-info-reviews"><div data-view="ProductReviews.Center"></div></div>
                    {{/if}}
                    {{#each details}}
                        <div role="tabpanel" class="tab-pane {{#if @first}}active{{/if}}" id="item-details-info-{{ @index }}">{{{content}}}</div>
                    {{/each}}
                </div>
            {{/if}}
        </section>

		<div class="item-details-divider-desktop"></div>

		<div class="item-details-content-related-items">
			<div data-view="Related.Items"></div>
		</div>

		<div class="item-details-content-correlated-items">
			<div data-view="Correlated.Items"></div>
		</div>
		<div id="banner-details-bottom" class="content-banner banner-details-bottom" data-cms-area="item_details_banner_bottom" data-cms-area-filters="page_type"></div>
	</article>
</div>
