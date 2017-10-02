{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-cart-summary-container">
		<h3 class="order-wizard-cart-summary-title">
			{{translate 'Order Summary'}}
		</h3>

	<div class="order-wizard-cart-summary-body">
		{{#if showEditCartMST}}
		<div class="order-wizard-cart-summary-edit-cart-label-mst">
			<a href="#" class="order-wizard-cart-summary-edit-cart-link" data-touchpoint="viewcart">
				{{translate 'Edit Cart'}}
			</a>
		</div>
		{{/if}}
		<div class="order-wizard-cart-summary-subtotal">
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-grid-right" >
					{{model.summary.subtotal_formatted}}
				</span>
				<span class="order-wizard-cart-summary-subtotal-label">
					{{#if itemCountGreaterThan1}}
						{{translate 'Subtotal (<span data-type="cart-summary-subtotal-count">$(0)</span> items)' itemCount}}
					{{else}}
						{{translate 'Subtotal (<span data-type="cart-summary-subtotal-count">$(0)</span> item)' itemCount}}
					{{/if}}
				</span>
			</p>
		</div>


		{{#if showPromocode}}
			<div class="order-wizard-cart-summary-promocode-applied">
				<p class="order-wizard-cart-summary-promo-code-applied">
					<strong class="order-wizard-cart-summary-discount-rate">
						{{model.summary.discountrate_formatted}}
					</strong>
					{{translate 'Promo Code Applied'}}
				</p>
				<p class="order-wizard-cart-summary-grid-float">
					#{{model.promocode.code}} - {{translate 'Instant Rebate'}}
					{{#if showRemovePromocodeButton}}
						<a href="#" data-action="remove-promocode">
							<span class="order-wizard-cart-summary-remove-container">
								<i class="order-wizard-cart-summary-remove-icon"></i>
							</span>
						</a>
					{{/if}}
				</p>
			</div>
		{{/if}}

		{{#if showDiscount}}
			<div class="order-wizard-cart-summary-discount-applied">
				<p class="order-wizard-cart-summary-grid-float">
					<span class="order-wizard-cart-summary-discount-total">
						{{model.summary.discounttotal_formatted}}
					</span>
					{{translate 'Discount Total'}}
				</p>
			</div>
		{{/if}}

		{{#if showGiftCertificates}}
			<div class="order-wizard-cart-summary-giftcertificate-applied">
				<h5 class="order-wizard-cart-summary-giftcertificate-title">{{translate 'Gift Certificates Applied ($(0))' giftCertificates.length}}</h5>
				<div data-view="GiftCertificates"></div>
			</div>
		{{/if}}


		<div class="order-wizard-cart-summary-shipping-cost-applied">
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-shipping-cost-formatted">
					{{model.summary.shippingcost_formatted}}
				</span>
				{{translate 'Shipping'}}
			</p>

			{{#if showHandlingCost}}
				<p class="order-wizard-cart-summary-grid-float">
					<span class="order-wizard-cart-summary-handling-cost-formatted">
						{{model.summary.handlingcost_formatted}}
					</span>
					{{translate 'Handling'}}
				</p>
			{{/if}}
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-tax-total-formatted" >
					{{model.summary.taxtotal_formatted}}
				</span>
				{{translate 'Tax'}}
			</p>
		</div>

		<div class="order-wizard-cart-summary-total">
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-grid-right" >
					{{model.summary.total_formatted}}
				</span>
				{{translate 'Total'}}
			</p>
		</div>
	</div>
</div>
{{#if showCartTerms}}
	{{#if requireTermsAndConditions}}
		<p class="order-wizard-cart-summary-order-message">
			<small>
				{{translate 'By placing your order, you are agreeing to our <a data-type="term-condition-link-summary" data-toggle="show-terms-summary" href="#">Terms & Conditions</a>'}}
			</small>
		</p>
	{{/if}}
{{/if}}

{{#if showContinueButton}}
	<div class="order-wizard-cart-summary-button-container">
		<button class="order-wizard-cart-summary-button-place-order" data-action="submit-step">
			{{continueButtonLabel}}
		</button>
	</div>
{{/if}}

{{#if showPromocodeForm}}
	<div class="order-wizard-cart-summary-promocode">
		<div class="order-wizard-cart-summary-promocode-expander-head">
			<a class="order-wizard-cart-summary-promocode-expander-head-toggle collapsed" data-toggle="collapse" data-target="#order-wizard-promocode" aria-expanded="false" aria-controls="order-wizard-promocode">
				{{translate 'Have a Promo Code?'}}
				<i class="order-wizard-cart-summary-promocode-tooltip" data-toggle="tooltip" title="{{translate '<b>Promo Code</b><br>To redeem a promo code, simply enter your information and we will apply the offer to your purchase during checkout.'}}"></i>
				<i class="order-wizard-cart-summary-promocode-expander-toggle-icon"></i>
			</a>
		</div>
		<div class="order-wizard-cart-summary-promocode-expander-body collapse" id="order-wizard-promocode" data-type="promo-code-container" aria-expanded="false" data-target="#order-wizard-promocode">
			<div class="order-wizard-cart-summary-promocode-expander-container">
				{{#if isMultiShipTo}}
					<div class="order-wizard-cart-summary-promocode-unsupported-summary-warning">
						<p>
							{{translate 'Shipping to multiple addresses does not support Promo Codes.'}}
						</p>
						<p>
							{{translate 'If you want to apply one, please <a href="#" data-action="change-status-multishipto-sidebar" data-type="multishipto">ship to a single address</a>.'}}
						</p>
					</div>
				{{else}}
					<div data-view="Cart.PromocodeForm"></div>
				{{/if}}
			</div>
		</div>
	</div>
{{/if}}	

{{#if showItems}}
	<div class="order-wizard-cart-summary-accordion-head">
		<a class="order-wizard-cart-summary-accordion-head-toggle {{#unless showOpenedAccordion}}collapsed{{/unless}}" data-toggle="collapse" data-target="#checkout-products" aria-controls="checkout-products">
		{{#if itemCountGreaterThan1}}
			{{translate '$(0) Items' itemCount}}
		{{else}}
			{{translate '1 Item'}}
		{{/if}}
		
		<i class="order-wizard-cart-summary-accordion-toggle-icon"></i>
		</a>
	</div>
	<div class="order-wizard-cart-summary-accordion-body collapse {{#if showOpenedAccordion}}in{{/if}}" id="checkout-products" role="tabpanel">
		<div class="order-wizard-cart-summary-accordion-container" data-content="order-items-body">
		{{#if showEditCartButton}}
		<div class="order-wizard-cart-summary-edit-cart-label">
			<a href="#" class="order-wizard-cart-summary-edit-cart-link" data-touchpoint="viewcart">
				{{translate 'Edit Cart'}}
			</a>
		</div>
		{{/if}}
		<div class="order-wizard-cart-summary-products-scroll">
			<table class="lg2sm-first">
				<tbody data-view="Items.Collection"></tbody>
			</table>
		</div>
		</div>
	</div>
{{/if}}