{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="product-list-bulk-actions-button-group">

	<button class="product-list-bulk-actions-button-addtocart" data-action="add-items-to-cart" {{#unless isAddToCartEnabled}}disabled{{/unless}}>{{translate 'Add Items to Cart'}}</button>
	<button class="product-list-bulk-actions-button-expander" data-toggle="dropdown" aria-expanded="false" {{#unless isAtLeastOneItemChecked}}disabled{{/unless}}>
		<i></i>
	</button>
	
	<ul class="product-list-bulk-actions-dropdown" role="menu">
		<li>
			<a href="#" data-action="delete-items" {{#unless isAtLeastOneItemChecked}}disabled{{/unless}}>{{translate 'Remove Items'}}</a>
		</li>
	</ul>
</div>