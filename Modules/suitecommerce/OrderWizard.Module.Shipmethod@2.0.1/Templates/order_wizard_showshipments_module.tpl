{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showShippingInformation}}
	<section class="order-wizard-showshipments-module-shipping-details">
		<div class="order-wizard-showshipments-module-shipping-details-body">
			<div class="order-wizard-showshipments-module-shipping-details-address">
				<h3 class="order-wizard-showshipments-module-shipping-title">
					{{translate 'Shipping Address'}}
				</h3>
				{{#if showShippingAddress}}
					<div data-view="Shipping.Address"></div>
					{{#if showEditButton}}
						<a data-action="edit-module" href="{{{editUrl}}}?force=true" class="order-wizard-showshipments-module-shipping-details-address-link">
							{{translate 'Back to edit shipping information'}}
						</a>
					{{/if}}
				{{else}}
					<a data-action="edit-module" href="{{{editUrl}}}?force=true" class="order-wizard-showshipments-module-shipping-details-address-link">
						{{translate 'Please select a valid shipping address'}}
					</a>
				{{/if}}
			</div>
			<div class="order-wizard-showshipments-module-shipping-details-method">
				<h3 class="order-wizard-showshipments-module-shipping-title">
					{{translate 'Shipping Method'}}
				</h3>
				{{#if showEditButton}}
					<select id="delivery-options" data-action="change-delivery-options" data-type="edit-module" class="order-wizard-showshipments-module-shipping-options" name="delivery-options">
						{{#unless showSelectedShipmethod}}
							<option>{{translate 'Please select a shipping method'}}</option>
						{{/unless}}
						{{#each shippingMethods}}
							<option value="{{internalid}}" {{#if isActive}}selected{{/if}} >
								{{rate_formatted}} - {{name}}
							</option>
						{{/each}}
					</select>
				{{else}}
					{{#if showSelectedShipmethod}}
						<div class="order-wizard-showshipments-module-shipping-details-method-info-card">
							<span class="order-wizard-showshipments-module-shipmethod-name">
								{{selectedShipmethod.name}}
							</span>
							:
							<span class="order-wizard-showshipments-module-shipmethod-rate">
								{{selectedShipmethod.rate_formatted}}
							</span>
						</div>
					{{/if}}
				{{/if}}
			</div>
		</div>
	</section>
{{/if}}

<section class="order-wizard-showshipments-module-cart-details">
	<div class="order-wizard-showshipments-module-cart-details-accordion-head">
		<a class="order-wizard-showshipments-module-cart-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#unfulfilled-items" aria-controls="unfulfilled-items">
		{{#if itemCountGreaterThan1}}
			{{translate '$(0) Items' itemCount}}
		{{else}}
			{{translate '1 Item'}}
		{{/if}}
		<i class="order-wizard-showshipments-module-cart-details-accordion-toggle-icon"></i>
		</a>
	</div>
	<div class="order-wizard-showshipments-module-cart-details-accordion-body collapse" id="unfulfilled-items" role="tabpanel">
		<div class="order-wizard-showshipments-module-accordion-container" data-content="order-items-body">
			{{#if showEditCartButton}}
				<a href="#" class="order-wizard-showshipments-module-edit-cart-link" data-action="edit-module" data-touchpoint="viewcart">
					{{translate 'Edit Cart'}}
				</a>
			{{/if}}

			<table class="order-wizard-showshipments-module-shipment-table">
				<thead class="order-wizard-showshipments-module-accordion-container-table-header" item-id="{{itemId}}" data-id="{{itemId}}">
					<th class="order-wizard-showshipments-module-accordion-container-table-header-image" name="item-image">
					</th>
					<th class="order-wizard-showshipments-module-accordion-container-table-header-details" name="item-details">
					</th>
					<th class="order-wizard-showshipments-module-accordion-container-table-header-quantity" name="item-quantity">
						{{translate 'Qty'}}
					</th>
					<th class="order-wizard-showshipments-module-accordion-container-table-header-totalprice" name="item-totalprice">
						{{translate 'Unit Price'}}
					</th>
					<th class="order-wizard-showshipments-module-accordion-container-table-header-amount" name="item-amount">
						{{translate 'Amount'}}
					</th>
				</thead>
				<tbody data-view="Items.Collection"></tbody>
			</table>
			
		</div>
	</div>
</section>