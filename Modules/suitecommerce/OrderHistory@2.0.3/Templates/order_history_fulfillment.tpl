{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<!-- fulfillment TITLE -->
<div class="order-history-fulfillment-header" data-id="{{model.internalid}}">
	<div class="order-history-fulfillment-header-container">
		<div class="order-history-fulfillment-header-col">
			<span class="order-history-fulfillment-shipped-date-label"> {{translate 'Shipped on: '}}</span> 
			<span class="order-history-fulfillment-shipped-date-value">{{translate '$(0)' model.date}}</span>
		</div>
		<div class="order-history-fulfillment-header-col">
			<span class="order-history-fulfillment-delivery-label">
				{{translate 'Delivery Method: '}}
			</span>
			<span class="order-history-fulfillment-delivery-value">
				{{#if showDeliveryMethod}}
					{{deliveryMethodName}}
				{{else}}
					{{translate 'No Delivery Method Selected'}}
				{{/if}}
			</span>
		</div>
		<div data-view="TrackingNumbers"></div>
	</div>
</div>
<!-- fulfillment LINES -->
<div class="order-history-fulfillment-body">
	<table class="order-history-fulfillment-items-table">
		<tbody data-view="Items.Collection">
		</tbody>
	</table>
</div>
<!-- fulfillment LINES ENDS -->