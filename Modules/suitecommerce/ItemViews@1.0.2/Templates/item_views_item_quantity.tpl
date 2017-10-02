{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showQuantity}}
	<p>{{translate '<span><strong>Quantity</strong></span>: <span class="item-views-item-quantity">$(0)</span>' line.quantity }}</p>
{{/if}}

{{#if showAmount}}
	<p>
		<span>{{translate '<strong>Total Amount:</strong>'}}</span>
		{{#if showDiscount}}
			<span class="item-views-item-quantity-item-amount">
				{{line.total_formatted}}
			</span>
			<span class="item-views-item-quantity-non-discounted-amount">
				{{line.amount_formatted}}
			</span>
		{{else}}
			<span class="item-views-item-quantity-item-amount">
				{{line.amount_formatted}}
			</span>
		{{/if}}
	</p>
{{/if}}