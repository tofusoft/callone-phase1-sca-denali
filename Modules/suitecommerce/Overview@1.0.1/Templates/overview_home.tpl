{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<section class="overview-home">
	<div class="overview-home-orders" data-permissions="transactions.tranFind.1,transactions.tranSalesOrd.1">
		<div class="overview-home-orders-title">
			<h3>{{translate 'Recent Orders'}}</h3>
			<a href="/ordershistory" class="overview-home-orders-title-link">{{translate 'View Order History'}}</a>
		</div>
		<div class="overview-home-order-history-results-container">
		{{#if collectionLengthGreaterThan0}}

			<table class="overview-home-orders-list-table">
				<thead class="overview-home-content-table">
					<tr class="overview-home-content-table-header-row">
						<th class="overview-home-content-table-header-row-title">
							<span>{{translate 'Number'}}</span>
						</th>
						<th class="overview-home-content-table-header-row-date">
							<span>{{translate 'Date'}}</span>
						</th>
						<th class="overview-home-content-table-header-row-currency">
							<span>{{translate 'Amount'}}</span>
						</th>
						<th class="overview-home-content-table-header-row-status">
							<span>{{translate 'Status'}}</span>
						</th>
						<th class="overview-home-content-table-header-row-track">
							<span>{{translate 'Track Items'}}</span>
						</th>
					</tr>
				</thead>
				<tbody data-view="Order.History.Results"></tbody>
			</table>
			
		{{else}}
			<p class="overview-home-orders-empty-list">{{translate 'No order were found'}}</p>
		{{/if}}
		</div>
	</div>
</section>
<section class="overview-home-mysettings">
	<h3>{{translate 'My Settings'}}</h3>
	<div class="overview-home-mysettings-row">
		<div class="overview-home-mysettings-profile">
			<div data-view="Overview.Profile"></div>
		</div>
		<div class="overview-home-mysettings-shipping">
			<div data-view="Overview.Shipping"></div>
		</div>
		<div class="overview-home-mysettings-payment">
			<div data-view="Overview.Payment"></div>
		</div>
	</div>
</section>
<div data-view="Overview.Banner"></div>

{{#if hasCustomerSupportURL}}
	<div class="overview-home-header-links">
		{{translate 'Need Help? Contact <a href="$(0)">Customer Service</a>' customerSupportURL}}
	</div>
{{/if}}