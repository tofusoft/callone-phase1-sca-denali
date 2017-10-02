{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<li class="header-mini-cart-item-cell" data-item-id="{{itemId}}" data-item-type="{{itemType}}">
		<a {{{linkAttributes}}}>
			<div class="header-mini-cart-item-cell-image">
				<img src="{{resizeImage line.item._thumbnail.url 'tinythumb'}}?resizeh=60" alt="{{line.item._thumbnail.altimagetext}}">
			</div>
		</a>
		<div class="header-mini-cart-item-cell-details">
			<ul>
			    <li class="header-mini-cart-item-cell-product-title"><a {{{linkAttributes}}} class="header-mini-cart-item-cell-title-navigable">{{line.item._name}}</a></li>
			    <li class="header-mini-cart-item-cell-product-price">{{line.total_formatted}}</li>
				<div data-view="Item.SelectedOptions"></div>
			    <li class="header-mini-cart-item-cell-product-qty">
			    	<strong>{{translate 'Quantity: '}}</strong> 
			    	<span class="header-mini-cart-item-cell-quantity-value">
			    		{{line.quantity}}
			    	</span>
			    </li>
		    </ul>
		</div>

</li>