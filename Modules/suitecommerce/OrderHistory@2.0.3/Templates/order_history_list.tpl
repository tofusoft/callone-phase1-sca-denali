{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBackToAccount}}
	<a href="/" class="order-history-list-button-back">
		<i class="order-history-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="order-history-list">
	<header class="order-history-list-header">
		<h2>{{pageHeader}}</h2>
	</header>

	<div data-view="ListHeader"></div>

	{{#if collectionLengthGreaterThan0}}
	<div class="order-history-list-recordviews-container">
		<table class="order-history-list-recordviews-actionable-table">
			<thead class="order-history-list-recordviews-actionable-header">
				<tr>
					<th class="order-history-list-recordviews-actionable-title-header">
						<span>{{translate 'Order No.'}}</span>
					</td>
					<th class="order-history-list-recordviews-actionable-date-header">
						<span>{{translate 'Date'}}</span>
					</th>
					<th class="order-history-list-recordviews-actionable-currency-header">
						<span>{{translate 'Amount'}}</span>
					</th>
					<th class="order-history-list-recordviews-actionable-status-header">
						<span>{{translate 'Status'}}</span>
					</th>
					<th class="order-history-list-recordviews-actionable-actions-header">
						<span>{{translate 'Track Items'}}</span>
					</th>
				</tr>
			</thead>
			<tbody class="order-history-list" data-view="Order.History.Results"></tbody>
		</table>
	</div>

	{{else}}
		{{#if isLoading}}
			<p class="order-history-list-empty">{{translate 'Loading...'}}</p>
		{{else}}
			<p class="order-history-list-empty">{{translate 'No order were found'}}</p>
		{{/if}}

	{{/if}}

	{{#if showPagination}}
		<div class="order-history-list-case-list-paginator">
			<div data-view="GlobalViews.Pagination"></div>
			{{#if showCurrentPage}}
				<div data-view="GlobalViews.ShowCurrentPage"></div>
			{{/if}}
		</div>
	{{/if}}
</section>