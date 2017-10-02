{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<article class="product-list-details-later-macro-selectable-actionable" data-id="{{itemId}}" data-item-id="{{itemDetailsId}}">
	<div>
		<div class="product-list-details-later-macro-thumbnail" data-type="product-list-item" data-action="product-list-item">
			<img src="{{thumbnailUrl}}" alt="{{thumbnailAlt}}">
		</div>
		<div class="product-list-details-later-macro-details">
			<div class="product-list-details-later-macro-info" data-type="item-details">
			
				<p class="product-list-details-later-macro-name">
					<a href="#" data-touchpoint="home" data-hashtag="#{{itemDetailsUrl}}" class="product-list-details-later-macro-name-link"> 
						{{productName}}
					</a>
				</p>
				<p class="product-list-details-later-macro-price">
					<div data-view="ItemViews.Price"></div>
				</p>

				<div data-view="Item.SelectedOptions"></div>
				<div data-view="ProductList.DetailsMinQuantity"></div>
			</div>
			<div class="product-list-details-later-macro-qty">
				<form action="#" class="product-list-details-later-macro-qty-form" data-action="update-quantity-item-list">
					<input type="hidden" name="internalid" id="update-internalid-{{lineId}}" class="update-internalid-{{lineId}}" value="{{lineId}}">
					<label for="quantity-{{lineId}}">
						{{#if isGiftCertificate}}
							<input max="99" value="1" type="hidden" name="item_quantity"  id="item_quantity-{{itemId}}" class="product-list-details-later-macro-qty-input quantity-{{itemId}}" value="{{quantity}}" min="1" data-action="change-quantity"/>
						{{else}}
							<label class="product-list-details-later-macro-label-qty">{{translate 'Quantity:'}}</label>
							<div class="product-list-details-later-macro-input-qty">
								<button class="product-list-details-later-macro-button-quantity-minus" data-ui-action="minus">-</button>
			       				<input max="99" type="number" name="item_quantity"  id="item_quantity-{{itemId}}" class="product-list-details-later-macro-qty-input quantity-{{itemId}}" value="{{quantity}}" min="1" data-action="change-quantity"/>
			       				<button class="product-list-details-later-macro-button-quantity-add" data-ui-action="add">+</button>
			       			</div>
						{{/if}}
					</label>
				</form>
			</div>
			<div class="product-list-details-later-macro-amount">

			</div>
			<div class="product-list-details-later-macro-item-stock">
				<div data-view="ItemViews.Stock"></div>
			</div>
	
			<div class="product-list-details-later-macro-actions" data-type="item-commands">
				{{#if showActions}}
				<button data-action="add-to-cart" class="product-list-details-later-macro-button-addtocart {{#unless canBeAddedToCart}}disabled{{/unless}}" {{#unless canBeAddedToCart}}disabled{{/unless}}>
					{{translate 'Move to Cart'}}
				</button>
				<button class="product-list-details-later-macro-button-remove" data-action="delete-item">
					{{translate 'Remove'}}</button>
				{{/if}}
			</div>
		</div>
	</div>
</article>