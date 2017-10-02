{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if isMoving}}
	<button class="product-list-control-button-move" data-action="show-productlist-control" data-toggle="showFlyout" type="button">
		{{translate 'Move'}}
	</button>
{{else}}
	<button class="product-list-control-button-wishlist" data-action="show-productlist-control" data-toggle="showFlyout" type="button" {{#if isDisabledWishlistButton}}disabled{{/if}}>
		{{translate 'Add to Wishlist'}}
	</button>
{{/if}}
<div class="product-list-control-flyout {{#if isMoving}}product-list-control-move{{/if}}" data-type="productlist-control" {{#if showControl}}style="display: block"{{/if}} data-dropdown-content>

	{{#unless isMoving}}
		<div data-confirm-message=""></div>
	{{/unless}}

	<h5 class="product-list-control-flyout-title">
		{{#if isMoving}}
			{{translate 'Add to'}}
			{{#if hasProductLists}}
				({{productListLength}}
				{{#if hasOneProductList}}
					{{translate 'list'}})
				{{else}}
					{{translate 'lists'}})
				{{/if}}
			{{/if}}:
		{{else}}
			{{translate 'Add to'}}
		{{/if}}
	</h5>
	<ul class="product-list-control-flyout-product-lists">
		{{#if isEmpty}}
		<li class="product-list-control-nolists-messages">
			{{#if isMoving}}
				{{translate 'There are no other lists'}}
			{{else}}
				{{translate 'There are no lists'}}
			{{/if}}
		</li>
		{{/if}}
	</ul>
	<h5 class="product-list-control-flyout-title">{{translate 'Or: '}}</h5>
	<div class="product-list-control-new-product-list-container" data-type="new-item-container"></div>
</div>

