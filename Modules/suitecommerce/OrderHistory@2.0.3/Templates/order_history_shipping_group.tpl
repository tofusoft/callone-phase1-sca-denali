{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showShipAddress}}
	<div class="order-history-shipping-group-information-details" data-id="{{model.id}}">
		<!-- SHIPPING INFORMATION -->
		<div>
			<div>
				<span class="order-history-shipping-group-shipping-address-subtitle">
					{{translate 'Shipping Address'}}
				</span>
			</div>
			<div class="order-history-shipping-group-information-info">
				<div data-view="Shipping.Address"></div>
			</div>
		</div>
		<!-- SHIPPING INFORMATION ENDS -->
{{/if}}

{{#if showLines}}
	<!-- FULFILLMENT FULFILLEDS -->

		<div class="order-history-shipping-group-accordion-head">
			<a class="order-history-shipping-group-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#{{targetId}}" aria-expanded="true" aria-controls="{{targetId}}">
			{{#if linesLengthGreaterThan1}}
				{{translate 'Products shipped ($(0))' linesLength}}
			{{else}}
				{{translate 'Product shipped ($(0))' linesLength}}
			{{/if}}
			<i class="order-history-shipping-group-accordion-toggle-icon"></i>
			</a>
		</div>
		<div class="order-history-shipping-group-accordion-body collapse" id="{{targetId}}" role="tabpanel" data-target="{{targetId}}">
			<div class="order-history-shipping-group-accordion-container" data-content="order-items-body">
				<div data-view="Fullfillments.Collection"></div>
			</div>
		</div>

	<!-- FULLFILLMENT FULFILLEDS ENDS -->
{{/if}}

{{#if showShipAddress}}
	</div>
{{/if}}

